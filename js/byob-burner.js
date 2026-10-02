/**
 * Yellow Wing Roasters - BYOB: Bring Your Own Burner
 * Handles single-origin bean selection, interactive roast level dots, size/grind options, and cart addition.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initBYOBBurner = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initBYOBBurner(config) {
    config = config || {};
    var origins = config.origins || {};
    var STORAGE_KEY = 'ywr_cart';
    var imagesBase = config.imagesBase || '/images/';

    var originSelect = document.getElementById('byob-origin-select');
    var notesEl = document.getElementById('byob-origin-notes');
    var prescribedEl = document.getElementById('byob-origin-prescribed');
    var mascotImg = document.getElementById('byob-mascot-img');
    var roastSelect = document.getElementById('byob-roast-select');
    var dotsStepper = document.getElementById('byob-dots-stepper');
    var statusText = document.getElementById('byob-level-status-text');
    var sizeSelect = document.getElementById('byob-size-select');
    var grindSelect = document.getElementById('byob-grind-select');
    var priceDisplay = document.getElementById('byob-price-display');
    var addBtn = document.getElementById('byob-add-to-cart-btn');

    if (!originSelect) return;

    var levelDotsMap = {
      'City': 1,
      'City+': 2,
      'Full City': 3,
      'Full City+': 4,
      'Vienna': 5
    };

    var dotNumberToLevel = {
      1: 'City',
      2: 'City+',
      3: 'Full City',
      4: 'Full City+',
      5: 'Vienna'
    };

    function getCurrentOrigin() {
      var slug = originSelect.value;
      return origins[slug] || null;
    }

    function updateDotsVisual(dotsCount) {
      if (!dotsStepper) return;
      var dots = dotsStepper.querySelectorAll('.roast-dot');
      for (var i = 0; i < dots.length; i++) {
        var num = i + 1;
        if (num <= dotsCount) {
          dots[i].className = 'roast-dot roast-dot-' + num;
        } else {
          dots[i].className = 'roast-dot';
        }
      }
    }

    function updatePrice() {
      var orig = getCurrentOrigin();
      if (!orig || !priceDisplay) return;
      var size = sizeSelect ? sizeSelect.value : '12oz';
      var p = (orig.prices && typeof orig.prices[size] === 'number') ? orig.prices[size] : 12;
      priceDisplay.textContent = '$' + p;
    }

    function updateRoastLevelState() {
      var orig = getCurrentOrigin();
      if (!orig || !roastSelect) return;

      var currentLevel = roastSelect.value;
      var dotsCount = levelDotsMap[currentLevel] || 2;
      updateDotsVisual(dotsCount);

      if (statusText) {
        if (currentLevel === orig.prescribed_level) {
          statusText.innerHTML = '<span style="color:#2e7d32; font-weight:600;">★ Recommended roast level</span> to highlight this bean\'s flavor profile';
        } else {
          statusText.innerHTML = '<span style="color:#8a5020; font-weight:600;">Custom roast level</span> (Recommended baseline: ' + orig.prescribed_level + ')';
        }
      }
    }

    function updateOriginState(resetRoastToPrescribed) {
      var orig = getCurrentOrigin();
      if (!orig) return;

      if (notesEl) {
        notesEl.textContent = orig.tasting_notes ? ('Notes: ' + orig.tasting_notes) : '';
      }

      if (prescribedEl) {
        prescribedEl.textContent = 'Prescribed baseline: ' + orig.prescribed_level;
      }

      // Populate size options
      if (sizeSelect && orig.prices) {
        var prevSize = sizeSelect.value;
        sizeSelect.innerHTML = '';
        var sizes = Object.keys(orig.prices);
        if (sizes.length === 0) sizes = ['12oz', '1lb', '2lb', '5lb'];
        for (var s = 0; s < sizes.length; s++) {
          var opt = document.createElement('option');
          opt.value = sizes[s];
          opt.textContent = sizes[s];
          if (sizes[s] === prevSize) opt.selected = true;
          sizeSelect.appendChild(opt);
        }
      }

      if (resetRoastToPrescribed && roastSelect && orig.prescribed_level) {
        for (var o = 0; o < roastSelect.options.length; o++) {
          if (roastSelect.options[o].value === orig.prescribed_level) {
            roastSelect.selectedIndex = o;
            break;
          }
        }
      }

      updateRoastLevelState();
      updatePrice();
    }

    originSelect.addEventListener('change', function () {
      updateOriginState(true);
    });

    if (roastSelect) {
      roastSelect.addEventListener('change', function () {
        updateRoastLevelState();
      });
    }

    if (dotsStepper) {
      dotsStepper.addEventListener('click', function (e) {
        var dot = e.target.closest('.roast-dot');
        if (!dot) return;
        var lvlNum = parseInt(dot.getAttribute('data-level'), 10);
        var targetLevel = dotNumberToLevel[lvlNum];
        if (targetLevel && roastSelect) {
          roastSelect.value = targetLevel;
          updateRoastLevelState();
        }
      });
    }

    if (sizeSelect) {
      sizeSelect.addEventListener('change', updatePrice);
    }

    // Initial setup
    updateOriginState(true);

    // Add to Cart
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var orig = getCurrentOrigin();
        if (!orig) return;

        var originSlug = originSelect.value;
        var size = sizeSelect ? sizeSelect.value : '12oz';
        var grind = grindSelect ? grindSelect.value : 'Whole Bean';
        var roastLevel = roastSelect ? roastSelect.value : (orig.prescribed_level || 'City+');

        var cartKey = 'byob-burner|' + originSlug + '|' + size + '|' + grind + '|' + roastLevel;

        var cart;
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          cart = raw ? JSON.parse(raw) : {};
        } catch (e) {
          cart = {};
        }

        cart[cartKey] = (cart[cartKey] || 0) + 1;

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {}

        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));

        addBtn.textContent = 'Added to Cart!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart';
          addBtn.disabled = false;
        }, 1200);
      });
    }
  };
});
