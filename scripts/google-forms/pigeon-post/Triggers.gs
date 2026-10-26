/**
 * Yellow Wing Roasters - Pigeon Post Form Submissions & Spreadsheet Triggers
 */

/**
 * Triggered automatically on Google Form submission into the Pigeon Post responses sheet.
 * Sends the Welcome to Pigeon Post email to the new subscriber.
 */
function onFormSubmit(e) {
  if (!e || !e.range) {
    throw new Error("onFormSubmit: Missing event object or range. Ensure this is invoked via an onFormSubmit trigger.");
  }

  var subscriberEmail = requireField(e.namedValues, ["Email", "Email Address"], "onFormSubmit");
  sendWelcomeEmail(subscriberEmail);

  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();
  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var statusCol = findColumnIndex(headers, ["Welcome Status", "Status", "Welcome Email"]) + 1;
  if (statusCol > 0) {
    sheet.getRange(row, statusCol).setValue("Sent");
  }
}

/**
 * Creates custom spreadsheet menu on open for manual subscriber management.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Yellow Wing Roasters')
    .addItem('Send Welcome Email to Selected Row', 'menuSendWelcomeForSelectedRow')
    .addItem('Preview Welcome Email', 'menuPreviewWelcomeEmail')
    .addToUi();
}

/**
 * Custom UI action: Sends the Welcome to Pigeon Post email to the subscriber on the currently selected row.
 */
function menuSendWelcomeForSelectedRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a subscriber row below the header row.");
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var emailCol = requireColumnIndex(headers, ["Email", "Email Address"], "menuSendWelcomeForSelectedRow") + 1;
  var subscriberEmail = sheet.getRange(row, emailCol).getValue().toString().trim();

  if (!subscriberEmail) {
    throw new Error("menuSendWelcomeForSelectedRow: Subscriber email is empty on row " + row);
  }

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Send Welcome Email",
    "Send the Pigeon Post welcome email to " + subscriberEmail + "?",
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    sendWelcomeEmail(subscriberEmail);
    var statusCol = findColumnIndex(headers, ["Welcome Status", "Status", "Welcome Email"]) + 1;
    if (statusCol > 0) {
      sheet.getRange(row, statusCol).setValue("Sent");
    }
    ui.alert("Welcome email sent to " + subscriberEmail + "!");
  }
}

/**
 * Custom UI action: Displays HTML preview modal dialog for the Welcome to Pigeon Post email.
 */
function menuPreviewWelcomeEmail() {
  var htmlContent = renderWelcomeEmailHtml({});
  var output = HtmlService.createHtmlOutput(htmlContent)
    .setWidth(620)
    .setHeight(680);
  SpreadsheetApp.getUi().showModalDialog(output, "Preview Welcome Email");
}
