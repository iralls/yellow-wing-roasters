#!/usr/bin/env python3
"""
Processes raw source plates for Coffee Quiz icons into cropped, transparent master cutouts.
Saves full-resolution RGBA cutouts to assets/source-plates/cutouts/<name>-transparent.png.
"""

import os
import sys
import numpy as np
from PIL import Image, ImageFilter

SOURCE_DIR = "assets/source-plates"
OUTPUT_DIR = "assets/source-plates/cutouts"

TARGET_FILES = [
    "aeropress.jpg",
    "black-coffee.jpg",
    "caramel.jpg",
    "chocolate.jpg",
    "citrus.jpg",
    "cold-brew.jpg",
    "dark-roast-coffee.jpg",
    "drip.jpg",
    "espresso-machine.jpg",
    "french-press.jpg",
    "fruits.jpg",
    "hazelnut.jpg",
    "jasmine.jpg",
    "light-roast-coffee.jpg",
    "medium-roast-coffee.jpg",
    "milk-with-sugar.jpg",
    "milk.jpg",
    "pour-over.jpg",
    "question-mark.jpg",
    "sugar.jpg",
]

FRAMED_PLATES = {
    "aeropress.jpg",
    "dark-roast-coffee.jpg",
    "espresso-machine.jpg",
    "light-roast-coffee.jpg",
    "medium-roast-coffee.jpg",
}

