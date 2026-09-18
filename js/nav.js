/**
 * Yellow Wing Roasters - Navigation Menu Module
 * Handles dropdown menu toggle, subitem accordion, and click-outside dismissal.
 */
(function () {
  function initNav() {
    var toggle = document.getElementById('dropdown-toggle');
    var items = document.getElementById('dropdown-items');
    if (!toggle || !items) return;

    toggle.addEventListener('click', function () {
      var open = items.classList.toggle('dropdown-items--open');
      toggle.setAttribute('aria-expanded', open);
    });

    var coffeeToggle = document.getElementById('coffee-toggle');
    var coffeeItems = document.getElementById('coffee-subitems');
    if (coffeeToggle && coffeeItems) {
      coffeeToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = coffeeItems.style.display === 'none';
        coffeeItems.style.display = open ? '' : 'none';
        coffeeToggle.textContent = open ? 'Coffee ▾' : 'Coffee ▸';
      });
    }

    document.addEventListener('click', function (e) {
      var menu = document.getElementById('dropdown-menu');
      if (menu && !menu.contains(e.target)) {
        items.classList.remove('dropdown-items--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
