---
layout: default
title: Peck Your Own
permalink: /flights/peck-your-own/
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

<p class="roast-mv-tasting">Pick at least {{ site.data.flights["peck-your-own"].min_bags }} of our available roasts — each one comes as an 8oz bag.</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-center" id="pyo-count" style="font-weight:600; margin-bottom:0.5rem;">Select at least {{ site.data.flights["peck-your-own"].min_bags }} roasts:</p>

<div class="roasts-grid" id="pyo-picker">
  {% assign roasts = site.roasts | sort: "order" %}
  {% for r in roasts %}
    {% unless r.coming_soon %}
  <div class="roasts-entry pyo-option" data-slug="{{ r.slug }}" data-title="{{ r.title }}">
    <div class="roasts-entry-visual">
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">{{ r.title }}</div>
      {% if r.tasting_notes %}<div class="roasts-entry-notes">{{ r.tasting_notes | replace: ", ", " · " }}</div>{% endif %}
    </div>
  </div>
    {% endunless %}
  {% endfor %}
</div>

<div class="roast-mv-center" style="margin-top:1rem;">
  {% assign default_min = site.data.flights["peck-your-own"].min_bags %}
  {% assign default_price = default_min | times: site.data.flights["peck-your-own"].price_per_bag %}
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

  var pricePerBag = {{ site.data.flights["peck-your-own"].price_per_bag | default: 10 }};
  var minBags = {{ site.data.flights["peck-your-own"].min_bags | default: 4 }};

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
      options[i].style.outline = isSelected ? '2px solid #2c1e14' : '';
      options[i].style.background = isSelected ? '#fff' : '';
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
    var cart;
    try { var raw = localStorage.getItem(STORAGE_KEY); cart = raw ? JSON.parse(raw) : {}; } catch (e) { cart = {}; }
    var key = 'peck-your-own||' + titles.join(', ');
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
