/**
 * Yellow Wing Roasters - Subscribe Form
 * Handles roast selection, dynamic frequency & size options, and Google Forms submission.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initSubscribeForm = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initSubscribeForm(config) {
    config = config || {};
    var form = document.getElementById('subscribe-form');
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    var queryRoast = params.get('roast') || '';
    var hiddenInput = document.getElementById('sub-roast-hidden');
    var priceHiddenInput = document.getElementById('sub-price-hidden');
    var sizeHiddenInput = document.getElementById('sub-size-hidden');
    var freqHiddenInput = document.getElementById('sub-freq-hidden');
    var grindHiddenInput = document.getElementById('sub-grind-hidden');
    var title = document.getElementById('sub-title');
    var roastSelect = document.getElementById('sub-roast-select');
    var roastField = document.getElementById('sub-roast-field');

    var summaryThumb = document.getElementById('sub-summary-thumb');
    var summaryPh = document.getElementById('sub-summary-ph');
    var summaryTitle = document.getElementById('sub-summary-roast-title');
    var summaryMeta = document.getElementById('sub-summary-meta');
    var summaryFreqRow = document.getElementById('sub-summary-freq-row');
    var summaryPrice = document.getElementById('sub-summary-price');
    var summaryTotal = document.getElementById('sub-summary-total');

    var subConfig = config.subConfig || {};
    var mascotMap = config.mascotMap || {};
    var titleMap = config.titleMap || {};
    var disabledSubRoasts = config.disabledSubRoasts || {};

    var activeRoast = queryRoast;
    if (!activeRoast && roastSelect && roastSelect.value) {
      activeRoast = roastSelect.value;
    }

    if (queryRoast) {
      if (roastField) roastField.style.display = 'none';
      if (roastSelect) roastSelect.value = queryRoast;
    } else if (roastField) {
      roastField.style.display = '';
    }

    function applyRoast(r, isExplicitQuery) {
      activeRoast = r;
      if (hiddenInput) hiddenInput.value = r;

      var existingNotice = document.querySelector('.roast-status-bar');
      if (existingNotice) existingNotice.remove();

      if (disabledSubRoasts[r]) {
        form.style.display = 'none';
        var item = disabledSubRoasts[r];
        var notice = document.createElement('div');
        notice.className = 'roast-status-bar roast-status-bar--' + item.status;
        notice.style.marginTop = '1.5rem';
        notice.innerHTML = '<span class="roast-status-bar-badge roast-status-bar-badge--' + item.status + '">' + item.badge + '</span><span class="roast-status-bar-text">' + item.footnote + '</span>';
        form.parentNode.insertBefore(notice, form);
      } else {
        form.style.display = '';
      }

      var displayTitle = (titleMap && titleMap[r])
        ? titleMap[r]
        : (r ? r.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : '');

      if (title) {
        title.textContent = 'Subscribe';
      }

      function updateMascot() {
        var mascotSrc = mascotMap[r] || (window.YWR_ROASTS_DATA && window.YWR_ROASTS_DATA[r] && window.YWR_ROASTS_DATA[r].mascot ? ('/images/' + window.YWR_ROASTS_DATA[r].mascot) : '');
        if (summaryThumb && summaryPh) {
          if (mascotSrc) {
            summaryThumb.src = mascotSrc;
            summaryThumb.alt = displayTitle ? (displayTitle + ' mascot') : '';
            summaryThumb.style.display = '';
            summaryPh.style.display = 'none';
          } else {
            summaryThumb.style.display = 'none';
            summaryPh.style.display = '';
          }
        }
      }
      updateMascot();
      if (!mascotMap[r]) {
        document.addEventListener('DOMContentLoaded', updateMascot);
      }

      var currentSubConfig = subConfig[r] || {};
      var qpSize = params.get('size');
      var chosenSize = qpSize || (currentSubConfig.sizes && currentSubConfig.sizes[0]) || '12oz';
      if (sizeHiddenInput) sizeHiddenInput.value = chosenSize;

      var qpFreq = params.get('frequency');
      var chosenFreq = qpFreq || (currentSubConfig.frequencies && currentSubConfig.frequencies[0]) || 'Every 2 weeks';
      if (freqHiddenInput) freqHiddenInput.value = chosenFreq;

      var qpGrind = params.get('grind');
      var chosenGrind = qpGrind || 'Whole Bean';
      if (grindHiddenInput) grindHiddenInput.value = chosenGrind;

      var priceVal = 0;
      if (currentSubConfig.prices && typeof currentSubConfig.prices[chosenSize] === 'number') {
        priceVal = currentSubConfig.prices[chosenSize];
      }
      if (priceHiddenInput) {
        priceHiddenInput.value = '$' + priceVal;
      }

      if (summaryTitle) summaryTitle.textContent = displayTitle;
      if (summaryMeta) summaryMeta.textContent = chosenSize + ' · ' + chosenGrind;
      if (summaryFreqRow) summaryFreqRow.textContent = chosenFreq;
      if (summaryPrice) summaryPrice.textContent = '$' + priceVal;
      if (summaryTotal) summaryTotal.textContent = '$' + Number(priceVal).toFixed(2);
    }

    if (roastSelect) {
      roastSelect.addEventListener('change', function () {
        activeRoast = this.value;
        applyRoast(activeRoast, false);
      });
    }

    if (activeRoast) {
      applyRoast(activeRoast, Boolean(queryRoast));
    }

    var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
    var addressFields = document.getElementById('sub-address-fields');
    var deliveryNote = document.getElementById('sub-delivery-note');

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
      });
    }

    var initialDelivery = form.querySelector('input[name="entry.1896226742"]:checked');
    var isInitialPickup = (!initialDelivery || initialDelivery.value === 'Pickup');
    setAddressFieldsState(isInitialPickup);
    updateDeliveryNote(isInitialPickup);

    var iframe = document.createElement('iframe');
    iframe.name = 'sub-submit-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = 'sub-submit-frame';

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');

    form.addEventListener('submit', function () {
      var grindVal = grindHiddenInput ? grindHiddenInput.value : (params.get('grind') || 'Whole Bean');
      if (hiddenInput && hiddenInput.value && hiddenInput.value.indexOf('Grind:') < 0) {
        hiddenInput.value = hiddenInput.value + ' (Grind: ' + grindVal + ')';
      }

      // Gather and set the price right before form submission to Google Forms
      var currentSubConfig = subConfig[activeRoast];
      if (currentSubConfig && currentSubConfig.prices && priceHiddenInput && sizeHiddenInput) {
        var sVal = sizeHiddenInput.value;
        if (currentSubConfig.prices[sVal]) {
          priceHiddenInput.value = '$' + currentSubConfig.prices[sVal];
        }
      }

      var delivery = form.querySelector('input[name="entry.1896226742"]:checked');
      setAddressFieldsState(!delivery || delivery.value === 'Pickup');

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;
      iframe.onload = function () {
        window.location.href = (config.thanksUrl || '/thanks/');
      };
    });

  };
});
