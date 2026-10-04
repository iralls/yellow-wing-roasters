import os
import numpy as np
from PIL import Image

def make_transparent_and_crop():
    src_path = "images/logo.png"
    if not os.path.exists(src_path):
        raise FileNotFoundError(f"Source file {src_path} not found.")

    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img, dtype=float)

    # Off-white background color: [250, 248, 245]
    bg_color = np.array([250.0, 248.0, 245.0])

    # Calculate Euclidean distance from bg_color for smooth anti-aliased transparency
    dist = np.sqrt(np.sum((arr[:, :, :3] - bg_color) ** 2, axis=2))

    low_thresh = 6.0
    high_thresh = 35.0

    alpha = np.clip((dist - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0) * 255.0

    # Unblend foreground colors to prevent off-white fringing on anti-aliased edges
    transparent_arr = arr.copy()
    transparent_arr[:, :, 3] = alpha
    alpha_norm = alpha / 255.0

    for c in range(3):
        unblended = (arr[:, :, c] - (1.0 - alpha_norm) * bg_color[c]) / np.maximum(
            alpha_norm, 0.001
        )
        transparent_arr[:, :, c] = np.clip(unblended, 0, 255)

    out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")

    # Tight crop full combined logo (feather + text)
    bbox = out_img.getbbox()
    cropped_full = out_img.crop(bbox)
    full_path = "images/logo-transparent.png"
    cropped_full.save(full_path)
    print(f"Saved combined logo: {full_path} | Size: {cropped_full.size}")

if __name__ == "__main__":
    make_transparent_and_crop()
