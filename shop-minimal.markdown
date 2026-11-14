---
layout: default
title: Products — Yellow Wing Roasters
permalink: /shop-minimal/
---

<style>
  /* ── Direct Reproduction of the DrinkOther.com/products Aesthetic ── */
  :root {
    --color-pop: #b45309;
    --color-pop-accessible: #92400e;
    --color-oat: #fff9f1;
    --color-white: #ffffff;
    --color-dark: #212121;
    --color-muted: #6e5e54;
    --shadow-postcard: -2px 2px 2px rgba(0, 0, 0, .02), 0 0 10px rgba(0, 0, 0, .1), -1px 1px 1px rgba(0, 0, 0, .05);
    --radius-card: 21px;
    --page-max: 1280px;
  }

  body {
    background-color: var(--color-oat) !important;
  }

  .other-shop {
    max-width: var(--page-max);
    margin: 0 auto;
    padding: 0 20px clamp(60px, 8.33vw, 120px);
  }

  /* ── Header Intro ── */
  .other-shop__intro {
    max-width: 640px;
    margin: clamp(40px, 5.56vw, 80px) auto 0;
    text-align: center;
  }

  .other-shop__title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(36px, 4.86vw, 70px);
    line-height: 1.1;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--color-pop);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .other-shop__body {
    margin-top: clamp(16px, 1.67vw, 24px);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(16px, 1.25vw, 18px);
    line-height: 1.6;
    color: var(--color-dark);
    text-wrap: pretty;
  }

  /* ── Section Dividers (for Flights, Custom, Pantry) ── */
  .other-shop__section-header {
    text-align: center;
    margin: clamp(60px, 8vw, 100px) 0 clamp(24px, 3vw, 40px);
  }

  .other-shop__section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(24px, 2.75vw, 38px);
    font-weight: 800;
    line-height: 1.15;
    text-transform: uppercase;
    color: var(--color-pop);
    letter-spacing: -0.01em;
    margin: 0;
  }

  /* ── 3-Column Card Grid ── */
  .other-shop__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 2.78vw, 40px);
    margin-top: clamp(40px, 4.17vw, 60px);
  }

  @media (max-width: 900px) {
    .other-shop__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 600px) {
    .other-shop__grid {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  /* ── The DrinkOther Postcard Card ── */
  .other-shop__card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-postcard);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow .25s ease, transform .25s ease;
  }

  .other-shop__card:hover {
    box-shadow: -2px 4px 6px #00000014, 0 4px 20px #0000002e, -1px 2px 3px #0000001a;
    transform: translateY(-2px);
    text-decoration: none;
    color: inherit;
  }

  /* ── 1:1 Aspect Ratio Image Frame ── */
  .other-shop__card-img-wrap {
    position: relative;
    aspect-ratio: 1;
    background: #faf7f2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(24px, 3vw, 40px);
    overflow: hidden;
  }

  .other-shop__card-img-wrap img {
    max-width: 85%;
    max-height: 85%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    transition: transform .3s ease;
  }

  .other-shop__card:hover .other-shop__card-img-wrap img {
    transform: scale(1.04);
  }

  /* Badge (Optional, e.g. for seasonal or subscription) */
  .other-shop__badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: var(--color-pop);
    color: var(--color-white);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 5px 11px 4px;
    border-radius: 4px;
    z-index: 2;
  }

  /* ── Card Body (Centered Editorial) ── */
  .other-shop__card-body {
    padding: clamp(18px, 1.5vw, 24px) 24px clamp(22px, 1.8vw, 28px);
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .other-shop__card-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(19px, 1.55vw, 23px);
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    color: var(--color-pop-accessible);
    margin: 0;
  }

  .other-shop__card-desc {
    margin-top: 8px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--color-muted);
    flex: 1;
  }

  .other-shop__card-price {
    margin-top: 14px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-weight: 700;
    font-size: 16px;
    color: var(--color-dark);
  }

  .other-shop__card-price s {
    color: #a89484;
    font-weight: 400;
    margin-right: 0.35rem;
  }

  .other-shop__card-price .price-sale {
    color: var(--color-pop-accessible);
  }

  /* ── Flights Grid (2 Columns) ── */
  .other-shop__grid-flights {
    grid-template-columns: repeat(2, 1fr);
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 650px) {
    .other-shop__grid-flights {
      grid-template-columns: 1fr;
    }
  }

  /* ── Gifts Grid (Single Item Centered) ── */
  .other-shop__grid-gifts {
    display: flex;
    justify-content: center;
    max-width: 410px;
    margin: 0 auto;
  }
  .other-shop__grid-gifts .other-shop__card {
    width: 100%;
  }
</style>

