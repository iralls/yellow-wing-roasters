/**
 * Yellow Wing Roasters - Gift Subscriptions Web App API
 * Serves doGet for template previewing and debugging.
 */

function doGet(e) {
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
