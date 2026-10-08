---
name: image-assets-and-cutouts
description: >-
  Standards for image asset management, differences between the assets/ and images/ directories,
  and step-by-step procedures for creating high-precision, transparent, cropped cutouts from source plates.
---

# Image Assets & Cutout Standards

This skill documents the directory architecture for visual media across Yellow Wing Roasters, the distinct roles of `assets/` versus `images/`, and the standard pipeline for extracting transparent, cropped cutouts from vintage Audubon plates and illustrations.

---

## 1. Directory Roles: `assets/` vs `images/`

The repository strictly separates **archival master media** from **production web media**:

| Property | `assets/source-plates/` (and `assets/`) | `images/` |
| :--- | :--- | :--- |
| **Purpose** | Archival master source files & raw artwork | Production web-served images |
| **Resolution** | Unconstrained full scan / camera resolution | Max 800×800 bounding box (Lanczos) |
| **Color Depth** | Lossless RGBA (32-bit) / High-quality JPEG | Quantized 256 colors (`FASTOCTREE`) with alpha |
| **Serving** | Master source only; not served directly on web pages | Directly served via Jekyll at `/images/...` |
| **Subdirectories** | `source-plates/`, `source-plates/cutouts/` | `patterns/`, `social/`, `build-a-bird/` |

### Where Files Belong

1. **`assets/source-plates/`**:
   - Master scan plates in original resolution (e.g., `assets/source-plates/owl-lost.jpg`, `assets/source-plates/peck-your-own.jpg`).
   - Vector plates and assets (e.g., `assets/source-plates/owl.svg`).
2. **`assets/source-plates/cutouts/`**:
   - Master full-resolution RGBA cutouts cropped to the subject's exact bounding box (e.g., `assets/source-plates/cutouts/owl-lost-transparent.png`).
   - High-resolution master aliases (e.g., `assets/source-plates/cutouts/audubon-owl-lost-transparent.png`).
3. **`images/`**:
   - Optimized web cutouts (max 800×800, 256 colors, e.g., `images/owl-lost-transparent.png`).
   - Standard aliases for web usage (e.g., `images/audubon-owl-lost-transparent.png`).
   - Site thumbnails, logos, quiz icons, and UI assets.

---

## 2. Naming & Alias Conventions

To maintain backward compatibility with templates, quiz logic, and site components:

- **Semantic Cutout**: `<subject>-transparent.png` (e.g., `owl-lost-transparent.png`, `bird-on-spit-transparent.png`).
- **Audubon Alias**: `audubon-<subject>-transparent.png` (e.g., `audubon-owl-lost-transparent.png`, `audubon-bird-on-spit-transparent.png`).
- **Original Source**: Saved as `<subject>.jpg` in both `images/` (if placed there by the user) and archived to `assets/source-plates/<subject>.jpg`.

---

## 3. Web Optimization Standards (`images/`)

Any PNG saved into `images/` must adhere to the optimization rules in `scripts/optimize_web_images.py`:

```python
MAX_WEB_DIM = (800, 800)

# 1. Constrain dimensions with Lanczos resampling
web_im = master.copy()
web_im.thumbnail(MAX_WEB_DIM, Image.Resampling.LANCZOS)

# 2. Quantize to 256 colors using Fast Octree with alpha preservation
web_quant = web_im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

# 3. Save with optimization enabled
web_quant.save(web_path, format="PNG", optimize=True)
```

Target file size for web cutouts is typically under **150 KB** (most are 60–100 KB).

---

## 4. Cutout Extraction Pipeline

Audubon plates feature aged cream paper, vignetting, soft watercolor washes, inked cross-hatching, and white plumage highlights. A naive background removal (or generic chroma key) creates holes in birds' bellies, deletes fine twigs, clips watercolor washes, or leaves dirty yellow halos.

Follow this multi-stage pipeline (implemented in `scripts/process_*_cutout.py`):

### Stage 1: 2D Polynomial Background Surface Fitting
Never use a constant RGB background color. Audubon paper has subtle lighting and aging gradients across the sheet:

