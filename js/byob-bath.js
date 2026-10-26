/**
 * Yellow Wing Roasters - BYOB: Bib Your Own Bath
 * Handles guest count pricing and cart addition for guided coffee cupping sessions.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initBYOBBath = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initBYOBBath(config) {
    var slug = config.slug;
    var pricePerPerson = config.pricePerPerson;
    var mascot = config.mascot;

    var guestsSelect = document.getElementById('byob-bath-guests-select');
    var notesTextarea = document.getElementById('byob-bath-notes');
    var priceDisplay = document.getElementById('byob-bath-price-display');
    var priceBreakdown = document.getElementById('byob-bath-price-breakdown');
    var addBtn = document.getElementById('byob-bath-add-to-cart-btn');

    function updateState() {
      var guests = parseInt(guestsSelect.value, 10);
      var totalPrice = guests * pricePerPerson;
      var guestWord = (guests === 1) ? 'guest' : 'guests';

      priceDisplay.textContent = '$' + totalPrice;
      priceBreakdown.innerHTML = guests + ' ' + guestWord + ' &times; $' + pricePerPerson + '/person &middot; Scheduled after checkout';
    }

    guestsSelect.addEventListener('change', updateState);

    updateState();

    addBtn.addEventListener('click', function () {
      var guests = parseInt(guestsSelect.value, 10);
      var guestsLabel = guests + ((guests === 1) ? ' Guest' : ' Guests');

      var item = {
        type: 'custom',
        slug: slug,
        title: 'BYOB: Bib Your Own Bath',
        subtitle: 'Cupping Session (' + guestsLabel + ')',
        price: guests * pricePerPerson,
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
        console.error('Failed to add BYOB bath cupping session to cart:', item);
      }
    });
  };
});
