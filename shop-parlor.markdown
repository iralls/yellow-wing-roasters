---
layout: default
title: Shop (Parlor) — Yellow Wing Roasters
permalink: /shop-parlor/
---

<style>
  /* ── Parlor Coffee Inspired Minimalist Shop ── */
  :root {
    --parlor-bg: #fcfbf9;
    --parlor-card-bg: transparent;
    --parlor-img-bg: #f5f2ed;
    --parlor-text: #1f1b18;
    --parlor-muted: #736b63;
    --parlor-accent: #9c6d12;
    --parlor-border: rgba(31, 27, 24, 0.08);
  }

  body {
    background-color: var(--parlor-bg) !important;
    color: var(--parlor-text);
  }

  .parlor-shop {
    max-width: 1240px;
    margin: 0 auto;
    padding: 2rem 24px 7rem;
  }

  /* ── Header & Category Anchor Bar ── */
  .parlor-header {
    text-align: center;
    margin: 2rem auto 3.5rem;
  }

  .parlor-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--parlor-text);
    margin: 0 0 1.25rem;
  }

  .parlor-nav-anchors {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--parlor-border);
  }

  .parlor-nav-anchor {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--parlor-muted);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: color 0.15s ease;
  }

  .parlor-nav-anchor:hover,
  .parlor-nav-anchor.is-active {
    color: var(--parlor-text);
    text-decoration: none;
  }

  /* ── Section Title ── */
  .parlor-section-header {
    margin: 4.5rem 0 2rem;
    text-align: left;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid var(--parlor-border);
    padding-bottom: 0.85rem;
  }

  .parlor-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--parlor-text);
    letter-spacing: -0.01em;
    margin: 0;
  }

  .parlor-section-count {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    color: var(--parlor-muted);
  }

  /* ── Grid: 3 Columns Desktop, 2 Tablet, 1 Mobile ── */
  .parlor-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3.5rem 2.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 900px) {
    .parlor-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.75rem 1.75rem;
    }
  }

  @media (max-width: 580px) {
    .parlor-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  /* ── Borderless Product Item ── */
  .parlor-item {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
  }

  .parlor-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.92;
  }

  /* ── 1:1 Aspect Ratio Image Frame ── */
  .parlor-item-image-wrap {
    position: relative;
    aspect-ratio: 1;
    background: var(--parlor-img-bg);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(28px, 4vw, 44px);
    overflow: hidden;
    margin-bottom: 1.25rem;
    transition: background-color 0.25s ease;
  }

  .parlor-item:hover .parlor-item-image-wrap {
    background-color: #eee9e0;
  }

  .parlor-item-image {
    max-width: 82%;
    max-height: 82%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .parlor-item:hover .parlor-item-image {
    transform: scale(1.03);
  }

  /* ── Item Metadata (Parlor Style: Clean, Understated) ── */
  .parlor-item-meta {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .parlor-item-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--parlor-muted);
  }

  .parlor-item-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--parlor-text);
    line-height: 1.25;
    margin: 0;
  }

  .parlor-item-descriptor {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    color: var(--parlor-muted);
    line-height: 1.45;
    margin: 0.1rem 0 0.35rem;
  }

  .parlor-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--parlor-text);
    margin: 0;
  }

  .parlor-item-price s {
    color: #a3998f;
    font-weight: 400;
    margin-right: 0.3rem;
  }

  .parlor-item-price .sale-amt {
    color: #b45309;
  }

</style>

