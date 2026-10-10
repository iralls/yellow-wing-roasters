/**
 * Yellow Wing Roasters - Digital Gift Card Form Submission Trigger
 */

/**
 * Automatically executed on Form Submission to register the new gift code in ActiveCodes and email parties.
 */
function handleFormSubmit(e) {
  if (!e || !e.namedValues) {
    throw new Error("handleFormSubmit: Missing event namedValues object. Ensure an installable onFormSubmit trigger is configured.");
  }

  var rawAmount = getFieldByPattern(e.namedValues, /gift\s*code\s*amount|gift\s*card\s*amount|gift\s*card\s*value|amount/i);
  var rawCode = getFieldByPattern(e.namedValues, /gift\s*code|gift\s*card\s*code|code/i);

  if (!rawCode) {
    throw new Error("handleFormSubmit: Gift Code is missing from form submission namedValues: " + JSON.stringify(e.namedValues));
  }

  var amountVal = parseFloat(rawAmount);
  if (isNaN(amountVal) || amountVal <= 0) {
    throw new Error("handleFormSubmit: Invalid Gift Code Amount [" + rawAmount + "] in form submission.");
  }

  var giftCode = rawCode.toUpperCase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeCodesSheet = ss.getSheetByName("ActiveCodes") || ss.getActiveSheet();

  var lastCol = activeCodesSheet.getLastColumn();
  if (lastCol === 0) {
    // Initial empty sheet header initialization
    activeCodesSheet.appendRow(["Code", "Type", "Value", "StartDate", "EndDate", "Description"]);
    lastCol = activeCodesSheet.getLastColumn();
  }

  var headers = activeCodesSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var codeCol = requireColumnIndex(headers, ["code", "gift code", "gift card code"], "handleFormSubmit") + 1;
  var valueCol = requireColumnIndex(headers, ["value", "amount", "balance"], "handleFormSubmit") + 1;
  var typeCol = findColumnIndex(headers, ["type", "discount type"]) + 1;
  var descCol = findColumnIndex(headers, ["description", "notes"]) + 1;

  var newRow = activeCodesSheet.getLastRow() + 1;
  activeCodesSheet.getRange(newRow, codeCol).setValue(giftCode);
  activeCodesSheet.getRange(newRow, valueCol).setValue(amountVal);
  if (typeCol > 0) activeCodesSheet.getRange(newRow, typeCol).setValue("flat");
  if (descCol > 0) activeCodesSheet.getRange(newRow, descCol).setValue("Registered via Form Submission Trigger");

  console.log("Successfully registered gift card: " + giftCode + " with balance $" + amountVal);

  // Send confirmation emails
  sendGiftEmails(e.namedValues, giftCode, amountVal);
}
