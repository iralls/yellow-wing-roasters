---
layout: sleek
title: "Sleek Catalog Prototype"
permalink: /sleek-preview/catalog/
sitemap: false
---

<div class="roasts-header-row" style="margin-top: 2rem; margin-bottom: 1.5rem;">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Current Offerings</h1>
    <p class="category-intro">Small-batch coffees, roasted fresh to order.</p>
  </div>
  <a href="{{ '/quiz/' | relative_url }}" class="roasts-quiz-cta" title="Find your match">
    <span class="roasts-quiz-cta-icon" aria-hidden="true">✨</span>
    <span>Find Your Match</span>
    <span class="roasts-quiz-cta-arrow" aria-hidden="true">→</span>
  </a>
</div>

<!-- Minimalist Horizontal Filter Chips Bar -->
<div class="sleek-filter-chips-bar" id="catalog-chips-bar">
  <button type="button" class="sleek-filter-chip is-active" data-cat-filter="all">All Coffees</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="single origin">Single Origins</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="blend">Blends</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="seasonal">Seasonals</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="1">Light Roast</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="2">Medium-Light</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="3">Medium</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="4">Dark</button>
</div>

<!-- Unified Neutral Cards Grid -->
{% assign all_roasts = site.roasts | sort: "order" %}
<div class="sleek-comparison-grid" id="catalog-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
  {% for r in all_roasts %}
    {% assign r_price_12 = r.price["12oz"] %}
    {% if r_price_12 == nil %}
      {% assign first_entry = r.price.first %}
      {% assign r_price_12 = first_entry[1] %}
    {% endif %}

    {% assign s_info = site.data.statuses[r.status] %}

    <a href="{{ '/sleek-preview/roast-detail/' | relative_url }}"
       class="sleek-roast-card sleek-catalog-item{% if s_info.dim_card %} sleek-roast-card--dimmed sleek-roast-card--{{ r.status }}{% endif %}"
       data-surface="linen"
       data-category="{{ r.category }}"
       data-roast-level="{{ r.roast_level }}"
       data-status="{{ r.status }}">
      <div class="sleek-card-visual">
        <!-- Top-left: Category tag pill only (No status overlap!) -->
        <div class="sleek-card-tags-left">
          <span class="sleek-card-tag">{{ r.category | upcase }}</span>
        </div>

        {% if r.best_seller %}
          <span class="sleek-card-tag--best-seller">★ Best Seller</span>
        {% endif %}

        {% if r.mascot_file %}
          <img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="{{ r.title }}" class="sleek-card-mascot" loading="lazy">
        {% endif %}

        <!-- Hover reveal bar: Tasting notes revealed on hover -->
        <div class="sleek-card-reveal-bar">
          {% if r.tasting_notes %}
            <span>{{ r.tasting_notes | replace: ", ", " · " | downcase }}</span>
          {% elsif r.brewing_method %}
            <span>{{ r.brewing_method | replace: ", ", " · " }}</span>
          {% else %}
            <span>Quick View</span>
          {% endif %}
        </div>
      </div>

      <!-- Mode 1: Horizontal Divider Line between Artwork & Body -->
      {% if r.status and site.data.statuses[r.status].badge %}
        <div class="sleek-card-divider-status sleek-card-divider-status--{{ r.status }}">
          <span class="sleek-status-pip"></span>
          <span class="sleek-status-text">{{ s_info.badge }}</span>
          {% if r.status == 'mid_molt' %}
            <span class="sleek-status-note">· in flux</span>
          {% elsif r.status == 'low_stock' %}
            <span class="sleek-status-note">· limited</span>
          {% elsif r.status == 'flown_south' %}
            <span class="sleek-status-note">· unavailable</span>
          {% elsif r.status == 'incubating' %}
            <span class="sleek-status-note">· coming soon</span>
          {% endif %}
        </div>
      {% elsif r.featured %}
        <div class="sleek-card-divider-status sleek-card-divider-status--featured">
          <span class="sleek-status-pip"></span>
          <span class="sleek-status-text">Featured Selection</span>
        </div>
      {% else %}
        <div class="sleek-card-divider-status sleek-card-divider-status--none"></div>
      {% endif %}

      <div class="sleek-card-body">
        <div class="sleek-card-eyebrow">
          <div class="sleek-card-dots">
            {% include roast-dots.html roast=r %}
          </div>
        </div>

        <h3 class="sleek-card-title">{{ r.card_title | default: r.title }}</h3>
        {% if r.subtitle %}
          <div class="sleek-card-subtitle">{{ r.subtitle }}</div>
        {% endif %}

        <!-- High-level descriptor ("balanced and smooth") in resting state -->
        {% if r.descriptor %}
          <p class="sleek-card-descriptor">{{ r.descriptor | downcase }}</p>
        {% endif %}

        <div class="sleek-card-footer">
          <div class="sleek-card-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s> <span style="color:#b45309;">${{ r.temporary_price["12oz"] }}</span><span class="sleek-card-price-sub">/ 12oz</span>
            {% elsif r_price_12 %}
              ${{ r_price_12 }}<span class="sleek-card-price-sub">/ 12oz</span>
            {% endif %}
          </div>
          {% if r.status == 'flown_south' %}
            <span class="sleek-card-cta sleek-card-cta--dimmed">Seasonal Archive →</span>
          {% elsif s_info.dim_card %}
            <span class="sleek-card-cta sleek-card-cta--dimmed">Coming Soon →</span>
          {% endif %}
        </div>
      </div>
    </a>
  {% endfor %}
</div>

<script>
  // Instant Filter Chips Interaction
  const chips = document.querySelectorAll('#catalog-chips-bar .sleek-filter-chip');
  const items = document.querySelectorAll('.sleek-catalog-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const catFilter = chip.getAttribute('data-cat-filter');
      const levelFilter = chip.getAttribute('data-level-filter');

      items.forEach(item => {
        let match = true;
        if (catFilter && catFilter !== 'all') {
          if (item.getAttribute('data-category') !== catFilter) {
            match = false;
          }
        }
        if (levelFilter) {
          if (item.getAttribute('data-roast-level') !== levelFilter) {
            match = false;
          }
        }

        item.style.display = match ? 'flex' : 'none';
      });
    });
  });
</script>