<div class="parlor-shop">
  <!-- ── Header ── -->
  <div class="parlor-header">
    <h1 class="parlor-title">Shop Coffee</h1>
    <nav class="parlor-nav-anchors" aria-label="Category navigation">
      <a href="#coffees" class="parlor-nav-anchor is-active">Coffees</a>
      <a href="#flights" class="parlor-nav-anchor">Flights</a>
      <a href="#custom" class="parlor-nav-anchor">Custom</a>
      <a href="#pantry" class="parlor-nav-anchor">Pantry</a>
      <a href="#gifts" class="parlor-nav-anchor">Gifts</a>
    </nav>
  </div>

  <!-- ── Coffees Section ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="parlor-section-header" id="coffees">
    <h2 class="parlor-section-title">Our Coffees</h2>
    <span class="parlor-section-count">{{ all_roasts.size }} offerings</span>
  </div>

  <div class="parlor-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      <a href="{{ r.url | relative_url }}" class="parlor-item">
        <div class="parlor-item-image-wrap">
          {% if r.mascot_file %}
            {% assign bird_path = '/images/' | append: r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }} mascot" class="parlor-item-image" loading="lazy" decoding="async">
          {% endif %}
        </div>

        <div class="parlor-item-meta">
          <span class="parlor-item-eyebrow">
            {{ r.category | upcase }}{% if level_info %} &bull; {{ level_info.layman | upcase }}{% endif %}
          </span>

          <h3 class="parlor-item-title">{{ r.card_title | default: r.title }}</h3>

          <p class="parlor-item-descriptor">
            {% if r.descriptor %}
              {{ r.descriptor | capitalize }}.
            {% endif %}
            {% if r.tasting_notes %}
              {{ r.tasting_notes | capitalize }}.
            {% endif %}
          </p>

          <p class="parlor-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s>
              <span class="sale-amt">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </p>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── Flights Section ── -->
  <div class="parlor-section-header" id="flights">
    <h2 class="parlor-section-title">Flights &amp; Samplers</h2>
    <span class="parlor-section-count">2 offerings</span>
  </div>

  <div class="parlor-grid">
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="The Aviary cage" class="parlor-item-image" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Sampler Flight &bull; 4 x 8oz</span>
        <h3 class="parlor-item-title">The Aviary</h3>
        <p class="parlor-item-descriptor">Four 8oz bags of our signature blends: Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper.</p>
        <p class="parlor-item-price">$38.00</p>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/peck-your-own-transparent.png' | relative_url }}" alt="Peck Your Own" class="parlor-item-image" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Custom Flight &bull; Min. 4</span>
        <h3 class="parlor-item-title">Peck Your Own</h3>
        <p class="parlor-item-descriptor">Build your own custom tasting pack with 8oz bags of any active roast.</p>
        <p class="parlor-item-price">$10.00 / bag</p>
      </div>
    </a>
  </div>

  <!-- ── Custom Roastery Section ── -->
  <div class="parlor-section-header" id="custom">
    <h2 class="parlor-section-title">Custom Roastery</h2>
    <span class="parlor-section-count">3 options</span>
  </div>

  <div class="parlor-grid">
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/build-a-bird-transparent.png' | relative_url }}" alt="Build Your Own Blend mascot" class="parlor-item-image" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Custom Blend</span>
        <h3 class="parlor-item-title">Build Your Own Blend</h3>
        <p class="parlor-item-descriptor">Select up to three green coffees and customize roast levels for your personal blend.</p>
        <p class="parlor-item-price">$32.00</p>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans mascot" class="parlor-item-image" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Custom Sourced</span>
        <h3 class="parlor-item-title">Bring Your Own Beans</h3>
        <p class="parlor-item-descriptor">Send us your green unroasted coffee and we will roast it to perfection.</p>
        <p class="parlor-item-price">Custom Quote</p>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="Bank Your Own Burner mascot" class="parlor-item-image" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Custom Profile</span>
        <h3 class="parlor-item-title">Bank Your Own Burner</h3>
        <p class="parlor-item-descriptor">Choose any single-origin bean in our catalog and pick your target roast degree.</p>
        <p class="parlor-item-price">Cost of Bean</p>
      </div>
    </a>
  </div>

  <!-- ── Pantry Section ── -->
  {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
  {% if active_pantry.size > 0 %}
    <div class="parlor-section-header" id="pantry">
      <h2 class="parlor-section-title">Pantry</h2>
    </div>

    <div class="parlor-grid">
      {% for item in active_pantry %}
        {% assign img_path = '/images/' | append: item.mascot_file %}
        <a href="{{ item.url | relative_url }}" class="parlor-item">
          <div class="parlor-item-image-wrap">
            <img src="{{ img_path | relative_url }}" alt="{{ item.mascot_alt | default: item.title }}" class="parlor-item-image" loading="lazy" decoding="async">
          </div>
          <div class="parlor-item-meta">
            <span class="parlor-item-eyebrow">Pantry</span>
            <h3 class="parlor-item-title">{{ item.title }}</h3>
            <p class="parlor-item-descriptor">
              {{ item.descriptor | default: item.intro | default: item.overlay_notes }}
            </p>
            <p class="parlor-item-price">${{ item.price }}</p>
          </div>
        </a>
      {% endfor %}
    </div>
  {% endif %}

  <!-- ── Gifts Section ── -->
  <div class="parlor-section-header" id="gifts">
    <h2 class="parlor-section-title">Gifts</h2>
  </div>

  <div class="parlor-grid">
    <a href="{{ '/gift/' | relative_url }}" class="parlor-item">
      <div class="parlor-item-image-wrap">
        <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" class="parlor-item-image" style="max-width: 90%; max-height: 90%;" loading="lazy" decoding="async">
      </div>
      <div class="parlor-item-meta">
        <span class="parlor-item-eyebrow">Instant Delivery</span>
        <h3 class="parlor-item-title">Digital Gift Card</h3>
        <p class="parlor-item-descriptor">Prepaid digital gift voucher sent instantly via email.</p>
        <p class="parlor-item-price">$15.00 &ndash; $90.00</p>
      </div>
    </a>
  </div>
</div>
