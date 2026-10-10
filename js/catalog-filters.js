/**
 * Yellow Wing Roasters - Catalog Dynamic Filters
 * Minimizable Drawer with Minimal Multi-Select Dropdowns.
 * Multi-select logic: OR within each dropdown, AND across different categories.
 */
(function () {
  'use strict';

  function initCatalogFilters() {
    var cards = document.querySelectorAll('#roasts-grid .roasts-entry');
    var emptyState = document.getElementById('roasts-empty-filters');
    var resetBtn = document.getElementById('reset-filters-btn');
    var sectionBreaks = document.querySelectorAll('#roasts-grid .roasts-section-break');

    if (!cards.length) return;

    var types = {};
    var origins = {};
    var processes = {};
    var levels = { 'Light': true, 'Medium': true, 'Dark': true };
    var brewings = {};
    var flavors = {};

    // 1. Scan unique metadata across all cards
    cards.forEach(function (card) {
      // Type
      var t = (card.getAttribute('data-type') || '').trim().toLowerCase();
      if (t) types[t] = true;

      // Origins
      var originsAttr = card.getAttribute('data-origins') || '';
      var cardOrigins = originsAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardOrigins.forEach(function (o) { origins[o] = true; });
      card.setAttribute('data-origins-list', JSON.stringify(cardOrigins));

      // Processes
      var processAttr = card.getAttribute('data-process') || '';
      var cardProcesses = processAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardProcesses.forEach(function (p) { processes[p] = true; });
      card.setAttribute('data-process-list', JSON.stringify(cardProcesses));

      // Beans (compound Origin:Process)
      var beansAttr = card.getAttribute('data-beans') || '';
      var cardBeans = beansAttr.split(',').map(function (b) {
        var parts = b.split(':');
        return { origin: parts[0] ? parts[0].trim() : '', process: parts[1] ? parts[1].trim() : '' };
      }).filter(function (b) { return b.origin || b.process; });
      card.setAttribute('data-beans-list', JSON.stringify(cardBeans));

      // Roast level categorization
      var dotsAttr = card.getAttribute('data-roast-dots');
      var cardComputedLevel = '';
      if (dotsAttr && dotsAttr.trim() !== '') {
        var dots = parseInt(dotsAttr, 10);
        if (dots <= 2) cardComputedLevel = 'Light';
        else if (dots >= 4) cardComputedLevel = 'Dark';
        else cardComputedLevel = 'Medium';
      }
      card.setAttribute('data-computed-level', cardComputedLevel);

      // Brewing methods
      var brewAttr = card.getAttribute('data-brewing') || '';
      var cardBrew = brewAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardBrew.forEach(function (b) { brewings[b] = true; });
      card.setAttribute('data-brewing-list', JSON.stringify(cardBrew));

      // Flavor profiles
      var flavAttr = card.getAttribute('data-flavors') || '';
      var cardFlavors = flavAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardFlavors.forEach(function (f) { flavors[f] = true; });
      card.setAttribute('data-flavors-list', JSON.stringify(cardFlavors));
    });

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

    var flavorLabels = {
      'chocolate': 'Chocolate & Cocoa',
      'fruits': 'Fruity & Berry',
      'citrus': 'Citrus & Bright',
      'sweet': 'Sweet & Caramel',
      'floral': 'Floral & Tea',
      'nuts': 'Nutty',
      'spices': 'Earthy & Spiced'
    };

    var categoryMeta = {
      type: { label: 'Type', map: typeLabels },
      level: { label: 'Roast' },
      flavor: { label: 'Flavor', map: flavorLabels },
      origin: { label: 'Origin' },
      process: { label: 'Process' },
      brewing: { label: 'Brew' },
      cert: { label: 'Cert', map: { 'organic': 'Organic', 'fair_trade_organic': 'Fair Trade Organic' } }
    };

    // State of selected filters
    var selectedFilters = {
      type: {},
      level: {},
      flavor: {},
      origin: {},
      process: {},
      brewing: {},
      cert: {}
    };

    var drawerToggleBtn = document.getElementById('filters-drawer-toggle');
    var drawerContent = document.getElementById('filters-drawer-content');
    var tagsPreview = document.getElementById('filters-tags-preview');
    var activeCountBadge = document.getElementById('filters-active-count');
    var clearAllBtn = document.getElementById('filters-clear-all');

    // 2. Drawer Toggle Handlers
    if (drawerToggleBtn && drawerContent) {
      drawerToggleBtn.addEventListener('click', function () {
        var isOpen = drawerContent.classList.contains('is-open');
        drawerContent.classList.toggle('is-open', !isOpen);
        drawerToggleBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    }

    // 3. Render Multi-Select Options
    function renderOptions(containerId, optionsMap, categoryKey, labelMap) {
      var container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      Object.keys(optionsMap).sort().forEach(function (key) {
        var label = document.createElement('label');
        label.className = 'mms-option';

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = key;

        var span = document.createElement('span');
        span.className = 'mms-option-text';
        span.textContent = (labelMap && labelMap[key]) ? labelMap[key] : key;

        input.addEventListener('change', function () {
          if (input.checked) {
            selectedFilters[categoryKey][key] = true;
            label.classList.add('is-checked');
          } else {
            delete selectedFilters[categoryKey][key];
            label.classList.remove('is-checked');
          }
          updateTriggerLabel(categoryKey, labelMap);
          updateTagsAndBadges();
          applyFilters();
        });

        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(label);
      });
    }

    renderOptions('mms-options-type', types, 'type', typeLabels);
    renderOptions('mms-options-level', levels, 'level');
    renderOptions('mms-options-flavor', flavors, 'flavor', flavorLabels);
    renderOptions('mms-options-origin', origins, 'origin');
    renderOptions('mms-options-process', processes, 'process');
    renderOptions('mms-options-brewing', brewings, 'brewing');
    renderOptions('mms-options-cert', { 'organic': true, 'fair_trade_organic': true }, 'cert', {
      'organic': 'Organic',
      'fair_trade_organic': 'Fair Trade Organic'
    });

    // 4. Update Trigger Button Labels
    function updateTriggerLabel(categoryKey, labelMap) {
      var trigger = document.getElementById('trigger-filter-' + categoryKey);
      if (!trigger) return;
      var valSpan = trigger.querySelector('.mms-value');
      var keys = Object.keys(selectedFilters[categoryKey]);

      if (keys.length === 0) {
        valSpan.textContent = 'All';
        trigger.classList.remove('is-active');
      } else if (keys.length === 1) {
        var k = keys[0];
        valSpan.textContent = (labelMap && labelMap[k]) ? labelMap[k] : k;
        trigger.classList.add('is-active');
      } else {
        valSpan.textContent = keys.length + ' selected';
        trigger.classList.add('is-active');
      }
    }

    // 5. Update Header Tags and Active Badge
    function updateTagsAndBadges() {
      if (!tagsPreview || !activeCountBadge) return;
      tagsPreview.innerHTML = '';
      var activeCount = 0;

      Object.keys(selectedFilters).forEach(function (cat) {
        var keys = Object.keys(selectedFilters[cat]);
        if (keys.length > 0) {
          activeCount += keys.length;
          var meta = categoryMeta[cat];
          var labelName = meta ? meta.label : cat;
          var textList = keys.map(function (k) {
            return (meta && meta.map && meta.map[k]) ? meta.map[k] : k;
          }).join(', ');

          var chip = document.createElement('span');
          chip.className = 'filters-active-chip';
          chip.innerHTML = '<span>' + labelName + ': ' + textList + '</span>' +
            '<button type="button" class="chip-remove" aria-label="Remove ' + labelName + ' filters" title="Clear ' + labelName + '">&times;</button>';

          chip.querySelector('.chip-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            clearCategory(cat);
          });

          tagsPreview.appendChild(chip);
        }
      });

      activeCountBadge.textContent = activeCount.toString();
      activeCountBadge.style.display = activeCount > 0 ? 'inline-flex' : 'none';
      if (clearAllBtn) {
        clearAllBtn.classList.toggle('is-visible', activeCount > 0);
      }
    }

    function clearCategory(cat) {
      if (!selectedFilters[cat]) return;
      selectedFilters[cat] = {};
      var checks = document.querySelectorAll('#mms-options-' + cat + ' input[type="checkbox"]');
      checks.forEach(function (c) {
        c.checked = false;
        c.closest('.mms-option').classList.remove('is-checked');
      });
      var meta = categoryMeta[cat];
      updateTriggerLabel(cat, meta ? meta.map : null);
      updateTagsAndBadges();
      applyFilters();
    }

    function clearAllFilters() {
      Object.keys(selectedFilters).forEach(function (cat) {
        selectedFilters[cat] = {};
        var meta = categoryMeta[cat];
        updateTriggerLabel(cat, meta ? meta.map : null);
      });
      document.querySelectorAll('.min-multiselect input[type="checkbox"]').forEach(function (c) {
        c.checked = false;
      });
      document.querySelectorAll('.mms-option').forEach(function (opt) {
        opt.classList.remove('is-checked');
      });
      updateTagsAndBadges();
      applyFilters();
    }

    // Clear dropdown header button handler
    document.querySelectorAll('[data-clear-dropdown]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var cat = btn.getAttribute('data-clear-dropdown');
        if (cat) clearCategory(cat);
      });
    });

    if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllFilters);
    if (resetBtn) resetBtn.addEventListener('click', clearAllFilters);

    // 6. Popover Open/Close Toggling
    var allMms = document.querySelectorAll('.min-multiselect');
    allMms.forEach(function (mms) {
      var trigger = mms.querySelector('.min-multiselect-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = mms.classList.contains('is-open');

          allMms.forEach(function (other) {
            if (other !== mms) {
              other.classList.remove('is-open');
              var otherTrig = other.querySelector('.min-multiselect-trigger');
              if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
            }
          });

          mms.classList.toggle('is-open', !isOpen);
          trigger.setAttribute('aria-expanded', (!isOpen).toString());
        });
      }

      var menu = mms.querySelector('.min-multiselect-menu');
      if (menu) {
        menu.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }
    });

    document.addEventListener('click', function () {
      allMms.forEach(function (mms) {
        mms.classList.remove('is-open');
        var trigger = mms.querySelector('.min-multiselect-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        allMms.forEach(function (mms) {
          mms.classList.remove('is-open');
          var trigger = mms.querySelector('.min-multiselect-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Helper: Compound Origin & Process Bean Matching
    function cardMatchesBean(card, selOrigins, selProcesses) {
      if (selOrigins.length === 0 && selProcesses.length === 0) return true;
      var beansList = JSON.parse(card.getAttribute('data-beans-list') || '[]');
      if (beansList.length > 0) {
        return beansList.some(function (b) {
          var mO = selOrigins.length === 0 || selOrigins.indexOf(b.origin) >= 0;
          var mP = selProcesses.length === 0 || selProcesses.indexOf(b.process) >= 0;
          return mO && mP;
        });
      }
      var cardOrigins = JSON.parse(card.getAttribute('data-origins-list') || '[]');
      var cardProcesses = JSON.parse(card.getAttribute('data-process-list') || '[]');
      var mO = selOrigins.length === 0 || selOrigins.some(function (o) { return cardOrigins.indexOf(o) >= 0; });
      var mP = selProcesses.length === 0 || selProcesses.some(function (p) { return cardProcesses.indexOf(p) >= 0; });
      return mO && mP;
    }

    // 7. Filter Execution Logic: OR within category, AND across categories
    function applyFilters() {
      var selTypes = Object.keys(selectedFilters.type);
      var selLevels = Object.keys(selectedFilters.level);
      var selFlavors = Object.keys(selectedFilters.flavor);
      var selBrewings = Object.keys(selectedFilters.brewing);
      var selCerts = Object.keys(selectedFilters.cert);
      var selOrigins = Object.keys(selectedFilters.origin);
      var selProcesses = Object.keys(selectedFilters.process);

      var visible = 0;
      cards.forEach(function (card) {
        var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
        var cardLevel = card.getAttribute('data-computed-level') || '';
        var cardFlavors = JSON.parse(card.getAttribute('data-flavors-list') || '[]');
        var cardBrewings = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var isFto = card.getAttribute('data-has-fto') === 'true';
        var isOrganic = card.getAttribute('data-has-organic') === 'true';

        // 1. Type Match (OR within dropdown)
        var matchType = selTypes.length === 0 || selTypes.indexOf(cardType) >= 0;

        // 2. Origin & Process Match (OR within dropdown, compound bean matching)
        var matchBean = cardMatchesBean(card, selOrigins, selProcesses);

        // 3. Level Match (OR within dropdown)
        var matchLevel = selLevels.length === 0 || selLevels.indexOf(cardLevel) >= 0;

        // 4. Flavor Profile Match (OR within dropdown)
        var matchFlavor = selFlavors.length === 0 || selFlavors.some(function (f) {
          return cardFlavors.indexOf(f) >= 0;
        });

        // 5. Brewing Method Match (OR within dropdown)
        var matchBrewing = selBrewings.length === 0 || selBrewings.some(function (b) {
          return cardBrewings.indexOf(b) >= 0;
        });

        // 6. Certification Match (OR within dropdown)
        var matchCert = true;
        if (selCerts.length > 0) {
          matchCert = selCerts.some(function (c) {
            if (c === 'organic') return isOrganic;
            if (c === 'fair_trade_organic') return isFto;
            return false;
          });
        }

        // Strict AND across all categories
        var show = matchType && matchBean && matchLevel && matchFlavor && matchBrewing && matchCert;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      // Update section break visibility
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
        emptyState.style.display = visible === 0 ? 'block' : 'none';
      }
    }

    // 8. Initial Check for URL Query Parameters (e.g. ?flavor=chocolate, ?type=single-origin, ?certification=organic)
    var urlParams = new URLSearchParams(window.location.search);
    var appliedQuery = false;

    if (urlParams.get('flavor')) {
      var flavParam = urlParams.get('flavor');
      var check = document.querySelector('#mms-options-flavor input[value="' + flavParam + '"]');
      if (check) {
        check.checked = true;
        check.closest('.mms-option').classList.add('is-checked');
        selectedFilters.flavor[flavParam] = true;
        updateTriggerLabel('flavor', flavorLabels);
        appliedQuery = true;
      }
    }

    if (urlParams.get('type')) {
      var typeParam = urlParams.get('type').toLowerCase();
      var checkType = document.querySelector('#mms-options-type input[value="' + typeParam + '"]');
      if (checkType) {
        checkType.checked = true;
        checkType.closest('.mms-option').classList.add('is-checked');
        selectedFilters.type[typeParam] = true;
        updateTriggerLabel('type', typeLabels);
        appliedQuery = true;
      }
    }

    if (urlParams.get('certification') || urlParams.get('organic') || urlParams.get('fto')) {
      var certParam = urlParams.get('certification');
      if (urlParams.get('organic') === 'true' || certParam === 'organic') certParam = 'organic';
      else if (urlParams.get('fto') || certParam === 'fair_trade_organic' || certParam === 'fto') certParam = 'fair_trade_organic';

      if (certParam) {
        var checkCert = document.querySelector('#mms-options-cert input[value="' + certParam + '"]');
        if (checkCert) {
          checkCert.checked = true;
          checkCert.closest('.mms-option').classList.add('is-checked');
          selectedFilters.cert[certParam] = true;
          updateTriggerLabel('cert', categoryMeta.cert.map);
          appliedQuery = true;
        }
      }
    }

    if (appliedQuery) {
      updateTagsAndBadges();
      applyFilters();
    }

    // 9. Layout View Switcher (Grid vs Compact vs List)
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
