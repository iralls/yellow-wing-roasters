/**
 * Yellow Wing Roasters - Gift Order Form
 * Handles direct gifting, subscriptions, digital gift card codes, and custom image selector.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initGiftOrder = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initGiftOrder(config) {
    config = config || {};
    var form = document.getElementById('gift-form');
    var params = new URLSearchParams(window.location.search);
    var productSelect = document.getElementById('gift-product');
    var pageTitle = document.getElementById('gift-page-title');

    var hiddenRoastInput = document.getElementById('gift-roast-hidden');
    var hiddenPriceInput = document.getElementById('gift-price-hidden');
    var hiddenNotesInput = document.getElementById('gift-notes-hidden');

    var subConfig = config.subConfig || {};
    var roastPricing = config.roastPricing || {};
    var disabledSubRoasts = config.disabledSubRoasts || {};

    function getUnitPrice(product, size) {
      var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
      if (isSubscriptionOnly) {
        var c = subConfig[product];
        return (c && c.prices && c.prices[size]) ? c.prices[size] : null;
      } else {
        var roastPrices = roastPricing[product];
        if (roastPrices && roastPrices[size]) {
          return roastPrices[size];
        }
        return null;
      }
    }

  function updateSubscriptionAvailability() {
    var product = productSelect.value;
    var isSubscribable = false;

    if (product) {
      var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
      if ((isSubscriptionOnly || (subConfig && subConfig[product])) && !disabledSubRoasts[product]) {
        isSubscribable = true;
      }
    } else {
      isSubscribable = true;
    }

    var durationRadios = form.querySelectorAll('input[name="gift-duration"]');
    durationRadios.forEach(function (radio) {
      if (radio.value !== 'One-time') {
        var label = radio.closest('.order-radio');
        if (!isSubscribable) {
          radio.disabled = true;
          if (label) label.classList.add('order-radio--disabled');
          if (radio.checked) {
            var oneTimeRadio = form.querySelector('input[name="gift-duration"][value="One-time"]');
            if (oneTimeRadio) oneTimeRadio.checked = true;
          }
        } else {
          radio.disabled = false;
          if (label) label.classList.remove('order-radio--disabled');
        }
      }
    });

    var noteEl = document.getElementById('gift-duration-note');
    if (noteEl) {
      noteEl.style.display = (!isSubscribable && product) ? 'block' : 'none';
    }
  }

  function updatePrice() {
    updateSubscriptionAvailability();
    var giftType = form.querySelector('input[name="gift-type"]:checked').value;
    if (giftType === 'code') {
      var activeAmountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amount = activeAmountRadio ? activeAmountRadio.value : '45';
      document.getElementById('gift-price-display').textContent = '$' + amount;
      document.getElementById('gift-price-summary').style.display = 'block';
      return;
    }

    var product = productSelect.value;
    if (!product) {
      document.getElementById('gift-price-summary').style.display = 'none';
      return;
    }

    var duration = form.querySelector('input[name="gift-duration"]:checked').value;
    var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);

    var unitPrice = getUnitPrice(product, '12oz');
    if (unitPrice) {
      var totalVal = unitPrice * months;
      var displayStr = '$' + totalVal + ' total';
      if (duration !== 'One-time') {
        displayStr += ' ($' + unitPrice + '/mo)';
      }
      document.getElementById('gift-price-display').textContent = displayStr;
      document.getElementById('gift-price-summary').style.display = 'block';
    } else {
      document.getElementById('gift-price-summary').style.display = 'none';
    }
  }

  // Custom Select Elements
  var customSelectWrap = document.getElementById('gift-select-wrap');
  var customTrigger = document.getElementById('gift-select-trigger');
  var customTriggerImg = document.getElementById('gift-select-trigger-img');
  var customTriggerPh = document.getElementById('gift-select-trigger-ph');
  var customTriggerTitle = document.getElementById('gift-select-trigger-title');
  var customTriggerMeta = document.getElementById('gift-select-trigger-meta');
  var customMenu = document.getElementById('gift-select-menu');
  var customOptions = customMenu ? customMenu.querySelectorAll('.gift-select-option') : [];

  function updateCustomDropdownDisplay(val) {
    if (!val) {
      if (customTriggerImg) customTriggerImg.style.display = 'none';
      if (customTriggerPh) customTriggerPh.style.display = 'block';
      if (customTriggerTitle) {
        customTriggerTitle.textContent = 'Choose a coffee or subscription...';
        customTriggerTitle.classList.add('gift-select-trigger-title--placeholder');
      }
      if (customTriggerMeta) {
        customTriggerMeta.style.display = 'none';
        customTriggerMeta.textContent = '';
      }
      customOptions.forEach(function (opt) {
        opt.classList.remove('is-selected');
      });
      return;
    }

    customOptions.forEach(function (opt) {
      if (opt.getAttribute('data-value') === val) {
        opt.classList.add('is-selected');
        var title = opt.getAttribute('data-title');
        var meta = opt.getAttribute('data-meta');
        var img = opt.getAttribute('data-img');

        if (customTriggerTitle) {
          customTriggerTitle.textContent = title;
          customTriggerTitle.classList.remove('gift-select-trigger-title--placeholder');
        }
        if (customTriggerMeta) {
          if (meta) {
            customTriggerMeta.textContent = meta;
            customTriggerMeta.style.display = 'block';
          } else {
            customTriggerMeta.style.display = 'none';
          }
        }

        if (customTriggerImg && customTriggerPh) {
          if (img) {
            customTriggerImg.src = img;
            customTriggerImg.style.display = 'block';
            customTriggerPh.style.display = 'none';
          } else {
            customTriggerImg.style.display = 'none';
            customTriggerPh.style.display = 'block';
          }
        }
      } else {
        opt.classList.remove('is-selected');
      }
    });
  }

  function toggleDropdown(show) {
    if (!customMenu || !customTrigger) return;
    var isOpening = (typeof show === 'boolean') ? show : (customMenu.style.display !== 'block');
    customMenu.style.display = isOpening ? 'block' : 'none';
    customTrigger.classList.toggle('is-open', isOpening);
    customTrigger.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    if (isOpening) {
      var selectedOpt = customMenu.querySelector('.gift-select-option.is-selected');
      if (selectedOpt) {
        selectedOpt.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  if (customTrigger) {
    customTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDropdown();
    });
  }

  document.addEventListener('click', function (e) {
    if (customSelectWrap && !customSelectWrap.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && customMenu && customMenu.style.display === 'block') {
      toggleDropdown(false);
      if (customTrigger) customTrigger.focus();
    }
  });

  customOptions.forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      if (e.target.closest('.gift-select-option-link')) {
        return;
      }
      e.preventDefault();
      var val = this.getAttribute('data-value');
      productSelect.value = val;
      updateCustomDropdownDisplay(val);
      toggleDropdown(false);
      if (customTrigger) {
        customTrigger.focus();
        customTrigger.style.borderColor = '';
      }
      productSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    opt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.gift-select-option-link')) {
          return;
        }
        e.preventDefault();
        this.click();
      }
    });
  });

  var optionLinks = customMenu ? customMenu.querySelectorAll('.gift-select-option-link') : [];
  optionLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  // Gift Type Card selection
  var giftTypeCards = form.querySelectorAll('.gift-type-card');

  function selectGiftType(type) {
    var radio = form.querySelector('input[name="gift-type"][value="' + type + '"]');
    if (radio && !radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  giftTypeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var type = this.getAttribute('data-value');
      selectGiftType(type);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectGiftType(this.getAttribute('data-value'));
      }
    });
  });

  // Pre-populate product if set in URL params (Direct only)
  var queryProduct = params.get('product') || params.get('roast');
  if (queryProduct) {
    productSelect.value = queryProduct;
    if (productSelect.value && productSelect.selectedIndex >= 0) {
      pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
    }
  }

  // Pre-populate gift type if set in URL params
  var queryType = params.get('type');
  if (queryType === 'code' || queryType === 'digital') {
    selectGiftType('code');
  }

  updateCustomDropdownDisplay(productSelect.value);
  updatePrice();

  productSelect.addEventListener('change', function () {
    var selectedText = (this.options && this.selectedIndex >= 0 && this.options[this.selectedIndex])
      ? this.options[this.selectedIndex].text
      : '';
    if (selectedText && this.value) {
      pageTitle.textContent = 'Corvid care packages — ' + selectedText;
    } else {
      pageTitle.textContent = 'Corvid care packages';
    }
    updateCustomDropdownDisplay(this.value);
    updatePrice();
  });

  form.querySelectorAll('input[name="gift-duration"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  form.querySelectorAll('input[name="gift-card-amount"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  // Toggle Type Listeners
  form.querySelectorAll('input[name="gift-type"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var isDirect = this.value === 'direct';
      document.getElementById('direct-gift-fields').style.display = isDirect ? 'block' : 'none';
      document.getElementById('direct-address-container').style.display = isDirect ? 'block' : 'none';
      document.getElementById('digital-gift-fields').style.display = isDirect ? 'none' : 'block';

      // Update Card Visual State
      giftTypeCards.forEach(function (c) {
        var matches = c.getAttribute('data-value') === radio.value;
        c.classList.toggle('is-selected', matches);
        c.setAttribute('aria-checked', matches ? 'true' : 'false');
      });

      // Required fields toggling
      document.getElementById('gift-address').required = isDirect;
      document.getElementById('gift-city').required = isDirect;
      document.getElementById('gift-state').required = isDirect;
      document.getElementById('gift-zip').required = isDirect;

      var recEmail = document.getElementById('gift-recipient-email');
      var recEmailLabel = document.getElementById('gift-recipient-email-label');
      if (recEmail) recEmail.required = !isDirect;
      if (recEmailLabel) recEmailLabel.textContent = isDirect ? "Recipient's Email (optional)" : "Recipient's Email";

      // Reset titles & prices
      if (isDirect) {
        var product = productSelect.value;
        if (product && productSelect.selectedIndex >= 0) {
          pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
        } else {
          pageTitle.textContent = 'Corvid care packages';
        }
      } else {
        pageTitle.textContent = 'Corvid care packages';
      }

      updatePrice();
    });
  });
  var iframe = document.createElement('iframe');
  iframe.name = 'gift-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'gift-submit-frame';
  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var giftType = form.querySelector('input[name="gift-type"]:checked').value;

    var purchaserName = document.getElementById('gift-purchaser-name').value.trim();
    var purchaserEmail = document.getElementById('gift-purchaser-email').value.trim();
    var recipientName = document.getElementById('gift-recipient-name').value.trim();
    var recipientEmail = document.getElementById('gift-recipient-email').value.trim();
    var giftMessage = document.getElementById('gift-message').value.trim();
    var userNotes = document.getElementById('gift-notes').value.trim();

    if (giftType === 'direct') {
      var product = productSelect.value;
      if (!product) {
        alert('Please select a coffee or subscription product.');
        toggleDropdown(true);
        if (customTrigger) {
          customTrigger.focus();
          customTrigger.style.borderColor = '#d32f2f';
        }
        return;
      }

      var durationRadio = form.querySelector('input[name="gift-duration"]:checked');
      var duration = durationRadio ? durationRadio.value : 'One-time';

      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse';

      // Map Purchaser
      document.getElementById('gift-purchaser-name').name = 'entry.1153405702';
      document.getElementById('gift-purchaser-email').name = 'entry.65766604';

      // Map Shipping Address
      document.getElementById('gift-address').name = 'entry.148046999';
      document.getElementById('gift-city').name = 'entry.1534670804';
      document.getElementById('gift-state').name = 'entry.414179858';
      document.getElementById('gift-zip').name = 'entry.1472936948';

      // Map Hidden Fields
      var hiddenRoast = document.getElementById('gift-roast-hidden');
      hiddenRoast.name = 'entry.1935997805';
      hiddenRoast.value = product;

      var hiddenPrice = document.getElementById('gift-price-hidden');
      hiddenPrice.name = 'entry.903789519';
      var unitPrice = getUnitPrice(product, '12oz');
      var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);
      if (unitPrice) {
        hiddenPrice.value = '$' + (unitPrice * months);
      }

      var hiddenStatus = document.getElementById('gift-status-hidden');
      hiddenStatus.name = 'entry.1261348961';

      var hiddenFreq = document.getElementById('gift-frequency-hidden');
      hiddenFreq.name = 'entry.2064801247';

      var hiddenDeliv = document.getElementById('gift-delivery-hidden');
      hiddenDeliv.name = 'entry.1896226742';

      var hiddenSize = document.getElementById('gift-size-hidden');
      hiddenSize.name = 'entry.1606791078';

      // Map Notes Field (recipient details serialized)
      var hiddenNotes = document.getElementById('gift-notes-hidden');
      hiddenNotes.name = 'entry.1381358427';

      var giftPrefix = '[GIFT_PURCHASE] Recipient: ' + recipientName;
      if (recipientEmail) {
        giftPrefix += ' (' + recipientEmail + ')';
      }
      giftPrefix += ' | Duration: ' + duration;
      if (giftMessage) {
        giftPrefix += ' | Msg: ' + giftMessage;
      }

      hiddenNotes.value = userNotes ? giftPrefix + ' | Original Notes: ' + userNotes : giftPrefix;

      // Remove unused digital inputs names
      document.getElementById('gift-card-amount-hidden').removeAttribute('name');
      document.getElementById('gift-code-hidden').removeAttribute('name');
      document.getElementById('gift-recipient-name').removeAttribute('name');
      document.getElementById('gift-recipient-email').removeAttribute('name');
      document.getElementById('gift-message').removeAttribute('name');
      document.getElementById('gift-notes').removeAttribute('name');

      submitFormAndRedirect(config.thanksUrl || '/thanks/');

    } else {
      // Code Flow (Digital Gift Card)
      if (!purchaserName || !purchaserEmail || !recipientName || !recipientEmail) {
        alert('Please fill out all required fields.');
        return;
      }

      var amountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amountValue = amountRadio ? amountRadio.value : '45';
      var randomCode = 'GIFT-' + generateRandomString(8);

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      // Remove unused direct inputs names
      document.getElementById('gift-address').removeAttribute('name');
      document.getElementById('gift-city').removeAttribute('name');
      document.getElementById('gift-state').removeAttribute('name');
      document.getElementById('gift-zip').removeAttribute('name');
      document.getElementById('gift-roast-hidden').removeAttribute('name');
      document.getElementById('gift-price-hidden').removeAttribute('name');
      document.getElementById('gift-status-hidden').removeAttribute('name');
      document.getElementById('gift-frequency-hidden').removeAttribute('name');
      document.getElementById('gift-delivery-hidden').removeAttribute('name');
      document.getElementById('gift-size-hidden').removeAttribute('name');
      document.getElementById('gift-notes-hidden').removeAttribute('name');

      proceedToSubmitDigital(randomCode, amountValue);
    }
  });

  function proceedToSubmitDigital(giftCode, amount) {
    form.action = config.digitalFormUrl || '';

    document.getElementById('gift-purchaser-name').name = (config.digitalFormEntries && config.digitalFormEntries.purchaser_name) || '';
    document.getElementById('gift-purchaser-email').name = (config.digitalFormEntries && config.digitalFormEntries.purchaser_email) || '';
    
    var amountHidden = document.getElementById('gift-card-amount-hidden');
    amountHidden.name = (config.digitalFormEntries && config.digitalFormEntries.amount) || '';
    amountHidden.value = amount;

    var codeHidden = document.getElementById('gift-code-hidden');
    codeHidden.name = (config.digitalFormEntries && config.digitalFormEntries.gift_code) || '';
    codeHidden.value = giftCode;

    document.getElementById('gift-recipient-name').name = (config.digitalFormEntries && config.digitalFormEntries.recipient_name) || '';
    document.getElementById('gift-recipient-email').name = (config.digitalFormEntries && config.digitalFormEntries.recipient_email) || '';
    document.getElementById('gift-message').name = (config.digitalFormEntries && config.digitalFormEntries.gift_message) || '';
    document.getElementById('gift-notes').name = (config.digitalFormEntries && config.digitalFormEntries.notes) || '';

    submitFormAndRedirect((config.thanksUrl || '/thanks/') + '?code=' + encodeURIComponent(giftCode));
  }

  function submitFormAndRedirect(redirectUrl) {
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }

    iframe.onload = function () {
      window.location.href = redirectUrl;
    };

    form.submit();
  }

  function generateRandomString(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  };
});
