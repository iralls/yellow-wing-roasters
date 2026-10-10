/**
 * Yellow Wing Roasters - Catalog Filters Preview
 * Implements and compares 3 filter interaction models:
 *  1. Minimal Dropdowns
 *  2. Minimizable / Collapsible Filters Drawer
 *  3. Multiple Choice Filters (Chips/Pills) with OR within categories and AND across categories
 */
(function () {
  'use strict';

  function initFiltersPreview() {
    var cards = document.querySelectorAll('#roasts-grid .roasts-entry');
    var sectionBreaks = document.querySelectorAll('#roasts-grid .roasts-section-break');
    var emptyState = document.getElementById('roasts-empty-filters');
    var resetEmptyBtn = document.getElementById('reset-filters-btn');
    var visibleCountEl = document.getElementById('preview-visible-count');
    var totalCountEl = document.getElementById('preview-total-count');

    if (!cards.length) return;

    if (totalCountEl) totalCountEl.textContent = cards.length.toString();

    // 1. Scan unique metadata across all cards
    var types = {};
    var origins = {};
    var processes = {};
    var levels = { 'Light': true, 'Medium': true, 'Dark': true };
    var brewings = {};
    var flavors = {};

    cards.forEach(function (card) {
      var t = (card.getAttribute('data-type') || '').trim().toLowerCase();
      if (t) types[t] = true;

      var originsAttr = card.getAttribute('data-origins') || '';
      var cardOrigins = originsAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardOrigins.forEach(function (o) { origins[o] = true; });
      card.setAttribute('data-origins-list', JSON.stringify(cardOrigins));

      var processAttr = card.getAttribute('data-process') || '';
      var cardProcesses = processAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardProcesses.forEach(function (p) { processes[p] = true; });
      card.setAttribute('data-process-list', JSON.stringify(cardProcesses));

      var beansAttr = card.getAttribute('data-beans') || '';
      var cardBeans = beansAttr.split(',').map(function (b) {
        var parts = b.split(':');
        return { origin: parts[0] ? parts[0].trim() : '', process: parts[1] ? parts[1].trim() : '' };
      }).filter(function (b) { return b.origin || b.process; });
      card.setAttribute('data-beans-list', JSON.stringify(cardBeans));

      var dotsAttr = card.getAttribute('data-roast-dots');
      var cardComputedLevel = '';
      if (dotsAttr && dotsAttr.trim() !== '') {
        var dots = parseInt(dotsAttr, 10);
        if (dots <= 2) cardComputedLevel = 'Light';
        else if (dots >= 4) cardComputedLevel = 'Dark';
        else cardComputedLevel = 'Medium';
      }
      card.setAttribute('data-computed-level', cardComputedLevel);

      var brewAttr = card.getAttribute('data-brewing') || '';
      var cardBrew = brewAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      cardBrew.forEach(function (b) { brewings[b] = true; });
      card.setAttribute('data-brewing-list', JSON.stringify(cardBrew));

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

    // State of active preview mode ('1', '2', '3', 'all')
    var activeMode = '1';

    // ─────────────────────────────────────────────────────────────
    // VARIATION 1: Minimal Dropdowns
    // ─────────────────────────────────────────────────────────────
    var v1Category = document.getElementById('v1-category');
    var v1Origin = document.getElementById('v1-origin');
    var v1Process = document.getElementById('v1-process');
    var v1Level = document.getElementById('v1-level');
    var v1Flavor = document.getElementById('v1-flavor');
    var v1Brewing = document.getElementById('v1-brewing');
    var v1Cert = document.getElementById('v1-cert');
    var v1ClearBtn = document.getElementById('v1-clear-btn');

    function populateSelect(select, optionsMap, defaultLabel, labelMap) {
      if (!select) return;
      select.innerHTML = '<option value="">' + defaultLabel + '</option>';
      Object.keys(optionsMap).sort().forEach(function (key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = (labelMap && labelMap[key]) ? labelMap[key] : key;
        select.appendChild(opt);
      });
    }

    populateSelect(v1Category, types, 'Type: All', typeLabels);
    populateSelect(v1Origin, origins, 'Origin: All');
    populateSelect(v1Process, processes, 'Process: All');
    populateSelect(v1Brewing, brewings, 'Brew: All');

    var v1Selects = [v1Category, v1Origin, v1Process, v1Level, v1Flavor, v1Brewing, v1Cert].filter(Boolean);

    function updateV1ActiveStyles() {
      var hasActive = false;
      v1Selects.forEach(function (sel) {
        var isChosen = Boolean(sel.value);
        sel.classList.toggle('is-active', isChosen);
        if (isChosen) hasActive = true;
      });
      if (v1ClearBtn) {
        v1ClearBtn.classList.toggle('is-visible', hasActive);
      }
    }

    v1Selects.forEach(function (sel) {
      sel.addEventListener('change', function () {
        updateV1ActiveStyles();
        if (activeMode === '1' || activeMode === 'all') applyFiltersV1();
      });
    });

    if (v1ClearBtn) {
      v1ClearBtn.addEventListener('click', function () {
        v1Selects.forEach(function (sel) { sel.value = ''; });
        updateV1ActiveStyles();
        applyFiltersV1();
      });
    }

    function applyFiltersV1() {
      var cType = v1Category ? v1Category.value.toLowerCase() : '';
      var cOrigin = v1Origin ? v1Origin.value : '';
      var cProcess = v1Process ? v1Process.value : '';
      var cLevel = v1Level ? v1Level.value : '';
      var cFlavor = v1Flavor ? v1Flavor.value : '';
      var cBrewing = v1Brewing ? v1Brewing.value : '';
      var cCert = v1Cert ? v1Cert.value : '';

      var selOrigins = cOrigin ? [cOrigin] : [];
      var selProcesses = cProcess ? [cProcess] : [];

      var visible = 0;
      cards.forEach(function (card) {
        var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
        var cardLevel = card.getAttribute('data-computed-level') || '';
        var cardFlavors = JSON.parse(card.getAttribute('data-flavors-list') || '[]');
        var cardBrewings = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var isFto = card.getAttribute('data-has-fto') === 'true';
        var isOrganic = card.getAttribute('data-has-organic') === 'true';

        var mType = !cType || cardType === cType;
        var mBean = cardMatchesBean(card, selOrigins, selProcesses);
        var mLevel = !cLevel || cardLevel === cLevel;
        var mFlavor = !cFlavor || cardFlavors.indexOf(cFlavor) >= 0;
        var mBrew = !cBrewing || cardBrewings.indexOf(cBrewing) >= 0;
        var mCert = true;
        if (cCert === 'organic') mCert = isOrganic;
        else if (cCert === 'fair_trade_organic') mCert = isFto;

        var show = mType && mBean && mLevel && mFlavor && mBrew && mCert;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      updateSectionBreaksAndCounts(visible);
    }

    // ─────────────────────────────────────────────────────────────
    // VARIATION 2: Minimizable Filters Row (Drawer)
    // ─────────────────────────────────────────────────────────────
    var v2ToggleBtn = document.getElementById('v2-toggle-btn');
    var v2Drawer = document.getElementById('v2-drawer');
    var v2CloseDrawerBtn = document.getElementById('v2-close-drawer-btn');
    var v2TagsPreview = document.getElementById('v2-tags-preview');
    var v2ActiveCount = document.getElementById('v2-active-count');
    var v2ClearAllLink = document.getElementById('v2-clear-all-link');

    var v2Category = document.getElementById('v2-category');
    var v2Origin = document.getElementById('v2-origin');
    var v2Process = document.getElementById('v2-process');
    var v2Level = document.getElementById('v2-level');
    var v2Flavor = document.getElementById('v2-flavor');
    var v2Brewing = document.getElementById('v2-brewing');
    var v2Cert = document.getElementById('v2-cert');

    populateSelect(v2Category, types, 'All Types', typeLabels);
    populateSelect(v2Origin, origins, 'All Origins');
    populateSelect(v2Process, processes, 'All Processes');
    populateSelect(v2Brewing, brewings, 'All Brewing Methods');

    var v2Selects = [
      { el: v2Category, label: 'Type', map: typeLabels },
      { el: v2Origin, label: 'Origin' },
      { el: v2Process, label: 'Process' },
      { el: v2Level, label: 'Level' },
      { el: v2Flavor, label: 'Flavor', map: flavorLabels },
      { el: v2Brewing, label: 'Brew' },
      { el: v2Cert, label: 'Cert', map: { 'organic': 'Organic', 'fair_trade_organic': 'Fair Trade Organic' } }
    ].filter(function (item) { return Boolean(item.el); });

    if (v2ToggleBtn && v2Drawer) {
      v2ToggleBtn.addEventListener('click', function () {
        var isOpen = v2Drawer.classList.contains('is-open');
        v2Drawer.classList.toggle('is-open', !isOpen);
        v2ToggleBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    }

    if (v2CloseDrawerBtn && v2Drawer) {
      v2CloseDrawerBtn.addEventListener('click', function () {
        v2Drawer.classList.remove('is-open');
        v2ToggleBtn.setAttribute('aria-expanded', 'false');
      });
    }

    function updateV2Chips() {
      if (!v2TagsPreview || !v2ActiveCount) return;
      v2TagsPreview.innerHTML = '';
      var activeCount = 0;

      v2Selects.forEach(function (item) {
        var val = item.el.value;
        if (val) {
          activeCount++;
          var textVal = (item.map && item.map[val]) ? item.map[val] : val;
          var chip = document.createElement('span');
          chip.className = 'v2-active-chip';
          chip.innerHTML = '<span>' + item.label + ': ' + textVal + '</span>' +
            '<button type="button" class="chip-remove" aria-label="Remove ' + item.label + ' filter" title="Remove filter">&times;</button>';

          chip.querySelector('.chip-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            item.el.value = '';
            updateV2Chips();
            if (activeMode === '2' || activeMode === 'all') applyFiltersV2();
          });

          v2TagsPreview.appendChild(chip);
        }
      });

      v2ActiveCount.textContent = activeCount.toString();
      v2ActiveCount.style.display = activeCount > 0 ? 'inline-flex' : 'none';
      if (v2ClearAllLink) {
        v2ClearAllLink.classList.toggle('is-visible', activeCount > 0);
      }
    }

    v2Selects.forEach(function (item) {
      item.el.addEventListener('change', function () {
        updateV2Chips();
        if (activeMode === '2' || activeMode === 'all') applyFiltersV2();
      });
    });

    if (v2ClearAllLink) {
      v2ClearAllLink.addEventListener('click', function () {
        v2Selects.forEach(function (item) { item.el.value = ''; });
        updateV2Chips();
        applyFiltersV2();
      });
    }

    function applyFiltersV2() {
      var cType = v2Category ? v2Category.value.toLowerCase() : '';
      var cOrigin = v2Origin ? v2Origin.value : '';
      var cProcess = v2Process ? v2Process.value : '';
      var cLevel = v2Level ? v2Level.value : '';
      var cFlavor = v2Flavor ? v2Flavor.value : '';
      var cBrewing = v2Brewing ? v2Brewing.value : '';
      var cCert = v2Cert ? v2Cert.value : '';

      var selOrigins = cOrigin ? [cOrigin] : [];
      var selProcesses = cProcess ? [cProcess] : [];

      var visible = 0;
      cards.forEach(function (card) {
        var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
        var cardLevel = card.getAttribute('data-computed-level') || '';
        var cardFlavors = JSON.parse(card.getAttribute('data-flavors-list') || '[]');
        var cardBrewings = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var isFto = card.getAttribute('data-has-fto') === 'true';
        var isOrganic = card.getAttribute('data-has-organic') === 'true';

        var mType = !cType || cardType === cType;
        var mBean = cardMatchesBean(card, selOrigins, selProcesses);
        var mLevel = !cLevel || cardLevel === cLevel;
        var mFlavor = !cFlavor || cardFlavors.indexOf(cFlavor) >= 0;
        var mBrew = !cBrewing || cardBrewings.indexOf(cBrewing) >= 0;
        var mCert = true;
        if (cCert === 'organic') mCert = isOrganic;
        else if (cCert === 'fair_trade_organic') mCert = isFto;

        var show = mType && mBean && mLevel && mFlavor && mBrew && mCert;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      updateSectionBreaksAndCounts(visible);
    }

    // ─────────────────────────────────────────────────────────────
    // VARIATION 3: Multiple Choice Filters (Chips / Pills)
    // Multi-select: OR within a category, AND across categories
    // ─────────────────────────────────────────────────────────────
    var v3Selected = {
      type: {},
      level: {},
      flavor: {},
      brewing: {},
      cert: {},
      origin: {},
      process: {}
    };

    var v3ResetAll = document.getElementById('v3-reset-all');

    function renderV3Chips(containerId, optionsMap, categoryKey, labelMap) {
      var container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      var clearBtn = document.querySelector('[data-clear-category="' + categoryKey + '"]');

      Object.keys(optionsMap).sort().forEach(function (key) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'v3-chip';
        chip.setAttribute('data-category', categoryKey);
        chip.setAttribute('data-value', key);

        var displayLabel = (labelMap && labelMap[key]) ? labelMap[key] : key;
        chip.innerHTML = '<span class="v3-chip-check">&check;</span> <span>' + displayLabel + '</span>';

        chip.addEventListener('click', function () {
          var isSel = Boolean(v3Selected[categoryKey][key]);
          if (isSel) {
            delete v3Selected[categoryKey][key];
            chip.classList.remove('is-selected');
          } else {
            v3Selected[categoryKey][key] = true;
            chip.classList.add('is-selected');
          }

          var hasAny = Object.keys(v3Selected[categoryKey]).length > 0;
          if (clearBtn) clearBtn.classList.toggle('is-visible', hasAny);

          updateV3ResetVisibility();
          if (activeMode === '3' || activeMode === 'all') applyFiltersV3();
        });

        container.appendChild(chip);
      });
    }

    renderV3Chips('v3-chips-type', types, 'type', typeLabels);
    renderV3Chips('v3-chips-level', levels, 'level');
    renderV3Chips('v3-chips-flavor', flavors, 'flavor', flavorLabels);
    renderV3Chips('v3-chips-brewing', brewings, 'brewing');
    renderV3Chips('v3-chips-cert', { 'organic': true, 'fair_trade_organic': true }, 'cert', {
      'organic': 'Organic',
      'fair_trade_organic': 'Fair Trade Organic'
    });
    renderV3Chips('v3-chips-origin', origins, 'origin');
    renderV3Chips('v3-chips-process', processes, 'process');

    // Category Clear buttons
    document.querySelectorAll('.v3-category-clear').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-clear-category');
        if (cat && v3Selected[cat]) {
          v3Selected[cat] = {};
          btn.classList.remove('is-visible');
          var chips = document.querySelectorAll('#v3-chips-' + cat + ' .v3-chip');
          chips.forEach(function (c) { c.classList.remove('is-selected'); });
          updateV3ResetVisibility();
          applyFiltersV3();
        }
      });
    });

    function updateV3ResetVisibility() {
      if (!v3ResetAll) return;
      var totalSelected = 0;
      Object.keys(v3Selected).forEach(function (cat) {
        totalSelected += Object.keys(v3Selected[cat]).length;
      });
      v3ResetAll.classList.toggle('is-visible', totalSelected > 0);
    }

    if (v3ResetAll) {
      v3ResetAll.addEventListener('click', function () {
        Object.keys(v3Selected).forEach(function (cat) {
          v3Selected[cat] = {};
        });
        document.querySelectorAll('.v3-chip').forEach(function (c) {
          c.classList.remove('is-selected');
        });
        document.querySelectorAll('.v3-category-clear').forEach(function (b) {
          b.classList.remove('is-visible');
        });
        updateV3ResetVisibility();
        applyFiltersV3();
      });
    }

    /**
     * Multiple Choice Filter Logic:
     * - Within a category: OR (roast matches if it satisfies ANY selected choice)
     * - Across categories: AND (roast must satisfy ALL categories that have 1+ selections)
     */
    function applyFiltersV3() {
      var selTypes = Object.keys(v3Selected.type);
      var selLevels = Object.keys(v3Selected.level);
      var selFlavors = Object.keys(v3Selected.flavor);
      var selBrewings = Object.keys(v3Selected.brewing);
      var selCerts = Object.keys(v3Selected.cert);
      var selOrigins = Object.keys(v3Selected.origin);
      var selProcesses = Object.keys(v3Selected.process);

      var visible = 0;
      cards.forEach(function (card) {
        var cardType = (card.getAttribute('data-type') || '').trim().toLowerCase();
        var cardLevel = card.getAttribute('data-computed-level') || '';
        var cardFlavors = JSON.parse(card.getAttribute('data-flavors-list') || '[]');
        var cardBrewings = JSON.parse(card.getAttribute('data-brewing-list') || '[]');
        var isFto = card.getAttribute('data-has-fto') === 'true';
        var isOrganic = card.getAttribute('data-has-organic') === 'true';

        // 1. Type Match (OR within category)
        var matchType = selTypes.length === 0 || selTypes.indexOf(cardType) >= 0;

        // 2. Origin & Process Compound Match (OR within category, compound bean matching)
        var matchBean = cardMatchesBean(card, selOrigins, selProcesses);

        // 3. Level Match (OR within category)
        var matchLevel = selLevels.length === 0 || selLevels.indexOf(cardLevel) >= 0;

        // 4. Flavor Profile Match (OR within category)
        var matchFlavor = selFlavors.length === 0 || selFlavors.some(function (f) {
          return cardFlavors.indexOf(f) >= 0;
        });

        // 5. Brewing Method Match (OR within category)
        var matchBrewing = selBrewings.length === 0 || selBrewings.some(function (b) {
          return cardBrewings.indexOf(b) >= 0;
        });

        // 6. Certification Match (OR within category)
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

      updateSectionBreaksAndCounts(visible);
    }

    // ─────────────────────────────────────────────────────────────
    // FEATURED VARIATION: Minimizable Drawer with Minimal Multi-Selects
    // ─────────────────────────────────────────────────────────────
    var vcSelected = {
      type: {},
      level: {},
      flavor: {},
      cert: {},
      origin: {},
      process: {},
      brewing: {}
    };

    var vcToggleBtn = document.getElementById('vc-toggle-btn');
    var vcDrawer = document.getElementById('vc-drawer');
    var vcTagsPreview = document.getElementById('vc-tags-preview');
    var vcActiveCount = document.getElementById('vc-active-count');
    var vcClearAllLink = document.getElementById('vc-clear-all-link');

    if (vcToggleBtn && vcDrawer) {
      vcToggleBtn.addEventListener('click', function () {
        var isOpen = vcDrawer.classList.contains('is-open');
        vcDrawer.classList.toggle('is-open', !isOpen);
        vcToggleBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    }

    // Render options inside .min-multiselect-menu
    function renderVcOptions(containerId, optionsMap, categoryKey, labelMap) {
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
            vcSelected[categoryKey][key] = true;
            label.classList.add('is-checked');
          } else {
            delete vcSelected[categoryKey][key];
            label.classList.remove('is-checked');
          }
          updateVcTrigger(categoryKey, labelMap);
          updateVcTags();
          if (activeMode === 'combined' || activeMode === 'all') applyFiltersCombined();
        });

        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(label);
      });
    }

    renderVcOptions('mms-options-type', types, 'type', typeLabels);
    renderVcOptions('mms-options-level', levels, 'level');
    renderVcOptions('mms-options-flavor', flavors, 'flavor', flavorLabels);
    renderVcOptions('mms-options-cert', { 'organic': true, 'fair_trade_organic': true }, 'cert', {
      'organic': 'Organic',
      'fair_trade_organic': 'Fair Trade Organic'
    });
    renderVcOptions('mms-options-origin', origins, 'origin');
    renderVcOptions('mms-options-process', processes, 'process');
    renderVcOptions('mms-options-brewing', brewings, 'brewing');

    var vcCategoryMeta = {
      type: { label: 'Type', map: typeLabels },
      level: { label: 'Roast' },
      flavor: { label: 'Flavor', map: flavorLabels },
      cert: { label: 'Cert', map: { 'organic': 'Organic', 'fair_trade_organic': 'Fair Trade Organic' } },
      origin: { label: 'Origin' },
      process: { label: 'Process' },
      brewing: { label: 'Brew' }
    };

    function updateVcTrigger(categoryKey, labelMap) {
      var trigger = document.getElementById('trigger-vc-' + categoryKey);
      if (!trigger) return;
      var valSpan = trigger.querySelector('.mms-value');
      var keys = Object.keys(vcSelected[categoryKey]);

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

    function updateVcTags() {
      if (!vcTagsPreview || !vcActiveCount) return;
      vcTagsPreview.innerHTML = '';
      var activeCount = 0;

      Object.keys(vcSelected).forEach(function (cat) {
        var keys = Object.keys(vcSelected[cat]);
        if (keys.length > 0) {
          activeCount += keys.length;
          var meta = vcCategoryMeta[cat];
          var labelName = meta ? meta.label : cat;
          var textList = keys.map(function (k) {
            return (meta && meta.map && meta.map[k]) ? meta.map[k] : k;
          }).join(', ');

          var chip = document.createElement('span');
          chip.className = 'vc-active-chip';
          chip.innerHTML = '<span>' + labelName + ': ' + textList + '</span>' +
            '<button type="button" class="chip-remove" aria-label="Remove ' + labelName + ' filters" title="Clear ' + labelName + '">&times;</button>';

          chip.querySelector('.chip-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            vcSelected[cat] = {};
            var checks = document.querySelectorAll('#mms-options-' + cat + ' input[type="checkbox"]');
            checks.forEach(function (c) {
              c.checked = false;
              c.closest('.mms-option').classList.remove('is-checked');
            });
            updateVcTrigger(cat, meta ? meta.map : null);
            updateVcTags();
            if (activeMode === 'combined' || activeMode === 'all') applyFiltersCombined();
          });

          vcTagsPreview.appendChild(chip);
        }
      });

      vcActiveCount.textContent = activeCount.toString();
      vcActiveCount.style.display = activeCount > 0 ? 'inline-flex' : 'none';
      if (vcClearAllLink) {
        vcClearAllLink.classList.toggle('is-visible', activeCount > 0);
      }
    }

    // Clear buttons in dropdown headers
    document.querySelectorAll('[data-clear-dropdown]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var cat = btn.getAttribute('data-clear-dropdown');
        if (cat && vcSelected[cat]) {
          vcSelected[cat] = {};
          var checks = document.querySelectorAll('#mms-options-' + cat + ' input[type="checkbox"]');
          checks.forEach(function (c) {
            c.checked = false;
            c.closest('.mms-option').classList.remove('is-checked');
          });
          var meta = vcCategoryMeta[cat];
          updateVcTrigger(cat, meta ? meta.map : null);
          updateVcTags();
          if (activeMode === 'combined' || activeMode === 'all') applyFiltersCombined();
        }
      });
    });

    if (vcClearAllLink) {
      vcClearAllLink.addEventListener('click', function () {
        Object.keys(vcSelected).forEach(function (cat) {
          vcSelected[cat] = {};
          var meta = vcCategoryMeta[cat];
          updateVcTrigger(cat, meta ? meta.map : null);
        });
        document.querySelectorAll('.min-multiselect input[type="checkbox"]').forEach(function (c) {
          c.checked = false;
        });
        document.querySelectorAll('.mms-option').forEach(function (opt) {
          opt.classList.remove('is-checked');
        });
        updateVcTags();
        applyFiltersCombined();
      });
    }

    // Multi-Select Dropdown Popover Toggling
    var allMms = document.querySelectorAll('.min-multiselect');
    allMms.forEach(function (mms) {
      var trigger = mms.querySelector('.min-multiselect-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = mms.classList.contains('is-open');

          // Close all other dropdown popovers
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

      // Prevent clicks inside menu from closing the popover
      var menu = mms.querySelector('.min-multiselect-menu');
      if (menu) {
        menu.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }
    });

    // Close any open popovers when clicking outside or pressing Escape
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

    /**
     * Combined Filtering Logic:
     * - Within a dropdown: OR (card matches if it satisfies ANY selected choice)
     * - Across dropdowns: AND (card must satisfy ALL categories that have 1+ selections)
     */
    function applyFiltersCombined() {
      var selTypes = Object.keys(vcSelected.type);
      var selLevels = Object.keys(vcSelected.level);
      var selFlavors = Object.keys(vcSelected.flavor);
      var selBrewings = Object.keys(vcSelected.brewing);
      var selCerts = Object.keys(vcSelected.cert);
      var selOrigins = Object.keys(vcSelected.origin);
      var selProcesses = Object.keys(vcSelected.process);

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

        // 2. Origin & Process Compound Match (OR within dropdown, compound bean matching)
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

        // Strict AND across all dropdowns
        var show = matchType && matchBean && matchLevel && matchFlavor && matchBrewing && matchCert;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      updateSectionBreaksAndCounts(visible);
    }

    // ─────────────────────────────────────────────────────────────
    // Helper: Update Section Breaks & Visible Count
    // ─────────────────────────────────────────────────────────────
    function updateSectionBreaksAndCounts(visibleCount) {
      if (visibleCountEl) visibleCountEl.textContent = visibleCount.toString();

      sectionBreaks.forEach(function (breakEl) {
        var sectionCat = (breakEl.getAttribute('data-category') || '').trim().toLowerCase();
        var hasVisible = Array.prototype.some.call(cards, function (card) {
          var cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
          return cardCat === sectionCat && card.style.display !== 'none';
        });
        breakEl.style.display = hasVisible ? '' : 'none';
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // Reset button in empty state
    if (resetEmptyBtn) {
      resetEmptyBtn.addEventListener('click', function () {
        if (activeMode === 'combined') {
          if (vcClearAllLink) vcClearAllLink.click();
        } else if (activeMode === '1') {
          v1Selects.forEach(function (sel) { sel.value = ''; });
          updateV1ActiveStyles();
          applyFiltersV1();
        } else if (activeMode === '2') {
          v2Selects.forEach(function (item) { item.el.value = ''; });
          updateV2Chips();
          applyFiltersV2();
        } else if (activeMode === '3') {
          if (v3ResetAll) v3ResetAll.click();
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // Preview Mode Switcher (Tabs)
    // ─────────────────────────────────────────────────────────────
    var tabBtns = document.querySelectorAll('.preview-tab-btn');
    var panels = {
      'combined': document.getElementById('panel-var-combined'),
      '1': document.getElementById('panel-var-1'),
      '2': document.getElementById('panel-var-2'),
      '3': document.getElementById('panel-var-3')
    };

    var infoCards = {
      'combined': document.getElementById('info-var-combined'),
      '1': document.getElementById('info-var-1'),
      '2': document.getElementById('info-var-2'),
      '3': document.getElementById('info-var-3')
    };

    function switchMode(mode) {
      activeMode = mode;

      tabBtns.forEach(function (btn) {
        var isActive = btn.getAttribute('data-preview-mode') === mode;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive.toString());
      });

      document.body.classList.toggle('preview-mode--all', mode === 'all');

      Object.keys(panels).forEach(function (key) {
        if (panels[key]) {
          var showPanel = (mode === 'all' || mode === key);
          panels[key].classList.toggle('is-active', showPanel);
        }
        if (infoCards[key]) {
          var showInfo = (mode === 'all' || mode === key);
          infoCards[key].style.display = showInfo ? 'flex' : 'none';
        }
      });

      // Apply the active variation's filters
      if (mode === 'combined') applyFiltersCombined();
      else if (mode === '1') applyFiltersV1();
      else if (mode === '2') applyFiltersV2();
      else if (mode === '3') applyFiltersV3();
      else if (mode === 'all') applyFiltersCombined();
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-preview-mode');
        switchMode(mode);
      });
    });

    // ─────────────────────────────────────────────────────────────
    // Catalog Layout Switcher (Grid vs Compact vs List)
    // ─────────────────────────────────────────────────────────────
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
      }

      viewBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          setView(btn.getAttribute('data-view'));
        });
      });

      // Allow clicking list rows to navigate
      gridEl.addEventListener('click', function (e) {
        if (!gridEl.classList.contains('roasts-grid--list')) return;
        if (e.target.closest('a, button')) return;
        var card = e.target.closest('.roasts-entry');
        if (card) {
          var link = card.querySelector('a.roasts-entry-visual');
          if (link) window.location.href = link.href;
        }
      });
    }

    // Default to Combined mode initially
    switchMode('combined');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFiltersPreview);
  } else {
    initFiltersPreview();
  }
})();
