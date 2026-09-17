---
layout: default
title: Peck Your Own
slug: peck-your-own
order: 2
permalink: /flights/peck-your-own/
price_per_bag: 10
min_bags: 4
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <div class="mascot-grid mascot-grid-lg">
    <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" aria-hidden="true">
    <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" aria-hidden="true">
    <img src="{{ '/images/audubon-chimney-swift-2-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" aria-hidden="true">
    <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" aria-hidden="true">
  </div>
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">Peck Your Own</h1>
</div>

<p class="roast-mv-tasting">Pick at least {{ page.min_bags }} of our available roasts — each one comes as an 8oz bag.</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-center" id="pyo-count" style="font-weight:600; margin-bottom:0.5rem;">Select at least {{ page.min_bags }} roasts:</p>

<div class="roasts-grid" id="pyo-picker">
  {% assign roasts = site.roasts | sort: "order" %}
  {% for r in roasts %}
    {% assign s_meta = site.data.statuses[r.status] %}
    {% if s_meta == nil or s_meta.orderable != false %}
      {% assign r_level_key = r.roast_level | append: "" %}
      {% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}
      {% if level_info %}
        {% assign r_dots = level_info.dots %}
        {% assign r_layman = level_info.layman %}
        {% assign r_specialty = level_info.specialty | default: level_info.name %}
      {% else %}
        {% assign r_dots = r.roast_dots %}
        {% assign r_layman = "" %}
        {% assign r_specialty = r.roast_level %}
      {% endif %}
  <div class="roasts-entry pyo-option" data-slug="{{ r.slug }}" data-title="{{ r.title }}" data-roast="{{ r.slug }}">
    <div class="roasts-entry-visual">
      {% include roast-status-badge.html roast=r %}
      {% if r.rotating %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
      <span class="gift-type-badge">&#10003; Selected</span>
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
      <div class="roasts-entry-overlay">
        {% if r.tasting_notes %}<div class="roasts-entry-overlay-notes">{{ r.tasting_notes | replace: ", ", " · " | downcase }}</div>{% endif %}
        {% if r_dots %}
          <div class="roasts-entry-overlay-level">
            <span class="roast-dots">
              <span class="roast-dot{% if r_dots >= 1 %} roast-dot-1{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 2 %} roast-dot-2{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 3 %} roast-dot-3{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 4 %} roast-dot-4{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 5 %} roast-dot-5{% endif %}"></span>
            </span>
            <span class="roasts-entry-overlay-specialty">{{ r_specialty }}</span>
          </div>
        {% endif %}
        {% if r.origins %}
          {% assign c_arr = "" | split: "," %}
          {% for o in r.origins %}
            {% assign c = o | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
            {% assign c_arr = c_arr | push: c %}
          {% endfor %}
          <div class="roasts-entry-overlay-origins">{{ c_arr | uniq | join: " · " }}</div>
        {% elsif r.brewing_method %}
          <div class="roasts-entry-overlay-brewing">{{ r.brewing_method | replace: ", ", " · " }}</div>
        {% endif %}
        {% include roast-overlay-status.html roast=r %}
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">{{ r.title }}</div>
          {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
        </div>
        <div class="roasts-entry-meta">
          {% if r_layman %}<div class="roasts-entry-layman">{{ r_layman }}</div>{% endif %}
          {% if r.descriptor %}<div class="roasts-entry-descriptor">{{ r.descriptor | downcase }}</div>{% endif %}
        </div>
      </div>
    </div>
  </div>
    {% endif %}
  {% endfor %}
</div>

<div class="roast-mv-center" style="margin-top:1.5rem; margin-bottom:0.5rem;">
  <div class="roast-mv-meta-label" style="margin-bottom:0.35rem;">Grind</div>
  <select id="pyo-grind-select" class="subscribe-select" style="min-width: 12rem;">
    <option value="Whole Bean" selected>Whole Bean</option>
    <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
    <option value="Coarser — French Press">Coarser — French Press</option>
    <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
    <option value="Finer — Pour Over">Finer — Pour Over</option>
    <option value="Finest — Espresso">Finest — Espresso</option>
  </select>
</div>

<div class="roast-mv-center" style="margin-top:1rem;">
  {% assign default_min = page.min_bags %}
  {% assign default_price = default_min | times: page.price_per_bag %}
  <button class="add-to-order-btn add-to-order-btn--disabled" id="pyo-add" disabled>Select at least {{ default_min }} roasts — ${{ default_price }}</button>
</div>

</div>

<script>
(function () {
  var STORAGE_KEY = 'ywr_cart';
  var selected = [];
  var options = document.querySelectorAll('.pyo-option');
  var addBtn = document.getElementById('pyo-add');
  var countEl = document.getElementById('pyo-count');

  var pricePerBag = {{ page.price_per_bag | default: 10 }};
  var minBags = {{ page.min_bags | default: 4 }};

  function update() {
    var count = selected.length;
    var price = count * pricePerBag;
    var remaining = minBags - count;

    if (remaining > 0) {
      countEl.textContent = 'Select ' + remaining + ' more roast' + (remaining === 1 ? '' : 's') + ':';
      addBtn.textContent = 'Select ' + remaining + ' more — $' + (minBags * pricePerBag);
      addBtn.disabled = true;
      addBtn.classList.add('add-to-order-btn--disabled');
    } else {
      countEl.textContent = 'Your picks (' + count + '):';
      addBtn.textContent = 'Add to order — $' + price;
      addBtn.disabled = false;
      addBtn.classList.remove('add-to-order-btn--disabled');
    }

    for (var i = 0; i < options.length; i++) {
      var slug = options[i].getAttribute('data-slug');
      var isSelected = selected.indexOf(slug) >= 0;
      if (isSelected) {
        options[i].classList.add('is-selected');
      } else {
        options[i].classList.remove('is-selected');
      }
    }
  }

  for (var i = 0; i < options.length; i++) {
    options[i].style.cursor = 'pointer';
    options[i].addEventListener('click', function () {
      var slug = this.getAttribute('data-slug');
      var idx = selected.indexOf(slug);
      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        selected.push(slug);
      }
      update();
    });
  }

  addBtn.addEventListener('click', function () {
    if (selected.length < minBags) return;
    var titles = [];
    for (var j = 0; j < selected.length; j++) {
      for (var k = 0; k < options.length; k++) {
        if (options[k].getAttribute('data-slug') === selected[j]) {
          titles.push(options[k].getAttribute('data-title'));
          break;
        }
      }
    }
    var grindSelect = document.getElementById('pyo-grind-select');
    var grind = grindSelect ? grindSelect.value : 'Whole Bean';
    var cart;
    try { var raw = localStorage.getItem(STORAGE_KEY); cart = raw ? JSON.parse(raw) : {}; } catch (e) { cart = {}; }
    var key = 'peck-your-own||' + titles.join(', ') + '|' + grind;
    cart[key] = (cart[key] || 0) + 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    addBtn.textContent = 'Added!';
    addBtn.disabled = true;
    setTimeout(function () { update(); }, 1200);
  });

  update();
})();
</script>
