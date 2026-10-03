---
layout: default
title: Subscribe
permalink: /subscribe/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center">
  <h1 id="sub-title" class="roast-mv-title">Subscribe</h1>
</div>

<div class="roast-mv-divider"></div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form order-form--checkout" id="subscribe-form">
  <input type="hidden" name="entry.1935997805" id="sub-roast-hidden" value="">
  <input type="hidden" name="entry.903789519" id="sub-price-hidden" value="">
  <input type="hidden" name="entry.1261348961" value="Active">
  <input type="hidden" name="entry.1336119512" value="">
  <input type="hidden" name="entry.1606791078" id="sub-size-hidden" value="">
  <input type="hidden" name="entry.2064801247" id="sub-freq-hidden" value="">
  <input type="hidden" id="sub-grind-hidden" value="">

  <div class="order-checkout-grid">
    <div class="order-checkout-main">
      <div class="order-field roast-mv-center" id="sub-roast-field" style="display: none;">
        <label for="sub-roast-select" class="roast-mv-meta-label">Coffee</label>
        <select id="sub-roast-select" class="subscribe-select">
          {% for s in site.subscriptions %}
            <option value="{{ s.slug }}">{{ s.title }} (Subscription)</option>
          {% endfor %}
          {% for r in site.roasts %}
            {% assign s_meta = site.data.statuses[r.status] %}
            {% if r.subscription and r.subscription != false and r.subscription.available != false and s_meta.subscribable != false %}
              <option value="{{ r.slug }}">{{ r.title }}</option>
            {% endif %}
          {% endfor %}
        </select>
      </div>

      <div class="order-field">
        <label for="sub-name" class="roast-mv-meta-label">Name</label>
        <input id="sub-name" type="text" name="entry.1153405702" required autocomplete="name">
      </div>

      <div class="order-field">
        <label for="sub-email" class="roast-mv-meta-label">Email</label>
        <input id="sub-email" type="email" name="entry.65766604" required autocomplete="email">
      </div>

      <div class="order-field">
        <label for="sub-phone" class="roast-mv-meta-label">Phone number (optional)</label>
        <input id="sub-phone" type="tel" name="entry.1484480937" autocomplete="tel" placeholder="123-456-7890" maxlength="12" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Please enter a 10-digit phone number (e.g. 123-456-7890)">
      </div>

      <fieldset class="order-delivery">
        <legend>Delivery method</legend>
        <div class="pill-radios">
          <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
          <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
        </div>
        <p id="sub-delivery-note" class="order-delivery-note">Please specify in the notes how you want to coordinate pickup.</p>
      </fieldset>

      <div id="sub-address-fields" class="order-shipping" style="display:none;">
        <div class="order-field">
          <label for="sub-address" class="roast-mv-meta-label">Street address</label>
          <input id="sub-address" type="text" name="entry.148046999" autocomplete="street-address">
        </div>
        <div class="order-field">
          <label for="sub-city" class="roast-mv-meta-label">City</label>
          <input id="sub-city" type="text" name="entry.1534670804" autocomplete="address-level2">
        </div>
        <div class="order-field-row">
          <div class="order-field">
            <label for="sub-state" class="roast-mv-meta-label">State</label>
            <select id="sub-state" name="entry.414179858" autocomplete="address-level1">
              {% include state-options.html %}
            </select>
          </div>
          <div class="order-field">
            <label for="sub-zip" class="roast-mv-meta-label">ZIP</label>
            <input id="sub-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
          </div>
        </div>
      </div>

      <div class="order-field">
        <label for="sub-notes" class="roast-mv-meta-label">Notes (optional)</label>
        <textarea id="sub-notes" name="entry.1381358427" rows="3"></textarea>
      </div>

      <div class="order-actions">
        <button type="submit" class="order-submit">Subscribe</button>
      </div>

      <p class="order-status" role="status" aria-live="polite"></p>
    </div>

    <div class="order-checkout-sidebar">
      <div class="order-summary-card">
        <div class="order-summary-header">
          <h2 class="order-summary-title">Subscription Summary</h2>
        </div>

        <div class="order-cart-items">
          <div class="order-cart-card">
            <div class="order-cart-card-thumb">
              <img id="sub-summary-thumb" src="" alt="" class="order-cart-card-img" style="display:none;">
              <span id="sub-summary-ph" class="order-cart-card-ph" aria-hidden="true" style="display:none;">☕</span>
            </div>
            <div class="order-cart-card-info">
              <div class="order-cart-card-title" id="sub-summary-roast-title"></div>
              <div class="order-cart-card-meta" id="sub-summary-meta"></div>
            </div>
            <div class="order-cart-card-actions">
              <div class="order-cart-card-total" id="sub-summary-price"></div>
            </div>
          </div>
        </div>

        <div class="order-cart-summary-totals">
          <div class="order-cart-summary-row">
            <span>Frequency</span>
            <span id="sub-summary-freq-row"></span>
          </div>
          <div class="order-cart-summary-row order-cart-summary-row--total">
            <span class="order-cart-total-label">Total per delivery</span>
            <span class="order-cart-total-value" id="sub-summary-total"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

