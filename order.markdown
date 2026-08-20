---
layout: default
title: Order
permalink: /order/
---


# Order

<div id="order-cart-empty" class="order-empty" style="display:none;">
  <p>Your cart is empty.</p>
</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse" method="POST" class="order-form" id="order-form" style="display:none;">
  <input type="hidden" name="entry.1935997805" id="order-items-hidden" value="">
  <input type="hidden" name="entry.552044967" id="order-total-hidden" value="">

  <div class="order-cart-items" id="order-cart-items"></div>

  <div class="order-field">
    <label for="order-name">Name</label>
    <input id="order-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="order-email">Email</label>
    <input id="order-email" type="email" name="entry.40149380" autocomplete="email">
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
    <label class="order-radio order-radio--disabled"><input type="radio" name="entry.1896226742" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p class="order-delivery-note">Shipping coming soon.</p>
    <p id="order-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
  </fieldset>

  <div id="order-address-fields" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="order-address">Street address</label>
      <input id="order-address" type="text" name="entry.148046999" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="order-city">City</label>
      <input id="order-city" type="text" name="entry.1534670804" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="order-state">State</label>
        <input id="order-state" type="text" name="entry.414179858" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="order-zip">ZIP</label>
        <input id="order-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field" id="discount-code-section" style="margin-bottom: 1.5rem;">
    <label for="discount-code-input">Discount / Gift Code</label>
    <div style="display: flex; gap: 0.5rem; width: 100%;">
      <input id="discount-code-input" type="text" placeholder="Enter code" style="flex: 1; margin-bottom: 0;" autocomplete="off">
      <button id="apply-discount-btn" type="button" class="order-submit" style="margin: 0; width: auto; padding: 0 1.5rem; min-height: unset; height: 38px; border-radius: 4px; font-size: 0.9rem;">Apply</button>
    </div>
    <span id="discount-status" style="font-size: 0.85rem; font-weight: 500; display: block; margin-top: 0.35rem; min-height: 1.2rem;"></span>
  </div>

  <div class="order-field">
    <label for="order-notes">Notes (optional)</label>
    <textarea id="order-notes" name="entry.1381358427" rows="3"></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Place order</button>
    <button type="button" class="order-clear">Clear cart</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

{% assign roasts = site.roasts | sort: "order" %}

