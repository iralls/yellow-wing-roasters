#!/usr/bin/env python3
"""
Optimizes web images in images/ directory:
- Constrains dimensions to max 800x800 bounding box using high-quality Lanczos resampling
- Quantizes RGBA to 256 colors using Fast Octree algorithm with alpha preservation
- Saves with optimize=True
- Excludes favicon.png, social-preview-v2.png, and non-image directories
"""

import os
import sys
from PIL import Image

IMAGES_DIR = "images"
EXCLUDED = {"favicon.png", "social-preview-v2.png"}
MAX_DIM = (800, 800)

def main():
    if not os.path.isdir(IMAGES_DIR):
        print(f"Error: {IMAGES_DIR} not found.")
        sys.exit(1)

    files = sorted(os.listdir(IMAGES_DIR))
    pngs = [
        f for f in files
        if f.endswith(".png") and f not in EXCLUDED and os.path.isfile(os.path.join(IMAGES_DIR, f))
    ]

    print(f"Processing {len(pngs)} images in {IMAGES_DIR}/...")
    total_before = 0
    total_after = 0

    for f in pngs:
        p = os.path.join(IMAGES_DIR, f)
        size_before = os.path.getsize(p)
        total_before += size_before

        im = Image.open(p)
        orig_w, orig_h = im.size

        # Resize if larger than 800x800
        if orig_w > MAX_DIM[0] or orig_h > MAX_DIM[1]:
            im.thumbnail(MAX_DIM, Image.Resampling.LANCZOS)

        # Quantize to 256 colors with Fast Octree
        im_quant = im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

        temp_p = p + ".tmp"
        im_quant.save(temp_p, format="PNG", optimize=True)

        size_after = os.path.getsize(temp_p)
        if size_after < size_before:
            os.replace(temp_p, p)
            total_after += size_after
            pct = (1 - size_after / size_before) * 100
            print(f"  ✓ {f}: {orig_w}x{orig_h} ({size_before/1024:.1f} KB) -> {im.size[0]}x{im.size[1]} ({size_after/1024:.1f} KB) [-{pct:.1f}%]")
        else:
            os.remove(temp_p)
            total_after += size_before
            print(f"  - {f}: already optimal ({size_before/1024:.1f} KB)")

    print("-" * 60)
    saved = total_before - total_after
    pct_total = (saved / total_before) * 100 if total_before > 0 else 0
    print(f"Total Before: {total_before / (1024*1024):.2f} MB")
    print(f"Total After:  {total_after / (1024*1024):.2f} MB")
    print(f"Space Saved:  {saved / (1024*1024):.2f} MB ({pct_total:.1f}% reduction)")

if __name__ == "__main__":
    main()
