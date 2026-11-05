/**
 * Yellow Wing Roasters - Subscription Email Dispatcher
 */

/**
 * Sends confirmation email to a new subscriber.
 */
function sendSubscriptionConfirmationEmail(orderData) {
  var template = HtmlService.createTemplateFromFile('subscription');
  template.orderId = orderData.orderId;
  template.cost = orderData.cost;
  template.roast = orderData.roast;
  template.size = orderData.size;
  template.frequency = orderData.frequency;
  template.deliveryMethod = orderData.deliveryMethod;

  var htmlBody = template.evaluate().getContent();

  GmailApp.sendEmail(
    orderData.customerEmail,
    "Yellow Wing Roasters Subscription Confirmation (" + orderData.orderId + ")",
    "Thanks for your order! Your subscription order number is " + orderData.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: htmlBody
    }
  );
  console.log("Subscription confirmation successfully sent to " + orderData.customerEmail + " (#" + orderData.orderId + ")");
}

/**
 * Renders or sends preview of subscription confirmation email for debugging.
 */
function previewSubscriptionEmail() {
  var previewData = {
    orderId: "SUB-DEBUG-1001",
    cost: "$18.00",
    roast: "The Migrator",
    size: "12oz",
    frequency: "Every 2 Weeks",
    deliveryMethod: "Hand delivery",
    customerEmail: ROASTER_EMAIL
  };
  sendSubscriptionConfirmationEmail(previewData);
}
