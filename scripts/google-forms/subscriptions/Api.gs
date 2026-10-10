/**
 * Yellow Wing Roasters - Subscription Web App API
 * Serves GET (lookup subscriptions by customer email) and POST (status updates: pause, resume, cancel).
 */

/**
 * Handles Web App GET requests.
 * Supports:
 * - ?preview=true : Preview confirmation email template
 * - ?email=subscriber@example.com : Fetch all active/paused/cancelled subscriptions for an email
 */
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.preview) {
      return previewSubscriptionEmail();
    }

    var email = e && e.parameter ? e.parameter.email : null;
    if (!email || email.trim() === "") {
      return createJsonResponse({ error: "Email parameter required" });
    }

    var cleanEmail = email.trim().toLowerCase();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ subscriptions: [] });
    }

    var headers = data[0];
    var emailIdx = requireColumnIndex(headers, ["Email", "Email Address"], "doGet");
    var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "doGet");
    var timestampIdx = findColumnIndex(headers, ["Timestamp"]);
    var statusIdx = findColumnIndex(headers, ["Status", "Subscription Status"]);
    var sizeIdx = findColumnIndex(headers, ["Size", "Bag Size"]);
    var freqIdx = findColumnIndex(headers, ["Frequency"]);

    // Compound map grouped by Roast name (latest row per roast)
    var subscriptionsMap = {};

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";
      if (rowEmail === cleanEmail) {
        var roastName = row[roastIdx] ? row[roastIdx].toString().trim() : "";
        if (!roastName) continue;

        var existing = subscriptionsMap[roastName] || {};

        var statusValue = "Active";
        if (statusIdx !== -1 && row[statusIdx] !== null && row[statusIdx].toString().trim() !== "") {
          statusValue = row[statusIdx].toString().trim();
        } else if (existing.status) {
          statusValue = existing.status;
        }

        var sizeValue = (sizeIdx !== -1 && row[sizeIdx] !== null && row[sizeIdx].toString().trim() !== "")
          ? row[sizeIdx].toString().trim()
          : (existing.size || "");

        var freqValue = (freqIdx !== -1 && row[freqIdx] !== null && row[freqIdx].toString().trim() !== "")
          ? row[freqIdx].toString().trim()
          : (existing.frequency || "");

        subscriptionsMap[roastName] = {
          roast: roastName,
          size: sizeValue,
          frequency: freqValue,
          timestamp: timestampIdx !== -1 ? row[timestampIdx] : "",
          status: statusValue
        };
      }
    }

    var userSubscriptions = [];
    for (var key in subscriptionsMap) {
      userSubscriptions.push(subscriptionsMap[key]);
    }

    return createJsonResponse({ subscriptions: userSubscriptions });
  } catch (err) {
    console.error("Subscription doGet Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}

/**
 * Handles Web App POST requests for subscription status updates (Pause, Resume, Cancel).
 */
function doPost(e) {
  try {
    var postData;
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      postData = e.parameter;
    }

    if (!postData) {
      return createJsonResponse({ error: "Missing POST request body" });
    }

    var email = postData.email ? postData.email.toString().trim() : "";
    var roast = postData.roast ? postData.roast.toString().trim() : "";
    var status = postData.status ? postData.status.toString().trim() : "";
    var statusDetails = postData.statusDetails ? postData.statusDetails.toString().trim() : "";

    if (!email || !roast || !status) {
      return createJsonResponse({ error: "Missing email, roast, or status parameters" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    var emailIdx = requireColumnIndex(headers, ["Email", "Email Address"], "doPost");
    var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "doPost");
    var statusIdx = requireColumnIndex(headers, ["Status", "Subscription Status"], "doPost");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason"]);

    var updated = false;
    var cleanEmail = email.toLowerCase();
    var cleanRoast = roast.toLowerCase();

    // Scan backwards from most recent row to update current record
    for (var i = data.length - 1; i >= 1; i--) {
      var row = data[i];
      var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";
      var rowRoast = row[roastIdx] ? row[roastIdx].toString().trim().toLowerCase() : "";

      if (rowEmail === cleanEmail && rowRoast === cleanRoast) {
        sheet.getRange(i + 1, statusIdx + 1).setValue(status);
        if (statusDetailsIdx !== -1) {
          sheet.getRange(i + 1, statusDetailsIdx + 1).setValue(statusDetails);
        }
        updated = true;
        break;
      }
    }

    if (!updated) {
      return createJsonResponse({ error: "Subscription not found for " + email + " and roast: " + roast });
    }

    return createJsonResponse({
      success: true,
      email: email,
      roast: roast,
      status: status
    });
  } catch (err) {
    console.error("Subscription doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}
