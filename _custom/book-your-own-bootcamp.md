---
layout: default
title: "BYOB — Book Your Own Bootcamp"
card_title: "BYOB"
subtitle: "Book your own bootcamp"
intro: "Want to step behind the roaster yourself? Pick any 12oz single-origin coffee, bring up to three people total, and join us for a personalized, hands-on roasting session."
slug: book-your-own-bootcamp
category: custom
data_roast: byob-bootcamp
order: 4
permalink: /roasts/book-your-own-bootcamp/
mascot_file: teacher-transparent.png
mascot_alt: "Book Your Own Bootcamp mascot"
descriptor: Book Your Own Bootcamp
overlay_notes: "pick any 12oz single origin and book a personalized roasting session"
max_guests: 3
session_fees:
  1: 15
  2: 20
  3: 25
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign first_so = active_so.first %}
{% assign first_so_price = first_so.price["12oz"] %}
{% if first_so.temporary_price and first_so.temporary_price["12oz"] %}
  {% assign first_so_price = first_so.temporary_price["12oz"] %}
{% endif %}
{% assign first_fee = page.session_fees[1] %}
{% assign initial_total = first_so_price | plus: first_fee %}

<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
  <a href="{{ '/roasts/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 500; color: #887060; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
    &larr; Back to All Roasts
  </a>
</div>

<div class="sleek-detail-layout">
  <!-- Left Column: Artwork Showcase & Bootcamp Details -->
  <div class="sleek-detail-visual-col">
    <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" id="byob-bootcamp-mascot-img" alt="{{ page.mascot_alt | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
    <div class="sleek-detail-bird-label">Roasting Bootcamp</div>

    <div style="font-family: Lora, serif; font-size: 0.95rem; font-weight: 400; color: #5e5248; line-height: 1.7; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.12); padding-top: 1.5rem; text-align: left; width: 100%;">
      <p>{{ page.intro }}</p>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">How It Works</h3>
        <ol style="margin: 0; padding-left: 1.2rem; font-family: Lora, serif; font-size: 0.9rem; line-height: 1.7; color: #5e5248;">
          <li style="margin-bottom: 0.4rem;">Choose any active 12oz single-origin lot and select your group size (maximum of {{ page.max_guests }} guests).</li>
          <li style="margin-bottom: 0.4rem;">Place your order through the cart—we'll reach out via email or phone after checkout to schedule a date and time that works for you.</li>
          <li>Step up to the roaster to guide your batch through drying, Maillard browning, and first crack, then take home your freshly roasted 12oz bag.</li>
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
          <span class="sleek-buy-price-val" id="byob-price-display">${{ initial_total }}</span>
        </div>
        <span class="sleek-buy-price-note" id="byob-price-breakdown">${{ first_so_price }} (12oz bean) + ${{ first_fee }} (1 guest) &middot; Scheduled after checkout</span>
      </div>

      <div class="byob-burner-form" id="byob-bootcamp-form">
        <!-- Step 1: Choose Single Origin Coffee -->
        <div class="sleek-buy-field">
          <label for="byob-origin-select">1. Select 12oz Single Origin</label>
          <select id="byob-origin-select" class="subscribe-select" data-label="Single Origin">
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

        <!-- Step 2: Number of Guests -->
        <div class="sleek-buy-field">
          <label for="byob-guests-select">2. Number of Guests (Max {{ page.max_guests }})</label>
          <select id="byob-guests-select" class="subscribe-select" data-label="Guests">
            {% for entry in page.session_fees %}
              {% assign g_num = entry[0] %}
              {% assign g_fee = entry[1] %}
              <option value="{{ g_num }}"{% if forloop.first %} selected{% endif %}>
                {{ g_num }} {% if g_num == 1 %}Guest{% else %}Guests{% endif %} (+${{ g_fee }} session)
              </option>
            {% endfor %}
          </select>
          <span style="display: block; font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 400; color: #8a7f6e; margin-top: 0.35rem;">Sessions accommodate up to {{ page.max_guests }} guests maximum ($15 for 1, $20 for 2, $25 for 3).</span>
        </div>

        <!-- Step 3: Optional Notes -->
        <div class="sleek-buy-field">
          <label for="byob-bootcamp-notes">3. Session / availability notes (optional)</label>
          <textarea id="byob-bootcamp-notes" rows="2" placeholder="Preferred days/times, roast profile goals, or anything else we should know..." style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14; resize: vertical;"></textarea>
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
        <h2 class="sleek-spec-heading">Bootcamp Specifications</h2>
        <span class="sleek-spec-subheading">Session &amp; Origin Details</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Service Type</span>
          <span class="sleek-spec-val">Personalized Hands-On Roasting Session</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Take-Home Coffee</span>
          <span class="sleek-spec-val">One 12oz single-origin bag roasted live</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Group Capacity</span>
          <span class="sleek-spec-val">1 &ndash; {{ page.max_guests }} guests maximum</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Session Add-On</span>
          <span class="sleek-spec-val">${{ page.session_fees[1] }} (1) &middot; ${{ page.session_fees[2] }} (2) &middot; ${{ page.session_fees[3] }} (3)</span>
        </div>
        <div class="sleek-spec-tile is-full-width">
          <span class="sleek-spec-label">Scheduling</span>
          <span class="sleek-spec-val">Coordinated directly via email or phone after order placement</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/js/byob-bootcamp.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var originsData = {
    {% for r in active_so %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign r_specialty = level_info.specialty %}
      {% assign p12 = r.price["12oz"] %}
      {% if r.temporary_price and r.temporary_price["12oz"] %}{% assign p12 = r.temporary_price["12oz"] %}{% endif %}
      {{ r.slug | jsonify }}: {
        title: {{ r.title | jsonify }},
        prescribed_level: {{ r_specialty | jsonify }},
        tasting_notes: {{ r.tasting_notes | jsonify }},
        price12oz: {{ p12 }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  initBYOBBootcamp({
    origins: originsData,
    sessionFees: {{ page.session_fees | jsonify }},
    mascot: {{ page.mascot_file | jsonify }}
  });
})();
</script>
