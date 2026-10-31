/**
 * Yellow Wing Roasters - Pigeon Post Email Dispatcher
 */

/**
 * Builds the 5-dot HTML indicator for the given roast level dots count (1-5).
 */
function buildRoastDotsHtml(dotsCount) {
  var html = "";
  for (var i = 1; i <= 5; i++) {
    var color = i <= dotsCount ? "#9c6d12" : "#dfd6c9";
    html += '<span style="color: ' + color + '; font-size: 12px; margin: 0 2px;">&#9679;</span>';
  }
  return html;
}

/**
 * Renders the HTML email body for welcoming a new subscriber to Pigeon Post.
 *
 * @param {Object} welcomeData - Optional overrides/notes (introNote, siteUrl, siteTitle, roasterEmail).
 * @return {string} Evaluated HTML email string.
 */
function renderWelcomeEmailHtml(welcomeData) {
  var data = welcomeData || {};
  var template = HtmlService.createTemplateFromFile('welcome-template');

  template.siteUrl = data.siteUrl || SITE_URL;
  template.siteTitle = data.siteTitle || SITE_TITLE;
  template.roasterEmail = data.roasterEmail || ROASTER_EMAIL;
  template.introNote = data.introNote || "";

  return template.evaluate().getContent();
}

/**
 * Sends the Welcome to Pigeon Post email to a new subscriber.
 *
 * @param {string} subscriberEmail - Recipient email address.
 * @param {Object} welcomeData - Optional configuration or introNote.
 */
function sendWelcomeEmail(subscriberEmail, welcomeData) {
  var data = welcomeData || {};
  var siteUrl = data.siteUrl || SITE_URL;
  var siteTitle = data.siteTitle || SITE_TITLE;
  var roasterEmail = data.roasterEmail || ROASTER_EMAIL;
  var htmlBody = renderWelcomeEmailHtml(data);
  var subject = "Welcome to Pigeon Post — " + siteTitle;

  var plainText =
    "WELCOME TO THE FLOCK — " + siteTitle.toUpperCase() + "\n\n" +
    (data.introNote ? data.introNote + "\n\n" : "") +
    "Thanks for joining our small-batch roastery dispatch. Every bag we offer is roasted fresh to order, and you're now first in line to hear when new single-origin lots, seasonal blends, and fresh restocks land in the roost.\n\n" +
    "- Just Hatched: New micro-lots & signature blends\n" +
    "- Seasonals: Limited-run holiday & seasonal roasts\n" +
    "- Restocks: Fresh harvests & rotating lots\n\n" +
    "Browse All Roasts: " + siteUrl + "/roasts/\n" +
    "Coffee Quiz: " + siteUrl + "/quiz/ · Sample Flights: " + siteUrl + "/flights/ · Subscriptions: " + siteUrl + "/subscriptions/\n\n" +
    "Chirp,\n" +
    siteTitle + "\n";

  GmailApp.sendEmail(subscriberEmail, subject, plainText, {
    name: siteTitle,
    from: roasterEmail,
    replyTo: roasterEmail,
    htmlBody: htmlBody
  });
  console.log("Pigeon Post welcome email sent to " + subscriberEmail);
}

/**
 * Renders the HTML email body for introducing a new roast to Pigeon Post subscribers.
 *
 * @param {Object} roastData - Roast metadata and site configuration values.
 * @return {string} Evaluated HTML email string.
 */
