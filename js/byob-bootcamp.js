/**
 * Yellow Wing Roasters - BYOB: Book Your Own Bootcamp
 * Handles 12oz single-origin selection, guest count pricing, and cart addition.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initBYOBBootcamp = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initBYOBBootcamp(config) {
    var origins = config.origins;
    var sessionFees = config.sessionFees;
    var mascot = config.mascot;

    var originSelect = document.getElementById('byob-origin-select');
    var notesEl = document.getElementById('byob-origin-notes');
    var prescribedEl = document.getElementById('byob-origin-prescribed');
    var guestsSelect = document.getElementById('byob-guests-select');
    var notesTextarea = document.getElementById('byob-bootcamp-notes');
    var priceDisplay = document.getElementById('byob-price-display');
    var priceBreakdown = document.getElementById('byob-price-breakdown');
    var addBtn = document.getElementById('byob-add-to-cart-btn');

    function getCurrentOrigin() {
      return origins[originSelect.value];
    }

    function updateState() {
      var orig = getCurrentOrigin();
      var guests = guestsSelect.value;
      var fee = sessionFees[guests];
      var totalPrice = orig.price12oz + fee;
      var guestWord = (guests === '1') ? 'guest' : 'guests';

      notesEl.textContent = 'Notes: ' + orig.tasting_notes;
      prescribedEl.textContent = 'Prescribed baseline: ' + orig.prescribed_level;
      priceDisplay.textContent = '$' + totalPrice;
      priceBreakdown.innerHTML = '$' + orig.price12oz + ' (12oz bean) + $' + fee + ' (' + guests + ' ' + guestWord + ') &middot; Scheduled after checkout';
    }

    originSelect.addEventListener('change', updateState);
    guestsSelect.addEventListener('change', updateState);

    updateState();

    addBtn.addEventListener('click', function () {
      var orig = getCurrentOrigin();
      var guests = guestsSelect.value;
      var fee = sessionFees[guests];
      var guestsLabel = guests + ((guests === '1') ? ' Guest' : ' Guests');

      var item = {
        type: 'custom',
        slug: 'book-your-own-bootcamp',
        origin: originSelect.value,
        title: 'BYOB: ' + orig.title,
        subtitle: 'Roasting Bootcamp (' + guestsLabel + ')',
        size: '12oz',
        price: orig.price12oz + fee,
        mascot: mascot,
        notes: notesTextarea.value.trim(),
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
        console.error('Failed to add BYOB bootcamp to cart:', item);
      }
    });
  };
});
