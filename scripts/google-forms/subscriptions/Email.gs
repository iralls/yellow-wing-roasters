/**
 * Yellow Wing Roasters - Subscription Email Dispatcher
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
  var logoBlob = getLogoBlob();

  GmailApp.sendEmail(
    orderData.customerEmail,
    "Yellow Wing Roasters Subscription Confirmation (" + orderData.orderId + ")",
    "Thanks for your order! Your subscription order number is " + orderData.orderId + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: htmlBody,
      inlineImages: {
        myResizedImage: logoBlob
      }
    }
  );
  console.log("Subscription confirmation successfully sent to " + orderData.customerEmail + " (#" + orderData.orderId + ")");
}

/**
 * Renders or sends preview of subscription confirmation email for debugging.
 */
function previewSubscriptionEmail() {
  var template = HtmlService.createTemplateFromFile('subscription');
  template.orderId = "YWR-1234-PREVIEW";
  template.customerName = "Jane Doe";
  template.cost = "$24.00";
  template.roast = "Early Bird";
  template.size = "12oz";
  template.frequency = "Monthly";
  template.deliveryMethod = "Hand Delivery";

  return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
