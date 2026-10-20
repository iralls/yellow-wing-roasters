---
layout: default
title: "BYOB — Bank Your Own Burner"
card_title: "BYOB"
subtitle: "Bank your own burner"
intro: "Love one of our single-origin coffees, but want to explore it at a different roast level? Pick any of our available single-origin beans, choose your desired roast level from City to Vienna, and we'll custom-fire it fresh to order."
slug: bank-your-own-burner
category: custom
data_roast: byob-burner
order: 3
permalink: /roasts/bank-your-own-burner/
mascot_file: bird-on-spit-transparent.png
mascot_alt: "BYOB mascot"
descriptor: Bank Your Own Burner
overlay_notes: "pick any single origin and customize your roast level"
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign first_so = active_so.first %}
{% assign first_so_price = first_so.price["12oz"] | default: first_so.price.first[1] %}

<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
  <a href="{{ '/roasts/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 500; color: #887060; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
    &larr; Back to All Roasts
  </a>
</div>

<div class="sleek-detail-layout">
  <!-- Left Column: Artwork Showcase & Roaster Notes -->
  <div class="sleek-detail-visual-col">
    {% if page.mascot_file %}
      <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" id="byob-mascot-img" alt="{{ page.mascot_alt | default: page.title | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
      <div class="sleek-detail-bird-label">Bird on Spit</div>
    {% endif %}

    <div style="font-family: Lora, serif; font-size: 0.95rem; font-weight: 400; color: #5e5248; line-height: 1.7; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.12); padding-top: 1.5rem; text-align: left; width: 100%;">
      <p>{{ page.intro }}</p>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">Roaster's Note</h3>
        <p style="margin: 0; line-height: 1.7;">
          Every origin possesses a distinctive development curve. While we prescribe a standard roast profile designed to emphasize brightness, florals, or deep sugar browning, customizing the roast level allows you to discover completely different flavor notes in your favorite single-origin coffee.
        </p>
      </div>
    </div>
  </div>

  <!-- Right Column: Interactive Configurator, Purchasing & Specifications -->
  <div class="sleek-detail-info-col">
    <!-- Category Badge -->
    <div class="sleek-detail-category-row">
      <span class="sleek-detail-cat-badge">CUSTOM</span>
    </div>

    <!-- Title & Subtitle -->
    <h1 class="sleek-detail-title">{{ page.title }}</h1>
    {% if page.subtitle %}
      <div class="sleek-detail-subtitle">{{ page.subtitle }}</div>
    {% endif %}

    <!-- Tasting Notes / Descriptor Banner -->
    <div class="sleek-detail-tasting-banner">
      {{ page.overlay_notes | capitalize }}
    </div>

    <!-- Tactile Unboxed Buy Box / Configurator -->
    <div class="sleek-detail-buy-box">
      <div class="sleek-buy-price-row">
        <div>
          <span style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: #8a7f6e; display: block; margin-bottom: 0.2rem;">Price</span>
          <span class="sleek-buy-price-val" id="byob-price-display">${{ first_so_price }}</span>
        </div>
        <span class="sleek-buy-price-note">Roasted to order &middot; Ships fresh</span>
      </div>

      <div class="byob-burner-form" id="byob-burner-form">
        <!-- Step 1: Choose Single Origin Coffee -->
        <div class="sleek-buy-field">
          <label for="byob-origin-select">1. Select Single Origin</label>
          <select id="byob-origin-select" class="subscribe-select" data-label="Single Origin" style="width: 100%;">
            {% for r in active_so %}
              <option value="{{ r.slug }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
            {% endfor %}
          </select>
        </div>

        <!-- Origin Bean Card Info Preview -->
        <div id="byob-origin-preview" class="byob-origin-preview">
          <div id="byob-origin-notes" class="byob-origin-notes"></div>
          <div id="byob-origin-prescribed" class="byob-origin-prescribed"></div>
        </div>

        <!-- Step 2: Choose Roast Level -->
        <div class="sleek-buy-field">
          <label for="byob-roast-select">2. Choose Roast Level</label>
          <div id="byob-dots-stepper" class="roast-dots" title="Click any dot to select roast level">
            <span class="roast-dot roast-dot-1" data-level="1" title="City (Light)"></span>
            <span class="roast-dot roast-dot-2" data-level="2" title="City+ (Light-Medium)"></span>
            <span class="roast-dot" data-level="3" title="Full City (Medium)"></span>
            <span class="roast-dot" data-level="4" title="Full City+ (Medium-Dark)"></span>
            <span class="roast-dot" data-level="5" title="Vienna (Dark)"></span>
          </div>

          <select id="byob-roast-select" class="subscribe-select" data-label="Roast Level" style="width: 100%;">
            {% for lvl_num in (1..5) %}
              {% assign lvl_data = site.data.roast_levels[lvl_num] %}
              <option value="{{ lvl_data.specialty }}" data-dots="{{ lvl_data.dots }}" data-num="{{ lvl_num }}">{{ lvl_data.specialty }}</option>
            {% endfor %}
          </select>
          
          <div id="byob-level-status" class="byob-level-status">
            <span id="byob-level-status-text">Recommended for this origin</span>
          </div>
        </div>

        <!-- Step 3: Roast Amount & Grind -->
        <div class="sleek-buy-field">
          <label for="byob-size-select">3. Roast Amount</label>
          <select id="byob-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% include bag-size-options.html %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="byob-grind-select">4. Grind Preparation</label>
          <select id="byob-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <!-- Add to Cart Button -->
        <button type="button" class="sleek-buy-add-btn add-to-order-btn" id="byob-add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Specifications Grid -->
    <div class="sleek-spec-wrap">
      <div class="sleek-spec-section-header">
        <h2 class="sleek-spec-heading">Custom Burner Specifications</h2>
        <span class="sleek-spec-subheading">Roasting &amp; Origin Details</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Service Type</span>
          <span class="sleek-spec-val">Single-Origin Bespoke Roasting</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Roast Spectrum</span>
          <span class="sleek-spec-val">City (Light) &ndash; Vienna (Dark)</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Sourcing</span>
          <span class="sleek-spec-val">Active micro-lot single origins</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Freshness</span>
          <span class="sleek-spec-val">Fired fresh to order on demand</span>
        </div>
        <div class="sleek-spec-tile is-full-width">
          <span class="sleek-spec-label">Profile Guidance</span>
          <span class="sleek-spec-val">Prescribed roaster baselines highlighted in the configurator</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/js/byob-burner.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var originsData = {
    {% for r in active_so %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign r_specialty = level_info.specialty %}
      {% assign r_dots = level_info.dots %}
      {% assign rp = r.price %}
      {{ r.slug | jsonify }}: {
        title: {{ r.title | jsonify }},
        mascot: {{ r.mascot_file | jsonify }},
        prescribed_level: {{ r_specialty | jsonify }},
        prescribed_dots: {{ r_dots }},
        tasting_notes: {{ r.tasting_notes | default: r.descriptor | default: "" | jsonify }},
        prices: {
          {% for entry in rp %}
            {% assign s = entry[0] %}
            {% if r.sizes == nil or r.sizes contains s %}
              {% assign p = entry[1] %}
              {% if r.temporary_price and r.temporary_price[s] %}{% assign p = r.temporary_price[s] %}{% endif %}
              {{ s | jsonify }}: {{ p }}{% unless forloop.last %},{% endunless %}
            {% endif %}
          {% endfor %}
        }
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  initBYOBBurner({
    origins: originsData,
    orderUrl: {{ '/order/' | relative_url | jsonify }},
    imagesBase: {{ '/images/' | relative_url | jsonify }}
  });
})();
</script>
