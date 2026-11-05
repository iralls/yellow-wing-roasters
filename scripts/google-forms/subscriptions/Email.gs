/**
 * Yellow Wing Roasters - Subscription Email Dispatcher
 */

/**
 * Sends initial confirmation email to a new subscriber containing their direct Magic Link.
 */
function sendSubscriptionConfirmationEmail(orderData) {
  var template = HtmlService.createTemplateFromFile('subscription');
  template.orderId = orderData.orderId;
  template.manageToken = orderData.manageToken || "";
  template.customerEmail = orderData.customerEmail;
  template.cost = orderData.cost;
  template.roast = orderData.roast;
  template.size = orderData.size;
  template.frequency = orderData.frequency;
  template.deliveryMethod = orderData.deliveryMethod;

  var htmlBody = template.evaluate().getContent();

  GmailApp.sendEmail(
    orderData.customerEmail,
    "Yellow Wing Roasters Subscription Confirmation (#" + orderData.orderId + ")",
    "Thanks for subscribing! Your subscription number is #" + orderData.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      bcc: ROASTER_EMAIL,
      replyTo: orderData.customerEmail,
      htmlBody: htmlBody
    }
  );
  console.log("Subscription confirmation successfully sent to " + orderData.customerEmail + " (#" + orderData.orderId + ")");
}

/**
 * Sends magic link access email requested via customer self-service form.
 */
function sendSubscriptionMagicLinkEmail(subData) {
  var magicTpl = HtmlService.createTemplateFromFile('subscription-magic-link-template');
  magicTpl.orderId = subData.orderId;
  magicTpl.manageToken = subData.manageToken;
  magicTpl.roast = subData.roast;
  magicTpl.size = subData.size;
  magicTpl.frequency = subData.frequency;
  magicTpl.status = subData.status || "Active";

  var magicMailOptions = {
    name: "Yellow Wing Roasters",
    from: ROASTER_EMAIL,
    replyTo: ROASTER_EMAIL,
    htmlBody: magicTpl.evaluate().getContent()
  };

  GmailApp.sendEmail(
    subData.customerEmail,
    "Your Link to Manage Yellow Wing Roasters Subscription #" + subData.orderId,
    "Access your subscription using this secure link: https://yellowwingroasters.com/subscriptions/manage/?orderId=" + subData.orderId + "&token=" + subData.manageToken,
    magicMailOptions
  );
  console.log("Magic link email dispatched to subscriber " + subData.customerEmail + " (#" + subData.orderId + ")");
}

/**
 * Sends branded status update email to subscriber when status changes (Paused, Resumed/Active, Cancelled).
 */
function sendSubscriptionStatusEmail(subData) {
  var rawStatus = (subData.status || "Active").toString().trim();
  var lowerStatus = rawStatus.toLowerCase();
  var statusConfig = SUBSCRIPTION_STATUS_CONFIGS[lowerStatus] || {
    badgeClass: 'status-paused',
    title: 'Subscription Status Update',
    message: "Here is the latest update on your Yellow Wing Roasters subscription:",
    detailsLabel: 'Notes',
    subject: function (id) { return "Update on your Yellow Wing Roasters subscription (#" + id + ")"; }
  };

  var subject = statusConfig.subject(subData.orderId);

  var template = HtmlService.createTemplateFromFile('subscription-status-update-template');
  template.orderId = subData.orderId;
  template.manageToken = subData.manageToken || "";
  template.customerEmail = subData.customerEmail;
  template.roast = subData.roast;
  template.size = subData.size;
  template.frequency = subData.frequency;
  template.cost = subData.cost || "";
  template.deliveryMethod = subData.deliveryMethod || "Pickup";
  template.status = rawStatus;
  template.statusDetails = subData.statusDetails || "";
  template.statusTitle = statusConfig.title;
  template.statusMessage = statusConfig.message;
  template.detailsLabel = statusConfig.detailsLabel;

  GmailApp.sendEmail(
    subData.customerEmail,
    subject,
    statusConfig.title + " - Subscription #" + subData.orderId + ": " + statusConfig.message,
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      bcc: ROASTER_EMAIL,
      replyTo: ROASTER_EMAIL,
      htmlBody: template.evaluate().getContent()
    }
  );
  console.log("Subscription status email (" + rawStatus + ") sent to subscriber " + subData.customerEmail + " (#" + subData.orderId + ")");
}

/**
 * Sends internal alert email to roaster when a subscriber pauses, resumes, or cancels.
 */
function sendRoasterSubscriptionAlertEmail(subData) {
  var manageUrl = "https://yellowwingroasters.com/subscriptions/manage/?orderId=" + subData.orderId + "&token=" + (subData.manageToken || "");
  var rawStatus = subData.status || "Updated";
  var actionVerb = rawStatus.toLowerCase() === 'active' ? 'Resumed' : rawStatus;

  GmailApp.sendEmail(
    ROASTER_EMAIL,
    "Subscription " + actionVerb + ": #" + subData.orderId + " (" + (subData.customerName || subData.customerEmail) + ")",
    "Subscription #" + subData.orderId + " was updated to [" + rawStatus + "] by " + (subData.customerName || "Customer") + " (" + subData.customerEmail + ").\n\n" +
    "Coffee: " + subData.roast + "\n" +
    "Size: " + subData.size + "\n" +
    "Frequency: " + subData.frequency + "\n" +
    (subData.cost ? "Price per period: " + subData.cost + "\n" : "") +
    (subData.deliveryMethod ? "Delivery: " + subData.deliveryMethod + "\n" : "") +
    "Reason / Details: " + (subData.statusDetails || "None provided") + "\n\n" +
    "Manage Link: " + manageUrl,
    {
      replyTo: subData.customerEmail
    }
  );
  console.log("Subscription alert dispatched to roaster for Subscription #" + subData.orderId + " (" + rawStatus + ")");
}

/**
 * Renders or sends preview of subscription confirmation email for debugging.
 */
function previewSubscriptionEmail() {
  var previewData = {
    orderId: "SUB-DEBUG-1001",
    manageToken: "mockpreviewtoken123",
    cost: "$18.00",
    roast: "The Migrator",
    size: "12oz",
    frequency: "Every 2 Weeks",
    deliveryMethod: "Hand delivery",
    customerEmail: ROASTER_EMAIL
  };
  sendSubscriptionConfirmationEmail(previewData);
}
