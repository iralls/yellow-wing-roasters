// Paste the file ID of your General Discounts spreadsheet here
var GENERAL_DISCOUNTS_SPREADSHEET_ID = "1JHf2Qwtn3FcKVbynd_FqhUx2jVnNE5be_CrAjE8-9QE";

/**
 * 1. Web App API Endpoint (doGet)
 * Used by checkout to validate balances and record redemptions.
 */
function doGet(e) {
  var action = e.parameter.action ? e.parameter.action.trim().toLowerCase() : 'validate';
  var code = e.parameter.code ? e.parameter.code.trim().toUpperCase() : '';
  
  if (!code) {
    return createJsonResponse({ valid: false, message: "No code provided." });
  }

  var giftSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var giftSheet = giftSpreadsheet.getSheetByName("ActiveCodes");
  if (!giftSheet) {
    giftSheet = giftSpreadsheet.getActiveSheet();
  }

  // Deduct balance from an existing gift card code
  if (action === 'redeem') {
    var amountToDeduct = parseFloat(e.parameter.amount || '0');
    var lastColumn = giftSheet.getLastColumn();
    var headers = giftSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    var cleanHeaders = headers.map(function(h) { return h.toString().trim().toLowerCase(); });
    
    // Find dynamic column indices by header name
    var codeIndex = cleanHeaders.indexOf("code");
    codeIndex = codeIndex !== -1 ? codeIndex : 0;
    
    var valueIndex = cleanHeaders.indexOf("value");
    if (valueIndex === -1) {
      for (var k = 0; k < headers.length; k++) {
        if (/value|amount/i.test(headers[k])) { valueIndex = k; break; }
      }
    }
    valueIndex = valueIndex !== -1 ? valueIndex : 2;
    
    var typeIndex = cleanHeaders.indexOf("type");
    typeIndex = typeIndex !== -1 ? typeIndex : 1;

    var data = giftSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var rowCode = String(data[i][codeIndex]).trim().toUpperCase();
      if (rowCode === code) {
        var type = typeIndex < data[i].length ? String(data[i][typeIndex]).trim().toLowerCase() : "flat";
        var currentVal = valueIndex < data[i].length ? parseFloat(data[i][valueIndex]) : 0;
        
        if (type === "flat") {
          var newVal = Math.max(0, currentVal - amountToDeduct);
          // Update the Value cell dynamically at row (i + 1), column (valueIndex + 1)
          giftSheet.getRange(i + 1, valueIndex + 1).setValue(newVal);
          return createJsonResponse({ success: true, remaining: newVal });
        } else {
          return createJsonResponse({ success: true, message: "Percentage code applied; no balance deduction needed." });
        }
      }
    }
    return createJsonResponse({ success: false, message: "Code not found in Gifting sheet." });
  }
  
  // Validate code (Lookup in Gifting Sheet first)
  var result = lookupCodeInSheet(giftSheet, code);
  if (result.found) {
    return createJsonResponse(result.data);
  }
  
  // Fall back to General Discounts Spreadsheet ("Discount Codes" sheet tab)
  try {
    var generalSpreadsheet = SpreadsheetApp.openById(GENERAL_DISCOUNTS_SPREADSHEET_ID);
    var generalSheet = generalSpreadsheet.getSheetByName("Discount Codes");
    if (!generalSheet) {
      generalSheet = generalSpreadsheet.getSheets()[0];
    }
    var generalResult = lookupCodeInSheet(generalSheet, code);
    if (generalResult.found) {
      return createJsonResponse(generalResult.data);
    }
  } catch(err) {
    Logger.log("Failed to access general discounts spreadsheet: " + err.message);
  }
  
  return createJsonResponse({ valid: false, message: "Invalid discount/gift code." });
}

/**
 * 2. Helper to Validate a Code within a Specific Sheet (Dynamic Column Mapping)
 */
