---
layout: default
title: Shop (Specimen) — Yellow Wing Roasters
permalink: /shop-specimen/
---

<style>
  /* ── Ultra-Minimal Specimen Gallery (Radical Reduction) ── */
  :root {
    --specimen-bg: #f8f6f2;
    --specimen-text: #221c17;
    --specimen-muted: #7d7268;
    --specimen-accent: #9c6d12;
    --specimen-sale: #b45309;
    --specimen-border: rgba(34, 28, 23, 0.08);
  }

  body {
    background-color: var(--specimen-bg) !important;
    color: var(--specimen-text);
  }

  .specimen-shop {
    max-width: 1320px;
    margin: 0 auto;
    padding: 3rem 32px 9rem;
  }

  /* ── Clean Understated Page Header ── */
  .specimen-header {
    text-align: center;
    margin: 1.5rem auto 5.5rem;
    max-width: 580px;
  }

  .specimen-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--specimen-muted);
    margin-bottom: 0.85rem;
  }

  .specimen-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 500;
    color: var(--specimen-text);
    line-height: 1.1;
    margin: 0 0 0.85rem;
    letter-spacing: -0.02em;
  }

  .specimen-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    color: var(--specimen-muted);
    line-height: 1.6;
    margin: 0;
  }

  /* ── Section Dividers ── */
  .specimen-section-header {
    margin: 6.5rem 0 3rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--specimen-border);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .specimen-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--specimen-text);
    margin: 0;
  }

  .specimen-section-meta {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    color: var(--specimen-muted);
    letter-spacing: 0.05em;
  }

  /* ── Borderless 3-Column Gallery Grid ── */
  .specimen-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rem 3.5rem;
  }

  @media (max-width: 960px) {
    .specimen-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 3.5rem 2rem;
    }
  }

  @media (max-width: 580px) {
    .specimen-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .specimen-header {
      margin-bottom: 3.5rem;
    }
  }

  /* ── Specimen Item ── */
  .specimen-item {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.25s ease;
  }

  .specimen-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.85;
  }

  /* ── Zero-Box Image Stage (Bird sits directly on background) ── */
  .specimen-visual {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .specimen-bird {
    max-width: 88%;
    max-height: 88%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .specimen-item:hover .specimen-bird {
    transform: translateY(-4px) scale(1.03);
  }

  /* ── Typographic Specimen Info ── */
  .specimen-meta {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }

  .specimen-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--specimen-text);
    margin: 0;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .specimen-level-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--specimen-muted);
    margin: 0;
  }

  .specimen-price {
    color: var(--specimen-text);
    font-weight: 600;
  }

  .specimen-price s {
    color: #a89e94;
    font-weight: 400;
    margin-right: 0.25rem;
  }

  .specimen-price .sale-val {
    color: var(--specimen-sale);
  }

  .specimen-notes {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.86rem;
    font-style: italic;
    color: #8c8074;
    line-height: 1.45;
    margin: 0.25rem 0 0;
  }
</style>

