#!/usr/bin/env python3
"""
Generates high-precision, cropped, transparent cutouts for "Peck Your Own"
from images/peck-your-own.jpg (or assets/source-plates/peck-your-own.jpg).

Retains:
- The entire wooden arbor/trellis structure (posts, cross wires, branches, leaves)
- Three tiers of perched birds with solid white plumage highlights (blue jay cheeks, dove chest)
- Two woven baskets with baby birds
- Ground watercolor wash, fallen feathers, and grass tufts at post bases

Removes:
- Light brown / cream paper background
- Open sky between wires and trellis posts
- Paper aging foxing specks and stains

Outputs:
- Full-resolution master RGBA cutout: assets/source-plates/cutouts/peck-your-own-transparent.png
- Master Audubon alias: assets/source-plates/cutouts/audubon-peck-your-own-transparent.png
- Web-optimized cutout: images/peck-your-own-transparent.png
- Web Audubon alias: images/audubon-peck-your-own-transparent.png
- Archival copy of source plate: assets/source-plates/peck-your-own.jpg
"""

import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SOURCE_FILE = "images/peck-your-own.jpg"
FALLBACK_SOURCE = "assets/source-plates/peck-your-own.jpg"
SOURCE_PLATE_COPY = "assets/source-plates/peck-your-own.jpg"

MASTER_CUTOUT = "assets/source-plates/cutouts/peck-your-own-transparent.png"
MASTER_AUDUBON = "assets/source-plates/cutouts/audubon-peck-your-own-transparent.png"

WEB_CUTOUT = "images/peck-your-own-transparent.png"
WEB_AUDUBON = "images/audubon-peck-your-own-transparent.png"

MAX_WEB_DIM = (800, 800)


