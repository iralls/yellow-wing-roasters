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

    var ROASTS_URL = config.ROASTS_URL || '/roasts/';
    var ORDER_URL = config.ORDER_URL || '/order/';
    var IMAGES_BASE = config.IMAGES_BASE || '/images/';
    var roastsData = config.roastsData || window.YWR_ROASTS_DATA || {};

    // Persist gift code from URL query params across pages in this session
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      var urlParams = new URLSearchParams(window.location.search);
      var qpCode = urlParams.get('code');
      if (qpCode) {
        try {
          sessionStorage.setItem('ywr_gift_code', qpCode.trim().toUpperCase());
        } catch (e) {}
      }
    }

    function getRoastsData() {
      return (config && config.roastsData) || window.YWR_ROASTS_DATA || roastsData || {};
    }

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

    function generateCartItemId(item) {
      if (item.id) return item.id;
      if (item.type === 'subscription') {
        return 'sub:' + item.slug;
      }
      if (item.type === 'roast') {
        return 'roast:' + item.slug + ':' + (item.variant || '') + ':' + (item.size || '') + ':' + (item.grind || '');
      }
      if (item.type === 'custom') {
        return 'custom:' + (item.origin || item.slug) + ':' + (item.size || '') + ':' + (item.grind || '') + ':' + (item.roastLevel || '') + ':' + (item.subtitle || '');
      }
      if (item.type === 'flight') {
        return 'flight:' + item.slug + ':' + (item.subtitle || '') + ':' + (item.grind || '');
      }
      return (item.slug || 'item') + ':' + (item.size || '') + ':' + (item.grind || '');
    }

    function getCart() {
      try {
        return JSON.parse(localStorage.getItem('ywr_cart')) || {};
      } catch (e) {
        console.error('getCart: Failed to parse localStorage ywr_cart:', e);
        return {};
      }
    }

    window.ywrGetCart = getCart;

    window.ywrAddToCart = function (item, qty) {
      if (!item || typeof item !== 'object') {
        console.error('ywrAddToCart: Invalid item object provided:', item);
        return false;
      }
      qty = parseInt(qty || item.qty || 1, 10);
      if (isNaN(qty) || qty <= 0) qty = 1;

      item.id = generateCartItemId(item);
      var isSub = (item.type === 'subscription');

      var cart = getCart();
      var cartTypes = new Set(Object.values(cart).map(function (it) {
        return it.type === 'subscription' ? 'subscription' : 'roast';
      }));
      var hasExistingSub = cartTypes.has('subscription');
      var hasExistingOneTime = cartTypes.has('roast');

      if (isSub && hasExistingOneTime) {
        var ok = window.confirm('Your cart currently contains one-time items. Subscriptions are billed and delivered separately. Would you like to replace your cart with this subscription?');
        if (!ok) return false;
        cart = {};
      } else if (!isSub && hasExistingSub) {
        var ok = window.confirm('Your cart currently contains a subscription. One-time items cannot be combined with subscriptions. Would you like to replace your cart with this item?');
        if (!ok) return false;
        cart = {};
      }

      if (isSub) {
        // At most one subscription per roast/type: replace existing subscription for this slug
        Object.values(cart).forEach(function (it) {
          if (it.type === 'subscription' && it.slug === item.slug) {
            delete cart[it.id];
          }
        });
        item.qty = 1;
        cart[item.id] = item;
      } else {
        if (cart[item.id]) {
          cart[item.id].qty += qty;
        } else {
          item.qty = qty;
          cart[item.id] = item;
        }
      }

      try {
        localStorage.setItem('ywr_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('ywrAddToCart: Failed to save cart to localStorage:', e);
        return false;
      }
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      return true;
    };

    function update() {
      var cartList = Object.values(getCart());
      var total = 0;
      var items = [];
      var subtotal = 0;

      cartList.forEach(function (it) {
        if (it && it.qty > 0) {
          total += it.qty;
          var lineTotal = (it.price || 0) * it.qty;
          var metaParts = [];
          if (it.size) metaParts.push(it.size);
          if (it.roastLevel) metaParts.push(it.roastLevel);
          if (it.grind) metaParts.push(it.grind);
          if (it.frequency) metaParts.push(it.frequency);
          if (it.subtitle) {
            if (it.slug === 'bring-your-own-beans') {
              metaParts.push('Link: ' + it.subtitle);
            } else if (it.slug === 'build-your-own-blend') {
              metaParts.push('Recipe: ' + it.subtitle);
            } else if (it.type === 'flight') {
              metaParts.push('Picks: ' + it.subtitle);
            } else if (it.type === 'custom') {
              metaParts.push(it.subtitle);
            }
          }

          items.push({
            id: it.id,
            type: it.type,
            title: it.title || it.slug,
            meta: metaParts.join(' · '),
            mascot: it.mascot,
            unitPrice: it.price || 0,
            qty: it.qty,
            lineTotal: lineTotal,
            isSubscription: (it.type === 'subscription')
          });
          subtotal += lineTotal;
        }
      });

      var sleekEl = document.getElementById('sleek-header-cart-count');
      if (sleekEl) {
        sleekEl.textContent = total;
      }

      var indicator = document.getElementById('ywr-cart-indicator');
      var el = document.getElementById('ywr-cart-count');
      if (el) el.textContent = total;
      if (indicator) indicator.classList.toggle('cart-indicator-empty', total === 0);

      // Render Slide-Out Cart Drawer (Popout from right)
      var drawerList = document.getElementById('ywr-drawer-items-list');
      var drawerEmpty = document.getElementById('ywr-drawer-empty-msg');
      var drawerFooter = document.getElementById('ywr-drawer-footer');
      var drawerSubtotal = document.getElementById('ywr-drawer-subtotal-val');
      var drawerCountBadge = document.getElementById('ywr-drawer-count-badge');

      if (drawerCountBadge) {
        drawerCountBadge.textContent = total;
      }

      if (drawerList) {
        if (items.length === 0) {
          if (drawerEmpty) drawerEmpty.style.display = 'block';
          if (drawerFooter) drawerFooter.style.display = 'none';
          drawerList.innerHTML = '';
        } else {
          if (drawerEmpty) drawerEmpty.style.display = 'none';
          if (drawerFooter) drawerFooter.style.display = 'block';
          if (drawerSubtotal) drawerSubtotal.textContent = '$' + subtotal.toFixed(2);

          var drawerHtml = '';
          for (var j = 0; j < items.length; j++) {
            var dItem = items[j];
            var dMascotUrl = getMascotUrl(dItem.mascot);
            drawerHtml += '<div class="ywr-drawer-item">' +
              (dMascotUrl
                ? '<img src="' + escapeHtml(dMascotUrl) + '" alt="" class="ywr-drawer-item-img">'
                : '<div class="ywr-drawer-item-ph">&#9749;</div>') +
              '<div class="ywr-drawer-item-info">' +
                '<div class="ywr-drawer-item-title">' +
                  escapeHtml(dItem.title) +
                  (dItem.isSubscription ? ' <span class="ywr-sub-badge">Sub</span>' : '') +
                '</div>' +
                '<div class="ywr-drawer-item-meta">' + escapeHtml(dItem.meta) + ' &times; ' + dItem.qty + '</div>' +
                '<div class="ywr-drawer-item-price">$' + dItem.lineTotal.toFixed(2) + '</div>' +
              '</div>' +
              '<div class="ywr-drawer-item-actions">' +
                '<button type="button" class="ywr-drawer-item-remove" data-key="' + escapeHtml(dItem.id) + '" title="Remove item" aria-label="Remove ' + escapeHtml(dItem.title) + '">&times;</button>' +
              '</div>' +
            '</div>';
          }
          drawerList.innerHTML = drawerHtml;
        }
      }

      // Legacy dropdown support (if present)
      var dropdown = document.getElementById('ywr-cart-dropdown');
      if (dropdown) {
        if (items.length === 0) {
          dropdown.innerHTML =
            '<div class="cart-dropdown-empty">' +
              '<p class="cart-dropdown-empty-msg">Your cart is empty</p>' +
              '<a href="' + escapeHtml(ROASTS_URL) + '" class="cart-dropdown-empty-btn">Explore Roasts &rarr;</a>' +
            '</div>';
        } else {
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
                '<div class="cart-dropdown-item-title" title="' + escapeHtml(it.title) + '">' +
                  escapeHtml(it.title) +
                  (it.isSubscription ? ' <span class="cart-dropdown-item-badge" style="font-size:0.65rem; padding:0.15rem 0.45rem; background:#ebe7df; border-radius:999px; text-transform:uppercase; font-weight:700; margin-left:0.3rem;">Sub</span>' : '') +
                '</div>' +
                '<div class="cart-dropdown-item-meta">' + escapeHtml(it.meta) + '</div>' +
                '<div class="cart-dropdown-item-qty-price">' + it.qty + ' &times; $' + it.unitPrice + '</div>' +
              '</div>' +
              '<div class="cart-dropdown-item-actions">' +
                '<div class="cart-dropdown-item-total">$' + it.lineTotal + '</div>' +
                '<button type="button" class="cart-dropdown-item-remove" data-key="' + escapeHtml(it.id) + '" title="Remove item" aria-label="Remove ' + escapeHtml(it.title) + '">&times;</button>' +
              '</div>' +
            '</div>';
          }
          html += '</div>';

          html += '<div class="cart-dropdown-footer">' +
            '<div class="cart-dropdown-subtotal-row">' +
              '<span class="cart-dropdown-subtotal-label">Total</span>' +
              '<span class="cart-dropdown-subtotal-val">$' + subtotal + '</span>' +
            '</div>' +
            '<a href="' + escapeHtml(ORDER_URL) + '" class="cart-dropdown-checkout-btn">View cart &amp; checkout &rarr;</a>' +
          '</div>';

          dropdown.innerHTML = html;
        }
      }
    }

    update();
    window.addEventListener('pageshow', update);
    window.addEventListener('ywr-cart-changed', update);
    window.addEventListener('storage', update);

    // Slide-out Drawer Controller (Popout from the right)
    var drawerEl = document.getElementById('ywr-cart-drawer');
    var backdropEl = document.getElementById('ywr-cart-backdrop');
    var drawerCloseBtn = document.getElementById('ywr-drawer-close');
    var indicator = document.getElementById('ywr-cart-indicator');

    function openCartDrawer() {
      if (drawerEl && backdropEl) {
        update();
        drawerEl.classList.add('is-open');
        backdropEl.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (indicator) indicator.setAttribute('aria-expanded', 'true');
      }
    }

    function closeCartDrawer() {
      if (drawerEl && backdropEl) {
        drawerEl.classList.remove('is-open');
        backdropEl.classList.remove('is-open');
        document.body.style.overflow = '';
        if (indicator) indicator.setAttribute('aria-expanded', 'false');
      }
    }

    window.ywrOpenCartDrawer = openCartDrawer;
    window.ywrCloseCartDrawer = closeCartDrawer;

    if (indicator) {
      indicator.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = drawerEl && drawerEl.classList.contains('is-open');
        if (isOpen) {
          closeCartDrawer();
        } else {
          openCartDrawer();
        }
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeCartDrawer();
      });
    }

    if (backdropEl) {
      backdropEl.addEventListener('click', function (e) {
        e.preventDefault();
        closeCartDrawer();
      });
    }

    var drawerBrowseBtn = document.getElementById('ywr-drawer-browse-btn');
    if (drawerBrowseBtn) {
      drawerBrowseBtn.addEventListener('click', function () {
        closeCartDrawer();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawerEl && drawerEl.classList.contains('is-open')) {
        closeCartDrawer();
      }
    });

    // Remove item listener for the drawer
    if (drawerEl) {
      drawerEl.addEventListener('click', function (e) {
        var removeBtn = e.target.closest('.ywr-drawer-item-remove');
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
        } catch (err) {
          console.error('ywrCart: Failed to remove item from cart drawer:', err);
        }
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
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
        } catch (err) {
          console.error('ywrCart: Failed to remove item from cart:', err);
        }
        window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      });
    }

    // Event Delegation: global click listener on document.
    // If click did not originate on or inside a quick-add button, ignore it and let normal navigation proceed.
    document.addEventListener('click', function (e) {
      var priceBtn = e.target.closest('.roasts-entry-overlay-price-btn');
      var quickAddBtn = e.target.closest('.roasts-entry-quick-add');
      var btn = priceBtn || quickAddBtn;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      if (btn.disabled || btn.classList.contains('is-added')) return;

      var slug = btn.getAttribute('data-slug');
      if (!slug) return;

      var size = btn.getAttribute('data-size');
      var subData = window.YWR_SUBSCRIPTIONS_DATA;
      var added = false;

      if (subData && subData[slug]) {
        var s = subData[slug];
        added = window.ywrAddToCart({
          type: 'subscription',
          slug: slug,
          title: s.title,
          subtitle: s.subtitle,
          size: size,
          grind: window.YWR_DEFAULT_GRIND,
          frequency: s.frequencies[0],
          price: s.prices[size],
          mascot: s.mascot,
          qty: 1
        }, 1);
      } else {
        var r = getRoastsData()[slug];
        added = window.ywrAddToCart({
          type: 'roast',
          slug: slug,
          title: r.title,
          size: size,
          grind: window.YWR_DEFAULT_GRIND,
          price: r.prices[size],
          mascot: r.mascot,
          qty: 1
        }, 1);
      }

      if (!added) {
        console.error('Failed to quick-add item to cart:', slug);
        return;
      }

      var card = btn.closest('.roasts-entry');
      var cardQuickAdd = card ? card.querySelector('.roasts-entry-quick-add') : null;

      if (priceBtn) {
        var valEl = priceBtn.querySelector('.price-val');
        var origHtml = valEl ? valEl.innerHTML : null;

        priceBtn.classList.add('is-added');
        priceBtn.disabled = true;
        if (valEl) {
          valEl.textContent = 'Added!';
        }

        if (cardQuickAdd) {
          cardQuickAdd.classList.add('is-added');
          cardQuickAdd.textContent = 'Added ' + size + '!';
          cardQuickAdd.disabled = true;
        }

        setTimeout(function () {
          priceBtn.classList.remove('is-added');
          priceBtn.disabled = false;
          if (valEl && origHtml !== null) {
            valEl.innerHTML = origHtml;
          }

          if (cardQuickAdd) {
            cardQuickAdd.classList.remove('is-added');
            cardQuickAdd.textContent = '+ Add';
            cardQuickAdd.disabled = false;
          }
        }, 1200);
      } else {
        var origQuickAddText = quickAddBtn.textContent;
        quickAddBtn.classList.add('is-added');
        quickAddBtn.textContent = 'Added!';
        quickAddBtn.disabled = true;

        var matchingPriceBtn = card ? card.querySelector('.roasts-entry-overlay-price-btn[data-size="' + size + '"]') : null;
        var matchValEl = matchingPriceBtn ? matchingPriceBtn.querySelector('.price-val') : null;
        var origMatchHtml = matchValEl ? matchValEl.innerHTML : null;
        if (matchingPriceBtn) {
          matchingPriceBtn.classList.add('is-added');
          matchingPriceBtn.disabled = true;
          if (matchValEl) {
            matchValEl.textContent = 'Added!';
          }
        }

        setTimeout(function () {
          quickAddBtn.classList.remove('is-added');
          quickAddBtn.textContent = origQuickAddText;
          quickAddBtn.disabled = false;

          if (matchingPriceBtn) {
            matchingPriceBtn.classList.remove('is-added');
            matchingPriceBtn.disabled = false;
            if (matchValEl && origMatchHtml !== null) {
              matchValEl.innerHTML = origMatchHtml;
            }
          }
        }, 1200);
      }
    }, true);
  };
});
