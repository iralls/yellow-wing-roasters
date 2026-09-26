#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for the Belted Kingfisher
from images/kingfisher.jpg (or assets/source-plates/belted-kingfisher.jpg).

Outputs:
- Full-resolution master RGBA cutout: assets/source-plates/cutouts/audubon-kingfisher-transparent.png
- Web-optimized cutout: images/audubon-kingfisher-transparent.png
- Web-optimized cutout (direct alias): images/kingfisher-transparent.png
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/kingfisher.jpg"
FALLBACK_SOURCE = "assets/source-plates/belted-kingfisher.jpg"
MASTER_OUT = "assets/source-plates/cutouts/audubon-kingfisher-transparent.png"
WEB_OUT_AUDUBON = "images/audubon-kingfisher-transparent.png"
WEB_OUT_DIRECT = "images/kingfisher-transparent.png"

MAX_WEB_DIM = (800, 800)


def process_kingfisher():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)

    # 1. Padded crop window around the Belted Kingfisher + perch branch
    # Original image is 2816 x 1536
    x1, y1, x2, y2 = 450, 60, 2080, 1420
    crop = arr[y1:y2, x1:x2]
    ch, cw, _ = crop.shape

    # 2. Fit 2D quadratic background paper surface to outer clean margins
    bg_sample_mask = np.zeros((ch, cw), dtype=bool)
    bg_sample_mask[:40, :] = True
    bg_sample_mask[:, :40] = True
    bg_sample_mask[:, -40:] = True
    bg_sample_mask[-40:, :200] = True
    bg_sample_mask[-40:, -200:] = True
    bg_sample_mask[:150, :300] = True
    bg_sample_mask[:150, -300:] = True

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

    # 4. Construct exterior barrier with closed front contour
    barrier = (diff > 14) | (grad > 8)
    barrier_closed = barrier.copy()
    front_sub = Image.fromarray(barrier[400:850, 1050:1350].astype(np.uint8) * 255)
    front_sub_closed = np.array(front_sub.filter(ImageFilter.MaxFilter(3))) > 0
    barrier_closed[400:850, 1050:1350] = front_sub_closed

    # 5. Flood fill from image boundaries
    visited = np.zeros((ch, cw), dtype=bool)
    q = deque()
    for r in [0, ch - 1]:
        for c in range(cw):
            if not barrier_closed[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))
    for c in [0, cw - 1]:
        for r in range(ch):
            if not barrier_closed[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))

    while q:
        r, c = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < ch and 0 <= nc < cw and not barrier_closed[nr, nc] and not visited[nr, nc]:
                visited[nr, nc] = True
                q.append((nr, nc))

    fg_raw = ~visited

    # 6. Extract primary connected component (> 10000 px) to eliminate background paper noise
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
                if len(comp) > 10000:
                    for pr, pc in comp:
                        primary_mask[pr, pc] = True

    # 7. Fill any interior pinholes within the subject
    inv = ~primary_mask
    visited_inv = np.zeros_like(inv, dtype=bool)
    q_inv = deque()
    for r in [0, ch - 1]:
        for c in range(cw):
            if inv[r, c] and not visited_inv[r, c]:
                visited_inv[r, c] = True
                q_inv.append((r, c))
    for c in [0, cw - 1]:
        for r in range(ch):
            if inv[r, c] and not visited_inv[r, c]:
                visited_inv[r, c] = True
                q_inv.append((r, c))
    while q_inv:
        r, c = q_inv.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < ch and 0 <= nc < cw and inv[nr, nc] and not visited_inv[nr, nc]:
                visited_inv[nr, nc] = True
                q_inv.append((nr, nc))

    solid_bird = ~visited_inv

    # 8. Boundary anti-aliasing via 1.0px Gaussian blur on silhouette
    mask_im = Image.fromarray((solid_bird.astype(np.uint8) * 255)).convert("L")
    mask_blurred = mask_im.filter(ImageFilter.GaussianBlur(1.0))
    alpha_arr = np.array(mask_blurred, dtype=float)
    alpha_arr[alpha_arr < 1.5] = 0.0

    # 9. De-fringe semi-transparent edge pixels against paper color
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

    # 10. Save master cutout
    os.makedirs(os.path.dirname(MASTER_OUT), exist_ok=True)
    master_cutout.save(MASTER_OUT, format="PNG")
    master_size_kb = os.path.getsize(MASTER_OUT) / 1024
    print(f"✓ Saved master full-resolution cutout: {MASTER_OUT} ({master_cutout.size[0]}x{master_cutout.size[1]}, {master_size_kb:.1f} KB)")

    # 11. Create and save web-optimized versions (max 800x800, 256 colors FASTOCTREE)
    web_im = master_cutout.copy()
    web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

    for target_path in [WEB_OUT_AUDUBON, WEB_OUT_DIRECT]:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        web_quant.save(target_path, format="PNG", optimize=True)
        web_size_kb = os.path.getsize(target_path) / 1024
        print(f"✓ Saved web-optimized cutout: {target_path} ({web_im.size[0]}x{web_im.size[1]}, {web_size_kb:.1f} KB)")


if __name__ == "__main__":
    process_kingfisher()
