/**
 * Yellow Wing Roasters - Subscription Management Web App API
 * Handles authenticated customer lookups/status updates, magic link dispatch, and roaster admin endpoints.
 */

/**
 * Handles Web App GET requests.
 */
function doGet(e) {
  try {
    // 1. Template Preview
    if (e && e.parameter && e.parameter.preview) {
      var previewTpl = HtmlService.createTemplateFromFile('subscription');
      previewTpl.orderId = 1001;
      previewTpl.manageToken = "previewtoken12345";
      previewTpl.customerEmail = "subscriber@example.com";
      previewTpl.roast = "The Migrator";
      previewTpl.size = "12oz";
      previewTpl.frequency = "Every 2 Weeks";
      previewTpl.cost = "$18.00";
      previewTpl.deliveryMethod = "Hand delivery";
      return previewTpl.evaluate();
    }

    // 2. Roaster Admin: Reset Sheet to Pristine Canonical Layout
    if (e && e.parameter && e.parameter.action === 'reset_pristine') {
      var resetAuthParam = (e.parameter.adminHash || e.parameter.adminKey || "").toString().trim();
      if (!isValidAdminKey(resetAuthParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }
      var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      formatPristineSheet(targetSheet);
      return createJsonResponse({
        success: true,
        message: "Sheet reset to pristine canonical layout.",
        headers: CANONICAL_SUBSCRIPTION_HEADERS
      });
    }

    // 3. Roaster Admin: List all subscriptions with authenticated passcode hash
    if (e && e.parameter && (e.parameter.action === 'admin_list' || e.parameter.adminKey || e.parameter.adminHash)) {
      var adminKeyParam = (e.parameter.adminHash || e.parameter.adminKey || "").toString().trim();
      if (!isValidAdminKey(adminKeyParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var adminSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var adminData = adminSheet.getDataRange().getValues();
      if (adminData.length <= 1) {
        return createJsonResponse({ subscriptions: [] });
      }

      var aHeaders = adminData[0];
      var aOrderIdIdx = requireColumnIndex(aHeaders, ["Order ID", "Order #", "Order Number", "orderId"], "adminList");
      var aManageTokenIdx = findColumnIndex(aHeaders, ["Manage Token", "Token", "Secret Token", "manageToken"]);
      var aEmailIdx = requireColumnIndex(aHeaders, ["Email", "Email Address"], "adminList");
      var aTimestampIdx = findColumnIndex(aHeaders, ["Timestamp"]);
      var aNameIdx = findColumnIndex(aHeaders, ["Name", "Customer Name", "Full Name"]);
      var aPhoneIdx = findColumnIndex(aHeaders, ["Phone number", "Phone", "Phone Number"]);
      var aRoastIdx = requireColumnIndex(aHeaders, ["Roast", "Coffee"], "adminList");
      var aSizeIdx = findColumnIndex(aHeaders, ["Size", "Bag Size"]);
      var aFreqIdx = findColumnIndex(aHeaders, ["Frequency"]);
      var aCostIdx = findColumnIndex(aHeaders, ["Price", "Cost", "Total", "Price/period"]);
      var aDeliveryIdx = findColumnIndex(aHeaders, ["Delivery Method", "Delivery"]);
      var aAddressIdx = findColumnIndex(aHeaders, ["Address", "Street address", "Street Address"]);
      var aCityIdx = findColumnIndex(aHeaders, ["City"]);
      var aStateIdx = findColumnIndex(aHeaders, ["State"]);
      var aZipIdx = findColumnIndex(aHeaders, ["ZIP", "Zip Code", "Postal Code"]);
      var aNotesIdx = findColumnIndex(aHeaders, ["Notes", "Special Instructions", "Customer Instructions", "Order Notes", "Special Notes"]);
      var aStatusIdx = requireColumnIndex(aHeaders, ["Status", "Subscription Status"], "adminList");
      var aStatusDetailsIdx = findColumnIndex(aHeaders, ["Status Details", "Notes / Details", "Reason", "Status Note"]);

      var allSubs = [];
      for (var a = 1; a < adminData.length; a++) {
        var aRow = adminData[a];
        var sId = aRow[aOrderIdIdx] ? aRow[aOrderIdIdx].toString().trim() : "";
        var sEmail = aRow[aEmailIdx] ? aRow[aEmailIdx].toString().trim() : "";
        if (!sId && !sEmail) continue;

        var sStatus = (aRow[aStatusIdx] && aRow[aStatusIdx].toString().trim() !== "")
          ? aRow[aStatusIdx].toString().trim()
          : "Active";

        var sStatusDetails = (aStatusDetailsIdx !== -1 && aRow[aStatusDetailsIdx])
          ? aRow[aStatusDetailsIdx].toString().trim()
          : "";

        var sTimestamp = "";
        if (aTimestampIdx !== -1 && aRow[aTimestampIdx]) {
          sTimestamp = aRow[aTimestampIdx] instanceof Date
            ? aRow[aTimestampIdx].toLocaleString()
            : aRow[aTimestampIdx].toString().trim();
        }

        allSubs.push({
          orderId: sId,
          token: aManageTokenIdx !== -1 && aRow[aManageTokenIdx] ? aRow[aManageTokenIdx].toString().trim() : "",
          name: aNameIdx !== -1 && aRow[aNameIdx] ? aRow[aNameIdx].toString().trim() : "Subscriber",
          email: sEmail,
          phone: aPhoneIdx !== -1 && aRow[aPhoneIdx] ? aRow[aPhoneIdx].toString().trim() : "",
          roast: aRow[aRoastIdx] ? aRow[aRoastIdx].toString().trim() : "",
          size: aSizeIdx !== -1 && aRow[aSizeIdx] ? aRow[aSizeIdx].toString().trim() : "",
          frequency: aFreqIdx !== -1 && aRow[aFreqIdx] ? aRow[aFreqIdx].toString().trim() : "",
          cost: aCostIdx !== -1 && aRow[aCostIdx] ? aRow[aCostIdx].toString().trim() : "",
          deliveryMethod: aDeliveryIdx !== -1 && aRow[aDeliveryIdx] ? aRow[aDeliveryIdx].toString().trim() : "Pickup",
          address: aAddressIdx !== -1 && aRow[aAddressIdx] ? aRow[aAddressIdx].toString().trim() : "",
          city: aCityIdx !== -1 && aRow[aCityIdx] ? aRow[aCityIdx].toString().trim() : "",
          state: aStateIdx !== -1 && aRow[aStateIdx] ? aRow[aStateIdx].toString().trim() : "",
          zip: aZipIdx !== -1 && aRow[aZipIdx] ? aRow[aZipIdx].toString().trim() : "",
          notes: aNotesIdx !== -1 && aRow[aNotesIdx] ? aRow[aNotesIdx].toString().trim() : "",
          status: sStatus,
          statusDetails: sStatusDetails,
          timestamp: sTimestamp
        });
      }

      return createJsonResponse({ subscriptions: allSubs });
    }

    // 4. Customer Single Subscription Lookup (Requires orderId + manageToken)
    var orderIdParam = e && e.parameter && e.parameter.orderId ? e.parameter.orderId.toString().trim() : null;
    var tokenParam = e && e.parameter && e.parameter.token ? e.parameter.token.toString().trim() : null;

    if (!orderIdParam || !tokenParam) {
      return createJsonResponse({ error: "Subscription ID and security token are required" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ error: "Subscription not found" });
    }

    var headers = data[0];
    var orderIdIdx = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "doGet");
    var manageTokenIdx = requireColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"], "doGet");
    var emailIdx = requireColumnIndex(headers, ["Email", "Email Address"], "doGet");
    var timestampIdx = findColumnIndex(headers, ["Timestamp"]);
    var nameIdx = findColumnIndex(headers, ["Name", "Customer Name", "Full Name"]);
    var phoneIdx = findColumnIndex(headers, ["Phone number", "Phone", "Phone Number"]);
    var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "doGet");
    var sizeIdx = findColumnIndex(headers, ["Size", "Bag Size"]);
    var freqIdx = findColumnIndex(headers, ["Frequency"]);
    var costIdx = findColumnIndex(headers, ["Price", "Cost", "Total", "Price/period"]);
    var deliveryIdx = findColumnIndex(headers, ["Delivery Method", "Delivery"]);
    var addressIdx = findColumnIndex(headers, ["Address", "Street address", "Street Address"]);
    var cityIdx = findColumnIndex(headers, ["City"]);
    var stateIdx = findColumnIndex(headers, ["State"]);
    var zipIdx = findColumnIndex(headers, ["ZIP", "Zip Code", "Postal Code"]);
    var notesIdx = findColumnIndex(headers, ["Notes", "Special Instructions", "Customer Instructions", "Order Notes", "Special Notes"]);
    var statusIdx = requireColumnIndex(headers, ["Status", "Subscription Status"], "doGet");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]);

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowOrderId = row[orderIdIdx] ? row[orderIdIdx].toString().trim() : "";
      var rowToken = row[manageTokenIdx] ? row[manageTokenIdx].toString().trim() : "";

      if (rowOrderId === orderIdParam && rowToken === tokenParam) {
        var statusVal = (row[statusIdx] && row[statusIdx].toString().trim() !== "")
          ? row[statusIdx].toString().trim()
          : "Active";

        var statusDetailsVal = (statusDetailsIdx !== -1 && row[statusDetailsIdx])
          ? row[statusDetailsIdx].toString().trim()
          : "";

        var timestampVal = "";
        if (timestampIdx !== -1 && row[timestampIdx]) {
          timestampVal = row[timestampIdx] instanceof Date
            ? row[timestampIdx].toLocaleString()
            : row[timestampIdx].toString().trim();
        }

        return createJsonResponse({
          subscription: {
            orderId: rowOrderId,
            token: rowToken,
            name: nameIdx !== -1 && row[nameIdx] ? row[nameIdx].toString().trim() : "Subscriber",
            email: row[emailIdx] || "",
            phone: phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].toString().trim() : "",
            roast: row[roastIdx] ? row[roastIdx].toString().trim() : "",
            size: sizeIdx !== -1 && row[sizeIdx] ? row[sizeIdx].toString().trim() : "",
            frequency: freqIdx !== -1 && row[freqIdx] ? row[freqIdx].toString().trim() : "",
            cost: costIdx !== -1 && row[costIdx] ? row[costIdx].toString().trim() : "",
            deliveryMethod: deliveryIdx !== -1 && row[deliveryIdx] ? row[deliveryIdx].toString().trim() : "Pickup",
            address: addressIdx !== -1 && row[addressIdx] ? row[addressIdx].toString().trim() : "",
            city: cityIdx !== -1 && row[cityIdx] ? row[cityIdx].toString().trim() : "",
            state: stateIdx !== -1 && row[stateIdx] ? row[stateIdx].toString().trim() : "",
            zip: zipIdx !== -1 && row[zipIdx] ? row[zipIdx].toString().trim() : "",
            notes: notesIdx !== -1 && row[notesIdx] ? row[notesIdx].toString().trim() : "",
            status: statusVal,
            statusDetails: statusDetailsVal,
            timestamp: timestampVal
          }
        });
      }
    }

    return createJsonResponse({ error: "Unauthorized: Invalid Subscription ID or Token" });
  } catch (err) {
    console.error("Subscription doGet Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}

/**
 * Handles Web App POST requests (Magic Link, Admin Status Updates, Customer Status Updates).
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

    var action = postData.action;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    var orderIdIdx = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "doPost");
    var manageTokenIdx = requireColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"], "doPost");
    var emailIdx = requireColumnIndex(headers, ["Email", "Email Address"], "doPost");
    var nameIdx = findColumnIndex(headers, ["Name", "Customer Name", "Full Name"]);
    var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "doPost");
    var sizeIdx = findColumnIndex(headers, ["Size", "Bag Size"]);
    var freqIdx = findColumnIndex(headers, ["Frequency"]);
    var costIdx = findColumnIndex(headers, ["Price", "Cost", "Total", "Price/period"]);
    var deliveryIdx = findColumnIndex(headers, ["Delivery Method", "Delivery"]);
    var notesIdx = findColumnIndex(headers, ["Notes", "Special Instructions", "Customer Instructions", "Order Notes", "Special Notes"]);
    var statusIdx = requireColumnIndex(headers, ["Status", "Subscription Status"], "doPost");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]);

    // ACTION 1: REQUEST MAGIC LINK
    if (action === 'request_link') {
      var reqEmail = postData.email ? postData.email.toString().trim().toLowerCase() : "";
      var reqOrderId = postData.orderId ? postData.orderId.toString().trim() : "";

      if (reqEmail) {
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var rowOrderId = row[orderIdIdx] ? row[orderIdIdx].toString().trim() : "";
          var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";

          if (rowEmail === reqEmail && (!reqOrderId || rowOrderId === reqOrderId)) {
            var token = row[manageTokenIdx] ? row[manageTokenIdx].toString().trim() : "";
            if (!token) {
              token = generateSecureToken();
              sheet.getRange(i + 1, manageTokenIdx + 1).setValue(token);
            }

            var currentStatus = (row[statusIdx] && row[statusIdx].toString().trim() !== "")
              ? row[statusIdx].toString().trim()
              : "Active";

            sendSubscriptionMagicLinkEmail({
              orderId: rowOrderId,
              manageToken: token,
              customerEmail: row[emailIdx],
              roast: row[roastIdx] ? row[roastIdx].toString().trim() : "",
              size: sizeIdx !== -1 && row[sizeIdx] ? row[sizeIdx].toString().trim() : "",
              frequency: freqIdx !== -1 && row[freqIdx] ? row[freqIdx].toString().trim() : "",
              status: currentStatus
            });
            break;
          }
        }
      }

      return createJsonResponse({
        success: true,
        message: "If a subscription matches that information, we've emailed a secure link to manage it."
      });
    }

    // ACTION 2: ADMIN UPDATE STATUS (Roaster Passcode Hash Protected)
    if (action === 'admin_update_status') {
      var adminKeyParam = (postData.adminHash || postData.adminKey || "").toString().trim();
      if (!isValidAdminKey(adminKeyParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var adminOrderId = postData.orderId ? postData.orderId.toString().trim() : "";
      var newStatus = postData.status ? postData.status.toString().trim() : "";
      var newStatusDetails = postData.statusDetails !== undefined ? postData.statusDetails.toString().trim() : "";

      if (!adminOrderId || !newStatus) {
        return createJsonResponse({ error: "Missing orderId or status parameter" });
      }

      var adminTargetRow = -1;
      for (var m = 1; m < data.length; m++) {
        var mRow = data[m];
        var mOrderId = mRow[orderIdIdx] ? mRow[orderIdIdx].toString().trim() : "";
        if (mOrderId === adminOrderId) {
          adminTargetRow = m + 1;
          break;
        }
      }

      if (adminTargetRow === -1) {
        return createJsonResponse({ error: "Subscription not found: #" + adminOrderId });
      }

      sheet.getRange(adminTargetRow, statusIdx + 1).setValue(newStatus);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(adminTargetRow, statusDetailsIdx + 1).setValue(newStatusDetails);
      }

      var emailSent = false;
      var notifyCustomer = postData.notifyCustomer === true || postData.notifyCustomer === "true";

      if (notifyCustomer) {
        var updatedRow = data[adminTargetRow - 1];
        var subEmail = updatedRow[emailIdx] ? updatedRow[emailIdx].toString().trim() : "";
        var subToken = updatedRow[manageTokenIdx] ? updatedRow[manageTokenIdx].toString().trim() : "";
        var subRoast = updatedRow[roastIdx] ? updatedRow[roastIdx].toString().trim() : "";
        var subSize = sizeIdx !== -1 && updatedRow[sizeIdx] ? updatedRow[sizeIdx].toString().trim() : "";
        var subFreq = freqIdx !== -1 && updatedRow[freqIdx] ? updatedRow[freqIdx].toString().trim() : "";
        var subCost = costIdx !== -1 && updatedRow[costIdx] ? updatedRow[costIdx].toString().trim() : "";
        var subDelivery = deliveryIdx !== -1 && updatedRow[deliveryIdx] ? updatedRow[deliveryIdx].toString().trim() : "Pickup";

        if (subEmail) {
          sendSubscriptionStatusEmail({
            orderId: adminOrderId,
            manageToken: subToken,
            customerEmail: subEmail,
            roast: subRoast,
            size: subSize,
            frequency: subFreq,
            cost: subCost,
            deliveryMethod: subDelivery,
            status: newStatus,
            statusDetails: newStatusDetails
          });
          emailSent = true;
        }
      }

      return createJsonResponse({
        success: true,
        orderId: adminOrderId,
        status: newStatus,
        statusDetails: newStatusDetails,
        emailSent: emailSent
      });
    }

    // ACTION 3: CUSTOMER SELF-SERVICE STATUS UPDATE (Pause, Resume, Cancel)
    if (action === 'update_status') {
      var targetOrderId = postData.orderId ? postData.orderId.toString().trim() : "";
      var targetToken = postData.token ? postData.token.toString().trim() : "";
      var requestedStatus = postData.status ? postData.status.toString().trim() : "";
      var reasonNote = postData.statusDetails !== undefined
        ? postData.statusDetails.toString().trim()
        : (postData.reason ? postData.reason.toString().trim() : "");

      if (!targetOrderId || !targetToken || !requestedStatus) {
        return createJsonResponse({ error: "Missing orderId, token, or status" });
      }

      var normStatus = requestedStatus.toLowerCase();
      var canonicalStatus = "Active";
      if (normStatus === "paused" || normStatus === "pause") {
        canonicalStatus = "Paused";
      } else if (normStatus === "cancelled" || normStatus === "cancel" || normStatus === "canceled") {
        canonicalStatus = "Cancelled";
      } else if (normStatus === "active" || normStatus === "resume" || normStatus === "resumed") {
        canonicalStatus = "Active";
      } else {
        return createJsonResponse({ error: "Invalid subscription status: " + requestedStatus });
      }

      var targetRowIdx = -1;
      for (var k = 1; k < data.length; k++) {
        var kRow = data[k];
        var kOrderId = kRow[orderIdIdx] ? kRow[orderIdIdx].toString().trim() : "";
        var kToken = kRow[manageTokenIdx] ? kRow[manageTokenIdx].toString().trim() : "";

        if (kOrderId === targetOrderId && kToken === targetToken) {
          targetRowIdx = k + 1;
          break;
        }
      }

      if (targetRowIdx === -1) {
        return createJsonResponse({ error: "Unauthorized: Invalid Subscription ID or Token" });
      }

      var subRowData = data[targetRowIdx - 1];
      var currentSubStatus = subRowData[statusIdx] ? subRowData[statusIdx].toString().trim().toLowerCase() : "active";

      if (currentSubStatus === "cancelled" && canonicalStatus !== "Cancelled") {
        return createJsonResponse({
          error: "Cancelled subscriptions cannot be resumed directly. Please start a new subscription or contact the roaster."
        });
      }

      sheet.getRange(targetRowIdx, statusIdx + 1).setValue(canonicalStatus);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(targetRowIdx, statusDetailsIdx + 1).setValue(reasonNote);
      }

      var customerEmailAddr = subRowData[emailIdx] ? subRowData[emailIdx].toString().trim() : "";
      var customerNameVal = nameIdx !== -1 && subRowData[nameIdx] ? subRowData[nameIdx].toString().trim() : "Subscriber";
      var roastVal = subRowData[roastIdx] ? subRowData[roastIdx].toString().trim() : "";
      var sizeVal = sizeIdx !== -1 && subRowData[sizeIdx] ? subRowData[sizeIdx].toString().trim() : "";
      var freqVal = freqIdx !== -1 && subRowData[freqIdx] ? subRowData[freqIdx].toString().trim() : "";
      var costVal = costIdx !== -1 && subRowData[costIdx] ? subRowData[costIdx].toString().trim() : "";
      var deliveryVal = deliveryIdx !== -1 && subRowData[deliveryIdx] ? subRowData[deliveryIdx].toString().trim() : "Pickup";

      var emailPayload = {
        orderId: targetOrderId,
        manageToken: targetToken,
        customerName: customerNameVal,
        customerEmail: customerEmailAddr,
        roast: roastVal,
        size: sizeVal,
        frequency: freqVal,
        cost: costVal,
        deliveryMethod: deliveryVal,
        status: canonicalStatus,
        statusDetails: reasonNote
      };

      if (customerEmailAddr) {
        sendSubscriptionStatusEmail(emailPayload);
      }
      sendRoasterSubscriptionAlertEmail(emailPayload);

      return createJsonResponse({
        success: true,
        orderId: targetOrderId,
        status: canonicalStatus,
        statusDetails: reasonNote
      });
    }

    return createJsonResponse({ error: "Unsupported POST action: " + action });
  } catch (err) {
    console.error("Subscription doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}
