#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for build-a-bird
from images/build-a-bird.jpg (or assets/source-plates/build-a-bird.jpg).

Outputs:
1. Master Deckled Sheet Cutout:
   - Full-resolution: assets/source-plates/cutouts/build-a-bird-transparent.png
   - Web-optimized: images/build-a-bird-transparent.png
   - Aliases: images/build-a-bird.png, images/build-a-bird-sheet-transparent.png

2. Master Cutout Parts Plate (isolated pieces + perch silhouette, parchment removed):
   - Full-resolution: assets/source-plates/cutouts/build-a-bird-parts-transparent.png
   - Web-optimized: images/build-a-bird-parts-transparent.png

3. Individual Part Cutouts:
   - images/build-a-bird/*.png
   - assets/source-plates/cutouts/build-a-bird/*.png

4. Archival source plate:
   - assets/source-plates/build-a-bird.jpg
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/build-a-bird.jpg"
FALLBACK_SOURCE = "assets/source-plates/build-a-bird.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/build-a-bird.jpg"

# Deckled craft sheet cutouts (archival/alternative)
MASTER_SHEET_CUTOUT = "assets/source-plates/cutouts/build-a-bird-sheet-transparent.png"
WEB_SHEET_CUTOUT = "images/build-a-bird-sheet-transparent.png"

# Isolated parts plate cutouts (primary transparent asset: vintage cutouts with parchment removed)
MASTER_PARTS_CUTOUT = "assets/source-plates/cutouts/build-a-bird-transparent.png"
MASTER_PARTS_ALIAS = "assets/source-plates/cutouts/build-a-bird-parts-transparent.png"
WEB_PARTS_CUTOUT = "images/build-a-bird-transparent.png"
WEB_PARTS_ALIAS = "images/build-a-bird-parts-transparent.png"
WEB_BUILD_A_BIRD = "images/build-a-bird.png"

# Individual parts directory
INDIVIDUAL_PARTS_DIR = "images/build-a-bird"
MASTER_INDIVIDUAL_PARTS_DIR = "assets/source-plates/cutouts/build-a-bird"

MAX_WEB_DIM = (800, 800)

# Exact bounding boxes for the 6 components on the Build-a-Bird sheet
PART_BOXES = [
    ("toucan-head", (190, 140, 785, 460)),
    ("barn-owl-head", (860, 130, 1265, 535)),
    ("scarlet-macaw-wing", (390, 490, 1185, 915)),
    ("flamingo-leg", (290, 800, 575, 1415)),
    ("barn-owl-body", (710, 925, 1465, 1390)),
    ("perch-and-silhouette", (1510, 275, 2630, 1370)),
]


def process_deckled_sheet(im, arr):
    """Crops the studio white canvas outside the antique deckled paper sheet and renders transparent exterior."""
    h, w, _ = arr.shape
    # White canvas is neutral bright white (low saturation, brightness > 245)
    is_canvas = (
        (arr[:, :, 0] - arr[:, :, 2] < 7)
        & (arr[:, :, 1] - arr[:, :, 2] < 7)
        & (arr[:, :, 2] > 245)
    )

    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for r in [0, h - 1]:
        for c in range(w):
            if is_canvas[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))
    for c in [0, w - 1]:
        for r in range(h):
            if is_canvas[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))

    while q:
        r, c = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc] and is_canvas[nr, nc]:
                visited[nr, nc] = True
                q.append((nr, nc))

    paper_mask = ~visited
    mask_im = Image.fromarray((paper_mask.astype(np.uint8) * 255)).filter(
        ImageFilter.GaussianBlur(0.8)
    )
    alpha = np.array(mask_im, dtype=float)
    alpha[alpha < 1.5] = 0.0

    # De-fringe semi-transparent edge pixels against white canvas (255, 255, 255)
    alpha_norm = alpha / 255.0
    transparent_arr = np.zeros((h, w, 4), dtype=float)
    for c in range(3):
        unblended = (arr[:, :, c] - (1.0 - alpha_norm) * 255.0) / np.maximum(
            alpha_norm, 0.001
        )
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
    transparent_arr[:, :, 3] = alpha

    sheet_im = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
    bbox = sheet_im.getbbox()
    master = sheet_im.crop(bbox)
    return master


def process_parts_plate(im, arr):
    """Isolates the bird craft parts and perch silhouette, removing all parchment background."""
    h, w, _ = arr.shape
    clean_parts_mask = np.zeros((h, w), dtype=bool)
    individual_cutouts = {}

    for name, (x1, y1, x2, y2) in PART_BOXES:
        patch = arr[y1:y2, x1:x2]
        ph, pw, _ = patch.shape
        margin_samples = np.concatenate([
            patch[:8, :].reshape(-1, 3),
            patch[-8:, :].reshape(-1, 3),
            patch[:, :8].reshape(-1, 3),
            patch[:, -8:].reshape(-1, 3),
        ])
        bg_col = np.median(margin_samples, axis=0)
        diff = np.sqrt(np.sum((patch - bg_col) ** 2, axis=2))

        # Require significant difference and dark element, excluding faint background foxing/stains
        barrier = (diff > 18) & (patch.max(axis=2) < 205)
        barrier_im = Image.fromarray(barrier.astype(np.uint8) * 255).filter(
            ImageFilter.MaxFilter(13)
        )
        dilated = np.array(barrier_im) > 0

        vis = np.zeros((ph, pw), dtype=bool)
        q = deque()
        for r in [0, ph - 1]:
            for c in range(pw):
                if not dilated[r, c] and not vis[r, c]:
                    vis[r, c] = True
                    q.append((r, c))
        for c in [0, pw - 1]:
            for r in range(ph):
                if not dilated[r, c] and not vis[r, c]:
                    vis[r, c] = True
                    q.append((r, c))
        while q:
            r, c = q.popleft()
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if (
                    0 <= nr < ph
                    and 0 <= nc < pw
                    and not vis[nr, nc]
                    and not dilated[nr, nc]
                ):
                    vis[nr, nc] = True
                    q.append((nr, nc))

        solid = ~vis
        lbl = np.zeros((ph, pw), dtype=int)
        cur_lbl = 0
        comp_sizes = {}
        for r in range(ph):
            for c in range(pw):
                if solid[r, c] and lbl[r, c] == 0:
                    cur_lbl += 1
                    lbl[r, c] = cur_lbl
                    cq = deque([(r, c)])
                    cnt = 0
                    while cq:
                        cr, cc = cq.popleft()
                        cnt += 1
                        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                            nr, nc = cr + dr, cc + dc
                            if (
                                0 <= nr < ph
                                and 0 <= nc < pw
                                and solid[nr, nc]
                                and lbl[nr, nc] == 0
                            ):
                                lbl[nr, nc] = cur_lbl
                                cq.append((nr, nc))
                    comp_sizes[cur_lbl] = cnt

        if comp_sizes:
            main_lbl = max(comp_sizes, key=comp_sizes.get)
            main_solid = lbl == main_lbl
            solid_im = Image.fromarray(main_solid.astype(np.uint8) * 255).filter(
                ImageFilter.MinFilter(11)
            )
            piece_mask = np.array(solid_im) > 0
            clean_parts_mask[y1:y2, x1:x2] |= piece_mask

            # Convert vintage parchment border inside cut lines to clean bright white
            patch_clean = patch.copy()
            if name != "perch-and-silhouette":
                light_paper = piece_mask & (patch.min(axis=2) > 215)
                for ch in range(3):
                    patch_clean[light_paper, ch] = 255.0
            else:
                dark_lines = (diff > 20) & (patch.max(axis=2) < 185)
                interior_paper = piece_mask & ~dark_lines
                for ch in range(3):
                    patch_clean[interior_paper, ch] = 255.0

            # Save clean individual piece cutout
            piece_mask_im = Image.fromarray(piece_mask.astype(np.uint8) * 255).filter(
                ImageFilter.GaussianBlur(0.8)
            )
            p_alpha = np.array(piece_mask_im, dtype=float)
            p_alpha[p_alpha < 1.5] = 0.0
            p_alpha_norm = p_alpha / 255.0
            piece_trans = np.zeros((ph, pw, 4), dtype=float)
            for c in range(3):
                unblended = (patch_clean[:, :, c] - (1.0 - p_alpha_norm) * bg_col[c]) / np.maximum(
                    p_alpha_norm, 0.001
                )
                piece_trans[:, :, c] = np.clip(unblended, 0, 255)
            piece_trans[:, :, 3] = p_alpha
            piece_im = Image.fromarray(piece_trans.astype(np.uint8), mode="RGBA")
            p_bbox = piece_im.getbbox()
            if p_bbox:
                individual_cutouts[name] = piece_im.crop(p_bbox)

    # Clean the full image array with pure white sticker fill
    arr_white = arr.copy()
    for name, (x1, y1, x2, y2) in PART_BOXES:
        p_mask = clean_parts_mask[y1:y2, x1:x2]
        p_slice = arr_white[y1:y2, x1:x2]
        if name != "perch-and-silhouette":
            light_paper = p_mask & (p_slice.min(axis=2) > 215)
            for ch in range(3):
                p_slice[light_paper, ch] = 255.0
        else:
            diff_p = np.sqrt(np.sum((p_slice - np.array([252.0, 245.0, 230.0])) ** 2, axis=2))
            dark_lines = (diff_p > 20) & (p_slice.max(axis=2) < 185)
            interior_paper = p_mask & ~dark_lines
            for ch in range(3):
                p_slice[interior_paper, ch] = 255.0
        arr_white[y1:y2, x1:x2] = p_slice

    p_mask_im = Image.fromarray((clean_parts_mask.astype(np.uint8) * 255)).filter(
        ImageFilter.GaussianBlur(0.8)
    )
    p_alpha = np.array(p_mask_im, dtype=float)
    p_alpha[p_alpha < 1.5] = 0.0

    p_alpha_norm = p_alpha / 255.0
    p_trans = np.zeros((h, w, 4), dtype=float)
    bg_mean = np.array([252.0, 245.0, 230.0])
    for c in range(3):
        unblended = (arr_white[:, :, c] - (1.0 - p_alpha_norm) * bg_mean[c]) / np.maximum(
            p_alpha_norm, 0.001
        )
        p_trans[:, :, c] = np.clip(unblended, 0, 255)
    p_trans[:, :, 3] = p_alpha

    parts_im = Image.fromarray(p_trans.astype(np.uint8), mode="RGBA")
    bbox_parts = parts_im.getbbox()
    master_parts = parts_im.crop(bbox_parts)
    return master_parts, individual_cutouts


def main():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)

    # 1. Generate Master Deckled Sheet Cutout
    print("Processing Deckled Paper Sheet cutout...")
    master_sheet = process_deckled_sheet(im, arr)

    os.makedirs(os.path.dirname(MASTER_SHEET_CUTOUT), exist_ok=True)
    master_sheet.save(MASTER_SHEET_CUTOUT, format="PNG")
    kb = os.path.getsize(MASTER_SHEET_CUTOUT) / 1024
    print(
        f"✓ Saved master sheet cutout: {MASTER_SHEET_CUTOUT} ({master_sheet.size[0]}x{master_sheet.size[1]}, {kb:.1f} KB)"
    )

    # Web-optimized sheet cutout (archived/alternative)
    web_sheet = master_sheet.copy()
    web_sheet.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_sheet_quant = web_sheet.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
    for p in [WEB_SHEET_CUTOUT]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        web_sheet_quant.save(p, format="PNG", optimize=True)
        kb = os.path.getsize(p) / 1024
        print(
            f"✓ Saved web sheet cutout: {p} ({web_sheet.size[0]}x{web_sheet.size[1]}, {kb:.1f} KB)"
        )

    # 2. Generate Master Isolated Parts Plate Cutout
    print("Processing Isolated Parts Plate cutout (Clean White Stickers)...")
    master_parts, individual_cutouts = process_parts_plate(im, arr)

    for p in [MASTER_PARTS_CUTOUT, MASTER_PARTS_ALIAS]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        master_parts.save(p, format="PNG")
        kb = os.path.getsize(p) / 1024
        print(
            f"✓ Saved master parts cutout: {p} ({master_parts.size[0]}x{master_parts.size[1]}, {kb:.1f} KB)"
        )

    # Web-optimized parts cutout (primary mascot files)
    web_parts = master_parts.copy()
    web_parts.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_parts_quant = web_parts.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
    for p in [WEB_PARTS_CUTOUT, WEB_PARTS_ALIAS, WEB_BUILD_A_BIRD]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        web_parts_quant.save(p, format="PNG", optimize=True)
        kb = os.path.getsize(p) / 1024
        print(
            f"✓ Saved web parts cutout: {p} ({web_parts.size[0]}x{web_parts.size[1]}, {kb:.1f} KB)"
        )

    # 3. Individual Bird Part Cutouts
    print("Saving individual part cutouts...")
    for out_dir in [INDIVIDUAL_PARTS_DIR, MASTER_INDIVIDUAL_PARTS_DIR]:
        os.makedirs(out_dir, exist_ok=True)
        # Clear previous individual parts if any
        for f in os.listdir(out_dir):
            if f.endswith(".png"):
                os.remove(os.path.join(out_dir, f))
        for part_name, piece_im in individual_cutouts.items():
            dest = os.path.join(out_dir, f"{part_name}.png")
            piece_im.save(dest, format="PNG", optimize=True)

    print(
        f"✓ Saved {len(individual_cutouts)} individual parts to {INDIVIDUAL_PARTS_DIR}/ and {MASTER_INDIVIDUAL_PARTS_DIR}/"
    )

    # 4. Archival copy of source plate
    os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
    im.save(SOURCE_PLATE_COPY, quality=95)
    print(f"✓ Saved source plate archive: {SOURCE_PLATE_COPY}")


if __name__ == "__main__":
    main()
