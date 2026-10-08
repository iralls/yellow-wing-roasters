/**
 * Yellow Wing Roasters - Order Management & Confirmation Google Apps Script
 * Handles form submissions, secure token generation, magic link dispatch,
 * customer self-service updates & cancellations, and roaster status updates with on-demand emails.
 */

var ROASTER_EMAIL = 'orders@yellowwingroasters.com';
var LOGO_IMAGE_FILE_ID = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3';

/**
 * Helper to fetch the logo thumbnail blob safely for inline email embedding.
 */
function getLogoBlob() {
  try {
    var file = DriveApp.getFileById(LOGO_IMAGE_FILE_ID);
    var resizedBlob = file.getThumbnail();
    if (resizedBlob) {
      resizedBlob.setName("myResizedImage");
      return resizedBlob;
    }
  } catch (err) {
    Logger.log("getLogoBlob: Could not retrieve logo thumbnail: " + err.toString());
  }
  return null;
}

/**
 * Generates an unguessable 16-character hexadecimal token for order security.
 */
function generateSecureToken() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 16);
}

/**
 * Robust helper to find column index matching any variation of a header name (case-insensitive).
 */
function findColumnIndex(headers, possibleNames) {
  for (var i = 0; i < possibleNames.length; i++) {
    var pName = possibleNames[i].toLowerCase();
    for (var j = 0; j < headers.length; j++) {
      if (headers[j] && headers[j].toString().trim().toLowerCase() === pName) {
        return j;
      }
    }
  }
  return -1;
}

/**
 * 1. Form Submission Trigger: Assigns sequential Order ID (if not already set), secure Manage Token, initial status, and sends confirmation.
 */
function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();
  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  var orderIdCol = findColumnIndex(headers, ["Order ID", "Order #", "Order Number", "Order No.", "Order", "orderId"]) + 1;
  var manageTokenCol = findColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"]) + 1;
  var statusCol = findColumnIndex(headers, ["Status", "Order Status"]) + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]) + 1;

  // 1. Retrieve or calculate sequential Order ID
  var orderId = "";
  if (orderIdCol > 0) {
    var existingOrderId = sheet.getRange(row, orderIdCol).getValue();
    if (existingOrderId) {
      orderId = existingOrderId.toString().trim();
    }
  }
  if (!orderId && e && e.namedValues && e.namedValues['Order ID']) {
    orderId = e.namedValues['Order ID'][0].toString().trim();
  }
  if (!orderId) {
    var startId = 1000;
    orderId = (startId + row - 1).toString();
    if (orderIdCol > 0) {
      sheet.getRange(row, orderIdCol).setValue(orderId);
    }
  }

  // 2. Generate and set unguessable Manage Token
  var manageToken = generateSecureToken();
  if (manageTokenCol > 0) {
    sheet.getRange(row, manageTokenCol).setValue(manageToken);
  }

  // 3. Set default initial Status to "Received"
  if (statusCol > 0) {
    var currentStatus = sheet.getRange(row, statusCol).getValue();
    if (!currentStatus) {
      sheet.getRange(row, statusCol).setValue("Received");
    }
  }

  // 4. Initialize Status Details
  if (statusDetailsCol > 0 && !sheet.getRange(row, statusDetailsCol).getValue()) {
    sheet.getRange(row, statusDetailsCol).setValue("");
  }

  var customerEmail = e.namedValues['Email'] ? e.namedValues['Email'][0].toString().trim() : "";
  var items = e.namedValues['Items'] ? e.namedValues['Items'][0].toString().trim() : "";
  var cost = e.namedValues['Total'] ? e.namedValues['Total'][0].toString().trim() : "";
  var deliveryMethod = e.namedValues['Delivery Method'] ? e.namedValues['Delivery Method'][0].toString().trim() : "Pickup";
  var notes = e.namedValues['Notes'] ? e.namedValues['Notes'][0].toString().trim() : "";

  Logger.log("Order placed: #" + orderId + " by " + customerEmail + " (" + cost + ") with token " + manageToken);

  // 5. Send Confirmation Email with Magic Link
  var template = HtmlService.createTemplateFromFile('order-confirmation-template');
  template.orderId = orderId;
  template.manageToken = manageToken;
  template.customerEmail = customerEmail;
  template.items = items;
  template.cost = cost;
  template.deliveryMethod = deliveryMethod;

  var htmlBody = template.evaluate().getContent();
  var logoBlob = getLogoBlob();
  var mailOptions = {
    name: "Yellow Wing Roasters",
    from: 'orders@yellowwingroasters.com',
    bcc: ROASTER_EMAIL,
    replyTo: customerEmail,
    htmlBody: htmlBody
  };
  if (logoBlob) {
    mailOptions.inlineImages = { myResizedImage: logoBlob };
  }

  try {
    GmailApp.sendEmail(
      customerEmail,
      "Yellow Wing Roasters Order Confirmation (#" + orderId + ")",
      "Thanks for your order! Your order number is #" + orderId + ".",
      mailOptions
    );
    Logger.log("Confirmation sent to " + customerEmail);
  } catch (mailError) {
    Logger.log("Failed to send confirmation email: " + mailError.toString());
  }
}

