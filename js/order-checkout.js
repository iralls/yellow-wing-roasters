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
    var pageTitleEl = document.getElementById('order-page-title');
    var summaryCountEl = document.getElementById('order-summary-count');
    var submitBtn = document.getElementById('order-submit-btn') || (form ? form.querySelector('.order-submit') : null);
    var discountSection = document.getElementById('discount-code-section');

    if (!form || !emptyEl || !itemsEl) return;

    var ORDER_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse';
    var SUB_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse';

    var emailInput = document.getElementById('order-email');
    var phoneInput = document.getElementById('order-phone');
    var itemsHidden = document.getElementById('order-items-hidden');
    var totalHidden = document.getElementById('order-total-hidden');
    var subPriceHidden = document.getElementById('sub-price-hidden');
    var subStatusHidden = document.getElementById('sub-status-hidden');
    var subStatusDetailsHidden = document.getElementById('sub-status-details-hidden');
    var subSizeHidden = document.getElementById('sub-size-hidden');
    var subFreqHidden = document.getElementById('sub-freq-hidden');

    function loadCart() {
      return window.ywrGetCart();
    }

    function saveCart(c) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
    }

    // Auto-populate from URL query params if user arrived with ?roast=...
    (function handleQueryParams() {
      if (typeof window === 'undefined' || !window.location.search) return;
      var params = new URLSearchParams(window.location.search);
      var qpRoast = params.get('roast');
      if (!qpRoast) return;

      var qpFreq = params.get('frequency');
      var qpSize = params.get('size') || '12oz';
      var qpGrind = params.get('grind') || 'Whole Bean';

      var subData = (typeof window !== 'undefined' && window.YWR_SUBSCRIPTIONS_DATA) ? window.YWR_SUBSCRIPTIONS_DATA : {};
      var rData = (typeof window !== 'undefined' && window.YWR_ROASTS_DATA) ? window.YWR_ROASTS_DATA : {};
      var sEntry = subData[qpRoast];
      var rEntry = rData[qpRoast];
      var isDedicatedSub = !!sEntry;
      var isSubProduct = isDedicatedSub || (qpFreq !== null);

      var item = null;
      if (isSubProduct) {
        var entry = sEntry || rEntry;
        var unitPrice = (entry && entry.prices && typeof entry.prices[qpSize] === 'number') ? entry.prices[qpSize] : 0;
        var freqVal = qpFreq || (sEntry && sEntry.frequencies && sEntry.frequencies[0]) || 'Every 2 weeks';
        item = {
          type: 'subscription',
          slug: qpRoast,
          title: sEntry ? sEntry.title : (rEntry ? rEntry.title : qpRoast),
          subtitle: (sEntry && sEntry.subtitle) || '',
          size: qpSize,
          grind: qpGrind,
          frequency: freqVal,
          price: unitPrice,
          mascot: (entry && entry.mascot) || null,
          qty: 1
        };
      } else if (rEntry) {
        var unitPrice = (rEntry.prices && typeof rEntry.prices[qpSize] === 'number') ? rEntry.prices[qpSize] : 0;
        item = {
          type: 'roast',
          slug: qpRoast,
          title: rEntry.title,
          size: qpSize,
          grind: qpGrind,
          price: unitPrice,
          mascot: rEntry.mascot || null,
          qty: 1
        };
      }

      if (item) {
        window.ywrAddToCart(item, 1);
      }

      // Immediately clear query params from address bar so reloads do not re-add items
      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    })();

    var appliedDiscount = null;
    var currentRenderedItems = [];
    var currentMode = 'order'; // 'order' or 'subscribe'

    function render() {
      var cartList = Object.values(loadCart()).filter(function (it) { return it && it.qty > 0; });
      var hasSubscriptions = cartList.some(function (it) { return it.type === 'subscription'; });
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
            description: it.description || ''
          },
          key: it.id,
          qty: it.qty,
          grind: it.grind,
          roastLevel: it.roastLevel,
          frequency: it.frequency,
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

      currentMode = hasSubscriptions ? 'subscribe' : 'order';

      // Adapt header and form mode
      if (currentMode === 'subscribe') {
        if (pageTitleEl) pageTitleEl.textContent = 'Subscribe';
        document.title = 'Subscribe · Yellow Wing Roasters';
        if (submitBtn) submitBtn.textContent = 'Subscribe';

        form.action = SUB_FORM_ACTION;
        if (emailInput) emailInput.name = 'entry.65766604';
        if (phoneInput) phoneInput.name = 'entry.1484480937';
        if (itemsHidden) itemsHidden.name = 'entry.1935997805';
        if (totalHidden) totalHidden.removeAttribute('name');
        if (subPriceHidden) subPriceHidden.name = 'entry.903789519';
        if (subStatusHidden) subStatusHidden.name = 'entry.1261348961';
        if (subStatusDetailsHidden) subStatusDetailsHidden.name = 'entry.1336119512';
        if (subSizeHidden) subSizeHidden.name = 'entry.1606791078';
        if (subFreqHidden) subFreqHidden.name = 'entry.2064801247';

        // Subscriptions do not support discount codes
        appliedDiscount = null;
      } else {
        if (pageTitleEl) pageTitleEl.textContent = 'Order';
        document.title = 'Order · Yellow Wing Roasters';
        if (submitBtn) submitBtn.textContent = 'Place order';

        form.action = ORDER_FORM_ACTION;
        if (emailInput) emailInput.name = 'entry.40149380';
        if (phoneInput) phoneInput.name = 'entry.1852073865';
        if (itemsHidden) itemsHidden.name = 'entry.1935997805';
        if (totalHidden) totalHidden.name = 'entry.552044967';
        if (subPriceHidden) subPriceHidden.removeAttribute('name');
        if (subStatusHidden) subStatusHidden.removeAttribute('name');
        if (subStatusDetailsHidden) subStatusDetailsHidden.removeAttribute('name');
        if (subSizeHidden) subSizeHidden.removeAttribute('name');
        if (subFreqHidden) subFreqHidden.removeAttribute('name');
      }

      var totalQty = 0;
      for (var q = 0; q < items.length; q++) {
        totalQty += items[q].qty;
      }
      if (summaryCountEl) {
        summaryCountEl.style.display = '';
        summaryCountEl.textContent = totalQty + (totalQty === 1 ? ' item' : ' items');
      }

      // Discount code display strictly depends on whether there is at least one subscription in the cart
      if (discountSection) {
        discountSection.style.display = hasSubscriptions ? 'none' : '';
      }
      if (hasSubscriptions) {
        appliedDiscount = null;
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
        var metaParts = [item.data.size];
        if (item.roastLevel) metaParts.push(item.roastLevel);
        if (item.grind) metaParts.push(item.grind);
        if (item.isSubscription && item.frequency) metaParts.push(item.frequency);
        metaText.textContent = metaParts.join(' · ');
        meta.appendChild(metaText);
        info.appendChild(meta);
        card.appendChild(info);

        // Actions & line total
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

      // Calculate totals
      var subtotal = 0;
      for (var t = 0; t < items.length; t++) {
        subtotal += (items[t].data.price || 0) * items[t].qty;
      }

      var discountValue = 0;
      if (appliedDiscount && currentMode === 'order') {
        if (appliedDiscount.type === 'percent') {
          discountValue = Math.round(subtotal * (appliedDiscount.value / 100) * 100) / 100;
        } else if (appliedDiscount.type === 'flat') {
          discountValue = Math.min(subtotal, appliedDiscount.value);
        }
      }

      var grandTotal = Math.max(0, subtotal - discountValue);

      // Render totals section
      if (totalsEl) {
        totalsEl.innerHTML = '';
        var totalsWrap = document.createElement('div');
        totalsWrap.className = 'order-cart-summary-totals';

        // Subtotal & discount rows only appear for one-time orders when a discount is active
        if (currentMode !== 'subscribe' && discountValue > 0) {
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

      // Update hidden inputs for Google Forms
      if (currentMode === 'subscribe') {
        var subItem = items[0] || {};
        var roastVal = items.map(function (it) {
          return (it.data.roast || '') + ' (Grind: ' + (it.grind || 'Whole Bean') + ')';
        }).join(', ');

        if (itemsHidden) itemsHidden.value = roastVal;
        if (subPriceHidden) subPriceHidden.value = '$' + grandTotal;
        if (subSizeHidden) subSizeHidden.value = subItem.data ? subItem.data.size : '12oz';
        if (subFreqHidden) subFreqHidden.value = subItem.frequency || 'Every 2 weeks';
        if (subStatusHidden) subStatusHidden.value = 'Active';
      } else {
        var itemLines = items.map(function (item) {
          var details = [];
          if (item.roastLevel) details.push('Roast: ' + item.roastLevel);
          if (item.grind) details.push('Grind: ' + item.grind);
          var detailsStr = details.length > 0 ? ' (' + details.join(', ') + ')' : '';
          return item.qty + 'x ' + item.data.label + ' ' + item.data.size + detailsStr;
        }).join(', ');

        if (itemsHidden) itemsHidden.value = itemLines;
        if (totalHidden) totalHidden.value = '$' + grandTotal.toFixed(2);
      }
    }

    render();
    window.addEventListener('ywr-cart-changed', render);
    window.addEventListener('storage', render);

    // Delivery Method Radio Handling
    var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
    var addressFields = document.getElementById('order-address-fields');
    var deliveryNote = document.getElementById('order-delivery-note');

    function setAddressFieldsState(isPickup) {
      if (!addressFields) return;
      var inputs = addressFields.querySelectorAll('input, select');
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

    // Apply Discount Button Click Handler (Sidebar)
    var applyBtn = document.getElementById('apply-discount-btn');
    var discountInput = document.getElementById('discount-code-input');
    var discountStatus = document.getElementById('discount-status');

    if (applyBtn && discountInput && discountStatus) {
      applyBtn.addEventListener('click', function () {
        if (currentMode !== 'order' || (currentRenderedItems && currentRenderedItems.some(function (it) { return it.isSubscription; }))) {
          appliedDiscount = null;
          return;
        }
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
        if (!apiUrl || apiUrl.trim() === '') {
          discountStatus.textContent = 'Discount service unavailable.';
          discountStatus.style.color = '#d32f2f';
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

      discountInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (currentMode !== 'order' || (currentRenderedItems && currentRenderedItems.some(function (it) { return it.isSubscription; }))) {
            appliedDiscount = null;
            return;
          }
          applyBtn.click();
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

      // Handle Notes formatting
      var userNotes = document.getElementById('order-notes').value.trim();
      var finalNotes = userNotes;

      var discountValue = 0;
      if (appliedDiscount && currentMode === 'order') {
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

      // Dynamic gift card redemption lookup/subtraction (Order mode only)
      var apiUrl = config.discountApiUrl;
      if (currentMode === 'order' && appliedDiscount && appliedDiscount.code.indexOf('GIFT-') === 0 && apiUrl && apiUrl.trim() !== '') {
        var redeemUrl = apiUrl + '?action=redeem&code=' + encodeURIComponent(appliedDiscount.code) + '&amount=' + encodeURIComponent(discountValue);

        fetch(redeemUrl)
          .then(function (response) { return response.json(); })
          .then(function () { proceedToSubmit(); })
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

      var delivery = form.querySelector('input[name="entry.1896226742"]:checked');
      var isPickup = (!delivery || delivery.value === 'Pickup');
      setAddressFieldsState(isPickup);

      if (currentMode === 'subscribe' && typeof window.fetch === 'function') {
        var subItems = currentRenderedItems.filter(function (it) { return it.isSubscription; });
        if (subItems.length === 0) {
          finish();
          return;
        }

        var customerName = (document.getElementById('order-name') || {}).value || '';
        var customerEmail = (emailInput || {}).value || '';
        var customerPhone = (phoneInput || {}).value || '';
        var deliveryMethod = isPickup ? 'Pickup' : 'Hand delivery';
        var addressVal = (document.getElementById('order-address') || {}).value || '';
        var cityVal = (document.getElementById('order-city') || {}).value || '';
        var stateVal = (document.getElementById('order-state') || {}).value || '';
        var zipVal = (document.getElementById('order-zip') || {}).value || '';
        var notesVal = (document.getElementById('order-notes') || {}).value || '';

        var safetyTimer = setTimeout(finish, 4000);

        var requests = subItems.map(function (it) {
          var params = new URLSearchParams();
          params.append('entry.1153405702', customerName);
          params.append('entry.65766604', customerEmail);
          if (customerPhone) params.append('entry.1484480937', customerPhone);
          params.append('entry.1896226742', deliveryMethod);
          if (!isPickup) {
            params.append('entry.148046999', addressVal);
            params.append('entry.1534670804', cityVal);
            params.append('entry.414179858', stateVal);
            params.append('entry.1472936948', zipVal);
          }
          if (notesVal) params.append('entry.1381358427', notesVal);

          var roastVal = (it.data.roast || '') + ' (Grind: ' + (it.grind || 'Whole Bean') + ')';
          params.append('entry.1935997805', roastVal);
          params.append('entry.1606791078', it.data.size || '12oz');
          params.append('entry.2064801247', it.frequency || 'Every 2 weeks');
          params.append('entry.903789519', '$' + (it.data.price || 0));
          params.append('entry.1261348961', 'Active');
          params.append('entry.1336119512', '');

          return fetch(SUB_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          }).catch(function (err) {
            console.error('Subscription submission error:', err);
          });
        });

        Promise.all(requests).then(function () {
          clearTimeout(safetyTimer);
          finish();
        }).catch(function () {
          clearTimeout(safetyTimer);
          finish();
        });
      } else {
        iframe.onload = finish;
        setTimeout(finish, 5000);
        form.submit();
      }
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
