---
layout: default
title: Roasts
permalink: /roasts/
---

<div class="roasts-catalog-wrap" style="max-width: 74rem; margin: 0 auto;">
<div class="roasts-header-row" style="margin-top: 2rem; margin-bottom: 1.5rem;">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Current Offerings</h1>
    <p class="category-intro">Small-batch coffees, roasted fresh to order.</p>
  </div>
  <a href="{{ '/quiz/' | relative_url }}" class="roasts-quiz-cta" title="Find your match">
    <span>Find Your Match</span>
    <span class="roasts-quiz-cta-arrow" aria-hidden="true">&rarr;</span>
  </a>
</div>

<!-- Filter & View Controls Toolbar -->
<div class="roasts-controls-bar" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(44, 30, 20, 0.08);">
  <div class="sleek-filter-chips-bar" id="catalog-chips-bar" style="margin-bottom: 0; padding: 0; border-bottom: none;">
    <button type="button" class="sleek-filter-chip is-active" data-cat-filter="all">All Coffees</button>
    <button type="button" class="sleek-filter-chip" data-cat-filter="single origin">Single Origins</button>
    <button type="button" class="sleek-filter-chip" data-cat-filter="blend">Blends</button>
    <button type="button" class="sleek-filter-chip" data-cat-filter="seasonal">Seasonals</button>
    <button type="button" class="sleek-filter-chip" data-level-filter="1,2">Light</button>
    <button type="button" class="sleek-filter-chip" data-level-filter="2,3,4">Medium</button>
    <button type="button" class="sleek-filter-chip" data-level-filter="4,5">Dark</button>
  </div>

  <div class="min-view-switch" role="group" aria-label="View Mode">
    <button type="button" class="min-view-btn is-active" data-view="grid" aria-pressed="true">Gallery</button>
    <button type="button" class="min-view-btn" data-view="list" aria-pressed="false">List</button>
  </div>
</div>

<!-- Unified Neutral Cards Grid (3-column gallery) -->
{% assign all_roasts = site.roasts | sort: "order" %}
<div class="roast-trans-grid sleek-comparison-grid" id="catalog-grid">
  {% for r in all_roasts %}
    {% include roast-card.html roast=r card_class="sleek-catalog-item" %}
  {% endfor %}
</div>

<!-- Minimal Sommelier / Cellar List View -->
<div class="min-cellar-list" id="catalog-list" style="display: none; border-top: none;">
  {% for r in all_roasts %}
    {% assign s_info = site.data.statuses[r.status] %}
    {% assign r_url = r.permalink | default: r.url %}
    {% assign num_str = forloop.index %}
    {% if forloop.index < 10 %}{% assign num_str = "0" | append: forloop.index %}{% endif %}

    <div class="min-cellar-item sleek-catalog-item{% if s_info.dim_card %} min-cellar-item--dimmed{% endif %}"
         data-category="{{ r.category }}"
         data-roast-level="{{ r.roast_level }}"
         data-title="{{ r.title }}"
         data-notes="{{ r.tasting_notes }}"
         data-slug="{{ r.slug }}">
      <span class="min-cellar-num">{{ num_str }}</span>
      <div class="min-cellar-info">
        <a href="{{ r_url | relative_url }}" class="min-cellar-name">{{ r.card_title | default: r.title }}</a>
        <span class="min-cellar-sub">{{ r.category }} · {{ r.descriptor | default: r.subtitle }}</span>
      </div>
      <span class="min-cellar-origin">
        {% if r.origins %}
          {{ r.origins | join: ", " }}
        {% elsif r.category == 'single origin' %}
          {{ r.title | split: " " | first }}
        {% endif %}
      </span>
      <span class="min-cellar-notes">{{ r.tasting_notes }}</span>
      <span class="min-cellar-price">
        {% if r.temporary_price and r.temporary_price["12oz"] %}
          <s>${{ r.price["12oz"] }}</s> <span style="color:#b45309;">${{ r.temporary_price["12oz"] }}</span>
        {% elsif r.price and r.price["12oz"] %}
          ${{ r.price["12oz"] }}
        {% elsif r.price and r.price.first %}
          ${{ r.price.first[1] }}
        {% elsif r.price %}
          ${{ r.price }}
        {% endif %}
      </span>
      <div class="min-cellar-action">
        {% if r.status == 'flown_south' %}
          <span class="roast-trans-archived-label">Seasonal Archive</span>
        {% elsif r.status == 'incubating' or s_info.dim_card %}
          <span class="roast-trans-archived-label">Coming Soon</span>
        {% else %}
          <button type="button"
                  class="min-cellar-quick-add roasts-entry-quick-add"
                  data-slug="{{ r.slug }}"
                  data-size="12oz">
            + Add
          </button>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
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
          const allowedLevels = levelFilter.split(',');
          const itemLevel = item.getAttribute('data-roast-level');
          if (!allowedLevels.includes(itemLevel)) {
            match = false;
          }
        }

        item.style.display = match ? '' : 'none';
      });
    });
  });

  // View Switcher (Gallery Grid vs Cellar List)
  const viewBtns = document.querySelectorAll('.min-view-btn');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogList = document.getElementById('catalog-list');

  function setView(view) {
    viewBtns.forEach(b => {
      const isActive = b.getAttribute('data-view') === view;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', isActive.toString());
    });

    if (view === 'list') {
      catalogGrid.style.display = 'none';
      catalogList.style.display = 'flex';
    } else {
      catalogGrid.style.display = '';
      catalogList.style.display = 'none';
    }

    try {
      localStorage.setItem('ywr_catalog_view', view);
    } catch (e) {}
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setView(btn.getAttribute('data-view'));
    });
  });

  // Allow clicking anywhere on a list row to navigate to details (except on links/buttons)
  catalogList.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const row = e.target.closest('.min-cellar-item');
    if (row) {
      const link = row.querySelector('.min-cellar-name');
      if (link && link.href) {
        window.location.href = link.href;
      }
    }
  });

  // Activate chip from URL query param if present
  const urlParams = new URLSearchParams(window.location.search);
  const qCat = urlParams.get('category');
  if (qCat) {
    const targetChip = Array.from(chips).find(c => c.getAttribute('data-cat-filter') === qCat.toLowerCase());
    if (targetChip) targetChip.click();
  }

  const qLevel = urlParams.get('level') || urlParams.get('roast_level');
  if (qLevel) {
    const targetChip = Array.from(chips).find(c => {
      const txt = c.textContent.trim().toLowerCase();
      return txt === qLevel.toLowerCase() || c.getAttribute('data-level-filter') === qLevel;
    });
    if (targetChip) targetChip.click();
  }

  // Restore saved view preference or URL param
  const qView = urlParams.get('view');
  if (qView === 'list' || qView === 'grid') {
    setView(qView);
  } else {
    try {
      const saved = localStorage.getItem('ywr_catalog_view');
      if (saved === 'list') {
        setView('list');
      }
    } catch (e) {}
  }
</script>
