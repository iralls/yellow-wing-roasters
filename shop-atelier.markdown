---
layout: default
title: Shop (Atelier Index) — Yellow Wing Roasters
permalink: /shop-atelier/
---

<style>
  /* ── Monastic Typographic Index Prototype ── */
  :root {
    --atl-bg: #faf8f5;
    --atl-text: #201b16;
    --atl-muted: #786f66;
    --atl-border: rgba(32, 27, 22, 0.1);
    --atl-hover-bg: rgba(32, 27, 22, 0.03);
    --atl-accent: #9c6d12;
    --atl-sale: #b45309;
  }

  body {
    background-color: var(--atl-bg) !important;
    color: var(--atl-text);
  }

  .atl-shop {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 32px 8rem;
  }

  /* ── Header ── */
  .atl-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--atl-border);
    margin-bottom: 3.5rem;
  }

  .atl-header-left {
    max-width: 600px;
  }

  .atl-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--atl-muted);
    margin-bottom: 0.5rem;
  }

  .atl-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 5vw, 4.25rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--atl-text);
    margin: 0;
  }

  .atl-header-meta {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--atl-muted);
    text-align: right;
  }

  /* ── Main Two-Column Split Layout ── */
  .atl-layout {
    display: grid;
    grid-template-columns: 1fr 440px;
    gap: 4rem;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .atl-layout {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .atl-sticky-preview {
      display: none !important;
    }
  }

  /* ── Section Header ── */
  .atl-section-heading {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--atl-muted);
    margin: 2.5rem 0 0.85rem;
    padding-bottom: 0.5rem;
  }

  /* ── Typographic Item Row ── */
  .atl-row {
    display: grid;
    grid-template-columns: 48px 1fr auto auto;
    gap: 1.5rem;
    align-items: baseline;
    padding: 1.4rem 1.25rem;
    border-top: 1px solid var(--atl-border);
    text-decoration: none;
    color: inherit;
    border-radius: 6px;
    transition: background-color 0.18s ease, color 0.18s ease;
    cursor: pointer;
  }

  .atl-row:last-child {
    border-bottom: 1px solid var(--atl-border);
  }

  .atl-row:hover {
    background-color: var(--atl-hover-bg);
    text-decoration: none;
    color: inherit;
  }

  .atl-num {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--atl-muted);
  }

  .atl-row-main {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .atl-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--atl-text);
    margin: 0;
    transition: color 0.15s ease;
  }

  .atl-row:hover .atl-name {
    color: var(--atl-accent);
  }

  .atl-desc {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    color: var(--atl-muted);
    line-height: 1.45;
  }

  .atl-level {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--atl-muted);
    white-space: nowrap;
    text-align: right;
  }

  .atl-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--atl-text);
    white-space: nowrap;
    min-width: 70px;
    text-align: right;
  }

  .atl-price s {
    color: #a89e94;
    font-weight: 400;
    font-size: 0.92rem;
    margin-right: 0.35rem;
  }

  .atl-price .sale-val {
    color: var(--atl-sale);
  }

  /* Inline thumbnail on mobile */
  .atl-mobile-thumb {
    display: none;
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-right: 0.5rem;
  }

  @media (max-width: 680px) {
    .atl-row {
      grid-template-columns: 1fr auto;
      gap: 0.75rem 1rem;
      padding: 1.15rem 0.5rem;
    }
    .atl-num {
      display: none;
    }
    .atl-level {
      grid-column: 1 / 2;
      text-align: left;
    }
    .atl-price {
      grid-column: 2 / 3;
      align-self: center;
    }
  }

  /* ── Sticky Right Stage Preview ── */
  .atl-sticky-preview {
    position: sticky;
    top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 18px;
    padding: 3rem 2.5rem;
    box-shadow: -2px 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(32, 27, 22, 0.06);
    min-height: 480px;
    text-align: center;
  }

  .atl-preview-img-wrap {
    width: 280px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .atl-preview-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: opacity 0.2s ease, transform 0.25s ease;
  }

  .atl-preview-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--atl-text);
    margin: 0 0 0.25rem;
  }

  .atl-preview-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--atl-muted);
    margin: 0;
  }
</style>

