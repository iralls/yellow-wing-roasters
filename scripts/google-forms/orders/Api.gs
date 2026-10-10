/**
 * Yellow Wing Roasters - Order Management Web App API
 * Handles authenticated customer lookups/cancellations, magic link dispatch, and admin endpoints.
 */

/**
 * Handles Web App GET requests.
 */
function doGet(e) {
  try {
    // 1. Template Preview
    if (e && e.parameter && e.parameter.preview) {
      var previewTpl = HtmlService.createTemplateFromFile('order-confirmation-template');
      previewTpl.orderId = 1001;
      previewTpl.manageToken = "previewtoken12345";
      previewTpl.customerEmail = "jane@test.com";
      previewTpl.items = "1x Early Bird 12oz (Grind: Whole Bean), 1x Feather Soot 2lb (Grind: Drip)";
      previewTpl.cost = "$42.00";
      previewTpl.deliveryMethod = "Pickup";
      return previewTpl.evaluate();
    }

    // 2. Roaster Admin: List all orders with authenticated passcode
    if (e && e.parameter && (e.parameter.action === 'admin_list' || e.parameter.adminKey)) {
      var adminKeyParam = e.parameter.adminKey ? e.parameter.adminKey.toString().trim() : "";
      if (!isValidAdminKey(adminKeyParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var adminSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var adminData = adminSheet.getDataRange().getValues();
      if (adminData.length <= 1) {
        return createJsonResponse({ orders: [] });
      }

      var aHeaders = adminData[0];
      var aOrderIdIdx = requireColumnIndex(aHeaders, ["Order ID", "Order #", "Order Number", "orderId"], "adminList");
      var aManageTokenIdx = findColumnIndex(aHeaders, ["Manage Token", "Token", "Secret Token", "manageToken"]);
      var aEmailIdx = requireColumnIndex(aHeaders, ["Email", "Email Address"], "adminList");
      var aTimestampIdx = findColumnIndex(aHeaders, ["Timestamp"]);
      var aNameIdx = findColumnIndex(aHeaders, ["Name", "Customer Name", "Full Name"]);
      var aItemsIdx = findColumnIndex(aHeaders, ["Items", "Order Items", "Item"]);
      var aTotalIdx = findColumnIndex(aHeaders, ["Total", "Price", "Cost", "Order Total"]);
      var aDeliveryIdx = findColumnIndex(aHeaders, ["Delivery Method", "Delivery"]);
      var aAddressIdx = findColumnIndex(aHeaders, ["Street address", "Address", "Street Address"]);
      var aCityIdx = findColumnIndex(aHeaders, ["City"]);
      var aStateIdx = findColumnIndex(aHeaders, ["State"]);
      var aZipIdx = findColumnIndex(aHeaders, ["ZIP", "Zip Code", "Postal Code"]);
      var aNotesIdx = findColumnIndex(aHeaders, ["Notes", "Order Notes", "Special Instructions"]);
      var aStatusIdx = requireColumnIndex(aHeaders, ["Status", "Order Status"], "adminList");
      var aStatusDetailsIdx = findColumnIndex(aHeaders, ["Status Details", "Notes / Details", "Status Note", "Status Message"]);

      var allOrders = [];
      for (var a = 1; a < adminData.length; a++) {
        var aRow = adminData[a];
        var oId = aRow[aOrderIdIdx] ? aRow[aOrderIdIdx].toString().trim() : "";
        var oEmail = aRow[aEmailIdx] ? aRow[aEmailIdx].toString().trim() : "";
        if (!oId && !oEmail) continue;

        var oStatus = (aRow[aStatusIdx] && aRow[aStatusIdx].toString().trim() !== "")
          ? aRow[aStatusIdx].toString().trim()
          : "Received";
        var oStatusDetails = (aStatusDetailsIdx !== -1 && aRow[aStatusDetailsIdx])
          ? aRow[aStatusDetailsIdx].toString().trim()
          : "";

        var oTimestamp = "";
        if (aTimestampIdx !== -1 && aRow[aTimestampIdx]) {
          oTimestamp = aRow[aTimestampIdx] instanceof Date
            ? aRow[aTimestampIdx].toLocaleString()
            : aRow[aTimestampIdx].toString().trim();
        }

        allOrders.push({
          orderId: oId,
          token: aManageTokenIdx !== -1 && aRow[aManageTokenIdx] ? aRow[aManageTokenIdx].toString().trim() : "",
          name: aNameIdx !== -1 && aRow[aNameIdx] ? aRow[aNameIdx].toString().trim() : "Customer",
          email: oEmail,
          items: aItemsIdx !== -1 && aRow[aItemsIdx] ? aRow[aItemsIdx].toString().trim() : "",
          total: aTotalIdx !== -1 && aRow[aTotalIdx] ? aRow[aTotalIdx].toString().trim() : "",
          deliveryMethod: aDeliveryIdx !== -1 && aRow[aDeliveryIdx] ? aRow[aDeliveryIdx].toString().trim() : "Pickup",
          address: aAddressIdx !== -1 && aRow[aAddressIdx] ? aRow[aAddressIdx].toString().trim() : "",
          city: aCityIdx !== -1 && aRow[aCityIdx] ? aRow[aCityIdx].toString().trim() : "",
          state: aStateIdx !== -1 && aRow[aStateIdx] ? aRow[aStateIdx].toString().trim() : "",
          zip: aZipIdx !== -1 && aRow[aZipIdx] ? aRow[aZipIdx].toString().trim() : "",
          notes: aNotesIdx !== -1 && aRow[aNotesIdx] ? aRow[aNotesIdx].toString().trim() : "",
          status: oStatus,
          statusDetails: oStatusDetails,
          timestamp: oTimestamp
        });
      }

      return createJsonResponse({ orders: allOrders });
    }

    // 3. Customer Single Order Lookup (Requires orderId + manageToken)
    var orderIdParam = e && e.parameter && e.parameter.orderId ? e.parameter.orderId.toString().trim() : null;
    var tokenParam = e && e.parameter && e.parameter.token ? e.parameter.token.toString().trim() : null;

    if (!orderIdParam || !tokenParam) {
      return createJsonResponse({ error: "Unauthorized: Missing orderId or token parameter" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ error: "Order not found" });
    }

    var headers = data[0];
    var orderIdIdx = requireColumnIndex(headers, ["Order ID", "Order #", "Order Number", "orderId"], "doGetLookup");
    var manageTokenIdx = requireColumnIndex(headers, ["Manage Token", "Token", "Secret Token", "manageToken"], "doGetLookup");
    var emailIdx = requireColumnIndex(headers, ["Email", "Email Address"], "doGetLookup");
    var timestampIdx = findColumnIndex(headers, ["Timestamp"]);
    var nameIdx = findColumnIndex(headers, ["Name", "Customer Name", "Full Name"]);
    var itemsIdx = findColumnIndex(headers, ["Items", "Order Items", "Item"]);
    var totalIdx = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]);
    var deliveryIdx = findColumnIndex(headers, ["Delivery Method", "Delivery"]);
    var addressIdx = findColumnIndex(headers, ["Street address", "Address", "Street Address"]);
    var cityIdx = findColumnIndex(headers, ["City"]);
    var stateIdx = findColumnIndex(headers, ["State"]);
    var zipIdx = findColumnIndex(headers, ["ZIP", "Zip Code", "Postal Code"]);
    var notesIdx = findColumnIndex(headers, ["Notes", "Order Notes", "Special Instructions"]);
    var statusIdx = requireColumnIndex(headers, ["Status", "Order Status"], "doGetLookup");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]);

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowOrderId = row[orderIdIdx] ? row[orderIdIdx].toString().trim() : "";
      var rowToken = row[manageTokenIdx] ? row[manageTokenIdx].toString().trim() : "";

      if (rowOrderId === orderIdParam && rowToken === tokenParam) {
        var statusVal = (row[statusIdx] && row[statusIdx].toString().trim() !== "")
          ? row[statusIdx].toString().trim()
          : "Received";
        var statusDetailsVal = (statusDetailsIdx !== -1 && row[statusDetailsIdx])
          ? row[statusDetailsIdx].toString().trim()
          : "";

        var lowerStatus = statusVal.toLowerCase();
        var canCancel = (lowerStatus === 'received' || lowerStatus === 'delayed');

        return createJsonResponse({
          order: {
            orderId: rowOrderId,
            token: rowToken,
            name: nameIdx !== -1 ? row[nameIdx] : "",
            email: row[emailIdx] || "",
            items: itemsIdx !== -1 ? row[itemsIdx] : "",
            total: totalIdx !== -1 ? row[totalIdx] : "",
            deliveryMethod: deliveryIdx !== -1 && row[deliveryIdx] ? row[deliveryIdx] : "Pickup",
            address: addressIdx !== -1 ? row[addressIdx] : "",
            city: cityIdx !== -1 ? row[cityIdx] : "",
            state: stateIdx !== -1 ? row[stateIdx] : "",
            zip: zipIdx !== -1 ? row[zipIdx] : "",
            notes: notesIdx !== -1 ? row[notesIdx] : "",
            status: statusVal,
            statusDetails: statusDetailsVal,
            timestamp: timestampIdx !== -1 ? row[timestampIdx] : "",
            canCancel: canCancel
          }
        });
      }
    }

    return createJsonResponse({ error: "Unauthorized: Invalid Order ID or Token" });
  } catch (err) {
    console.error("Order doGet Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}

/**
 * Handles Web App POST requests (Magic Link, Admin Status Updates, Customer Cancellations).
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
    var itemsIdx = findColumnIndex(headers, ["Items", "Order Items", "Item"]);
    var totalIdx = findColumnIndex(headers, ["Total", "Price", "Cost", "Order Total"]);
    var notesIdx = findColumnIndex(headers, ["Notes", "Order Notes", "Special Instructions"]);
    var statusIdx = requireColumnIndex(headers, ["Status", "Order Status"], "doPost");
    var statusDetailsIdx = findColumnIndex(headers, ["Status Details", "Notes / Details", "Status Note", "Status Message"]);

    // ACTION: REQUEST MAGIC LINK
    if (action === 'request_link') {
      var reqEmail = postData.email ? postData.email.toString().trim().toLowerCase() : "";
      var reqOrderId = postData.orderId ? postData.orderId.toString().trim() : "";

      if (reqEmail && reqOrderId) {
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var rowOrderId = row[orderIdIdx] ? row[orderIdIdx].toString().trim() : "";
          var rowEmail = row[emailIdx] ? row[emailIdx].toString().trim().toLowerCase() : "";

          if (rowOrderId === reqOrderId && rowEmail === reqEmail) {
            var token = row[manageTokenIdx] ? row[manageTokenIdx].toString().trim() : "";
            if (!token) {
              token = generateSecureToken();
              sheet.getRange(i + 1, manageTokenIdx + 1).setValue(token);
            }

            sendMagicLinkEmail({
              orderId: rowOrderId,
              manageToken: token,
              email: row[emailIdx],
              items: itemsIdx !== -1 ? row[itemsIdx] : "",
              cost: totalIdx !== -1 ? row[totalIdx] : ""
            });
            break;
          }
        }
      }

      // Always return identical message to prevent user enumeration
      return createJsonResponse({
        success: true,
        message: "If an order matches that information, we've emailed a secure link to manage it."
      });
    }

    // ACTION: ADMIN UPDATE STATUS (Roaster Passcode Protected)
    if (action === 'admin_update_status') {
      var adminKeyParam = postData.adminKey ? postData.adminKey.toString().trim() : "";
      if (!isValidAdminKey(adminKeyParam)) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" });
      }

      var adminOrderId = postData.orderId ? postData.orderId.toString().trim() : "";
      var newStatus = postData.status ? postData.status.toString().trim() : "";
      var newStatusDetails = postData.statusDetails ? postData.statusDetails.toString().trim() : "";

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
        return createJsonResponse({ error: "Order not found: #" + adminOrderId });
      }

      sheet.getRange(adminTargetRow, statusIdx + 1).setValue(newStatus);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(adminTargetRow, statusDetailsIdx + 1).setValue(newStatusDetails);
      }

      var lower = newStatus.toLowerCase();
      var notifyCustomer = postData.notifyCustomer === true;
      var emailSent = false;
      if (notifyCustomer && NOTIFY_STATUSES.indexOf(lower) !== -1) {
        sendStatusEmailForRow(sheet, adminTargetRow);
        emailSent = true;
      }

      return createJsonResponse({
        success: true,
        orderId: adminOrderId,
        status: newStatus,
        statusDetails: newStatusDetails,
        emailSent: emailSent
      });
    }

    // CUSTOMER AUTHENTICATED ACTIONS (Require orderId + token)
    var orderId = postData.orderId ? postData.orderId.toString().trim() : "";
    var token = postData.token ? postData.token.toString().trim() : "";

    if (!orderId || !token) {
      return createJsonResponse({ error: "Missing orderId or token parameter" });
    }

    var targetRowIdx = -1;
    for (var j = 1; j < data.length; j++) {
      var r = data[j];
      var rOrderId = r[orderIdIdx] ? r[orderIdIdx].toString().trim() : "";
      var rToken = r[manageTokenIdx] ? r[manageTokenIdx].toString().trim() : "";

      if (rOrderId === orderId && rToken === token) {
        targetRowIdx = j + 1;
        break;
      }
    }

    if (targetRowIdx === -1) {
      return createJsonResponse({ error: "Unauthorized: Invalid Order ID or Token" });
    }

    var rowVals = sheet.getRange(targetRowIdx, 1, 1, headers.length).getValues()[0];
    var currentStatus = rowVals[statusIdx] ? rowVals[statusIdx].toString().trim() : "Received";
    var customerEmail = rowVals[emailIdx] ? rowVals[emailIdx].toString().trim() : "";
    var customerName = nameIdx !== -1 && rowVals[nameIdx] ? rowVals[nameIdx].toString().trim() : "Customer";
    var currentItems = itemsIdx !== -1 && rowVals[itemsIdx] ? rowVals[itemsIdx].toString().trim() : "";
    var currentTotal = totalIdx !== -1 && rowVals[totalIdx] ? rowVals[totalIdx].toString().trim() : "";

    // ACTION: CANCEL ORDER (Allowed strictly before roasting has occurred)
    if (action === 'cancel') {
      var lowerStatus = currentStatus.toLowerCase();
      if (['roasted', 'ready for pickup', 'ready to deliver', 'out for delivery', 'delivered', 'cancelled'].indexOf(lowerStatus) !== -1) {
        return createJsonResponse({
          error: "Cancellations can only occur before roasting has occurred. Please contact " + ROASTER_EMAIL
        });
      }

      var reason = postData.reason ? postData.reason.toString().trim() : "";
      sheet.getRange(targetRowIdx, statusIdx + 1).setValue("Cancelled");
      if (statusDetailsIdx !== -1) {
        sheet.getRange(targetRowIdx, statusDetailsIdx + 1).setValue(reason);
      }

      // Append cancellation audit note
      if (notesIdx !== -1) {
        var prevNotes = rowVals[notesIdx] ? rowVals[notesIdx].toString().trim() : "";
        var auditNote = "[Cancelled by customer " + new Date().toLocaleString() + (reason ? ": " + reason : "") + "]";
        sheet.getRange(targetRowIdx, notesIdx + 1).setValue(prevNotes ? prevNotes + " | " + auditNote : auditNote);
      }

      // Send emails
      sendCustomerCancellationEmail({
        orderId: orderId,
        reason: reason,
        items: currentItems,
        cost: currentTotal,
        customerEmail: customerEmail
      });

      sendRoasterCancellationEmail({
        orderId: orderId,
        manageToken: token,
        customerName: customerName,
        customerEmail: customerEmail,
        items: currentItems,
        cost: currentTotal,
        reason: reason
      });

      return createJsonResponse({ success: true, status: "Cancelled" });
    }

    // ACTION: UPDATE ITEMS (Disabled: Orders are immutable)
    if (action === 'update_items') {
      return createJsonResponse({
        error: "Orders are immutable. To make changes, please cancel this order and place a new one."
      });
    }

    // ACTION: UPDATE STATUS
    if (action === 'update_status') {
      var newStatusVal = postData.status ? postData.status.toString().trim() : "";
      var newStatusDetailsVal = postData.statusDetails ? postData.statusDetails.toString().trim() : "";

      if (!newStatusVal) {
        return createJsonResponse({ error: "Missing status parameter" });
      }

      sheet.getRange(targetRowIdx, statusIdx + 1).setValue(newStatusVal);
      if (statusDetailsIdx !== -1) {
        sheet.getRange(targetRowIdx, statusDetailsIdx + 1).setValue(newStatusDetailsVal);
      }

      var lowerUpdated = newStatusVal.toLowerCase();
      if (NOTIFY_STATUSES.indexOf(lowerUpdated) !== -1) {
        sendStatusEmailForRow(sheet, targetRowIdx);
      }

      return createJsonResponse({ success: true, status: newStatusVal });
    }

    return createJsonResponse({ error: "Unrecognized action: " + action });
  } catch (err) {
    console.error("Order doPost Error: " + err.message + "\n" + err.stack);
    return createJsonResponse({ error: err.message });
  }
}
