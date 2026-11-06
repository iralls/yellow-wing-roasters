(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exports = factory();
    root.initAdminOrders = exports.initAdminOrders;
    root.AdminOrdersLogic = exports;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

  var ORDER_DIMENSION_LABELS = {
    all: 'Group',
    month: 'Month',
    year: 'Year',
    date: 'Date',
    roast: 'Roast',
    product: 'Roast',
    size: 'Bag Size',
    deliveryMethod: 'Delivery Method',
    status: 'Status',
    city: 'City',
    customer: 'Customer'
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function computeBrowserHash(passcode, salt) {
    var activeSalt = salt || DEFAULT_SALT;
    var input = activeSalt + String(passcode || '').trim();

    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      var msgBuffer = new TextEncoder().encode(input);
      return crypto.subtle.digest('SHA-256', msgBuffer).then(function (hashBuffer) {
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }

    if (typeof require === 'function') {
      var nodeCrypto = require('crypto');
      var digest = nodeCrypto.createHash('sha256').update(input, 'utf8').digest('hex');
      return Promise.resolve(digest);
    }

    return Promise.reject(new Error('WebCrypto API not available'));
  }

  function normalizeStatus(status) {
    var s = String(status || 'Received').trim().toLowerCase();
    if (s === 'received') return 'received';
    if (s === 'delayed') return 'delayed';
    if (s === 'roasted') return 'roasted';
    if (s === 'ready for pickup' || s === 'ready_for_pickup') return 'ready_for_pickup';
    if (s === 'ready to deliver' || s === 'ready_to_deliver' || s === 'out for delivery') return 'ready_to_deliver';
    if (s === 'delivered') return 'delivered';
    if (s === 'cancelled' || s === 'canceled') return 'cancelled';
    return 'other';
  }

  function getStatusBadgeClass(status) {
    var norm = normalizeStatus(status);
    if (norm === 'received') return 'status-received';
    if (norm === 'delayed') return 'status-delayed';
    if (norm === 'roasted') return 'status-roasted';
    if (norm === 'ready_for_pickup' || norm === 'ready_to_deliver') return 'status-ready';
    if (norm === 'delivered') return 'status-delivered';
    if (norm === 'cancelled') return 'status-cancelled';
    return 'status-default';
  }

  function computeStats(orders) {
    var stats = {
      total: 0,
      received: 0,
      delayed: 0,
      roasted: 0,
      readyForPickup: 0,
      readyToDeliver: 0,
      delivered: 0,
      cancelled: 0
    };
    orders.forEach(function (o) {
      stats.total++;
      var norm = normalizeStatus(o.status);
      if (norm === 'received') stats.received++;
      else if (norm === 'delayed') stats.delayed++;
      else if (norm === 'roasted') stats.roasted++;
      else if (norm === 'ready_for_pickup') stats.readyForPickup++;
      else if (norm === 'ready_to_deliver') stats.readyToDeliver++;
      else if (norm === 'delivered') stats.delivered++;
      else if (norm === 'cancelled') stats.cancelled++;
    });
    return stats;
  }

  function extractOrderDate(timestampStr) {
    if (!timestampStr) return { year: 'Unknown', month: 'Unknown', yearMonth: 'Unknown', date: 'Unknown' };
    var str = String(timestampStr).trim();

    var isoMatch = str.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (isoMatch) {
      var isoDay = isoMatch[3] || '01';
      return {
        year: isoMatch[1],
        month: isoMatch[2],
        yearMonth: isoMatch[1] + '-' + isoMatch[2],
        date: isoMatch[1] + '-' + isoMatch[2] + '-' + isoDay
      };
    }

    var usMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (usMatch) {
      var m = usMatch[1].length === 1 ? '0' + usMatch[1] : usMatch[1];
      var d = usMatch[2].length === 1 ? '0' + usMatch[2] : usMatch[2];
      var y = usMatch[3];
      return {
        year: y,
        month: m,
        yearMonth: y + '-' + m,
        date: y + '-' + m + '-' + d
      };
    }

    var parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      var yr = String(parsed.getFullYear());
      var mo = String(parsed.getMonth() + 1);
      if (mo.length === 1) mo = '0' + mo;
      var dy = String(parsed.getDate());
      if (dy.length === 1) dy = '0' + dy;
      return { year: yr, month: mo, yearMonth: yr + '-' + mo, date: yr + '-' + mo + '-' + dy };
    }

    return { year: 'Unknown', month: 'Unknown', yearMonth: 'Unknown', date: 'Unknown' };
  }

  function parseCurrency(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    var clean = String(val).replace(/[^0-9.-]/g, '');
    var num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  function bagSizeToLbs(sizeStr, bagSizes) {
    if (!sizeStr) return 0;
    var clean = String(sizeStr).trim().toLowerCase();

    if (Array.isArray(bagSizes)) {
      var found = bagSizes.find(function (s) {
        return s && String(s.id || '').toLowerCase() === clean;
      });
      if (found && found.weight_oz) {
        return Number(found.weight_oz) / 16;
      }
    }

    var match = clean.match(/^(\d+(?:\.\d+)?)\s*(oz|lb|lbs)$/);
    if (match) {
      var qty = parseFloat(match[1]);
      return match[2] === 'oz' ? qty / 16 : qty;
    }

    return 0;
  }

  function splitOrderItemsRaw(raw) {
    if (!raw) return [];
    var str = String(raw).trim();
    if (!str) return [];

    if (str.indexOf('\n') !== -1) {
      return str.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    }

    var parts = [];
    var current = '';
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str[i];
      if (char === '(') depth++;
      else if (char === ')') depth = Math.max(0, depth - 1);

      if (char === ',' && depth === 0) {
        if (current.trim()) parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  }

  function parseOrderLineItems(rawItems, bagSizes) {
    var lines = splitOrderItemsRaw(rawItems);
    var parsed = [];

    lines.forEach(function (line) {
      var unitPrice = null;
      var priceMatch = line.match(/\(\s*Price:\s*\$([0-9]+(?:\.[0-9]+)?)/i);
      if (priceMatch) {
        unitPrice = parseFloat(priceMatch[1]);
      }

      var withoutParens = line.replace(/\s*\(.*\)\s*$/, '').trim();
      var qty = 1;
      var rest = withoutParens;

      var qtyMatch = withoutParens.match(/^(\d+)\s*x\s+(.+)$/i);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10);
        rest = qtyMatch[2].trim();
      }

      var multiBagMatch = rest.match(/^(.+?)\s+(\d+)\s*[×x]\s*(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))\s*(?:bags?)?$/i);
      if (multiBagMatch) {
        var packProduct = multiBagMatch[1].trim();
        var packCount = parseInt(multiBagMatch[2], 10);
        var singleBagSize = multiBagMatch[3].replace(/\s+/g, '');
        var singleBagLbs = bagSizeToLbs(singleBagSize, bagSizes);
        parsed.push({
          qty: qty,
          product: packProduct,
          bagSize: packCount + ' × ' + singleBagSize + ' bags',
          bagsPerUnit: packCount,
          bagsCount: qty * packCount,
          weightLbs: packCount * singleBagLbs,
          unitPrice: unitPrice,
          linePrice: unitPrice !== null ? Math.round(qty * unitPrice * 100) / 100 : null,
          raw: line
        });
        return;
      }

      if (/^peck your own$/i.test(rest)) {
        parsed.push({
          qty: qty,
          product: 'Peck Your Own',
          bagSize: '4 × 8oz bags',
          bagsPerUnit: 4,
          bagsCount: qty * 4,
          weightLbs: 4 * bagSizeToLbs('8oz', bagSizes),
          unitPrice: unitPrice,
          linePrice: unitPrice !== null ? Math.round(qty * unitPrice * 100) / 100 : null,
          raw: line
        });
        return;
      }

      var bagSize = '';
      var product = rest;
      var sizeMatch = rest.match(/^(.+?)\s+(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))$/i);
      if (sizeMatch) {
        product = sizeMatch[1].trim();
        bagSize = sizeMatch[2].replace(/\s+/g, '');
      }

      var lbs = bagSizeToLbs(bagSize, bagSizes);
      parsed.push({
        qty: qty,
        product: product || 'Coffee',
        bagSize: bagSize,
        bagsPerUnit: 1,
        bagsCount: qty,
        weightLbs: lbs,
        unitPrice: unitPrice,
        linePrice: unitPrice !== null ? Math.round(qty * unitPrice * 100) / 100 : null,
        raw: line
      });
    });

    return parsed;
  }

  function computeAgg(values, mode) {
    if (!values || values.length === 0) return 0;
    if (mode === 'min') return Math.min.apply(null, values);
    if (mode === 'max') return Math.max.apply(null, values);
    var sum = values.reduce(function (a, b) { return a + (Number(b) || 0); }, 0);
    if (mode === 'avg') return sum / values.length;
    return sum;
  }

  function computeOrderTotals(orders, options, bagSizes) {
    var opts = options || {};
    var rawGroupBy = opts.groupBy || 'month';
    var groupBys = Array.isArray(rawGroupBy)
      ? rawGroupBy.slice()
      : String(rawGroupBy).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (groupBys.length === 0) groupBys = ['month'];
    groupBys = groupBys.map(function (g) { return g === 'product' ? 'roast' : g; });

    var filterYear = opts.year || 'all';
    var filterMonth = opts.month || 'all';
    var filterStatus = opts.status || 'all';
    var filterDelivery = opts.deliveryMethod || 'all';
    var filterRoast = opts.roast || opts.coffee || 'all';
    var filterSize = opts.size || 'all';
    var filterSearch = (opts.search || '').trim().toLowerCase();

    var groups = {};
    var summary = {
      totalOrders: 0,
      totalBags: 0,
      totalLbs: 0,
      totalRevenue: 0
    };

    function getGroupSlot(key, label, dimValues) {
      if (!groups[key]) {
        groups[key] = {
          key: key,
          label: label || key,
          dimValues: dimValues || {},
          ordersCount: 0,
          bagsCount: 0,
          weightLbs: 0,
          revenue: 0,
          bagsVals: [],
          weightVals: [],
          revVals: [],
          _orderIds: {}
        };
      }
      return groups[key];
    }

    (orders || []).forEach(function (o) {
      var normStatus = normalizeStatus(o.status);
      var isCancelled = normStatus === 'cancelled';
      var isDelivered = normStatus === 'delivered';

      if (filterStatus === 'active') {
        if (isCancelled || isDelivered) return;
      } else if (filterStatus === 'all') {
        if (isCancelled) return;
      } else if (filterStatus !== 'all_with_cancelled') {
        if (normStatus !== normalizeStatus(filterStatus)) return;
      }

      if (filterSearch) {
        var haystack = [o.orderId, o.name, o.email, o.items, o.status, o.deliveryMethod, o.city].join(' ').toLowerCase();
        if (haystack.indexOf(filterSearch) === -1) return;
      }

      var dt = extractOrderDate(o.timestamp);
      if (filterYear !== 'all' && dt.year !== filterYear) return;
      if (filterMonth !== 'all' && dt.month !== filterMonth) return;

      var deliv = (o.deliveryMethod || 'Pickup').trim();
      if (filterDelivery !== 'all' && deliv.toLowerCase() !== filterDelivery.toLowerCase()) return;

      var lineItems = parseOrderLineItems(o.items, bagSizes);
      if (filterRoast !== 'all') {
        var matchesRoast = lineItems.some(function (li) { return li.product.toLowerCase() === filterRoast.toLowerCase(); });
        if (!matchesRoast) return;
      }
      if (filterSize !== 'all') {
        var matchesSize = lineItems.some(function (li) { return (li.bagSize || '').toLowerCase() === filterSize.toLowerCase(); });
        if (!matchesSize) return;
      }

      var orderRev = parseCurrency(o.total);
      var orderBags = 0;
      var orderLbs = 0;

      lineItems.forEach(function (li) {
        if (filterRoast !== 'all' && li.product.toLowerCase() !== filterRoast.toLowerCase()) return;
        if (filterSize !== 'all' && (li.bagSize || '').toLowerCase() !== filterSize.toLowerCase()) return;
        orderBags += li.bagsCount;
        orderLbs += li.qty * li.weightLbs;
      });

      summary.totalOrders++;
      summary.totalBags += orderBags;
      summary.totalLbs = Math.round((summary.totalLbs + orderLbs) * 100) / 100;
      summary.totalRevenue = Math.round((summary.totalRevenue + orderRev) * 100) / 100;

      var needsLineItemBreakout = groupBys.indexOf('roast') !== -1 || groupBys.indexOf('size') !== -1;

      function resolveOrderDim(dim, li) {
        if (dim === 'all') return 'All Orders';
        if (dim === 'year') return dt.year;
        if (dim === 'month') return dt.yearMonth;
        if (dim === 'date') return dt.date;
        if (dim === 'deliveryMethod') return deliv;
        if (dim === 'status') return o.status || 'Received';
        if (dim === 'city') return (o.city || '').trim() || 'Pickup / No City';
        if (dim === 'customer') return (o.name || 'Customer').trim();
        if (dim === 'roast') return li ? (li.product || 'Unknown Roast') : 'Unknown Roast';
        if (dim === 'size') return li ? (li.bagSize || 'Unspecified') : 'Unspecified';
        return 'All';
      }

      if (needsLineItemBreakout) {
        var totalLineWeight = lineItems.reduce(function (acc, it) { return acc + (it.qty * it.weightLbs); }, 0);
        var totalLineBags = lineItems.reduce(function (acc, it) { return acc + it.bagsCount; }, 0);

        lineItems.forEach(function (li) {
          if (filterRoast !== 'all' && li.product.toLowerCase() !== filterRoast.toLowerCase()) return;
          if (filterSize !== 'all' && (li.bagSize || '').toLowerCase() !== filterSize.toLowerCase()) return;

          var dimValues = {};
          var keyParts = groupBys.map(function (dim) {
            var val = resolveOrderDim(dim, li);
            dimValues[dim] = val;
            return val;
          });
          var compositeKey = keyParts.join(' — ');
          var slot = getGroupSlot(compositeKey, compositeKey, dimValues);

          var itemWeight = li.qty * li.weightLbs;
          var itemBags = li.bagsCount;
          if (!slot._orderIds[o.orderId]) {
            slot._orderIds[o.orderId] = true;
            slot.ordersCount++;
          }
          slot.bagsCount += itemBags;
          slot.bagsVals.push(itemBags);
          slot.weightLbs = Math.round((slot.weightLbs + itemWeight) * 100) / 100;
          slot.weightVals.push(itemWeight);

          var itemRevShare = 0;
          if (li.linePrice !== null && li.linePrice !== undefined) {
            itemRevShare = li.linePrice;
          } else if (totalLineWeight > 0) {
            itemRevShare = orderRev * (itemWeight / totalLineWeight);
          } else if (totalLineBags > 0) {
            itemRevShare = orderRev * (itemBags / totalLineBags);
          }
          slot.revenue = Math.round((slot.revenue + itemRevShare) * 100) / 100;
          slot.revVals.push(itemRevShare);
        });
      } else {
        var dimVals = {};
        var parts = groupBys.map(function (dim) {
          var v = resolveOrderDim(dim, null);
          dimVals[dim] = v;
          return v;
        });
        var compKey = parts.join(' — ');
        var gSlot = getGroupSlot(compKey, compKey, dimVals);
        gSlot.ordersCount++;
        gSlot.bagsCount += orderBags;
        gSlot.bagsVals.push(orderBags);
        gSlot.weightLbs = Math.round((gSlot.weightLbs + orderLbs) * 100) / 100;
        gSlot.weightVals.push(orderLbs);
        gSlot.revenue = Math.round((gSlot.revenue + orderRev) * 100) / 100;
        gSlot.revVals.push(orderRev);
      }
    });

    var rows = Object.keys(groups).map(function (k) {
      var g = groups[k];
      delete g._orderIds;
      return g;
    });

    return {
      groupBy: groupBys[0],
      groupBys: groupBys,
      summary: summary,
      rows: rows
    };
  }

  function sortOrderTotalsRows(rows, sortCol, sortDir, bagSizes) {
    if (!rows || rows.length === 0 || !sortCol) return rows ? rows.slice() : [];
    var dir = sortDir === 'asc' ? 1 : -1;
    var sizeOrder = Array.isArray(bagSizes) ? bagSizes.map(function (s) { return String(s.id).toLowerCase(); }) : [];

    return rows.slice().sort(function (a, b) {
      var cmp = 0;
      if (sortCol.indexOf('dim:') === 0) {
        var dimKey = sortCol.slice(4);
        var aVal = String((a.dimValues && a.dimValues[dimKey]) || a.label || '');
        var bVal = String((b.dimValues && b.dimValues[dimKey]) || b.label || '');
        if (dimKey === 'size' && sizeOrder.length > 0) {
          var idxA = sizeOrder.indexOf(aVal.toLowerCase());
          var idxB = sizeOrder.indexOf(bVal.toLowerCase());
          if (idxA !== -1 && idxB !== -1) cmp = idxA - idxB;
          else if (idxA !== -1) cmp = -1;
          else if (idxB !== -1) cmp = 1;
          else cmp = aVal.localeCompare(bVal);
        } else {
          cmp = aVal.localeCompare(bVal);
        }
      } else if (sortCol === 'orders') {
        cmp = (a.ordersCount || 0) - (b.ordersCount || 0);
      } else if (sortCol === 'bags') {
        cmp = (a.bagsCount || 0) - (b.bagsCount || 0);
      } else if (sortCol === 'weight') {
        cmp = (a.weightLbs || 0) - (b.weightLbs || 0);
      } else if (sortCol === 'revenue') {
        cmp = (a.revenue || 0) - (b.revenue || 0);
      }
      if (cmp !== 0) return cmp * dir;
      return (b.ordersCount || 0) - (a.ordersCount || 0);
    });
  }

  function initAdminOrders(options) {
    var apiUrl = options.apiUrl;
    var manageBaseUrl = options.manageBaseUrl;
    var bagSizes = options.bagSizes;

    var gateSection = document.getElementById('order-admin-gate-section');
    var gateForm = document.getElementById('order-admin-gate-form');
    var passcodeInput = document.getElementById('order-admin-passcode-input');
    var gateError = document.getElementById('order-admin-gate-error');

    var dashboardSection = document.getElementById('order-admin-dashboard-section');
    var statsContainer = document.getElementById('order-admin-stats');
    var refreshBtn = document.getElementById('order-admin-refresh-btn');
    var logoutBtn = document.getElementById('order-admin-logout-btn');
    var searchInput = document.getElementById('order-admin-search-input');

    var inspectorCard = document.getElementById('order-admin-inspector-card');
    var inspectorContainer = document.getElementById('order-admin-inspector');

    var totalsFilterYear = document.getElementById('order-totals-filter-year');
    var totalsFilterMonth = document.getElementById('order-totals-filter-month');
    var totalsFilterStatus = document.getElementById('order-totals-filter-status');
    var totalsFilterDelivery = document.getElementById('order-totals-filter-delivery');
    var totalsFilterRoast = document.getElementById('order-totals-filter-roast');
    var totalsFilterSize = document.getElementById('order-totals-filter-size');
    var orderGroupPillsWrap = document.getElementById('order-totals-group-pills');
    var orderClearGroupByBtn = document.getElementById('order-clear-groupby');
    var orderAggBags = document.getElementById('order-agg-bags');
    var orderAggWeight = document.getElementById('order-agg-weight');
    var orderAggRevenue = document.getElementById('order-agg-revenue');
    var totalsTableWrap = document.getElementById('order-totals-table-wrap');

    var currentOrders = [];
    var currentSearch = '';
    var selectedOrderId = null;
    var orderRawSortCol = 'date';
    var orderRawSortDir = 'desc';
    var orderTotalsSortCol = 'orders';
    var orderTotalsSortDir = 'desc';

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

    function renderStats() {
      var stats = computeStats(currentOrders);
      var html = '<span class="order-admin-stat-pill order-admin-stat-pill--highlight">Total: ' + stats.total + '</span>' +
        '<span class="order-admin-stat-pill">Received: ' + stats.received + '</span>';

      if (stats.delayed > 0) {
        html += '<span class="order-admin-stat-pill" style="color: #b45309; background: #fef3c7;">Delayed: ' + stats.delayed + '</span>';
      }
      if (stats.roasted > 0) {
        html += '<span class="order-admin-stat-pill">Roasted: ' + stats.roasted + '</span>';
      }
      if (stats.readyForPickup > 0) {
        html += '<span class="order-admin-stat-pill">Ready for Pickup: ' + stats.readyForPickup + '</span>';
      }
      if (stats.readyToDeliver > 0) {
        html += '<span class="order-admin-stat-pill">Ready to Deliver: ' + stats.readyToDeliver + '</span>';
      }
      html += '<span class="order-admin-stat-pill">Delivered: ' + stats.delivered + '</span>';
      statsContainer.innerHTML = html;
    }

    function formatPrice(val) {
      if (!val && val !== 0) return '';
      var str = String(val).trim();
      if (!str) return '';
      var clean = str.replace(/^\$/, '').trim();
      var num = parseFloat(clean);
      if (!isNaN(num) && clean.match(/^\d+(\.\d+)?$/)) {
        return '$' + num.toFixed(2);
      }
      return str.charAt(0) === '$' ? str : ('$' + str);
    }

    function renderInspector(order) {
      if (!order) {
        inspectorCard.style.display = 'none';
        inspectorContainer.innerHTML = '';
        return;
      }
      inspectorCard.style.display = 'block';

      var badgeClass = getStatusBadgeClass(order.status);
      var magicLinkUrl = manageBaseUrl + (manageBaseUrl.indexOf('?') === -1 ? '?' : '&') +
        'orderId=' + encodeURIComponent(order.orderId) + '&token=' + encodeURIComponent(order.token || '');

      var fulfillmentHtml = '<div class="order-admin-info-line"><strong>Method:</strong> ' + escapeHtml(order.deliveryMethod) + '</div>';
      if ((order.deliveryMethod || '').toLowerCase() === 'hand delivery' && order.address) {
        var addressLine = escapeHtml(order.address) + (order.city ? ', ' + escapeHtml(order.city) : '') +
          (order.state ? ' ' + escapeHtml(order.state) : '') + (order.zip ? ' ' + escapeHtml(order.zip) : '');
        fulfillmentHtml += '<div class="order-admin-info-line"><strong>Address:</strong> ' + addressLine + '</div>';
      }

      var notesHtml = order.notes
        ? '<div class="order-admin-section-block"><div class="order-admin-section-label">Customer Instructions</div><div class="order-admin-info-line">' + escapeHtml(order.notes) + '</div></div>'
        : '';

      var itemLines = splitOrderItemsRaw(order.items);
      var itemsBoxHtml = itemLines.length === 0
        ? '<div class="order-admin-items-box">No items listed</div>'
        : '<div class="order-admin-items-box"><ul class="order-admin-items-list">' +
          itemLines.map(function (it) { return '<li>' + escapeHtml(it) + '</li>'; }).join('') +
          '</ul></div>';

      var formattedTotal = formatPrice(order.total);
      var totalHtml = formattedTotal
        ? '<span class="order-admin-inspector-divider" aria-hidden="true">|</span><span class="order-admin-inspector-price">' + escapeHtml(formattedTotal) + '</span>'
        : '';

      inspectorContainer.innerHTML = '<div class="order-admin-inspector-header">' +
        '<div class="order-admin-inspector-title-wrap">' +
        '<h3 class="order-admin-inspector-title">Order #' + escapeHtml(order.orderId) + '</h3>' +
        totalHtml +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
        '<button type="button" id="admin-close-inspector-btn" class="order-admin-btn-sm">Close</button>' +
        '</div>' +
        '</div>' +
        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Contact</div>' +
        '<div class="order-admin-info-line"><strong>Name:</strong> ' + escapeHtml(order.name) + '</div>' +
        '<div class="order-admin-info-line"><strong>Email:</strong> <a href="mailto:' + escapeHtml(order.email) + '">' + escapeHtml(order.email) + '</a></div>' +
        (order.timestamp ? '<div class="order-admin-info-line"><strong>Placed:</strong> ' + escapeHtml(order.timestamp) + '</div>' : '') +
        '</div>' +
        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Fulfillment Details</div>' +
        fulfillmentHtml +
        '</div>' +
        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Ordered Items</div>' +
        itemsBoxHtml +
        '</div>' +
        notesHtml +
        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Portal Link</div>' +
        '<div class="order-admin-info-line"><a href="' + magicLinkUrl + '" target="_blank" rel="noopener">Open Customer View &rarr;</a></div>' +
        '</div>' +
        '<div class="order-admin-status-box">' +
        '<div class="order-admin-section-label">Fulfillment Status</div>' +
        '<select id="admin-status-select" class="order-admin-status-picker">' +
        '<option value="Received"' + (order.status === 'Received' ? ' selected' : '') + '>Received</option>' +
        '<option value="Delayed"' + (order.status === 'Delayed' ? ' selected' : '') + '>Delayed</option>' +
        '<option value="Roasted"' + (order.status === 'Roasted' ? ' selected' : '') + '>Roasted</option>' +
        '<option value="Ready for Pickup"' + (order.status === 'Ready for Pickup' ? ' selected' : '') + '>Ready for Pickup</option>' +
        '<option value="Ready to Deliver"' + (order.status === 'Ready to Deliver' ? ' selected' : '') + '>Ready to Deliver</option>' +
        '<option value="Delivered"' + (order.status === 'Delivered' ? ' selected' : '') + '>Delivered</option>' +
        '<option value="Cancelled"' + (order.status === 'Cancelled' ? ' selected' : '') + '>Cancelled</option>' +
        '</select>' +
        '<textarea id="admin-status-details" class="order-admin-textarea" placeholder="Update notes, delay reason, or pickup instructions...">' +
        escapeHtml(order.statusDetails || '') +
        '</textarea>' +
        '<label class="order-admin-checkbox-label">' +
        '<input type="checkbox" id="admin-notify-customer">' +
        '<span>Send email notification to customer (BCC roaster)</span>' +
        '</label>' +
        '<div id="admin-notice-pill" class="order-admin-notice-pill">' +
        '<span>🔕 Silent update: No email will be sent to the customer.</span>' +
        '</div>' +
        '<button type="button" id="admin-save-status-btn" class="order-admin-save-btn">Save Status</button>' +
        '<div id="admin-status-feedback" class="order-admin-feedback" style="display: none;"></div>' +
        '</div>';

      var closeBtn = document.getElementById('admin-close-inspector-btn');
      var saveBtn = document.getElementById('admin-save-status-btn');
      var statusSelect = document.getElementById('admin-status-select');
      var detailsTextarea = document.getElementById('admin-status-details');
      var notifyCheckbox = document.getElementById('admin-notify-customer');
      var noticePill = document.getElementById('admin-notice-pill');
      var feedbackDiv = document.getElementById('admin-status-feedback');

      closeBtn.addEventListener('click', function () {
        selectedOrderId = null;
        renderInspector(null);
        totalsTableWrap.querySelectorAll('tr.is-selected').forEach(function (tr) {
          tr.classList.remove('is-selected');
        });
      });

      notifyCheckbox.addEventListener('change', function () {
        if (notifyCheckbox.checked) {
          saveBtn.textContent = 'Save & Send Notification';
          noticePill.className = 'order-admin-notice-pill order-admin-notice-pill--notify';
          noticePill.innerHTML = '<span>⚡ Status update email will be sent to customer and BCC roaster.</span>';
        } else {
          saveBtn.textContent = 'Save Status';
          noticePill.className = 'order-admin-notice-pill';
          noticePill.innerHTML = '<span>🔕 Silent update: No email will be sent to the customer.</span>';
        }
      });

      saveBtn.addEventListener('click', function () {
        var newStatus = statusSelect.value;
        var newDetails = detailsTextarea.value.trim();
        var shouldNotify = notifyCheckbox.checked;

        saveBtn.disabled = true;
        saveBtn.textContent = shouldNotify ? 'Saving & Notifying...' : 'Saving...';
        feedbackDiv.style.display = 'none';

        updateOrderStatus(order.orderId, newStatus, newDetails, shouldNotify, function (err) {
          saveBtn.disabled = false;
          saveBtn.textContent = shouldNotify ? 'Save & Send Notification' : 'Save Status';

          if (err) {
            feedbackDiv.className = 'order-admin-feedback order-admin-feedback--error';
            feedbackDiv.textContent = 'Failed to update: ' + err;
            feedbackDiv.style.display = 'block';
          } else {
            order.status = newStatus;
            order.statusDetails = newDetails;

            renderStats();
            populateOrderTotalsFilters();
            renderOrdersTable();
            renderInspector(order);

            var newFeedbackDiv = document.getElementById('admin-status-feedback');
            newFeedbackDiv.className = 'order-admin-feedback order-admin-feedback--success';
            newFeedbackDiv.textContent = '✓ Order #' + order.orderId + ' updated to ' + newStatus + (shouldNotify ? ' (email sent)!' : ' (saved silently)!');
            newFeedbackDiv.style.display = 'block';
          }
        });
      });
    }

    function getActiveGroupBys() {
      var groupBys = [];
      orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active').forEach(function (p) {
        groupBys.push(p.getAttribute('data-group'));
      });
      return groupBys;
    }

    function getActiveFilterCount() {
      var count = 0;
      if (totalsFilterYear.value !== 'all') count++;
      if (totalsFilterMonth.value !== 'all') count++;
      if (totalsFilterRoast.value !== 'all') count++;
      if (totalsFilterSize.value !== 'all') count++;
      if (totalsFilterStatus.value !== 'all_with_cancelled') count++;
      if (totalsFilterDelivery.value !== 'all') count++;
      return count;
    }

    function updateFilterBtnLabel() {
      var drawerId = 'order-totals-filter-drawer';
      var btn = document.querySelector('[data-drawer-target="' + drawerId + '"]');
      var drawer = document.getElementById(drawerId);
      var isOpen = drawer.style.display !== 'none';
      var count = getActiveFilterCount();
      var groupCount = getActiveGroupBys().length;
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
      var labelSpan = btn.querySelector('strong');
      var iconSpan = btn.querySelector('span');

      if (open) {
        drawer.style.display = 'block';
        btn.classList.add('is-open');
        labelSpan.textContent = 'Close Filters';
        iconSpan.textContent = '−';
      } else {
        drawer.style.display = 'none';
        btn.classList.remove('is-open');
        iconSpan.textContent = '+';
        updateFilterBtnLabel();
      }
    }

    function populateOrderTotalsFilters() {
      var yearsSet = {};
      var roastsSet = {};
      var sizesSet = {};

      currentOrders.forEach(function (o) {
        var d = extractOrderDate(o.timestamp);
        if (d.year && d.year !== 'Unknown') yearsSet[d.year] = true;
        parseOrderLineItems(o.items, bagSizes).forEach(function (it) {
          if (it.product) roastsSet[it.product] = true;
          if (it.bagSize) sizesSet[it.bagSize] = true;
        });
      });

      var years = Object.keys(yearsSet).sort().reverse();
      var prevYear = totalsFilterYear.value;
      totalsFilterYear.innerHTML = '<option value="all">All Years</option>' +
        years.map(function (y) { return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>'; }).join('');
      if (years.indexOf(prevYear) !== -1) totalsFilterYear.value = prevYear;

      var roasts = Object.keys(roastsSet).sort();
      var prevRoast = totalsFilterRoast.value;
      totalsFilterRoast.innerHTML = '<option value="all">All Roasts</option>' +
        roasts.map(function (c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
      if (roasts.indexOf(prevRoast) !== -1) totalsFilterRoast.value = prevRoast;

      var configuredSizeIds = bagSizes.map(function (s) { return s.id; });
      var sizes = Object.keys(sizesSet).sort(function (a, b) {
        var idxA = configuredSizeIds.indexOf(a);
        var idxB = configuredSizeIds.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });
      var prevSize = totalsFilterSize.value;
      totalsFilterSize.innerHTML = '<option value="all">All Sizes</option>' +
        sizes.map(function (sz) { return '<option value="' + escapeHtml(sz) + '">' + escapeHtml(sz) + '</option>'; }).join('');
      if (sizes.indexOf(prevSize) !== -1) totalsFilterSize.value = prevSize;

      updateFilterBtnLabel();
    }

    function renderSortTh(label, colKey, currentCol, currentDir, alignRight, widthClass) {
      var isSorted = currentCol === colKey;
      var icon = isSorted
        ? (currentDir === 'asc' ? ' ▲' : ' ▼')
        : '<span class="roast-admin-sort-icon">↕</span>';
      var style = alignRight ? ' style="text-align: right;"' : '';
      var cls = 'roast-admin-th-sortable' + (isSorted ? ' is-sorted' : '') + (widthClass ? ' ' + widthClass : '');
      return '<th class="' + cls + '" data-sort-col="' + escapeHtml(colKey) + '"' + style + '>' +
        escapeHtml(label) + icon + '</th>';
    }

    function renderOrdersTable() {
      var groupBys = getActiveGroupBys();
      var filterYear = totalsFilterYear.value;
      var filterMonth = totalsFilterMonth.value;
      var filterStatus = totalsFilterStatus.value;
      var filterDelivery = totalsFilterDelivery.value;
      var filterRoast = totalsFilterRoast.value;
      var filterSize = totalsFilterSize.value;

      var bagsAgg = orderAggBags.value;
      var weightAgg = orderAggWeight.value;
      var revAgg = orderAggRevenue.value;

      if (groupBys.length === 0) {
        var rawRows = [];
        currentOrders.forEach(function (o) {
          var normStatus = normalizeStatus(o.status);
          var isCancelled = normStatus === 'cancelled';
          var isDelivered = normStatus === 'delivered';

          if (filterStatus === 'active') {
            if (isCancelled || isDelivered) return;
          } else if (filterStatus === 'all') {
            if (isCancelled) return;
          } else if (filterStatus !== 'all_with_cancelled') {
            if (normStatus !== normalizeStatus(filterStatus)) return;
          }

          if (currentSearch) {
            var q = currentSearch.toLowerCase();
            var haystack = [o.orderId, o.name, o.email, o.items, o.status, o.deliveryMethod, o.city].join(' ').toLowerCase();
            if (haystack.indexOf(q) === -1) return;
          }

          var dt = extractOrderDate(o.timestamp);
          if (filterYear !== 'all' && dt.year !== filterYear) return;
          if (filterMonth !== 'all' && dt.month !== filterMonth) return;

          var deliv = (o.deliveryMethod || 'Pickup').trim();
          if (filterDelivery !== 'all' && deliv.toLowerCase() !== filterDelivery.toLowerCase()) return;

          var lineItems = parseOrderLineItems(o.items, bagSizes);
          if (filterRoast !== 'all') {
            var matchesRoast = lineItems.some(function (li) { return li.product.toLowerCase() === filterRoast.toLowerCase(); });
            if (!matchesRoast) return;
          }
          if (filterSize !== 'all') {
            var matchesSize = lineItems.some(function (li) { return (li.bagSize || '').toLowerCase() === filterSize.toLowerCase(); });
            if (!matchesSize) return;
          }

          var orderBags = 0;
          var orderLbs = 0;
          lineItems.forEach(function (li) {
            if (filterRoast !== 'all' && li.product.toLowerCase() !== filterRoast.toLowerCase()) return;
            if (filterSize !== 'all' && (li.bagSize || '').toLowerCase() !== filterSize.toLowerCase()) return;
            orderBags += li.bagsCount;
            orderLbs += li.qty * li.weightLbs;
          });

          rawRows.push({
            order: o,
            orderId: o.orderId,
            dateIso: dt.date !== 'Unknown' ? dt.date : (o.timestamp || ''),
            customer: (o.name || 'Customer').trim(),
            email: o.email || '',
            deliveryMethod: deliv,
            city: o.city || '',
            status: o.status || 'Received',
            items: o.items || '',
            bagsCount: orderBags,
            weightLbs: Math.round(orderLbs * 100) / 100,
            revenue: parseCurrency(o.total)
          });
        });

        if (rawRows.length === 0) {
          totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No orders match the selected filters.</div>';
          return;
        }

        var dir = orderRawSortDir === 'asc' ? 1 : -1;
        rawRows.sort(function (a, b) {
          var cmp = 0;
          if (orderRawSortCol === 'date') cmp = String(a.dateIso).localeCompare(String(b.dateIso));
          else if (orderRawSortCol === 'orderId') cmp = (Number(a.orderId) || 0) - (Number(b.orderId) || 0) || String(a.orderId).localeCompare(String(b.orderId));
          else if (orderRawSortCol === 'customer') cmp = a.customer.localeCompare(b.customer);
          else if (orderRawSortCol === 'bags') cmp = a.bagsCount - b.bagsCount;
          else if (orderRawSortCol === 'weight') cmp = a.weightLbs - b.weightLbs;
          else if (orderRawSortCol === 'revenue') cmp = a.revenue - b.revenue;
          else if (orderRawSortCol === 'deliveryMethod') cmp = a.deliveryMethod.localeCompare(b.deliveryMethod);
          else if (orderRawSortCol === 'status') cmp = a.status.localeCompare(b.status);
          if (cmp !== 0) return cmp * dir;
          return (Number(b.orderId) || 0) - (Number(a.orderId) || 0);
        });

        var totBags = computeAgg(rawRows.map(function (r) { return r.bagsCount; }), bagsAgg);
        var totWeight = computeAgg(rawRows.map(function (r) { return r.weightLbs; }), weightAgg);
        var totRev = computeAgg(rawRows.map(function (r) { return r.revenue; }), revAgg);

        var html = '<table class="roast-admin-table"><thead><tr>' +
          renderSortTh('Date', 'date', orderRawSortCol, orderRawSortDir, false) +
          renderSortTh('Order', 'orderId', orderRawSortCol, orderRawSortDir, false) +
          renderSortTh('Customer', 'customer', orderRawSortCol, orderRawSortDir, false) +
          '<th>Items</th>';
        if (bagsAgg !== 'hide') html += renderSortTh('Bags', 'bags', orderRawSortCol, orderRawSortDir, true, 'order-col-orders');
        if (weightAgg !== 'hide') html += renderSortTh('Weight', 'weight', orderRawSortCol, orderRawSortDir, true, 'order-col-weight');
        if (revAgg !== 'hide') html += renderSortTh('Total', 'revenue', orderRawSortCol, orderRawSortDir, true, 'order-col-revenue');
        html += renderSortTh('Delivery', 'deliveryMethod', orderRawSortCol, orderRawSortDir, false) +
          renderSortTh('Status', 'status', orderRawSortCol, orderRawSortDir, false) +
          '<th style="text-align: right;">Action</th>' +
          '</tr></thead><tbody>';

        rawRows.forEach(function (r) {
          var isSelected = r.orderId === selectedOrderId;
          var badgeClass = getStatusBadgeClass(r.status);
          var itemLines = splitOrderItemsRaw(r.items);
          var itemsHtml = itemLines.map(function (line) {
            return '<div style="font-size: 0.78rem; line-height: 1.35;">' + escapeHtml(line) + '</div>';
          }).join('');

          html += '<tr class="order-admin-table-row-selectable' + (isSelected ? ' is-selected' : '') + '" data-order-id="' + escapeHtml(r.orderId) + '">' +
            '<td class="mono">' + escapeHtml(r.dateIso) + '</td>' +
            '<td class="mono"><strong>#' + escapeHtml(r.orderId) + '</strong></td>' +
            '<td><strong>' + escapeHtml(r.customer) + '</strong><div class="cell-sub">' + escapeHtml(r.email) + '</div></td>' +
            '<td>' + itemsHtml + '</td>';
          if (bagsAgg !== 'hide') html += '<td class="mono order-col-orders" style="text-align: right;">' + r.bagsCount + '</td>';
          if (weightAgg !== 'hide') html += '<td class="mono order-col-weight" style="text-align: right;">' + r.weightLbs.toFixed(2) + ' lbs</td>';
          if (revAgg !== 'hide') html += '<td class="mono order-col-revenue" style="text-align: right;">$' + r.revenue.toFixed(2) + '</td>';
          html += '<td>' + escapeHtml(r.deliveryMethod) + (r.city ? '<div class="cell-sub">' + escapeHtml(r.city) + '</div>' : '') + '</td>' +
            '<td><span class="status-badge ' + badgeClass + '">' + escapeHtml(r.status) + '</span></td>' +
            '<td style="text-align: right;"><button type="button" class="order-admin-btn-sm" data-manage-order="' + escapeHtml(r.orderId) + '">Manage</button></td>' +
            '</tr>';
        });

        var totBagsStr = bagsAgg === 'avg' ? totBags.toFixed(1) : Math.round(totBags);
        html += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="4">Summary (' + rawRows.length + ' orders)</td>';
        if (bagsAgg !== 'hide') html += '<td class="mono order-col-orders" style="text-align: right;">' + totBagsStr + '<div class="cell-sub">' + escapeHtml(bagsAgg.toUpperCase()) + '</div></td>';
        if (weightAgg !== 'hide') html += '<td class="mono order-col-weight" style="text-align: right;">' + totWeight.toFixed(2) + ' lbs<div class="cell-sub">' + escapeHtml(weightAgg.toUpperCase()) + '</div></td>';
        if (revAgg !== 'hide') html += '<td class="mono order-col-revenue" style="text-align: right;">$' + totRev.toFixed(2) + '<div class="cell-sub">' + escapeHtml(revAgg.toUpperCase()) + '</div></td>';
        html += '<td colspan="3"></td></tr></tfoot></table>';

        totalsTableWrap.innerHTML = html;

        totalsTableWrap.querySelectorAll('tr[data-order-id]').forEach(function (tr) {
          tr.addEventListener('click', function () {
            var oId = tr.getAttribute('data-order-id');
            var ord = currentOrders.find(function (o) { return o.orderId === oId; });
            selectedOrderId = oId;
            totalsTableWrap.querySelectorAll('tr.is-selected').forEach(function (el) { el.classList.remove('is-selected'); });
            tr.classList.add('is-selected');
            renderInspector(ord);
            inspectorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        });

        totalsTableWrap.querySelectorAll('th[data-sort-col]').forEach(function (th) {
          th.addEventListener('click', function () {
            var col = th.getAttribute('data-sort-col');
            if (orderRawSortCol === col) {
              orderRawSortDir = orderRawSortDir === 'asc' ? 'desc' : 'asc';
            } else {
              orderRawSortCol = col;
              orderRawSortDir = (col === 'date' || col === 'orderId' || col === 'bags' || col === 'weight' || col === 'revenue') ? 'desc' : 'asc';
            }
            renderOrdersTable();
          });
        });
        return;
      }

      // Grouped Mode (1+ Group By dimensions active)
      renderInspector(null);

      var result = computeOrderTotals(currentOrders, {
        groupBy: groupBys,
        year: filterYear,
        month: filterMonth,
        status: filterStatus,
        deliveryMethod: filterDelivery,
        roast: filterRoast,
        size: filterSize,
        search: currentSearch
      }, bagSizes);

      if (result.rows.length === 0) {
        totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No orders match the selected filters.</div>';
        return;
      }

      var allBagsVals = [];
      var allWeightVals = [];
      var allRevVals = [];

      var computedRows = result.rows.map(function (r) {
        r.bagsVals.forEach(function (v) { allBagsVals.push(v); });
        r.weightVals.forEach(function (v) { allWeightVals.push(v); });
        r.revVals.forEach(function (v) { allRevVals.push(v); });
        return {
          key: r.key,
          label: r.label,
          dimValues: r.dimValues,
          ordersCount: r.ordersCount,
          bagsCount: computeAgg(r.bagsVals, bagsAgg),
          weightLbs: computeAgg(r.weightVals, weightAgg),
          revenue: computeAgg(r.revVals, revAgg)
        };
      });

      var displayRows = sortOrderTotalsRows(computedRows, orderTotalsSortCol, orderTotalsSortDir, bagSizes);
      var footBags = computeAgg(allBagsVals, bagsAgg);
      var footWeight = computeAgg(allWeightVals, weightAgg);
      var footRev = computeAgg(allRevVals, revAgg);

      var groupedHtml = '<table class="roast-admin-table"><thead><tr>';
      result.groupBys.forEach(function (dim) {
        groupedHtml += renderSortTh(ORDER_DIMENSION_LABELS[dim] || dim, 'dim:' + dim, orderTotalsSortCol, orderTotalsSortDir, false);
      });
      groupedHtml += renderSortTh('Orders', 'orders', orderTotalsSortCol, orderTotalsSortDir, true, 'order-col-orders');
      if (bagsAgg !== 'hide') groupedHtml += renderSortTh('Bags (' + bagsAgg.toUpperCase() + ')', 'bags', orderTotalsSortCol, orderTotalsSortDir, true, 'order-col-orders');
      if (weightAgg !== 'hide') groupedHtml += renderSortTh('Weight (' + weightAgg.toUpperCase() + ')', 'weight', orderTotalsSortCol, orderTotalsSortDir, true, 'order-col-weight');
      if (revAgg !== 'hide') groupedHtml += renderSortTh('Revenue (' + revAgg.toUpperCase() + ')', 'revenue', orderTotalsSortCol, orderTotalsSortDir, true, 'order-col-revenue');
      groupedHtml += '</tr></thead><tbody>';

      displayRows.forEach(function (r) {
        var rowBagsStr = bagsAgg === 'avg' ? r.bagsCount.toFixed(1) : Math.round(r.bagsCount);
        groupedHtml += '<tr>';
        result.groupBys.forEach(function (dim) {
          groupedHtml += '<td><strong>' + escapeHtml(r.dimValues[dim]) + '</strong></td>';
        });
        groupedHtml += '<td class="mono order-col-orders" style="text-align: right;">' + r.ordersCount + '</td>';
        if (bagsAgg !== 'hide') groupedHtml += '<td class="mono order-col-orders" style="text-align: right;">' + rowBagsStr + '</td>';
        if (weightAgg !== 'hide') groupedHtml += '<td class="mono order-col-weight" style="text-align: right;">' + r.weightLbs.toFixed(2) + ' lbs</td>';
        if (revAgg !== 'hide') groupedHtml += '<td class="mono order-col-revenue" style="text-align: right;">$' + r.revenue.toFixed(2) + '</td>';
        groupedHtml += '</tr>';
      });

      var footBagsStr = bagsAgg === 'avg' ? footBags.toFixed(1) : Math.round(footBags);
      groupedHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
        '<td colspan="' + result.groupBys.length + '">Summary (' + displayRows.length + ' groups)</td>' +
        '<td class="mono order-col-orders" style="text-align: right;">' + result.summary.totalOrders + '</td>';
      if (bagsAgg !== 'hide') groupedHtml += '<td class="mono order-col-orders" style="text-align: right;">' + footBagsStr + '</td>';
      if (weightAgg !== 'hide') groupedHtml += '<td class="mono order-col-weight" style="text-align: right;">' + footWeight.toFixed(2) + ' lbs</td>';
      if (revAgg !== 'hide') groupedHtml += '<td class="mono order-col-revenue" style="text-align: right;">$' + footRev.toFixed(2) + '</td>';
      groupedHtml += '</tr></tfoot></table>';

      totalsTableWrap.innerHTML = groupedHtml;

      totalsTableWrap.querySelectorAll('th[data-sort-col]').forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (orderTotalsSortCol === col) {
            orderTotalsSortDir = orderTotalsSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            orderTotalsSortCol = col;
            orderTotalsSortDir = (col === 'orders' || col === 'bags' || col === 'weight' || col === 'revenue') ? 'desc' : 'asc';
          }
          renderOrdersTable();
        });
      });
    }

    function loadOrders(passcode, callback) {
      var fetchUrl = apiUrl + (apiUrl.indexOf('?') === -1 ? '?' : '&') +
        'action=admin_list&adminKey=' + encodeURIComponent(passcode);

      fetch(fetchUrl, { credentials: 'omit' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            callback(data.error);
          } else if (data.orders) {
            currentOrders = data.orders;
            callback(null, currentOrders);
          } else {
            callback('Unexpected server response format');
          }
        })
        .catch(function (err) {
          callback('Could not connect to live order API (' + (err.message || 'Network error') + ').');
        });
    }

    function updateOrderStatus(orderId, newStatus, newDetails, notifyCustomer, callback) {
      fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'admin_update_status',
          adminKey: getStoredKey(),
          orderId: orderId,
          status: newStatus,
          statusDetails: newDetails,
          notifyCustomer: !!notifyCustomer
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) callback(data.error);
        else callback(null, data);
      })
      .catch(function (err) {
        callback('Network error during status update: ' + err.message);
      });
    }

    function onOrdersLoaded() {
      renderStats();
      populateOrderTotalsFilters();
      renderOrdersTable();
      if (currentSearch) {
        var targetId = currentSearch.replace(/^#/, '');
        var matchOrder = currentOrders.find(function (o) { return o.orderId === targetId; });
        if (matchOrder) {
          selectedOrderId = matchOrder.orderId;
          renderOrdersTable();
          renderInspector(matchOrder);
        }
      }
    }

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
        totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">Loading orders...</div>';
        loadOrders(key, function (err) {
          if (!err) onOrdersLoaded();
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

      loadOrders(key, function (err) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'Refresh';
        if (err) alert('Failed to refresh orders: ' + err);
        else onOrdersLoaded();
      });
    });

    logoutBtn.addEventListener('click', function () {
      clearStoredKey();
      currentOrders = [];
      selectedOrderId = null;
      renderInspector(null);
      showGate();
    });

    document.querySelectorAll('.roast-admin-toggle-drawer-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-drawer-target');
        var drawer = document.getElementById(targetId);
        setDrawerState(targetId, drawer.style.display === 'none');
      });
    });

    orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        pill.classList.toggle('order-admin-filter-pill--active');
        renderOrdersTable();
        updateFilterBtnLabel();
      });
    });

    orderClearGroupByBtn.addEventListener('click', function () {
      orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active').forEach(function (p) {
        p.classList.remove('order-admin-filter-pill--active');
      });
      renderOrdersTable();
      updateFilterBtnLabel();
    });

    [totalsFilterYear, totalsFilterMonth, totalsFilterRoast, totalsFilterSize, totalsFilterStatus, totalsFilterDelivery, orderAggBags, orderAggWeight, orderAggRevenue].forEach(function (sel) {
      sel.addEventListener('change', function () {
        renderOrdersTable();
        updateFilterBtnLabel();
      });
    });

    searchInput.addEventListener('input', function () {
      currentSearch = searchInput.value.trim();
      renderOrdersTable();
    });

    if (typeof window !== 'undefined' && window.location && window.location.search) {
      var qParams = new URLSearchParams(window.location.search);
      var qSearch = qParams.get('search') || qParams.get('id');
      if (qSearch) {
        currentSearch = qSearch.trim();
        searchInput.value = currentSearch;
      }
    }

    var storedKey = getStoredKey();
    if (storedKey) {
      showDashboard();
      totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">Loading orders...</div>';

      loadOrders(storedKey, function (err) {
        if (err) {
          var isAuthFailure = typeof err === 'string' && (err.indexOf('Unauthorized') !== -1 || err.indexOf('Invalid') !== -1);
          if (isAuthFailure) {
            clearStoredKey();
            showGate('Previous session expired. Please enter your passcode again.');
          } else {
            totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty" style="color: #c0392b;">' +
              'Could not connect to live order API (' + escapeHtml(err) + ').<br>' +
              '<button type="button" id="order-admin-retry-btn" class="order-admin-btn-sm" style="margin-top: 0.6rem; display: inline-block;">Retry Connection</button>' +
              '</div>';
            document.getElementById('order-admin-retry-btn').addEventListener('click', function () {
              refreshBtn.click();
            });
          }
        } else {
          onOrdersLoaded();
        }
      });
    } else {
      showGate();
    }
  }

  return {
    initAdminOrders: initAdminOrders,
    computeStats: computeStats,
    getStatusBadgeClass: getStatusBadgeClass,
    computeBrowserHash: computeBrowserHash,
    extractOrderDate: extractOrderDate,
    parseOrderLineItems: parseOrderLineItems,
    parseCurrency: parseCurrency,
    bagSizeToLbs: bagSizeToLbs,
    computeAgg: computeAgg,
    computeOrderTotals: computeOrderTotals,
    sortOrderTotalsRows: sortOrderTotalsRows,
    DEFAULT_SALT: DEFAULT_SALT
  };
});
