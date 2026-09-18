---
layout: default
title: Roasts
permalink: /roasts/
---

# Roasts

<p class="category-intro">Explore our current selection of coffees.</p>

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
    <label for="filter-brewing" class="roast-mv-meta-label">Brewing Method</label>
    <select id="filter-brewing" class="subscribe-select">
      <option value="">All Methods</option>
    </select>
  </div>
</div>

<!-- Roasts Grid -->
<div class="roasts-grid" id="roasts-grid">
  {% assign blends = site.roasts | where: "category", "blend" | sort: "order" %}
  {% assign blends_active = blends | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
  {% assign blends_incubating = blends | where_exp: "item", "item.status == 'incubating'" %}
  {% assign blends_flown = blends | where_exp: "item", "item.status == 'flown_south'" %}
  {% assign blends = blends_active | concat: blends_incubating | concat: blends_flown %}

  {% assign seasonals = site.roasts | where: "category", "seasonal" | sort: "order" %}
  {% assign seasonals_active = seasonals | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
  {% assign seasonals_incubating = seasonals | where_exp: "item", "item.status == 'incubating'" %}
  {% assign seasonals_flown = seasonals | where_exp: "item", "item.status == 'flown_south'" %}
  {% assign seasonals = seasonals_active | concat: seasonals_incubating | concat: seasonals_flown %}

  {% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
  {% assign single_origins_active = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
  {% assign single_origins_incubating = single_origins | where_exp: "item", "item.status == 'incubating'" %}
  {% assign single_origins_flown = single_origins | where_exp: "item", "item.status == 'flown_south'" %}
  {% assign single_origins = single_origins_active | concat: single_origins_incubating | concat: single_origins_flown %}

  {% assign subscriptions = site.subscriptions | sort: "order" %}
  {% assign sorted_roasts = blends | concat: seasonals | concat: single_origins | concat: subscriptions %}
  {% assign current_category = "" %}
  {% for r in sorted_roasts %}
    {% assign cat = r.category %}
    {% if cat != current_category %}
      {% assign current_category = cat %}
      <div class="roasts-section-break" data-category="{{ current_category }}">
        <div class="roasts-section-break-line"></div>
        <span class="roasts-section-break-title">{% if current_category == 'blend' %}Blends{% elsif current_category == 'seasonal' %}Seasonals{% elsif current_category == 'single origin' %}Single Origins{% elsif current_category == 'subscriptions' %}Subscriptions{% else %}{{ current_category | capitalize }}{% endif %}</span>
        <div class="roasts-section-break-line"></div>
      </div>
    {% endif %}
    {% include roast-card.html roast=r %}
  {% endfor %}
</div>

<!-- JavaScript for Dynamic Filters -->
<script src="{{ '/js/catalog-filters.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

