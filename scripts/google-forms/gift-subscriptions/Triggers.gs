/**
 * Yellow Wing Roasters - Gift Subscriptions Form Submissions & Spreadsheet Triggers
 */

/**
 * Triggered automatically on Google Form submission into the Gift Subscriptions responses sheet.
 * Assigns sequential Order ID, initial "Active" status, and dispatches purchaser & recipient emails.
 */
function onFormSubmit(e) {
  if (!e || !e.range) {
    throw new Error("onFormSubmit: Missing event object or range. Ensure this is invoked via an onFormSubmit trigger.");
  }

  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();

  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var orderIdCol = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "onFormSubmit") + 1;
  var statusCol = requireColumnIndex(headers, ["Status", "Order Status", "Gift Status"], "onFormSubmit") + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]) + 1;

  // 1. Assign sequential Order ID if empty
  var existingOrderId = sheet.getRange(row, orderIdCol).getValue();
  var orderId = existingOrderId ? existingOrderId.toString().trim() : "";
  if (!orderId) {
    orderId = (START_ORDER_ID + row - 1).toString();
    sheet.getRange(row, orderIdCol).setValue(orderId);
  }

  // 2. Set default initial Status to "Active"
  var currentStatus = sheet.getRange(row, statusCol).getValue();
  if (!currentStatus) {
    sheet.getRange(row, statusCol).setValue("Active");
  }

  // 3. Initialize Status Details
  if (statusDetailsCol > 0 && !sheet.getRange(row, statusDetailsCol).getValue()) {
    sheet.getRange(row, statusDetailsCol).setValue("");
  }

  // 4. Extract form fields
  var purchaserName = getField(e.namedValues, ['Purchaser Name', 'Your Name', "Purchaser's Name"]);
  var purchaserEmail = requireField(e.namedValues, ['Purchaser Email', "Purchaser's Email", 'Your Email', 'Your Email Address', 'Email'], 'onFormSubmit');
  var recipientName = getField(e.namedValues, ['Recipient Name', "Recipient's Name", 'Recipient']);
  var recipientEmail = getField(e.namedValues, ['Recipient Email', "Recipient's Email"]);
  var roast = requireField(e.namedValues, ['Roast', 'Coffee'], 'onFormSubmit');
  var duration = requireField(e.namedValues, ['Duration', 'Gift Duration'], 'onFormSubmit');
  var cost = requireField(e.namedValues, ['Total Price', 'Price', 'Total', 'Total Amount'], 'onFormSubmit');
  var giftMessage = getField(e.namedValues, ['Gift Message']);
  var notes = getField(e.namedValues, ['Notes', 'Additional Delivery Notes']);

  // Resilient defaults for attributes not directly asked in the gift form
  var size = getField(e.namedValues, ['Size', 'Bag Size']) || '12oz';
  var frequency = getField(e.namedValues, ['Frequency']) || (duration === 'One-time' ? 'One-time' : 'Monthly');
  var deliveryMethod = getField(e.namedValues, ['Delivery Method', 'Delivery']) || 'Hand delivery';

  console.log("GIFT SUBMISSION: Order ID=" + orderId + ", Purchaser=" + purchaserEmail + ", Recipient=" + recipientEmail);

  var orderData = {
    orderId: orderId,
    purchaserName: purchaserName,
    purchaserEmail: purchaserEmail,
    recipientName: recipientName,
    recipientEmail: recipientEmail,
    roast: roast,
    size: size,
    duration: duration,
    frequency: frequency,
    deliveryMethod: deliveryMethod,
    cost: cost,
    giftMessage: giftMessage,
    notes: notes,
    status: "Active"
  };

  // Send purchase receipt to buyer (BCCs Roaster)
  sendPurchaserConfirmation(orderData);

  // Send gift announcement to recipient (no prices)
  if (recipientEmail) {
    sendRecipientAnnouncement(orderData);
  }
}

/**
 * Resets and formats the active sheet to the canonical 13-column layout
 * and configures the in-cell Status dropdown validation rule.
 */
function formatPristineSheet(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  var maxCols = Math.max(CANONICAL_GIFT_SUB_HEADERS.length, sheet.getLastColumn(), 13);
  sheet.getRange(1, 1, sheet.getMaxRows(), maxCols).clearDataValidations();

  sheet.getRange(1, 1, 1, maxCols).clearContent();
  sheet.getRange(1, 1, 1, CANONICAL_GIFT_SUB_HEADERS.length).setValues([CANONICAL_GIFT_SUB_HEADERS]);
  sheet.getRange(1, 1, 1, CANONICAL_GIFT_SUB_HEADERS.length)
    .setFontWeight("bold")
    .setFontFamily("Arial");
  sheet.setFrozenRows(1);

  // Apply Status dropdown validation to Column L (Index 12)
  var statusCol = CANONICAL_GIFT_SUB_HEADERS.indexOf("Status") + 1;
  var numRows = Math.max(100, sheet.getMaxRows() - 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "Active",
      "Roasted",
      "Ready for Pickup",
      "Out for Delivery",
      "Delivered",
      "Paused",
      "Completed",
      "Cancelled"
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusCol, numRows, 1).setDataValidation(statusRule);
}

