/**
 * Yellow Wing Roasters - Owner Order Dashboard Controller (/order/admin/)
 * Provides secure owner authentication, live queue management, filtering & search,
 * and roaster status updates with automatic customer email dispatch.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminOrders = exp.initAdminOrders;
    root.filterOrders = exp.filterOrders;
    root.computeStats = exp.computeStats;
    root.getStatusBadgeClass = exp.getStatusBadgeClass;
    root.computeBrowserHash = exp.computeBrowserHash;
    root.extractOrderDate = exp.extractOrderDate;
    root.parseOrderLineItems = exp.parseOrderLineItems;
    root.parseCurrency = exp.parseCurrency;
    root.bagSizeToLbs = exp.bagSizeToLbs;
    root.formatSizeCounts = exp.formatSizeCounts;
    root.computeOrderTotals = exp.computeOrderTotals;
    root.DEFAULT_MOCK_HASH = exp.DEFAULT_MOCK_HASH;
    root.DEFAULT_MOCK_PASSCODE = exp.DEFAULT_MOCK_PASSCODE;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_MOCK_PASSCODE = 'yellowwing-roaster-secret';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var DEFAULT_MOCK_HASH = '35ad8e83336a3fd0137981caaaa1e2c0d63260378aab3a1d3c4dc2b372f2d7f3';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

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

  var CANONICAL_MOCK_ORDERS = [
    {
      orderId: "1001",
      token: "mock-token-1",
      name: "Jane Doe",
      email: "jane@test.com",
      items: "1x Early Bird 12oz (Grind: Whole Bean), 1x Feather Soot 2lb (Grind: Medium — Drip / Filter)",
      total: "$40.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "Please call when ready",
      status: "Received",
      statusDetails: "",
      timestamp: "10/08/2026, 10:15:00 AM"
    },
    {
      orderId: "1002",
      token: "mock-token-2",
      name: "Sam Smith",
      email: "sam@test.com",
      items: "2x Colombia Supremo 12oz (Grind: Whole Bean)",
      total: "$24.00",
      deliveryMethod: "Hand delivery",
      address: "123 Elm St",
      city: "Guilford",
      state: "CT",
      zip: "06437",
      notes: "Leave by back porch",
      status: "Delayed",
      statusDetails: "Awaiting Colombia green bean shipment from importer, roasting scheduled for Friday.",
      timestamp: "10/07/2026, 02:30:00 PM"
    },
    {
      orderId: "1003",
      token: "mock-token-3",
      name: "Chris Brown",
      email: "chris@test.com",
      items: "1x Early Bird 2lb (Grind: Whole Bean)",
      total: "$26.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Roasted",
      statusDetails: "Freshly roasted and currently degassing.",
      timestamp: "10/06/2026, 11:45:00 AM"
    },
    {
      orderId: "1004",
      token: "mock-token-4",
      name: "Morgan Lee",
      email: "morgan@test.com",
      items: "1x Morning Meep 12oz (Grind: Whole Bean), 1x Colombia Supremo 12oz (Grind: Coarser — French Press)",
      total: "$24.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Ready for Pickup",
      statusDetails: "Your beans are roasted, bagged, and waiting in our pickup bin at 45 Soundview Rd, Guilford! Available Mon–Sat 8am–6pm.",
      timestamp: "10/05/2026, 08:30:00 AM"
    },
    {
      orderId: "1005",
      token: "mock-token-5",
      name: "Taylor Swift",
      email: "taylor@test.com",
      items: "1x Lil' Sipper 12oz (Grind: Whole Bean), 1x Guatemala Antigua 12oz (Grind: Medium — Drip / Filter)",
      total: "$22.00",
      deliveryMethod: "Hand delivery",
      address: "78 Broad St",
      city: "Guilford",
      state: "CT",
      zip: "06437",
      notes: "Ring bell twice",
      status: "Ready to Deliver",
      statusDetails: "Packed and out for afternoon delivery in Guilford. Estimated delivery between 2:00 PM and 4:30 PM.",
      timestamp: "10/04/2026, 09:15:00 AM"
    },
    {
      orderId: "1006",
      token: "mock-token-6",
      name: "Jordan Case",
      email: "jordan@test.com",
      items: "2x Feather Soot 12oz (Grind: Medium — Drip / Filter)",
      total: "$24.00",
      deliveryMethod: "Hand delivery",
      address: "44 River St",
      city: "Madison",
      state: "CT",
      zip: "06443",
      notes: "Leave by back door",
      status: "Delivered",
      statusDetails: "Left safely on the back porch as requested. Enjoy your fresh cup!",
      timestamp: "10/03/2026, 01:20:00 PM"
    },
    {
      orderId: "1007",
      token: "mock-token-7",
      name: "Robin Hood",
      email: "robin@test.com",
      items: "1x Early Bird 12oz (Grind: Whole Bean)",
      total: "$10.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Cancelled",
      statusDetails: "Customer requested cancellation.",
      timestamp: "10/02/2026, 10:00:00 AM"
    }
  ];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getStatusBadgeClass(status) {
    var s = (status || '').toLowerCase();
    if (s === 'received') return 'status-received';
    if (s === 'delayed') return 'status-delayed';
    if (s === 'roasted') return 'status-roasted';
    if (s === 'ready for pickup' || s === 'ready to deliver' || s === 'out for delivery') return 'status-ready';
    if (s === 'delivered') return 'status-delivered';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-received';
  }

  function computeStats(orders) {
    var total = orders.length;
    var received = 0;
    var delayed = 0;
    var roasted = 0;
    var readyForPickup = 0;
    var readyToDeliver = 0;
    var delivered = 0;
    var cancelled = 0;

    for (var i = 0; i < orders.length; i++) {
      var s = (orders[i].status || '').toLowerCase();
      if (s === 'received') received++;
      else if (s === 'delayed') delayed++;
      else if (s === 'roasted') roasted++;
      else if (s === 'ready for pickup') readyForPickup++;
      else if (s === 'ready to deliver' || s === 'out for delivery') readyToDeliver++;
      else if (s === 'delivered') delivered++;
      else if (s === 'cancelled') cancelled++;
    }

    return {
      total: total,
      received: received,
      delayed: delayed,
      roasted: roasted,
      readyForPickup: readyForPickup,
      readyToDeliver: readyToDeliver,
      delivered: delivered,
      cancelled: cancelled
    };
  }

  function filterOrders(orders, filterCategory, searchQuery) {
    var result = orders.slice();

    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(function (order) {
        var s = (order.status || '').toLowerCase();
        if (filterCategory === 'received') return s === 'received';
        if (filterCategory === 'delayed') return s === 'delayed';
        if (filterCategory === 'roasted') return s === 'roasted';
        if (filterCategory === 'ready_for_pickup') return s === 'ready for pickup';
        if (filterCategory === 'ready_to_deliver') return s === 'ready to deliver' || s === 'out for delivery';
        if (filterCategory === 'delivered') return s === 'delivered';
        if (filterCategory === 'cancelled') return s === 'cancelled';
        return true;
      });
    }

    if (searchQuery) {
      var q = searchQuery.toLowerCase().trim();
      result = result.filter(function (order) {
        var text = [
          order.orderId || '',
          order.name || '',
          order.email || '',
          order.items || '',
          order.deliveryMethod || '',
          order.status || '',
          order.notes || ''
        ].join(' ').toLowerCase();
        return text.indexOf(q) !== -1;
      });
    }

    return result;
  }

  function extractOrderDate(timestampStr) {
    var raw = String(timestampStr || '').trim();
    if (!raw) return { year: 'Unknown', month: '00', yearMonth: 'Unknown' };

    // Try MM/DD/YYYY format first (common Google Sheets & mock format)
    var mdyMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (mdyMatch) {
      var mm = mdyMatch[1].padStart(2, '0');
      var yyyy = mdyMatch[3];
      return {
        year: yyyy,
        month: mm,
        yearMonth: yyyy + '-' + mm
      };
    }

    // Try ISO YYYY-MM-DD
    var isoMatch = raw.match(/^(\d{4})-(\d{1,2})/);
    if (isoMatch) {
      var y = isoMatch[1];
      var m = isoMatch[2].padStart(2, '0');
      return {
        year: y,
        month: m,
        yearMonth: y + '-' + m
      };
    }

    // Fallback: Date parse
    var d = new Date(raw);
    if (!isNaN(d.getTime())) {
      var parsedY = String(d.getFullYear());
      var parsedM = String(d.getMonth() + 1).padStart(2, '0');
      return {
        year: parsedY,
        month: parsedM,
        yearMonth: parsedY + '-' + parsedM
      };
    }

    return { year: 'Unknown', month: '00', yearMonth: 'Unknown' };
  }

  function parseCurrency(val) {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    var num = parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function bagSizeToLbs(bagSizeId, bagSizes) {
    if (!bagSizeId) return 0;
    if (Array.isArray(bagSizes)) {
      var match = bagSizes.find(function (b) { return b.id === bagSizeId; });
      if (match && match.weight_oz) {
        return Number((Number(match.weight_oz) / 16).toFixed(4));
      }
    }
    var str = String(bagSizeId).trim().toLowerCase();
    var flightMatch = str.match(/^(\d+)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(oz|lb)/i);
    if (flightMatch) {
      var count = parseInt(flightMatch[1], 10);
      var perBagVal = parseFloat(flightMatch[2]);
      var unit = flightMatch[3].toLowerCase();
      var perBagLbs = (unit === 'lb') ? perBagVal : (perBagVal / 16);
      return Number((count * perBagLbs).toFixed(4));
    }
    var m = str.match(/^(\d+(?:\.\d+)?)\s*(oz|lb)s?$/i);
    if (m) {
      var val = parseFloat(m[1]);
      var unit = m[2].toLowerCase();
      if (unit === 'lb') return val;
      if (unit === 'oz') return Number((val / 16).toFixed(4));
    }
    return 0;
  }

  function parseOrderLineItems(itemsStr, bagSizes) {
    var raw = String(itemsStr || '').trim();
    if (!raw) return [];
    var parts = raw.split(/,\s*(?=\d+x\s)/i);
    return parts.map(function (part) {
      var clean = part.replace(/\s*\([^)]*\)\s*$/, '').trim();
      var qtyMatch = clean.match(/^(\d+)x\s+/i);
      var qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
      var withoutQty = clean.replace(/^\d+x\s+/i, '').trim();

      var bagSize = '';
      var product = withoutQty;
      var bagsPerUnit = 1;

      var flightSizeMatch = withoutQty.match(/\s+(\d+\s*[×x]\s*\d+(?:oz|lb)(?:\s*bags?)?)$/i);
      if (flightSizeMatch) {
        bagSize = flightSizeMatch[1].trim();
        product = withoutQty.slice(0, withoutQty.length - flightSizeMatch[0].length).trim();
        var numBagsMatch = bagSize.match(/^(\d+)/);
        if (numBagsMatch) {
          bagsPerUnit = parseInt(numBagsMatch[1], 10);
        }
      } else {
        var sizeMatch = withoutQty.match(/\s+(\d+(?:oz|lb)s?)$/i);
        if (sizeMatch) {
          bagSize = sizeMatch[1].toLowerCase();
          product = withoutQty.slice(0, withoutQty.length - sizeMatch[0].length).trim();
        }
      }

      // Aggregate "Peck Your Own" flights under "Peck Your Own" without breaking down individual roasts
      if (/^peck your own/i.test(product)) {
        product = 'Peck Your Own';
      } else if (/^the aviary/i.test(product)) {
        product = 'The Aviary';
      }

      var weightLbs = bagSizeToLbs(bagSize, bagSizes);
      var explicitPrice = null;
      var detailsMatch = part.match(/\((.*)\)$/);
      if (detailsMatch) {
        var priceMatch = detailsMatch[1].match(/Price:\s*\$?([\d.]+)/i);
        if (priceMatch) {
          explicitPrice = parseFloat(priceMatch[1]);
        }
        if (!weightLbs && product === 'Peck Your Own') {
          var picksMatch = detailsMatch[1].match(/Picks:\s*([^;]+)/i);
          if (picksMatch) {
            var picksCount = picksMatch[1].split(',').filter(Boolean).length;
            if (picksCount > 0) {
              bagsPerUnit = picksCount;
              weightLbs = Number((picksCount * 0.5).toFixed(4));
            }
          }
        }
      }

      return {
        qty: qty,
        bagsPerUnit: bagsPerUnit,
        bagsCount: qty * bagsPerUnit,
        label: clean,
        product: product,
        bagSize: bagSize,
        weightLbs: weightLbs,
        unitPrice: explicitPrice,
        linePrice: explicitPrice !== null ? Number((qty * explicitPrice).toFixed(2)) : null
      };
    });
  }

  function formatSizeCounts(sizeCounts, delimiter) {
    if (!sizeCounts) return '';
    delimiter = delimiter || ', ';
    var sizeOrder = ['8oz', '12oz', '1lb', '2lb', '5lb'];
    var keys = Object.keys(sizeCounts).sort(function (a, b) {
      var idxA = sizeOrder.indexOf(a);
      var idxB = sizeOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return keys
      .filter(function (k) { return sizeCounts[k] > 0; })
      .map(function (k) { return sizeCounts[k] + ' × ' + k; })
      .join(delimiter);
  }

  var ORDER_DIMENSION_LABELS = {
    month: 'Month',
    year: 'Year',
    roast: 'Roast',
    product: 'Roast',
    size: 'Bag Size',
    deliveryMethod: 'Delivery Method',
    status: 'Status',
    city: 'City'
  };

  function computeOrderTotals(orders, filters, bagSizes) {
    orders = orders || [];
    filters = filters || {};

    var groupBys = [];
    if (Array.isArray(filters.groupBy)) {
      groupBys = filters.groupBy.filter(Boolean);
    } else if (typeof filters.groupBy === 'string') {
      groupBys = filters.groupBy.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    if (groupBys.length === 0) {
      groupBys = ['month'];
    }

    var hasItemDim = groupBys.some(function (d) {
      return d === 'roast' || d === 'product' || d === 'size';
    });

    var summary = {
      totalOrders: 0,
      totalBags: 0,
      totalLbs: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      sizeCounts: {},
      sizeBreakdownStr: '',
      sizeCountsStr: '',
      pickupCount: 0,
      deliveryCount: 0,
      deliveredCount: 0,
      readyCount: 0,
      inProgressCount: 0,
      cancelledCount: 0
    };

    var groups = {};
    function ensureGroup(key, label, dimVals) {
      if (!groups[key]) {
        groups[key] = {
          key: key,
          label: label || key,
          dimValues: dimVals || {},
          ordersSet: {},
          ordersCount: 0,
          bagsCount: 0,
          weightLbs: 0,
          sizeCounts: {},
          sizeBreakdownStr: '',
          revenue: 0,
          avgOrderValue: null,
          pickupCount: 0,
          deliveryCount: 0,
          deliveredCount: 0
        };
      }
      return groups[key];
    }

    var roastFilter = (filters.roast || filters.coffee || 'all').toLowerCase();
    var sizeFilter = (filters.size || 'all').toLowerCase();

    for (var i = 0; i < orders.length; i++) {
      var ord = orders[i];
      var ym = extractOrderDate(ord.timestamp);
      var lineItems = parseOrderLineItems(ord.items, bagSizes);
      var totalBagsInOrder = 0;
      var totalLbsInOrder = 0;
      var orderSizes = {};
      for (var b = 0; b < lineItems.length; b++) {
        var li = lineItems[b];
        var bCount = (li.bagsCount || li.qty);
        totalBagsInOrder += bCount;
        totalLbsInOrder += li.qty * (li.weightLbs || bagSizeToLbs(li.bagSize, bagSizes));
        var sz = li.bagSize || 'Other';
        orderSizes[sz] = (orderSizes[sz] || 0) + bCount;
      }
      var orderCost = parseCurrency(ord.total);

      var normStatus = (ord.status || '').toLowerCase();

      // Filters
      if (filters.year && filters.year !== 'all' && ym.year !== filters.year) continue;
      if (filters.month && filters.month !== 'all' && ym.month !== filters.month) continue;
      if (filters.deliveryMethod && filters.deliveryMethod !== 'all' && ord.deliveryMethod !== filters.deliveryMethod) continue;

      var statusFilter = (filters.status || 'all').toLowerCase();
      if (statusFilter === 'all_with_cancelled') {
        // Explicitly include all statuses including cancelled
      } else if (statusFilter !== 'all') {
        if (normStatus !== statusFilter) continue;
      } else {
        // Exclude cancelled orders by default unless explicitly filtered for 'Cancelled'
        if (normStatus === 'cancelled') continue;
      }
      if (roastFilter !== 'all') {
        var matchesRoast = lineItems.some(function (it) {
          return it.product.toLowerCase() === roastFilter;
        });
        if (!matchesRoast) continue;
      }
      if (sizeFilter !== 'all') {
        var matchesSize = lineItems.some(function (it) {
          return (it.bagSize || '').toLowerCase() === sizeFilter;
        });
        if (!matchesSize) continue;
      }

      // Summary accumulation
      summary.totalOrders += 1;
      summary.totalBags += totalBagsInOrder;
      summary.totalLbs = Number((summary.totalLbs + totalLbsInOrder).toFixed(2));
      summary.totalRevenue = Number((summary.totalRevenue + orderCost).toFixed(2));
      Object.keys(orderSizes).forEach(function (sz) {
        summary.sizeCounts[sz] = (summary.sizeCounts[sz] || 0) + orderSizes[sz];
      });
      if (ord.deliveryMethod === 'Pickup') summary.pickupCount += 1;
      if (ord.deliveryMethod === 'Hand delivery') summary.deliveryCount += 1;

      var normStatus = (ord.status || '').toLowerCase();
      if (normStatus === 'delivered') {
        summary.deliveredCount += 1;
      } else if (normStatus === 'ready for pickup' || normStatus === 'ready to deliver' || normStatus === 'out for delivery') {
        summary.readyCount += 1;
      } else if (normStatus === 'cancelled') {
        summary.cancelledCount += 1;
      } else {
        summary.inProgressCount += 1;
      }

      // Grouping
      if (hasItemDim) {
        var totalKnownItemRevenue = 0;
        var allItemsHavePrice = lineItems.length > 0 && lineItems.every(function (it) {
          return it.linePrice !== null;
        });
        if (allItemsHavePrice) {
          totalKnownItemRevenue = lineItems.reduce(function (acc, it) {
            return acc + it.linePrice;
          }, 0);
        }

        var itemsInOrder = {};
        for (var p = 0; p < lineItems.length; p++) {
          var item = lineItems[p];
          if (roastFilter !== 'all' && item.product.toLowerCase() !== roastFilter) {
            continue;
          }
          if (sizeFilter !== 'all' && (item.bagSize || '').toLowerCase() !== sizeFilter) {
            continue;
          }
          var dimVals = {};
          var keyParts = [];
          for (var g = 0; g < groupBys.length; g++) {
            var dim = groupBys[g];
            var val = '';
            if (dim === 'month') val = ym.yearMonth;
            else if (dim === 'year') val = ym.year;
            else if (dim === 'roast' || dim === 'product') val = item.product || 'Unknown';
            else if (dim === 'size') val = item.bagSize || 'Other';
            else if (dim === 'deliveryMethod') val = ord.deliveryMethod || 'Other';
            else if (dim === 'status') val = ord.status || 'Unknown';
            else if (dim === 'city') val = (ord.city || (ord.deliveryMethod === 'Pickup' ? 'Pickup' : 'Unspecified'));
            dimVals[dim] = val;
            keyParts.push(val);
          }
          var compKey = keyParts.join(' — ');
          if (!itemsInOrder[compKey]) {
            itemsInOrder[compKey] = {
              compKey: compKey,
              dimVals: dimVals,
              bagsCount: 0,
              weightLbs: 0,
              revenue: 0,
              sizeCounts: {}
            };
          }
          var itemBags = (item.bagsCount || item.qty);
          var itemWeightLbs = item.qty * (item.weightLbs || bagSizeToLbs(item.bagSize, bagSizes));
          itemsInOrder[compKey].bagsCount += itemBags;
          itemsInOrder[compKey].weightLbs += itemWeightLbs;

          var itemRev = 0;
          if (item.linePrice !== null) {
            if (allItemsHavePrice && totalKnownItemRevenue > 0 && Math.abs(totalKnownItemRevenue - orderCost) > 0.01) {
              itemRev = Number(((item.linePrice / totalKnownItemRevenue) * orderCost).toFixed(2));
            } else {
              itemRev = item.linePrice;
            }
          } else if (totalLbsInOrder > 0) {
            itemRev = Number(((itemWeightLbs / totalLbsInOrder) * orderCost).toFixed(2));
          } else {
            itemRev = lineItems.length > 0 ? Number((orderCost / lineItems.length).toFixed(2)) : 0;
          }

          itemsInOrder[compKey].revenue = Number((itemsInOrder[compKey].revenue + itemRev).toFixed(2));
          var itemSz = item.bagSize || 'Other';
          itemsInOrder[compKey].sizeCounts[itemSz] = (itemsInOrder[compKey].sizeCounts[itemSz] || 0) + itemBags;
        }

        Object.keys(itemsInOrder).forEach(function (cKey) {
          var iData = itemsInOrder[cKey];
          var grp = ensureGroup(cKey, cKey, iData.dimVals);
          if (!grp.ordersSet[ord.orderId]) {
            grp.ordersSet[ord.orderId] = true;
            grp.ordersCount += 1;
            if (ord.deliveryMethod === 'Pickup') grp.pickupCount += 1;
            if (ord.deliveryMethod === 'Hand delivery') grp.deliveryCount += 1;
            if (normStatus === 'delivered') grp.deliveredCount += 1;
          }
          grp.bagsCount += iData.bagsCount;
          grp.weightLbs = Number((grp.weightLbs + iData.weightLbs).toFixed(2));
          grp.revenue = Number((grp.revenue + iData.revenue).toFixed(2));
          Object.keys(iData.sizeCounts).forEach(function (sz) {
            grp.sizeCounts[sz] = (grp.sizeCounts[sz] || 0) + iData.sizeCounts[sz];
          });
        });
      } else {
        var dimValsOrder = {};
        var keyPartsOrder = [];
        for (var g2 = 0; g2 < groupBys.length; g2++) {
          var dim2 = groupBys[g2];
          var val2 = '';
          if (dim2 === 'month') val2 = ym.yearMonth;
          else if (dim2 === 'year') val2 = ym.year;
          else if (dim2 === 'deliveryMethod') val2 = ord.deliveryMethod || 'Other';
          else if (dim2 === 'status') val2 = ord.status || 'Unknown';
          else if (dim2 === 'city') val2 = (ord.city || (ord.deliveryMethod === 'Pickup' ? 'Pickup' : 'Unspecified'));
          dimValsOrder[dim2] = val2;
          keyPartsOrder.push(val2);
        }
        var compKeyOrder = keyPartsOrder.join(' — ');
        var grpOrder = ensureGroup(compKeyOrder, compKeyOrder, dimValsOrder);
        grpOrder.ordersCount += 1;
        grpOrder.bagsCount += totalBagsInOrder;
        grpOrder.weightLbs = Number((grpOrder.weightLbs + totalLbsInOrder).toFixed(2));
        grpOrder.revenue = Number((grpOrder.revenue + orderCost).toFixed(2));
        Object.keys(orderSizes).forEach(function (sz) {
          grpOrder.sizeCounts[sz] = (grpOrder.sizeCounts[sz] || 0) + orderSizes[sz];
        });
        if (ord.deliveryMethod === 'Pickup') grpOrder.pickupCount += 1;
        if (ord.deliveryMethod === 'Hand delivery') grpOrder.deliveryCount += 1;
        if (normStatus === 'delivered') grpOrder.deliveredCount += 1;
      }
    }

    summary.avgOrderValue = summary.totalOrders > 0
      ? Number((summary.totalRevenue / summary.totalOrders).toFixed(2))
      : 0;
    summary.sizeBreakdownStr = formatSizeCounts(summary.sizeCounts, ' · ');
    summary.sizeCountsStr = formatSizeCounts(summary.sizeCounts, ', ');

    var rows = Object.keys(groups).map(function (k) {
      var row = groups[k];
      if (row.revenue !== null && row.ordersCount > 0) {
        row.avgOrderValue = Number((row.revenue / row.ordersCount).toFixed(2));
      }
      row.sizeBreakdownStr = formatSizeCounts(row.sizeCounts, ', ');
      return row;
    });

    var sizeOrder = ['8oz', '12oz', '1lb', '2lb', '5lb'];
    rows.sort(function (a, b) {
      if (groupBys.length === 1 && (groupBys[0] === 'month' || groupBys[0] === 'year')) {
        return b.key.localeCompare(a.key);
      }
      if (groupBys.length === 1 && groupBys[0] === 'size') {
        var idxA = sizeOrder.indexOf(a.key);
        var idxB = sizeOrder.indexOf(b.key);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
      }
      return b.ordersCount - a.ordersCount || a.label.localeCompare(b.label);
    });

    return {
      groupBys: groupBys,
      hasItemDim: hasItemDim,
      summary: summary,
      rows: rows
    };
  }

  function sortOrderTotalsRows(rows, sortCol, sortDir) {
    if (!rows || rows.length === 0 || !sortCol) return rows ? rows.slice() : [];
    var dir = sortDir === 'asc' ? 1 : -1;
    var sizeOrder = ['8oz', '12oz', '1lb', '2lb', '5lb'];
    return rows.slice().sort(function (a, b) {
      var cmp = 0;
      if (sortCol.indexOf('dim:') === 0) {
        var dimKey = sortCol.slice(4);
        var aVal = String((a.dimValues && a.dimValues[dimKey]) || a.label || '');
        var bVal = String((b.dimValues && b.dimValues[dimKey]) || b.label || '');
        if (dimKey === 'size') {
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
    options = options || {};
    var apiUrl = options.apiUrl || '';
    var manageBaseUrl = options.manageBaseUrl || '/order/manage/';
    var bagSizes = options.bagSizes || [];

    var hasMockParam = typeof window !== 'undefined' &&
      (window.location.search.indexOf('mock=1') !== -1 || window.location.search.indexOf('demo=1') !== -1);

    var gateSection = document.getElementById('order-admin-gate-section');
    var gateForm = document.getElementById('order-admin-gate-form');
    var passcodeInput = document.getElementById('order-admin-passcode-input');
    var gateError = document.getElementById('order-admin-gate-error');
    var gateBtn = document.getElementById('order-admin-gate-btn');

    var dashboardSection = document.getElementById('order-admin-dashboard-section');
    var statsContainer = document.getElementById('order-admin-stats');
    var refreshBtn = document.getElementById('order-admin-refresh-btn');
    var logoutBtn = document.getElementById('order-admin-logout-btn');
    var filtersContainer = document.getElementById('order-admin-filters');
    var searchInput = document.getElementById('order-admin-search-input');
    var queueContainer = document.getElementById('order-admin-queue');
    var inspectorContainer = document.getElementById('order-admin-inspector');

    var tabsContainer = document.getElementById('order-admin-tabs');
    var queuePanel = document.getElementById('order-admin-panel-queue');
    var totalsPanel = document.getElementById('order-admin-panel-totals');

    var totalsGroupBy = document.getElementById('order-totals-group-by');
    var totalsFilterYear = document.getElementById('order-totals-filter-year');
    var totalsFilterMonth = document.getElementById('order-totals-filter-month');
    var totalsFilterStatus = document.getElementById('order-totals-filter-status');
    var totalsFilterDelivery = document.getElementById('order-totals-filter-delivery');
    var totalsFilterCoffee = document.getElementById('order-totals-filter-coffee');
    var totalsFilterRoast = document.getElementById('order-totals-filter-roast') || totalsFilterCoffee;
    var totalsFilterSize = document.getElementById('order-totals-filter-size');
    var totalsKpisWrap = document.getElementById('order-totals-kpis');
    var totalsTableWrap = document.getElementById('order-totals-table-wrap');

    var currentOrders = [];
    var activeFilter = 'all';
    var activeTab = 'queue';
    var currentSearch = '';
    var selectedOrderId = null;
    var isMockModeActive = false;
    var isDeliveredCollapsed = true;
    var isCancelledCollapsed = true;
    var orderTotalsSortCol = null;
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
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('ywr-admin-authenticated');
        }
      } catch (e) {}
    }

    function clearStoredKey() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('ywr-admin-authenticated');
        }
      } catch (e) {}
    }

    function showGate(errorMessage) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('ywr-admin-authenticated');
      }
      if (dashboardSection) dashboardSection.style.display = 'none';
      if (gateSection) gateSection.style.display = 'block';
      if (gateError) {
        if (errorMessage) {
          gateError.textContent = errorMessage;
          gateError.style.display = 'block';
        } else {
          gateError.style.display = 'none';
        }
      }
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.focus();
      }
    }

    function showDashboard() {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('ywr-admin-authenticated');
      }
      if (gateSection) gateSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'block';
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

      if (isMockModeActive) {
        html += '<span class="order-admin-stat-pill" style="color: #92400e; background: #fde68a; font-weight: 700;">MOCK MODE</span>';
      }

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
      if (str.charAt(0) === '$') return str;
      return '$' + str;
    }

    function parseOrderItems(raw) {
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

    function renderInspector(order) {
      if (!order) {
        inspectorContainer.innerHTML = '<div class="order-admin-inspector-empty">Select an order from the queue to view details and update fulfillment status.</div>';
        return;
      }

      var badgeClass = getStatusBadgeClass(order.status);
      var magicLinkUrl = manageBaseUrl + (manageBaseUrl.indexOf('?') === -1 ? '?' : '&') +
        'orderId=' + encodeURIComponent(order.orderId) + '&token=' + encodeURIComponent(order.token || '');

      var fulfillmentHtml = '<div class="order-admin-info-line"><strong>Method:</strong> ' + escapeHtml(order.deliveryMethod || 'Pickup') + '</div>';
      if ((order.deliveryMethod || '').toLowerCase() === 'hand delivery' && order.address) {
        var addressLine = escapeHtml(order.address) + (order.city ? ', ' + escapeHtml(order.city) : '') +
          (order.state ? ' ' + escapeHtml(order.state) : '') + (order.zip ? ' ' + escapeHtml(order.zip) : '');
        fulfillmentHtml += '<div class="order-admin-info-line"><strong>Address:</strong> ' + addressLine + '</div>';
      }

      var notesHtml = '';
      if (order.notes) {
        notesHtml = '<div class="order-admin-section-block">' +
          '<div class="order-admin-section-label">Customer Instructions</div>' +
          '<div class="order-admin-info-line">' + escapeHtml(order.notes) + '</div>' +
          '</div>';
      }

      var itemLines = parseOrderItems(order.items);
      var itemsBoxHtml = '';
      if (itemLines.length === 0) {
        itemsBoxHtml = '<div class="order-admin-items-box">No items listed</div>';
      } else {
        itemsBoxHtml = '<div class="order-admin-items-box">' +
          '<ul class="order-admin-items-list">' +
          itemLines.map(function (it) {
            return '<li>' + escapeHtml(it) + '</li>';
          }).join('') +
          '</ul>' +
          '</div>';
      }

      var formattedTotal = formatPrice(order.total);
      var totalHtml = formattedTotal
        ? '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
          '<span class="order-admin-inspector-price">' + escapeHtml(formattedTotal) + '</span>'
        : '';

      var html = '<div class="order-admin-inspector-header">' +
        '<div class="order-admin-inspector-title-wrap">' +
        '<h3 class="order-admin-inspector-title">Order #' + escapeHtml(order.orderId) + '</h3>' +
        totalHtml +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Contact</div>' +
        '<div class="order-admin-info-line"><strong>Name:</strong> ' + escapeHtml(order.name || 'Customer') + '</div>' +
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

      inspectorContainer.innerHTML = html;

      var saveBtn = document.getElementById('admin-save-status-btn');
      var statusSelect = document.getElementById('admin-status-select');
      var detailsTextarea = document.getElementById('admin-status-details');
      var notifyCheckbox = document.getElementById('admin-notify-customer');
      var noticePill = document.getElementById('admin-notice-pill');
      var feedbackDiv = document.getElementById('admin-status-feedback');

      if (notifyCheckbox && saveBtn && noticePill) {
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
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', function () {
          var newStatus = statusSelect.value;
          var newDetails = detailsTextarea.value.trim();
          var shouldNotify = notifyCheckbox ? notifyCheckbox.checked : false;

          saveBtn.disabled = true;
          saveBtn.textContent = shouldNotify ? 'Saving & Notifying...' : 'Saving...';
          feedbackDiv.style.display = 'none';

          updateOrderStatus(order.orderId, newStatus, newDetails, shouldNotify, function (err, res) {
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
              renderQueue();
              renderInspector(order);
              populateOrderTotalsFilters();
              if (activeTab === 'totals') renderOrderTotalsTab();

              var newFeedbackDiv = document.getElementById('admin-status-feedback');
              newFeedbackDiv.className = 'order-admin-feedback order-admin-feedback--success';
              newFeedbackDiv.textContent = '✓ Order #' + order.orderId + ' updated to ' + newStatus + (shouldNotify ? ' (email sent)!' : ' (saved silently)!');
              newFeedbackDiv.style.display = 'block';
            }
          });
        });
      }
    }

    function createCardElement(order) {
      var card = document.createElement('div');
      card.className = 'order-admin-card-item' + (order.orderId === selectedOrderId ? ' order-admin-card-item--selected' : '');
      card.setAttribute('data-order-id', order.orderId);

      var badgeClass = getStatusBadgeClass(order.status);
      var timeHtml = order.timestamp ? '<span class="order-admin-card-time">' + escapeHtml(order.timestamp) + '</span>' : '';

      card.innerHTML = '<div class="order-admin-card-header">' +
        '<div class="order-admin-card-id-wrap">' +
        '<span class="order-admin-card-id">#' + escapeHtml(order.orderId) + '</span>' +
        timeHtml +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
        '</div>' +
        '<div class="order-admin-card-sub">' +
        '<span class="order-admin-card-name">' + escapeHtml(order.name || 'Customer') + '</span>' +
        '<span class="order-admin-card-delivery">' + escapeHtml(order.deliveryMethod || 'Pickup') + '</span>' +
        '</div>';

      card.addEventListener('click', function () {
        selectedOrderId = order.orderId;
        // Re-render queue selected highlight
        var allCards = queueContainer.querySelectorAll('.order-admin-card-item');
        allCards.forEach(function (c) { c.classList.remove('order-admin-card-item--selected'); });
        card.classList.add('order-admin-card-item--selected');
        renderInspector(order);

        if (window.innerWidth <= 860 && inspectorContainer) {
          inspectorContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });

      return card;
    }

    function renderQueue() {
      var filtered = filterOrders(currentOrders, activeFilter, currentSearch);

      if (filtered.length === 0) {
        selectedOrderId = null;
        queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">No orders match the selected filter.</div>';
        renderInspector(null);
        return;
      }

      if (selectedOrderId) {
        var isSelectedInFiltered = filtered.some(function (o) { return o.orderId === selectedOrderId; });
        if (!isSelectedInFiltered) {
          selectedOrderId = null;
        }
      }

      queueContainer.innerHTML = '';

      if (activeFilter === 'all') {
        var activeOrders = [];
        var deliveredOrders = [];
        var cancelledOrders = [];
        filtered.forEach(function (order) {
          var s = (order.status || '').toLowerCase();
          if (s === 'delivered') {
            deliveredOrders.push(order);
          } else if (s === 'cancelled') {
            cancelledOrders.push(order);
          } else {
            activeOrders.push(order);
          }
        });

        // Render active orders
        activeOrders.forEach(function (order) {
          queueContainer.appendChild(createCardElement(order));
        });

        function appendCollapsibleSection(title, orders, isCollapsed, setCollapsed) {
          if (orders.length === 0) return;

          var collWrap = document.createElement('div');
          collWrap.className = 'order-admin-collapsible-wrap';

          var toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'order-admin-collapse-toggle';
          toggleBtn.innerHTML = '<span class="order-admin-collapse-title">' + title + ' (' + orders.length + ')</span>' +
            '<span class="order-admin-collapse-icon">' + (isCollapsed ? '▶' : '▼') + '</span>';

          var content = document.createElement('div');
          content.className = 'order-admin-collapsed-content';
          content.style.display = isCollapsed ? 'none' : 'flex';

          orders.forEach(function (order) {
            content.appendChild(createCardElement(order));
          });

          toggleBtn.addEventListener('click', function () {
            var next = !isCollapsed;
            setCollapsed(next);
            isCollapsed = next;
            content.style.display = next ? 'none' : 'flex';
            toggleBtn.querySelector('.order-admin-collapse-icon').textContent = next ? '▶' : '▼';
          });

          collWrap.appendChild(toggleBtn);
          collWrap.appendChild(content);
          queueContainer.appendChild(collWrap);
        }

        appendCollapsibleSection('Delivered Orders', deliveredOrders, isDeliveredCollapsed, function (c) {
          isDeliveredCollapsed = c;
        });

        appendCollapsibleSection('Cancelled Orders', cancelledOrders, isCancelledCollapsed, function (c) {
          isCancelledCollapsed = c;
        });
      } else {
        // Direct rendering when a specific filter is active (including 'delivered' and 'cancelled')
        filtered.forEach(function (order) {
          queueContainer.appendChild(createCardElement(order));
        });
      }

      var currentSelected = selectedOrderId
        ? currentOrders.find(function (o) { return o.orderId === selectedOrderId; })
        : null;
      renderInspector(currentSelected);
    }

    function switchToTab(targetTab) {
      activeTab = targetTab;
      if (tabsContainer) {
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
      }

      if (queuePanel && totalsPanel) {
        if (targetTab === 'queue') {
          queuePanel.classList.add('roast-admin-panel--active');
          totalsPanel.classList.remove('roast-admin-panel--active');
          renderQueue();
        } else if (targetTab === 'totals') {
          queuePanel.classList.remove('roast-admin-panel--active');
          totalsPanel.classList.add('roast-admin-panel--active');
          renderOrderTotalsTab();
        }
      }
    }

    function populateOrderTotalsFilters() {
      if (!totalsFilterYear) return;

      var yearsSet = {};
      currentOrders.forEach(function (o) {
        var d = extractOrderDate(o.timestamp);
        if (d.year && d.year !== 'Unknown') {
          yearsSet[d.year] = true;
        }
      });
      var years = Object.keys(yearsSet).sort().reverse();
      var prevYear = totalsFilterYear.value || 'all';
      var yearHtml = '<option value="all">All Years</option>';
      years.forEach(function (y) {
        yearHtml += '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>';
      });
      totalsFilterYear.innerHTML = yearHtml;
      if (years.indexOf(prevYear) !== -1) {
        totalsFilterYear.value = prevYear;
      }

      var roastsSet = {};
      var sizesSet = {};
      currentOrders.forEach(function (o) {
        var items = parseOrderLineItems(o.items, bagSizes);
        items.forEach(function (it) {
          if (it.product) {
            roastsSet[it.product] = true;
          }
          if (it.bagSize) {
            sizesSet[it.bagSize] = true;
          }
        });
      });

      var roastFilterEl = totalsFilterRoast || totalsFilterCoffee;
      if (roastFilterEl) {
        var roasts = Object.keys(roastsSet).sort();
        var prevRoast = roastFilterEl.value || 'all';
        var roastHtml = '<option value="all">All Roasts</option>';
        roasts.forEach(function (c) {
          roastHtml += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
        });
        roastFilterEl.innerHTML = roastHtml;
        if (roasts.indexOf(prevRoast) !== -1) {
          roastFilterEl.value = prevRoast;
        }
      }

      if (totalsFilterSize) {
        var sizeOrder = ['8oz', '12oz', '1lb', '2lb', '5lb'];
        var sizes = Object.keys(sizesSet).sort(function (a, b) {
          var idxA = sizeOrder.indexOf(a);
          var idxB = sizeOrder.indexOf(b);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.localeCompare(b);
        });
        var prevSize = totalsFilterSize.value || 'all';
        var sizeHtml = '<option value="all">All Sizes</option>';
        sizes.forEach(function (sz) {
          sizeHtml += '<option value="' + escapeHtml(sz) + '">' + escapeHtml(sz) + '</option>';
        });
        totalsFilterSize.innerHTML = sizeHtml;
        if (sizes.indexOf(prevSize) !== -1) {
          totalsFilterSize.value = prevSize;
        }
      }
    }

    function renderOrderTotalsTab() {
      if (!totalsKpisWrap || !totalsTableWrap) return;

      var groupBys = [];
      var orderGroupPillsWrap = document.getElementById('order-totals-group-pills');
      if (orderGroupPillsWrap) {
        var activePills = orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active');
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

      var roastVal = (totalsFilterRoast && totalsFilterRoast.value) || (totalsFilterCoffee && totalsFilterCoffee.value) || 'all';
      var sizeVal = (totalsFilterSize && totalsFilterSize.value) || 'all';

      var result = computeOrderTotals(currentOrders, {
        groupBy: groupBys,
        year: totalsFilterYear ? totalsFilterYear.value : 'all',
        month: totalsFilterMonth ? totalsFilterMonth.value : 'all',
        status: totalsFilterStatus ? totalsFilterStatus.value : 'all',
        deliveryMethod: totalsFilterDelivery ? totalsFilterDelivery.value : 'all',
        roast: roastVal,
        size: sizeVal
      }, bagSizes);

      var s = result.summary;
      var deliveryPct = s.totalOrders > 0 ? ((s.deliveryCount / s.totalOrders) * 100).toFixed(0) : '0';
      var sizeSummaryStr = s.sizeBreakdownStr || 'None';

      totalsKpisWrap.innerHTML =
        '<div class="roast-admin-kpi-box">' +
        '<div class="roast-admin-kpi-label">Total Orders</div>' +
        '<div class="roast-admin-kpi-value">' + s.totalOrders + ' Orders</div>' +
        '<div class="roast-admin-kpi-sub">' + (s.totalOrders > 0 ? (s.totalLbs / s.totalOrders).toFixed(2) : '0.00') + ' lbs / order avg</div>' +
        '</div>' +
        '<div class="roast-admin-kpi-box">' +
        '<div class="roast-admin-kpi-label">Total Weight Sold</div>' +
        '<div class="roast-admin-kpi-value">' + s.totalLbs.toFixed(2) + ' lbs</div>' +
        '<div class="roast-admin-kpi-sub">' + (s.totalLbs * 16).toFixed(0) + ' oz total volume</div>' +
        '</div>' +
        '<div class="roast-admin-kpi-box">' +
        '<div class="roast-admin-kpi-label">Total Revenue</div>' +
        '<div class="roast-admin-kpi-value">$' + s.totalRevenue.toFixed(2) + '</div>' +
        '<div class="roast-admin-kpi-sub">' + (s.totalOrders > 0 ? ('Avg $' + s.avgOrderValue.toFixed(2) + ' / order') : '$0.00') + '</div>' +
        '</div>';

      if (result.rows.length === 0) {
        totalsTableWrap.innerHTML = '<div class="order-admin-inspector-empty">No orders match the selected period/filters.</div>';
        return;
      }

      function renderSortTh(label, colKey, alignRight) {
        var isSorted = orderTotalsSortCol === colKey;
        var icon = isSorted
          ? (orderTotalsSortDir === 'asc' ? ' ▲' : ' ▼')
          : '<span class="roast-admin-sort-icon">↕</span>';
        var style = alignRight ? ' style="text-align: right;"' : '';
        return '<th class="roast-admin-th-sortable' + (isSorted ? ' is-sorted' : '') + '" data-sort-col="' + escapeHtml(colKey) + '"' + style + '>' +
          escapeHtml(label) + icon + '</th>';
      }

      var html = '<table class="roast-admin-table">' +
        '<thead><tr>';

      result.groupBys.forEach(function (dim) {
        html += renderSortTh(ORDER_DIMENSION_LABELS[dim] || dim, 'dim:' + dim, false);
      });

      html += renderSortTh('Orders', 'orders', true) +
        renderSortTh('Weight (lbs)', 'weight', true) +
        renderSortTh('Revenue', 'revenue', true) +
        '</tr></thead><tbody>';

      var displayRows = sortOrderTotalsRows(result.rows, orderTotalsSortCol, orderTotalsSortDir);

      displayRows.forEach(function (r) {
        html += '<tr>';

        result.groupBys.forEach(function (dim) {
          var cellVal = r.dimValues && r.dimValues[dim] ? r.dimValues[dim] : r.label;
          html += '<td><strong>' + escapeHtml(cellVal) + '</strong></td>';
        });

        html += '<td class="mono" style="text-align: right;">' + r.ordersCount + '</td>' +
          '<td class="mono" style="text-align: right;">' + r.weightLbs.toFixed(2) + ' lbs</td>' +
          '<td class="mono" style="text-align: right;">$' + r.revenue.toFixed(2) + '</td>' +
          '</tr>';
      });

      html += '</tbody><tfoot>' +
        '<tr style="font-weight: 700; background: #fdfbf7; border-top: 2px solid #ded5c9;">' +
        '<td colspan="' + result.groupBys.length + '">Total</td>' +
        '<td class="mono" style="text-align: right;">' + s.totalOrders + '</td>' +
        '<td class="mono" style="text-align: right;">' + s.totalLbs.toFixed(2) + ' lbs</td>' +
        '<td class="mono" style="text-align: right;">$' + s.totalRevenue.toFixed(2) + '</td>' +
        '</tr></tfoot></table>';

      totalsTableWrap.innerHTML = html;

      var sortHeaders = totalsTableWrap.querySelectorAll('th[data-sort-col]');
      sortHeaders.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          if (orderTotalsSortCol === col) {
            orderTotalsSortDir = orderTotalsSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            orderTotalsSortCol = col;
            orderTotalsSortDir = (col === 'orders' || col === 'weight' || col === 'revenue') ? 'desc' : 'asc';
          }
          renderOrderTotalsTab();
        });
      });
    }

    function loadOrders(passcode, callback) {
      var fetchUrl = apiUrl + (apiUrl.indexOf('?') === -1 ? '?' : '&') +
        'action=admin_list&adminKey=' + encodeURIComponent(passcode);

      fetch(fetchUrl, {
        credentials: 'omit'
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            callback(data.error);
          } else if (data.orders) {
            isMockModeActive = false;
            currentOrders = data.orders;
            callback(null, currentOrders);
          } else {
            callback("Unexpected server response format");
          }
        })
        .catch(function (err) {
          callback("Could not connect to live order API (" + (err.message || 'Network error') + ").");
        });
    }

    function updateOrderStatus(orderId, newStatus, newDetails, notifyCustomer, callback) {
      if (typeof notifyCustomer === 'function') {
        callback = notifyCustomer;
        notifyCustomer = false;
      }
      var currentKey = getStoredKey();

      if (isMockModeActive) {
        setTimeout(function () {
          callback(null, { success: true, orderId: orderId, status: newStatus, emailSent: !!notifyCustomer });
        }, 300);
        return;
      }

      fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'admin_update_status',
          adminKey: currentKey,
          orderId: orderId,
          status: newStatus,
          statusDetails: newDetails,
          notifyCustomer: !!notifyCustomer
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) {
          callback(data.error);
        } else {
          callback(null, data);
        }
      })
      .catch(function (err) {
        callback("Network error during status update: " + err.message);
      });
    }

    // Gate form submit handler
    if (gateForm) {
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
          queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading orders...</div>';
          loadOrders(key, function (err) {
            if (!err) {
              renderStats();
              renderQueue();
            }
          });
        });
      });
    }

    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        var key = getStoredKey();
        if (!key) {
          showGate();
          return;
        }

        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Refreshing...';

        loadOrders(key, function (err, orders) {
          refreshBtn.disabled = false;
          refreshBtn.textContent = 'Refresh';

          if (err) {
            alert('Failed to refresh orders: ' + err);
          } else {
            renderStats();
            renderQueue();
            populateOrderTotalsFilters();
            if (activeTab === 'totals') renderOrderTotalsTab();
          }
        });
      });
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearStoredKey();
        currentOrders = [];
        selectedOrderId = null;
        showGate();
      });
    }

    // Tab switching
    if (tabsContainer) {
      var tabBtns = tabsContainer.querySelectorAll('.roast-admin-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var t = btn.getAttribute('data-tab');
          switchToTab(t);
        });
      });
    }

    // Totals filter change events
    var orderGroupPillsWrap = document.getElementById('order-totals-group-pills');
    if (orderGroupPillsWrap) {
      var groupPills = orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill');
      groupPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pill.classList.toggle('order-admin-filter-pill--active');
          var active = orderGroupPillsWrap.querySelectorAll('.order-admin-filter-pill--active');
          if (active.length === 0) {
            pill.classList.add('order-admin-filter-pill--active');
          }
          renderOrderTotalsTab();
        });
      });
    }

    if (totalsGroupBy) totalsGroupBy.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterYear) totalsFilterYear.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterMonth) totalsFilterMonth.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterRoast) totalsFilterRoast.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterSize) totalsFilterSize.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterCoffee && totalsFilterCoffee !== totalsFilterRoast) totalsFilterCoffee.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterStatus) totalsFilterStatus.addEventListener('change', renderOrderTotalsTab);
    if (totalsFilterDelivery) totalsFilterDelivery.addEventListener('change', renderOrderTotalsTab);

    // Filter pills
    if (filtersContainer) {
      var pills = filtersContainer.querySelectorAll('.order-admin-filter-pill');
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          pill.classList.add('order-admin-filter-pill--active');
          activeFilter = pill.getAttribute('data-filter') || 'all';
          renderQueue();
        });
      });
    }

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value.trim();
        renderQueue();
      });
    }

    // Check URL parameters for ?search= or ?id=
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        var qParams = new URLSearchParams(window.location.search);
        var qSearch = qParams.get('search') || qParams.get('id');
        if (qSearch) {
          currentSearch = qSearch.trim();
          if (searchInput) {
            searchInput.value = currentSearch;
          }
        }
      } catch (paramErr) {}
    }

    // Check stored key on init
    var storedKey = getStoredKey();
    if (storedKey) {
      showDashboard();
      queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading orders...</div>';

      loadOrders(storedKey, function (err, orders) {
        if (err) {
          var isAuthFailure = typeof err === 'string' && (err.indexOf('Unauthorized') !== -1 || err.indexOf('Invalid') !== -1);
          if (isAuthFailure) {
            clearStoredKey();
            showGate('Previous session expired. Please enter your passcode again.');
          } else {
            queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #c0392b; cursor: default;">' +
              'Could not connect to live order API (' + escapeHtml(err) + ').<br>' +
              '<button type="button" id="order-admin-retry-btn" class="order-admin-btn-sm" style="margin-top: 0.6rem; display: inline-block;">Retry Connection</button>' +
              '</div>';
            var retryBtn = document.getElementById('order-admin-retry-btn');
            retryBtn.addEventListener('click', function () {
              refreshBtn.click();
            });
          }
        } else {
          renderStats();
          renderQueue();
          populateOrderTotalsFilters();
          if (activeTab === 'totals') renderOrderTotalsTab();
          if (currentSearch) {
            var targetId = currentSearch.replace(/^#/, '');
            var matchOrder = currentOrders.find(function (o) { return o.orderId === targetId; });
            if (matchOrder) {
              selectedOrderId = matchOrder.orderId;
              var matchingCard = queueContainer.querySelector('[data-order-id="' + selectedOrderId + '"]');
              if (matchingCard) {
                matchingCard.click();
              } else {
                renderInspector(matchOrder);
              }
            }
          }
        }
      });
    } else {
      showGate();
    }
  }

  return {
    initAdminOrders: initAdminOrders,
    filterOrders: filterOrders,
    computeStats: computeStats,
    getStatusBadgeClass: getStatusBadgeClass,
    computeBrowserHash: computeBrowserHash,
    extractOrderDate: extractOrderDate,
    parseOrderLineItems: parseOrderLineItems,
    parseCurrency: parseCurrency,
    bagSizeToLbs: bagSizeToLbs,
    formatSizeCounts: formatSizeCounts,
    computeOrderTotals: computeOrderTotals,
    sortOrderTotalsRows: sortOrderTotalsRows,
    DEFAULT_MOCK_HASH: DEFAULT_MOCK_HASH,
    DEFAULT_MOCK_PASSCODE: DEFAULT_MOCK_PASSCODE,
    DEFAULT_SALT: DEFAULT_SALT,
    CANONICAL_MOCK_ORDERS: CANONICAL_MOCK_ORDERS
  };
});
