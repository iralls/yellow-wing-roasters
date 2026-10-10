/**
 * Yellow Wing Roasters - Gift Subscriptions Utilities
 */

/**
 * Searches headers array for any case-insensitive match among possibleNames.
 * Returns -1 if not found.
 */
function findColumnIndex(headers, possibleNames) {
  for (var i = 0; i < possibleNames.length; i++) {
    var pName = possibleNames[i].toLowerCase();
    for (var j = 0; j < headers.length; j++) {
      if (headers[j] && headers[j].toString().trim().toLowerCase() === pName) {
        return j;
      }
    }
  }
  return -1;
}

/**
 * Requires a column to exist in headers; throws an error with context if not found.
 */
function requireColumnIndex(headers, possibleNames, context) {
  var idx = findColumnIndex(headers, possibleNames);
  if (idx === -1) {
    throw new Error(
      "[" + (context || "GiftSubscriptionSheet") + "] Required column not found: " +
      JSON.stringify(possibleNames) + ". Available headers: " + JSON.stringify(headers)
    );
  }
  return idx;
}

/**
 * Extracts a field from form submission namedValues matching any variation of possibleNames.
 */
function getField(namedValues, possibleNames) {
  if (!namedValues) return "";
  for (var i = 0; i < possibleNames.length; i++) {
    var key = possibleNames[i];
    if (namedValues[key] && namedValues[key][0] !== undefined) {
      return namedValues[key][0].toString().trim();
    }
  }
  // Case-insensitive / normalized fallback
  var lowerKeys = Object.keys(namedValues);
  for (var j = 0; j < possibleNames.length; j++) {
    var target = possibleNames[j].toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var k = 0; k < lowerKeys.length; k++) {
      var normKey = lowerKeys[k].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normKey === target) {
        var val = namedValues[lowerKeys[k]];
        return val && val[0] !== undefined ? val[0].toString().trim() : "";
      }
    }
  }
  return "";
}

/**
 * Requires a field to be present in namedValues; throws if absent or blank.
 */
function requireField(namedValues, possibleNames, context) {
  var val = getField(namedValues, possibleNames);
  if (!val) {
    throw new Error(
      "[" + (context || "GiftSubscriptionForm") + "] Required field missing or empty: " +
      JSON.stringify(possibleNames) + ". Present keys: " + JSON.stringify(Object.keys(namedValues || {}))
    );
  }
  return val;
}

/**
 * Creates HtmlTemplate from file with resilient extension fallback.
 */
function getTemplate(filename) {
  try {
    return HtmlService.createTemplateFromFile(filename);
  } catch (e) {
    return HtmlService.createTemplateFromFile(filename + '.html');
  }
}
