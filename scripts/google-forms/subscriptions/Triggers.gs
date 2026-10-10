/**
 * Yellow Wing Roasters - Subscription Trigger Handlers
 */

/**
 * Triggered automatically on Google Form submission into the Subscription responses sheet.
 * Assigns sequential Order ID and dispatches subscriber confirmation email.
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

  // Require critical fulfillment fields; throw immediately if missing
  var customerEmail = requireField(e.namedValues, ["Email", "Email Address"], "onFormSubmit");
  var roast = requireField(e.namedValues, ["Roast", "Coffee"], "onFormSubmit");
  var cost = requireField(e.namedValues, ["Price", "Cost", "Total", "Price/period"], "onFormSubmit");
  var size = requireField(e.namedValues, ["Size", "Bag Size"], "onFormSubmit");
  var frequency = requireField(e.namedValues, ["Frequency"], "onFormSubmit");
  var deliveryMethod = getField(e.namedValues, ["Delivery Method", "Delivery"]) || "Pickup";
  var notes = getField(e.namedValues, ["Notes", "Special Instructions"]);

  console.log("Subscription Form Submission: Order #" + orderId + " for " + customerEmail + " (" + roast + " " + size + ", " + frequency + ")");

  sendSubscriptionConfirmationEmail({
    orderId: orderId,
    customerEmail: customerEmail,
    roast: roast,
    cost: cost,
    size: size,
    frequency: frequency,
    deliveryMethod: deliveryMethod,
    notes: notes
  });
}
