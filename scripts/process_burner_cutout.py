#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for the Bunsen Burner
from images/burner.jpg (or assets/source-plates/burner.jpg).

Outputs:
- Full-resolution master RGBA cutout (clean base): assets/source-plates/cutouts/burner-transparent.png
- Web-optimized cutout (clean base): images/burner-transparent.png
- Master RGBA cutout (with table shadow): assets/source-plates/cutouts/burner-with-shadow-transparent.png
- Web-optimized cutout (with table shadow): images/burner-with-shadow-transparent.png
- Archival copy of source plate: assets/source-plates/burner.jpg
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/burner.jpg"
FALLBACK_SOURCE = "assets/source-plates/burner.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/burner.jpg"

MASTER_CLEAN = "assets/source-plates/cutouts/burner-transparent.png"
MASTER_CLEAN_AUDUBON = "assets/source-plates/cutouts/audubon-burner-transparent.png"
WEB_CLEAN = "images/burner-transparent.png"
WEB_CLEAN_AUDUBON = "images/audubon-burner-transparent.png"

MASTER_SHADOW = "assets/source-plates/cutouts/burner-with-shadow-transparent.png"
WEB_SHADOW = "images/burner-with-shadow-transparent.png"

MAX_WEB_DIM = (800, 800)


def process_burner():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape

    # 1. Padded crop window around Bunsen burner apparatus
    # Original is 2816 x 1536; exclude plate title and Lizars engraver imprint at bottom
    x1, y1, x2, y2 = 1050, 35, 1820, 1295
    crop = arr[y1:y2, x1:x2]
    ch, cw, _ = crop.shape

    # 2. Fit 2D quadratic background paper surface to surrounding clean margins
    surround_mask = np.zeros((h, w), dtype=bool)
    surround_mask[10:40, 800:2050] = True
    surround_mask[1295:1325, 800:2050] = True
    surround_mask[40:1295, 750:1000] = True
    surround_mask[40:1295, 1850:2100] = True

    sample_vals = arr[surround_mask]
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    xs = (x_coords[surround_mask] - 1425) / 500
    ys = (y_coords[surround_mask] - 670) / 600
    A = np.column_stack([np.ones_like(xs), xs, ys, xs**2, ys**2, xs * ys])

    x_all = (x_coords - 1425) / 500
    y_all = (y_coords - 670) / 600
    all_A = np.column_stack([
        np.ones(h * w),
        x_all.ravel(),
        y_all.ravel(),
        (x_all**2).ravel(),
        (y_all**2).ravel(),
        (x_all * y_all).ravel(),
    ])

    bg_surface = np.zeros_like(arr)
    for c in range(3):
        coeffs, _, _, _ = np.linalg.lstsq(A, sample_vals[:, c], rcond=None)
        bg_surface[:, :, c] = (all_A @ coeffs).reshape(h, w)

    crop_bg = bg_surface[y1:y2, x1:x2]
    diff = np.sqrt(np.sum((crop - crop_bg) ** 2, axis=2))

    # 3. Construct exterior barrier
    barrier = diff > 16.0

    # In the flame region (crop row < 440), close small stippling gaps in the outer outline
    flame_part = Image.fromarray((barrier[:440, :].astype(np.uint8) * 255))
    flame_closed = flame_part.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    arr_closed = barrier.copy()
    arr_closed[:440, :] = np.array(flame_closed) > 128

    # 4. Extract primary connected component (> 10000 px) to eliminate background paper noise
    visited = np.zeros_like(arr_closed, dtype=bool)
    components = []
    for r in range(ch):
        for c in range(cw):
            if arr_closed[r, c] and not visited[r, c]:
                visited[r, c] = True
                comp = [(r, c)]
                q = [(r, c)]
                while q:
                    curr_r, curr_c = q.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < ch and 0 <= nc < cw and arr_closed[nr, nc] and not visited[nr, nc]:
                            visited[nr, nc] = True
                            q.append((nr, nc))
                            comp.append((nr, nc))
                components.append(comp)

    components.sort(key=len, reverse=True)
    primary = np.zeros_like(arr_closed, dtype=bool)
    for r, c in components[0]:
        primary[r, c] = True

    # 5. Fill interior pinholes within the subject (flame core, highlights, metal interior)
    inv = ~primary
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

    solid_full = ~visited_inv

    # 6. Generate clean base mask by removing table drop-shadow hatch lines
    solid_clean = solid_full.copy()
    rim_y = {}
    for orig_x in range(1114, 1693):
        col = arr[1140:1295, orig_x].mean(axis=1)
        dark_idx = np.where(col < 80)[0]
        if len(dark_idx) > 0:
            rim_y[orig_x] = 1140 + dark_idx[-1] + 1
        else:
            y_fit = 1160.0 + 126.0 * np.sqrt(max(0, 1 - ((orig_x - 1404.0) / 288.0) ** 2))
            rim_y[orig_x] = int(y_fit) + 1

    # Clip shadow to the right of plinth (x > 1692, y >= 1040)
    for orig_x in range(1693, x2):
        col_c = orig_x - x1
        for orig_y in range(1040, y2):
            row_c = orig_y - y1
            if 0 <= row_c < ch and 0 <= col_c < cw:
                solid_clean[row_c, col_c] = False

    # Clip below bottom rim
    for orig_x in range(1114, 1693):
        col_c = orig_x - x1
        cut_y = rim_y[orig_x]
        for orig_y in range(cut_y, y2):
            row_c = orig_y - y1
            if 0 <= row_c < ch and 0 <= col_c < cw:
                solid_clean[row_c, col_c] = False

    # Clip left of plinth (x < 1114, y >= 1040)
    for orig_x in range(x1, 1114):
        col_c = orig_x - x1
        for orig_y in range(1040, y2):
            row_c = orig_y - y1
            if 0 <= row_c < ch and 0 <= col_c < cw:
                solid_clean[row_c, col_c] = False

    def finalize_and_save(mask, master_path, web_path, label):
        # Boundary anti-aliasing via 1.0px Gaussian blur on silhouette
        mask_im = Image.fromarray((mask.astype(np.uint8) * 255)).filter(ImageFilter.GaussianBlur(1.0))
        alpha_arr = np.array(mask_im, dtype=float)
        alpha_arr[alpha_arr < 1.5] = 0.0

        # De-fringe semi-transparent edge pixels against fitted paper background
        alpha_norm = alpha_arr / 255.0
        transparent_arr = np.zeros((ch, cw, 4), dtype=float)
        for c in range(3):
            bg_c = crop_bg[:, :, c]
            unblended = (crop[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
            transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
        transparent_arr[:, :, 3] = alpha_arr

        out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
        bbox = out_img.getbbox()
        master = out_img.crop(bbox)

        os.makedirs(os.path.dirname(master_path), exist_ok=True)
        master.save(master_path, format="PNG")
        master_kb = os.path.getsize(master_path) / 1024
        print(f"✓ Saved {label} master: {master_path} ({master.size[0]}x{master.size[1]}, {master_kb:.1f} KB)")

        web_im = master.copy()
        web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
        web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
        os.makedirs(os.path.dirname(web_path), exist_ok=True)
        web_quant.save(web_path, format="PNG", optimize=True)
        web_kb = os.path.getsize(web_path) / 1024
        print(f"✓ Saved {label} web: {web_path} ({web_im.size[0]}x{web_im.size[1]}, {web_kb:.1f} KB)")

    # Ensure archival copy of source plate exists in assets/source-plates/
    if os.path.exists(SOURCE_FILE) and not os.path.exists(SOURCE_PLATE_COPY):
        os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
        im.save(SOURCE_PLATE_COPY, quality=95)
        print(f"✓ Saved source plate copy: {SOURCE_PLATE_COPY}")

    finalize_and_save(solid_clean, MASTER_CLEAN, WEB_CLEAN, "clean base")
    finalize_and_save(solid_clean, MASTER_CLEAN_AUDUBON, WEB_CLEAN_AUDUBON, "clean base (audubon alias)")
    finalize_and_save(solid_full, MASTER_SHADOW, WEB_SHADOW, "with shadow")


if __name__ == "__main__":
    process_burner()
