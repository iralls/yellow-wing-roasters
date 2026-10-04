#!/usr/bin/env python3
"""
Generate social media and Instagram images for Yellow Wing Roasters.
Uses high-resolution Audubon feather cutout and local Montserrat / Lora fonts.

Outputs:
  - images/social/instagram-avatar-cream.png       (1080x1080, 1:1, circle safe-zone)
  - images/social/instagram-avatar-dark.png        (1080x1080, 1:1, circle safe-zone)
  - images/social/instagram-post-portrait.png      (1080x1350, 4:5, standard feed post)
  - images/social/instagram-post-portrait-dark.png (1080x1350, 4:5, dark feed post)
  - images/social/instagram-post-square.png        (1080x1080, 1:1, square feed post)
  - images/social/instagram-story.png              (1080x1920, 9:16, stories / reels)
  - images/social/social-preview-og.png            (1200x630, 1.91:1, web link preview)
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

# Brand color palette
BG_CREAM = (250, 248, 245)       # #faf8f5 (site cream background)
BG_DARK = (44, 30, 20)           # #2c1e14 (espresso roast dark)
COLOR_GOLD_LIGHT = (235, 175, 25) # Warm gold legible on cream
COLOR_GOLD_DARK = (240, 200, 56)  # #f0c838 site gold on dark background
COLOR_DARK = (44, 30, 20)        # #2c1e14
COLOR_MUTED = (138, 112, 96)     # #8a7060
COLOR_LIGHT_TEXT = (240, 240, 240)
COLOR_MUTED_LIGHT = (200, 190, 180)

# Local font paths
FONT_MONTSERRAT = "fonts/montserrat-latin.woff2"
FONT_LORA = "fonts/lora-italic-latin.woff2"

# Output directory
OUTPUT_DIR = "images/social"

def get_feather_source():
    # Prefer uncompressed 32-bit RGBA master cutout (407x1409) over web-optimized 8-bit
    candidates = [
        "assets/source-plates/cutouts/audubon-feather-transparent.png",
        "images/audubon-feather-transparent.png"
    ]
    for p in candidates:
        if os.path.exists(p):
            return Image.open(p).convert("RGBA")
    raise FileNotFoundError("Could not locate audubon-feather-transparent.png")

def get_fonts(title_size, sub_size, tag_size):
    f_title = ImageFont.truetype(FONT_MONTSERRAT, title_size)
    f_title.set_variation_by_axes([900])  # Montserrat Black / 900
    
    f_sub = ImageFont.truetype(FONT_MONTSERRAT, sub_size)
    f_sub.set_variation_by_axes([600])    # Montserrat Medium-SemiBold
    
    f_tag = ImageFont.truetype(FONT_LORA, tag_size)
    return f_title, f_sub, f_tag

def render_spaced_text(draw, text, cx, y, font, fill, tracking=0):
    chars = list(text)
    char_widths = []
    for c in chars:
        bbox = draw.textbbox((0, 0), c, font=font)
        char_widths.append(bbox[2] - bbox[0])
    total_w = sum(char_widths) + tracking * (len(chars) - 1)
    
    cur_x = cx - (total_w / 2.0)
    for i, c in enumerate(chars):
        draw.text((cur_x, y), c, font=font, fill=fill)
        cur_x += char_widths[i] + tracking

def resize_feather(feather, target_h):
    aspect = feather.width / feather.height
    target_w = int(target_h * aspect)
    return feather.resize((target_w, target_h), Image.Resampling.LANCZOS)

def create_avatar(feather, bg_color, output_path):
    """1080x1080 Profile Picture: scaled to 940px to prominently fill the circle crop."""
    img = Image.new("RGBA", (1080, 1080), bg_color)
    target_h = 940
    f_resized = resize_feather(feather, target_h)
    x = (1080 - f_resized.width) // 2
    # Optical center adjustment: -10px vertically so the fuller plume is centered
    y = (1080 - target_h) // 2 - 10
    img.paste(f_resized, (x, y), f_resized)
    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path} (1080x1080 - feather height: {target_h}px)")

def create_portrait_post(feather, output_path, bg_color=BG_CREAM, dark_mode=False):
    """1080x1350 4:5 Portrait: Ideal aspect ratio for Instagram mobile feed."""
    img = Image.new("RGBA", (1080, 1350), bg_color)
    draw = ImageDraw.Draw(img)
    f_title, f_sub, f_tag = get_fonts(64, 30, 30)
    
    target_h = 720
    f_resized = resize_feather(feather, target_h)
    start_y = 160
    f_x = (1080 - f_resized.width) // 2
    img.paste(f_resized, (f_x, start_y), f_resized)
    
    gold_col = COLOR_GOLD_DARK if dark_mode else COLOR_GOLD_LIGHT
    sub_col = COLOR_LIGHT_TEXT if dark_mode else COLOR_DARK
    tag_col = COLOR_MUTED_LIGHT if dark_mode else COLOR_MUTED
    
    text_y = start_y + target_h + 50
    render_spaced_text(draw, "YELLOW WING", 540, text_y, f_title, gold_col, tracking=10)
    render_spaced_text(draw, "ROASTERS", 540, text_y + 75, f_sub, sub_col, tracking=16)
    draw.text((540, text_y + 140), "Small-batch coffee roasting.", font=f_tag, fill=tag_col, anchor="mt")
    
    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path} (1080x1350)")

def create_square_post(feather, output_path, bg_color=BG_CREAM, dark_mode=False):
    """1080x1080 1:1 Square Feed Post."""
    img = Image.new("RGBA", (1080, 1080), bg_color)
    draw = ImageDraw.Draw(img)
    f_title, f_sub, f_tag = get_fonts(54, 26, 26)
    
    target_h = 560
    f_resized = resize_feather(feather, target_h)
    start_y = 130
    f_x = (1080 - f_resized.width) // 2
    img.paste(f_resized, (f_x, start_y), f_resized)
    
    gold_col = COLOR_GOLD_DARK if dark_mode else COLOR_GOLD_LIGHT
    sub_col = COLOR_LIGHT_TEXT if dark_mode else COLOR_DARK
    tag_col = COLOR_MUTED_LIGHT if dark_mode else COLOR_MUTED
    
    text_y = start_y + target_h + 40
    render_spaced_text(draw, "YELLOW WING", 540, text_y, f_title, gold_col, tracking=8)
    render_spaced_text(draw, "ROASTERS", 540, text_y + 64, f_sub, sub_col, tracking=14)
    draw.text((540, text_y + 118), "Small-batch coffee roasting.", font=f_tag, fill=tag_col, anchor="mt")
    
    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path} (1080x1080)")

def create_story(feather, output_path, bg_color=BG_CREAM, dark_mode=False):
    """1080x1920 9:16 Stories & Reels cover with safe zones."""
    img = Image.new("RGBA", (1080, 1920), bg_color)
    draw = ImageDraw.Draw(img)
    f_title, f_sub, f_tag = get_fonts(68, 32, 32)
    
    target_h = 840
    f_resized = resize_feather(feather, target_h)
    start_y = 380
    f_x = (1080 - f_resized.width) // 2
    img.paste(f_resized, (f_x, start_y), f_resized)
    
    gold_col = COLOR_GOLD_DARK if dark_mode else COLOR_GOLD_LIGHT
    sub_col = COLOR_LIGHT_TEXT if dark_mode else COLOR_DARK
    tag_col = COLOR_MUTED_LIGHT if dark_mode else COLOR_MUTED
    
    text_y = start_y + target_h + 60
    render_spaced_text(draw, "YELLOW WING", 540, text_y, f_title, gold_col, tracking=10)
    render_spaced_text(draw, "ROASTERS", 540, text_y + 80, f_sub, sub_col, tracking=16)
    draw.text((540, text_y + 148), "Small-batch coffee roasting.", font=f_tag, fill=tag_col, anchor="mt")
    
    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path} (1080x1920)")

def create_og_card(feather, output_path, bg_color=BG_CREAM, dark_mode=False):
    """1200x630 1.91:1 Open Graph landscape preview card."""
    img = Image.new("RGBA", (1200, 630), bg_color)
    draw = ImageDraw.Draw(img)
    f_title, f_sub, f_tag = get_fonts(44, 20, 22)
    
    target_h = 320
    f_resized = resize_feather(feather, target_h)
    start_y = 65
    f_x = (1200 - f_resized.width) // 2
    img.paste(f_resized, (f_x, start_y), f_resized)
    
    gold_col = COLOR_GOLD_DARK if dark_mode else COLOR_GOLD_LIGHT
    sub_col = COLOR_LIGHT_TEXT if dark_mode else COLOR_DARK
    tag_col = COLOR_MUTED_LIGHT if dark_mode else COLOR_MUTED
    
    text_y = start_y + target_h + 28
    render_spaced_text(draw, "YELLOW WING", 600, text_y, f_title, gold_col, tracking=7)
    render_spaced_text(draw, "ROASTERS", 600, text_y + 52, f_sub, sub_col, tracking=13)
    draw.text((600, text_y + 98), "Small-batch coffee roasting.", font=f_tag, fill=tag_col, anchor="mt")
    
    img.save(output_path, "PNG", optimize=True)
    print(f"  ✓ {output_path} (1200x630)")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    feather = get_feather_source()
    print(f"Generating social media images using feather ({feather.width}x{feather.height})...")
    
    create_avatar(feather, BG_CREAM, os.path.join(OUTPUT_DIR, "instagram-avatar-cream.png"))
    create_avatar(feather, BG_DARK, os.path.join(OUTPUT_DIR, "instagram-avatar-dark.png"))
    create_portrait_post(feather, os.path.join(OUTPUT_DIR, "instagram-post-portrait.png"))
    create_portrait_post(feather, os.path.join(OUTPUT_DIR, "instagram-post-portrait-dark.png"), bg_color=BG_DARK, dark_mode=True)
    create_square_post(feather, os.path.join(OUTPUT_DIR, "instagram-post-square.png"))
    create_story(feather, os.path.join(OUTPUT_DIR, "instagram-story.png"))
    create_og_card(feather, os.path.join(OUTPUT_DIR, "social-preview-og.png"))
    
    print(f"\nAll images successfully generated in {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
