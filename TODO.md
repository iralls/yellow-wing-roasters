# Yellow Wing Roasters — Master Technical Debt & Optimization Roadmap (`TODO.md`)

This document is the authoritative evaluation and backlog for the Yellow Wing Roasters Jekyll codebase. It consolidates the re-evaluation of:
1. [`DRY_OPTIMIZATION_RECOMMENDATIONS.md`](file:///Users/ianr/Documents/yellow-wing-roasters/DRY_OPTIMIZATION_RECOMMENDATIONS.md)
2. [`AGENTS.md`](file:///Users/ianr/Documents/yellow-wing-roasters/AGENTS.md) & [`.agents/rules/coding-principles.md`](file:///Users/ianr/Documents/yellow-wing-roasters/.agents/rules/coding-principles.md)
3. [`.agents/skills/ywr-coding-guidelines/SKILL.md`](file:///Users/ianr/Documents/yellow-wing-roasters/.agents/skills/ywr-coding-guidelines/SKILL.md)
4. Operational tracking from [`TODO.txt`](file:///Users/ianr/Documents/yellow-wing-roasters/TODO.txt) (Email confirmation automation)

---

## 1. Executive Summary & Health Scorecard

Over the recent refactoring cycles, major architectural consolidations were achieved:
- **Category Engine Unification**: Extracted [`_includes/category-section.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/category-section.html) and [`_layouts/category.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/category.html), eliminating duplicate category markup across 6 listing pages and retiring 3 bespoke card includes (`custom-cards.html`, `flight-cards.html`, `subscription-cards.html`) in favor of universal [`_includes/roast-card.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_includes/roast-card.html).
- **Mascot Standardization**: Retired the complex "Lazy Susan" component in favor of standard `mascot_file: peck-your-own-transparent.png` for Peck Your Own, stripping ~190 lines of specialized SCSS.
- **Data Centralization**: Standardized grind levels in [`_data/grind_levels.yml`](file:///Users/ianr/Documents/yellow-wing-roasters/_data/grind_levels.yml), canonical brewing methods in [`roasts/index.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/roasts/index.markdown), badge colors in [`_data/badge_colors.yml`](file:///Users/ianr/Documents/yellow-wing-roasters/_data/badge_colors.yml), and store delivery radius in `_config.yml`.
- **Inline Style Reduction**: Cut inline `style="..."` attributes from **791 down to 222**.

However, deep re-evaluation reveals critical areas that still require immediate attention:
- **`_data/bag_sizes.yml` is orphaned**: Created in config but not yet consumed by templates or scripts, leaving hardcoded `'12oz'`, fabricated size arrays in [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown), and static `<option>` tags in [`_custom/bring-your-own-burner.md`](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md).
- **Schema.org Multi-tier Ladders**: [`_layouts/roast.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html) still has a 5-level fallback ladder for `highPrice`.
- **Silent Early Returns in Client JS**: `order-checkout.js`, `flights.js`, `byob-burner.js`, and `manage-subscriptions.js` still contain silent `if (!element) return;` aborts that hide runtime errors.
- **Flight Mascot Mismatch in JS**: [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L140) hardcodes `audubon-cardinal-transparent.png` when adding Peck Your Own to cart instead of using the new `peck-your-own-transparent.png`.
- **Duplicate Form Submission Iframes**: 4 separate client scripts independently create identical hidden `<iframe>` DOM nodes for Google Form submissions.
- **Email Confirmation Gaps**: Gift subscriptions and BYOB submissions do not trigger recipient notification emails.

---

## 2. Re-Evaluation of `DRY_OPTIMIZATION_RECOMMENDATIONS.md`

### 2.1 Liquid Templates & Layouts

- [x] **2.1 Category Pages Layout Consolidation**
  - *Status*: **COMPLETE** (Commit `85e52a4`)
  - *Details*: All category pages delegate to `_layouts/category.html` and `_includes/category-section.html`.
- [x] **2.2 Status-Partitioned Roast Sorting & Collection Engine**
  - *Status*: **COMPLETE** (Commit `85e52a4`)
  - *Details*: 3-tier partitioning (`active` $\rightarrow$ `incubating` $\rightarrow$ `flown_south`) and collection resolution unified in `_includes/category-section.html`.
- [x] **2.3 Roast Level & Dots Component**
  - *Status*: **COMPLETE** (Commit `0da4f5d` & prior)
  - *Details*: Centralized in `_includes/roast-dots.html`.
- [x] **2.4 Grind Selector Dropdown**
  - *Status*: **COMPLETE** (Commit `b7dc0f1`)
  - *Details*: Centralized in `_data/grind_levels.yml` and `_includes/grind-options.html`.
- [x] **2.5 Minimal-Vertical Page Hero Layout**
  - *Status*: **COMPLETE**
  - *Details*: Created [`_layouts/detail-page.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/detail-page.html) (inheriting from `default.html`) that standardizes the `.roast-minimal-vertical` hero header (`divider`, `mascot_file`, `title`/`card_title`, `subtitle`, `intro`, `divider`) driven strictly by frontmatter. Migrated `_layouts/subscription.html`, `_flights/the-aviary.md`, `_flights/peck-your-own.md`, `_custom/bring-your-own-beans.md`, `_custom/bring-your-own-burner.md`, and `_custom/build-your-own-blend.md`, eliminating over 110 lines of repetitive boilerplate markup.
- [x] **2.6 Mascot Asset Standardization (Retired Lazy Susan Component)**
  - *Status*: **COMPLETE** (Commit `85e52a4`)
  - *Details*: Replaced with `peck-your-own-transparent.png`. Deleted `_includes/lazy-susan.html` and cleaned SCSS.
- [x] **2.7 Checkout & Intake Form Snippets**
  - *Status*: **KEPT SEPARATE (DECIDED)**
  - *Details*: Per user decision, form markup across order checkout and custom roaster intake forms will remain separate and localized to avoid tight coupling and maintain self-contained templates.

---

### 2.2 CSS & SASS Consolidations

- [x] **3.1 Eliminating Remaining Production Inline Styles**
  - *Status*: **COMPLETE**
  - *Details*: Removed over 120 inline presentation styles across production templates (`_layouts/roast.html`, `_custom/bring-your-own-burner.md`, `_custom/build-your-own-blend.md`, `subscriptions/manage.markdown`, `order.markdown`, and `gift.markdown`), migrating layout dimensions, margin spacing, button alignment, and typography into semantic SCSS classes (`.u-sr-only`, `.pill-radios--center`, `.lookup-container--narrow`, `.lookup-container--results`, `.results-header`, `.results-email-display`, `.manage-sub-actions`, `.discount-input-row`, `.discount-code-input`, `.discount-apply-btn`, `.gift-type-field`, `.gift-foot-note`, `.gift-duration-note`, `.gift-section-box`, `.gift-section-title`, `.gift-notes-field`, `.gift-price-box`, `.gift-actions`, `.byob-step-title`, `.byob-price-line`, and `.byob-unit-note`). Cleaned all standalone preview/scratch HTML files containing 129 legacy inline styles. Remaining `style="display: none;"` attributes are strictly dynamic runtime toggles managed by client JavaScript.
- [x] **3.2 Form Label Alignment Conflict**
  - *Status*: **COMPLETE**
  - *Details*: Updated `.roast-mv-meta-label` in [`_sass/_roast-detail.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_roast-detail.scss) to `display: block; text-align: left; margin-bottom: 0.35rem;` by default, scoping centered styling to `.roast-mv-meta-item`, `.roast-mv-center`, and `.roast-mv-meta-label--center`. Added `text-align: left;` to `.order-shipping`. Stripped redundant inline `display:block; margin-bottom:...` and `text-align:...` styles across `_layouts/roast.html`, `bring-your-own-burner.md`, `bring-your-own-beans.md`, `build-your-own-blend.md`, `the-aviary.md`, `peck-your-own.md`, and `gift.markdown`.
- [x] **3.3 Sass Maps for Category Theming**
  - *Status*: **COMPLETE** (Commit `b7dc0f1`)
  - *Details*: Refactored category backgrounds in [`_sass/_cards.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss) with a Sass `$category-colors` map and `@each` loop.
- [x] **3.4 Reusable Button / Pill Mixin**
  - *Status*: **COMPLETE**
  - *Details*: Defined `@mixin pill-button($bg, $color, $hover-bg, $hover-color)` in [`_sass/_base.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_base.scss) and applied it across `.roasts-quiz-cta`, `.roasts-entry-quick-add`, `.order-submit`, `.add-to-order-btn`, and `.add-to-blend-button`, eliminating redundant button shapes, transitions, and hover/disabled boilerplate.
- [x] **3.5 Backdrop Blur Mixin**
  - *Status*: **COMPLETE**
  - *Details*: Defined `@mixin backdrop-blur($radius: 3.5px)` in [`_sass/_base.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_base.scss) and replaced 10 duplicate `backdrop-filter` / `-webkit-backdrop-filter` declarations across [`_sass/_roast-detail.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_roast-detail.scss) and [`_sass/_cards.scss`](file:///Users/ianr/Documents/yellow-wing-roasters/_sass/_cards.scss).

---

### 2.3 Data Centralization (`_data/` & `_config.yml`)

- [x] **4.1 `_data/grind_levels.yml`**
  - *Status*: **COMPLETE**
- [x] **4.2 Standardize Brewing Methods**
  - *Status*: **COMPLETE** (Commit `0da4f5d`)
  - *Details*: Canonical brewing methods hardcoded into filter select in `roasts/index.markdown`, removing dynamic DOM generation and method maps from `catalog-filters.js`.
- [x] **4.3 Google Forms Centralization Cleanup**
  - *Status*: **COMPLETE**
  - *Details*: Migrated [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown) to consume `site.google_forms.digital_gift.url` and `site.google_forms.digital_gift.entries`, and deleted redundant root-level `digital_gift_form_url` and `digital_gift_entries` keys from [`_config.yml`](file:///Users/ianr/Documents/yellow-wing-roasters/_config.yml).
- [x] **4.4 Connect `_data/bag_sizes.yml` Across Templates & Scripts**
  - *Status*: **COMPLETE**
  - *Details*: Created `_includes/bag-size-options.html` driven by `_data/bag_sizes.yml`. Integrated into `_custom/bring-your-own-burner.md`, exposed `window.YWR_BAG_SIZES` in `js/cart-data.js`, and cleaned `gift.markdown` to derive sizes directly from `r.price` and `s.sizes` without fabricated size arrays.

---

### 2.4 JavaScript Modularization

- [x] **5.1 Shared Cart Storage & Retrieval**
  - *Status*: **COMPLETE** (Commit `03a7cee`)
  - *Details*: Unified on `window.ywrGetCart()` and `window.ywrAddToCart()`. The old duplicate `parts = ck.split('|')` parsing has been removed.
- [x] **5.2 Unified Google Form Iframe Submissions**
  - *Status*: **KEPT SEPARATE (DECIDED)**
  - *Details*: Per design decision, hidden iframe generation and submission lifecycles are kept intentionally localized within each form script (`order-checkout.js`, `form-submit.js`, `byob-mixer.js`, `gift-order.js`) to maintain self-contained modularity and avoid tight cross-script coupling.

---

### 2.5 Defensive Coding & Silent Fallback Elimination

- [x] **6.1 Ghost Property Fallbacks (`prices`, `status_badge`, `process`)**
  - *Status*: **COMPLETE**
- [x] **6.2 Redundant Defaults for Local Frontmatter Constants**
  - *Status*: **COMPLETE** (Peck Your Own / Aviary cleaned)
- [x] **6.3 Hidden Data Bugs Masked by Fallbacks (Mascots)**
  - *Status*: **COMPLETE** (Fixed `double-crested-cormorant`)
- [x] **6.4 Schema.org JSON-LD 5-Level Fallback Ladder**
  - *Status*: **COMPLETE**
  - *Details*: Replaced the 5-level fallback ladder with direct lookups `roast_prices[first_size]` and `roast_prices[last_size]`, and dynamic `offerCount: sizes.size`.
- [x] **6.5 Hardcoded JavaScript Duplicate Maps (`dotsMap`)**
  - *Status*: **COMPLETE**
  - *Details*: Removed hardcoded `levelDotsMap` and `dotNumberToLevel` dictionaries and `|| 2` fallback from [`js/byob-burner.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-burner.js). Roast levels and dot counts are now derived directly from `window.YWR_ROAST_LEVELS` and `<option data-dots>`.
- [x] **6.6 Visual Type Aliasing Elimination**
  - *Status*: **COMPLETE** (Commit `85e52a4`)
- [x] **6.7 Subscription Frequency Fallback Elimination**
  - *Status*: **COMPLETE**
  - *Details*: Eliminated `default_freqs` and `sub_config.frequencies | default: default_freqs` in `_layouts/roast.html`. Removed phantom variable `defaultFreq` from `roast-detail.js`. Replaced hardcoded fallback strings (`'12oz'`, `'Every 2 weeks'`, `'Whole Bean'`) in `order-checkout.js` with direct catalog values (`entry.sizes[0]`, `entry.frequencies[0]`, and `window.YWR_DEFAULT_GRIND` compiled from `_data/grind_levels.yml`).
- [x] **6.8 Expose `window.YWR_FLIGHTS_DATA`**
  - *Status*: **COMPLETE**
  - *Details*: Added `window.YWR_FLIGHTS_DATA` to `js/cart-data.js` and updated `js/flights.js` to read price, price per bag, min bags, and mascots directly from configuration without fallback numbers.
- [x] **6.9 Fast-Fail Runtime Exceptions & Silent Return Elimination**
  - *Status*: **COMPLETE**
  - *Details*: Eliminated silent `if (!element) return;` aborts in `order-checkout.js`, `flights.js`, `byob-burner.js`, `gift-order.js`, and `manage-subscriptions.js`. Added explicit `console.error` and `console.warn` to empty catch blocks in `manage-subscriptions.js` and `order-checkout.js`. Allowed missing DOM dependencies to throw natural `TypeError` so failures surface immediately in browser DevTools.
- [x] **6.10 Hardcoded Flight Mascot Bug in `js/flights.js`**
  - *Status*: **COMPLETE**
  - *Details*: Fixed [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js) to receive `mascot` from frontmatter via `initPYOFlight` / `YWR_FLIGHTS_DATA`, using `peck-your-own-transparent.png` instead of the outdated cardinal image.

---

### 2.6 Repository Hygiene

- [x] **7.1 Clean Up Standalone Preview Files**
  - *Status*: **COMPLETE**
  - *Details*: Removed obsolete standalone preview/scratch HTML files (`coming-soon-preview.html`, `footer-icon-preview.html`, `main-icon-preview.html`, `preview-bags.html`, `preview-bags-v2.html`, `preview-gift-card-email.html`, `preview-pricing.html`, `roast-card-color-playground.html`, `roast-detail-preview.html`, and `social-preview-generator.html`) from repository root, eliminating root clutter, sitemap leakage, and 129 legacy inline style occurrences. Updated `_config.yml` exclude paths.

---

## 3. Re-Evaluation Against Coding Principles (`AGENTS.md`, `coding-principles.md`, `SKILL.md`)

### Principle 1: Config-Driven Over Hardcoded (Fail Rather Than Guess)
> *"I'd rather a failure than a default value that doesn't make sense."*

| File | Line(s) | Violation | Status / Remediation |
|---|---|---|---|
| [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown) | 415 | `default_sub_sizes = "12oz,1lb,2lb,5lb"` fabricated string array | **RESOLVED**: Sizes derived dynamically from `r.price` and `s.sizes` |
| [`_custom/bring-your-own-burner.md`](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md) | 84–88 | Static `<option>` tags for 12oz, 1lb, 2lb, 5lb | **RESOLVED**: Rendered via `_includes/bag-size-options.html` driven by `_data/bag_sizes.yml` |
| [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js) | 28, 72, 73 | `options.price \|\| 38`, `options.pricePerBag \|\| 10`, `minBags \|\| 4` | **RESOLVED**: Direct reads from frontmatter options without fallback numbers |
| [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js) | 140 | Hardcoded mascot `audubon-cardinal-transparent.png` | **RESOLVED**: Reads mascot from flight frontmatter |
| [`js/order-checkout.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js) | 65–66 | `params.get('size') \|\| '12oz'`, `params.get('grind') \|\| 'Whole Bean'` | **RESOLVED**: Reads from catalog entry sizes and `window.YWR_DEFAULT_GRIND` |
| [`js/roast-detail.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/roast-detail.js) | 21 | `var defaultFreq = config.defaultFreq \|\| 'Monthly';` | **RESOLVED**: Deleted dead phantom variable and unused parameter |

---

### Principle 2: Simple & Direct Lookups (No Defensive Guessing, No Phantom Variables)

| File | Line(s) | Violation | Status / Remediation |
|---|---|---|---|
| [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown) | 421 | `r_sub.price \| default: r.price` | **RESOLVED**: Standard roasts only declare `price:`; reads `r.price` directly |
| [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown) | 173–200 | `roast.descriptor \| default: roast.subtitle \| default: 'Blend'` | **RESOLVED**: Direct `roast.descriptor` read |
| [`_layouts/roast.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html) | 250 | `sub_config.price \| default: roast_prices` | **RESOLVED**: Reads `roast_prices` directly |
| [`_layouts/roast.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html) | 275 | 5-level fallback ladder for `highPrice` in Schema.org | **RESOLVED**: Reads `roast_prices[sizes.last]` directly |
| [`js/cart-data.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js) | 63 | `site.data.roast_levels[lvl_num] \| default: site.data.roast_levels[lvl_num_str]` | **RESOLVED**: Direct integer lookup in `roast_levels.yml` |

---

### Principle 3: Natural Runtime Exceptions (No Manual Guard Boilerplate)

| File | Line(s) | Violation | Status / Remediation |
|---|---|---|---|
| [`js/order-checkout.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js) | 29 | `if (!form \|\| !emptyEl \|\| !itemsEl) return;` | **RESOLVED**: Removed silent guard; let `form.addEventListener` throw if missing |
| [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js) | 79 | `if (!addBtn \|\| !countEl) return;` | **RESOLVED**: Removed silent return; let DOM operations throw `TypeError` |
| [`js/byob-burner.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-burner.js) | 34 | `if (!originSelect) return;` | **RESOLVED**: Removed silent return |
| [`js/gift-order.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js) | 183 | `if (!customMenu \|\| !customTrigger) return;` | **RESOLVED**: Removed silent return and defensive ternaries |
| [`js/manage-subscriptions.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/manage-subscriptions.js) | 59 | `if (!lookupForm \|\| ... \|\| !resultsSection) return;` | **RESOLVED**: Removed silent return |
| [`js/manage-subscriptions.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/manage-subscriptions.js) | 44 | Silent `catch (e) {}` | **RESOLVED**: Added `console.error('saveMockDb: Failed to save mock subscriptions:', e)` |
| [`js/order-checkout.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/order-checkout.js) | 638–639 | Silent `catch (e) {}` around storage removal | **RESOLVED**: Added `console.warn` if storage removal throws |

---

### Principle 4: Ask Rather Than Fall Back on Missing Data
- **Rule**: If a field is missing in YAML frontmatter or configs, ask the user or supply the underlying data instead of writing fallback ternaries in templates.
- **Recent Example**: When `_custom/` and `_flights/` were missing `category`, rather than retaining `include.category | default: r.category`, we added `category: custom` and `category: flight` to the frontmatter files, enabling direct `r.category` lookups.

---

## 4. Email Automation & Operational Gaps (from `TODO.txt`)

- [x] **4.1 Gift Subscriptions Recipient Notification Email**
  - *Status*: **COMPLETE**
  - *Details*: Implemented Option B dual-submission architecture. Created dedicated Google Form for Gift Subscriptions (`site.google_forms.gift_subscription`) with Apps Script trigger in [`scripts/google-forms/gift-subscriptions/`](file:///Users/ianr/Documents/yellow-wing-roasters/scripts/google-forms/gift-subscriptions/) that dispatches [`purchaser-confirmation.html`](file:///Users/ianr/Documents/yellow-wing-roasters/scripts/google-forms/gift-subscriptions/purchaser-confirmation.html) (receipt with price to buyer) and [`recipient-announcement.html`](file:///Users/ianr/Documents/yellow-wing-roasters/scripts/google-forms/gift-subscriptions/recipient-announcement.html) (gift announcement without price to recipient). Updated [`js/gift-order.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/gift-order.js) to dual-post to the gift form while submitting recipient delivery details to [`site.google_forms.subscription`](file:///Users/ianr/Documents/yellow-wing-roasters/_config.yml). Both emails are sent intentionally to the recipient; added a direct link to the [Subscription Management page](https://www.yellowwingroasters.com/subscriptions/manage/) in [`subscription.html`](file:///Users/ianr/Documents/yellow-wing-roasters/scripts/google-forms/subscriptions/subscription.html), added `?email=` auto-lookup in [`js/manage-subscriptions.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/manage-subscriptions.js), and resolved `doGet` function name collision across `Code.gs` and `Management.gs`.
- [ ] **4.2 BYOB (Build Your Own Blend) Customer Confirmation Email**
  - *Problem*: BYOB submissions to `site.google_forms.byob_blend.url` are stored in Google Sheets, but there is no Google Apps Script trigger script in `scripts/google-forms/` to email a recipe confirmation to the customer.
  - *Action*: Create `scripts/google-forms/byob/Code.gs` and `byob-confirmation-template.html` to send a branded blend recipe summary to `e.namedValues['Email'][0]`.

---

## 5. Master Prioritized Implementation Checklist

### Phase 1: Critical Architectural & Coding Principle Fixes (Immediate)
- [x] Wire up [`_data/bag_sizes.yml`](file:///Users/ianr/Documents/yellow-wing-roasters/_data/bag_sizes.yml) to [`gift.markdown`](file:///Users/ianr/Documents/yellow-wing-roasters/gift.markdown) and [`_custom/bring-your-own-burner.md`](file:///Users/ianr/Documents/yellow-wing-roasters/_custom/bring-your-own-burner.md).
- [x] Fix hardcoded mascot `audubon-cardinal-transparent.png` in [`js/flights.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/flights.js#L140) to use `peck-your-own-transparent.png`.
- [x] Expose `window.YWR_FLIGHTS_DATA` in [`js/cart-data.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js) and remove fallback numbers (`38`, `10`, `4`) from `js/flights.js`.
- [x] Remove 5-level Schema.org price ladder in [`_layouts/roast.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html#L274-L276).
- [x] Remove `default_freqs` and `sub_prices = sub_config.price | default: roast_prices` fallback in [`_layouts/roast.html`](file:///Users/ianr/Documents/yellow-wing-roasters/_layouts/roast.html).
- [x] Clean up `gift.markdown` Google Form config to use `site.google_forms.digital_gift` and delete duplicate lines 10–19 from [`_config.yml`](file:///Users/ianr/Documents/yellow-wing-roasters/_config.yml).

### Phase 2: JavaScript Hardening & Fast-Fail (Short-Term)
- [x] Replace silent `if (!el) return;` aborts in `order-checkout.js`, `flights.js`, `byob-burner.js`, `gift-order.js`, and `manage-subscriptions.js` with natural DOM reads and explicit error logging.
- [x] Iframe submission lifecycles kept intentionally localized within each script (Kept separate per design decision).
- [x] Replace `levelDotsMap` and `dotNumberToLevel` in [`js/byob-burner.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/byob-burner.js) with `window.YWR_ROAST_LEVELS`.

### Phase 3: Layouts & Template DRYing (Medium-Term)
- [x] Create `_layouts/detail-page.html` to eliminate 7 duplicate `.roast-minimal-vertical` hero blocks.
- [x] Form templates kept separate and localized across checkout & custom roasters (Kept separate per user decision).

### Phase 4: CSS Consolidation & Repository Hygiene (Polishing)
- [x] Move inline styles from `bring-your-own-burner.md`, `build-your-own-blend.md`, and `gift.markdown` to SCSS classes.
- [x] Add `@mixin backdrop-blur` to `_sass/_base.scss` and replace declarations.
- [x] Add `@mixin pill-button` to `_sass/_base.scss` and apply across buttons.
- [x] Cleaned up obsolete standalone preview/scratch HTML files from repository root.

### Phase 5: Operational & Email Automation (Features)
- [x] Implement recipient notification in `scripts/google-forms/subscriptions/Code.gs`.
- [ ] Implement BYOB recipe confirmation in `scripts/google-forms/byob/Code.gs`.