def process_peck_your_own():
    src = SOURCE_FILE if os.path.exists(SOURCE_FILE) else FALLBACK_SOURCE
    if not os.path.exists(src):
        print(f"Error: Source image not found at {SOURCE_FILE} or {FALLBACK_SOURCE}")
        sys.exit(1)

    print(f"Reading source image: {src}")
    im = Image.open(src).convert("RGB")
    arr = np.array(im, dtype=float)
    h, w, _ = arr.shape
    gray = arr.mean(axis=2)

    # 1. Fit 2D degree-4 polynomial background surface to outer clean margins
    pts = []
    for y in range(20, 160, 20):
        for x in range(50, 2750, 50):
            pts.append((y, x))
    for y in range(1460, 1525, 20):
        for x in range(50, 2750, 50):
            pts.append((y, x))
    for y in range(160, 1460, 30):
        for x in [30, 80, 150, 250, 350, 450, 550, 2770, 2800]:
            pts.append((y, x))
    pts = np.array(pts)
    vals = np.array([arr[y, x] for (y, x) in pts])
    clean = vals.mean(axis=1) > 225
    pts, vals = pts[clean], vals[clean]

    y_c, x_c = pts[:, 0], pts[:, 1]
    xs = (x_c - 1408) / 1408
    ys = (y_c - 768) / 768
    terms = [
        np.ones_like(xs), xs, ys,
        xs**2, ys**2, xs * ys,
        xs**3, ys**3, (xs**2) * ys, xs * (ys**2),
        xs**4, ys**4, (xs**3) * ys, (xs**2) * (ys**2), xs * (ys**3)
    ]
    A = np.column_stack(terms)

    grid_y, grid_x = np.mgrid[0:h, 0:w]
    g_xs = (grid_x - 1408) / 1408
    g_ys = (grid_y - 768) / 768
    g_terms = [
        np.ones(h * w), g_xs.ravel(), g_ys.ravel(),
        (g_xs**2).ravel(), (g_ys**2).ravel(), (g_xs * g_ys).ravel(),
        (g_xs**3).ravel(), (g_ys**3).ravel(), ((g_xs**2) * g_ys).ravel(), (g_xs * (g_ys**2)).ravel(),
        (g_xs**4).ravel(), (g_ys**4).ravel(), ((g_xs**3) * g_ys).ravel(), ((g_xs**2) * (g_ys**2)).ravel(), (g_xs * (g_ys**3)).ravel()
    ]
    all_A = np.column_stack(g_terms)

    bg_surf = np.zeros_like(arr)
    for c in range(3):
        coeffs, _, _, _ = np.linalg.lstsq(A, vals[:, c], rcond=None)
        bg_surf[:, :, c] = (all_A @ coeffs).reshape(h, w)

    diff = np.sqrt(np.sum((arr - bg_surf) ** 2, axis=2))

    # 2. Artwork bounding region
    mask_inside = np.zeros((h, w), dtype=bool)
    mask_inside[330:1460, 640:2735] = True

    # 3. Base continuous alpha ramp from paper color distance
    low_thresh = 13.0
    high_thresh = 34.0
    alpha = np.clip((diff - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0) * 255.0

    # Inked outlines and artwork strokes are fully opaque
    is_ink = (gray < 170) & mask_inside
    alpha[is_ink] = 255.0
    alpha[~mask_inside] = 0.0

    # 4. Fill enclosed interior plumage highlights (cheeks, dove chest, wing bars)
    barrier = alpha > 128
    inv = ~barrier
    visited = np.zeros_like(inv, dtype=bool)
    q = deque()
    for r in [0, h - 1]:
        for c in range(w):
            if inv[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))
    for c in [0, w - 1]:
        for r in range(h):
            if inv[r, c] and not visited[r, c]:
                visited[r, c] = True
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < h and 0 <= nc < w and inv[nr, nc] and not visited[nr, nc]:
                visited[nr, nc] = True
                q.append((nr, nc))

    holes = inv & ~visited
    visited_h = np.zeros_like(holes, dtype=bool)
    for r in range(h):
        for c in range(w):
            if holes[r, c] and not visited_h[r, c]:
                visited_h[r, c] = True
                comp = [(r, c)]
                qc = [(r, c)]
                while qc:
                    cr, cc = qc.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < h and 0 <= nc < w and holes[nr, nc] and not visited_h[nr, nc]:
                            visited_h[nr, nc] = True
                            qc.append((nr, nc))
                            comp.append((nr, nc))
                if len(comp) <= 350:
                    for pr, pc in comp:
                        alpha[pr, pc] = 255.0

    # 5. Sky boundary constraint: in sky region (y < 1330), genuine artwork is within 12px of ink
    ink_im = Image.fromarray((is_ink.astype(np.uint8) * 255))
    ink_safe = np.array(ink_im.filter(ImageFilter.MaxFilter(25))) > 0  # radius 12px
    sky_region = np.arange(h)[:, None] < 1330
    alpha[sky_region & ~ink_safe] = 0.0

    # 6. Filter isolated noise components in ground zone
    has_alpha = alpha > 0.0
    visited_a = np.zeros_like(has_alpha, dtype=bool)
    for r in range(h):
        for c in range(w):
            if has_alpha[r, c] and not visited_a[r, c]:
                visited_a[r, c] = True
                comp = [(r, c)]
                qa = [(r, c)]
                has_ink = is_ink[r, c]
                while qa:
                    cr, cc = qa.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < h and 0 <= nc < w and has_alpha[nr, nc] and not visited_a[nr, nc]:
                            visited_a[nr, nc] = True
                            qa.append((nr, nc))
                            comp.append((nr, nc))
                            if is_ink[nr, nc]:
                                has_ink = True
                if not has_ink and len(comp) < 100:
                    for pr, pc in comp:
                        alpha[pr, pc] = 0.0

    # 7. Anti-aliasing
    alpha_im = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    alpha_smooth = np.array(alpha_im, dtype=float)
    alpha_smooth[alpha_smooth < 1.5] = 0.0

    # 8. Unblend foreground colors against background surface
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

    # 9. Save master full-resolution cutouts
    for p in [MASTER_CUTOUT, MASTER_AUDUBON]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        master.save(p, format="PNG")
        kb = os.path.getsize(p) / 1024
        print(f"✓ Saved master cutout: {p} ({master.size[0]}x{master.size[1]}, {kb:.1f} KB)")

    # 10. Save web-optimized cutouts
    web_im = master.copy()
    web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)
    web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

    for p in [WEB_CUTOUT, WEB_AUDUBON]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        web_quant.save(p, format="PNG", optimize=True)
        kb = os.path.getsize(p) / 1024
        print(f"✓ Saved web cutout: {p} ({web_im.size[0]}x{web_im.size[1]}, {kb:.1f} KB)")

    # 11. Ensure archival copy of source plate exists in assets/source-plates/
    if os.path.exists(SOURCE_FILE) and not os.path.exists(SOURCE_PLATE_COPY):
        os.makedirs(os.path.dirname(SOURCE_PLATE_COPY), exist_ok=True)
        im.save(SOURCE_PLATE_COPY, quality=95)
        print(f"✓ Saved source plate copy: {SOURCE_PLATE_COPY}")


if __name__ == "__main__":
    process_peck_your_own()