/**
 * 2. Web App GET: Look up order with required token authentication.
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.preview) {
    var previewTpl = HtmlService.createTemplateFromFile('order-confirmation-template');
    previewTpl.orderId = 1001;
    previewTpl.manageToken = "previewtoken12345";
    previewTpl.customerEmail = "jane@test.com";
    previewTpl.items = "1x Early Bird 12oz (Grind: Whole Bean), 1x Feather Soot 2lb (Grind: Drip)";
    previewTpl.cost = "$42.00";
    previewTpl.deliveryMethod = "Pickup";
    return previewTpl.evaluate();
  }

  var orderIdParam = e && e.parameter && e.parameter.orderId ? e.parameter.orderId.toString().trim() : null;
  var tokenParam = e && e.parameter && e.parameter.token ? e.parameter.token.toString().trim() : null;

  if (!orderIdParam || !tokenParam) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized: Missing orderId or token parameter" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Order not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var orderIdIdx = findColumnIndex(headers, ["Order ID", "Order #", "Order Number", "Order No.", "Order", "orderId"]);
  var manageTokenIdx = findColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"]);
  var emailIdx = findColumnIndex(headers, ["Email", "Email Address"]);
  var timestampIdx = findColumnIndex(headers, ["Timestamp"]);
  var nameIdx = findColumnIndex(headers, ["Name", "Customer Name", "Full Name"]);
  var itemsIdx = findColumnIndex(headers, ["Items", "Order Items", "Item"]);
  var totalIdx = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]);
  var deliveryIdx = findColumnIndex(headers, ["Delivery Method", "Delivery"]);
  var addressIdx = findColumnIndex(headers, ["Street address", "Address", "Street Address"]);
  var cityIdx = findColumnIndex(headers, ["City"]);
  var stateIdx = findColumnIndex(headers, ["State"]);
  var zipIdx = findColumnIndex(headers, ["ZIP", "Zip Code", "Postal Code"]);
  var notesIdx = findColumnIndex(headers, ["Notes", "Order Notes", "Special Instructions"]);
  var statusIdx = findColumnIndex(headers, ["Status", "Order Status"]);
  var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]);

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowOrderId = orderIdIdx !== -1 && row[orderIdIdx] ? row[orderIdIdx].toString().trim() : (1000 + i).toString();
    var rowToken = manageTokenIdx !== -1 && row[manageTokenIdx] ? row[manageTokenIdx].toString().trim() : "";

    if (rowOrderId === orderIdParam && rowToken === tokenParam) {
      var statusVal = (statusIdx !== -1 && row[statusIdx] && row[statusIdx].toString().trim() !== "")
        ? row[statusIdx].toString().trim()
        : "Received";

      var statusDetailsVal = (statusDetailsIdx !== -1 && row[statusDetailsIdx])
        ? row[statusDetailsIdx].toString().trim()
        : "";

      var lowerStatus = statusVal.toLowerCase();
      var canCancel = (lowerStatus === 'received' || lowerStatus === 'delayed');

      return ContentService.createTextOutput(JSON.stringify({
        order: {
          orderId: rowOrderId,
          token: rowToken,
          name: nameIdx !== -1 ? row[nameIdx] : "",
          email: emailIdx !== -1 ? row[emailIdx] : "",
          items: itemsIdx !== -1 ? row[itemsIdx] : "",
          total: totalIdx !== -1 ? row[totalIdx] : "",
          deliveryMethod: deliveryIdx !== -1 ? row[deliveryIdx] : "Pickup",
          address: addressIdx !== -1 ? row[addressIdx] : "",
          city: cityIdx !== -1 ? row[cityIdx] : "",
          state: stateIdx !== -1 ? row[stateIdx] : "",
          zip: zipIdx !== -1 ? row[zipIdx] : "",
          notes: notesIdx !== -1 ? row[notesIdx] : "",
          status: statusVal,
          statusDetails: statusDetailsVal,
          timestamp: timestampIdx !== -1 ? row[timestampIdx] : "",
          canCancel: canCancel
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized: Invalid Order ID or Token" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 3. Web App POST: Request Magic Link, Cancel Order, Update Items, or Roaster Status Updates.
 */
