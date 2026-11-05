/**
 * Yellow Wing Roasters - Gift Subscriptions Web App API
 * Handles authenticated roaster admin listing, status updates with email dispatch, and email resending.
 */

/**
 * Handles Web App GET requests.
 */
function doGet(e) {
  try {
    // 1. Template Previews
    if (e && e.parameter && e.parameter.preview) {
      var isRecipientPreview = (e.parameter.preview === 'recipient');
      var isStatusPreview = (e.parameter.preview === 'status');
      var orderId = "1001";

      if (isStatusPreview) {
        var statusTpl = getTemplate('gift-subscription-status-update-template');
        statusTpl.orderId = orderId;
        statusTpl.isPurchaser = (e.parameter.for === 'purchaser');
        statusTpl.purchaserName = "Jane Doe";
        statusTpl.recipientName = "Alex Smith";
        statusTpl.roast = "The Migrator";
        statusTpl.size = "12oz";
        statusTpl.duration = "3 months";
        statusTpl.deliveryMethod = "Hand delivery";
        statusTpl.cost = "$54";
        statusTpl.giftMessage = "Happy Birthday! Hope you love this coffee.";
        statusTpl.status = "Roasted";
        statusTpl.statusTitle = "Freshly Roasted!";
        statusTpl.statusMessage = statusTpl.isPurchaser
          ? "The beans for this gift subscription have just been roasted fresh."
          : "Fresh off the roaster! Your gift coffee beans have just dropped from the burner and are beginning to degas.";
        statusTpl.statusDetails = "Roasted batch #42. Scheduled for delivery tomorrow afternoon.";
        statusTpl.detailsLabel = "Roaster Note";
        return statusTpl.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }

      if (isRecipientPreview) {
        var recTemplate = getTemplate('recipient-announcement');
        recTemplate.orderId = orderId;
        recTemplate.purchaserName = "Jane Doe";
        recTemplate.recipientName = "Alex Smith";
        recTemplate.giftMessage = "Happy Birthday! Hope you love this coffee as much as I do.";
        recTemplate.roast = "The Migrator";
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
      purTemplate.roast = "The Migrator";
      purTemplate.size = "12oz";
      purTemplate.duration = "3 months";
      purTemplate.frequency = "Monthly";
      purTemplate.deliveryMethod = "Hand delivery";
      purTemplate.cost = "$54";
      return purTemplate.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
        headers: CANONICAL_GIFT_SUB_HEADERS
      });
    }

    // 3. Roaster Admin: List all gift subscriptions
    if (e && e.parameter && (e.parameter.action === 'admin_list' || e.parameter.adminKey || e.parameter.adminHash)) {
      var adminKeyParam = (e.parameter.adminHash || e.parameter.adminKey || "").toString().trim();
      if (!isValidAdminKey(adminKeyParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ giftSubscriptions: [] });
      }

      var headers = data[0];
      var orderIdIdx = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "adminList");
      var timeIdx = findColumnIndex(headers, ["Timestamp"]);
      var pNameIdx = findColumnIndex(headers, ["Purchaser Name", "Your Name", "Purchaser"]);
      var pEmailIdx = requireColumnIndex(headers, ["Purchaser Email", "Your Email", "Email"], "adminList");
      var rNameIdx = findColumnIndex(headers, ["Recipient Name", "Recipient"]);
      var rEmailIdx = findColumnIndex(headers, ["Recipient Email"]);
      var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "adminList");
      var durationIdx = findColumnIndex(headers, ["Duration", "Gift Duration"]);
      var costIdx = findColumnIndex(headers, ["Total Price", "Price", "Cost", "Total"]);
      var msgIdx = findColumnIndex(headers, ["Gift Message", "Message"]);
      var notesIdx = findColumnIndex(headers, ["Notes", "Additional Delivery Notes", "Special Instructions"]);
      var statusIdx = requireColumnIndex(headers, ["Status", "Order Status", "Gift Status"], "adminList");
      var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]);

      var allGifts = [];
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var id = row[orderIdIdx] ? row[orderIdIdx].toString().trim() : "";
        var pEmail = row[pEmailIdx] ? row[pEmailIdx].toString().trim() : "";
        if (!id && !pEmail) continue;

        var statusVal = (row[statusIdx] && row[statusIdx].toString().trim() !== "")
          ? row[statusIdx].toString().trim()
          : "Active";

        var statusDetailsVal = (statusDetailsIdx !== -1 && row[statusDetailsIdx])
          ? row[statusDetailsIdx].toString().trim()
          : "";

        var tsStr = "";
        if (timeIdx !== -1 && row[timeIdx]) {
          tsStr = row[timeIdx] instanceof Date ? row[timeIdx].toLocaleString() : row[timeIdx].toString().trim();
        }

        allGifts.push({
          orderId: id,
          timestamp: tsStr,
          purchaserName: pNameIdx !== -1 && row[pNameIdx] ? row[pNameIdx].toString().trim() : "",
          purchaserEmail: pEmail,
          recipientName: rNameIdx !== -1 && row[rNameIdx] ? row[rNameIdx].toString().trim() : "",
          recipientEmail: rEmailIdx !== -1 && row[rEmailIdx] ? row[rEmailIdx].toString().trim() : "",
          roast: row[roastIdx] ? row[roastIdx].toString().trim() : "",
          duration: durationIdx !== -1 && row[durationIdx] ? row[durationIdx].toString().trim() : "3 months",
          cost: costIdx !== -1 && row[costIdx] ? row[costIdx].toString().trim() : "",
          giftMessage: msgIdx !== -1 && row[msgIdx] ? row[msgIdx].toString().trim() : "",
          notes: notesIdx !== -1 && row[notesIdx] ? row[notesIdx].toString().trim() : "",
          status: statusVal,
          statusDetails: statusDetailsVal
        });
      }

      return createJsonResponse({ giftSubscriptions: allGifts });
    }

    return createJsonResponse({ error: "Invalid action or parameters" });
  } catch (err) {
    console.error("gift-subscriptions doGet Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}

/**
 * Handles Web App POST requests (Admin Status Updates, Resend Emails).
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

    var authKey = (postData.adminHash || postData.adminKey || "").toString().trim();
    if (!isValidAdminKey(authKey)) {
      return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
    }

    var action = postData.action;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    var orderIdIdx = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "doPost");
    var pNameIdx = findColumnIndex(headers, ["Purchaser Name", "Your Name", "Purchaser"]);
    var pEmailIdx = requireColumnIndex(headers, ["Purchaser Email", "Your Email", "Email"], "doPost");
    var rNameIdx = findColumnIndex(headers, ["Recipient Name", "Recipient"]);
    var rEmailIdx = findColumnIndex(headers, ["Recipient Email"]);
    var roastIdx = requireColumnIndex(headers, ["Roast", "Coffee"], "doPost");
    var durationIdx = findColumnIndex(headers, ["Duration", "Gift Duration"]);
    var costIdx = findColumnIndex(headers, ["Total Price", "Price", "Cost", "Total"]);
    var msgIdx = findColumnIndex(headers, ["Gift Message", "Message"]);
    var statusIdx = requireColumnIndex(headers, ["Status", "Order Status", "Gift Status"], "doPost");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Reason", "Status Note"]);

    // ACTION: ADMIN UPDATE STATUS
    if (action === 'admin_update_status') {
      var targetOrderId = postData.orderId ? postData.orderId.toString().trim() : "";
      var newStatus = postData.status ? postData.status.toString().trim() : "";
      var newDetails = postData.statusDetails !== undefined ? postData.statusDetails.toString().trim() : "";

      if (!targetOrderId || !newStatus) {
        return createJsonResponse({ error: "Missing required orderId or status" });
      }

      var targetRow = -1;
      for (var i = 1; i < data.length; i++) {
        if (data[i][orderIdIdx] && data[i][orderIdIdx].toString().trim() === targetOrderId) {
          targetRow = i + 1;
          break;
        }
      }

      if (targetRow === -1) {
        return createJsonResponse({ error: "Gift subscription not found: #" + targetOrderId });
      }

      sheet.getRange(targetRow, statusIdx + 1).setValue(newStatus);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(targetRow, statusDetailsIdx + 1).setValue(newDetails);
      }

      var updatedRow = data[targetRow - 1];
      var pName = pNameIdx !== -1 && updatedRow[pNameIdx] ? updatedRow[pNameIdx].toString().trim() : "";
      var pEmail = updatedRow[pEmailIdx] ? updatedRow[pEmailIdx].toString().trim() : "";
      var rName = rNameIdx !== -1 && updatedRow[rNameIdx] ? updatedRow[rNameIdx].toString().trim() : "";
      var rEmail = rEmailIdx !== -1 && updatedRow[rEmailIdx] ? updatedRow[rEmailIdx].toString().trim() : "";
      var roast = updatedRow[roastIdx] ? updatedRow[roastIdx].toString().trim() : "";
      var duration = durationIdx !== -1 && updatedRow[durationIdx] ? updatedRow[durationIdx].toString().trim() : "3 months";
      var cost = costIdx !== -1 && updatedRow[costIdx] ? updatedRow[costIdx].toString().trim() : "";
      var msg = msgIdx !== -1 && updatedRow[msgIdx] ? updatedRow[msgIdx].toString().trim() : "";

      var emailPayload = {
        orderId: targetOrderId,
        status: newStatus,
        statusDetails: newDetails,
        purchaserName: pName,
        purchaserEmail: pEmail,
        recipientName: rName,
        recipientEmail: rEmail,
        roast: roast,
        duration: duration,
        cost: cost,
        giftMessage: msg
      };

      var sentRecipient = false;
      var sentPurchaser = false;

      if ((postData.notifyRecipient === true || postData.notifyRecipient === 'true') && rEmail) {
        try {
          sendGiftSubscriptionStatusEmail(emailPayload, true);
          sentRecipient = true;
        } catch (rErr) {
          console.error("Error sending recipient status email: " + rErr.message);
        }
      }

      if ((postData.notifyPurchaser === true || postData.notifyPurchaser === 'true') && pEmail) {
        try {
          sendGiftSubscriptionStatusEmail(emailPayload, false);
          sentPurchaser = true;
        } catch (pErr) {
          console.error("Error sending purchaser status email: " + pErr.message);
        }
      }

      return createJsonResponse({
        success: true,
        orderId: targetOrderId,
        status: newStatus,
        statusDetails: newDetails,
        sentRecipient: sentRecipient,
        sentPurchaser: sentPurchaser
      });
    }

    // ACTION: ADMIN RESEND EMAIL
    if (action === 'admin_resend_email') {
      var resendId = postData.orderId ? postData.orderId.toString().trim() : "";
      var recipientType = (postData.recipientType || 'recipient').toString().trim().toLowerCase(); // 'recipient', 'purchaser', 'both'

      if (!resendId) {
        return createJsonResponse({ error: "Missing orderId" });
      }

      var resendRow = -1;
      for (var j = 1; j < data.length; j++) {
        if (data[j][orderIdIdx] && data[j][orderIdIdx].toString().trim() === resendId) {
          resendRow = j + 1;
          break;
        }
      }

      if (resendRow === -1) {
        return createJsonResponse({ error: "Gift subscription not found: #" + resendId });
      }

      var rRow = data[resendRow - 1];
      var payload = {
        orderId: resendId,
        purchaserName: pNameIdx !== -1 && rRow[pNameIdx] ? rRow[pNameIdx].toString().trim() : "",
        purchaserEmail: rRow[pEmailIdx] ? rRow[pEmailIdx].toString().trim() : "",
        recipientName: rNameIdx !== -1 && rRow[rNameIdx] ? rRow[rNameIdx].toString().trim() : "",
        recipientEmail: rEmailIdx !== -1 && rRow[rEmailIdx] ? rRow[rEmailIdx].toString().trim() : "",
        roast: rRow[roastIdx] ? rRow[roastIdx].toString().trim() : "",
        duration: durationIdx !== -1 && rRow[durationIdx] ? rRow[durationIdx].toString().trim() : "3 months",
        cost: costIdx !== -1 && rRow[costIdx] ? rRow[costIdx].toString().trim() : "",
        giftMessage: msgIdx !== -1 && rRow[msgIdx] ? rRow[msgIdx].toString().trim() : ""
      };

      var sentRecipientInit = false;
      var sentPurchaserInit = false;

      if ((recipientType === 'recipient' || recipientType === 'both') && payload.recipientEmail) {
        sendRecipientAnnouncement(payload);
        sentRecipientInit = true;
      }

      if ((recipientType === 'purchaser' || recipientType === 'both') && payload.purchaserEmail) {
        sendPurchaserConfirmation(payload);
        sentPurchaserInit = true;
      }

      return createJsonResponse({
        success: true,
        message: "Email(s) dispatched successfully.",
        sentRecipient: sentRecipientInit,
        sentPurchaser: sentPurchaserInit
      });
    }

    return createJsonResponse({ error: "Unsupported POST action: " + action });
  } catch (err) {
    console.error("gift-subscriptions doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}
