/**
 * Yellow Wing Roasters - Roast & Green Bean Inventory Web App API
 * Data Tabs: GreenBeanOrders, RoastLogs, BlendPackagingLog
 * Formula View Tabs: GreenBeans (live current amounts view), Totals (monthly rollups view)
 */

var TAB_SCHEMAS = {
  GreenBeans: [
    'Name',
    'Supplier',
    'Bean URL',
    'Active Stock (g)',
    'Active Stock (lbs)'
  ],
  GreenBeanOrders: [
    'Order ID',
    'Supplier Order ID',
    'Name',
    'Supplier',
    'Date',
    'Cost',
    'Weight (lbs)',
    'Weight Adjustment (g)',
    'Weight (g)',
    'Bean URL'
  ],
  RoastLogs: [
    'Roast ID',
    'Date',
    'Green Bean Components',
    'Bean Name',
    'Green Weight (g)',
    'End Weight (g)',
    'Weight Loss (%)',
    'Roast Level',
    'Roast Profile URL',
    'Notes'
  ],
  BlendPackagingLog: [
    'Log ID',
    'Date',
    'Purpose',
    'Order ID',
    'Product / Label',
    'Roast Components',
    'Weight (g)',
    'Bag Size',
    'Notes'
  ],
  Totals: [
    'Period (YYYY-MM)',
    'Orders Count',
    'Ordered Weight (lbs)',
    'Ordered Weight (g)',
    'Total Spend ($)',
    'Roast Count',
    'Green Weight Roasted (g)',
    'End Weight (g)',
    'Packaged Weight (g)'
  ]
};

/**
 * Initializes all 5 tabs and sets live Google Sheets formulas on the GreenBeans and Totals view tabs.
 * Run once manually from the Apps Script editor when setting up the spreadsheet.
 */
function bootstrapSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabNames = [
    SHEET_GREEN_BEANS,
    SHEET_GREEN_BEAN_ORDERS,
    SHEET_ROAST_LOGS,
    SHEET_BLEND_PACKAGING,
    SHEET_TOTALS
  ];

  for (var i = 0; i < tabNames.length; i++) {
    var name = tabNames[i];
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    var headers = TAB_SCHEMAS[name];
    sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Configure GreenBeans as a pure formula-driven view tab
  var beansSheet = ss.getSheetByName(SHEET_GREEN_BEANS);
  beansSheet.getRange('A2').setFormula('=IFERROR(UNIQUE(FILTER(GreenBeanOrders!C2:C, GreenBeanOrders!C2:C<>"")), "")');
  beansSheet.getRange('B2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", IFERROR(VLOOKUP(A2:A, {GreenBeanOrders!C2:C, GreenBeanOrders!D2:D}, 2, FALSE), "")))');
  beansSheet.getRange('C2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", IFERROR(VLOOKUP(A2:A, {GreenBeanOrders!C2:C, GreenBeanOrders!J2:J}, 2, FALSE), "")))');
  beansSheet.getRange('D2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(GreenBeanOrders!C2:C, A2:A, GreenBeanOrders!I2:I) - SUMIF(RoastLogs!D2:D, A2:A, RoastLogs!E2:E)))');
  beansSheet.getRange('E2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", ROUND(D2:D / 453.592, 2)))');

  // Configure Totals as a pure formula-driven view tab grouped by YYYY-MM
  var totalsSheet = ss.getSheetByName(SHEET_TOTALS);
  totalsSheet.getRange('A2').setFormula(
    '=IFERROR(SORT(UNIQUE(FILTER({' +
    'LEFT(GreenBeanOrders!E2:E, 7); ' +
    'LEFT(RoastLogs!B2:B, 7); ' +
    'LEFT(BlendPackagingLog!B2:B, 7)' +
    '}, LEN({' +
    'LEFT(GreenBeanOrders!E2:E, 7); ' +
    'LEFT(RoastLogs!B2:B, 7); ' +
    'LEFT(BlendPackagingLog!B2:B, 7)' +
    '})=7)), 1, FALSE), "")'
  );
  totalsSheet.getRange('B2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", COUNTIF(LEFT(GreenBeanOrders!E2:E, 7), A2:A)))');
  totalsSheet.getRange('C2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(GreenBeanOrders!E2:E, 7), A2:A, GreenBeanOrders!G2:G)))');
  totalsSheet.getRange('D2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(GreenBeanOrders!E2:E, 7), A2:A, GreenBeanOrders!I2:I)))');
  totalsSheet.getRange('E2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(GreenBeanOrders!E2:E, 7), A2:A, GreenBeanOrders!F2:F)))');
  totalsSheet.getRange('F2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", COUNTIF(LEFT(RoastLogs!B2:B, 7), A2:A)))');
  totalsSheet.getRange('G2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(RoastLogs!B2:B, 7), A2:A, RoastLogs!E2:E)))');
  totalsSheet.getRange('H2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(RoastLogs!B2:B, 7), A2:A, RoastLogs!F2:F)))');
  totalsSheet.getRange('I2').setFormula('=ARRAYFORMULA(IF(A2:A="", "", SUMIF(LEFT(BlendPackagingLog!B2:B, 7), A2:A, BlendPackagingLog!G2:G)))');

  return true;
}

