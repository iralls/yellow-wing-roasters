---
layout: default
title: The Aviary
permalink: /flights/the-aviary/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">The Aviary</h1>
</div>

<p class="roast-mv-tasting">A range of four blends, from bright and floral to dark and smoky</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-body">Four blends, each individually packaged in its own 8oz bag — a great way to explore the full range before committing to a full bag.</p>

<ul class="flight-includes">
  <li><a href="/roasts/early-bird/"><strong>Early Bird</strong></a> · City+ (light-medium)</li>
  <li><a href="/roasts/feather-soot/"><strong>Feather Soot</strong></a> · Vienna (dark)</li>
  <li><a href="/roasts/chimney-sweep/"><strong>Chimney Sweep</strong></a> · Full City (medium)</li>
  <li><a href="/roasts/lil-sipper/"><strong>Lil' Sipper</strong></a> · City+ (light-medium)</li>
</ul>

<p class="roast-mv-body">Brewing method varies by blend — details on each roast's page.</p>

<div class="roast-mv-divider"></div>

<div class="roast-mv-center" style="margin-bottom:1rem;">
  <div class="roast-mv-meta-label" style="margin-bottom:0.35rem;">Grind</div>
  <select id="aviary-grind-select" class="subscribe-select" style="min-width: 12rem;">
    <option value="Whole Bean" selected>Whole Bean</option>
    <option value="Drip / Filter">Drip / Filter</option>
    <option value="Espresso">Espresso</option>
    <option value="French Press">French Press</option>
    <option value="Pour Over">Pour Over</option>
    <option value="Cold Brew">Cold Brew</option>
  </select>
</div>

<div class="roast-mv-center" id="add-to-cart-wrap" style="text-align:center;">
  <button class="add-to-order-btn" id="aviary-add-btn">Add to Order — ${{ site.data.flights["the-aviary"].price }}</button>
</div>

</div>

<script>
(function () {
  var STORAGE_KEY = 'ywr_cart';
  var addBtn = document.getElementById('aviary-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var grindSelect = document.getElementById('aviary-grind-select');
      var grind = grindSelect ? grindSelect.value : 'Whole Bean';
      var cart;
      try { var raw = localStorage.getItem(STORAGE_KEY); cart = raw ? JSON.parse(raw) : {}; } catch (e) { cart = {}; }
      var key = 'the-aviary|||' + grind;
      cart[key] = (cart[key] || 0) + 1;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      addBtn.textContent = 'Added!';
      addBtn.disabled = true;
      setTimeout(function () {
        addBtn.textContent = 'Add to Order — ${{ site.data.flights["the-aviary"].price }}';
        addBtn.disabled = false;
      }, 1200);
    });
  }
})();
</script>
