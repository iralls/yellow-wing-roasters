/**
 * Yellow Wing Roasters - Digital Gift Card & Discount API
 * Serves doGet for checkout code validation, balance redemption, and Roaster Admin listing.
 * Serves doPost for Roaster Admin code creation, updates, and email dispatch.
 */

/**
 * Web App GET endpoint.
 */
function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? e.parameter.action.trim().toLowerCase() : 'validate';

    // 1. ROASTER ADMIN: List all gift cards and promo codes
    if (action === 'admin_list' || (e && e.parameter && (e.parameter.adminHash || e.parameter.adminKey))) {
      var authKey = (e && e.parameter && (e.parameter.adminHash || e.parameter.adminKey) ? e.parameter.adminHash || e.parameter.adminKey : "").toString().trim();
      if (!isValidAdminKey(authKey)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var giftSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var activeCodesSheet = giftSpreadsheet.getSheetByName("ActiveCodes") || giftSpreadsheet.getActiveSheet();

      // Read ActiveCodes
      var acData = activeCodesSheet.getDataRange().getValues();
      var giftCards = [];

      // Read Form Responses to map purchaser/recipient metadata
      var respSheet = getResponsesSheet(giftSpreadsheet);
      var metadataMap = {};

      if (respSheet) {
        var respData = respSheet.getDataRange().getValues();
        if (respData.length > 1) {
          var rHeaders = respData[0];
          var rCodeIdx = findColumnIndex(rHeaders, ["gift code", "gift card code", "code"]);
          var rAmtIdx = findColumnIndex(rHeaders, ["amount", "value", "gift code amount", "gift card amount"]);
          var rPNameIdx = findColumnIndex(rHeaders, ["purchaser name", "your name", "name"]);
          var rPEmailIdx = findColumnIndex(rHeaders, ["purchaser email", "your email", "email"]);
          var rRNameIdx = findColumnIndex(rHeaders, ["recipient name"]);
          var rREmailIdx = findColumnIndex(rHeaders, ["recipient email"]);
          var rMsgIdx = findColumnIndex(rHeaders, ["gift message", "message"]);
          var rNotesIdx = findColumnIndex(rHeaders, ["notes", "special instructions"]);
          var rTimeIdx = findColumnIndex(rHeaders, ["timestamp"]);

          for (var r = 1; r < respData.length; r++) {
            var row = respData[r];
            var codeKey = rCodeIdx !== -1 && row[rCodeIdx] ? String(row[rCodeIdx]).trim().toUpperCase() : "";
            if (codeKey) {
              var tsStr = "";
              if (rTimeIdx !== -1 && row[rTimeIdx]) {
                tsStr = row[rTimeIdx] instanceof Date ? row[rTimeIdx].toLocaleString() : String(row[rTimeIdx]).trim();
              }
              metadataMap[codeKey] = {
                originalAmount: rAmtIdx !== -1 && row[rAmtIdx] ? parseFloat(row[rAmtIdx]) || 0 : 0,
                purchaserName: rPNameIdx !== -1 && row[rPNameIdx] ? String(row[rPNameIdx]).trim() : "",
                purchaserEmail: rPEmailIdx !== -1 && row[rPEmailIdx] ? String(row[rPEmailIdx]).trim() : "",
                recipientName: rRNameIdx !== -1 && row[rRNameIdx] ? String(row[rRNameIdx]).trim() : "",
                recipientEmail: rREmailIdx !== -1 && row[rREmailIdx] ? String(row[rREmailIdx]).trim() : "",
                giftMessage: rMsgIdx !== -1 && row[rMsgIdx] ? String(row[rMsgIdx]).trim() : "",
                notes: rNotesIdx !== -1 && row[rNotesIdx] ? String(row[rNotesIdx]).trim() : "",
                timestamp: tsStr
              };
            }
          }
        }
      }

      if (acData.length > 1) {
        var acHeaders = acData[0];
        var acCodeIdx = findColumnIndex(acHeaders, ["code", "gift code", "gift card code"]);
        var acTypeIdx = findColumnIndex(acHeaders, ["type", "discount type"]);
        var acValIdx = findColumnIndex(acHeaders, ["value", "amount", "balance"]);
        var acStartIdx = findColumnIndex(acHeaders, ["startdate", "start date"]);
        var acEndIdx = findColumnIndex(acHeaders, ["enddate", "end date"]);
        var acDescIdx = findColumnIndex(acHeaders, ["description", "notes"]);

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        for (var a = 1; a < acData.length; a++) {
          var aRow = acData[a];
          var aCode = acCodeIdx !== -1 && aRow[acCodeIdx] ? String(aRow[acCodeIdx]).trim().toUpperCase() : "";
          if (!aCode) continue;

          var aType = acTypeIdx !== -1 && aRow[acTypeIdx] ? String(aRow[acTypeIdx]).trim().toLowerCase() : "flat";
          var aVal = acValIdx !== -1 && aRow[acValIdx] !== "" ? parseFloat(aRow[acValIdx]) || 0 : 0;
          var aStart = acStartIdx !== -1 && aRow[acStartIdx] ? formatDateStr(aRow[acStartIdx]) : "";
          var aEnd = acEndIdx !== -1 && aRow[acEndIdx] ? formatDateStr(aRow[acEndIdx]) : "";
          var aDesc = acDescIdx !== -1 && aRow[acDescIdx] ? String(aRow[acDescIdx]).trim() : "";

          var meta = metadataMap[aCode] || {};
          var origAmt = meta.originalAmount || aVal;

          var status = "Active";
          var endParsed = parseDate(aEnd);
          var startParsed = parseDate(aStart);
          if (endParsed && today > endParsed) {
            status = "Expired";
          } else if (startParsed && today < startParsed) {
            status = "Scheduled";
          } else if (aVal <= 0) {
            status = "Redeemed";
          }

          giftCards.push({
            code: aCode,
            type: aType,
            currentBalance: aVal,
            originalAmount: origAmt,
            startDate: aStart,
            endDate: aEnd,
            description: aDesc,
            status: status,
            purchaserName: meta.purchaserName || "",
            purchaserEmail: meta.purchaserEmail || "",
            recipientName: meta.recipientName || "",
            recipientEmail: meta.recipientEmail || "",
            giftMessage: meta.giftMessage || "",
            notes: meta.notes || "",
            timestamp: meta.timestamp || ""
          });
        }
      }

      // Read Promo / Storewide Discount Codes
      var promoCodes = [];
      try {
        var generalSpreadsheet = SpreadsheetApp.openById(GENERAL_DISCOUNTS_SPREADSHEET_ID);
        var promoSheet = generalSpreadsheet.getSheetByName("Discount Codes") || generalSpreadsheet.getSheets()[0];
        var pData = promoSheet.getDataRange().getValues();

        if (pData.length > 1) {
          var pHeaders = pData[0];
          var pCodeIdx = findColumnIndex(pHeaders, ["code", "promo code", "discount code"]);
          var pTypeIdx = findColumnIndex(pHeaders, ["type", "discount type"]);
          var pValIdx = findColumnIndex(pHeaders, ["value", "amount", "percent"]);
          var pStartIdx = findColumnIndex(pHeaders, ["startdate", "start date"]);
          var pEndIdx = findColumnIndex(pHeaders, ["enddate", "end date"]);
          var pDescIdx = findColumnIndex(pHeaders, ["description", "notes"]);

          var todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);

          for (var p = 1; p < pData.length; p++) {
            var pRow = pData[p];
            var pCode = pCodeIdx !== -1 && pRow[pCodeIdx] ? String(pRow[pCodeIdx]).trim().toUpperCase() : "";
            if (!pCode) continue;

            var pType = pTypeIdx !== -1 && pRow[pTypeIdx] ? String(pRow[pTypeIdx]).trim().toLowerCase() : "percent";
            var pVal = pValIdx !== -1 && pRow[pValIdx] !== "" ? parseFloat(pRow[pValIdx]) || 0 : 0;
            var pStart = pStartIdx !== -1 && pRow[pStartIdx] ? formatDateStr(pRow[pStartIdx]) : "";
            var pEnd = pEndIdx !== -1 && pRow[pEndIdx] ? formatDateStr(pRow[pEndIdx]) : "";
            var pDesc = pDescIdx !== -1 && pRow[pDescIdx] ? String(pRow[pDescIdx]).trim() : "";

            var pStatus = "Active";
            var pEndParsed = parseDate(pEnd);
            var pStartParsed = parseDate(pStart);
            if (pEndParsed && todayDate > pEndParsed) {
              pStatus = "Expired";
            } else if (pStartParsed && todayDate < pStartParsed) {
              pStatus = "Scheduled";
            }

            promoCodes.push({
              code: pCode,
              type: pType,
              value: pVal,
              startDate: pStart,
              endDate: pEnd,
              description: pDesc,
              status: pStatus
            });
          }
        }
      } catch (genErr) {
        console.warn("Could not load promo codes: " + genErr.message);
      }

      return createJsonResponse({
        giftCards: giftCards,
        promoCodes: promoCodes
      });
    }

    var code = e && e.parameter && e.parameter.code ? e.parameter.code.trim().toUpperCase() : '';
    if (!code) {
      return createJsonResponse({ valid: false, message: "No code provided." });
    }

    var giftSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var giftSheet = giftSpreadsheet.getSheetByName("ActiveCodes") || giftSpreadsheet.getActiveSheet();

    // 2. CHECKOUT ACTION: REDEEM BALANCE
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

    // 3. CHECKOUT ACTION: VALIDATE CODE
    var result = lookupCodeInSheet(giftSheet, code);
    if (result.found) {
      return createJsonResponse(result.data);
    }

    // Fall back to General Discounts Spreadsheet ("Discount Codes" sheet tab)
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
 * Handles Web App POST requests (Roaster Admin Code Updates, Creations, Email Resends).
 */
