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
    var selectBrewing = document.getElementById('filter-brewing');

    if (!cards.length || !selectOrigin || !selectLevel || !selectBrewing) return;

    var types = {};
    var origins = {};
    var processes = {};
    var levels = { 'Light': true, 'Medium': true, 'Dark': true };
    var brewingMethods = {};

    var METHOD_MAP = {
      'pour-over': 'Pour-over',
      'espresso': 'Espresso',
      'drip': 'Drip',
      'french press': 'French Press',
      'moka pot': 'Moka Pot',
      'aeropress': 'AeroPress',
      'cold brew': 'Cold Brew'
    };

    function normalizeMethod(method) {
      var clean = method.trim().toLowerCase();
      if (METHOD_MAP[clean]) {
        return METHOD_MAP[clean];
      }
      return clean.split(' ').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }

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
      var methods = brewingAttr.replace(/\bor\b/gi, '').split(',').map(function (m) {
        return normalizeMethod(m);
      }).filter(function (m) {
        return m.length > 0;
      });

      card.setAttribute('data-brewing-list', JSON.stringify(methods));

      methods.forEach(function (method) {
        brewingMethods[method] = true;
      });
    });

    // 2. Populate Dropdowns Dynamically
    if (selectCategory) {
      var typeOrder = ['blend', 'seasonal', 'single-origin', 'subscriptions', 'flight'];
      var typeLabels = {
        'blend': 'Blend',
        'seasonal': 'Seasonal',
        'single-origin': 'Single Origin',
        'single origin': 'Single Origin',
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

    // Brewing Methods
    Object.keys(brewingMethods).sort().forEach(function (method) {
      var opt = document.createElement('option');
      opt.value = method;
      opt.textContent = method;
      selectBrewing.appendChild(opt);
    });

    // 3. Filter Application Logic
    function applyFilters() {
      var chosenType = selectCategory ? selectCategory.value : '';
      var chosenOrigin = selectOrigin.value;
      var chosenProcess = selectProcess ? selectProcess.value : '';
      var chosenLevel = selectLevel.value;
      var chosenBrewing = selectBrewing.value;

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

        // Map brewing method
        var methodsList = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var matchesBrewing = !chosenBrewing || methodsList.indexOf(chosenBrewing) >= 0;

        // Show/Hide Card: ALL filters strictly ANDed together
        if (matchesType && matchesBean && matchesLevel && matchesBrewing) {
          card.style.display = '';
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
    }

    // 4. Attach Event Listeners
    if (selectCategory) selectCategory.addEventListener('change', applyFilters);
    selectOrigin.addEventListener('change', applyFilters);
    if (selectProcess) selectProcess.addEventListener('change', applyFilters);
    selectLevel.addEventListener('change', applyFilters);
    selectBrewing.addEventListener('change', applyFilters);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogFilters);
  } else {
    initCatalogFilters();
  }
})();
