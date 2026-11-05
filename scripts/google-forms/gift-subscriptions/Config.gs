/**
 * Yellow Wing Roasters - Gift Subscriptions Configuration
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
 * Canonical 13-Column Layout:
 * Columns A–J (1–10) match the 9 Google Form questions + Timestamp.
 * Columns K–M (11–13) are the system-managed columns.
 */
var CANONICAL_GIFT_SUB_HEADERS = [
  "Timestamp",
  "Purchaser Name",
  "Purchaser Email",
  "Recipient Name",
  "Recipient Email",
  "Roast",
  "Duration",
  "Total Price",
  "Gift Message",
  "Notes",
  "Order ID",
  "Status",
  "Status Details"
];

/**
 * Status Notification Configuration & Branded Copy
 */
var GIFT_SUB_STATUS_CONFIGS = {
  'active': {
    badgeClass: 'status-active',
    title: 'Gift Subscription Active',
    recipientMessage: "Your gift coffee deliveries are scheduled according to our upcoming roast cycle.",
    purchaserMessage: "The gift subscription is active and scheduled for upcoming roast cycles.",
    detailsLabel: 'Fulfillment Note',
    subject: function (id) { return "Your Coffee Gift is Active (#" + id + ")"; }
  },
  'roasted': {
    badgeClass: 'status-roasted',
    title: 'Freshly Roasted!',
    recipientMessage: "Fresh off the roaster! Your gift coffee beans have just dropped from the burner and are beginning to degas.",
    purchaserMessage: "The beans for this gift subscription have just been roasted fresh.",
    detailsLabel: 'Roaster Note',
    subject: function (id) { return "Your Coffee Gift is Freshly Roasted (#" + id + ")"; }
  },
  'ready for pickup': {
    badgeClass: 'status-ready',
    title: 'Ready for Pickup!',
    recipientMessage: "Your gift coffee is roasted, packaged, and ready for pickup!",
    purchaserMessage: "The gift coffee order is roasted and ready for pickup.",
    detailsLabel: 'Pickup Instructions',
    subject: function (id) { return "Your Coffee Gift is Ready for Pickup! (#" + id + ")"; }
  },
  'out for delivery': {
    badgeClass: 'status-ready',
    title: 'Out for Hand Delivery!',
    recipientMessage: "Your fresh gift coffee is packaged and on its way to your doorstep today!",
    purchaserMessage: "A gift coffee delivery is on its way to the recipient today.",
    detailsLabel: 'Delivery Details',
    subject: function (id) { return "Out for Delivery: Your Coffee Gift (#" + id + ")"; }
  },
  'delivered': {
    badgeClass: 'status-delivered',
    title: 'Coffee Delivered!',
    recipientMessage: "Your fresh coffee has been hand delivered to your doorstep. Enjoy every cup!",
    purchaserMessage: "A coffee delivery for your gift subscription has been delivered to the recipient.",
    detailsLabel: 'Delivery Note',
    subject: function (id) { return "Delivered: Your Coffee Gift (#" + id + ")"; }
  },
  'paused': {
    badgeClass: 'status-paused',
    title: 'Deliveries Paused',
    recipientMessage: "Your gift subscription deliveries are temporarily on hold.",
    purchaserMessage: "Deliveries for this gift subscription are temporarily paused.",
    detailsLabel: 'Pause Note',
    subject: function (id) { return "Update: Coffee Gift Deliveries Paused (#" + id + ")"; }
  },
  'completed': {
    badgeClass: 'status-active',
    title: 'Gift Subscription Completed',
    recipientMessage: "All deliveries for your gift coffee subscription have been completed. Thank you for enjoying Yellow Wing Roasters—you are always welcome back in the flock!",
    purchaserMessage: "All scheduled deliveries for your gift subscription have been completed. Thank you for sharing Yellow Wing Roasters!",
    detailsLabel: 'Completion Note',
    subject: function (id) { return "Gift Subscription Completed (#" + id + ")"; }
  },
  'cancelled': {
    badgeClass: 'status-cancelled',
    title: 'Gift Order Cancelled',
    recipientMessage: "This gift coffee order has been cancelled.",
    purchaserMessage: "Your gift subscription order has been cancelled.",
    detailsLabel: 'Cancellation Note',
    subject: function (id) { return "Cancelled: Gift Order (#" + id + ")"; }
  }
};
