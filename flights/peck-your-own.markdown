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

<p class="roast-mv-tasting">Pick any four of our available roasts — each one comes as an 8oz bag.</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-center" id="pyo-count" style="font-weight:600; margin-bottom:0.5rem;">Select 4 roasts:</p>

<div class="roasts-grid" id="pyo-picker">
  {% assign roasts = site.roasts | sort: "order" %}
  {% for r in roasts %}
    {% unless r.coming_soon or r.category == "ugly duckling" or r.category == "pack" %}
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
  <button class="add-to-order-btn add-to-order-btn--disabled" id="pyo-add" disabled>Select 4 roasts — ${{ site.data.flights["peck-your-own"].price }}</button>
</div>

</div>

<script>
(function () {
  var STORAGE_KEY = 'ywr_cart';
  var selected = [];
  var options = document.querySelectorAll('.pyo-option');
  var addBtn = document.getElementById('pyo-add');
  var countEl = document.getElementById('pyo-count');

  function update() {
    var remaining = 4 - selected.length;
    if (remaining > 0) {
      countEl.textContent = 'Select ' + remaining + ' more roast' + (remaining === 1 ? '' : 's') + ':';
      addBtn.textContent = 'Select ' + remaining + ' more — ${{ site.data.flights["peck-your-own"].price }}';
      addBtn.disabled = true;
      addBtn.classList.add('add-to-order-btn--disabled');
    } else {
      countEl.textContent = 'Your picks:';
      addBtn.textContent = 'Add to order — ${{ site.data.flights["peck-your-own"].price }}';
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
      } else if (selected.length < 4) {
        selected.push(slug);
      }
      update();
    });
  }

  addBtn.addEventListener('click', function () {
    if (selected.length !== 4) return;
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
    try { var raw = sessionStorage.getItem(STORAGE_KEY); cart = raw ? JSON.parse(raw) : {}; } catch (e) { cart = {}; }
    var key = 'peck-your-own||' + titles.join(', ');
    cart[key] = (cart[key] || 0) + 1;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    addBtn.textContent = 'Added!';
    addBtn.disabled = true;
    setTimeout(function () { update(); }, 1200);
  });

  update();
})();
</script>
