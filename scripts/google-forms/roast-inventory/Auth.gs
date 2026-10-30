/**
 * Yellow Wing Roasters - Roast Inventory Authentication & Security
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
 * Validates the client-hashed admin token (or raw key) against the expected SHA-256 digest.
 */
function isValidAdminKey(providedKey) {
  if (!providedKey) return false;
  var computed = computeAdminHash(providedKey);
  return computed === ADMIN_TOKEN_HASH || computed === ADMIN_PASSWORD_HASH;
}
