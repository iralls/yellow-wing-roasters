---
layout: default
title: Subscribe
permalink: /subscribe/
---

<div class="roast-mv-divider"></div>

<h1 id="sub-title">Subscribe</h1>

<div id="sub-image-wrap" style="display: none; margin-bottom: 2rem;">
  <img id="sub-image" src="" alt="" style="max-height: 8rem; width: auto;">
</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="subscribe-form">
  <input type="hidden" name="entry.1935997805" id="sub-roast-hidden" value="">
  <input type="hidden" name="entry.903789519" id="sub-price-hidden" value="">
  <input type="hidden" name="entry.1261348961" value="Active">
  <input type="hidden" name="entry.1336119512" value="">

  <div class="order-field">
    <label for="sub-name">Name</label>
    <input id="sub-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="sub-email">Email</label>
    <input id="sub-email" type="email" name="entry.65766604" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="sub-size-select">Size</label>
    <select id="sub-size-select" name="entry.1606791078" class="subscribe-select" style="width: 100%;">
      <option value="12oz" selected>12oz</option>
      <option value="1lb">1lb</option>
      <option value="2lb">2lb</option>
      <option value="5lb">5lb</option>
    </select>
  </div>

  <div class="order-field">
    <label for="sub-grind-select">Grind</label>
    <select id="sub-grind-select" class="subscribe-select" style="width: 100%;">
      <option value="Whole Bean" selected>Whole Bean</option>
      <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
      <option value="Coarser — French Press">Coarser — French Press</option>
      <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
      <option value="Finer — Pour Over">Finer — Pour Over</option>
      <option value="Finest — Espresso">Finest — Espresso</option>
    </select>
  </div>

  <div class="order-field">
    <label for="sub-freq-select">Frequency</label>
    <select id="sub-freq-select" name="entry.2064801247" class="subscribe-select" style="width: 100%;">
      <option value="Every 2 weeks" selected>Every 2 weeks</option>
      <option value="Monthly">Monthly</option>
    </select>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
      <label class="order-radio order-radio--disabled"><input type="radio" name="entry.1896226742" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p id="sub-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
    <p class="order-delivery-note">Shipping coming soon.</p>
  </fieldset>

  <div id="sub-address-fields" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="sub-address">Street address</label>
      <input id="sub-address" type="text" name="entry.148046999" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="sub-city">City</label>
      <input id="sub-city" type="text" name="entry.1534670804" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="sub-state">State</label>
        <input id="sub-state" type="text" name="entry.414179858" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="sub-zip">ZIP</label>
        <input id="sub-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field">
    <label for="sub-notes">Notes (optional)</label>
    <textarea id="sub-notes" name="entry.1381358427" rows="3"></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Subscribe</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script src="{{ '/js/subscribe-form.js' | relative_url }}"></script>
<script>
(function () {
(function () {
  var form = document.getElementById('subscribe-form');
  var params = new URLSearchParams(window.location.search);
  var roast = params.get('roast') || '';
  var hiddenInput = document.getElementById('sub-roast-hidden');
  var priceHiddenInput = document.getElementById('sub-price-hidden');
  var title = document.getElementById('sub-title');

  {% assign default_sub_sizes = "12oz,1lb,2lb,5lb" | split: "," %}
  {% assign default_sub_freqs = "Every 2 weeks,Monthly" | split: "," %}
  var subConfig = {
    {% for r in site.roasts %}
      {% if r.subscription and r.subscription != false and r.subscription.available != false %}
        {% assign r_sub = r.subscription %}
        {% if r.sizes %}{% assign r_sizes = r.sizes %}{% else %}{% assign r_sizes = default_sub_sizes %}{% endif %}
        {% assign r_freqs = r_sub.frequencies | default: default_sub_freqs %}
        {% assign r_prices = r_sub.price | default: r_sub.prices | default: r.price %}
        '{{ r.slug }}': { sizes: {{ r_sizes | jsonify }}, frequencies: {{ r_freqs | jsonify }}, prices: {{ r_prices | jsonify }} },
      {% endif %}
    {% endfor %}
    {% for s in site.subscriptions %}
      {% if s.sizes %}{% assign s_sizes = s.sizes %}{% else %}{% assign s_sizes = "12oz" | split: "," %}{% endif %}
      {% if s.frequencies %}{% assign s_freqs = s.frequencies %}{% else %}{% assign s_freqs = "Monthly" | split: "," %}{% endif %}
      {% assign s_prices = s.price | default: s.prices %}
      '{{ s.slug }}': { sizes: {{ s_sizes | jsonify }}, frequencies: {{ s_freqs | jsonify }}, prices: {{ s_prices | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var roastDescriptions = {
    {% for r in site.roasts %}
    '{{ r.slug }}': {{ r.description | default: "" | jsonify }}{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var imageWrap = document.getElementById('sub-image-wrap');
  var imageEl = document.getElementById('sub-image');
  var mascotMap = {
    {% for r in site.roasts %}
    '{{ r.slug }}': '{{ "/images/" | append: r.mascot_file | relative_url }}',
    {% endfor %}
    {% for s in site.subscriptions %}
    '{{ s.slug }}': '{{ "/images/" | append: s.mascot_file | relative_url }}'{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };


  var disabledSubRoasts = {
    {% for r in site.roasts %}
    {% if r.status %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta.subscribable == false %}
    '{{ r.slug }}': {
      status: '{{ r.status }}',
      badge: '{{ r.status_badge | default: s_meta.badge }}',
      footnote: '{{ s_meta.sub_footnote | default: s_meta.footnote }}'
    },
      {% endif %}
    {% endif %}
    {% endfor %}
  };


  if (window.initSubscribeForm) {
    window.initSubscribeForm({
      subConfig: subConfig,
      mascotMap: mascotMap,
      disabledSubRoasts: disabledSubRoasts,
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
    });
  }
})();
</script>
