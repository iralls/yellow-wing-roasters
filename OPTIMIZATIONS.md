# Yellow Wing Roasters — Optimization & Architecture Roadmap

This document catalogs technical, architectural, and performance optimizations for the Yellow Wing Roasters Jekyll static site.

---

## 1. Asset & Media Optimization (Completed: ~565 MB Reduction)

### Status: Completed
* **Source Asset Isolation**: Moved 118 unreferenced raw plate scans, high-res lithographs, unedited camera JPEGs, and duplicate assets (totaling 473.5 MB) into `assets/source-plates/`.
* **Full-Quality Master Cutouts**: Extracted all 63 original full-resolution (up to 2600px wide, uncompressed 32-bit RGBA) transparent cutout masters (131.8 MB) into `assets/source-plates/cutouts/`. Every roast has both its raw plate scan and its full-resolution cutout master preserved in the repo.
* **Jekyll Build Configuration**: Added `assets/source-plates` and `OPTIMIZATIONS.md` to `exclude:` in `_config.yml` so Jekyll ignores the archive during builds.
* **Active Mascot Compression**: Resized all 43 active transparent web mascots in `images/` to max 800×800 bounding boxes using Lanczos resampling and 256-color Fast Octree palette quantization with full alpha preservation.
* **Results**:
  - `images/` shrunk from **96.8 MB to 5.3 MB** (94.5% reduction).
  - Built site images (`_site/images/`) shrunk from **~570 MB to 5.3 MB** (~99% reduction).
  - Jekyll build time dropped to **under 1.0 second** (`0.96s`).
  - Total `_site` output size reduced from over **580 MB to 7.4 MB**.

---

## 2. Embedded Script & Style Extraction (Completed)

### Status: Completed
* **Extracted JavaScript Modules**:
  - `js/cart.js`: Shared cart dropdown, floating badge counter, local storage listener, and quick-add handlers. Saved ~240 lines of duplicate script from every page.
  - `js/byob-mixer.js`: Interactive blend ratio calculator, bean selector, recipe serializer, and order dispatching.
  - `js/gift-order.js`: Custom product dropdown with image thumbnails, digital gift card code generator, and submission mapping.
  - `js/manage-subscriptions.js`: Subscription lookup, mock cache fallback, pause, resume, and cancellation flows.
  - `js/order-checkout.js`: Cart parsing, coupon/discount validation API caller, and checkout dispatch.
  - `js/subscribe-form.js`: Dynamic size/frequency population, status notifications, and delivery method controls.
* **Extracted CSS into `_sass/`**:
  - Moved BYOB mixer workspace styles into `_sass/_byob.scss`.
  - Moved Subscription lookup card styles into `_sass/_manage-subscriptions.scss`.
* **Results**: Deleted **over 2,500 lines of inline code** from Markdown files. Content files are now clean, readable, and properly decoupled from presentation and logic.

---

## 3. SCSS Modularization (`_sass/` Partials) (Completed)

### Status: Completed
* Decomposed the monolithic 2,595-line `css/main.scss` into 14 focused Sass partials under `_sass/`:
  - `_sass/_fonts.scss`: Self-hosted `@font-face` definitions (Lora & Montserrat variable fonts).
  - `_sass/_variables.scss`: Typography variables and brand color palette (`$color-cream`, `$color-dark`, `$color-gold`).
  - `_sass/_base.scss`: Base resets, container widths, headings, typography.
  - `_sass/_nav.scss`: Site header, brand title, responsive dropdown menu.
  - `_sass/_cards.scss`: Catalog grid, `.roasts-entry` cards, hover overlays, price layouts.
  - `_sass/_badges.scss`: Unified roast status badges, featured flags, and tags.
  - `_sass/_roast-detail.scss`: Minimal vertical layout (`.roast-minimal-vertical`), tasting note chips, origin pills, roast level dots.
  - `_sass/_cart.scss`: Floating bag trigger, item count indicator, flyout drawer.
  - `_sass/_hero.scss`: Index hero ("The Perch") banner and CTA.
  - `_sass/_flights.scss`: The Aviary cards and Peck Your Own flight picker.
  - `_sass/_gift.scss`: Gift cards, custom thumbnail selector, price displays.
  - `_sass/_byob.scss`: Build-Your-Own-Blend mixer workspace and interactive sliders.
  - `_sass/_manage-subscriptions.scss`: Subscription lookup card, status badges, cancellation modal.
  - `_sass/_footer.scss`: Footer layout, est. 2026 seal, copyright text.
* `css/main.scss` is now a clean 31-line manifest of `@import` directives.
* Jekyll build time remains **under 0.9 seconds**.

---

## 4. Liquid Template & Card Deduplication (Completed)

### Status: Completed
* Enhanced `_includes/roast-card.html` with optional `card_class`, `hide_price`, and `hide_quick_add` controls, plus `loading="lazy"` and `decoding="async"` attributes.
* Refactored `_flights/the-aviary.md` to reuse `_includes/roast-card.html`, deleting 47 lines of duplicate card markup while preserving exact styling and behavior.

---

## 5. Backlog & Business Logic Audits (`TODO.txt`)

### Current Status of Items
1. **Disable preview bags from showing**: **Completed** (excluded in `_config.yml` under `preview-*.html` and `*-preview.html`).
2. **The Aviary ready to order**: **Completed** (cart integration, $38 price, and grind selector active).
3. **Subscription Gifting Eligibility**: **Actionable Improvement**.
   - In `gift.markdown`, coffees that do not support recurring subscriptions (e.g. `ethiopia-wush-wush` or roasts marked `mid_molt` / `flown_south`) should not appear in the subscription gift selection.
   - Filter dropdown by `r.subscription != false` and `site.data.statuses[r.status].subscribable != false`.
4. **Roasts Dropdown Filter**: **Completed** (`/roasts/` features Type, Origin, Roast Level, and Brewing Method filters).
5. **Single Price Display on Cards**: **Completed** (Cards show clean single price; size breakdown is reserved for detail pages).

---

## 6. SEO & Performance Fine-Tuning

1. **Cache-Busting Asset Versioning**:
   - Append `?v={{ site.time | date: '%s' }}` to `main.css` link tags to prevent stale CSS caching across browser sessions.
2. **Structured Data (Schema.org)**:
   - Enhance JSON-LD structured data on detail pages to include `Product` and `Offer` schemas with accurate price, currency, and availability (`InStock` vs `OutOfStock` derived from `page.status`).
3. **Responsive Image Loading**:
   - Add `loading="lazy"` to below-the-fold catalog card images and decoding="async".
