---
layout: default
title: Order
permalink: /order/
---

<div class="logo-wrap"><a href="{{ '/' | relative_url }}" class="logo-link"><img src="/images/dark-roast-icon.png" alt="Yellow Wing Roasters" class="logo logo--icon"></a><div style="font-family:'Montserrat',sans-serif; font-weight:900; font-size:1rem; color:#E99E00; letter-spacing:0.1em; text-transform:uppercase;">Yellow Wing</div><div style="font-family:'Montserrat',sans-serif; font-weight:500; font-size:0.5rem; color:#0D0F1F; letter-spacing:0.25em; text-transform:uppercase;">Roasters</div></div>

# Order

<div id="order-cart-empty" class="order-empty" style="display:none;">
  <p>Your cart is empty.</p>
  <a href="{{ '/roasts/' | relative_url }}" class="order-browse-link">Browse our roasts &rarr;</a>
</div>

<form action="https://formspree.io/f/mojraaql" method="POST" class="order-form" id="order-form" style="display:none;">
  <input type="hidden" name="_subject" value="New Yellow Wing order">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="order-gotcha">

  <div class="order-cart-items" id="order-cart-items"></div>

  <div class="order-field">
    <label for="order-name">Name</label>
    <input id="order-name" type="text" name="name" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="order-email">Email</label>
    <input id="order-email" type="email" name="email" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="order-notes">Notes (optional)</label>
    <textarea id="order-notes" name="notes" rows="3"></textarea>
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
          {% assign default_sizes = "6oz,8oz,12oz,16oz" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for v in r.variants %}
            {% for s in row_sizes %}
              { roast: {{ r.slug | jsonify }}, variant: {{ v.slug | jsonify }}, size: {{ s | jsonify }}, label: {{ r.title | append: " — " | append: v.name | jsonify }}, formName: {{ r.title | append: " (" | append: v.name | append: ") " | append: s | jsonify }} }{% unless forloop.last and forloop.parentloop.last %},{% endunless %}
            {% endfor %}
          {% endfor %}
        {% else %}
          {% assign default_sizes = "6oz,8oz,12oz,16oz" | split: "," %}
          {% if r.sizes %}{% assign row_sizes = r.sizes %}{% else %}{% assign row_sizes = default_sizes %}{% endif %}
          {% for s in row_sizes %}
            { roast: {{ r.slug | jsonify }}, variant: "", size: {{ s | jsonify }}, label: {{ r.title | jsonify }}, formName: {{ r.title | append: " " | append: s | jsonify }} }{% unless forloop.last %},{% endunless %}
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

        var nameEl = document.createElement('div');
        nameEl.className = 'order-cart-item-name';
        nameEl.textContent = item.data.label;

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
        qtyInput.name = item.data.formName;
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
        row.appendChild(sizeEl);
        row.appendChild(qtyWrap);
        row.appendChild(removeBtn);
        itemsEl.appendChild(row);
      }
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

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, body: body }; });
      }).then(function (result) {
        if (result.ok) {
          try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
          window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
          window.location.href = '{{ "/thanks/" | relative_url }}';
        } else {
          var msg = 'Something went wrong. Please try again or email hello@yellowwingroasters.com.';
          if (result.body && result.body.errors && result.body.errors.length) {
            msg = result.body.errors.map(function (er) { return er.message; }).join(' ');
          }
          if (status) {
            status.textContent = msg;
            status.className = 'order-status order-status-error';
          }
          if (submitBtn) submitBtn.disabled = false;
        }
      }).catch(function () {
        if (status) {
          status.textContent = 'Network error. Check your connection and try again.';
          status.className = 'order-status order-status-error';
        }
        if (submitBtn) submitBtn.disabled = false;
      });
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
