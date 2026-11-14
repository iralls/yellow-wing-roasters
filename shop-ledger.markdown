---
layout: default
title: Shop (Roaster Ledger) — Yellow Wing Roasters
permalink: /shop-ledger/
---

<style>
  /* ── Ultra-Minimal Roaster Ledger Prototype ── */
  :root {
    --ldg-bg: #ffffff;
    --ldg-text: #111111;
    --ldg-muted: #666666;
    --ldg-light: #999999;
    --ldg-line: #e5e5e5;
    --ldg-hover: #f5f5f5;
    --ldg-sale: #c2410c;
  }

  body {
    background-color: var(--ldg-bg) !important;
    color: var(--ldg-text);
  }

  .ldg-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 24px 8rem;
  }

  /* ── Ledger Header ── */
  .ldg-header {
    border-bottom: 2px solid var(--ldg-text);
    padding-bottom: 2rem;
    margin-bottom: 3.5rem;
  }

  .ldg-meta-top {
    display: flex;
    justify-content: space-between;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ldg-muted);
    margin-bottom: 1.5rem;
  }

  .ldg-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.6rem, 5.5vw, 4.2rem);
    font-weight: 400;
    letter-spacing: -0.035em;
    line-height: 1;
    margin: 0 0 1rem;
  }

  .ldg-intro {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1rem;
    color: var(--ldg-muted);
    max-width: 580px;
    line-height: 1.5;
    margin: 0;
  }

  /* ── Category Heading ── */
  .ldg-cat-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 4.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--ldg-text);
  }

  .ldg-cat-title {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--ldg-text);
    margin: 0;
  }

  .ldg-cat-count {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.75rem;
    color: var(--ldg-muted);
  }

  /* ── Table Header ── */
  .ldg-table-head {
    display: grid;
    grid-template-columns: 1.8fr 1.1fr 2fr 110px 40px;
    gap: 1.5rem;
    padding: 0.6rem 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ldg-light);
    border-bottom: 1px solid var(--ldg-line);
  }

  /* ── Table Rows ── */
  .ldg-table {
    display: flex;
    flex-direction: column;
  }

  .ldg-row {
    display: grid;
    grid-template-columns: 1.8fr 1.1fr 2fr 110px 40px;
    gap: 1.5rem;
    align-items: baseline;
    padding: 1.1rem 1rem;
    border-bottom: 1px solid var(--ldg-line);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.14s ease, color 0.14s ease;
  }

  .ldg-row:hover {
    text-decoration: none;
    color: inherit;
    background-color: var(--ldg-hover);
  }

  .ldg-row:hover .ldg-arrow {
    transform: translateX(4px);
    color: var(--ldg-text);
  }


  .ldg-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .ldg-profile {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
  }

  .ldg-desc {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    color: var(--ldg-muted);
    line-height: 1.45;
  }

  .ldg-price {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
  }

  .ldg-old-price {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--ldg-light);
    text-decoration: line-through;
    margin-right: 0.35rem;
  }

  .ldg-sale-price {
    color: var(--ldg-sale);
  }



  .ldg-arrow {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-align: right;
    font-size: 0.9rem;
    color: var(--ldg-light);
    transition: transform 0.14s ease, color 0.14s ease;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .ldg-table-head {
      display: none;
    }

    .ldg-row {
      grid-template-columns: 1fr auto;
      gap: 0.75rem;
      padding: 1rem 0.5rem;
    }

    .ldg-profile,
    .ldg-desc,
    .ldg-arrow {
      display: none;
    }
  }
</style>

