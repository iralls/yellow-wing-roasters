---
layout: default
title: Shop (Manifest Listing) — Yellow Wing Roasters
permalink: /shop-manifest/
---

<style>
  /* ── Archival Inventory Manifest Listing Prototype ── */
  :root {
    --mnf-bg: #fcfbf9;
    --mnf-text: #1d1712;
    --mnf-muted: #7d7266;
    --mnf-accent: #9c6d12;
    --mnf-sale: #b45309;
    --mnf-line: rgba(29, 23, 18, 0.1);
  }

  body {
    background-color: var(--mnf-bg) !important;
    color: var(--mnf-text);
  }

  .mnf-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 3.5rem 32px 9rem;
  }

  /* ── Header ── */
  .mnf-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--mnf-text);
    margin-bottom: 4rem;
  }

  .mnf-title-wrap {
    max-width: 600px;
  }

  .mnf-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--mnf-muted);
    margin-bottom: 0.5rem;
  }

  .mnf-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 500;
    letter-spacing: -0.025em;
    color: var(--mnf-text);
    margin: 0;
    line-height: 1.05;
  }

  .mnf-header-right {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    color: var(--mnf-muted);
    text-align: right;
  }

  /* ── Section Title ── */
  .mnf-section-header {
    margin: 4.5rem 0 1.75rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--mnf-line);
    padding-bottom: 0.75rem;
  }

  .mnf-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--mnf-text);
    margin: 0;
  }

  .mnf-section-count {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    color: var(--mnf-muted);
  }

  /* ── 2-Column Listing Grid ── */
  .mnf-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 4rem;
  }

  @media (max-width: 820px) {
    .mnf-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  /* ── Listing Row Block ── */
  .mnf-item {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--mnf-line);
    text-decoration: none;
    color: inherit;
    transition: opacity 0.15s ease;
  }

  .mnf-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.75;
  }

  /* Top Line: Name and Price */
  .mnf-item-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.35rem;
  }

  .mnf-item-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.28rem;
    font-weight: 600;
    color: var(--mnf-text);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .mnf-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--mnf-text);
    white-space: nowrap;
    text-align: right;
  }

  .mnf-item-price s {
    color: #a89e94;
    font-weight: 400;
    font-size: 0.92rem;
    margin-right: 0.35rem;
  }

  .mnf-item-price .sale-val {
    color: var(--mnf-sale);
  }

  /* Subtitle: Origin & Roast Level */
  .mnf-item-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.84rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--mnf-accent);
    margin-bottom: 0.35rem;
  }

  /* Notes */
  .mnf-item-notes {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    color: var(--mnf-muted);
    line-height: 1.45;
    margin: 0;
  }
</style>

<div class="mnf-wrap">
  <!-- ── Header ── -->
  <header class="mnf-header">
    <div class="mnf-title-wrap">
      <div class="mnf-eyebrow">Yellow Wing Roasters</div>
      <h1 class="mnf-title">Manifest</h1>
    </div>
    <div class="mnf-header-right">
      Active Cellar &bull; Micro-Lot Sourcing
    </div>
  </header>

  <!-- ── 1. Coffee ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="mnf-section-header">
    <h2 class="mnf-section-title">Coffee</h2>
    <span class="mnf-section-count">{{ all_roasts.size }} Roasts Available</span>
  </div>

  <div class="mnf-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      <a href="{{ r.url | relative_url }}" class="mnf-item">
        <div class="mnf-item-head">
          <h3 class="mnf-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="mnf-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="mnf-item-sub">
          {{ r.category | upcase }}{% if level_info %} &bull; {{ level_info.layman | upcase }} ROAST{% endif %}
        </div>

        <p class="mnf-item-notes">
          {% if r.descriptor %}
            <strong>{{ r.descriptor | capitalize }}.</strong>
          {% endif %}
          {% if r.tasting_notes %}
            {{ r.tasting_notes | capitalize }}.
          {% endif %}
        </p>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights ── -->
  <div class="mnf-section-header">
    <h2 class="mnf-section-title">Flights</h2>
    <span class="mnf-section-count">2 Offerings</span>
  </div>

  <div class="mnf-grid">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">The Aviary</h3>
        <div class="mnf-item-price">$38.00</div>
      </div>
      <div class="mnf-item-sub">Signature Sampler &bull; 4 x 8oz</div>
      <p class="mnf-item-notes">Four 8oz bags of Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper.</p>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">Peck Your Own</h3>
        <div class="mnf-item-price">$10.00 / bag</div>
      </div>
      <div class="mnf-item-sub">Custom Tasting Flight &bull; Min. 4</div>
      <p class="mnf-item-notes">Select four or more 8oz tasting bags from our active roaster catalog.</p>
    </a>
  </div>

  <!-- ── 3. Custom Roastery ── -->
  <div class="mnf-section-header">
    <h2 class="mnf-section-title">Custom Roasts</h2>
    <span class="mnf-section-count">3 Services</span>
  </div>

  <div class="mnf-grid">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">Build Your Own Blend</h3>
        <div class="mnf-item-price">$32.00</div>
      </div>
      <div class="mnf-item-sub">Custom Blend &bull; Formulated Profile</div>
      <p class="mnf-item-notes">Formulate up to three varieties with individual roast degrees for your house blend.</p>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">Bring Your Own Beans</h3>
        <div class="mnf-item-price">Quote</div>
      </div>
      <div class="mnf-item-sub">Custom Roasting Service</div>
      <p class="mnf-item-notes">Send unroasted green lots to our roastery for custom profiling and roast batches.</p>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">Bank Your Own Burner</h3>
        <div class="mnf-item-price">Bean Cost</div>
      </div>
      <div class="mnf-item-sub">Single Origin Custom Degree</div>
      <p class="mnf-item-notes">Pick any single-origin bean in our catalog and designate your target roast degree.</p>
    </a>
  </div>

  <!-- ── 4. Gift Cards ── -->
  <div class="mnf-section-header">
    <h2 class="mnf-section-title">Gift Cards</h2>
  </div>

  <div class="mnf-grid">
    <a href="{{ '/gift/' | relative_url }}" class="mnf-item">
      <div class="mnf-item-head">
        <h3 class="mnf-item-name">Digital Gift Card</h3>
        <div class="mnf-item-price">$15 &ndash; $90</div>
      </div>
      <div class="mnf-item-sub">Instant Email Delivery</div>
      <p class="mnf-item-notes">Prepaid digital code delivered via email for coffees, flights, and grind selection.</p>
    </a>
  </div>
</div>
