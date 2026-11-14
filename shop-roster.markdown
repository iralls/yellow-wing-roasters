---
layout: default
title: Shop (Field Roster) — Yellow Wing Roasters
permalink: /shop-roster/
---

<style>
  /* ── Field Roster Minimalist Listing Prototype ── */
  :root {
    --roster-bg: #fbf9f5;
    --roster-card-bg: #ffffff;
    --roster-text: #1d1814;
    --roster-muted: #786f65;
    --roster-light-muted: #a3998e;
    --roster-accent: #9c6d12;
    --roster-sale: #b45309;
    --roster-line: rgba(29, 24, 20, 0.08);
    --roster-hover-bg: #f4efe6;
  }

  body {
    background-color: var(--roster-bg) !important;
    color: var(--roster-text);
  }

  .roster-wrap {
    max-width: 1140px;
    margin: 0 auto;
    padding: 3.5rem 24px 9rem;
  }

  /* ── Header ── */
  .roster-header {
    margin-bottom: 3.5rem;
  }

  .roster-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--roster-muted);
    margin-bottom: 0.65rem;
  }

  .roster-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    flex-wrap: wrap;
    padding-bottom: 1.75rem;
    border-bottom: 2px solid var(--roster-text);
  }

  .roster-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 500;
    letter-spacing: -0.025em;
    color: var(--roster-text);
    margin: 0;
    line-height: 1.05;
  }

  .roster-lead {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.98rem;
    color: var(--roster-muted);
    max-width: 440px;
    line-height: 1.5;
    margin: 0;
  }

  /* ── Section Title Bar ── */
  .roster-section-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 4.5rem 0 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--roster-line);
  }

  .roster-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--roster-text);
    margin: 0;
  }

  .roster-section-count {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    color: var(--roster-light-muted);
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  /* ── Tabular Header Row ── */
  .roster-col-labels {
    display: grid;
    grid-template-columns: 56px 2.2fr 2.6fr 130px 48px;
    gap: 1.5rem;
    padding: 0.5rem 1.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--roster-light-muted);
  }

  /* ── Row Item ── */
  .roster-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid var(--roster-line);
  }

  .roster-row {
    display: grid;
    grid-template-columns: 56px 2.2fr 2.6fr 130px 48px;
    align-items: center;
    gap: 1.5rem;
    padding: 1.15rem 1.25rem;
    background-color: transparent;
    border-bottom: 1px solid var(--roster-line);
    text-decoration: none;
    color: inherit;
    border-radius: 4px;
    transition: background-color 0.16s ease, transform 0.16s ease;
  }

  .roster-row:hover {
    text-decoration: none;
    color: inherit;
    background-color: var(--roster-hover-bg);
  }

  /* 1. Bird Icon */
  .roster-cell-visual {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .roster-bird-img {
    max-width: 84%;
    max-height: 84%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
    transition: transform 0.2s ease;
  }

  .roster-row:hover .roster-bird-img {
    transform: scale(1.1);
  }

  .roster-icon-generic {
    font-size: 1.35rem;
    opacity: 0.65;
  }

  /* 2. Primary Title & Subtitle */
  .roster-cell-title {
    min-width: 0;
  }

  .roster-item-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--roster-text);
    margin: 0 0 0.25rem;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .roster-badge {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 7px;
    background: rgba(156, 109, 18, 0.1);
    color: var(--roster-accent);
    border-radius: 3px;
    vertical-align: middle;
  }

  .roster-badge-single-origin {
    background: rgba(44, 110, 158, 0.1);
    color: #2c6e9e;
  }

  .roster-badge-seasonal {
    background: rgba(180, 83, 9, 0.1);
    color: var(--roster-sale);
  }

  .roster-badge-sale {
    background: rgba(180, 83, 9, 0.15);
    color: var(--roster-sale);
  }

  .roster-item-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    color: var(--roster-muted);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 3. Notes / Notes list */
  .roster-cell-notes {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    color: #645b52;
    line-height: 1.45;
  }

  .roster-cell-notes-italic {
    font-style: italic;
    color: var(--roster-muted);
  }

  /* 4. Price */
  .roster-cell-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.02rem;
    font-weight: 600;
    text-align: right;
    color: var(--roster-text);
    white-space: nowrap;
  }

  .roster-cell-price s {
    font-weight: 400;
    font-size: 0.86rem;
    color: var(--roster-light-muted);
    margin-right: 0.35rem;
  }

  .roster-sale-price {
    color: var(--roster-sale);
  }

  .roster-unit {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--roster-light-muted);
    margin-top: 1px;
  }

  /* 5. Action Arrow */
  .roster-cell-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: var(--roster-muted);
    transition: transform 0.16s ease, color 0.16s ease;
  }

  .roster-row:hover .roster-cell-action {
    transform: translateX(4px);
    color: var(--roster-text);
  }

  .roster-arrow-svg {
    width: 18px;
    height: 18px;
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 860px) {
    .roster-col-labels {
      display: none;
    }

    .roster-row {
      grid-template-columns: 44px 1fr auto;
      gap: 1rem;
      padding: 1rem 0.5rem;
    }

    .roster-cell-notes {
      display: none;
    }

    .roster-cell-action {
      display: none;
    }
  }
