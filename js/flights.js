/**
 * Yellow Wing Roasters - Flight & Sampler Packs Module
 * Handles The Aviary and Peck-Your-Own custom bundle selections and cart additions.
 */
(function () {
  var STORAGE_KEY = 'ywr_cart';

  function safeCartGet() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function safeCartSet(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  window.initAviaryFlight = function (options) {
    options = options || {};
    var price = options.price || 38;
    var addBtn = document.getElementById('aviary-add-btn');
    var grindSelect = document.getElementById('aviary-grind-select');

    addBtn.addEventListener('click', function () {
      var grind = grindSelect.value;
      var item = {
        type: 'flight',
        slug: 'the-aviary',
        title: 'The Aviary Flight',
        size: '4 × 8oz bags',
        grind: grind,
        price: price,
        mascot: 'audubon-cage-transparent.png',
        qty: 1
      };
      var added = window.ywrAddToCart(item, 1);
      if (added) {
        addBtn.textContent = 'Added!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Order — $' + price;
          addBtn.disabled = false;
        }, 1200);
      } else {
        console.error('Failed to add Aviary flight to cart:', item);
      }
    });

    var cards = document.querySelectorAll('.aviary-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (!e.target.closest('a')) {
          var link = card.querySelector('a.roasts-entry-visual');
          if (link && link.href) {
            window.location.href = link.href;
          }
        }
      });
    });
  };

  window.initPYOFlight = function (options) {
    options = options || {};
    var pricePerBag = options.pricePerBag || 10;
    var minBags = options.minBags || 4;
    var selected = [];
    var optionsEls = document.querySelectorAll('.pyo-option');
    var addBtn = document.getElementById('pyo-add');
    var countEl = document.getElementById('pyo-count');
    var grindSelect = document.getElementById('pyo-grind-select');
    if (!addBtn || !countEl) return;

    function update() {
      var count = selected.length;
      var price = count * pricePerBag;
      var remaining = minBags - count;

      if (remaining > 0) {
        countEl.textContent = 'Select ' + remaining + ' more roast' + (remaining === 1 ? '' : 's') + ':';
        addBtn.textContent = 'Select ' + remaining + ' more — $' + (minBags * pricePerBag);
        addBtn.disabled = true;
        addBtn.classList.add('add-to-order-btn--disabled');
      } else {
        countEl.textContent = 'Your picks (' + count + '):';
        addBtn.textContent = 'Add to order — $' + price;
        addBtn.disabled = false;
        addBtn.classList.remove('add-to-order-btn--disabled');
      }

      for (var i = 0; i < optionsEls.length; i++) {
        var slug = optionsEls[i].getAttribute('data-slug');
        var isSelected = selected.indexOf(slug) >= 0;
        if (isSelected) {
          optionsEls[i].classList.add('is-selected');
        } else {
          optionsEls[i].classList.remove('is-selected');
        }
      }
    }

    for (var i = 0; i < optionsEls.length; i++) {
      optionsEls[i].style.cursor = 'pointer';
      optionsEls[i].addEventListener('click', function () {
        var slug = this.getAttribute('data-slug');
        var idx = selected.indexOf(slug);
        if (idx >= 0) {
          selected.splice(idx, 1);
        } else {
          selected.push(slug);
        }
        update();
      });
    }

    addBtn.addEventListener('click', function () {
      if (selected.length < minBags) return;
      var titles = [];
      for (var j = 0; j < selected.length; j++) {
        for (var k = 0; k < optionsEls.length; k++) {
          if (optionsEls[k].getAttribute('data-slug') === selected[j]) {
            titles.push(optionsEls[k].getAttribute('data-title'));
            break;
          }
        }
      }
      var grind = grindSelect.value;
      var item = {
        type: 'flight',
        slug: 'peck-your-own',
        title: 'Peck Your Own',
        subtitle: titles.join(', '),
        size: selected.length + ' × 8oz bags',
        grind: grind,
        price: selected.length * pricePerBag,
        mascot: 'audubon-cardinal-transparent.png',
        qty: 1
      };
      var added = window.ywrAddToCart(item, 1);
      if (added) {
        addBtn.textContent = 'Added!';
        addBtn.disabled = true;
        setTimeout(function () { update(); }, 1200);
      } else {
        console.error('Failed to add Peck Your Own flight to cart:', item);
      }
    });

    update();
  };
})();
