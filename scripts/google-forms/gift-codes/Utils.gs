/**
 * Yellow Wing Roasters - Gift Codes Utilities
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
      "[" + (context || "GiftCodeSheet") + "] Required column not found: " +
      JSON.stringify(possibleNames) + ". Available headers: " + JSON.stringify(headers)
    );
  }
  return idx;
}

/**
 * Helper to extract values dynamically from namedValues using regex pattern matching on keys.
 */
function getFieldByPattern(namedValues, pattern) {
  if (!namedValues) return "";
  for (var key in namedValues) {
    if (pattern.test(key)) {
      var val = namedValues[key];
      return val && val[0] !== undefined ? val[0].toString().trim() : "";
    }
  }
  return "";
}

/**
 * Parses date string in YYYY-MM-DD or YYYY/MM/DD format to a zeroed Date object.
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  var d = new Date(dateStr.toString().replace(/-/g, "/"));
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns JSON output formatted for Apps Script Web App responses.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
