---
layout: default
title: Shop (Hester) — Yellow Wing Roasters
permalink: /shop-hester/
---

<style>
  /* ── Hester Squarespace Demo Inspired Shop ── */
  :root {
    --hester-bg: #fdfcfb;
    --hester-card-bg: transparent;
    --hester-img-bg: #f6f3ef;
    --hester-text: #261f1a;
    --hester-muted: #7d7268;
    --hester-accent: #9c6d12;
    --hester-sale: #b45309;
    --hester-border: rgba(38, 31, 26, 0.08);
  }

  body {
    background-color: var(--hester-bg) !important;
    color: var(--hester-text);
  }

  .hester-shop {
    max-width: 1360px;
    margin: 0 auto;
    padding: 2.5rem 32px 8rem;
  }

  /* ── Hester Centered Shop Header ── */
  .hester-header {
    text-align: center;
    margin: 1.5rem auto 4.5rem;
  }

  .hester-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.75rem, 6vw, 4.75rem);
    font-weight: 500;
    color: var(--hester-text);
    line-height: 1.05;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }

  .hester-subtitle {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.1rem;
    color: var(--hester-muted);
    max-width: 540px;
    margin: 0 auto;
    line-height: 1.55;
  }

  /* ── Category Filters ── */
  .hester-filters {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    margin-top: 2.5rem;
  }

  .hester-filter-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--hester-muted);
    text-decoration: none;
    padding-bottom: 3px;
    border-bottom: 1.5px solid transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .hester-filter-btn:hover,
  .hester-filter-btn.is-active {
    color: var(--hester-text);
    border-color: var(--hester-text);
    text-decoration: none;
  }

  /* ── Section Dividers ── */
  .hester-section-header {
    margin: 6rem 0 2.5rem;
    text-align: left;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid var(--hester-border);
    padding-bottom: 0.75rem;
  }

  .hester-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--hester-text);
    letter-spacing: -0.01em;
    margin: 0;
  }

  .hester-section-count {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    color: var(--hester-muted);
  }

  /* ── 3-Column / 4-Column Responsive Grid ── */
  .hester-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3.5rem 2.5rem;
  }

  @media (max-width: 960px) {
    .hester-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.75rem 1.75rem;
    }
  }

  @media (max-width: 580px) {
    .hester-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  /* ── Hester Product Item Card ── */
  .hester-item {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
  }

  .hester-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.94;
  }

  /* ── Image Canvas ── */
  .hester-image-wrap {
    position: relative;
    aspect-ratio: 1;
    background: var(--hester-img-bg);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(24px, 3.5vw, 40px);
    overflow: hidden;
    margin-bottom: 1.15rem;
    transition: background-color 0.25s ease;
  }

  .hester-item:hover .hester-image-wrap {
    background-color: #eee9e2;
  }

  .hester-image {
    max-width: 84%;
    max-height: 84%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hester-item:hover .hester-image {
    transform: scale(1.04);
  }

  /* Badge */
  .hester-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    background: rgba(38, 31, 26, 0.85);
    color: #ffffff;
    border-radius: 3px;
  }

  /* ── Hester Signature Title & Price Row (Aligned Left & Right) ── */
  .hester-title-price {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.35rem;
  }

  .hester-item-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--hester-text);
    line-height: 1.2;
    margin: 0;
    transition: color 0.15s ease;
  }

  .hester-item:hover .hester-item-title {
    color: var(--hester-accent);
  }

  .hester-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--hester-text);
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
  }

  .hester-item-price s {
    color: #a3998f;
    font-weight: 400;
    font-size: 0.95rem;
    margin-right: 0.35rem;
  }

  .hester-item-price .sale-price {
    color: var(--hester-sale);
    font-weight: 600;
  }

  /* ── Descriptor & Tasting Notes Underneath ── */
  .hester-item-desc {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    color: var(--hester-muted);
    line-height: 1.45;
    margin: 0;
  }

</style>

