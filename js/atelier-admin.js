/**
 * Yellow Wing Roasters - Atelier Admin Redesign Interactive Engine
 * Connects directly to Google Sheets APIs and powers the unified Atelier interface
 * across Customer Orders, Active Green Beans, Green Bean Orders, Roast Logs,
 * Master Blend & Packaging, Subscriptions, Gift Subscriptions, and Gift/Promo Codes.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.initAtelierAdmin = factory(root).initAtelierAdmin;
  }
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var GRAMS_PER_LB = 453.592;

  function recomputeActiveBeanStocksLocal(state) {
    var roastHelper = (root && (root.RoastAdmin || root.AdminRoastsLogic)) ||
      (typeof window !== 'undefined' && (window.RoastAdmin || window.AdminRoastsLogic));
    if (roastHelper && roastHelper.recomputeActiveBeanStocks) {
      return roastHelper.recomputeActiveBeanStocks(state);
    }

    var roastedByOrder = {};
    (state.roastLogs || []).forEach(function (rLog) {
      (rLog.greenBeanComponents || []).forEach(function (gc) {
        roastedByOrder[gc.orderId] = (roastedByOrder[gc.orderId] || 0) + (Number(gc.weightGrams) || 0);
      });
    });

    var packagedByRoast = {};
    (state.blendPackagingLogs || []).forEach(function (pkg) {
      (pkg.roastComponents || []).forEach(function (c) {
        packagedByRoast[c.roastId] = (packagedByRoast[c.roastId] || 0) + (Number(c.weightGrams) || 0);
      });
    });

    var beanMap = {};
    var beanOrder = [];
    var orderNameById = {};

    (state.greenBeanOrders || []).forEach(function (ord) {
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
      var baseGrams = Math.round((Number(ord.weightLbs) || 0) * GRAMS_PER_LB);
      var adjGrams = Number(ord.adjustGrams) || 0;
      var netOrderGrams = Math.round(baseGrams + adjGrams);
      ord.weightGrams = netOrderGrams;
      ord.roastedGrams = roastedByOrder[ord.orderId] || 0;
      ord.availableGrams = Math.max(0, Math.round(netOrderGrams - ord.roastedGrams));
      beanMap[name].orderedGrams += netOrderGrams;
    });

    (state.roastLogs || []).forEach(function (rst) {
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
            if (beanMap[compOrdName]) {
              beanMap[compOrdName].roastedGrams += compGrams;
            }
          }
        });
        if (compBeanNames.length > 0) rst.beanName = compBeanNames.join(' / ');
        if (!rst.greenWeightGrams) rst.greenWeightGrams = compTotalGrams;
      } else {
        var resolvedName = String(rst.beanName || '').trim();
        rst.beanName = resolvedName;
        if (beanMap[resolvedName]) {
          beanMap[resolvedName].roastedGrams += (Number(rst.greenWeightGrams) || 0);
        }
      }
      rst.packagedGrams = packagedByRoast[rst.roastId] || 0;
      rst.availableGrams = Math.max(0, Math.round((Number(rst.endWeightGrams) || 0) - rst.packagedGrams));
    });

    if (beanOrder.length > 0) {
      state.greenBeans = beanOrder.map(function (name) {
        var b = beanMap[name];
        b.activeStockGrams = Math.round(b.orderedGrams - b.roastedGrams);
        return b;
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    return state.greenBeans;
  }

  function computeBrowserHash(key, salt) {
    var s = salt || DEFAULT_SALT;
    var rawText = s + (key || '').trim();
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      var msg = new TextEncoder().encode(rawText);
      return crypto.subtle.digest('SHA-256', msg).then(function (buf) {
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    return Promise.resolve('');
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getStatusBadge(status) {
    var norm = String(status || '').trim().toLowerCase();
    var cls = 'atelier-status-badge--received';
    if (norm === 'delayed' || norm === 'paused') cls = 'atelier-status-badge--delayed';
    else if (norm === 'roasted' || norm === 'scheduled') cls = 'atelier-status-badge--roasted';
    else if (norm === 'ready for pickup' || norm === 'ready to deliver' || norm === 'out for delivery' || norm === 'active') cls = 'atelier-status-badge--ready';
    else if (norm === 'delivered' || norm === 'completed' || norm === 'redeemed') cls = 'atelier-status-badge--delivered';
    else if (norm === 'cancelled' || norm === 'expired') cls = 'atelier-status-badge--cancelled';

    return '<span class="atelier-status-badge ' + cls + '">' +
      '<span class="atelier-status-pip"></span>' +
      escapeHtml(status || 'Received') +
      '</span>';
  }

  function splitOrderItemStrings(itemsStr) {
    if (!itemsStr) return [];
    var str = String(itemsStr).trim();
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
        var remaining = str.slice(i + 1);
        var isLegacyPyoPickList = /^(?:\d+\s*[x×]\s*)?peck your own\s*:/i.test(current.trim()) &&
          !/^\s*\d+\s*[x×]\s+/i.test(remaining);
        if (isLegacyPyoPickList) {
          current += char;
        } else {
          if (current.trim()) parts.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  }

  function extractItemQuantity(rawStr) {
    var str = String(rawStr || '').trim();
    var m = str.match(/^(\d+)\s*[x×]\s*(.+)$/i);
    if (m) {
      return {
        qty: parseInt(m[1], 10),
        text: m[2].trim()
      };
    }
    return {
      qty: 1,
      text: str
    };
  }

  function extractItemDetails(text) {
    var segments = [];
    var parenRegex = /\(([^)]*)\)?/g;
    var pMatch;
    while ((pMatch = parenRegex.exec(text)) !== null) {
      var inner = pMatch[1].trim();
      if (!inner) continue;
      inner.split(/;\s*/).forEach(function (seg) {
        var trimmed = seg.trim();
        if (trimmed) segments.push(trimmed);
      });
    }
    var cleanedText = text.replace(/\s*\([^)]*\)?\s*/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      text: cleanedText,
      segments: segments
    };
  }

  function extractItemPrice(text, segments) {
    var unitPrice = null;
    var priceBadge = '';
    var remainingSegments = [];

    (segments || []).forEach(function (seg) {
      var s = seg.trim();
      if (!s) return;

      var exactPriceMatch = s.match(/^(?:Price:\s*)?\$([0-9]+(?:\.[0-9]+)?)$/i) ||
        s.match(/^Price:\s*\$?([0-9]+(?:\.[0-9]+)?)$/i);
      if (exactPriceMatch) {
        var pNum = parseFloat(exactPriceMatch[1]);
        if (!isNaN(pNum)) {
          unitPrice = pNum;
          priceBadge = '$' + pNum.toFixed(2);
        }
        return;
      }

      var embeddedPriceRegex = /(?:^|,\s*)(?:Price:\s*\$?|\$)([0-9]+(?:\.[0-9]+)?)(?=\s*,|$)/i;
      var embeddedMatch = s.match(embeddedPriceRegex);
      if (embeddedMatch) {
        var embNum = parseFloat(embeddedMatch[1]);
        if (!isNaN(embNum) && unitPrice === null) {
          unitPrice = embNum;
          priceBadge = '$' + embNum.toFixed(2);
        }
        s = s.replace(embeddedPriceRegex, '').replace(/^,\s*|,\s*$/g, '').trim();
        if (!s) return;
      }

      remainingSegments.push(s);
    });

    var cleanedText = text;
    var inlinePriceRegex = /(?:^|[\s\-—@:]+)(?:Price:\s*\$?|\$)([0-9]+(?:\.[0-9]{1,2})?)(?=\b|\s|$)/i;
    var inlineMatch = cleanedText.match(inlinePriceRegex);
    if (inlineMatch) {
      var inNum = parseFloat(inlineMatch[1]);
      if (!isNaN(inNum) && unitPrice === null) {
        unitPrice = inNum;
        priceBadge = '$' + inNum.toFixed(2);
      }
      cleanedText = cleanedText.replace(inlinePriceRegex, ' ').replace(/\s+/g, ' ').trim();
    }

    return {
      text: cleanedText,
      segments: remainingSegments,
      unitPrice: unitPrice,
      priceBadge: priceBadge
    };
  }

  function extractItemBagSize(text) {
    var rest = String(text || '').trim();
    var bagSize = '';
    var bagsPerUnit = 1;

    var multiBagMatch = rest.match(/^(.+?)\s+(\d+)\s*[×x]\s*(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))(?:\s*bags?)?$/i);
    if (multiBagMatch) {
      rest = multiBagMatch[1].trim();
      bagsPerUnit = parseInt(multiBagMatch[2], 10) || 1;
      bagSize = multiBagMatch[3].replace(/\s+/g, '').toLowerCase();
    } else {
      var sizeMatch = rest.match(/^(.+?)\s+(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))(?:\s*bags?)?$/i);
      if (sizeMatch) {
        rest = sizeMatch[1].trim();
        bagSize = sizeMatch[2].replace(/\s+/g, '').toLowerCase();
      } else {
        var midSizeMatch = rest.match(/\b(\d+(?:\.\d+)?\s*(?:oz|lb|lbs))(?:\s*bags?)?\b/i);
        if (midSizeMatch) {
          bagSize = midSizeMatch[1].replace(/\s+/g, '').toLowerCase();
          rest = rest.replace(midSizeMatch[0], ' ').replace(/\s+/g, ' ').trim();
        }
      }
    }

    var product = rest.replace(/[\s\-—:;,]+$/, '').trim();
    return {
      product: product,
      bagSize: bagSize,
      bagsPerUnit: bagsPerUnit
    };
  }

  function formatItemMetadata(segments) {
    var metaParts = [];
    var grind = '';
    (segments || []).forEach(function (seg) {
      var grMatch = seg.match(/^Grind:\s*(.+)$/i);
      if (grMatch) {
        grind = grMatch[1].trim();
        metaParts.push(grind);
      } else {
        metaParts.push(seg);
      }
    });
    return {
      parts: metaParts,
      grind: grind
    };
  }

  function parsePeckYourOwnItem(item) {
    var colonMatch = item.product.match(/^peck your own\s*:\s*(.+)$/i);
    if (colonMatch) {
      var rawPicks = colonMatch[1].trim();
      item.product = 'Peck Your Own';
      var hasPicksMeta = item.metaParts.some(function (m) { return /^Picks:/i.test(m); });
      if (rawPicks && !hasPicksMeta) {
        item.metaParts.unshift('Picks: ' + rawPicks);
      }
    } else {
      item.product = 'Peck Your Own';
    }

    item.bagSize = '8oz';

    if (item.bagsPerUnit <= 1) {
      var picksEntry = item.metaParts.find(function (m) { return /^Picks:\s*(.+)$/i.test(m); });
      if (picksEntry) {
        var picksList = picksEntry.replace(/^Picks:\s*/i, '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (picksList.length > 0) {
          item.bagsPerUnit = picksList.length;
        }
      }
    }

    item.bagsCount = item.qty * item.bagsPerUnit;
    item.meta = item.metaParts.join(' • ');
    return item;
  }

  function findCatalogProduct(productName) {
    if (!productName || typeof window === 'undefined') return null;
    var norm = String(productName).trim().toLowerCase().replace(/['’]/g, '');
    var withoutFlight = norm.replace(/\s+flight$/, '').trim();
    var slugNorm = norm.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var slugWithoutFlight = withoutFlight.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    var catalogs = [window.YWR_ROASTS_DATA, window.YWR_SUBSCRIPTIONS_DATA];
    for (var c = 0; c < catalogs.length; c++) {
      var cat = catalogs[c];
      if (!cat) continue;
      if (cat[slugNorm]) return cat[slugNorm];
      if (cat[slugWithoutFlight]) return cat[slugWithoutFlight];
      var keys = Object.keys(cat);
      for (var i = 0; i < keys.length; i++) {
        var entry = cat[keys[i]];
        var entryTitle = String(entry.title || '').trim().toLowerCase().replace(/['’]/g, '');
        if (entryTitle && (entryTitle === norm || entryTitle === withoutFlight)) {
          return entry;
        }
      }
    }
    return null;
  }

  function getCatalogUnitPrice(config, bagSize, bagsPerUnit, preferBasePrice) {
    if (!config) return null;
    if (typeof config.price_per_bag === 'number') {
      var count = bagsPerUnit > 1 ? bagsPerUnit : (config.min_bags || 4);
      return count * config.price_per_bag;
    }
    if (bagSize) {
      if (preferBasePrice && config.price && typeof config.price === 'object' && typeof config.price[bagSize] === 'number') {
        return config.price[bagSize];
      }
      if (config.prices && typeof config.prices[bagSize] === 'number') {
        return config.prices[bagSize];
      }
      if (config.price && typeof config.price === 'object' && typeof config.price[bagSize] === 'number') {
        return config.price[bagSize];
      }
    }
    if (typeof config.price === 'number') {
      return config.price;
    }
    return null;
  }

  function parseOrderItem(rawLine, preferBasePrice) {
    var qtyRes = extractItemQuantity(rawLine);
    var detailRes = extractItemDetails(qtyRes.text);
    var priceRes = extractItemPrice(detailRes.text, detailRes.segments);
    var sizeRes = extractItemBagSize(priceRes.text);
    var metaRes = formatItemMetadata(priceRes.segments);

    var item = {
      qty: qtyRes.qty,
      bagsPerUnit: sizeRes.bagsPerUnit,
      bagsCount: qtyRes.qty * sizeRes.bagsPerUnit,
      product: sizeRes.product,
      bagSize: sizeRes.bagSize,
      grind: metaRes.grind,
      unitPrice: priceRes.unitPrice,
      linePrice: null,
      priceBadge: priceRes.priceBadge,
      hasExplicitPrice: priceRes.unitPrice !== null,
      metaParts: metaRes.parts,
      meta: metaRes.parts.join(' • '),
      raw: rawLine
    };

    if (/^peck your own\b/i.test(item.product)) {
      item = parsePeckYourOwnItem(item);
    }

    if (item.unitPrice === null) {
      var catConfig = findCatalogProduct(item.product);
      var catPrice = getCatalogUnitPrice(catConfig, item.bagSize, item.bagsPerUnit, !!preferBasePrice);
      if (catPrice !== null && !isNaN(catPrice)) {
        item.unitPrice = catPrice;
        item.priceBadge = '$' + catPrice.toFixed(2);
      }
    }

    if (item.unitPrice !== null && !isNaN(item.unitPrice)) {
      item.linePrice = Number((item.qty * item.unitPrice).toFixed(2));
    }

    return item;
  }

  function sumParsedLinePrices(items) {
    return items.reduce(function (acc, it) {
      return acc + (it.linePrice !== null ? it.linePrice : 0);
    }, 0);
  }

  function parseOrderItems(itemsStr, orderTotal) {
    var rawLines = splitOrderItemStrings(itemsStr);
    var items = rawLines.map(function (line) {
      return parseOrderItem(line, false);
    });

    if (orderTotal !== undefined && orderTotal !== null) {
      var hasInferred = items.some(function (it) { return !it.hasExplicitPrice; });
      var targetRev = parseCurrencyVal(orderTotal);
      if (hasInferred && targetRev > 0) {
        var currentDiff = Math.abs(sumParsedLinePrices(items) - targetRev);
        if (currentDiff > 0.01) {
          var baseItems = rawLines.map(function (line) {
            return parseOrderItem(line, true);
          });
          var baseDiff = Math.abs(sumParsedLinePrices(baseItems) - targetRev);
          if (baseDiff < currentDiff) {
            return baseItems;
          }
        }
      }
    }

    return items;
  }

  function injectMissingPricesIntoItemsString(itemsStr, orderTotal) {
    var rawLines = splitOrderItemStrings(itemsStr);
    if (!rawLines.length) return String(itemsStr || '');
    var parsed = parseOrderItems(itemsStr, orderTotal);
    var sep = String(itemsStr || '').indexOf('\n') !== -1 ? '\n' : ', ';

    var updated = rawLines.map(function (rawLine, idx) {
      var item = parsed[idx];
      if (!item || item.hasExplicitPrice || item.unitPrice === null) {
        return rawLine;
      }
      var priceToken = 'Price: $' + item.unitPrice.toFixed(2);
      if (/\([^)]*\)\s*$/.test(rawLine)) {
        return rawLine.replace(/\(([^)]*)\)\s*$/, function (_, inner) {
          var trimmedInner = inner.trim();
          return '(' + (trimmedInner ? (priceToken + '; ' + trimmedInner) : priceToken) + ')';
        });
      }
      return rawLine.trim() + ' (' + priceToken + ')';
    });

    return updated.join(sep);
  }

  function injectMissingGrindIntoItemsString(itemsStr, defaultGrind) {
    var rawLines = splitOrderItemStrings(itemsStr);
    if (!rawLines.length) return String(itemsStr || '');
    var grindToApply = String(defaultGrind || 'Whole Bean').trim();
    var parsed = parseOrderItems(itemsStr);
    var sep = String(itemsStr || '').indexOf('\n') !== -1 ? '\n' : ', ';

    var updated = rawLines.map(function (rawLine, idx) {
      var item = parsed[idx];
      if (!item || item.grind) {
        return rawLine;
      }
      var grindToken = 'Grind: ' + grindToApply;
      if (/\([^)]*\)\s*$/.test(rawLine)) {
        return rawLine.replace(/\(([^)]*)\)\s*$/, function (_, inner) {
          var trimmedInner = inner.trim();
          return '(' + (trimmedInner ? (trimmedInner + '; ' + grindToken) : grindToken) + ')';
        });
      }
      return rawLine.trim() + ' (' + grindToken + ')';
    });

    return updated.join(sep);
  }

  function formatItemPill(itemOrLine) {
    var parsed = (itemOrLine && typeof itemOrLine === 'object' && itemOrLine.product !== undefined)
      ? itemOrLine
      : parseOrderItem(itemOrLine);
    return '<div class="atelier-item-pill">' +
      '<span class="atelier-item-qty">' + parsed.qty + '×</span>' +
      '<span class="atelier-item-name">' + escapeHtml(parsed.product) + '</span>' +
      (parsed.bagSize ? '<span class="atelier-item-meta" style="font-weight: 700; color: #92400e; background: #fef3c7; border: 1px solid #fde68a;">' + escapeHtml(parsed.bagSize) + '</span>' : '') +
      (parsed.meta ? '<span class="atelier-item-meta">' + escapeHtml(parsed.meta) + '</span>' : '') +
      (parsed.priceBadge ? '<span class="atelier-item-meta" style="font-family: monospace; font-weight: 600; color: #6e5e54;">' + escapeHtml(parsed.priceBadge) + '</span>' : '') +
      '</div>';
  }

  function resolveAdminHash(passcode) {
    var trimmed = String(passcode || '').trim();
    if (/^[0-9a-f]{64}$/i.test(trimmed)) {
      return Promise.resolve(trimmed.toLowerCase());
    }
    return computeBrowserHash(trimmed);
  }

  function parseCurrencyVal(str) {
    var val = parseFloat(String(str || '0').replace(/[^0-9.-]/g, ''));
    return isNaN(val) ? 0 : val;
  }

  function formatCurrencyDisplay(val) {
    return '$' + parseCurrencyVal(val).toFixed(2);
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function parseYearMonth(rawDate) {
    if (!rawDate) return { year: 'Unknown', month: 'Unknown', yearMonth: 'Unknown' };
    var str = String(rawDate).trim();
    var isoMatch = str.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (isoMatch) {
      var yIso = isoMatch[1];
      var mNum = parseInt(isoMatch[2], 10);
      var mName = (mNum >= 1 && mNum <= 12) ? monthNames[mNum - 1] : ('Month ' + mNum);
      var mPadded = (mNum < 10 ? '0' : '') + mNum;
      return {
        year: yIso,
        month: mName,
        yearMonth: yIso + '-' + mPadded + ' (' + mName + ')'
      };
    }
    var dt = new Date(str);
    if (!isNaN(dt.getTime())) {
      var yDt = String(dt.getFullYear());
      var mNumDt = dt.getMonth() + 1;
      var mNameDt = monthNames[dt.getMonth()];
      var mPaddedDt = (mNumDt < 10 ? '0' : '') + mNumDt;
      return {
        year: yDt,
        month: mNameDt,
        yearMonth: yDt + '-' + mPaddedDt + ' (' + mNameDt + ')'
      };
    }
    return { year: 'Unknown', month: 'Unknown', yearMonth: 'Unknown' };
  }

  function formatRoastLevel(levelVal, roastLevelsMap) {
    if (levelVal === null || levelVal === undefined || levelVal === '') return '';
    var raw = String(levelVal).trim();
    var numMatch = raw.match(/^(?:level\s*)?(\d+)$/i);
    var lookupKey = numMatch ? numMatch[1] : raw;
    var entry = roastLevelsMap && roastLevelsMap[lookupKey];
    if (entry) {
      return entry.specialty || entry.name;
    }
    return raw;
  }

  function bagSizeToLbs(sizeStr, bagSizesList) {
    if (!sizeStr) return 0;
    var clean = String(sizeStr).trim().toLowerCase();
    if (Array.isArray(bagSizesList)) {
      var found = bagSizesList.find(function (b) {
        return b && String(b.id || '').toLowerCase() === clean;
      });
      if (found && found.weight_oz) {
        return Number(found.weight_oz) / 16;
      }
    }
    var m = clean.match(/^(\d+(?:\.\d+)?)\s*(oz|lb|lbs)$/);
    if (m) {
      var val = parseFloat(m[1]);
      return m[2] === 'oz' ? (val / 16) : val;
    }
    return 0;
  }

  function initAtelierAdmin(config) {
    var cfg = config || {};
    var ordersApiUrl = cfg.ordersApiUrl;
    var roastsApiUrl = cfg.roastsApiUrl;
    var subsApiUrl = cfg.subsApiUrl;
    var giftCodesApiUrl = cfg.giftCodesApiUrl;
    var giftSubsApiUrl = cfg.giftSubsApiUrl;
    var orderManageBaseUrl = cfg.orderManageBaseUrl || '/order/manage/';
    var subManageBaseUrl = cfg.subManageBaseUrl || '/subscriptions/manage/';
    var orderApplyBaseUrl = cfg.orderApplyBaseUrl || '/order/';
    var bagSizes = cfg.bagSizes || [];
    var roastLevels = cfg.roastLevels || {};

    var currentDomain = cfg.defaultDomain || 'orders';
    var ordersData = [];
    var roastsData = null;
    var subsData = [];
    var giftSubsData = [];
    var giftCodesData = { giftCards: [], promoCodes: [] };
    var selectedItem = null;

    var loadingState = {
      orders: false,
      roasts: false,
      subs: false,
      giftSubs: false,
      giftCodes: false
    };
    var errorState = {
      orders: null,
      roasts: null,
      subs: null,
      giftSubs: null,
      giftCodes: null
    };

    var activeStatusFilter = 'all';
    var activeGroupBys = [];
    var searchQuery = '';
    var supplierOrderFilter = '';

    if (typeof window !== 'undefined' && window.location && window.location.search) {
      var urlParams = new URLSearchParams(window.location.search);
      var qDomain = urlParams.get('domain') || urlParams.get('tab');
      if (qDomain) {
        if (qDomain === 'orders' && currentDomain === 'beans') currentDomain = 'bean_orders';
        else currentDomain = qDomain;
      }
      var qSearch = urlParams.get('search') || urlParams.get('id');
      if (qSearch) searchQuery = qSearch.trim();
    }

    var sortState = {
      orders: { col: 'date', dir: 'desc' },
      beans: { col: 'stockLbs', dir: 'desc' },
      bean_orders: { col: 'date', dir: 'desc' },
      roasts: { col: 'date', dir: 'desc' },
      packaging: { col: 'date', dir: 'desc' },
      subscriptions: { col: 'orderId', dir: 'desc' },
      gift_subs: { col: 'orderId', dir: 'desc' },
      gift_codes: { col: 'code', dir: 'asc' },
      groups: { col: 'revenue', dir: 'desc' }
    };

    var gateEl = document.getElementById('atelier-admin-gate');
    var dashboardEl = document.getElementById('atelier-admin-dashboard');
    var passcodeInput = document.getElementById('atelier-passcode-input');
    var gateForm = document.getElementById('atelier-gate-form');
    var gateError = document.getElementById('atelier-gate-error');
    var refreshBtn = document.getElementById('atelier-refresh-btn');
    var logoutBtn = document.getElementById('atelier-logout-btn');

    function getStoredKey() {
      try {
        return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
      } catch (e) {
        return '';
      }
    }

    function saveKey(k) {
      try {
        sessionStorage.setItem(STORAGE_KEY, k);
        localStorage.setItem(STORAGE_KEY, k);
      } catch (e) {}
    }

    function clearStoredKey() {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }

    function loadOrders(key, cb) {
      if (!ordersApiUrl) return cb('Missing ordersApiUrl');
      loadingState.orders = true;
      errorState.orders = null;
      fetch(ordersApiUrl + '?action=admin_list&adminKey=' + encodeURIComponent(key), { credentials: 'omit' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          loadingState.orders = false;
          if (data.error) {
            errorState.orders = data.error;
            cb(data.error);
          } else {
            cb(null, data.orders || []);
          }
        })
        .catch(function (err) {
          loadingState.orders = false;
          errorState.orders = err.message || 'Network error';
          cb(errorState.orders);
        });
    }

    function loadRoasts(key, cb) {
      if (!roastsApiUrl) return cb('Missing roastsApiUrl');
      loadingState.roasts = true;
      errorState.roasts = null;
      resolveAdminHash(key).then(function (token) {
        fetch(roastsApiUrl, {
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
            loadingState.roasts = false;
            if (data.error) {
              errorState.roasts = data.error;
              cb(data.error);
            } else {
              var state = {
                greenBeans: data.greenBeans || [],
                greenBeanOrders: data.greenBeanOrders || [],
                roastLogs: data.roastLogs || [],
                blendPackagingLogs: data.blendPackagingLogs || []
              };
              try {
                recomputeActiveBeanStocksLocal(state);
              } catch (e) {
                console.error('Error recomputing bean stocks:', e);
              }
              cb(null, state);
            }
          })
          .catch(function (err) {
            loadingState.roasts = false;
            errorState.roasts = err.message || 'Network error';
            cb(errorState.roasts);
          });
      });
    }

    function loadSubscriptions(key, cb) {
      if (!subsApiUrl) return cb('Missing subsApiUrl');
      loadingState.subs = true;
      errorState.subs = null;
      resolveAdminHash(key).then(function (adminHash) {
        fetch(subsApiUrl + '?action=admin_list&adminHash=' + encodeURIComponent(adminHash), { credentials: 'omit' })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            loadingState.subs = false;
            if (data.error) {
              errorState.subs = data.error;
              cb(data.error);
            } else {
              cb(null, data.subscriptions || []);
            }
          })
          .catch(function (err) {
            loadingState.subs = false;
            errorState.subs = err.message || 'Network error';
            cb(errorState.subs);
          });
      });
    }

    function loadGiftSubs(key, cb) {
      if (!giftSubsApiUrl) return cb('Missing giftSubsApiUrl');
      loadingState.giftSubs = true;
      errorState.giftSubs = null;
      resolveAdminHash(key).then(function (adminHash) {
        fetch(giftSubsApiUrl + '?action=admin_list&adminHash=' + encodeURIComponent(adminHash), { credentials: 'omit' })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            loadingState.giftSubs = false;
            if (data.error) {
              errorState.giftSubs = data.error;
              cb(data.error);
            } else {
              cb(null, data.giftSubscriptions || []);
            }
          })
          .catch(function (err) {
            loadingState.giftSubs = false;
            errorState.giftSubs = err.message || 'Network error';
            cb(errorState.giftSubs);
          });
      });
    }

    function loadGiftCodes(key, cb) {
      if (!giftCodesApiUrl) return cb('Missing giftCodesApiUrl');
      loadingState.giftCodes = true;
      errorState.giftCodes = null;
      resolveAdminHash(key).then(function (adminHash) {
        fetch(giftCodesApiUrl + '?action=admin_list&adminHash=' + encodeURIComponent(adminHash), { credentials: 'omit' })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            loadingState.giftCodes = false;
            if (data.error) {
              errorState.giftCodes = data.error;
              cb(data.error);
            } else {
              cb(null, {
                giftCards: data.giftCards || [],
                promoCodes: data.promoCodes || []
              });
            }
          })
          .catch(function (err) {
            loadingState.giftCodes = false;
            errorState.giftCodes = err.message || 'Network error';
            cb(errorState.giftCodes);
          });
      });
    }

    function renderKPICards() {
      var kpiWrap = document.getElementById('atelier-kpi-container');
      if (!kpiWrap) return;

      if (currentDomain === 'orders') {
        var activeOrders = ordersData.filter(function (o) {
          var s = String(o.status || '').toLowerCase();
          return s !== 'delivered' && s !== 'cancelled';
        });
        var totalRev = ordersData.reduce(function (acc, o) {
          var s = String(o.status || '').toLowerCase();
          if (s === 'cancelled') return acc;
          return acc + parseCurrencyVal(o.total);
        }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Active Orders in Queue</div>' +
            '<div class="atelier-kpi-val">' + activeOrders.length + ' <span class="atelier-kpi-unit">active</span></div>' +
            '<div class="atelier-kpi-sub">Out of ' + ordersData.length + ' total orders logged</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--roast">' +
            '<div class="atelier-kpi-label">Total Revenue</div>' +
            '<div class="atelier-kpi-val">$' + totalRev.toFixed(2) + '</div>' +
            '<div class="atelier-kpi-sub">Across all non-cancelled orders</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--green">' +
            '<div class="atelier-kpi-label">Delivery Routing</div>' +
            '<div class="atelier-kpi-val">' +
              ordersData.filter(function (o) { return /pickup/i.test(o.deliveryMethod); }).length +
              ' <span class="atelier-kpi-unit">Pickup</span> &bull; ' +
              ordersData.filter(function (o) { return /delivery/i.test(o.deliveryMethod); }).length +
              ' <span class="atelier-kpi-unit">Delivery</span>' +
            '</div>' +
            '<div class="atelier-kpi-sub">Real-time fulfillment tracking</div>' +
          '</div>';
      } else if (currentDomain === 'beans') {
        var beans = (roastsData && roastsData.greenBeans) || [];
        var activeBeans = beans.filter(function (b) { return (Number(b.activeStockGrams) || 0) > 0; });
        var totalStockLbs = beans.reduce(function (acc, b) {
          return acc + ((Number(b.activeStockGrams) || 0) / GRAMS_PER_LB);
        }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--green">' +
            '<div class="atelier-kpi-label">Active Green Lots</div>' +
            '<div class="atelier-kpi-val">' + activeBeans.length + ' <span class="atelier-kpi-unit">lots</span></div>' +
            '<div class="atelier-kpi-sub">' + Math.max(0, beans.length - activeBeans.length) + ' depleted lots archived</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Total Active Green Stock</div>' +
            '<div class="atelier-kpi-val">' + totalStockLbs.toFixed(1) + ' <span class="atelier-kpi-unit">lbs</span></div>' +
            '<div class="atelier-kpi-sub">' + Math.round(totalStockLbs * GRAMS_PER_LB) + ' grams ready for roasting</div>' +
          '</div>';
      } else if (currentDomain === 'bean_orders') {
        var gbOrders = (roastsData && roastsData.greenBeanOrders) || [];
        var totalSpent = gbOrders.reduce(function (acc, o) { return acc + (Number(o.cost) || 0); }, 0);
        var totalLbs = gbOrders.reduce(function (acc, o) { return acc + (Number(o.weightLbs) || 0); }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--green">' +
            '<div class="atelier-kpi-label">Green Bean Purchases</div>' +
            '<div class="atelier-kpi-val">' + gbOrders.length + ' <span class="atelier-kpi-unit">orders</span></div>' +
            '<div class="atelier-kpi-sub">' + totalLbs.toFixed(1) + ' lbs total green coffee purchased</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--roast">' +
            '<div class="atelier-kpi-label">Total Green Bean Spend</div>' +
            '<div class="atelier-kpi-val">$' + totalSpent.toFixed(2) + '</div>' +
            '<div class="atelier-kpi-sub">Avg $' + (totalLbs > 0 ? (totalSpent / totalLbs).toFixed(2) : '0.00') + ' / lb landed</div>' +
          '</div>';
      } else if (currentDomain === 'roasts') {
        var roasts = (roastsData && roastsData.roastLogs) || [];
        var totalBatches = roasts.length;
        var totalYieldLbs = roasts.reduce(function (acc, r) {
          return acc + ((Number(r.endWeightGrams) || 0) / GRAMS_PER_LB);
        }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--roast">' +
            '<div class="atelier-kpi-label">Batches Roasted</div>' +
            '<div class="atelier-kpi-val">' + totalBatches + ' <span class="atelier-kpi-unit">batches</span></div>' +
            '<div class="atelier-kpi-sub">Small-batch drum roasted on Aillio Bullet</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Total Roasted Yield</div>' +
            '<div class="atelier-kpi-val">' + totalYieldLbs.toFixed(1) + ' <span class="atelier-kpi-unit">lbs</span></div>' +
            '<div class="atelier-kpi-sub">' + Math.round(totalYieldLbs * GRAMS_PER_LB) + ' grams roasted output</div>' +
          '</div>';
      } else if (currentDomain === 'packaging') {
        var pkgLogs = (roastsData && roastsData.blendPackagingLogs) || [];
        var totalPkgGrams = pkgLogs.reduce(function (acc, p) { return acc + (Number(p.weightGrams) || 0); }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Packaging &amp; Blend Logs</div>' +
            '<div class="atelier-kpi-val">' + pkgLogs.length + ' <span class="atelier-kpi-unit">records</span></div>' +
            '<div class="atelier-kpi-sub">Allocated from roasted batches</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--roast">' +
            '<div class="atelier-kpi-label">Total Packaged Weight</div>' +
            '<div class="atelier-kpi-val">' + (totalPkgGrams / GRAMS_PER_LB).toFixed(1) + ' <span class="atelier-kpi-unit">lbs</span></div>' +
            '<div class="atelier-kpi-sub">' + totalPkgGrams + 'g bagged for orders &amp; samples</div>' +
          '</div>';
      } else if (currentDomain === 'subscriptions') {
        var activeSubs = subsData.filter(function (s) { return String(s.status || '').toLowerCase() === 'active'; });
        var cycleRev = activeSubs.reduce(function (acc, s) { return acc + parseCurrencyVal(s.cost); }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--green">' +
            '<div class="atelier-kpi-label">Active Subscriptions</div>' +
            '<div class="atelier-kpi-val">' + activeSubs.length + ' <span class="atelier-kpi-unit">active</span></div>' +
            '<div class="atelier-kpi-sub">Out of ' + subsData.length + ' total recurring subscriptions</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Recurring Cycle Revenue</div>' +
            '<div class="atelier-kpi-val">$' + cycleRev.toFixed(2) + ' <span class="atelier-kpi-unit">/ cycle</span></div>' +
            '<div class="atelier-kpi-sub">Scheduled recurring roast fulfillment</div>' +
          '</div>';
      } else if (currentDomain === 'gift_subs') {
        var gSubRev = giftSubsData.reduce(function (acc, s) {
          return acc + parseCurrencyVal(s.cost);
        }, 0);

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Gift Subscriptions</div>' +
            '<div class="atelier-kpi-val">' + giftSubsData.length + ' <span class="atelier-kpi-unit">purchases</span></div>' +
            '<div class="atelier-kpi-sub">Total prepaid gift subscriptions logged</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--roast">' +
            '<div class="atelier-kpi-label">Total Prepaid Revenue</div>' +
            '<div class="atelier-kpi-val">$' + gSubRev.toFixed(2) + '</div>' +
            '<div class="atelier-kpi-sub">Across all gift subscription purchases</div>' +
          '</div>';
      } else if (currentDomain === 'gift_codes') {
        var cards = giftCodesData.giftCards || [];
        var promos = giftCodesData.promoCodes || [];
        var activeCards = cards.filter(function (c) { return (Number(c.currentBalance) || 0) > 0 && String(c.status || '').toLowerCase() === 'active'; });
        var totalBalance = activeCards.reduce(function (acc, c) { return acc + (Number(c.currentBalance) || 0); }, 0);
        var activePromos = promos.filter(function (p) { return String(p.status || '').toLowerCase() === 'active'; });

        kpiWrap.innerHTML = '' +
          '<div class="atelier-kpi-card atelier-kpi-card--green">' +
            '<div class="atelier-kpi-label">Active Gift Card Balance</div>' +
            '<div class="atelier-kpi-val">$' + totalBalance.toFixed(2) + '</div>' +
            '<div class="atelier-kpi-sub">' + activeCards.length + ' active cards (' + cards.length + ' total issued)</div>' +
          '</div>' +
          '<div class="atelier-kpi-card atelier-kpi-card--gold">' +
            '<div class="atelier-kpi-label">Live Promo &amp; Discount Codes</div>' +
            '<div class="atelier-kpi-val">' + activePromos.length + ' <span class="atelier-kpi-unit">active</span></div>' +
            '<div class="atelier-kpi-sub">' + promos.length + ' total discount codes configured</div>' +
          '</div>';
      }
    }

    function renderQueryDeck() {
      var queryDeck = document.getElementById('atelier-query-deck');
      if (!queryDeck) return;

      var filtersHtml = '';
      if (currentDomain === 'orders') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE STATUS =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Non-Cancelled</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'active' ? ' is-selected' : '') + '" data-status="active">Active (Queue)</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Received' ? ' is-selected' : '') + '" data-status="Received">Received</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Roasted' ? ' is-selected' : '') + '" data-status="Roasted">Roasted</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Ready for Pickup' ? ' is-selected' : '') + '" data-status="Ready for Pickup">Ready for Pickup</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Delivered' ? ' is-selected' : '') + '" data-status="Delivered">Delivered</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search orders, coffees, customers..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('all') !== -1 ? ' is-selected' : '') + '" data-group="all">Total Rollup</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('year') !== -1 ? ' is-selected' : '') + '" data-group="year">Year</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('month') !== -1 ? ' is-selected' : '') + '" data-group="month">Month</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('roast') !== -1 ? ' is-selected' : '') + '" data-group="roast">Coffee Roast</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('size') !== -1 ? ' is-selected' : '') + '" data-group="size">Bag Size</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('grind') !== -1 ? ' is-selected' : '') + '" data-group="grind">Grind Size</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('status') !== -1 ? ' is-selected' : '') + '" data-group="status">Fulfillment Status</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('deliveryMethod') !== -1 ? ' is-selected' : '') + '" data-group="deliveryMethod">Delivery Method</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('city') !== -1 ? ' is-selected' : '') + '" data-group="city">City</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('customer') !== -1 ? ' is-selected' : '') + '" data-group="customer">Customer</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'beans') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE STOCK =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">Active Inventory (&gt;0g)</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all_with_depleted' ? ' is-selected' : '') + '" data-status="all_with_depleted">Include Depleted Lots</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search bean names, suppliers..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('supplier') !== -1 ? ' is-selected' : '') + '" data-group="supplier">Supplier</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('bean') !== -1 ? ' is-selected' : '') + '" data-group="bean">Bean Origin</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'bean_orders') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE LOT =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Purchases</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'available' ? ' is-selected' : '') + '" data-status="available">In Stock (&gt;0g Remaining)</button>' +
              '</div>' +
            '</div>' +
            (supplierOrderFilter ? '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE SUPPLIER # =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill is-selected" data-clear-supplier-order>' + escapeHtml(supplierOrderFilter) + ' ✕</button>' +
              '</div>' +
            '</div>' : '') +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search GBO ID, supplier, bean name..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('all') !== -1 ? ' is-selected' : '') + '" data-group="all">All (Total)</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('year') !== -1 ? ' is-selected' : '') + '" data-group="year">Year</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('month') !== -1 ? ' is-selected' : '') + '" data-group="month">Month</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('supplier') !== -1 ? ' is-selected' : '') + '" data-group="supplier">Supplier</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('bean') !== -1 ? ' is-selected' : '') + '" data-group="bean">Bean Name</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'roasts') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE STOCK =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Batches</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'available' ? ' is-selected' : '') + '" data-status="available">Unpackaged Available (&gt;0g)</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search roast ID, bean lot, level..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('all') !== -1 ? ' is-selected' : '') + '" data-group="all">All (Total)</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('year') !== -1 ? ' is-selected' : '') + '" data-group="year">Year</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('month') !== -1 ? ' is-selected' : '') + '" data-group="month">Month</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('bean') !== -1 ? ' is-selected' : '') + '" data-group="bean">Bean Lot</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('roastLevel') !== -1 ? ' is-selected' : '') + '" data-group="roastLevel">Roast Level</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'packaging') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE PURPOSE =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Packaging</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Order' ? ' is-selected' : '') + '" data-status="Order">Customer Orders</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Subscription' ? ' is-selected' : '') + '" data-status="Subscription">Subscriptions</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Sample' ? ' is-selected' : '') + '" data-status="Sample">Samples</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search PKG ID, product, notes..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('all') !== -1 ? ' is-selected' : '') + '" data-group="all">All (Total)</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('year') !== -1 ? ' is-selected' : '') + '" data-group="year">Year</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('month') !== -1 ? ' is-selected' : '') + '" data-group="month">Month</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('product') !== -1 ? ' is-selected' : '') + '" data-group="product">Product / Blend</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('bagSize') !== -1 ? ' is-selected' : '') + '" data-group="bagSize">Bag Size</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('purpose') !== -1 ? ' is-selected' : '') + '" data-group="purpose">Purpose</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'subscriptions') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE STATUS =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Subscriptions</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Active' ? ' is-selected' : '') + '" data-status="Active">Active</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Paused' ? ' is-selected' : '') + '" data-status="Paused">Paused</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'Cancelled' ? ' is-selected' : '') + '" data-status="Cancelled">Cancelled</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search subscriber, roast, frequency..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>' +
          '<div class="atelier-query-row" style="border-top: 1px dashed #ede5da; padding-top: 0.75rem;">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">GROUP BY (MULTI-SELECT) =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('roast') !== -1 ? ' is-selected' : '') + '" data-group="roast">Roast</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('size') !== -1 ? ' is-selected' : '') + '" data-group="size">Bag Size</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('frequency') !== -1 ? ' is-selected' : '') + '" data-group="frequency">Frequency</button>' +
                '<button type="button" class="atelier-pill' + (activeGroupBys.indexOf('status') !== -1 ? ' is-selected' : '') + '" data-group="status">Status</button>' +
                (activeGroupBys.length > 0 ? '<button type="button" class="atelier-pill" data-group="clear" style="border-style: dashed; color: #b91c1c;">✕ Clear Grouping</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'gift_subs') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-search-box" style="flex: 1; max-width: 28rem;">' +
              '<input type="search" id="atelier-search-input" placeholder="Search recipient, purchaser, roast, duration..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>';
      } else if (currentDomain === 'gift_codes') {
        filtersHtml = '' +
          '<div class="atelier-query-row">' +
            '<div class="atelier-query-clause">' +
              '<span class="atelier-clause-badge">WHERE CODE TYPE =</span>' +
              '<div class="atelier-filter-pills">' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'all' ? ' is-selected' : '') + '" data-status="all">All Gift Cards &amp; Promos</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'gift_cards' ? ' is-selected' : '') + '" data-status="gift_cards">Digital Gift Cards</button>' +
                '<button type="button" class="atelier-pill' + (activeStatusFilter === 'promo_codes' ? ' is-selected' : '') + '" data-status="promo_codes">Promo &amp; Discount Codes</button>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-search-box">' +
              '<input type="search" id="atelier-search-input" placeholder="Search code, recipient, purchaser, description..." value="' + escapeHtml(searchQuery) + '">' +
            '</div>' +
          '</div>';
      }

      queryDeck.innerHTML = filtersHtml;

      queryDeck.querySelectorAll('.atelier-pill[data-status]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeStatusFilter = btn.getAttribute('data-status');
          renderAll();
        });
      });

      queryDeck.querySelectorAll('.atelier-pill[data-group]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var g = btn.getAttribute('data-group');
          if (g === 'clear') {
            activeGroupBys = [];
          } else if (g === 'all') {
            activeGroupBys = ['all'];
          } else {
            var allIdx = activeGroupBys.indexOf('all');
            if (allIdx !== -1) activeGroupBys.splice(allIdx, 1);
            var idx = activeGroupBys.indexOf(g);
            if (idx === -1) activeGroupBys.push(g);
            else activeGroupBys.splice(idx, 1);
          }
          renderAll();
        });
      });

      queryDeck.querySelectorAll('[data-clear-supplier-order]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          supplierOrderFilter = '';
          renderAll();
        });
      });

      var sInput = document.getElementById('atelier-search-input');
      if (sInput) {
        sInput.addEventListener('input', function () {
          searchQuery = sInput.value;
          renderTable();
        });
      }
    }

    function renderSortTh(label, colKey, domainKey, alignRight, width) {
      var curSort = sortState[domainKey] || { col: '', dir: 'asc' };
      var isSorted = curSort.col === colKey;
      var icon = isSorted
        ? (curSort.dir === 'asc' ? ' ▲' : ' ▼')
        : '<span style="opacity: 0.35; margin-left: 0.25rem;">↕</span>';
      var style = '';
      if (width) style += 'width: ' + width + '; ';
      if (alignRight) style += 'text-align: right; ';

      return '<th class="atelier-th-sortable' + (isSorted ? ' is-sorted' : '') + '" ' +
        'data-sort-col="' + escapeHtml(colKey) + '" ' +
        'data-sort-domain="' + escapeHtml(domainKey) + '" ' +
        (style ? 'style="' + style + '"' : '') + '>' +
        escapeHtml(label) + icon + '</th>';
    }

    function wireSorting(wrap) {
      wrap.querySelectorAll('th.atelier-th-sortable').forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.getAttribute('data-sort-col');
          var domain = th.getAttribute('data-sort-domain');
          if (!col || !domain) return;
          var cur = sortState[domain];
          if (cur.col === col) {
            cur.dir = cur.dir === 'asc' ? 'desc' : 'asc';
          } else {
            cur.col = col;
            cur.dir = (col === 'total' || col === 'revenue' || col === 'count' || col === 'bags' || col === 'stockLbs' || col === 'cost' || col === 'weightLbs') ? 'desc' : 'asc';
          }
          renderTable();
        });
      });
    }

    function renderLoadingOrErrorBanner(domainKey, label) {
      var isRoastDomain = (domainKey === 'beans' || domainKey === 'bean_orders' || domainKey === 'roasts' || domainKey === 'packaging');
      var stateKey = isRoastDomain ? 'roasts' : (domainKey === 'subscriptions' ? 'subs' : (domainKey === 'gift_subs' ? 'giftSubs' : (domainKey === 'gift_codes' ? 'giftCodes' : 'orders')));
      if (loadingState[stateKey]) {
        return '<div class="atelier-pacifier-wrap">' +
          '<div class="atelier-pacifier">' +
            '<span class="atelier-spinner"></span>' +
            '<span>Syncing live <strong>' + escapeHtml(label) + '</strong> with Google Sheets...</span>' +
          '</div>' +
          '</div>';
      }
      if (errorState[stateKey]) {
        return '<div style="padding: 1.5rem; margin: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #b91c1c; font-size: 0.85rem;">' +
          '<strong>Google Sheets API Notice (' + escapeHtml(label) + '):</strong> ' + escapeHtml(errorState[stateKey]) +
          '</div>';
      }
      return '';
    }

    function renderTable() {
      var wrap = document.getElementById('atelier-table-container');
      if (!wrap) return;

      if (currentDomain === 'orders') {
        var filtered = ordersData.filter(function (o) {
          var s = String(o.status || '').toLowerCase();
          if (activeStatusFilter === 'all') {
            if (s === 'cancelled') return false;
          } else if (activeStatusFilter === 'active') {
            if (s === 'delivered' || s === 'cancelled') return false;
          } else {
            if (s !== activeStatusFilter.toLowerCase()) return false;
          }
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = (o.orderId + ' ' + o.name + ' ' + o.email + ' ' + o.items).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var groups = {};
          filtered.forEach(function (o) {
            var orderRev = parseCurrencyVal(o.total);
            var parsedLines = parseOrderItems(o.items, o.total);
            var totalOrderBags = parsedLines.reduce(function (acc, pl) { return acc + pl.bagsCount; }, 0) || 1;
            var totalOrderWeightLbs = parsedLines.reduce(function (acc, pl) {
              return acc + (pl.bagsCount * bagSizeToLbs(pl.bagSize, bagSizes));
            }, 0);

            var isLineSplit = (activeGroupBys.indexOf('roast') !== -1 || activeGroupBys.indexOf('size') !== -1 || activeGroupBys.indexOf('grind') !== -1) && parsedLines.length > 0;
            var splits = isLineSplit
              ? parsedLines
              : [{
                  bagsCount: totalOrderBags,
                  weightLbs: totalOrderWeightLbs,
                  linePrice: orderRev,
                  product: parsedLines[0] ? parsedLines[0].product : '',
                  bagSize: parsedLines[0] ? parsedLines[0].bagSize : '',
                  grind: parsedLines[0] ? parsedLines[0].grind : ''
                }];

            var knownRevSum = 0;
            var unpricedBags = 0;
            if (isLineSplit) {
              parsedLines.forEach(function (pl) {
                if (pl.linePrice !== null && pl.linePrice !== undefined) {
                  knownRevSum += pl.linePrice;
                } else {
                  unpricedBags += (pl.bagsCount || pl.qty || 1);
                }
              });
            }

            var ymInfo = parseYearMonth(o.timestamp);
            splits.forEach(function (sp) {
              var dimVals = {};
              var keyParts = [];
              activeGroupBys.forEach(function (dim) {
                var val = 'Total';
                if (dim === 'all') val = 'Total Rollup';
                else if (dim === 'year') val = ymInfo.year;
                else if (dim === 'month') val = ymInfo.month;
                else if (dim === 'customer') val = o.name || 'Anonymous';
                else if (dim === 'size') val = sp.bagSize || 'Unassigned';
                else if (dim === 'roast') val = sp.product || 'Unassigned';
                else if (dim === 'grind') val = sp.grind || 'Unspecified';
                else val = String(o[dim] || 'Unassigned');
                dimVals[dim] = val;
                keyParts.push(val);
              });

              var groupKey = keyParts.join(' • ');
              if (!groups[groupKey]) {
                groups[groupKey] = {
                  dimValues: dimVals,
                  label: groupKey,
                  count: 0,
                  revenue: 0,
                  bags: 0,
                  weightLbs: 0
                };
              }
              var lineBags = sp.bagsCount || sp.qty || 1;
              var lineWeightLbs = sp.weightLbs !== undefined
                ? sp.weightLbs
                : (lineBags * bagSizeToLbs(sp.bagSize, bagSizes));
              var lineRev = 0;
              if (!isLineSplit) {
                lineRev = orderRev;
              } else if (sp.linePrice !== null && sp.linePrice !== undefined) {
                lineRev = sp.linePrice;
              } else if (unpricedBags > 0) {
                var remainingRev = Math.max(0, orderRev - knownRevSum);
                lineRev = remainingRev * (lineBags / unpricedBags);
              }
              groups[groupKey].count++;
              groups[groupKey].revenue += lineRev;
              groups[groupKey].bags += lineBags;
              groups[groupKey].weightLbs += lineWeightLbs;
            });
          });

          var gRows = Object.keys(groups).map(function (k) { return groups[k]; });
          var gSort = sortState.groups;
          gRows.sort(function (a, b) {
            var av = a[gSort.col] !== undefined ? a[gSort.col] : (a.dimValues[gSort.col] || '');
            var bv = b[gSort.col] !== undefined ? b[gSort.col] : (b.dimValues[gSort.col] || '');
            if (typeof av === 'number' && typeof bv === 'number') {
              return gSort.dir === 'asc' ? av - bv : bv - av;
            }
            return gSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
          });

          var gHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Orders Summary (' + activeGroupBys.map(function (d) { return d.toUpperCase(); }).join(' + ') + ')</h3>' +
            '<span class="atelier-count-pill">' + gRows.length + ' grouped rollups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';

          activeGroupBys.forEach(function (dim) {
            gHtml += renderSortTh(dim.toUpperCase(), dim, 'groups', false);
          });
          gHtml += renderSortTh('BAGS', 'bags', 'groups', true) +
            renderSortTh('WEIGHT (LBS)', 'weightLbs', 'groups', true) +
            renderSortTh('LINE / ORDER COUNT', 'count', 'groups', true) +
            renderSortTh('REVENUE', 'revenue', 'groups', true) +
            '</tr></thead><tbody>';

          var sumBags = 0;
          var sumWeightLbs = 0;
          var sumCount = 0;
          var sumRev = 0;

          gRows.forEach(function (g) {
            sumBags += g.bags;
            sumWeightLbs += g.weightLbs;
            sumCount += g.count;
            sumRev += g.revenue;
            gHtml += '<tr>';
            activeGroupBys.forEach(function (dim) {
              gHtml += '<td><strong>' + escapeHtml(g.dimValues[dim] || '') + '</strong></td>';
            });
            gHtml += '<td style="text-align: right; font-family: monospace; font-weight: 700;">' + g.bags + '</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700;">' + g.weightLbs.toFixed(2) + ' lbs</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700;">' + g.count + '</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + g.revenue.toFixed(2) + '</td>' +
              '</tr>';
          });
          gHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #faf6ef; border-top: 2px solid #e2d7c5;">' +
            '<td colspan="' + activeGroupBys.length + '">Total (' + gRows.length + ' groups)</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumBags + '</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumWeightLbs.toFixed(2) + ' lbs</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumCount + '</td>' +
            '<td style="text-align: right; font-family: monospace; color: #92400e;">$' + sumRev.toFixed(2) + '</td>' +
            '</tr></tfoot></table></div>';
          wrap.innerHTML = gHtml;
          wireSorting(wrap);
          return;
        }

        var oSort = sortState.orders;
        filtered.sort(function (a, b) {
          var av, bv;
          if (oSort.col === 'date') {
            av = new Date(a.timestamp || 0).getTime();
            bv = new Date(b.timestamp || 0).getTime();
          } else if (oSort.col === 'orderId') {
            av = parseInt(a.orderId, 10) || 0;
            bv = parseInt(b.orderId, 10) || 0;
          } else if (oSort.col === 'customer') {
            av = a.name || '';
            bv = b.name || '';
          } else if (oSort.col === 'total') {
            av = parseCurrencyVal(a.total);
            bv = parseCurrencyVal(b.total);
          } else {
            av = a[oSort.col] || '';
            bv = b[oSort.col] || '';
          }
          if (typeof av === 'number' && typeof bv === 'number') {
            return oSort.dir === 'asc' ? av - bv : bv - av;
          }
          return oSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var banner = renderLoadingOrErrorBanner('orders', 'Customer Orders');
        var html = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Live Customer Orders</h3>' +
          '<span class="atelier-count-pill">' + filtered.length + ' orders</span>' +
          '</div>' + banner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('DATE', 'date', 'orders', false, '5rem') +
          renderSortTh('ORDER #', 'orderId', 'orders', false, '4rem') +
          renderSortTh('CUSTOMER', 'customer', 'orders', false, '26%') +
          '<th style="width: 40%; min-width: 14rem;">ORDERED ITEMS</th>' +
          renderSortTh('TOTAL', 'total', 'orders', true, '4.5rem') +
          renderSortTh('STATUS', 'status', 'orders', false, '7.5rem') +
          '<th style="width: 3.75rem; text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filtered.forEach(function (ord) {
          var isSel = selectedItem && selectedItem.orderId === ord.orderId;
          var parsedItems = parseOrderItems(ord.items, ord.total);
          var itemsHtml = '<div class="atelier-item-flow">' +
            parsedItems.map(formatItemPill).join('') +
            '</div>';

          html += '<tr class="' + (isSel ? 'is-selected' : '') + '" data-order-id="' + escapeHtml(ord.orderId) + '">' +
            '<td style="font-family: monospace; font-size: 0.76rem; color: #7d6b5e; white-space: nowrap;">' + escapeHtml(String(ord.timestamp || '').split(',')[0]) + '</td>' +
            '<td style="white-space: nowrap;"><strong style="font-family: monospace; font-size: 0.85rem;">#' + escapeHtml(ord.orderId) + '</strong></td>' +
            '<td style="min-width: 13rem; overflow-wrap: anywhere;"><strong style="color: #2c1e14;">' + escapeHtml(ord.name) + '</strong><div style="font-size: 0.72rem; color: #7d6b5e;">' + escapeHtml(ord.email) + '</div></td>' +
            '<td style="min-width: 14rem;">' + itemsHtml + '</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e; white-space: nowrap; padding-left: 0.5rem; padding-right: 0.5rem;">' + escapeHtml(formatCurrencyDisplay(ord.total)) + '</td>' +
            '<td style="white-space: nowrap;">' + getStatusBadge(ord.status) + '</td>' +
            '<td style="text-align: right; white-space: nowrap;"><button type="button" class="atelier-btn-action" data-inspect-order="' + escapeHtml(ord.orderId) + '">View</button></td>' +
            '</tr>';
        });

        html += '</tbody></table></div>';
        wrap.innerHTML = html;
        wireSorting(wrap);

        wrap.querySelectorAll('tr[data-order-id]').forEach(function (tr) {
          tr.addEventListener('click', function () {
            var oId = tr.getAttribute('data-order-id');
            selectedItem = ordersData.find(function (o) { return o.orderId === oId; });
            renderTable();
            renderInspector();
          });
        });

      } else if (currentDomain === 'beans') {
        var beans = (roastsData && roastsData.greenBeans) || [];
        var filteredBeans = beans.filter(function (b) {
          var stock = Number(b.activeStockGrams) || 0;
          if (activeStatusFilter === 'all' && stock <= 0) return false;
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = ((b.name || '') + ' ' + (b.supplier || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var bGroups = {};
          filteredBeans.forEach(function (b) {
            var dimVals = {};
            var keyParts = [];
            activeGroupBys.forEach(function (dim) {
              var val = dim === 'supplier' ? (b.supplier || 'Unknown') : (b.name || 'Unknown');
              dimVals[dim] = val;
              keyParts.push(val);
            });
            var gk = keyParts.join(' • ');
            if (!bGroups[gk]) {
              bGroups[gk] = { dimValues: dimVals, count: 0, stockGrams: 0, orderedGrams: 0 };
            }
            bGroups[gk].count++;
            bGroups[gk].stockGrams += (Number(b.activeStockGrams) || 0);
            bGroups[gk].orderedGrams += (Number(b.orderedGrams) || 0);
          });
          var bgRows = Object.keys(bGroups).map(function (k) { return bGroups[k]; });
          var bgHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Green Bean Inventory (' + activeGroupBys.join(' + ').toUpperCase() + ')</h3>' +
            '<span class="atelier-count-pill">' + bgRows.length + ' groups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';
          activeGroupBys.forEach(function (dim) { bgHtml += '<th>' + escapeHtml(dim.toUpperCase()) + '</th>'; });
          bgHtml += '<th style="text-align: right;">LOTS</th><th style="text-align: right;">ACTIVE STOCK (LBS)</th><th style="text-align: right;">STOCK (G)</th></tr></thead><tbody>';
          bgRows.forEach(function (r) {
            bgHtml += '<tr>';
            activeGroupBys.forEach(function (dim) { bgHtml += '<td><strong>' + escapeHtml(r.dimValues[dim]) + '</strong></td>'; });
            bgHtml += '<td style="text-align: right; font-family: monospace;">' + r.count + '</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #166534;">' + (r.stockGrams / GRAMS_PER_LB).toFixed(2) + ' lbs</td>' +
              '<td style="text-align: right; font-family: monospace;">' + r.stockGrams + 'g</td></tr>';
          });
          bgHtml += '</tbody></table></div>';
          wrap.innerHTML = bgHtml;
          return;
        }

        var bSort = sortState.beans;
        filteredBeans.sort(function (a, b) {
          var av, bv;
          if (bSort.col === 'stockLbs' || bSort.col === 'activeStockGrams') {
            av = Number(a.activeStockGrams) || 0;
            bv = Number(b.activeStockGrams) || 0;
          } else {
            av = a[bSort.col] || '';
            bv = b[bSort.col] || '';
          }
          if (typeof av === 'number' && typeof bv === 'number') {
            return bSort.dir === 'asc' ? av - bv : bv - av;
          }
          return bSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var bBanner = renderLoadingOrErrorBanner('beans', 'Active Green Beans');
        var bHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Active Green Bean Inventory</h3>' +
          '<span class="atelier-count-pill">' + filteredBeans.length + ' lots</span>' +
          '</div>' + bBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('BEAN NAME & ORIGIN', 'name', 'beans', false) +
          renderSortTh('SUPPLIER', 'supplier', 'beans', false) +
          renderSortTh('ACTIVE STOCK (LBS)', 'stockLbs', 'beans', true) +
          renderSortTh('STOCK (GRAMS)', 'activeStockGrams', 'beans', true) +
          '</tr></thead><tbody>';

        filteredBeans.forEach(function (b) {
          var stockGrams = Number(b.activeStockGrams) || 0;
          var stockLbs = (stockGrams / GRAMS_PER_LB).toFixed(2);
          var nameCell = b.url
            ? '<a href="' + escapeHtml(b.url) + '" target="_blank" rel="noopener" style="color: #2c1e14; text-decoration: underline;"><strong>' + escapeHtml(b.name) + '</strong></a>'
            : '<strong style="color: #2c1e14;">' + escapeHtml(b.name) + '</strong>';
          bHtml += '<tr>' +
            '<td>' + nameCell + '</td>' +
            '<td><span style="font-weight: 600;">' + escapeHtml(b.supplier || '') + '</span></td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: ' + (stockGrams < 1000 ? '#b91c1c' : '#166534') + ';">' + stockLbs + ' lbs</td>' +
            '<td style="text-align: right; font-family: monospace;">' + stockGrams + 'g</td>' +
            '</tr>';
        });
        bHtml += '</tbody></table></div>';
        wrap.innerHTML = bHtml;
        wireSorting(wrap);

      } else if (currentDomain === 'bean_orders') {
        var gboList = (roastsData && roastsData.greenBeanOrders) || [];
        var filteredGbo = gboList.filter(function (ord) {
          var avail = Number(ord.availableGrams) || 0;
          if (activeStatusFilter === 'available' && avail <= 0) return false;
          if (supplierOrderFilter && String(ord.supplierOrderId) !== supplierOrderFilter) return false;
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = ((ord.orderId || '') + ' ' + (ord.supplierOrderId || '') + ' ' + (ord.name || '') + ' ' + (ord.supplier || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var gboGroups = {};
          filteredGbo.forEach(function (ord) {
            var ymInfo = parseYearMonth(ord.date);
            var dimVals = {};
            var keyParts = [];
            activeGroupBys.forEach(function (dim) {
              var val = 'Unknown';
              if (dim === 'all') val = 'All Purchases';
              else if (dim === 'year') val = ymInfo.year;
              else if (dim === 'month') val = ymInfo.month;
              else if (dim === 'supplier') val = ord.supplier || 'Unknown';
              else if (dim === 'bean') val = ord.name || 'Unknown';
              else val = String(ord[dim] || 'Unknown');
              dimVals[dim] = val;
              keyParts.push(val);
            });
            var gk = keyParts.join(' • ');
            if (!gboGroups[gk]) {
              gboGroups[gk] = { dimValues: dimVals, count: 0, weightLbs: 0, cost: 0, availGrams: 0 };
            }
            gboGroups[gk].count++;
            gboGroups[gk].weightLbs += (Number(ord.weightLbs) || 0);
            gboGroups[gk].cost += (Number(ord.cost) || 0);
            gboGroups[gk].availGrams += (Number(ord.availableGrams) || 0);
          });
          var gboRows = Object.keys(gboGroups).map(function (k) { return gboGroups[k]; });
          var gSortGbo = sortState.groups;
          gboRows.sort(function (a, b) {
            var av = a[gSortGbo.col] !== undefined ? a[gSortGbo.col] : (a.dimValues[gSortGbo.col] || '');
            var bv = b[gSortGbo.col] !== undefined ? b[gSortGbo.col] : (b.dimValues[gSortGbo.col] || '');
            if (typeof av === 'number' && typeof bv === 'number') {
              return gSortGbo.dir === 'asc' ? av - bv : bv - av;
            }
            return gSortGbo.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
          });
          var gboGroupHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Green Bean Orders (' + activeGroupBys.join(' + ').toUpperCase() + ')</h3>' +
            '<span class="atelier-count-pill">' + gboRows.length + ' groups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';
          activeGroupBys.forEach(function (dim) {
            gboGroupHtml += renderSortTh(dim.toUpperCase(), dim, 'groups', false);
          });
          gboGroupHtml += renderSortTh('ORDERS', 'count', 'groups', true) +
            renderSortTh('PURCHASED (LBS)', 'weightLbs', 'groups', true) +
            renderSortTh('REMAINING (G)', 'availGrams', 'groups', true) +
            renderSortTh('TOTAL COST', 'cost', 'groups', true) +
            '</tr></thead><tbody>';
          var sumGboCount = 0;
          var sumGboWeightLbs = 0;
          var sumGboAvailGrams = 0;
          var sumGboCost = 0;
          gboRows.forEach(function (r) {
            sumGboCount += r.count;
            sumGboWeightLbs += r.weightLbs;
            sumGboAvailGrams += r.availGrams;
            sumGboCost += r.cost;
            gboGroupHtml += '<tr>';
            activeGroupBys.forEach(function (dim) { gboGroupHtml += '<td><strong>' + escapeHtml(r.dimValues[dim]) + '</strong></td>'; });
            gboGroupHtml += '<td style="text-align: right; font-family: monospace;">' + r.count + '</td>' +
              '<td style="text-align: right; font-family: monospace;">' + r.weightLbs.toFixed(1) + ' lbs</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #166534;">' + r.availGrams + 'g</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + r.cost.toFixed(2) + '</td></tr>';
          });
          gboGroupHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #faf6ef; border-top: 2px solid #e2d7c5;">' +
            '<td colspan="' + activeGroupBys.length + '">Total (' + gboRows.length + ' groups)</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumGboCount + '</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumGboWeightLbs.toFixed(1) + ' lbs</td>' +
            '<td style="text-align: right; font-family: monospace; color: #166534;">' + sumGboAvailGrams + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; color: #92400e;">$' + sumGboCost.toFixed(2) + '</td>' +
            '</tr></tfoot></table></div>';
          wrap.innerHTML = gboGroupHtml;
          wireSorting(wrap);
          return;
        }

        var gboSort = sortState.bean_orders;
        filteredGbo.sort(function (a, b) {
          var av, bv;
          if (gboSort.col === 'date') {
            av = new Date(a.date || 0).getTime();
            bv = new Date(b.date || 0).getTime();
          } else if (gboSort.col === 'weightLbs' || gboSort.col === 'cost' || gboSort.col === 'availableGrams') {
            av = Number(a[gboSort.col]) || 0;
            bv = Number(b[gboSort.col]) || 0;
          } else {
            av = a[gboSort.col] || '';
            bv = b[gboSort.col] || '';
          }
          if (typeof av === 'number' && typeof bv === 'number') {
            return gboSort.dir === 'asc' ? av - bv : bv - av;
          }
          return gboSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var gboBanner = renderLoadingOrErrorBanner('bean_orders', 'Green Bean Orders');
        var gboHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Green Bean Purchase Orders</h3>' +
          '<div style="display: flex; align-items: center; gap: 0.65rem;">' +
            '<span class="atelier-count-pill">' + filteredGbo.length + ' orders</span>' +
            '<button type="button" class="atelier-btn-action" id="atelier-new-gbo-btn">+ Record Bean Order</button>' +
          '</div>' +
          '</div>' + gboBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('DATE', 'date', 'bean_orders', false) +
          renderSortTh('LOT / ORDER ID', 'orderId', 'bean_orders', false) +
          renderSortTh('BEAN NAME', 'name', 'bean_orders', false) +
          renderSortTh('SUPPLIER', 'supplier', 'bean_orders', false) +
          renderSortTh('SUPPLIER #', 'supplierOrderId', 'bean_orders', false) +
          renderSortTh('PURCHASED (LBS)', 'weightLbs', 'bean_orders', true) +
          renderSortTh('REMAINING (G)', 'availableGrams', 'bean_orders', true) +
          renderSortTh('COST', 'cost', 'bean_orders', true) +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredGbo.forEach(function (ord) {
          var avail = Number(ord.availableGrams) || 0;
          var costNum = Number(ord.cost) || 0;
          var isSelected = selectedItem && selectedItem.orderId === ord.orderId && !selectedItem.__isNew;
          gboHtml += '<tr data-gbo-id="' + escapeHtml(ord.orderId) + '" style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td style="font-family: monospace; font-size: 0.76rem; color: #7d6b5e;">' + escapeHtml(ord.date) + '</td>' +
            '<td><strong style="font-family: monospace; font-size: 0.8rem;">' + escapeHtml(ord.orderId) + '</strong></td>' +
            '<td><strong style="color: #2c1e14;">' + escapeHtml(ord.name) + '</strong>' +
              (ord.url ? ' <a href="' + escapeHtml(ord.url) + '" target="_blank" rel="noopener" style="font-size: 0.72rem; color: #b8860b;">↗</a>' : '') + '</td>' +
            '<td>' + escapeHtml(ord.supplier) + '</td>' +
            '<td style="font-family: monospace; font-size: 0.8rem;">' +
              (ord.supplierOrderId ? '<button type="button" class="atelier-link-btn atelier-supplier-order-link" data-supplier-order-id="' + escapeHtml(ord.supplierOrderId) + '" title="Filter by this supplier order">' + escapeHtml(ord.supplierOrderId) + '</button>' : '') +
            '</td>' +
            '<td style="text-align: right; font-family: monospace;">' + (Number(ord.weightLbs) || 0) + ' lbs (' + (ord.weightGrams || 0) + 'g)</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: ' + (avail > 0 ? '#166534' : '#7d6b5e') + ';">' + avail + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + costNum.toFixed(2) + '</td>' +
            '<td style="text-align: right;"><button type="button" class="atelier-btn-action atelier-inspect-gbo-btn" data-id="' + escapeHtml(ord.orderId) + '">Edit</button></td>' +
            '</tr>';
        });
        gboHtml += '</tbody></table></div>';
        wrap.innerHTML = gboHtml;
        wireSorting(wrap);

        var newGboBtn = document.getElementById('atelier-new-gbo-btn');
        if (newGboBtn) {
          newGboBtn.addEventListener('click', function () {
            selectedItem = { __isNew: true, date: todayIso() };
            renderTable();
            renderInspector();
          });
        }
        wrap.querySelectorAll('.atelier-supplier-order-link').forEach(function (btn) {
          btn.addEventListener('click', function () {
            supplierOrderFilter = btn.getAttribute('data-supplier-order-id');
            renderAll();
          });
        });
        wrap.querySelectorAll('.atelier-inspect-gbo-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            selectedItem = gboList.find(function (x) { return String(x.orderId) === String(id); }) || null;
            renderTable();
            renderInspector();
          });
        });

      } else if (currentDomain === 'roasts') {
        var rBatches = (roastsData && roastsData.roastLogs) || [];
        var filteredRoasts = rBatches.filter(function (r) {
          if (activeStatusFilter === 'available' && (Number(r.availableGrams) || 0) <= 0) return false;
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var lvlLabel = formatRoastLevel(r.roastLevel, roastLevels);
            var hay = ((r.roastId || '') + ' ' + (r.beanName || '') + ' ' + lvlLabel + ' ' + (r.notes || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var rGroups = {};
          filteredRoasts.forEach(function (r) {
            var ymInfo = parseYearMonth(r.date);
            var dimVals = {};
            var keyParts = [];
            activeGroupBys.forEach(function (dim) {
              var val = 'Unknown';
              if (dim === 'all') val = 'All Batches';
              else if (dim === 'year') val = ymInfo.year;
              else if (dim === 'month') val = ymInfo.month;
              else if (dim === 'roastLevel') val = formatRoastLevel(r.roastLevel, roastLevels) || 'Unknown';
              else if (dim === 'bean') val = r.beanName || 'Unknown';
              else val = String(r[dim] || 'Unknown');
              dimVals[dim] = val;
              keyParts.push(val);
            });
            var gk = keyParts.join(' • ');
            if (!rGroups[gk]) {
              rGroups[gk] = { dimValues: dimVals, count: 0, greenGrams: 0, endGrams: 0 };
            }
            rGroups[gk].count++;
            rGroups[gk].greenGrams += (Number(r.greenWeightGrams) || 0);
            rGroups[gk].endGrams += (Number(r.endWeightGrams) || 0);
          });
          var rgRows = Object.keys(rGroups).map(function (k) { return rGroups[k]; });
          var gSortR = sortState.groups;
          rgRows.sort(function (a, b) {
            var av = a[gSortR.col] !== undefined ? a[gSortR.col] : (a.dimValues[gSortR.col] || '');
            var bv = b[gSortR.col] !== undefined ? b[gSortR.col] : (b.dimValues[gSortR.col] || '');
            if (typeof av === 'number' && typeof bv === 'number') {
              return gSortR.dir === 'asc' ? av - bv : bv - av;
            }
            return gSortR.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
          });
          var rgHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Roast Batches (' + activeGroupBys.join(' + ').toUpperCase() + ')</h3>' +
            '<span class="atelier-count-pill">' + rgRows.length + ' groups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';
          activeGroupBys.forEach(function (dim) {
            rgHtml += renderSortTh(dim.toUpperCase(), dim, 'groups', false);
          });
          rgHtml += renderSortTh('BATCHES', 'count', 'groups', true) +
            renderSortTh('TOTAL GREEN (G)', 'greenGrams', 'groups', true) +
            renderSortTh('TOTAL ROASTED (G)', 'endGrams', 'groups', true) +
            renderSortTh('AVG LOSS %', 'loss', 'groups', true) +
            '</tr></thead><tbody>';
          var sumRBatches = 0;
          var sumRGreenGrams = 0;
          var sumREndGrams = 0;
          rgRows.forEach(function (g) {
            sumRBatches += g.count;
            sumRGreenGrams += g.greenGrams;
            sumREndGrams += g.endGrams;
            var avgLoss = g.greenGrams > 0 ? (((g.greenGrams - g.endGrams) / g.greenGrams) * 100).toFixed(1) : '0.0';
            rgHtml += '<tr>';
            activeGroupBys.forEach(function (dim) { rgHtml += '<td><strong>' + escapeHtml(g.dimValues[dim]) + '</strong></td>'; });
            rgHtml += '<td style="text-align: right; font-family: monospace;">' + g.count + '</td>' +
              '<td style="text-align: right; font-family: monospace;">' + g.greenGrams + 'g</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">' + g.endGrams + 'g</td>' +
              '<td style="text-align: right; font-family: monospace;">' + avgLoss + '%</td></tr>';
          });
          var totalAvgLoss = sumRGreenGrams > 0 ? (((sumRGreenGrams - sumREndGrams) / sumRGreenGrams) * 100).toFixed(1) : '0.0';
          rgHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #faf6ef; border-top: 2px solid #e2d7c5;">' +
            '<td colspan="' + activeGroupBys.length + '">Total (' + rgRows.length + ' groups)</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumRBatches + '</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumRGreenGrams + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; color: #92400e;">' + sumREndGrams + 'g</td>' +
            '<td style="text-align: right; font-family: monospace;">' + totalAvgLoss + '%</td>' +
            '</tr></tfoot></table></div>';
          wrap.innerHTML = rgHtml;
          wireSorting(wrap);
          return;
        }

        var rSort = sortState.roasts;
        filteredRoasts.sort(function (a, b) {
          var av, bv;
          if (rSort.col === 'date') {
            av = new Date(a.date || 0).getTime();
            bv = new Date(b.date || 0).getTime();
          } else if (rSort.col === 'greenWeightGrams' || rSort.col === 'endWeightGrams' || rSort.col === 'availableGrams') {
            av = Number(a[rSort.col]) || 0;
            bv = Number(b[rSort.col]) || 0;
          } else if (rSort.col === 'loss') {
            av = Number(a.weightLossPct) || 0;
            bv = Number(b.weightLossPct) || 0;
          } else {
            av = a[rSort.col] || '';
            bv = b[rSort.col] || '';
          }
          if (typeof av === 'number' && typeof bv === 'number') {
            return rSort.dir === 'asc' ? av - bv : bv - av;
          }
          return rSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var rBanner = renderLoadingOrErrorBanner('roasts', 'Roast Batch Log');
        var rHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Roast Batch Log</h3>' +
          '<div style="display: flex; align-items: center; gap: 0.65rem;">' +
            '<span class="atelier-count-pill">' + filteredRoasts.length + ' batches</span>' +
            '<button type="button" class="atelier-btn-action" id="atelier-new-roast-btn">+ Record Roast Batch</button>' +
          '</div>' +
          '</div>' + rBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('DATE', 'date', 'roasts', false) +
          renderSortTh('BATCH #', 'roastId', 'roasts', false) +
          renderSortTh('BEAN LOT', 'beanName', 'roasts', false) +
          renderSortTh('ROAST LEVEL', 'roastLevel', 'roasts', false) +
          renderSortTh('GREEN (G)', 'greenWeightGrams', 'roasts', true) +
          renderSortTh('ROASTED (G)', 'endWeightGrams', 'roasts', true) +
          renderSortTh('UNPACKAGED (G)', 'availableGrams', 'roasts', true) +
          renderSortTh('LOSS %', 'loss', 'roasts', true) +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredRoasts.forEach(function (r) {
          var green = Number(r.greenWeightGrams) || 0;
          var end = Number(r.endWeightGrams) || 0;
          var avail = Number(r.availableGrams) || 0;
          var loss = r.weightLossPct || (green > 0 ? (((green - end) / green) * 100).toFixed(1) : '0.0');
          var isSelected = selectedItem && selectedItem.roastId === r.roastId && !selectedItem.__isNew;
          rHtml += '<tr style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td style="font-family: monospace; font-size: 0.76rem; color: #7d6b5e;">' + escapeHtml(r.date) + '</td>' +
            '<td><strong style="font-family: monospace; font-size: 0.8rem;">' + escapeHtml(r.roastId) + '</strong>' +
              (r.profileUrl ? ' <a href="' + escapeHtml(r.profileUrl) + '" target="_blank" rel="noopener" style="font-size: 0.72rem; color: #b8860b;">↗</a>' : '') + '</td>' +
            '<td><strong style="color: #2c1e14;">' + escapeHtml(r.beanName || '') + '</strong>' +
              (r.notes ? '<div style="font-size: 0.7rem; color: #7d6b5e;">' + escapeHtml(r.notes) + '</div>' : '') + '</td>' +
            '<td><span class="atelier-item-meta">' + escapeHtml(formatRoastLevel(r.roastLevel, roastLevels)) + '</span></td>' +
            '<td style="text-align: right; font-family: monospace;">' + green + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">' + end + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: ' + (avail > 0 ? '#166534' : '#7d6b5e') + ';">' + avail + 'g</td>' +
            '<td style="text-align: right; font-family: monospace; color: #b45309;">' + loss + '%</td>' +
            '<td style="text-align: right;"><button type="button" class="atelier-btn-action atelier-inspect-roast-btn" data-id="' + escapeHtml(r.roastId) + '">Edit</button></td>' +
            '</tr>';
        });
        rHtml += '</tbody></table></div>';
        wrap.innerHTML = rHtml;
        wireSorting(wrap);

        var newRoastBtn = document.getElementById('atelier-new-roast-btn');
        if (newRoastBtn) {
          newRoastBtn.addEventListener('click', function () {
            selectedItem = { __isNew: true, date: todayIso(), greenBeanComponents: [] };
            renderTable();
            renderInspector();
          });
        }
        wrap.querySelectorAll('.atelier-inspect-roast-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            selectedItem = rBatches.find(function (x) { return String(x.roastId) === String(id); }) || null;
            renderTable();
            renderInspector();
          });
        });

      } else if (currentDomain === 'packaging') {
        var pkgList = (roastsData && roastsData.blendPackagingLogs) || [];
        var filteredPkg = pkgList.filter(function (p) {
          if (activeStatusFilter !== 'all' && String(p.purpose || '').toLowerCase() !== activeStatusFilter.toLowerCase()) return false;
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = ((p.logId || '') + ' ' + (p.product || '') + ' ' + (p.notes || '') + ' ' + (p.orderId || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var pGroups = {};
          filteredPkg.forEach(function (p) {
            var ymInfo = parseYearMonth(p.date);
            var dimVals = {};
            var keyParts = [];
            activeGroupBys.forEach(function (dim) {
              var val = 'Total Rollup';
              if (dim === 'all') val = 'Total Rollup';
              else if (dim === 'year') val = ymInfo.year;
              else if (dim === 'month') val = ymInfo.month;
              else if (dim === 'product') val = p.product || 'Unassigned';
              else if (dim === 'bagSize') val = p.bagSize || 'Custom';
              else if (dim === 'purpose') val = p.purpose || 'Unassigned';
              else val = String(p[dim] || 'Unassigned');
              dimVals[dim] = val;
              keyParts.push(val);
            });
            var gk = keyParts.join(' • ');
            if (!pGroups[gk]) {
              pGroups[gk] = {
                dimValues: dimVals,
                count: 0,
                weightGrams: 0,
                weightLbs: 0
              };
            }
            var gWeight = Number(p.weightGrams) || 0;
            pGroups[gk].count++;
            pGroups[gk].weightGrams += gWeight;
            pGroups[gk].weightLbs += gWeight / GRAMS_PER_LB;
          });

          var pgRows = Object.keys(pGroups).map(function (k) { return pGroups[k]; });
          var pgSort = sortState.groups;
          pgRows.sort(function (a, b) {
            var av = a[pgSort.col] !== undefined ? a[pgSort.col] : (a.dimValues[pgSort.col] || '');
            var bv = b[pgSort.col] !== undefined ? b[pgSort.col] : (b.dimValues[pgSort.col] || '');
            if (typeof av === 'number' && typeof bv === 'number') {
              return pgSort.dir === 'asc' ? av - bv : bv - av;
            }
            return pgSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
          });

          var pgHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Packaging Summary (' + activeGroupBys.join(' + ').toUpperCase() + ')</h3>' +
            '<span class="atelier-count-pill">' + pgRows.length + ' groups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';
          activeGroupBys.forEach(function (dim) {
            pgHtml += renderSortTh(dim.toUpperCase(), dim, 'groups', false);
          });
          pgHtml += renderSortTh('BAGS / RECORDS', 'count', 'groups', true) +
            renderSortTh('WEIGHT (LBS)', 'weightLbs', 'groups', true) +
            renderSortTh('WEIGHT (G)', 'weightGrams', 'groups', true) +
            '</tr></thead><tbody>';

          var sumPkgCount = 0;
          var sumPkgLbs = 0;
          var sumPkgGrams = 0;
          pgRows.forEach(function (g) {
            sumPkgCount += g.count;
            sumPkgLbs += g.weightLbs;
            sumPkgGrams += g.weightGrams;
            pgHtml += '<tr>';
            activeGroupBys.forEach(function (dim) {
              pgHtml += '<td><strong>' + escapeHtml(g.dimValues[dim] || '') + '</strong></td>';
            });
            pgHtml += '<td style="text-align: right; font-family: monospace; font-weight: 700;">' + g.count + '</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">' + g.weightLbs.toFixed(2) + ' lbs</td>' +
              '<td style="text-align: right; font-family: monospace;">' + g.weightGrams + 'g</td>' +
              '</tr>';
          });
          pgHtml += '</tbody><tfoot><tr style="font-weight: 700; background: #faf6ef; border-top: 2px solid #e2d7c5;">' +
            '<td colspan="' + activeGroupBys.length + '">Total (' + pgRows.length + ' groups)</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumPkgCount + '</td>' +
            '<td style="text-align: right; font-family: monospace; color: #92400e;">' + sumPkgLbs.toFixed(2) + ' lbs</td>' +
            '<td style="text-align: right; font-family: monospace;">' + sumPkgGrams + 'g</td>' +
            '</tr></tfoot></table></div>';
          wrap.innerHTML = pgHtml;
          wireSorting(wrap);
          return;
        }

        var pSort = sortState.packaging;
        filteredPkg.sort(function (a, b) {
          var av = pSort.col === 'weightGrams' ? (Number(a.weightGrams) || 0) : (a[pSort.col] || '');
          var bv = pSort.col === 'weightGrams' ? (Number(b.weightGrams) || 0) : (b[pSort.col] || '');
          if (typeof av === 'number' && typeof bv === 'number') return pSort.dir === 'asc' ? av - bv : bv - av;
          return pSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var pBanner = renderLoadingOrErrorBanner('packaging', 'Master Blend & Packaging');
        var pHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Master Blend &amp; Packaging Log</h3>' +
          '<div style="display: flex; align-items: center; gap: 0.65rem;">' +
            '<span class="atelier-count-pill">' + filteredPkg.length + ' records</span>' +
            '<button type="button" class="atelier-btn-action" id="atelier-new-pkg-btn">+ Record Blend / Packaging</button>' +
          '</div>' +
          '</div>' + pBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('DATE', 'date', 'packaging', false) +
          renderSortTh('PKG ID', 'logId', 'packaging', false) +
          renderSortTh('PRODUCT / BLEND', 'product', 'packaging', false) +
          renderSortTh('PURPOSE', 'purpose', 'packaging', false) +
          renderSortTh('BAG SIZE', 'bagSize', 'packaging', false) +
          renderSortTh('WEIGHT (G)', 'weightGrams', 'packaging', true) +
          '<th>ROAST COMPONENTS &amp; NOTES</th>' +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredPkg.forEach(function (p) {
          var comps = (p.roastComponents || []).map(function (c) {
            return '<span class="atelier-item-meta"><button type="button" class="atelier-link-btn atelier-pkg-roast-link" data-roast-id="' + escapeHtml(c.roastId) + '" title="Open roast batch">' + escapeHtml(c.roastId) + '</button> (' + c.weightGrams + 'g)</span>';
          }).join(' ');
          var isSelected = selectedItem && selectedItem.logId === p.logId && !selectedItem.__isNew;
          pHtml += '<tr style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td style="font-family: monospace; font-size: 0.76rem; color: #7d6b5e;">' + escapeHtml(p.date) + '</td>' +
            '<td><strong style="font-family: monospace; font-size: 0.8rem;">' + escapeHtml(p.logId) + '</strong></td>' +
            '<td><strong style="color: #2c1e14;">' + escapeHtml(p.product) + '</strong></td>' +
            '<td>' + escapeHtml(p.purpose) + (p.orderId ? ' (<button type="button" class="atelier-link-btn atelier-pkg-order-link" data-order-id="' + escapeHtml(p.orderId) + '" title="Open customer order">#' + escapeHtml(p.orderId) + '</button>)' : '') + '</td>' +
            '<td><span class="atelier-item-meta" style="font-weight: 700; color: #92400e; background: #fef3c7;">' + escapeHtml(p.bagSize || 'Custom') + '</span></td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700;">' + (p.weightGrams || 0) + 'g</td>' +
            '<td>' + comps + (p.notes ? '<div style="font-size: 0.74rem; color: #7d6b5e; margin-top: 0.2rem;">' + escapeHtml(p.notes) + '</div>' : '') + '</td>' +
            '<td style="text-align: right; white-space: nowrap;">' +
              '<button type="button" class="atelier-btn-action atelier-inspect-pkg-btn" data-id="' + escapeHtml(p.logId) + '">Edit</button> ' +
              '<button type="button" class="atelier-btn-action atelier-copy-pkg-btn" data-id="' + escapeHtml(p.logId) + '">Copy</button>' +
            '</td>' +
            '</tr>';
        });
        pHtml += '</tbody></table></div>';
        wrap.innerHTML = pHtml;
        wireSorting(wrap);

        var newPkgBtn = document.getElementById('atelier-new-pkg-btn');
        if (newPkgBtn) {
          newPkgBtn.addEventListener('click', function () {
            selectedItem = { __isNew: true, date: todayIso(), purpose: 'Order', roastComponents: [] };
            renderTable();
            renderInspector();
          });
        }
        wrap.querySelectorAll('.atelier-pkg-order-link').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var oId = btn.getAttribute('data-order-id');
            var ord = ordersData.find(function (o) { return String(o.orderId) === oId; });
            if (!ord) {
              console.error('[packaging] Order #' + oId + ' not found in customer orders');
              return;
            }
            jumpToRecord('orders', ord);
          });
        });
        wrap.querySelectorAll('.atelier-pkg-roast-link').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var rId = btn.getAttribute('data-roast-id');
            var roast = roastsData.roastLogs.find(function (r) { return String(r.roastId) === rId; });
            if (!roast) {
              console.error('[packaging] Roast batch ' + rId + ' not found in roast log');
              return;
            }
            jumpToRecord('roasts', roast);
          });
        });
        wrap.querySelectorAll('.atelier-inspect-pkg-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            selectedItem = pkgList.find(function (x) { return String(x.logId) === String(id); }) || null;
            renderTable();
            renderInspector();
          });
        });
        wrap.querySelectorAll('.atelier-copy-pkg-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            var orig = pkgList.find(function (x) { return String(x.logId) === String(id); });
            if (orig) {
              selectedItem = {
                __isNew: true,
                date: todayIso(),
                purpose: orig.purpose,
                orderId: orig.orderId,
                product: orig.product,
                bagSize: orig.bagSize,
                notes: orig.notes,
                roastComponents: (orig.roastComponents || []).map(function (c) {
                  return { roastId: c.roastId, weightGrams: c.weightGrams };
                })
              };
              renderTable();
              renderInspector();
            }
          });
        });

      } else if (currentDomain === 'subscriptions') {
        var filteredSubs = subsData.filter(function (s) {
          if (activeStatusFilter !== 'all' && String(s.status || '').toLowerCase() !== activeStatusFilter.toLowerCase()) return false;
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = ((s.orderId || '') + ' ' + (s.name || '') + ' ' + (s.email || '') + ' ' + (s.roast || '') + ' ' + (s.frequency || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        if (activeGroupBys.length > 0) {
          var sGroups = {};
          filteredSubs.forEach(function (s) {
            var dimVals = {};
            var keyParts = [];
            activeGroupBys.forEach(function (dim) {
              var val = String(s[dim] || 'Unassigned');
              dimVals[dim] = val;
              keyParts.push(val);
            });
            var gk = keyParts.join(' • ');
            if (!sGroups[gk]) {
              sGroups[gk] = { dimValues: dimVals, count: 0, revenue: 0 };
            }
            sGroups[gk].count++;
            sGroups[gk].revenue += parseCurrencyVal(s.cost);
          });
          var sgRows = Object.keys(sGroups).map(function (k) { return sGroups[k]; });
          var sgHtml = '<div class="atelier-table-toolbar">' +
            '<h3 class="atelier-table-title">Grouped Subscriptions (' + activeGroupBys.join(' + ').toUpperCase() + ')</h3>' +
            '<span class="atelier-count-pill">' + sgRows.length + ' groups</span>' +
            '</div><div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>';
          activeGroupBys.forEach(function (dim) { sgHtml += '<th>' + escapeHtml(dim.toUpperCase()) + '</th>'; });
          sgHtml += '<th style="text-align: right;">SUBSCRIPTIONS</th><th style="text-align: right;">CYCLE REVENUE</th></tr></thead><tbody>';
          sgRows.forEach(function (r) {
            sgHtml += '<tr>';
            activeGroupBys.forEach(function (dim) { sgHtml += '<td><strong>' + escapeHtml(r.dimValues[dim]) + '</strong></td>'; });
            sgHtml += '<td style="text-align: right; font-family: monospace;">' + r.count + '</td>' +
              '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + r.revenue.toFixed(2) + '</td></tr>';
          });
          sgHtml += '</tbody></table></div>';
          wrap.innerHTML = sgHtml;
          return;
        }

        var sSort = sortState.subscriptions;
        filteredSubs.sort(function (a, b) {
          var av = sSort.col === 'cost' ? parseCurrencyVal(a.cost) : (a[sSort.col] || '');
          var bv = sSort.col === 'cost' ? parseCurrencyVal(b.cost) : (b[sSort.col] || '');
          if (typeof av === 'number' && typeof bv === 'number') return sSort.dir === 'asc' ? av - bv : bv - av;
          return sSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var sBanner = renderLoadingOrErrorBanner('subscriptions', 'Subscriptions');
        var sHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Recurring Coffee Subscriptions</h3>' +
          '<span class="atelier-count-pill">' + filteredSubs.length + ' subscriptions</span>' +
          '</div>' + sBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('SUB #', 'orderId', 'subscriptions', false) +
          renderSortTh('SUBSCRIBER', 'name', 'subscriptions', false) +
          renderSortTh('ROAST', 'roast', 'subscriptions', false) +
          renderSortTh('BAG SIZE', 'size', 'subscriptions', false) +
          renderSortTh('FREQUENCY', 'frequency', 'subscriptions', false) +
          renderSortTh('PRICE', 'cost', 'subscriptions', true) +
          renderSortTh('DELIVERY', 'deliveryMethod', 'subscriptions', false) +
          renderSortTh('STATUS', 'status', 'subscriptions', false) +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredSubs.forEach(function (s) {
          var priceNum = parseCurrencyVal(s.cost);
          var isSelected = selectedItem && selectedItem.orderId === s.orderId;
          sHtml += '<tr style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td><strong style="font-family: monospace;">#' + escapeHtml(s.orderId) + '</strong><div style="font-size: 0.7rem; color: #7d6b5e;">' + escapeHtml(String(s.timestamp || '').split(',')[0]) + '</div></td>' +
            '<td><strong style="color: #2c1e14;">' + escapeHtml(s.name) + '</strong><div style="font-size: 0.72rem; color: #7d6b5e;">' + escapeHtml(s.email) + '</div></td>' +
            '<td><strong>' + escapeHtml(s.roast) + '</strong>' + (s.grind ? '<div style="font-size: 0.7rem; color: #7d6b5e;">' + escapeHtml(s.grind) + '</div>' : '') + '</td>' +
            '<td><span class="atelier-item-meta" style="font-weight: 700; color: #92400e; background: #fef3c7;">' + escapeHtml(s.size) + '</span></td>' +
            '<td>' + escapeHtml(s.frequency) + '</td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + priceNum.toFixed(2) + '</td>' +
            '<td>' + escapeHtml(s.deliveryMethod) + (s.city ? '<div style="font-size: 0.7rem; color: #7d6b5e;">' + escapeHtml(s.city) + '</div>' : '') + '</td>' +
            '<td>' + getStatusBadge(s.status) + '</td>' +
            '<td style="text-align: right;"><button type="button" class="atelier-btn-action atelier-inspect-sub-btn" data-id="' + escapeHtml(s.orderId) + '">View</button></td>' +
            '</tr>';
        });
        sHtml += '</tbody></table></div>';
        wrap.innerHTML = sHtml;
        wireSorting(wrap);

        wrap.querySelectorAll('.atelier-inspect-sub-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            selectedItem = subsData.find(function (x) { return String(x.orderId) === String(id); }) || null;
            renderTable();
            renderInspector();
          });
        });

      } else if (currentDomain === 'gift_subs') {
        var filteredGSubs = giftSubsData.filter(function (s) {
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = ((s.orderId || '') + ' ' + (s.recipientName || '') + ' ' + (s.purchaserName || '') + ' ' + (s.roast || '') + ' ' + (s.duration || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        var gsSort = sortState.gift_subs;
        filteredGSubs.sort(function (a, b) {
          var av = gsSort.col === 'cost' ? parseCurrencyVal(a.cost) : (a[gsSort.col] || '');
          var bv = gsSort.col === 'cost' ? parseCurrencyVal(b.cost) : (b[gsSort.col] || '');
          if (typeof av === 'number' && typeof bv === 'number') return gsSort.dir === 'asc' ? av - bv : bv - av;
          return gsSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var gsBanner = renderLoadingOrErrorBanner('gift_subs', 'Gift Subscriptions');
        var gsHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Gift Coffee Subscriptions</h3>' +
          '<span class="atelier-count-pill">' + filteredGSubs.length + ' gift orders</span>' +
          '</div>' + gsBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('ORDER #', 'orderId', 'gift_subs', false) +
          renderSortTh('RECIPIENT', 'recipientName', 'gift_subs', false) +
          renderSortTh('PURCHASER', 'purchaserName', 'gift_subs', false) +
          renderSortTh('ROAST', 'roast', 'gift_subs', false) +
          renderSortTh('DURATION', 'duration', 'gift_subs', false) +
          renderSortTh('TOTAL PAID', 'cost', 'gift_subs', true) +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredGSubs.forEach(function (s) {
          var costNum = parseCurrencyVal(s.cost);
          var isSelected = selectedItem && selectedItem.orderId === s.orderId;
          gsHtml += '<tr style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td><strong style="font-family: monospace;">#' + escapeHtml(s.orderId) + '</strong><div style="font-size: 0.7rem; color: #7d6b5e;">' + escapeHtml(String(s.timestamp || '').split(',')[0]) + '</div></td>' +
            '<td><strong style="color: #2c1e14;">' + escapeHtml(s.recipientName) + '</strong><div style="font-size: 0.72rem; color: #7d6b5e;">' + escapeHtml(s.recipientEmail) + '</div></td>' +
            '<td>' + escapeHtml(s.purchaserName) + '<div style="font-size: 0.72rem; color: #7d6b5e;">' + escapeHtml(s.purchaserEmail) + '</div></td>' +
            '<td><strong>' + escapeHtml(s.roast) + '</strong></td>' +
            '<td><span class="atelier-item-meta">' + escapeHtml(s.duration) + '</span></td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #92400e;">$' + costNum.toFixed(2) + '</td>' +
            '<td style="text-align: right;"><button type="button" class="atelier-btn-action atelier-inspect-gsub-btn" data-id="' + escapeHtml(s.orderId) + '">View</button></td>' +
            '</tr>';
        });
        gsHtml += '</tbody></table></div>';
        wrap.innerHTML = gsHtml;
        wireSorting(wrap);

        wrap.querySelectorAll('.atelier-inspect-gsub-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-id');
            selectedItem = giftSubsData.find(function (x) { return String(x.orderId) === String(id); }) || null;
            renderTable();
            renderInspector();
          });
        });

      } else if (currentDomain === 'gift_codes') {
        var combinedCodes = [];
        if (activeStatusFilter === 'all' || activeStatusFilter === 'gift_cards') {
          (giftCodesData.giftCards || []).forEach(function (c) {
            combinedCodes.push({
              codeType: 'Digital Gift Card',
              target: 'gift',
              raw: c,
              code: c.code,
              status: c.status,
              valueDisplay: '$' + (Number(c.currentBalance) || 0).toFixed(2) + ' / $' + (Number(c.originalAmount) || 0).toFixed(2),
              numericVal: Number(c.currentBalance) || 0,
              party: (c.recipientName ? 'To: ' + c.recipientName : '') + (c.purchaserName ? ' (From: ' + c.purchaserName + ')' : ''),
              details: c.giftMessage || c.description || '',
              dates: c.timestamp ? String(c.timestamp).split(',')[0] : 'No Expiry'
            });
          });
        }
        if (activeStatusFilter === 'all' || activeStatusFilter === 'promo_codes') {
          (giftCodesData.promoCodes || []).forEach(function (p) {
            var valDisp = p.type === 'percent' ? (p.value + '% OFF') : ('$' + (Number(p.value) || 0).toFixed(2) + ' OFF');
            combinedCodes.push({
              codeType: 'Promo Code',
              target: 'promo',
              raw: p,
              code: p.code,
              status: p.status,
              valueDisplay: valDisp,
              numericVal: Number(p.value) || 0,
              party: 'Storewide / Public Promo',
              details: p.description || '',
              dates: (p.startDate || 'Now') + ' → ' + (p.endDate || 'Ongoing')
            });
          });
        }

        var filteredCodes = combinedCodes.filter(function (item) {
          if (searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            var hay = (item.code + ' ' + item.codeType + ' ' + item.party + ' ' + item.details).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });

        var gcSort = sortState.gift_codes;
        filteredCodes.sort(function (a, b) {
          var av = gcSort.col === 'numericVal' ? a.numericVal : (a[gcSort.col] || '');
          var bv = gcSort.col === 'numericVal' ? b.numericVal : (b[gcSort.col] || '');
          if (typeof av === 'number' && typeof bv === 'number') return gcSort.dir === 'asc' ? av - bv : bv - av;
          return gcSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });

        var gcBanner = renderLoadingOrErrorBanner('gift_codes', 'Gift Cards & Promo Codes');
        var gcHtml = '<div class="atelier-table-toolbar">' +
          '<h3 class="atelier-table-title">Digital Gift Cards &amp; Promo Codes</h3>' +
          '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
            '<span class="atelier-count-pill">' + filteredCodes.length + ' codes</span>' +
            '<button type="button" class="atelier-btn-action" id="atelier-new-promocode-btn">+ Promo Code</button>' +
          '</div>' +
          '</div>' + gcBanner + '<div class="atelier-table-wrap"><table class="atelier-table"><thead><tr>' +
          renderSortTh('CODE', 'code', 'gift_codes', false) +
          renderSortTh('TYPE', 'codeType', 'gift_codes', false) +
          renderSortTh('BALANCE / DISCOUNT', 'numericVal', 'gift_codes', true) +
          renderSortTh('RECIPIENT / SCOPE', 'party', 'gift_codes', false) +
          '<th>MESSAGE / DESCRIPTION</th>' +
          renderSortTh('VALIDITY / ISSUED', 'dates', 'gift_codes', false) +
          renderSortTh('STATUS', 'status', 'gift_codes', false) +
          '<th style="text-align: right;">ACTION</th>' +
          '</tr></thead><tbody>';

        filteredCodes.forEach(function (c) {
          var isSelected = selectedItem && selectedItem.code === c.code && !selectedItem.__isNew;
          gcHtml += '<tr style="' + (isSelected ? 'background: #fcf6e9;' : '') + '">' +
            '<td><strong style="font-family: monospace; font-size: 0.85rem; color: #2c1e14; background: #f5efe6; padding: 0.2rem 0.45rem; border-radius: 4px; border: 1px solid #dfd5c7;">' + escapeHtml(c.code) + '</strong></td>' +
            '<td><span class="atelier-item-meta">' + escapeHtml(c.codeType) + '</span></td>' +
            '<td style="text-align: right; font-family: monospace; font-weight: 700; color: #166534;">' + escapeHtml(c.valueDisplay) + '</td>' +
            '<td><strong>' + escapeHtml(c.party) + '</strong></td>' +
            '<td style="font-size: 0.78rem; color: #6e5e54;">' + escapeHtml(c.details) + '</td>' +
            '<td style="font-family: monospace; font-size: 0.75rem; color: #7d6b5e;">' + escapeHtml(c.dates) + '</td>' +
            '<td>' + getStatusBadge(c.status) + '</td>' +
            '<td style="text-align: right;"><button type="button" class="atelier-btn-action atelier-inspect-code-btn" data-code="' + escapeHtml(c.code) + '" data-target="' + escapeHtml(c.target) + '">Edit</button></td>' +
            '</tr>';
        });
        gcHtml += '</tbody></table></div>';
        wrap.innerHTML = gcHtml;
        wireSorting(wrap);

        var newPromoBtn = document.getElementById('atelier-new-promocode-btn');
        if (newPromoBtn) {
          newPromoBtn.addEventListener('click', function () {
            selectedItem = { __isNew: true, target: 'promo', code: '', type: 'percent' };
            renderTable();
            renderInspector();
          });
        }
        wrap.querySelectorAll('.atelier-inspect-code-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var codeStr = btn.getAttribute('data-code');
            var target = btn.getAttribute('data-target');
            var found = combinedCodes.find(function (x) { return x.code === codeStr && x.target === target; });
            selectedItem = found || null;
            renderTable();
            renderInspector();
          });
        });
      }
    }

    function wireCloseInspectorBtn() {
      var closeBtn = document.getElementById('atelier-close-inspector-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          selectedItem = null;
          renderTable();
          renderInspector();
        });
      }
    }

    function renderInspector() {
      var ws = document.getElementById('atelier-workspace');
      var insp = document.getElementById('atelier-inspector');
      if (!ws || !insp) return;

      if (!selectedItem || currentDomain === 'beans') {
        ws.classList.remove('has-inspector');
        insp.style.display = 'none';
        return;
      }

      ws.classList.add('has-inspector');
      insp.style.display = 'block';

      if (currentDomain === 'orders') {
        var parsedItems = parseOrderItems(selectedItem.items, selectedItem.total);
        var hasMissingExplicitPrice = parsedItems.some(function (it) { return !it.hasExplicitPrice && it.unitPrice !== null; });
        var hasMissingGrind = parsedItems.some(function (it) { return !it.grind; });
        var itemsHtml = '<div class="atelier-item-flow" id="atelier-inspector-items-preview">' +
          parsedItems.map(formatItemPill).join('') +
          '</div>';
        var orderStatuses = ['Received', 'Delayed', 'Roasted', 'Ready for Pickup', 'Ready to Deliver', 'Delivered', 'Cancelled'];
        var statusOptsHtml = orderStatuses.map(function (st) {
          var sel = String(selectedItem.status || 'Received').toLowerCase() === st.toLowerCase() ? ' selected' : '';
          return '<option value="' + escapeHtml(st) + '"' + sel + '>' + escapeHtml(st) + '</option>';
        }).join('');
        var manageLink = orderManageBaseUrl + '?orderId=' + encodeURIComponent(selectedItem.orderId) + '&token=' + encodeURIComponent(selectedItem.token || '');

        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Order Inspector</div>' +
              '<h3 class="atelier-inspector-title">#' + escapeHtml(selectedItem.orderId) + '</h3>' +
            '</div>' +
            '<div class="atelier-inspector-price">' + escapeHtml(formatCurrencyDisplay(selectedItem.total)) + '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Customer &amp; Contact</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.name) + '</strong><br>' +
              '<a href="mailto:' + escapeHtml(selectedItem.email) + '" style="color: #7d6b5e; text-decoration: underline;">' + escapeHtml(selectedItem.email) + '</a>' +
              (selectedItem.phone ? ' • ' + escapeHtml(selectedItem.phone) : '') +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Delivery Method &amp; Destination</label>' +
            '<div class="atelier-inspector-value">' + escapeHtml(selectedItem.deliveryMethod) +
              (selectedItem.address ? '<br>' + escapeHtml(selectedItem.address) + (selectedItem.city ? ', ' + escapeHtml(selectedItem.city) : '') : '') +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Ordered Items</label>' +
            '<div style="background: #faf8f5; padding: 0.75rem; border-radius: 6px; border: 1px solid #ede5da;">' + itemsHtml + '</div>' +
          '</div>' +
          (selectedItem.notes ? '<div class="atelier-inspector-field"><label>Customer Instructions</label><div class="atelier-inspector-value" style="font-style: italic; color: #6e5e54;">"' + escapeHtml(selectedItem.notes) + '"</div></div>' : '') +
          '<div class="atelier-inspector-box">' +
            '<div class="atelier-inspector-field">' +
              '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; flex-wrap: wrap; gap: 0.25rem;">' +
                '<label for="atelier-order-items-input" style="margin-bottom: 0;">Ordered Items (Sheet Value)</label>' +
                '<div style="display: flex; gap: 0.35rem; align-items: center;">' +
                  (hasMissingGrind ? '<button type="button" id="atelier-fill-grind-btn" class="atelier-btn-action" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;">+ Fill Default Grind</button>' : '') +
                  (hasMissingExplicitPrice ? '<button type="button" id="atelier-fill-prices-btn" class="atelier-btn-action" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;">+ Fill Missing Prices</button>' : '') +
                '</div>' +
              '</div>' +
              '<textarea id="atelier-order-items-input" class="atelier-textarea" rows="3" style="font-family: monospace; font-size: 0.75rem;">' + escapeHtml(selectedItem.items || '') + '</textarea>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label for="atelier-order-status-select">Fulfillment Status</label>' +
              '<select id="atelier-order-status-select" class="atelier-select">' + statusOptsHtml + '</select>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label for="atelier-order-status-details">Status Note / Delay Reason (Included in Email)</label>' +
              '<textarea id="atelier-order-status-details" class="atelier-textarea" rows="2" placeholder="Optional note for customer...">' + escapeHtml(selectedItem.statusDetails || '') + '</textarea>' +
            '</div>' +
            '<label class="atelier-checkbox-label">' +
              '<input type="checkbox" id="atelier-order-notify-cb"> Email status update to customer' +
            '</label>' +
            '<div id="atelier-order-notice-pill" class="atelier-notice-pill">Status changes silently in sheet</div>' +
            '<div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">' +
              '<button type="button" id="atelier-order-save-btn" class="atelier-btn-primary" style="flex: 1; padding: 0.55rem 0.75rem; font-size: 0.8rem;">Save Order</button>' +
            '</div>' +
            '<div id="atelier-order-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem;">' +
            '<a href="' + escapeHtml(manageLink) + '" target="_blank" rel="noopener" style="color: #9c6d12; font-weight: 700; text-decoration: underline;">Open Customer View →</a>' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        var itemsInput = document.getElementById('atelier-order-items-input');
        var fillPricesBtn = document.getElementById('atelier-fill-prices-btn');
        var fillGrindBtn = document.getElementById('atelier-fill-grind-btn');
        var itemsPreview = document.getElementById('atelier-inspector-items-preview');
        var statusSelect = document.getElementById('atelier-order-status-select');
        var notifyCb = document.getElementById('atelier-order-notify-cb');
        var noticePill = document.getElementById('atelier-order-notice-pill');
        var saveOrderBtn = document.getElementById('atelier-order-save-btn');
        var detailsInput = document.getElementById('atelier-order-status-details');
        var feedbackEl = document.getElementById('atelier-order-feedback');

        if (itemsInput && itemsPreview) {
          itemsInput.addEventListener('input', function () {
            var updatedParsed = parseOrderItems(itemsInput.value, selectedItem.total);
            itemsPreview.innerHTML = updatedParsed.map(formatItemPill).join('');
          });
        }

        if (fillGrindBtn && itemsInput) {
          fillGrindBtn.addEventListener('click', function () {
            var dGrind = (typeof window !== 'undefined' && window.YWR_DEFAULT_GRIND) || 'Whole Bean';
            itemsInput.value = injectMissingGrindIntoItemsString(itemsInput.value, dGrind);
            var updatedParsed = parseOrderItems(itemsInput.value, selectedItem.total);
            if (itemsPreview) {
              itemsPreview.innerHTML = updatedParsed.map(formatItemPill).join('');
            }
            fillGrindBtn.style.display = 'none';
          });
        }

        if (fillPricesBtn && itemsInput) {
          fillPricesBtn.addEventListener('click', function () {
            itemsInput.value = injectMissingPricesIntoItemsString(itemsInput.value, selectedItem.total);
            var updatedParsed = parseOrderItems(itemsInput.value, selectedItem.total);
            if (itemsPreview) {
              itemsPreview.innerHTML = updatedParsed.map(formatItemPill).join('');
            }
            fillPricesBtn.style.display = 'none';
          });
        }

        function syncOrderEmailNotice() {
          var isChecked = notifyCb.checked;
          if (isChecked) {
            noticePill.textContent = '📧 Will email ' + (selectedItem.email || 'customer') + ' (' + statusSelect.value + ')';
            noticePill.classList.add('is-emailing');
            saveOrderBtn.textContent = 'Save & Send Email';
          } else {
            noticePill.textContent = 'Status changes silently in sheet';
            noticePill.classList.remove('is-emailing');
            saveOrderBtn.textContent = 'Save Order';
          }
        }

        statusSelect.addEventListener('change', function () {
          var val = statusSelect.value;
          var changed = val.toLowerCase() !== String(selectedItem.status || '').toLowerCase();
          var notable = ['Delayed', 'Roasted', 'Ready for Pickup', 'Ready to Deliver', 'Delivered', 'Cancelled'].indexOf(val) !== -1;
          notifyCb.checked = changed && notable;
          syncOrderEmailNotice();
        });
        notifyCb.addEventListener('change', syncOrderEmailNotice);

        saveOrderBtn.addEventListener('click', function () {
          var newStatus = statusSelect.value;
          var newDetails = detailsInput.value.trim();
          var newItems = itemsInput ? itemsInput.value.trim() : selectedItem.items;
          var shouldNotify = notifyCb.checked;
          saveOrderBtn.disabled = true;
          saveOrderBtn.textContent = 'Saving...';
          feedbackEl.className = 'atelier-feedback';
          feedbackEl.textContent = '';

          resolveAdminHash(getStoredKey()).then(function (hash) {
            return fetch(ordersApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'admin_update_status',
                adminKey: getStoredKey(),
                adminHash: hash,
                orderId: selectedItem.orderId,
                status: newStatus,
                statusDetails: newDetails,
                items: newItems,
                notifyCustomer: !!shouldNotify
              }),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              saveOrderBtn.disabled = false;
              syncOrderEmailNotice();
              if (res && res.success) {
                selectedItem.status = newStatus;
                selectedItem.statusDetails = newDetails;
                if (newItems) selectedItem.items = newItems;
                notifyCb.checked = false;
                syncOrderEmailNotice();
                feedbackEl.className = 'atelier-feedback is-success';
                feedbackEl.textContent = shouldNotify ? 'Saved & customer emailed!' : 'Order updated.';
                renderKPICards();
                renderQueryDeck();
                renderTable();
                renderInspector();
              } else {
                feedbackEl.className = 'atelier-feedback is-error';
                feedbackEl.textContent = (res && res.error) || 'Failed to update status.';
              }
            })
            .catch(function () {
              saveOrderBtn.disabled = false;
              syncOrderEmailNotice();
              feedbackEl.className = 'atelier-feedback is-error';
              feedbackEl.textContent = 'Network error updating order.';
            });
        });

      } else if (currentDomain === 'bean_orders') {
        var isNewGbo = !!selectedItem.__isNew;
        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Green Bean Purchase Order</div>' +
              '<h3 class="atelier-inspector-title">' + (isNewGbo ? 'New Bean Order' : escapeHtml(selectedItem.orderId)) + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-box" style="margin-top: 0;">' +
            (!isNewGbo ? '<div class="atelier-inspector-field"><label>Order ID</label><input type="text" id="atelier-gbo-id" class="atelier-input" value="' + escapeHtml(selectedItem.orderId || '') + '" readonly style="background: #f3ede2;"></div>' : '') +
            '<div class="atelier-inspector-field">' +
              '<label>Bean Name / Origin Lot</label>' +
              '<input type="text" id="atelier-gbo-name" class="atelier-input" value="' + escapeHtml(selectedItem.name || '') + '" placeholder="e.g. Ethiopia Yirgacheffe">' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Supplier</label>' +
                '<input type="text" id="atelier-gbo-supplier" class="atelier-input" value="' + escapeHtml(selectedItem.supplier || '') + '" placeholder="Sweet Maria\'s">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Supplier Order #</label>' +
                '<input type="text" id="atelier-gbo-sup-id" class="atelier-input" value="' + escapeHtml(selectedItem.supplierOrderId || '') + '">' +
              '</div>' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Order Date</label>' +
                '<input type="date" id="atelier-gbo-date" class="atelier-input" value="' + escapeHtml(selectedItem.date || todayIso()) + '">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Total Cost ($)</label>' +
                '<input type="number" step="0.01" id="atelier-gbo-cost" class="atelier-input" value="' + escapeHtml(selectedItem.cost !== undefined ? selectedItem.cost : '') + '">' +
              '</div>' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Weight (lbs)</label>' +
                '<input type="number" step="0.01" id="atelier-gbo-lbs" class="atelier-input" value="' + escapeHtml(selectedItem.weightLbs !== undefined ? selectedItem.weightLbs : '') + '">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Adjust (g)</label>' +
                '<input type="number" step="1" id="atelier-gbo-adj" class="atelier-input" value="' + escapeHtml(selectedItem.adjustGrams || 0) + '">' +
              '</div>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Lot / Listing URL</label>' +
              '<input type="url" id="atelier-gbo-url" class="atelier-input" value="' + escapeHtml(selectedItem.url || '') + '" placeholder="https://...">' +
            '</div>' +
            '<button type="button" id="atelier-gbo-save-btn" class="atelier-btn-primary" style="width: 100%; padding: 0.6rem; font-size: 0.8rem;">' + (isNewGbo ? 'Record Bean Order' : 'Save Changes') + '</button>' +
            '<div id="atelier-gbo-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; text-align: right;">' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        var gboSaveBtn = document.getElementById('atelier-gbo-save-btn');
        var gboFeedback = document.getElementById('atelier-gbo-feedback');
        gboSaveBtn.addEventListener('click', function () {
          var payload = {
            action: isNewGbo ? 'create_green_bean_order' : 'update_green_bean_order',
            orderId: isNewGbo ? undefined : selectedItem.orderId,
            name: document.getElementById('atelier-gbo-name').value.trim(),
            supplier: document.getElementById('atelier-gbo-supplier').value.trim(),
            supplierOrderId: document.getElementById('atelier-gbo-sup-id').value.trim(),
            date: document.getElementById('atelier-gbo-date').value,
            cost: Number(document.getElementById('atelier-gbo-cost').value) || 0,
            weightLbs: Number(document.getElementById('atelier-gbo-lbs').value) || 0,
            adjustGrams: Number(document.getElementById('atelier-gbo-adj').value) || 0,
            url: document.getElementById('atelier-gbo-url').value.trim()
          };
          gboSaveBtn.disabled = true;
          gboSaveBtn.textContent = 'Saving...';
          resolveAdminHash(getStoredKey()).then(function (token) {
            payload.adminKey = token;
            return fetch(roastsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(payload),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              gboSaveBtn.disabled = false;
              gboSaveBtn.textContent = isNewGbo ? 'Record Bean Order' : 'Save Changes';
              if (res && !res.error) {
                gboFeedback.className = 'atelier-feedback is-success';
                gboFeedback.textContent = 'Saved! Refreshing inventory...';
                loadRoasts(getStoredKey(), function (err, rData) {
                  if (!err && rData) {
                    roastsData = rData;
                    renderAll();
                  }
                });
              } else {
                gboFeedback.className = 'atelier-feedback is-error';
                gboFeedback.textContent = (res && res.error) || 'Failed to save bean order.';
              }
            })
            .catch(function () {
              gboSaveBtn.disabled = false;
              gboFeedback.className = 'atelier-feedback is-error';
              gboFeedback.textContent = 'Network error saving bean order.';
            });
        });

      } else if (currentDomain === 'roasts') {
        var isNewRoast = !!selectedItem.__isNew;
        var gboAll = (roastsData && roastsData.greenBeanOrders) || [];
        var existingComps = (selectedItem.greenBeanComponents && selectedItem.greenBeanComponents.length > 0)
          ? selectedItem.greenBeanComponents
          : [{ orderId: '', weightGrams: selectedItem.greenWeightGrams || '' }];

        var levelKeys = Object.keys(roastLevels);
        var levelOptsHtml = levelKeys.map(function (lvlKey) {
          var lvlObj = roastLevels[lvlKey];
          var curLvl = String(selectedItem.roastLevel || '').trim();
          var isSel = curLvl === String(lvlKey) ||
            curLvl.toLowerCase() === String(lvlObj.specialty || '').toLowerCase() ||
            curLvl.toLowerCase() === String(lvlObj.name || '').toLowerCase();
          return '<option value="' + escapeHtml(lvlKey) + '"' + (isSel ? ' selected' : '') + '>' + escapeHtml(lvlObj.specialty || lvlObj.name) + '</option>';
        }).join('');

        function buildGboOptions(selectedOrdId) {
          var opts = '<option value="">Select Green Bean Lot...</option>';
          gboAll.forEach(function (ord) {
            var avail = Number(ord.availableGrams) || 0;
            var isSel = String(ord.orderId) === String(selectedOrdId);
            if (avail <= 0 && !isSel) return;
            opts += '<option value="' + escapeHtml(ord.orderId) + '"' + (isSel ? ' selected' : '') + '>' +
              escapeHtml(ord.orderId) + ' — ' + escapeHtml(ord.name) + ' (' + avail + 'g avail)</option>';
          });
          return opts;
        }

        var compRowsHtml = existingComps.map(function (c) {
          return '<div class="atelier-roast-comp-row" style="display: grid; grid-template-columns: 1fr 90px; gap: 0.4rem; margin-bottom: 0.4rem;">' +
            '<select class="atelier-select atelier-roast-comp-order">' + buildGboOptions(c.orderId) + '</select>' +
            '<input type="number" class="atelier-input atelier-roast-comp-grams" placeholder="Grams" value="' + escapeHtml(c.weightGrams || '') + '">' +
          '</div>';
        }).join('');

        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Roast Batch Log</div>' +
              '<h3 class="atelier-inspector-title">' + (isNewRoast ? 'New Roast Batch' : escapeHtml(selectedItem.roastId)) + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-box" style="margin-top: 0;">' +
            (!isNewRoast ? '<div class="atelier-inspector-field"><label>Batch ID</label><input type="text" id="atelier-roast-id" class="atelier-input" value="' + escapeHtml(selectedItem.roastId || '') + '" readonly style="background: #f3ede2;"></div>' : '') +
            '<div class="atelier-inspector-field">' +
              '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<label style="margin: 0;">Green Bean Lots &amp; Grams</label>' +
                '<button type="button" id="atelier-add-roast-comp-btn" class="atelier-btn-action" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;">+ Add Lot</button>' +
              '</div>' +
              '<div id="atelier-roast-comps-wrap" style="margin-top: 0.35rem;">' + compRowsHtml + '</div>' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Roast Date</label>' +
                '<input type="date" id="atelier-roast-date" class="atelier-input" value="' + escapeHtml(selectedItem.date || todayIso()) + '">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Roast Level</label>' +
                '<select id="atelier-roast-level" class="atelier-select">' + levelOptsHtml + '</select>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Roasted Yield (g)</label>' +
                '<input type="number" id="atelier-roast-end-grams" class="atelier-input" value="' + escapeHtml(selectedItem.endWeightGrams || '') + '">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Profile URL</label>' +
                '<input type="url" id="atelier-roast-url" class="atelier-input" value="' + escapeHtml(selectedItem.profileUrl || '') + '" placeholder="https://...">' +
              '</div>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Tasting / Roast Notes</label>' +
              '<textarea id="atelier-roast-notes" class="atelier-textarea" rows="2">' + escapeHtml(selectedItem.notes || '') + '</textarea>' +
            '</div>' +
            '<button type="button" id="atelier-roast-save-btn" class="atelier-btn-primary" style="width: 100%; padding: 0.6rem; font-size: 0.8rem;">' + (isNewRoast ? 'Record Roast Batch' : 'Save Roast Batch') + '</button>' +
            '<div id="atelier-roast-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; text-align: right;">' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        document.getElementById('atelier-add-roast-comp-btn').addEventListener('click', function () {
          var wrapEl = document.getElementById('atelier-roast-comps-wrap');
          var div = document.createElement('div');
          div.className = 'atelier-roast-comp-row';
          div.style.cssText = 'display: grid; grid-template-columns: 1fr 90px; gap: 0.4rem; margin-bottom: 0.4rem;';
          div.innerHTML = '<select class="atelier-select atelier-roast-comp-order">' + buildGboOptions('') + '</select>' +
            '<input type="number" class="atelier-input atelier-roast-comp-grams" placeholder="Grams">';
          wrapEl.appendChild(div);
        });

        var roastSaveBtn = document.getElementById('atelier-roast-save-btn');
        var roastFeedback = document.getElementById('atelier-roast-feedback');
        roastSaveBtn.addEventListener('click', function () {
          var comps = [];
          var totalGreen = 0;
          var beanNames = [];
          document.querySelectorAll('.atelier-roast-comp-row').forEach(function (row) {
            var oid = row.querySelector('.atelier-roast-comp-order').value;
            var wg = Number(row.querySelector('.atelier-roast-comp-grams').value) || 0;
            if (oid && wg > 0) {
              comps.push({ orderId: oid, weightGrams: wg });
              totalGreen += wg;
              var matchOrd = gboAll.find(function (o) { return String(o.orderId) === String(oid); });
              if (matchOrd && matchOrd.name && beanNames.indexOf(matchOrd.name) === -1) {
                beanNames.push(matchOrd.name);
              }
            }
          });

          var payload = {
            action: isNewRoast ? 'create_roast_log' : 'update_roast_log',
            roastId: isNewRoast ? undefined : selectedItem.roastId,
            greenBeanComponents: comps,
            beanName: beanNames.join(' / ') || selectedItem.beanName || '',
            date: document.getElementById('atelier-roast-date').value,
            roastLevel: Number(document.getElementById('atelier-roast-level').value),
            greenWeightGrams: totalGreen,
            endWeightGrams: Number(document.getElementById('atelier-roast-end-grams').value) || 0,
            profileUrl: document.getElementById('atelier-roast-url').value.trim(),
            notes: document.getElementById('atelier-roast-notes').value.trim()
          };

          roastSaveBtn.disabled = true;
          roastSaveBtn.textContent = 'Saving...';
          resolveAdminHash(getStoredKey()).then(function (token) {
            payload.adminKey = token;
            return fetch(roastsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(payload),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              roastSaveBtn.disabled = false;
              roastSaveBtn.textContent = isNewRoast ? 'Record Roast Batch' : 'Save Roast Batch';
              if (res && !res.error) {
                roastFeedback.className = 'atelier-feedback is-success';
                roastFeedback.textContent = 'Saved! Refreshing roast log...';
                loadRoasts(getStoredKey(), function (err, rData) {
                  if (!err && rData) {
                    roastsData = rData;
                    renderAll();
                  }
                });
              } else {
                roastFeedback.className = 'atelier-feedback is-error';
                roastFeedback.textContent = (res && res.error) || 'Failed to save roast batch.';
              }
            })
            .catch(function () {
              roastSaveBtn.disabled = false;
              roastFeedback.className = 'atelier-feedback is-error';
              roastFeedback.textContent = 'Network error saving roast batch.';
            });
        });

      } else if (currentDomain === 'packaging') {
        var isNewPkg = !!selectedItem.__isNew;
        var allRoasts = (roastsData && roastsData.roastLogs) || [];
        var pkgComps = (selectedItem.roastComponents && selectedItem.roastComponents.length > 0)
          ? selectedItem.roastComponents
          : [{ roastId: '', weightGrams: '' }];

        function buildRoastBatchOptions(selectedRid) {
          var opts = '<option value="">Select Roast Batch...</option>';
          allRoasts.forEach(function (r) {
            var avail = Number(r.availableGrams) || 0;
            var isSel = String(r.roastId) === String(selectedRid);
            if (avail <= 0 && !isSel) return;
            opts += '<option value="' + escapeHtml(r.roastId) + '"' + (isSel ? ' selected' : '') + '>' +
              escapeHtml(r.roastId) + ' — ' + escapeHtml(r.beanName) + ' (' + avail + 'g avail)</option>';
          });
          return opts;
        }

        var bagSizeOpts = '<option value="Custom">Custom / Loose</option>' +
          bagSizes.map(function (b) {
            var grams = Math.round((Number(b.weight_oz) / 16) * GRAMS_PER_LB);
            var sel = String(selectedItem.bagSize || '').toLowerCase() === String(b.id).toLowerCase() ? ' selected' : '';
            return '<option value="' + escapeHtml(b.id) + '"' + sel + '>' + escapeHtml(b.label) + ' (' + grams + 'g)</option>';
          }).join('');

        var pkgRowsHtml = pkgComps.map(function (c) {
          return '<div class="atelier-pkg-comp-row" style="display: grid; grid-template-columns: 1fr 90px; gap: 0.4rem; margin-bottom: 0.4rem;">' +
            '<select class="atelier-select atelier-pkg-comp-roast">' + buildRoastBatchOptions(c.roastId) + '</select>' +
            '<input type="number" class="atelier-input atelier-pkg-comp-grams" placeholder="Grams" value="' + escapeHtml(c.weightGrams || '') + '">' +
          '</div>';
        }).join('');

        var purposes = ['Order', 'Subscription', 'Sample', 'Gift', 'Personal / Cupping'];
        var purposeOpts = purposes.map(function (p) {
          var sel = String(selectedItem.purpose || 'Order').toLowerCase() === p.toLowerCase() ? ' selected' : '';
          return '<option value="' + escapeHtml(p) + '"' + sel + '>' + escapeHtml(p) + '</option>';
        }).join('');

        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Master Blend &amp; Packaging</div>' +
              '<h3 class="atelier-inspector-title">' + (isNewPkg ? 'New Packaging Record' : escapeHtml(selectedItem.logId)) + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-box" style="margin-top: 0;">' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Date</label>' +
                '<input type="date" id="atelier-pkg-date" class="atelier-input" value="' + escapeHtml(selectedItem.date || todayIso()) + '">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Purpose</label>' +
                '<select id="atelier-pkg-purpose" class="atelier-select">' + purposeOpts + '</select>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-field-grid">' +
              '<div class="atelier-inspector-field">' +
                '<label>Order / Sub # (Optional)</label>' +
                '<input type="text" id="atelier-pkg-order-id" class="atelier-input" value="' + escapeHtml(selectedItem.orderId || '') + '" placeholder="e.g. YWR-1024">' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Bag Size</label>' +
                '<select id="atelier-pkg-bagsize" class="atelier-select">' + bagSizeOpts + '</select>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Product / Blend Name</label>' +
              '<input type="text" id="atelier-pkg-product" class="atelier-input" list="atelier-catalog-roasts" value="' + escapeHtml(selectedItem.product || '') + '" placeholder="e.g. Golden Hour">' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<label style="margin: 0;">Roast Batch Components</label>' +
                '<button type="button" id="atelier-add-pkg-comp-btn" class="atelier-btn-action" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;">+ Add Batch</button>' +
              '</div>' +
              '<div id="atelier-pkg-comps-wrap" style="margin-top: 0.35rem;">' + pkgRowsHtml + '</div>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Notes</label>' +
              '<input type="text" id="atelier-pkg-notes" class="atelier-input" value="' + escapeHtml(selectedItem.notes || '') + '">' +
            '</div>' +
            '<button type="button" id="atelier-pkg-save-btn" class="atelier-btn-primary" style="width: 100%; padding: 0.6rem; font-size: 0.8rem;">' + (isNewPkg ? 'Record Packaging' : 'Save Changes') + '</button>' +
            '<div id="atelier-pkg-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; text-align: right;">' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        document.getElementById('atelier-add-pkg-comp-btn').addEventListener('click', function () {
          var wrapEl = document.getElementById('atelier-pkg-comps-wrap');
          var div = document.createElement('div');
          div.className = 'atelier-pkg-comp-row';
          div.style.cssText = 'display: grid; grid-template-columns: 1fr 90px; gap: 0.4rem; margin-bottom: 0.4rem;';
          div.innerHTML = '<select class="atelier-select atelier-pkg-comp-roast">' + buildRoastBatchOptions('') + '</select>' +
            '<input type="number" class="atelier-input atelier-pkg-comp-grams" placeholder="Grams">';
          wrapEl.appendChild(div);
        });

        var pkgSaveBtn = document.getElementById('atelier-pkg-save-btn');
        var pkgFeedback = document.getElementById('atelier-pkg-feedback');
        pkgSaveBtn.addEventListener('click', function () {
          var rComps = [];
          document.querySelectorAll('.atelier-pkg-comp-row').forEach(function (row) {
            var rid = row.querySelector('.atelier-pkg-comp-roast').value;
            var wg = Number(row.querySelector('.atelier-pkg-comp-grams').value) || 0;
            if (rid && wg > 0) {
              rComps.push({ roastId: rid, weightGrams: wg });
            }
          });

          var payload = {
            action: isNewPkg ? 'create_blend_packaging_log' : 'update_blend_packaging_log',
            logId: isNewPkg ? undefined : selectedItem.logId,
            date: document.getElementById('atelier-pkg-date').value,
            purpose: document.getElementById('atelier-pkg-purpose').value,
            orderId: document.getElementById('atelier-pkg-order-id').value.trim(),
            product: document.getElementById('atelier-pkg-product').value.trim(),
            bagSize: document.getElementById('atelier-pkg-bagsize').value,
            roastComponents: rComps,
            notes: document.getElementById('atelier-pkg-notes').value.trim()
          };

          pkgSaveBtn.disabled = true;
          pkgSaveBtn.textContent = 'Saving...';
          resolveAdminHash(getStoredKey()).then(function (token) {
            payload.adminKey = token;
            return fetch(roastsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(payload),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              pkgSaveBtn.disabled = false;
              pkgSaveBtn.textContent = isNewPkg ? 'Record Packaging' : 'Save Changes';
              if (res && !res.error) {
                pkgFeedback.className = 'atelier-feedback is-success';
                pkgFeedback.textContent = 'Saved! Refreshing packaging log...';
                loadRoasts(getStoredKey(), function (err, rData) {
                  if (!err && rData) {
                    roastsData = rData;
                    renderAll();
                  }
                });
              } else {
                pkgFeedback.className = 'atelier-feedback is-error';
                pkgFeedback.textContent = (res && res.error) || 'Failed to save packaging record.';
              }
            })
            .catch(function () {
              pkgSaveBtn.disabled = false;
              pkgFeedback.className = 'atelier-feedback is-error';
              pkgFeedback.textContent = 'Network error saving packaging record.';
            });
        });

      } else if (currentDomain === 'subscriptions') {
        var subStatuses = ['Active', 'Paused', 'Cancelled'];
        var subOpts = subStatuses.map(function (st) {
          var sel = String(selectedItem.status || 'Active').toLowerCase() === st.toLowerCase() ? ' selected' : '';
          return '<option value="' + escapeHtml(st) + '"' + sel + '>' + escapeHtml(st) + '</option>';
        }).join('');
        var subPortalLink = subManageBaseUrl + '?id=' + encodeURIComponent(selectedItem.orderId) + '&token=' + encodeURIComponent(selectedItem.token || '');

        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Subscription Inspector</div>' +
              '<h3 class="atelier-inspector-title">#' + escapeHtml(selectedItem.orderId) + '</h3>' +
            '</div>' +
            '<div class="atelier-inspector-price">$' + parseCurrencyVal(selectedItem.cost).toFixed(2) + '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Subscriber</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.name) + '</strong><br>' +
              '<a href="mailto:' + escapeHtml(selectedItem.email) + '" style="color: #7d6b5e; text-decoration: underline;">' + escapeHtml(selectedItem.email) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Plan &amp; Cadence</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.roast) + '</strong> • ' +
              escapeHtml(selectedItem.size) + ' • ' + escapeHtml(selectedItem.grind || '') + '<br>' +
              'Frequency: <strong>' + escapeHtml(selectedItem.frequency) + '</strong>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Delivery</label>' +
            '<div class="atelier-inspector-value">' + escapeHtml(selectedItem.deliveryMethod) +
              (selectedItem.address ? '<br>' + escapeHtml(selectedItem.address) + (selectedItem.city ? ', ' + escapeHtml(selectedItem.city) : '') : '') +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-box">' +
            '<div class="atelier-inspector-field">' +
              '<label>Subscription Status</label>' +
              '<select id="atelier-sub-status-select" class="atelier-select">' + subOpts + '</select>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Status Details / Customer Note</label>' +
              '<textarea id="atelier-sub-details" class="atelier-textarea" rows="2">' + escapeHtml(selectedItem.statusDetails || '') + '</textarea>' +
            '</div>' +
            '<label class="atelier-checkbox-label">' +
              '<input type="checkbox" id="atelier-sub-notify-cb" checked> Email update to subscriber' +
            '</label>' +
            '<button type="button" id="atelier-sub-save-btn" class="atelier-btn-primary" style="width: 100%; margin-top: 0.65rem; padding: 0.55rem;">Save Status</button>' +
            '<div id="atelier-sub-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem;">' +
            '<a href="' + escapeHtml(subPortalLink) + '" target="_blank" rel="noopener" style="color: #9c6d12; font-weight: 700; text-decoration: underline;">Customer Portal →</a>' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        var subSaveBtn = document.getElementById('atelier-sub-save-btn');
        var subFeedback = document.getElementById('atelier-sub-feedback');
        subSaveBtn.addEventListener('click', function () {
          var newStatus = document.getElementById('atelier-sub-status-select').value;
          var newDetails = document.getElementById('atelier-sub-details').value.trim();
          var notify = document.getElementById('atelier-sub-notify-cb').checked;
          subSaveBtn.disabled = true;
          subSaveBtn.textContent = 'Saving...';
          resolveAdminHash(getStoredKey()).then(function (hash) {
            return fetch(subsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'admin_update_status',
                adminHash: hash,
                orderId: selectedItem.orderId,
                status: newStatus,
                statusDetails: newDetails,
                notifyCustomer: !!notify
              }),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              subSaveBtn.disabled = false;
              subSaveBtn.textContent = 'Save Status';
              if (res && res.success) {
                selectedItem.status = newStatus;
                selectedItem.statusDetails = newDetails;
                subFeedback.className = 'atelier-feedback is-success';
                subFeedback.textContent = notify ? 'Saved & subscriber emailed!' : 'Subscription updated.';
                renderKPICards();
                renderQueryDeck();
                renderTable();
              } else {
                subFeedback.className = 'atelier-feedback is-error';
                subFeedback.textContent = (res && res.error) || 'Failed to update subscription.';
              }
            })
            .catch(function () {
              subSaveBtn.disabled = false;
              subSaveBtn.textContent = 'Save Status';
              subFeedback.className = 'atelier-feedback is-error';
              subFeedback.textContent = 'Network error updating subscription.';
            });
        });

      } else if (currentDomain === 'gift_subs') {
        var gsStatuses = ['Active', 'Completed', 'Cancelled'];
        var gsOpts = gsStatuses.map(function (st) {
          var sel = String(selectedItem.status || 'Active').toLowerCase() === st.toLowerCase() ? ' selected' : '';
          return '<option value="' + escapeHtml(st) + '"' + sel + '>' + escapeHtml(st) + '</option>';
        }).join('');

        insp.innerHTML = '' +
          '<div class="atelier-inspector-header">' +
            '<div>' +
              '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Gift Subscription</div>' +
              '<h3 class="atelier-inspector-title">#' + escapeHtml(selectedItem.orderId) + '</h3>' +
            '</div>' +
            '<div class="atelier-inspector-price">$' + parseCurrencyVal(selectedItem.cost).toFixed(2) + '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Recipient</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.recipientName) + '</strong><br>' +
              '<a href="mailto:' + escapeHtml(selectedItem.recipientEmail) + '" style="color: #7d6b5e; text-decoration: underline;">' + escapeHtml(selectedItem.recipientEmail) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Purchaser</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.purchaserName) + '</strong> (' + escapeHtml(selectedItem.purchaserEmail) + ')</div>' +
          '</div>' +
          '<div class="atelier-inspector-field">' +
            '<label>Gift Plan</label>' +
            '<div class="atelier-inspector-value"><strong>' + escapeHtml(selectedItem.roast) + '</strong> • ' + escapeHtml(selectedItem.duration) + '</div>' +
          '</div>' +
          (selectedItem.giftMessage ? '<div class="atelier-inspector-field"><label>Gift Message</label><div class="atelier-inspector-value" style="font-style: italic; color: #6e5e54;">"' + escapeHtml(selectedItem.giftMessage) + '"</div></div>' : '') +
          (selectedItem.notes ? '<div class="atelier-inspector-field"><label>Special Delivery Instructions</label><div class="atelier-inspector-value">' + escapeHtml(selectedItem.notes) + '</div></div>' : '') +
          '<div class="atelier-inspector-box">' +
            '<div class="atelier-inspector-field">' +
              '<label>Plan Status</label>' +
              '<select id="atelier-gsub-status-select" class="atelier-select">' + gsOpts + '</select>' +
            '</div>' +
            '<div class="atelier-inspector-field">' +
              '<label>Status Note</label>' +
              '<textarea id="atelier-gsub-details" class="atelier-textarea" rows="2">' + escapeHtml(selectedItem.statusDetails || '') + '</textarea>' +
            '</div>' +
            '<label class="atelier-checkbox-label">' +
              '<input type="checkbox" id="atelier-gsub-notify-recip"> Email Recipient' +
            '</label>' +
            '<label class="atelier-checkbox-label">' +
              '<input type="checkbox" id="atelier-gsub-notify-purch"> Email Purchaser' +
            '</label>' +
            '<button type="button" id="atelier-gsub-save-btn" class="atelier-btn-primary" style="width: 100%; margin-top: 0.65rem; padding: 0.55rem;">Save Plan Status</button>' +
            '<div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">' +
              '<button type="button" id="atelier-gsub-resend-recip" class="atelier-btn-action" style="flex: 1; font-size: 0.7rem;">Resend Recipient Email</button>' +
              '<button type="button" id="atelier-gsub-resend-purch" class="atelier-btn-action" style="flex: 1; font-size: 0.7rem;">Resend Purchaser Receipt</button>' +
            '</div>' +
            '<div id="atelier-gsub-feedback" class="atelier-feedback"></div>' +
          '</div>' +
          '<div style="margin-top: 0.85rem; text-align: right;">' +
            '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
          '</div>';

        wireCloseInspectorBtn();
        var gsubSaveBtn = document.getElementById('atelier-gsub-save-btn');
        var gsubFeedback = document.getElementById('atelier-gsub-feedback');
        gsubSaveBtn.addEventListener('click', function () {
          var newStatus = document.getElementById('atelier-gsub-status-select').value;
          var newDetails = document.getElementById('atelier-gsub-details').value.trim();
          var notifyRecip = document.getElementById('atelier-gsub-notify-recip').checked;
          var notifyPurch = document.getElementById('atelier-gsub-notify-purch').checked;
          gsubSaveBtn.disabled = true;
          gsubSaveBtn.textContent = 'Updating...';
          resolveAdminHash(getStoredKey()).then(function (hash) {
            return fetch(giftSubsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'admin_update_status',
                adminHash: hash,
                orderId: selectedItem.orderId,
                status: newStatus,
                statusDetails: newDetails,
                notifyRecipient: !!notifyRecip,
                notifyPurchaser: !!notifyPurch
              }),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              gsubSaveBtn.disabled = false;
              gsubSaveBtn.textContent = 'Update Gift Subscription';
              if (res && res.success) {
                selectedItem.status = newStatus;
                selectedItem.statusDetails = newDetails;
                gsubFeedback.className = 'atelier-feedback is-success';
                gsubFeedback.textContent = 'Gift subscription updated!';
                renderKPICards();
                renderQueryDeck();
                renderTable();
              } else {
                gsubFeedback.className = 'atelier-feedback is-error';
                gsubFeedback.textContent = (res && res.error) || 'Failed to update gift subscription.';
              }
            })
            .catch(function () {
              gsubSaveBtn.disabled = false;
              gsubSaveBtn.textContent = 'Update Gift Subscription';
              gsubFeedback.className = 'atelier-feedback is-error';
              gsubFeedback.textContent = 'Network error.';
            });
        });

        function triggerGsubResend(recipientType, btnEl) {
          btnEl.disabled = true;
          resolveAdminHash(getStoredKey()).then(function (hash) {
            return fetch(giftSubsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'admin_resend_email',
                adminHash: hash,
                orderId: selectedItem.orderId,
                recipientType: recipientType
              }),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              btnEl.disabled = false;
              if (res && res.success) {
                gsubFeedback.className = 'atelier-feedback is-success';
                gsubFeedback.textContent = 'Resent email to ' + recipientType + '!';
              } else {
                gsubFeedback.className = 'atelier-feedback is-error';
                gsubFeedback.textContent = (res && res.error) || 'Failed to resend email.';
              }
            });
        }

        document.getElementById('atelier-gsub-resend-recip').addEventListener('click', function () {
          triggerGsubResend('recipient', this);
        });
        document.getElementById('atelier-gsub-resend-purch').addEventListener('click', function () {
          triggerGsubResend('purchaser', this);
        });

      } else if (currentDomain === 'gift_codes') {
        var isNewCode = !!selectedItem.__isNew;
        var isGift = selectedItem.target === 'gift';
        var raw = selectedItem.raw || {};

        if (isGift) {
          var partyInfo = '';
          if (raw.recipientName || raw.purchaserName) {
            partyInfo = '<div class="atelier-inspector-field">' +
              '<label>Recipient &amp; Purchaser</label>' +
              '<div class="atelier-inspector-value" style="font-size: 0.8rem; line-height: 1.45;">' +
                (raw.recipientName ? '<div><strong>To:</strong> ' + escapeHtml(raw.recipientName) + (raw.recipientEmail ? ' <span style="color: #7d6b5e;">&lt;' + escapeHtml(raw.recipientEmail) + '&gt;</span>' : '') + '</div>' : '') +
                (raw.purchaserName ? '<div><strong>From:</strong> ' + escapeHtml(raw.purchaserName) + (raw.purchaserEmail ? ' <span style="color: #7d6b5e;">&lt;' + escapeHtml(raw.purchaserEmail) + '&gt;</span>' : '') + '</div>' : '') +
              '</div>' +
            '</div>';
          }

          insp.innerHTML = '' +
            '<div class="atelier-inspector-header">' +
              '<div>' +
                '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Digital Gift Card</div>' +
                '<h3 class="atelier-inspector-title">' + escapeHtml(selectedItem.code) + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-inspector-box" style="margin-top: 0;">' +
              partyInfo +
              '<div class="atelier-inspector-field">' +
                '<label>Gift Card Code</label>' +
                '<input type="text" id="atelier-gc-code" class="atelier-input" value="' + escapeHtml(selectedItem.code || '') + '" readonly style="background: #f3ede2;">' +
              '</div>' +
              '<div class="atelier-field-grid">' +
                '<div class="atelier-inspector-field">' +
                  '<label>Current Balance ($)' + (raw.originalAmount ? ' <span style="font-weight: 400; color: #7d6b5e;">(Orig: $' + Number(raw.originalAmount).toFixed(2) + ')</span>' : '') + '</label>' +
                  '<input type="number" step="0.01" id="atelier-gc-val" class="atelier-input" value="' + escapeHtml(raw.currentBalance !== undefined ? raw.currentBalance : '') + '">' +
                '</div>' +
                '<div class="atelier-inspector-field">' +
                  '<label>Expiration Date</label>' +
                  '<input type="date" id="atelier-gc-end" class="atelier-input" value="' + escapeHtml(raw.endDate || '') + '">' +
                '</div>' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Description / Gift Message</label>' +
                '<textarea id="atelier-gc-desc" class="atelier-textarea" rows="2">' + escapeHtml(raw.description || raw.giftMessage || '') + '</textarea>' +
              '</div>' +
              '<button type="button" id="atelier-gc-save-btn" class="atelier-btn-primary" style="width: 100%; padding: 0.55rem;">Save Gift Card</button>' +
              '<div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">' +
                '<button type="button" id="atelier-gc-deactivate-btn" class="atelier-btn-action" style="flex: 1; font-size: 0.7rem;">Deactivate ($0)</button>' +
                '<button type="button" id="atelier-gc-resend-recip" class="atelier-btn-action" style="flex: 1; font-size: 0.7rem;">Email Recipient</button>' +
                '<button type="button" id="atelier-gc-resend-purch" class="atelier-btn-action" style="flex: 1; font-size: 0.7rem;">Email Purchaser</button>' +
              '</div>' +
              '<div id="atelier-gc-feedback" class="atelier-feedback"></div>' +
            '</div>' +
            '<div style="margin-top: 0.85rem; text-align: right;">' +
              '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
            '</div>';
        } else {
          insp.innerHTML = '' +
            '<div class="atelier-inspector-header">' +
              '<div>' +
                '<div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; color: #9c6d12; text-transform: uppercase;">Storewide Promo Code</div>' +
                '<h3 class="atelier-inspector-title">' + (isNewCode ? 'Create Promo Code' : escapeHtml(selectedItem.code)) + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="atelier-inspector-box" style="margin-top: 0;">' +
              '<div class="atelier-inspector-field">' +
                '<label>Promo Code</label>' +
                '<input type="text" id="atelier-gc-code" class="atelier-input" value="' + escapeHtml(selectedItem.code || '') + '"' + (isNewCode ? ' placeholder="e.g. SPRING15"' : ' readonly style="background: #f3ede2;"') + '>' +
              '</div>' +
              '<div class="atelier-field-grid">' +
                '<div class="atelier-inspector-field">' +
                  '<label>Discount Type</label>' +
                  '<select id="atelier-gc-type" class="atelier-select">' +
                    '<option value="percent"' + ((raw.type || 'percent') === 'percent' ? ' selected' : '') + '>Percent (%)</option>' +
                    '<option value="fixed"' + (raw.type === 'fixed' ? ' selected' : '') + '>Fixed ($)</option>' +
                  '</select>' +
                '</div>' +
                '<div class="atelier-inspector-field">' +
                  '<label>Discount Value</label>' +
                  '<input type="number" step="0.01" id="atelier-gc-val" class="atelier-input" value="' + escapeHtml(raw.value !== undefined ? raw.value : '10') + '">' +
                '</div>' +
              '</div>' +
              '<div class="atelier-field-grid">' +
                '<div class="atelier-inspector-field">' +
                  '<label>Start Date</label>' +
                  '<input type="date" id="atelier-gc-start" class="atelier-input" value="' + escapeHtml(raw.startDate || '') + '">' +
                '</div>' +
                '<div class="atelier-inspector-field">' +
                  '<label>End Date</label>' +
                  '<input type="date" id="atelier-gc-end" class="atelier-input" value="' + escapeHtml(raw.endDate || '') + '">' +
                '</div>' +
              '</div>' +
              '<div class="atelier-inspector-field">' +
                '<label>Description</label>' +
                '<input type="text" id="atelier-gc-desc" class="atelier-input" value="' + escapeHtml(raw.description || '') + '">' +
              '</div>' +
              '<button type="button" id="atelier-gc-save-btn" class="atelier-btn-primary" style="width: 100%; padding: 0.55rem;">' + (isNewCode ? 'Create Promo Code' : 'Save Promo Code') + '</button>' +
              '<div id="atelier-gc-feedback" class="atelier-feedback"></div>' +
            '</div>' +
            '<div style="margin-top: 0.85rem; text-align: right;">' +
              '<button type="button" class="atelier-btn-action" id="atelier-close-inspector-btn">Close</button>' +
            '</div>';
        }

        wireCloseInspectorBtn();
        var gcSaveBtn = document.getElementById('atelier-gc-save-btn');
        var gcFeedback = document.getElementById('atelier-gc-feedback');
        gcSaveBtn.addEventListener('click', function () {
          var codeVal = document.getElementById('atelier-gc-code').value.trim().toUpperCase();
          var numVal = parseFloat(document.getElementById('atelier-gc-val').value);
          var endVal = document.getElementById('atelier-gc-end').value;
          var descVal = document.getElementById('atelier-gc-desc').value.trim();
          var typeEl = document.getElementById('atelier-gc-type');
          var startEl = document.getElementById('atelier-gc-start');

          gcSaveBtn.disabled = true;
          gcSaveBtn.textContent = 'Saving...';
          resolveAdminHash(getStoredKey()).then(function (hash) {
            var payload = {
              action: isNewCode ? 'admin_create_code' : 'admin_update_code',
              adminHash: hash,
              target: isGift ? 'gift' : 'promo',
              code: codeVal,
              value: numVal,
              type: isGift ? 'fixed' : (typeEl ? typeEl.value : 'percent'),
              startDate: startEl ? startEl.value : '',
              endDate: endVal,
              description: descVal
            };
            return fetch(giftCodesApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(payload),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              gcSaveBtn.disabled = false;
              gcSaveBtn.textContent = isNewCode ? 'Create' : 'Save';
              if (res && res.success) {
                gcFeedback.className = 'atelier-feedback is-success';
                gcFeedback.textContent = 'Saved! Refreshing codes...';
                loadGiftCodes(getStoredKey(), function (err, gCodes) {
                  if (!err && gCodes) {
                    giftCodesData = gCodes;
                    renderAll();
                  }
                });
              } else {
                gcFeedback.className = 'atelier-feedback is-error';
                gcFeedback.textContent = (res && res.error) || 'Failed to save code.';
              }
            });
        });

        var deactBtn = document.getElementById('atelier-gc-deactivate-btn');
        if (deactBtn) {
          deactBtn.addEventListener('click', function () {
            document.getElementById('atelier-gc-val').value = '0';
            gcSaveBtn.click();
          });
        }

        function triggerGcResend(recipientType, btnEl) {
          btnEl.disabled = true;
          resolveAdminHash(getStoredKey()).then(function (hash) {
            return fetch(giftCodesApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'admin_resend_email',
                adminHash: hash,
                code: selectedItem.code,
                recipientType: recipientType
              }),
              credentials: 'omit'
            });
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              btnEl.disabled = false;
              if (res && res.success) {
                gcFeedback.className = 'atelier-feedback is-success';
                gcFeedback.textContent = 'Sent email to ' + recipientType + '!';
              } else {
                gcFeedback.className = 'atelier-feedback is-error';
                gcFeedback.textContent = (res && res.error) || 'Failed to resend email.';
              }
            });
        }

        var gcRecipBtn = document.getElementById('atelier-gc-resend-recip');
        if (gcRecipBtn) gcRecipBtn.addEventListener('click', function () { triggerGcResend('recipient', this); });
        var gcPurchBtn = document.getElementById('atelier-gc-resend-purch');
        if (gcPurchBtn) gcPurchBtn.addEventListener('click', function () { triggerGcResend('purchaser', this); });
      }
    }

    function syncActiveTabSelection() {
      document.querySelectorAll('.atelier-domain-tab').forEach(function (t) {
        if (t.getAttribute('data-domain') === currentDomain) {
          t.classList.add('is-active');
        } else {
          t.classList.remove('is-active');
        }
      });
    }

    function updateRefreshButtonState() {
      if (!refreshBtn) return;
      var isAnyLoading = Object.keys(loadingState).some(function (k) { return loadingState[k]; });
      if (isAnyLoading) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="atelier-spinner" style="width: 0.75rem; height: 0.75rem; border-width: 1.5px; border-top-color: #2c1e14; vertical-align: middle;"></span> Syncing...';
        refreshBtn.style.opacity = '0.75';
      } else {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '&#8635; Refresh';
        refreshBtn.style.opacity = '1';
      }
    }

    function renderAll() {
      updateRefreshButtonState();
      syncActiveTabSelection();
      renderKPICards();
      renderQueryDeck();
      renderTable();
      renderInspector();
    }

    // Cross-domain navigation: switch tabs with clean filters and open the record in the Inspector
    function jumpToRecord(domain, item) {
      currentDomain = domain;
      activeStatusFilter = 'all';
      activeGroupBys = [];
      searchQuery = '';
      supplierOrderFilter = '';
      selectedItem = item;
      renderAll();
    }

    // Domain navigation switching
    document.querySelectorAll('.atelier-domain-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentDomain = tab.getAttribute('data-domain');
        selectedItem = null;
        activeStatusFilter = 'all';
        activeGroupBys = [];
        searchQuery = '';
        supplierOrderFilter = '';
        renderAll();
      });
    });

    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        var key = getStoredKey();
        if (key) authenticateAndLoad(key);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearStoredKey();
        showGate();
      });
    }

    function showGate(err) {
      if (gateEl) gateEl.style.display = 'block';
      if (dashboardEl) dashboardEl.style.display = 'none';
      if (gateError) {
        if (err) {
          gateError.textContent = err;
          gateError.style.display = 'block';
        } else {
          gateError.style.display = 'none';
        }
      }
    }

    function showDashboard() {
      if (gateEl) gateEl.style.display = 'none';
      if (dashboardEl) dashboardEl.style.display = 'block';
    }

    function setTabCount(id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    function authenticateAndLoad(key) {
      resolveAdminHash(key).then(function (hash) {
        if (hash !== ADMIN_PASSWORD_HASH) {
          showGate('Unauthorized: Invalid Admin Key.');
          return;
        }
        saveKey(key);
        showDashboard();
        renderAll();

        // 1. Load Customer Orders
        loadOrders(key, function (err, ords) {
          if (!err) {
            ordersData = ords;
            setTabCount('atelier-count-orders', ords.length);
          }
          renderAll();
        });

        // 2. Load Green Beans, Green Bean Orders, Roast Logs, and Master Blend Packaging
        loadRoasts(key, function (err, rData) {
          if (!err && rData) {
            roastsData = rData;
            var activeLots = (rData.greenBeans || []).filter(function (b) { return (Number(b.activeStockGrams) || 0) > 0; });
            setTabCount('atelier-count-beans', activeLots.length);
            setTabCount('atelier-count-bean-orders', (rData.greenBeanOrders || []).length);
            setTabCount('atelier-count-roasts', (rData.roastLogs || []).length);
            setTabCount('atelier-count-packaging', (rData.blendPackagingLogs || []).length);
          }
          renderAll();
        });

        // 3. Load Subscriptions
        loadSubscriptions(key, function (err, subs) {
          if (!err) {
            subsData = subs;
            setTabCount('atelier-count-subscriptions', subs.length);
          }
          renderAll();
        });

        // 4. Load Gift Subscriptions
        loadGiftSubs(key, function (err, gSubs) {
          if (!err) {
            giftSubsData = gSubs;
            setTabCount('atelier-count-gift-subs', gSubs.length);
          }
          renderAll();
        });

        // 5. Load Gift Cards & Promo Codes
        loadGiftCodes(key, function (err, gCodes) {
          if (!err && gCodes) {
            giftCodesData = gCodes;
            var totalCodes = (gCodes.giftCards ? gCodes.giftCards.length : 0) + (gCodes.promoCodes ? gCodes.promoCodes.length : 0);
            setTabCount('atelier-count-gift-codes', totalCodes);
          }
          renderAll();
        });
      });
    }

    if (gateForm) {
      gateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var key = passcodeInput.value.trim();
        if (key) authenticateAndLoad(key);
      });
    }

    var stored = getStoredKey();
    if (stored) {
      authenticateAndLoad(stored);
    } else {
      showGate();
    }
  }

  return {
    initAtelierAdmin: initAtelierAdmin,
    parseOrderItems: parseOrderItems,
    parseOrderItem: parseOrderItem,
    parsePeckYourOwnItem: parsePeckYourOwnItem,
    extractItemQuantity: extractItemQuantity,
    extractItemDetails: extractItemDetails,
    extractItemPrice: extractItemPrice,
    extractItemBagSize: extractItemBagSize,
    formatItemPill: formatItemPill
  };
});
