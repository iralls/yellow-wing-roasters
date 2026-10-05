/**
 * Yellow Wing Roasters — Gift Subscriptions Google Apps Script
 *
 * Attached to the dedicated Gift Subscriptions Google Form response sheet.
 * Handles:
 * 1. Sequential Order ID generation.
 * 2. Sending purchase & billing confirmation to the Purchaser.
 * 3. Sending branded gift announcement to the Recipient (prices omitted).
 * 4. (Optional) Syncing the Recipient's delivery row directly into the master Subscriptions sheet.
 */

function doGet(e) {
  var imageFileId = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3';
  var file = DriveApp.getFileById(imageFileId);
  var resizedBlob = file.getThumbnail();
  if (!resizedBlob) throw new Error("Unable to retrieve thumbnail image.");
  resizedBlob.setName("myResizedImage");

  var isRecipientPreview = (e && e.parameter && e.parameter.preview === 'recipient');
  var orderId = "YWR-1234-PREVIEW";

  if (isRecipientPreview) {
    var recTemplate = getTemplate('recipient-announcement');
    recTemplate.orderId = orderId;
    recTemplate.purchaserName = "Jane Doe";
    recTemplate.recipientName = "Alex Smith";
    recTemplate.giftMessage = "Happy Birthday! Hope you love this coffee as much as I do.";
    recTemplate.roast = "Early Bird";
    recTemplate.size = "12oz";
    recTemplate.duration = "3 months";
    recTemplate.frequency = "Monthly";
    recTemplate.deliveryMethod = "Hand delivery";
    return recTemplate.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var purTemplate = getTemplate('purchaser-confirmation');
  purTemplate.orderId = orderId;
  purTemplate.purchaserName = "Jane Doe";
  purTemplate.recipientName = "Alex Smith";
  purTemplate.recipientEmail = "alex@example.com";
  purTemplate.roast = "Early Bird";
  purTemplate.size = "12oz";
  purTemplate.duration = "3 months";
  purTemplate.frequency = "Monthly";
  purTemplate.deliveryMethod = "Hand delivery";
  purTemplate.cost = "$45";
  return purTemplate.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();

  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var orderIdColumn = headers.indexOf("Order ID") + 1;

  var startId = 1000;
  var orderId = startId + row - 1;
  sheet.getRange(row, orderIdColumn).setValue(orderId);

  // Direct lookups from namedValues — zero string parsing!
  var purchaserName = getField(e, ['Purchaser Name', 'Your Name', "Purchaser's Name"]);
  var purchaserEmail = getField(e, ['Purchaser Email', "Purchaser's Email", 'Your Email', 'Your Email Address', 'Email']);
  var recipientName = getField(e, ['Recipient Name', "Recipient's Name", 'Recipient']);
  var recipientEmail = getField(e, ['Recipient Email', "Recipient's Email"]);
  var roast = getField(e, ['Roast', 'Coffee']);
  var size = getField(e, ['Size', 'Bag Size']) || '12oz';
  var duration = getField(e, ['Duration', 'Gift Duration']) || 'One-time';
  var frequency = getField(e, ['Frequency']) || 'Monthly';
  var cost = getField(e, ['Total Price', 'Price', 'Total', 'Total Amount']);
  var deliveryMethod = getField(e, ['Delivery Method']) || 'Hand delivery';
  var giftMessage = getField(e, ['Gift Message']);
  var notes = getField(e, ['Notes', 'Additional Delivery Notes']);
  var street = getField(e, ['Street address', 'Street Address', 'Address']);
  var city = getField(e, ['City']);
  var state = getField(e, ['State']);
  var zip = getField(e, ['ZIP', 'Zip Code', 'Zip']);

  console.log("GIFT SUBMISSION: Order ID=" + orderId + ", Purchaser=" + purchaserEmail + ", Recipient=" + recipientEmail);
  if (!purchaserEmail) {
    console.warn("Purchaser email is empty! Available namedValues: " + (e && e.namedValues ? Object.keys(e.namedValues).join(', ') : 'none'));
  }

  var imageFileId = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3';
  var file = DriveApp.getFileById(imageFileId);
  var resizedBlob = file.getThumbnail();
  if (!resizedBlob) throw new Error("Unable to retrieve thumbnail image.");
  resizedBlob.setName("myResizedImage");

  // 1. Send Order Confirmation Receipt to Purchaser
  if (purchaserEmail) {
    try {
      var purTemplate = getTemplate('purchaser-confirmation');
      purTemplate.orderId = orderId;
      purTemplate.purchaserName = purchaserName || 'Friend';
      purTemplate.recipientName = recipientName || 'Friend';
      purTemplate.recipientEmail = recipientEmail;
      purTemplate.roast = roast;
      purTemplate.size = size;
      purTemplate.duration = duration;
      purTemplate.frequency = frequency;
      purTemplate.deliveryMethod = deliveryMethod;
      purTemplate.cost = cost;

      var purHtml = purTemplate.evaluate().getContent();

      GmailApp.sendEmail(
        purchaserEmail,
        `Yellow Wing Roasters Gift Subscription Confirmation (${orderId})`,
        `Thanks for your gift order! Your order number is ${orderId}`,
        {
          name: "Yellow Wing Roasters",
          from: 'orders@yellowwingroasters.com',
          htmlBody: purHtml,
          inlineImages: { myResizedImage: resizedBlob }
        }
      );
      console.log("Sent confirmation receipt to purchaser: " + purchaserEmail);
    } catch (purErr) {
      console.error("Failed to email purchaser: " + purErr.toString());
    }
  }

  // 2. Send Gift Announcement to Recipient (no prices)
  if (recipientEmail) {
    try {
      var recTemplate = getTemplate('recipient-announcement');
      recTemplate.orderId = orderId;
      recTemplate.purchaserName = purchaserName || 'A friend';
      recTemplate.recipientName = recipientName || 'Friend';
      recTemplate.giftMessage = giftMessage;
      recTemplate.roast = roast;
      recTemplate.size = size;
      recTemplate.duration = duration;
      recTemplate.frequency = frequency;
      recTemplate.deliveryMethod = deliveryMethod;

      var recHtml = recTemplate.evaluate().getContent();

      GmailApp.sendEmail(
        recipientEmail,
        `You've received a coffee gift from ${purchaserName || 'a friend'}!`,
        `Hi ${recipientName || 'there'}! ${purchaserName || 'A friend'} sent you a coffee gift from Yellow Wing Roasters!`,
        {
          name: "Yellow Wing Roasters",
          from: 'orders@yellowwingroasters.com',
          htmlBody: recHtml,
          inlineImages: { myResizedImage: resizedBlob }
        }
      );
      console.log("Sent gift announcement to recipient: " + recipientEmail);
    } catch (recErr) {
      console.error("Failed to email recipient: " + recErr.toString());
    }
  }
}

function getTemplate(filename) {
  try {
    return HtmlService.createTemplateFromFile(filename);
  } catch (e) {
    return HtmlService.createTemplateFromFile(filename + '.html');
  }
}

function getField(e, possibleNames) {
  if (!e || !e.namedValues) return '';
  // 1. Exact match
  for (var i = 0; i < possibleNames.length; i++) {
    var val = e.namedValues[possibleNames[i]];
    if (val && val[0]) return val[0].toString().trim();
  }
  // 2. Case-insensitive and normalized fallback
  var keys = Object.keys(e.namedValues);
  for (var j = 0; j < possibleNames.length; j++) {
    var target = possibleNames[j].toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var k = 0; k < keys.length; k++) {
      var normKey = keys[k].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normKey === target) {
        var v = e.namedValues[keys[k]];
        if (v && v[0]) return v[0].toString().trim();
      }
    }
  }
  return '';
}