<div class="ldg-wrap">
  <!-- ── Header ── -->
  <header class="ldg-header">
    <div class="ldg-meta-top">
      <span>Yellow Wing Roasters</span>
      <span>Roastery Master Ledger</span>
      <span>Active Production</span>
    </div>
    <h1 class="ldg-title">Catalog Ledger</h1>
    <p class="ldg-intro">
      Current small-batch roast profiles, curated flights, and custom roastery programs. Roasted and fulfilled weekly.
    </p>
  </header>

  <!-- ── 1. Coffee ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="ldg-cat-head">
    <h2 class="ldg-cat-title">01 &bull; Coffee Catalog</h2>
    <span class="ldg-cat-count">{{ all_roasts.size }} Coffees</span>
  </div>

  <div class="ldg-table-head">
    <span>Coffee</span>
    <span>Category / Profile</span>
    <span>Sensory Notes &amp; Origins</span>
    <span style="text-align: right;">Price (12oz)</span>
    <span></span>
  </div>

  <div class="ldg-table">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="ldg-row">
        <span class="ldg-name">{{ r.card_title | default: r.title }}</span>
        <span class="ldg-profile">{{ r.category | capitalize }}{% if level_info %} &bull; {{ level_info.layman }}{% endif %}</span>
        <span class="ldg-desc">
          {% if r.tasting_notes %}{{ r.tasting_notes }}{% endif %}
          {% if r.origins %} &bull; {{ r.origins | join: ", " }}{% elsif r.variety %} &bull; {{ r.variety }}{% endif %}
        </span>
        <span class="ldg-price">
          {% if r.temporary_price and r.temporary_price["12oz"] %}
            <span class="ldg-old-price">${{ r.price["12oz"] }}</span><span class="ldg-sale-price">${{ r.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ r.price["12oz"] }}
          {% endif %}
        </span>
        <span class="ldg-arrow">&rarr;</span>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights ── -->
  <div class="ldg-cat-head" style="margin-top: 5rem;">
    <h2 class="ldg-cat-title">02 &bull; Tasting Flights</h2>
    <span class="ldg-cat-count">2 Flights</span>
  </div>

  <div class="ldg-table-head">
    <span>Flight Package</span>
    <span>Format</span>
    <span>Inclusions</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="ldg-table">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">The Aviary Sampler</span>
      <span class="ldg-profile">4 x 8oz Set</span>
      <span class="ldg-desc">Early Bird, Feather Soot, Chimney Sweep, Lil' Sipper</span>
      <span class="ldg-price">$38.00</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">Peck Your Own Flight</span>
      <span class="ldg-profile">Min. 4 x 8oz</span>
      <span class="ldg-desc">Customer-selected 8oz tasting bags from active catalog</span>
      <span class="ldg-price">$10.00 / ea</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>
  </div>

  <!-- ── 3. Custom Roastery ── -->
  <div class="ldg-cat-head" style="margin-top: 5rem;">
    <h2 class="ldg-cat-title">03 &bull; BYOB &bull; Custom Roastery Programs</h2>
    <span class="ldg-cat-count">4 Programs</span>
  </div>

  <div class="ldg-table-head">
    <span>Service</span>
    <span>Scope</span>
    <span>Details</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="ldg-table">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">BYOB &mdash; Build Your Own Blend</span>
      <span class="ldg-profile">Recipe Profile</span>
      <span class="ldg-desc">Custom ratio formulation across up to three origins and roast levels</span>
      <span class="ldg-price">$32.00</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">BYOB &mdash; Bring Your Own Beans</span>
      <span class="ldg-profile">Toll Roasting</span>
      <span class="ldg-desc">Customer supplied green coffee roasted to your exact batch profile</span>
      <span class="ldg-price">Quote</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">BYOB &mdash; Bank Your Own Burner</span>
      <span class="ldg-profile">Single Origin Custom</span>
      <span class="ldg-desc">Select any catalog origin and pick your custom target roast degree</span>
      <span class="ldg-price">Bean Cost</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">BYOB &mdash; Book Your Own Bootcamp</span>
      <span class="ldg-profile">Bootcamp Session</span>
      <span class="ldg-desc">Hands-on personalized roasting session for up to 3 guests</span>
      <span class="ldg-price">$30 + $15/guest</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>
  </div>

  <!-- ── 4. Gift Vouchers ── -->
  <div class="ldg-cat-head" style="margin-top: 5rem;">
    <h2 class="ldg-cat-title">04 &bull; Gift Vouchers</h2>
  </div>

  <div class="ldg-table-head">
    <span>Item</span>
    <span>Category</span>
    <span>Notes</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="ldg-table">
    <a href="{{ '/gift/' | relative_url }}" class="ldg-row">
      <span class="ldg-name">Digital Gift Card</span>
      <span class="ldg-profile">Voucher</span>
      <span class="ldg-desc">Instant digital code delivered via email for all catalog offerings</span>
      <span class="ldg-price">$15 &ndash; $90</span>
      <span class="ldg-arrow">&rarr;</span>
    </a>
  </div>
</div>
