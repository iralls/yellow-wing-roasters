/**
 * Yellow Wing Roasters - Order & Subscription Unified Checkout
 * Dynamically switches between One-Time Order Mode and Subscription Mode
 * based on cart contents, manages discount codes, and submits to respective Google Forms.
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
    var totalsEl = document.getElementById('order-summary-totals');
    var summaryCountEl = document.getElementById('order-summary-count');
    var submitBtn = document.getElementById('order-submit-btn');
    var discountSection = document.getElementById('discount-code-section');
    var applyBtn = document.getElementById('apply-discount-btn');
    var discountInput = document.getElementById('discount-code-input');
    var discountStatus = document.getElementById('discount-status');

    var ORDER_FORM_ACTION = form.getAttribute('action');
    var SUB_FORM_ACTION = form.getAttribute('data-sub-action');

    var nameInput = document.getElementById('order-name');
    var emailInput = document.getElementById('order-email');
    var phoneInput = document.getElementById('order-phone');
    var deliveryFieldset = form.querySelector('.order-delivery');
    var deliveryRadios = form.querySelectorAll('.order-delivery input[type="radio"]');
    var addressFields = document.getElementById('order-address-fields');
    var deliveryNote = document.getElementById('order-delivery-note');
    var itemsHidden = document.getElementById('order-items-hidden');
    var totalHidden = document.getElementById('order-total-hidden');
    var subPriceHidden = document.getElementById('sub-price-hidden');
    var subStatusHidden = document.getElementById('sub-status-hidden');
    var subStatusDetailsHidden = document.getElementById('sub-status-details-hidden');
    var subSizeHidden = document.getElementById('sub-size-hidden');
    var subFreqHidden = document.getElementById('sub-freq-hidden');

    function setAddressFieldsState(isPickup) {
      var inputs = addressFields.querySelectorAll('input, select');
      for (var k = 0; k < inputs.length; k++) {
        inputs[k].disabled = isPickup;
        if (isPickup) {
          inputs[k].removeAttribute('required');
        } else {
          inputs[k].setAttribute('required', 'true');
        }
      }
    }

    function updateDeliveryNote(isPickup) {
      deliveryNote.textContent = deliveryNote.getAttribute(isPickup ? 'data-pickup-msg' : 'data-delivery-msg');
      deliveryNote.style.display = '';
    }

    function generateGiftCode() {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      var code = 'GIFT-';
      for (var i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    function computeTotals(items) {
      var subtotal = 0;
      var roastSubtotal = 0;
      for (var t = 0; t < items.length; t++) {
        var lineTotal = (items[t].data.price || 0) * items[t].qty;
        subtotal += lineTotal;
        if (items[t].type !== 'subscription' && items[t].type !== 'gift') {
          roastSubtotal += lineTotal;
        }
      }

      var discountValue = 0;
      if (appliedDiscount && roastSubtotal > 0) {
        if (appliedDiscount.type === 'percent') {
          discountValue = Math.round(roastSubtotal * (appliedDiscount.value / 100) * 100) / 100;
        } else if (appliedDiscount.type === 'flat') {
          discountValue = Math.min(roastSubtotal, appliedDiscount.value);
        }
      }

      return {
        subtotal: subtotal,
        roastSubtotal: roastSubtotal,
        discountValue: discountValue,
        grandTotal: Math.max(0, subtotal - discountValue),
        orderTotal: Math.max(0, roastSubtotal - discountValue)
      };
    }

    function formatOrderItemLines(items) {
      return items.map(function (item) {
        var details = [];
        if (typeof item.data.price === 'number' || (item.data.price && !isNaN(parseFloat(item.data.price)))) {
          details.push('Price: $' + parseFloat(item.data.price).toFixed(2));
        }
        if (item.subtitle) {
          var prefix = 'Picks: ';
          if (item.data.roast === 'build-your-own-blend') prefix = 'Recipe: ';
          else if (item.data.roast === 'bring-your-own-beans') prefix = 'Link: ';
          else if (item.data.roast === 'book-your-own-bootcamp' || item.data.roast === 'bib-your-own-bath') prefix = 'Session: ';
          details.push(prefix + item.subtitle);
        }
        if (item.roastLevel) details.push('Roast: ' + item.roastLevel);
        if (item.grind) details.push('Grind: ' + item.grind);
        if (item.notes) details.push('Notes: ' + item.notes);
        var detailsStr = details.length > 0 ? ' (' + details.join('; ') + ')' : '';
        return item.qty + 'x ' + item.data.label + (item.data.size ? ' ' + item.data.size : '') + detailsStr;
      }).join(', ');
    }

    function loadCart() {
      if (typeof window.ywrGetCart === 'function') {
        return window.ywrGetCart();
      }
      try {
        var raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        var changed = false;
        (Array.isArray(raw) ? raw : Object.values(raw)).forEach(function(it) {
          if (it && it.subtitle && typeof it.subtitle === 'string' && it.subtitle.indexOf('&bull;') !== -1) {
            it.subtitle = it.subtitle.replace(/&bull;/g, '·');
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
        }
        return raw;
      } catch (e) {
        return [];
      }
    }

    function saveCart(c) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      } catch (e) {
        console.error('saveCart: Failed to save cart to localStorage:', e);
      }
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    // Auto-populate from URL query params (?roast=..., ?code=...)
    (function handleQueryParams() {
      if (typeof window === 'undefined' || !window.location.search) return;
      var params = new URLSearchParams(window.location.search);

      var qpCode = params.get('code');
      if (qpCode) {
        try {
          sessionStorage.setItem('ywr_gift_code', qpCode.trim().toUpperCase());
        } catch (e) {}
      }

      var qpRoast = params.get('roast');
      if (qpRoast) {
        var subData = (typeof window !== 'undefined' && window.YWR_SUBSCRIPTIONS_DATA) ? window.YWR_SUBSCRIPTIONS_DATA : {};
        var rData = (typeof window !== 'undefined' && window.YWR_ROASTS_DATA) ? window.YWR_ROASTS_DATA : {};
        var sEntry = subData[qpRoast];
        var rEntry = rData[qpRoast];
        var entry = sEntry || rEntry;
        if (entry) {
          var qpFreq = params.get('frequency');
          var qpSize = params.get('size');
          var qpGrind = params.get('grind');

          var isDedicatedSub = !!sEntry;
          var isSubProduct = isDedicatedSub || (qpFreq !== null);

          var defaultGrind = (typeof window !== 'undefined' && window.YWR_DEFAULT_GRIND) || 'Whole Bean';
          var grindVal = qpGrind || defaultGrind;
          var sizeVal = qpSize || (sEntry ? sEntry.sizes[0] : Object.keys(rEntry.prices)[0]);

          var item = null;
          if (isSubProduct) {
            var unitPrice = (entry.prices && typeof entry.prices[sizeVal] === 'number') ? entry.prices[sizeVal] : 0;
            var freqVal = qpFreq || (sEntry && sEntry.frequencies ? sEntry.frequencies[0] : null);
            item = {
              type: 'subscription',
              slug: qpRoast,
              title: sEntry ? sEntry.title : rEntry.title,
              subtitle: (sEntry && sEntry.subtitle) || '',
              size: sizeVal,
              grind: grindVal,
              frequency: freqVal,
              price: unitPrice,
              mascot: entry.mascot || null,
              qty: 1
            };
          } else if (rEntry) {
            var unitPrice = (rEntry.prices && typeof rEntry.prices[sizeVal] === 'number') ? rEntry.prices[sizeVal] : 0;
            item = {
              type: 'roast',
              slug: qpRoast,
              title: rEntry.title,
              size: sizeVal,
              grind: grindVal,
              price: unitPrice,
              mascot: rEntry.mascot || null,
              qty: 1
            };
          }

          if (item) {
            window.ywrAddToCart(item, 1);
          }
        }
      }

      // Immediately clear query params from address bar so reloads do not re-add items or re-trigger params
      if ((qpRoast || qpCode) && window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    })();

    var appliedDiscount = null;
    var currentRenderedItems = [];
    var currentMode = 'order'; // 'order' or 'subscribe'

    function render() {
      var cartList = Object.values(loadCart()).filter(function (it) { return it && it.qty > 0; });
      var hasRoasts = cartList.some(function (it) { return it.type !== 'subscription' && it.type !== 'gift'; });
      var hasSubscriptions = cartList.some(function (it) { return it.type === 'subscription'; });
      var hasGifts = cartList.some(function (it) { return it.type === 'gift'; });
      var needsDelivery = hasRoasts || hasSubscriptions;

      var items = cartList.map(function (it) {
        var isSub = (it.type === 'subscription');
        var metaParts = [];
        if (it.size) metaParts.push(it.size);
        if (it.roastLevel) metaParts.push(it.roastLevel);
        if (it.grind) metaParts.push(it.grind);
        if (it.frequency) metaParts.push(it.frequency);
        if (it.subtitle && it.type === 'flight') metaParts.push(it.subtitle);

        var label = it.title + (it.variant ? ' — ' + it.variant : '');
        var formName = it.title + (it.size ? ' ' + it.size : '') + (it.grind ? ' (Grind: ' + it.grind + ')' : '');

        return {
          data: {
            roast: it.slug,
            variant: it.variant || '',
            size: it.size || '',
            label: label,
            formName: formName,
            mascot: it.mascot,
            dots: it.dots || 0,
            price: it.price || 0,
            description: it.description || '',
            subtitle: it.subtitle || '',
            roasts: it.roasts || null,
            notes: it.notes || '',
            type: it.type || ''
          },
          key: it.id,
          qty: it.qty,
          grind: it.grind,
          roastLevel: it.roastLevel,
          frequency: it.frequency,
          subtitle: it.subtitle || '',
          roasts: it.roasts || null,
          notes: it.notes || '',
          type: it.type || '',
          recipientName: it.recipientName || '',
          recipientEmail: it.recipientEmail || '',
          senderName: it.senderName || '',
          senderEmail: it.senderEmail || '',
          isSubscription: isSub
        };
      });

      if (items.length === 0) {
        form.style.display = 'none';
        emptyEl.style.display = '';
        return;
      }

      form.style.display = '';
      emptyEl.style.display = 'none';
      itemsEl.innerHTML = '';

      currentMode = hasRoasts ? 'order' : (hasSubscriptions ? 'subscribe' : 'gift');

      // Pre-fill purchaser name & email from gift card item if inputs are blank
      if (hasGifts) {
        var firstGift = items.find(function (it) { return it.type === 'gift'; });
        if (firstGift) {
          if (!nameInput.value && firstGift.senderName) nameInput.value = firstGift.senderName;
          if (!emailInput.value && firstGift.senderEmail) emailInput.value = firstGift.senderEmail;
        }
      }

      // Adapt delivery & address visibility
      deliveryFieldset.style.display = needsDelivery ? '' : 'none';
      var checkedDelivery = form.querySelector('.order-delivery input[type="radio"]:checked');
      var isPickup = !needsDelivery || (!checkedDelivery || checkedDelivery.value === 'Pickup');
      addressFields.style.display = (needsDelivery && !isPickup) ? '' : 'none';
      setAddressFieldsState(isPickup);

      if (submitBtn) {
        if (!hasRoasts && !hasSubscriptions && hasGifts) {
          submitBtn.textContent = 'Order Gift Card';
        } else if (!hasRoasts && hasSubscriptions && !hasGifts) {
          submitBtn.textContent = 'Start Subscription';
        } else {
          submitBtn.textContent = 'Place Order';
        }
      }

      var totalQty = 0;
      for (var q = 0; q < items.length; q++) {
        totalQty += items[q].qty;
      }
      if (summaryCountEl) {
        summaryCountEl.style.display = '';
        summaryCountEl.textContent = totalQty + (totalQty === 1 ? ' item' : ' items');
      }

      // Discount codes apply only when there is at least one physical roast item
      if (discountSection) {
        discountSection.style.display = hasRoasts ? '' : 'none';
      }
      if (!hasRoasts) {
        appliedDiscount = null;
      } else {
        populateGiftCodeInput();
      }

      // Render Item Cards
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var card = document.createElement('div');
        card.className = 'order-cart-card';

        // Thumbnail with count badge
        var thumb = document.createElement('div');
        thumb.className = 'order-cart-card-thumb';
        if (item.data.mascot) {
          var img = document.createElement('img');
          img.className = 'order-cart-card-img';
          img.src = '/images/' + item.data.mascot;
          img.alt = item.data.label;
          img.setAttribute('aria-hidden', 'true');
          img.onerror = function () { this.style.display = 'none'; };
          thumb.appendChild(img);
        } else {
          var ph = document.createElement('span');
          ph.className = 'order-cart-card-ph';
          ph.setAttribute('aria-hidden', 'true');
          ph.textContent = '☕';
          thumb.appendChild(ph);
        }

        if (!item.isSubscription) {
          var badge = document.createElement('span');
          badge.className = 'order-cart-card-badge';
          badge.textContent = item.qty;
          thumb.appendChild(badge);
        }
        card.appendChild(thumb);

        // Info
        var info = document.createElement('div');
        info.className = 'order-cart-card-info';

        var title = document.createElement('div');
        title.className = 'order-cart-card-title';
        title.textContent = item.data.label;
        info.appendChild(title);

        var meta = document.createElement('div');
        meta.className = 'order-cart-card-meta';
        var metaText = document.createElement('span');
        var metaParts = [];
        if (item.data.size) metaParts.push(item.data.size);
        if (item.roastLevel) metaParts.push(item.roastLevel);
        if (item.grind) metaParts.push(item.grind);
        if (item.isSubscription && item.frequency) metaParts.push(item.frequency);
        metaText.textContent = metaParts.join(' · ');
        meta.appendChild(metaText);
        info.appendChild(meta);

        if (item.subtitle) {
          var picksEl = document.createElement('div');
          picksEl.className = 'order-cart-card-picks';
          var prefix = '';
          var roastSlug = item.data.roast || item.slug || '';
          if (roastSlug === 'peck-your-own') prefix = 'Picks: ';
          else if (roastSlug === 'build-your-own-blend') prefix = 'Recipe: ';
          else if (roastSlug === 'bring-your-own-beans') prefix = 'Bean Link: ';
          else if (roastSlug === 'book-your-own-bootcamp' || roastSlug === 'bib-your-own-bath') prefix = 'Session: ';
          var cleanSub = (item.subtitle || '').replace(/&bull;/g, '·');
          picksEl.textContent = prefix + cleanSub;
          info.appendChild(picksEl);
        }

        if (item.notes) {
          var notesEl = document.createElement('div');
          notesEl.className = 'order-cart-card-picks';
          notesEl.style.fontStyle = 'italic';
          notesEl.textContent = 'Instructions: ' + item.notes;
          info.appendChild(notesEl);
        }
        card.appendChild(info);

        // Actions & line total
        var actions = document.createElement('div');
        actions.className = 'order-cart-card-actions';

        var lineTotal = (item.data.price || 0) * item.qty;
        var totalEl = document.createElement('div');
        totalEl.className = 'order-cart-card-total';
        if (item.data.price === 0) {
          totalEl.innerHTML = '$0 <span style="font-size:0.7rem; font-weight:normal; color:#887465; display:block;">(Invoiced later)</span>';
        } else {
          totalEl.textContent = '$' + lineTotal;
        }
        actions.appendChild(totalEl);

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'order-cart-card-remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', 'Remove ' + item.data.label);
        actions.appendChild(removeBtn);

        card.appendChild(actions);

        (function (k, idx) {
          removeBtn.addEventListener('click', function () {
            var c = loadCart();
            if (Array.isArray(c)) {
              c.splice(idx, 1);
            } else {
              delete c[k];
            }
            saveCart(c);
            render();
          });
        })(item.key, i);

        itemsEl.appendChild(card);
      }

      // Calculate totals
      var totals = computeTotals(items);
      var subtotal = totals.subtotal;
      var discountValue = totals.discountValue;
      var grandTotal = totals.grandTotal;

      // Render totals section
      if (totalsEl) {
        totalsEl.innerHTML = '';
        var totalsWrap = document.createElement('div');
        totalsWrap.className = 'order-cart-summary-totals';

        if (discountValue > 0) {
          var subtotalRow = document.createElement('div');
          subtotalRow.className = 'order-cart-summary-row';
          subtotalRow.innerHTML = '<span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span>';
          totalsWrap.appendChild(subtotalRow);

          var discountRow = document.createElement('div');
          discountRow.className = 'order-cart-summary-row order-cart-summary-row--discount';
          discountRow.innerHTML = '<span>Discount (' + appliedDiscount.code + ')</span><span>-$' + discountValue.toFixed(2) + '</span>';
          totalsWrap.appendChild(discountRow);
        }

        var totalRow = document.createElement('div');
        totalRow.className = 'order-cart-summary-row order-cart-summary-row--total';
        totalRow.innerHTML = '<span class="order-cart-total-label">Total</span><span class="order-cart-total-value">$' + grandTotal.toFixed(2) + '</span>';
        totalsWrap.appendChild(totalRow);

        totalsEl.appendChild(totalsWrap);
      }

      currentRenderedItems = items;
    }

    // Discount Code & Gift Card Handling
    function hasRoastItemsInCart(list) {
      return list.some(function (it) { return it.type !== 'subscription' && it.type !== 'gift'; });
    }

    function populateGiftCodeInput() {
      if (appliedDiscount || !discountInput) return;
      var cartList = Object.values(loadCart()).filter(function (it) { return it && it.qty > 0; });
      if (cartList.length === 0 || !hasRoastItemsInCart(cartList)) return;

      var savedCode = null;
      try {
        savedCode = sessionStorage.getItem('ywr_gift_code');
      } catch (e) {}

      if (savedCode && !discountInput.value) {
        discountInput.value = savedCode;
      }
    }

    if (applyBtn && discountInput && discountStatus) {
      applyBtn.addEventListener('click', function () {
        if (!currentRenderedItems || !hasRoastItemsInCart(currentRenderedItems)) {
          appliedDiscount = null;
          return;
        }
        var code = discountInput.value.trim().toUpperCase();
        if (!code) {
          appliedDiscount = null;
          discountStatus.textContent = '';
          discountStatus.className = 'discount-status';
          try {
            sessionStorage.removeItem('ywr_gift_code');
          } catch (e) {}
          render();
          return;
        }

        discountStatus.textContent = 'Verifying...';
        discountStatus.className = 'discount-status is-pending';

        var apiUrl = config.discountApiUrl;
        if (!apiUrl || apiUrl.trim() === '') {
          discountStatus.textContent = 'Discount service unavailable.';
          discountStatus.className = 'discount-status is-error';
          return;
        }

        var verifyUrl = apiUrl + '?action=verify&code=' + encodeURIComponent(code);

        fetch(verifyUrl)
          .then(function (response) { return response.json(); })
          .then(function (data) {
            if (data.valid) {
              appliedDiscount = {
                code: code,
                type: data.type,
                value: data.value,
                description: data.description || ''
              };
              discountStatus.textContent = 'Discount applied: ' + (data.description || code);
              discountStatus.className = 'discount-status is-success';
              try {
                sessionStorage.setItem('ywr_gift_code', code);
              } catch (e) {}
            } else {
              appliedDiscount = null;
              discountStatus.textContent = data.message || 'Invalid discount code.';
              discountStatus.className = 'discount-status is-error';
              try {
                sessionStorage.removeItem('ywr_gift_code');
              } catch (e) {}
            }
            render();
          })
          .catch(function (err) {
            console.error('Validation fetch error:', err);
            discountStatus.textContent = 'Could not verify code. Please try again.';
            discountStatus.className = 'discount-status is-error';
            appliedDiscount = null;
            render();
          });
      });

      discountInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!currentRenderedItems || !hasRoastItemsInCart(currentRenderedItems)) {
            appliedDiscount = null;
            return;
          }
          applyBtn.click();
        }
      });
    }

    render();
    window.addEventListener('ywr-cart-changed', render);
    window.addEventListener('storage', render);

    // Delivery Method Radio Handling
    for (var di = 0; di < deliveryRadios.length; di++) {
      deliveryRadios[di].addEventListener('change', function () {
        var v = this.value;
        var isPickup = (v === 'Pickup');
        addressFields.style.display = isPickup ? 'none' : '';
        updateDeliveryNote(isPickup);
        setAddressFieldsState(isPickup);
        render();
      });
    }

    var initialDelivery = form.querySelector('.order-delivery input[type="radio"]:checked');
    var isInitialPickup = (!initialDelivery || initialDelivery.value === 'Pickup');
    updateDeliveryNote(isInitialPickup);

    // Auto-format and validate optional phone number
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

    var status = form.querySelector('.order-status');

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

      var userNotes = document.getElementById('order-notes').value.trim();
      var totals = computeTotals(currentRenderedItems);
      var discountValue = totals.discountValue;

      // Dynamic gift card redemption lookup/subtraction
      var apiUrl = config.discountApiUrl;
      if (appliedDiscount && discountValue > 0 && appliedDiscount.code.indexOf('GIFT-') === 0 && apiUrl && apiUrl.trim() !== '') {
        var redeemUrl = apiUrl + '?action=redeem&code=' + encodeURIComponent(appliedDiscount.code) + '&amount=' + encodeURIComponent(discountValue);

        fetch(redeemUrl)
          .then(function (response) { return response.json(); })
          .then(function () { proceedToSubmit(userNotes, discountValue, totals.orderTotal); })
          .catch(function (err) {
            console.error('Failed to deduct gift card amount:', err);
            proceedToSubmit(userNotes, discountValue, totals.orderTotal);
          });
      } else {
        proceedToSubmit(userNotes, discountValue, totals.orderTotal);
      }
    });

    function clearCart() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('clearCart: Failed to clear localStorage ywr_cart:', e);
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('clearCart: Failed to clear sessionStorage ywr_cart:', e);
      }
      try {
        sessionStorage.removeItem('ywr_gift_code');
      } catch (e) {
        console.warn('clearCart: Failed to clear sessionStorage ywr_gift_code:', e);
      }
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    function postForm(url, params, errorLabel) {
      return fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).catch(function (err) {
        console.error(errorLabel, err);
      });
    }

    function proceedToSubmit(userNotes, discountValue, orderTotal) {
      var roastItems = currentRenderedItems.filter(function (it) { return it.type !== 'subscription' && it.type !== 'gift'; });
      var subItems = currentRenderedItems.filter(function (it) { return it.type === 'subscription'; });
      var giftItems = currentRenderedItems.filter(function (it) { return it.type === 'gift'; });

      var needsDelivery = roastItems.length > 0 || subItems.length > 0;
      var delivery = form.querySelector('.order-delivery input[type="radio"]:checked');
      var isPickup = !needsDelivery || (!delivery || delivery.value === 'Pickup');
      setAddressFieldsState(isPickup);

      var customerName = nameInput.value;
      var customerEmail = emailInput.value;
      var customerPhone = phoneInput.value;
      var deliveryMethod = isPickup ? 'Pickup' : 'Hand delivery';
      var addressVal = isPickup ? '' : document.getElementById('order-address').value;
      var cityVal = isPickup ? '' : document.getElementById('order-city').value;
      var stateVal = isPickup ? '' : document.getElementById('order-state').value;
      var zipVal = isPickup ? '' : document.getElementById('order-zip').value;

      var requests = [];
      var generatedGiftCodes = [];

      // 1. Physical roasts: single batch submission
      if (roastItems.length > 0) {
        var oe = config.orderEntries;
        var orderNotes = userNotes;
        if (appliedDiscount && discountValue > 0) {
          var notesPrefix = '[DISCOUNT: ' + appliedDiscount.code + ' (-$' + discountValue.toFixed(2) + ')]';
          orderNotes = userNotes ? notesPrefix + ' | ' + userNotes : notesPrefix;
        }

        var orderParams = new URLSearchParams();
        orderParams.append(oe.name, customerName);
        orderParams.append(oe.email, customerEmail);
        if (customerPhone) orderParams.append(oe.phone, customerPhone);
        orderParams.append(oe.delivery, deliveryMethod);
        if (!isPickup) {
          orderParams.append(oe.address, addressVal);
          orderParams.append(oe.city, cityVal);
          orderParams.append(oe.state, stateVal);
          orderParams.append(oe.zip, zipVal);
        }
        if (orderNotes) orderParams.append(oe.notes, orderNotes);
        orderParams.append(oe.items, formatOrderItemLines(roastItems));
        orderParams.append(oe.total, '$' + orderTotal.toFixed(2));
        requests.push(postForm(ORDER_FORM_ACTION, orderParams, 'Order submission error:'));
      }

      // 2. Subscriptions: individual submission per subscription item
      if (subItems.length > 0) {
        var se = config.subscriptionEntries;
        subItems.forEach(function (it) {
          for (var q = 0; q < it.qty; q++) {
            var subParams = new URLSearchParams();
            subParams.append(se.name, customerName);
            subParams.append(se.email, customerEmail);
            if (customerPhone) subParams.append(se.phone, customerPhone);
            subParams.append(se.delivery, deliveryMethod);
            if (!isPickup) {
              subParams.append(se.address, addressVal);
              subParams.append(se.city, cityVal);
              subParams.append(se.state, stateVal);
              subParams.append(se.zip, zipVal);
            }
            if (userNotes) subParams.append(se.notes, userNotes);
            subParams.append(se.roast, it.data.roast + ' (Grind: ' + it.grind + ')');
            subParams.append(se.size, it.data.size);
            subParams.append(se.frequency, it.frequency);
            subParams.append(se.price, '$' + it.data.price);
            subParams.append(se.status, 'Active');
            subParams.append(se.status_details, '');
            requests.push(postForm(SUB_FORM_ACTION, subParams, 'Subscription submission error:'));
          }
        });
      }

      // 3. Digital gift cards: individual submission per gift card
      if (giftItems.length > 0) {
        var ge = config.digitalGiftEntries;
        var giftUrl = config.digitalGiftUrl;
        giftItems.forEach(function (it) {
          for (var q = 0; q < it.qty; q++) {
            var giftCode = generateGiftCode();
            generatedGiftCodes.push(giftCode);

            var giftParams = new URLSearchParams();
            giftParams.append(ge.purchaser_name, customerName || it.senderName || '');
            giftParams.append(ge.purchaser_email, customerEmail || it.senderEmail || '');
            giftParams.append(ge.amount, String(parseFloat(it.data.price)));
            giftParams.append(ge.gift_code, giftCode);
            giftParams.append(ge.recipient_name, it.recipientName || '');
            giftParams.append(ge.recipient_email, it.recipientEmail || '');
            giftParams.append(ge.gift_message, it.notes || '');
            if (userNotes) giftParams.append(ge.notes, userNotes);
            requests.push(postForm(giftUrl, giftParams, 'Gift card submission error:'));
          }
        });
      }

      var redirected = false;
      function finish() {
        if (redirected) return;
        redirected = true;
        clearCart();
        var dest = config.thanksUrl || '/thanks/';
        if (generatedGiftCodes.length > 0) {
          dest += '?code=' + encodeURIComponent(generatedGiftCodes.join(', '));
        }
        window.location.href = dest;
      }

      if (requests.length === 0) {
        finish();
        return;
      }

      var safetyTimer = setTimeout(finish, 4000);
      Promise.all(requests).then(function () {
        clearTimeout(safetyTimer);
        finish();
      }).catch(function () {
        clearTimeout(safetyTimer);
        finish();
      });
    }

    window.addEventListener('pageshow', function () {
      if (status) {
        status.textContent = '';
        status.className = 'order-status';
      }
      if (submitBtn) submitBtn.disabled = false;
      render();
    });
  };
});
