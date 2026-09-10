// 1. GET Request: Lookup subscription status
function doGet(e) {
  var email = e.parameter.email;
  if (!email) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Email parameter required" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  // Find column indices
  var emailIdx = headers.indexOf("Email");
  var timestampIdx = headers.indexOf("Timestamp");
  var statusIdx = headers.indexOf("Status");
  var roastIdx = headers.indexOf("Roast");
  var sizeIdx = headers.indexOf("Size");
  var freqIdx = headers.indexOf("Frequency");
  
  if (emailIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Email column not found in sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Group latest record by Roast name (Compound key is Email + Roast)
  var subscriptionsMap = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";
    if (rowEmail === email.trim().toLowerCase()) {
      var roastName = roastIdx !== -1 ? row[roastIdx].toString().trim() : "Unknown Subscription";
      if (!roastName) continue;
      
      var existing = subscriptionsMap[roastName] || {};
      
      // Determine status (default to Active if blank)
      var statusValue = "Active";
      if (statusIdx !== -1 && row[statusIdx] !== null && row[statusIdx].toString().trim() !== "") {
        statusValue = row[statusIdx].toString().trim();
      } else if (existing.status) {
        statusValue = existing.status;
      }
      
      // Merge: preserve Size and Frequency from older entries if not present in the current row
      var sizeValue = (sizeIdx !== -1 && row[sizeIdx] !== null && row[sizeIdx].toString().trim() !== "")
                      ? row[sizeIdx].toString().trim()
                      : (existing.size || "12oz");
                      
      var freqValue = (freqIdx !== -1 && row[freqIdx] !== null && row[freqIdx].toString().trim() !== "")
                      ? row[freqIdx].toString().trim()
                      : (existing.frequency || "Monthly");
      
      subscriptionsMap[roastName] = {
        roast: roastName,
        size: sizeValue,
        frequency: freqValue,
        timestamp: timestampIdx !== -1 ? row[timestampIdx] : "",
        status: statusValue
      };
    }
  }
  
  // Convert map to array
  var userSubscriptions = [];
  for (var key in subscriptionsMap) {
    userSubscriptions.push(subscriptionsMap[key]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ subscriptions: userSubscriptions }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 2. POST Request: Direct status updates (in-place)
function doPost(e) {
  var postData;
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    postData = e.parameter;
  }
  
  var email = postData.email;
  var roast = postData.roast;
  var status = postData.status;
  var statusDetails = postData.statusDetails || "";
  
  if (!email || !roast || !status) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing email, roast, or status parameters" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  var emailIdx = headers.indexOf("Email");
  var statusIdx = headers.indexOf("Status");
  var statusDetailsIdx = headers.indexOf("Status Details");
  var roastIdx = headers.indexOf("Roast");
  
  if (emailIdx === -1 || statusIdx === -1 || roastIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Required columns not found in sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var updated = false;
  // Scan backwards to update the latest matching entry
  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";
    var rowRoast = row[roastIdx] ? row[roastIdx].toString().trim() : "";
    
    if (rowEmail === email.trim().toLowerCase() && rowRoast.toLowerCase() === roast.trim().toLowerCase()) {
      sheet.getRange(i + 1, statusIdx + 1).setValue(status);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(i + 1, statusDetailsIdx + 1).setValue(statusDetails);
      }
      updated = true;

      // Gmail notification alert
      try {
        GmailApp.sendEmail(
          "chirp@yellowwingroasters.com",
          "Subscription Status Update: " + roast + " (" + status + ")",
          "A subscription status update has occurred:\n\n" +
          "• Customer Email: " + email + "\n" +
          "• Subscription: " + roast + "\n" +
          "• New Status: " + status + "\n" +
          "• Details: " + (statusDetails ? statusDetails : "None provided") + "\n\n" +
          "Link to Master Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
        );
      } catch (mailErr) {
        Logger.log("Gmail notification failed: " + mailErr.toString());
      }
      
      break;
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: updated }))
    .setMimeType(ContentService.MimeType.JSON);
}
