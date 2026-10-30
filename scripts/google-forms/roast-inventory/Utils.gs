/**
 * Yellow Wing Roasters - Roast Inventory Utilities
 */

/**
 * Formats a Date or string into compact YYYYMMDD.
 */
function formatDateCompact(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = (val.getMonth() + 1).toString();
    if (m.length < 2) m = "0" + m;
    var d = val.getDate().toString();
    if (d.length < 2) d = "0" + d;
    return "" + y + m + d;
  }
  var s = val.toString().split("T")[0].replace(/[^0-9]/g, "");
  return s.length >= 8 ? s.slice(0, 8) : s;
}

/**
 * Creates a clean uppercase 3-to-6 character acronym or code from a phrase.
 * Filters out common coffee stopwords and combines prefix letters.
 */
function makeSemanticCode(text, maxLen) {
  var limit = maxLen || 6;
  var words = String(text || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]+/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "ITEM";
  if (words.length === 1) return words[0].slice(0, limit);

  var filtered = [];
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    if (w !== "COFFEE" && w !== "BEANS" && w !== "ROASTERS" && w !== "ROAST" &&
        w !== "THE" && w !== "AND" && w !== "OF") {
      filtered.push(w);
    }
  }
  if (filtered.length === 0) filtered = words;
  if (filtered.length === 1) return filtered[0].slice(0, limit);

  var p1 = filtered[0].slice(0, 3);
  var p2 = filtered[1].slice(0, 3);
  return (p1 + p2).slice(0, Math.max(limit, 6));
}

/**
 * Collects all existing IDs from a sheet column.
 */
function getExistingIds(sheet, idColIdx) {
  var data = sheet.getDataRange().getValues();
  var ids = [];
  for (var i = 1; i < data.length; i++) {
    var id = data[i][idColIdx] ? data[i][idColIdx].toString().trim() : "";
    if (id) ids.push(id);
  }
  return ids;
}

/**
 * Generates semantic Green Bean Order ID: GBO-YYYYMMDD-[SUPPLIER]-[BEAN]
 */
function generateGreenBeanOrderId(sheet, dateVal, supplier, beanName) {
  var existingIds = getExistingIds(sheet, 0);
  var d = formatDateCompact(dateVal);
  var suppCode = makeSemanticCode(supplier, 6);
  var beanCode = makeSemanticCode(beanName, 6);
  var baseId = "GBO-" + d + "-" + suppCode + "-" + beanCode;

  if (existingIds.indexOf(baseId) === -1) {
    return baseId;
  }
  var counter = 2;
  while (existingIds.indexOf(baseId + "-" + counter) !== -1) {
    counter++;
  }
  return baseId + "-" + counter;
}

/**
 * Generates semantic Roast Log ID: R-YYYYMMDD-[BEAN]-[BATCH#]
 */
function generateRoastLogId(sheet, dateVal, beanName) {
  var existingIds = getExistingIds(sheet, 0);
  var d = formatDateCompact(dateVal);
  var beanCode = makeSemanticCode(beanName, 6);
  var prefix = "R-" + d + "-" + beanCode + "-";

  var batch = 1;
  while (existingIds.indexOf(prefix + batch) !== -1) {
    batch++;
  }
  return prefix + batch;
}

/**
 * Generates semantic Packaging Log ID: PKG-YYYYMMDD-[PRODUCT]-[DESTINATION]
 */