```python
# 1. Sample clean margin pixels across corners, top, bottom, and outer edges
# (Filter out text, plate stamps, and foxing specks with vals.mean(axis=1) > 230)
# 2. Fit a 2D polynomial (degree 2 or 3): S(x, y) = c0 + c1*x + c2*y + c3*x^2 + c4*y^2 + c5*x*y
bg_surf = np.zeros_like(arr)
for c in range(3):
    coeffs, _, _, _ = np.linalg.lstsq(A, sample_vals[:, c], rcond=None)
    bg_surf[:, :, c] = (all_A @ coeffs).reshape(h, w)

# Euclidean color distance to the fitted paper surface:
diff = np.sqrt(np.sum((arr - bg_surf) ** 2, axis=2))
```

### Stage 2: Artwork ROI & Marginalia Exclusion
Define an explicit Region of Interest (`roi`) to discard plate inscriptions, engraver imprints, plate numbers, and outer binding borders:
- Exclude top-right plate numbers (e.g., `Plate CCLXXII`).
- Exclude bottom text (e.g., `Little Owl / ATHENE NOCTUA.` or Lizars imprints).

### Stage 3: Plumage & Solid Structure Protection
White plumage (e.g., owl breast, chickadee cheeks, dove chests) often has colors nearly identical to the paper background (`diff < 2`). To prevent transparent pinholes:
- Identify dark inked contour outlines: `is_ink = (gray < 190) & roi`.
- Flood-fill from the exterior boundary of the subject bounding box to find interior plumage.
- Set `alpha[subject_solid] = 255.0` to guarantee 100% opacity for the animal/subject body.

### Stage 4: Fine Feature & Line Work Preservation
Delicate details like bare twigs, wires, and whiskers are narrow lines (1–3 pixels wide).
- Identify ink strokes within the feature zone (`gray < 195`).
- Dilate the feature zone by 1–2 pixels using `ImageFilter.MaxFilter(5)`.
- Use a dedicated alpha ramp for ink lines to guarantee they do not get erased even when light:
  `alpha[feature_zone] = np.maximum(alpha[feature_zone], np.clip((225 - gray) / 35.0, 0, 1) * 255.0)`

### Stage 5: Watercolor Wash Feathering
For soft background washes (moss, hills, clouds):
- Blur the color distance (`diff_blur = GaussianBlur(3.0)`) to separate continuous watercolor pigment from isolated 1-pixel paper grain specks.
- Find the connected wash core (`diff_blur > 20.0`), connected to the subject.
- Create a dilated envelope (`ImageFilter.MaxFilter`) to allow soft feathering at the outer boundary.
- Calculate continuous alpha: `alpha = np.clip((diff - low_t) / (high_t - low_t), 0.0, 1.0) * 255.0` (typically `low_t = 10.0`, `high_t = 28.0`).

### Stage 6: Color De-Fringing / Unblending
Crucial step to prevent dirty or cream-colored halos on dark or colored backgrounds:
Algebraically invert the alpha compositing formula:
$$C_{\text{unblend}} = \frac{C_{\text{pixel}} - (1 - \alpha) C_{\text{bg}}}{\alpha}$$

```python
alpha_norm = alpha_smooth / 255.0
transparent_arr = np.zeros((h, w, 4), dtype=float)
for c in range(3):
    bg_c = bg_surf[:, :, c]
    unblended = (arr[:, :, c] - (1.0 - alpha_norm) * bg_c) / np.maximum(alpha_norm, 0.001)
    transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
transparent_arr[:, :, 3] = alpha_smooth
```

### Stage 7: Bounding Box Auto-Crop
Crop tightly to non-transparent pixels:
```python
out_img = Image.fromarray(transparent_arr.astype(np.uint8), mode="RGBA")
bbox = out_img.getbbox()
master = out_img.crop(bbox)
```

---

## 5. Canonical Script & Specialized Recipes

