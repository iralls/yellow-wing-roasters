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

  <div class="filter-group filter-group--view">
    <span class="roast-mv-meta-label">View</span>
    <div class="view-switcher" role="group" aria-label="Layout view">
      <button type="button" class="view-btn is-active" id="view-grid-btn" data-view="grid" aria-label="Standard grid view" title="Standard grid view" aria-pressed="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      </button>
      <button type="button" class="view-btn" id="view-compact-btn" data-view="compact" aria-label="Compact grid view" title="Compact grid view" aria-pressed="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="3" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="3" y="17" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="17" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="17" width="4" height="4" rx="0.75"></rect>
        </svg>
      </button>
      <button type="button" class="view-btn" id="view-list-btn" data-view="list" aria-label="List view" title="List view" aria-pressed="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    </div>
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