function generatePackagingLogId(sheet, dateVal, product, purpose, orderId) {
  var existingIds = getExistingIds(sheet, 0);
  var d = formatDateCompact(dateVal);
  var prodCode = makeSemanticCode(product, 6);

  var dest = "PERSONAL";
  if (purpose === "Order" && orderId) {
    dest = "ORD" + String(orderId).trim().replace(/^#/, "");
  } else if (purpose === "Sample") {
    dest = "SAMPLE";
  }

  var baseId = "PKG-" + d + "-" + prodCode + "-" + dest;
  if (existingIds.indexOf(baseId) === -1) {
    return baseId;
  }
  var counter = 2;
  while (existingIds.indexOf(baseId + "-" + counter) !== -1) {
    counter++;
  }
  return baseId + "-" + counter;
}

/**
 * Legacy sequential ID generator (retained as fallback).
 */
function generateNextId(sheet, idColIdx, prefix, startNum, padLength) {
  var data = sheet.getDataRange().getValues();
  var maxNum = startNum - 1;
  var prefixLower = prefix.toLowerCase();

  for (var i = 1; i < data.length; i++) {
    var raw = data[i][idColIdx] ? data[i][idColIdx].toString().trim() : "";
    if (!raw) continue;
    var clean = raw.toLowerCase().indexOf(prefixLower) === 0
      ? raw.slice(prefix.length)
      : raw;
    var num = parseInt(clean, 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  }

  var numStr = (maxNum + 1).toString();
  while (numStr.length < padLength) {
    numStr = "0" + numStr;
  }
  return prefix + numStr;
}

/**
 * Formats a Date or string into YYYY-MM-DD.
 */
function formatDateIso(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = (val.getMonth() + 1).toString();
    if (m.length < 2) m = "0" + m;
    var d = val.getDate().toString();
    if (d.length < 2) d = "0" + d;
    return y + "-" + m + "-" + d;
  }
  return val.toString().trim();
}

/**
 * Returns JSON output formatted for Apps Script Web App responses.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ONE-TIME MIGRATION:
 * Migrates all existing legacy sequential IDs (GBO-1001, ROAST-1001, PKG-1001) in Google Sheets
 * to the new semantic ID structure, cascading all foreign key ID references across JSON component columns.
 * Run directly from the Apps Script editor: select "migrateToSemanticIds" in the toolbar and click "Run".
 */
function migrateToSemanticIds() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ordersSheet = ss.getSheetByName(SHEET_GREEN_BEAN_ORDERS);
  var roastsSheet = ss.getSheetByName(SHEET_ROAST_LOGS);
  var pkgSheet = ss.getSheetByName(SHEET_BLEND_PACKAGING);

  var orderIdMap = {}; // oldOrderId -> newOrderId
  var roastIdMap = {}; // oldRoastId -> newRoastId

  // 1. Migrate GreenBeanOrders
  var ordersData = ordersSheet.getDataRange().getValues();
  var seenOrderIds = [];
  for (var i = 1; i < ordersData.length; i++) {
    var oldId = ordersData[i][0] ? ordersData[i][0].toString().trim() : "";
    var beanName = ordersData[i][2] ? ordersData[i][2].toString().trim() : "";
    var supplier = ordersData[i][3] ? ordersData[i][3].toString().trim() : "";
    var dateVal = ordersData[i][4];
    if (!oldId || !beanName) continue;

    var d = formatDateCompact(dateVal);
    var suppCode = makeSemanticCode(supplier, 6);
    var beanCode = makeSemanticCode(beanName, 6);
    var baseOrderId = "GBO-" + d + "-" + suppCode + "-" + beanCode;

    var finalOrderId = baseOrderId;
    var ordCounter = 2;
    while (seenOrderIds.indexOf(finalOrderId) !== -1) {
      finalOrderId = baseOrderId + "-" + ordCounter;
      ordCounter++;
    }
    seenOrderIds.push(finalOrderId);
    orderIdMap[oldId] = finalOrderId;
    ordersSheet.getRange(i + 1, 1).setValue(finalOrderId);
  }

  // 2. Migrate RoastLogs (and cascade new GBO IDs into Green Bean Components JSON)
  var roastsData = roastsSheet.getDataRange().getValues();
  var seenRoastIds = [];
  for (var j = 1; j < roastsData.length; j++) {
    var oldRoastId = roastsData[j][0] ? roastsData[j][0].toString().trim() : "";
    var roastDate = roastsData[j][1];
    var rawGreenComps = roastsData[j][2] ? roastsData[j][2].toString().trim() : "";
    var roastBean = roastsData[j][3] ? roastsData[j][3].toString().trim() : "Roast";
    if (!oldRoastId) continue;

    var rd = formatDateCompact(roastDate);
    var rBeanCode = makeSemanticCode(roastBean, 6);
    var rPrefix = "R-" + rd + "-" + rBeanCode + "-";

    var batch = 1;
    while (seenRoastIds.indexOf(rPrefix + batch) !== -1) {
      batch++;
    }
    var finalRoastId = rPrefix + batch;
    seenRoastIds.push(finalRoastId);
    roastIdMap[oldRoastId] = finalRoastId;
    roastsSheet.getRange(j + 1, 1).setValue(finalRoastId);

    // Update referenced GBO IDs in JSON components
    try {
      var comps = JSON.parse(rawGreenComps || '[]');
      var compChanged = false;
      for (var c = 0; c < comps.length; c++) {
        if (comps[c].orderId && orderIdMap[comps[c].orderId]) {
          comps[c].orderId = orderIdMap[comps[c].orderId];
          compChanged = true;
        }
      }
      if (compChanged) {
        roastsSheet.getRange(j + 1, 3).setValue(JSON.stringify(comps));
      }
    } catch (e) {
      console.warn("Could not parse Green Bean Components on row " + (j + 1) + ": " + e.message);
    }
  }

  // 3. Migrate BlendPackagingLog (and cascade new Roast IDs into Roast Components JSON)
  var pkgData = pkgSheet.getDataRange().getValues();
  var seenPkgIds = [];
  for (var k = 1; k < pkgData.length; k++) {
    var oldPkgId = pkgData[k][0] ? pkgData[k][0].toString().trim() : "";
    var pkgDate = pkgData[k][1];
    var purpose = pkgData[k][2] ? pkgData[k][2].toString().trim() : "Personal";
    var orderId = pkgData[k][3] ? pkgData[k][3].toString().trim() : "";
    var product = pkgData[k][4] ? pkgData[k][4].toString().trim() : "Coffee";
    var rawRoastComps = pkgData[k][5] ? pkgData[k][5].toString().trim() : "";
    if (!oldPkgId) continue;

    var pd = formatDateCompact(pkgDate);
    var pProdCode = makeSemanticCode(product, 6);
    var dest = "PERSONAL";
    if (purpose === "Order" && orderId) {
      dest = "ORD" + String(orderId).trim().replace(/^#/, "");
    } else if (purpose === "Sample") {
      dest = "SAMPLE";
    }

    var basePkgId = "PKG-" + pd + "-" + pProdCode + "-" + dest;
    var finalPkgId = basePkgId;
    var pkgCounter = 2;
    while (seenPkgIds.indexOf(finalPkgId) !== -1) {
      finalPkgId = basePkgId + "-" + pkgCounter;
      pkgCounter++;
    }
    seenPkgIds.push(finalPkgId);
    pkgSheet.getRange(k + 1, 1).setValue(finalPkgId);

    // Update referenced Roast IDs in JSON components
    try {
      var rComps = JSON.parse(rawRoastComps || '[]');
      var rChanged = false;
      for (var rc = 0; rc < rComps.length; rc++) {
        if (rComps[rc].roastId && roastIdMap[rComps[rc].roastId]) {
          rComps[rc].roastId = roastIdMap[rComps[rc].roastId];
          rChanged = true;
        }
      }
      if (rChanged) {
        pkgSheet.getRange(k + 1, 6).setValue(JSON.stringify(rComps));
      }
    } catch (e) {
      console.warn("Could not parse Roast Components on row " + (k + 1) + ": " + e.message);
    }
  }

  SpreadsheetApp.flush();
  var summary = "Successfully migrated: " + seenOrderIds.length + " Orders, " + seenRoastIds.length + " Roasts, " + seenPkgIds.length + " Packaging logs.";
  console.log(summary);
  return summary;
}
