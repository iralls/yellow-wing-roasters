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
    var title = document.getElementById('sub-title');
    var imageWrap = document.getElementById('sub-image-wrap');
    var imageEl = document.getElementById('sub-image');
    var roastSelect = document.getElementById('sub-roast-select');
    var roastField = document.getElementById('sub-roast-field');

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
        if (isExplicitQuery && displayTitle) {
          title.textContent = 'Subscribe — ' + displayTitle;
        } else {
          title.textContent = 'Subscribe';
        }
      }

      function updateMascot() {
        var mascotSrc = mascotMap[r] || (window.YWR_ROASTS_DATA && window.YWR_ROASTS_DATA[r] && window.YWR_ROASTS_DATA[r].mascot ? ('/images/' + window.YWR_ROASTS_DATA[r].mascot) : '');
        if (mascotSrc && imageEl && imageWrap) {
          imageEl.src = mascotSrc;
          imageEl.alt = displayTitle ? (displayTitle + ' mascot') : '';
          imageWrap.style.display = '';
        } else if (imageWrap) {
          imageWrap.style.display = 'none';
        }
      }
      updateMascot();
      if (!mascotMap[r]) {
        document.addEventListener('DOMContentLoaded', updateMascot);
      }

      var currentSubConfig = subConfig[r];
      if (currentSubConfig) {
        var sizeSelect = document.getElementById('sub-size-select');
        if (sizeSelect && currentSubConfig.sizes) {
          var prevSize = sizeSelect.value;
          sizeSelect.innerHTML = '';
          var qpSize = params.get('size');
          var targetSize = qpSize || prevSize;
          var selectedSizeIdx = 0;
          for (var si = 0; si < currentSubConfig.sizes.length; si++) {
            var sizeVal = currentSubConfig.sizes[si];
            var opt = document.createElement('option');
            opt.value = sizeVal;
            opt.textContent = sizeVal;
            sizeSelect.appendChild(opt);
            if (targetSize && targetSize === sizeVal) {
              selectedSizeIdx = si;
            }
          }
          if (sizeSelect.options.length > 0) {
            sizeSelect.selectedIndex = selectedSizeIdx;
          }
        }

        var freqSelect = document.getElementById('sub-freq-select');
        if (freqSelect && currentSubConfig.frequencies) {
          var prevFreq = freqSelect.value;
          freqSelect.innerHTML = '';
          var qpFreq = params.get('frequency');
          var targetFreq = qpFreq || prevFreq;
          var selectedFreqIdx = 0;
          for (var fi = 0; fi < currentSubConfig.frequencies.length; fi++) {
            var freqVal = currentSubConfig.frequencies[fi];
            var fOpt = document.createElement('option');
            fOpt.value = freqVal;
            fOpt.textContent = freqVal;
            freqSelect.appendChild(fOpt);
            if (targetFreq && targetFreq === freqVal) {
              selectedFreqIdx = fi;
            }
          }
          if (freqSelect.options.length > 0) {
            freqSelect.selectedIndex = selectedFreqIdx;
          }
        }

        var qpGrind = params.get('grind');
        if (qpGrind) {
          var grindSelect = document.getElementById('sub-grind-select');
          if (grindSelect) {
            for (var gr = 0; gr < grindSelect.options.length; gr++) {
              var optVal = grindSelect.options[gr].value.toLowerCase();
              if (optVal === qpGrind.toLowerCase() || optVal.indexOf(qpGrind.toLowerCase()) >= 0) {
                grindSelect.selectedIndex = gr;
                break;
              }
            }
          }
        }
      }
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
    for (var di = 0; di < deliveryRadios.length; di++) {
      deliveryRadios[di].addEventListener('change', function () {
        var v = this.value;
        addressFields.style.display = (v === 'Pickup') ? 'none' : '';
        deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
      });
    }

    var iframe = document.createElement('iframe');
    iframe.name = 'sub-submit-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = 'sub-submit-frame';

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');

    form.addEventListener('submit', function () {
      var grindSelect = document.getElementById('sub-grind-select');
      var grindVal = grindSelect ? grindSelect.value : 'Whole Bean';
      if (hiddenInput.value && hiddenInput.value.indexOf('Grind:') < 0) {
        hiddenInput.value = hiddenInput.value + ' (Grind: ' + grindVal + ')';
      }

      // Gather and set the price right before form submission to Google Forms
      var currentSubConfig = subConfig[activeRoast];
      if (currentSubConfig && currentSubConfig.prices && priceHiddenInput) {
        var selectedSize = form.querySelector('select[name="entry.1606791078"]');
        if (selectedSize && currentSubConfig.prices[selectedSize.value]) {
          priceHiddenInput.value = '$' + currentSubConfig.prices[selectedSize.value];
        }
      }

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
