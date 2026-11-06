/**
 * Yellow Wing Roasters - Roaster Inventory & Roast Log Controller (/roasts/admin/)
 * Unified Database Query Table interface for Active Green Beans, Green Bean Orders,
 * Roast Logs, and Master Blend & Packaging Log.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.RoastAdmin = exp;
    root.initAdminRoasts = exp.initAdminRoasts;
    root.initAdminPortal = exp.initAdminPortal;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';
  var GRAMS_PER_LB = 453.592;

  var DIMENSION_LABELS = {
    month: 'Date (Month)',
    year: 'Date (Year)',
    date: 'Date (Day)',
    bean: 'Bean Selection',
    supplier: 'Supplier',
    roastLevel: 'Roast Level',
    product: 'Product / Blend',
    bagSize: 'Bag Size',
    purpose: 'Purpose'
  };

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function todayIso() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function computeBrowserHash(key, salt) {
    var activeSalt = salt || DEFAULT_SALT;
    var rawText = activeSalt + String(key || '').trim();
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      var msg = new TextEncoder().encode(rawText);
      return crypto.subtle.digest('SHA-256', msg).then(function (buf) {
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    if (typeof require === 'function') {
      var nodeCrypto = require('crypto');
      return Promise.resolve(nodeCrypto.createHash('sha256').update(rawText, 'utf8').digest('hex'));
    }
    return Promise.resolve('');
  }

  function lbsToGrams(lbs) {
    return Math.round((Number(lbs) || 0) * GRAMS_PER_LB);
  }

  function computeWeightLossPct(greenWeightGrams, endWeightGrams) {
    var g = Number(greenWeightGrams) || 0;
    var e = Number(endWeightGrams) || 0;
    if (g <= 0) return 0;
    return Number((((g - e) / g) * 100).toFixed(2));
  }

  function calculateBagSizeGrams(bagSizeId, bagSizes) {
    if (!bagSizeId || bagSizeId === 'Custom') return 0;
    var match = bagSizes.find(function (b) { return b.id === bagSizeId; });
    if (match && match.weight_oz) {
      return Math.round((Number(match.weight_oz) / 16) * GRAMS_PER_LB);
    }
    return 0;
  }

  function calculateGramsFromPercentage(percentage, totalBagGrams) {
    var pct = Number(percentage);
    var total = Number(totalBagGrams);
    if (isNaN(pct) || isNaN(total) || total <= 0) return 0;
    return Math.round((pct / 100) * total);
  }

  function calculatePercentageFromGrams(grams, totalBagGrams) {
    var g = Number(grams);
    var total = Number(totalBagGrams);
    if (isNaN(g) || isNaN(total) || total <= 0) return 0;
    var p = (g / total) * 100;
    return Number(p % 1 === 0 ? p : Number(p.toFixed(1)));
  }

  function computeAgg(values, mode) {
    if (!values || values.length === 0 || mode === 'hide') return 0;
    var nums = values.map(function (v) { return Number(v) || 0; });
    if (mode === 'min') return Math.min.apply(null, nums);
    if (mode === 'max') return Math.max.apply(null, nums);
    var sum = nums.reduce(function (a, b) { return a + b; }, 0);
    return mode === 'avg' ? (sum / nums.length) : sum;
  }

  function extractYearMonth(dateStr) {
    var parts = String(dateStr || '').trim().split('-');
    return {
      year: parts[0] || 'Unknown',
      month: parts[1] || '00',
      yearMonth: parts.length >= 2 ? (parts[0] + '-' + parts[1]) : 'Unknown'
    };
  }

  function recomputeActiveBeanStocks(state, excludePkgLogId, excludeRoastId) {
    var roastedByOrder = {};
    state.roastLogs.forEach(function (rLog) {
      if (excludeRoastId && rLog.roastId === excludeRoastId) return;
      (rLog.greenBeanComponents || []).forEach(function (gc) {
        roastedByOrder[gc.orderId] = (roastedByOrder[gc.orderId] || 0) + (Number(gc.weightGrams) || 0);
      });
    });

    var packagedByRoast = {};
    state.blendPackagingLogs.forEach(function (pkg) {
      if (excludePkgLogId && pkg.logId === excludePkgLogId) return;
      (pkg.roastComponents || []).forEach(function (c) {
        packagedByRoast[c.roastId] = (packagedByRoast[c.roastId] || 0) + (Number(c.weightGrams) || 0);
      });
    });

    var beanMap = {};
    var beanOrder = [];
    var orderNameById = {};

    state.greenBeanOrders.forEach(function (ord) {
      var name = String(ord.name || '').trim();
      if (!name) return;
      orderNameById[ord.orderId] = name;
      if (!beanMap[name]) {
        beanMap[name] = {
          name: name,
          supplier: ord.supplier,
          url: ord.url,
          orderedGrams: 0,
          roastedGrams: 0,
          activeStockGrams: 0
        };
        beanOrder.push(name);
      }
      beanMap[name].supplier = ord.supplier;
      beanMap[name].url = ord.url;
      var baseGrams = lbsToGrams(ord.weightLbs);
      var adjGrams = Number(ord.adjustGrams) || 0;
      var netOrderGrams = Math.round(baseGrams + adjGrams);
      ord.adjustGrams = adjGrams;
      ord.weightGrams = netOrderGrams;
      ord.roastedGrams = roastedByOrder[ord.orderId] || 0;
      ord.availableGrams = Math.max(0, Math.round(netOrderGrams - ord.roastedGrams));
      beanMap[name].orderedGrams += netOrderGrams;
    });

    state.roastLogs.forEach(function (rst) {
      var isExcludedRoast = Boolean(excludeRoastId && rst.roastId === excludeRoastId);
      var rstComps = rst.greenBeanComponents || [];
      if (rstComps.length > 0) {
        var compBeanNames = [];
        var compTotalGrams = 0;
        rstComps.forEach(function (rc) {
          var compOrdName = orderNameById[rc.orderId];
          var compGrams = Number(rc.weightGrams) || 0;
          compTotalGrams += compGrams;
          if (compOrdName) {
            if (compBeanNames.indexOf(compOrdName) === -1) compBeanNames.push(compOrdName);
            if (!isExcludedRoast && beanMap[compOrdName]) {
              beanMap[compOrdName].roastedGrams += compGrams;
            }
          }
        });
        if (compBeanNames.length > 0) rst.beanName = compBeanNames.join(' / ');
        if (!rst.greenWeightGrams) rst.greenWeightGrams = compTotalGrams;
      } else {
        var resolvedName = String(rst.beanName || '').trim();
        rst.beanName = resolvedName;
        if (!isExcludedRoast && beanMap[resolvedName]) {
          beanMap[resolvedName].roastedGrams += (Number(rst.greenWeightGrams) || 0);
        }
      }
      rst.packagedGrams = packagedByRoast[rst.roastId] || 0;
      rst.availableGrams = Math.max(0, Math.round((Number(rst.endWeightGrams) || 0) - rst.packagedGrams));
    });

    state.greenBeans = beanOrder.map(function (name) {
      var b = beanMap[name];
      b.activeStockGrams = Math.round(b.orderedGrams - b.roastedGrams);
      return b;
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    return state.greenBeans;
  }

  function parseOrderLineItems(itemsStr, bagSizes) {
    var raw = String(itemsStr || '').trim();
    if (!raw) return [];
    var sizePattern = Array.isArray(bagSizes) && bagSizes.length > 0
      ? new RegExp('\\s+(' + bagSizes.map(function (s) { return s.id; }).join('|') + ')$', 'i')
      : /\s+(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))$/i;

    return raw.split(/,\s*(?=\d+x\s)/i).map(function (part) {
      var clean = part.replace(/\s*\([^)]*\)\s*$/, '').trim();
      var withoutQty = clean.replace(/^\d+x\s+/i, '').trim();
      var sizeMatch = withoutQty.match(sizePattern);
      var bagSize = sizeMatch ? sizeMatch[1].toLowerCase() : '';
      var product = sizeMatch
        ? withoutQty.slice(0, withoutQty.length - sizeMatch[0].length).trim()
        : withoutQty;
      return {
        label: clean,
        product: product,
        bagSize: bagSize
      };
    });
  }

  function filterSelectOptions(optionsList, query) {
    var tokens = String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return optionsList.slice();
    return optionsList.filter(function (opt) {
      var hay = String(opt.text || '').toLowerCase();
      return tokens.every(function (t) { return hay.indexOf(t) !== -1; });
    });
  }

  function enhanceSearchableSelect(sel, placeholderText) {
    if (sel._comboboxSync) {
      sel._comboboxSync();
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'roast-admin-combobox';
    sel.parentNode.insertBefore(wrapper, sel);
    wrapper.appendChild(sel);
    sel.style.display = 'none';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'roast-admin-input roast-admin-combobox-input';
    input.autocomplete = 'off';
    input.placeholder = placeholderText;
    if (sel.required) {
      input.required = true;
      sel.required = false;
    }

    var chevron = document.createElement('span');
    chevron.className = 'roast-admin-combobox-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.innerHTML = '&#9662;';

    var menu = document.createElement('div');
    menu.className = 'roast-admin-combobox-menu';
    menu.setAttribute('role', 'listbox');
    menu.style.display = 'none';

    wrapper.appendChild(input);
    wrapper.appendChild(chevron);
    wrapper.appendChild(menu);

    if (sel.id) {
      var assocLabel = document.querySelector('label[for="' + sel.id + '"]');
      if (assocLabel) {
        assocLabel.addEventListener('click', function (e) {
          e.preventDefault();
          input.focus();
        });
      }
    }

    var isOpen = false;
    var isFiltering = false;
    var activeIndex = -1;
    var filteredOptions = [];

    function getSelectedOptionText() {
      var idx = sel.selectedIndex;
      return (idx >= 0 && sel.options[idx]) ? sel.options[idx].textContent : '';
    }

    function getAllOptions() {
      return Array.from(sel.options).map(function (o) {
        return { value: o.value, text: o.textContent };
      });
    }

    function renderMenu() {
      var allOpts = getAllOptions();
      filteredOptions = isFiltering ? filterSelectOptions(allOpts, input.value) : allOpts;

      if (!isFiltering) {
        var selIdx = filteredOptions.findIndex(function (o) { return o.value === sel.value; });
        activeIndex = selIdx >= 0 ? selIdx : (filteredOptions.length > 0 ? 0 : -1);
      } else if (filteredOptions.length === 0) {
        activeIndex = -1;
      } else if (activeIndex < 0 || activeIndex >= filteredOptions.length) {
        activeIndex = 0;
      }

      if (filteredOptions.length === 0) {
        menu.innerHTML = '<div class="roast-admin-combobox-empty">No matching beans found</div>';
        return;
      }

      menu.innerHTML = filteredOptions.map(function (opt, idx) {
        var classes = 'roast-admin-combobox-option';
        if (opt.value === sel.value) classes += ' is-selected';
        if (idx === activeIndex) classes += ' is-active';
        return '<div class="' + classes + '" role="option" data-value="' + escapeHtml(opt.value) + '" data-idx="' + idx + '">' +
          escapeHtml(opt.text) + '</div>';
      }).join('');

      if (isOpen && activeIndex >= 0) {
        var activeEl = menu.querySelector('.roast-admin-combobox-option.is-active');
        if (activeEl && typeof activeEl.scrollIntoView === 'function') {
          activeEl.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    function openMenu() {
      isOpen = true;
      menu.style.display = 'block';
      renderMenu();
    }

    function closeMenu() {
      isOpen = false;
      isFiltering = false;
      menu.style.display = 'none';
      input.value = getSelectedOptionText();
    }

    function selectValue(val) {
      sel.value = val;
      isFiltering = false;
      input.value = getSelectedOptionText();
      closeMenu();
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }

    input.addEventListener('focus', function () {
      isFiltering = false;
      openMenu();
      setTimeout(function () { input.select(); }, 0);
    });

    input.addEventListener('click', function () {
      if (!isOpen) {
        isFiltering = false;
        openMenu();
        input.select();
      }
    });

    input.addEventListener('input', function () {
      isFiltering = true;
      activeIndex = 0;
      if (!isOpen) {
        isOpen = true;
        menu.style.display = 'block';
      }
      renderMenu();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          isFiltering = false;
          openMenu();
        } else if (filteredOptions.length > 0) {
          activeIndex = (activeIndex + 1) % filteredOptions.length;
          renderMenu();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          isFiltering = false;
          openMenu();
        } else if (filteredOptions.length > 0) {
          activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
          renderMenu();
        }
      } else if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          selectValue(filteredOptions[activeIndex].value);
        }
      } else if (e.key === 'Tab') {
        if (isOpen && isFiltering && activeIndex >= 0 && filteredOptions[activeIndex]) {
          selectValue(filteredOptions[activeIndex].value);
        } else {
          closeMenu();
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeMenu();
      }
    });

    input.addEventListener('blur', closeMenu);

    menu.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var optEl = e.target.closest('.roast-admin-combobox-option');
      if (optEl) selectValue(optEl.getAttribute('data-value'));
    });

    sel._comboboxSync = function () {
      if (!isFiltering) input.value = getSelectedOptionText();
      if (isOpen) renderMenu();
    };
    sel.focus = function () { input.focus(); };
    sel._comboboxSync();
  }

  function syncSearchableSelect(sel) {
    if (sel._comboboxSync) sel._comboboxSync();
  }

  function initAdminRoasts(options) {
    var apiUrl = options.apiUrl;
    var orderApiUrl = options.orderApiUrl;
    var roastLevels = options.roastLevels;
    var bagSizes = options.bagSizes;
    var defaultBagSize = bagSizes.find(function (s) { return s.default; }) || bagSizes[0];

    var gateSection = document.getElementById('roast-admin-gate-section');
    var gateForm = document.getElementById('roast-admin-gate-form');
    var passcodeInput = document.getElementById('roast-admin-passcode-input');
    var gateError = document.getElementById('roast-admin-gate-error');

    var dashboardSection = document.getElementById('roast-admin-dashboard-section');
    var errorBanner = document.getElementById('roast-admin-error-banner');
    var refreshBtn = document.getElementById('roast-admin-refresh-btn');
    var logoutBtn = document.getElementById('roast-admin-logout-btn');
    var tabsContainer = document.getElementById('roast-admin-tabs');
    var searchInput = document.getElementById('roast-admin-search-input');
    var showDepletedCheckbox = document.getElementById('roast-admin-show-depleted');

    var beansTableWrap = document.getElementById('roast-admin-beans-table-wrap');
    var ordersTableWrap = document.getElementById('roast-admin-orders-table-wrap');
    var roastsTableWrap = document.getElementById('roast-admin-roasts-table-wrap');
    var packagingTableWrap = document.getElementById('roast-admin-packaging-table-wrap');

    var orderForm = document.getElementById('roast-admin-order-form');
    var orderFormTitle = document.getElementById('order-form-title');
    var orderCancelEditBtn = document.getElementById('order-cancel-edit-btn');
    var orderBeanSelect = document.getElementById('order-bean-select');
    var orderBeanName = document.getElementById('order-bean-name');
    var orderSupplier = document.getElementById('order-supplier');
    var orderSupplierId = document.getElementById('order-supplier-id');
    var orderDate = document.getElementById('order-date');
    var orderCost = document.getElementById('order-cost');
    var orderWeightLbs = document.getElementById('order-weight-lbs');
    var orderAdjustGrams = document.getElementById('order-adjust-grams');
    var orderWeightPreview = document.getElementById('order-weight-preview');
    var orderBeanUrl = document.getElementById('order-bean-url');
    var orderSubmitBtn = document.getElementById('order-submit-btn');
    var orderFeedback = document.getElementById('order-form-feedback');

    var roastForm = document.getElementById('roast-admin-roast-form');
    var roastFormTitle = document.getElementById('roast-form-title');
    var roastCancelEditBtn = document.getElementById('roast-cancel-edit-btn');
    var roastDate = document.getElementById('roast-date');
    var roastLevelSelect = document.getElementById('roast-level-select');
    var roastAddCompBtn = document.getElementById('roast-add-component-btn');
    var roastCompsContainer = document.getElementById('roast-components-container');
    var roastEndGrams = document.getElementById('roast-end-grams');
    var roastLossPreview = document.getElementById('roast-loss-preview');
    var roastProfileUrl = document.getElementById('roast-profile-url');
    var roastNotes = document.getElementById('roast-notes');
    var roastSubmitBtn = document.getElementById('roast-submit-btn');
    var roastFeedback = document.getElementById('roast-form-feedback');

    var pkgForm = document.getElementById('roast-admin-packaging-form');
    var pkgFormTitle = document.getElementById('pkg-form-title');
    var pkgCancelEditBtn = document.getElementById('pkg-cancel-edit-btn');
    var pkgDate = document.getElementById('pkg-date');
    var pkgPurpose = document.getElementById('pkg-purpose');
    var pkgCustomerOrderWrap = document.getElementById('pkg-customer-order-wrap');
    var pkgOrderSelect = document.getElementById('pkg-order-select');
    var pkgOrderId = document.getElementById('pkg-order-id');
    var pkgProduct = document.getElementById('pkg-product');
    var pkgAddCompBtn = document.getElementById('pkg-add-component-btn');
    var pkgCompsContainer = document.getElementById('pkg-components-container');
    var pkgBlendPreview = document.getElementById('pkg-blend-preview');
    var pkgBagSize = document.getElementById('pkg-bag-size');
    var pkgNotes = document.getElementById('pkg-notes');
    var pkgSubmitBtn = document.getElementById('pkg-submit-btn');
    var pkgFeedback = document.getElementById('pkg-form-feedback');

    var beansFilterBean = document.getElementById('beans-filter-bean');
    var beansFilterSupplier = document.getElementById('beans-filter-supplier');
    var beansAggStock = document.getElementById('beans-agg-stock');
    var beansAggOrders = document.getElementById('beans-agg-orders');

    var ordersFilterYear = document.getElementById('orders-filter-year');
    var ordersFilterMonth = document.getElementById('orders-filter-month');
    var ordersFilterBean = document.getElementById('orders-filter-bean');
    var ordersFilterSupplier = document.getElementById('orders-filter-supplier');
    var ordersAggWeight = document.getElementById('orders-agg-weight');
    var ordersAggCost = document.getElementById('orders-agg-cost');
    var ordersAggUnitCost = document.getElementById('orders-agg-unit-cost');
    var ordersAggRemaining = document.getElementById('orders-agg-remaining');

    var roastsFilterYear = document.getElementById('roasts-filter-year');
    var roastsFilterMonth = document.getElementById('roasts-filter-month');
    var roastsFilterBean = document.getElementById('roasts-filter-bean');
    var roastsFilterRoastLevel = document.getElementById('roasts-filter-roast-level');
    var roastsAggGreen = document.getElementById('roasts-agg-green');
    var roastsAggEnd = document.getElementById('roasts-agg-end');
    var roastsAggLoss = document.getElementById('roasts-agg-loss');
    var roastsAggAvail = document.getElementById('roasts-agg-avail');

    var pkgFilterYear = document.getElementById('pkg-filter-year');
    var pkgFilterMonth = document.getElementById('pkg-filter-month');
    var pkgFilterProduct = document.getElementById('pkg-filter-product');
    var pkgFilterBean = document.getElementById('pkg-filter-bean');
    var pkgFilterPurpose = document.getElementById('pkg-filter-purpose');
    var pkgFilterBagSize = document.getElementById('pkg-filter-bag-size');
    var pkgAggWeight = document.getElementById('pkg-agg-weight');

    var groupByCols = {
      beans: [],
      orders: [],
      roasts: [],
      packaging: []
    };

    var state = {
      greenBeans: [],
      greenBeanOrders: [],
      roastLogs: [],
      blendPackagingLogs: [],
      customerOrders: []
    };

    var currentSearch = '';
    var editingOrderId = null;
    var editingRoastId = null;
    var editingPkgId = null;

    var activeBeansSortCol = 'name';
    var activeBeansSortDir = 'asc';
    var gbOrdersSortCol = 'date';
    var gbOrdersSortDir = 'desc';
    var roastLogSortCol = 'date';
    var roastLogSortDir = 'desc';
    var pkgLogSortCol = 'date';
    var pkgLogSortDir = 'desc';

    orderDate.value = todayIso();
    roastDate.value = todayIso();
    pkgDate.value = todayIso();
    enhanceSearchableSelect(orderBeanSelect, 'Search green bean by name or supplier...');

    function renderSortTh(label, colKey, currentCol, currentDir, alignRight, extraClass) {
      var isSorted = currentCol === colKey;
      var icon = isSorted
        ? (currentDir === 'asc' ? ' ▲' : ' ▼')
        : '<span class="roast-admin-sort-icon">↕</span>';
      var style = alignRight ? ' style="text-align: right;"' : '';
      var cls = 'roast-admin-th-sortable' + (isSorted ? ' is-sorted' : '') + (extraClass ? (' ' + extraClass) : '');
      return '<th class="' + cls + '" data-sort-col="' + escapeHtml(colKey) + '"' + style + '>' +
        escapeHtml(label) + icon + '</th>';
    }

    function bindSortHeaders(wrapEl, getCol, setColDir, numCols, rerender) {
      wrapEl.querySelectorAll('th[data-sort-col]').forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          var cur = getCol();
          if (cur.col === col) {
            setColDir(col, cur.dir === 'asc' ? 'desc' : 'asc');
          } else {
            setColDir(col, numCols.indexOf(col) !== -1 ? 'desc' : 'asc');
          }
          rerender();
        });
      });
    }

    function getStoredKey() {
      try {
        return localStorage.getItem(STORAGE_KEY) || '';
      } catch (e) {
        return '';
      }
    }

    function saveKey(key) {
      try {
        localStorage.setItem(STORAGE_KEY, key);
        document.documentElement.classList.add('ywr-admin-authenticated');
      } catch (e) {}
    }

    function clearStoredKey() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        document.documentElement.classList.remove('ywr-admin-authenticated');
      } catch (e) {}
    }

    function showGate(errorMessage) {
      document.documentElement.classList.remove('ywr-admin-authenticated');
      dashboardSection.style.display = 'none';
      gateSection.style.display = 'block';
      if (errorMessage) {
        gateError.textContent = errorMessage;
        gateError.style.display = 'block';
      } else {
        gateError.style.display = 'none';
      }
      passcodeInput.value = '';
      passcodeInput.focus();
    }

    function showDashboard() {
      document.documentElement.classList.add('ywr-admin-authenticated');
      gateSection.style.display = 'none';
      dashboardSection.style.display = 'block';
    }

    function matchesSearch(fields) {
      if (!currentSearch) return true;
      var q = currentSearch.toLowerCase();
      return fields.join(' ').toLowerCase().indexOf(q) !== -1;
    }

    function applySearch(query) {
      currentSearch = (query || '').trim();
      searchInput.value = currentSearch;
      renderActiveBeansTable();
      renderGreenBeanOrdersTable();
      renderRoastLogsTable();
      renderBlendPackagingTable();
    }

    function getActiveFilterCount(mod) {
      var selects = {
        beans: [beansFilterBean, beansFilterSupplier],
        orders: [ordersFilterYear, ordersFilterMonth, ordersFilterBean, ordersFilterSupplier],
        roasts: [roastsFilterYear, roastsFilterMonth, roastsFilterBean, roastsFilterRoastLevel],
        pkg: [pkgFilterYear, pkgFilterMonth, pkgFilterProduct, pkgFilterBean, pkgFilterPurpose, pkgFilterBagSize]
      }[mod] || [];
      return selects.filter(function (s) { return s.value !== 'all'; }).length;
    }

    function updateFilterBtnLabel(mod) {
      var canonicalMod = mod === 'packaging' ? 'pkg' : mod;
      var groupKey = canonicalMod === 'pkg' ? 'packaging' : canonicalMod;
      var drawerId = canonicalMod + '-filter-drawer';
      var btn = document.querySelector('[data-drawer-target="' + drawerId + '"]');
      var drawer = document.getElementById(drawerId);
      var isOpen = drawer.style.display !== 'none';
      var count = getActiveFilterCount(canonicalMod);
      var groupCount = groupByCols[groupKey].length;
      var labelSpan = btn.querySelector('strong');

      if (count > 0 || groupCount > 0) {
        btn.classList.add('has-active-filters');
      } else {
        btn.classList.remove('has-active-filters');
      }

      if (!isOpen) {
        var parts = [];
        if (count > 0) parts.push(String(count));
        if (groupCount > 0) parts.push('Grouped: ' + groupCount);
        labelSpan.textContent = parts.length > 0 ? 'Filters (' + parts.join(' • ') + ')' : 'Filters';
      }
    }

    function setDrawerState(drawerId, open) {
      var drawer = document.getElementById(drawerId);
      var btn = document.querySelector('[data-drawer-target="' + drawerId + '"]');
      var defaultLabels = {
        'order-entry-drawer': 'Record Green Bean Order',
        'roast-entry-drawer': 'Record Roast Log',
        'pkg-entry-drawer': 'Record Master Blend & Packaging'
      };
      var openLabels = {
        'order-entry-drawer': 'Close Entry Form',
        'roast-entry-drawer': 'Close Entry Form',
        'pkg-entry-drawer': 'Close Entry Form'
      };
      var labelSpan = btn.querySelector('strong');
      var iconSpan = btn.querySelector('span');

      if (open) {
        drawer.style.display = 'block';
        btn.classList.add('is-open');
        labelSpan.textContent = openLabels[drawerId] || 'Close Filters';
        iconSpan.textContent = '−';
      } else {
        drawer.style.display = 'none';
        btn.classList.remove('is-open');
        iconSpan.textContent = '+';
        if (drawerId.endsWith('-filter-drawer')) {
          updateFilterBtnLabel(drawerId.replace('-filter-drawer', ''));
        } else {
          labelSpan.textContent = defaultLabels[drawerId];
        }
      }
    }

    function renderActiveBeansTable() {
      recomputeActiveBeanStocks(state);
      var showDepleted = showDepletedCheckbox.checked;
      var filterBean = beansFilterBean.value;
      var filterSupplier = beansFilterSupplier.value;

      var orderCountByBean = {};
      state.greenBeanOrders.forEach(function (o) {
        orderCountByBean[o.name] = (orderCountByBean[o.name] || 0) + 1;
      });

      var filtered = state.greenBeans.filter(function (b) {
        if (!showDepleted && b.activeStockGrams <= 0) return false;
        if (filterBean !== 'all' && b.name !== filterBean) return false;
        if (filterSupplier !== 'all' && b.supplier !== filterSupplier) return false;
        return matchesSearch([b.name, b.supplier]);
      });

      if (filtered.length === 0) {
        beansTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No green beans match the current filter.</div>';
        return;
      }

      var stockAgg = beansAggStock.value;
      var ordersAgg = beansAggOrders.value;
      var gCols = groupByCols.beans;

      var allStockGrams = filtered.map(function (b) { return Math.max(0, b.activeStockGrams); });
      var allOrderCounts = filtered.map(function (b) { return orderCountByBean[b.name] || 0; });
      var summaryStockG = Math.round(computeAgg(allStockGrams, stockAgg));
      var summaryStockLbs = (summaryStockG / GRAMS_PER_LB).toFixed(2);
      var summaryOrdersVal = computeAgg(allOrderCounts, ordersAgg);
      var summaryOrdersStr = ordersAgg === 'avg' ? summaryOrdersVal.toFixed(1) : Math.round(summaryOrdersVal);

      if (gCols.length > 0) {
        var groupsMap = {};
        filtered.forEach(function (b) {
          var dimVals = {};
          var keyParts = gCols.map(function (c) {
            var v = c === 'supplier' ? (b.supplier || 'Unknown') : b.name;
            dimVals[c] = v;
            return v;
          });
          var gKey = keyParts.join(' — ');
          if (!groupsMap[gKey]) {
            groupsMap[gKey] = {
              key: gKey,
              dimValues: dimVals,
              beansCount: 0,
              stockVals: [],
              orderVals: []
            };
          }
          groupsMap[gKey].beansCount++;
          groupsMap[gKey].stockVals.push(Math.max(0, b.activeStockGrams));
          groupsMap[gKey].orderVals.push(orderCountByBean[b.name] || 0);
        });

        var groupedRows = Object.keys(groupsMap).map(function (k) {
          var g = groupsMap[k];
          g.stockGrams = Math.round(computeAgg(g.stockVals, stockAgg));
          g.ordersVal = computeAgg(g.orderVals, ordersAgg);
          return g;
        }).sort(function (a, b) {
          var dir = activeBeansSortDir === 'asc' ? 1 : -1;
          var cmp = 0;
          if (activeBeansSortCol.indexOf('dim:') === 0) {
            var dKey = activeBeansSortCol.slice(4);
            cmp = String(a.dimValues[dKey]).localeCompare(String(b.dimValues[dKey]));
          } else if (activeBeansSortCol === 'beansCount') cmp = a.beansCount - b.beansCount;
          else if (activeBeansSortCol === 'ordersCount') cmp = a.ordersVal - b.ordersVal;
          else if (activeBeansSortCol === 'stockGrams') cmp = a.stockGrams - b.stockGrams;
          else cmp = a.key.localeCompare(b.key);
          return cmp !== 0 ? cmp * dir : a.key.localeCompare(b.key);
        });

        var gHtml = '<table class="roast-admin-table"><thead><tr>';
        gCols.forEach(function (c) {
          gHtml += renderSortTh(DIMENSION_LABELS[c] || c, 'dim:' + c, activeBeansSortCol, activeBeansSortDir, false);
        });
        gHtml += renderSortTh('Beans', 'beansCount', activeBeansSortCol, activeBeansSortDir, true);
        if (ordersAgg !== 'hide') gHtml += renderSortTh('Orders (' + ordersAgg.toUpperCase() + ')', 'ordersCount', activeBeansSortCol, activeBeansSortDir, true);
        if (stockAgg !== 'hide') gHtml += renderSortTh('Active Stock (' + stockAgg.toUpperCase() + ')', 'stockGrams', activeBeansSortCol, activeBeansSortDir, true);
        gHtml += '</tr></thead><tbody>';

        groupedRows.forEach(function (r) {
          var rLbs = (r.stockGrams / GRAMS_PER_LB).toFixed(2);
          var rOrdStr = ordersAgg === 'avg' ? r.ordersVal.toFixed(1) : Math.round(r.ordersVal);
          gHtml += '<tr>';
          gCols.forEach(function (c) {
            gHtml += '<td><strong>' + escapeHtml(r.dimValues[c]) + '</strong></td>';
          });
          gHtml += '<td class="mono" style="text-align: right;">' + r.beansCount + '</td>';
          if (ordersAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">' + rOrdStr + '</td>';
          if (stockAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rLbs + ' lbs</strong><div class="cell-sub">' + r.stockGrams.toLocaleString() + ' g</div></td>';
          gHtml += '</tr>';
        });

        gHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + gCols.length + '">Total (' + filtered.length + ' beans)</td>' +
          '<td class="mono" style="text-align: right;">' + filtered.length + '</td>';
        if (ordersAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">' + summaryOrdersStr + '</td>';
        if (stockAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + summaryStockLbs + ' lbs</strong><div class="cell-sub">' + summaryStockG.toLocaleString() + ' g</div></td>';
        gHtml += '</tr></tfoot></table>';
        beansTableWrap.innerHTML = gHtml;
      } else {
        var rows = filtered.slice().sort(function (a, b) {
          var dir = activeBeansSortDir === 'asc' ? 1 : -1;
          var cmp = 0;
          if (activeBeansSortCol === 'name') cmp = a.name.localeCompare(b.name);
          else if (activeBeansSortCol === 'ordersCount') cmp = (orderCountByBean[a.name] || 0) - (orderCountByBean[b.name] || 0);
          else if (activeBeansSortCol === 'stockGrams') cmp = a.activeStockGrams - b.activeStockGrams;
          return cmp !== 0 ? cmp * dir : a.name.localeCompare(b.name);
        });

        var html = '<table class="roast-admin-table"><thead><tr>' +
          renderSortTh('Bean & Supplier', 'name', activeBeansSortCol, activeBeansSortDir, false);
        if (ordersAgg !== 'hide') html += renderSortTh('Orders', 'ordersCount', activeBeansSortCol, activeBeansSortDir, true);
        if (stockAgg !== 'hide') html += renderSortTh('Active Stock', 'stockGrams', activeBeansSortCol, activeBeansSortDir, true);
        html += '</tr></thead><tbody>';

        rows.forEach(function (b) {
          var stockColor = b.activeStockGrams <= 0 ? '#a93226' : (b.activeStockGrams < 2 * GRAMS_PER_LB ? '#b35300' : '#1e7e44');
          var nameCell = b.url
            ? '<a href="' + escapeHtml(b.url) + '" target="_blank" rel="noopener"><strong>' + escapeHtml(b.name) + '</strong> &nearr;</a>'
            : '<strong>' + escapeHtml(b.name) + '</strong>';
          var stockLbs = (Math.max(0, b.activeStockGrams) / GRAMS_PER_LB).toFixed(2);
          var stockPrimary = b.activeStockGrams <= 0 ? '0.00 lbs' : (stockLbs + ' lbs');
          var stockSecondary = b.activeStockGrams <= 0
            ? '0 g &bull; Depleted'
            : (b.activeStockGrams.toLocaleString() + ' g' + (b.activeStockGrams < GRAMS_PER_LB ? ' &bull; Low' : ''));

          var rowClass = '';
          if (b.activeStockGrams <= 0) rowClass = ' class="roast-admin-row--depleted"';
          else if (b.activeStockGrams < GRAMS_PER_LB) rowClass = ' class="roast-admin-row--under-1lb"';
          else if (b.activeStockGrams < 2 * GRAMS_PER_LB) rowClass = ' class="roast-admin-row--under-2lb"';

          html += '<tr' + rowClass + '>' +
            '<td class="primary-cell">' + nameCell + '<div class="cell-sub">' + escapeHtml(b.supplier) + '</div></td>';
          if (ordersAgg !== 'hide') html += '<td class="mono" style="text-align: right;">' + (orderCountByBean[b.name] || 0) + '</td>';
          if (stockAgg !== 'hide') {
            html += '<td class="mono" style="text-align: right;"><strong style="color: ' + stockColor + ';">' + stockPrimary + '</strong><div class="cell-sub" style="color: ' + (b.activeStockGrams <= 0 ? '#a93226' : '#7d6b5e') + ';">' + stockSecondary + '</div></td>';
          }
          html += '</tr>';
        });

        html += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td>' + escapeHtml(stockAgg.toUpperCase()) + ' (' + rows.length + ' beans)</td>';
        if (ordersAgg !== 'hide') html += '<td class="mono" style="text-align: right;">' + summaryOrdersStr + ' (' + escapeHtml(ordersAgg.toUpperCase()) + ')</td>';
        if (stockAgg !== 'hide') html += '<td class="mono" style="text-align: right;"><strong>' + summaryStockLbs + ' lbs</strong><div class="cell-sub">' + summaryStockG.toLocaleString() + ' g</div></td>';
        html += '</tr></tfoot></table>';
        beansTableWrap.innerHTML = html;
      }

      bindSortHeaders(beansTableWrap, function () {
        return { col: activeBeansSortCol, dir: activeBeansSortDir };
      }, function (c, d) {
        activeBeansSortCol = c;
        activeBeansSortDir = d;
      }, ['stockGrams', 'ordersCount', 'beansCount'], renderActiveBeansTable);
    }

    function populateOrderBeanDropdown() {
      var prevVal = orderBeanSelect.value;
      var html = '<option value="__new__">+ New Green Bean</option>';
      state.greenBeans.forEach(function (b) {
        html += '<option value="' + escapeHtml(b.name) + '">' +
          escapeHtml(b.name) + ' (' + escapeHtml(b.supplier) + ')</option>';
      });
      orderBeanSelect.innerHTML = html;
      if (prevVal && Array.from(orderBeanSelect.options).some(function (o) { return o.value === prevVal; })) {
        orderBeanSelect.value = prevVal;
      }
      syncSearchableSelect(orderBeanSelect);
    }

    function startEditOrder(orderId) {
      var ord = state.greenBeanOrders.find(function (o) { return o.orderId === orderId; });
      editingOrderId = ord.orderId;
      orderFormTitle.textContent = 'Edit Green Bean Order (' + ord.orderId + ')';
      orderCancelEditBtn.style.display = 'inline-block';
      orderSubmitBtn.textContent = 'Update Order ' + ord.orderId;
      orderFeedback.style.display = 'none';

      orderBeanSelect.value = Array.from(orderBeanSelect.options).some(function (opt) { return opt.value === ord.name; })
        ? ord.name
        : '__new__';
      syncSearchableSelect(orderBeanSelect);
      orderBeanName.value = ord.name;
      orderSupplier.value = ord.supplier;
      orderSupplierId.value = ord.supplierOrderId || '';
      orderDate.value = ord.date;
      orderCost.value = ord.cost;
      orderWeightLbs.value = ord.weightLbs;
      orderAdjustGrams.value = ord.adjustGrams || 0;
      orderBeanUrl.value = ord.url;
      updateOrderWeightPreview();
      setDrawerState('order-entry-drawer', true);
      document.getElementById('order-entry-drawer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      orderAdjustGrams.focus();
      renderGreenBeanOrdersTable();
    }

    function cancelEditOrder() {
      editingOrderId = null;
      orderFormTitle.textContent = 'Record Green Bean Order';
      orderCancelEditBtn.style.display = 'none';
      orderSubmitBtn.textContent = 'Save Green Bean Order';
      orderBeanSelect.value = '__new__';
      syncSearchableSelect(orderBeanSelect);
      orderBeanName.value = '';
      orderSupplier.value = '';
      orderSupplierId.value = '';
      orderDate.value = todayIso();
      orderCost.value = '';
      orderWeightLbs.value = '';
      orderAdjustGrams.value = '0';
      orderBeanUrl.value = '';
      updateOrderWeightPreview();
      setDrawerState('order-entry-drawer', false);
      renderGreenBeanOrdersTable();
    }

    function switchToTab(targetTab, highlightId) {
      tabsContainer.querySelectorAll('.roast-admin-tab-btn').forEach(function (b) {
        var isTarget = b.getAttribute('data-tab') === targetTab;
        b.classList.toggle('roast-admin-tab-btn--active', isTarget);
        b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      ['beans', 'orders', 'roasts', 'packaging'].forEach(function (p) {
        var panelEl = document.getElementById('roast-admin-panel-' + p);
        panelEl.classList.toggle('roast-admin-panel--active', p === targetTab);
      });

      if (targetTab === 'beans') renderActiveBeansTable();
      else if (targetTab === 'orders') renderGreenBeanOrdersTable();
      else if (targetTab === 'roasts') renderRoastLogsTable();
      else if (targetTab === 'packaging') renderBlendPackagingTable();

      if (highlightId) {
        applySearch(highlightId);
        setTimeout(function () {
          var targetRow = document.querySelector('[data-row-id="' + highlightId + '"]');
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetRow.classList.add('roast-admin-row-highlight');
            setTimeout(function () {
              targetRow.classList.remove('roast-admin-row-highlight');
            }, 2600);
          }
        }, 80);
      }
    }

    function renderGreenBeanOrdersTable() {
      recomputeActiveBeanStocks(state);
      var filterYear = ordersFilterYear.value;
      var filterMonth = ordersFilterMonth.value;
      var filterBean = ordersFilterBean.value;
      var filterSupplier = ordersFilterSupplier.value;

      var filtered = state.greenBeanOrders.filter(function (o) {
        var ym = extractYearMonth(o.date);
        if (filterYear !== 'all' && ym.year !== filterYear) return false;
        if (filterMonth !== 'all' && ym.month !== filterMonth) return false;
        if (filterBean !== 'all' && o.name !== filterBean) return false;
        if (filterSupplier !== 'all' && o.supplier !== filterSupplier) return false;
        return matchesSearch([o.orderId, o.supplierOrderId, o.name, o.supplier, o.date]);
      });

      if (filtered.length === 0) {
        ordersTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No green bean orders match the selected filters.</div>';
        return;
      }

      var weightAgg = ordersAggWeight.value;
      var costAgg = ordersAggCost.value;
      var unitCostAgg = ordersAggUnitCost.value;
      var remAgg = ordersAggRemaining.value;
      var gCols = groupByCols.orders;

      var allWeightG = filtered.map(function (o) { return Number(o.weightGrams) || lbsToGrams(o.weightLbs); });
      var allWeightLbs = filtered.map(function (o) { return Number(o.weightLbs) || 0; });
      var allCost = filtered.map(function (o) { return Number(o.cost) || 0; });
      var allUnitCost = filtered.map(function (o) {
        var l = Number(o.weightLbs) || 0;
        return l > 0 ? ((Number(o.cost) || 0) / l) : 0;
      });
      var allRemG = filtered.map(function (o) {
        var g = Number(o.weightGrams) || lbsToGrams(o.weightLbs);
        return o.availableGrams !== undefined ? Number(o.availableGrams) : g;
      });

      var totWeightG = Math.round(computeAgg(allWeightG, weightAgg));
      var totWeightLbs = (totWeightG / GRAMS_PER_LB).toFixed(2);
      var totCostVal = computeAgg(allCost, costAgg);
      var totUnitCostVal = unitCostAgg === 'avg'
        ? (computeAgg(allWeightLbs, 'sum') > 0 ? (computeAgg(allCost, 'sum') / computeAgg(allWeightLbs, 'sum')) : 0)
        : computeAgg(allUnitCost, unitCostAgg);
      var totRemG = Math.round(computeAgg(allRemG, remAgg));
      var totRemLbs = (totRemG / GRAMS_PER_LB).toFixed(2);

      if (gCols.length > 0) {
        var groupsMap = {};
        filtered.forEach(function (o) {
          var ym = extractYearMonth(o.date);
          var dimVals = {};
          var keyParts = gCols.map(function (c) {
            var v = '—';
            if (c === 'month') v = ym.yearMonth;
            else if (c === 'year') v = ym.year;
            else if (c === 'date') v = o.date;
            else if (c === 'supplier') v = o.supplier;
            else if (c === 'bean') v = o.name;
            dimVals[c] = v;
            return v;
          });
          var gKey = keyParts.join(' — ');
          if (!groupsMap[gKey]) {
            groupsMap[gKey] = {
              key: gKey,
              dimValues: dimVals,
              ordersCount: 0,
              weightValsG: [],
              weightValsLbs: [],
              costVals: [],
              unitCostVals: [],
              remValsG: []
            };
          }
          var grp = groupsMap[gKey];
          var wLbs = Number(o.weightLbs) || 0;
          var wG = Number(o.weightGrams) || lbsToGrams(wLbs);
          var cVal = Number(o.cost) || 0;
          var rG = o.availableGrams !== undefined ? Number(o.availableGrams) : wG;
          grp.ordersCount++;
          grp.weightValsG.push(wG);
          grp.weightValsLbs.push(wLbs);
          grp.costVals.push(cVal);
          if (wLbs > 0) grp.unitCostVals.push(cVal / wLbs);
          grp.remValsG.push(rG);
        });

        var groupedRows = Object.keys(groupsMap).map(function (k) {
          var g = groupsMap[k];
          g.orderedWeightGrams = Math.round(computeAgg(g.weightValsG, weightAgg));
          g.totalSpend = computeAgg(g.costVals, costAgg);
          var sumLbs = computeAgg(g.weightValsLbs, 'sum');
          var sumSpend = computeAgg(g.costVals, 'sum');
          g.unitCostVal = unitCostAgg === 'avg'
            ? (sumLbs > 0 ? (sumSpend / sumLbs) : 0)
            : computeAgg(g.unitCostVals, unitCostAgg);
          g.remGramsVal = Math.round(computeAgg(g.remValsG, remAgg));
          return g;
        }).sort(function (a, b) {
          var dir = gbOrdersSortDir === 'asc' ? 1 : -1;
          var cmp = 0;
          if (gbOrdersSortCol.indexOf('dim:') === 0) {
            var dKey = gbOrdersSortCol.slice(4);
            cmp = String(a.dimValues[dKey]).localeCompare(String(b.dimValues[dKey]));
          } else if (gbOrdersSortCol === 'orders') cmp = a.ordersCount - b.ordersCount;
          else if (gbOrdersSortCol === 'weightGrams') cmp = a.orderedWeightGrams - b.orderedWeightGrams;
          else if (gbOrdersSortCol === 'cost') cmp = a.totalSpend - b.totalSpend;
          else if (gbOrdersSortCol === 'unitCost') cmp = a.unitCostVal - b.unitCostVal;
          else if (gbOrdersSortCol === 'availableGrams') cmp = a.remGramsVal - b.remGramsVal;
          else cmp = a.key.localeCompare(b.key);
          return cmp !== 0 ? cmp * dir : b.key.localeCompare(a.key);
        });

        var gHtml = '<table class="roast-admin-table"><thead><tr>';
        gCols.forEach(function (colId) {
          gHtml += renderSortTh(DIMENSION_LABELS[colId] || colId, 'dim:' + colId, gbOrdersSortCol, gbOrdersSortDir, false);
        });
        gHtml += renderSortTh('Orders', 'orders', gbOrdersSortCol, gbOrdersSortDir, true);
        if (weightAgg !== 'hide') gHtml += renderSortTh('Weight (' + weightAgg.toUpperCase() + ')', 'weightGrams', gbOrdersSortCol, gbOrdersSortDir, true);
        if (costAgg !== 'hide') gHtml += renderSortTh('Spend (' + costAgg.toUpperCase() + ')', 'cost', gbOrdersSortCol, gbOrdersSortDir, true);
        if (unitCostAgg !== 'hide') gHtml += renderSortTh('Unit Cost (' + unitCostAgg.toUpperCase() + ')', 'unitCost', gbOrdersSortCol, gbOrdersSortDir, true);
        if (remAgg !== 'hide') gHtml += renderSortTh('Available (' + remAgg.toUpperCase() + ')', 'availableGrams', gbOrdersSortCol, gbOrdersSortDir, true);
        gHtml += '</tr></thead><tbody>';

        groupedRows.forEach(function (r) {
          var rowLbs = (r.orderedWeightGrams / GRAMS_PER_LB).toFixed(2);
          var remLbs = (r.remGramsVal / GRAMS_PER_LB).toFixed(2);
          gHtml += '<tr>';
          gCols.forEach(function (colId) {
            gHtml += '<td><strong>' + escapeHtml(r.dimValues[colId]) + '</strong></td>';
          });
          gHtml += '<td class="mono" style="text-align: right;">' + r.ordersCount + '</td>';
          if (weightAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rowLbs + ' lbs</strong><div class="cell-sub">' + r.orderedWeightGrams.toLocaleString() + ' g</div></td>';
          if (costAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">$' + Number(r.totalSpend).toFixed(2) + '</td>';
          if (unitCostAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">$' + Number(r.unitCostVal).toFixed(2) + ' / lb</td>';
          if (remAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + remLbs + ' lbs</strong><div class="cell-sub">' + r.remGramsVal.toLocaleString() + ' g</div></td>';
          gHtml += '</tr>';
        });

        gHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + gCols.length + '">Total (' + filtered.length + ' orders)</td>' +
          '<td class="mono" style="text-align: right;">' + filtered.length + '</td>';
        if (weightAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totWeightLbs + ' lbs</strong><div class="cell-sub">' + totWeightG.toLocaleString() + ' g</div></td>';
        if (costAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">$' + totCostVal.toFixed(2) + '</td>';
        if (unitCostAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;">$' + totUnitCostVal.toFixed(2) + ' / lb</td>';
        if (remAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totRemLbs + ' lbs</strong><div class="cell-sub">' + totRemG.toLocaleString() + ' g</div></td>';
        gHtml += '</tr></tfoot></table>';

        ordersTableWrap.innerHTML = gHtml;
        bindSortHeaders(ordersTableWrap, function () {
          return { col: gbOrdersSortCol, dir: gbOrdersSortDir };
        }, function (c, d) {
          gbOrdersSortCol = c;
          gbOrdersSortDir = d;
        }, ['orders', 'weightGrams', 'cost', 'unitCost', 'availableGrams'], renderGreenBeanOrdersTable);
        return;
      }

      var rows = filtered.slice().sort(function (a, b) {
        var dir = gbOrdersSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (gbOrdersSortCol === 'orderId') cmp = a.orderId.localeCompare(b.orderId);
        else if (gbOrdersSortCol === 'date') cmp = a.date.localeCompare(b.date);
        else if (gbOrdersSortCol === 'name') cmp = a.name.localeCompare(b.name);
        else if (gbOrdersSortCol === 'supplier') cmp = a.supplier.localeCompare(b.supplier);
        else if (gbOrdersSortCol === 'cost') cmp = (Number(a.cost) || 0) - (Number(b.cost) || 0);
        else if (gbOrdersSortCol === 'weightGrams') cmp = (Number(a.weightGrams) || 0) - (Number(b.weightGrams) || 0);
        else if (gbOrdersSortCol === 'availableGrams') cmp = (Number(a.availableGrams) || 0) - (Number(b.availableGrams) || 0);
        return cmp !== 0 ? cmp * dir : (b.date.localeCompare(a.date) || b.orderId.localeCompare(a.orderId));
      });

      var html = '<table class="roast-admin-table roast-admin-table--gb-orders"><thead><tr>' +
        renderSortTh('Date', 'date', gbOrdersSortCol, gbOrdersSortDir, false, 'roast-col-date') +
        renderSortTh('Order ID', 'orderId', gbOrdersSortCol, gbOrdersSortDir, false, 'roast-col-id') +
        renderSortTh('Green Bean', 'name', gbOrdersSortCol, gbOrdersSortDir, false, 'roast-col-bean') +
        renderSortTh('Supplier', 'supplier', gbOrdersSortCol, gbOrdersSortDir, false, 'roast-col-supplier') +
        renderSortTh('Weight & Cost', 'weightGrams', gbOrdersSortCol, gbOrdersSortDir, false, 'roast-col-weight-cost');
      if (remAgg !== 'hide') html += renderSortTh('Remaining', 'availableGrams', gbOrdersSortCol, gbOrdersSortDir, true, 'roast-col-remaining');
      html += '<th class="roast-col-action" style="text-align: right;">Action</th></tr></thead><tbody>';

      rows.forEach(function (o) {
        var baseG = lbsToGrams(o.weightLbs);
        var adjG = Number(o.adjustGrams) || 0;
        var grams = Number(o.weightGrams) || (baseG + adjG);
        var availGrams = o.availableGrams !== undefined ? o.availableGrams : grams;
        var lbsNum = Number(o.weightLbs) || 0;
        var costNum = Number(o.cost) || 0;
        var unitCost = lbsNum > 0 ? ('$' + (costNum / lbsNum).toFixed(2) + '/lb') : '—';
        var beanCell = o.url
          ? '<a href="' + escapeHtml(o.url) + '" target="_blank" rel="noopener"><strong>' + escapeHtml(o.name) + '</strong> &nearr;</a>'
          : '<strong>' + escapeHtml(o.name) + '</strong>';
        var adjTag = adjG !== 0
          ? ' <span style="color: ' + (adjG > 0 ? '#1e7e44' : '#b35300') + '; font-weight: 600;">(' + (adjG > 0 ? '+' : '') + adjG + 'g)</span>'
          : '';
        var availColor = availGrams <= 0 ? '#a93226' : (availGrams < 454 ? '#b35300' : '#1e7e44');
        var totalLbsStr = (grams / GRAMS_PER_LB).toFixed(2);
        var availLbsStr = (availGrams / GRAMS_PER_LB).toFixed(2);
        var availCell = availGrams <= 0
          ? '<span style="color: #a93226; font-weight: 600;">0.00 lbs</span><div class="cell-sub" style="color: #a93226;">0 g &bull; Depleted</div>'
          : '<strong style="color: ' + availColor + ';">' + availLbsStr + ' lbs</strong><div class="cell-sub">' + availGrams.toLocaleString() + ' g / ' + totalLbsStr + ' lbs</div>';
        var rowStyle = editingOrderId === o.orderId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';
        var suppSub = o.supplierOrderId
          ? '<div class="cell-sub"><button type="button" class="roast-supplier-order-filter-link" data-filter-supplier-order="' + escapeHtml(o.supplierOrderId) + '" title="Filter by supplier order #' + escapeHtml(o.supplierOrderId) + '">#' + escapeHtml(o.supplierOrderId) + '</button></div>'
          : '';

        html += '<tr data-row-id="' + escapeHtml(o.orderId) + '"' + rowStyle + '>' +
          '<td class="mono roast-col-date">' + escapeHtml(o.date) + '</td>' +
          '<td class="primary-cell roast-col-id"><span class="roast-admin-id-chip">' + escapeHtml(o.orderId) + '</span></td>' +
          '<td class="roast-col-bean">' + beanCell + '</td>' +
          '<td class="roast-col-supplier">' + escapeHtml(o.supplier) + suppSub + '</td>' +
          '<td class="mono roast-col-weight-cost">' +
          '  <div class="roast-dual-num-row">' +
          '    <span class="roast-num-part roast-num-part--weight"><strong>' + totalLbsStr + ' lbs</strong></span>' +
          '    <span class="roast-num-part roast-num-part--cost">$' + costNum.toFixed(2) + '</span>' +
          '  </div>' +
          '  <div class="cell-sub roast-dual-num-row">' +
          '    <span class="roast-num-part roast-num-part--weight">' + grams.toLocaleString() + ' g' + adjTag + '</span>' +
          '    <span class="roast-num-part roast-num-part--cost">' + unitCost + '</span>' +
          '  </div>' +
          '</td>';
        if (remAgg !== 'hide') html += '<td class="mono roast-col-remaining" style="text-align: right;">' + availCell + '</td>';
        html += '<td class="roast-col-action" style="text-align: right;"><button type="button" class="order-admin-btn-sm" data-edit-order="' + escapeHtml(o.orderId) + '">Edit</button></td></tr>';
      });

      var footWeightPart = weightAgg !== 'hide' ? ('<strong>' + totWeightLbs + ' lbs</strong> (' + escapeHtml(weightAgg.toUpperCase()) + ')') : '';
      var footCostPart = costAgg !== 'hide' ? ('$' + totCostVal.toFixed(2) + ' (' + escapeHtml(costAgg.toUpperCase()) + ')') : '';
      var footSubWeight = weightAgg !== 'hide' ? (totWeightG.toLocaleString() + ' g') : '';
      var footSubUnit = unitCostAgg !== 'hide' ? ('$' + totUnitCostVal.toFixed(2) + '/lb (' + escapeHtml(unitCostAgg.toUpperCase()) + ')') : '';

      html += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
        '<td colspan="4">Summary (' + rows.length + ' orders)</td>' +
        '<td class="mono roast-col-weight-cost">' +
        '  <div class="roast-dual-num-row">' +
        '    <span class="roast-num-part roast-num-part--weight">' + footWeightPart + '</span>' +
        '    <span class="roast-num-part roast-num-part--cost">' + footCostPart + '</span>' +
        '  </div>' +
        '  <div class="cell-sub roast-dual-num-row">' +
        '    <span class="roast-num-part roast-num-part--weight">' + footSubWeight + '</span>' +
        '    <span class="roast-num-part roast-num-part--cost">' + footSubUnit + '</span>' +
        '  </div>' +
        '</td>';
      if (remAgg !== 'hide') {
        html += '<td class="mono roast-col-remaining" style="text-align: right;"><strong>' + totRemLbs + ' lbs</strong><div class="cell-sub">' + totRemG.toLocaleString() + ' g (' + escapeHtml(remAgg.toUpperCase()) + ')</div></td>';
      }
      html += '<td></td></tr></tfoot></table>';
      ordersTableWrap.innerHTML = html;

      ordersTableWrap.querySelectorAll('[data-edit-order]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditOrder(btn.getAttribute('data-edit-order'));
        });
      });

      ordersTableWrap.querySelectorAll('[data-filter-supplier-order]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          applySearch(btn.getAttribute('data-filter-supplier-order'));
        });
      });

      bindSortHeaders(ordersTableWrap, function () {
        return { col: gbOrdersSortCol, dir: gbOrdersSortDir };
      }, function (c, d) {
        gbOrdersSortCol = c;
        gbOrdersSortDir = d;
      }, ['date', 'cost', 'weightGrams', 'availableGrams'], renderGreenBeanOrdersTable);
    }

    function buildGreenOrderOptionsHtml(selectedVal) {
      recomputeActiveBeanStocks(state, editingPkgId, editingRoastId);
      var html = '';
      state.greenBeanOrders.slice().reverse().forEach(function (o) {
        var orderGrams = Number(o.weightGrams) || lbsToGrams(o.weightLbs);
        var availGrams = o.availableGrams !== undefined ? o.availableGrams : orderGrams;
        if (availGrams <= 0 && o.orderId !== selectedVal) return;
        var isSel = o.orderId === selectedVal ? ' selected' : '';
        var oTotalLbs = (orderGrams / GRAMS_PER_LB).toFixed(2);
        var oAvailLbs = (availGrams / GRAMS_PER_LB).toFixed(2);
        html += '<option value="' + escapeHtml(o.orderId) + '" data-avail-grams="' + availGrams + '" data-bean-name="' + escapeHtml(o.name) + '"' + isSel + '>' +
          escapeHtml(o.orderId) + ' — ' + escapeHtml(o.name) + ' (Avail: ' + oAvailLbs + ' lbs / ' + oTotalLbs + ' lbs [' + availGrams + 'g], ' + escapeHtml(o.supplier) + ')</option>';
      });
      return html;
    }

    function syncRoastComponentRowMax(row) {
      var sel = row.querySelector('.roast-comp-order');
      var gramsInput = row.querySelector('.roast-comp-grams');
      var selectedOpt = sel.options[sel.selectedIndex];
      if (selectedOpt) {
        var maxGrams = Number(selectedOpt.getAttribute('data-avail-grams')) || 0;
        gramsInput.max = String(maxGrams);
        gramsInput.placeholder = 'Max ' + maxGrams + 'g';
      }
    }

    function addRoastComponentRow(defaultOrderId, defaultGrams) {
      var row = document.createElement('div');
      row.className = 'roast-admin-component-row';
      row.innerHTML = '<select class="roast-admin-select roast-comp-order" required>' +
        buildGreenOrderOptionsHtml(defaultOrderId) +
        '</select>' +
        '<input type="number" class="roast-admin-input roast-comp-grams" step="1" min="1" placeholder="Grams (g)" value="' + (defaultGrams || '') + '" required>' +
        '<button type="button" class="roast-admin-remove-btn" title="Remove green bean order">&times;</button>';

      var sel = row.querySelector('.roast-comp-order');
      var gramsInput = row.querySelector('.roast-comp-grams');
      enhanceSearchableSelect(sel, 'Search green bean order by name, ID, supplier...');
      sel.addEventListener('change', function () {
        syncRoastComponentRowMax(row);
        updateRoastLossPreview();
      });
      gramsInput.addEventListener('input', updateRoastLossPreview);
      syncRoastComponentRowMax(row);

      row.querySelector('.roast-admin-remove-btn').addEventListener('click', function () {
        if (roastCompsContainer.children.length > 1) {
          row.remove();
          updateRoastLossPreview();
        }
      });

      roastCompsContainer.appendChild(row);
      updateRoastLossPreview();
    }

    function refreshRoastComponentDropdowns() {
      var rows = roastCompsContainer.querySelectorAll('.roast-admin-component-row');
      if (rows.length === 0) {
        addRoastComponentRow();
        return;
      }
      rows.forEach(function (row) {
        var sel = row.querySelector('.roast-comp-order');
        var currentVal = sel.value;
        sel.innerHTML = buildGreenOrderOptionsHtml(currentVal);
        syncSearchableSelect(sel);
        syncRoastComponentRowMax(row);
      });
      updateRoastLossPreview();
    }

    function startEditRoast(roastId) {
      var rst = state.roastLogs.find(function (r) { return r.roastId === roastId; });
      editingRoastId = rst.roastId;
      roastFormTitle.textContent = 'Edit Roast Log (' + rst.roastId + ')';
      roastCancelEditBtn.style.display = 'inline-block';
      roastSubmitBtn.textContent = 'Update Roast ' + rst.roastId;
      roastFeedback.style.display = 'none';

      roastDate.value = rst.date;
      if (Array.from(roastLevelSelect.options).some(function (opt) { return opt.value === String(rst.roastLevel); })) {
        roastLevelSelect.value = String(rst.roastLevel);
      } else {
        var matchByText = Array.from(roastLevelSelect.options).find(function (opt) {
          return opt.textContent.trim().toLowerCase() === String(rst.roastLevel).trim().toLowerCase();
        });
        if (matchByText) roastLevelSelect.value = matchByText.value;
      }
      roastEndGrams.value = rst.endWeightGrams;
      roastProfileUrl.value = rst.profileUrl;
      roastNotes.value = rst.notes || '';

      roastCompsContainer.innerHTML = '';
      var gComps = rst.greenBeanComponents || [];
      if (gComps.length === 0) addRoastComponentRow();
      else gComps.forEach(function (gc) { addRoastComponentRow(gc.orderId, gc.weightGrams); });

      updateRoastLossPreview();
      setDrawerState('roast-entry-drawer', true);
      renderRoastLogsTable();
    }

    function cancelEditRoast() {
      editingRoastId = null;
      roastFormTitle.textContent = 'Record Roast Log';
      roastCancelEditBtn.style.display = 'none';
      roastSubmitBtn.textContent = 'Save Roast Log';
      roastDate.value = todayIso();
      roastEndGrams.value = '';
      roastProfileUrl.value = '';
      roastNotes.value = '';
      roastCompsContainer.innerHTML = '';
      addRoastComponentRow();
      updateRoastLossPreview();
      setDrawerState('roast-entry-drawer', false);
      renderRoastLogsTable();
    }

    function renderRoastLogsTable() {
      recomputeActiveBeanStocks(state);
      var filterYear = roastsFilterYear.value;
      var filterMonth = roastsFilterMonth.value;
      var filterBean = roastsFilterBean.value;
      var filterRoastLevel = roastsFilterRoastLevel.value;

      var supplierByBean = {};
      state.greenBeanOrders.forEach(function (o) {
        if (o.name && o.supplier) supplierByBean[o.name] = o.supplier;
      });

      var filtered = state.roastLogs.filter(function (r) {
        var ym = extractYearMonth(r.date);
        if (filterYear !== 'all' && ym.year !== filterYear) return false;
        if (filterMonth !== 'all' && ym.month !== filterMonth) return false;
        if (filterBean !== 'all' && r.beanName !== filterBean) return false;
        if (filterRoastLevel !== 'all' && String(r.roastLevel) !== String(filterRoastLevel)) return false;

        var compText = (r.greenBeanComponents || []).map(function (c) { return c.orderId; }).join(' ');
        return matchesSearch([r.roastId, compText, r.beanName, r.date, r.notes]);
      });

      if (filtered.length === 0) {
        roastsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No roast logs match the selected filters.</div>';
        return;
      }

      var greenAgg = roastsAggGreen.value;
      var endAgg = roastsAggEnd.value;
      var lossAgg = roastsAggLoss.value;
      var availAgg = roastsAggAvail.value;
      var gCols = groupByCols.roasts;

      var allGreenG = filtered.map(function (r) { return Number(r.greenWeightGrams) || 0; });
      var allEndG = filtered.map(function (r) { return Number(r.endWeightGrams) || 0; });
      var allLoss = filtered.map(function (r) { return Number(r.weightLossPct) || computeWeightLossPct(r.greenWeightGrams, r.endWeightGrams); });
      var allAvailG = filtered.map(function (r) { return r.availableGrams !== undefined ? Number(r.availableGrams) : (Number(r.endWeightGrams) || 0); });

      var totGreenG = Math.round(computeAgg(allGreenG, greenAgg));
      var totGreenLbs = (totGreenG / GRAMS_PER_LB).toFixed(2);
      var totEndG = Math.round(computeAgg(allEndG, endAgg));
      var totEndLbs = (totEndG / GRAMS_PER_LB).toFixed(2);
      var totLossPct = (lossAgg === 'avg'
        ? computeWeightLossPct(computeAgg(allGreenG, 'sum'), computeAgg(allEndG, 'sum'))
        : computeAgg(allLoss, lossAgg)).toFixed(1);
      var totAvailG = Math.round(computeAgg(allAvailG, availAgg));
      var totAvailLbs = (totAvailG / GRAMS_PER_LB).toFixed(2);

      if (gCols.length > 0) {
        var groupsMap = {};
        filtered.forEach(function (r) {
          var ym = extractYearMonth(r.date);
          var dimVals = {};
          var keyParts = gCols.map(function (c) {
            var v = '—';
            if (c === 'month') v = ym.yearMonth;
            else if (c === 'year') v = ym.year;
            else if (c === 'date') v = r.date;
            else if (c === 'bean') v = r.beanName || 'Unknown Bean';
            else if (c === 'supplier') v = supplierByBean[r.beanName] || 'Unknown';
            else if (c === 'roastLevel') {
              var lvlObj = roastLevels[String(r.roastLevel)];
              v = lvlObj ? (lvlObj.specialty || lvlObj.name) : String(r.roastLevel || '—');
            }
            dimVals[c] = v;
            return v;
          });
          var gKey = keyParts.join(' — ');
          if (!groupsMap[gKey]) {
            groupsMap[gKey] = {
              key: gKey,
              dimValues: dimVals,
              roastCount: 0,
              greenVals: [],
              endVals: [],
              lossVals: [],
              availVals: []
            };
          }
          var grp = groupsMap[gKey];
          grp.roastCount++;
          grp.greenVals.push(Number(r.greenWeightGrams) || 0);
          grp.endVals.push(Number(r.endWeightGrams) || 0);
          grp.lossVals.push(Number(r.weightLossPct) || computeWeightLossPct(r.greenWeightGrams, r.endWeightGrams));
          grp.availVals.push(r.availableGrams !== undefined ? Number(r.availableGrams) : (Number(r.endWeightGrams) || 0));
        });

        var groupedRows = Object.keys(groupsMap).map(function (k) {
          var g = groupsMap[k];
          g.greenWeightGrams = Math.round(computeAgg(g.greenVals, greenAgg));
          g.endWeightGrams = Math.round(computeAgg(g.endVals, endAgg));
          g.lossPctVal = lossAgg === 'avg'
            ? computeWeightLossPct(computeAgg(g.greenVals, 'sum'), computeAgg(g.endVals, 'sum'))
            : computeAgg(g.lossVals, lossAgg);
          g.availGramsVal = Math.round(computeAgg(g.availVals, availAgg));
          return g;
        }).sort(function (a, b) {
          var dir = roastLogSortDir === 'asc' ? 1 : -1;
          var cmp = 0;
          if (roastLogSortCol.indexOf('dim:') === 0) {
            var dKey = roastLogSortCol.slice(4);
            cmp = String(a.dimValues[dKey]).localeCompare(String(b.dimValues[dKey]));
          } else if (roastLogSortCol === 'roasts') cmp = a.roastCount - b.roastCount;
          else if (roastLogSortCol === 'greenWeight') cmp = a.greenWeightGrams - b.greenWeightGrams;
          else if (roastLogSortCol === 'endWeight') cmp = a.endWeightGrams - b.endWeightGrams;
          else if (roastLogSortCol === 'lossPct') cmp = a.lossPctVal - b.lossPctVal;
          else if (roastLogSortCol === 'availWeight') cmp = a.availGramsVal - b.availGramsVal;
          else cmp = a.key.localeCompare(b.key);
          return cmp !== 0 ? cmp * dir : b.key.localeCompare(a.key);
        });

        var gHtml = '<table class="roast-admin-table"><thead><tr>';
        gCols.forEach(function (colId) {
          gHtml += renderSortTh(DIMENSION_LABELS[colId] || colId, 'dim:' + colId, roastLogSortCol, roastLogSortDir, false);
        });
        gHtml += renderSortTh('Roasts', 'roasts', roastLogSortCol, roastLogSortDir, true);
        if (greenAgg !== 'hide') gHtml += renderSortTh('Green Weight (' + greenAgg.toUpperCase() + ')', 'greenWeight', roastLogSortCol, roastLogSortDir, true);
        if (endAgg !== 'hide') gHtml += renderSortTh('End Weight (' + endAgg.toUpperCase() + ')', 'endWeight', roastLogSortCol, roastLogSortDir, true);
        if (lossAgg !== 'hide') gHtml += renderSortTh('Weight Loss (' + lossAgg.toUpperCase() + ')', 'lossPct', roastLogSortCol, roastLogSortDir, true);
        if (availAgg !== 'hide') gHtml += renderSortTh('Available Yield (' + availAgg.toUpperCase() + ')', 'availWeight', roastLogSortCol, roastLogSortDir, true);
        gHtml += '</tr></thead><tbody>';

        groupedRows.forEach(function (r) {
          var rGreenLbs = (r.greenWeightGrams / GRAMS_PER_LB).toFixed(2);
          var rEndLbs = (r.endWeightGrams / GRAMS_PER_LB).toFixed(2);
          var rAvailLbs = (r.availGramsVal / GRAMS_PER_LB).toFixed(2);
          gHtml += '<tr>';
          gCols.forEach(function (colId) {
            gHtml += '<td><strong>' + escapeHtml(r.dimValues[colId]) + '</strong></td>';
          });
          gHtml += '<td class="mono" style="text-align: right;">' + r.roastCount + '</td>';
          if (greenAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rGreenLbs + ' lbs</strong><div class="cell-sub">' + r.greenWeightGrams.toLocaleString() + ' g</div></td>';
          if (endAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rEndLbs + ' lbs</strong><div class="cell-sub">' + r.endWeightGrams.toLocaleString() + ' g</div></td>';
          if (lossAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><span class="metric-loss">-' + Number(r.lossPctVal).toFixed(1) + '%</span></td>';
          if (availAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rAvailLbs + ' lbs</strong><div class="cell-sub">' + r.availGramsVal.toLocaleString() + ' g</div></td>';
          gHtml += '</tr>';
        });

        gHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + gCols.length + '">Total (' + filtered.length + ' roasts)</td>' +
          '<td class="mono" style="text-align: right;">' + filtered.length + '</td>';
        if (greenAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totGreenLbs + ' lbs</strong><div class="cell-sub">' + totGreenG.toLocaleString() + ' g</div></td>';
        if (endAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totEndLbs + ' lbs</strong><div class="cell-sub">' + totEndG.toLocaleString() + ' g</div></td>';
        if (lossAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><span class="metric-loss">-' + totLossPct + '%</span></td>';
        if (availAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totAvailLbs + ' lbs</strong><div class="cell-sub">' + totAvailG.toLocaleString() + ' g</div></td>';
        gHtml += '</tr></tfoot></table>';

        roastsTableWrap.innerHTML = gHtml;
        bindSortHeaders(roastsTableWrap, function () {
          return { col: roastLogSortCol, dir: roastLogSortDir };
        }, function (c, d) {
          roastLogSortCol = c;
          roastLogSortDir = d;
        }, ['roasts', 'greenWeight', 'endWeight', 'lossPct', 'availWeight'], renderRoastLogsTable);
        return;
      }

      var rows = filtered.slice().sort(function (a, b) {
        var dir = roastLogSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (roastLogSortCol === 'roastId') cmp = a.roastId.localeCompare(b.roastId);
        else if (roastLogSortCol === 'date') cmp = a.date.localeCompare(b.date);
        else if (roastLogSortCol === 'beanName') cmp = (a.beanName || '').localeCompare(b.beanName || '');
        else if (roastLogSortCol === 'lossPct') cmp = (Number(a.weightLossPct) || 0) - (Number(b.weightLossPct) || 0);
        return cmp !== 0 ? cmp * dir : (b.date.localeCompare(a.date) || b.roastId.localeCompare(a.roastId));
      });

      var html = '<table class="roast-admin-table roast-admin-table--roasts"><thead><tr>' +
        renderSortTh('Date', 'date', roastLogSortCol, roastLogSortDir, false, 'roast-col-date') +
        renderSortTh('Batch', 'roastId', roastLogSortCol, roastLogSortDir, false, 'roast-col-batch') +
        renderSortTh('Bean & Roast Level', 'beanName', roastLogSortCol, roastLogSortDir, false, 'roast-col-bean') +
        '<th class="roast-col-green-orders">Green Orders</th>' +
        renderSortTh('Yield & Loss', 'lossPct', roastLogSortCol, roastLogSortDir, true, 'roast-col-yield') +
        '<th class="roast-col-notes">Notes</th>' +
        '<th class="roast-col-action" style="text-align: right;">Action</th>' +
        '</tr></thead><tbody>';

      rows.forEach(function (r) {
        var lvlObj = roastLevels[String(r.roastLevel)];
        var lvlLabel = lvlObj ? (lvlObj.specialty || lvlObj.name) : String(r.roastLevel || '—');
        var profileCell = r.profileUrl
          ? '<a href="' + escapeHtml(r.profileUrl) + '" target="_blank" rel="noopener">Profile &nearr;</a>'
          : '';
        var gCompsHtml = (r.greenBeanComponents || []).map(function (c) {
          return '<a href="#tab=orders&id=' + encodeURIComponent(c.orderId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" data-nav-tab="orders" data-nav-id="' + escapeHtml(c.orderId) + '" title="View order ' + escapeHtml(c.orderId) + '">' + escapeHtml(c.orderId) + '</a>';
        }).join('');
        var gCompsWrap = gCompsHtml ? ('<div class="roast-chip-stack">' + gCompsHtml + '</div>') : '—';
        var rowStyle = editingRoastId === r.roastId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';

        html += '<tr data-row-id="' + escapeHtml(r.roastId) + '"' + rowStyle + '>' +
          '<td class="mono roast-col-date">' + escapeHtml(r.date) + '</td>' +
          '<td class="primary-cell roast-col-batch"><span class="roast-admin-id-chip">' + escapeHtml(r.roastId) + '</span></td>' +
          '<td class="roast-col-bean"><strong>' + escapeHtml(r.beanName) + '</strong><div class="cell-sub">Level: ' + escapeHtml(lvlLabel) + (profileCell ? ' &bull; ' + profileCell : '') + '</div></td>' +
          '<td class="roast-col-green-orders">' + gCompsWrap + '</td>' +
          '<td class="mono roast-col-yield" style="text-align: right;"><strong>' + r.greenWeightGrams + 'g &rarr; ' + r.endWeightGrams + 'g</strong> <span class="metric-loss">(-' + Number(r.weightLossPct).toFixed(1) + '%)</span></td>' +
          '<td class="roast-col-notes">' + escapeHtml(r.notes || '—') + '</td>' +
          '<td class="roast-col-action" style="text-align: right;"><button type="button" class="order-admin-btn-sm" data-edit-roast="' + escapeHtml(r.roastId) + '">Edit</button></td>' +
          '</tr>';
      });

      var yieldFootParts = [];
      if (greenAgg !== 'hide') yieldFootParts.push(totGreenG.toLocaleString() + 'g');
      if (endAgg !== 'hide') yieldFootParts.push(totEndG.toLocaleString() + 'g');
      var yieldFootMain = yieldFootParts.length > 0 ? ('<strong>' + yieldFootParts.join(' &rarr; ') + '</strong> ') : '';
      var yieldFootLoss = lossAgg !== 'hide' ? ('<span class="metric-loss">(-' + totLossPct + '%)</span>') : '';
      var yieldFootAvail = availAgg !== 'hide' ? ('<div class="cell-sub">Avail: ' + totAvailLbs + ' lbs (' + totAvailG.toLocaleString() + 'g)</div>') : '';

      html += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
        '<td colspan="4">Summary (' + rows.length + ' roasts)</td>' +
        '<td class="mono roast-col-yield" style="text-align: right;">' + yieldFootMain + yieldFootLoss + yieldFootAvail + '</td>' +
        '<td colspan="2"></td>' +
        '</tr></tfoot></table>';
      roastsTableWrap.innerHTML = html;

      roastsTableWrap.querySelectorAll('[data-nav-tab="orders"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          switchToTab('orders', link.getAttribute('data-nav-id'));
        });
      });

      roastsTableWrap.querySelectorAll('[data-edit-roast]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditRoast(btn.getAttribute('data-edit-roast'));
        });
      });

      bindSortHeaders(roastsTableWrap, function () {
        return { col: roastLogSortCol, dir: roastLogSortDir };
      }, function (c, d) {
        roastLogSortCol = c;
        roastLogSortDir = d;
      }, ['date', 'lossPct'], renderRoastLogsTable);
    }

    function buildRoastOptionsHtml(selectedVal) {
      recomputeActiveBeanStocks(state, editingPkgId);
      var html = '';
      state.roastLogs.slice().sort(function (a, b) {
        return a.date !== b.date ? b.date.localeCompare(a.date) : b.roastId.localeCompare(a.roastId);
      }).forEach(function (r) {
        if (r.availableGrams <= 0 && r.roastId !== selectedVal) return;
        var lvlObj = roastLevels[String(r.roastLevel)];
        var specialtyName = lvlObj ? (lvlObj.specialty || lvlObj.name) : String(r.roastLevel || '');
        var lvlLabel = specialtyName ? (' · ' + specialtyName) : '';
        var isSel = r.roastId === selectedVal ? ' selected' : '';
        var rAvailLbs = (r.availableGrams / GRAMS_PER_LB).toFixed(2);
        var rTotalLbs = (r.endWeightGrams / GRAMS_PER_LB).toFixed(2);
        html += '<option value="' + escapeHtml(r.roastId) + '" data-avail-grams="' + r.availableGrams + '"' + isSel + '>' +
          escapeHtml(r.roastId) + ' — ' + escapeHtml(r.beanName) + lvlLabel + ' (Avail: ' + rAvailLbs + ' lbs / ' + rTotalLbs + ' lbs [' + r.availableGrams + 'g], ' + escapeHtml(r.date) + ')</option>';
      });
      return html;
    }

    function getSelectedBagSizeGrams() {
      var opt = pkgBagSize.options[pkgBagSize.selectedIndex];
      if (opt && opt.getAttribute('data-weight-grams')) {
        return Number(opt.getAttribute('data-weight-grams')) || 0;
      }
      return calculateBagSizeGrams(pkgBagSize.value, bagSizes);
    }

    function updatePackagingPreview() {
      var totalBagGrams = getSelectedBagSizeGrams();
      var sumGrams = 0;
      var sumPct = 0;
      pkgCompsContainer.querySelectorAll('.roast-admin-component-row').forEach(function (row) {
        sumGrams += Number(row.querySelector('.pkg-comp-grams').value) || 0;
        sumPct += Number(row.querySelector('.pkg-comp-pct').value) || 0;
      });

      var targetText = totalBagGrams > 0 ? (totalBagGrams + ' g (' + escapeHtml(pkgBagSize.value) + ')') : 'Custom / Loose';
      var pctText = totalBagGrams > 0 ? (sumPct.toFixed(1) + '%') : '—';
      var statusColor = '';
      if (totalBagGrams > 0) {
        if (sumGrams === totalBagGrams) statusColor = 'color: #27ae60;';
        else if (sumGrams > totalBagGrams) statusColor = 'color: #c0392b;';
      }

      var sumLbs = (sumGrams / GRAMS_PER_LB).toFixed(2);
      var totalBagLbs = (totalBagGrams / GRAMS_PER_LB).toFixed(2);
      var blendCheckText = (totalBagGrams > 0 && Math.abs(sumGrams - totalBagGrams) < 2) ? '100.0% &check;' : pctText;

      pkgBlendPreview.innerHTML =
        '<div class="form-metric-item">Total Packaged: <strong style="' + statusColor + '">' + sumLbs + ' lbs (' + sumGrams.toLocaleString() + ' g)</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">Blend Check: <strong style="' + statusColor + '">' + blendCheckText + '</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">Target Bag: <strong>' + totalBagLbs + ' lbs (' + targetText + ')</strong></div>';
    }

    function syncComponentRowMax(row) {
      var sel = row.querySelector('.pkg-comp-roast');
      var gramsInput = row.querySelector('.pkg-comp-grams');
      var selectedOpt = sel.options[sel.selectedIndex];
      if (selectedOpt) {
        var maxGrams = Number(selectedOpt.getAttribute('data-avail-grams')) || 0;
        gramsInput.max = String(maxGrams);
        gramsInput.placeholder = 'Max ' + maxGrams + 'g';
      }
    }

    function addPkgComponentRow(defaultRoastId, defaultGrams) {
      var totalBagGrams = getSelectedBagSizeGrams();
      var defaultPct = '';
      if (defaultGrams && totalBagGrams > 0) {
        var p = (Number(defaultGrams) / totalBagGrams) * 100;
        defaultPct = p % 1 === 0 ? p.toFixed(0) : p.toFixed(1);
      }

      var row = document.createElement('div');
      row.className = 'roast-admin-component-row';
      row.innerHTML = '<select class="roast-admin-select pkg-comp-roast" required>' +
        buildRoastOptionsHtml(defaultRoastId) +
        '</select>' +
        '<input type="number" class="roast-admin-input pkg-comp-pct" step="any" min="0" max="100" placeholder="%" value="' + defaultPct + '" title="Blend percentage (%)">' +
        '<input type="number" class="roast-admin-input pkg-comp-grams" step="1" min="1" placeholder="Grams (g)" value="' + (defaultGrams || '') + '" required>' +
        '<button type="button" class="roast-admin-remove-btn" title="Remove component">&times;</button>';

      var sel = row.querySelector('.pkg-comp-roast');
      var pctInput = row.querySelector('.pkg-comp-pct');
      var gramsInput = row.querySelector('.pkg-comp-grams');

      enhanceSearchableSelect(sel, 'Search roast by bean name, roast ID, level...');
      sel.addEventListener('change', function () { syncComponentRowMax(row); });
      syncComponentRowMax(row);

      pctInput.addEventListener('input', function () {
        var total = getSelectedBagSizeGrams();
        var pctVal = parseFloat(pctInput.value);
        if (total > 0 && !isNaN(pctVal)) {
          var calcG = Math.round((pctVal / 100) * total);
          gramsInput.value = calcG > 0 ? calcG : '';
        }
        updatePackagingPreview();
      });

      gramsInput.addEventListener('input', function () {
        var total = getSelectedBagSizeGrams();
        var gVal = parseFloat(gramsInput.value);
        if (total > 0 && !isNaN(gVal)) {
          var calcP = (gVal / total) * 100;
          pctInput.value = calcP % 1 === 0 ? calcP.toFixed(0) : calcP.toFixed(1);
        } else if (!gramsInput.value) {
          pctInput.value = '';
        }
        updatePackagingPreview();
      });

      row.querySelector('.roast-admin-remove-btn').addEventListener('click', function () {
        if (pkgCompsContainer.children.length > 1) {
          row.remove();
          updatePackagingPreview();
        }
      });

      pkgCompsContainer.appendChild(row);
      updatePackagingPreview();
    }

    function refreshPkgComponentDropdowns() {
      var rows = pkgCompsContainer.querySelectorAll('.roast-admin-component-row');
      if (rows.length === 0) {
        addPkgComponentRow();
        return;
      }
      rows.forEach(function (row) {
        var sel = row.querySelector('.pkg-comp-roast');
        var currentVal = sel.value;
        sel.innerHTML = buildRoastOptionsHtml(currentVal);
        syncSearchableSelect(sel);
        syncComponentRowMax(row);
      });
    }

    function syncPkgPurposeVisibility() {
      pkgCustomerOrderWrap.style.display = pkgPurpose.value === 'Order' ? 'flex' : 'none';
      if (pkgPurpose.value !== 'Order') {
        pkgOrderSelect.value = '';
        pkgOrderId.value = '';
      }
    }

    function populateCustomerOrderDropdown() {
      var html = '<option value="">Select Customer Order (or enter Order ID below)...</option>';
      var activeOpts = '';
      var completedOpts = '';

      state.customerOrders.slice().reverse().forEach(function (ord) {
        var status = String(ord.status || 'Received').trim();
        var isCompleted = status.toLowerCase() === 'delivered' || status.toLowerCase() === 'cancelled';
        var lineItems = parseOrderLineItems(ord.items, bagSizes);

        if (lineItems.length === 0) {
          var optVal = escapeHtml(ord.orderId) + '||';
          var optHtml = '<option value="' + optVal + '" data-order-id="' + escapeHtml(ord.orderId) + '" data-product="" data-bag-size="">' +
            '#' + escapeHtml(ord.orderId) + ' — ' + escapeHtml(ord.name) + ' [' + escapeHtml(status) + ']</option>';
          if (isCompleted) completedOpts += optHtml;
          else activeOpts += optHtml;
        } else {
          lineItems.forEach(function (item, idx) {
            var optVal = escapeHtml(ord.orderId) + '|' + idx;
            var optHtml = '<option value="' + optVal + '" data-order-id="' + escapeHtml(ord.orderId) + '" data-product="' + escapeHtml(item.product) + '" data-bag-size="' + escapeHtml(item.bagSize) + '">' +
              '#' + escapeHtml(ord.orderId) + ' — ' + escapeHtml(ord.name) + ': ' + escapeHtml(item.label) + ' [' + escapeHtml(status) + ']</option>';
            if (isCompleted) completedOpts += optHtml;
            else activeOpts += optHtml;
          });
        }
      });

      if (activeOpts) html += '<optgroup label="Active Customer Orders">' + activeOpts + '</optgroup>';
      if (completedOpts) html += '<optgroup label="Delivered / Cancelled Orders">' + completedOpts + '</optgroup>';
      pkgOrderSelect.innerHTML = html;
    }

    function startEditPkg(logId) {
      var pkg = state.blendPackagingLogs.find(function (p) { return p.logId === logId; });
      editingPkgId = pkg.logId;
      pkgFormTitle.textContent = 'Edit Master Blend & Packaging (' + pkg.logId + ')';
      pkgCancelEditBtn.textContent = 'Cancel Edit';
      pkgCancelEditBtn.style.display = 'inline-block';
      pkgSubmitBtn.textContent = 'Update Packaging Log ' + pkg.logId;
      pkgFeedback.style.display = 'none';

      pkgDate.value = pkg.date;
      pkgPurpose.value = pkg.purpose;
      syncPkgPurposeVisibility();
      pkgOrderSelect.value = '';
      pkgOrderId.value = pkg.orderId || '';
      pkgProduct.value = pkg.product;
      pkgBagSize.value = pkg.bagSize;
      pkgNotes.value = pkg.notes || '';

      pkgCompsContainer.innerHTML = '';
      var comps = pkg.roastComponents || [];
      if (comps.length === 0) addPkgComponentRow();
      else comps.forEach(function (c) { addPkgComponentRow(c.roastId, c.weightGrams); });

      setDrawerState('pkg-entry-drawer', true);
      renderBlendPackagingTable();
      updatePackagingPreview();
    }

    function copyPackagingLog(logId) {
      var pkg = state.blendPackagingLogs.find(function (p) { return p.logId === logId; });
      editingPkgId = null;
      pkgFormTitle.textContent = 'Record Master Blend & Packaging (Copy of ' + pkg.logId + ')';
      pkgCancelEditBtn.textContent = 'Cancel';
      pkgCancelEditBtn.style.display = 'inline-block';
      pkgSubmitBtn.textContent = 'Save Blend / Packaging Log';
      pkgFeedback.style.display = 'none';

      pkgDate.value = todayIso();
      pkgPurpose.value = pkg.purpose;
      syncPkgPurposeVisibility();
      pkgOrderSelect.value = '';
      pkgOrderId.value = '';
      pkgProduct.value = pkg.product;
      pkgBagSize.value = pkg.bagSize;
      pkgNotes.value = '';

      pkgCompsContainer.innerHTML = '';
      var comps = pkg.roastComponents || [];
      if (comps.length === 0) addPkgComponentRow();
      else comps.forEach(function (c) { addPkgComponentRow(c.roastId, c.weightGrams); });

      setDrawerState('pkg-entry-drawer', true);
      renderBlendPackagingTable();
      updatePackagingPreview();
      if (pkgPurpose.value === 'Order') pkgOrderSelect.focus();
      else pkgProduct.focus();
    }

    function cancelEditPkg() {
      editingPkgId = null;
      pkgFormTitle.textContent = 'Record Master Blend & Packaging';
      pkgCancelEditBtn.textContent = 'Cancel Edit';
      pkgCancelEditBtn.style.display = 'none';
      pkgSubmitBtn.textContent = 'Save Blend / Packaging Log';
      pkgDate.value = todayIso();
      pkgPurpose.value = 'Order';
      syncPkgPurposeVisibility();
      pkgOrderSelect.value = '';
      pkgOrderId.value = '';
      pkgProduct.value = '';
      pkgNotes.value = '';
      pkgBagSize.value = defaultBagSize.id;
      pkgCompsContainer.innerHTML = '';
      addPkgComponentRow();
      setDrawerState('pkg-entry-drawer', false);
      renderBlendPackagingTable();
      updatePackagingPreview();
    }

    function renderBlendPackagingTable() {
      var filterYear = pkgFilterYear.value;
      var filterMonth = pkgFilterMonth.value;
      var filterProduct = pkgFilterProduct.value;
      var filterBean = pkgFilterBean.value;
      var filterPurpose = pkgFilterPurpose.value;
      var filterBagSize = pkgFilterBagSize.value;

      var roastById = {};
      state.roastLogs.forEach(function (r) {
        roastById[r.roastId] = r;
      });

      var filtered = state.blendPackagingLogs.filter(function (p) {
        if (filterPurpose !== 'all') {
          if (filterPurpose === 'Order') {
            if (p.purpose !== 'Order' && !p.orderId) return false;
          } else if (p.purpose !== filterPurpose) {
            return false;
          }
        }
        var ym = extractYearMonth(p.date);
        if (filterYear !== 'all' && ym.year !== filterYear) return false;
        if (filterMonth !== 'all' && ym.month !== filterMonth) return false;
        if (filterProduct !== 'all' && p.product !== filterProduct) return false;
        if (filterBagSize !== 'all' && p.bagSize !== filterBagSize) return false;

        var comps = p.roastComponents || [];
        if (filterBean !== 'all') {
          var hasBean = comps.some(function (c) {
            var rObj = roastById[c.roastId];
            return rObj && rObj.beanName === filterBean;
          });
          if (!hasBean) return false;
        }

        var compText = comps.map(function (c) { return c.roastId; }).join(' ');
        return matchesSearch([p.logId, p.date, p.purpose, p.orderId, p.product, compText, p.bagSize, p.notes]);
      });

      if (filtered.length === 0) {
        packagingTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No packaging logs match the selected filters.</div>';
        return;
      }

      var weightAgg = pkgAggWeight.value;
      var gCols = groupByCols.packaging;

      var allPkgG = filtered.map(function (p) {
        return (p.roastComponents || []).reduce(function (acc, c) { return acc + (Number(c.weightGrams) || 0); }, 0);
      });
      var totPkgG = Math.round(computeAgg(allPkgG, weightAgg));
      var totPkgLbs = (totPkgG / GRAMS_PER_LB).toFixed(2);

      if (gCols.length > 0) {
        var groupsMap = {};
        filtered.forEach(function (p) {
          var ym = extractYearMonth(p.date);
          var dimVals = {};
          var keyParts = gCols.map(function (c) {
            var v = '—';
            if (c === 'month') v = ym.yearMonth;
            else if (c === 'year') v = ym.year;
            else if (c === 'date') v = p.date;
            else if (c === 'product') v = p.product;
            else if (c === 'bagSize') v = p.bagSize;
            else if (c === 'purpose') v = p.purpose;
            dimVals[c] = v;
            return v;
          });
          var gKey = keyParts.join(' — ');
          if (!groupsMap[gKey]) {
            groupsMap[gKey] = {
              key: gKey,
              dimValues: dimVals,
              packagedCount: 0,
              weightVals: []
            };
          }
          var compG = (p.roastComponents || []).reduce(function (acc, c) { return acc + (Number(c.weightGrams) || 0); }, 0);
          groupsMap[gKey].packagedCount++;
          groupsMap[gKey].weightVals.push(compG);
        });

        var groupedRows = Object.keys(groupsMap).map(function (k) {
          var g = groupsMap[k];
          g.packagedGramsUsed = Math.round(computeAgg(g.weightVals, weightAgg));
          return g;
        }).sort(function (a, b) {
          var dir = pkgLogSortDir === 'asc' ? 1 : -1;
          var cmp = 0;
          if (pkgLogSortCol.indexOf('dim:') === 0) {
            var dKey = pkgLogSortCol.slice(4);
            cmp = String(a.dimValues[dKey]).localeCompare(String(b.dimValues[dKey]));
          } else if (pkgLogSortCol === 'packages') cmp = a.packagedCount - b.packagedCount;
          else if (pkgLogSortCol === 'packagedWeight') cmp = a.packagedGramsUsed - b.packagedGramsUsed;
          else cmp = a.key.localeCompare(b.key);
          return cmp !== 0 ? cmp * dir : b.key.localeCompare(a.key);
        });

        var gHtml = '<table class="roast-admin-table"><thead><tr>';
        gCols.forEach(function (colId) {
          gHtml += renderSortTh(DIMENSION_LABELS[colId] || colId, 'dim:' + colId, pkgLogSortCol, pkgLogSortDir, false);
        });
        gHtml += renderSortTh('Bags Packaged', 'packages', pkgLogSortCol, pkgLogSortDir, true);
        if (weightAgg !== 'hide') gHtml += renderSortTh('Packaged Weight (' + weightAgg.toUpperCase() + ')', 'packagedWeight', pkgLogSortCol, pkgLogSortDir, true);
        gHtml += '</tr></thead><tbody>';

        groupedRows.forEach(function (r) {
          var rowLbs = (r.packagedGramsUsed / GRAMS_PER_LB).toFixed(2);
          gHtml += '<tr>';
          gCols.forEach(function (colId) {
            gHtml += '<td><strong>' + escapeHtml(r.dimValues[colId]) + '</strong></td>';
          });
          gHtml += '<td class="mono" style="text-align: right;">' + r.packagedCount + '</td>';
          if (weightAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + rowLbs + ' lbs</strong><div class="cell-sub">' + r.packagedGramsUsed.toLocaleString() + ' g</div></td>';
          gHtml += '</tr>';
        });

        gHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + gCols.length + '">Total (' + filtered.length + ' packages)</td>' +
          '<td class="mono" style="text-align: right;">' + filtered.length + '</td>';
        if (weightAgg !== 'hide') gHtml += '<td class="mono" style="text-align: right;"><strong>' + totPkgLbs + ' lbs</strong><div class="cell-sub">' + totPkgG.toLocaleString() + ' g</div></td>';
        gHtml += '</tr></tfoot></table>';

        packagingTableWrap.innerHTML = gHtml;
        bindSortHeaders(packagingTableWrap, function () {
          return { col: pkgLogSortCol, dir: pkgLogSortDir };
        }, function (c, d) {
          pkgLogSortCol = c;
          pkgLogSortDir = d;
        }, ['packages', 'packagedWeight'], renderBlendPackagingTable);
        return;
      }

      var rows = filtered.slice().sort(function (a, b) {
        var dir = pkgLogSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (pkgLogSortCol === 'logId') cmp = a.logId.localeCompare(b.logId);
        else if (pkgLogSortCol === 'date') cmp = a.date.localeCompare(b.date);
        else if (pkgLogSortCol === 'orderId') cmp = (a.orderId || '').localeCompare(b.orderId || '');
        else if (pkgLogSortCol === 'product') cmp = a.product.localeCompare(b.product);
        else if (pkgLogSortCol === 'bagSize') cmp = a.bagSize.localeCompare(b.bagSize);
        return cmp !== 0 ? cmp * dir : (b.date.localeCompare(a.date) || b.logId.localeCompare(a.logId));
      });

      var html = '<table class="roast-admin-table roast-admin-table--packaging"><thead><tr>' +
        renderSortTh('Date', 'date', pkgLogSortCol, pkgLogSortDir, false, 'roast-col-date') +
        renderSortTh('Pkg ID', 'logId', pkgLogSortCol, pkgLogSortDir, false, 'roast-col-id') +
        renderSortTh('Order #', 'orderId', pkgLogSortCol, pkgLogSortDir, false, 'roast-col-order-id') +
        renderSortTh('Product / Blend', 'product', pkgLogSortCol, pkgLogSortDir, false, 'roast-col-product') +
        renderSortTh('Bag & Weight', 'bagSize', pkgLogSortCol, pkgLogSortDir, false, 'roast-col-bag') +
        '<th class="roast-col-roast-batches">Roast Batches</th>' +
        '<th class="roast-col-notes">Notes</th>' +
        '<th class="roast-col-action" style="text-align: right;">Action</th>' +
        '</tr></thead><tbody>';

      rows.forEach(function (p) {
        var comps = p.roastComponents || [];
        var compsHtml = comps.map(function (c) {
          return '<a href="#tab=roasts&id=' + encodeURIComponent(c.roastId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" data-nav-tab="roasts" data-nav-id="' + escapeHtml(c.roastId) + '" title="View roast ' + escapeHtml(c.roastId) + '">' + escapeHtml(c.roastId) + '</a>';
        }).join('');
        var compsWrap = compsHtml ? ('<div class="roast-chip-stack">' + compsHtml + '</div>') : '—';
        var totalGrams = comps.reduce(function (acc, c) { return acc + (Number(c.weightGrams) || 0); }, 0);
        var totalLbs = (totalGrams / GRAMS_PER_LB).toFixed(2);
        var orderIdCell = p.orderId
          ? '<a href="/order/admin/?search=' + encodeURIComponent(p.orderId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" target="_blank" rel="noopener" title="Open customer order #' + escapeHtml(p.orderId) + ' in Order Manager">#' + escapeHtml(p.orderId) + ' &nearr;</a>'
          : '—';
        var rowStyle = editingPkgId === p.logId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';

        html += '<tr data-row-id="' + escapeHtml(p.logId) + '"' + rowStyle + '>' +
          '<td class="mono roast-col-date">' + escapeHtml(p.date) + '</td>' +
          '<td class="primary-cell roast-col-id"><span class="roast-admin-id-chip">' + escapeHtml(p.logId) + '</span></td>' +
          '<td class="roast-col-order-id">' + orderIdCell + '</td>' +
          '<td class="roast-col-product"><strong>' + escapeHtml(p.product) + '</strong><div class="cell-sub">' + escapeHtml(p.purpose) + '</div></td>' +
          '<td class="mono roast-col-bag">' +
          '  <div class="roast-dual-num-row">' +
          '    <span class="roast-bag-size-label"><strong>' + escapeHtml(p.bagSize) + '</strong></span>' +
          '    <span class="roast-num-part roast-num-part--bag-weight"><strong>' + totalLbs + ' lbs</strong></span>' +
          '  </div>' +
          '  <div class="cell-sub roast-dual-num-row">' +
          '    <span class="roast-bag-size-label"></span>' +
          '    <span class="roast-num-part roast-num-part--bag-weight">' + totalGrams.toLocaleString() + ' g</span>' +
          '  </div>' +
          '</td>' +
          '<td class="roast-col-roast-batches">' + compsWrap + '</td>' +
          '<td class="roast-col-notes">' + escapeHtml(p.notes || '—') + '</td>' +
          '<td class="roast-col-action" style="text-align: right;">' +
          '<button type="button" class="order-admin-btn-sm" data-edit-pkg="' + escapeHtml(p.logId) + '">Edit</button> ' +
          '<button type="button" class="order-admin-btn-sm" data-copy-pkg="' + escapeHtml(p.logId) + '" title="Copy blend and bag size to new packaging log">Copy</button>' +
          '</td></tr>';
      });

      var pkgFootWeight = weightAgg !== 'hide'
        ? ('<div class="roast-dual-num-row"><span class="roast-bag-size-label">' + escapeHtml(weightAgg.toUpperCase()) + '</span><span class="roast-num-part roast-num-part--bag-weight"><strong>' + totPkgLbs + ' lbs</strong></span></div>' +
           '<div class="cell-sub roast-dual-num-row"><span class="roast-bag-size-label"></span><span class="roast-num-part roast-num-part--bag-weight">' + totPkgG.toLocaleString() + ' g</span></div>')
        : '';

      html += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
        '<td colspan="4">Summary (' + rows.length + ' packages)</td>' +
        '<td class="mono roast-col-bag">' + pkgFootWeight + '</td>' +
        '<td colspan="3"></td>' +
        '</tr></tfoot></table>';
      packagingTableWrap.innerHTML = html;

      packagingTableWrap.querySelectorAll('[data-nav-tab="roasts"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          switchToTab('roasts', link.getAttribute('data-nav-id'));
        });
      });

      packagingTableWrap.querySelectorAll('[data-edit-pkg]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditPkg(btn.getAttribute('data-edit-pkg'));
        });
      });

      packagingTableWrap.querySelectorAll('[data-copy-pkg]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          copyPackagingLog(btn.getAttribute('data-copy-pkg'));
        });
      });

      bindSortHeaders(packagingTableWrap, function () {
        return { col: pkgLogSortCol, dir: pkgLogSortDir };
      }, function (c, d) {
        pkgLogSortCol = c;
        pkgLogSortDir = d;
      }, ['date'], renderBlendPackagingTable);
    }

    function populateTabFilterDropdowns() {
      var yearsSet = {};
      state.greenBeanOrders.forEach(function (o) { yearsSet[extractYearMonth(o.date).year] = true; });
      state.roastLogs.forEach(function (r) { yearsSet[extractYearMonth(r.date).year] = true; });
      state.blendPackagingLogs.forEach(function (p) { yearsSet[extractYearMonth(p.date).year] = true; });

      var years = Object.keys(yearsSet).filter(function (y) { return y && y !== 'Unknown'; }).sort().reverse();
      var yearOptions = '<option value="all">All Years</option>' +
        years.map(function (y) { return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>'; }).join('');

      [ordersFilterYear, roastsFilterYear, pkgFilterYear].forEach(function (sel) {
        var prev = sel.value;
        sel.innerHTML = yearOptions;
        if (years.indexOf(prev) !== -1) sel.value = prev;
      });

      var beanNames = state.greenBeans.map(function (b) { return b.name; });
      var beanOptions = '<option value="all">All Beans</option>' +
        beanNames.map(function (name) { return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>'; }).join('');

      [beansFilterBean, ordersFilterBean, roastsFilterBean, pkgFilterBean].forEach(function (sel) {
        var prev = sel.value;
        sel.innerHTML = beanOptions;
        if (beanNames.indexOf(prev) !== -1) sel.value = prev;
      });

      var suppliersSet = {};
      state.greenBeans.forEach(function (b) { if (b.supplier) suppliersSet[b.supplier] = true; });
      state.greenBeanOrders.forEach(function (o) { if (o.supplier) suppliersSet[o.supplier] = true; });
      var suppliers = Object.keys(suppliersSet).sort();
      var supplierOptions = '<option value="all">All Suppliers</option>' +
        suppliers.map(function (s) { return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>'; }).join('');

      [beansFilterSupplier, ordersFilterSupplier].forEach(function (sel) {
        var prev = sel.value;
        sel.innerHTML = supplierOptions;
        if (suppliers.indexOf(prev) !== -1) sel.value = prev;
      });

      var productsSet = {};
      state.blendPackagingLogs.forEach(function (p) { if (p.product) productsSet[p.product] = true; });
      var products = Object.keys(productsSet).sort();
      var prevProd = pkgFilterProduct.value;
      pkgFilterProduct.innerHTML = '<option value="all">All Products</option>' +
        products.map(function (prod) { return '<option value="' + escapeHtml(prod) + '">' + escapeHtml(prod) + '</option>'; }).join('');
      if (products.indexOf(prevProd) !== -1) pkgFilterProduct.value = prevProd;
    }

    function updateOrderWeightPreview() {
      var lbs = Number(orderWeightLbs.value) || 0;
      var cost = Number(orderCost.value) || 0;
      var baseGrams = lbsToGrams(lbs);
      var adjGrams = Number(orderAdjustGrams.value) || 0;
      var totalGrams = baseGrams + adjGrams;
      var totalLbs = (totalGrams / GRAMS_PER_LB).toFixed(2);
      var unitCost = lbs > 0 ? ('$' + (cost / lbs).toFixed(2) + ' / lb') : '$0.00 / lb';
      orderWeightPreview.innerHTML =
        '<div class="form-metric-item">Base: <strong>' + lbs.toFixed(2) + ' lbs (' + baseGrams.toLocaleString() + ' g)</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">Total Weight: <strong style="color: #1e7e44;">' + totalLbs + ' lbs (' + totalGrams.toLocaleString() + ' g)</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">Unit Cost: <strong>' + unitCost + '</strong></div>';
    }

    function updateRoastLossPreview() {
      var greenG = 0;
      roastCompsContainer.querySelectorAll('.roast-comp-grams').forEach(function (inp) {
        greenG += Number(inp.value) || 0;
      });
      var endG = Number(roastEndGrams.value) || 0;
      var loss = computeWeightLossPct(greenG, endG);
      var lossGrams = greenG - endG;
      var lossColor = (loss >= 11 && loss <= 18) ? '#1e7e44' : (loss > 18 ? '#b35300' : '#2c1e14');
      roastLossPreview.innerHTML =
        '<div class="form-metric-item">Green Weight: <strong>' + greenG.toLocaleString() + ' g</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">End Weight: <strong>' + endG.toLocaleString() + ' g</strong></div>' +
        '<span class="form-metric-divider">&bull;</span>' +
        '<div class="form-metric-item">Weight Loss: <strong style="color: ' + lossColor + ';">-' + loss.toFixed(1) + '% (-' + lossGrams + ' g)</strong></div>';
    }

    function renderAll() {
      populateOrderBeanDropdown();
      refreshRoastComponentDropdowns();
      populateCustomerOrderDropdown();
      refreshPkgComponentDropdowns();
      populateTabFilterDropdowns();
      renderActiveBeansTable();
      renderGreenBeanOrdersTable();
      renderRoastLogsTable();
      renderBlendPackagingTable();
      updatePackagingPreview();
      ['beans', 'orders', 'roasts', 'pkg'].forEach(updateFilterBtnLabel);
    }

    function loadCustomerOrders(passcode) {
      if (!orderApiUrl) return;
      var fetchUrl = orderApiUrl + (orderApiUrl.indexOf('?') === -1 ? '?' : '&') +
        'action=admin_list&adminKey=' + encodeURIComponent(passcode);

      fetch(fetchUrl, { credentials: 'omit' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && Array.isArray(data.orders)) {
            state.customerOrders = data.orders;
            populateCustomerOrderDropdown();
          }
        })
        .catch(function () {});
    }

    function showApiError(errMsg) {
      errorBanner.textContent = 'API Error: ' + errMsg;
      errorBanner.style.display = 'block';
    }

    function hideApiError() {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }

    function resolveAdminToken(passcode) {
      var trimmed = (passcode || '').trim();
      if (trimmed.length === 64 && /^[0-9a-f]+$/.test(trimmed)) {
        return Promise.resolve(trimmed);
      }
      return computeBrowserHash(trimmed);
    }

    function loadInventory(passcode, callback) {
      resolveAdminToken(passcode).then(function (token) {
        fetch(apiUrl, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            action: 'list_inventory',
            adminKey: token
          })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              console.error('Roast inventory load error:', data.error);
              showApiError(data.error);
              callback(data.error);
            } else {
              hideApiError();
              state.greenBeans = data.greenBeans || [];
              state.greenBeanOrders = data.greenBeanOrders || [];
              state.roastLogs = data.roastLogs || [];
              state.blendPackagingLogs = data.blendPackagingLogs || [];
              recomputeActiveBeanStocks(state);
              callback(null, state);
            }
          })
          .catch(function (err) {
            var msg = 'Could not connect to live inventory API (' + (err.message || 'Network error') + ').';
            showApiError(msg);
            callback(msg);
          });
      });
    }

    function submitAction(payload, callback) {
      resolveAdminToken(getStoredKey()).then(function (token) {
        payload.adminKey = token;
        fetch(apiUrl, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              console.error('Roast inventory API error:', data.error);
              callback(data.error);
            } else {
              state.greenBeans = data.greenBeans || [];
              state.greenBeanOrders = data.greenBeanOrders;
              state.roastLogs = data.roastLogs;
              state.blendPackagingLogs = data.blendPackagingLogs;
              recomputeActiveBeanStocks(state);
              callback(null, data);
            }
          })
          .catch(function (err) {
            console.error('Roast inventory network error:', err);
            callback(err.message);
          });
      });
    }

    orderBeanSelect.addEventListener('change', function () {
      var val = orderBeanSelect.value;
      if (val === '__new__') {
        orderBeanName.value = '';
        orderSupplier.value = '';
        orderBeanUrl.value = '';
      } else {
        var found = state.greenBeans.find(function (b) { return b.name === val; });
        orderBeanName.value = found.name;
        orderSupplier.value = found.supplier;
        orderBeanUrl.value = found.url;
      }
    });

    orderCost.addEventListener('input', updateOrderWeightPreview);
    orderWeightLbs.addEventListener('input', updateOrderWeightPreview);
    orderAdjustGrams.addEventListener('input', updateOrderWeightPreview);
    orderCancelEditBtn.addEventListener('click', cancelEditOrder);

    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      orderSubmitBtn.disabled = true;
      orderFeedback.style.display = 'none';

      var isEditingOrder = Boolean(editingOrderId);
      submitAction({
        action: isEditingOrder ? 'update_green_bean_order' : 'create_green_bean_order',
        orderId: editingOrderId,
        name: orderBeanName.value.trim(),
        supplier: orderSupplier.value.trim(),
        supplierOrderId: orderSupplierId.value.trim(),
        date: orderDate.value,
        cost: Number(orderCost.value),
        weightLbs: Number(orderWeightLbs.value),
        adjustGrams: Number(orderAdjustGrams.value) || 0,
        url: orderBeanUrl.value.trim()
      }, function (err, res) {
        orderSubmitBtn.disabled = false;
        if (err) {
          orderFeedback.className = 'order-admin-feedback order-admin-feedback--error';
          orderFeedback.textContent = 'Error: ' + err;
          orderFeedback.style.display = 'block';
        } else {
          var savedId = isEditingOrder ? res.updatedOrderId : res.createdOrderId;
          cancelEditOrder();
          renderAll();
          orderFeedback.className = 'order-admin-feedback order-admin-feedback--success';
          orderFeedback.textContent = isEditingOrder ? ('✓ Updated Order ' + savedId) : ('✓ Saved Order ' + savedId);
          orderFeedback.style.display = 'block';
        }
      });
    });

    roastAddCompBtn.addEventListener('click', function () { addRoastComponentRow(); });
    roastEndGrams.addEventListener('input', updateRoastLossPreview);
    roastCancelEditBtn.addEventListener('click', cancelEditRoast);

    roastForm.addEventListener('submit', function (e) {
      e.preventDefault();
      recomputeActiveBeanStocks(state, editingPkgId, editingRoastId);

      var greenComponents = [];
      var requestedByOrder = {};
      var beanNamesUsed = [];
      var totalGreenGrams = 0;

      roastCompsContainer.querySelectorAll('.roast-admin-component-row').forEach(function (r) {
        var oId = r.querySelector('.roast-comp-order').value;
        var gVal = Number(r.querySelector('.roast-comp-grams').value);
        greenComponents.push({ orderId: oId, weightGrams: gVal });
        requestedByOrder[oId] = (requestedByOrder[oId] || 0) + gVal;
        totalGreenGrams += gVal;
        var ordObj = state.greenBeanOrders.find(function (o) { return o.orderId === oId; });
        if (ordObj && beanNamesUsed.indexOf(ordObj.name) === -1) beanNamesUsed.push(ordObj.name);
      });

      for (var checkOrdId in requestedByOrder) {
        var targetOrder = state.greenBeanOrders.find(function (ord) { return ord.orderId === checkOrdId; });
        if (targetOrder && requestedByOrder[checkOrdId] > targetOrder.availableGrams) {
          roastFeedback.className = 'order-admin-feedback order-admin-feedback--error';
          roastFeedback.textContent = 'Error: Cannot use ' + requestedByOrder[checkOrdId] + 'g from ' + checkOrdId + ' (only ' + targetOrder.availableGrams + 'g available).';
          roastFeedback.style.display = 'block';
          return;
        }
      }

      roastSubmitBtn.disabled = true;
      roastFeedback.style.display = 'none';

      var isEditingRoast = Boolean(editingRoastId);
      submitAction({
        action: isEditingRoast ? 'update_roast_log' : 'create_roast_log',
        roastId: editingRoastId,
        greenBeanComponents: greenComponents,
        beanName: beanNamesUsed.join(' / '),
        date: roastDate.value,
        roastLevel: Number(roastLevelSelect.value),
        greenWeightGrams: totalGreenGrams,
        endWeightGrams: Number(roastEndGrams.value),
        profileUrl: roastProfileUrl.value.trim(),
        notes: roastNotes.value.trim()
      }, function (err, res) {
        roastSubmitBtn.disabled = false;
        if (err) {
          roastFeedback.className = 'order-admin-feedback order-admin-feedback--error';
          roastFeedback.textContent = 'Error: ' + err;
          roastFeedback.style.display = 'block';
        } else {
          var savedRoastId = isEditingRoast ? res.updatedRoastId : res.createdRoastId;
          cancelEditRoast();
          renderAll();
          roastFeedback.className = 'order-admin-feedback order-admin-feedback--success';
          roastFeedback.textContent = isEditingRoast ? ('✓ Updated Roast ' + savedRoastId) : ('✓ Saved Roast ' + savedRoastId);
          roastFeedback.style.display = 'block';
        }
      });
    });

    pkgPurpose.addEventListener('change', syncPkgPurposeVisibility);
    syncPkgPurposeVisibility();

    function syncPkgBagSizeChange() {
      var total = getSelectedBagSizeGrams();
      pkgCompsContainer.querySelectorAll('.roast-admin-component-row').forEach(function (row) {
        var pctInput = row.querySelector('.pkg-comp-pct');
        var gramsInput = row.querySelector('.pkg-comp-grams');
        var pctVal = parseFloat(pctInput.value);
        if (total > 0 && !isNaN(pctVal)) {
          var calcG = Math.round((pctVal / 100) * total);
          gramsInput.value = calcG > 0 ? calcG : '';
        }
      });
      updatePackagingPreview();
    }

    pkgBagSize.addEventListener('change', syncPkgBagSizeChange);

    pkgOrderSelect.addEventListener('change', function () {
      var selectedOpt = pkgOrderSelect.options[pkgOrderSelect.selectedIndex];
      var ordId = selectedOpt.getAttribute('data-order-id') || '';
      var prod = selectedOpt.getAttribute('data-product') || '';
      var bagSz = selectedOpt.getAttribute('data-bag-size') || '';
      if (ordId) pkgOrderId.value = ordId;
      if (prod) pkgProduct.value = prod;
      if (bagSz && Array.from(pkgBagSize.options).some(function (o) { return o.value === bagSz; })) {
        pkgBagSize.value = bagSz;
        syncPkgBagSizeChange();
      }
    });

    pkgAddCompBtn.addEventListener('click', function () { addPkgComponentRow(); });
    pkgCancelEditBtn.addEventListener('click', cancelEditPkg);

    pkgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      recomputeActiveBeanStocks(state, editingPkgId);

      var components = [];
      var requestedByRoast = {};
      pkgCompsContainer.querySelectorAll('.roast-admin-component-row').forEach(function (r) {
        var rId = r.querySelector('.pkg-comp-roast').value;
        var gVal = Number(r.querySelector('.pkg-comp-grams').value);
        components.push({ roastId: rId, weightGrams: gVal });
        requestedByRoast[rId] = (requestedByRoast[rId] || 0) + gVal;
      });

      for (var checkId in requestedByRoast) {
        var targetRoast = state.roastLogs.find(function (rst) { return rst.roastId === checkId; });
        if (targetRoast && requestedByRoast[checkId] > targetRoast.availableGrams) {
          pkgFeedback.className = 'order-admin-feedback order-admin-feedback--error';
          pkgFeedback.textContent = 'Error: Cannot package ' + requestedByRoast[checkId] + 'g from ' + checkId + ' (only ' + targetRoast.availableGrams + 'g available).';
          pkgFeedback.style.display = 'block';
          return;
        }
      }

      pkgSubmitBtn.disabled = true;
      pkgFeedback.style.display = 'none';

      var isEditingPkg = Boolean(editingPkgId);
      submitAction({
        action: isEditingPkg ? 'update_blend_packaging_log' : 'create_blend_packaging_log',
        logId: editingPkgId,
        date: pkgDate.value,
        purpose: pkgPurpose.value,
        orderId: pkgPurpose.value === 'Order' ? pkgOrderId.value.trim().replace(/^#/, '') : '',
        product: pkgProduct.value.trim(),
        roastComponents: components,
        bagSize: pkgBagSize.value,
        notes: pkgNotes.value.trim()
      }, function (err, res) {
        pkgSubmitBtn.disabled = false;
        if (err) {
          pkgFeedback.className = 'order-admin-feedback order-admin-feedback--error';
          pkgFeedback.textContent = 'Error: ' + err;
          pkgFeedback.style.display = 'block';
        } else {
          var savedLogId = isEditingPkg ? res.updatedLogId : res.createdLogId;
          cancelEditPkg();
          renderAll();
          pkgFeedback.className = 'order-admin-feedback order-admin-feedback--success';
          pkgFeedback.textContent = isEditingPkg ? ('✓ Updated Packaging Log ' + savedLogId) : ('✓ Saved Packaging Log ' + savedLogId);
          pkgFeedback.style.display = 'block';
        }
      });
    });

    function rerenderModuleTable(mod) {
      if (mod === 'beans') renderActiveBeansTable();
      else if (mod === 'orders') renderGreenBeanOrdersTable();
      else if (mod === 'roasts') renderRoastLogsTable();
      else if (mod === 'packaging' || mod === 'pkg') renderBlendPackagingTable();
      updateFilterBtnLabel(mod);
    }

    showDepletedCheckbox.addEventListener('change', renderActiveBeansTable);

    [beansFilterBean, beansFilterSupplier].forEach(function (sel) {
      sel.addEventListener('change', function () { rerenderModuleTable('beans'); });
    });
    [ordersFilterYear, ordersFilterMonth, ordersFilterBean, ordersFilterSupplier].forEach(function (sel) {
      sel.addEventListener('change', function () { rerenderModuleTable('orders'); });
    });
    [roastsFilterYear, roastsFilterMonth, roastsFilterBean, roastsFilterRoastLevel].forEach(function (sel) {
      sel.addEventListener('change', function () { rerenderModuleTable('roasts'); });
    });
    [pkgFilterYear, pkgFilterMonth, pkgFilterProduct, pkgFilterBean, pkgFilterPurpose, pkgFilterBagSize].forEach(function (sel) {
      sel.addEventListener('change', function () { rerenderModuleTable('pkg'); });
    });

    document.querySelectorAll('[data-toggle-groupby]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.getAttribute('data-toggle-groupby').split(':');
        var mod = parts[0];
        var col = parts[1];
        var cur = groupByCols[mod];
        var idx = cur.indexOf(col);
        if (idx !== -1) {
          cur.splice(idx, 1);
          btn.classList.remove('order-admin-filter-pill--active');
        } else {
          cur.push(col);
          btn.classList.add('order-admin-filter-pill--active');
        }
        rerenderModuleTable(mod);
      });
    });

    document.querySelectorAll('[data-clear-groupby]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mod = btn.getAttribute('data-clear-groupby');
        groupByCols[mod] = [];
        document.querySelectorAll('[data-toggle-groupby^="' + mod + ':"]').forEach(function (p) {
          p.classList.remove('order-admin-filter-pill--active');
        });
        rerenderModuleTable(mod);
      });
    });

    document.querySelectorAll('[data-agg-mod]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        rerenderModuleTable(sel.getAttribute('data-agg-mod'));
      });
    });

    tabsContainer.querySelectorAll('.roast-admin-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchToTab(btn.getAttribute('data-tab'));
      });
    });

    document.querySelectorAll('.roast-admin-toggle-drawer-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-drawer-target');
        var drawer = document.getElementById(targetId);
        var isCurrentlyOpen = drawer.style.display !== 'none';
        if (isCurrentlyOpen) {
          if (targetId === 'order-entry-drawer' && editingOrderId) cancelEditOrder();
          else if (targetId === 'roast-entry-drawer' && editingRoastId) cancelEditRoast();
          else if (targetId === 'pkg-entry-drawer' && editingPkgId) cancelEditPkg();
          else setDrawerState(targetId, false);
        } else {
          setDrawerState(targetId, true);
          if (targetId === 'order-entry-drawer') orderBeanSelect.focus();
          else if (targetId === 'roast-entry-drawer') roastDate.focus();
          else if (targetId === 'pkg-entry-drawer') pkgDate.focus();
        }
      });
    });

    searchInput.addEventListener('input', function () {
      applySearch(searchInput.value);
    });

    gateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = passcodeInput.value.trim();
      if (!key) return;
      gateError.style.display = 'none';

      computeBrowserHash(key).then(function (hash) {
        if (hash !== ADMIN_PASSWORD_HASH) {
          clearStoredKey();
          gateError.textContent = 'Unauthorized: Invalid Admin Key.';
          gateError.style.display = 'block';
          return;
        }
        saveKey(key);
        showDashboard();
        loadCustomerOrders(key);
        loadInventory(key, function (err) {
          if (!err) renderAll();
        });
      });
    });

    refreshBtn.addEventListener('click', function () {
      var key = getStoredKey();
      if (!key) {
        showGate();
        return;
      }
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Refreshing...';
      loadCustomerOrders(key);
      loadInventory(key, function (err) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'Refresh';
        if (!err) renderAll();
      });
    });

    logoutBtn.addEventListener('click', function () {
      clearStoredKey();
      showGate();
    });

    if (typeof window !== 'undefined' && window.location && window.location.search) {
      var qParams = new URLSearchParams(window.location.search);
      var qSearch = qParams.get('search') || qParams.get('id');
      if (qSearch) applySearch(qSearch);
    }

    var storedKey = getStoredKey();
    if (storedKey) {
      showDashboard();
      loadCustomerOrders(storedKey);
      loadInventory(storedKey, function (err) {
        if (err && String(err).indexOf('Unauthorized') !== -1) {
          clearStoredKey();
          showGate(err);
        } else if (!err) {
          renderAll();
        }
      });
    } else {
      showGate();
    }
  }

  function initAdminPortal() {
    var gateSection = document.getElementById('admin-portal-gate-section');
    var gateForm = document.getElementById('admin-portal-gate-form');
    var passcodeInput = document.getElementById('admin-portal-passcode-input');
    var gateError = document.getElementById('admin-portal-gate-error');
    var dashboardSection = document.getElementById('admin-portal-dashboard-section');
    var logoutBtn = document.getElementById('admin-portal-logout-btn');

    function showPortalGate(errText) {
      document.documentElement.classList.remove('ywr-admin-authenticated');
      dashboardSection.style.display = 'none';
      gateSection.style.display = 'block';
      if (errText) {
        gateError.textContent = errText;
        gateError.style.display = 'block';
      } else {
        gateError.style.display = 'none';
      }
      passcodeInput.value = '';
      passcodeInput.focus();
    }

    function showPortalDashboard() {
      document.documentElement.classList.add('ywr-admin-authenticated');
      gateSection.style.display = 'none';
      dashboardSection.style.display = 'block';
    }

    gateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = passcodeInput.value.trim();
      if (!key) return;
      gateError.style.display = 'none';

      computeBrowserHash(key).then(function (hash) {
        if (hash === ADMIN_PASSWORD_HASH) {
          localStorage.setItem(STORAGE_KEY, key);
          showPortalDashboard();
        } else {
          localStorage.removeItem(STORAGE_KEY);
          showPortalGate('Unauthorized: Invalid Admin Key.');
        }
      });
    });

    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem(STORAGE_KEY);
      showPortalGate();
    });

    if (localStorage.getItem(STORAGE_KEY)) showPortalDashboard();
    else showPortalGate();
  }

  return {
    initAdminRoasts: initAdminRoasts,
    initAdminPortal: initAdminPortal,
    lbsToGrams: lbsToGrams,
    computeWeightLossPct: computeWeightLossPct,
    recomputeActiveBeanStocks: recomputeActiveBeanStocks,
    computeAgg: computeAgg,
    calculateBagSizeGrams: calculateBagSizeGrams,
    calculateGramsFromPercentage: calculateGramsFromPercentage,
    calculatePercentageFromGrams: calculatePercentageFromGrams,
    parseOrderLineItems: parseOrderLineItems,
    filterSelectOptions: filterSelectOptions,
    computeBrowserHash: computeBrowserHash,
    ADMIN_PASSWORD_HASH: ADMIN_PASSWORD_HASH,
    DEFAULT_SALT: DEFAULT_SALT
  };
});
