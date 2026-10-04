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
4. [Data Centralization (`_data/` & `_config.yml`)](#4-data-centralization-_data--_configyml)
   - [4.1 `_data/grind_levels.yml`](#41-_datagrind_levelsyml)
   - [4.2 Standardize Brewing Methods](#42-standardize-brewing-methods)
   - [4.3 Centralizing All Google Form Actions & Field Entry IDs](#43-centralizing-all-google-form-actions--field-entry-ids)
   - [4.4 Centralizing Bag Sizes & Default Product Attributes (`_data/bag_sizes.yml`)](#44-centralizing-bag-sizes--default-product-attributes-_databag_sizesyml)
5. [JavaScript Modularization](#5-javascript-modularization)
   - [5.1 Shared Cart Parsing & Storage (`parseCartItem`)](#51-shared-cart-parsing--storage-parsecartitem)
   - [5.2 Unified Google Form Iframe Submissions](#52-unified-google-form-iframe-submissions)
6. [Defensive Coding & Silent Fallback Elimination](#6-defensive-coding--silent-fallback-elimination)
   - [6.1 Ghost Property Fallbacks (`prices`, `status_badge`, `process`)](#61-ghost-property-fallbacks-prices-status_badge-process)
   - [6.2 Redundant Defaults for Local Frontmatter Constants](#62-redundant-defaults-for-local-frontmatter-constants)
   - [6.3 Hidden Data Bugs Masked by Fallbacks (Case Study: Mascots)](#63-hidden-data-bugs-masked-by-fallbacks-case-study-mascots)
   - [6.4 Schema.org JSON-LD 6-Level Fallback Ladders](#64-schemaorg-json-ld-6-level-fallback-ladders)
   - [6.5 Hardcoded JavaScript Duplicate Maps](#65-hardcoded-javascript-duplicate-maps)
   - [6.6 Triple-Check Aliasing in Card Iterations](#66-triple-check-aliasing-in-card-iterations)
   - [6.7 Artificial Catalog Frequency Fallbacks](#67-artificial-catalog-frequency-fallbacks)
   - [6.8 Direct Price Lookups & Pricing Indirection Elimination](#68-direct-price-lookups--pricing-indirection-elimination)
   - [6.9 Silent Early Returns vs. Fast-Fail Runtime Exceptions](#69-silent-early-returns-vs-fast-fail-runtime-exceptions)
   - [6.10 Hardcoded Product Attributes & Options (Sizes, Prices, Default Grind, Delivery Towns)](#610-hardcoded-product-attributes--options-sizes-prices-default-grind-delivery-towns)
7. [Repository Hygiene & File Organization](#7-repository-hygiene--file-organization)
8. [Prioritized Implementation Matrix](#8-prioritized-implementation-matrix)

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
* **Status**: ✅ **Implemented**
* **Solution**: Created `_includes/roast-dots.html` supporting `dots`, `level`, and `roast` parameters. Replaced the hardcoded 5-dot spans in [_includes/roast-card.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-card.html), [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html), and [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md).

---

### 2.4 Grind Selector Dropdown
* **Status**: ✅ **Implemented**
* **Solution**: Centralized grind levels in `_data/grind_levels.yml` and created `_includes/grind-options.html`. Replaced the copy-pasted `<option>` blocks in all 7 files ([_flights/the-aviary.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/the-aviary.md), [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md), [_custom/bring-your-own-beans.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-beans.md), [_custom/bring-your-own-burner.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md), [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md), [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html), and [subscribe-form.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/subscribe-form.markdown)).


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
* **Status**: ✅ **Implemented**
* **Solution**: Created `_includes/lazy-susan.html` supporting both card and hero header variants (`hero=true`). Replaced the duplicate 20-line DOM structures across [_includes/custom-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/custom-cards.html), [_includes/flight-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/flight-cards.html), [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md), and [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md).


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
* **Status**: ✅ **Implemented**
* Centralized all 6 grind options into [_data/grind_levels.yml](file:///Users/ianr/Documents/yellow-wing-roasters/_data/grind_levels.yml) and rendered through `_includes/grind-options.html`.


### 4.2 Standardize Brewing Methods
* **Status**: ✅ **Implemented**
* **Solution**: Canonical brewing methods (`AeroPress`, `Chemex`, `Cold Brew`, `Drip`, `Espresso`, `French Press`, `Moka Pot`, `Pour-over`) are hardcoded directly into `<select id="filter-brewing">` in [roasts/index.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/roasts/index.markdown) (mirroring `filter-certification`). Simplified [js/catalog-filters.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/catalog-filters.js) by removing runtime DOM generation, `METHOD_MAP`, and `normalizeMethod`. Documented canonical options in [ROAST_MAINTENANCE.md](file:///Users/ianr/Documents/yellow-wing-roasters/ROAST_MAINTENANCE.md).

---

### 4.3 Centralizing All Google Form Actions & Field Entry IDs
* **Current State**:
  While `digital_gift_form_url` and `digital_gift_entries` are cleanly centralized in `_config.yml` (lines 10–19), the remaining four Google Forms in the codebase hardcode their submission URLs and 25+ `entry.XXXX` field IDs directly in HTML templates and client JavaScript files:
  1. **Order Checkout Form** ([order.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/order.markdown#L22-L86)):
     - Submission URL: `https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse` (also hardcoded in [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L32)).
     - Form Entries: `entry.1935997805` (items), `entry.552044967` (total), `entry.1153405702` (name), `entry.40149380` (email), `entry.1852073865` (phone), `entry.1896226742` (delivery method), `entry.148046999` (address), `entry.1534670804` (city), `entry.414179858` (state), `entry.1472936948` (ZIP), `entry.1381358427` (notes).
  2. **Subscription Intake Form** ([js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L33), [L720-L745](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L720-L745)):
     - Submission URL: `https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse`.
     - Form Entries: `entry.1153405702` (name), `entry.65766604` (email — differs from order email!), `entry.1484480937` (phone — differs from order phone!), `entry.1896226742` (delivery), `entry.148046999` (address), `entry.1534670804` (city), `entry.414179858` (state), `entry.1472936948` (ZIP), `entry.1381358427` (notes), `entry.1935997805` (roast + grind), `entry.1606791078` (size), `entry.2064801247` (frequency), `entry.903789519` (price), `entry.1261348961` (status), `entry.1336119512` (status details).
  3. **Build Your Own Blend (BYOB)** ([_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L210-L245) & [js/byob-mixer.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-mixer.js#L643)):
     - Submission URL: `https://docs.google.com/forms/d/e/1FAIpQLSdqjeaQw5cFzSsCq2IMTZraYBSclfbjnXSwZ8KvqpCEuWTHdA/formResponse`.
     - Form Entries: `entry.52896454` (recipe), `entry.260019949` (total), `entry.1582897284` (name), `entry.1584009735` (email), `entry.577333073` (delivery), `entry.2120898522` (address), `entry.1017833079` (city), `entry.1054366668` (state), `entry.1706691494` (ZIP), `entry.191295914` (notes).
  4. **Pigeon Post Mailing List** ([pigeon-post.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/pigeon-post.markdown#L26-L28)):
     - Submission URL: `https://docs.google.com/forms/d/e/1FAIpQLSc2fpSWVJxRnC3hBamoq-7JqXVVypLoVaDHoKiQldEymJW7vw/formResponse`.
     - Form Entries: `entry.1049864914` (email).
* **DRY / Config-Driven Solution**:
  Centralize all form endpoints and entry IDs under `google_forms` in `_config.yml` (mirroring `digital_gift_entries`):
  ```yaml
  google_forms:
    order:
      url: "https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse"
      entries:
        items: "entry.1935997805"
        total: "entry.552044967"
        name: "entry.1153405702"
        email: "entry.40149380"
        phone: "entry.1852073865"
        delivery: "entry.1896226742"
        address: "entry.148046999"
        city: "entry.1534670804"
        state: "entry.414179858"
        zip: "entry.1472936948"
        notes: "entry.1381358427"
    subscription:
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse"
      entries:
        name: "entry.1153405702"
        email: "entry.65766604"
        phone: "entry.1484480937"
        delivery: "entry.1896226742"
        address: "entry.148046999"
        city: "entry.1534670804"
        state: "entry.414179858"
        zip: "entry.1472936948"
        notes: "entry.1381358427"
        roast: "entry.1935997805"
        size: "entry.1606791078"
        frequency: "entry.2064801247"
        price: "entry.903789519"
        status: "entry.1261348961"
        status_details: "entry.1336119512"
    byob:
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdqjeaQw5cFzSsCq2IMTZraYBSclfbjnXSwZ8KvqpCEuWTHdA/formResponse"
      entries:
        recipe: "entry.52896454"
        total: "entry.260019949"
        name: "entry.1582897284"
        email: "entry.1584009735"
        delivery: "entry.577333073"
        address: "entry.2120898522"
        city: "entry.1017833079"
        state: "entry.1054366668"
        zip: "entry.1706691494"
        notes: "entry.191295914"
    pigeon_post:
      url: "https://docs.google.com/forms/d/e/1FAIpQLSc2fpSWVJxRnC3hBamoq-7JqXVVypLoVaDHoKiQldEymJW7vw/formResponse"
      entries:
        email: "entry.1049864914"
  ```
  Templates access entry IDs via `name="{{ site.google_forms.order.entries.email }}"`, and scripts receive form configurations via data attributes or initialization options (`initOrderCheckout({ forms: ... })`), entirely eliminating hardcoded magic numbers from client code.

---

### 4.4 Centralizing Bag Sizes & Default Product Attributes (`_data/bag_sizes.yml`)
* **Current State**:
  Standard bag sizes (`12oz`, `1lb`, `2lb`, `5lb`) and default values are currently hardcoded across multiple templates and scripts instead of being derived from a single configuration:
  1. **Fabricated Fallback Size Arrays**:
     - In [gift.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown#L415): `{% assign default_sub_sizes = "12oz,1lb,2lb,5lb" | split: "," %}`.
     - In [gift.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown#L426): `{% if s.sizes %}{% assign s_sizes = s.sizes %}{% else %}{% assign s_sizes = "12oz" | split: "," %}{% endif %}`.
     - In [_custom/bring-your-own-burner.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md#L84-L88): Hardcoded static `<option>` elements for `12oz`, `1lb`, `2lb`, and `5lb`, ignoring the actual sizes offered by the chosen single-origin coffee.
  2. **Hardcoded Fallback Strings in Client JS**:
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L62): `params.get('size') || '12oz'`.
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L407): `subItem.data ? subItem.data.size : '12oz'`.
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L735): `it.data.size || '12oz'`.
     - In [js/gift-order.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js#L103), [L409](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js#L409): `getUnitPrice(product, '12oz')`.
* **DRY / Config-Driven Solution**:
  Create `_data/bag_sizes.yml` containing standard size definitions, display labels, weights, and default order flags:
  ```yaml
  - id: "12oz"
    label: "12oz"
    weight_oz: 12
    default: true
  - id: "1lb"
    label: "1lb"
    weight_oz: 16
  - id: "2lb"
    label: "2lb"
    weight_oz: 32
  - id: "5lb"
    label: "5lb"
    weight_oz: 80
  ```
  Templates and scripts dynamically query `site.data.bag_sizes` or the roast's explicit `sizes` property, eliminating all magic `'12oz'` strings.

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

## 6. Defensive Coding & Silent Fallback Elimination
* **Status**: ✅ **Implemented**

Excessive defensive fallback chains (`default: ... | default: ...`) and checks for non-existent properties are spread across the codebase. Rather than protecting the site, silent defaults actually **hide data errors and bugs** at build time (e.g. typos in frontmatter or missing lookups silently render empty values rather than alerting developers).

### 6.1 Ghost Property Fallbacks (`prices`, `status_badge`, `status_text`, `process`)
* **`price` vs `prices`**:
  * Every roast and subscription file declares `price:` (singular map or value). Zero files declare `prices:`.
  * Yet `{% assign rp = r.price | default: r.prices %}` and `r_sub.price | default: r_sub.prices | default: r.price` appear in 7 files: [_includes/roast-card.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-card.html), [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html), [gift.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown), [subscribe-form.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/subscribe-form.markdown), and [js/cart-data.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js).
  * **Solution**: Standardize on `r.price` across all templates.
* **`status_badge` and `status_text`**:
  * Status badges and text are defined centrally in `_data/statuses.yml`. Not a single roast defines custom `status_badge` or `status_text`.
  * Yet [_includes/roast-status-badge.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-status-badge.html), [_includes/roast-overlay-status.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-overlay-status.html), [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html), and [subscribe-form.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/subscribe-form.markdown) check `r.status_badge | default: s_info.badge` and `r.status_text | default: s_info.overlay_text | default: s_info.banner_text`.
  * **Solution**: Query `site.data.statuses[r.status]` directly for `badge`, `banner_text`, and `overlay_text`.
* **`processing_method` vs `process`**:
  * In [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L75-L79): `{% if page.processing_method or page.process %}{{ page.processing_method | default: page.process }}{% endif %}`.
  * Every roast uses `processing_method:`. Zero roasts use `process:`.
  * **Solution**: Cleanly reference `page.processing_method`.
* **`item.url` vs `item.permalink`**:
  * In [_includes/flight-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/flight-cards.html) and [_includes/custom-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/custom-cards.html): `href="{{ item.url | default: item.permalink | relative_url }}"`.
  * Jekyll collections automatically populate `.url` on every item at build time; fallback to `.permalink` is dead code.

---

### 6.2 Redundant Defaults for Local Frontmatter Constants
In [_flights/peck-your-own.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/peck-your-own.md) and [_flights/the-aviary.md](file:///Users/ianr/Documents/yellow-wing-roasters/_flights/the-aviary.md), frontmatter defines the exact prices and bag limits at the top of the file:
```yaml
price_per_bag: 10
min_bags: 4
```
Yet in the body of the exact same file, values are repeatedly defaulted:
* `pricePerBag: {{ page.price_per_bag | default: 10 }}`
* `minBags: {{ page.min_bags | default: 4 }}`
* `"lowPrice": "{{ page.min_bags | default: 4 | times: page.price_per_bag | default: 10 }}"`
* In `the-aviary.md`: `{{ page.price | default: 38 }}`
* In `_includes/cart-indicator.html` & `order.markdown`: `{% assign flight_aviary = flight_aviary_doc.price | default: 38 %}` and `{% assign flight_pyo = flight_pyo_doc.price_per_bag | default: 10 %}`.

* **Impact**: If a price or bag limit changes in frontmatter, these hardcoded defaults mean any template lookup bug silently falls back to stale numbers rather than alerting the developer.

---

### 6.3 Hidden Data Bugs Masked by Fallbacks (Case Study: Mascots)
* **The Code**:
  In [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L26):
  ```liquid
  {% assign m_name = site.data.mascots[page.mascot] | default: page.mascot_name | default: page.mascot %}
  ```
* **The Bug Discovered**:
  `_roasts/ethiopia-yirgacheffe.md` has `mascot: double-crested-cormorant`. But `double-crested-cormorant` was missing from `_data/mascots.yml`.
  Because the template silently fell back to `default: page.mascot`, the live page rendered `"double-crested-cormorant"` (raw slug with hyphens) instead of failing or alerting that the mascot name was missing.
* **Solution**: Add `double-crested-cormorant: Double-crested Cormorant` to `_data/mascots.yml`, remove `page.mascot_name`, and do a direct lookup.

---

### 6.4 Schema.org JSON-LD 6-Level Fallback Ladders
* In [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L278-L279):
  ```liquid
  "highPrice": "{{ roast_prices['5lb'] | default: roast_prices['2lb'] | default: roast_prices['1lb'] | default: roast_prices['12oz'] | default: roast_prices.first[1] | default: 12 }}"
  ```
  A 6-level fallback ladder to compute `highPrice`.
* In [_layouts/subscription.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/subscription.html#L49):
  ```liquid
  "price": "{{ page.price['12oz'] | default: page.price }}"
  ```
  `page.price` is a hash (`12oz: 15`), not a number. If `page.price['12oz']` was absent, `page.price` would serialize as a Ruby hash string into JSON-LD, producing invalid metadata.

---

### 6.5 Hardcoded JavaScript Duplicate Maps
* In [js/byob-burner.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-burner.js#L36-L50) and [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L65):
  ```javascript
  var dotsMap = { 'City': 1, 'City+': 2, 'Full City': 3, 'Full City+': 4, 'Vienna': 5 };
  ```
  Both files duplicate this mapping in JavaScript, even though [js/cart-data.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js#L43-L55) already builds `window.YWR_ROAST_LEVELS` from `_data/roast_levels.yml` at build time.

---

### 6.6 Triple-Check Aliasing in Card Iterations
* In [_includes/custom-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/custom-cards.html#L5):
  ```liquid
  {% if item.visual_type == "lazy_susan" or item.slug == "build-your-own-blend" or item.data_roast == "byob-blend" %}
  ```
* In [_includes/flight-cards.html](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/flight-cards.html#L5):
  ```liquid
  {% if f.visual_type == "lazy_susan" or f.slug == "peck-your-own" %}
  ```
* **Solution**: Cleanly rely on `visual_type: lazy_susan` as the canonical schema property.

---

### 6.7 Artificial Catalog Frequency Fallbacks
* **Current State**:
  Subscription frequency intervals are defined cleanly and authoritatively in YAML frontmatter:
  - All dedicated subscriptions ([_subscriptions/*.md](file:///Users/ianr/Documents/yellow-wing-roasters/_subscriptions/)) define `frequencies: ["Monthly"]` (fixed, single-option delivery schedule).
  - All roasts with subscriptions ([_roasts/*.md](file:///Users/ianr/Documents/yellow-wing-roasters/_roasts/)) define `frequencies: ["Every 2 weeks", "Monthly"]`.

  Yet client JavaScript and Liquid templates litter artificial fallback constants across the codebase that directly conflict with the catalog data:
  1. **Contradictory Hardcoded Defaults in Client JS**:
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L130), [L504](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L504), [L524](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L524), [L573](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L573), [L901](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L901):
       ```javascript
       var freqVal = qpFreq || (sEntry && sEntry.frequencies && sEntry.frequencies[0]) || 'Every 2 weeks';
       // and in submission builders:
       it.frequency || 'Every 2 weeks'
       ```
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L75) and [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L79), [L224](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L224):
       ```javascript
       var freq = parts[4] || (s && s.frequencies && s.frequencies[0]) || 'Monthly';
       ```
     - **Bug Created**: If a dedicated subscription like *The Migrator* (which strictly offers `Monthly`) has its frequency omitted in query parameters, `order-checkout.js` defaults it to `'Every 2 weeks'`—an invalid frequency that does not exist for that product. Conversely, if a roast subscription (whose primary frequency is `'Every 2 weeks'`) falls back in `cart.js`, it defaults to `'Monthly'`.
  2. **Multi-tier Liquid Default Ladders in Templates**:
     - In [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L125-L126), [L241](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L241):
       ```liquid
       {% assign default_freqs = "Every 2 weeks,Monthly" | split: "," %}
       {% assign freqs = sub_config.frequencies | default: default_freqs %}
       defaultFreq: {{ freqs.first | default: sub_config.frequencies.first | default: "Monthly" | jsonify }},
       ```
       Every subscribable roast in `_roasts/*.md` explicitly defines `frequencies:` in frontmatter; `default_freqs` and the 3-level fallback ladder are purely defensive noise.
     - In [_layouts/subscription.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/subscription.html#L50):
       `{{ page.frequencies.first | default: "Monthly" }}`.
     - In [js/cart-data.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js#L58-L71):
       `frequencies: {{ s.frequencies | default: '["Monthly"]' | jsonify }},` passes a JSON string literal as a fallback to `jsonify`.
* **DRY Solution**:
  - Remove all hardcoded string literals (`'Every 2 weeks'`, `'Monthly'`).
  - Rely directly on the authoritative catalog entry: `product.frequencies[0]`. If a frequency is invalid or missing, fail visibly or notify rather than assigning illegal intervals.

---

### 6.8 Direct Price Lookups & Pricing Indirection Elimination
* **Current State**:
  Product prices across the catalog are defined in root `price:` maps (or integer prices for flights and custom blends). However, multiple templates and client scripts layer artificial fallbacks, redundant data maps, and synthetic fallbacks over direct lookups:
  1. **The Phantom `subscription_prices` Map**:
     - In [js/cart-data.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js#L21-L28):
       ```liquid
       {% if r.subscription %}
       subscription_prices: {
         {% assign sp = r.subscription.price | default: r.price %}
         {% for entry in sp %}
           {{ entry[0] | jsonify }}: {{ entry[1] }}{% unless forloop.last %},{% endunless %}
         {% endfor %}
       },
       {% endif %}
       ```
       And in [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L250): `{% assign sub_prices = sub_config.price | default: roast_prices %}`.
       And in [gift.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown#L421): `{% assign r_prices = r_sub.price | default: r.price %}`.
     - **The Reality**: In 100% of roasts in `_roasts/*.md`, `r.subscription.price` is `nil`. Roasts simply charge their standard root `price:`. Generating an identical `subscription_prices` map in `YWR_ROASTS_DATA` bloats client payloads and forces `cart.js` and `order-checkout.js` into branching logic (`if (r.subscription_prices) ... else r.prices`) for identical data.
     - **Solution**: Delete the synthetic `subscription_prices` map and enforce direct lookups on `r.prices[size]`.
  2. **Hardcoded Price Fallback Traps in Cart Scripts**:
     - In [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L171) & [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L233):
       ```javascript
       var priceVal = (origData && origData.prices && typeof origData.prices[sizeStr] === 'number') ? origData.prices[sizeStr] : 12;
       ```
     - If a roast origin or size is misconfigured, it silently defaults to `$12`. For premium coffees ($14 for Ethiopia Guji, $14 for Ethiopia Wush Wush), this underbills customers without developer awareness.
     - **Solution**: Enforce direct lookup on `origData.prices[sizeStr]`.
  3. **Arbitrary Default in BYOB Component Beans**:
     - In [_custom/build-your-own-blend.md](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L289):
       `{% assign p1 = rp["1lb"] | default: rp["12oz"] | default: 16 %}`
     - Falls back to `16` for beans whose real prices are $12 or $14. Moreover, `js/byob-mixer.js` never uses component bean prices because BYOB is a flat $32.
  4. **Self-Referential Price Fallbacks**:
     - In [_layouts/roast.html](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L178):
       `${{ first_eff | default: first_price }}` inside an `{% else %}` block where `first_eff == first_price` is already guaranteed true.
  5. **Externalized Flight Pricing Injections**:
     - In `_includes/cart-indicator.html` and `order.markdown`, Liquid collection queries run on every page render to extract flight prices and pass them to client scripts, with trailing hardcoded fallbacks `config.flightAviaryPrice || 38` and `config.flightPyoPrice || 10` in `cart.js` and `order-checkout.js`.
     - **Solution**: Include `site.flights` directly in `js/cart-data.js` as `window.YWR_FLIGHTS_DATA`. Direct lookups (`YWR_FLIGHTS_DATA['the-aviary'].price`) eliminate Liquid filtering from `cart-indicator.html` and remove the need for hardcoded JS fallback numbers.

---

### 6.9 Silent Early Returns vs. Fast-Fail Runtime Exceptions
* **Guiding Principle**:
  > *"I'd rather a failure than a default value that doesn't make sense."*
  > *"I'd rather a behavior log an error in the console than a behavior not work on the site because of an early return."*

* **Current State**:
  Across the client JavaScript codebase, numerous critical lifecycle and user interaction flows use defensive `if (!el) return;` guard patterns and silent empty `catch (e) {}` blocks. When an element ID changes during a template refactor or a DOM element fails to mount, the scripts silently abort execution without throwing any errors or writing anything to the browser console:
  1. **Silent Initialization Aborts on Dedicated Pages**:
     - [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L30):
       `if (!form || !emptyEl || !itemsEl) return;`
       If any of these checkout DOM elements are renamed or missing, initialization halts silently. Customers see a completely unresponsive or frozen page with zero console logs.
     - [js/byob-burner.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-burner.js#L34):
       `if (!originSelect) return;`
       Silently disables the single-origin dropdown, roast-level stepper, and Add to Cart button for custom roast profiling.
     - [js/flights.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L76):
       `if (!addBtn || !countEl) return;`
       Silently halts the Peck-Your-Own custom flight picker.
     - [js/gift-order.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js#L182):
       `if (!customMenu || !customTrigger) return;`
       Silently leaves the gift coffee picker non-functional.
     - [js/manage-subscriptions.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/manage-subscriptions.js#L59):
       `if (!lookupForm || !lookupEmail || !lookupBtn || !lookupSection || !resultsSection) return;`
       Silently kills the customer subscription self-service portal.
     - [js/catalog-filters.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/catalog-filters.js#L17):
       `if (!cards.length || !selectOrigin || !selectLevel || !selectBrewing) return;`
       Silently disables all category filtering dropdowns.
     - [js/coffee-quiz.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/coffee-quiz.js#L38):
       `if (!quizContainer) return;`
       Silently abandons the recommendation quiz.
     - [js/form-submit.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/form-submit.js#L18), [L88](file:///Users/ianr/Documents/yellow-wing-roasters/js/form-submit.js#L88):
       `if (!form) return;`
       Silently falls back to default browser form submission without iframe interception or status handling.
  2. **Silent Catch Blocks (Error Swallowing)**:
     - [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L64-L66):
       `getCart()` wraps `JSON.parse(localStorage.getItem('ywr_cart'))` in `try...catch` and returns `{}` silently. If storage contains invalid JSON or quota errors occur, items vanish from the user's cart without any debuggable breadcrumb in the console.
     - [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L313):
       `try { ... } catch (err) {}` in dropdown removal handler silently swallows errors.
     - [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L50):
       `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) {}` silently swallows storage write failures.
     - [js/flights.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L13-L21):
       `catch (e) { return {}; }` and `catch (e) {}` completely mask storage serialization issues.

* **Fast-Fail Solution**:
  1. **Let Runtime Exceptions Throw Naturally**:
     Eliminate redundant `if (!el) return;` guard boilerplate before DOM property reads and listener registrations. Direct lookups (e.g. `form.addEventListener(...)`) naturally throw a standard `TypeError` if an element is missing, which browser DevTools automatically logs with file, line number, and interactive stack trace.
  2. **Explicit `console.error` for Logical Non-Throwing Failures**:
     Where an operation returns a status code or encounters an invalid parameter (such as `window.ywrAddToCart` returning `false` or unrecognized product slugs), log explicit `console.error('Contextual error message', payload)` so failures are visible in the console immediately.
  3. **No Silent Catch Blocks**:
     Always log caught errors: `catch (e) { console.error('Failed to parse cart storage:', e); return {}; }`.

---

### 6.10 Hardcoded Product Attributes & Options (Sizes, Prices, Default Grind, Delivery Towns)
* **Current State**:
  Several key product options, dimensions, and business rules remain hardcoded as magic strings or numbers instead of relying on frontmatter or `_config.yml` / `_data/`:
  1. **Hardcoded Bag Size Fallbacks**:
     - `js/order-checkout.js`: `qpSize = params.get('size') || '12oz'`, `subSizeHidden.value = subItem.data ? subItem.data.size : '12oz'`, and `it.data.size || '12oz'`.
     - `js/gift-order.js`: `getUnitPrice(product, '12oz')` hardcoded in two separate calculation paths ([L103](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js#L103), [L409](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js#L409)).
     - `_custom/bring-your-own-burner.md`: Statically defines `<option value="12oz">`, `1lb`, `2lb`, `5lb` in markup instead of reflecting the chosen single-origin coffee's real `sizes` frontmatter array.
     - `_custom/build-your-own-blend.md`: Statically includes `(one 12oz bag)` in HTML ([L207](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/build-your-own-blend.md#L207)).
     - `_layouts/roast.html`: Schema.org uses a hardcoded 5-level size ladder (`roast_prices['5lb'] | default: roast_prices['2lb'] | default: roast_prices['1lb'] | default: roast_prices['12oz']`) instead of extracting `roast_prices[sizes.last]`.
  2. **Hardcoded Flight Bundle Sizes & Mascots**:
     - In [js/flights.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L25), [L69](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L69): `options.price || 38` and `options.pricePerBag || 10` duplicate YAML frontmatter values as fallback numbers.
     - In [js/flights.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L35), [L137](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L137): `size: '4 × 8oz bags'` and `size: selected.length + ' × 8oz bags'` hardcode the 8oz flight unit in JavaScript strings.
     - In [js/flights.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L38), [L140](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L140): Mascot image filenames (`audubon-cage-transparent.png` and `audubon-cardinal-transparent.png`) are hardcoded in JS instead of passed via configuration.
  3. **Hardcoded Grind Defaults**:
     - In [js/cart.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart.js#L342): Quick add button hardcodes `grind: 'Whole Bean'`.
     - In [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L63), [L402](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L402), [L733](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L733): `(it.grind || 'Whole Bean')`.
     - In [js/roast-detail.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/roast-detail.js#L41): `(grind || 'Whole Bean')`.
  4. **Duplicated Town Delivery Strings**:
     - The exact notice: `'Available in Guilford, (North) Branford, Madison, and Durham.'` is duplicated verbatim across three separate JavaScript files:
       - [js/order-checkout.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js#L445)
       - [js/form-submit.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/form-submit.js#L38)
       - [js/byob-mixer.js](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-mixer.js#L664)
       - and referenced in [about.markdown](file:///Users/ianr/Documents/yellow-wing-roasters/about.markdown#L22).
     - Any future expansion or modification of the local delivery radius requires coordinated edits across 4 different files.
* **DRY / Config-Driven Solution**:
  - Centralize store delivery towns in `_config.yml` (`local_delivery_towns: ["Guilford", "(North) Branford", "Madison", "Durham"]`) and pass to forms or render dynamically in templates.
  - Centralize default grind in `_data/grind_levels.yml` or `_config.yml`.
  - Pass flight options (price, size, mascot) strictly from YAML frontmatter via `initAviaryFlight({ ... })` and `initPYOFlight({ ... })`, removing JS fallback numbers.
  - Rely on `site.data.bag_sizes` and roast `sizes` lists rather than hardcoding `'12oz'`.

---

## 7. Repository Hygiene & File Organization

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

## 8. Prioritized Implementation Matrix

| Phase | Recommendation | Effort | Impact | Lines Saved / Reduction |
|---|---|---|---|---|
| **Phase 1** | **Category Layout Consolidation** (`_layouts/category.html`) | Low | High | ✅ Completed (unified 6 catalog listings) |
| **Phase 1** | **Grind Selector Include** (`_data/grind_levels.yml` + `grind-options.html`) | Low | High | ✅ Completed (unified 7 forms) |
| **Phase 1** | **Roast Dots Include** (`_includes/roast-dots.html`) | Low | High | ✅ Completed (unified cards and detail pages) |
| **Phase 2** | **Defensive Fallback & Ghost Property Elimination** (6.1–6.6) | Low | High | ✅ Completed (eliminated dead fallbacks & fixed cormorant mascot) |
| **Phase 2** | **Catalog Frequency & Direct Price Lookups** (6.7 & 6.8) | Low | High | Eliminates contradictory interval defaults, deletes duplicate `subscription_prices` map, exposes `YWR_FLIGHTS_DATA` |
| **Phase 2** | **Google Form Actions & Entry IDs Centralization** (4.3) | Low | High | Centralizes 25+ scattered field IDs to `_config.yml` (mirroring `digital_gift_entries`) |
| **Phase 2** | **Bag Sizes & Store Defaults Centralization** (4.4, 6.10) | Low | High | Creates `_data/bag_sizes.yml`, centralizes delivery towns in `_config.yml`, removes hardcoded `'12oz'`/`'Whole Bean'` |
| **Phase 2** | **Fast-Fail Runtime Exceptions & Silent Return Elimination** (6.9) | Low | High | Replaces 10+ silent `if (!el) return;` blockers and unlogged catch blocks with natural exceptions / explicit `console.error` |
| **Phase 2** | **Sass Category Maps & Mixins** (Buttons, Blurs, Categories) | Medium | High | Cuts ~80 lines of repetitive CSS across `_cards.scss` & `_roast-detail.scss` |
| **Phase 2** | **Lazy Susan Include** (`_includes/lazy-susan.html`) | Low | Medium | ✅ Completed (unified 4 templates) |
| **Phase 3** | **Shared Cart Core** (`window.YWR_CART.parseItem`) | Medium | High | Eliminates ~90 lines of duplicate logic between `cart.js` & `order-checkout.js` |
| **Phase 3** | **Address & Delivery Form Partials** | Medium | Medium | Consolidates checkout fields and Google Form IDs |
| **Phase 4** | **Inline Style Cleanup** (Removing 790+ `style="..."` tags) | High | Medium | Dramatically cleaner markup; better caching and maintainability |