<div class="specimen-shop">
  <!-- ── Header ── -->
  <div class="specimen-header">
    <div class="specimen-eyebrow">Yellow Wing Roasters</div>
    <h1 class="specimen-title">Current Offerings</h1>
    <p class="specimen-sub">
      Small-batch coffees profiled and roasted to order. No excess, no compromise.
    </p>
  </div>

  <!-- ── 1. Coffees Section ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="specimen-section-header">
    <h2 class="specimen-section-title">Fresh Roasts</h2>
    <span class="specimen-section-meta">{{ all_roasts.size }} Available</span>
  </div>

  <div class="specimen-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      <a href="{{ r.url | relative_url }}" class="specimen-item">
        <div class="specimen-visual">
          {% if r.mascot_file %}
            {% assign bird_path = '/images/' | append: r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }}" class="specimen-bird" loading="lazy" decoding="async">
          {% endif %}
        </div>

        <div class="specimen-meta">
          <h3 class="specimen-name">{{ r.card_title | default: r.title }}</h3>

          <p class="specimen-level-price">
            {% if level_info %}{{ level_info.layman }} Roast &bull; {% endif %}
            <span class="specimen-price">
              {% if r.temporary_price and r.temporary_price["12oz"] %}
                <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
              {% else %}
                ${{ r.price["12oz"] }}
              {% endif %}
            </span>
          </p>

          <p class="specimen-notes">
            {% if r.descriptor %}
              {{ r.descriptor | capitalize }}
            {% elsif r.tasting_notes %}
              {{ r.tasting_notes }}
            {% endif %}
          </p>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights Section ── -->
  <div class="specimen-section-header">
    <h2 class="specimen-section-title">Flights</h2>
    <span class="specimen-section-meta">2 Offerings</span>
  </div>

  <div class="specimen-grid">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="The Aviary cage" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">The Aviary</h3>
        <p class="specimen-level-price">Four 8oz Signature Blends &bull; <span class="specimen-price">$38</span></p>
        <p class="specimen-notes">Early Bird, Feather Soot, Chimney Sweep, Lil' Sipper</p>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/peck-your-own-transparent.png' | relative_url }}" alt="Peck Your Own" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">Peck Your Own</h3>
        <p class="specimen-level-price">Custom 8oz Tasting Box &bull; <span class="specimen-price">$10 / bag</span></p>
        <p class="specimen-notes">Select four or more roasts from our catalog</p>
      </div>
    </a>
  </div>

  <!-- ── 3. Custom Roastery Section ── -->
  <div class="specimen-section-header">
    <h2 class="specimen-section-title">BYOB &bull; Custom Roastery</h2>
    <span class="specimen-section-meta">4 Options</span>
  </div>

  <div class="specimen-grid">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/build-a-bird-transparent.png' | relative_url }}" alt="Build Your Own Blend" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">BYOB &mdash; Build Your Own Blend</h3>
        <p class="specimen-level-price">Custom 3-Bean Blend &bull; <span class="specimen-price">$32</span></p>
        <p class="specimen-notes">Formulate and profile your personalized roast</p>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">BYOB &mdash; Bring Your Own Beans</h3>
        <p class="specimen-level-price">Custom Sourced &bull; <span class="specimen-price">Quote</span></p>
        <p class="specimen-notes">Send unroasted green lots to our roastery</p>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="Bank Your Own Burner" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">BYOB &mdash; Bank Your Own Burner</h3>
        <p class="specimen-level-price">Custom Roast Profile &bull; <span class="specimen-price">Bean Cost</span></p>
        <p class="specimen-notes">Select any single origin and target roast level</p>
      </div>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/teacher-transparent.png' | relative_url }}" alt="Book Your Own Bootcamp" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">BYOB &mdash; Book Your Own Bootcamp</h3>
        <p class="specimen-level-price">Roasting Bootcamp &bull; <span class="specimen-price">$30 + $15/guest</span></p>
        <p class="specimen-notes">Hands-on personalized roasting session for up to 3 guests</p>
      </div>
    </a>
  </div>

  <!-- ── 4. Pantry & Sweets ── -->
  {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
  {% if active_pantry.size > 0 %}
    <div class="specimen-section-header">
      <h2 class="specimen-section-title">Pantry</h2>
    </div>

    <div class="specimen-grid">
      {% for item in active_pantry %}
        {% assign img_path = '/images/' | append: item.mascot_file %}
        <a href="{{ item.url | relative_url }}" class="specimen-item">
          <div class="specimen-visual">
            <img src="{{ img_path | relative_url }}" alt="{{ item.mascot_alt | default: item.title }}" class="specimen-bird" loading="lazy" decoding="async">
          </div>
          <div class="specimen-meta">
            <h3 class="specimen-name">{{ item.title }}</h3>
            <p class="specimen-level-price">Pantry &bull; <span class="specimen-price">${{ item.price }}</span></p>
            <p class="specimen-notes">
              {{ item.descriptor | default: item.intro | default: "Small-batch artisanal treat" }}
            </p>
          </div>
        </a>
      {% endfor %}
    </div>
  {% endif %}

  <!-- ── 5. Gifts ── -->
  <div class="specimen-section-header">
    <h2 class="specimen-section-title">Gifts</h2>
  </div>

  <div class="specimen-grid">
    <a href="{{ '/gift/' | relative_url }}" class="specimen-item">
      <div class="specimen-visual">
        <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" class="specimen-bird" loading="lazy" decoding="async">
      </div>
      <div class="specimen-meta">
        <h3 class="specimen-name">Digital Gift Card</h3>
        <p class="specimen-level-price">Instant Delivery &bull; <span class="specimen-price">$15 &ndash; $90</span></p>
        <p class="specimen-notes">Prepaid gift voucher sent via email</p>
      </div>
    </a>
  </div>
</div>