function lookupCodeInSheet(sheet, code) {
  var lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) return { found: false };
  
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var cleanHeaders = headers.map(function(h) { return h.toString().trim().toLowerCase(); });
  
  // Map column index by name (case-insensitive)
  var codeIndex = cleanHeaders.indexOf("code");
  var typeIndex = cleanHeaders.indexOf("type");
  
  var valueIndex = cleanHeaders.indexOf("value");
  if (valueIndex === -1) {
    for (var k = 0; k < headers.length; k++) {
      if (/value|amount/i.test(headers[k])) { valueIndex = k; break; }
    }
  }
  
  var startIndex = cleanHeaders.indexOf("startdate");
  if (startIndex === -1) startIndex = cleanHeaders.indexOf("start date");
  
  var endIndex = cleanHeaders.indexOf("enddate");
  if (endIndex === -1) endIndex = cleanHeaders.indexOf("end date");

  // Fallbacks to default indexes if columns are not found in the sheet headers
  codeIndex = codeIndex !== -1 ? codeIndex : 0;
  typeIndex = typeIndex !== -1 ? typeIndex : 1;
  valueIndex = valueIndex !== -1 ? valueIndex : 2;

  var data = sheet.getDataRange().getValues();
  var today = new Date();
  today.setHours(0,0,0,0);
  
  for (var i = 1; i < data.length; i++) {
    var rowCode = String(data[i][codeIndex]).trim().toUpperCase();
    if (rowCode === code) {
      var type = typeIndex < data[i].length ? String(data[i][typeIndex]).trim().toLowerCase() : "flat";
      var val = valueIndex < data[i].length ? parseFloat(data[i][valueIndex]) : 0;
      
      var startStr = startIndex !== -1 && startIndex < data[i].length ? String(data[i][startIndex]).trim() : "";
      var endStr = endIndex !== -1 && endIndex < data[i].length ? String(data[i][endIndex]).trim() : "";
      
      var start = startStr ? new Date(startStr.replace(/-/g, "/")) : null;
      var end = endStr ? new Date(endStr.replace(/-/g, "/")) : null;
      
      if (start) start.setHours(0,0,0,0);
      if (end) end.setHours(0,0,0,0);
      
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
 * 3. Helper to Return JSON Output with Headers
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 4. Form Submission Trigger
 * Automatically runs via installable trigger when a Gifting Form response is recorded.
 * Appends the generated code and value into the ActiveCodes sheet.
 */
function handleFormSubmit(e) {
  // Output every key-value pair as a clean, readable line for debugging
  try {
    console.log("=== RAW FORM SUBMISSION DATA ===");
    for (var key in e.namedValues) {
      console.log("Column Name: [" + key + "] => Value: " + JSON.stringify(e.namedValues[key]));
    }
    console.log("================================");
  } catch(logErr) {
    console.error("Failed to write diagnostic logs: " + logErr.toString());
  }

  try {
    var amountVal = parseFloat((e.namedValues['Gift Code Amount'] || e.namedValues['Gift Card Amount'] || e.namedValues['Gift Card Value'] || e.namedValues['Amount'] || ['0'])[0]);
    var giftCode = String(e.namedValues['Gift Code'] || e.namedValues['Gift Card Code'] || e.namedValues['Code'] || ['']).trim().toUpperCase();
    
    if (giftCode && !isNaN(amountVal)) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var activeCodesSheet = ss.getSheetByName("ActiveCodes");
      if (!activeCodesSheet) {
        activeCodesSheet = ss.getActiveSheet();
      }
      
      var newRow = activeCodesSheet.getLastRow() + 1;
      var lastCol = activeCodesSheet.getLastColumn();
      
      if (lastCol > 0) {
        var headers = activeCodesSheet.getRange(1, 1, 1, lastCol).getValues()[0];
        var cleanHeaders = headers.map(function(h) { return h.toString().trim().toLowerCase(); });
        
        var codeCol = cleanHeaders.indexOf("code") + 1;
        var typeCol = cleanHeaders.indexOf("type") + 1;
        
        var valueCol = cleanHeaders.indexOf("value") + 1;
        if (valueCol === 0) {
          for (var k = 0; k < headers.length; k++) {
            if (/value|amount/i.test(headers[k])) { valueCol = k + 1; break; }
          }
        }
        
        var descCol = cleanHeaders.indexOf("description") + 1;
        
        // Write cells dynamically by header column name
        if (codeCol > 0) activeCodesSheet.getRange(newRow, codeCol).setValue(giftCode);
        if (typeCol > 0) activeCodesSheet.getRange(newRow, typeCol).setValue("flat");
        if (valueCol > 0) activeCodesSheet.getRange(newRow, valueCol).setValue(amountVal);
        if (descCol > 0) activeCodesSheet.getRange(newRow, descCol).setValue("Registered via Form Submission Trigger");
      } else {
        // Fallback if sheet is completely empty: Column A=Code, B=Type, C=Value, D=Start, E=End, F=Desc
        activeCodesSheet.appendRow([
          giftCode,
          "flat",
          amountVal,
          "", // StartDate
          "", // EndDate
          "Registered via Form Submission Trigger" // Description
        ]);
      }
      
      Logger.log("Successfully registered gift card: " + giftCode + " with balance $" + amountVal);

      // Trigger the email notification flow
      sendGiftEmails(e, giftCode, amountVal);
    }
  } catch(err) {
    Logger.log("handleFormSubmit trigger failed: " + err.message);
  }
}

/**
 * 5. Helper Function to Send Confirmation Emails
 */
function sendGiftEmails(e, giftCode, amountVal) {
  // Output raw namedValues for full visibility in Executions Console
  console.log("Raw namedValues: " + JSON.stringify(e.namedValues));

  // Helper to extract values dynamically using regex pattern matching on keys
  function getValByPattern(pattern) {
    for (var key in e.namedValues) {
      if (pattern.test(key)) {
        var val = e.namedValues[key];
        return val ? val[0].toString().trim() : "";
      }
    }
    return "";
  }
  
  var purchaserName = getValByPattern(/purchaser.*name|your.*name|^name/i);
  var purchaserEmail = getValByPattern(/purchaser.*email|your.*email|^email/i);
  var recipientName = getValByPattern(/recipient.*name/i);
  var recipientEmail = getValByPattern(/recipient.*email/i);
  var giftMessage = getValByPattern(/message/i);

  console.log("=== SENDING GIFT EMAILS ===");
  console.log("Purchaser Name: " + purchaserName);
  console.log("Purchaser Email: " + purchaserEmail);
  console.log("Recipient Name: " + recipientName);
  console.log("Recipient Email: " + recipientEmail);
  console.log("Gift Code: " + giftCode);
  console.log("Amount Value: $" + amountVal);
  console.log("Gift Message: " + giftMessage);
  console.log("===========================");

  // Load logo thumbnail from Google Drive
  var imageFileId = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3'; // Replace with your actual File ID
  var file = DriveApp.getFileById(imageFileId);
  var resizedBlob = file.getThumbnail();
  if (!resizedBlob) {
    throw new Error("Unable to retrieve thumbnail. Make sure the file is an image.");
  }
  resizedBlob.setName("myResizedImage");

  // Send Confirmation Email to Purchaser
  try {
    var purchaserTemplate = HtmlService.createTemplateFromFile('purchaser-template');
    purchaserTemplate.purchaserName = purchaserName;
    purchaserTemplate.recipientName = recipientName;
    purchaserTemplate.recipientEmail = recipientEmail;
    purchaserTemplate.giftCode = giftCode;
    purchaserTemplate.amount = amountVal;

    GmailApp.sendEmail(
      purchaserEmail,
      `Yellow Wing Roasters Gift Card Purchase Confirmed`,
      `Thanks for your digital gift card purchase! The code is ${giftCode}`,
      {
        name: "Yellow Wing Roasters",
        from: 'orders@yellowwingroasters.com',
        htmlBody: purchaserTemplate.evaluate().getContent(),
        inlineImages: {
          myResizedImage: resizedBlob // Passes the Drive blob inline
        }
      }                                                                                                                      
    );
    console.log("Successfully sent Purchaser Email to: " + purchaserEmail);
  } catch (mailError) {
    console.error("Failed to send email to purchaser: " + purchaserEmail + ". Error: " + mailError.toString());
  }

  // Send Gift Card Email to Recipient
  if (recipientEmail) {
    try {
      var recipientTemplate = HtmlService.createTemplateFromFile('recipient-template');
      recipientTemplate.purchaserName = purchaserName;
      recipientTemplate.recipientName = recipientName;
      recipientTemplate.giftCode = giftCode;
      recipientTemplate.amount = amountVal;
      recipientTemplate.giftMessage = giftMessage;

      GmailApp.sendEmail(
        recipientEmail,
        `A Digital Gift Card from ${purchaserName}!`,
        `You have received a $${amountVal} digital gift card from ${purchaserName}!`,
        {
          name: "Yellow Wing Roasters",
          from: 'orders@yellowwingroasters.com',
          htmlBody: recipientTemplate.evaluate().getContent(),
          inlineImages: {
            myResizedImage: resizedBlob // Passes the Drive blob inline
          }
        }                                                                                                                      
      );
      console.log("Successfully sent Recipient Email to: " + recipientEmail);
    } catch (mailError) {
      console.error("Failed to send email to recipient: " + recipientEmail + ". Error: " + mailError.toString());
    }
  }
}
