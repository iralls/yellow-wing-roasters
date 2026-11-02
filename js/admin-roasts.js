/**
 * Yellow Wing Roasters - Roaster Inventory & Roast Log Controller (/roasts/admin/)
 * Manages Active Green Beans (pure derived view), Green Bean Orders, Roast Logs,
 * Master Blend & Packaging Log, and Totals.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminRoasts = exp.initAdminRoasts;
    root.initAdminPortal = exp.initAdminPortal;
    root.lbsToGrams = exp.lbsToGrams;
    root.computeWeightLossPct = exp.computeWeightLossPct;
    root.generateNextInternalId = exp.generateNextInternalId;
    root.generateGreenBeanOrderId = exp.generateGreenBeanOrderId;
    root.generateRoastLogId = exp.generateRoastLogId;
    root.generatePackagingLogId = exp.generatePackagingLogId;
    root.makeSemanticCode = exp.makeSemanticCode;
    root.recomputeActiveBeanStocks = exp.recomputeActiveBeanStocks;
    root.computeTotals = exp.computeTotals;
    root.calculateBagSizeGrams = exp.calculateBagSizeGrams;
    root.calculateGramsFromPercentage = exp.calculateGramsFromPercentage;
    root.calculatePercentageFromGrams = exp.calculatePercentageFromGrams;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

  var GRAMS_PER_LB = 453.592;

  function computeBrowserHash(key, salt) {
    salt = salt || DEFAULT_SALT;
    var rawText = salt + (key || '').trim();
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      var msg = new TextEncoder().encode(rawText);
      return crypto.subtle.digest('SHA-256', msg).then(function (buf) {
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    return Promise.resolve('');
  }

  function lbsToGrams(lbs) {
    var num = Number(lbs) || 0;
    return Math.round(num * GRAMS_PER_LB);
  }

  function computeWeightLossPct(greenWeightGrams, endWeightGrams) {
    var g = Number(greenWeightGrams) || 0;
    var e = Number(endWeightGrams) || 0;
    if (g <= 0) return 0;
    return Number((((g - e) / g) * 100).toFixed(2));
  }

  function calculateBagSizeGrams(bagSizeId, bagSizes) {
    if (!bagSizeId || bagSizeId === 'Custom') return 0;
    if (Array.isArray(bagSizes)) {
      var match = bagSizes.find(function (b) { return b.id === bagSizeId; });
      if (match && match.weight_oz) {
        return Math.round((Number(match.weight_oz) / 16) * GRAMS_PER_LB);
      }
    }
    var numMatch = String(bagSizeId).match(/^(\d+)(oz|lb)$/i);
    if (numMatch) {
      var val = Number(numMatch[1]);
      var unit = numMatch[2].toLowerCase();
      if (unit === 'lb') return lbsToGrams(val);
      if (unit === 'oz') return Math.round((val / 16) * GRAMS_PER_LB);
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

  function formatDateCompact(val) {
    if (!val) return '';
    var s = String(val).split('T')[0].replace(/[^0-9]/g, '');
    return s.length >= 8 ? s.slice(0, 8) : s;
  }

  function makeSemanticCode(text, maxLen) {
    var limit = maxLen || 6;
    var words = String(text || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]+/g, '')
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return 'ITEM';
    if (words.length === 1) return words[0].slice(0, limit);

    var filtered = words.filter(function (w) {
      return !/^(COFFEE|BEANS|ROASTERS|ROAST|THE|AND|OF)$/i.test(w);
    });
    if (filtered.length === 0) filtered = words;
    if (filtered.length === 1) return filtered[0].slice(0, limit);

    var p1 = filtered[0].slice(0, 3);
    var p2 = filtered[1].slice(0, 3);
    return (p1 + p2).slice(0, Math.max(limit, 6));
  }

  function generateGreenBeanOrderId(existingOrders, dateVal, supplier, beanName) {
    var existingIds = (existingOrders || []).map(function (o) { return String(o.orderId || '').trim(); });
    var d = formatDateCompact(dateVal);
    var suppCode = makeSemanticCode(supplier, 6);
    var beanCode = makeSemanticCode(beanName, 6);
    var baseId = 'GBO-' + d + '-' + suppCode + '-' + beanCode;

    if (existingIds.indexOf(baseId) === -1) {
      return baseId;
    }
    var counter = 2;
    while (existingIds.indexOf(baseId + '-' + counter) !== -1) {
      counter++;
    }
    return baseId + '-' + counter;
  }

  function generateRoastLogId(existingRoasts, dateVal, beanName) {
    var existingIds = (existingRoasts || []).map(function (r) { return String(r.roastId || '').trim(); });
    var d = formatDateCompact(dateVal);
    var beanCode = makeSemanticCode(beanName, 6);
    var prefix = 'R-' + d + '-' + beanCode + '-';

    var batch = 1;
    while (existingIds.indexOf(prefix + batch) !== -1) {
      batch++;
    }
    return prefix + batch;
  }

  function generatePackagingLogId(existingLogs, dateVal, product, purpose, orderId) {
    var existingIds = (existingLogs || []).map(function (p) { return String(p.logId || '').trim(); });
    var d = formatDateCompact(dateVal);
    var prodCode = makeSemanticCode(product, 6);

    var dest = 'PERSONAL';
    if (purpose === 'Order' && orderId) {
      dest = 'ORD' + String(orderId).trim().replace(/^#/, '');
    } else if (purpose === 'Sample') {
      dest = 'SAMPLE';
    }

    var baseId = 'PKG-' + d + '-' + prodCode + '-' + dest;
    if (existingIds.indexOf(baseId) === -1) {
      return baseId;
    }
    var counter = 2;
    while (existingIds.indexOf(baseId + '-' + counter) !== -1) {
      counter++;
    }
    return baseId + '-' + counter;
  }

  function generateNextInternalId(items, idKey, prefix, startNum, padLen) {
    var maxNum = startNum - 1;
    var prefixLower = prefix.toLowerCase();
    for (var i = 0; i < items.length; i++) {
      var raw = String(items[i][idKey] || '').trim();
      if (!raw) continue;
      var clean = raw;
      if (raw.toLowerCase().indexOf(prefixLower) === 0) {
        clean = raw.slice(prefix.length);
      }
      var num = parseInt(clean, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
    var nextStr = String(maxNum + 1);
    while (nextStr.length < padLen) {
      nextStr = '0' + nextStr;
    }
    return prefix + nextStr;
  }

  /**
   * Pure derived Active Green Beans computation:
   * Groups GreenBeanOrders by bean Name, computes net weightGrams (base + adjustment),
   * subtracts greenWeightGrams from RoastLogs,
   * computes availableGrams per GreenBeanOrder (excluding excludeRoastId when editing),
   * and computes availableGrams per RoastLog from BlendPackagingLog (excluding excludePkgLogId when editing).
   */
  function recomputeActiveBeanStocks(state, excludePkgLogId, excludeRoastId) {
    var roastedByOrder = {};
    if (Array.isArray(state.roastLogs)) {
      for (var rIdx = 0; rIdx < state.roastLogs.length; rIdx++) {
        var rLog = state.roastLogs[rIdx];
        if (excludeRoastId && rLog.roastId === excludeRoastId) continue;
        var gComps = rLog.greenBeanComponents || [];
        for (var gc = 0; gc < gComps.length; gc++) {
          var oId = gComps[gc].orderId;
          roastedByOrder[oId] = (roastedByOrder[oId] || 0) + (Number(gComps[gc].weightGrams) || 0);
        }
      }
    }

    var packagedByRoast = {};
    if (Array.isArray(state.blendPackagingLogs)) {
      for (var m = 0; m < state.blendPackagingLogs.length; m++) {
        var pkg = state.blendPackagingLogs[m];
        if (excludePkgLogId && pkg.logId === excludePkgLogId) continue;
        var comps = pkg.roastComponents || [];
        for (var c = 0; c < comps.length; c++) {
          var rId = comps[c].roastId;
          packagedByRoast[rId] = (packagedByRoast[rId] || 0) + (Number(comps[c].weightGrams) || 0);
        }
      }
    }

    var beanMap = {};
    var beanOrder = [];
    var orderNameById = {};

    for (var i = 0; i < state.greenBeanOrders.length; i++) {
      var ord = state.greenBeanOrders[i];
      var name = String(ord.name || '').trim();
      if (!name) continue;
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
    }

    for (var j = 0; j < state.roastLogs.length; j++) {
      var rst = state.roastLogs[j];
      var isExcludedRoast = Boolean(excludeRoastId && rst.roastId === excludeRoastId);
      var rstComps = rst.greenBeanComponents || [];
      if (rstComps.length > 0) {
        var compBeanNames = [];
        var compTotalGrams = 0;
        for (var rc = 0; rc < rstComps.length; rc++) {
          var compOrdName = orderNameById[rstComps[rc].orderId];
          var compGrams = Number(rstComps[rc].weightGrams) || 0;
          compTotalGrams += compGrams;
          if (compOrdName) {
            if (compBeanNames.indexOf(compOrdName) === -1) {
              compBeanNames.push(compOrdName);
            }
            if (!isExcludedRoast && beanMap[compOrdName]) {
              beanMap[compOrdName].roastedGrams += compGrams;
            }
          }
        }
        if (compBeanNames.length > 0) {
          rst.beanName = compBeanNames.join(' / ');
        }
        if (!rst.greenWeightGrams) {
          rst.greenWeightGrams = compTotalGrams;
        }
      } else {
        var resolvedName = String(rst.beanName || '').trim();
        rst.beanName = resolvedName;
        if (!isExcludedRoast && beanMap[resolvedName]) {
          beanMap[resolvedName].roastedGrams += (Number(rst.greenWeightGrams) || 0);
        }
      }
      rst.packagedGrams = packagedByRoast[rst.roastId] || 0;
      rst.availableGrams = Math.max(0, Math.round((Number(rst.endWeightGrams) || 0) - rst.packagedGrams));
    }

    state.greenBeans = beanOrder.map(function (name) {
      var b = beanMap[name];
      b.activeStockGrams = Math.round(b.orderedGrams - b.roastedGrams);
      return b;
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    return state.greenBeans;
  }

  function extractYearMonth(dateStr) {
    var s = String(dateStr || '').trim();
    var parts = s.split('-');
    return {
      year: parts[0] || 'Unknown',
      month: parts[1] || '00',
      yearMonth: parts.length >= 2 ? (parts[0] + '-' + parts[1]) : 'Unknown'
    };
  }

  function matchesDateAndBeanFilter(dateStr, beanName, filters) {
    var ym = extractYearMonth(dateStr);
    if (filters.year && filters.year !== 'all' && ym.year !== filters.year) {
      return false;
    }
    if (filters.month && filters.month !== 'all' && ym.month !== filters.month) {
      return false;
    }
    if (filters.beanName && filters.beanName !== 'all') {
      if (beanName !== filters.beanName) return false;
    }
    return true;
  }

  var ROAST_DIMENSION_LABELS = {
    month: 'Month',
    year: 'Year',
    bean: 'Green Bean',
    supplier: 'Supplier'
  };

  function computeTotals(state, filters) {
    filters = filters || {};
    var mode = filters.mode || 'all';

    var groupBys = [];
    if (Array.isArray(filters.groupBy)) {
      groupBys = filters.groupBy.filter(Boolean);
    } else if (typeof filters.groupBy === 'string') {
      groupBys = filters.groupBy.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    if (groupBys.length === 0) {
      groupBys = ['month'];
    }

    var filterBean = filters.beanName;

    var roastById = {};
    for (var r = 0; r < state.roastLogs.length; r++) {
      roastById[state.roastLogs[r].roastId] = state.roastLogs[r];
    }

    var supplierByBean = {};
    for (var o = 0; o < state.greenBeanOrders.length; o++) {
      supplierByBean[state.greenBeanOrders[o].name] = state.greenBeanOrders[o].supplier;
    }

    var groups = {};
    function ensureGroup(key, label, dimVals) {
      if (!groups[key]) {
        groups[key] = {
          key: key,
          label: label || key,
          dimValues: dimVals || {},
          ordersCount: 0,
          orderedWeightLbs: 0,
          orderedWeightGrams: 0,
          totalSpend: 0,
          roastCount: 0,
          greenWeightRoastedGrams: 0,
          endWeightGrams: 0,
          avgWeightLossPct: 0,
          packagedCount: 0,
          packagedGramsUsed: 0
        };
      }
      return groups[key];
    }

    var summary = ensureGroup('__summary__', 'Total', {});
    delete groups['__summary__'];

    // 1. Aggregate Green Bean Orders (if mode is 'orders' or 'all')
    if (mode === 'all' || mode === 'orders') {
      for (var i = 0; i < state.greenBeanOrders.length; i++) {
        var ordItem = state.greenBeanOrders[i];
        if (!matchesDateAndBeanFilter(ordItem.date, ordItem.name, filters)) continue;

        var ymOrd = extractYearMonth(ordItem.date);
        var dimValsOrd = {};
        for (var g1 = 0; g1 < groupBys.length; g1++) {
          var d1 = groupBys[g1];
          if (d1 === 'month') dimValsOrd[d1] = ymOrd.yearMonth;
          else if (d1 === 'year') dimValsOrd[d1] = ymOrd.year;
          else if (d1 === 'bean') dimValsOrd[d1] = ordItem.name;
          else if (d1 === 'supplier') dimValsOrd[d1] = ordItem.supplier;
          else if (d1 === 'purpose') dimValsOrd[d1] = 'Green Bean Purchase';
          else dimValsOrd[d1] = '—';
        }
        var gKeyOrd = groupBys.map(function (d) { return dimValsOrd[d]; }).join(' — ');

        var grpOrd = ensureGroup(gKeyOrd, gKeyOrd, dimValsOrd);
        var wLbs = Number(ordItem.weightLbs) || 0;
        var wGrams = Number(ordItem.weightGrams) || lbsToGrams(wLbs);
        var cost = Number(ordItem.cost) || 0;

        grpOrd.ordersCount += 1;
        grpOrd.orderedWeightLbs = Number((grpOrd.orderedWeightLbs + wLbs).toFixed(2));
        grpOrd.orderedWeightGrams += wGrams;
        grpOrd.totalSpend = Number((grpOrd.totalSpend + cost).toFixed(2));

        summary.ordersCount += 1;
        summary.orderedWeightLbs = Number((summary.orderedWeightLbs + wLbs).toFixed(2));
        summary.orderedWeightGrams += wGrams;
        summary.totalSpend = Number((summary.totalSpend + cost).toFixed(2));
      }
    }

    // 2. Aggregate Roast Logs (if mode is 'roasting' or 'all')
    if (mode === 'all' || mode === 'roasting') {
      for (var j = 0; j < state.roastLogs.length; j++) {
        var rstItem = state.roastLogs[j];
        var rstBean = (rstItem.beanName || '').trim();
        if (!rstBean && rstItem.greenBeanComponents && rstItem.greenBeanComponents.length > 0) {
          var firstComp = rstItem.greenBeanComponents[0];
          var matchedOrder = state.greenBeanOrders.find(function (o) { return o.orderId === firstComp.orderId; });
          if (matchedOrder && matchedOrder.name) {
            rstBean = matchedOrder.name.trim();
          }
        }
        if (!rstBean) {
          rstBean = 'Unknown Bean';
        }

        if (!matchesDateAndBeanFilter(rstItem.date, rstBean, filters)) continue;

        var ymRst = extractYearMonth(rstItem.date);
        var dimValsRst = {};
        for (var g2 = 0; g2 < groupBys.length; g2++) {
          var d2 = groupBys[g2];
          if (d2 === 'month') dimValsRst[d2] = ymRst.yearMonth;
          else if (d2 === 'year') dimValsRst[d2] = ymRst.year;
          else if (d2 === 'bean') dimValsRst[d2] = rstBean;
          else if (d2 === 'supplier') dimValsRst[d2] = supplierByBean[rstBean] || 'Unknown';
          else if (d2 === 'purpose') dimValsRst[d2] = 'Roast Batch';
          else if (d2 === 'roast') dimValsRst[d2] = rstBean;
          else dimValsRst[d2] = '—';
        }
        var gKeyRst = groupBys.map(function (d) { return dimValsRst[d]; }).join(' — ');

        var grpRst = ensureGroup(gKeyRst, gKeyRst, dimValsRst);
        var greenG = Number(rstItem.greenWeightGrams) || 0;
        var endG = Number(rstItem.endWeightGrams) || 0;

        grpRst.roastCount += 1;
        grpRst.greenWeightRoastedGrams += greenG;
        grpRst.endWeightGrams += endG;

        summary.roastCount += 1;
        summary.greenWeightRoastedGrams += greenG;
        summary.endWeightGrams += endG;
      }
    }

    // 3. Aggregate Blend & Packaging Logs (if mode is 'packaging' or 'all')
    if (mode === 'all' || mode === 'packaging') {
      for (var k = 0; k < state.blendPackagingLogs.length; k++) {
        var pkgItem = state.blendPackagingLogs[k];
        var ymPkg = extractYearMonth(pkgItem.date);
        if (filters.year && filters.year !== 'all' && ymPkg.year !== filters.year) continue;
        if (filters.month && filters.month !== 'all' && ymPkg.month !== filters.month) continue;
        if (filters.purpose && filters.purpose !== 'all') {
          if (filters.purpose === 'Order') {
            if (pkgItem.purpose !== 'Order' && !pkgItem.orderId) continue;
          } else {
            if (pkgItem.purpose !== filters.purpose) continue;
          }
        }

        var comps = pkgItem.roastComponents || [];
        if (filterBean && filterBean !== 'all') {
          var hasMatchingBean = comps.some(function (c) {
            var rObj = roastById[c.roastId];
            return rObj && rObj.beanName === filterBean;
          });
          if (!hasMatchingBean) continue;
        }

        var dimValsPkg = {};
        for (var g3 = 0; g3 < groupBys.length; g3++) {
          var d3 = groupBys[g3];
          if (d3 === 'month') dimValsPkg[d3] = ymPkg.yearMonth;
          else if (d3 === 'year') dimValsPkg[d3] = ymPkg.year;
          else if (d3 === 'purpose') dimValsPkg[d3] = pkgItem.purpose;
          else if (d3 === 'roast') dimValsPkg[d3] = pkgItem.product;
          else if (d3 === 'size') dimValsPkg[d3] = pkgItem.bagSize;
          else if (d3 === 'bean') {
            var firstRoast = comps.length > 0 ? roastById[comps[0].roastId] : null;
            dimValsPkg[d3] = firstRoast ? firstRoast.beanName : pkgItem.product;
          } else if (d3 === 'supplier') {
            var firstR = comps.length > 0 ? roastById[comps[0].roastId] : null;
            dimValsPkg[d3] = firstR && supplierByBean[firstR.beanName] ? supplierByBean[firstR.beanName] : 'Mixed / Blend';
          } else {
            dimValsPkg[d3] = '—';
          }
        }
        var gKeyPkg = groupBys.map(function (d) { return dimValsPkg[d]; }).join(' — ');

        var grpPkg = ensureGroup(gKeyPkg, gKeyPkg, dimValsPkg);
        var compGrams = comps.reduce(function (acc, c) { return acc + (Number(c.weightGrams) || 0); }, 0);

        grpPkg.packagedCount += 1;
        grpPkg.packagedGramsUsed += compGrams;

        summary.packagedCount += 1;
        summary.packagedGramsUsed += compGrams;
      }
    }

    summary.avgWeightLossPct = computeWeightLossPct(summary.greenWeightRoastedGrams, summary.endWeightGrams);

    var rows = Object.keys(groups).map(function (k) {
      var row = groups[k];
      row.avgWeightLossPct = computeWeightLossPct(row.greenWeightRoastedGrams, row.endWeightGrams);
      return row;
    });

    rows.sort(function (a, b) {
      return b.key.localeCompare(a.key);
    });

    return {
      mode: mode,
      groupBys: groupBys,
      summary: summary,
      rows: rows
    };
  }

  function sortGreenBeanOrders(orders, sortCol, sortDir) {
    if (!orders || orders.length === 0) return [];
    var col = sortCol || 'date';
    var dir = sortDir === 'asc' ? 1 : -1;
    return orders.slice().sort(function (a, b) {
      var cmp = 0;
      if (col === 'orderId') {
        cmp = (a.orderId || '').localeCompare(b.orderId || '');
      } else if (col === 'date') {
        cmp = (a.date || '').localeCompare(b.date || '');
      } else if (col === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (col === 'supplier') {
        cmp = (a.supplier || '').localeCompare(b.supplier || '');
      } else if (col === 'supplierOrderId') {
        cmp = (a.supplierOrderId || '').localeCompare(b.supplierOrderId || '');
      } else if (col === 'cost') {
        cmp = (Number(a.cost) || 0) - (Number(b.cost) || 0);
      } else if (col === 'weightLbs') {
        cmp = (Number(a.weightLbs) || 0) - (Number(b.weightLbs) || 0);
      } else if (col === 'adjustGrams') {
        cmp = (Number(a.adjustGrams) || 0) - (Number(b.adjustGrams) || 0);
      } else if (col === 'weightGrams') {
        cmp = (Number(a.weightGrams) || 0) - (Number(b.weightGrams) || 0);
      } else if (col === 'availableGrams') {
        var aAvail = a.availableGrams !== undefined ? Number(a.availableGrams) : Number(a.weightGrams);
        var bAvail = b.availableGrams !== undefined ? Number(b.availableGrams) : Number(b.weightGrams);
        cmp = (aAvail || 0) - (bAvail || 0);
      }
      if (cmp !== 0) return cmp * dir;
      return (b.date || '').localeCompare(a.date || '') || (b.orderId || '').localeCompare(a.orderId || '');
    });
  }

  function sortTotalsRows(rows, sortCol, sortDir) {
    if (!rows || rows.length === 0 || !sortCol) return rows ? rows.slice() : [];
    var dir = sortDir === 'asc' ? 1 : -1;
    return rows.slice().sort(function (a, b) {
      var cmp = 0;
      if (sortCol.indexOf('dim:') === 0) {
        var dimKey = sortCol.slice(4);
        var aVal = String((a.dimValues && a.dimValues[dimKey]) || a.label || '');
        var bVal = String((b.dimValues && b.dimValues[dimKey]) || b.label || '');
        cmp = aVal.localeCompare(bVal);
      } else if (sortCol === 'roasts' || sortCol === 'orders') {
        cmp = ((a.roastCount || a.ordersCount) || 0) - ((b.roastCount || b.ordersCount) || 0);
      } else if (sortCol === 'greenWeight') {
        cmp = (a.greenWeightRoastedGrams || 0) - (b.greenWeightRoastedGrams || 0);
      } else if (sortCol === 'endWeight') {
        cmp = (a.endWeightGrams || 0) - (b.endWeightGrams || 0);
      } else if (sortCol === 'lossPct') {
        cmp = (a.avgWeightLossPct || 0) - (b.avgWeightLossPct || 0);
      } else if (sortCol === 'orderedWeight') {
        cmp = (a.orderedWeightGrams || 0) - (b.orderedWeightGrams || 0);
      } else if (sortCol === 'spend') {
        cmp = (a.totalSpend || 0) - (b.totalSpend || 0);
      }
      if (cmp !== 0) return cmp * dir;
      return (b.key || '').localeCompare(a.key || '');
    });
  }

  var CANONICAL_MOCK_DATA = {
    greenBeans: [],
    greenBeanOrders: [
      {
        orderId: 'GBO-1001',
        supplierOrderId: 'RM-88412',
        name: 'Colombia Supremo Huila',
        supplier: 'Roastmasters',
        date: '2026-10-05',
        cost: 41.10,
        weightLbs: 5,
        adjustGrams: 18,
        weightGrams: 2286,
        url: 'https://www.roastmasters.com/colombia-supremo.html'
      },
      {
        orderId: 'GBO-1002',
        supplierOrderId: 'BC-50921',
        name: 'Ethiopian Guji Natural Org. Gr. 1 - Kayon Mountain',
        supplier: 'Burman Coffee',
        date: '2026-10-10',
        cost: 44.95,
        weightLbs: 5,
        adjustGrams: -5,
        weightGrams: 2263,
        url: 'https://burmancoffee.com/product/green-coffee-beans/ethiopian-kayon-1'
      },
      {
        orderId: 'GBO-1003',
        supplierOrderId: 'BC-50921',
        name: 'Brazil Mogiana 15/16 FC SS - Cooxupe',
        supplier: 'Burman Coffee',
        date: '2026-10-10',
        cost: 64.90,
        weightLbs: 10,
        adjustGrams: 0,
        weightGrams: 4536,
        url: 'https://burmancoffee.com/product/green-coffee-beans/brazil-mogiana-15-16/'
      }
    ],
    roastLogs: [
      {
        roastId: 'RST-2001',
        date: '2026-10-14',
        greenBeanComponents: [{ orderId: 'GBO-1001', weightGrams: 460 }],
        beanName: 'Colombia Supremo Huila',
        greenWeightGrams: 460,
        endWeightGrams: 392,
        weightLossPct: 14.78,
        roastLevel: 2,
        profileUrl: 'https://yellowwingroasters.com/profiles/rst-2001',
        notes: 'First crack at 8:45, dropped at City+'
      },
      {
        roastId: 'RST-2002',
        date: '2026-10-15',
        greenBeanComponents: [{ orderId: 'GBO-1002', weightGrams: 454 }],
        beanName: 'Ethiopian Guji Natural Org. Gr. 1 - Kayon Mountain',
        greenWeightGrams: 454,
        endWeightGrams: 390,
        weightLossPct: 14.10,
        roastLevel: 2,
        profileUrl: 'https://yellowwingroasters.com/profiles/rst-2002',
        notes: 'Bright blueberry aroma'
      },
      {
        roastId: 'RST-2003',
        date: '2026-10-18',
        greenBeanComponents: [{ orderId: 'GBO-1003', weightGrams: 454 }],
        beanName: 'Brazil Mogiana 15/16 FC SS - Cooxupe',
        greenWeightGrams: 454,
        endWeightGrams: 382,
        weightLossPct: 15.86,
        roastLevel: 3,
        profileUrl: 'https://yellowwingroasters.com/profiles/rst-2003',
        notes: 'Full City espresso base'
      }
    ],
    blendPackagingLogs: [
      {
        logId: 'PKG-3001',
        date: '2026-10-16',
        purpose: 'Order',
        product: 'Early Bird',
        roastComponents: [
          { roastId: 'RST-2001', weightGrams: 204 },
          { roastId: 'RST-2002', weightGrams: 136 }
        ],
        bagSize: '12oz',
        notes: 'Order #1001'
      },
      {
        logId: 'PKG-3002',
        date: '2026-10-19',
        purpose: 'Sample',
        product: 'Ethiopia Guji Sample',
        roastComponents: [
          { roastId: 'RST-2002', weightGrams: 113 }
        ],
        bagSize: 'Custom',
        notes: 'Free sample for neighbor'
      }
    ]
  };
  recomputeActiveBeanStocks(CANONICAL_MOCK_DATA);

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

  function parseOrderLineItems(itemsStr) {
    var raw = String(itemsStr || '').trim();
    if (!raw) return [];
    var parts = raw.split(/,\s*(?=\d+x\s)/i);
    return parts.map(function (part) {
      var clean = part.replace(/\s*\([^)]*\)\s*$/, '').trim();
      var withoutQty = clean.replace(/^\d+x\s+/i, '').trim();
      var sizeMatch = withoutQty.match(/\s+(12oz|1lb|2lb|5lb)$/i);
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

  function initAdminRoasts(options) {
    var apiUrl = options.apiUrl;
    var orderApiUrl = options.orderApiUrl;
    var roastLevels = options.roastLevels;
    var bagSizes = options.bagSizes || [];

    var gateSection = document.getElementById('roast-admin-gate-section');
    var gateForm = document.getElementById('roast-admin-gate-form');
    var passcodeInput = document.getElementById('roast-admin-passcode-input');
    var gateError = document.getElementById('roast-admin-gate-error');
    var gateBtn = document.getElementById('roast-admin-gate-btn');

    var dashboardSection = document.getElementById('roast-admin-dashboard-section');
    var statsContainer = document.getElementById('roast-admin-stats');
    var refreshBtn = document.getElementById('roast-admin-refresh-btn');
    var logoutBtn = document.getElementById('roast-admin-logout-btn');
    var tabsContainer = document.getElementById('roast-admin-tabs');
    var searchInput = document.getElementById('roast-admin-search-input');
    var showDepletedCheckbox = document.getElementById('roast-admin-show-depleted');

    var beansTableWrap = document.getElementById('roast-admin-beans-table-wrap');
    var ordersTableWrap = document.getElementById('roast-admin-orders-table-wrap');
    var roastsTableWrap = document.getElementById('roast-admin-roasts-table-wrap');
    var packagingTableWrap = document.getElementById('roast-admin-packaging-table-wrap');
    var totalsKpisWrap = document.getElementById('roast-admin-totals-kpis');
    var totalsTableWrap = document.getElementById('roast-admin-totals-table-wrap');

    // Forms
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

    var totalsGroupBy = document.getElementById('totals-group-by');
    var totalsFilterYear = document.getElementById('totals-filter-year');
    var totalsFilterMonth = document.getElementById('totals-filter-month');
    var totalsFilterBean = document.getElementById('totals-filter-bean');
    var totalsFilterPurpose = document.getElementById('totals-filter-purpose');
    var totalsFilterPurposeWrap = document.getElementById('totals-filter-purpose-wrap');
    var currentTotalsMode = 'roasting';
    var currentPkgFilter = 'all';
    var roastTotalsModePills = document.getElementById('roast-totals-mode-pills');
    var roastGroupPillsWrap = document.getElementById('roast-totals-group-pills');

    var state = {
      greenBeans: [],
      greenBeanOrders: [],
      roastLogs: [],
      blendPackagingLogs: [],
      customerOrders: []
    };

    var activeTab = 'beans';
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
    var roastTotalsSortCol = null;
    var roastTotalsSortDir = 'desc';
    var gbOrdersTotalsSortCol = null;
    var gbOrdersTotalsSortDir = 'desc';

    function renderSortTh(label, colKey, currentCol, currentDir, alignRight) {
      var isSorted = currentCol === colKey;
      var icon = isSorted
        ? (currentDir === 'asc' ? ' ▲' : ' ▼')
        : '<span class="roast-admin-sort-icon">↕</span>';
      var style = alignRight ? ' style="text-align: right;"' : '';
      return '<th class="roast-admin-th-sortable' + (isSorted ? ' is-sorted' : '') + '" data-sort-col="' + escapeHtml(colKey) + '"' + style + '>' +
        escapeHtml(label) + icon + '</th>';
    }

    orderDate.value = todayIso();
    roastDate.value = todayIso();
    pkgDate.value = todayIso();

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

    function renderStatsBar() {
      recomputeActiveBeanStocks(state);
      var activeBeans = state.greenBeans.filter(function (b) { return b.activeStockGrams > 0; });
      var totalActiveGrams = activeBeans.reduce(function (sum, b) { return sum + b.activeStockGrams; }, 0);
      var totalActiveLbs = (totalActiveGrams / GRAMS_PER_LB).toFixed(2);

      var html = '<span class="order-admin-stat-pill order-admin-stat-pill--highlight">Active Stock: ' +
        totalActiveGrams.toLocaleString() + ' g (' + totalActiveLbs + ' lbs)</span>' +
        '<span class="order-admin-stat-pill">Active Beans: ' + activeBeans.length + '</span>' +
        '<span class="order-admin-stat-pill">Bean Orders: ' + state.greenBeanOrders.length + '</span>' +
        '<span class="order-admin-stat-pill">Roasts: ' + state.roastLogs.length + '</span>' +
        '<span class="order-admin-stat-pill">Blend/Pkg Logs: ' + state.blendPackagingLogs.length + '</span>';

      statsContainer.innerHTML = html;
    }

    function matchesSearch(fields) {
      if (!currentSearch) return true;
      var q = currentSearch.toLowerCase();
      return fields.join(' ').toLowerCase().indexOf(q) !== -1;
    }

    function setDrawerState(drawerId, open) {
      var drawer = document.getElementById(drawerId);
      if (!drawer) return;
      var btn = document.querySelector('[data-drawer-target="' + drawerId + '"]');
      var defaultLabels = {
        'order-entry-drawer': 'Record Green Bean Order',
        'roast-entry-drawer': 'Record Roast Log',
        'pkg-entry-drawer': 'Record Master Blend & Packaging'
      };
      var labelSpan = btn ? btn.querySelector('strong') : null;
      var iconSpan = btn ? btn.querySelector('span') : null;

      if (open) {
        drawer.style.display = 'block';
        if (btn) btn.classList.add('is-open');
        if (labelSpan) labelSpan.textContent = 'Close Entry Form';
        if (iconSpan) iconSpan.textContent = '−';
      } else {
        drawer.style.display = 'none';
        if (btn) btn.classList.remove('is-open');
        if (labelSpan) labelSpan.textContent = defaultLabels[drawerId] || 'Record Entry';
        if (iconSpan) iconSpan.textContent = '+';
      }
    }

    function renderActiveBeansTable() {
      recomputeActiveBeanStocks(state);
      var showDepleted = showDepletedCheckbox.checked;
      var rows = state.greenBeans.filter(function (b) {
        if (!showDepleted && b.activeStockGrams <= 0) return false;
        return matchesSearch([b.name, b.supplier, b.url]);
      }).slice().sort(function (a, b) {
        var dir = activeBeansSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (activeBeansSortCol === 'name') {
          cmp = (a.name || '').localeCompare(b.name || '');
        } else if (activeBeansSortCol === 'supplier') {
          cmp = (a.supplier || '').localeCompare(b.supplier || '');
        } else if (activeBeansSortCol === 'stockGrams' || activeBeansSortCol === 'stockLbs') {
          cmp = (a.activeStockGrams || 0) - (b.activeStockGrams || 0);
        }
        if (cmp !== 0) return cmp * dir;
        return (a.name || '').localeCompare(b.name || '');
      });

      if (rows.length === 0) {
        beansTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No matching green beans found.</div>';
        return;
      }

      var html = '<table class="roast-admin-table">' +
        '<thead><tr>' +
        renderSortTh('Bean Name', 'name', activeBeansSortCol, activeBeansSortDir, false) +
        renderSortTh('Supplier', 'supplier', activeBeansSortCol, activeBeansSortDir, false) +
        renderSortTh('Active Stock (g)', 'stockGrams', activeBeansSortCol, activeBeansSortDir, false) +
        renderSortTh('Active Stock (lbs)', 'stockLbs', activeBeansSortCol, activeBeansSortDir, false) +
        '</tr></thead><tbody>';

      rows.forEach(function (b) {
        var lbs = (b.activeStockGrams / GRAMS_PER_LB).toFixed(2);
        var nameCell = b.url
          ? '<a href="' + escapeHtml(b.url) + '" target="_blank" rel="noopener"><strong>' + escapeHtml(b.name) + '</strong> &nearr;</a>'
          : '<strong>' + escapeHtml(b.name) + '</strong>';

        var rowClass = '';
        if (b.activeStockGrams <= 0) {
          rowClass = ' class="roast-admin-row--depleted"';
        } else if (b.activeStockGrams < GRAMS_PER_LB) {
          rowClass = ' class="roast-admin-row--under-1lb"';
        } else if (b.activeStockGrams < 2 * GRAMS_PER_LB) {
          rowClass = ' class="roast-admin-row--under-2lb"';
        }

        html += '<tr' + rowClass + '>' +
          '<td>' + nameCell + '</td>' +
          '<td>' + escapeHtml(b.supplier) + '</td>' +
          '<td class="mono"><strong>' + b.activeStockGrams.toLocaleString() + ' g</strong></td>' +
          '<td class="mono">' + lbs + ' lbs</td>' +
          '</tr>';
      });

      html += '</tbody></table>';
      beansTableWrap.innerHTML = html;

      var ths = beansTableWrap.querySelectorAll('th[data-sort-col]');
      ths.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (activeBeansSortCol === col) {
            activeBeansSortDir = activeBeansSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            activeBeansSortCol = col;
            activeBeansSortDir = (col === 'stockGrams' || col === 'stockLbs') ? 'desc' : 'asc';
          }
          renderActiveBeansTable();
        });
      });
    }

    function populateOrderBeanDropdown() {
      var prevVal = orderBeanSelect.value;
      var html = '<option value="__new__">+ New Green Bean</option>';
      state.greenBeans.forEach(function (b) {
        html += '<option value="' + escapeHtml(b.name) + '">' +
          escapeHtml(b.name) + ' (' + escapeHtml(b.supplier) + ')' +
          '</option>';
      });
      orderBeanSelect.innerHTML = html;
      if (prevVal && Array.from(orderBeanSelect.options).some(function (o) { return o.value === prevVal; })) {
        orderBeanSelect.value = prevVal;
      }
    }

    function startEditOrder(orderId) {
      var ord = state.greenBeanOrders.find(function (o) { return o.orderId === orderId; });
      editingOrderId = ord.orderId;
      orderFormTitle.textContent = 'Edit Green Bean Order (' + ord.orderId + ')';
      orderCancelEditBtn.style.display = 'inline-block';
      orderSubmitBtn.textContent = 'Update Order ' + ord.orderId;
      orderFeedback.style.display = 'none';

      if (Array.from(orderBeanSelect.options).some(function (opt) { return opt.value === ord.name; })) {
        orderBeanSelect.value = ord.name;
      } else {
        orderBeanSelect.value = '__new__';
      }
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
      var drawer = document.getElementById('order-entry-drawer');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      orderAdjustGrams.focus();
      renderGreenBeanOrdersTable();
    }

    function cancelEditOrder() {
      editingOrderId = null;
      orderFormTitle.textContent = 'Record Green Bean Order';
      orderCancelEditBtn.style.display = 'none';
      orderSubmitBtn.textContent = 'Save Green Bean Order';
      orderBeanSelect.value = '__new__';
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
      activeTab = targetTab;
      var tabBtns = tabsContainer.querySelectorAll('.roast-admin-tab-btn');
      tabBtns.forEach(function (b) {
        var isTarget = b.getAttribute('data-tab') === targetTab;
        if (isTarget) {
          b.classList.add('roast-admin-tab-btn--active');
          b.setAttribute('aria-selected', 'true');
        } else {
          b.classList.remove('roast-admin-tab-btn--active');
          b.setAttribute('aria-selected', 'false');
        }
      });

      var panels = ['beans', 'orders', 'roasts', 'packaging', 'totals'];
      panels.forEach(function (p) {
        var panelEl = document.getElementById('roast-admin-panel-' + p);
        if (p === targetTab) {
          panelEl.classList.add('roast-admin-panel--active');
        } else {
          panelEl.classList.remove('roast-admin-panel--active');
        }
      });

      if (highlightId) {
        currentSearch = highlightId;
        searchInput.value = highlightId;
        renderActiveBeansTable();
        renderGreenBeanOrdersTable();
        renderRoastLogsTable();
        renderBlendPackagingTable();

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
      var rows = sortGreenBeanOrders(
        state.greenBeanOrders.filter(function (o) {
          return matchesSearch([o.orderId, o.supplierOrderId, o.name, o.supplier, o.date]);
        }),
        gbOrdersSortCol,
        gbOrdersSortDir
      );

      if (rows.length === 0) {
        ordersTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No green bean orders recorded yet.</div>';
        return;
      }

      var html = '<table class="roast-admin-table">' +
        '<thead><tr>' +
        renderSortTh('Order ID', 'orderId', gbOrdersSortCol, gbOrdersSortDir, false) +
        renderSortTh('Date', 'date', gbOrdersSortCol, gbOrdersSortDir, false) +
        renderSortTh('Bean Name', 'name', gbOrdersSortCol, gbOrdersSortDir, false) +
        renderSortTh('Supplier', 'supplier', gbOrdersSortCol, gbOrdersSortDir, false) +
        renderSortTh('Supplier Order #', 'supplierOrderId', gbOrdersSortCol, gbOrdersSortDir, false) +
        renderSortTh('Cost', 'cost', gbOrdersSortCol, gbOrdersSortDir, true) +
        renderSortTh('Weight (lbs)', 'weightLbs', gbOrdersSortCol, gbOrdersSortDir, true) +
        renderSortTh('Adj (g)', 'adjustGrams', gbOrdersSortCol, gbOrdersSortDir, true) +
        renderSortTh('Total (g)', 'weightGrams', gbOrdersSortCol, gbOrdersSortDir, true) +
        renderSortTh('Available (g)', 'availableGrams', gbOrdersSortCol, gbOrdersSortDir, true) +
        '</tr></thead><tbody>';

      rows.forEach(function (o) {
        var orderGrams = o.weightGrams;
        var adjVal = Number(o.adjustGrams) || 0;
        var adjStr = (adjVal > 0 ? '+' : '') + adjVal + ' g';
        var availGrams = o.availableGrams !== undefined ? o.availableGrams : orderGrams;
        var availCell = availGrams > 0
          ? ('<strong>' + availGrams.toLocaleString() + ' g</strong>')
          : '<span style="color:#8a7060;">0 g (Depleted)</span>';
        var beanLink = o.url
          ? '<a href="' + escapeHtml(o.url) + '" target="_blank" rel="noopener"><strong>' + escapeHtml(o.name) + '</strong> &nearr;</a>'
          : '<strong>' + escapeHtml(o.name) + '</strong>';
        var rowStyle = editingOrderId === o.orderId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';

        html += '<tr data-row-id="' + escapeHtml(o.orderId) + '"' + rowStyle + '>' +
          '<td><button type="button" class="roast-admin-id-chip roast-admin-id-chip--clickable" data-edit-order="' + escapeHtml(o.orderId) + '" title="Edit order ' + escapeHtml(o.orderId) + '">' + escapeHtml(o.orderId) + '</button></td>' +
          '<td class="mono">' + escapeHtml(o.date) + '</td>' +
          '<td>' + beanLink + '</td>' +
          '<td>' + escapeHtml(o.supplier) + '</td>' +
          '<td class="mono">' + escapeHtml(o.supplierOrderId || '') + '</td>' +
          '<td class="mono" style="text-align: right;">$' + Number(o.cost).toFixed(2) + '</td>' +
          '<td class="mono" style="text-align: right;">' + Number(o.weightLbs).toFixed(2) + ' lbs</td>' +
          '<td class="mono" style="text-align: right;">' + adjStr + '</td>' +
          '<td class="mono" style="text-align: right;">' + orderGrams.toLocaleString() + ' g</td>' +
          '<td class="mono" style="text-align: right;">' + availCell + '</td>' +
          '</tr>';
      });

      html += '</tbody></table>';
      ordersTableWrap.innerHTML = html;

      var editOrderBtns = ordersTableWrap.querySelectorAll('[data-edit-order]');
      editOrderBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditOrder(btn.getAttribute('data-edit-order'));
        });
      });

      var ths = ordersTableWrap.querySelectorAll('th[data-sort-col]');
      ths.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (gbOrdersSortCol === col) {
            gbOrdersSortDir = gbOrdersSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            gbOrdersSortCol = col;
            var numCols = ['date', 'cost', 'weightLbs', 'adjustGrams', 'weightGrams', 'availableGrams'];
            gbOrdersSortDir = numCols.indexOf(col) !== -1 ? 'desc' : 'asc';
          }
          renderGreenBeanOrdersTable();
        });
      });
    }

    function buildGreenOrderOptionsHtml(selectedVal) {
      recomputeActiveBeanStocks(state, editingPkgId, editingRoastId);
      var html = '';
      var ordersReversed = state.greenBeanOrders.slice().reverse();
      ordersReversed.forEach(function (o) {
        var orderGrams = Number(o.weightGrams) || lbsToGrams(o.weightLbs);
        var availGrams = o.availableGrams !== undefined ? o.availableGrams : orderGrams;
        if (availGrams <= 0 && o.orderId !== selectedVal) {
          return;
        }
        var isSel = o.orderId === selectedVal ? ' selected' : '';
        html += '<option value="' + escapeHtml(o.orderId) + '" data-avail-grams="' + availGrams + '" data-bean-name="' + escapeHtml(o.name) + '"' + isSel + '>' +
          escapeHtml(o.orderId) + ' — ' + escapeHtml(o.name) + ' (Avail: ' + availGrams + 'g / ' + orderGrams + 'g, ' + escapeHtml(o.supplier) + ')' +
          '</option>';
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
      sel.addEventListener('change', function () {
        syncRoastComponentRowMax(row);
        updateRoastLossPreview();
      });
      gramsInput.addEventListener('input', updateRoastLossPreview);
      syncRoastComponentRowMax(row);

      var removeBtn = row.querySelector('.roast-admin-remove-btn');
      removeBtn.addEventListener('click', function () {
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
        if (matchByText) {
          roastLevelSelect.value = matchByText.value;
        }
      }
      roastEndGrams.value = rst.endWeightGrams;
      roastProfileUrl.value = rst.profileUrl;
      roastNotes.value = rst.notes || '';

      roastCompsContainer.innerHTML = '';
      var gComps = rst.greenBeanComponents || [];
      if (gComps.length === 0) {
        addRoastComponentRow();
      } else {
        gComps.forEach(function (gc) {
          addRoastComponentRow(gc.orderId, gc.weightGrams);
        });
      }
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
      var rows = state.roastLogs.filter(function (r) {
        var compText = (r.greenBeanComponents || []).map(function (c) { return c.orderId; }).join(' ');
        return matchesSearch([r.roastId, compText, r.beanName, r.date, r.notes]);
      }).slice().sort(function (a, b) {
        var dir = roastLogSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (roastLogSortCol === 'roastId') {
          cmp = (a.roastId || '').localeCompare(b.roastId || '');
        } else if (roastLogSortCol === 'date') {
          cmp = (a.date || '').localeCompare(b.date || '');
        } else if (roastLogSortCol === 'beanName') {
          cmp = (a.beanName || '').localeCompare(b.beanName || '');
        } else if (roastLogSortCol === 'greenGrams') {
          cmp = (Number(a.greenWeightGrams) || 0) - (Number(b.greenWeightGrams) || 0);
        } else if (roastLogSortCol === 'endGrams') {
          cmp = (Number(a.endWeightGrams) || 0) - (Number(b.endWeightGrams) || 0);
        } else if (roastLogSortCol === 'lossPct') {
          cmp = (Number(a.weightLossPct) || 0) - (Number(b.weightLossPct) || 0);
        } else if (roastLogSortCol === 'roastLevel') {
          cmp = (Number(a.roastLevel) || 0) - (Number(b.roastLevel) || 0);
        }
        if (cmp !== 0) return cmp * dir;
        return (b.date || '').localeCompare(a.date || '') || (b.roastId || '').localeCompare(a.roastId || '');
      });

      if (rows.length === 0) {
        roastsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No roast logs recorded yet.</div>';
        return;
      }

      var html = '<table class="roast-admin-table">' +
        '<thead><tr>' +
        renderSortTh('Roast ID', 'roastId', roastLogSortCol, roastLogSortDir, false) +
        renderSortTh('Date', 'date', roastLogSortCol, roastLogSortDir, false) +
        renderSortTh('Bean Name', 'beanName', roastLogSortCol, roastLogSortDir, false) +
        '<th>Green Orders</th>' +
        renderSortTh('Green (g)', 'greenGrams', roastLogSortCol, roastLogSortDir, true) +
        renderSortTh('End (g)', 'endGrams', roastLogSortCol, roastLogSortDir, true) +
        renderSortTh('Loss %', 'lossPct', roastLogSortCol, roastLogSortDir, true) +
        renderSortTh('Roast Level', 'roastLevel', roastLogSortCol, roastLogSortDir, false) +
        '<th>Profile</th>' +
        '<th>Notes</th>' +
        '<th>Actions</th>' +
        '</tr></thead><tbody>';

      rows.forEach(function (r) {
        var lvlObj = roastLevels[String(r.roastLevel)];
        var lvlLabel = lvlObj ? (lvlObj.specialty || lvlObj.name) : (r.roastLevel ? String(r.roastLevel) : '—');
        var profileCell = r.profileUrl
          ? '<a href="' + escapeHtml(r.profileUrl) + '" target="_blank" rel="noopener">Profile &nearr;</a>'
          : '';
        var gComps = r.greenBeanComponents || [];
        var gCompsHtml = gComps.map(function (c) {
          return '<a href="#tab=orders&id=' + encodeURIComponent(c.orderId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" data-nav-tab="orders" data-nav-id="' + escapeHtml(c.orderId) + '" title="View order ' + escapeHtml(c.orderId) + '">' + escapeHtml(c.orderId) + '</a>';
        }).join(' ');
        var rowStyle = editingRoastId === r.roastId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';

        html += '<tr data-row-id="' + escapeHtml(r.roastId) + '"' + rowStyle + '>' +
          '<td><span class="roast-admin-id-chip">' + escapeHtml(r.roastId) + '</span></td>' +
          '<td class="mono">' + escapeHtml(r.date) + '</td>' +
          '<td><strong>' + escapeHtml(r.beanName) + '</strong></td>' +
          '<td>' + (gCompsHtml || '—') + '</td>' +
          '<td class="mono">' + r.greenWeightGrams + ' g</td>' +
          '<td class="mono">' + r.endWeightGrams + ' g</td>' +
          '<td class="mono">' + Number(r.weightLossPct).toFixed(1) + '%</td>' +
          '<td>' + escapeHtml(lvlLabel) + '</td>' +
          '<td>' + profileCell + '</td>' +
          '<td>' + escapeHtml(r.notes || '') + '</td>' +
          '<td><button type="button" class="order-admin-btn-sm" data-edit-roast="' + escapeHtml(r.roastId) + '">Edit</button></td>' +
          '</tr>';
      });

      html += '</tbody></table>';
      roastsTableWrap.innerHTML = html;

      var navOrderLinks = roastsTableWrap.querySelectorAll('[data-nav-tab="orders"]');
      navOrderLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var oId = link.getAttribute('data-nav-id');
          switchToTab('orders', oId);
        });
      });

      var editRoastBtns = roastsTableWrap.querySelectorAll('[data-edit-roast]');
      editRoastBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditRoast(btn.getAttribute('data-edit-roast'));
        });
      });

      var ths = roastsTableWrap.querySelectorAll('th[data-sort-col]');
      ths.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (roastLogSortCol === col) {
            roastLogSortDir = roastLogSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            roastLogSortCol = col;
            var numCols = ['date', 'greenGrams', 'endGrams', 'lossPct', 'roastLevel'];
            roastLogSortDir = numCols.indexOf(col) !== -1 ? 'desc' : 'asc';
          }
          renderRoastLogsTable();
        });
      });
    }

    function buildRoastOptionsHtml(selectedVal) {
      recomputeActiveBeanStocks(state, editingPkgId);
      var html = '';
      var roastsSorted = state.roastLogs.slice().sort(function (a, b) {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        return b.roastId.localeCompare(a.roastId);
      });
      roastsSorted.forEach(function (r) {
        if (r.availableGrams <= 0 && r.roastId !== selectedVal) {
          return;
        }
        var lvlObj = roastLevels[String(r.roastLevel)];
        var specialtyName = lvlObj ? (lvlObj.specialty || lvlObj.name) : (r.roastLevel ? String(r.roastLevel) : '');
        var lvlLabel = specialtyName ? (' · ' + specialtyName) : '';
        var isSel = r.roastId === selectedVal ? ' selected' : '';
        html += '<option value="' + escapeHtml(r.roastId) + '" data-avail-grams="' + r.availableGrams + '"' + isSel + '>' +
          escapeHtml(r.roastId) + ' — ' + escapeHtml(r.beanName) + lvlLabel + ' (Avail: ' + r.availableGrams + 'g / ' + r.endWeightGrams + 'g, ' + escapeHtml(r.date) + ')' +
          '</option>';
      });
      return html;
    }

    function getSelectedBagSizeGrams() {
      if (!pkgBagSize) return 0;
      var opt = pkgBagSize.options[pkgBagSize.selectedIndex];
      if (opt && opt.getAttribute('data-weight-grams')) {
        return Number(opt.getAttribute('data-weight-grams')) || 0;
      }
      return calculateBagSizeGrams(pkgBagSize.value, bagSizes);
    }

    function updatePackagingPreview() {
      if (!pkgBlendPreview || !pkgBagSize) return;
      var totalBagGrams = getSelectedBagSizeGrams();
      var sumGrams = 0;
      var sumPct = 0;
      var rows = pkgCompsContainer.querySelectorAll('.roast-admin-component-row');
      rows.forEach(function (row) {
        var g = Number(row.querySelector('.pkg-comp-grams').value) || 0;
        var p = Number(row.querySelector('.pkg-comp-pct').value) || 0;
        sumGrams += g;
        sumPct += p;
      });

      var targetText = totalBagGrams > 0
        ? (totalBagGrams + ' g (' + escapeHtml(pkgBagSize.value) + ')')
        : 'Custom / Loose';

      var pctText = totalBagGrams > 0
        ? (sumPct.toFixed(1) + '%')
        : '—';

      var statusColor = '';
      if (totalBagGrams > 0) {
        if (sumGrams === totalBagGrams) {
          statusColor = 'color: #27ae60;';
        } else if (sumGrams > totalBagGrams) {
          statusColor = 'color: #c0392b;';
        }
      }

      pkgBlendPreview.innerHTML =
        '<span>Total Weight: <strong style="' + statusColor + '">' + sumGrams.toLocaleString() + ' g</strong></span>' +
        '<span>Total Blend: <strong style="' + statusColor + '">' + pctText + '</strong></span>' +
        '<span>Target: <strong>' + targetText + '</strong></span>';
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
        '<input type="number" class="roast-admin-input pkg-comp-pct" step="0.5" min="0" max="100" placeholder="%" value="' + defaultPct + '" title="Blend percentage (%)">' +
        '<input type="number" class="roast-admin-input pkg-comp-grams" step="1" min="1" placeholder="Grams (g)" value="' + (defaultGrams || '') + '" required>' +
        '<button type="button" class="roast-admin-remove-btn" title="Remove component">&times;</button>';

      var sel = row.querySelector('.pkg-comp-roast');
      var pctInput = row.querySelector('.pkg-comp-pct');
      var gramsInput = row.querySelector('.pkg-comp-grams');

      sel.addEventListener('change', function () {
        syncComponentRowMax(row);
      });
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

      var removeBtn = row.querySelector('.roast-admin-remove-btn');
      removeBtn.addEventListener('click', function () {
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
      var ordersReversed = state.customerOrders.slice().reverse();
      var activeOpts = '';
      var completedOpts = '';

      ordersReversed.forEach(function (ord) {
        var status = String(ord.status || 'Received').trim();
        var isCompleted = status.toLowerCase() === 'delivered' || status.toLowerCase() === 'cancelled';
        var lineItems = parseOrderLineItems(ord.items);

        if (lineItems.length === 0) {
          var optVal = escapeHtml(ord.orderId) + '||';
          var optHtml = '<option value="' + optVal + '" data-order-id="' + escapeHtml(ord.orderId) + '" data-product="" data-bag-size="">' +
            '#' + escapeHtml(ord.orderId) + ' — ' + escapeHtml(ord.name) + ' [' + escapeHtml(status) + ']' +
            '</option>';
          if (isCompleted) completedOpts += optHtml;
          else activeOpts += optHtml;
        } else {
          lineItems.forEach(function (item, idx) {
            var optVal = escapeHtml(ord.orderId) + '|' + idx;
            var optHtml = '<option value="' + optVal + '" data-order-id="' + escapeHtml(ord.orderId) + '" data-product="' + escapeHtml(item.product) + '" data-bag-size="' + escapeHtml(item.bagSize) + '">' +
              '#' + escapeHtml(ord.orderId) + ' — ' + escapeHtml(ord.name) + ': ' + escapeHtml(item.label) + ' [' + escapeHtml(status) + ']' +
              '</option>';
            if (isCompleted) completedOpts += optHtml;
            else activeOpts += optHtml;
          });
        }
      });

      if (activeOpts) {
        html += '<optgroup label="Active Customer Orders">' + activeOpts + '</optgroup>';
      }
      if (completedOpts) {
        html += '<optgroup label="Delivered / Cancelled Orders">' + completedOpts + '</optgroup>';
      }
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
      if (comps.length === 0) {
        addPkgComponentRow();
      } else {
        comps.forEach(function (c) {
          addPkgComponentRow(c.roastId, c.weightGrams);
        });
      }
      setDrawerState('pkg-entry-drawer', true);
      renderBlendPackagingTable();
      updatePackagingPreview();
    }

    function copyPackagingLog(logId) {
      var pkg = state.blendPackagingLogs.find(function (p) { return p.logId === logId; });
      if (!pkg) return;
      editingPkgId = null;
      pkgFormTitle.textContent = 'Record Master Blend & Packaging (Copy of ' + pkg.logId + ')';
      pkgCancelEditBtn.textContent = 'Cancel';
      pkgCancelEditBtn.style.display = 'inline-block';
      pkgSubmitBtn.textContent = 'Save Blend / Packaging Log';
      pkgFeedback.style.display = 'none';

      pkgDate.value = todayIso();
      pkgPurpose.value = pkg.purpose || 'Order';
      syncPkgPurposeVisibility();
      pkgOrderSelect.value = '';
      pkgOrderId.value = '';
      pkgProduct.value = pkg.product;
      pkgBagSize.value = pkg.bagSize;
      pkgNotes.value = '';

      pkgCompsContainer.innerHTML = '';
      var comps = pkg.roastComponents || [];
      if (comps.length === 0) {
        addPkgComponentRow();
      } else {
        comps.forEach(function (c) {
          addPkgComponentRow(c.roastId, c.weightGrams);
        });
      }
      setDrawerState('pkg-entry-drawer', true);
      renderBlendPackagingTable();
      updatePackagingPreview();

      if (pkgPurpose.value === 'Order') {
        pkgOrderSelect.focus();
      } else {
        pkgProduct.focus();
      }
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
      pkgBagSize.value = '12oz';
      pkgCompsContainer.innerHTML = '';
      addPkgComponentRow();
      setDrawerState('pkg-entry-drawer', false);
      renderBlendPackagingTable();
      updatePackagingPreview();
    }

    function renderBlendPackagingTable() {
      var rows = state.blendPackagingLogs.filter(function (p) {
        if (currentPkgFilter === 'orders') {
          if (p.purpose !== 'Order' && !p.orderId) return false;
        } else if (currentPkgFilter === 'non-orders') {
          if (p.purpose === 'Order' || p.orderId) return false;
        }
        var compText = (p.roastComponents || []).map(function (c) { return c.roastId; }).join(' ');
        return matchesSearch([p.logId, p.date, p.purpose, p.orderId, p.product, compText, p.bagSize, p.notes]);
      }).slice().sort(function (a, b) {
        var dir = pkgLogSortDir === 'asc' ? 1 : -1;
        var cmp = 0;
        if (pkgLogSortCol === 'logId') {
          cmp = (a.logId || '').localeCompare(b.logId || '');
        } else if (pkgLogSortCol === 'date') {
          cmp = (a.date || '').localeCompare(b.date || '');
        } else if (pkgLogSortCol === 'purpose') {
          cmp = (a.purpose || '').localeCompare(b.purpose || '');
        } else if (pkgLogSortCol === 'orderId') {
          cmp = (a.orderId || '').localeCompare(b.orderId || '');
        } else if (pkgLogSortCol === 'product') {
          cmp = (a.product || '').localeCompare(b.product || '');
        } else if (pkgLogSortCol === 'bagSize') {
          cmp = (a.bagSize || '').localeCompare(b.bagSize || '');
        } else if (pkgLogSortCol === 'weightGrams') {
          var aGrams = (a.roastComponents || []).reduce(function (sum, c) { return sum + (Number(c.weightGrams) || 0); }, 0);
          var bGrams = (b.roastComponents || []).reduce(function (sum, c) { return sum + (Number(c.weightGrams) || 0); }, 0);
          cmp = aGrams - bGrams;
        }
        if (cmp !== 0) return cmp * dir;
        return (b.date || '').localeCompare(a.date || '') || (b.logId || '').localeCompare(a.logId || '');
      });

      if (rows.length === 0) {
        packagingTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No master blend or packaging logs recorded yet.</div>';
        return;
      }

      var html = '<table class="roast-admin-table">' +
        '<thead><tr>' +
        renderSortTh('Log ID', 'logId', pkgLogSortCol, pkgLogSortDir, false) +
        renderSortTh('Date', 'date', pkgLogSortCol, pkgLogSortDir, false) +
        renderSortTh('Purpose', 'purpose', pkgLogSortCol, pkgLogSortDir, false) +
        renderSortTh('Order ID', 'orderId', pkgLogSortCol, pkgLogSortDir, false) +
        renderSortTh('Product / Label', 'product', pkgLogSortCol, pkgLogSortDir, false) +
        '<th>Roast IDs</th>' +
        renderSortTh('Weight (g)', 'weightGrams', pkgLogSortCol, pkgLogSortDir, true) +
        renderSortTh('Bag Size', 'bagSize', pkgLogSortCol, pkgLogSortDir, false) +
        '<th>Notes</th>' +
        '<th>Actions</th>' +
        '</tr></thead><tbody>';

      rows.forEach(function (p) {
        var comps = p.roastComponents || [];
        var compsHtml = comps.map(function (c) {
          return '<a href="#tab=roasts&id=' + encodeURIComponent(c.roastId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" data-nav-tab="roasts" data-nav-id="' + escapeHtml(c.roastId) + '" title="View roast ' + escapeHtml(c.roastId) + '">' + escapeHtml(c.roastId) + '</a>';
        }).join(' ');
        var totalGrams = comps.reduce(function (acc, c) { return acc + (Number(c.weightGrams) || 0); }, 0);
        var orderIdCell = '—';
        if (p.orderId) {
          orderIdCell = '<a href="/order/admin/?search=' + encodeURIComponent(p.orderId) + '" class="roast-admin-id-chip roast-admin-id-chip--clickable" target="_blank" rel="noopener" title="Open customer order #' + escapeHtml(p.orderId) + ' in Order Manager">#' + escapeHtml(p.orderId) + ' &nearr;</a>';
        }
        var rowStyle = editingPkgId === p.logId ? ' style="background: rgba(212, 163, 89, 0.14);"' : '';

        html += '<tr data-row-id="' + escapeHtml(p.logId) + '"' + rowStyle + '>' +
          '<td><span class="roast-admin-id-chip">' + escapeHtml(p.logId) + '</span></td>' +
          '<td class="mono">' + escapeHtml(p.date) + '</td>' +
          '<td>' + escapeHtml(p.purpose) + '</td>' +
          '<td>' + orderIdCell + '</td>' +
          '<td><strong>' + escapeHtml(p.product) + '</strong></td>' +
          '<td>' + compsHtml + '</td>' +
          '<td class="mono"><strong>' + totalGrams.toLocaleString() + ' g</strong></td>' +
          '<td>' + escapeHtml(p.bagSize) + '</td>' +
          '<td>' + escapeHtml(p.notes || '') + '</td>' +
          '<td style="white-space: nowrap;">' +
          '<button type="button" class="order-admin-btn-sm" data-edit-pkg="' + escapeHtml(p.logId) + '">Edit</button> ' +
          '<button type="button" class="order-admin-btn-sm" data-copy-pkg="' + escapeHtml(p.logId) + '" title="Copy blend and bag size to new packaging log">Copy</button>' +
          '</td>' +
          '</tr>';
      });

      html += '</tbody></table>';
      packagingTableWrap.innerHTML = html;

      var navRoastLinks = packagingTableWrap.querySelectorAll('[data-nav-tab="roasts"]');
      navRoastLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var rId = link.getAttribute('data-nav-id');
          switchToTab('roasts', rId);
        });
      });

      var editPkgBtns = packagingTableWrap.querySelectorAll('[data-edit-pkg]');
      editPkgBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          startEditPkg(btn.getAttribute('data-edit-pkg'));
        });
      });

      var copyPkgBtns = packagingTableWrap.querySelectorAll('[data-copy-pkg]');
      copyPkgBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          copyPackagingLog(btn.getAttribute('data-copy-pkg'));
        });
      });

      var ths = packagingTableWrap.querySelectorAll('th[data-sort-col]');
      ths.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (pkgLogSortCol === col) {
            pkgLogSortDir = pkgLogSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            pkgLogSortCol = col;
            var numCols = ['date', 'weightGrams'];
            pkgLogSortDir = numCols.indexOf(col) !== -1 ? 'desc' : 'asc';
          }
          renderBlendPackagingTable();
        });
      });
    }

    function populateTotalsFilters() {
      var yearsSet = {};
      state.greenBeanOrders.forEach(function (o) { yearsSet[extractYearMonth(o.date).year] = true; });
      state.roastLogs.forEach(function (r) { yearsSet[extractYearMonth(r.date).year] = true; });
      state.blendPackagingLogs.forEach(function (p) { yearsSet[extractYearMonth(p.date).year] = true; });

      var years = Object.keys(yearsSet).filter(function (y) { return y && y !== 'Unknown'; }).sort().reverse();
      var prevYear = totalsFilterYear.value || 'all';
      var yearHtml = '<option value="all">All Years</option>';
      years.forEach(function (y) {
        yearHtml += '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>';
      });
      totalsFilterYear.innerHTML = yearHtml;
      if (years.indexOf(prevYear) !== -1) {
        totalsFilterYear.value = prevYear;
      }

      var prevBean = totalsFilterBean.value || 'all';
      var beanHtml = '<option value="all">All Beans</option>';
      state.greenBeans.forEach(function (b) {
        beanHtml += '<option value="' + escapeHtml(b.name) + '">' + escapeHtml(b.name) + '</option>';
      });
      totalsFilterBean.innerHTML = beanHtml;
      if (state.greenBeans.some(function (b) { return b.name === prevBean; })) {
        totalsFilterBean.value = prevBean;
      }
    }

    function refreshTotalsGroupPills() {
      if (!roastGroupPillsWrap) return;
      var dims = ['month', 'year', 'bean', 'supplier'];
      var currentActive = [];
      var activePills = roastGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active');
      activePills.forEach(function (p) {
        var g = p.getAttribute('data-group');
        if (dims.indexOf(g) !== -1) currentActive.push(g);
      });
      if (currentActive.length === 0) currentActive = ['month'];

      var html = '';
      dims.forEach(function (d) {
        var isActive = currentActive.indexOf(d) !== -1;
        html += '<button type="button" class="order-admin-filter-pill' + (isActive ? ' order-admin-filter-pill--active' : '') + '" data-group="' + d + '">' + escapeHtml(ROAST_DIMENSION_LABELS[d] || d) + '</button>';
      });
      roastGroupPillsWrap.innerHTML = html;

      var pills = roastGroupPillsWrap.querySelectorAll('.order-admin-filter-pill');
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pill.classList.toggle('order-admin-filter-pill--active');
          var active = roastGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active');
          if (active.length === 0) {
            pill.classList.add('order-admin-filter-pill--active');
          }
          renderTotalsTab();
        });
      });
    }

    function renderTotalsTab() {
      var groupBys = [];
      if (roastGroupPillsWrap) {
        var activePills = roastGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active');
        activePills.forEach(function (p) {
          var g = p.getAttribute('data-group');
          if (g) groupBys.push(g);
        });
      } else if (totalsGroupBy) {
        groupBys = [totalsGroupBy.value];
      }
      if (groupBys.length === 0) {
        groupBys = ['month'];
      }

      var result = computeTotals(state, {
        mode: currentTotalsMode,
        groupBy: groupBys,
        year: totalsFilterYear.value,
        month: totalsFilterMonth.value,
        beanName: totalsFilterBean.value,
        purpose: totalsFilterPurpose ? totalsFilterPurpose.value : 'all'
      });

      var s = result.summary;
      var roastedLbs = (s.greenWeightRoastedGrams / GRAMS_PER_LB).toFixed(2);
      var endLbs = (s.endWeightGrams / GRAMS_PER_LB).toFixed(2);
      var packagedLbs = (s.packagedGramsUsed / GRAMS_PER_LB).toFixed(2);

      if (currentTotalsMode === 'roasting') {
        totalsKpisWrap.innerHTML =
          '<div class="roast-admin-kpi-box">' +
          '<div class="roast-admin-kpi-label">Roasting Batches</div>' +
          '<div class="roast-admin-kpi-value">' + s.roastCount + ' Roasts</div>' +
          '<div class="roast-admin-kpi-sub">' + roastedLbs + ' lbs green input</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-box">' +
          '<div class="roast-admin-kpi-label">Roasted Output</div>' +
          '<div class="roast-admin-kpi-value">' + endLbs + ' lbs</div>' +
          '<div class="roast-admin-kpi-sub">Avg Weight Loss: ' + s.avgWeightLossPct.toFixed(1) + '%</div>' +
          '</div>';

        if (result.rows.length === 0) {
          totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No roast records match the selected period/bean filters.</div>';
          return;
        }

        var html = '<table class="roast-admin-table">' +
          '<thead><tr>';
        result.groupBys.forEach(function (dim) {
          html += renderSortTh(ROAST_DIMENSION_LABELS[dim] || dim, 'dim:' + dim, roastTotalsSortCol, roastTotalsSortDir, false);
        });
        html += renderSortTh('Roasts', 'roasts', roastTotalsSortCol, roastTotalsSortDir, true) +
          renderSortTh('Green Roasted', 'greenWeight', roastTotalsSortCol, roastTotalsSortDir, true) +
          renderSortTh('End Weight', 'endWeight', roastTotalsSortCol, roastTotalsSortDir, true) +
          renderSortTh('Loss %', 'lossPct', roastTotalsSortCol, roastTotalsSortDir, true) +
          '</tr></thead><tbody>';

        var displayRows = sortTotalsRows(result.rows, roastTotalsSortCol, roastTotalsSortDir);
        displayRows.forEach(function (r) {
          var greenLbs = (r.greenWeightRoastedGrams / GRAMS_PER_LB).toFixed(2);
          var endLbs = (r.endWeightGrams / GRAMS_PER_LB).toFixed(2);
          html += '<tr>';
          result.groupBys.forEach(function (dim) {
            var cellVal = r.dimValues && r.dimValues[dim] ? r.dimValues[dim] : r.label;
            html += '<td><strong>' + escapeHtml(cellVal) + '</strong></td>';
          });
          html += '<td class="mono" style="text-align: right;">' + r.roastCount + '</td>' +
            '<td class="mono" style="text-align: right;">' + greenLbs + ' lbs</td>' +
            '<td class="mono" style="text-align: right;">' + endLbs + ' lbs</td>' +
            '<td class="mono" style="text-align: right;">' + r.avgWeightLossPct.toFixed(1) + '%</td>' +
            '</tr>';
        });

        html += '</tbody><tfoot>' +
          '<tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + result.groupBys.length + '">Total</td>' +
          '<td class="mono" style="text-align: right;">' + s.roastCount + '</td>' +
          '<td class="mono" style="text-align: right;">' + roastedLbs + ' lbs</td>' +
          '<td class="mono" style="text-align: right;">' + endLbs + ' lbs</td>' +
          '<td class="mono" style="text-align: right;">' + s.avgWeightLossPct.toFixed(1) + '%</td>' +
          '</tr></tfoot></table>';
        totalsTableWrap.innerHTML = html;

        var thsRoast = totalsTableWrap.querySelectorAll('th[data-sort-col]');
        thsRoast.forEach(function (th) {
          th.addEventListener('click', function () {
            var col = th.getAttribute('data-sort-col');
            if (roastTotalsSortCol === col) {
              roastTotalsSortDir = roastTotalsSortDir === 'asc' ? 'desc' : 'asc';
            } else {
              roastTotalsSortCol = col;
              roastTotalsSortDir = (col === 'roasts' || col === 'greenWeight' || col === 'endWeight' || col === 'lossPct') ? 'desc' : 'asc';
            }
            renderTotalsTab();
          });
        });

      } else if (currentTotalsMode === 'orders') {
        totalsKpisWrap.innerHTML =
          '<div class="roast-admin-kpi-box">' +
          '<div class="roast-admin-kpi-label">Green Bean Orders</div>' +
          '<div class="roast-admin-kpi-value">' + s.ordersCount + ' Orders</div>' +
          '<div class="roast-admin-kpi-sub">' + s.orderedWeightLbs.toFixed(2) + ' lbs total</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-box">' +
          '<div class="roast-admin-kpi-label">Purchasing Spend</div>' +
          '<div class="roast-admin-kpi-value">$' + s.totalSpend.toFixed(2) + '</div>' +
          '<div class="roast-admin-kpi-sub">' + (s.orderedWeightLbs > 0 ? ('$' + (s.totalSpend / s.orderedWeightLbs).toFixed(2) + ' / lb avg') : '$0.00 / lb') + '</div>' +
          '</div>';

        if (result.rows.length === 0) {
          totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No green bean order records match the selected period/bean filters.</div>';
          return;
        }

        var html = '<table class="roast-admin-table">' +
          '<thead><tr>';
        result.groupBys.forEach(function (dim) {
          html += renderSortTh(ROAST_DIMENSION_LABELS[dim] || dim, 'dim:' + dim, gbOrdersTotalsSortCol, gbOrdersTotalsSortDir, false);
        });
        html += renderSortTh('Orders', 'orders', gbOrdersTotalsSortCol, gbOrdersTotalsSortDir, true) +
          renderSortTh('Ordered Weight', 'orderedWeight', gbOrdersTotalsSortCol, gbOrdersTotalsSortDir, true) +
          renderSortTh('Spend ($)', 'spend', gbOrdersTotalsSortCol, gbOrdersTotalsSortDir, true) +
          '</tr></thead><tbody>';

        var displayRows = sortTotalsRows(result.rows, gbOrdersTotalsSortCol, gbOrdersTotalsSortDir);
        displayRows.forEach(function (r) {
          html += '<tr>';
          result.groupBys.forEach(function (dim) {
            var cellVal = r.dimValues && r.dimValues[dim] ? r.dimValues[dim] : r.label;
            html += '<td><strong>' + escapeHtml(cellVal) + '</strong></td>';
          });
          html += '<td class="mono" style="text-align: right;">' + r.ordersCount + '</td>' +
            '<td class="mono" style="text-align: right;">' + r.orderedWeightLbs.toFixed(2) + ' lbs</td>' +
            '<td class="mono" style="text-align: right;">$' + r.totalSpend.toFixed(2) + '</td>' +
            '</tr>';
        });

        html += '</tbody><tfoot>' +
          '<tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
          '<td colspan="' + result.groupBys.length + '">Total</td>' +
          '<td class="mono" style="text-align: right;">' + s.ordersCount + '</td>' +
          '<td class="mono" style="text-align: right;">' + s.orderedWeightLbs.toFixed(2) + ' lbs</td>' +
          '<td class="mono" style="text-align: right;">$' + s.totalSpend.toFixed(2) + '</td>' +
          '</tr></tfoot></table>';
        totalsTableWrap.innerHTML = html;

        var thsOrders = totalsTableWrap.querySelectorAll('th[data-sort-col]');
        thsOrders.forEach(function (th) {
          th.addEventListener('click', function () {
            var col = th.getAttribute('data-sort-col');
            if (gbOrdersTotalsSortCol === col) {
              gbOrdersTotalsSortDir = gbOrdersTotalsSortDir === 'asc' ? 'desc' : 'asc';
            } else {
              gbOrdersTotalsSortCol = col;
              gbOrdersTotalsSortDir = (col === 'orders' || col === 'orderedWeight' || col === 'spend') ? 'desc' : 'asc';
            }
            renderTotalsTab();
          });
        });
      }
    }

    function updateOrderWeightPreview() {
      var lbs = Number(orderWeightLbs.value) || 0;
      var baseGrams = lbsToGrams(lbs);
      var adjGrams = Number(orderAdjustGrams.value) || 0;
      var totalGrams = baseGrams + adjGrams;
      orderWeightPreview.innerHTML =
        '<span>Base: <strong>' + baseGrams.toLocaleString() + ' g</strong> (' + lbs.toFixed(2) + ' lbs)</span>' +
        '<span>Total Weight (g): <strong>' + totalGrams.toLocaleString() + ' g</strong></span>';
    }

    function updateRoastLossPreview() {
      var greenG = 0;
      var compInputs = roastCompsContainer.querySelectorAll('.roast-comp-grams');
      compInputs.forEach(function (inp) {
        greenG += Number(inp.value) || 0;
      });
      var endG = Number(roastEndGrams.value) || 0;
      var loss = computeWeightLossPct(greenG, endG);
      roastLossPreview.innerHTML =
        '<span>Green Weight: <strong>' + greenG.toLocaleString() + ' g</strong></span>' +
        '<span>Weight Loss: <strong>' + loss.toFixed(1) + '%</strong></span>';
    }

    function renderAll() {
      renderStatsBar();
      populateOrderBeanDropdown();
      refreshRoastComponentDropdowns();
      populateCustomerOrderDropdown();
      refreshPkgComponentDropdowns();
      populateTotalsFilters();
      refreshTotalsGroupPills();
      renderActiveBeansTable();
      renderGreenBeanOrdersTable();
      renderRoastLogsTable();
      renderBlendPackagingTable();
      renderTotalsTab();
      updatePackagingPreview();
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
      statsContainer.innerHTML = '<span class="order-admin-stat-pill" style="background: rgba(192, 57, 43, 0.12); color: #c0392b; border-color: rgba(192, 57, 43, 0.35);">API Error: ' + escapeHtml(errMsg) + '</span>';
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
              state.greenBeans = data.greenBeans || [];
              state.greenBeanOrders = data.greenBeanOrders || [];
              state.roastLogs = data.roastLogs || [];
              state.blendPackagingLogs = data.blendPackagingLogs || [];
              recomputeActiveBeanStocks(state);
              callback(null, state);
            }
          })
          .catch(function (err) {
            var msg = "Could not connect to live inventory API (" + (err.message || 'Network error') + ").";
            showApiError(msg);
            callback(msg);
          });
      });
    }

    function submitAction(payload, callback) {
      var currentKey = getStoredKey();
      resolveAdminToken(currentKey).then(function (token) {
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

    // Event Listeners
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
          orderFeedback.textContent = isEditingOrder
            ? ('✓ Updated Order ' + savedId)
            : ('✓ Saved Order ' + savedId);
          orderFeedback.style.display = 'block';
        }
      });
    });

    roastAddCompBtn.addEventListener('click', function () {
      addRoastComponentRow();
    });
    roastEndGrams.addEventListener('input', updateRoastLossPreview);
    roastCancelEditBtn.addEventListener('click', cancelEditRoast);

    roastForm.addEventListener('submit', function (e) {
      e.preventDefault();
      recomputeActiveBeanStocks(state, editingPkgId, editingRoastId);

      var compRows = roastCompsContainer.querySelectorAll('.roast-admin-component-row');
      var greenComponents = [];
      var requestedByOrder = {};
      var beanNamesUsed = [];
      var totalGreenGrams = 0;

      compRows.forEach(function (r) {
        var oId = r.querySelector('.roast-comp-order').value;
        var gVal = Number(r.querySelector('.roast-comp-grams').value);
        greenComponents.push({ orderId: oId, weightGrams: gVal });
        requestedByOrder[oId] = (requestedByOrder[oId] || 0) + gVal;
        totalGreenGrams += gVal;
        var ordObj = state.greenBeanOrders.find(function (o) { return o.orderId === oId; });
        if (ordObj && beanNamesUsed.indexOf(ordObj.name) === -1) {
          beanNamesUsed.push(ordObj.name);
        }
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
          roastFeedback.textContent = isEditingRoast
            ? ('✓ Updated Roast ' + savedRoastId)
            : ('✓ Saved Roast ' + savedRoastId);
          roastFeedback.style.display = 'block';
        }
      });
    });

    pkgPurpose.addEventListener('change', syncPkgPurposeVisibility);
    syncPkgPurposeVisibility();

    function syncPkgBagSizeChange() {
      var total = getSelectedBagSizeGrams();
      var rows = pkgCompsContainer.querySelectorAll('.roast-admin-component-row');
      rows.forEach(function (row) {
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
      if (ordId) {
        pkgOrderId.value = ordId;
      }
      if (prod) {
        pkgProduct.value = prod;
      }
      if (bagSz && Array.from(pkgBagSize.options).some(function (o) { return o.value === bagSz; })) {
        pkgBagSize.value = bagSz;
        syncPkgBagSizeChange();
      }
    });

    pkgAddCompBtn.addEventListener('click', function () {
      addPkgComponentRow();
    });
    pkgCancelEditBtn.addEventListener('click', cancelEditPkg);

    pkgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      recomputeActiveBeanStocks(state, editingPkgId);

      var compRows = pkgCompsContainer.querySelectorAll('.roast-admin-component-row');
      var components = [];
      var requestedByRoast = {};
      compRows.forEach(function (r) {
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
          pkgFeedback.textContent = isEditingPkg
            ? ('✓ Updated Packaging Log ' + savedLogId)
            : ('✓ Saved Packaging Log ' + savedLogId);
          pkgFeedback.style.display = 'block';
        }
      });
    });

    showDepletedCheckbox.addEventListener('change', renderActiveBeansTable);

    if (roastTotalsModePills) {
      var mPills = roastTotalsModePills.querySelectorAll('.order-admin-filter-pill');
      mPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          mPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          pill.classList.add('order-admin-filter-pill--active');
          currentTotalsMode = pill.getAttribute('data-totals-mode') || 'roasting';
          refreshTotalsGroupPills();
          renderTotalsTab();
        });
      });
    }

    refreshTotalsGroupPills();

    if (totalsGroupBy) totalsGroupBy.addEventListener('change', renderTotalsTab);
    totalsFilterYear.addEventListener('change', renderTotalsTab);
    totalsFilterMonth.addEventListener('change', renderTotalsTab);
    totalsFilterBean.addEventListener('change', renderTotalsTab);
    if (totalsFilterPurpose) totalsFilterPurpose.addEventListener('change', renderTotalsTab);

    var tabBtns = tabsContainer.querySelectorAll('.roast-admin-tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-tab');
        switchToTab(t);
      });
    });

    var drawerToggles = document.querySelectorAll('.roast-admin-toggle-drawer-btn');
    drawerToggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-drawer-target');
        var drawer = document.getElementById(targetId);
        if (!drawer) return;
        var isCurrentlyOpen = drawer.style.display !== 'none';
        if (isCurrentlyOpen) {
          if (targetId === 'order-entry-drawer' && editingOrderId) {
            cancelEditOrder();
          } else if (targetId === 'roast-entry-drawer' && editingRoastId) {
            cancelEditRoast();
          } else if (targetId === 'pkg-entry-drawer' && editingPkgId) {
            cancelEditPkg();
          } else {
            setDrawerState(targetId, false);
          }
        } else {
          setDrawerState(targetId, true);
          if (targetId === 'order-entry-drawer') {
            orderBeanSelect.focus();
          } else if (targetId === 'roast-entry-drawer') {
            roastDate.focus();
          } else if (targetId === 'pkg-entry-drawer') {
            pkgDate.focus();
          }
        }
      });
    });

    var pkgFilterPillsWrap = document.getElementById('pkg-filter-pills');
    if (pkgFilterPillsWrap) {
      var pkgPills = pkgFilterPillsWrap.querySelectorAll('.order-admin-filter-pill');
      pkgPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pkgPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          pill.classList.add('order-admin-filter-pill--active');
          currentPkgFilter = pill.getAttribute('data-pkg-filter') || 'all';
          renderBlendPackagingTable();
        });
      });
    }

    searchInput.addEventListener('input', function () {
      currentSearch = searchInput.value.trim();
      renderActiveBeansTable();
      renderGreenBeanOrdersTable();
      renderRoastLogsTable();
      renderBlendPackagingTable();
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
          if (!err) {
            renderAll();
          }
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
        if (!err) {
          renderAll();
        }
      });
    });

    logoutBtn.addEventListener('click', function () {
      clearStoredKey();
      showGate();
    });

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

    var existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      showPortalDashboard();
    } else {
      showPortalGate();
    }
  }

  return {
    initAdminRoasts: initAdminRoasts,
    initAdminPortal: initAdminPortal,
    lbsToGrams: lbsToGrams,
    computeWeightLossPct: computeWeightLossPct,
    generateNextInternalId: generateNextInternalId,
    generateGreenBeanOrderId: generateGreenBeanOrderId,
    generateRoastLogId: generateRoastLogId,
    generatePackagingLogId: generatePackagingLogId,
    makeSemanticCode: makeSemanticCode,
    recomputeActiveBeanStocks: recomputeActiveBeanStocks,
    computeTotals: computeTotals,
    sortGreenBeanOrders: sortGreenBeanOrders,
    sortTotalsRows: sortTotalsRows,
    calculateBagSizeGrams: calculateBagSizeGrams,
    calculateGramsFromPercentage: calculateGramsFromPercentage,
    calculatePercentageFromGrams: calculatePercentageFromGrams,
    parseOrderLineItems: parseOrderLineItems,
    computeBrowserHash: computeBrowserHash,
    ADMIN_PASSWORD_HASH: ADMIN_PASSWORD_HASH,
    DEFAULT_SALT: DEFAULT_SALT,
    CANONICAL_MOCK_DATA: CANONICAL_MOCK_DATA
  };
});