function doPost(e) {
  var postData;
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    postData = e.parameter;
  }

  var action = postData.action; // 'request_link', 'cancel', 'update_items', 'update_status'

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var orderIdIdx = findColumnIndex(headers, ["Order ID", "Order #", "Order Number", "Order No.", "Order", "orderId"]);
  var manageTokenIdx = findColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"]);
  var emailIdx = findColumnIndex(headers, ["Email", "Email Address"]);
  var nameIdx = findColumnIndex(headers, ["Name", "Customer Name", "Full Name"]);
  var itemsIdx = findColumnIndex(headers, ["Items", "Order Items", "Item"]);
  var totalIdx = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]);
  var deliveryIdx = findColumnIndex(headers, ["Delivery Method", "Delivery"]);
  var notesIdx = findColumnIndex(headers, ["Notes", "Order Notes", "Special Instructions"]);
  var statusIdx = findColumnIndex(headers, ["Status", "Order Status"]);
  var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]);

  var logoBlob = getLogoBlob();

  // ACTION: REQUEST MAGIC LINK ("Email Me My Link")
  if (action === 'request_link') {
    var reqEmail = postData.email ? postData.email.toString().trim().toLowerCase() : "";
    var reqOrderId = postData.orderId ? postData.orderId.toString().trim() : "";

    if (reqEmail && reqOrderId) {
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var rowOrderId = orderIdIdx !== -1 && row[orderIdIdx] ? row[orderIdIdx].toString().trim() : (1000 + i).toString();
        var rowEmail = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";

        if (rowOrderId === reqOrderId && rowEmail === reqEmail) {
          var token = manageTokenIdx !== -1 ? row[manageTokenIdx] : "";
          if (!token) {
            token = generateSecureToken();
            if (manageTokenIdx !== -1) sheet.getRange(i + 1, manageTokenIdx + 1).setValue(token);
          }

          try {
            var magicTpl = HtmlService.createTemplateFromFile('order-magic-link-template');
            magicTpl.orderId = rowOrderId;
            magicTpl.manageToken = token;
            magicTpl.items = itemsIdx !== -1 ? row[itemsIdx] : "";
            magicTpl.cost = totalIdx !== -1 ? row[totalIdx] : "";

            var magicMailOptions = {
              name: "Yellow Wing Roasters",
              from: 'orders@yellowwingroasters.com',
              htmlBody: magicTpl.evaluate().getContent()
            };
            if (logoBlob) magicMailOptions.inlineImages = { myResizedImage: logoBlob };

            GmailApp.sendEmail(
              row[emailIdx],
              "Your Link to Manage Yellow Wing Roasters Order #" + rowOrderId,
              "Access your order using this secure link: https://yellowwingroasters.com/order/manage/?orderId=" + rowOrderId + "&token=" + token,
              magicMailOptions
            );
          } catch (magicErr) {
            Logger.log("Failed to send magic link email: " + magicErr.toString());
          }
          break;
        }
      }
    }

    // Always respond with identical message to avoid enumeration
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "If an order matches that information, we've emailed a secure link to manage it."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Authenticated actions require valid orderId & token
  var orderId = postData.orderId ? postData.orderId.toString().trim() : "";
  var token = postData.token ? postData.token.toString().trim() : "";

  if (!orderId || !token) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing orderId or token parameter" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var targetRowIdx = -1;
  for (var j = 1; j < data.length; j++) {
    var r = data[j];
    var rOrderId = orderIdIdx !== -1 && r[orderIdIdx] ? r[orderIdIdx].toString().trim() : (1000 + j).toString();
    var rToken = manageTokenIdx !== -1 && r[manageTokenIdx] ? r[manageTokenIdx].toString().trim() : "";

    if (rOrderId === orderId && rToken === token) {
      targetRowIdx = j + 1; // 1-indexed for Sheet range
      break;
    }
  }

  if (targetRowIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized: Invalid Order ID or Token" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var rowVals = sheet.getRange(targetRowIdx, 1, 1, headers.length).getValues()[0];
  var currentStatus = statusIdx !== -1 && rowVals[statusIdx] ? rowVals[statusIdx].toString().trim() : "Received";
  var customerEmail = emailIdx !== -1 ? rowVals[emailIdx].toString().trim() : "";
  var customerName = nameIdx !== -1 ? rowVals[nameIdx].toString().trim() : "Customer";
  var currentItems = itemsIdx !== -1 ? rowVals[itemsIdx].toString().trim() : "";
  var currentTotal = totalIdx !== -1 ? rowVals[totalIdx].toString().trim() : "";
  var deliveryMethod = deliveryIdx !== -1 ? rowVals[deliveryIdx].toString().trim() : "Pickup";

  // ACTION: CANCEL ORDER (Allowed strictly before roasting has occurred)
  if (action === 'cancel') {
    var lowerStatus = currentStatus.toLowerCase();
    if (lowerStatus === 'roasted' || lowerStatus === 'ready for pickup' || lowerStatus === 'ready to deliver' || lowerStatus === 'out for delivery' || lowerStatus === 'delivered' || lowerStatus === 'cancelled') {
      return ContentService.createTextOutput(JSON.stringify({ error: "Cancellations can only occur before roasting has occurred. Please contact " + ROASTER_EMAIL }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var reason = postData.reason ? postData.reason.toString().trim() : "";
    if (statusIdx !== -1) sheet.getRange(targetRowIdx, statusIdx + 1).setValue("Cancelled");
    if (statusDetailsIdx !== -1) sheet.getRange(targetRowIdx, statusDetailsIdx + 1).setValue(reason);

    // Append cancellation audit note
    if (notesIdx !== -1) {
      var prevNotes = rowVals[notesIdx] ? rowVals[notesIdx].toString().trim() : "";
      var auditNote = "[Cancelled by customer " + new Date().toLocaleString() + (reason ? ": " + reason : "") + "]";
      sheet.getRange(targetRowIdx, notesIdx + 1).setValue(prevNotes ? prevNotes + " | " + auditNote : auditNote);
    }

    // Send customer cancellation confirmation
    try {
      var cancelTpl = HtmlService.createTemplateFromFile('order-cancellation-template');
      cancelTpl.orderId = orderId;
      cancelTpl.reason = reason;
      cancelTpl.items = currentItems;
      cancelTpl.cost = currentTotal;

      var cancelMailOptions = {
        name: "Yellow Wing Roasters",
        from: 'orders@yellowwingroasters.com',
        replyTo: ROASTER_EMAIL,
        htmlBody: cancelTpl.evaluate().getContent()
      };
      if (logoBlob) cancelMailOptions.inlineImages = { myResizedImage: logoBlob };

      GmailApp.sendEmail(
        customerEmail,
        "Yellow Wing Roasters Order Cancelled (#" + orderId + ")",
        "Your order #" + orderId + " has been cancelled.",
        cancelMailOptions
      );
    } catch (cancelErr) {
      Logger.log("Failed to send cancellation email: " + cancelErr.toString());
    }

    // Notify Roaster of Cancellation
    try {
      var manageUrl = "https://yellowwingroasters.com/order/manage/?orderId=" + orderId + "&token=" + token;
      GmailApp.sendEmail(
        ROASTER_EMAIL,
        "Order Cancelled: #" + orderId + " (" + customerName + ")",
        "Order #" + orderId + " was cancelled by " + customerName + " (" + customerEmail + ").\n\nReason: " + (reason || "None provided") + "\n\nItems were:\n" + currentItems + "\nOriginal Total: " + currentTotal + "\n\nManage Link: " + manageUrl,
        {
          replyTo: customerEmail
        }
      );
    } catch (roasterMailErr) {
      Logger.log("Failed to send roaster cancellation email: " + roasterMailErr.toString());
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, status: "Cancelled" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ACTION: UPDATE ITEMS (Disabled: Orders are immutable)
  if (action === 'update_items') {
    return ContentService.createTextOutput(JSON.stringify({ error: "Orders are immutable. To make changes, please cancel this order and place a new one." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ACTION: UPDATE STATUS (Roaster / Admin API)
  if (action === 'update_status') {
    var newStatus = postData.status ? postData.status.toString().trim() : "";
    var newStatusDetails = postData.statusDetails ? postData.statusDetails.toString().trim() : "";

    if (!newStatus) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Missing status parameter" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (statusIdx !== -1) sheet.getRange(targetRowIdx, statusIdx + 1).setValue(newStatus);
    if (statusDetailsIdx !== -1) sheet.getRange(targetRowIdx, statusDetailsIdx + 1).setValue(newStatusDetails);

    // Automatically send status email based on status update
    var lower = newStatus.toLowerCase();
    var notifyStatuses = ['delayed', 'roasted', 'ready for pickup', 'ready to deliver', 'out for delivery', 'delivered', 'cancelled'];
    if (notifyStatuses.indexOf(lower) !== -1) {
      sendStatusEmailForRow(sheet, targetRowIdx);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, status: newStatus }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "Unrecognized action: " + action }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 4. Google Sheets UI & onEdit Trigger:
 * Automatically dispatches customer status update emails when the 'Status' column changes.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Yellow Wing Roasters')
    .addItem('Resend Status Email for Selected Row', 'menuSendSelectedRowStatusEmail')
    .addItem('Preview Order Confirmation Email', 'menuPreviewOrderConfirmation')
    .addToUi();
}

function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var row = e.range.getRow();
  if (row <= 1) return; // Header row

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = findColumnIndex(headers, ["Status", "Order Status"]) + 1;

  // When the Status column is updated
  if (statusCol > 0 && e.range.getColumn() === statusCol) {
    var newStatus = e.value ? e.value.toString().trim() : sheet.getRange(row, statusCol).getValue().toString().trim();
    var oldStatus = e.oldValue ? e.oldValue.toString().trim() : "";

    // Ignore if empty or unchanged
    if (!newStatus || newStatus === oldStatus) return;

    var lower = newStatus.toLowerCase();
    // Automatically send status update email for all progression statuses
    var notifyStatuses = ['delayed', 'roasted', 'ready for pickup', 'ready to deliver', 'out for delivery', 'delivered', 'cancelled'];
    if (notifyStatuses.indexOf(lower) !== -1) {
      sendStatusEmailForRow(sheet, row);
    }
  }
}

function menuSendSelectedRowStatusEmail() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select an order row (below header row).");
    return;
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = findColumnIndex(headers, ["Status", "Order Status"]) + 1;
  var emailCol = findColumnIndex(headers, ["Email", "Email Address"]) + 1;
  var orderIdCol = findColumnIndex(headers, ["Order ID", "Order #", "Order Number", "Order No.", "Order", "orderId"]) + 1;

  var currentStatus = statusCol > 0 ? sheet.getRange(row, statusCol).getValue() : "Received";
  var customerEmail = emailCol > 0 ? sheet.getRange(row, emailCol).getValue() : "";
  var orderId = orderIdCol > 0 ? sheet.getRange(row, orderIdCol).getValue() : (1000 + row - 1);

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Resend Status Update Email",
    "Manually resend status notification (" + currentStatus + ") to " + customerEmail + " for Order #" + orderId + "?",
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    sendStatusEmailForRow(sheet, row);
    ui.alert("Status email sent to " + customerEmail + "!");
  }
}

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

/**
 * 5. Core Status Email Dispatcher:
 * Tailors title, message, badge class, and notes label based on Status.
 */
function sendStatusEmailForRow(sheet, rowIdx) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var orderIdCol = findColumnIndex(headers, ["Order ID", "Order #", "Order Number", "Order No.", "Order", "orderId"]) + 1;
  var manageTokenCol = findColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"]) + 1;
  var emailCol = findColumnIndex(headers, ["Email", "Email Address"]) + 1;
  var itemsCol = findColumnIndex(headers, ["Items", "Order Items", "Item"]) + 1;
  var totalCol = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]) + 1;
  var deliveryCol = findColumnIndex(headers, ["Delivery Method", "Delivery"]) + 1;
  var statusCol = findColumnIndex(headers, ["Status", "Order Status"]) + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]) + 1;

  var orderId = orderIdCol > 0 ? sheet.getRange(rowIdx, orderIdCol).getValue() : (1000 + rowIdx - 1);
  var manageToken = manageTokenCol > 0 ? sheet.getRange(rowIdx, manageTokenCol).getValue() : "";
  var customerEmail = emailCol > 0 ? sheet.getRange(rowIdx, emailCol).getValue().toString().trim() : "";
  var items = itemsCol > 0 ? sheet.getRange(rowIdx, itemsCol).getValue() : "";
  var cost = totalCol > 0 ? sheet.getRange(rowIdx, totalCol).getValue() : "";
  var deliveryMethod = deliveryCol > 0 ? sheet.getRange(rowIdx, deliveryCol).getValue() : "Pickup";
  var status = statusCol > 0 ? sheet.getRange(rowIdx, statusCol).getValue().toString().trim() : "Received";
  var statusDetails = statusDetailsCol > 0 ? sheet.getRange(rowIdx, statusDetailsCol).getValue().toString().trim() : "";

  if (!customerEmail) {
    Logger.log("sendStatusEmailForRow: No customer email on row " + rowIdx);
    return;
  }

  var statusBadgeClass = "status-delayed";
  var statusTitle = "Order Status Update";
  var statusMessage = "Here is the latest update on your Yellow Wing Roasters order:";
  var detailsLabel = "Roaster Note";
  var subject = "Update on your Yellow Wing Roasters order (#" + orderId + ")";

  var lowerStatus = status.toLowerCase();
  if (lowerStatus === 'delayed') {
    statusBadgeClass = "status-delayed";
    statusTitle = "Order Slightly Delayed";
    statusMessage = "We are currently experiencing a brief delay with your order. We appreciate your patience while we get everything dialed in!";
    detailsLabel = "Reason for Delay";
    subject = "Important Update: Order #" + orderId + " is Delayed";
  } else if (lowerStatus === 'roasted') {
    statusBadgeClass = "status-roasted";
    statusTitle = "Freshly Roasted!";
    statusMessage = "Your beans have just been roasted to perfection and are beginning to degas. We'll send another update as soon as they are ready for pickup or delivery.";
    detailsLabel = "Roast Notes";
    subject = "Fresh from the Roaster: Order #" + orderId + " is Roasted";
  } else if (lowerStatus === 'ready for pickup') {
    statusBadgeClass = "status-ready";
    statusTitle = "Ready for Pickup!";
    statusMessage = "Your coffee is roasted, packaged, and ready for pickup!";
    detailsLabel = "Pickup Instructions";
    subject = "Your Yellow Wing Roasters order is ready for pickup! (#" + orderId + ")";
  } else if (lowerStatus === 'ready to deliver' || lowerStatus === 'out for delivery') {
    statusBadgeClass = "status-ready";
    statusTitle = "Out for Hand Delivery!";
    statusMessage = "Your coffee is packaged and on its way to your doorstep today!";
    detailsLabel = "Delivery Instructions";
    subject = "Out for Delivery: Your Yellow Wing Roasters order (#" + orderId + ")";
  } else if (lowerStatus === 'delivered') {
    statusBadgeClass = "status-delivered";
    statusTitle = "Order Delivered!";
    statusMessage = "Your coffee has been hand delivered. Enjoy your fresh cup, and thank you for supporting small-batch roasting!";
    detailsLabel = "Delivery Note";
    subject = "Delivered: Your Yellow Wing Roasters order (#" + orderId + ")";
  } else if (lowerStatus === 'cancelled') {
    statusBadgeClass = "status-cancelled";
    statusTitle = "Order Cancelled";
    statusMessage = "Your order #" + orderId + " has been cancelled.";
    detailsLabel = "Cancellation Note";
    subject = "Cancelled: Your Yellow Wing Roasters order (#" + orderId + ")";
  }

  var template = HtmlService.createTemplateFromFile('order-status-update-template');
  template.orderId = orderId;
  template.manageToken = manageToken;
  template.customerEmail = customerEmail;
  template.items = items;
  template.cost = cost;
  template.deliveryMethod = deliveryMethod;
  template.status = status;
  template.statusDetails = statusDetails;
  template.statusBadgeClass = statusBadgeClass;
  template.statusTitle = statusTitle;
  template.statusMessage = statusMessage;
  template.detailsLabel = detailsLabel;

  var logoBlob = getLogoBlob();
  var mailOptions = {
    name: "Yellow Wing Roasters",
    from: 'orders@yellowwingroasters.com',
    bcc: ROASTER_EMAIL,
    replyTo: ROASTER_EMAIL,
    htmlBody: template.evaluate().getContent()
  };
  if (logoBlob) mailOptions.inlineImages = { myResizedImage: logoBlob };

  try {
    GmailApp.sendEmail(
      customerEmail,
      subject,
      statusTitle + " - Order #" + orderId + ": " + statusMessage,
      mailOptions
    );
    Logger.log("Status email (" + status + ") sent to " + customerEmail);
  } catch (err) {
    Logger.log("Failed to send status email: " + err.toString());
  }
}
