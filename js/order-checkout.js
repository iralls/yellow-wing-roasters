/**
 * Yellow Wing Roasters - Order & Cart Checkout
 * Handles cart rendering, item removal, coupon/discount validation, and order form submission.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initOrderCheckout = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initOrderCheckout(config) {
    config = config || {};
    var STORAGE_KEY = 'ywr_cart';
    var form = document.getElementById('order-form');
    var emptyEl = document.getElementById('order-cart-empty');
    var itemsEl = document.getElementById('order-cart-items');
    var roastData = config.roastData || [];

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

    function cartKey(roast, variant, size, grind, roastLevel) {
      return roast + '|' + (variant || '') + '|' + size + '|' + (grind || 'Whole Bean') + (roastLevel ? '|' + roastLevel : '');
    }

    var appliedDiscount = null;
    var currentRenderedItems = [];

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
        var rRoastLevel = parts[4] || '';

        var matchedData = null;
        if (rSlug === 'byob-burner') {
          var originSlug = vSlug;
          var origData = (typeof window !== 'undefined' && window.YWR_ROASTS_DATA && window.YWR_ROASTS_DATA[originSlug]) ? window.YWR_ROASTS_DATA[originSlug] : null;
          var originTitle = origData ? origData.title : (originSlug ? originSlug.replace(/-/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) : 'Custom Roast');
          var fullLabel = 'BYOB: ' + originTitle;
          var sizeStr = rSize || '12oz';
          var priceVal = (origData && origData.prices && typeof origData.prices[sizeStr] === 'number') ? origData.prices[sizeStr] : 12;
          var roastLevelName = rRoastLevel || (origData ? origData.roast_level_name : 'City+');
          var dotsMap = { 'City': 1, 'City+': 2, 'Full City': 3, 'Full City+': 4, 'Vienna': 5 };
          var dotsCount = dotsMap[roastLevelName] || (origData ? origData.dots : 2);

          matchedData = {
            roast: rSlug,
            variant: vSlug,
            size: sizeStr,
            label: fullLabel,
            formName: fullLabel + ' ' + sizeStr,
            mascot: 'bird-on-spit-transparent.png',
            dots: dotsCount,
            price: priceVal,
            description: ''
          };
        } else {
          for (var i = 0; i < roastData.length; i++) {
            var d = roastData[i];
            if (d.roast === rSlug && d.variant === vSlug && d.size === rSize) {
              matchedData = d;
              break;
            }
          }

          if (!matchedData && typeof window !== 'undefined' && window.YWR_ROASTS_DATA && window.YWR_ROASTS_DATA[rSlug]) {
            var cat = window.YWR_ROASTS_DATA[rSlug];
            var vName = (vSlug && cat.variants && cat.variants[vSlug]) ? cat.variants[vSlug] : '';
            var fullLabel = cat.title + (vName ? ' — ' + vName : '');
            var sizeStr = rSize || '12oz';
            var formLabel = cat.title + (vName ? ' (' + vName + ') ' : ' ') + sizeStr;
            var priceVal = (cat.prices && typeof cat.prices[sizeStr] === 'number') ? cat.prices[sizeStr] : 0;
            matchedData = {
              roast: rSlug,
              variant: vSlug,
              size: sizeStr,
              label: fullLabel,
              formName: formLabel,
              mascot: cat.mascot,
              dots: cat.dots || 0,
              price: priceVal,
              description: cat.description || ''
            };
          }
        }

        if (matchedData) {
          items.push({ data: matchedData, key: ck, qty: cart[ck], grind: rGrind, roastLevel: rRoastLevel });
        } else {
          var itemPrice = 0;
          var itemLabel = rSlug;
          var itemSize = rSize;
          var itemMascot = null;

          if (rSlug === 'peck-your-own') {
            var choicesCount = (rSize || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).length;
            var pyoPricePerBag = (config.flightPyoPrice || 10);
            itemPrice = choicesCount * pyoPricePerBag;
            itemLabel = 'Peck Your Own: ' + rSize;
          } else if (rSlug === 'the-aviary') {
            itemPrice = (config.flightAviaryPrice || 38);
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

      var totalQty = 0;
      for (var q = 0; q < items.length; q++) {
        totalQty += items[q].qty;
      }
      var countEl = document.getElementById('order-summary-count');
      if (countEl) {
        countEl.textContent = totalQty + (totalQty === 1 ? ' item' : ' items');
      }

      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var card = document.createElement('div');
        card.className = 'order-cart-card';

        var thumb = document.createElement('div');
        thumb.className = 'order-cart-card-thumb';
        if (item.data.mascot) {
          var birdImg = document.createElement('img');
          birdImg.src = '/images/' + item.data.mascot;
          birdImg.alt = '';
          birdImg.className = 'order-cart-card-img';
          birdImg.onerror = function () { this.style.display = 'none'; };
          thumb.appendChild(birdImg);
        } else {
          var ph = document.createElement('span');
          ph.className = 'order-cart-card-ph';
          ph.setAttribute('aria-hidden', 'true');
          ph.textContent = '☕';
          thumb.appendChild(ph);
        }
        var badge = document.createElement('span');
        badge.className = 'order-cart-card-badge';
        badge.textContent = item.qty;
        thumb.appendChild(badge);

        card.appendChild(thumb);

        var info = document.createElement('div');
        info.className = 'order-cart-card-info';

        var title = document.createElement('div');
        title.className = 'order-cart-card-title';
        title.textContent = item.data.label;
        info.appendChild(title);

        var meta = document.createElement('div');
        meta.className = 'order-cart-card-meta';
        var metaText = document.createElement('span');
        var metaParts = [item.data.size];
        if (item.roastLevel) metaParts.push(item.roastLevel);
        if (item.grind) metaParts.push(item.grind);
        metaText.textContent = metaParts.join(' · ');
        meta.appendChild(metaText);
        info.appendChild(meta);
        card.appendChild(info);

        var actions = document.createElement('div');
        actions.className = 'order-cart-card-actions';

        var lineTotal = (item.data.price || 0) * item.qty;
        var totalEl = document.createElement('div');
        totalEl.className = 'order-cart-card-total';
        totalEl.textContent = '$' + lineTotal;
        actions.appendChild(totalEl);

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'order-cart-card-remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', 'Remove ' + item.data.label);
        actions.appendChild(removeBtn);

        card.appendChild(actions);

        (function (k) {
          removeBtn.addEventListener('click', function () {
            var c = loadCart();
            delete c[k];
            saveCart(c);
            render();
          });
        })(item.key);

        itemsEl.appendChild(card);
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

      var grandTotal = Math.max(0, subtotal - discountValue);

      var totalsWrap = document.createElement('div');
      totalsWrap.className = 'order-cart-summary-totals';

      var subtotalRow = document.createElement('div');
      subtotalRow.className = 'order-cart-summary-row';
      subtotalRow.innerHTML = '<span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span>';
      totalsWrap.appendChild(subtotalRow);

      if (discountValue > 0) {
        var discountRow = document.createElement('div');
        discountRow.className = 'order-cart-summary-row order-cart-summary-row--discount';
        discountRow.innerHTML = '<span>Discount (' + appliedDiscount.code + ')</span><span>-$' + discountValue.toFixed(2) + '</span>';
        totalsWrap.appendChild(discountRow);
      }

      var totalRow = document.createElement('div');
      totalRow.className = 'order-cart-summary-row order-cart-summary-row--total';
      totalRow.innerHTML = '<span class="order-cart-total-label">Total</span><span class="order-cart-total-value">$' + grandTotal.toFixed(2) + '</span>';
      totalsWrap.appendChild(totalRow);

      itemsEl.appendChild(totalsWrap);

      currentRenderedItems = items;

      var itemLines = items.map(function (item) {
        var details = [];
        if (item.roastLevel) details.push('Roast: ' + item.roastLevel);
        if (item.grind) details.push('Grind: ' + item.grind);
        var detailsStr = details.length > 0 ? ' (' + details.join(', ') + ')' : '';
        return item.qty + 'x ' + item.data.label + ' ' + item.data.size + detailsStr;
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
    function setAddressFieldsState(isPickup) {
      if (!addressFields) return;
      var inputs = addressFields.querySelectorAll('input, select, textarea');
      for (var k = 0; k < inputs.length; k++) {
        inputs[k].disabled = isPickup;
      }
    }

    function updateDeliveryNote(isPickup) {
      if (!deliveryNote) return;
      deliveryNote.textContent = isPickup
        ? 'Please specify in the notes how you want to coordinate pickup.'
        : 'Available in Guilford, (North) Branford, Madison, and Durham.';
      deliveryNote.style.display = '';
    }

    for (var di = 0; di < deliveryRadios.length; di++) {
      deliveryRadios[di].addEventListener('change', function () {
        var v = this.value;
        var isPickup = (v === 'Pickup');
        if (addressFields) addressFields.style.display = isPickup ? 'none' : '';
        updateDeliveryNote(isPickup);
        setAddressFieldsState(isPickup);
        render();
      });
    }

    var initialDelivery = form.querySelector('input[name="entry.1896226742"]:checked');
    var isInitialPickup = (!initialDelivery || initialDelivery.value === 'Pickup');
    setAddressFieldsState(isInitialPickup);
    updateDeliveryNote(isInitialPickup);

    // Auto-format and validate optional phone number
    var phoneInput = document.getElementById('order-phone');
    if (phoneInput) {
      function formatPhoneNumber(val) {
        if (!val) return '';
        var digits = val.replace(/\D/g, '');
        if (digits.length > 10 && digits[0] === '1') {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3);
        return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      }

      function updatePhoneFormat(input) {
        var raw = input.value;
        var selStart = input.selectionStart || 0;
        var digitsBeforeCursor = 0;
        for (var i = 0; i < selStart; i++) {
          if (/\d/.test(raw[i])) digitsBeforeCursor++;
        }

        var formatted = formatPhoneNumber(raw);
        input.value = formatted;

        var newPos = 0;
        var count = 0;
        for (var j = 0; j < formatted.length; j++) {
          if (/\d/.test(formatted[j])) count++;
          if (count === digitsBeforeCursor) {
            newPos = j + 1;
            break;
          }
        }
        if (digitsBeforeCursor === 0) newPos = 0;
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(newPos, newPos);
        }

        var digits = formatted.replace(/\D/g, '');
        if (formatted.trim() === '' || digits.length === 10) {
          input.setCustomValidity('');
        }
      }

      phoneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' || e.keyCode === 8) {
          var pos = this.selectionStart;
          if (pos === this.selectionEnd && (pos === 4 || pos === 8)) {
            e.preventDefault();
            var val = this.value;
            this.value = val.slice(0, pos - 2) + val.slice(pos - 1);
            var nextPos = pos - 2;
            if (typeof this.setSelectionRange === 'function') {
              this.setSelectionRange(nextPos, nextPos);
            }
            updatePhoneFormat(this);
          }
        }
      });

      phoneInput.addEventListener('input', function () {
        updatePhoneFormat(this);
      });

      phoneInput.addEventListener('blur', function () {
        var digits = this.value.replace(/\D/g, '');
        if (this.value.trim() !== '' && digits.length !== 10) {
          this.setCustomValidity('Please enter a 10-digit phone number (e.g. 123-456-7890).');
        } else {
          this.setCustomValidity('');
        }
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

      var apiUrl = config.discountApiUrl;
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

      if (phoneInput && phoneInput.value.trim()) {
        var phoneDigits = phoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
          phoneInput.setCustomValidity('Please enter a 10-digit phone number (e.g. 123-456-7890).');
          if (typeof phoneInput.reportValidity === 'function') {
            phoneInput.reportValidity();
          }
          return;
        } else {
          phoneInput.setCustomValidity('');
        }
      }

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
        for (var t = 0; t < currentRenderedItems.length; t++) {
          subtotal += (currentRenderedItems[t].data.price || 0) * currentRenderedItems[t].qty;
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
      var apiUrl = config.discountApiUrl;
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

    function clearCart() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    function proceedToSubmit() {
      var redirected = false;
      function finish() {
        if (redirected) return;
        redirected = true;
        clearCart();
        window.location.href = (config.thanksUrl || '/thanks/');
      }

      iframe.onload = finish;
      setTimeout(finish, 5000);

      var delivery = form.querySelector('input[name="entry.1896226742"]:checked');
      setAddressFieldsState(!delivery || delivery.value === 'Pickup');

      form.submit();
    }

    var clearBtn = form.querySelector('.order-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearCart();
        render();
      });
    }

    window.addEventListener('pageshow', function () {
      if (submitBtn) submitBtn.disabled = false;
      if (status) {
        status.textContent = '';
        status.className = 'order-status';
      }
      var delivery = form.querySelector('input[name="entry.1896226742"]:checked');
      var isPickup = (!delivery || delivery.value === 'Pickup');
      setAddressFieldsState(isPickup);
      updateDeliveryNote(isPickup);
      render();
    });
    window.addEventListener('storage', render);
    window.addEventListener('ywr-cart-changed', render);
  };
});