<div class="atl-shop">
  <!-- ── Header ── -->
  <div class="atl-header">
    <div class="atl-header-left">
      <div class="atl-eyebrow">Yellow Wing Roasters</div>
      <h1 class="atl-title">Index of Offerings</h1>
    </div>
    <div class="atl-header-meta">
      Direct Trade &bull; Small Batch &bull; Roasted Fresh
    </div>
  </div>

  <div class="atl-layout">
    <!-- Left: Pure Typographic Ledger -->
    <div class="atl-ledger">
      <!-- 1. Coffees -->
      <div class="atl-section-heading">01 &mdash; Fresh Roasts</div>

      {% assign all_roasts = site.roasts | sort: "order" %}
      {% for r in all_roasts %}
        {% assign level_info = site.data.roast_levels[r.roast_level] %}
        {% assign bird_path = '/images/' | append: r.mascot_file %}
        {% assign price_display = r.temporary_price["12oz"] | default: r.price["12oz"] %}

        <a href="{{ r.url | relative_url }}" class="atl-row" 
           data-img="{{ bird_path | relative_url }}" 
           data-title="{{ r.card_title | default: r.title }}" 
           data-sub="{{ level_info.layman }} Roast &bull; ${{ price_display }}">
          <span class="atl-num">{% if forloop.index < 10 %}0{% endif %}{{ forloop.index }}</span>

          <div class="atl-row-main">
            <h3 class="atl-name">{{ r.card_title | default: r.title }}</h3>
            <span class="atl-desc">
              {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
              {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
            </span>
          </div>

          <span class="atl-level">{{ level_info.layman }}</span>

          <div class="atl-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </a>
      {% endfor %}

      <!-- 2. Flights -->
      <div class="atl-section-heading">02 &mdash; Flights &amp; Samplers</div>

      <a href="{{ '/flights/the-aviary/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/audubon-cage-transparent.png' | relative_url }}"
         data-title="The Aviary"
         data-sub="Four 8oz Signature Blends &bull; $38">
        <span class="atl-num">01</span>
        <div class="atl-row-main">
          <h3 class="atl-name">The Aviary</h3>
          <span class="atl-desc">Four 8oz bags of Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper</span>
        </div>
        <span class="atl-level">Flight</span>
        <div class="atl-price">$38.00</div>
      </a>

      <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/peck-your-own-transparent.png' | relative_url }}"
         data-title="Peck Your Own"
         data-sub="Custom Sampler Box &bull; $10/bag">
        <span class="atl-num">02</span>
        <div class="atl-row-main">
          <h3 class="atl-name">Peck Your Own</h3>
          <span class="atl-desc">Choose four or more coffees from our catalog in 8oz tasting bags</span>
        </div>
        <span class="atl-level">Custom</span>
        <div class="atl-price">$10 / bag</div>
      </a>

      <!-- 3. Custom Roasts -->
      <div class="atl-section-heading">03 &mdash; Custom Roastery (BYOB)</div>

      <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/build-a-bird-transparent.png' | relative_url }}"
         data-title="BYOB &mdash; Build Your Own Blend"
         data-sub="Custom 3-Bean Blend &bull; $32">
        <span class="atl-num">01</span>
        <div class="atl-row-main">
          <h3 class="atl-name">BYOB &mdash; Build Your Own Blend</h3>
          <span class="atl-desc">Formulate a blend of up to 3 beans with custom roast levels</span>
        </div>
        <span class="atl-level">BYOB</span>
        <div class="atl-price">$32.00</div>
      </a>

      <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/binocular-birds-transparent.png' | relative_url }}"
         data-title="BYOB &mdash; Bring Your Own Beans"
         data-sub="Custom Roasting Service">
        <span class="atl-num">02</span>
        <div class="atl-row-main">
          <h3 class="atl-name">BYOB &mdash; Bring Your Own Beans</h3>
          <span class="atl-desc">Send us your raw unroasted coffee beans for custom profiling</span>
        </div>
        <span class="atl-level">BYOB</span>
        <div class="atl-price">Quote</div>
      </a>

      <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/bird-on-spit-transparent.png' | relative_url }}"
         data-title="BYOB &mdash; Bank Your Own Burner"
         data-sub="Single-Origin Profile">
        <span class="atl-num">03</span>
        <div class="atl-row-main">
          <h3 class="atl-name">BYOB &mdash; Bank Your Own Burner</h3>
          <span class="atl-desc">Pick any single-origin bean and designate your target roast level</span>
        </div>
        <span class="atl-level">BYOB</span>
        <div class="atl-price">Bean Cost</div>
      </a>

      <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/teacher-transparent.png' | relative_url }}"
         data-title="BYOB &mdash; Book Your Own Bootcamp"
         data-sub="Roasting Bootcamp &bull; $30 + $15/guest">
        <span class="atl-num">04</span>
        <div class="atl-row-main">
          <h3 class="atl-name">BYOB &mdash; Book Your Own Bootcamp</h3>
          <span class="atl-desc">Hands-on personalized roasting session for up to 3 guests</span>
        </div>
        <span class="atl-level">BYOB</span>
        <div class="atl-price">$30 + $15/guest</div>
      </a>

      <!-- 4. Pantry & Sweets -->
      {% assign active_pantry = site.pantry | where: "published", true | sort: "order" %}
      {% if active_pantry.size > 0 %}
        <div class="atl-section-heading">04 &mdash; Pantry &amp; Treats</div>
        {% for item in active_pantry %}
          {% assign img_path = '/images/' | append: item.mascot_file %}
          <a href="{{ item.url | relative_url }}" class="atl-row"
             data-img="{{ img_path | relative_url }}"
             data-title="{{ item.title }}"
             data-sub="Artisanal Pantry &bull; ${{ item.price }}">
            <span class="atl-num">{% if forloop.index < 10 %}0{% endif %}{{ forloop.index }}</span>
            <div class="atl-row-main">
              <h3 class="atl-name">{{ item.title }}</h3>
              <span class="atl-desc">{{ item.descriptor | default: item.intro }}</span>
            </div>
            <span class="atl-level">Pantry</span>
            <div class="atl-price">${{ item.price }}</div>
          </a>
        {% endfor %}
      {% endif %}

      <!-- 5. Gifts -->
      <div class="atl-section-heading">{% if active_pantry.size > 0 %}05{% else %}04{% endif %} &mdash; Gifts</div>
      <a href="{{ '/gift/' | relative_url }}" class="atl-row"
         data-img="{{ '/images/qr-code2-full-transparent.png' | relative_url }}"
         data-title="Digital Gift Card"
         data-sub="Instant Email Voucher &bull; $15 - $90">
        <span class="atl-num">01</span>
        <div class="atl-row-main">
          <h3 class="atl-name">Digital Gift Card</h3>
          <span class="atl-desc">Instant digital voucher for beans, samplers, and grind options</span>
        </div>
        <span class="atl-level">Instant</span>
        <div class="atl-price">$15 &ndash; $90</div>
      </a>
    </div>

    <!-- Right: Sticky Live Artwork Stage -->
    <aside class="atl-sticky-preview" aria-hidden="true">
      <div class="atl-preview-img-wrap">
        <img src="{{ '/images/american-robin-transparent.png' | relative_url }}" alt="Roast preview" id="atl-preview-img" class="atl-preview-img">
      </div>
      <h4 class="atl-preview-title" id="atl-preview-title">Early Bird</h4>
      <p class="atl-preview-sub" id="atl-preview-sub">Light-Medium Roast &bull; $10</p>
    </aside>
  </div>
</div>

<script>
  (function () {
    const rows = document.querySelectorAll('.atl-row');
    const previewImg = document.getElementById('atl-preview-img');
    const previewTitle = document.getElementById('atl-preview-title');
    const previewSub = document.getElementById('atl-preview-sub');

    if (!rows.length || !previewImg) return;

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        const img = row.getAttribute('data-img');
        const title = row.getAttribute('data-title');
        const sub = row.getAttribute('data-sub');

        if (img && previewImg.src !== img) {
          previewImg.style.opacity = '0';
          previewImg.style.transform = 'scale(0.96)';
          setTimeout(function () {
            previewImg.src = img;
            previewImg.style.opacity = '1';
            previewImg.style.transform = 'scale(1)';
          }, 120);
        }
        if (title && previewTitle) previewTitle.textContent = title;
        if (sub && previewSub) previewSub.textContent = sub;
      });
    });
  })();
</script>
