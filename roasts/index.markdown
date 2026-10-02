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
    <label for="filter-brewing" class="roast-mv-meta-label">Brewing Method</label>
    <select id="filter-brewing" class="subscribe-select">
      <option value="">All Methods</option>
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

  <!-- Blends -->
  <div class="roasts-section-break" data-category="blend">
    <div class="roasts-section-break-line"></div>
    <span class="roasts-section-break-title">Blends</span>
    <div class="roasts-section-break-line"></div>
  </div>
  {% for r in blends %}
    {% include roast-card.html roast=r %}
  {% endfor %}
  <div class="roasts-entry" data-roast="byob" data-category="blend" data-type="blend">
    <a class="roasts-entry-visual" href="{{ '/roasts/build-your-own-blend/' | relative_url }}" aria-label="BYOB - Build Your Own Blend">
      <div class="lazy-susan-container">
        <div class="lazy-susan-track">
          <div class="susan-dots susan-dots--grad-left" aria-hidden="true">
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
          </div>
          <div class="susan-birds susan-birds--depth">
            <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
            <img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-center" loading="lazy" decoding="async">
            <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
          </div>
          <div class="susan-dots susan-dots--grad-right" aria-hidden="true">
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
          </div>
        </div>
      </div>
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">craft your own custom blend from our single origin roasts</div>
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Build Your Own Blend</div>
          <div class="roasts-entry-prices">$32</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom blend</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Seasonals -->
  <div class="roasts-section-break" data-category="seasonal">
    <div class="roasts-section-break-line"></div>
    <span class="roasts-section-break-title">Seasonals</span>
    <div class="roasts-section-break-line"></div>
  </div>
  {% for r in seasonals %}
    {% include roast-card.html roast=r %}
  {% endfor %}

  <!-- Single Origins -->
  <div class="roasts-section-break" data-category="single origin">
    <div class="roasts-section-break-line"></div>
    <span class="roasts-section-break-title">Single Origins</span>
    <div class="roasts-section-break-line"></div>
  </div>
  {% assign so_byob_rendered = false %}
  {% for r in single_origins %}
    {% if r.status == 'flown_south' and so_byob_rendered == false %}
  <div class="roasts-entry" data-roast="byob" data-category="single origin" data-type="single-origin">
    <a class="roasts-entry-visual" href="{{ '/roasts/byob/' | relative_url }}" aria-label="BYOB - Bring your own beans">
      <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring your own beans mascot" class="roasts-entry-mascot" loading="lazy" decoding="async">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">send us your green beans and we'll roast them to perfection</div>
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own beans</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast</div>
        </div>
      </div>
    </div>
  </div>
  <div class="roasts-entry" data-roast="byob-burner" data-category="single origin" data-type="single-origin">
    <a class="roasts-entry-visual" href="{{ '/roasts/bring-your-own-burner/' | relative_url }}" aria-label="BYOB - Bring your own burner">
      <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="BYOB mascot" class="roasts-entry-mascot" loading="lazy" decoding="async">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">pick any single origin and customize your roast level</div>
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own burner</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast level</div>
        </div>
      </div>
    </div>
  </div>
      {% assign so_byob_rendered = true %}
    {% endif %}
    {% include roast-card.html roast=r %}
  {% endfor %}
  {% if so_byob_rendered == false %}
  <div class="roasts-entry" data-roast="byob" data-category="single origin" data-type="single-origin">
    <a class="roasts-entry-visual" href="{{ '/roasts/byob/' | relative_url }}" aria-label="BYOB - Bring your own beans">
      <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring your own beans mascot" class="roasts-entry-mascot" loading="lazy" decoding="async">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">send us your green beans and we'll roast them to perfection</div>
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own beans</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast</div>
        </div>
      </div>
    </div>
  </div>
  <div class="roasts-entry" data-roast="byob-burner" data-category="single origin" data-type="single-origin">
    <a class="roasts-entry-visual" href="{{ '/roasts/bring-your-own-burner/' | relative_url }}" aria-label="BYOB - Bring your own burner">
      <img src="{{ '/images/bird-on-spit-transparent.png' | relative_url }}" alt="BYOB mascot" class="roasts-entry-mascot" loading="lazy" decoding="async">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">pick any single origin and customize your roast level</div>
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own burner</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast level</div>
        </div>
      </div>
    </div>
  </div>
  {% endif %}

  <!-- Subscriptions -->
  <div class="roasts-section-break" data-category="subscriptions">
    <div class="roasts-section-break-line"></div>
    <span class="roasts-section-break-title">Subscriptions</span>
    <div class="roasts-section-break-line"></div>
  </div>
  {% for r in subscriptions %}
    {% include roast-card.html roast=r %}
  {% endfor %}

  <div class="roasts-section-break" data-category="flight">
    <div class="roasts-section-break-line"></div>
    <span class="roasts-section-break-title">Flights</span>
    <div class="roasts-section-break-line"></div>
  </div>
  {% include flight-cards.html %}
</div>

<!-- JavaScript for Dynamic Filters -->
<script src="{{ '/js/catalog-filters.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

