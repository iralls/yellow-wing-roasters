/**
 * Yellow Wing Roasters - Gift Subscriptions Email Dispatcher
 */

/**
 * Retrieves the logo thumbnail blob safely for inline embedding.
 * Throws an informative error if the Drive file cannot be found or rendered.
 */
function getLogoBlob() {
  var file;
  try {
    file = DriveApp.getFileById(LOGO_IMAGE_FILE_ID);
  } catch (err) {
    throw new Error("getLogoBlob: Unable to locate Drive file ID [" + LOGO_IMAGE_FILE_ID + "]: " + err.message);
  }

  var resizedBlob = file.getThumbnail();
  if (!resizedBlob) {
    throw new Error("getLogoBlob: Unable to retrieve thumbnail for Drive file [" + LOGO_IMAGE_FILE_ID + "]. Ensure it is a valid image.");
  }

  resizedBlob.setName("myResizedImage");
  return resizedBlob;
}

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
  template.size = data.size;
  template.duration = data.duration;
  template.frequency = data.frequency;
  template.deliveryMethod = data.deliveryMethod;
  template.cost = data.cost;

  var htmlBody = template.evaluate().getContent();
  var logoBlob = getLogoBlob();

  GmailApp.sendEmail(
    data.purchaserEmail,
    "Yellow Wing Roasters Gift Subscription Confirmation (" + data.orderId + ")",
    "Thanks for your gift order! Your order number is " + data.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: htmlBody,
      inlineImages: { myResizedImage: logoBlob }
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
  template.size = data.size;
  template.duration = data.duration;
  template.frequency = data.frequency;
  template.deliveryMethod = data.deliveryMethod;

  var htmlBody = template.evaluate().getContent();
  var logoBlob = getLogoBlob();

  GmailApp.sendEmail(
    data.recipientEmail,
    "You've received a coffee gift from " + (data.purchaserName || "a friend") + "!",
    "Hi " + (data.recipientName || "there") + "! " + (data.purchaserName || "A friend") + " sent you a coffee gift from Yellow Wing Roasters!",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: htmlBody,
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Sent gift announcement to recipient: " + data.recipientEmail + " (#" + data.orderId + ")");
}