def find_primary_subject_bbox(dist, high_thresh, w, h):
    strong = dist > (high_thresh * 0.85)
    # Downscale strong to 1/4 resolution for fast connected components
    scale = 4
    down = Image.fromarray((strong * 255).astype(np.uint8)).resize((w // scale, h // scale))
    down = down.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    d_arr = np.array(down) > 0

    visited = np.zeros_like(d_arr, dtype=bool)
    components = []
    dh, dw = d_arr.shape
    for r in range(dh):
        for c in range(dw):
            if d_arr[r, c] and not visited[r, c]:
                q = [(r, c)]
                visited[r, c] = True
                comp = []
                while q:
                    curr_r, curr_c = q.pop()
                    comp.append((curr_r, curr_c))
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < dh and 0 <= nc < dw and d_arr[nr, nc] and not visited[nr, nc]:
                            visited[nr, nc] = True
                            q.append((nr, nc))
                components.append(comp)

    if not components:
        return (0, 0, w, h)

    components.sort(key=len, reverse=True)
    primary = components[0]
    rs = [p[0] for p in primary]
    cs = [p[1] for p in primary]
    return (min(cs) * scale, min(rs) * scale, max(cs) * scale, max(rs) * scale)

def process_image(filename):
    src_path = os.path.join(SOURCE_DIR, filename)
    base_name = os.path.splitext(filename)[0]
    out_name = f"{base_name}-transparent.png"
    out_path = os.path.join(OUTPUT_DIR, out_name)

    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found.")
        return False

    im = Image.open(src_path).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape

    # 1. Classify image background type
    bw = 35
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[:bw, :] = True
    border_mask[-bw:, :] = True
    border_mask[:, :bw] = True
    border_mask[:, -bw:] = True

    border_vals = arr[border_mask]
    median_bg = np.median(border_vals, axis=0)
    std_bg = np.std(border_vals, axis=0)
    is_pure_white = np.all(median_bg > 250) and np.all(std_bg < 3.0)

    if filename in FRAMED_PLATES:
        # Plates with outer white margin + thin rectangular frame + inner parchment
        if filename in {"dark-roast-coffee.jpg", "light-roast-coffee.jpg", "medium-roast-coffee.jpg"}:
            # For bean piles, sample clean parchment from above the beans
            sample = arr[150:250, 1000:1800]
            bg_parchment = np.median(sample, axis=(0, 1))
        else:
            inner_mask = np.zeros((h, w), dtype=bool)
            inner_mask[120:180, 120:300] = True
            inner_mask[120:180, -300:-120] = True
            inner_mask[-180:-120, 120:300] = True
            inner_mask[-180:-120, -300:-120] = True
            bg_parchment = np.median(arr[inner_mask], axis=0)

        dist_p = np.sqrt(np.sum((arr - bg_parchment) ** 2, axis=2))
        dist_w = np.sqrt(np.sum((arr - np.array([255.0, 255.0, 255.0])) ** 2, axis=2))
        dist = np.minimum(dist_p, dist_w)

        low_thresh = 10.0
        high_thresh = 35.0
        bg_for_unblend = bg_parchment

        # Zero out outer 100px to eliminate the frame line
        frame_margin = 100
        dist[:frame_margin, :] = 0.0
        dist[-frame_margin:, :] = 0.0
        dist[:, :frame_margin] = 0.0
        dist[:, -frame_margin:] = 0.0

    elif is_pure_white:
        # Clean white background
        bg_color = np.array([255.0, 255.0, 255.0])
        dist = np.sqrt(np.sum((arr - bg_color) ** 2, axis=2))
        low_thresh = 8.0
        high_thresh = 35.0
        bg_for_unblend = bg_color

    elif filename == "cold-brew.jpg":
        # Fit background surface to clean surrounding parchment around the pitcher/glass
        surround_mask = np.zeros((h, w), dtype=bool)
        surround_mask[150:260, 900:2000] = True
        surround_mask[260:1330, 800:990] = True
        surround_mask[260:1330, 1920:2100] = True
        surround_mask[1330:1450, 900:2000] = True

        surround_vals = arr[surround_mask]
        y_coords, x_coords = np.mgrid[0:h, 0:w]
        x_s = (x_coords[surround_mask] - 1450) / 500
        y_s = (y_coords[surround_mask] - 800) / 500
        A = np.column_stack([np.ones_like(x_s), x_s, y_s, x_s**2, y_s**2, x_s * y_s])

        x_all = (x_coords - 1450) / 500
        y_all = (y_coords - 800) / 500
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
            coeffs, _, _, _ = np.linalg.lstsq(A, surround_vals[:, c], rcond=None)
            bg_surface[:, :, c] = (all_A @ coeffs).reshape(h, w)

        dist = np.sqrt(np.sum((arr - bg_surface) ** 2, axis=2))
        low_thresh = 12.0
        high_thresh = 38.0
        bg_for_unblend = bg_surface

    elif filename == "question-mark.jpg":
        # Fit background surface to clean surrounding parchment around the question mark
        surround_mask = np.zeros((h, w), dtype=bool)
        surround_mask[100:260, 1100:1800] = True
        surround_mask[1180:1280, 1100:1800] = True
        surround_mask[260:1200, 700:1150] = True
        surround_mask[260:1200, 1750:2200] = True

        surround_vals = arr[surround_mask]
        y_coords, x_coords = np.mgrid[0:h, 0:w]
        x_s = (x_coords[surround_mask] - 1420) / 400
        y_s = (y_coords[surround_mask] - 700) / 400
        A = np.column_stack([np.ones_like(x_s), x_s, y_s, x_s**2, y_s**2, x_s * y_s])

        x_all = (x_coords - 1420) / 400
        y_all = (y_coords - 700) / 400
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
            coeffs, _, _, _ = np.linalg.lstsq(A, surround_vals[:, c], rcond=None)
            bg_surface[:, :, c] = (all_A @ coeffs).reshape(h, w)

        dist = np.sqrt(np.sum((arr - bg_surface) ** 2, axis=2))
        low_thresh = 14.0
        high_thresh = 38.0
        bg_for_unblend = bg_surface

    else:
        # Parchment background with subtle radial vignette - fit 2D quadratic polynomial surface
        y_coords, x_coords = np.mgrid[0:h, 0:w]
        x_b = (x_coords[border_mask] - w / 2) / (w / 2)
        y_b = (y_coords[border_mask] - h / 2) / (h / 2)
        A = np.column_stack([np.ones_like(x_b), x_b, y_b, x_b**2, y_b**2, x_b * y_b])

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
            coeffs, _, _, _ = np.linalg.lstsq(A, border_vals[:, c], rcond=None)
            bg_surface[:, :, c] = (all_A @ coeffs).reshape(h, w)

        dist = np.sqrt(np.sum((arr - bg_surface) ** 2, axis=2))
        low_thresh = 12.0
        high_thresh = 40.0
        bg_for_unblend = bg_surface

    # 2. Identify the primary subject's true bounding box
    if filename in {"dark-roast-coffee.jpg", "light-roast-coffee.jpg", "medium-roast-coffee.jpg"}:
        # Exclude text below y=1140 so only the coffee beans are captured
        s_bbox = (650, 300, 2230, 1140)
    elif filename == "cold-brew.jpg":
        # Keep entire pitcher and spout intact
        s_bbox = (1018, 275, 1900, 1324)
    elif filename == "drip.jpg":
        # Exclude empty right side and bottom text
        s_bbox = (970, 190, 1850, 1260)
    elif filename == "french-press.jpg":
        # Exclude empty right side and bottom text
        s_bbox = (1110, 270, 1870, 1330)
    elif filename == "pour-over.jpg":
        # Exclude empty right side
        s_bbox = (1100, 250, 1875, 1260)
    elif filename == "question-mark.jpg":
        # Exclude caption text below y=1170
        s_bbox = (1175, 295, 1665, 1165)
    elif filename == "sugar.jpg":
        # Ensure the top of the sugar cubes is not cut off
        s_bbox = (895, 990, 1925, 1335)
    else:
        s_bbox = find_primary_subject_bbox(dist, high_thresh, w, h)

    pad = 0 if filename in {"cold-brew.jpg", "question-mark.jpg"} else 25
    x1 = max(0, s_bbox[0] - pad)
    y1 = max(0, s_bbox[1] - pad)
    x2 = min(w, s_bbox[2] + pad)
    y2 = min(h, s_bbox[3] + pad)

    # 3. Compute smooth alpha ramp with anti-aliasing
    alpha = np.clip((dist - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0) * 255.0

    # Mask out everything outside padded subject bounding box to ensure zero background noise
    mask_outside = np.ones((h, w), dtype=bool)
    mask_outside[y1:y2, x1:x2] = False
    if filename == "cold-brew.jpg":
        # Mask empty parchment to the left of the pitcher above and below the spout
        mask_outside[:330, :1085] = True
        mask_outside[460:, :1085] = True
    alpha[mask_outside] = 0.0

    # 4. Color unblending to remove paper edge fringing
    transparent_arr = np.zeros((h, w, 4), dtype=float)
    alpha_norm = alpha / 255.0
    for c in range(3):
        bg_c = bg_for_unblend[c] if (is_pure_white or filename in FRAMED_PLATES) else bg_for_unblend[:, :, c]
        unblended = (arr[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
    transparent_arr[:, :, 3] = alpha

    # 5. Crop tightly to non-transparent pixels
    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    final_bbox = out_img.getbbox()
    if final_bbox:
        cropped = out_img.crop(final_bbox)
    else:
        cropped = out_img

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    cropped.save(out_path, format="PNG")
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  ✓ {filename:24s} -> {out_name:30s} | Size: {cropped.size[0]}x{cropped.size[1]} ({size_kb:.1f} KB)")
    return True

def main():
    print(f"Processing {len(TARGET_FILES)} source plates into {OUTPUT_DIR}...")
    success = 0
    for f in TARGET_FILES:
        if process_image(f):
            success += 1
    print(f"Done! Successfully processed {success}/{len(TARGET_FILES)} images.")

if __name__ == "__main__":
    main()
