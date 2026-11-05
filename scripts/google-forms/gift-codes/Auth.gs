/**
 * Yellow Wing Roasters - Digital Gift Cards & Discounts Security & Auth
 */

/**
 * Computes salted SHA-256 hash for roaster admin key verification.
 */
function computeAdminHash(key) {
  var input = ADMIN_SALT + key.toString().trim();
  var rawBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  var hex = "";
  for (var i = 0; i < rawBytes.length; i++) {
    var b = rawBytes[i];
    if (b < 0) b += 256;
    var bHex = b.toString(16);
    if (bHex.length === 1) bHex = "0" + bHex;
    hex += bHex;
  }
  return hex;
}

/**
 * Validates a provided admin key against Script Properties override or salted SHA-256 hash.
 */
function isValidAdminKey(providedKey) {
  if (!providedKey) return false;
  var trimmed = providedKey.toString().trim();

  // 1. Direct salted SHA-256 hash check (preferred: plaintext password never leaves browser)
  if (trimmed === ADMIN_PASSWORD_HASH) {
    return true;
  }

  // 2. Script Properties override check
  var storedKey = "";
  try {
    storedKey = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  } catch (err) {
    console.warn("Could not read ADMIN_KEY from ScriptProperties: " + err.message);
  }

  if (storedKey && trimmed === storedKey.toString().trim()) {
    return true;
  }

  // 3. Salted hash fallback if plaintext key was provided
  return computeAdminHash(trimmed) === ADMIN_PASSWORD_HASH;
}