<div class="hester-shop">
  <!-- ── Header ── -->
  <div class="hester-header">
    <h1 class="hester-title">Shop</h1>
    <p class="hester-subtitle">
      Small-batch coffees, tasting flights, and house pantry goods from our roastery in Massachusetts.
    </p>

    <div class="hester-filters">
      <a href="#coffees" class="hester-filter-btn is-active">All Coffees</a>
      <a href="#flights" class="hester-filter-btn">Flights</a>
      <a href="#custom" class="hester-filter-btn">Custom</a>
      <a href="#pantry" class="hester-filter-btn">Pantry</a>
      <a href="#gifts" class="hester-filter-btn">Gifts</a>
    </div>
  </div>

  <!-- ── 1. Coffees Section ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="hester-section-header" id="coffees">
    <h2 class="hester-section-title">Coffees</h2>
    <span class="hester-section-count">{{ all_roasts.size }} items</span>
  </div>

  <div class="hester-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      <a href="{{ r.url | relative_url }}" class="hester-item">
        <div class="hester-image-wrap">
          {% if r.status == 'new' or r.status == 'seasonal' %}
            <span class="hester-badge">{{ r.status }}</span>
          {% endif %}

          {% if r.mascot_file %}
            {% assign bird_path = '/images/' | append: r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }} mascot" class="hester-image" loading="lazy" decoding="async">
          {% endif %}
        </div>

        <div class="hester-title-price">
          <div class="hester-item-title">{{ r.card_title | default: r.title }}</div>

          <div class="hester-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s>
              <span class="sale-price">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <p class="hester-item-desc">
          {% if r.descriptor %}
            {{ r.descriptor | capitalize }}
          {% endif %}
          {% if level_info %}
            &bull; {{ level_info.layman }} Roast
          {% endif %}
        </p>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights Section ── -->
  <div class="hester-section-header" id="flights">
    <h2 class="hester-section-title">Flights</h2>
    <span class="hester-section-count">2 items</span>
  </div>

  <div class="hester-grid">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="The Aviary cage" class="hester-image" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">The Aviary</div>
        <div class="hester-item-price">$38.00</div>
      </div>
      <p class="hester-item-desc">Sampler Flight &bull; Four 8oz signature blend bags</p>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <img src="{{ '/images/peck-your-own-transparent.png' | relative_url }}" alt="Peck Your Own" class="hester-image" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">Peck Your Own</div>
        <div class="hester-item-price">$10.00 / bag</div>
      </div>
      <p class="hester-item-desc">Custom Flight &bull; Build your custom 8oz sample box</p>
    </a>
  </div>

  <!-- ── 3. Custom Roastery Section ── -->
  <div class="hester-section-header" id="custom">
    <h2 class="hester-section-title">Custom Roastery</h2>
    <span class="hester-section-count">3 items</span>
  </div>

  <div class="hester-grid">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <img src="{{ '/images/build-a-bird-transparent.png' | relative_url }}" alt="Build Your Own Blend mascot" class="hester-image" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">Build Your Own Blend</div>
        <div class="hester-item-price">$32.00</div>
      </div>
      <p class="hester-item-desc">Custom Blend &bull; Up to 3 varieties with individual roast degrees</p>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans mascot" class="hester-image" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">Bring Your Own Beans</div>
        <div class="hester-item-price">Quote</div>
      </div>
      <p class="hester-item-desc">Custom Sourced &bull; Send us green beans for personalized roasting</p>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="Bank Your Own Burner mascot" class="hester-image" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">Bank Your Own Burner</div>
        <div class="hester-item-price">Bean Cost</div>
      </div>
      <p class="hester-item-desc">Custom Profile &bull; Dial in your chosen single-origin roast level</p>
    </a>
  </div>

  <!-- ── 4. Pantry Section ── -->
  <div class="hester-section-header" id="pantry">
    <h2 class="hester-section-title">Pantry</h2>
  </div>

  {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
  <div class="hester-grid">
    {% for item in active_pantry %}
      {% assign img_path = '/images/' | append: item.mascot_file %}
      <a href="{{ item.url | relative_url }}" class="hester-item">
        <div class="hester-image-wrap">
          <img src="{{ img_path | relative_url }}" alt="{{ item.mascot_alt | default: item.title }}" class="hester-image" loading="lazy" decoding="async">
        </div>
        <div class="hester-title-price">
          <div class="hester-item-title">{{ item.title }}</div>
          <div class="hester-item-price">${{ item.price }}</div>
        </div>
        <p class="hester-item-desc">
          {{ item.descriptor | default: item.intro | default: "Small-batch pantry delicacy" }}
        </p>
      </a>
    {% endfor %}
  </div>

  <!-- ── 5. Gifts Section ── -->
  <div class="hester-section-header" id="gifts">
    <h2 class="hester-section-title">Gifts</h2>
  </div>

  <div class="hester-grid">
    <a href="{{ '/gift/' | relative_url }}" class="hester-item">
      <div class="hester-image-wrap">
        <span class="hester-badge">Instant</span>
        <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" class="hester-image" style="max-width: 90%; max-height: 90%;" loading="lazy" decoding="async">
      </div>
      <div class="hester-title-price">
        <div class="hester-item-title">Digital Gift Card</div>
        <div class="hester-item-price">$15 &ndash; $90</div>
      </div>
      <p class="hester-item-desc">Instant digital code delivered via email</p>
    </a>
  </div>
</div>
