/**
 * Yellow Wing Roasters - Gift Subscriptions Email Dispatcher
 */

/**
 * Sends purchase and billing confirmation receipt to the gift purchaser.
 */
function sendPurchaserConfirmation(data) {
  var template = getTemplate('purchaser-confirmation');
  template.orderId = data.orderId;
  template.purchaserName = data.purchaserName;
  template.recipientName = data.recipientName;
  template.recipientEmail = data.recipientEmail;
  template.roast = data.roast;
  template.size = data.size || "12oz";
  template.duration = data.duration;
  template.frequency = data.frequency || "Monthly";
  template.deliveryMethod = data.deliveryMethod || "Hand delivery";
  template.cost = data.cost;

  var htmlBody = template.evaluate().getContent();

  GmailApp.sendEmail(
    data.purchaserEmail,
    "Yellow Wing Roasters Gift Subscription Confirmation (" + data.orderId + ")",
    "Thanks for your gift order! Your order number is " + data.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      bcc: ROASTER_EMAIL,
      replyTo: data.purchaserEmail,
      htmlBody: htmlBody
    }
  );
  console.log("Sent confirmation receipt to purchaser: " + data.purchaserEmail + " (#" + data.orderId + ")");
}

/**
 * Sends branded gift announcement to the recipient (prices omitted).
 */
function sendRecipientAnnouncement(data) {
  if (!data.recipientEmail) {
    console.log("sendRecipientAnnouncement: No recipient email provided. Skipping recipient notification.");
    return;
  }

  var template = getTemplate('recipient-announcement');
  template.orderId = data.orderId;
  template.purchaserName = data.purchaserName;
  template.recipientName = data.recipientName;
  template.giftMessage = data.giftMessage;
  template.roast = data.roast;
  template.size = data.size || "12oz";
  template.duration = data.duration;
  template.frequency = data.frequency || "Monthly";
  template.deliveryMethod = data.deliveryMethod || "Hand delivery";

  var htmlBody = template.evaluate().getContent();

  GmailApp.sendEmail(
    data.recipientEmail,
    "You've received a coffee gift from " + (data.purchaserName || "a friend") + "!",
    "Hi " + (data.recipientName || "there") + "! " + (data.purchaserName || "A friend") + " sent you a coffee gift from Yellow Wing Roasters!",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      replyTo: ROASTER_EMAIL,
      htmlBody: htmlBody
    }
  );
  console.log("Sent gift announcement to recipient: " + data.recipientEmail + " (#" + data.orderId + ")");
}

/**
 * Sends branded status update email to either recipient (no prices) or purchaser (with total).
 */
function sendGiftSubscriptionStatusEmail(data, isRecipient) {
  var rawStatus = (data.status || "Active").toString().trim();
  var lowerStatus = rawStatus.toLowerCase();
  var statusConfig = GIFT_SUB_STATUS_CONFIGS[lowerStatus] || {
    badgeClass: 'status-active',
    title: 'Gift Subscription Update',
    recipientMessage: "Here is the latest update on your Yellow Wing Roasters coffee gift:",
    purchaserMessage: "Here is the latest update on the gift subscription you ordered:",
    detailsLabel: 'Update Note',
    subject: function (id) { return "Update on your Yellow Wing Roasters coffee gift (#" + id + ")"; }
  };

  var targetEmail = isRecipient ? data.recipientEmail : data.purchaserEmail;
  if (!targetEmail) {
    console.warn("sendGiftSubscriptionStatusEmail: Target email missing for " + (isRecipient ? "recipient" : "purchaser"));
    return;
  }

  var subject = statusConfig.subject(data.orderId);
  var template = getTemplate('gift-subscription-status-update-template');
  template.orderId = data.orderId;
  template.isPurchaser = !isRecipient;
  template.purchaserName = data.purchaserName;
  template.recipientName = data.recipientName;
  template.roast = data.roast;
  template.size = data.size || "12oz";
  template.duration = data.duration;
  template.deliveryMethod = data.deliveryMethod || "Hand delivery";
  template.cost = data.cost || "";
  template.giftMessage = data.giftMessage || "";
  template.status = rawStatus;
  template.statusTitle = statusConfig.title;
  template.statusMessage = isRecipient ? statusConfig.recipientMessage : statusConfig.purchaserMessage;
  template.statusDetails = data.statusDetails || "";
  template.detailsLabel = statusConfig.detailsLabel;

  var mailOptions = {
    name: "Yellow Wing Roasters",
    from: ROASTER_EMAIL,
    replyTo: ROASTER_EMAIL,
    htmlBody: template.evaluate().getContent()
  };

  // BCC Roaster if sending to purchaser
  if (!isRecipient) {
    mailOptions.bcc = ROASTER_EMAIL;
  }

  GmailApp.sendEmail(
    targetEmail,
    subject,
    statusConfig.title + " - Gift Order #" + data.orderId + ": " + (isRecipient ? statusConfig.recipientMessage : statusConfig.purchaserMessage),
    mailOptions
  );

  console.log("Gift subscription status email (" + rawStatus + ") sent to " + (isRecipient ? "recipient: " : "purchaser: ") + targetEmail + " (#" + data.orderId + ")");
}
