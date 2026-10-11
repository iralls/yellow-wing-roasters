---
layout: sleek
title: "Minimal Homepage Prototype"
permalink: /sleek-preview/home/
sitemap: false
---

<!-- Hero Section (matching existing home) -->
<section class="sleek-home-hero">
  <h1 class="sleek-home-headline">Small-Batch<br>Coffee Roasting</h1>
  <p class="sleek-home-sub">
    We craft flavors we love, and hope you will too.
  </p>

  <div class="sleek-home-cta-row">
    <a href="{{ '/sleek-preview/catalog/' | relative_url }}" class="sleek-home-btn-primary">
      Explore All Roasts →
    </a>
  </div>

  <div class="sleek-home-birds">
    <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="Robin mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="Canary mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-hummingbird-transparent.png' | relative_url }}" alt="Hummingbird mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="Bluebird mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-osprey-transparent.png' | relative_url }}" alt="Osprey mascot" fetchpriority="high" decoding="async">
  </div>
</section>

<!-- Curated Seasonal / Featured Offerings Showcase -->
<section class="sleek-home-showcase-section">
  <div class="sleek-home-showcase-header">
    <div>
      <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #9c6d12;">Current Selections</span>
      <h2 class="sleek-home-showcase-title">Featured Offerings</h2>
    </div>
    <a href="{{ '/sleek-preview/catalog/' | relative_url }}" class="sleek-home-showcase-link">
      <span>View all coffees</span>
      <span aria-hidden="true">→</span>
    </a>
  </div>

  {% assign active_roasts = site.roasts | where_exp: "r", "r.status != 'flown_south'" %}
  {% assign showcase_roasts = active_roasts | where: "best_seller", true %}
  {% if showcase_roasts.size < 3 %}
    {% assign showcase_roasts = active_roasts %}
  {% endif %}

  <div class="sleek-comparison-grid">
    {% for r in showcase_roasts limit:3 %}
      <a href="{{ '/sleek-preview/roast-detail/' | relative_url }}" class="sleek-roast-card" data-surface="linen">
        <div class="sleek-card-visual">
          <!-- Top-left: Category tag pill (rounded square) + Status pill -->
          <div class="sleek-card-tags-left">
            <span class="sleek-card-tag">{{ r.category | upcase }}</span>
          </div>

          {% if r.best_seller %}
            <span class="sleek-card-tag--best-seller">★ Best Seller</span>
          {% endif %}

          <img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="{{ r.title }}" class="sleek-card-mascot" loading="lazy">

          <div class="sleek-card-reveal-bar">
            <span>{{ r.tasting_notes | replace: ", ", " · " | downcase }}</span>
          </div>
        </div>

        <!-- Horizontal Divider Status Line -->
        {% if r.status and site.data.statuses[r.status].badge %}
          {% assign s_info = site.data.statuses[r.status] %}
          <div class="sleek-card-divider-status sleek-card-divider-status--{{ r.status }}">
            <span class="sleek-status-pip"></span>
            <span class="sleek-status-text">{{ s_info.badge }}</span>
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
              {% elsif r.price["12oz"] %}
                ${{ r.price["12oz"] }}<span class="sleek-card-price-sub">/ 12oz</span>
              {% endif %}
            </div>
            <span style="font-family: Montserrat, sans-serif; font-size: 0.74rem; font-weight: 700; color: #9c6d12;">Details →</span>
          </div>
        </div>
      </a>
    {% endfor %}
  </div>
</section>
