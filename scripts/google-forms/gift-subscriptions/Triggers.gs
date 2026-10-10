/**
 * Yellow Wing Roasters - Gift Subscriptions Trigger Handlers
 */

/**
 * Triggered automatically on Google Form submission into the Gift Subscriptions responses sheet.
 * Assigns sequential Order ID and emails both purchaser and recipient.
 */
function onFormSubmit(e) {
  if (!e || !e.range) {
    throw new Error("onFormSubmit: Missing event object or range. Ensure this is invoked via an onFormSubmit trigger.");
  }

  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();

  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var orderIdColumn = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "onFormSubmit") + 1;

  var orderId = START_ORDER_ID + row - 1;
  sheet.getRange(row, orderIdColumn).setValue(orderId);

  // Strictly require core fields to avoid silent defaults
  var purchaserName = getField(e.namedValues, ['Purchaser Name', 'Your Name', "Purchaser's Name"]);
  var purchaserEmail = requireField(e.namedValues, ['Purchaser Email', "Purchaser's Email", 'Your Email', 'Your Email Address', 'Email'], 'onFormSubmit');
  var recipientName = getField(e.namedValues, ['Recipient Name', "Recipient's Name", 'Recipient']);
  var recipientEmail = getField(e.namedValues, ['Recipient Email', "Recipient's Email"]);
  var roast = requireField(e.namedValues, ['Roast', 'Coffee'], 'onFormSubmit');
  var size = requireField(e.namedValues, ['Size', 'Bag Size'], 'onFormSubmit');
  var duration = requireField(e.namedValues, ['Duration', 'Gift Duration'], 'onFormSubmit');
  var frequency = requireField(e.namedValues, ['Frequency'], 'onFormSubmit');
  var cost = requireField(e.namedValues, ['Total Price', 'Price', 'Total', 'Total Amount'], 'onFormSubmit');
  var deliveryMethod = getField(e.namedValues, ['Delivery Method', 'Delivery']) || 'Hand delivery';
  var giftMessage = getField(e.namedValues, ['Gift Message']);
  var notes = getField(e.namedValues, ['Notes', 'Additional Delivery Notes']);

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
    notes: notes
  };

  sendPurchaserConfirmation(orderData);
  if (recipientEmail) {
    sendRecipientAnnouncement(orderData);
  }
}
