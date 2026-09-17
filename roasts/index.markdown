---
layout: default
title: Roasts
permalink: /roasts/
---

# Roasts

<p class="category-intro">Explore our current selection of coffees.</p>

<!-- Dynamic Filters Bar -->
<div class="filters-bar" id="filters-bar" style="display: flex; gap: 1.5rem; margin-bottom: 2.5rem; flex-wrap: wrap; align-items: center; justify-content: flex-start; padding: 0.5rem 0;">
  <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
    <label for="filter-category" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Type</label>
    <select id="filter-category" class="subscribe-select" style="min-width: 140px;">
      <option value="">All Types</option>
    </select>
  </div>

  <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
    <label for="filter-origin" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Origin</label>
    <select id="filter-origin" class="subscribe-select" style="min-width: 140px;">
      <option value="">All Origins</option>
    </select>
  </div>
  
  <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
    <label for="filter-level" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Roast Level</label>
    <select id="filter-level" class="subscribe-select" style="min-width: 140px;">
      <option value="">All Levels</option>
    </select>
  </div>

  <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
    <label for="filter-brewing" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Brewing Method</label>
    <select id="filter-brewing" class="subscribe-select" style="min-width: 160px;">
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

  {% assign sorted_roasts = blends | concat: single_origins | concat: seasonals %}
  {% assign current_category = "" %}
  {% for r in sorted_roasts %}
    {% if r.category != current_category %}
      {% assign current_category = r.category %}
      <div class="roasts-section-break" data-category="{{ current_category }}">
        <div class="roasts-section-break-line"></div>
        <span class="roasts-section-break-title">{% if current_category == 'blend' %}Blends{% elsif current_category == 'single origin' %}Single Origins{% elsif current_category == 'seasonal' %}Seasonals{% else %}{{ current_category | capitalize }}{% endif %}</span>
        <div class="roasts-section-break-line"></div>
      </div>
    {% endif %}
    {% include roast-card.html roast=r %}
  {% endfor %}
</div>

<!-- JavaScript for Dynamic Filters -->
<script>
(function () {
  var cards = document.querySelectorAll('#roasts-grid .roasts-entry');
  var selectCategory = document.getElementById('filter-category');
  var selectOrigin = document.getElementById('filter-origin');
  var selectLevel = document.getElementById('filter-level');
  var selectBrewing = document.getElementById('filter-brewing');

  var types = {};
  var origins = {};
  var levels = { 'Light': true, 'Medium': true, 'Dark': true };
  var brewingMethods = {};

  var METHOD_MAP = {
    'pour-over': 'Pour-over',
    'espresso': 'Espresso',
    'drip': 'Drip',
    'french press': 'French Press',
    'moka pot': 'Moka Pot',
    'aeropress': 'AeroPress',
    'cold brew': 'Cold Brew'
  };

  function normalizeMethod(method) {
    var clean = method.trim().toLowerCase();
    if (METHOD_MAP[clean]) {
      return METHOD_MAP[clean];
    }
    return clean.split(' ').map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  // 1. Scan cards to extract unique filter values
  cards.forEach(function (card) {
    // Type (blend or single-origin)
    var t = (card.getAttribute('data-type') || '').trim().toLowerCase();
    if (t) {
      types[t] = true;
    }

    // Origins (comma-separated list)
    var originsAttr = card.getAttribute('data-origins') || '';
    var cardOrigins = originsAttr.split(',').map(function (o) {
      return o.trim();
    }).filter(Boolean);
    
    // Store back normalized array to ease filtering later
    card.setAttribute('data-origins-list', JSON.stringify(cardOrigins));

    cardOrigins.forEach(function (origin) {
      origins[origin] = true;
    });

    // Brewing methods
    var brewingAttr = card.getAttribute('data-brewing') || '';
    var methods = brewingAttr.replace(/\bor\b/gi, '').split(',').map(function (m) {
      return normalizeMethod(m);
    }).filter(function (m) {
      return m.length > 0;
    });
    
    card.setAttribute('data-brewing-list', JSON.stringify(methods));

    methods.forEach(function (method) {
      brewingMethods[method] = true;
    });
  });

  // 2. Populate Dropdowns Dynamically
  // Type (Blend, Single Origin)
  if (selectCategory) {
    var typeOrder = ['blend', 'single-origin'];
    typeOrder.forEach(function (t) {
      if (types[t]) {
        var opt = document.createElement('option');
        opt.value = t;
        opt.textContent = (t === 'single-origin' || t === 'single origin') ? 'Single Origin' : 'Blend';
        selectCategory.appendChild(opt);
      }
    });
  }

  // Origins
  Object.keys(origins).sort().forEach(function (origin) {
    var opt = document.createElement('option');
    opt.value = origin;
    opt.textContent = origin;
    selectOrigin.appendChild(opt);
  });

  // Roast Levels
  Object.keys(levels).forEach(function (level) {
    var opt = document.createElement('option');
    opt.value = level;
    opt.textContent = level;
    selectLevel.appendChild(opt);
  });

  // Brewing Methods
  Object.keys(brewingMethods).sort().forEach(function (method) {
    var opt = document.createElement('option');
    opt.value = method;
    opt.textContent = method;
    selectBrewing.appendChild(opt);
  });

  // 3. Filter Application Logic
  function applyFilters() {
    var chosenType = selectCategory ? selectCategory.value : '';
    var chosenOrigin = selectOrigin.value;
    var chosenLevel = selectLevel.value;
    var chosenBrewing = selectBrewing.value;

    cards.forEach(function (card) {
      // Check type match
      var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
      var matchesType = !chosenType || cardType === chosenType.toLowerCase();

      // Check if chosenOrigin is in the list of origins for this card
      var originsList = JSON.parse(card.getAttribute('data-origins-list') || '[]');
      var matchesOrigin = !chosenOrigin || originsList.indexOf(chosenOrigin) >= 0;
      
      // Map roast level category based on dots
      var dots = parseInt(card.getAttribute('data-roast-dots')) || 3;
      var levelCat = "Medium";
      if (dots <= 2) levelCat = "Light";
      else if (dots >= 4) levelCat = "Dark";
      var matchesLevel = !chosenLevel || levelCat === chosenLevel;

      // Map brewing method
      var methodsList = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
      var matchesBrewing = !chosenBrewing || methodsList.indexOf(chosenBrewing) >= 0;

      // Show/Hide Card
      if (matchesType && matchesOrigin && matchesLevel && matchesBrewing) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Update section break visibility
    var sectionBreaks = document.querySelectorAll('#roasts-grid .roasts-section-break');
    sectionBreaks.forEach(function (breakEl) {
      var sectionCat = (breakEl.getAttribute('data-category') || '').trim().toLowerCase();
      var hasVisible = Array.prototype.some.call(cards, function (card) {
        var cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
        return cardCat === sectionCat && card.style.display !== 'none';
      });
      breakEl.style.display = hasVisible ? '' : 'none';
    });
  }

  // 4. Attach Event Listeners
  if (selectCategory) selectCategory.addEventListener('change', applyFilters);
  selectOrigin.addEventListener('change', applyFilters);
  selectLevel.addEventListener('change', applyFilters);
  selectBrewing.addEventListener('change', applyFilters);
})();
</script>
