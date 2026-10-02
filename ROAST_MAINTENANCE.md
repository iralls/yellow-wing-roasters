# Roast Maintenance Guide

This document is an internal reference guide for managing and updating coffee roasts in Yellow Wing Roasters.

All roasts live as markdown files with YAML frontmatter in the `_roasts/` directory (e.g., `_roasts/colombia-supremo.md`).

---

## Table of Contents
1. [Status & Lifecycle (`status`)](#1-status--lifecycle-status)
2. [Featured Roasts (`featured`) & Rotating Selections (`rotating`)](#2-featured-roasts-featured--rotating-selections-rotating)
3. [Pricing & Available Bag Sizes (`price`)](#3-pricing--available-bag-sizes-price)
4. [Blend Recipes & Recipe History (`history`)](#4-blend-recipes--recipe-history-history)
5. [Roast Level & Flavor Profile](#5-roast-level--flavor-profile)
6. [Mascot & Artwork](#6-mascot--artwork)
7. [Subscriptions Configuration](#7-subscriptions-configuration)
8. [Frontmatter Templates](#8-frontmatter-templates)

---

## 1. Status & Lifecycle (`status`)

The `status` field controls catalog badges, availability banners, orderability, and whether subscriptions are permitted. Statuses are defined in `_data/statuses.yml`.

| `status` Value | Badge on Site | Can Order? | Can Subscribe? | Catalog Card Appearance | Use When... |
|---|---|---|---|---|---|
| `just_hatched` | **Just Hatched** | Yes | Yes | Normal | Fresh release or new single origin just launched. |
| *(omitted / none)* | *(No badge)* | Yes | Yes | Normal | Standard active core offering. |
| `mid_molt` | **Mid-Molt** | Yes | No | Normal | Blend profile or component origins are being tweaked between batches. |
| `low_stock` | **Final Peckings** | Yes | No | Normal | Bean stock is low; limited quantities remain. Prevents new subscriptions. |
| `migrating_soon`| **Migrating Soon** | Yes | Yes | Normal | Seasonal roast heading out of rotation soon. |
| `flown_south` | **Flown south** | No | No | Dimmed | Sold out or season ended; orders closed. |
| `incubating` | **Incubating** | No | No | Dimmed | Under development; preview only, ordering closed. |

```yaml
# Example: Marking low stock
status: low_stock
```

---

## 2. Featured Roasts (`featured`) & Rotating Selections (`rotating`)

### Featured Roasts (`featured`)

To highlight a roast on the catalog with a **Featured** badge:

```yaml
featured: true
```

Set to `false` or omit the line when the roast is no longer featured.

### Rotating Selections (`rotating`)

For single-origin coffees where the general regional profile is maintained but specific lots or producers rotate throughout the year (e.g., Ethiopia Guji):

```yaml
rotating: true
```

This renders a **"Rotating selection throughout the year"** banner across the roast card's hover/focus overlay. When rotating to an organic lot, remember to also set `certification: organic` in frontmatter. Set to `false` or omit for static single origins.

---

## 3. Pricing & Available Bag Sizes (`price`)

Available sizes on the order page dropdown, the catalog cards, and checkout are **dynamically derived directly from the keys in `price:`**.

```yaml
price:
  12oz: 12
  1lb: 14
  2lb: 28
  5lb: 70
```

### Managing Low Inventory by Size
If bean stock drops (e.g., only ~2 lbs green beans remaining):
* Simply **delete or omit the larger sizes** (e.g., `2lb` and `5lb`) from the `price:` block.
* The website will automatically remove them from the "Roast Amount" dropdown and catalog card overlay.

```yaml
# Only 12oz and 1lb will be orderable:
price:
  12oz: 12
  1lb: 14
```

> **Roasting Yield Tip**: Green coffee shrinks ~12%–18% (~15% average) during roasting.  
> 2.0 lbs green coffee yields ~1.7 lbs (27 oz) of roasted coffee (enough for two 12oz bags or one 1lb bag).

### Temporary Sale / Promo Prices (`temporary_price`)
To run a temporary discount on specific sizes without changing base prices, add `temporary_price:`. The original price will show with a strikethrough:

```yaml
price:
  12oz: 12
  1lb: 14
temporary_price:
  12oz: 10
```

---

## 4. Blend Recipes & Recipe History (`history`)

For blends (e.g., `early-bird`, `chimney-sweep`, `homeroom-hoot`), you can track recipe iterations across seasons or batches using `history:`.

### Rules for `history`:
1. **Newest recipe first**: The first entry under `history:` is treated as the current live recipe.
2. If components link to an existing single origin in `_roasts/`, specify its `slug`.
3. Keep `origins:` at the top level updated with the list of country/process descriptors used in the current recipe.

```yaml
origins:
  - Colombia Washed
  - Peru Washed
  - Kenya Washed

history:
  - date: "2026-08" # or version name / season
    components:
      - name: Colombia Supremo
        slug: colombia-supremo
        ratio: 50%
        roast_level: 2
      - name: Peru Fair Trade Organic
        slug: peru-fair-trade-organic
        ratio: 35%
      - name: Kenya AB Gathaithi
        ratio: 15%
  - date: "2026-06"
    components:
      - name: Colombia Supremo Huila
        slug: colombia-supremo
        ratio: 60%
      - name: Peru Fair Trade Organic
        slug: peru-fair-trade-organic
        ratio: 30%
      - name: Kenya AA Murage
        ratio: 10%
```

---

## 5. Roast Level & Flavor Profile

### Roast Level (`roast_level`)
Use integer numbers `1` through `5` (defined in `_data/roast_levels.yml`):
* `1`: City (Light)
* `2`: City+ (Light-Medium)
* `3`: Full City (Medium)
* `4`: Full City+ (Medium-Dark)
* `5`: Vienna (Dark)

### Custom Roast Levels (BYOB — Bring Your Own Burner)
Standard single-origin offerings showcase our prescribed roast recommendation. For customers who want to customize the roast level on a single-origin coffee:
* Customers visit **BYOB — Bring Your Own Burner** (`/roasts/bring-your-own-burner/`), accessible via the Custom catalog (`/custom/`) and the Custom section of the main catalog (`/roasts/`).
* Customers can select any in-stock single-origin bean, alter the roast level (City through Vienna), choose bag size and grind, and add it directly to their order.
* Orders appear in the cart and Google Forms intake as `1x BYOB: [Origin Title] [Size] (Roast: [Level], Grind: [Grind])`.

### Descriptors & Tasting Notes
* `descriptor`: Short punchy phrase (e.g., `bright and classic`, `dense and chocolatey`).
* `tasting_notes`: Comma-separated list (e.g., `caramel, brown sugar, sweet finish`). Rendered with bullet separators (` · `) on the site.
* `brewing_method`: Recommended methods (e.g., `Pour-over, Drip, AeroPress`).

### Certifications (`certification`)
To add a certification badge to a roast, use the `certification:` key with one of two valid values:
* `certification: organic` — Displays the **Organic** badge on cards and "Certification: Organic" on the detail page.
* `certification: fair_trade_organic` — Displays the **FTO** badge on cards and "Certification: Fair Trade Organic" on the detail page.
* Rotating single origins (`rotating: true` with `history:`): When rotating to an organic lot (e.g. Kayon Mountain for Ethiopia Guji), set `certification: organic` in the top-level frontmatter for the active lot.
* Omit `certification` for uncertified roasts and blends (blends do not carry certification badges).

---

## 6. Mascot & Artwork

Every roast is paired with an Audubon bird illustration:
* `mascot`: Unique bird identifier key (corresponds to `_data/mascots.yml`).
* `mascot_file`: Transparent PNG filename located in `/images/` (e.g., `audubon-bluebird-transparent.png`).

---

## 7. Subscriptions Configuration

Configured under the `subscription:` block:

```yaml
subscription:
  frequencies:
    - Every 2 weeks
    - Monthly
```

* To disable subscriptions for a specific roast even if in stock: set `subscription: false` (or omit the `subscription:` block entirely).
* **Seasonal Roasts**: By design, all seasonal roasts omit the `subscription:` block because they rotate out of stock when the season ends (`flown_south`). Without `subscription:` in frontmatter:
  * The "Subscribe" toggle is hidden on the roast detail page.
  * The roast will not appear in the dropdown on `/subscribe/`.
* Note that setting `status: low_stock`, `status: mid_molt`, `status: flown_south`, or `status: incubating` also automatically closes subscriptions even if `subscription:` is defined.

---

## 8. Frontmatter Templates

### Single Origin Template
```yaml
---
title: Colombia Supremo
slug: colombia-supremo
category: single origin
order: 3
roast_level: 2
region: Huila
elevation: 1,500 – 1,800m
descriptor: bright and classic
tasting_notes: caramel, brown sugar, sweet finish
brewing_method: Pour-over, Drip, AeroPress
processing_method: Washed
origins:
  - Colombia Washed
mascot: bluebird
mascot_file: audubon-bluebird-transparent.png
status: just_hatched
# featured: true # Optional: highlight with "Featured" badge
# rotating: true # Optional: for regional offerings that rotate lots/producers
# certification: organic # Optional: "organic" or "fair_trade_organic"

price:
  12oz: 12
  1lb: 14
  2lb: 28
  5lb: 70

subscription:
  frequencies:
    - Every 2 weeks
    - Monthly

description: >-
  Bright, clean, and incredibly easy to drink. Hits with classic caramel sweetness and a smooth, sugary finish.
---
```

### Blend Template
```yaml
---
title: Chimney Sweep
subtitle: Espresso Blend
slug: chimney-sweep
category: blend
order: 3
roast_level: 3
descriptor: smooth and robust
tasting_notes: dark chocolate, stone fruit, brown sugar
brewing_method: Espresso, Moka Pot, Drip
mascot: chimney-swift
mascot_file: audubon-chimney-swift-2-transparent.png
status: just_hatched
# featured: true # Optional: highlight with "Featured" badge

origins:
  - Brazil Natural
  - Guatemala Washed
  - Ethiopia Natural

history:
  - date: "2026-09"
    components:
      - name: Brazil Estavam Mario
        slug: brazil-estavam-mario
        ratio: 60%
      - name: Guatemala Antigua
        slug: guatemala-antigua
        ratio: 20%
      - name: Ethiopia Guji
        slug: ethiopia-guji
        ratio: 20%

price:
  12oz: 12
  1lb: 14
  2lb: 28
  5lb: 70

subscription:
  frequencies:
    - Every 2 weeks
    - Monthly

description: >-
  Our everyday espresso—smooth, rich, and balanced with a milk chocolate base.
---
```
