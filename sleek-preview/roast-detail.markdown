---
layout: sleek
title: "Studio Roast Detail Prototype"
permalink: /sleek-preview/roast-detail/
sitemap: false
---

{% assign current_slug = page.preview_roast | default: "colombia-supremo" %}
{% assign r = site.roasts | where: "slug", current_slug | first %}
{% if r == nil %}
  {% assign r = site.roasts | where: "slug", "colombia-supremo" | first %}
{% endif %}
{% if r == nil %}
  {% assign r = site.roasts.first %}
{% endif %}

{% assign level_info = site.data.roast_levels[r.roast_level] %}
{% assign m_name = site.data.mascots[r.mascot] %}

<!-- Top Controls & Roast Switcher -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
  <a href="{{ '/sleek-preview/catalog/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 700; color: #887060; text-decoration: none;">
    &larr; Back to Sleek Catalog
  </a>

  <!-- Switch between sample roasts to test Single Origin vs Blend vs Mid-Molt -->
  <div style="display: flex; align-items: center; gap: 0.5rem; font-family: Montserrat, sans-serif; font-size: 0.76rem; font-weight: 700;">
    <span style="color: #887060;">Test Roast:</span>
    <button type="button" class="sleek-filter-chip is-active" id="btn-roast-colombia">Colombia Supremo</button>
    <button type="button" class="sleek-filter-chip" id="btn-roast-earlybird">Early Bird (Mid-Molt Blend)</button>
    <button type="button" class="sleek-filter-chip" id="btn-roast-brazil">Brazil Natural</button>
    <button type="button" class="sleek-filter-chip" id="btn-roast-sumatra">Sumatra Mandheling (Dark / FTO)</button>
  </div>
</div>

<!-- ==============================================
     ROAST 1: COLOMBIA SUPREMO (Default View)
     ============================================== -->