</style>

<div class="roster-wrap">
  <!-- ── Header ── -->
  <header class="roster-header">
    <div class="roster-eyebrow">Yellow Wing Roasters &bull; Catalogue Index</div>
    <div class="roster-title-row">
      <h1 class="roster-title">The Roster</h1>
      <p class="roster-lead">
        A direct itemized roster of our active roaster batches, samplers, and custom services. Roasted to order in small batches.
      </p>
    </div>
  </header>

  <!-- ── 1. Coffee ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="roster-section-head">
    <h2 class="roster-section-title">Coffee</h2>
    <span class="roster-section-count">{{ all_roasts.size }} Roasts Available</span>
  </div>

  <div class="roster-col-labels">
    <span></span>
    <span>Coffee &amp; Profile</span>
    <span>Tasting Notes &amp; Origins</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="roster-list">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="roster-row">
        <div class="roster-cell-visual">
          {% if r.mascot_file %}
            {% assign bird_path = '/images/' | append: r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }}" class="roster-bird-img" loading="lazy" decoding="async">
          {% else %}
            <span class="roster-icon-generic">&#9749;</span>
          {% endif %}
        </div>

        <div class="roster-cell-title">
          <div class="roster-item-name">
            {{ r.card_title | default: r.title }}
            {% if r.category %}
              <span class="roster-badge roster-badge-{{ r.category | slugify }}">{{ r.category | capitalize }}</span>
            {% endif %}
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <span class="roster-badge roster-badge-sale">Sale</span>
            {% endif %}
          </div>
          <p class="roster-item-sub">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
            {% if r.process %} &bull; {{ r.process }}{% elsif r.descriptor %} &bull; {{ r.descriptor }}{% endif %}
          </p>
        </div>

        <div class="roster-cell-notes">
          {% if r.tasting_notes %}
            <span class="roster-cell-notes-italic">{{ r.tasting_notes }}</span>
          {% endif %}
          {% if r.origins %}
            <div style="font-size: 0.78rem; color: var(--roster-light-muted); margin-top: 3px;">
              {{ r.origins | join: " &bull; " }}
            </div>
          {% elsif r.variety %}
            <div style="font-size: 0.78rem; color: var(--roster-light-muted); margin-top: 3px;">
              {{ r.variety }}
            </div>
          {% endif %}
        </div>

        <div class="roster-cell-price">
          {% if r.temporary_price and r.temporary_price["12oz"] %}
            <s>${{ r.price["12oz"] }}</s><span class="roster-sale-price">${{ r.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ r.price["12oz"] }}
          {% endif %}
          <span class="roster-unit">12oz bag</span>
        </div>

        <div class="roster-cell-action">
          <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Tasting Flights ── -->
  <div class="roster-section-head" style="margin-top: 5rem;">
    <h2 class="roster-section-title">Tasting Flights</h2>
    <span class="roster-section-count">2 Flights</span>
  </div>

  <div class="roster-col-labels">
    <span></span>
    <span>Flight Package</span>
    <span>Details &amp; Inclusions</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="roster-list">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#128038;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">The Aviary Sampler</div>
        <p class="roster-item-sub">Curated Signature Flight &bull; 4 x 8oz</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper.</span>
      </div>
      <div class="roster-cell-price">
        $38.00
        <span class="roster-unit">box set</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#9878;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">Peck Your Own Flight</div>
        <p class="roster-item-sub">Custom Tasting Flight &bull; Min. 4 x 8oz</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Choose four or more 8oz bags from our current roaster collection.</span>
      </div>
      <div class="roster-cell-price">
        $10.00
        <span class="roster-unit">per 8oz bag</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>
  </div>

  <!-- ── 3. Custom Roastery ── -->
  <div class="roster-section-head" style="margin-top: 5rem;">
    <h2 class="roster-section-title">BYOB &bull; Custom Roasts</h2>
    <span class="roster-section-count">4 Services</span>
  </div>

  <div class="roster-col-labels">
    <span></span>
    <span>Roastery Program</span>
    <span>Scope &amp; Customization</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="roster-list">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#9881;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">BYOB &mdash; Build Your Own Blend</div>
        <p class="roster-item-sub">Custom Recipe &bull; Micro-Batch Profiling</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Select up to three single origins and designate exact roast profiles.</span>
      </div>
      <div class="roster-cell-price">
        $32.00
        <span class="roster-unit">per formulation</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#128230;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">BYOB &mdash; Bring Your Own Beans</div>
        <p class="roster-item-sub">Green Lot Roasting Service</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Send green unroasted beans to our facility for bespoke small-batch roasting.</span>
      </div>
      <div class="roster-cell-price">
        Quote
        <span class="roster-unit">by lot volume</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#128293;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">BYOB &mdash; Bank Your Own Burner</div>
        <p class="roster-item-sub">Bespoke Single Roast Curve</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Choose any catalog origin and pick your exact roast degree.</span>
      </div>
      <div class="roster-cell-price">
        Bean Cost
        <span class="roster-unit">base price</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#127891;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">BYOB &mdash; Book Your Own Bootcamp</div>
        <p class="roster-item-sub">Hands-On Roasting Session &bull; Max 3 Guests</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Step behind the roaster yourself. Pick any single origin and roast live with us.</span>
      </div>
      <div class="roster-cell-price">
        $30 + $15/guest
        <span class="roster-unit">per session</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>
  </div>

  <!-- ── 4. Gift Cards ── -->
  <div class="roster-section-head" style="margin-top: 5rem;">
    <h2 class="roster-section-title">Gift Cards</h2>
  </div>

  <div class="roster-col-labels">
    <span></span>
    <span>Voucher</span>
    <span>Details</span>
    <span style="text-align: right;">Price</span>
    <span></span>
  </div>

  <div class="roster-list">
    <a href="{{ '/gift/' | relative_url }}" class="roster-row">
      <div class="roster-cell-visual">
        <span class="roster-icon-generic">&#127873;</span>
      </div>
      <div class="roster-cell-title">
        <div class="roster-item-name">Digital Gift Card</div>
        <p class="roster-item-sub">Instant Email Delivery</p>
      </div>
      <div class="roster-cell-notes">
        <span class="roster-cell-notes-italic">Prepaid gift code for coffee, samplers, and subscriptions.</span>
      </div>
      <div class="roster-cell-price">
        $15 &ndash; $90
        <span class="roster-unit">voucher</span>
      </div>
      <div class="roster-cell-action">
        <svg class="roster-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </a>
  </div>
</div>
