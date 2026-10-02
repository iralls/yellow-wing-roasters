# Yellow Wing Roasters — DRY & Codebase Optimization Overview

This document outlines architectural and code-level optimization opportunities across the Yellow Wing Roasters Jekyll codebase, focusing on **DRY (Don't Repeat Yourself)** principles: eliminating duplicated markup, centralizing recurring data into `_data/`, consolidating CSS/SASS rules, removing inline styles, and sharing common JavaScript patterns.

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Liquid Templates & Jekyll Layouts (High Impact)](#2-liquid-templates--jekyll-layouts-high-impact)
   - [2.1 Category Pages Layout Consolidation](#21-category-pages-layout-consolidation)
   - [2.2 Status-Partitioned Roast Sorting Include](#22-status-partitioned-roast-sorting-include)
   - [2.3 Roast Level & Dots Component](#23-roast-level--dots-component)
   - [2.4 Grind Selector Dropdown](#24-grind-selector-dropdown)
   - [2.5 Minimal-Vertical Page Hero Layout](#25-minimal-vertical-page-hero-layout)
   - [2.6 Lazy Susan Animation Component](#26-lazy-susan-animation-component)
   - [2.7 Checkout & Intake Form Snippets](#27-checkout--intake-form-snippets)
3. [CSS & SASS Consolidations (High Impact)](#3-css--sass-consolidations-high-impact)
   - [3.1 Eliminating 790+ Inline Styles](#31-eliminating-790-inline-styles)
   - [3.2 Form Label Alignment Conflict](#32-form-label-alignment-conflict)
   - [3.3 Sass Maps for Category Theming](#33-sass-maps-for-category-theming)
   - [3.4 Reusable Button / Pill Mixin](#34-reusable-button--pill-mixin)
   - [3.5 Backdrop Blur Mixin](#35-backdrop-blur-mixin)
4. [Data Centralization (`_data/`)](#4-data-centralization-_data)
   - [4.1 `_data/grind_levels.yml`](#41-_datagrind_levelsyml)
   - [4.2 `_data/brewing_methods.yml`](#42-_databrewing_methodsyml)
   - [4.3 `_data/google_form_fields.yml`](#43-_datagoogle_form_fieldsyml)
5. [JavaScript Modularization](#5-javascript-modularization)
   - [5.1 Shared Cart Parsing & Storage (`parseCartItem`)](#51-shared-cart-parsing--storage-parsecartitem)
   - [5.2 Unified Google Form Iframe Submissions](#52-unified-google-form-iframe-submissions)
6. [Repository Hygiene & File Organization](#6-repository-hygiene--file-organization)
7. [Prioritized Implementation Matrix](#7-prioritized-implementation-matrix)

---

## 1. Executive Summary

A comprehensive scan of the repository reveals that while the visual presentation and customer experience are highly polished, the underlying code contains significant structural duplication across several layers:

* **Templates**: Category landing pages (`/blends/`, `/single-origins/`, `/seasonals/`) are ~90% identical copies of one another. The 6-line status partitioning algorithm (`active` $\rightarrow$ `incubating` $\rightarrow$ `flown_south`) is repeated across 4 files (6 times total).
* **Styles**: Over **790 inline `style="..."` attributes** are embedded in Markdown and HTML files, largely due to CSS scoping conflicts (such as `.roast-mv-meta-label` forcing `text-align: center`).
* **Components**: Key visual patterns—the 5-dot roast level indicator, the grind selector dropdown, the "Lazy Susan" rotating birds animation, and delivery radio pill pickers—are hand-coded separately in 4 to 8 templates each.
* **JavaScript**: Cart storage and string-key parsing logic are duplicated across `cart.js` and `order-checkout.js`.

Addressing these opportunities will substantially reduce code footprint, streamline future feature work, and eliminate inconsistencies when modifying branding or data structures.

---

## 2. Liquid Templates & Jekyll Layouts (High Impact)

### 2.1 Category Pages Layout Consolidation
* **Current State**: [blends.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/blends.markdown), [single-origins.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/single-origins.markdown), and [seasonals.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/seasonals.markdown) repeat identical markup:
  ```liquid
  {% assign all_roasts = site.roasts | sort: "order" %}
  {% assign cat_roasts = all_roasts | where: "category", "..." %}
  {% assign cat_active = cat_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
  {% assign cat_incubating = cat_roasts | where_exp: "item", "item.status == 'incubating'" %}
  {% assign cat_flown = cat_roasts | where_exp: "item", "item.status == 'flown_south'" %}
  {% assign cat_roasts = cat_active | concat: cat_incubating | concat: cat_flown %}

  <div class="roasts-grid">
  {% for r in cat_roasts %}
    {% include roast-card.html roast=r %}
  {% endfor %}
  </div>
  ```
* **DRY Solution**: Create a single `_layouts/category.html`:
  ```liquid
  ---
  layout: default
  ---
  <h1>{{ page.title }}</h1>
  {% if page.intro %}<p class="category-intro">{{ page.intro }}</p>{% endif %}

  {% assign all_roasts = site.roasts | sort: "order" %}
  {% assign cat_roasts = all_roasts | where: "category", page.category %}
  {% assign cat_active = cat_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
  {% assign cat_incubating = cat_roasts | where_exp: "item", "item.status == 'incubating'" %}
  {% assign cat_flown = cat_roasts | where_exp: "item", "item.status == 'flown_south'" %}
  {% assign roasts_to_render = cat_active | concat: cat_incubating | concat: cat_flown %}

  <div class="roasts-grid">
    {% for r in roasts_to_render %}
      {% include roast-card.html roast=r %}
    {% endfor %}
  </div>
  ```
  Each page then reduces to just 6 lines of YAML frontmatter:
  ```markdown
  ---
  layout: category
  title: Blends
  permalink: /blends/
  category: blend
  intro: "Our signature and everyday blends..."
  ---
  ```

---

### 2.2 Status-Partitioned Roast Sorting Include
* **Current State**: The 3-tier partitioning logic (`active` $\rightarrow$ `incubating` $\rightarrow$ `flown_south`) is duplicated 6 times across [roasts/index.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/roasts/index.markdown#L68-L84), [blends.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/blends.markdown#L11-L16), [single-origins.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/single-origins.markdown#L11-L16), and [seasonals.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/seasonals.markdown#L11-L16).
* **DRY Solution**: If kept modular, extract into `_includes/partition-roasts.html`:
  ```liquid
  {% comment %}
    Usage: {% include partition-roasts.html category="blend" assign_to="blends" %}
  {% endcomment %}
  ```
  Or use the unified category layout from 2.1.

---

### 2.3 Roast Level & Dots Component
* **Current State**: The 5-dot visual level indicator and roast level label lookup logic is repeated in:
  1. [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L51-L66)
  2. [_includes/roast-card.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-card.html#L2-L12) & [lines 102–113](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-card.html#L102-L113)
  3. [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md#L50-L60) & [lines 83–93](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md#L83-L93)
  4. [_custom/bring-your-own-burner.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md#L50-L56)
* **DRY Solution**: Create `_includes/roast-dots.html`:
  ```liquid
  {% assign lvl_key = include.level | append: "" %}
  {% assign info = site.data.roast_levels[include.level] | default: site.data.roast_levels[lvl_key] %}
  {% assign dots = info.dots | default: include.dots | default: 0 %}
  {% assign label = info.specialty | default: info.name %}

  <div class="roast-dots-wrap{% if include.class %} {{ include.class }}{% endif %}">
    <span class="roast-dots">
      {% for i in (1..5) %}
        <span class="roast-dot{% if dots >= i %} roast-dot-{{ i }}{% endif %}"></span>
      {% endfor %}
    </span>
    {% if include.show_label and label %}
      <span class="roast-dots-label">{{ label }}</span>
    {% endif %}
  </div>
  ```
  Notice that `{% for i in (1..5) %}` also replaces 5 manually written `<span class="roast-dot...">` elements with a 3-line loop.

---

### 2.4 Grind Selector Dropdown
* **Current State**: This identical `<select>` options block is copy-pasted in **7 files**:
  * [_flights/the-aviary.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/the-aviary.md#L46-L52)
  * [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md#L127-L133)
  * [_custom/bring-your-own-beans.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-beans.md#L75-L81)
  * [_custom/bring-your-own-burner.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md#L86-L92)
  * [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L248-L254)
  * [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html)
  * [order.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/order.markdown)
  ```html
  <option value="Whole Bean" selected>Whole Bean</option>
  <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
  <option value="Coarser — French Press">Coarser — French Press</option>
  <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
  <option value="Finer — Pour Over">Finer — Pour Over</option>
  <option value="Finest — Espresso">Finest — Espresso</option>
  ```
* **DRY Solution**: Define grind options once in `_data/grinds.yml` and render via `_includes/grind-select.html`:
  ```liquid
  <select id="{{ include.id | default: 'grind-select' }}" name="{{ include.name }}" class="subscribe-select">
    {% for g in site.data.grinds %}
      <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
    {% endfor %}
  </select>
  ```

---

### 2.5 Minimal-Vertical Page Hero Layout
* **Current State**: The `.roast-minimal-vertical` page header (top divider, bird wrap, title, subtitle, tasting intro, bottom divider) is duplicated across:
  * `_layouts/subscription.html`
  * `_flights/the-aviary.md`
  * `_flights/peck-your-own.md`
  * `_custom/bring-your-own-beans.md`
  * `_custom/bring-your-own-burner.md`
  * `_custom/build-your-own-blend.md`
  * `order.markdown`
* **DRY Solution**: Create a layout `_layouts/detail-page.html` (which extends `default.html`):
  ```liquid
  ---
  layout: default
  ---
  <div class="roast-minimal-vertical">
    <div class="roast-mv-divider"></div>
    {% if page.mascot_file %}
      <div class="roast-mv-center roast-mv-bird-wrap">
        <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" alt="{{ page.mascot_alt | default: page.title | escape }}" class="roast-mv-bird" fetchpriority="high">
        {% if page.mascot_label %}<div class="roast-mv-bird-label">{{ page.mascot_label }}</div>{% endif %}
      </div>
    {% endif %}
    <h1 class="roast-mv-title">{{ page.title }}</h1>
    {% if page.subtitle %}<div class="roast-mv-subtitle">{{ page.subtitle }}</div>{% endif %}
    {% if page.intro %}<p class="roast-mv-tasting">{{ page.intro }}</p>{% endif %}
    <div class="roast-mv-divider"></div>
    {{ content }}
  </div>
  ```

---

### 2.6 Lazy Susan Animation Component
* **Current State**: The 25-line nested HTML structure for the rotating Audubon trio (cardinal, goldfinch, bluebird) with graduated perspective dots is copy-pasted in 4 places:
  * [_includes/custom-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/custom-cards.html#L5-L21)
  * [_includes/flight-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/flight-cards.html#L5-L21)
  * [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L13-L29)
  * [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md#L16-L32)
* **DRY Solution**: Extract to `_includes/lazy-susan.html`:
  ```liquid
  {% assign variant = include.variant | default: "card" %}
  <div class="{% if variant == 'hero' %}hero-susan-wrap{% else %}lazy-susan-container{% endif %}">
    <div class="{% if variant == 'hero' %}susan-track--hero{% else %}lazy-susan-track{% endif %}">
      <div class="susan-dots susan-dots--grad-left" aria-hidden="true">
        <span class="susan-dot"></span><span class="susan-dot"></span><span class="susan-dot"></span>
      </div>
      <div class="susan-birds {% if variant == 'hero' %}susan-birds--hero{% else %}susan-birds--depth{% endif %}">
        <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
        <img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-center" loading="lazy" decoding="async">
        <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
      </div>
      <div class="susan-dots susan-dots--grad-right" aria-hidden="true">
        <span class="susan-dot"></span><span class="susan-dot"></span><span class="susan-dot"></span>
      </div>
    </div>
  </div>
  ```

---

### 2.7 Checkout & Intake Form Snippets
* **Current State**: Customer contact fields, Delivery Method pill radios ("Pickup" vs. "Hand delivery"), and Shipping Address inputs share identical markup, styling, and Google Form `entry.XXXX` names in:
  * [order.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/order.markdown#L29-L65)
  * [_custom/bring-your-own-beans.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-beans.md#L44-L118)
  * [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L250-L280)
  * [subscribe-form.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/subscribe-form.markdown)
* **DRY Solution**: Extract into reusable form part templates:
  * `_includes/forms/delivery-picker.html`
  * `_includes/forms/shipping-address.html`
  * `_includes/forms/customer-contact.html`

---

## 3. CSS & SASS Consolidations (High Impact)

### 3.1 Eliminating 790+ Inline Styles
* **Problem**: There are **791 occurrences of `style="..."`** in `.md` and `.html` files. 
  Common offenders:
  * `style="display:none;"` $\rightarrow$ use a standard `.u-hidden` or `[hidden]` utility class.
  * `style="max-width: 26rem; margin: 2rem auto; text-align: left;"` on forms $\rightarrow$ already matches `.order-form`.
  * `style="text-align: center;"` and `style="text-align: left;"` on labels $\rightarrow$ due to global label conflicts (see 3.2).
  * `style="min-width: 140px;"` or `style="min-width: 16rem; width: 100%;"` on selects $\rightarrow$ standardize via responsive classes.
* **Benefit**: Greatly reduces HTML payload size, improves browser cache efficiency, and makes the design centrally configurable via CSS.

---

### 3.2 Form Label Alignment Conflict
* **Current State**: In [_sass/_roast-detail.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_roast-detail.scss#L125-L134):
  ```scss
  .roast-mv-meta-label {
    ...
    text-align: center;
    ...
  }
  ```
  Because `.roast-mv-meta-label` is also used across forms and filter bars, dozens of elements must explicitly declare `style="text-align: left;"` or have custom overrides in [_sass/_cards.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss#L81-L84):
  ```scss
  .filter-group {
    .roast-mv-meta-label {
      text-align: left;
      margin-bottom: 0;
    }
  }
  ```
* **DRY Solution**: Disassociate form labels from detail page meta labels. Standard form labels default to `text-align: left` in `_base.scss`, while `.roast-mv-meta-label--center` handles centered detail presentation.

---

### 3.3 Sass Maps for Category Theming
* **Current State**: In [_sass/_cards.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss#L201-L235), 35 lines are spent manually repeating background color declarations:
  ```scss
  .roasts-entry[data-category="blend"] .roasts-entry-visual,
  .roasts-entry[data-type="blend"] .roasts-entry-visual {
    background-color: $color-cat-blend;
  }
  /* Repeated for single-origin, seasonal, custom, subscriptions, flight... */
  ```
* **DRY Solution**: Use a Sass `@each` loop:
  ```scss
  $category-colors: (
    "blend": $color-cat-blend,
    "single-origin": $color-cat-single-origin,
    "single origin": $color-cat-single-origin,
    "seasonal": $color-cat-seasonal,
    "custom": $color-cat-custom,
    "subscriptions": $color-cat-subscription,
    "subscription": $color-cat-subscription,
    "flight": $color-cat-flight,
    "flights": $color-cat-flight,
  );

  @each $cat, $color in $category-colors {
    .roasts-entry[data-category="#{$cat}"] .roasts-entry-visual,
    .roasts-entry[data-type="#{$cat}"] .roasts-entry-visual {
      background-color: $color;
    }
  }
  ```

---

### 3.4 Reusable Button / Pill Mixin
* **Current State**: Multiple button selectors duplicate identical pill shapes, uppercase typography, and transitions:
  * `.roasts-quiz-cta` ([_sass/_cards.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss#L20-L49))
  * `.order-submit` ([_sass/_roast-detail.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_roast-detail.scss))
  * `.add-to-order-btn` ([_sass/_roast-detail.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_roast-detail.scss))
  * `.roasts-entry-quick-add` ([_sass/_cards.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss#L726-L750))
  * `.add-to-blend-button` ([_sass/_byob.scss](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_byob.scss#L40-L60))
* **DRY Solution**: Create a Sass mixin in `_sass/_base.scss`:
  ```scss
  @mixin pill-button($bg: #2c1e14, $color: #ffffff) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-family: $font-display;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    background: $bg;
    color: $color;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: lighten($bg, 10%);
      color: $color;
      transform: translateY(-1px);
    }
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  ```

---

### 3.5 Backdrop Blur Mixin
* **Current State**: `_roast-detail.scss` contains 10 separate declarations of:
  ```scss
  backdrop-filter: blur(3.5px);
  -webkit-backdrop-filter: blur(3.5px);
  ```
* **DRY Solution**: Define `@mixin backdrop-blur($blur: 3.5px)` in `_base.scss` or group the selectors together.

---

## 4. Data Centralization (`_data/`)

### 4.1 `_data/grind_levels.yml`
Currently, the valid coffee grind options exist only as copy-pasted `<option>` elements in HTML. Moving them to `_data/grind_levels.yml`:
```yaml
- value: "Whole Bean"
  label: "Whole Bean"
  default: true
- value: "Coarsest — Cold Brew"
  label: "Coarsest — Cold Brew"
- value: "Coarser — French Press"
  label: "Coarser — French Press"
- value: "Medium — Drip / Filter"
  label: "Medium — Drip / Filter"
- value: "Finer — Pour Over"
  label: "Finer — Pour Over"
- value: "Finest — Espresso"
  label: "Finest — Espresso"
```
* **Benefit**: Adding a new grind or altering copy happens in one file and propagates site-wide.

---

### 4.2 `_data/brewing_methods.yml`
In [js/catalog-filters.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/catalog-filters.js#L25-L33), brewing methods are normalized via a JavaScript object (`METHOD_MAP`). Roast frontmatters also manually specify them as freeform strings. Centralizing into `_data/brewing_methods.yml` allows templates and filters to share a single source of truth.

---

### 4.3 `_data/google_form_fields.yml`
Google Forms field entry IDs are scattered as hardcoded strings across Markdown forms and JavaScript handlers:
* `entry.1153405702` (Customer Name)
* `entry.40149380` (Customer Email)
* `entry.1896226742` (Delivery Method)
* `entry.148046999` (Street Address)
* `entry.1534670804` (City)
* `entry.414179858` (State)
* `entry.1472936948` (ZIP Code)

Centralizing these IDs in `_config.yml` (mirroring `digital_gift_entries:`) or `_data/google_form_fields.yml` eliminates the risk of typos and makes form updates painless if Google Forms are ever recreated.

---

## 5. JavaScript Modularization

### 5.1 Shared Cart Parsing & Storage (`parseCartItem`)
* **Current State**:
  * [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L55-L95) and [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L49-L85) independently implement:
    * `loadCart()` / `saveCart()` via `localStorage.getItem('ywr_cart')`
    * Cart key parsing: `var parts = ck.split('|'); ...`
    * Flight pricing formulas and BYOB burner item handling.
  * Because `parseCartItem` was private to `cart.js`, the test file [scratch/test_byob_burner.js](file:///Users/ianr/Documents/yellow-wing-roasters/scratch/test_byob_burner.js) had to duplicate the whole function to test it.
* **DRY Solution**: Expose a unified cart utility on `window.YWR_CART` (or a dedicated `cart-core.js`):
  * `YWR_CART.load()`
  * `YWR_CART.save(cart)`
  * `YWR_CART.parseItem(key, qty)`
  Both `cart.js`, `order-checkout.js`, and tests can consume this without code duplication.

---

### 5.2 Unified Google Form Iframe Submissions
* **Current State**: [js/form-submit.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/form-submit.js), `byob-mixer.js`, and `subscribe-form.js` each implement their own hidden `<iframe>` creation, form target assignment, and `iframe.onload` redirect handling.
* **DRY Solution**: Export a general-purpose helper in `form-submit.js`:
  ```javascript
  window.initGoogleFormSubmit = function({ formId, thanksUrl, beforeSubmit }) { ... };
  ```

---

## 6. Repository Hygiene & File Organization

The project root currently contains **9 standalone preview/scratch HTML files**:
* `preview-pricing.html`
* `preview-bags.html`
* `preview-bags-v2.html`
* `footer-icon-preview.html`
* `main-icon-preview.html`
* `coming-soon-preview.html`
* `roast-detail-preview.html`
* `roast-card-color-playground.html`
* `social-preview-generator.html`

These files are already excluded in [_config.yml](file:///Users/ianr/Documents/yellow-wing-roasters/_config.yml#L89-L91). Moving them into a dedicated `_previews/` or `scratch/` subdirectory keeps the root clean and focused exclusively on production pages.

---

## 7. Prioritized Implementation Matrix

| Phase | Recommendation | Effort | Impact | Lines Saved / Reduction |
|---|---|---|---|---|
| **Phase 1** | **Category Layout Consolidation** (`_layouts/category.html`) | Low | High | Eliminates ~75 lines of redundant Liquid across 3 files |
| **Phase 1** | **Grind Selector Include** (`_data/grinds.yml` + include) | Low | High | Eliminates ~50 lines of identical `<option>` blocks in 7 files |
| **Phase 1** | **Roast Dots Include** (`_includes/roast-dots.html`) | Low | High | Eliminates 4 redundant 5-dot spans and level lookups |
| **Phase 2** | **Sass Category Maps & Mixins** (Buttons, Blurs, Categories) | Medium | High | Cuts ~80 lines of repetitive CSS across `_cards.scss` & `_roast-detail.scss` |
| **Phase 2** | **Lazy Susan Include** (`_includes/lazy-susan.html`) | Low | Medium | Eliminates ~80 lines of duplicated complex DOM across 4 files |
| **Phase 3** | **Shared Cart Core** (`window.YWR_CART.parseItem`) | Medium | High | Eliminates ~90 lines of duplicate logic between `cart.js` & `order-checkout.js` |
| **Phase 3** | **Address & Delivery Form Partials** | Medium | Medium | Consolidates checkout fields and Google Form IDs |
| **Phase 4** | **Inline Style Cleanup** (Removing 790+ `style="..."` tags) | High | Medium | Dramatically cleaner markup; better caching and maintainability |
