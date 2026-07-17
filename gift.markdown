---
layout: default
title: Gift Coffee
permalink: /gift/
---

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-raven-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title" id="gift-page-title">Corvid Care package</h1>
</div>

<p class="roast-mv-tasting">Give the gift of freshly roasted coffee, delivered directly to their door.</p>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="gift-form">
  <input type="hidden" name="entry.1935997805" id="gift-roast-hidden" value="">
  <input type="hidden" name="entry.903789519" id="gift-price-hidden" value="">
  <input type="hidden" name="entry.1261348961" value="Active">
  <input type="hidden" name="entry.2064801247" value="Monthly">
  <input type="hidden" name="entry.1896226742" value="Hand delivery">
  <input type="hidden" name="entry.1381358427" id="gift-notes-hidden" value="">

  <div class="order-field">
    <label for="gift-product">Select Coffee / Subscription</label>
    <select id="gift-product" class="subscribe-select" required style="width: 100%;">
      <option value="" disabled selected>Choose a coffee...</option>
      <option disabled style="font-weight: bold; color: #2c1e14;">── Blends ──</option>
      {% for roast in site.roasts %}
        {% unless roast.coming_soon %}
          {% if roast.category == "blend" %}
            <option value="{{ roast.slug }}">{{ roast.title }}</option>
          {% endif %}
        {% endunless %}
      {% endfor %}

      <option disabled style="font-weight: bold; color: #2c1e14;">── Single Origins ──</option>
      {% for roast in site.roasts %}
        {% unless roast.coming_soon %}
          {% if roast.category == "single origin" %}
            <option value="{{ roast.slug }}">{{ roast.title }}</option>
          {% endif %}
        {% endunless %}
      {% endfor %}

      <option disabled style="font-weight: bold; color: #2c1e14;">── Seasonals ──</option>
      {% for roast in site.roasts %}
        {% unless roast.coming_soon %}
          {% if roast.category == "seasonal" %}
            <option value="{{ roast.slug }}">{{ roast.title }}</option>
          {% endif %}
        {% endunless %}
      {% endfor %}

      <option disabled style="font-weight: bold; color: #2c1e14;">── Subscriptions ──</option>
      <option value="migrator">Migrator</option>
      <option value="wingshot-collective">Wingshot Collective</option>
      <option value="fledglings">Fledglings</option>
      <option value="murmurations">Murmurations</option>
      <option value="ugly-ducklings">Ugly Ducklings</option>
    </select>
    <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; margin-bottom: 0;">* All gifts are packaged in our standard 12 oz bag size.</p>
  </div>

  <div class="order-field">
    <label>Gift Duration</label>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="gift-duration" value="One-time" checked> One-time</label>
      <label class="order-radio"><input type="radio" name="gift-duration" value="3 months"> 3 months</label>
      <label class="order-radio"><input type="radio" name="gift-duration" value="6 months"> 6 months</label>
    </div>
  </div>

  <input type="hidden" name="entry.1606791078" value="12oz">

  <div style="border: 1px solid #e0d0c0; border-radius: 0.5rem; padding: 1.25rem; margin: 2rem 0; background-color: #faf8f5;">
    <h3 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.15rem; color: #2c1e14; border-bottom: 1px solid #e0d0c0; padding-bottom: 0.5rem;">Gift Details</h3>
    
    <div class="order-field">
      <label for="gift-purchaser-name">Your Name (Purchaser)</label>
      <input id="gift-purchaser-name" type="text" name="entry.1153405702" required autocomplete="name">
    </div>

    <div class="order-field">
      <label for="gift-purchaser-email">Your Email</label>
      <input id="gift-purchaser-email" type="email" name="entry.65766604" required autocomplete="email">
    </div>

    <div class="order-field">
      <label for="gift-recipient-name">Recipient's Name</label>
      <input id="gift-recipient-name" type="text" required autocomplete="off">
    </div>

    <div class="order-field">
      <label for="gift-recipient-email">Recipient's Email (optional)</label>
      <input id="gift-recipient-email" type="email" autocomplete="off">
    </div>

    <div class="order-field" style="margin-bottom: 0;">
      <label for="gift-message">Gift Message (optional)</label>
      <textarea id="gift-message" rows="3" placeholder="Write a note to the recipient..."></textarea>
    </div>
  </div>

  <h3 style="font-size: 1.15rem; color: #2c1e14; margin-top: 2rem; margin-bottom: 1rem;">Recipient Delivery Address</h3>
  <div id="gift-address-fields" class="order-shipping">
    <div class="order-field">
      <label for="gift-address">Street address</label>
      <input id="gift-address" type="text" name="entry.148046999" required autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="gift-city">City</label>
      <input id="gift-city" type="text" name="entry.1534670804" required autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="gift-state">State</label>
        <input id="gift-state" type="text" name="entry.414179858" required autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="gift-zip">ZIP</label>
        <input id="gift-zip" type="text" name="entry.1472936948" required autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field" style="margin-top: 1.5rem;">
    <label for="gift-notes">Additional Delivery Notes (optional)</label>
    <textarea id="gift-notes" rows="3" placeholder="Any delivery instructions..."></textarea>
  </div>

  <div id="gift-price-summary" style="font-size: 1.25rem; font-weight: 700; color: #2c1e14; margin: 1.5rem 0; padding: 1rem; background-color: #faf8f5; border: 1px solid #e0d0c0; border-radius: 0.5rem; text-align: center;">
    Total: <span id="gift-price-display">$0</span>
  </div>

  <div class="order-actions" style="margin-top: 2rem;">
    <button type="submit" class="order-submit">Order Corvid Care Package</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script>
