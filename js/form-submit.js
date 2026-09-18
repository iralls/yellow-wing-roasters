/**
 * Yellow Wing Roasters - Form Submissions Module
 * Handles iframe-based Google Form submissions for BYOB orders and Pigeon Post mailing list.
 */
(function () {
  function createSubmitIframe(name) {
    var iframe = document.createElement('iframe');
    iframe.name = name;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return iframe;
  }

  window.initBYOBForm = function (options) {
    options = options || {};
    var thanksUrl = options.thanksUrl || '/thanks/';
    var form = document.getElementById('byob-form');
    if (!form) return;

    var status = form.querySelector('.order-status');
    var submitBtn = form.querySelector('.order-submit');
    var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
    var addressFields = document.getElementById('byob-shipping');
    var deliveryNote = document.getElementById('byob-delivery-note');

    for (var di = 0; di < deliveryRadios.length; di++) {
      deliveryRadios[di].addEventListener('change', function () {
        var v = this.value;
        if (addressFields) addressFields.style.display = (v === 'Pickup') ? 'none' : '';
        if (deliveryNote) deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
      });
    }

    var iframe = createSubmitIframe('byob-submit-frame');
    form.target = 'byob-submit-frame';

    form.addEventListener('submit', function () {
      var grindEl = document.getElementById('byob-grind');
      var notesEl = document.getElementById('byob-notes');
      if (grindEl && notesEl) {
        var currentNotes = notesEl.value.trim();
        var grindPrefix = '[Grind: ' + grindEl.value + ']';
        notesEl.value = currentNotes ? grindPrefix + ' ' + currentNotes : grindPrefix;
      }

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      iframe.onload = function () {
        window.location.href = thanksUrl;
      };
    });
  };

  window.initPigeonPostForm = function (options) {
    options = options || {};
    var thanksUrl = options.thanksUrl || '/thanks/';
    var form = document.getElementById('pigeon-post-form');
    if (!form) return;

    var status = document.getElementById('pigeon-post-status');
    var submitBtn = document.getElementById('pigeon-post-submit');

    var iframe = createSubmitIframe('pigeon-post-submit-frame');
    form.target = 'pigeon-post-submit-frame';

    form.addEventListener('submit', function () {
      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      iframe.onload = function () {
        window.location.href = thanksUrl;
      };
    });
  };
})();
