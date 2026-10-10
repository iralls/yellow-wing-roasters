---
layout: default
title: Roasts
permalink: /roasts/
---

<div class="roasts-header-row">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Roasts</h1>
    <p class="category-intro">Explore our current selection of coffees.</p>
  </div>
  <a href="{{ '/quiz/' | relative_url }}" class="roasts-quiz-cta" title="Find your perfect roast with our interactive quiz">
    <span class="roasts-quiz-cta-icon" aria-hidden="true">✨</span>
    <span>Take the Coffee Quiz</span>
    <span class="roasts-quiz-cta-arrow" aria-hidden="true">→</span>
  </a>
</div>

<!-- Dynamic Filters Bar -->
<div class="filters-bar" id="filters-bar">
  <div class="filter-group">
    <label for="filter-category" class="roast-mv-meta-label">Type</label>
    <select id="filter-category" class="subscribe-select">
      <option value="">All Types</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-origin" class="roast-mv-meta-label">Origin</label>
    <select id="filter-origin" class="subscribe-select">
      <option value="">All Origins</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label for="filter-process" class="roast-mv-meta-label">Process</label>
    <select id="filter-process" class="subscribe-select">
      <option value="">All Processes</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-level" class="roast-mv-meta-label">Roast Level</label>
    <select id="filter-level" class="subscribe-select">
      <option value="">All Levels</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-flavor" class="roast-mv-meta-label">Flavor Profile</label>
    <select id="filter-flavor" class="subscribe-select">
      <option value="">All Flavors</option>
      {% for profile in site.data.flavor_profiles %}
        <option value="{{ profile.id }}">{{ profile.name }}</option>
      {% endfor %}
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-origin" class="roast-mv-meta-label">Origin</label>
    <select id="filter-origin" class="subscribe-select">
      <option value="">All Origins</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label for="filter-process" class="roast-mv-meta-label">Process</label>
    <select id="filter-process" class="subscribe-select">
      <option value="">All Processes</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-brewing" class="roast-mv-meta-label">Brewing Method</label>
    <select id="filter-brewing" class="subscribe-select">
      <option value="">All Methods</option>
      <option value="AeroPress">AeroPress</option>
      <option value="Chemex">Chemex</option>
      <option value="Cold Brew">Cold Brew</option>
      <option value="Drip">Drip</option>
      <option value="Espresso">Espresso</option>
      <option value="French Press">French Press</option>
      <option value="Moka Pot">Moka Pot</option>
      <option value="Pour-over">Pour-over</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-certification" class="roast-mv-meta-label">Certification</label>
    <select id="filter-certification" class="subscribe-select" title="Filter by certification">
      <option value="">All</option>
      <option value="organic">Organic</option>
      <option value="fair_trade_organic">Fair Trade Organic</option>
    </select>
  </div>
</div>

<!-- Roasts Grid -->
<div class="roasts-grid" id="roasts-grid">
  {% include category-section.html category="blend" title="Blends" show_break=true %}
  {% include category-section.html category="seasonal" title="Seasonals" show_break=true %}
  {% include category-section.html category="single origin" title="Single Origins" show_break=true %}
  {% include category-section.html category="custom" title="Custom" show_break=true %}
  {% include category-section.html category="subscriptions" title="Subscriptions" show_break=true %}
  {% include category-section.html category="flight" title="Flights" show_break=true %}
</div>

<!-- Empty Filter State -->
<div id="roasts-empty-filters" class="roasts-empty-state" style="display: none; text-align: center; margin: 3rem auto; max-width: 28rem;">
  <p style="font-size: 1.05rem; color: #6e5e54; margin-bottom: 1.25rem;">No coffees match your current filter combination.</p>
  <button type="button" id="reset-filters-btn" class="action-pill-btn btn-secondary-pill">Reset All Filters</button>
</div>

<!-- JavaScript for Dynamic Filters -->
<script src="{{ '/js/catalog-filters.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

