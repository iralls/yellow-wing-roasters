#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for the bird-on-spit illustration
from images/bird-on-spit.jpg (or assets/source-plates/bird-on-spit.jpg).

Outputs:
- Full-resolution master RGBA cutout: assets/source-plates/cutouts/bird-on-spit-transparent.png
- Web-optimized cutout: images/bird-on-spit-transparent.png
- Audubon aliases: assets/source-plates/cutouts/audubon-bird-on-spit-transparent.png and images/audubon-bird-on-spit-transparent.png
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/bird-on-spit.jpg"
FALLBACK_SOURCE = "assets/source-plates/bird-on-spit.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/bird-on-spit.jpg"

MASTER_CLEAN = "assets/source-plates/cutouts/bird-on-spit-transparent.png"
WEB_CLEAN = "images/bird-on-spit-transparent.png"

MASTER_AUDUBON = "assets/source-plates/cutouts/audubon-bird-on-spit-transparent.png"
WEB_AUDUBON = "images/audubon-bird-on-spit-transparent.png"

MAX_WEB_DIM = (800, 800)


def process_bird_on_spit():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape

    # 1. Padded crop window around rotisserie apparatus
    # Original is 2816 x 1536; exclude plate title and text / auxiliary engravings at bottom
    x1, y1, x2, y2 = 280, 160, 2580, 1170
    crop = arr[y1:y2, x1:x2]
    ch, cw, _ = crop.shape

    # 2. Fit 2D quadratic background paper surface to surrounding clean margins
    mask_cand = np.zeros((h, w), dtype=bool)
    mask_cand[20:60, 100:2700] = True
    mask_cand[100:1100, 40:240] = True
    mask_cand[100:1100, 2600:2780] = True
    mask_cand[1480:1520, 100:2700] = True
    mask_bg = mask_cand & (arr.mean(axis=2) > 220)

    sample_vals = arr[mask_bg]
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    xs = (x_coords[mask_bg] - w / 2) / (w / 2)
    ys = (y_coords[mask_bg] - h / 2) / (h / 2)
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
    bg_surf = np.zeros_like(arr)
    for c in range(3):
        coeffs, _, _, _ = np.linalg.lstsq(A, sample_vals[:, c], rcond=None)
        bg_surf[:, :, c] = (all_A @ coeffs).reshape(h, w)

    diff = np.sqrt(np.sum((arr - bg_surf) ** 2, axis=2))
    crop_diff = diff[y1:y2, x1:x2]
    barrier = crop_diff > 20.0

    # 3. Connected component analysis to find primary apparatus outline
    visited = np.zeros_like(barrier, dtype=bool)
    components = []
    for r in range(ch):
        for c in range(cw):
            if barrier[r, c] and not visited[r, c]:
                visited[r, c] = True
                comp = [(r, c)]
                q = [(r, c)]
                while q:
                    curr_r, curr_c = q.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < ch and 0 <= nc < cw and barrier[nr, nc] and not visited[nr, nc]:
                            visited[nr, nc] = True
                            q.append((nr, nc))
                            comp.append((nr, nc))
                components.append(comp)

    components.sort(key=len, reverse=True)
    primary = np.zeros_like(barrier, dtype=bool)
    for r, c in components[0]:
        primary[r, c] = True

    # 4. Invert primary barrier and flood fill outer margins and interior trapped pockets
    inv = ~primary
    visited_inv = np.zeros_like(inv, dtype=bool)
    q_inv = deque()

    # Outer perimeter
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

    # Seed points inside trapped paper background pockets:
    seeds = [
        # Area between left post and chicken
        (610 - y1, 680 - x1),
        # Area between right post and chicken
        (610 - y1, 2100 - x1),
        # Area near crank handle
        (650 - y1, 2400 - x1),
        # Left clamp upper pocket (above spit rod)
        (415 - y1, 940 - x1),
        # Left clamp lower pocket (below spit rod)
        (510 - y1, 955 - x1),
        # Right clamp upper pocket (above spit rod)
        (370 - y1, 1850 - x1),
        # Right clamp lower pockets (below spit rod)
        (520 - y1, 1840 - x1),
        (520 - y1, 1920 - x1),
    ]

    for sr, sc in seeds:
        if 0 <= sr < ch and 0 <= sc < cw and inv[sr, sc] and not visited_inv[sr, sc]:
            visited_inv[sr, sc] = True
            q_inv.append((sr, sc))

    while q_inv:
        r, c = q_inv.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < ch and 0 <= nc < cw and inv[nr, nc] and not visited_inv[nr, nc]:
                visited_inv[nr, nc] = True
                q_inv.append((nr, nc))

    solid_rig = ~visited_inv

    # 5. Anti-aliasing via 1.0px Gaussian blur on silhouette alpha
    crop_bg = bg_surf[y1:y2, x1:x2]
    mask_im = Image.fromarray((solid_rig.astype(np.uint8) * 255)).filter(ImageFilter.GaussianBlur(1.0))
    alpha_arr = np.array(mask_im, dtype=float)
    alpha_arr[alpha_arr < 1.5] = 0.0
    alpha_norm = alpha_arr / 255.0

    # 6. De-fringe semi-transparent edge pixels against fitted paper background
    transparent_arr = np.zeros((ch, cw, 4), dtype=float)
    for c in range(3):
        bg_c = crop_bg[:, :, c]
        unblended = (crop[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
    transparent_arr[:, :, 3] = alpha_arr

    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    bbox = out_img.getbbox()
    master = out_img.crop(bbox)

    def save_outputs(master_img, master_path, web_path, label):
        os.makedirs(os.path.dirname(master_path), exist_ok=True)
        master_img.save(master_path, format="PNG")
        master_kb = os.path.getsize(master_path) / 1024
        print(f"✓ Saved {label} master: {master_path} ({master_img.size[0]}x{master_img.size[1]}, {master_kb:.1f} KB)")

        web_im = master_img.copy()
        web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
        web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
        os.makedirs(os.path.dirname(web_path), exist_ok=True)
        web_quant.save(web_path, format="PNG", optimize=True)
        web_kb = os.path.getsize(web_path) / 1024
        print(f"✓ Saved {label} web: {web_path} ({web_im.size[0]}x{web_im.size[1]}, {web_kb:.1f} KB)")

    # Ensure source plate archival copy exists
    if os.path.exists(SOURCE_FILE) and not os.path.exists(SOURCE_PLATE_COPY):
        os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
        im.save(SOURCE_PLATE_COPY, quality=95)
        print(f"✓ Saved source plate copy: {SOURCE_PLATE_COPY}")

    save_outputs(master, MASTER_CLEAN, WEB_CLEAN, "bird-on-spit")
    save_outputs(master, MASTER_AUDUBON, WEB_AUDUBON, "audubon-bird-on-spit alias")


if __name__ == "__main__":
    process_bird_on_spit()
