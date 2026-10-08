#!/usr/bin/env python3
"""
Canonical Audubon Plate Cutout Extraction Script.
Reference implementation for Yellow Wing Roasters image processing.

Pipeline:
1. 2D quadratic background surface fitting to margin paper
2. ROI filtering (excludes plate text, numbers, and marginalia)
3. Subject plumage / core protection via flood-fill
4. Fine linework (twigs, wires) preservation ramp
5. Continuous watercolor wash alpha ramp & Gaussian smoothing
6. Color de-fringing (unblending background paper from foreground)
7. Bounding box auto-crop
8. Dual export: Full-res RGBA master + 800x800 FastOctree web PNG
"""

import os
import sys
import argparse
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

MAX_WEB_DIM = (800, 800)


def extract_cutout(
    source_path,
    output_name,
    roi_top=0.05,
    roi_bottom=0.96,
    roi_left=0.05,
    roi_right=0.95,
    fill_plumage=True,
    plumage_box=None,
    wash_low=10.0,
    wash_high=28.0,
):
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Source file not found: {source_path}")

    print(f"Loading {source_path}...")
    im = Image.open(source_path).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape
    gray = arr.mean(axis=2)

    # 1. Fit 2D polynomial surface to outer paper margins
    margin_pts = []
    # Sample outer borders
    step_y = max(20, h // 50)
    step_x = max(20, w // 50)
    for y in range(0, int(h * 0.15), step_y):
        for x in range(0, w, step_x):
            margin_pts.append((y, x))
    for y in range(int(h * 0.85), h, step_y):
        for x in range(0, w, step_x):
            margin_pts.append((y, x))
    for y in range(0, h, step_y):
        for x in range(0, int(w * 0.1), step_x):
            margin_pts.append((y, x))
        for x in range(int(w * 0.9), w, step_x):
            margin_pts.append((y, x))

    margin_pts = np.array(margin_pts)
    vals = np.array([arr[y, x] for (y, x) in margin_pts])
    clean = vals.mean(axis=1) > 220
    pts, vals = margin_pts[clean], vals[clean]

    y_c, x_c = pts[:, 0], pts[:, 1]
    xs = (x_c - w / 2) / (w / 2)
    ys = (y_c - h / 2) / (h / 2)
    A = np.column_stack([np.ones_like(xs), xs, ys, xs**2, ys**2, xs * ys])

    grid_y, grid_x = np.mgrid[0:h, 0:w]
    g_xs = (grid_x - w / 2) / (w / 2)
    g_ys = (grid_y - h / 2) / (h / 2)
    all_A = np.column_stack([
        np.ones(h * w),
        g_xs.ravel(),
        g_ys.ravel(),
        (g_xs**2).ravel(),
        (g_ys**2).ravel(),
        (g_xs * g_ys).ravel(),
    ])

    bg_surf = np.zeros_like(arr)
    for c in range(3):
        coeffs, _, _, _ = np.linalg.lstsq(A, vals[:, c], rcond=None)
        bg_surf[:, :, c] = (all_A @ coeffs).reshape(h, w)

    diff = np.sqrt(np.sum((arr - bg_surf) ** 2, axis=2))

    # 2. Region of interest (excludes text / borders)
    roi = np.zeros((h, w), dtype=bool)
    r_top, r_bottom = int(h * roi_top), int(h * roi_bottom)
    r_left, r_right = int(w * roi_left), int(w * roi_right)
    roi[r_top:r_bottom, r_left:r_right] = True

    # 3. Structural ink strokes
    is_ink = (gray < 195) & roi

    # 4. Watercolor wash core & envelope
    diff_u8 = np.clip(diff, 0, 255).astype(np.uint8)
    diff_blur = np.array(Image.fromarray(diff_u8, mode="L").filter(ImageFilter.GaussianBlur(3.0)), dtype=float)
    core_wash = (diff_blur > 20.0) & roi
    combined_seed = core_wash | is_ink

    # Find connected components containing the subject
    visited = np.zeros((h, w), dtype=bool)
    seed_r, seed_c = h // 2, w // 2
    if not combined_seed[seed_r, seed_c]:
        # Locate strongest ink coordinate near center
        coords = np.argwhere(is_ink)
        if len(coords) > 0:
            center_dists = np.sum((coords - [seed_r, seed_c]) ** 2, axis=1)
            seed_r, seed_c = coords[np.argmin(center_dists)]

    q = deque([(seed_r, seed_c)])
    visited[seed_r, seed_c] = True
    while q:
        r, c = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < h and 0 <= nc < w and roi[nr, nc] and combined_seed[nr, nc] and not visited[nr, nc]:
                visited[nr, nc] = True
                q.append((nr, nc))

    env_im = Image.fromarray((visited.astype(np.uint8) * 255)).filter(
        ImageFilter.MaxFilter(11)
    ).filter(ImageFilter.GaussianBlur(2.0))
    envelope = (np.array(env_im) > 10) & roi

    # 5. Continuous alpha ramp
    alpha = np.clip((diff - wash_low) / (wash_high - wash_low), 0.0, 1.0) * 255.0
    alpha[~envelope] = 0.0
    alpha[is_ink & envelope] = 255.0

    # 6. Solid interior protection (plumage hole-filling)
    if fill_plumage:
        p_box = np.zeros((h, w), dtype=bool)
        if plumage_box:
            p_box[plumage_box[1]:plumage_box[3], plumage_box[0]:plumage_box[2]] = True
        else:
            p_box[r_top:r_bottom, r_left:r_right] = True

        body_outline = (gray < 190) & p_box
        body_closed = np.array(Image.fromarray((body_outline.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))) > 0
        body_ext = np.zeros((h, w), dtype=bool)
        q_ext = deque()
        # Flood fill outside the outline
        for r in [r_top, r_bottom - 1]:
            for c in range(r_left, r_right):
                if not body_closed[r, c] and not body_ext[r, c]:
                    body_ext[r, c] = True
                    q_ext.append((r, c))
        while q_ext:
            r, c = q_ext.popleft()
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if r_top <= nr < r_bottom and r_left <= nc < r_right and not body_closed[nr, nc] and not body_ext[nr, nc]:
                    body_ext[nr, nc] = True
                    q_ext.append((nr, nc))
        body_solid = envelope & p_box & ~body_ext
        alpha[body_solid] = 255.0
        alpha[~envelope] = 0.0

    # 7. Edge smoothing & unblending
    alpha_im = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    alpha_smooth = np.array(alpha_im, dtype=float)
    alpha_smooth[alpha_smooth < 2.0] = 0.0

    alpha_norm = alpha_smooth / 255.0
    transparent_arr = np.zeros((h, w, 4), dtype=float)
    for c in range(3):
        bg_c = bg_surf[:, :, c]
        unblended = (arr[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
    transparent_arr[:, :, 3] = alpha_smooth

    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    bbox = out_img.getbbox()
    master = out_img.crop(bbox)

    # 8. Export destinations
    master_dir = "assets/source-plates/cutouts"
    web_dir = "images"
    os.makedirs(master_dir, exist_ok=True)
    os.makedirs(web_dir, exist_ok=True)

    master_path = os.path.join(master_dir, f"{output_name}-transparent.png")
    master_alias = os.path.join(master_dir, f"audubon-{output_name}-transparent.png")
    master.save(master_path, format="PNG")
    master.save(master_alias, format="PNG")
    print(f"✓ Saved master cutouts: {master_path} and {master_alias}")

    # Web optimization
    web_im = master.copy()
    web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
    web_path = os.path.join(web_dir, f"{output_name}-transparent.png")
    web_alias = os.path.join(web_dir, f"audubon-{output_name}-transparent.png")
    web_quant.save(web_path, format="PNG", optimize=True)
    web_quant.save(web_alias, format="PNG", optimize=True)
    print(f"✓ Saved web cutouts: {web_path} and {web_alias} ({web_im.size[0]}x{web_im.size[1]})")

    # Archival copy of source plate
    archive_path = os.path.join("assets/source-plates", f"{output_name}.jpg")
    if not os.path.exists(archive_path) and source_path.endswith(".jpg"):
        im.save(archive_path, quality=95)
        print(f"✓ Archived source plate: {archive_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract transparent cutout from Audubon plate")
    parser.add_argument("source", help="Path to input plate (JPEG/PNG)")
    parser.add_argument("name", help="Semantic base name for outputs (e.g. owl-lost)")
    parser.add_argument("--roi-top", type=float, default=0.05, help="ROI top fraction (default: 0.05)")
    parser.add_argument("--roi-bottom", type=float, default=0.96, help="ROI bottom fraction (default: 0.96)")
    parser.add_argument("--roi-left", type=float, default=0.05, help="ROI left fraction (default: 0.05)")
    parser.add_argument("--roi-right", type=float, default=0.95, help="ROI right fraction (default: 0.95)")
    parser.add_argument("--wash-low", type=float, default=10.0, help="Wash low distance threshold (default: 10.0)")
    parser.add_argument("--wash-high", type=float, default=28.0, help="Wash high distance threshold (default: 28.0)")
    args = parser.parse_args()
    extract_cutout(
        args.source,
        args.name,
        roi_top=args.roi_top,
        roi_bottom=args.roi_bottom,
        roi_left=args.roi_left,
        roi_right=args.roi_right,
        wash_low=args.wash_low,
        wash_high=args.wash_high,
    )
