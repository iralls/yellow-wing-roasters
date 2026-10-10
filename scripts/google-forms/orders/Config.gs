/**
 * Yellow Wing Roasters - Order Management Configuration
 */

var ROASTER_EMAIL = 'orders@yellowwingroasters.com';
var LOGO_IMAGE_FILE_ID = '1q2emovnTHhxcUWRrOuHb1v3ulcL_buY3';
var START_ORDER_ID = 1000;

/**
 * Roaster Admin Security: Salted SHA-256 Password Hash.
 * Safe for public git repositories; plaintext passwords are never stored in git.
 * Generate new hashes with: node scripts/generate-admin-hash.js
 */
var ADMIN_SALT = 'yellow-wing-roasters-auth-v1';
var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

/**
 * Order Status Notification Definitions
 */
var NOTIFY_STATUSES = [
  'delayed',
  'roasted',
  'ready for pickup',
  'ready to deliver',
  'out for delivery',
  'delivered',
  'cancelled'
];

var STATUS_CONFIGS = {
  'delayed': {
    badgeClass: 'status-delayed',
    title: 'Order Slightly Delayed',
    message: "We are currently experiencing a brief delay with your order. We appreciate your patience while we get everything dialed in!",
    detailsLabel: 'Reason for Delay',
    subject: function (orderId) { return "Important Update: Order #" + orderId + " is Delayed"; }
  },
  'roasted': {
    badgeClass: 'status-roasted',
    title: 'Freshly Roasted!',
    message: "Your beans have just been roasted to perfection and are beginning to degas. We'll send another update as soon as they are ready for pickup or delivery.",
    detailsLabel: 'Roast Notes',
    subject: function (orderId) { return "Fresh from the Roaster: Order #" + orderId + " is Roasted"; }
  },
  'ready for pickup': {
    badgeClass: 'status-ready',
    title: 'Ready for Pickup!',
    message: "Your coffee is roasted, packaged, and ready for pickup!",
    detailsLabel: 'Pickup Instructions',
    subject: function (orderId) { return "Your Yellow Wing Roasters order is ready for pickup! (#" + orderId + ")"; }
  },
  'ready to deliver': {
    badgeClass: 'status-ready',
    title: 'Out for Hand Delivery!',
    message: "Your coffee is packaged and on its way to your doorstep today!",
    detailsLabel: 'Delivery Instructions',
    subject: function (orderId) { return "Out for Delivery: Your Yellow Wing Roasters order (#" + orderId + ")"; }
  },
  'out for delivery': {
    badgeClass: 'status-ready',
    title: 'Out for Hand Delivery!',
    message: "Your coffee is packaged and on its way to your doorstep today!",
    detailsLabel: 'Delivery Instructions',
    subject: function (orderId) { return "Out for Delivery: Your Yellow Wing Roasters order (#" + orderId + ")"; }
  },
  'delivered': {
    badgeClass: 'status-delivered',
    title: 'Order Delivered!',
    message: "Your coffee has been hand delivered. Enjoy your fresh cup, and thank you for supporting small-batch roasting!",
    detailsLabel: 'Delivery Note',
    subject: function (orderId) { return "Delivered: Your Yellow Wing Roasters order (#" + orderId + ")"; }
  },
  'cancelled': {
    badgeClass: 'status-cancelled',
    title: 'Order Cancelled',
    message: "Your order has been cancelled.",
    detailsLabel: 'Cancellation Note',
    subject: function (orderId) { return "Cancelled: Your Yellow Wing Roasters order (#" + orderId + ")"; }
  }
};
