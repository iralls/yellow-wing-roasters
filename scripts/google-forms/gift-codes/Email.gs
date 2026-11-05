/**
 * Yellow Wing Roasters - Digital Gift Card Email Dispatcher
 */

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

  GmailApp.sendEmail(
    data.purchaserEmail,
    "Yellow Wing Roasters Gift Card Purchase Confirmed",
    "Thanks for your digital gift card purchase! The code is " + data.giftCode + ".",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: purchaserTemplate.evaluate().getContent()
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

  GmailApp.sendEmail(
    data.recipientEmail,
    "A Digital Gift Card from " + (data.purchaserName || "a friend") + "!",
    "You have received a $" + data.amount + " digital gift card from " + (data.purchaserName || "a friend") + "!",
    {
      name: "Yellow Wing Roasters",
      from: ROASTER_EMAIL,
      htmlBody: recipientTemplate.evaluate().getContent()
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
