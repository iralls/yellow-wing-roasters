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

## 2. Embedded Script & Style Extraction

### Current State
Large blocks of inline CSS and JavaScript are embedded inside Markdown content files:
* [`roasts/build-your-own-blend.markdown`](roasts/build-your-own-blend.markdown): **322 lines of inline CSS** + **770 lines of inline JS** (blend ratio mixer, calculator, order dispatch).
* [`subscriptions/manage.markdown`](subscriptions/manage.markdown): **160 lines of inline CSS** + **275 lines of inline JS** (customer lookup, subscription pause/resume/cancel).
* [`order.markdown`](order.markdown): **470 lines of inline JS** (cart parsing, coupon/discount validation, Google Forms submission).
* [`gift.markdown`](gift.markdown): **510 lines of inline JS** (gift card selector, dynamic custom image dropdown, pricing).
* [`subscribe-form.markdown`](subscribe-form.markdown): **188 lines of inline JS** (frequency & size dynamic mapping).
* [`_includes/cart-indicator.html`](_includes/cart-indicator.html): **170 lines of inline JS** (cart dropdown flyout, localStorage listener).

### Solution
* Extract JavaScript logic into dedicated assets in `js/` (e.g. `js/cart.js`, `js/byob-mixer.js`, `js/manage-subscriptions.js`, `js/gift-order.js`).
* Extract page-specific CSS into separate SCSS partials in `_sass/`.
* **Benefits**: Browser caching for repeat visits, smaller HTML transfer size, proper IDE syntax highlighting, linting, and clear separation of presentation from logic.

---

## 3. SCSS Modularization (`_sass/` Partials)

### Current State
* [`css/main.scss`](css/main.scss) is a single monolithic file of 2,595 lines (down from 3,277 after dead code pruning).

### Solution
* Decompose `css/main.scss` into modular Sass partials under `_sass/`:
  - `_sass/_variables.scss`: Font definitions, brand color palette (`#f0c838`, `#2c1e14`, `#faf8f5`).
  - `_sass/_typography.scss`: Headings, base text styles.
  - `_sass/_header.scss` & `_sass/_nav.scss`: Brand header and dropdown menu.
  - `_sass/_cards.scss`: Roast card grid, hover overlays, status badges, optical sizing adjustments.
  - `_sass/_roast-detail.scss`: Minimal vertical layout, status banners, tasting notes, roast level dots.
  - `_sass/_cart.scss`: Floating cart indicator and dropdown flyout.
  - `_sass/_forms.scss`: Shared order form fields, pill radios, delivery options.
  - `_sass/_footer.scss`: Footer logo, est. 2026, newsletter input.
* `css/main.scss` becomes a clean 20-line manifest of `@import` directives.

---

## 4. Liquid Template & Card Deduplication

### Current State
* [`_flights/the-aviary.md`](_flights/the-aviary.md) repeats ~50 lines of card markup (mascot, overlay, dots, status) for each of its 4 blends rather than leveraging `_includes/roast-card.html`.
* Form submission dispatching across `order.markdown`, `roasts/byob.markdown`, `subscribe-form.markdown`, and `gift.markdown` duplicates Google Forms `fetch` POST logic and status message handling.

### Solution
* Refactor `the-aviary.md` to reuse `{% include roast-card.html roast=r %}`.
* Create a shared `_includes/form-handler.js` utility for Google Forms AJAX submissions.

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