function renderNewRoastEmailHtml(roastData) {
  var template = HtmlService.createTemplateFromFile('new-roast-template');

  template.siteUrl = roastData.siteUrl;
  template.roasterEmail = roastData.roasterEmail;
  template.title = roastData.title;
  template.subtitle = roastData.subtitle;
  template.category = roastData.category;
  template.roastUrl = roastData.roastUrl;
  template.mascotUrl = roastData.mascotUrl;
  template.mascotName = roastData.mascotName;
  template.justHatchedBadge = roastData.justHatchedBadge;
  template.justHatchedBg = roastData.justHatchedBg;
  template.justHatchedColor = roastData.justHatchedColor;
  template.certificationLabel = roastData.certificationLabel;
  template.certificationBg = roastData.certificationBg;
  template.certificationColor = roastData.certificationColor;
  template.introNote = roastData.introNote;
  template.description = roastData.description;
  template.descriptor = roastData.descriptor;
  template.tastingNotesFormatted = roastData.tastingNotesFormatted;
  template.roastDotsHtml = buildRoastDotsHtml(roastData.roastDots);
  template.roastLevelName = roastData.roastLevelName;
  template.originLabel = roastData.originLabel;
  template.originValue = roastData.originValue;
  template.terroirLabel = roastData.terroirLabel;
  template.terroirValue = roastData.terroirValue;
  template.brewingMethod = roastData.brewingMethod;

  return template.evaluate().getContent();
}

/**
 * Sends a new roast announcement email to a subscriber email address.
 *
 * @param {string} subscriberEmail - Recipient email address.
 * @param {Object} roastData - Roast metadata and site configuration values.
 */
function sendNewRoastAnnouncement(subscriberEmail, roastData) {
  var htmlBody = renderNewRoastEmailHtml(roastData);
  var subject = "Just Hatched: " + roastData.title + " — Yellow Wing Roasters";
  var plainText =
    "Just Hatched at Yellow Wing Roasters: " + roastData.title + "\n\n" +
    roastData.description + "\n\n" +
    "Flavor Profile (" + roastData.descriptor + "): " + roastData.tastingNotesFormatted + "\n" +
    "Roast Level: " + roastData.roastLevelName + "\n" +
    roastData.originLabel + ": " + roastData.originValue + "\n" +
    "Recommended Brew: " + roastData.brewingMethod + "\n\n" +
    "Explore " + roastData.title + ": " + roastData.roastUrl + "\n";

  GmailApp.sendEmail(subscriberEmail, subject, plainText, {
    name: "Yellow Wing Roasters",
    from: roastData.roasterEmail,
    replyTo: roastData.roasterEmail,
    htmlBody: htmlBody
  });
}

/**
 * Renders the HTML email body for introducing a custom roast offering to Pigeon Post subscribers.
 *
 * @param {Object} customData - Custom offering metadata and site configuration values.
 * @return {string} Evaluated HTML email string.
 */
function renderCustomRoastEmailHtml(customData) {
  var template = HtmlService.createTemplateFromFile('custom-roast-template');

  template.siteUrl = customData.siteUrl;
  template.roasterEmail = customData.roasterEmail;
  template.title = customData.title;
  template.category = customData.category;
  template.descriptor = customData.descriptor;
  template.overlayNotes = customData.overlayNotes;
  template.intro = customData.intro;
  template.introNote = customData.introNote;
  template.customUrl = customData.customUrl;
  template.mascotUrl = customData.mascotUrl;
  template.justHatchedBadge = customData.justHatchedBadge;
  template.justHatchedBg = customData.justHatchedBg;
  template.justHatchedColor = customData.justHatchedColor;

  return template.evaluate().getContent();
}

/**
 * Sends a custom roast offering announcement email to a subscriber email address.
 *
 * @param {string} subscriberEmail - Recipient email address.
 * @param {Object} customData - Custom offering metadata and site configuration values.
 */
function sendCustomRoastAnnouncement(subscriberEmail, customData) {
  var htmlBody = renderCustomRoastEmailHtml(customData);
  var subject = "Just Hatched: " + customData.title + " — Yellow Wing Roasters";
  var plainText =
    "Just Hatched at Yellow Wing Roasters: " + customData.title + "\n" +
    customData.overlayNotes + "\n\n" +
    (customData.introNote ? customData.introNote + "\n\n" : "") +
    customData.intro + "\n\n" +
    "Explore " + customData.descriptor + ": " + customData.customUrl + "\n";

  GmailApp.sendEmail(subscriberEmail, subject, plainText, {
    name: "Yellow Wing Roasters",
    from: customData.roasterEmail,
    replyTo: customData.roasterEmail,
    htmlBody: htmlBody
  });
}