function doPost(e) {
  try {
    var postData;
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      postData = e.parameter;
    }

    if (!postData) {
      return createJsonResponse({ error: "Missing POST request body" });
    }

    var authKey = (postData.adminHash || postData.adminKey || "").toString().trim();
    if (!isValidAdminKey(authKey)) {
      return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
    }

    var action = postData.action;

    // ACTION: ADMIN UPDATE CODE
    if (action === 'admin_update_code') {
      var target = postData.target || 'gift'; // 'gift' or 'promo'
      var targetCode = (postData.code || '').toString().trim().toUpperCase();

      if (!targetCode) {
        return createJsonResponse({ error: "Missing required code parameter" });
      }

      var sheet;
      if (target === 'gift') {
        var giftSS = SpreadsheetApp.getActiveSpreadsheet();
        sheet = giftSS.getSheetByName("ActiveCodes") || giftSS.getActiveSheet();
      } else {
        var promoSS = SpreadsheetApp.openById(GENERAL_DISCOUNTS_SPREADSHEET_ID);
        sheet = promoSS.getSheetByName("Discount Codes") || promoSS.getSheets()[0];
      }

      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var codeIdx = requireColumnIndex(headers, ["code", "gift code", "gift card code", "promo code"], "admin_update_code");
      var valIdx = findColumnIndex(headers, ["value", "amount", "balance", "percent"]);
      var typeIdx = findColumnIndex(headers, ["type", "discount type"]);
      var startIdx = findColumnIndex(headers, ["startdate", "start date"]);
      var endIdx = findColumnIndex(headers, ["enddate", "end date"]);
      var descIdx = findColumnIndex(headers, ["description", "notes"]);

      var targetRow = -1;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][codeIdx]).trim().toUpperCase() === targetCode) {
          targetRow = i + 1;
          break;
        }
      }

      if (targetRow === -1) {
        return createJsonResponse({ error: "Code not found: " + targetCode });
      }

      if (postData.value !== undefined && valIdx !== -1) {
        sheet.getRange(targetRow, valIdx + 1).setValue(parseFloat(postData.value) || 0);
      }
      if (postData.type !== undefined && typeIdx !== -1) {
        sheet.getRange(targetRow, typeIdx + 1).setValue(postData.type.toString().trim().toLowerCase());
      }
      if (postData.startDate !== undefined && startIdx !== -1) {
        sheet.getRange(targetRow, startIdx + 1).setValue(postData.startDate);
      }
      if (postData.endDate !== undefined && endIdx !== -1) {
        sheet.getRange(targetRow, endIdx + 1).setValue(postData.endDate);
      }
      if (postData.description !== undefined && descIdx !== -1) {
        sheet.getRange(targetRow, descIdx + 1).setValue(postData.description);
      }

      return createJsonResponse({
        success: true,
        message: "Code updated successfully.",
        code: targetCode
      });
    }

    // ACTION: ADMIN CREATE CODE
    if (action === 'admin_create_code') {
      var createTarget = postData.target || 'gift'; // 'gift' or 'promo'
      var newCode = (postData.code || '').toString().trim().toUpperCase();
      var newVal = parseFloat(postData.value || '0');
      var newType = (postData.type || (createTarget === 'gift' ? 'flat' : 'percent')).toString().trim().toLowerCase();
      var newStart = (postData.startDate || '').toString().trim();
      var newEnd = (postData.endDate || '').toString().trim();
      var newDesc = (postData.description || '').toString().trim();

      if (!newCode) {
        return createJsonResponse({ error: "Code is required" });
      }

      if (createTarget === 'gift') {
        var giftSS = SpreadsheetApp.getActiveSpreadsheet();
        var activeSheet = giftSS.getSheetByName("ActiveCodes") || giftSS.getActiveSheet();

        // Check for duplicates
        var curData = activeSheet.getDataRange().getValues();
        var h = curData[0];
        var cIdx = findColumnIndex(h, ["code", "gift code"]);
        if (cIdx !== -1) {
          for (var c = 1; c < curData.length; c++) {
            if (String(curData[c][cIdx]).trim().toUpperCase() === newCode) {
              return createJsonResponse({ error: "A gift card with code " + newCode + " already exists." });
            }
          }
        }

        // Append to ActiveCodes
        activeSheet.appendRow([newCode, newType, newVal, newStart, newEnd, newDesc]);

        // If purchaser/recipient metadata is provided, record it in Form Responses sheet
        var pName = (postData.purchaserName || '').toString().trim();
        var pEmail = (postData.purchaserEmail || '').toString().trim();
        var rName = (postData.recipientName || '').toString().trim();
        var rEmail = (postData.recipientEmail || '').toString().trim();
        var gMsg = (postData.giftMessage || '').toString().trim();
        var notes = (postData.notes || '').toString().trim();

        var respSheet = getResponsesSheet(giftSS);
        if (respSheet && (pEmail || rEmail || pName || rName)) {
          respSheet.appendRow([new Date(), pName, pEmail, newVal, newCode, rName, rEmail, gMsg, notes]);
        }

        // Email notifications if requested
        var emailSentRecipient = false;
        var emailSentPurchaser = false;

        var emailPayload = {
          purchaserName: pName,
          purchaserEmail: pEmail,
          recipientName: rName,
          recipientEmail: rEmail,
          giftCode: newCode,
          amount: newVal,
          giftMessage: gMsg
        };

        if (postData.sendRecipientEmail && rEmail) {
          try {
            sendRecipientEmail(emailPayload);
            emailSentRecipient = true;
          } catch (eErr) {
            console.error("Error sending recipient email on create: " + eErr.message);
          }
        }

        if (postData.sendPurchaserEmail && pEmail) {
          try {
            sendPurchaserEmail(emailPayload);
            emailSentPurchaser = true;
          } catch (pErr) {
            console.error("Error sending purchaser email on create: " + pErr.message);
          }
        }

        return createJsonResponse({
          success: true,
          message: "Gift card created successfully.",
          code: newCode,
          emailSentRecipient: emailSentRecipient,
          emailSentPurchaser: emailSentPurchaser
        });
      } else {
        // Create Promo Code
        var promoSS = SpreadsheetApp.openById(GENERAL_DISCOUNTS_SPREADSHEET_ID);
        var promoSheet = promoSS.getSheetByName("Discount Codes") || promoSS.getSheets()[0];

        // Check for duplicates
        var pCurData = promoSheet.getDataRange().getValues();
        var ph = pCurData[0];
        var pcIdx = findColumnIndex(ph, ["code", "promo code", "discount code"]);
        if (pcIdx !== -1) {
          for (var pc = 1; pc < pCurData.length; pc++) {
            if (String(pCurData[pc][pcIdx]).trim().toUpperCase() === newCode) {
              return createJsonResponse({ error: "A discount code with code " + newCode + " already exists." });
            }
          }
        }

        promoSheet.appendRow([newCode, newType, newVal, newStart, newEnd, newDesc]);

        return createJsonResponse({
          success: true,
          message: "Promo code created successfully.",
          code: newCode
        });
      }
    }

    // ACTION: ADMIN RESEND EMAIL
    if (action === 'admin_resend_email') {
      var resendCode = (postData.code || '').toString().trim().toUpperCase();
      var recipientType = (postData.recipientType || 'recipient').toString().trim().toLowerCase(); // 'recipient', 'purchaser', 'both'

      if (!resendCode) {
        return createJsonResponse({ error: "Missing gift card code" });
      }

      var giftSS = SpreadsheetApp.getActiveSpreadsheet();
      var activeSheet = giftSS.getSheetByName("ActiveCodes") || giftSS.getActiveSheet();
      var acData = activeSheet.getDataRange().getValues();
      var acHeaders = acData[0];
      var acCodeIdx = requireColumnIndex(acHeaders, ["code", "gift code", "gift card code"], "resend_email");
      var acValIdx = findColumnIndex(acHeaders, ["value", "amount", "balance"]);

      var currentBalance = 0;
      var foundCode = false;
      for (var k = 1; k < acData.length; k++) {
        if (String(acData[k][acCodeIdx]).trim().toUpperCase() === resendCode) {
          currentBalance = acValIdx !== -1 ? parseFloat(acData[k][acValIdx]) || 0 : 0;
          foundCode = true;
          break;
        }
      }

      if (!foundCode) {
        return createJsonResponse({ error: "Gift card not found: " + resendCode });
      }

      // Lookup metadata from form responses or use overrides from postData
      var respSheet = getResponsesSheet(giftSS);
      var pName = (postData.purchaserName || "").toString().trim();
      var pEmail = (postData.purchaserEmail || "").toString().trim();
      var rName = (postData.recipientName || "").toString().trim();
      var rEmail = (postData.recipientEmail || "").toString().trim();
      var gMsg = (postData.giftMessage || "").toString().trim();
      var origAmt = postData.amount !== undefined ? parseFloat(postData.amount) || currentBalance : currentBalance;

      if (respSheet && (!pEmail || !rEmail)) {
        var respData = respSheet.getDataRange().getValues();
        var rh = respData[0];
        var rCodeIdx = findColumnIndex(rh, ["gift code", "gift card code", "code"]);
        var rAmtIdx = findColumnIndex(rh, ["amount", "value", "gift code amount"]);
        var rPNameIdx = findColumnIndex(rh, ["purchaser name", "your name", "name"]);
        var rPEmailIdx = findColumnIndex(rh, ["purchaser email", "your email", "email"]);
        var rRNameIdx = findColumnIndex(rh, ["recipient name"]);
        var rREmailIdx = findColumnIndex(rh, ["recipient email"]);
        var rMsgIdx = findColumnIndex(rh, ["gift message", "message"]);

        for (var m = 1; m < respData.length; m++) {
          if (String(respData[m][rCodeIdx]).trim().toUpperCase() === resendCode) {
            var rowM = respData[m];
            if (!pName && rPNameIdx !== -1) pName = String(rowM[rPNameIdx]).trim();
            if (!pEmail && rPEmailIdx !== -1) pEmail = String(rowM[rPEmailIdx]).trim();
            if (!rName && rRNameIdx !== -1) rName = String(rowM[rRNameIdx]).trim();
            if (!rEmail && rREmailIdx !== -1) rEmail = String(rowM[rREmailIdx]).trim();
            if (!gMsg && rMsgIdx !== -1) gMsg = String(rowM[rMsgIdx]).trim();
            if (!postData.amount && rAmtIdx !== -1) origAmt = parseFloat(rowM[rAmtIdx]) || currentBalance;
            break;
          }
        }
      }

      var emailPayload = {
        purchaserName: pName,
        purchaserEmail: pEmail,
        recipientName: rName,
        recipientEmail: rEmail,
        giftCode: resendCode,
        amount: origAmt,
        giftMessage: gMsg
      };

      var sentRecipient = false;
      var sentPurchaser = false;

      if ((recipientType === 'recipient' || recipientType === 'both') && rEmail) {
        sendRecipientEmail(emailPayload);
        sentRecipient = true;
      }

      if ((recipientType === 'purchaser' || recipientType === 'both') && pEmail) {
        sendPurchaserEmail(emailPayload);
        sentPurchaser = true;
      }

      return createJsonResponse({
        success: true,
        message: "Email(s) dispatched successfully.",
        sentRecipient: sentRecipient,
        sentPurchaser: sentPurchaser
      });
    }

    return createJsonResponse({ error: "Unsupported POST action: " + action });
  } catch (err) {
    console.error("gift-codes doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
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

/**
 * Helper to locate the Form Responses tab in the gifting spreadsheet.
 */
function getResponsesSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName().toLowerCase();
    if (name.indexOf("response") >= 0 || name.indexOf("form") >= 0) {
      return sheets[i];
    }
  }
  for (var j = 0; j < sheets.length; j++) {
    if (sheets[j].getName().toLowerCase() !== "activecodes") {
      return sheets[j];
    }
  }
  return null;
}

/**
 * Formats a Date object or string into YYYY-MM-DD.
 */
function formatDateStr(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = (val.getMonth() + 1).toString();
    var d = val.getDate().toString();
    return y + "-" + (m.length === 1 ? "0" + m : m) + "-" + (d.length === 1 ? "0" + d : d);
  }
  return String(val).trim();
}
