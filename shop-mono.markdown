---
layout: default
title: Shop (Swiss Grid) — Yellow Wing Roasters
permalink: /shop-mono/
---

<style>
  /* ── Swiss Modernist Architectural Grid ── */
  :root {
    --mono-bg: #ffffff;
    --mono-text: #1a1714;
    --mono-muted: #82776c;
    --mono-border: rgba(26, 23, 20, 0.1);
    --mono-hover-bg: #f9f7f4;
    --mono-accent: #b45309;
  }

  body {
    background-color: var(--mono-bg) !important;
    color: var(--mono-text);
  }

  .mono-shop {
    max-width: 1440px;
    margin: 0 auto;
    padding: 2.5rem 32px 8rem;
  }

  /* ── Header ── */
  .mono-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 1.5rem;
    border-bottom: 1.5px solid var(--mono-text);
    margin-bottom: 3.5rem;
  }

  .mono-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.2rem, 4.5vw, 3.5rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--mono-text);
    margin: 0;
  }

  .mono-header-meta {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--mono-muted);
  }

  /* ── 4-Column Architectural Grid with Shared Borders ── */
  .mono-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--mono-border);
    border-left: 1px solid var(--mono-border);
  }

  @media (max-width: 1100px) {
    .mono-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 780px) {
    .mono-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 500px) {
    .mono-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Cell Item ── */
  .mono-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1.75rem;
    border-right: 1px solid var(--mono-border);
    border-bottom: 1px solid var(--mono-border);
    text-decoration: none;
    color: inherit;
    background: var(--mono-bg);
    transition: background-color 0.2s ease;
  }

  .mono-cell:hover {
    background-color: var(--mono-hover-bg);
    text-decoration: none;
    color: inherit;
  }

  /* Top row in cell */
  .mono-cell-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mono-muted);
    margin-bottom: 1.5rem;
  }

  .mono-cell-price {
    font-size: 0.88rem;
    color: var(--mono-text);
    font-weight: 700;
  }

  .mono-cell-price s {
    color: #a89e94;
    font-weight: 400;
    margin-right: 0.25rem;
  }

  .mono-cell-price .sale-val {
    color: var(--mono-accent);
  }

  /* Image stage in cell */
  .mono-cell-visual {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
  }

  .mono-cell-img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .mono-cell:hover .mono-cell-img {
    transform: scale(1.05);
  }

  /* Bottom metadata in cell */
  .mono-cell-bottom {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: auto;
  }

  .mono-cell-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--mono-text);
    line-height: 1.25;
    margin: 0;
    transition: color 0.15s ease;
  }

  .mono-cell:hover .mono-cell-title {
    color: var(--mono-accent);
  }

  .mono-cell-notes {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.84rem;
    color: var(--mono-muted);
    line-height: 1.4;
    margin: 0;
  }

  /* ── Section Dividers ── */
  .mono-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--mono-text);
    margin: 5rem 0 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mono-section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--mono-border);
  }
</style>

<div class="mono-shop">
  <!-- ── Header ── -->
  <div class="mono-header">
    <h1 class="mono-title">Roster</h1>
    <div class="mono-header-meta">Small-Batch &bull; Fresh Roasted</div>
  </div>

  <!-- ── 1. Coffees ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="mono-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign bird_path = '/images/' | append: r.mascot_file %}

      <a href="{{ r.url | relative_url }}" class="mono-cell">
        <div class="mono-cell-top">
          <span>{{ r.category }} / {% if level_info %}{{ level_info.layman }}{% endif %}</span>
          <span class="mono-cell-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </span>
        </div>

        <div class="mono-cell-visual">
          {% if r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }}" class="mono-cell-img" loading="lazy" decoding="async">
          {% endif %}
        </div>

        <div class="mono-cell-bottom">
          <h2 class="mono-cell-title">{{ r.card_title | default: r.title }}</h2>
          <p class="mono-cell-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &bull; {{ r.tasting_notes }}{% endif %}
          </p>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights ── -->
  <div class="mono-section-title">Flights</div>
  <div class="mono-grid">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>Sampler / 4x8oz</span>
        <span class="mono-cell-price">$38</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="The Aviary" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">The Aviary</h2>
        <p class="mono-cell-notes">Four 8oz signature blends</p>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>Custom / Min 4</span>
        <span class="mono-cell-price">$10/bag</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/peck-your-own-transparent.png' | relative_url }}" alt="Peck Your Own" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">Peck Your Own</h2>
        <p class="mono-cell-notes">Build a custom sampler flight</p>
      </div>
    </a>
  </div>

  <!-- ── 3. Custom Roasts ── -->
  <div class="mono-section-title">BYOB &bull; Custom Roastery</div>
  <div class="mono-grid">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>BYOB / Blend</span>
        <span class="mono-cell-price">$32</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/build-a-bird-transparent.png' | relative_url }}" alt="Build Your Own Blend" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">BYOB &mdash; Build Your Own Blend</h2>
        <p class="mono-cell-notes">3-bean formulated profile</p>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>BYOB / Sourced</span>
        <span class="mono-cell-price">Quote</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">BYOB &mdash; Bring Your Own Beans</h2>
        <p class="mono-cell-notes">Send unroasted green beans</p>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>BYOB / Profile</span>
        <span class="mono-cell-price">Bean Cost</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="Bank Your Own Burner" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">BYOB &mdash; Bank Your Own Burner</h2>
        <p class="mono-cell-notes">Target custom single-origin roast degree</p>
      </div>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>BYOB / Bootcamp</span>
        <span class="mono-cell-price">$30 + $15/guest</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/teacher-transparent.png' | relative_url }}" alt="Book Your Own Bootcamp" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">BYOB &mdash; Book Your Own Bootcamp</h2>
        <p class="mono-cell-notes">Hands-on live roasting session</p>
      </div>
    </a>
  </div>

  <!-- ── 4. Gifts ── -->
  {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
  <div class="mono-section-title">{% if active_pantry.size > 0 %}Pantry &amp; Gifts{% else %}Gift Cards{% endif %}</div>
  <div class="mono-grid">
    {% for item in active_pantry %}
      {% assign img_path = '/images/' | append: item.mascot_file %}
      <a href="{{ item.url | relative_url }}" class="mono-cell">
        <div class="mono-cell-top">
          <span>Pantry</span>
          <span class="mono-cell-price">${{ item.price }}</span>
        </div>
        <div class="mono-cell-visual">
          <img src="{{ img_path | relative_url }}" alt="{{ item.title }}" class="mono-cell-img" loading="lazy" decoding="async">
        </div>
        <div class="mono-cell-bottom">
          <h2 class="mono-cell-title">{{ item.title }}</h2>
          <p class="mono-cell-notes">{{ item.descriptor | default: item.intro }}</p>
        </div>
      </a>
    {% endfor %}

    <a href="{{ '/gift/' | relative_url }}" class="mono-cell">
      <div class="mono-cell-top">
        <span>Instant</span>
        <span class="mono-cell-price">$15+</span>
      </div>
      <div class="mono-cell-visual">
        <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" class="mono-cell-img" loading="lazy" decoding="async">
      </div>
      <div class="mono-cell-bottom">
        <h2 class="mono-cell-title">Digital Gift Card</h2>
        <p class="mono-cell-notes">Prepaid digital code delivered via email</p>
      </div>
    </a>
  </div>
</div>
