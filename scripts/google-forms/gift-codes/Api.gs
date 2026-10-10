/**
 * Yellow Wing Roasters - Digital Gift Card & Discount API
 * Serves doGet for checkout code validation and balance redemption.
 */

/**
 * Web App GET endpoint used by site checkout.
 */
function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? e.parameter.action.trim().toLowerCase() : 'validate';
    var code = e && e.parameter && e.parameter.code ? e.parameter.code.trim().toUpperCase() : '';

    if (!code) {
      return createJsonResponse({ valid: false, message: "No code provided." });
    }

    var giftSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var giftSheet = giftSpreadsheet.getSheetByName("ActiveCodes") || giftSpreadsheet.getActiveSheet();

    // 1. ACTION: REDEEM BALANCE
    if (action === 'redeem') {
      var amountToDeduct = parseFloat(e.parameter.amount || '0');
      var lastColumn = giftSheet.getLastColumn();
      var headers = giftSheet.getRange(1, 1, 1, lastColumn).getValues()[0];

      var codeIndex = requireColumnIndex(headers, ["code", "gift code", "gift card code"], "redeem");
      var valueIndex = requireColumnIndex(headers, ["value", "amount", "balance"], "redeem");
      var typeIndex = findColumnIndex(headers, ["type", "discount type"]);

      var data = giftSheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var rowCode = String(data[i][codeIndex]).trim().toUpperCase();
        if (rowCode === code) {
          var type = (typeIndex !== -1 && typeIndex < data[i].length)
            ? String(data[i][typeIndex]).trim().toLowerCase()
            : "flat";
          var currentVal = parseFloat(data[i][valueIndex]) || 0;

          if (type === "flat") {
            var newVal = Math.max(0, currentVal - amountToDeduct);
            giftSheet.getRange(i + 1, valueIndex + 1).setValue(newVal);
            return createJsonResponse({ success: true, remaining: newVal });
          } else {
            return createJsonResponse({ success: true, message: "Percentage code applied; no balance deduction needed." });
          }
        }
      }
      return createJsonResponse({ success: false, message: "Code not found in Gifting sheet." });
    }

    // 2. ACTION: VALIDATE CODE (Lookup in active Gifting sheet first)
    var result = lookupCodeInSheet(giftSheet, code);
    if (result.found) {
      return createJsonResponse(result.data);
    }

    // 3. Fall back to General Discounts Spreadsheet ("Discount Codes" sheet tab)
    try {
      var generalSpreadsheet = SpreadsheetApp.openById(GENERAL_DISCOUNTS_SPREADSHEET_ID);
      var generalSheet = generalSpreadsheet.getSheetByName("Discount Codes") || generalSpreadsheet.getSheets()[0];
      var generalResult = lookupCodeInSheet(generalSheet, code);
      if (generalResult.found) {
        return createJsonResponse(generalResult.data);
      }
    } catch (err) {
      console.warn("Could not query general discounts spreadsheet: " + err.message);
    }

    return createJsonResponse({ valid: false, message: "Invalid discount/gift code." });
  } catch (err) {
    console.error("gift-codes doGet Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ valid: false, error: err.message });
  }
}

/**
 * Searches a sheet for a matching discount or gift code.
 */
function lookupCodeInSheet(sheet, code) {
  var lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) return { found: false };

  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var codeIndex = findColumnIndex(headers, ["code", "gift code", "gift card code"]);
  var valueIndex = findColumnIndex(headers, ["value", "amount", "balance"]);
  var typeIndex = findColumnIndex(headers, ["type", "discount type"]);
  var startIndex = findColumnIndex(headers, ["startdate", "start date"]);
  var endIndex = findColumnIndex(headers, ["enddate", "end date"]);

  if (codeIndex === -1 || valueIndex === -1) {
    return { found: false };
  }

  var data = sheet.getDataRange().getValues();
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 1; i < data.length; i++) {
    var rowCode = String(data[i][codeIndex]).trim().toUpperCase();
    if (rowCode === code) {
      var type = (typeIndex !== -1 && typeIndex < data[i].length)
        ? String(data[i][typeIndex]).trim().toLowerCase()
        : "flat";
      var val = parseFloat(data[i][valueIndex]) || 0;

      var startStr = startIndex !== -1 && startIndex < data[i].length ? data[i][startIndex] : null;
      var endStr = endIndex !== -1 && endIndex < data[i].length ? data[i][endIndex] : null;

      var start = parseDate(startStr);
      var end = parseDate(endStr);

      if (start && today < start) {
        return { found: true, data: { valid: false, message: "This discount code is not active yet." } };
      }
      if (end && today > end) {
        return { found: true, data: { valid: false, message: "This discount code has expired." } };
      }
      if (type === 'flat' && val <= 0) {
        return { found: true, data: { valid: false, message: "This gift code has already been fully redeemed." } };
      }
      return { found: true, data: { valid: true, type: type, value: val } };
    }
  }

  return { found: false };
}