<div class="roast-preview-container is-active" id="view-roast-colombia">
  {% assign col = site.roasts | where: "slug", "colombia-supremo" | first %}
  {% assign col_level = site.data.roast_levels[col.roast_level] %}
  {% assign col_mascot = site.data.mascots[col.mascot] %}

  <div class="sleek-detail-layout">
    <!-- Left Column: Unencumbered Artwork Showcase -->
    <div class="sleek-detail-visual-col">
      <img src="{{ '/images/' | append: col.mascot_file | relative_url }}" alt="{{ col.title }}" class="sleek-detail-big-bird">
      {% if col_mascot %}
        <div class="sleek-detail-bird-label">{{ col_mascot }}</div>
      {% endif %}

      {% if col.description %}
        <div style="font-family: Lora, serif; font-size: 0.95rem; color: #6e5e54; line-height: 1.6; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.06); padding-top: 1.5rem; text-align: center;">
          {{ col.description }}
        </div>
      {% endif %}
    </div>

    <!-- Right Column: Sticky Purchasing, Specifications & Lot History -->
    <div class="sleek-detail-info-col">
      <div class="sleek-detail-category-row">
        <span class="sleek-detail-cat-badge">{{ col.category }}</span>
        {% if col.best_seller %}
          <span class="sleek-detail-cat-badge" style="background: #f0c838; color: #2c1e14;">★ Best Seller</span>
        {% endif %}
      </div>

      <h1 class="sleek-detail-title">{{ col.title }}</h1>
      {% if col.subtitle %}
        <div class="sleek-detail-subtitle">{{ col.subtitle }}</div>
      {% endif %}

      <!-- High-level description in tasting banner -->
      {% if col.descriptor %}
        <div class="sleek-detail-tasting-banner">
          "{{ col.descriptor | capitalize }} — {{ col.tasting_notes | replace: ", ", " · " }}"
        </div>
      {% endif %}

      <div class="sleek-detail-roast-level">
        <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #998070;">Roast:</span>
        {% include roast-dots.html roast=col %}
        <span class="sleek-detail-roast-name">{{ col_level.name }}</span>
      </div>

      <!-- Studio Tactile Buy Box -->
      <div class="sleek-detail-buy-box">
        <div class="sleek-buy-price-row">
          <div>
            <span style="font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #887060; display: block;">Price</span>
            <span class="sleek-buy-price-val" id="col-price-display">${{ col.price["12oz"] }}</span>
          </div>
          <span class="sleek-buy-price-note">Roasted to order · Ships fresh</span>
        </div>

        <div class="sleek-buy-field">
          <label for="col-size-select">Bag Size</label>
          <select id="col-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% for entry in col.price %}
              <option value="{{ entry[0] }}">{{ entry[0] }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="col-grind-select">Grind Preparation</label>
          <select id="col-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <button type="button" class="sleek-buy-add-btn" id="col-add-btn">
          Add to Cart
        </button>
      </div>

      <!-- Rich Coffee Specifications: Crisp Hairline Spec Grid -->
      <div class="sleek-spec-wrap">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Coffee Specifications</h2>
          <span class="sleek-spec-subheading">Lot Details & Terroir</span>
        </div>

        <div class="sleek-spec-grid">
          {% if col.region %}
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Region</span>
            <span class="sleek-spec-val">{{ col.region }}</span>
          </div>
          {% endif %}

          {% if col.elevation %}
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Terroir / Elevation</span>
            <span class="sleek-spec-val">{{ col.elevation }}</span>
          </div>
          {% endif %}

          {% if col.processing_method %}
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Processing</span>
            <span class="sleek-spec-val">{{ col.processing_method }}</span>
          </div>
          {% endif %}

          {% if col.brewing_method %}
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Recommended Brew</span>
            <span class="sleek-spec-val">{{ col.brewing_method }}</span>
          </div>
          {% endif %}
        </div>
      </div>

      <!-- Rich Lot & Harvest History Component -->
      {% if col.history and col.history.size > 0 %}
      <div class="sleek-history-section">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Lot & Harvest History</h2>
          <span class="sleek-spec-subheading">Crop Traceability</span>
        </div>

        <div class="sleek-history-list">
          {% for h in col.history %}
            <div class="sleek-history-card">
              <div class="sleek-history-card-top">
                {% if h.components %}
                  {% for c in h.components %}
                    <div class="sleek-history-lot-title">
                      {{ c.name }}
                      {% if c.ratio %}<span style="font-size: 0.85rem; color: #9c6d12; font-weight: 700;">({{ c.ratio }})</span>{% endif %}
                    </div>
                  {% endfor %}
                {% else %}
                  <div class="sleek-history-lot-title">{{ col.title }}</div>
                {% endif %}

                <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} · Current Lot{% endif %}</span>
              </div>

              <!-- Structured Detail Chips: Lot, Region, Terroir, Process -->
              <div class="sleek-history-chips-row">
                <span class="sleek-history-chip">
                  <span class="chip-k">Lot:</span>
                  <span class="chip-v">Supremo Preparation</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Region:</span>
                  <span class="chip-v">{{ col.region }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Terroir:</span>
                  <span class="chip-v">{{ col.elevation }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Process:</span>
                  <span class="chip-v">{{ col.processing_method }}</span>
                </span>
              </div>

              {% if h.description %}
                <p class="sleek-history-desc">{{ h.description }}</p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</div>

<!-- ==============================================
     ROAST 2: EARLY BIRD (Blend with Mid-Molt Status)
     ============================================== -->
<div class="roast-preview-container" id="view-roast-earlybird" style="display: none;">
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  {% assign eb_mascot = site.data.mascots[eb.mascot] %}

  <div class="sleek-detail-layout">
    <!-- Left Column: Artwork Showcase -->
    <div class="sleek-detail-visual-col">
      <img src="{{ '/images/' | append: eb.mascot_file | relative_url }}" alt="{{ eb.title }}" class="sleek-detail-big-bird">
      {% if eb_mascot %}
        <div class="sleek-detail-bird-label">{{ eb_mascot }}</div>
      {% endif %}

      {% if eb.description %}
        <div style="font-family: Lora, serif; font-size: 0.95rem; color: #6e5e54; line-height: 1.6; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.06); padding-top: 1.5rem; text-align: center;">
          {{ eb.description }}
        </div>
      {% endif %}
    </div>

    <!-- Right Column: Purchasing & Recipe History -->
    <div class="sleek-detail-info-col">
      <div class="sleek-detail-category-row">
        <span class="sleek-detail-cat-badge">{{ eb.category }}</span>
        <!-- Preserved Mid-Molt Status Badge -->
        <span class="sleek-card-status-badge sleek-card-status-badge--mid_molt">
          Mid-Molt
        </span>
      </div>

      <h1 class="sleek-detail-title">{{ eb.title }}</h1>
      {% if eb.subtitle %}
        <div class="sleek-detail-subtitle">{{ eb.subtitle }}</div>
      {% endif %}

      <div class="sleek-detail-tasting-banner">
        "{{ eb.descriptor | capitalize }} — {{ eb.tasting_notes | replace: ", ", " · " }}"
      </div>

      <div class="sleek-detail-roast-level">
        <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #998070;">Roast:</span>
        {% include roast-dots.html roast=eb %}
        <span class="sleek-detail-roast-name">{{ eb_level.name }}</span>
      </div>

      <!-- Studio Buy Box -->
      <div class="sleek-detail-buy-box">
        <div class="sleek-buy-price-row">
          <div>
            <span style="font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #887060; display: block;">Price</span>
            <span class="sleek-buy-price-val" id="eb-price-display">${{ eb.price["12oz"] }}</span>
          </div>
          <span class="sleek-buy-price-note">Dialing in this profile with each batch</span>
        </div>

        <div class="sleek-buy-field">
          <label for="eb-size-select">Bag Size</label>
          <select id="eb-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% for entry in eb.price %}
              <option value="{{ entry[0] }}">{{ entry[0] }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="eb-grind-select">Grind Preparation</label>
          <select id="eb-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <button type="button" class="sleek-buy-add-btn" id="eb-add-btn">
          Add to Cart
        </button>
      </div>

      <!-- Rich Specifications: Blend Origins Grid -->
      <div class="sleek-spec-wrap">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Blend Specifications</h2>
          <span class="sleek-spec-subheading">Component Origins</span>
        </div>

        <div class="sleek-spec-grid">
          <div class="sleek-spec-tile is-full-width">
            <span class="sleek-spec-label">Component Origins</span>
            <span class="sleek-spec-val">{{ eb.origins | join: " · " }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Recommended Brew</span>
            <span class="sleek-spec-val">{{ eb.brewing_method }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Status</span>
            <span class="sleek-spec-val">Mid-Molt (Dialing In)</span>
          </div>
        </div>
      </div>

      <!-- Rich Recipe History with Component Breakdown -->
      {% if eb.history and eb.history.size > 0 %}
      <div class="sleek-history-section">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Recipe & Component History</h2>
          <span class="sleek-spec-subheading">Blend Iterations</span>
        </div>

        <div class="sleek-history-list">
          {% for h in eb.history %}
            <div class="sleek-history-card">
              <div class="sleek-history-card-top">
                <div class="sleek-history-lot-title">Recipe Version {{ forloop.index }}</div>
                <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} · Current Recipe{% endif %}</span>
              </div>

              <!-- Component Lots with Ratios -->
              <div class="sleek-history-chips-row">
                {% for c in h.components %}
                  <span class="sleek-history-chip">
                    <span class="chip-k">{{ c.name }}:</span>
                    <span class="chip-v">{{ c.ratio }}</span>
                  </span>
                {% endfor %}
              </div>
            </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</div>

<!-- ==============================================
     ROAST 3: BRAZIL NATURAL (Single Origin)
     ============================================== -->
<div class="roast-preview-container" id="view-roast-brazil" style="display: none;">
  {% assign brz = site.roasts | where: "slug", "brazil-natural" | first %}
  {% assign brz_level = site.data.roast_levels[brz.roast_level] %}
  {% assign brz_mascot = site.data.mascots[brz.mascot] %}

  <div class="sleek-detail-layout">
    <div class="sleek-detail-visual-col">
      <img src="{{ '/images/' | append: brz.mascot_file | relative_url }}" alt="{{ brz.title }}" class="sleek-detail-big-bird">
      {% if brz_mascot %}
        <div class="sleek-detail-bird-label">{{ brz_mascot }}</div>
      {% endif %}

      {% if brz.description %}
        <div style="font-family: Lora, serif; font-size: 0.95rem; color: #6e5e54; line-height: 1.6; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.06); padding-top: 1.5rem; text-align: center;">
          {{ brz.description }}
        </div>
      {% endif %}
    </div>

    <div class="sleek-detail-info-col">
      <div class="sleek-detail-category-row">
        <span class="sleek-detail-cat-badge">{{ brz.category }}</span>
      </div>

      <h1 class="sleek-detail-title">{{ brz.title }}</h1>
      {% if brz.subtitle %}
        <div class="sleek-detail-subtitle">{{ brz.subtitle }}</div>
      {% endif %}

      <div class="sleek-detail-tasting-banner">
        "{{ brz.descriptor | capitalize }} — {{ brz.tasting_notes | replace: ", ", " · " }}"
      </div>

      <div class="sleek-detail-roast-level">
        <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #998070;">Roast:</span>
        {% include roast-dots.html roast=brz %}
        <span class="sleek-detail-roast-name">{{ brz_level.name }}</span>
      </div>

      <div class="sleek-detail-buy-box">
        <div class="sleek-buy-price-row">
          <div>
            <span style="font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #887060; display: block;">Price</span>
            <span class="sleek-buy-price-val" id="brz-price-display">${{ brz.price["12oz"] }}</span>
          </div>
          <span class="sleek-buy-price-note">Roasted to order · Ships fresh</span>
        </div>

        <div class="sleek-buy-field">
          <label for="brz-size-select">Bag Size</label>
          <select id="brz-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% for entry in brz.price %}
              <option value="{{ entry[0] }}">{{ entry[0] }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="brz-grind-select">Grind Preparation</label>
          <select id="brz-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <button type="button" class="sleek-buy-add-btn" id="brz-add-btn">
          Add to Cart
        </button>
      </div>

      <div class="sleek-spec-wrap">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Coffee Specifications</h2>
          <span class="sleek-spec-subheading">Lot Details & Terroir</span>
        </div>

        <div class="sleek-spec-grid">
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Region</span>
            <span class="sleek-spec-val">{{ brz.region }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Terroir / Elevation</span>
            <span class="sleek-spec-val">{{ brz.elevation }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Processing</span>
            <span class="sleek-spec-val">{{ brz.processing_method }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Recommended Brew</span>
            <span class="sleek-spec-val">{{ brz.brewing_method }}</span>
          </div>
        </div>
      </div>

      {% if brz.history and brz.history.size > 0 %}
      <div class="sleek-history-section">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Lot & Harvest History</h2>
          <span class="sleek-spec-subheading">Crop Traceability</span>
        </div>

        <div class="sleek-history-list">
          {% for h in brz.history %}
            <div class="sleek-history-card">
              <div class="sleek-history-card-top">
                {% if h.components %}
                  {% for c in h.components %}
                    <div class="sleek-history-lot-title">
                      {{ c.name }}
                      {% if c.ratio %}<span style="font-size: 0.85rem; color: #9c6d12; font-weight: 700;">({{ c.ratio }})</span>{% endif %}
                    </div>
                  {% endfor %}
                {% else %}
                  <div class="sleek-history-lot-title">{{ brz.title }}</div>
                {% endif %}

                <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} · Current Lot{% endif %}</span>
              </div>

              <div class="sleek-history-chips-row">
                <span class="sleek-history-chip">
                  <span class="chip-k">Lot:</span>
                  <span class="chip-v">Cooxupé 15/16 FC SS</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Region:</span>
                  <span class="chip-v">{{ brz.region }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Terroir:</span>
                  <span class="chip-v">{{ brz.elevation }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Process:</span>
                  <span class="chip-v">{{ brz.processing_method }}</span>
                </span>
              </div>

              {% if h.description %}
                <p class="sleek-history-desc">{{ h.description }}</p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</div>

<!-- ==============================================
     ROAST 4: SUMATRA MANDHELING (Dark Roast & Fair Trade Organic)
     ============================================== -->
<div class="roast-preview-container" id="view-roast-sumatra" style="display: none;">
  {% assign sum = site.roasts | where: "slug", "sumatra-mandheling" | first %}
  {% assign sum_level = site.data.roast_levels[sum.roast_level] %}
  {% assign sum_mascot = site.data.mascots[sum.mascot] %}

  <div class="sleek-detail-layout">
    <div class="sleek-detail-visual-col">
      <img src="{{ '/images/' | append: sum.mascot_file | relative_url }}" alt="{{ sum.title }}" class="sleek-detail-big-bird">
      {% if sum_mascot %}
        <div class="sleek-detail-bird-label">{{ sum_mascot }}</div>
      {% endif %}

      {% if sum.description %}
        <div style="font-family: Lora, serif; font-size: 0.95rem; color: #6e5e54; line-height: 1.6; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.06); padding-top: 1.5rem; text-align: center;">
          {{ sum.description }}
        </div>
      {% endif %}
    </div>

    <div class="sleek-detail-info-col">
      <div class="sleek-detail-category-row">
        <span class="sleek-detail-cat-badge">{{ sum.category }}</span>
        {% if sum.certification == 'fair_trade_organic' %}
          <span class="sleek-detail-cat-badge sleek-detail-cat-badge--organic">Fair Trade Organic</span>
        {% endif %}
        {% if sum.best_seller %}
          <span class="sleek-detail-cat-badge sleek-detail-cat-badge--bestseller">★ Best Seller</span>
        {% endif %}
      </div>

      <h1 class="sleek-detail-title">{{ sum.title }}</h1>
      {% if sum.subtitle %}
        <div class="sleek-detail-subtitle">{{ sum.subtitle }}</div>
      {% endif %}

      <div class="sleek-detail-tasting-banner">
        "{{ sum.descriptor | capitalize }} — {{ sum.tasting_notes | replace: ", ", " · " }}"
      </div>

      <div class="sleek-detail-roast-level">
        <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #998070;">Roast:</span>
        {% include roast-dots.html roast=sum %}
        <span class="sleek-detail-roast-name">{{ sum_level.name }}</span>
      </div>

      <div class="sleek-detail-buy-box">
        <div class="sleek-buy-price-row">
          <div>
            <span style="font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #887060; display: block;">Price</span>
            <span class="sleek-buy-price-val" id="sum-price-display">${{ sum.price["12oz"] }}</span>
          </div>
          <span class="sleek-buy-price-note">Roasted to order · Ships fresh</span>
        </div>

        <div class="sleek-buy-field">
          <label for="sum-size-select">Bag Size</label>
          <select id="sum-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% for entry in sum.price %}
              <option value="{{ entry[0] }}">{{ entry[0] }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="sum-grind-select">Grind Preparation</label>
          <select id="sum-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <button type="button" class="sleek-buy-add-btn" id="sum-add-btn">
          Add to Cart
        </button>
      </div>

      <div class="sleek-spec-wrap">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Coffee Specifications</h2>
          <span class="sleek-spec-subheading">Lot Details & Terroir</span>
        </div>

        <div class="sleek-spec-grid">
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Region</span>
            <span class="sleek-spec-val">{{ sum.region }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Terroir / Elevation</span>
            <span class="sleek-spec-val">{{ sum.elevation }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Processing</span>
            <span class="sleek-spec-val">{{ sum.processing_method }}</span>
          </div>
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Certification</span>
            <span class="sleek-spec-val">Fair Trade Organic</span>
          </div>
          <div class="sleek-spec-tile is-full-width">
            <span class="sleek-spec-label">Recommended Brew</span>
            <span class="sleek-spec-val">{{ sum.brewing_method }}</span>
          </div>
        </div>
      </div>

      {% if sum.history and sum.history.size > 0 %}
      <div class="sleek-history-section">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Lot & Harvest History</h2>
          <span class="sleek-spec-subheading">Crop Traceability</span>
        </div>

        <div class="sleek-history-list">
          {% for h in sum.history %}
            <div class="sleek-history-card">
              <div class="sleek-history-card-top">
                {% if h.components %}
                  {% for c in h.components %}
                    <div class="sleek-history-lot-title">
                      {{ c.name }}
                      {% if c.ratio %}<span style="font-size: 0.85rem; color: #9c6d12; font-weight: 700;">({{ c.ratio }})</span>{% endif %}
                    </div>
                  {% endfor %}
                {% else %}
                  <div class="sleek-history-lot-title">{{ sum.title }}</div>
                {% endif %}

                <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} · Current Lot{% endif %}</span>
              </div>

              <div class="sleek-history-chips-row">
                <span class="sleek-history-chip">
                  <span class="chip-k">Region:</span>
                  <span class="chip-v">{{ sum.region }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Terroir:</span>
                  <span class="chip-v">{{ sum.elevation }}</span>
                </span>
                <span class="sleek-history-chip">
                  <span class="chip-k">Process:</span>
                  <span class="chip-v">{{ sum.processing_method }}</span>
                </span>
              </div>

              {% if h.description %}
                <p class="sleek-history-desc">{{ h.description }}</p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</div>

<script>
  // Dynamic Price Update on Bag Size Change for all roasts
  const colPrices = {{ col.price | jsonify }};
  const ebPrices = {{ eb.price | jsonify }};
  const brzPrices = {{ brz.price | jsonify }};
  const sumPrices = {{ sum.price | jsonify }};

  const colSelect = document.getElementById('col-size-select');
  colSelect.addEventListener('change', () => {
    document.getElementById('col-price-display').textContent = '$' + colPrices[colSelect.value];
  });

  const ebSelect = document.getElementById('eb-size-select');
  ebSelect.addEventListener('change', () => {
    document.getElementById('eb-price-display').textContent = '$' + ebPrices[ebSelect.value];
  });

  const brzSelect = document.getElementById('brz-size-select');
  brzSelect.addEventListener('change', () => {
    document.getElementById('brz-price-display').textContent = '$' + brzPrices[brzSelect.value];
  });

  const sumSelect = document.getElementById('sum-size-select');
  sumSelect.addEventListener('change', () => {
    document.getElementById('sum-price-display').textContent = '$' + sumPrices[sumSelect.value];
  });

  // Roast View Switcher
  const btnCol = document.getElementById('btn-roast-colombia');
  const btnEb = document.getElementById('btn-roast-earlybird');
  const btnBrz = document.getElementById('btn-roast-brazil');
  const btnSum = document.getElementById('btn-roast-sumatra');

  const viewCol = document.getElementById('view-roast-colombia');
  const viewEb = document.getElementById('view-roast-earlybird');
  const viewBrz = document.getElementById('view-roast-brazil');
  const viewSum = document.getElementById('view-roast-sumatra');

  const allBtns = [btnCol, btnEb, btnBrz, btnSum];
  const allViews = [viewCol, viewEb, viewBrz, viewSum];

  function switchRoast(activeBtn, activeView) {
    allBtns.forEach(b => b.classList.remove('is-active'));
    allViews.forEach(v => v.style.display = 'none');
    activeBtn.classList.add('is-active');
    activeView.style.display = 'block';
  }

  btnCol.addEventListener('click', () => switchRoast(btnCol, viewCol));
  btnEb.addEventListener('click', () => switchRoast(btnEb, viewEb));
  btnBrz.addEventListener('click', () => switchRoast(btnBrz, viewBrz));
  btnSum.addEventListener('click', () => switchRoast(btnSum, viewSum));
</script>
