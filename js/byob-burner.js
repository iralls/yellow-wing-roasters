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

    function getCurrentOrigin() {
      return origins[originSelect.value];
    }

    function updateDotsVisual(dotsCount) {
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
      priceDisplay.textContent = '$' + orig.prices[sizeSelect.value];
    }

    function updateRoastLevelState() {
      var orig = getCurrentOrigin();
      var currentLevel = roastSelect.value;
      var dotsCount = parseInt(roastSelect.selectedOptions[0].getAttribute('data-dots'), 10);
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

    roastSelect.addEventListener('change', function () {
      updateRoastLevelState();
    });

    dotsStepper.addEventListener('click', function (e) {
      var dot = e.target.closest('.roast-dot');
      if (!dot) return;
      var lvlNum = parseInt(dot.getAttribute('data-level'), 10);
      roastSelect.value = window.YWR_ROAST_LEVELS[lvlNum].specialty;
      updateRoastLevelState();
    });

    sizeSelect.addEventListener('change', updatePrice);

    // Initial setup
    updateOriginState(true);

    // Add to Cart
    addBtn.addEventListener('click', function () {
      var orig = getCurrentOrigin();
      var size = sizeSelect.value;
      var item = {
        type: 'custom',
        slug: 'byob-burner',
        origin: originSelect.value,
        title: 'BYOB: ' + orig.title,
        size: size,
        grind: grindSelect.value,
        roastLevel: roastSelect.value,
        price: orig.prices[size],
        mascot: 'bird-on-spit-transparent.png',
        qty: 1
      };

      var added = window.ywrAddToCart(item, 1);
      if (added) {
        addBtn.textContent = 'Added to Cart!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart';
          addBtn.disabled = false;
        }, 1200);
      } else {
        console.error('Failed to add BYOB burner to cart:', item);
      }
    });
  };
});
