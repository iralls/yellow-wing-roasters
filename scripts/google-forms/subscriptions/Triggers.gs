/**
 * Yellow Wing Roasters - Subscription Form Submissions & Spreadsheet Triggers
 */

var CANONICAL_SUBSCRIPTION_HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Roast",
  "Size",
  "Frequency",
  "Delivery Method",
  "Address",
  "City",
  "State",
  "ZIP",
  "Notes",
  "Price",
  "Status",
  "Phone number",
  "Status Details",
  "Order ID",
  "Manage Token"
];

/**
 * Triggered automatically on Google Form submission into the Subscription responses sheet.
 * Assigns sequential Order ID, secure Manage Token, initial "Active" status, and emails confirmation.
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
  var manageTokenCol = requireColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"], "onFormSubmit") + 1;
  var statusCol = requireColumnIndex(headers, ["Status", "Subscription Status"], "onFormSubmit") + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]) + 1;

  // 1. Retrieve or calculate sequential Order ID
  var existingOrderId = sheet.getRange(row, orderIdCol).getValue();
  var orderId = existingOrderId ? existingOrderId.toString().trim() : "";
  if (!orderId) {
    orderId = (START_ORDER_ID + row - 1).toString();
    sheet.getRange(row, orderIdCol).setValue(orderId);
  }

  // 2. Generate and set secure Manage Token
  var manageToken = generateSecureToken();
  sheet.getRange(row, manageTokenCol).setValue(manageToken);

  // 3. Set default initial Status to "Active"
  var currentStatus = sheet.getRange(row, statusCol).getValue();
  if (!currentStatus) {
    sheet.getRange(row, statusCol).setValue("Active");
  }

  // 4. Initialize Status Details
  if (statusDetailsCol > 0 && !sheet.getRange(row, statusDetailsCol).getValue()) {
    sheet.getRange(row, statusDetailsCol).setValue("");
  }

  // 5. Extract and strictly require submission values
  var customerEmail = requireField(e.namedValues, ["Email", "Email Address"], "onFormSubmit");
  var roast = requireField(e.namedValues, ["Roast", "Coffee"], "onFormSubmit");
  var cost = requireField(e.namedValues, ["Price", "Cost", "Total", "Price/period"], "onFormSubmit");
  var size = requireField(e.namedValues, ["Size", "Bag Size"], "onFormSubmit");
  var frequency = requireField(e.namedValues, ["Frequency"], "onFormSubmit");
  var deliveryMethod = getField(e.namedValues, ["Delivery Method", "Delivery"]) || "Pickup";
  var notes = getField(e.namedValues, ["Notes", "Special Instructions", "Customer Instructions", "Order Notes", "Special Notes"]);

  console.log("Subscription placed: #" + orderId + " by " + customerEmail + " (" + roast + " " + size + ", " + frequency + ") with token " + manageToken);

  // 6. Send Confirmation Email with Magic Link (BCCs Roaster)
  sendSubscriptionConfirmationEmail({
    orderId: orderId,
    manageToken: manageToken,
    customerEmail: customerEmail,
    roast: roast,
    cost: cost,
    size: size,
    frequency: frequency,
    deliveryMethod: deliveryMethod,
    notes: notes
  });
}

/**
 * Formats and resets the sheet to the exact canonical 18-column layout matching the Google Form
 * and applies the in-cell dropdown validation on the Status column.
 */
