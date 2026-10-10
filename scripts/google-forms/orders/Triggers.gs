/**
 * Yellow Wing Roasters - Order Form Submissions & Spreadsheet Triggers
 */

/**
 * Triggered automatically on Google Form submission into the Orders response sheet.
 * Assigns sequential Order ID, secure Manage Token, initial "Received" status, and emails confirmation.
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
  var statusCol = requireColumnIndex(headers, ["Status", "Order Status"], "onFormSubmit") + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]) + 1;

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

  // 3. Set default initial Status to "Received"
  var currentStatus = sheet.getRange(row, statusCol).getValue();
  if (!currentStatus) {
    sheet.getRange(row, statusCol).setValue("Received");
  }

  // 4. Initialize Status Details
  if (statusDetailsCol > 0 && !sheet.getRange(row, statusDetailsCol).getValue()) {
    sheet.getRange(row, statusDetailsCol).setValue("");
  }

  // 5. Extract and strictly require submission values
  var customerEmail = requireField(e.namedValues, ["Email", "Email Address"], "onFormSubmit");
  var items = requireField(e.namedValues, ["Items", "Order Items", "Item"], "onFormSubmit");
  var cost = requireField(e.namedValues, ["Total", "Price", "Cost", "Order Total"], "onFormSubmit");
  var deliveryMethod = getField(e.namedValues, ["Delivery Method", "Delivery"]) || "Pickup";

  console.log("Order placed: #" + orderId + " by " + customerEmail + " (" + cost + ") with token " + manageToken);

  // 6. Send Confirmation Email with Magic Link
  sendOrderConfirmationEmail({
    orderId: orderId,
    manageToken: manageToken,
    customerEmail: customerEmail,
    items: items,
    cost: cost,
    deliveryMethod: deliveryMethod
  });
}

/**
 * Creates custom spreadsheet menu on open.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Yellow Wing Roasters')
    .addItem('Resend Status Email for Selected Row', 'menuSendSelectedRowStatusEmail')
    .addItem('Preview Order Confirmation Email', 'menuPreviewOrderConfirmation')
    .addToUi();
}

/**
 * Empty onEdit trigger (direct edits do not dispatch emails without menu confirmation).
 */
function onEdit(e) {
  // Silent by design. Use custom menu item to dispatch status updates manually.
}

/**
 * Custom UI action: Resends status update email for the selected row.
 */
function menuSendSelectedRowStatusEmail() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select an order row below the header row.");
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = requireColumnIndex(headers, ["Status", "Order Status"], "menuAction") + 1;
  var emailCol = requireColumnIndex(headers, ["Email", "Email Address"], "menuAction") + 1;
  var orderIdCol = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "menuAction") + 1;

  var currentStatus = sheet.getRange(row, statusCol).getValue().toString().trim() || "Received";
  var customerEmail = sheet.getRange(row, emailCol).getValue().toString().trim();
  var orderId = sheet.getRange(row, orderIdCol).getValue().toString().trim() || (START_ORDER_ID + row - 1);

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Resend Status Update Email",
    "Manually resend status notification (" + currentStatus + ") to " + customerEmail + " for Order #" + orderId + "?",
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    sendStatusEmailForRow(sheet, row);
    ui.alert("Status email successfully sent to " + customerEmail + "!");
  }
}

/**
 * Custom UI action: Displays HTML preview modal dialog for order confirmation email.
 */
function menuPreviewOrderConfirmation() {
  var html = HtmlService.createTemplateFromFile('order-confirmation-template');
  html.orderId = 1001;
  html.manageToken = "mocktoken12345";
  html.customerEmail = "customer@example.com";
  html.items = "1x Early Bird 12oz (Grind: Whole Bean), 1x Feather Soot 2lb (Grind: Drip)";
  html.cost = "$42.00";
  html.deliveryMethod = "Pickup";
  SpreadsheetApp.getUi().showModalDialog(html.evaluate().setWidth(600).setHeight(600), "Preview Confirmation Email");
}