/**
 * Reads all inventory tabs by column index (matching TAB_SCHEMAS) and returns JSON for the Admin UI.
 */
function readAllInventoryData(ss) {
  SpreadsheetApp.flush();

  var beansSheet = ss.getSheetByName(SHEET_GREEN_BEANS);
  var ordersSheet = ss.getSheetByName(SHEET_GREEN_BEAN_ORDERS);
  var roastsSheet = ss.getSheetByName(SHEET_ROAST_LOGS);
  var pkgSheet = ss.getSheetByName(SHEET_BLEND_PACKAGING);

  var ordersData = ordersSheet.getDataRange().getValues();
  var greenBeanOrders = [];
  for (var j = 1; j < ordersData.length; j++) {
    var oRow = ordersData[j];
    var orderId = oRow[0].toString().trim();
    if (!orderId) continue;
    greenBeanOrders.push({
      orderId: orderId,
      supplierOrderId: oRow[1].toString().trim(),
      name: oRow[2].toString().trim(),
      supplier: oRow[3].toString().trim(),
      date: formatDateIso(oRow[4]),
      cost: Number(oRow[5]) || 0,
      weightLbs: Number(oRow[6]) || 0,
      adjustGrams: Number(oRow[7]) || 0,
      weightGrams: Number(oRow[8]) || 0,
      url: oRow[9].toString().trim()
    });
  }

  var roastsData = roastsSheet.getDataRange().getValues();
  var roastLogs = [];
  for (var k = 1; k < roastsData.length; k++) {
    var rRow = roastsData[k];
    var roastId = rRow[0].toString().trim();
    if (!roastId) continue;
    var parsedGreenComps = [];
    var rawGreenComp = rRow[2] ? rRow[2].toString().trim() : '[]';
    try {
      parsedGreenComps = JSON.parse(rawGreenComp);
    } catch (err) {
      parsedGreenComps = [];
    }
    roastLogs.push({
      roastId: roastId,
      date: formatDateIso(rRow[1]),
      greenBeanComponents: parsedGreenComps,
      beanName: rRow[3].toString().trim(),
      greenWeightGrams: Number(rRow[4]) || 0,
      endWeightGrams: Number(rRow[5]) || 0,
      weightLossPct: Number(rRow[6]) || 0,
      roastLevel: Number(rRow[7]),
      profileUrl: rRow[8].toString().trim(),
      notes: rRow[9].toString().trim()
    });
  }

  var beansData = beansSheet.getDataRange().getValues();
  var greenBeans = [];
  for (var i = 1; i < beansData.length; i++) {
    var bRow = beansData[i];
    var bName = bRow[0].toString().trim();
    if (!bName) continue;
    greenBeans.push({
      name: bName,
      supplier: bRow[1].toString().trim(),
      url: bRow[2].toString().trim(),
      activeStockGrams: Number(bRow[3]) || 0
    });
  }

  var pkgData = pkgSheet.getDataRange().getValues();
  var blendPackagingLogs = [];
  for (var m = 1; m < pkgData.length; m++) {
    var pRow = pkgData[m];
    var logId = pRow[0].toString().trim();
    if (!logId) continue;
    var parsedComponents = [];
    var rawComp = pRow[5] ? pRow[5].toString().trim() : '[]';
    try {
      parsedComponents = JSON.parse(rawComp);
    } catch (err) {
      parsedComponents = [];
    }
    blendPackagingLogs.push({
      logId: logId,
      date: formatDateIso(pRow[1]),
      purpose: pRow[2].toString().trim(),
      orderId: pRow[3].toString().trim(),
      product: pRow[4].toString().trim(),
      roastComponents: parsedComponents,
      weightGrams: Number(pRow[6]) || 0,
      bagSize: pRow[7].toString().trim(),
      notes: pRow[8].toString().trim()
    });
  }

  return {
    greenBeans: greenBeans,
    greenBeanOrders: greenBeanOrders,
    roastLogs: roastLogs,
    blendPackagingLogs: blendPackagingLogs
  };
}

