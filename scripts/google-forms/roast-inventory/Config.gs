/**
 * Yellow Wing Roasters - Roast & Green Bean Inventory Configuration
 */

/**
 * Roaster Admin Security: Salted SHA-256 Hashes.
 * - ADMIN_PASSWORD_HASH: SHA-256(ADMIN_SALT + password)
 * - ADMIN_TOKEN_HASH:    SHA-256(ADMIN_SALT + ADMIN_PASSWORD_HASH)
 */
var ADMIN_SALT = 'yellow-wing-roasters-auth-v1';
var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';
var ADMIN_TOKEN_HASH = 'e569d07865394cf70a044cc0aa7ced6b6a3694f5f51ead58da6d6c82c32e1723';

/**
 * Spreadsheet Tab Names
 * - GreenBeanOrders, RoastLogs, BlendPackagingLog: Data tables
 * - GreenBeans, Totals: Formula-driven view tabs
 */
var SHEET_GREEN_BEANS = 'GreenBeans';
var SHEET_GREEN_BEAN_ORDERS = 'GreenBeanOrders';
var SHEET_ROAST_LOGS = 'RoastLogs';
var SHEET_BLEND_PACKAGING = 'BlendPackagingLog';
var SHEET_TOTALS = 'Totals';

/**
 * Internal Auto-Generated ID Prefixes & Starting Numbers
 */
var PREFIX_ORDER = 'GBO-';
var START_ORDER_NUM = 1001;

var PREFIX_ROAST = 'RST-';
var START_ROAST_NUM = 2001;

var PREFIX_PACKAGING = 'PKG-';
var START_PACKAGING_NUM = 3001;
