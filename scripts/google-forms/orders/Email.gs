/**
 * Yellow Wing Roasters - Order Email Dispatcher
 */

/**
 * Helper to fetch the logo thumbnail blob safely for inline email embedding.
 * Throws if the file cannot be located or converted.
 */
function getLogoBlob() {
  var file;
  try {
    file = DriveApp.getFileById(LOGO_IMAGE_FILE_ID);
  } catch (err) {
    throw new Error("getLogoBlob: Could not locate Drive file [" + LOGO_IMAGE_FILE_ID + "]: " + err.message);
  }

  var resizedBlob = file.getThumbnail();
  if (!resizedBlob) {
    throw new Error("getLogoBlob: Could not generate thumbnail for Drive file [" + LOGO_IMAGE_FILE_ID + "]. Ensure it is an image.");
  }

  resizedBlob.setName("myResizedImage");
  return resizedBlob;
}

/**
 * Sends initial order confirmation email containing the customer's secure magic link.
 */
function sendOrderConfirmationEmail(orderData) {
  var template = HtmlService.createTemplateFromFile('order-confirmation-template');
  template.orderId = orderData.orderId;
  template.manageToken = orderData.manageToken;
  template.customerEmail = orderData.customerEmail;
  template.items = orderData.items;
  template.cost = orderData.cost;
  template.deliveryMethod = orderData.deliveryMethod;

  var htmlBody = template.evaluate().getContent();
  var logoBlob = getLogoBlob();

  GmailApp.sendEmail(
    orderData.customerEmail,
    "Yellow Wing Roasters Order Confirmation (#" + orderData.orderId + ")",
    "Thanks for your order! Your order number is #" + orderData.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      bcc: ROASTER_EMAIL,
      replyTo: orderData.customerEmail,
      htmlBody: htmlBody,
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Order confirmation email sent to " + orderData.customerEmail + " (#" + orderData.orderId + ")");
}

/**
 * Sends magic link access email requested via customer self-service form.
 */
function sendMagicLinkEmail(orderData) {
  var magicTpl = HtmlService.createTemplateFromFile('order-magic-link-template');
  magicTpl.orderId = orderData.orderId;
  magicTpl.manageToken = orderData.manageToken;
  magicTpl.items = orderData.items;
  magicTpl.cost = orderData.cost;

  var logoBlob = getLogoBlob();
  var magicMailOptions = {
    name: "Yellow Wing Roasters",
    from: ROASTER_EMAIL,
    htmlBody: magicTpl.evaluate().getContent(),
    inlineImages: { myResizedImage: logoBlob }
  };

  GmailApp.sendEmail(
    orderData.email,
    "Your Link to Manage Yellow Wing Roasters Order #" + orderData.orderId,
    "Access your order using this secure link: https://yellowwingroasters.com/order/manage/?orderId=" + orderData.orderId + "&token=" + orderData.manageToken,
    magicMailOptions
  );
  console.log("Magic link email dispatched to " + orderData.email + " (#" + orderData.orderId + ")");
}

/**
 * Sends cancellation confirmation email to the customer.
 */
function sendCustomerCancellationEmail(orderData) {
  var cancelTpl = HtmlService.createTemplateFromFile('order-cancellation-template');
  cancelTpl.orderId = orderData.orderId;
  cancelTpl.reason = orderData.reason;
  cancelTpl.items = orderData.items;
  cancelTpl.cost = orderData.cost;

  var logoBlob = getLogoBlob();
  GmailApp.sendEmail(
    orderData.customerEmail,
    "Yellow Wing Roasters Order Cancelled (#" + orderData.orderId + ")",
    "Your order #" + orderData.orderId + " has been cancelled.",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      replyTo: ROASTER_EMAIL,
      htmlBody: cancelTpl.evaluate().getContent(),
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Cancellation email sent to customer: " + orderData.customerEmail + " (#" + orderData.orderId + ")");
}

/**
 * Sends cancellation alert email to the roaster.
 */
function sendRoasterCancellationEmail(orderData) {
  var manageUrl = "https://yellowwingroasters.com/order/manage/?orderId=" + orderData.orderId + "&token=" + orderData.manageToken;
  GmailApp.sendEmail(
    ROASTER_EMAIL,
    "Order Cancelled: #" + orderData.orderId + " (" + orderData.customerName + ")",
    "Order #" + orderData.orderId + " was cancelled by " + orderData.customerName + " (" + orderData.customerEmail + ").\n\n" +
    "Reason: " + (orderData.reason || "None provided") + "\n\n" +
    "Items were:\n" + orderData.items + "\n" +
    "Original Total: " + orderData.cost + "\n\n" +
    "Manage Link: " + manageUrl,
    {
      replyTo: orderData.customerEmail
    }
  );
  console.log("Cancellation alert dispatched to roaster for Order #" + orderData.orderId);
}

/**
 * Core status email dispatcher for a specific spreadsheet row.
 */
function sendStatusEmailForRow(sheet, rowIdx) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var orderIdCol = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "sendStatusEmail") + 1;
  var manageTokenCol = requireColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"], "sendStatusEmail") + 1;
  var emailCol = requireColumnIndex(headers, ["Email", "Email Address"], "sendStatusEmail") + 1;
  var itemsCol = findColumnIndex(headers, ["Items", "Order Items", "Item"]) + 1;
  var totalCol = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]) + 1;
  var deliveryCol = findColumnIndex(headers, ["Delivery Method", "Delivery"]) + 1;
  var statusCol = requireColumnIndex(headers, ["Status", "Order Status"], "sendStatusEmail") + 1;
  var statusDetailsCol = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]) + 1;

  var orderId = sheet.getRange(rowIdx, orderIdCol).getValue().toString().trim();
  var manageToken = sheet.getRange(rowIdx, manageTokenCol).getValue().toString().trim();
  var customerEmail = sheet.getRange(rowIdx, emailCol).getValue().toString().trim();
  var items = itemsCol > 0 ? sheet.getRange(rowIdx, itemsCol).getValue().toString().trim() : "";
  var cost = totalCol > 0 ? sheet.getRange(rowIdx, totalCol).getValue().toString().trim() : "";
  var deliveryMethod = deliveryCol > 0 ? sheet.getRange(rowIdx, deliveryCol).getValue().toString().trim() : "Pickup";
  var status = sheet.getRange(rowIdx, statusCol).getValue().toString().trim();
  var statusDetails = statusDetailsCol > 0 ? sheet.getRange(rowIdx, statusDetailsCol).getValue().toString().trim() : "";

  if (!customerEmail) {
    throw new Error("sendStatusEmailForRow: Customer email missing on row " + rowIdx);
  }

  var lowerStatus = status.toLowerCase();
  var statusConfig = STATUS_CONFIGS[lowerStatus] || {
    badgeClass: 'status-delayed',
    title: 'Order Status Update',
    message: 'Here is the latest update on your Yellow Wing Roasters order:',
    detailsLabel: 'Roaster Note',
    subject: function (id) { return "Update on your Yellow Wing Roasters order (#" + id + ")"; }
  };

  var subject = statusConfig.subject(orderId);

  var template = HtmlService.createTemplateFromFile('order-status-update-template');
  template.orderId = orderId;
  template.manageToken = manageToken;
  template.customerEmail = customerEmail;
  template.items = items;
  template.cost = cost;
  template.deliveryMethod = deliveryMethod;
  template.status = status;
  template.statusDetails = statusDetails;
  template.statusBadgeClass = statusConfig.badgeClass;
  template.statusTitle = statusConfig.title;
  template.statusMessage = statusConfig.message;
  template.detailsLabel = statusConfig.detailsLabel;

  var logoBlob = getLogoBlob();
  GmailApp.sendEmail(
    customerEmail,
    subject,
    statusConfig.title + " - Order #" + orderId + ": " + statusConfig.message,
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      bcc: ROASTER_EMAIL,
      replyTo: ROASTER_EMAIL,
      htmlBody: template.evaluate().getContent(),
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Status update email (" + status + ") sent to " + customerEmail + " (#" + orderId + ")");
}