### Canonical Cutout Script
A complete, parameterized implementation of the full 7-stage pipeline is available at:
[`scripts/extract_cutout.py`](file:///Users/ianr/Documents/yellow-wing-roasters/.agents/skills/image-assets-and-cutouts/scripts/extract_cutout.py)

Usage:
```bash
python3 .agents/skills/image-assets-and-cutouts/scripts/extract_cutout.py path/to/source-plate.jpg subject-name
```
This automatically produces the master 32-bit RGBA cutouts in `assets/source-plates/cutouts/`, the 800×800 FastOctree web cutouts in `images/`, and sets up the standard `audubon-*` aliases.

### Specialized Recipe A: Multi-Part Sheet Slicing
When a single plate contains multiple independent components (such as the Build-a-Bird sheet):
```python
PART_BOXES = [
    ("toucan-head", (190, 140, 785, 460)),
    ("barn-owl-head", (860, 130, 1265, 535)),
    ("scarlet-macaw-wing", (390, 490, 1185, 915)),
    ("flamingo-leg", (290, 800, 575, 1415)),
]

for part_name, (x1, y1, x2, y2) in PART_BOXES:
    part_crop = transparent_im.crop((x1, y1, x2, y2))
    p_bbox = part_crop.getbbox()
    if p_bbox:
        part_final = part_crop.crop(p_bbox)
        part_final.save(f"images/parts/{part_name}-transparent.png")
```

### Specialized Recipe B: Thin Metallic Linework & Wires
For mechanical objects, spit wires, or burner hardware where thin 1–2px dark metal lines must not be erased:
```python
# Use tight dark ink detection with minimal dilation to preserve wire geometry without blooming halos
is_wire = (gray < 185) & roi
wire_im = Image.fromarray((is_wire.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))
wire_zone = np.array(wire_im) > 0
# Force solid alpha on wire strokes while anti-aliasing adjacent pixels
alpha[is_wire] = 255.0
alpha[wire_zone & (gray < 215)] = np.maximum(
    alpha[wire_zone & (gray < 215)],
    np.clip((215 - gray[wire_zone & (gray < 215)]) / 30.0, 0, 1) * 255.0
)
```

### Specialized Recipe C: Flat-Color UI Graphics & Logos
For computer-generated graphics or logos on a known uniform solid color (e.g. site cream `#faf8f5`):
```python
bg_color = np.array([250.0, 248.0, 245.0])
dist = np.sqrt(np.sum((arr[:, :, :3] - bg_color) ** 2, axis=2))
low_thresh, high_thresh = 6.0, 35.0
alpha = np.clip((dist - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0) * 255.0

# Invert blending to remove cream fringe
for c in range(3):
    unblended = (arr[:, :, c] - (1.0 - alpha_norm) * bg_color[c]) / np.maximum(alpha_norm, 0.001)
    transparent_arr[:, :, c] = np.clip(unblended, 0, 255)
```

### Specialized Recipe D: Automatic Plate Border / Frame Trimming
When processing plates with rectangular frames or borders:
```python
# Downscale strong contrast mask to detect and extract only the primary central connected component
strong = dist > (high_thresh * 0.85)
scale = 4
down = Image.fromarray((strong * 255).astype(np.uint8)).resize((w // scale, h // scale))
down = down.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
# Component analysis selects the largest central cluster, ignoring outer margin borders
```

---

## 6. Checklist When Processing a New Plate

1. [ ] Check if the source plate is in `assets/source-plates/<name>.jpg`. If only in `images/`, archive a copy to `assets/source-plates/`.
2. [ ] Identify plate marginalia (plate number at top, plate title / Latin name at bottom) to exclude from the ROI.
3. [ ] Check subject interior for white highlights (cheeks, belly, highlights) that need contour hole-filling.
4. [ ] Check for fine peripheral details (twigs, antennae, wires) that need fine-feature preservation.
5. [ ] Check if the background includes soft watercolor washes that need continuous alpha ramps.
6. [ ] Save master unconstrained RGBA cutouts to `assets/source-plates/cutouts/` (both `<name>-transparent.png` and `audubon-<name>-transparent.png`).
7. [ ] Save web-optimized versions (max 800×800, 256 colors `FASTOCTREE`) to `images/` (both `<name>-transparent.png` and `audubon-<name>-transparent.png`).
8. [ ] Test transparency on both pure `#FFFFFF` and dark `#282c34` backgrounds to confirm zero haloing and no holes in plumage.
9. [ ] Run or reference `.agents/skills/image-assets-and-cutouts/scripts/extract_cutout.py` (do not leave temporary one-off scripts in root `scripts/`).

