---
layout: default
title: Order
permalink: /order/
---

<p class="logo-wrap"><a href="{{ '/' | relative_url }}" class="logo-link"><img src="/images/cup-logo-transparent.png" alt="Yellow Wing Roasters" class="logo"></a></p>

# Order

Pick your roasts and sizes. We'll email you back to confirm pricing, payment, and pickup or shipping.

<form action="https://formspree.io/f/mojraaql" method="POST" class="order-form">
  <input type="hidden" name="_subject" value="New Yellow Wing order">
  <input type="hidden" name="_next" value="{{ '/thanks/' | absolute_url }}">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="order-gotcha">

  <div class="order-field">
    <label for="order-name">Name</label>
    <input id="order-name" type="text" name="name" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="order-email">Email</label>
    <input id="order-email" type="email" name="email" required autocomplete="email">
  </div>

  <fieldset class="order-roasts">
    <legend>Roasts</legend>
    {% assign roasts = site.roasts | sort: "order" %}
    {% for r in roasts %}
      <div class="order-roast-row" data-roast="{{ r.slug }}">
        <div class="order-roast-name">{{ r.title }}</div>
        <div class="order-sizes">
          {% assign sizes = "6oz,8oz,12oz,16oz" | split: "," %}
          {% for s in sizes %}
            <label class="order-size">
              <span class="order-size-label">{{ s }}</span>
              <input type="number" name="{{ r.title }} {{ s }}" min="0" value="0" inputmode="numeric" data-roast="{{ r.slug }}" data-size="{{ s }}">
            </label>
          {% endfor %}
        </div>
      </div>
    {% endfor %}
  </fieldset>

  <div class="order-field">
    <label for="order-notes">Notes (optional)</label>
    <textarea id="order-notes" name="notes" rows="3"></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Place order</button>
    <button type="button" class="order-clear">Start over</button>
  </div>
</form>

<script>
  (function () {
    var STORAGE_KEY = 'ywr_cart';
    var form = document.querySelector('.order-form');
    if (!form) return;

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
    function key(roast, size) { return roast + '|' + size; }

    var cart = loadCart();

    var params = new URLSearchParams(window.location.search);
    var qpRoast = params.get('roast');
    var qpSize = params.get('size') || '12oz';
    var addedInput = null;
    if (qpRoast) {
      addedInput = form.querySelector(
        'input[data-roast="' + qpRoast + '"][data-size="' + qpSize + '"]'
      );
      if (addedInput) {
        cart[key(qpRoast, qpSize)] = (cart[key(qpRoast, qpSize)] || 0) + 1;
        saveCart(cart);
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    Array.prototype.forEach.call(
      form.querySelectorAll('input[data-roast][data-size]'),
      function (input) {
        var v = cart[key(input.dataset.roast, input.dataset.size)] || 0;
        input.value = v;
      }
    );

    form.addEventListener('input', function (e) {
      var t = e.target;
      if (!t.dataset || !t.dataset.roast || !t.dataset.size) return;
      var n = parseInt(t.value, 10);
      if (isNaN(n) || n < 0) n = 0;
      cart[key(t.dataset.roast, t.dataset.size)] = n;
      saveCart(cart);
    });

    form.addEventListener('submit', function () {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    });

    var clearBtn = form.querySelector('.order-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        cart = {};
        Array.prototype.forEach.call(
          form.querySelectorAll('input[data-roast][data-size]'),
          function (input) { input.value = 0; }
        );
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      });
    }

    if (addedInput) {
      var row = addedInput.closest('.order-roast-row');
      if (row) {
        row.classList.add('order-roast-highlight');
        setTimeout(function () { row.classList.remove('order-roast-highlight'); }, 2000);
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  })();
</script>
