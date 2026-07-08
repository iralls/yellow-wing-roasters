---
layout: default
title: Order
permalink: /order/
---


# Order

<div id="order-cart-empty" class="order-empty" style="display:none;">
  <p>Your cart is empty.</p>
  <a href="{{ '/roasts/' | relative_url }}" class="order-browse-link">Browse our roasts &rarr;</a>
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
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup (we'll coordinate)</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Ship to me"> Ship to me <span class="order-delivery-note" style="display:inline; font-style:italic;">— free on orders over $40</span></label>
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
        {% if r.variants %}
          {% assign default_sizes = "12oz,2lb,5lb" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for v in r.variants %}
            {% for s in row_sizes %}
              {% assign pricing = site.data.pricing %}{% assign rp = pricing.overrides[r.slug] %}{% if rp and rp[s] %}{% assign unit_price = rp[s] %}{% else %}{% assign unit_price = pricing.default[s] %}{% endif %}
              { roast: {{ r.slug | jsonify }}, variant: {{ v.slug | jsonify }}, size: {{ s | jsonify }}, label: {{ r.title | append: " — " | append: v.name | jsonify }}, formName: {{ r.title | append: " (" | append: v.name | append: ") " | append: s | jsonify }}, mascot: {{ r.mascot_file | jsonify }}, dots: {{ r.roast_dots | default: 0 }}, price: {{ unit_price | default: 0 }} }{% unless forloop.last and forloop.parentloop.last %},{% endunless %}
            {% endfor %}
          {% endfor %}
        {% else %}
          {% assign default_sizes = "12oz,2lb,5lb" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for s in row_sizes %}
            {% assign pricing = site.data.pricing %}{% assign rp = pricing.overrides[r.slug] %}{% if rp and rp[s] %}{% assign unit_price = rp[s] %}{% else %}{% assign unit_price = pricing.default[s] %}{% endif %}
            { roast: {{ r.slug | jsonify }}, variant: "", size: {{ s | jsonify }}, label: {{ r.title | jsonify }}, formName: {{ r.title | append: " " | append: s | jsonify }}, mascot: {{ r.mascot_file | jsonify }}, dots: {{ r.roast_dots | default: 0 }}, price: {{ unit_price | default: 0 }} }{% unless forloop.last %},{% endunless %}
          {% endfor %}
        {% endif %}
        {% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    function loadCart() {
      try {
        var raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) { return {}; }
    }

    function saveCart(c) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    function cartKey(roast, variant, size) {
      return roast + '|' + (variant || '') + '|' + size;
    }

    function render() {
      var cart = loadCart();
      var items = [];

      for (var i = 0; i < roastData.length; i++) {
        var d = roastData[i];
        var k = cartKey(d.roast, d.variant, d.size);
        var qty = cart[k];
        if (qty && qty > 0) {
          items.push({ data: d, key: k, qty: qty });
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
        sizeEl.textContent = item.data.size;

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

        row.appendChild(nameEl);
        if (dotsEl) row.appendChild(dotsEl);
        row.appendChild(sizeEl);
        row.appendChild(qtyWrap);
        row.appendChild(removeBtn);
        itemsEl.appendChild(row);
      }

      var itemLines = items.map(function (item) {
        return item.qty + 'x ' + item.data.label + ' ' + item.data.size;
      }).join(', ');
      document.getElementById('order-items-hidden').value = itemLines;
      document.getElementById('order-total-hidden').value = '';
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

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');

    var iframe = document.createElement('iframe');
    iframe.name = 'order-submit-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = 'order-submit-frame';

    form.addEventListener('submit', function () {
      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(function () {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
        window.location.href = '{{ "/thanks/" | relative_url }}';
      }, 1000);
    });

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
