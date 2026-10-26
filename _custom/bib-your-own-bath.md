---
layout: default
published: false
title: "BYOB — Bib Your Own Bath"
card_title: "BYOB"
subtitle: "Bib your own bath"
intro: "Ready to slurp like a pro? Tie on a bib, step up to the cupping table with up to five people, and join us for a guided sensory tasting flight across our favorite origins, processing methods, and roast profiles."
slug: bib-your-own-bath
category: custom
data_roast: byob-bath
order: 5
permalink: /roasts/bib-your-own-bath/
price: 40
price_per_person: 40
max_guests: 5
mascot_file: bird-bath-transparent.png
mascot_alt: "Bib Your Own Bath mascot"
descriptor: Bib Your Own Bath
overlay_notes: "book a guided coffee cupping session for up to five guests"
---

{% assign rate = page.price_per_person %}

<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
  <a href="{{ '/roasts/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 500; color: #887060; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
    &larr; Back to All Roasts
  </a>
</div>

<div class="sleek-detail-layout">
  <!-- Left Column: Artwork Showcase & Cupping Details -->
  <div class="sleek-detail-visual-col">
    <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" id="byob-bath-mascot-img" alt="{{ page.mascot_alt | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
    <div class="sleek-detail-bird-label">Cupping Session</div>

    <div style="font-family: Lora, serif; font-size: 0.95rem; font-weight: 400; color: #5e5248; line-height: 1.7; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.12); padding-top: 1.5rem; text-align: left; width: 100%;">
      <p>{{ page.intro }}</p>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">How It Works</h3>
        <ol style="margin: 0; padding-left: 1.2rem; font-family: Lora, serif; font-size: 0.9rem; line-height: 1.7; color: #5e5248;">
          <li style="margin-bottom: 0.4rem;">Select your group size (1 to {{ page.max_guests }} guests at ${{ rate }} per person) and add any availability or tasting notes.</li>
          <li style="margin-bottom: 0.4rem;">Place your order through the cart—we'll reach out via email or phone after checkout to schedule a date and time that works for your group.</li>
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
          <span style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: #8a7f6e; display: block; margin-bottom: 0.2rem;">Price</span>
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
          <span style="display: block; font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 400; color: #8a7f6e; margin-top: 0.35rem;">Cupping sessions are ${{ rate }} per person and accommodate up to {{ page.max_guests }} guests maximum.</span>
        </div>

        <!-- Step 2: Optional Notes -->
        <div class="sleek-buy-field">
          <label for="byob-bath-notes">2. Session / availability notes (optional)</label>
          <textarea id="byob-bath-notes" rows="2" placeholder="Preferred days/times, origins or flavor profiles you're curious to compare, or anything else we should know..." style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14; resize: vertical;"></textarea>
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

<script src="{{ '/js/byob-bath.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  initBYOBBath({
    slug: {{ page.slug | jsonify }},
    pricePerPerson: {{ page.price_per_person }},
    mascot: {{ page.mascot_file | jsonify }}
  });
})();
</script>
