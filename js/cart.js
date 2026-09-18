/**
 * Yellow Wing Roasters - Shared Cart Component
 * Handles cart indicator, floating bag, count pill, and flyout drawer.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initYWRCart = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initYWRCart(config) {
    if (!config) return;

    var defaultPrices = config.defaultPrices || { '12oz': 12, '1lb': 14, '2lb': 28, '5lb': 70 };
    var flightAviaryPrice = config.flightAviaryPrice || 38;
    var flightPyoPrice = config.flightPyoPrice || 10;
    var ROASTS_URL = config.ROASTS_URL || '/roasts/';
    var ORDER_URL = config.ORDER_URL || '/order/';
    var IMAGES_BASE = config.IMAGES_BASE || '/images/';
    var roastsData = config.roastsData || {};

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getMascotUrl(filename) {
      if (!filename) return null;
      var clean = String(filename).replace(/^\/?(images\/)?/, '');
      return IMAGES_BASE + clean;
    }

    function getCart() {
      try {
        var raw = localStorage.getItem('ywr_cart');
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function parseCartItem(ck, qty) {
      var parts = ck.split('|');
      var rSlug = parts[0] || '';
      var vSlug = parts[1] || '';
      var rSize = parts[2] || '';
      var rGrind = parts[3] || 'Whole Bean';

      var title = '';
      var meta = '';
      var mascot = null;
      var unitPrice = 0;

      if (rSlug === 'the-aviary') {
        title = 'The Aviary Flight';
        meta = '4 × 8oz' + (rGrind ? ' · ' + rGrind : '');
        mascot = 'audubon-cage-transparent.png';
        unitPrice = flightAviaryPrice;
      } else if (rSlug === 'peck-your-own') {
        title = 'Peck Your Own';
        var count = (rSize || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).length;
        meta = (count > 0 ? count + ' × 8oz bags' : 'Sampler flight') + (rGrind ? ' · ' + rGrind : '');
        mascot = 'audubon-cardinal-transparent.png';
        unitPrice = (count || 4) * flightPyoPrice;
      } else if (roastsData[rSlug]) {
        var r = roastsData[rSlug];
        title = r.title;
        if (vSlug && r.variants && r.variants[vSlug]) {
          title += ' — ' + r.variants[vSlug];
        }
        meta = (rSize ? rSize : '12oz') + (rGrind ? ' · ' + rGrind : '');
        mascot = r.mascot;
        var sizeKey = rSize || '12oz';
        unitPrice = (r.prices && r.prices[sizeKey]) || defaultPrices[sizeKey] || 12;
      } else {
        title = rSlug.replace(/-/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
        meta = (rSize ? rSize : '') + (rGrind ? ' · ' + rGrind : '');
        var sKey = rSize || '12oz';
        unitPrice = defaultPrices[sKey] || 12;
      }

      return {
        key: ck,
        title: title,
        meta: meta,
        mascot: mascot,
        unitPrice: unitPrice,
        qty: qty,
        lineTotal: unitPrice * qty
      };
    }

    function update() {
      var indicator = document.getElementById('ywr-cart-indicator');
      var el = document.getElementById('ywr-cart-count');
      var dropdown = document.getElementById('ywr-cart-dropdown');
      if (!indicator || !el || !dropdown) return;

      var cart = getCart();
      var total = 0;
      var items = [];
      var subtotal = 0;

      for (var k in cart) {
        if (Object.prototype.hasOwnProperty.call(cart, k)) {
          var n = parseInt(cart[k], 10);
          if (!isNaN(n) && n > 0) {
            total += n;
            var item = parseCartItem(k, n);
            items.push(item);
            subtotal += item.lineTotal;
          }
        }
      }

      el.textContent = total;
      indicator.classList.toggle('cart-indicator-empty', total === 0);

      if (items.length === 0) {
        dropdown.innerHTML =
          '<div class="cart-dropdown-empty">' +
            '<p class="cart-dropdown-empty-msg">Your cart is empty</p>' +
            '<a href="' + escapeHtml(ROASTS_URL) + '" class="cart-dropdown-empty-btn">Explore Roasts &rarr;</a>' +
          '</div>';
        return;
      }

      var html = '<div class="cart-dropdown-header">' +
        '<span class="cart-dropdown-heading">Your Cart</span>' +
        '<span class="cart-dropdown-badge">' + total + (total === 1 ? ' item' : ' items') + '</span>' +
      '</div>';

      html += '<div class="cart-dropdown-list">';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var mascotUrl = getMascotUrl(it.mascot);
        html += '<div class="cart-dropdown-item">' +
          '<div class="cart-dropdown-item-thumb">' +
            (mascotUrl
              ? '<img src="' + escapeHtml(mascotUrl) + '" alt="" class="cart-dropdown-item-img" onerror="this.onerror=null;this.style.display=\'none\';">'
              : '<span class="cart-dropdown-item-ph" aria-hidden="true">&#9749;</span>') +
          '</div>' +
          '<div class="cart-dropdown-item-info">' +
            '<div class="cart-dropdown-item-title" title="' + escapeHtml(it.title) + '">' + escapeHtml(it.title) + '</div>' +
            '<div class="cart-dropdown-item-meta">' + escapeHtml(it.meta) + '</div>' +
            '<div class="cart-dropdown-item-qty-price">' + it.qty + ' &times; $' + it.unitPrice + '</div>' +
          '</div>' +
          '<div class="cart-dropdown-item-actions">' +
            '<div class="cart-dropdown-item-total">$' + it.lineTotal + '</div>' +
            '<button type="button" class="cart-dropdown-item-remove" data-key="' + escapeHtml(it.key) + '" title="Remove item" aria-label="Remove ' + escapeHtml(it.title) + '">&times;</button>' +
          '</div>' +
        '</div>';
      }
      html += '</div>';

      html += '<div class="cart-dropdown-footer">' +
        '<div class="cart-dropdown-subtotal-row">' +
          '<span class="cart-dropdown-subtotal-label">Subtotal</span>' +
          '<span class="cart-dropdown-subtotal-val">$' + subtotal + '</span>' +
        '</div>' +
        '<a href="' + escapeHtml(ORDER_URL) + '" class="cart-dropdown-checkout-btn">View Cart &amp; Checkout &rarr;</a>' +
      '</div>';

      dropdown.innerHTML = html;
    }

    update();
    window.addEventListener('pageshow', update);
    window.addEventListener('ywr-cart-changed', update);
    window.addEventListener('storage', update);

    // Hover controller with grace period to prevent menu from prematurely closing during diagonal pointer moves
    var wrap = document.getElementById('ywr-cart-wrap');
    var closeTimer = null;

    function openDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (wrap) wrap.classList.add('is-open');
    }

    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        if (wrap) wrap.classList.remove('is-open');
      }, 300);
    }

    if (wrap) {
      wrap.addEventListener('mouseenter', openDropdown);
      wrap.addEventListener('mouseleave', scheduleClose);
      wrap.addEventListener('focusin', openDropdown);
      wrap.addEventListener('focusout', function (e) {
        if (!wrap.contains(e.relatedTarget)) {
          scheduleClose();
        }
      });
    }

    var dropdownEl = document.getElementById('ywr-cart-dropdown');
    if (dropdownEl) {
      dropdownEl.addEventListener('click', function (e) {
        var removeBtn = e.target.closest('.cart-dropdown-item-remove');
        if (!removeBtn) return;
        e.preventDefault();
        e.stopPropagation();

        var key = removeBtn.getAttribute('data-key');
        if (!key) return;

        try {
          var raw = localStorage.getItem('ywr_cart');
          var cart = raw ? JSON.parse(raw) : {};
          delete cart[key];
          localStorage.setItem('ywr_cart', JSON.stringify(cart));
        } catch (err) {}
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      });
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.roasts-entry-quick-add');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      var slug = btn.getAttribute('data-slug');
      if (!slug) return;

      var key = slug + '||12oz|Whole Bean';
      var cart;
      try {
        var raw = localStorage.getItem('ywr_cart');
        cart = raw ? JSON.parse(raw) : {};
      } catch (err) {
        cart = {};
      }
      cart[key] = (cart[key] || 0) + 1;
      try {
        localStorage.setItem('ywr_cart', JSON.stringify(cart));
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));

      btn.classList.add('is-added');
      btn.textContent = 'Added!';
      btn.disabled = true;

      setTimeout(function () {
        btn.classList.remove('is-added');
        btn.textContent = 'Quick Add';
        btn.disabled = false;
      }, 1200);
    }, true);
  };
});