function formatPristineSheet(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 1. Delete any existing data rows below header row 1
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // 2. Clear any stale data validations across the entire sheet
  var maxCols = Math.max(CANONICAL_SUBSCRIPTION_HEADERS.length, sheet.getLastColumn(), 18);
  sheet.getRange(1, 1, sheet.getMaxRows(), maxCols).clearDataValidations();

  // 3. Clear row 1 and write the exact 18 canonical headers
  sheet.getRange(1, 1, 1, maxCols).clearContent();
  sheet.getRange(1, 1, 1, CANONICAL_SUBSCRIPTION_HEADERS.length).setValues([CANONICAL_SUBSCRIPTION_HEADERS]);
  sheet.getRange(1, 1, 1, CANONICAL_SUBSCRIPTION_HEADERS.length)
    .setFontWeight("bold")
    .setFontFamily("Arial");
  sheet.setFrozenRows(1);

  // 4. Apply in-cell dropdown validation strictly to Column N (Col 14: Status)
  var statusCol = CANONICAL_SUBSCRIPTION_HEADERS.indexOf("Status") + 1;
  var numRows = Math.max(100, sheet.getMaxRows() - 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Active", "Paused", "Cancelled"], true)
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
    .addItem('Preview Subscription Email', 'menuPreviewSubscriptionConfirmation')
    .addToUi();
}

/**
 * Installs a clean Head onFormSubmit trigger for the active spreadsheet, removing any stale triggers.
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
 * Menu action to reset and format the sheet into the canonical pristine layout.
 */
function menuFormatPristineLayout() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "Reset & Format Pristine Sheet",
    "This will clear test rows, set Row 1 to the exact 18 columns matching the Google Form + Order ID & Manage Token, and apply the Status dropdown (Active, Paused, Cancelled) to Column N.\n\nProceed?",
    ui.ButtonSet.YES_NO
  );
  if (confirm === ui.Button.YES) {
    formatPristineSheet(SpreadsheetApp.getActiveSheet());
    ui.alert("Subscription sheet has been reset to a clean, pristine layout!");
  }
}

/**
 * Custom UI action: Resends status update email for the selected row.
 */
function menuSendSelectedRowStatusEmail() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a subscription row below the header row.");
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = requireColumnIndex(headers, ["Status", "Subscription Status"], "menuAction") + 1;
  var emailCol = requireColumnIndex(headers, ["Email", "Email Address"], "menuAction") + 1;
  var orderIdCol = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "menuAction") + 1;
  var roastCol = findColumnIndex(headers, ["Roast", "Coffee"]) + 1;
  var sizeCol = findColumnIndex(headers, ["Size", "Bag Size"]) + 1;
  var freqCol = findColumnIndex(headers, ["Frequency"]) + 1;
  var costCol = findColumnIndex(headers, ["Price", "Cost", "Total"]) + 1;
  var deliveryCol = findColumnIndex(headers, ["Delivery Method", "Delivery"]) + 1;
  var tokenCol = findColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"]) + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason"]) + 1;

  var currentStatus = sheet.getRange(row, statusCol).getValue().toString().trim() || "Active";
  var customerEmail = sheet.getRange(row, emailCol).getValue().toString().trim();
  var orderId = sheet.getRange(row, orderIdCol).getValue().toString().trim() || (START_ORDER_ID + row - 1);
  var roast = roastCol > 0 ? sheet.getRange(row, roastCol).getValue().toString().trim() : "";
  var size = sizeCol > 0 ? sheet.getRange(row, sizeCol).getValue().toString().trim() : "";
  var frequency = freqCol > 0 ? sheet.getRange(row, freqCol).getValue().toString().trim() : "";
  var cost = costCol > 0 ? sheet.getRange(row, costCol).getValue().toString().trim() : "";
  var deliveryMethod = deliveryCol > 0 ? sheet.getRange(row, deliveryCol).getValue().toString().trim() : "Pickup";
  var manageToken = tokenCol > 0 ? sheet.getRange(row, tokenCol).getValue().toString().trim() : "";
  var statusDetails = statusDetailsCol > 0 ? sheet.getRange(row, statusDetailsCol).getValue().toString().trim() : "";

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Resend Subscription Status Email",
    "Manually resend status notification (" + currentStatus + ") to " + customerEmail + " for Subscription #" + orderId + "?",
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    sendSubscriptionStatusEmail({
      orderId: orderId,
      manageToken: manageToken,
      customerEmail: customerEmail,
      roast: roast,
      size: size,
      frequency: frequency,
      cost: cost,
      deliveryMethod: deliveryMethod,
      status: currentStatus,
      statusDetails: statusDetails
    });
    ui.alert("Status email successfully sent to " + customerEmail + "!");
  }
}

/**
 * Custom UI action: Displays HTML preview modal dialog for subscription confirmation email.
 */
function menuPreviewSubscriptionConfirmation() {
  var html = HtmlService.createTemplateFromFile('subscription');
  html.orderId = 1001;
  html.manageToken = "previewtoken12345";
  html.customerEmail = "customer@example.com";
  html.roast = "The Migrator";
  html.size = "12oz";
  html.frequency = "Every 2 Weeks";
  html.deliveryMethod = "Hand delivery";
  html.cost = "$18.00";
  SpreadsheetApp.getUi().showModalDialog(html.evaluate().setWidth(600).setHeight(600), "Preview Subscription Email");
}
