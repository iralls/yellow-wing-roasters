#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for the Black-capped Chickadee
from images/black-capped-chickadee.jpg (or assets/source-plates/black-capped-chickadee.jpg).

Outputs:
- Full-resolution master RGBA cutout: assets/source-plates/cutouts/black-capped-chickadee-transparent.png
- Web-optimized cutout: images/black-capped-chickadee-transparent.png
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/black-capped-chickadee.jpg"
FALLBACK_SOURCE = "assets/source-plates/black-capped-chickadee.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/black-capped-chickadee.jpg"
MASTER_OUT = "assets/source-plates/cutouts/black-capped-chickadee-transparent.png"
WEB_OUT = "images/black-capped-chickadee-transparent.png"

MAX_WEB_DIM = (800, 800)


def process_chickadee():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)

    # 1. Padded crop window around Black-capped Chickadee and perch branch
    # Original image is 2816 x 1536
    x1, y1, x2, y2 = 750, 220, 2250, 1240
    crop = arr[y1:y2, x1:x2]
    ch, cw, _ = crop.shape

    # 2. Fit 2D quadratic background paper surface to outer clean margins
    bg_sample_mask = np.zeros((ch, cw), dtype=bool)
    bg_sample_mask[:40, :] = True
    bg_sample_mask[-40:, :] = True
    bg_sample_mask[:, :40] = True
    bg_sample_mask[:, -40:] = True

    sample_vals = crop[bg_sample_mask]
    y_coords, x_coords = np.mgrid[0:ch, 0:cw]
    xs = (x_coords[bg_sample_mask] - cw / 2) / (cw / 2)
    ys = (y_coords[bg_sample_mask] - ch / 2) / (ch / 2)
    A = np.column_stack([np.ones_like(xs), xs, ys, xs**2, ys**2, xs * ys])

    x_all = (x_coords - cw / 2) / (cw / 2)
    y_all = (y_coords - ch / 2) / (ch / 2)
    all_A = np.column_stack([
        np.ones(ch * cw),
        x_all.ravel(),
        y_all.ravel(),
        (x_all**2).ravel(),
        (y_all**2).ravel(),
        (x_all * y_all).ravel(),
    ])

    bg_surface = np.zeros_like(crop)
    for c in range(3):
        coeffs, _, _, _ = np.linalg.lstsq(A, sample_vals[:, c], rcond=None)
        bg_surface[:, :, c] = (all_A @ coeffs).reshape(ch, cw)

    diff = np.sqrt(np.sum((crop - bg_surface) ** 2, axis=2))

    # 3. Compute edge gradient magnitude
    gray = crop.mean(axis=2)
    gx = np.zeros_like(gray)
    gy = np.zeros_like(gray)
    gx[:, 1:-1] = (gray[:, 2:] - gray[:, :-2]) / 2.0
    gy[1:-1, :] = (gray[2:, :] - gray[:-2, :]) / 2.0
    grad = np.sqrt(gx**2 + gy**2)

    # 4. Construct exterior barrier with closed front contour for breast
    barrier = (diff > 16) | (grad > 8)
    breast_patch = barrier[200:550, 200:600].copy()
    closed_breast = np.array(Image.fromarray(breast_patch.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
    barrier[200:550, 200:600] = closed_breast

    # 5. Flood fill from image boundaries
    visited = np.zeros((ch, cw), dtype=bool)
    q = deque()
    for r in [0, ch - 1]:
        for c in range(cw):
            if not barrier[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))
    for c in [0, cw - 1]:
        for r in range(ch):
            if not barrier[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))

    # Seed inside the enclosed interior loop between the legs and branch
    pocket_seed = (637, 722)
    if not barrier[pocket_seed] and not visited[pocket_seed]:
        visited[pocket_seed] = True
        q.append(pocket_seed)

    while q:
        r, c = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < ch and 0 <= nc < cw and not barrier[nr, nc] and not visited[nr, nc]:
                visited[nr, nc] = True
                q.append((nr, nc))

    fg_raw = ~visited

    # 6. Extract primary connected component (> 5000 px) to eliminate background paper noise
    visited_fg = np.zeros_like(fg_raw, dtype=bool)
    primary_mask = np.zeros_like(fg_raw, dtype=bool)

    for r in range(ch):
        for c in range(cw):
            if fg_raw[r, c] and not visited_fg[r, c]:
                visited_fg[r, c] = True
                comp = [(r, c)]
                q_comp = [(r, c)]
                while q_comp:
                    curr_r, curr_c = q_comp.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < ch and 0 <= nc < cw and fg_raw[nr, nc] and not visited_fg[nr, nc]:
                            visited_fg[nr, nc] = True
                            q_comp.append((nr, nc))
                            comp.append((nr, nc))
                if len(comp) > 5000:
                    for pr, pc in comp:
                        primary_mask[pr, pc] = True

    # 7. Boundary anti-aliasing via 1.0px Gaussian blur on silhouette
    mask_im = Image.fromarray((primary_mask.astype(np.uint8) * 255)).convert("L")
    mask_blurred = mask_im.filter(ImageFilter.GaussianBlur(1.0))
    alpha_arr = np.array(mask_blurred, dtype=float)
    alpha_arr[alpha_arr < 1.5] = 0.0

    # 8. De-fringe semi-transparent edge pixels against paper color
    alpha_norm = alpha_arr / 255.0
    transparent_arr = np.zeros((ch, cw, 4), dtype=float)

    for c in range(3):
        bg_c = bg_surface[:, :, c]
        unblended = (crop[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)

    transparent_arr[:, :, 3] = alpha_arr

    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    bbox = out_img.getbbox()
    master_cutout = out_img.crop(bbox)

    # 9. Save master full-resolution cutout
    os.makedirs(os.path.dirname(MASTER_OUT), exist_ok=True)
    master_cutout.save(MASTER_OUT, format="PNG")
    master_size_kb = os.path.getsize(MASTER_OUT) / 1024
    print(f"✓ Saved master full-resolution cutout: {MASTER_OUT} ({master_cutout.size[0]}x{master_cutout.size[1]}, {master_size_kb:.1f} KB)")

    # Ensure source plate copy is saved in assets/source-plates/
    if os.path.exists(SOURCE_FILE) and not os.path.exists(SOURCE_PLATE_COPY):
        os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
        im.save(SOURCE_PLATE_COPY, quality=95)
        print(f"✓ Saved source plate copy: {SOURCE_PLATE_COPY}")

    # 10. Create and save web-optimized version (max 800x800, 256 colors FASTOCTREE)
    web_im = master_cutout.copy()
    web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

    os.makedirs(os.path.dirname(WEB_OUT), exist_ok=True)
    web_quant.save(WEB_OUT, format="PNG", optimize=True)
    web_size_kb = os.path.getsize(WEB_OUT) / 1024
    print(f"✓ Saved web-optimized cutout: {WEB_OUT} ({web_im.size[0]}x{web_im.size[1]}, {web_size_kb:.1f} KB)")


if __name__ == "__main__":
    process_chickadee()
