/**
 * Yellow Wing Roasters - Subscription System Configuration
 */

var ROASTER_EMAIL = 'orders@yellowwingroasters.com';
var LOGO_IMAGE_FILE_ID = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3';
var START_ORDER_ID = 1000;

/**
 * Roaster Admin Security: Salted SHA-256 Password Hash.
 * Matches shared Roaster Admin authentication.
 */
var ADMIN_SALT = 'yellow-wing-roasters-auth-v1';
var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

/**
 * Subscription Status Notification Definitions
 */
var SUBSCRIPTION_NOTIFY_STATUSES = [
  'active',
  'paused',
  'cancelled'
];

var SUBSCRIPTION_STATUS_CONFIGS = {
  'active': {
    badgeClass: 'status-active',
    title: 'Subscription Active & Resumed',
    message: "Welcome back! Your coffee subscription deliveries are active again and scheduled for our upcoming roast cycle.",
    detailsLabel: 'Subscription Note',
    subject: function (id) { return "Your Yellow Wing Roasters Subscription is Active (#" + id + ")"; }
  },
  'paused': {
    badgeClass: 'status-paused',
    title: 'Subscription Paused',
    message: "Your subscription deliveries have been temporarily paused. We've saved your roast preferences, and you can resume anytime with one click.",
    detailsLabel: 'Pause Note',
    subject: function (id) { return "Your Yellow Wing Roasters Subscription is Paused (#" + id + ")"; }
  },
  'cancelled': {
    badgeClass: 'status-cancelled',
    title: 'Subscription Cancelled',
    message: "Your coffee subscription has been cancelled as requested. Thank you for supporting small-batch roasting—you are always welcome back in the flock!",
    detailsLabel: 'Cancellation Note',
    subject: function (id) { return "Your Yellow Wing Roasters Subscription has been Cancelled (#" + id + ")"; }
  }
};
