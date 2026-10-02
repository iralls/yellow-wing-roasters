#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutout for binocular-birds
from images/binocular-birds.jpg.

Outputs:
- Full-resolution master RGBA cutout: assets/source-plates/cutouts/binocular-birds-transparent.png
- High-quality cutout in images/: images/binocular-birds-transparent.png
- Archival copy of source plate: assets/source-plates/binocular-birds.jpg
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/binocular-birds.jpg"
FALLBACK_SOURCE = "assets/source-plates/binocular-birds.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/binocular-birds.jpg"

MASTER_CUTOUT = "assets/source-plates/cutouts/binocular-birds-transparent.png"
MASTER_BYOB = "assets/source-plates/cutouts/audubon-byob-transparent.png"
WEB_CUTOUT = "images/binocular-birds-transparent.png"
WEB_BYOB = "images/audubon-byob-transparent.png"
WEB_BINOCULAR = "images/binocular-birds.png"


def process_binocular_birds():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape

    # 1. Padded crop window around binoculars
    # Original is 2752 x 1536; exclude bottom text (rows >= 1400)
    x1, y1, x2, y2 = 210, 140, 2545, 1355
    crop = arr[y1:y2, x1:x2]
    ch, cw, _ = crop.shape

    # 2. Fit 2D quadratic background paper surface to surrounding clean margins
    surround_mask = np.zeros((h, w), dtype=bool)
    surround_mask[10:130, 50:2700] = True
    surround_mask[1355:1390, 50:2700] = True
    surround_mask[130:1355, 10:190] = True
    surround_mask[130:1355, 2560:2740] = True

    sample_vals = arr[surround_mask]
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    xs = (x_coords[surround_mask] - w / 2) / (w / 2)
    ys = (y_coords[surround_mask] - h / 2) / (h / 2)
    A = np.column_stack([np.ones_like(xs), xs, ys, xs**2, ys**2, xs * ys])

    x_all = (x_coords - w / 2) / (w / 2)
    y_all = (y_coords - h / 2) / (h / 2)
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
    barrier = diff > 18.0
    inv = ~barrier

    # 4. Flood fill from borders to identify exterior background
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

    solid = ~visited_inv

    # 5. Extract main connected component to eliminate minor background dust/paper fiber specks
    # Seed at the center of the left lens (in crop coordinates)
    seed_r, seed_c = 750 - y1, 775 - x1
    main_solid = np.zeros_like(solid, dtype=bool)
    main_solid[seed_r, seed_c] = True
    q_solid = deque([(seed_r, seed_c)])

    while q_solid:
        r, c = q_solid.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < ch and 0 <= nc < cw and solid[nr, nc] and not main_solid[nr, nc]:
                main_solid[nr, nc] = True
                q_solid.append((nr, nc))

    # 6. Boundary anti-aliasing via 0.8px Gaussian blur on silhouette
    mask_im = Image.fromarray((main_solid.astype(np.uint8) * 255)).filter(
        ImageFilter.GaussianBlur(0.8)
    )
    alpha_arr = np.array(mask_im, dtype=float)
    alpha_arr[alpha_arr < 1.5] = 0.0

    # 7. De-fringe semi-transparent edge pixels against fitted paper background
    alpha_norm = alpha_arr / 255.0
    transparent_arr = np.zeros((ch, cw, 4), dtype=float)
    for c in range(3):
        bg_c = crop_bg[:, :, c]
        unblended = (crop[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(
            alpha_norm, 0.001
        )
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
    transparent_arr[:, :, 3] = alpha_arr

    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    bbox = out_img.getbbox()
    master = out_img.crop(bbox)

    # 8. Save cutouts
    for p in [MASTER_CUTOUT, MASTER_BYOB]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        master.save(p, format="PNG")
        kb = os.path.getsize(p) / 1024
        print(f"✓ Saved cutout: {p} ({master.size[0]}x{master.size[1]}, {kb:.1f} KB)")

    # 9. Web-optimized cutouts
    MAX_WEB_DIM = (800, 800)
    web_im = master.copy()
    web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

    for p in [WEB_CUTOUT, WEB_BYOB, WEB_BINOCULAR]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        web_quant.save(p, format="PNG", optimize=True)
        kb = os.path.getsize(p) / 1024
        print(f"✓ Saved web cutout: {p} ({web_im.size[0]}x{web_im.size[1]}, {kb:.1f} KB)")

    # Archival copy of source plate
    if os.path.exists(SOURCE_FILE) and not os.path.exists(SOURCE_PLATE_COPY):
        os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
        im.save(SOURCE_PLATE_COPY, quality=95)
        print(f"✓ Saved source plate copy: {SOURCE_PLATE_COPY}")


if __name__ == "__main__":
    process_binocular_birds()
