---
layout: default
published: false
title: "BYOB — Bib Your Own Bath"
subtitle: "Bib your own bath"
intro: "Ready to slurp like a pro? Tie on a bib, step up to the cupping table with up to five people, and join us for a guided sensory tasting flight across our favorite origins, processing methods, and roast profiles."
slug: bib-your-own-bath
category: custom
order: 5
permalink: /roasts/bib-your-own-bath/
price: 40
price_per_person: 40
max_guests: 5
mascot_file: bird-bath-transparent.png
mascot_alt: "Bib Your Own Bath mascot"
overlay_notes: "book a guided coffee cupping session for up to five guests"
custom_css: custom-roasts.css
---

{% assign rate = page.price_per_person %}

<div class="sleek-detail-layout">
  <!-- Left Column: Artwork Showcase & Cupping Details -->
  <div class="sleek-detail-visual-col">
    <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" id="byob-bath-mascot-img" alt="{{ page.mascot_alt | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
    <div class="sleek-detail-bird-label">Cupping Session</div>

    <div class="byob-bath-intro-box">
      <p>{{ page.intro }}</p>

      <div class="byob-bath-how">
        <h3>How It Works</h3>
        <ol>
          <li>Select your group size (1 to {{ page.max_guests }} guests at ${{ rate }} per person) and add any availability or tasting notes.</li>
          <li>Place your order through the cart—we'll reach out via email or phone after checkout to schedule a date and time that works for your group.</li>
          <li>Grab a cupping spoon (and a bib) as we break the crust, evaluate dry and wet aromatics, and taste side-by-side through a curated flight of origins, processes, and roast levels.</li>
        </ol>
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
    <div class="sleek-detail-subtitle">{{ page.subtitle }}</div>

    <!-- Descriptor Banner -->
    <div class="sleek-detail-tasting-banner">
      {{ page.overlay_notes | capitalize }}
    </div>

    <!-- Tactile Unboxed Buy Box / Configurator -->
    <div class="sleek-detail-buy-box">
      <div class="sleek-buy-price-row">
        <div>
          <span class="byob-bath-price-label">Price</span>
          <span class="sleek-buy-price-val" id="byob-bath-price-display">${{ rate }}</span>
        </div>
        <span class="sleek-buy-price-note" id="byob-bath-price-breakdown">1 guest &times; ${{ rate }}/person &middot; Scheduled after checkout</span>
      </div>

      <div class="byob-burner-form" id="byob-bath-form">
        <!-- Step 1: Number of Guests -->
        <div class="sleek-buy-field">
          <label for="byob-bath-guests-select">1. Number of Guests (Max {{ page.max_guests }})</label>
          <select id="byob-bath-guests-select" class="subscribe-select" data-label="Guests">
            {% for g in (1..page.max_guests) %}
              {% assign g_total = g | times: rate %}
              <option value="{{ g }}"{% if forloop.first %} selected{% endif %}>
                {{ g }} {% if g == 1 %}Guest{% else %}Guests{% endif %} (${{ g_total }})
              </option>
            {% endfor %}
          </select>
          <span class="hst-field-hint">Cupping sessions are ${{ rate }} per person and accommodate up to {{ page.max_guests }} guests maximum.</span>
        </div>

        <!-- Step 2: Optional Notes -->
        <div class="sleek-buy-field">
          <label for="byob-bath-notes">2. Session / availability notes (optional)</label>
          <textarea id="byob-bath-notes" rows="2" placeholder="Preferred days/times, origins or flavor profiles you're curious to compare, or anything else we should know..." class="byob-bath-textarea"></textarea>
        </div>

        <!-- Add to Cart Button -->
        <button type="button" class="sleek-buy-add-btn add-to-order-btn" id="byob-bath-add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Specifications Grid -->
    <div class="sleek-spec-wrap">
      <div class="sleek-spec-section-header">
        <h2 class="sleek-spec-heading">Cupping Specifications</h2>
        <span class="sleek-spec-subheading">Session &amp; Tasting Details</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Service Type</span>
          <span class="sleek-spec-val">Guided Coffee Cupping &amp; Sensory Tasting</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Cupping Table</span>
          <span class="sleek-spec-val">Curated flight of origins, processes &amp; roast levels</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Group Capacity</span>
          <span class="sleek-spec-val">1 &ndash; {{ page.max_guests }} guests maximum</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Session Rate</span>
          <span class="sleek-spec-val">${{ rate }} per person</span>
        </div>
        <div class="sleek-spec-tile is-full-width">
          <span class="sleek-spec-label">Scheduling</span>
          <span class="sleek-spec-val">Coordinated directly via email or phone after order placement</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/js/byob-bath.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  initBYOBBath({
    slug: {{ page.slug | jsonify }},
    pricePerPerson: {{ page.price_per_person }},
    mascot: {{ page.mascot_file | jsonify }}
  });
});
</script>
