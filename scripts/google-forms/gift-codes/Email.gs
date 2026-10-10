/**
 * Yellow Wing Roasters - Digital Gift Card Email Dispatcher
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
 * Sends purchase confirmation receipt to the gift card buyer.
 */
function sendPurchaserEmail(data) {
  var purchaserTemplate = HtmlService.createTemplateFromFile('purchaser-template');
  purchaserTemplate.purchaserName = data.purchaserName;
  purchaserTemplate.recipientName = data.recipientName;
  purchaserTemplate.recipientEmail = data.recipientEmail;
  purchaserTemplate.giftCode = data.giftCode;
  purchaserTemplate.amount = data.amount;

  var logoBlob = getLogoBlob();
  GmailApp.sendEmail(
    data.purchaserEmail,
    "Yellow Wing Roasters Gift Card Purchase Confirmed",
    "Thanks for your digital gift card purchase! The code is " + data.giftCode + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: purchaserTemplate.evaluate().getContent(),
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Successfully sent Purchaser Email to: " + data.purchaserEmail);
}

/**
 * Sends digital gift card announcement directly to the recipient.
 */
function sendRecipientEmail(data) {
  if (!data.recipientEmail) {
    console.log("sendRecipientEmail: No recipient email provided. Skipping recipient notification.");
    return;
  }

  var recipientTemplate = HtmlService.createTemplateFromFile('recipient-template');
  recipientTemplate.purchaserName = data.purchaserName;
  recipientTemplate.recipientName = data.recipientName;
  recipientTemplate.giftCode = data.giftCode;
  recipientTemplate.amount = data.amount;
  recipientTemplate.giftMessage = data.giftMessage;

  var logoBlob = getLogoBlob();
  GmailApp.sendEmail(
    data.recipientEmail,
    "A Digital Gift Card from " + (data.purchaserName || "a friend") + "!",
    "You have received a $" + data.amount + " digital gift card from " + (data.purchaserName || "a friend") + "!",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: recipientTemplate.evaluate().getContent(),
      inlineImages: { myResizedImage: logoBlob }
    }
  );
  console.log("Successfully sent Recipient Email to: " + data.recipientEmail);
}

/**
 * Extracts parameters and triggers both purchaser and recipient emails.
 */
function sendGiftEmails(namedValues, giftCode, amountVal) {
  var purchaserName = getFieldByPattern(namedValues, /purchaser.*name|your.*name|^name/i);
  var purchaserEmail = getFieldByPattern(namedValues, /purchaser.*email|your.*email|^email/i);
  var recipientName = getFieldByPattern(namedValues, /recipient.*name/i);
  var recipientEmail = getFieldByPattern(namedValues, /recipient.*email/i);
  var giftMessage = getFieldByPattern(namedValues, /message/i);

  if (!purchaserEmail) {
    throw new Error("sendGiftEmails: Purchaser email is missing from form submission namedValues.");
  }

  var emailData = {
    purchaserName: purchaserName,
    purchaserEmail: purchaserEmail,
    recipientName: recipientName,
    recipientEmail: recipientEmail,
    giftCode: giftCode,
    amount: amountVal,
    giftMessage: giftMessage
  };

  sendPurchaserEmail(emailData);
  if (recipientEmail) {
    sendRecipientEmail(emailData);
  }
}
