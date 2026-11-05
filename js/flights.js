/**
 * Yellow Wing Roasters - Flight & Sampler Packs Module
 * Handles The Aviary and Peck-Your-Own custom bundle selections and cart additions.
 */
(function () {
  window.initAviaryFlight = function (options) {
    var addBtn = document.getElementById('aviary-add-btn');
    var grindSelect = document.getElementById('aviary-grind-select');

    addBtn.addEventListener('click', function () {
      var item = {
        type: 'flight',
        slug: 'the-aviary',
        title: 'The Aviary',
        subtitle: 'Early Bird, Feather Soot, Chimney Sweep, Lil\' Sipper',
        roasts: ['Early Bird', 'Feather Soot', 'Chimney Sweep', 'Lil\' Sipper'],
        size: '4 × 8oz bags',
        grind: grindSelect.value,
        price: options.price,
        mascot: options.mascot,
        qty: 1
      };
      var added = window.ywrAddToCart(item, 1);
      if (added) {
        addBtn.textContent = 'Added!';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart';
          addBtn.disabled = false;
        }, 1200);
      } else {
        console.error('Failed to add Aviary flight to cart:', item);
      }
    });
  };

  window.initPYOFlight = function (options) {
    var pricePerBag = options.pricePerBag;
    var minBags = options.minBags;
    var mascot = options.mascot;
    var selected = [];
    var optionsEls = document.querySelectorAll('.pyo-option');
    var addBtn = document.getElementById('pyo-add');
    var countEl = document.getElementById('pyo-count');
    var subEl = document.getElementById('pyo-sub');
    var priceEl = document.getElementById('pyo-price');
    var grindSelect = document.getElementById('pyo-grind-select');

    function toggleRoast(slug) {
      var idx = selected.indexOf(slug);
      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        selected.push(slug);
      }
      update();
    }

    function update() {
      var count = selected.length;
      var displayPrice = Math.max(count, minBags) * pricePerBag;
      var remaining = minBags - count;

      priceEl.textContent = '$' + displayPrice;

      if (remaining > 0) {
        countEl.textContent = 'Select ' + remaining + ' more roast' + (remaining === 1 ? '' : 's');
        subEl.textContent = count + ' of ' + minBags + ' minimum selected ($' + pricePerBag + '/bag)';
        addBtn.textContent = 'Select ' + remaining + ' more — $' + displayPrice;
        addBtn.disabled = true;
        addBtn.classList.add('add-to-order-btn--disabled');
      } else {
        countEl.textContent = count + ' roast' + (count === 1 ? '' : 's') + ' selected';
        subEl.textContent = count + ' × 8oz bags ($' + pricePerBag + '/bag)';
        addBtn.textContent = 'Add to Cart — $' + displayPrice;
        addBtn.disabled = false;
        addBtn.classList.remove('add-to-order-btn--disabled');
      }

      for (var i = 0; i < optionsEls.length; i++) {
        var slug = optionsEls[i].getAttribute('data-slug');
        var isSelected = selected.indexOf(slug) >= 0;
        if (isSelected) {
          optionsEls[i].classList.add('is-selected');
          optionsEls[i].setAttribute('aria-checked', 'true');
        } else {
          optionsEls[i].classList.remove('is-selected');
          optionsEls[i].setAttribute('aria-checked', 'false');
        }
      }
    }

    for (var i = 0; i < optionsEls.length; i++) {
      optionsEls[i].style.cursor = 'pointer';
      optionsEls[i].addEventListener('click', function () {
        toggleRoast(this.getAttribute('data-slug'));
      });
      optionsEls[i].addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleRoast(this.getAttribute('data-slug'));
        }
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
      var item = {
        type: 'flight',
        slug: 'peck-your-own',
        title: 'Peck Your Own',
        subtitle: titles.join(', '),
        roasts: titles,
        size: selected.length + ' × 8oz bags',
        grind: grindSelect.value,
        price: selected.length * pricePerBag,
        mascot: mascot,
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