<script>
  (function () {
    var STORAGE_KEY = 'ywr_cart';
    var form = document.getElementById('order-form');
    var emptyEl = document.getElementById('order-cart-empty');
    var itemsEl = document.getElementById('order-cart-items');

    var roastData = [
      {% for r in roasts %}
        {% assign r_level_key = r.roast_level | append: "" %}{% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}{% if level_info %}{% assign r_dots = level_info.dots %}{% else %}{% assign r_dots = r.roast_dots | default: 0 %}{% endif %}
        {% if r.variants %}
          {% assign default_sizes = "12oz,1lb,2lb,5lb" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for v in r.variants %}
            {% for s in row_sizes %}
              {% assign pricing = site.data.pricing %}{% assign rp = pricing.overrides[r.slug] %}{% if rp and rp[s] %}{% assign unit_price = rp[s] %}{% else %}{% assign unit_price = pricing.default[s] %}{% endif %}
              { roast: {{ r.slug | jsonify }}, variant: {{ v.slug | jsonify }}, size: {{ s | jsonify }}, label: {{ r.title | append: " — " | append: v.name | jsonify }}, formName: {{ r.title | append: " (" | append: v.name | append: ") " | append: s | jsonify }}, mascot: {{ r.mascot_file | jsonify }}, dots: {{ r_dots }}, price: {{ unit_price | default: 0 }}, description: {{ r.description | default: "" | jsonify }} }{% unless forloop.last and forloop.parentloop.last %},{% endunless %}
            {% endfor %}
          {% endfor %}
        {% else %}
          {% assign default_sizes = "12oz,1lb,2lb,5lb" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for s in row_sizes %}
            {% assign pricing = site.data.pricing %}{% assign rp = pricing.overrides[r.slug] %}{% if r.temporary_price and r.temporary_price[s] %}{% assign unit_price = r.temporary_price[s] %}{% elsif rp and rp[s] %}{% assign unit_price = rp[s] %}{% else %}{% assign unit_price = pricing.default[s] %}{% endif %}
            { roast: {{ r.slug | jsonify }}, variant: "", size: {{ s | jsonify }}, label: {{ r.title | jsonify }}, formName: {{ r.title | append: " " | append: s | jsonify }}, mascot: {{ r.mascot_file | jsonify }}, dots: {{ r_dots }}, price: {{ unit_price | default: 0 }}, description: {{ r.description | default: "" | jsonify }} }{% unless forloop.last %},{% endunless %}
          {% endfor %}
        {% endif %}
        {% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    function loadCart() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) { return {}; }
    }

    function saveCart(c) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    function cartKey(roast, variant, size, grind) {
      return roast + '|' + (variant || '') + '|' + size + '|' + (grind || 'Whole Bean');
    }

    var appliedDiscount = null;

    function render() {
      var cart = loadCart();
      var items = [];

      for (var ck in cart) {
        if (cart[ck] <= 0) continue;
        var parts = ck.split('|');
        var rSlug = parts[0];
        var vSlug = parts[1] || '';
        var rSize = parts[2] || '';
        var rGrind = parts[3] || 'Whole Bean';

        var matchedData = null;
        for (var i = 0; i < roastData.length; i++) {
          var d = roastData[i];
          if (d.roast === rSlug && d.variant === vSlug && d.size === rSize) {
            matchedData = d;
            break;
          }
        }

        if (matchedData) {
          items.push({ data: matchedData, key: ck, qty: cart[ck], grind: rGrind });
        } else {
          var itemPrice = 0;
          var itemLabel = rSlug;
          var itemSize = rSize;
          var itemMascot = null;

          if (rSlug === 'peck-your-own') {
            var choicesCount = (rSize || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).length;
            var pyoPricePerBag = {{ site.data.flights["peck-your-own"].price_per_bag | default: 10 }};
            itemPrice = choicesCount * pyoPricePerBag;
            itemLabel = 'Peck Your Own: ' + rSize;
          } else if (rSlug === 'the-aviary') {
            itemPrice = {{ site.data.flights["the-aviary"].price | default: 38 }};
            itemLabel = 'The Aviary Flight';
            itemMascot = 'audubon-cage-transparent.png';
            if (!itemSize) itemSize = '4 × 8oz bags';
          }

          items.push({
            data: {
              roast: rSlug,
              variant: vSlug,
              size: itemSize,
              label: itemLabel,
              formName: rSlug === 'peck-your-own' ? 'Peck Your Own: ' + rSize : (rSlug === 'the-aviary' ? 'The Aviary Flight' : ck),
              mascot: itemMascot,
              dots: 0,
              price: itemPrice
            },
            key: ck,
            qty: cart[ck],
            grind: rGrind
          });
        }
      }

      if (items.length === 0) {
        form.style.display = 'none';
        emptyEl.style.display = '';
        return;
      }

      form.style.display = '';
      emptyEl.style.display = 'none';
      itemsEl.innerHTML = '';

      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var row = document.createElement('div');
        row.className = 'order-cart-row';

        if (item.data.mascot) {
          var birdImg = document.createElement('img');
          birdImg.src = '/images/' + item.data.mascot;
          birdImg.alt = '';
          birdImg.className = 'order-cart-bird';
          row.appendChild(birdImg);
        }

        var nameEl = document.createElement('div');
        nameEl.className = 'order-cart-item-name';
        nameEl.textContent = item.data.label;

        var dotsEl = null;
        if (item.data.dots > 0) {
          var dotsColors = ['#d4b896','#b8944a','#8a6830','#5c3d1a','#2c1e14'];
          dotsEl = document.createElement('span');
          dotsEl.className = 'order-cart-dots';
          for (var di = 0; di < 5; di++) {
            var dot = document.createElement('span');
            dot.className = 'order-cart-dot';
            dot.style.background = di < item.data.dots ? dotsColors[di] : '#e8e0d5';
            dotsEl.appendChild(dot);
          }
        }

        var sizeEl = document.createElement('span');
        sizeEl.className = 'order-cart-item-size';
        sizeEl.textContent = item.data.size + (item.grind ? ' · ' + item.grind : '');

        var qtyWrap = document.createElement('div');
        qtyWrap.className = 'order-cart-qty-wrap';

        var minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'order-cart-qty-btn';
        minus.textContent = '−';
        minus.setAttribute('aria-label', 'Decrease quantity');

        var qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '0';
        qtyInput.value = item.qty;
        qtyInput.className = 'order-cart-qty';
        qtyInput.setAttribute('data-key', item.key);
        qtyInput.inputMode = 'numeric';

        var plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'order-cart-qty-btn';
        plus.textContent = '+';
        plus.setAttribute('aria-label', 'Increase quantity');

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'order-cart-remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', 'Remove item');

        (function (input, k) {
          minus.addEventListener('click', function () {
            var n = Math.max(0, parseInt(input.value, 10) - 1);
            var c = loadCart();
            if (n <= 0) { delete c[k]; } else { c[k] = n; }
            saveCart(c);
            render();
          });
          plus.addEventListener('click', function () {
            var n = parseInt(input.value, 10) + 1;
            var c = loadCart();
            c[k] = n;
            saveCart(c);
            render();
          });
          input.addEventListener('change', function () {
            var n = parseInt(input.value, 10);
            if (isNaN(n) || n < 0) n = 0;
            var c = loadCart();
            if (n <= 0) { delete c[k]; } else { c[k] = n; }
            saveCart(c);
            render();
          });
          removeBtn.addEventListener('click', function () {
            var c = loadCart();
            delete c[k];
            saveCart(c);
            render();
          });
        })(qtyInput, item.key);

        qtyWrap.appendChild(minus);
        qtyWrap.appendChild(qtyInput);
        qtyWrap.appendChild(plus);

        var priceEl = document.createElement('div');
        priceEl.className = 'order-cart-item-price';
        var lineTotal = (item.data.price || 0) * item.qty;
        priceEl.textContent = '$' + lineTotal;

        row.appendChild(nameEl);
        if (dotsEl) row.appendChild(dotsEl);
        row.appendChild(sizeEl);
        row.appendChild(qtyWrap);
        row.appendChild(priceEl);
        row.appendChild(removeBtn);
        itemsEl.appendChild(row);
      }

      var subtotal = 0;
      for (var t = 0; t < items.length; t++) {
        subtotal += (items[t].data.price || 0) * items[t].qty;
      }

      var discountValue = 0;
      if (appliedDiscount) {
        if (appliedDiscount.type === 'percent') {
          discountValue = Math.round(subtotal * (appliedDiscount.value / 100) * 100) / 100;
        } else if (appliedDiscount.type === 'flat') {
          discountValue = Math.min(subtotal, appliedDiscount.value);
        }
      }

      var delivery = document.querySelector('input[name="entry.1896226742"]:checked');
      var shippingCost = (delivery && delivery.value === 'Ship to me' && subtotal < 40) ? 5 : 0;
      var grandTotal = Math.max(0, subtotal - discountValue) + shippingCost;

      if (discountValue > 0) {
        var discountRow = document.createElement('div');
        discountRow.className = 'order-cart-total';
        discountRow.style.borderTop = 'none';
        discountRow.style.paddingTop = '0.5rem';
        discountRow.style.color = '#5746e3';
        discountRow.innerHTML = '<span class="order-cart-total-label">Discount (' + appliedDiscount.code + ' &mdash; $' + appliedDiscount.value.toFixed(2) + ' available)</span><span class="order-cart-total-value">-$' + discountValue.toFixed(2) + '</span>';
        itemsEl.appendChild(discountRow);
      }

      if (shippingCost > 0) {
        var shippingRow = document.createElement('div');
        shippingRow.className = 'order-cart-shipping';
        shippingRow.innerHTML = '<span class="order-cart-total-label">Shipping</span><span class="order-cart-total-value">$' + shippingCost + '</span>';
        itemsEl.appendChild(shippingRow);
      }

      var totalRow = document.createElement('div');
      totalRow.className = 'order-cart-total';
      totalRow.innerHTML = '<span class="order-cart-total-label">Total</span><span class="order-cart-total-value">$' + grandTotal.toFixed(2) + '</span>';
      itemsEl.appendChild(totalRow);

      var itemLines = items.map(function (item) {
        return item.qty + 'x ' + item.data.label + ' ' + item.data.size + (item.grind ? ' (' + item.grind + ')' : '');
      }).join(', ');
      document.getElementById('order-items-hidden').value = itemLines;
      document.getElementById('order-total-hidden').value = '$' + grandTotal.toFixed(2);
    }

    var params = new URLSearchParams(window.location.search);
    var qpRoast = params.get('roast');
    var qpVariant = params.get('variant') || '';
    var qpSize = params.get('size') || '12oz';
    if (qpRoast) {
      var cart = loadCart();
      var k = cartKey(qpRoast, qpVariant, qpSize);
      cart[k] = (cart[k] || 0) + 1;
      saveCart(cart);
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    render();

    var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
    var addressFields = document.getElementById('order-address-fields');
    var deliveryNote = document.getElementById('order-delivery-note');
    for (var di = 0; di < deliveryRadios.length; di++) {
      deliveryRadios[di].addEventListener('change', function () {
        var v = this.value;
        addressFields.style.display = (v === 'Pickup') ? 'none' : '';
        deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
        render();
      });
    }

    // Apply Discount Button Click Handler
    var applyBtn = document.getElementById('apply-discount-btn');
    var discountInput = document.getElementById('discount-code-input');
    var discountStatus = document.getElementById('discount-status');

    applyBtn.addEventListener('click', function () {
      var code = discountInput.value.trim().toUpperCase();
      if (!code) {
        appliedDiscount = null;
        discountStatus.textContent = '';
        render();
        return;
      }

      discountStatus.textContent = 'Verifying...';
      discountStatus.style.color = '#666';

      var apiUrl = '{{ site.discount_codes_api_url }}';
      if (!apiUrl || apiUrl.trim() === "") {
        discountStatus.textContent = 'Discount service unavailable.';
        discountStatus.style.color = '#d32f2f';
        appliedDiscount = null;
        render();
        return;
      }

      var verifyUrl = apiUrl + '?code=' + encodeURIComponent(code);
      fetch(verifyUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.valid) {
            appliedDiscount = {
              code: code,
              type: data.type,
              value: parseFloat(data.value)
            };
            discountStatus.textContent = 'Code applied successfully! (Balance: $' + data.value.toFixed(2) + ')';
            discountStatus.style.color = '#2e7d32';
          } else {
            appliedDiscount = null;
            discountStatus.textContent = data.message || 'Invalid discount code.';
            discountStatus.style.color = '#d32f2f';
          }
          render();
        })
        .catch(function (err) {
          console.error('Validation fetch error:', err);
          discountStatus.textContent = 'Could not verify code. Please try again.';
          discountStatus.style.color = '#d32f2f';
          appliedDiscount = null;
          render();
        });
    });

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');

    var iframe = document.createElement('iframe');
    iframe.name = 'order-submit-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = 'order-submit-frame';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      // 1. Calculate discount details to append to Notes
      var userNotes = document.getElementById('order-notes').value.trim();
      var finalNotes = userNotes;

      var discountValue = 0;
      if (appliedDiscount) {
        var subtotal = 0;
        var cart = loadCart();
        for (var i = 0; i < roastData.length; i++) {
          var d = roastData[i];
          var k = cartKey(d.roast, d.variant, d.size);
          var qty = cart[k];
          if (qty && qty > 0) {
            subtotal += (d.price || 0) * qty;
          }
        }
        for (var ck in cart) {
          var parts = ck.split('|');
          if (parts[0] === 'peck-your-own' && cart[ck] > 0) {
            var choicesCount = parts[2].split(',').map(function (s) { return s.trim(); }).filter(Boolean).length;
            var pyoPricePerBag = {{ site.data.flights["peck-your-own"].price_per_bag | default: 10 }};
            subtotal += choicesCount * pyoPricePerBag * cart[ck];
          } else if (parts[0] === 'the-aviary' && cart[ck] > 0) {
            subtotal += {{ site.data.flights["the-aviary"].price | default: 38 }} * cart[ck];
          }
        }

        if (appliedDiscount.type === 'percent') {
          discountValue = Math.round(subtotal * (appliedDiscount.value / 100) * 100) / 100;
        } else if (appliedDiscount.type === 'flat') {
          discountValue = Math.min(subtotal, appliedDiscount.value);
        }

        var notesPrefix = '[DISCOUNT: ' + appliedDiscount.code + ' (-$' + discountValue.toFixed(2) + ')]';
        finalNotes = userNotes ? notesPrefix + ' | ' + userNotes : notesPrefix;
      }

      document.getElementById('order-notes').value = finalNotes;

      // 2. Dynamic gift card redemption lookup/subtraction
      var apiUrl = '{{ site.discount_codes_api_url }}';
      if (appliedDiscount && appliedDiscount.code.indexOf('GIFT-') === 0 && apiUrl && apiUrl.trim() !== "") {
        var redeemUrl = apiUrl + '?action=redeem&code=' + encodeURIComponent(appliedDiscount.code) + '&amount=' + encodeURIComponent(discountValue);
        
        fetch(redeemUrl)
          .then(function (response) { return response.json(); })
          .then(function (data) {
            proceedToSubmit();
          })
          .catch(function (err) {
            console.error('Failed to deduct gift card amount:', err);
            proceedToSubmit();
          });
      } else {
        proceedToSubmit();
      }
    });

    function proceedToSubmit() {
      iframe.onload = function () {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
        window.location.href = '{{ "/thanks/" | relative_url }}';
      };

      form.submit();
    }

    var clearBtn = form.querySelector('.order-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        saveCart({});
        render();
      });
    }
  })();
</script>