<div class="other-shop">
  <!-- ── Page Intro ── -->
  <div class="other-shop__intro">
    <h1 class="other-shop__title">Our Products</h1>
    <p class="other-shop__body">
      Small-batch coffees roasted fresh in Massachusetts. Sustainably sourced, carefully profiled,
      and delivered fresh to your door—just real coffee you can taste.
    </p>
  </div>

  <!-- ── 1. Fresh Roasts Grid ── -->
  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="other-shop__grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      <a href="{{ r.url | relative_url }}" class="other-shop__card">
        <div class="other-shop__card-img-wrap">
          {% if r.status == 'new' or r.status == 'seasonal' %}
            <span class="other-shop__badge">{{ r.status }}</span>
          {% endif %}

          {% if r.mascot_file %}
            {% assign bird_path = '/images/' | append: r.mascot_file %}
            <img src="{{ bird_path | relative_url }}" alt="{{ r.title }} mascot" loading="lazy" decoding="async">
          {% endif %}
        </div>

        <div class="other-shop__card-body">
          <h2 class="other-shop__card-name">{{ r.card_title | default: r.title }}</h2>

          <p class="other-shop__card-desc">
            {% if r.descriptor %}
              {{ r.descriptor | capitalize }}.
            {% endif %}
            {% if r.tasting_notes %}
              {{ r.tasting_notes | capitalize }}.
            {% endif %}
          </p>

          <p class="other-shop__card-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s>
              <span class="price-sale">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </p>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Flights ── -->
  <div class="other-shop__section-header">
    <h2 class="other-shop__section-title">Flights</h2>
  </div>

  <div class="other-shop__grid other-shop__grid-flights">
    <!-- The Aviary -->
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">Sampler</span>
        <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="The Aviary cage" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">The Aviary</h2>
        <p class="other-shop__card-desc">
          Four 8oz bags of our signature blends: Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper.
        </p>
        <p class="other-shop__card-price">$38.00</p>
      </div>
    </a>

    <!-- Peck Your Own -->
    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">Custom</span>
        <img src="{{ '/images/peck-your-own-transparent.png' | relative_url }}" alt="Peck Your Own" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">Peck Your Own</h2>
        <p class="other-shop__card-desc">
          Build your custom sampler box. Choose four or more coffees from our active roster in 8oz tasting bags.
        </p>
        <p class="other-shop__card-price">$10.00 / bag</p>
      </div>
    </a>
  </div>

  <!-- ── 3. Custom Roastery ── -->
  <div class="other-shop__section-header">
    <h2 class="other-shop__section-title">BYOB &bull; Custom Roasts</h2>
  </div>

  <div class="other-shop__grid">
    <!-- BYOB: Build Your Own Blend -->
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">BYOB</span>
        <img src="{{ '/images/build-a-bird-transparent.png' | relative_url }}" alt="Build Your Own Blend mascot" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">BYOB &mdash; Build Your Own Blend</h2>
        <p class="other-shop__card-desc">
          Combine up to three green bean varieties and dial in individual roast levels for your personal house blend.
        </p>
        <p class="other-shop__card-price">$32.00</p>
      </div>
    </a>

    <!-- BYOB: Bring Your Own Beans -->
    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">BYOB</span>
        <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans mascot" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">BYOB &mdash; Bring Your Own Beans</h2>
        <p class="other-shop__card-desc">
          Send us your unroasted green beans and we'll craft your custom roast profile on our machines.
        </p>
        <p class="other-shop__card-price">Custom Quote</p>
      </div>
    </a>

    <!-- BYOB: Bank Your Own Burner -->
    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">BYOB</span>
        <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="Bank Your Own Burner mascot" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">BYOB &mdash; Bank Your Own Burner</h2>
        <p class="other-shop__card-desc">
          Pick any single-origin bean in stock and customize your desired roast level from City to Vienna.
        </p>
        <p class="other-shop__card-price">Cost of Bean</p>
      </div>
    </a>

    <!-- BYOB: Book Your Own Bootcamp -->
    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">BYOB</span>
        <img src="{{ '/images/teacher-transparent.png' | relative_url }}" alt="Book Your Own Bootcamp mascot" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">BYOB &mdash; Book Your Own Bootcamp</h2>
        <p class="other-shop__card-desc">
          Step behind the roaster yourself. Pick any single origin, bring up to three guests, and roast live with us.
        </p>
        <p class="other-shop__card-price">$30 + $15/guest</p>
      </div>
    </a>
  </div>

  <!-- ── 4. Pantry ── -->
  {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
  {% if active_pantry.size > 0 %}
    <div class="other-shop__section-header">
      <h2 class="other-shop__section-title">Pantry</h2>
    </div>

    <div class="other-shop__grid">
      {% for item in active_pantry %}
        {% assign img_path = '/images/' | append: item.mascot_file %}
        <a href="{{ item.url | relative_url }}" class="other-shop__card">
          <div class="other-shop__card-img-wrap">
            <img src="{{ img_path | relative_url }}" alt="{{ item.mascot_alt | default: item.title }}" loading="lazy" decoding="async">
          </div>

          <div class="other-shop__card-body">
            <h2 class="other-shop__card-name">{{ item.title }}</h2>
            <p class="other-shop__card-desc">
              {{ item.descriptor | default: item.intro | default: item.overlay_notes }}
            </p>
            <p class="other-shop__card-price">${{ item.price }}</p>
          </div>
        </a>
      {% endfor %}
    </div>
  {% endif %}

  <!-- ── 5. Gifts ── -->
  <div class="other-shop__section-header">
    <h2 class="other-shop__section-title">Gifts</h2>
  </div>

  <div class="other-shop__grid other-shop__grid-gifts">
    <a href="{{ '/gift/' | relative_url }}" class="other-shop__card">
      <div class="other-shop__card-img-wrap">
        <span class="other-shop__badge">Instant</span>
        <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" loading="lazy" decoding="async">
      </div>

      <div class="other-shop__card-body">
        <h2 class="other-shop__card-name">Digital Gift Card</h2>
        <p class="other-shop__card-desc">
          Prepaid digital code delivered instantly via email for them to choose their own favorite beans, flights, and grind.
        </p>
        <p class="other-shop__card-price">$15.00 &ndash; $90.00</p>
      </div>
    </a>
  </div>
</div>
