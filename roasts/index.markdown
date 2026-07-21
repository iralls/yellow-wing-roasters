---
layout: default
title: Roasts
permalink: /roasts/
---

# Roasts

<p style="color: #666; font-size: 1.1rem; margin-top: -0.5rem; margin-bottom: 2rem;">Explore our current selection of small-batch roasted coffees.</p>

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
  {% assign sorted_roasts = site.roasts | sort: "order" %}
  {% for r in sorted_roasts %}
    {% if r.origins %}
      {% assign origin_list = r.origins | join: "," %}
    {% else %}
      {% assign origin_list = r.title | split: " " | first %}
    {% endif %}

    <a class="roasts-entry{% if r.coming_soon %} roasts-entry--soon{% endif %}" 
       href="{{ r.url | relative_url }}"
       data-category="{{ r.category }}"
       data-origins="{{ origin_list }}"
       data-roast-dots="{{ r.roast_dots }}"
       data-brewing="{{ r.brewing_method }}">
      
      <div class="roasts-entry-visual">
        {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
      </div>
      {% if r.coming_soon %}<div class="roasts-entry-soon-badge">Coming Soon</div>{% endif %}
      {% if r.rotating %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
      
      <div class="roasts-entry-info">
        <div class="roasts-entry-title">{{ r.title }}</div>
        {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
        
        {% if r.roast_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r.roast_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
        
        {% assign rp = site.data.pricing.overrides[r.slug] %}{% if rp and rp["12oz"] %}{% assign price_12 = rp["12oz"] %}{% else %}{% assign price_12 = site.data.pricing.default["12oz"] %}{% endif %}
        <div class="roasts-entry-prices">${{ price_12 }}</div>
      </div>
    </a>
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

  var categories = {};
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
    // Category
    var cat = (card.getAttribute('data-category') || '').trim();
    if (cat) {
      categories[cat] = true;
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
  // Type / Category
  if (selectCategory) {
    Object.keys(categories).sort().forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.split(' ').map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');
      selectCategory.appendChild(opt);
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
    var chosenCategory = selectCategory ? selectCategory.value : '';
    var chosenOrigin = selectOrigin.value;
    var chosenLevel = selectLevel.value;
    var chosenBrewing = selectBrewing.value;

    cards.forEach(function (card) {
      // Check category match
      var cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
      var matchesCategory = !chosenCategory || cardCat === chosenCategory.toLowerCase();

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
      if (matchesCategory && matchesOrigin && matchesLevel && matchesBrewing) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 4. Attach Event Listeners
  if (selectCategory) selectCategory.addEventListener('change', applyFilters);
  selectOrigin.addEventListener('change', applyFilters);
  selectLevel.addEventListener('change', applyFilters);
  selectBrewing.addEventListener('change', applyFilters);
})();
</script>
