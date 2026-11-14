---
layout: default
title: Shop
permalink: /shop/
subtitle: >-
  Roasted fresh to order.<br>
  Free local delivery.
---

<style>
  /* ── Fine Dining / Wine List Minimalist Listing Prototype ── */
  :root {
    --menu-bg: #fcfbfa;
    --menu-text: #241d17;
    --menu-muted: #7a7065;
    --menu-accent: #9c6d12;
    --menu-sale: #b45309;
    --menu-line: rgba(36, 29, 23, 0.12);
  }

  body {
    background-color: var(--menu-bg) !important;
    color: var(--menu-text);
  }

  .menu-listing-wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 3.5rem 24px 9rem;
  }

  /* ── Header ── */
  .menu-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .menu-header-mark {
    display: inline-block;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--menu-muted);
    margin-bottom: 0.75rem;
  }

  .menu-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 5vw, 3.75rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--menu-text);
    margin: 0;
  }

  .menu-subtitle {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    color: var(--menu-muted);
    line-height: 1.6;
    margin: 1rem 0 0;
  }

  /* ── Section Dividers ── */
  .menu-section {
    margin-bottom: 4.5rem;
  }

  .menu-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--menu-muted);
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--menu-line);
    margin: 0 0 2rem;
  }

  /* ── Single Menu Listing Item ── */
  .menu-item {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 1rem 0;
    transition: opacity 0.18s ease;
  }

  .menu-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.75;
  }

  /* Top row: Name on left, dots leader, price on right */
  .menu-item-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .menu-item-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--menu-text);
    margin: 0;
    white-space: nowrap;
  }

  .menu-item-leader {
    flex-grow: 1;
    border-bottom: 1px dotted var(--menu-line);
    margin: 0 0.25rem;
    transform: translateY(-4px);
  }

  .menu-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--menu-text);
    white-space: nowrap;
  }

  .menu-item-price s {
    color: #a89e94;
    font-weight: 400;
    font-size: 0.95rem;
    margin-right: 0.35rem;
  }

  .menu-item-price .sale-val {
    color: var(--menu-sale);
  }

  /* Bottom row: Subtitle / notes */
  .menu-item-desc {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-top: 0.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    color: var(--menu-muted);
  }

  .menu-item-notes {
    font-style: italic;
  }

  .menu-item-meta {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    text-align: right;
  }

  @media (max-width: 580px) {
    .menu-item-leader {
      display: none;
    }
    .menu-item-desc {
      flex-direction: column;
      gap: 0.15rem;
    }
  }
</style>

<div class="menu-listing-wrap">
  <!-- ── Header ── -->
  <header class="menu-header">
    <h1 class="menu-title">Shop</h1>
    {% if page.subtitle %}
      <p class="menu-subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>

  <!-- ── 1. Coffee: Signature Blends ── -->
  {% assign blends = site.roasts | where: "category", "blend" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Signature Blends</h2>

    {% for r in blends %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 2. Coffee: Single Origins ── -->
  {% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Single Origins</h2>

    {% for r in single_origins %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 3. Coffee: Seasonal Roasts ── -->
  {% assign seasonals = site.roasts | where: "category", "seasonal" | sort: "order" %}
  {% if seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Seasonal Roasts</h2>

    {% for r in seasonals %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 4. Flights ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">Tasting Flights</h2>

    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">The Aviary</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$38.00</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Four 8oz signature blend bags: Early Bird, Feather Soot, Chimney Sweep, Lil' Sipper</span>
        <span class="menu-item-meta">4 x 8oz</span>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Peck Your Own</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$10.00 / bag</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Build a custom tasting flight with four or more 8oz bags from our active roster</span>
        <span class="menu-item-meta">Min. 4 Bags</span>
      </div>
    </a>
  </section>

  <!-- ── 5. Custom Roastery ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">BYOB &bull; Custom Roastery</h2>

    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Build Your Own Blend</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$32.00</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Formulate up to three varieties with individual roast degrees</span>
        <span class="menu-item-meta">Custom Batch</span>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Bring Your Own Beans</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Quote</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Send us your raw unroasted coffee beans for custom profiling</span>
        <span class="menu-item-meta">Custom Sourced</span>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Bank Your Own Burner</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Bean Cost</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Designate your target roast level on any single-origin bean in our catalog</span>
        <span class="menu-item-meta">Profile Spec</span>
      </div>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Book Your Own Bootcamp</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$30 + $15/guest</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Hands-on personalized roasting session for up to 3 guests</span>
        <span class="menu-item-meta">Bootcamp Session</span>
      </div>
    </a>
  </section>

  <!-- ── 6. Gift Cards ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">Gift Cards</h2>

    <a href="{{ '/gift/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Digital Gift Card</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$15 &ndash; $90</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Prepaid instant digital code delivered via email</span>
        <span class="menu-item-meta">Voucher</span>
      </div>
    </a>
  </section>
</div>
