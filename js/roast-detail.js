/**
 * Yellow Wing Roasters - Roast Detail Page
 * Handles size and grind selection, one-time vs subscription toggle, price calculation, and add-to-cart.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initRoastDetail = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initRoastDetail(config) {
    config = config || {};
    var STORAGE_KEY = 'ywr_cart';
    var pricesOneTime = config.pricesOneTime || {};
    var pricesSub = config.pricesSub || {};
    var roastSlug = config.roastSlug || '';
    var defaultFreq = config.defaultFreq || 'Monthly';

    function loadCart() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveCart(c) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    function cartKey(roast, variant, size, grind) {
      return roast + '|' + (variant || '') + '|' + size + '|' + (grind || 'Whole Bean');
    }

    var sizeSelect = document.getElementById('order-size-select');
    var grindSelect = document.getElementById('order-grind-select');
    var toggleContainer = document.querySelector('.roast-purchase-toggle');
    var toggleBtns = document.querySelectorAll('.roast-purchase-toggle-btn');
    var priceEl = document.getElementById('roast-detail-price');
    var subPanel = document.getElementById('sub-details-panel');
    var addBtn = document.getElementById('add-to-cart-btn');
    var freqSelect = document.getElementById('sub-freq-select');

    var currentMode = 'onetime';
    for (var i = 0; i < toggleBtns.length; i++) {
      if (toggleBtns[i].classList.contains('is-active')) {
        currentMode = toggleBtns[i].getAttribute('data-val') || 'onetime';
        break;
      }
    }

    function updatePricesAndMode() {
      var size = sizeSelect.value;
      var otInfo = pricesOneTime[size];
      var isSub = (currentMode === 'subscribe');

      // Update price displayed above Add to Cart button
      if (priceEl) {
        if (isSub) {
          priceEl.innerHTML = '$' + pricesSub[size];
        } else {
          if (otInfo.effective < otInfo.price) {
            priceEl.innerHTML = '<s>$' + otInfo.price + '</s> <span class="temp-val">$' + otInfo.effective + '</span>';
          } else {
            priceEl.innerHTML = '$' + otInfo.effective;
          }
        }
      }

      if (subPanel) subPanel.style.display = isSub ? 'block' : 'none';
      if (addBtn) {
        addBtn.textContent = 'Add to Cart';
        addBtn.style.display = 'inline-block';
      }
    }

    // Toggle button clicks
    Array.prototype.forEach.call(toggleBtns, function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        var val = btn.getAttribute('data-val');
        if (!val || val === currentMode) return;
        currentMode = val;

        Array.prototype.forEach.call(toggleBtns, function (b) {
          var active = (b === btn);
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-checked', active ? 'true' : 'false');
        });

        updatePricesAndMode();
      });
    });

    // Keyboard support for toggle
    if (toggleContainer) {
      toggleContainer.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          var btns = Array.prototype.slice.call(toggleBtns);
          var activeIdx = -1;
          for (var j = 0; j < btns.length; j++) {
            if (btns[j].classList.contains('is-active')) {
              activeIdx = j;
              break;
            }
          }
          if (activeIdx === -1) activeIdx = 0;
          var nextIdx = (activeIdx + 1) % btns.length;
          btns[nextIdx].click();
          btns[nextIdx].focus();
        }
      });
    }

    if (sizeSelect) sizeSelect.addEventListener('change', updatePricesAndMode);
    if (grindSelect) grindSelect.addEventListener('change', updatePricesAndMode);
    if (freqSelect) freqSelect.addEventListener('change', updatePricesAndMode);

    updatePricesAndMode();

    addBtn.addEventListener('click', function () {
      var isSub = (currentMode === 'subscribe');
      var size = sizeSelect.value;
      var price = isSub ? pricesSub[size] : pricesOneTime[size].effective;
      var rData = (window.YWR_ROASTS_DATA && window.YWR_ROASTS_DATA[roastSlug]) || {};

      var item = {
        type: isSub ? 'subscription' : 'roast',
        slug: roastSlug,
        title: rData.title || roastSlug,
        size: size,
        grind: grindSelect.value,
        price: price,
        mascot: rData.mascot || null,
        qty: 1
      };
      if (isSub) {
        item.frequency = freqSelect.value;
      }

      var added = window.ywrAddToCart(item, 1);

      if (added) {
        addBtn.textContent = 'Added!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart';
          addBtn.disabled = false;
        }, 1200);
      } else {
        console.error('Failed to add roast to cart:', item);
      }
    });
  };
});
