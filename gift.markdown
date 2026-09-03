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
  <h1 class="roast-mv-title" id="gift-page-title">Corvid care packages</h1>
</div>

<p class="roast-mv-tasting">Give the gift of freshly roasted coffee, delivered directly to their door.</p>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="gift-form">
  <!-- Dynamic Name Hidden Inputs -->
  <input type="hidden" id="gift-roast-hidden" value="">
  <input type="hidden" id="gift-price-hidden" value="">
  <input type="hidden" id="gift-status-hidden" value="Active">
  <input type="hidden" id="gift-frequency-hidden" value="Monthly">
  <input type="hidden" id="gift-delivery-hidden" value="Hand delivery">
  <input type="hidden" id="gift-notes-hidden" value="">
  <input type="hidden" id="gift-size-hidden" value="12oz">
  <input type="hidden" id="gift-card-amount-hidden" value="">
  <input type="hidden" id="gift-code-hidden" value="">

  <div class="order-field">
    <label>Gift Type</label>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="gift-type" value="direct" checked> Direct Coffee / Subscription</label>
      <label class="order-radio"><input type="radio" name="gift-type" value="code"> Digital Gift Card (Prepaid Code)</label>
    </div>
  </div>

  <!-- Direct Gifting Fields -->
  <div id="direct-gift-fields">
    <div class="order-field">
      <label for="gift-product">Select Coffee / Subscription</label>
      <select id="gift-product" class="subscribe-select" style="width: 100%;">
        <option value="" disabled selected>Choose a coffee...</option>
        <option disabled style="font-weight: bold; color: #2c1e14;">── Blends ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "blend" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled style="font-weight: bold; color: #2c1e14;">── Single Origins ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "single origin" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled style="font-weight: bold; color: #2c1e14;">── Seasonals ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "seasonal" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled style="font-weight: bold; color: #2c1e14;">── Subscriptions ──</option>
        <option value="migrator">Migrator</option>
        <option value="wingshot-collective">Wingshot Collective</option>
        <option value="fledglings">Fledglings</option>
        <option value="murmurations">Murmurations</option>
        <option value="runts-rations">Runt's Rations</option>
        <option value="rubber-duck-club">Rubber Duck Club</option>
      </select>
      <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; margin-bottom: 0;">* All physical gifts are packaged in our standard 12 oz bag size.</p>
    </div>

    <div class="order-field">
      <label>Gift Duration</label>
      <div class="pill-radios">
        <label class="order-radio"><input type="radio" name="gift-duration" value="One-time" checked> One-time</label>
        <label class="order-radio"><input type="radio" name="gift-duration" value="3 months"> 3 months</label>
        <label class="order-radio"><input type="radio" name="gift-duration" value="6 months"> 6 months</label>
      </div>
      <p id="gift-duration-note" style="font-size: 0.85rem; color: #666; margin-top: 0.35rem; display: none;">* Multi-month subscriptions are not available for this coffee.</p>
    </div>
  </div>

  <!-- Digital Gift Card Fields -->
  <div id="digital-gift-fields" style="display: none;">
    <div class="order-field">
      <label>Gift Card Value</label>
      <div class="pill-radios">
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="15"> $15</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="30"> $30</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="45" checked> $45</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="60"> $60</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="90"> $90</label>
      </div>
    </div>
  </div>

  <div style="border: 1px solid #e0d0c0; border-radius: 0.5rem; padding: 1.25rem; margin: 2rem 0; background-color: #faf8f5;">
    <h3 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.15rem; color: #2c1e14; border-bottom: 1px solid #e0d0c0; padding-bottom: 0.5rem;">Gift Details</h3>
    
    <div class="order-field">
      <label for="gift-purchaser-name">Your Name (Purchaser)</label>
      <input id="gift-purchaser-name" type="text" required autocomplete="name">
    </div>

    <div class="order-field">
      <label for="gift-purchaser-email">Your Email</label>
      <input id="gift-purchaser-email" type="email" required autocomplete="email">
    </div>

    <div class="order-field">
      <label for="gift-recipient-name">Recipient's Name</label>
      <input id="gift-recipient-name" type="text" required autocomplete="off">
    </div>

    <div class="order-field">
      <label id="gift-recipient-email-label" for="gift-recipient-email">Recipient's Email (optional)</label>
      <input id="gift-recipient-email" type="email" autocomplete="off">
    </div>

    <div class="order-field" style="margin-bottom: 0;">
      <label for="gift-message">Gift Message (optional)</label>
      <textarea id="gift-message" rows="3" placeholder="Write a note to the recipient..."></textarea>
    </div>
  </div>

  <!-- Direct Address Fields Container -->
  <div id="direct-address-container">
    <h3 style="font-size: 1.15rem; color: #2c1e14; margin-top: 2rem; margin-bottom: 1rem;">Recipient Delivery Address</h3>
    <div id="gift-address-fields" class="order-shipping">
      <div class="order-field">
        <label for="gift-address">Street address</label>
        <input id="gift-address" type="text" required autocomplete="street-address">
      </div>
      <div class="order-field">
        <label for="gift-city">City</label>
        <input id="gift-city" type="text" required autocomplete="address-level2">
      </div>
      <div class="order-field-row">
        <div class="order-field">
          <label for="gift-state">State</label>
          <input id="gift-state" type="text" required autocomplete="address-level1">
        </div>
        <div class="order-field">
          <label for="gift-zip">ZIP</label>
          <input id="gift-zip" type="text" required autocomplete="postal-code">
        </div>
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
    <button type="submit" class="order-submit">Order Corvid care packages</button>
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
    var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
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

  // Disable multi-month gift subscriptions for roasts where subscribable is false
  var disabledSubRoasts = {
    {% for r in site.roasts %}
    {% if r.status %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta.subscribable == false %}
    '{{ r.slug }}': true,
      {% endif %}
    {% endif %}
    {% endfor %}
  };

  function updateSubscriptionAvailability() {
    var product = productSelect.value;
    var isSubscribable = false;

    if (product) {
      var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
      if ((isSubscriptionOnly || (subConfig && subConfig[product])) && !disabledSubRoasts[product]) {
        isSubscribable = true;
      }
    } else {
      isSubscribable = true;
    }

    var durationRadios = form.querySelectorAll('input[name="gift-duration"]');
    durationRadios.forEach(function (radio) {
      if (radio.value !== 'One-time') {
        var label = radio.closest('.order-radio');
        if (!isSubscribable) {
          radio.disabled = true;
          if (label) label.classList.add('order-radio--disabled');
          if (radio.checked) {
            var oneTimeRadio = form.querySelector('input[name="gift-duration"][value="One-time"]');
            if (oneTimeRadio) oneTimeRadio.checked = true;
          }
        } else {
          radio.disabled = false;
          if (label) label.classList.remove('order-radio--disabled');
        }
      }
    });

    var noteEl = document.getElementById('gift-duration-note');
    if (noteEl) {
      noteEl.style.display = (!isSubscribable && product) ? 'block' : 'none';
    }
  }

  function updatePrice() {
    updateSubscriptionAvailability();
    var giftType = form.querySelector('input[name="gift-type"]:checked').value;
    if (giftType === 'code') {
      var activeAmountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amount = activeAmountRadio ? activeAmountRadio.value : '45';
      document.getElementById('gift-price-display').textContent = '$' + amount;
      document.getElementById('gift-price-summary').style.display = 'block';
      return;
    }

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

  // Pre-populate product if set in URL params (Direct only)
  var queryProduct = params.get('product') || params.get('roast');
  if (queryProduct) {
    productSelect.value = queryProduct;
    if (productSelect.value) {
      pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
    }
  }

  updatePrice();

  productSelect.addEventListener('change', function () {
    var selectedText = this.options[this.selectedIndex].text;
    pageTitle.textContent = 'Corvid care packages — ' + selectedText;
    updatePrice();
  });

  form.querySelectorAll('input[name="gift-duration"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  form.querySelectorAll('input[name="gift-card-amount"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  // Toggle Type Listeners
  form.querySelectorAll('input[name="gift-type"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var isDirect = this.value === 'direct';
      document.getElementById('direct-gift-fields').style.display = isDirect ? 'block' : 'none';
      document.getElementById('direct-address-container').style.display = isDirect ? 'block' : 'none';
      document.getElementById('digital-gift-fields').style.display = isDirect ? 'none' : 'block';

      // Required fields toggling
      document.getElementById('gift-product').required = isDirect;
      document.getElementById('gift-address').required = isDirect;
      document.getElementById('gift-city').required = isDirect;
      document.getElementById('gift-state').required = isDirect;
      document.getElementById('gift-zip').required = isDirect;

      var recEmail = document.getElementById('gift-recipient-email');
      var recEmailLabel = document.getElementById('gift-recipient-email-label');
      if (recEmail) recEmail.required = !isDirect;
      if (recEmailLabel) recEmailLabel.textContent = isDirect ? "Recipient's Email (optional)" : "Recipient's Email";

      // Reset titles & prices
      if (isDirect) {
        var product = productSelect.value;
        if (product && productSelect.selectedIndex >= 0) {
          pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
        } else {
          pageTitle.textContent = 'Corvid care packages';
        }
      } else {
        pageTitle.textContent = 'Corvid care packages';
      }

      updatePrice();
    });
  });
  var iframe = document.createElement('iframe');
  iframe.name = 'gift-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'gift-submit-frame';
  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var giftType = form.querySelector('input[name="gift-type"]:checked').value;

    var purchaserName = document.getElementById('gift-purchaser-name').value.trim();
    var purchaserEmail = document.getElementById('gift-purchaser-email').value.trim();
    var recipientName = document.getElementById('gift-recipient-name').value.trim();
    var recipientEmail = document.getElementById('gift-recipient-email').value.trim();
    var giftMessage = document.getElementById('gift-message').value.trim();
    var userNotes = document.getElementById('gift-notes').value.trim();

    if (giftType === 'direct') {
      var product = productSelect.value;
      if (!product) {
        alert('Please select a coffee/subscription product.');
        return;
      }

      var durationRadio = form.querySelector('input[name="gift-duration"]:checked');
      var duration = durationRadio ? durationRadio.value : 'One-time';

      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse';

      // Map Purchaser
      document.getElementById('gift-purchaser-name').name = 'entry.1153405702';
      document.getElementById('gift-purchaser-email').name = 'entry.65766604';

      // Map Shipping Address
      document.getElementById('gift-address').name = 'entry.148046999';
      document.getElementById('gift-city').name = 'entry.1534670804';
      document.getElementById('gift-state').name = 'entry.414179858';
      document.getElementById('gift-zip').name = 'entry.1472936948';

      // Map Hidden Fields
      var hiddenRoast = document.getElementById('gift-roast-hidden');
      hiddenRoast.name = 'entry.1935997805';
      hiddenRoast.value = product;

      var hiddenPrice = document.getElementById('gift-price-hidden');
      hiddenPrice.name = 'entry.903789519';
      var unitPrice = getUnitPrice(product, '12oz');
      var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);
      if (unitPrice) {
        hiddenPrice.value = '$' + (unitPrice * months);
      }

      var hiddenStatus = document.getElementById('gift-status-hidden');
      hiddenStatus.name = 'entry.1261348961';

      var hiddenFreq = document.getElementById('gift-frequency-hidden');
      hiddenFreq.name = 'entry.2064801247';

      var hiddenDeliv = document.getElementById('gift-delivery-hidden');
      hiddenDeliv.name = 'entry.1896226742';

      var hiddenSize = document.getElementById('gift-size-hidden');
      hiddenSize.name = 'entry.1606791078';

      // Map Notes Field (recipient details serialized)
      var hiddenNotes = document.getElementById('gift-notes-hidden');
      hiddenNotes.name = 'entry.1381358427';

      var giftPrefix = '[GIFT_PURCHASE] Recipient: ' + recipientName;
      if (recipientEmail) {
        giftPrefix += ' (' + recipientEmail + ')';
      }
      giftPrefix += ' | Duration: ' + duration;
      if (giftMessage) {
        giftPrefix += ' | Msg: ' + giftMessage;
      }

      hiddenNotes.value = userNotes ? giftPrefix + ' | Original Notes: ' + userNotes : giftPrefix;

      // Remove unused digital inputs names
      document.getElementById('gift-card-amount-hidden').removeAttribute('name');
      document.getElementById('gift-code-hidden').removeAttribute('name');
      document.getElementById('gift-recipient-name').removeAttribute('name');
      document.getElementById('gift-recipient-email').removeAttribute('name');
      document.getElementById('gift-message').removeAttribute('name');
      document.getElementById('gift-notes').removeAttribute('name');

      submitFormAndRedirect('{{ "/thanks/" | relative_url }}');

    } else {
      // Code Flow (Digital Gift Card)
      if (!purchaserName || !purchaserEmail || !recipientName || !recipientEmail) {
        alert('Please fill out all required fields.');
        return;
      }

      var amountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amountValue = amountRadio ? amountRadio.value : '45';
      var randomCode = 'GIFT-' + generateRandomString(8);

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      // Remove unused direct inputs names
      document.getElementById('gift-address').removeAttribute('name');
      document.getElementById('gift-city').removeAttribute('name');
      document.getElementById('gift-state').removeAttribute('name');
      document.getElementById('gift-zip').removeAttribute('name');
      document.getElementById('gift-roast-hidden').removeAttribute('name');
      document.getElementById('gift-price-hidden').removeAttribute('name');
      document.getElementById('gift-status-hidden').removeAttribute('name');
      document.getElementById('gift-frequency-hidden').removeAttribute('name');
      document.getElementById('gift-delivery-hidden').removeAttribute('name');
      document.getElementById('gift-size-hidden').removeAttribute('name');
      document.getElementById('gift-notes-hidden').removeAttribute('name');

      proceedToSubmitDigital(randomCode, amountValue);
    }
  });

  function proceedToSubmitDigital(giftCode, amount) {
    form.action = '{{ site.digital_gift_form_url }}';

    document.getElementById('gift-purchaser-name').name = '{{ site.digital_gift_entries.purchaser_name }}';
    document.getElementById('gift-purchaser-email').name = '{{ site.digital_gift_entries.purchaser_email }}';
    
    var amountHidden = document.getElementById('gift-card-amount-hidden');
    amountHidden.name = '{{ site.digital_gift_entries.amount }}';
    amountHidden.value = amount;

    var codeHidden = document.getElementById('gift-code-hidden');
    codeHidden.name = '{{ site.digital_gift_entries.gift_code }}';
    codeHidden.value = giftCode;

    document.getElementById('gift-recipient-name').name = '{{ site.digital_gift_entries.recipient_name }}';
    document.getElementById('gift-recipient-email').name = '{{ site.digital_gift_entries.recipient_email }}';
    document.getElementById('gift-message').name = '{{ site.digital_gift_entries.gift_message }}';
    document.getElementById('gift-notes').name = '{{ site.digital_gift_entries.notes }}';

    submitFormAndRedirect('{{ "/thanks/" | relative_url }}?code=' + encodeURIComponent(giftCode));
  }

  function submitFormAndRedirect(redirectUrl) {
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }

    iframe.onload = function () {
      window.location.href = redirectUrl;
    };

    form.submit();
  }

  function generateRandomString(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
})();
</script>
