/**
 * Yellow Wing Roasters - Catalog Dynamic Filters
 * Scans roast catalog cards and dynamically populates Type, Origin, Process, Level, and Brewing filters.
 */
(function () {
  'use strict';

  function initCatalogFilters() {
    var cards = document.querySelectorAll('#roasts-grid .roasts-entry');
    var selectCategory = document.getElementById('filter-category');
    var selectOrigin = document.getElementById('filter-origin');
    var selectProcess = document.getElementById('filter-process');
    var selectLevel = document.getElementById('filter-level');
    var selectFlavor = document.getElementById('filter-flavor');
    var selectBrewing = document.getElementById('filter-brewing');
    var selectCertification = document.getElementById('filter-certification') || document.getElementById('filter-fto');
    var emptyState = document.getElementById('roasts-empty-filters');
    var resetBtn = document.getElementById('reset-filters-btn');

    if (!cards.length || !selectOrigin || !selectLevel || !selectBrewing) return;

    var types = {};
    var origins = {};
    var processes = {};
    var levels = { 'Light': true, 'Medium': true, 'Dark': true };

    // 1. Scan cards to extract unique filter values
    cards.forEach(function (card) {
      // Type (blend, single origin, seasonal, subscriptions)
      var t = (card.getAttribute('data-type') || '').trim().toLowerCase();
      if (t) {
        types[t] = true;
      }

      // Origins (comma-separated list)
      var originsAttr = card.getAttribute('data-origins') || '';
      var cardOrigins = originsAttr.split(',').map(function (o) {
        return o.trim();
      }).filter(Boolean);

      card.setAttribute('data-origins-list', JSON.stringify(cardOrigins));

      cardOrigins.forEach(function (origin) {
        origins[origin] = true;
      });

      // Processes (comma-separated list)
      var processAttr = card.getAttribute('data-process') || '';
      var cardProcesses = processAttr.split(',').map(function (p) {
        return p.trim();
      }).filter(Boolean);

      card.setAttribute('data-process-list', JSON.stringify(cardProcesses));

      cardProcesses.forEach(function (proc) {
        processes[proc] = true;
      });

      // Beans (comma-separated list of Origin:Process)
      var beansAttr = card.getAttribute('data-beans') || '';
      var cardBeans = beansAttr.split(',').map(function (b) {
        var parts = b.split(':');
        return {
          origin: parts[0] ? parts[0].trim() : '',
          process: parts[1] ? parts[1].trim() : ''
        };
      }).filter(function (b) {
        return b.origin || b.process;
      });

      card.setAttribute('data-beans-list', JSON.stringify(cardBeans));

      // Brewing methods
      var brewingAttr = card.getAttribute('data-brewing') || '';
      var cardMethods = brewingAttr.split(',').map(function (m) {
        return m.trim();
      }).filter(Boolean);

      card.setAttribute('data-brewing-list', JSON.stringify(cardMethods));
    });

    // 2. Populate Dropdowns Dynamically
    if (selectCategory) {
      var typeOrder = ['blend', 'seasonal', 'single-origin', 'custom', 'subscriptions', 'flight'];
      var typeLabels = {
        'blend': 'Blend',
        'seasonal': 'Seasonal',
        'single-origin': 'Single Origin',
        'single origin': 'Single Origin',
        'custom': 'Custom',
        'subscriptions': 'Subscriptions',
        'subscription': 'Subscriptions',
        'flight': 'Flights',
        'flights': 'Flights'
      };
      typeOrder.forEach(function (t) {
        if (types[t]) {
          var opt = document.createElement('option');
          opt.value = t;
          opt.textContent = typeLabels[t] || (t.charAt(0).toUpperCase() + t.slice(1));
          selectCategory.appendChild(opt);
        }
      });
    }

    // Origins
    Object.keys(origins).sort().forEach(function (origin) {
      var opt = document.createElement('option');
      opt.value = origin;
      opt.textContent = origin;
      selectOrigin.appendChild(opt);
    });

    // Processes
    if (selectProcess) {
      var processOrder = ['Washed', 'Natural', 'Wet-Hulled'];
      processOrder.forEach(function (proc) {
        if (processes[proc]) {
          var opt = document.createElement('option');
          opt.value = proc;
          opt.textContent = proc;
          selectProcess.appendChild(opt);
        }
      });
      Object.keys(processes).sort().forEach(function (proc) {
        if (processOrder.indexOf(proc) === -1) {
          var opt = document.createElement('option');
          opt.value = proc;
          opt.textContent = proc;
          selectProcess.appendChild(opt);
        }
      });
    }

    // Roast Levels
    Object.keys(levels).forEach(function (level) {
      var opt = document.createElement('option');
      opt.value = level;
      opt.textContent = level;
      selectLevel.appendChild(opt);
    });


    // 3. Filter Application Logic
    function applyFilters() {
      var chosenType = selectCategory ? selectCategory.value : '';
      var chosenOrigin = selectOrigin.value;
      var chosenProcess = selectProcess ? selectProcess.value : '';
      var chosenLevel = selectLevel.value;
      var chosenFlavor = selectFlavor ? selectFlavor.value : '';
      var chosenBrewing = selectBrewing.value;
      var chosenCert = selectCertification ? selectCertification.value : '';

      var totalVisible = 0;

      cards.forEach(function (card) {
        // Check type match
        var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
        var matchesType = !chosenType || cardType === chosenType.toLowerCase();

        // Compound Origin & Process matching at the bean component level
        var beansList = JSON.parse(card.getAttribute('data-beans-list') || '[]');
        var matchesBean = true;
        if (chosenOrigin || chosenProcess) {
          matchesBean = beansList.some(function (bean) {
            var matchOrigin = !chosenOrigin || bean.origin === chosenOrigin;
            var matchProcess = !chosenProcess || bean.process === chosenProcess;
            return matchOrigin && matchProcess;
          });
        }

        // Map roast level category based on dots
        var dotsAttr = card.getAttribute('data-roast-dots');
        var matchesLevel = true;
        if (chosenLevel) {
          if (dotsAttr && dotsAttr.trim() !== '') {
            var dots = parseInt(dotsAttr, 10);
            var levelCat = 'Medium';
            if (dots <= 2) levelCat = 'Light';
            else if (dots >= 4) levelCat = 'Dark';
            matchesLevel = (levelCat === chosenLevel);
          } else {
            matchesLevel = false;
          }
        }

        // Flavor profile match
        var matchesFlavor = true;
        if (chosenFlavor) {
          var cardFlavors = (card.getAttribute('data-flavors') || '').split(',').map(function (s) {
            return s.trim();
          }).filter(Boolean);
          matchesFlavor = cardFlavors.indexOf(chosenFlavor) >= 0;
        }

        // Map brewing method
        var methodsList = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var matchesBrewing = !chosenBrewing || methodsList.indexOf(chosenBrewing) >= 0;

        // Certification filter: supports 'organic' and 'fair_trade_organic'
        var matchesCert = true;
        if (chosenCert === 'fair_trade_organic' || chosenCert === 'fto') {
          matchesCert = card.getAttribute('data-has-fto') === 'true';
        } else if (chosenCert === 'organic') {
          matchesCert = card.getAttribute('data-has-organic') === 'true';
        }

        // Show/Hide Card: ALL filters strictly ANDed together
        if (matchesType && matchesBean && matchesLevel && matchesFlavor && matchesBrewing && matchesCert) {
          card.style.display = '';
          totalVisible++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update section break visibility
      var sectionBreaks = document.querySelectorAll('#roasts-grid .roasts-section-break');
      sectionBreaks.forEach(function (breakEl) {
        var sectionCat = (breakEl.getAttribute('data-category') || '').trim().toLowerCase();
        var hasVisible = Array.prototype.some.call(cards, function (card) {
          var cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
          return cardCat === sectionCat && card.style.display !== 'none';
        });
        breakEl.style.display = hasVisible ? '' : 'none';
      });

      // Update empty filter state message
      if (emptyState) {
        emptyState.style.display = totalVisible === 0 ? 'block' : 'none';
      }
    }

    // 4. Attach Event Listeners
    if (selectCategory) selectCategory.addEventListener('change', applyFilters);
    selectOrigin.addEventListener('change', applyFilters);
    if (selectProcess) selectProcess.addEventListener('change', applyFilters);
    selectLevel.addEventListener('change', applyFilters);
    if (selectFlavor) selectFlavor.addEventListener('change', applyFilters);
    selectBrewing.addEventListener('change', applyFilters);
    if (selectCertification) selectCertification.addEventListener('change', applyFilters);

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (selectCategory) selectCategory.value = '';
        selectOrigin.value = '';
        if (selectProcess) selectProcess.value = '';
        selectLevel.value = '';
        if (selectFlavor) selectFlavor.value = '';
        selectBrewing.value = '';
        if (selectCertification) selectCertification.value = '';
        applyFilters();
      });
    }

    // Initial check for URL query parameters (e.g. ?flavor=..., ?organic=true, ?fto=true or ?certification=...)
    var urlParams = new URLSearchParams(window.location.search);
    if (selectFlavor && urlParams.get('flavor')) {
      selectFlavor.value = urlParams.get('flavor');
      applyFilters();
    }
    if (selectCertification) {
      if (urlParams.get('organic') === 'true' || urlParams.get('certification') === 'organic') {
        selectCertification.value = 'organic';
        applyFilters();
      } else if (urlParams.get('fto') || urlParams.get('fair-trade-organic') || urlParams.get('certification') === 'fair_trade_organic' || urlParams.get('certification') === 'fto') {
        selectCertification.value = 'fair_trade_organic';
        applyFilters();
      }
    }

    // 5. Layout View Switcher (Grid vs Compact vs List)
    var gridEl = document.getElementById('roasts-grid');
    var btnGrid = document.getElementById('view-grid-btn');
    var btnCompact = document.getElementById('view-compact-btn');
    var btnList = document.getElementById('view-list-btn');

    if (btnGrid && btnList && gridEl) {
      var viewBtns = [btnGrid, btnCompact, btnList].filter(Boolean);

      function setView(view) {
        gridEl.classList.toggle('roasts-grid--compact', view === 'compact');
        gridEl.classList.toggle('roasts-grid--list', view === 'list');

        viewBtns.forEach(function (btn) {
          var isActive = btn.getAttribute('data-view') === view;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', isActive.toString());
        });

        try {
          localStorage.setItem('ywr_catalog_view', view);
        } catch (e) {
          // localStorage may throw in restricted environments
        }
      }

      viewBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          setView(btn.getAttribute('data-view'));
        });
      });

      // Allow clicking anywhere on a list row to navigate to roast details
      gridEl.addEventListener('click', function (e) {
        if (!gridEl.classList.contains('roasts-grid--list')) return;
        if (e.target.closest('a, button')) return;
        var card = e.target.closest('.roasts-entry');
        if (card) {
          var link = card.querySelector('a.roasts-entry-visual');
          if (link) {
            window.location.href = link.href;
          }
        }
      });

      // Restore saved view preference
      try {
        var savedView = localStorage.getItem('ywr_catalog_view');
        if (savedView === 'compact' || savedView === 'list') {
          setView(savedView);
        }
      } catch (e) {
        // Ignore localStorage read errors
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogFilters);
  } else {
    initCatalogFilters();
  }
})();
