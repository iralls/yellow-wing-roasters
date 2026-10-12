---
layout: default
title: "BYOB — Build Your Own Blend"
card_title: "BYOB"
subtitle: "Build Your Own Blend"
intro: "Combine up to three varieties of green beans, select individual roast levels, and design a custom coffee profile exactly to your taste."
slug: build-your-own-blend
category: custom
data_roast: byob-blend
order: 1
permalink: /roasts/build-your-own-blend/
price: 32
descriptor: Build Your Own Blend
overlay_notes: "craft your own custom blend from our single origin roasts"
mascot_file: build-a-bird-transparent.png
mascot_alt: "Build Your Own Blend mascot"
---

<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
  <a href="{{ '/roasts/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 500; color: #887060; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
    &larr; Back to All Roasts
  </a>
</div>

<div class="sleek-detail-layout" style="margin-bottom: 3.5rem;">
  <!-- Left Column: Artwork Showcase & Intro -->
  <div class="sleek-detail-visual-col">
    {% if page.mascot_file %}
      <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" alt="{{ page.mascot_alt | default: page.title | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
      <div class="sleek-detail-bird-label">Build a Bird</div>
    {% endif %}

    <div style="font-family: Lora, serif; font-size: 0.95rem; font-weight: 400; color: #5e5248; line-height: 1.7; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.12); padding-top: 1.5rem; text-align: left; width: 100%;">
      <p>{{ page.intro }}</p>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">Blending Philosophy</h3>
        <p style="margin: 0; line-height: 1.7;">
          Every custom blend is roasted component-by-component to its optimal development curve before being blended and packed fresh in a dedicated 12oz bag.
        </p>
      </div>
    </div>
  </div>

  <!-- Right Column: Purchasing & Specifications Summary -->
  <div class="sleek-detail-info-col">
    <div class="sleek-detail-category-row">
      <span class="sleek-detail-cat-badge">CUSTOM</span>
    </div>

    <h1 class="sleek-detail-title">{{ page.title }}</h1>
    {% if page.subtitle %}
      <div class="sleek-detail-subtitle">{{ page.subtitle }}</div>
    {% endif %}

    <div class="sleek-detail-tasting-banner">
      {{ page.overlay_notes | capitalize }}
    </div>

    <!-- Summary Box -->
    <div class="sleek-detail-buy-box">
      <div class="sleek-buy-price-row">
        <div>
          <span style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: #8a7f6e; display: block; margin-bottom: 0.2rem;">Price</span>
          <span class="sleek-buy-price-val">${{ page.price }}</span>
        </div>
        <span class="sleek-buy-price-note">One 12oz bag &middot; Custom blended &amp; roasted to order</span>
      </div>

      <p style="font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; color: #5e5248; line-height: 1.6; margin: 0;">
        Follow the 4-step mixer below to select your single origins, calibrate percentage ratios and roast levels, preview the flavor outcome, and add your blend to cart.
      </p>
    </div>

    <!-- Specifications Grid -->
    <div class="sleek-spec-wrap">
      <div class="sleek-spec-section-header">
        <h2 class="sleek-spec-heading">Blend Studio Specifications</h2>
        <span class="sleek-spec-subheading">Mixing &amp; Roasting</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Capacity</span>
          <span class="sleek-spec-val">Up to 3 Single Origin coffees</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Roasting Control</span>
          <span class="sleek-spec-val">Independent roast per component</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Package Size</span>
          <span class="sleek-spec-val">12oz custom roasted bag</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Freshness</span>
          <span class="sleek-spec-val">Roasted to order &amp; blended fresh</span>
        </div>
        <div class="sleek-spec-tile is-full-width">
          <span class="sleek-spec-label">Flavor Prediction</span>
          <span class="sleek-spec-val">Live sensory simulation calculating acidity, body, and tasting notes</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="byob-container">

  <!-- Step 1: Bean Selection & Filters -->
  {% assign single_origins = site.roasts | where: "category", "single origin" %}
  {% assign active_origins = "" | split: "," %}
  {% assign active_procs = "" | split: "," %}
  {% for r in single_origins %}
    {% assign s_meta = site.data.statuses[r.status] %}
    {% if s_meta == nil or s_meta.orderable != false %}
      {% assign o_first = r.origins.first %}
      {% assign country = o_first | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
      {% if country == nil or country == "" %}{% assign country = r.title | split: " " | first %}{% endif %}
      {% assign active_origins = active_origins | push: country %}
      {% assign proc = r.processing_method | replace: " (Dry Process)", "" | strip %}
      {% if proc and proc != "" %}{% assign active_procs = active_procs | push: proc %}{% endif %}
    {% endif %}
  {% endfor %}
  {% assign uniq_origins = active_origins | uniq | sort %}
  {% assign uniq_procs = active_procs | uniq | sort %}

  <div class="bean-selector-section">
    <h2 class="byob-step-title">1. Choose Coffee Beans</h2>
    
    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-group">
        <label for="filter-origin">Origin</label>
        <select id="filter-origin" class="subscribe-select" data-label="Origin">
          <option value="">All Origins</option>
          {% for o in uniq_origins %}
            <option value="{{ o }}">{{ o }}</option>
          {% endfor %}
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-process">Process</label>
        <select id="filter-process" class="subscribe-select" data-label="Process">
          <option value="">All Processes</option>
          {% for p in uniq_procs %}
            <option value="{{ p | downcase }}">{{ p }}</option>
          {% endfor %}
        </select>
      </div>
      
      <div class="filter-group">
        <label for="filter-notes">Flavor Profile</label>
        <select id="filter-notes" class="subscribe-select" data-label="Flavors">
          <option value="">All Flavors</option>
          <option value="chocolate">Chocolate / Cocoa</option>
          <option value="fruit">Fruity (Berry, Apple, Plum)</option>
          <option value="citrus">Citrus (Lemon, Lime, Orange)</option>
          <option value="sweet">Sweet (Honey, Maple, Butterscotch)</option>
          <option value="floral">Floral (Jasmine, Rosewater)</option>
          <option value="nutty">Nutty (Almond, Hazelnut)</option>
          <option value="earthy">Earthy / Smoky</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-acidity">Acidity</label>
        <select id="filter-acidity" class="subscribe-select" data-label="Acidity">
          <option value="">All Acidity Levels</option>
          <option value="low">Low (1-2)</option>
          <option value="medium">Medium (3)</option>
          <option value="high">High (4-5)</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-body">Body</label>
        <select id="filter-body" class="subscribe-select" data-label="Body">
          <option value="">All Body Levels</option>
          <option value="light">Light (1-2)</option>
          <option value="medium">Medium (3)</option>
          <option value="heavy">Heavy (4-5)</option>
        </select>
      </div>
    </div>

    <!-- Workspace: Dropdown on left, Details on right -->
    <div class="selection-workspace">
      <div class="selection-left">
        <label for="bean-select-dropdown">Select a Coffee Bean</label>
        <select id="bean-select-dropdown" class="subscribe-select" data-label="Select Bean">
          <option value="" disabled selected>Select from list...</option>
          {% for r in single_origins %}
            {% assign s_meta = site.data.statuses[r.status] %}
            {% if s_meta == nil or s_meta.orderable != false %}
              <option value="{{ r.title }}">{{ r.title }}</option>
            {% endif %}
          {% endfor %}
        </select>
        <button type="button" id="add-to-blend-btn" class="add-to-blend-button" disabled>+ Add to Blend</button>
      </div>

      <div class="selection-right" id="bean-details-panel">
        <div class="details-placeholder" id="details-placeholder">
          Choose a bean from the list to view its cup characteristics.
        </div>
        <div class="details-active" id="details-active" style="display: none;">
          <h3 class="details-title" id="details-title"></h3>
          <p class="details-characteristics" id="details-desc"></p>
          <div class="details-stats-row">
            <span class="details-stat-pill" id="details-process-pill">Process: Washed</span>
            <span class="details-stat-pill" id="details-acidity-pill">Acidity: 3/5</span>
            <span class="details-stat-pill" id="details-body-pill">Body: 3/5</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Step 2 & 3: Mixer & Live Taste Preview -->
  <div class="mixer-preview-layout">
    
    <!-- Mixer Panel -->
    <div class="mixer-panel">
      <h2 class="byob-step-title">2. Adjust Composition &amp; Roasts</h2>
      <div class="mixer-empty-note" id="mixer-empty-note">
        No beans added. Use the selector above to build your recipe.
      </div>
      <div id="mixer-container"></div>
    </div>

    <!-- Preview Panel -->
    <div class="preview-panel">
      <h2 class="byob-step-title">3. Predicted Taste Profile</h2>
      <div id="preview-content" style="display: none;">
        
        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Acidity</span>
            <span class="preview-stat-value" id="preview-acidity-text">Medium</span>
          </div>
          <div class="preview-bar-outer">
            <div class="preview-bar-inner" id="preview-acidity-bar"></div>
          </div>
        </div>

        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Body</span>
            <span class="preview-stat-value" id="preview-body-text">Medium</span>
          </div>
          <div class="preview-bar-outer">
            <div class="preview-bar-inner" id="preview-body-bar"></div>
          </div>
        </div>

        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Tasting Notes</span>
          </div>
          <div class="preview-notes-container" id="preview-notes-tags">
            <!-- Tags generated here -->
          </div>
        </div>

      </div>
      <div class="preview-placeholder" id="preview-placeholder">
        Add coffee beans to display predicted tasting profile.
      </div>
    </div>

  </div>

  <!-- Step 4: Add to Cart -->
  <div class="order-section" id="order-section">
    <h2 class="byob-step-title byob-step-title--center">4. Add to Cart</h2>
    
    <div class="byob-price-line" id="byob-price-display">
      ${{ page.price }} <span class="byob-unit-note">(one 12oz bag)</span>
    </div>

    <div class="sleek-buy-field" style="max-width: 22rem; margin: 0 auto 1.25rem;">
      <label for="byob-blend-grind-select">Grind Preparation</label>
      <select id="byob-blend-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
        {% include grind-options.html %}
      </select>
    </div>

    <div class="sleek-buy-field" style="max-width: 28rem; margin: 0 auto 1.5rem;">
      <label for="byob-notes">Roasting notes / instructions (optional)</label>
      <textarea id="byob-notes" rows="2" placeholder="Any preferences, notes, or roast instructions..." style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14; resize: vertical;"></textarea>
    </div>

    <div style="text-align: center; max-width: 22rem; margin: 0 auto;">
      <button type="button" class="sleek-buy-add-btn add-to-order-btn add-to-order-btn--disabled" id="byob-add-to-cart-btn" disabled>
        Select beans to complete blend
      </button>
    </div>
  </div>

</div>

<script src="{{ '/js/byob-mixer.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var rawBeans = [
    {% for r in single_origins %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta == nil or s_meta.orderable != false %}
        {% assign o_first = r.origins.first %}
        {% assign country = o_first | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
        {% if country == nil or country == "" %}{% assign country = r.title | split: " " | first %}{% endif %}
        {% assign proc = r.processing_method | replace: " (Dry Process)", "" | strip %}
        {% assign notes_raw = r.tasting_notes | replace: " · ", ", " | split: ", " %}
        {
          name: {{ r.title | jsonify }},
          origin: {{ country | jsonify }},
          process: {{ proc | jsonify }},
          tasting_notes: {{ notes_raw | jsonify }},
          descriptor: {{ r.descriptor | default: "" | jsonify }},
          url: {{ r.url | relative_url | jsonify }},
          cup_characteristics: {{ r.description | default: "" | strip | jsonify }}
        },
      {% endif %}
    {% endfor %}
  ];

  initBYOBMixer({
    rawBeans: rawBeans,
    price: {{ page.price }},
    mascot: {{ page.mascot_file | jsonify }}
  });
})();
</script>