</div>

<script src="{{ '/js/subscribe-form.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  {% assign default_sub_sizes = "12oz,1lb,2lb,5lb" | split: "," %}
  {% assign default_sub_freqs = "Every 2 weeks,Monthly" | split: "," %}
  var subConfig = {
    {% for r in site.roasts %}
      {% if r.subscription and r.subscription != false and r.subscription.available != false %}
        {% assign r_sub = r.subscription %}
        {% assign r_prices = r_sub.price | default: r.price %}
        {% if r.sizes %}
          {% assign r_sizes = r.sizes %}
        {% elsif r_prices %}
          {% assign r_sizes = "" | split: "," %}
          {% for entry in r_prices %}
            {% assign r_sizes = r_sizes | push: entry[0] %}
          {% endfor %}
        {% endif %}
        {% assign r_freqs = r_sub.frequencies | default: default_sub_freqs %}
        '{{ r.slug }}': { sizes: {{ r_sizes | jsonify }}, frequencies: {{ r_freqs | jsonify }}, prices: {{ r_prices | jsonify }} },
      {% endif %}
    {% endfor %}
    {% for s in site.subscriptions %}
      {% if s.sizes %}{% assign s_sizes = s.sizes %}{% else %}{% assign s_sizes = "12oz" | split: "," %}{% endif %}
      {% if s.frequencies %}{% assign s_freqs = s.frequencies %}{% else %}{% assign s_freqs = "Monthly" | split: "," %}{% endif %}
      {% assign s_prices = s.price %}
      '{{ s.slug }}': { sizes: {{ s_sizes | jsonify }}, frequencies: {{ s_freqs | jsonify }}, prices: {{ s_prices | jsonify }} },
      {% if s.slug == 'migrator' %}
      'the-migrator': { sizes: {{ s_sizes | jsonify }}, frequencies: {{ s_freqs | jsonify }}, prices: {{ s_prices | jsonify }} },
      {% endif %}
    {% endfor %}
  };

  var titleMap = {
    {% for r in site.roasts %}
    '{{ r.slug }}': {{ r.title | jsonify }},
    {% endfor %}
    {% for s in site.subscriptions %}
    '{{ s.slug }}': {{ s.title | jsonify }},
      {% if s.slug == 'migrator' %}
    'the-migrator': {{ s.title | jsonify }},
      {% endif %}
    {% endfor %}
  };

  var descriptionMap = {
    {% for r in site.roasts %}
      {% assign r_desc = r.description | default: r.subtitle | default: r.descriptor | strip_html | normalize_whitespace | strip %}
      {% if r_desc != empty %}
    '{{ r.slug }}': {{ r_desc | jsonify }},
      {% endif %}
    {% endfor %}
    {% for s in site.subscriptions %}
      {% assign s_desc = s.description | default: s.content | strip_html | normalize_whitespace | strip %}
      {% if s_desc != empty %}
    '{{ s.slug }}': {{ s_desc | jsonify }},
        {% if s.slug == 'migrator' %}
    'the-migrator': {{ s_desc | jsonify }},
        {% endif %}
      {% endif %}
    {% endfor %}
  };

  var mascotMap = {
    {% for r in site.roasts %}
      {% if r.mascot_file %}
    '{{ r.slug }}': '{{ "/images/" | append: r.mascot_file | relative_url }}',
      {% endif %}
    {% endfor %}
    {% for s in site.subscriptions %}
      {% if s.mascot_file %}
    '{{ s.slug }}': '{{ "/images/" | append: s.mascot_file | relative_url }}',
        {% if s.slug == 'migrator' %}
    'the-migrator': '{{ "/images/" | append: s.mascot_file | relative_url }}',
        {% endif %}
      {% endif %}
    {% endfor %}
  };

  var disabledSubRoasts = {
    {% for r in site.roasts %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta and s_meta.subscribable == false %}
    '{{ r.slug }}': {
      status: '{{ r.status }}',
      badge: '{{ s_meta.badge }}',
      footnote: '{{ s_meta.sub_footnote | default: s_meta.footnote }}'
    },
      {% elsif r.subscription == nil or r.subscription == false %}
    '{{ r.slug }}': {
      status: 'not_subscribable',
      badge: 'Unavailable',
      footnote: 'Subscriptions are not available for this roast.'
    },
      {% endif %}
    {% endfor %}
  };

  initSubscribeForm({
    subConfig: subConfig,
    titleMap: titleMap,
    descriptionMap: descriptionMap,
    mascotMap: mascotMap,
    disabledSubRoasts: disabledSubRoasts,
    thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
  });
})();
</script>
