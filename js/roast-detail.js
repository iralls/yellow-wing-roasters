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
    var subscribeBaseUrl = config.subscribeBaseUrl || '/subscribe/';
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
    var sizeBtns = document.querySelectorAll('.roast-size-btn');
    var sizeBar = document.querySelector('.roast-size-selector-bar');
    var grindSelect = document.getElementById('order-grind-select');
    var priceOneTimeEl = document.getElementById('price-display-onetime');
    var priceSubEl = document.getElementById('price-display-sub');
    var cardOneTime = document.getElementById('option-card-onetime');
    var cardSub = document.getElementById('option-card-sub');
    var radioOneTime = document.querySelector('input[name="purchase-type"][value="onetime"]');
    var radioSub = document.querySelector('input[name="purchase-type"][value="subscribe"]');
    var subPanel = document.getElementById('sub-details-panel');
    var addBtn = document.getElementById('add-to-cart-btn');
    var subLink = document.getElementById('sub-link');
    var freqSelect = document.getElementById('sub-freq-select');

    function updatePricesAndMode() {
      var size = sizeSelect ? sizeSelect.value : '12oz';
      var otInfo = pricesOneTime[size] || { price: 0, effective: 0 };
      if (priceOneTimeEl) {
        if (otInfo.effective < otInfo.price) {
          priceOneTimeEl.innerHTML = '<s>$' + otInfo.price + '</s> <strong style="color:#d32f2f;">$' + otInfo.effective + '</strong>';
        } else {
          priceOneTimeEl.textContent = '$' + otInfo.effective;
        }
      }

      var subP = (pricesSub && typeof pricesSub[size] === 'number') ? pricesSub[size] : otInfo.price;
      if (priceSubEl) {
        priceSubEl.textContent = '$' + subP;
      }

      var isSub = radioSub && radioSub.checked;

      // Update per-size button prices to reflect One-time vs Subscription pricing
      Array.prototype.forEach.call(sizeBtns, function (btn) {
        var s = btn.getAttribute('data-size');
        var priceEl = btn.querySelector('.roast-size-btn-price');
        if (!priceEl || !s) return;

        if (isSub) {
          var sp = (pricesSub && typeof pricesSub[s] === 'number') ? pricesSub[s] : (pricesOneTime[s] ? pricesOneTime[s].price : 0);
          priceEl.textContent = '$' + sp;
        } else {
          var ot = pricesOneTime[s] || { price: 0, effective: 0 };
          if (ot.effective < ot.price) {
            priceEl.innerHTML = '<s>$' + ot.price + '</s> <span class="temp-val">$' + ot.effective + '</span>';
          } else {
            priceEl.textContent = '$' + ot.effective;
          }
        }
      });

      if (isSub) {
        if (cardSub) { cardSub.style.borderColor = '#2c1e14'; cardSub.style.background = '#fff'; }
        if (cardOneTime) { cardOneTime.style.borderColor = '#e0d8cf'; cardOneTime.style.background = '#faf8f5'; }
        if (subPanel) subPanel.style.display = 'block';
        if (addBtn) addBtn.style.display = 'none';
        if (subLink) subLink.style.display = 'inline-block';
      } else {
        if (cardOneTime) { cardOneTime.style.borderColor = '#2c1e14'; cardOneTime.style.background = '#fff'; }
        if (cardSub) { cardSub.style.borderColor = '#e0d8cf'; cardSub.style.background = '#faf8f5'; }
        if (subPanel) subPanel.style.display = 'none';
        if (addBtn) addBtn.style.display = 'inline-block';
        if (subLink) subLink.style.display = 'none';
      }

      if (subLink) {
        var freq = freqSelect ? freqSelect.value : defaultFreq;
        var grind = grindSelect ? grindSelect.value : 'Whole Bean';
        subLink.href = subscribeBaseUrl + '?roast=' + encodeURIComponent(roastSlug) + '&size=' + encodeURIComponent(size) + '&frequency=' + encodeURIComponent(freq) + '&grind=' + encodeURIComponent(grind);
      }
    }

    Array.prototype.forEach.call(sizeBtns, function (btn) {
      btn.addEventListener('click', function () {
        var s = btn.getAttribute('data-size');
        if (!s) return;

        if (sizeSelect) {
          sizeSelect.value = s;
        }

        Array.prototype.forEach.call(sizeBtns, function (b) {
          var isActive = (b === btn);
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });

        updatePricesAndMode();
      });
    });

    if (sizeBar) {
      sizeBar.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var btns = Array.prototype.slice.call(sizeBtns);
          var currentIdx = -1;
          for (var i = 0; i < btns.length; i++) {
            if (btns[i].classList.contains('is-active')) {
              currentIdx = i;
              break;
            }
          }
          if (currentIdx === -1) currentIdx = 0;
          var nextIdx = currentIdx;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIdx = (currentIdx + 1) % btns.length;
          } else {
            nextIdx = (currentIdx - 1 + btns.length) % btns.length;
          }
          btns[nextIdx].click();
          btns[nextIdx].focus();
        }
      });
    }

    if (sizeSelect) sizeSelect.addEventListener('change', updatePricesAndMode);
    if (grindSelect) grindSelect.addEventListener('change', updatePricesAndMode);
    if (freqSelect) freqSelect.addEventListener('change', updatePricesAndMode);
    if (radioOneTime) radioOneTime.addEventListener('change', updatePricesAndMode);
    if (radioSub) radioSub.addEventListener('change', updatePricesAndMode);

    if (cardOneTime) {
      cardOneTime.addEventListener('click', function (e) {
        if (e.target !== radioOneTime) {
          radioOneTime.checked = true;
          updatePricesAndMode();
        }
      });
    }

    if (cardSub) {
      cardSub.addEventListener('click', function (e) {
        if (e.target !== radioSub && (!freqSelect || !freqSelect.contains(e.target))) {
          radioSub.checked = true;
          updatePricesAndMode();
        }
      });
    }

    updatePricesAndMode();

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var size = sizeSelect ? sizeSelect.value : '12oz';
        var grind = grindSelect ? grindSelect.value : 'Whole Bean';
        var k = cartKey(roastSlug, '', size, grind);
        var cart = loadCart();
        cart[k] = (cart[k] || 0) + 1;
        saveCart(cart);
        addBtn.textContent = 'Added!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart';
          addBtn.disabled = false;
        }, 1200);
      });
    }
  };
});