/**
 * Creates custom spreadsheet menu on open.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Yellow Wing Roasters')
    .addItem('Setup / Repair Form Submit Trigger', 'menuSetupFormSubmitTrigger')
    .addItem('Reset & Format Pristine Sheet', 'menuFormatPristineLayout')
    .addItem('Resend Status Email for Selected Row', 'menuSendSelectedRowStatusEmail')
    .addItem('Preview Gift Subscription Emails', 'menuPreviewGiftEmails')
    .addToUi();
}

/**
 * Installs clean Head onFormSubmit trigger for the active spreadsheet.
 */
function menuSetupFormSubmitTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
  SpreadsheetApp.getUi().alert(
    "Form Submit Trigger Installed!\n\n" +
    "Removed " + removed + " old trigger(s) and created a fresh Head trigger for onFormSubmit."
  );
}

/**
 * Menu action to format pristine layout.
 */
function menuFormatPristineLayout() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "Reset & Format Pristine Sheet",
    "This will clear test rows, format Row 1 with the 13 canonical headers matching Google Forms + Order ID, Status, and Status Details, and apply the Status dropdown to Column L.\n\nProceed?",
    ui.ButtonSet.YES_NO
  );
  if (confirm === ui.Button.YES) {
    formatPristineSheet(SpreadsheetApp.getActiveSheet());
    ui.alert("Gift Subscriptions sheet reset to pristine layout!");
  }
}

/**
 * Custom UI action: Resends status update email for the selected row.
 */
function menuSendSelectedRowStatusEmail() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a gift subscription row below the header row.");
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = requireColumnIndex(headers, ["Status", "Order Status"], "menuAction") + 1;
  var orderIdCol = requireColumnIndex(headers, ["Order ID", "Order #", "orderId"], "menuAction") + 1;
  var pNameCol = findColumnIndex(headers, ["Purchaser Name", "Your Name"]) + 1;
  var pEmailCol = requireColumnIndex(headers, ["Purchaser Email", "Your Email", "Email"], "menuAction") + 1;
  var rNameCol = findColumnIndex(headers, ["Recipient Name"]) + 1;
  var rEmailCol = findColumnIndex(headers, ["Recipient Email"]) + 1;
  var roastCol = findColumnIndex(headers, ["Roast", "Coffee"]) + 1;
  var durCol = findColumnIndex(headers, ["Duration", "Gift Duration"]) + 1;
  var costCol = findColumnIndex(headers, ["Total Price", "Price", "Cost"]) + 1;
  var msgCol = findColumnIndex(headers, ["Gift Message"]) + 1;
  var detailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details"]) + 1;

  var currentStatus = sheet.getRange(row, statusCol).getValue().toString().trim() || "Active";
  var orderId = sheet.getRange(row, orderIdCol).getValue().toString().trim() || (START_ORDER_ID + row - 1);
  var pEmail = sheet.getRange(row, pEmailCol).getValue().toString().trim();
  var rEmail = rEmailCol > 0 ? sheet.getRange(row, rEmailCol).getValue().toString().trim() : "";

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Resend Gift Status Update Email",
    "Send status notification (" + currentStatus + ") for Gift Order #" + orderId + "?\n\nRecipient: " + (rEmail || "None") + "\nPurchaser: " + pEmail,
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    var payload = {
      orderId: orderId,
      status: currentStatus,
      statusDetails: detailsCol > 0 ? sheet.getRange(row, detailsCol).getValue().toString().trim() : "",
      purchaserName: pNameCol > 0 ? sheet.getRange(row, pNameCol).getValue().toString().trim() : "",
      purchaserEmail: pEmail,
      recipientName: rNameCol > 0 ? sheet.getRange(row, rNameCol).getValue().toString().trim() : "",
      recipientEmail: rEmail,
      roast: roastCol > 0 ? sheet.getRange(row, roastCol).getValue().toString().trim() : "",
      duration: durCol > 0 ? sheet.getRange(row, durCol).getValue().toString().trim() : "3 months",
      cost: costCol > 0 ? sheet.getRange(row, costCol).getValue().toString().trim() : "",
      giftMessage: msgCol > 0 ? sheet.getRange(row, msgCol).getValue().toString().trim() : ""
    };

    if (rEmail) sendGiftSubscriptionStatusEmail(payload, true);
    if (pEmail) sendGiftSubscriptionStatusEmail(payload, false);
    ui.alert("Status email sent successfully!");
  }
}

/**
 * Custom UI action: Displays HTML preview modal dialog.
 */
function menuPreviewGiftEmails() {
  var html = HtmlService.createTemplateFromFile('recipient-announcement');
  html.orderId = 1001;
  html.purchaserName = "Jane Doe";
  html.recipientName = "Alex Smith";
  html.giftMessage = "Happy Birthday! Hope you love this coffee as much as I do.";
  html.roast = "The Migrator";
  html.size = "12oz";
  html.duration = "3 months";
  html.frequency = "Monthly";
  html.deliveryMethod = "Hand delivery";
  SpreadsheetApp.getUi().showModalDialog(html.evaluate().setWidth(600).setHeight(600), "Preview Recipient Announcement");
}
