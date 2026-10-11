/**
 * Yellow Wing Roasters - Bring Your Own Beans Module
 * Handles green bean link submission and cart addition.
 */
(function () {
  'use strict';

  window.initBYOBBeans = function (options) {
    options = options || {};
    var addBtn = document.getElementById('byob-beans-add-btn');
    var linkInput = document.getElementById('byob-link');
    var roastSelect = document.getElementById('byob-roast');
    var grindSelect = document.getElementById('byob-grind');
    var qtyInput = document.getElementById('byob-qty');
    var notesTextarea = document.getElementById('byob-notes');

    addBtn.addEventListener('click', function () {
      var linkVal = linkInput.value.trim();
      if (!linkVal) {
        linkInput.reportValidity();
        return;
      }
      var roastVal = roastSelect.value;
      if (!roastVal) {
        roastSelect.reportValidity();
        return;
      }
      var qtyVal = parseInt(qtyInput.value, 10);

      var item = {
        type: 'custom',
        slug: 'bring-your-own-beans',
        title: 'Bring Your Own Beans',
        subtitle: linkVal,
        size: qtyVal + (qtyVal === 1 ? ' lb' : ' lbs'),
        roastLevel: roastVal,
        grind: grindSelect.value,
        price: 0,
        mascot: options.mascot,
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
        console.error('Failed to add Bring Your Own Beans to cart:', item);
      }
    });
  };
})();