(function () {
  var form = document.getElementById('gift-form');
  var params = new URLSearchParams(window.location.search);
  var productSelect = document.getElementById('gift-product');
  var pageTitle = document.getElementById('gift-page-title');

  var hiddenRoastInput = document.getElementById('gift-roast-hidden');
  var hiddenPriceInput = document.getElementById('gift-price-hidden');
  var hiddenNotesInput = document.getElementById('gift-notes-hidden');

  var subConfig = {
    {% for entry in site.data.subscriptions %}
    '{{ entry[0] }}': { sizes: {{ entry[1].sizes | jsonify }}, prices: {{ entry[1].prices | default: "" | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var regularPricing = {
    default: {{ site.data.pricing.default | jsonify }},
    overrides: {{ site.data.pricing.overrides | jsonify }}
  };

  function getUnitPrice(product, size) {
    var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'ugly-ducklings'].indexOf(product) >= 0;
    if (isSubscriptionOnly) {
      var config = subConfig[product];
      return (config && config.prices && config.prices[size]) ? config.prices[size] : null;
    } else {
      var pricing = regularPricing;
      var roastPrices = pricing.overrides[product];
      if (roastPrices && roastPrices[size]) {
        return roastPrices[size];
      }
      return pricing.default[size] || null;
    }
  }

  function updatePrice() {
    var product = productSelect.value;
    if (!product) {
      document.getElementById('gift-price-summary').style.display = 'none';
      return;
    }

    var duration = form.querySelector('input[name="gift-duration"]:checked').value;
    var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);

    var unitPrice = getUnitPrice(product, '12oz');
    if (unitPrice) {
      var totalVal = unitPrice * months;
      var displayStr = '$' + totalVal + ' total';
      if (duration !== 'One-time') {
        displayStr += ' ($' + unitPrice + '/mo)';
      }
      document.getElementById('gift-price-display').textContent = displayStr;
      document.getElementById('gift-price-summary').style.display = 'block';
    } else {
      document.getElementById('gift-price-summary').style.display = 'none';
    }
  }

  // Pre-populate product if set in URL params
  var queryProduct = params.get('product') || params.get('roast');
  if (queryProduct) {
    productSelect.value = queryProduct;
    if (productSelect.value) {
      pageTitle.textContent = 'Corvid Care package — ' + productSelect.options[productSelect.selectedIndex].text;
    }
  }

  updatePrice();

  productSelect.addEventListener('change', function () {
    var selectedText = this.options[this.selectedIndex].text;
    pageTitle.textContent = 'Corvid Care package — ' + selectedText;
    updatePrice();
  });

  form.querySelectorAll('input[name="gift-duration"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  var iframe = document.createElement('iframe');
  iframe.name = 'gift-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'gift-submit-frame';

  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  form.addEventListener('submit', function (e) {
    var product = productSelect.value;
    
    if (!product) {
      e.preventDefault();
      alert('Please select a coffee/subscription product.');
      return;
    }

    // Set hidden product slug
    hiddenRoastInput.value = product;

    // Set hidden total price
    var unitPrice = getUnitPrice(product, '12oz');
    var duration = form.querySelector('input[name="gift-duration"]:checked').value;
    var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);
    if (unitPrice) {
      hiddenPriceInput.value = '$' + (unitPrice * months);
    }

    // Package serialized gift info inside Notes
    var recipientName = document.getElementById('gift-recipient-name').value.trim();
    var recipientEmail = document.getElementById('gift-recipient-email').value.trim();
    var giftMessage = document.getElementById('gift-message').value.trim();
    var userNotes = document.getElementById('gift-notes').value.trim();

    var giftPrefix = '[GIFT_PURCHASE] Recipient: ' + recipientName;
    if (recipientEmail) {
      giftPrefix += ' (' + recipientEmail + ')';
    }
    giftPrefix += ' | Duration: ' + duration;
    if (giftMessage) {
      giftPrefix += ' | Msg: ' + giftMessage;
    }

    hiddenNotesInput.value = userNotes ? giftPrefix + ' | Original Notes: ' + userNotes : giftPrefix;

    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }
    if (submitBtn) submitBtn.disabled = true;

    iframe.onload = function () {
      window.location.href = '{{ "/thanks/" | relative_url }}';
    };
  });
})();
</script>