/**
 * Handles Web App POST requests.
 */
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var adminKey = postData.adminKey ? postData.adminKey.toString().trim() : "";

    if (!isValidAdminKey(adminKey)) {
      return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var beansSheet = ss.getSheetByName(SHEET_GREEN_BEANS);
    var ordersSheet = ss.getSheetByName(SHEET_GREEN_BEAN_ORDERS);
    var roastsSheet = ss.getSheetByName(SHEET_ROAST_LOGS);
    var pkgSheet = ss.getSheetByName(SHEET_BLEND_PACKAGING);

    // 0. LIST ALL INVENTORY DATA
    if (action === 'list_inventory') {
      return createJsonResponse(readAllInventoryData(ss));
    }

    // 1. CREATE GREEN BEAN ORDER
    if (action === 'create_green_bean_order') {
      var newOrderId = generateGreenBeanOrderId(
        ordersSheet,
        postData.date,
        postData.supplier,
        postData.name
      );
      var nextRow = ordersSheet.getLastRow() + 1;

      ordersSheet.appendRow([
        newOrderId,
        postData.supplierOrderId ? postData.supplierOrderId.toString().trim() : "",
        postData.name.toString().trim(),
        postData.supplier.toString().trim(),
        postData.date.toString().trim(),
        Number(postData.cost),
        Number(postData.weightLbs),
        Number(postData.adjustGrams) || 0,
        '=ROUND(G' + nextRow + '*453.592)+N(H' + nextRow + ')',
        postData.url.toString().trim()
      ]);

      var updatedPayload = readAllInventoryData(ss);
      updatedPayload.success = true;
      updatedPayload.createdOrderId = newOrderId;
      return createJsonResponse(updatedPayload);
    }

    // 1b. UPDATE GREEN BEAN ORDER
    if (action === 'update_green_bean_order') {
      var targetOrderId = postData.orderId.toString().trim();
      var oDataUpd = ordersSheet.getDataRange().getValues();
      var targetOrderRow = -1;
      for (var oi = 1; oi < oDataUpd.length; oi++) {
        if (oDataUpd[oi][0].toString().trim() === targetOrderId) {
          targetOrderRow = oi + 1;
          break;
        }
      }

      if (targetOrderRow === -1) {
        return createJsonResponse({ error: "Matching Green Bean Order not found: " + targetOrderId });
      }

      ordersSheet.getRange(targetOrderRow, 1, 1, 10).setValues([[
        targetOrderId,
        postData.supplierOrderId ? postData.supplierOrderId.toString().trim() : "",
        postData.name.toString().trim(),
        postData.supplier.toString().trim(),
        postData.date.toString().trim(),
        Number(postData.cost),
        Number(postData.weightLbs),
        Number(postData.adjustGrams) || 0,
        '=ROUND(G' + targetOrderRow + '*453.592)+N(H' + targetOrderRow + ')',
        postData.url.toString().trim()
      ]]);

      var updOrderPayload = readAllInventoryData(ss);
      updOrderPayload.success = true;
      updOrderPayload.updatedOrderId = targetOrderId;
      return createJsonResponse(updOrderPayload);
    }

    // 2. ADJUST GREEN BEAN ORDER WEIGHT (+/- grams on GreenBeanOrders tab, Column H)
    if (action === 'adjust_order_weight') {
      var adjOrderId = postData.orderId ? postData.orderId.toString().trim() : "";
      var deltaGrams = Number(postData.deltaGrams);

      var oDataAdj = ordersSheet.getDataRange().getValues();
      var targetRow = -1;
      for (var b = 1; b < oDataAdj.length; b++) {
        if (adjOrderId && oDataAdj[b][0].toString().trim() === adjOrderId) {
          targetRow = b + 1;
          break;
        }
      }

      if (targetRow === -1) {
        return createJsonResponse({ error: "Matching Green Bean Order not found: " + adjOrderId });
      }

      var currentAdj = Number(oDataAdj[targetRow - 1][7]) || 0;
      ordersSheet.getRange(targetRow, 8).setValue(currentAdj + deltaGrams);

      var adjPayload = readAllInventoryData(ss);
      adjPayload.success = true;
      return createJsonResponse(adjPayload);
    }

    // 3. CREATE ROAST LOG
    if (action === 'create_roast_log') {
      var greenComps = postData.greenBeanComponents || [];
      var totalGreenGrams = 0;
      for (var gcIdx = 0; gcIdx < greenComps.length; gcIdx++) {
        totalGreenGrams += Number(greenComps[gcIdx].weightGrams) || 0;
      }

      var roastBeanName = postData.beanName ? postData.beanName.toString().trim() : "Roast";
      var newRoastId = generateRoastLogId(roastsSheet, postData.date, roastBeanName);
      var nextRoastRow = roastsSheet.getLastRow() + 1;

      roastsSheet.appendRow([
        newRoastId,
        postData.date.toString().trim(),
        JSON.stringify(greenComps),
        roastBeanName,
        totalGreenGrams,
        Number(postData.endWeightGrams),
        '=IF(E' + nextRoastRow + '>0, ROUND((E' + nextRoastRow + '-F' + nextRoastRow + ')/E' + nextRoastRow + '*100, 2), 0)',
        Number(postData.roastLevel),
        postData.profileUrl.toString().trim(),
        postData.notes ? postData.notes.toString().trim() : ""
      ]);

      var roastPayload = readAllInventoryData(ss);
      roastPayload.success = true;
      roastPayload.createdRoastId = newRoastId;
      return createJsonResponse(roastPayload);
    }

    // 3b. UPDATE ROAST LOG
    if (action === 'update_roast_log') {
      var targetRoastId = postData.roastId.toString().trim();
      var rDataUpd = roastsSheet.getDataRange().getValues();
      var targetRoastRow = -1;
      for (var ri = 1; ri < rDataUpd.length; ri++) {
        if (rDataUpd[ri][0].toString().trim() === targetRoastId) {
          targetRoastRow = ri + 1;
          break;
        }
      }

      if (targetRoastRow === -1) {
        return createJsonResponse({ error: "Matching Roast Log not found: " + targetRoastId });
      }

      var updGreenComps = postData.greenBeanComponents || [];
      var updTotalGreenGrams = 0;
      for (var ugcIdx = 0; ugcIdx < updGreenComps.length; ugcIdx++) {
        updTotalGreenGrams += Number(updGreenComps[ugcIdx].weightGrams) || 0;
      }

      roastsSheet.getRange(targetRoastRow, 1, 1, 10).setValues([[
        targetRoastId,
        postData.date.toString().trim(),
        JSON.stringify(updGreenComps),
        postData.beanName.toString().trim(),
        updTotalGreenGrams,
        Number(postData.endWeightGrams),
        '=IF(E' + targetRoastRow + '>0, ROUND((E' + targetRoastRow + '-F' + targetRoastRow + ')/E' + targetRoastRow + '*100, 2), 0)',
        Number(postData.roastLevel),
        postData.profileUrl.toString().trim(),
        postData.notes ? postData.notes.toString().trim() : ""
      ]]);

      var updRoastPayload = readAllInventoryData(ss);
      updRoastPayload.success = true;
      updRoastPayload.updatedRoastId = targetRoastId;
      return createJsonResponse(updRoastPayload);
    }

    // 4. CREATE BLEND & PACKAGING LOG
    if (action === 'create_blend_packaging_log') {
      var roastComponents = postData.roastComponents || [];
      var totalWeightGrams = 0;
      for (var cIdx = 0; cIdx < roastComponents.length; cIdx++) {
        totalWeightGrams += Number(roastComponents[cIdx].weightGrams) || 0;
      }

      var pkgProd = postData.product ? postData.product.toString().trim() : "Coffee";
      var pkgPurposeVal = postData.purpose ? postData.purpose.toString().trim() : "Personal";
      var pkgOrderVal = postData.orderId ? postData.orderId.toString().trim() : "";
      var newLogId = generatePackagingLogId(pkgSheet, postData.date, pkgProd, pkgPurposeVal, pkgOrderVal);

      pkgSheet.appendRow([
        newLogId,
        postData.date.toString().trim(),
        pkgPurposeVal,
        pkgOrderVal,
        pkgProd,
        JSON.stringify(roastComponents),
        totalWeightGrams,
        postData.bagSize.toString().trim(),
        postData.notes ? postData.notes.toString().trim() : ""
      ]);

      var pkgPayload = readAllInventoryData(ss);
      pkgPayload.success = true;
      pkgPayload.createdLogId = newLogId;
      return createJsonResponse(pkgPayload);
    }

    // 4b. UPDATE BLEND & PACKAGING LOG
    if (action === 'update_blend_packaging_log') {
      var targetLogId = postData.logId.toString().trim();
      var pDataUpd = pkgSheet.getDataRange().getValues();
      var targetPkgRow = -1;
      for (var pi = 1; pi < pDataUpd.length; pi++) {
        if (pDataUpd[pi][0].toString().trim() === targetLogId) {
          targetPkgRow = pi + 1;
          break;
        }
      }

      if (targetPkgRow === -1) {
        return createJsonResponse({ error: "Matching Packaging Log not found: " + targetLogId });
      }

      var updComponents = postData.roastComponents || [];
      var updTotalGrams = 0;
      for (var uc = 0; uc < updComponents.length; uc++) {
        updTotalGrams += Number(updComponents[uc].weightGrams) || 0;
      }

      pkgSheet.getRange(targetPkgRow, 1, 1, 9).setValues([[
        targetLogId,
        postData.date.toString().trim(),
        postData.purpose.toString().trim(),
        postData.orderId ? postData.orderId.toString().trim() : "",
        postData.product.toString().trim(),
        JSON.stringify(updComponents),
        updTotalGrams,
        postData.bagSize.toString().trim(),
        postData.notes ? postData.notes.toString().trim() : ""
      ]]);

      var updPkgPayload = readAllInventoryData(ss);
      updPkgPayload.success = true;
      updPkgPayload.updatedLogId = targetLogId;
      return createJsonResponse(updPkgPayload);
    }

    return createJsonResponse({ error: "Unrecognized action: " + action });
  } catch (err) {
    console.error("RoastInventory doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}
