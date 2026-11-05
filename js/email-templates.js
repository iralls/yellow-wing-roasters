/**
 * Yellow Wing Roasters - Interactive Email Template Previewer
 * Provides live side-by-side visual previews of transactional and marketing email templates.
 * Contrasts the updated minimalist "Roost" aesthetic with the legacy boxed card style.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initEmailTemplatePreviewer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var DEFAULT_MOCK = {
    orderId: '1048',
    manageToken: 'tok_demo842',
    customerName: 'Maya Lin',
    customerEmail: 'maya@example.com',
    items: '1x Early Bird City Roast (12oz, Whole Bean) — $16.00<br>1x Snowy Egret Washed (12oz, Drip) — $18.00',
    cost: '$34.00',
    deliveryMethod: 'Local Pickup (Roost Roastery)',
    status: 'roasted',
    statusDetails: 'Freshly dropped from the burner and starting its 48-hour degassing curve. Roaster note: Floral aromatics are exceptionally vivid.',
    cancellationReason: 'Need to change delivery address before dispatch.',
    giftAmount: '45.00',
    giftCode: 'YWR-ROOST-8842',
    senderName: 'Samira Chen',
    recipientName: 'Maya Lin',
    recipientEmail: 'maya@example.com',
    giftMessage: 'Happy birthday Maya! Enjoy some of the finest small-batch roasts in the roost.',
    subPlan: 'The Migrator (Roaster’s Seasonal Choice)',
    subFrequency: 'Every 2 Weeks',
    subSize: '12oz',
    subGrind: 'Whole Bean'
  };

  var STATUS_THEMES = {
    'delayed': { badge: 'Brief Delay', badgeBg: '#fffbeb', badgeColor: '#b45309', border: '#fde68a', title: 'Order Slightly Delayed', message: 'We are experiencing a brief delay while we dial in your roast. We appreciate your patience while we get everything perfected.' },
    'roasted': { badge: 'Roasted', badgeBg: '#f8eed0', badgeColor: '#9c6d12', border: '#f3dd9b', title: 'Roasted', message: 'Your beans have just dropped from the burner and are beginning to degas. We will send another dispatch as soon as they are packaged for pickup or delivery.' },
    'ready for pickup': { badge: 'Ready for Pickup', badgeBg: '#edf2ec', badgeColor: '#2c1e14', border: '#cce2cc', title: 'Your Order Is Ready for Pickup!', message: 'Your fresh batch is sealed, labeled, and waiting for you at the roost.' },
    'ready to deliver': { badge: 'Out for Delivery', badgeBg: '#f5efe6', badgeColor: '#2c1e14', border: '#e8dbca', title: 'Out for Roost Delivery', message: 'Your coffee is on the wing and scheduled for drop-off today.' },
    'delivered': { badge: 'Delivered', badgeBg: '#edf0f4', badgeColor: '#4b5563', border: '#d9e0e8', title: 'Coffee Delivered!', message: 'Your roast has landed at your door. We hope every cup brings delight.' }
  };

  return function initEmailTemplatePreviewer(config) {
    var siteUrl = config.siteUrl || 'https://yellowwingroasters.com';
    var roasterEmail = config.roasterEmail || 'orders@yellowwingroasters.com';
    var featherImgUrl = siteUrl + '/images/audubon-feather-transparent.png';

    // State
    var currentTemplate = 'order_confirmation';
    var currentTheme = 'updated'; // 'updated', 'legacy', 'compare'
    var currentViewport = 'desktop'; // 'desktop' (600px), 'mobile' (375px)
    var currentStatusKey = 'roasted';
    var mockData = Object.assign({}, DEFAULT_MOCK);

    // DOM Elements
    var templateTabs = document.querySelectorAll('.ep-template-tab');
    var themeBtns = document.querySelectorAll('.ep-theme-btn');
    var viewportBtns = document.querySelectorAll('.ep-viewport-btn');
    var statusSelect = document.getElementById('ep-status-select');
    var statusRow = document.getElementById('ep-status-control-row');
    var previewStage = document.getElementById('ep-preview-stage');
    var copyHtmlBtn = document.getElementById('ep-copy-html-btn');
    var copyGmailBtn = document.getElementById('ep-copy-gmail-btn');
    var copyStatusEl = document.getElementById('ep-copy-status');

    /* ── Renderers: UPDATED MINIMALIST ("The Roost") THEME ── */

    function renderUpdatedBrandLockup() {
      return (
        '<div style="text-align: center; margin-bottom: 28px;">' +
          '<a href="' + siteUrl + '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">' +
            '<img src="' + featherImgUrl + '" height="48" width="auto" alt="Yellow Wing Roasters" style="height: 48px; width: auto; display: block; margin: 0 auto 8px;" />' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: #f0c838; line-height: 1.2;">' +
              'Yellow Wing' +
            '</div>' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a7f6e; margin-top: 3px;">' +
              'Roasters' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }

    function renderUpdatedFooter() {
      return (
        '<div style="text-align: center; margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(44, 30, 20, 0.08);">' +
          '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 16px; color: #8a7060; margin-bottom: 4px;">' +
            'Chirp,' +
          '</div>' +
          '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #2c1e14;">' +
            'Yellow Wing Roasters' +
          '</div>' +
          '<p style="font-family: Georgia, \'Lora\', serif; font-size: 12px; font-style: italic; color: #998070; margin: 16px auto 0; max-width: 380px; line-height: 1.6;">' +
            'Small-batch specialty coffee roasted fresh to order.<br>' +
            '<a href="' + siteUrl + '" style="color: #8a7060; text-decoration: underline;">yellowwingroasters.com</a> &middot; <a href="mailto:' + roasterEmail + '" style="color: #8a7060; text-decoration: underline;">' + roasterEmail + '</a>' +
          '</p>' +
        '</div>'
      );
    }

    function renderUpdatedWrapper(innerContent) {
      return (
        '<div style="background-color: #faf8f5; padding: 40px 20px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #2c1e14; -webkit-font-smoothing: antialiased; line-height: 1.6;">' +
          '<div style="max-width: 500px; margin: 0 auto; text-align: center;">' +
            renderUpdatedBrandLockup() +
            innerContent +
            renderUpdatedFooter() +
          '</div>' +
        '</div>'
      );
    }

    function renderUpdatedOrderConfirmation(d) {
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;
      var content =
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          'Order Confirmed' +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 22px;">' +
          'Order #' + d.orderId +
        '</div>' +
        '<p style="font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.7; color: #4a3b32; margin: 0 auto 24px; max-width: 440px;">' +
          'Thank you for your order! We\'ll have your coffee freshly roasted and to you soon. Payment can be done in person at pickup/delivery, or ahead of time if preferred. Local delivery is free.' +
        '</p>' +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 440px; margin: 0 auto 26px; background-color: #f5efe6; border-radius: 12px; padding: 20px; text-align: left; box-sizing: border-box;">' +
          '<tr>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top; width: 32%;">Order ID</td>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #2c1e14; vertical-align: top;">#' + d.orderId + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top;">Items</td>' +
            '<td style="padding: 6px 12px; font-family: Georgia, \'Lora\', serif; font-size: 14px; line-height: 1.5; color: #2c1e14; vertical-align: top;">' + d.items + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top;">Delivery</td>' +
            '<td style="padding: 6px 12px; font-family: Georgia, \'Lora\', serif; font-size: 14px; color: #2c1e14; vertical-align: top;">' + d.deliveryMethod + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #2c1e14; vertical-align: middle;">Total</td>' +
            '<td style="padding: 6px 12px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #2c1e14; vertical-align: middle;">' + d.cost + '</td>' +
          '</tr>' +
        '</table>' +
        '<div style="margin: 0 auto 28px; text-align: center;">' +
          '<a href="' + manageUrl + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 32px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'Manage Your Order &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    function renderUpdatedOrderStatusUpdate(d) {
      var st = STATUS_THEMES[currentStatusKey] || STATUS_THEMES['roasted'];
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;

      var noteBox = '';
      if (d.statusDetails && currentStatusKey !== 'roasted') {
        noteBox =
          '<div style="background-color: #ffffff; border: 1px solid rgba(44, 30, 20, 0.1); border-radius: 10px; padding: 16px 20px; margin: 0 auto 24px; max-width: 440px; text-align: left; box-sizing: border-box;">' +
            '<div style="font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; margin-bottom: 6px;">' +
              'Roaster Note' +
            '</div>' +
            '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 14px; line-height: 1.6; color: #2c1e14;">' +
              escapeHtml(d.statusDetails) +
            '</div>' +
          '</div>';
      }

      var badgeHtml = '';
      if (currentStatusKey !== 'roasted') {
        badgeHtml =
          '<div style="margin-bottom: 14px;">' +
            '<span style="display: inline-block; background-color: ' + st.badgeBg + '; color: ' + st.badgeColor + '; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 14px; border-radius: 999px;">' +
              st.badge +
            '</span>' +
          '</div>';
      }

      var content =
        badgeHtml +
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          st.title +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 20px;">' +
          'Order #' + d.orderId +
        '</div>' +
        '<p style="font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.7; color: #4a3b32; margin: 0 auto 22px; max-width: 440px;">' +
          st.message +
        '</p>' +
        noteBox +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 440px; margin: 0 auto 26px; background-color: #f5efe6; border-radius: 12px; padding: 18px 20px; text-align: left; box-sizing: border-box;">' +
          '<tr>' +
            '<td style="padding: 5px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top; width: 32%;">Items</td>' +
            '<td style="padding: 5px 10px; font-family: Georgia, \'Lora\', serif; font-size: 14px; line-height: 1.5; color: #2c1e14; vertical-align: top;">' + d.items + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 5px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top;">Delivery</td>' +
            '<td style="padding: 5px 10px; font-family: Georgia, \'Lora\', serif; font-size: 14px; color: #2c1e14; vertical-align: top;">' + d.deliveryMethod + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 5px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; vertical-align: top;">Total</td>' +
            '<td style="padding: 5px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #2c1e14; vertical-align: top;">' + d.cost + '</td>' +
          '</tr>' +
        '</table>' +
        '<div style="margin: 0 auto 28px; text-align: center;">' +
          '<a href="' + manageUrl + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 32px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'View Order Status &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    function renderUpdatedOrderCancellation(d) {
      var content =
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          'Order Cancelled' +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 22px;">' +
          'Order #' + d.orderId +
        '</div>' +
        '<p style="font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.7; color: #4a3b32; margin: 0 auto 24px; max-width: 440px;">' +
          'Your order has been removed from our roasting schedule. If payment was already coordinated, we will follow up directly.' +
        '</p>' +
        (d.cancellationReason ? (
          '<div style="background-color: #ffffff; border: 1px solid rgba(44, 30, 20, 0.1); border-radius: 10px; padding: 16px 20px; margin: 0 auto 24px; max-width: 440px; text-align: left; box-sizing: border-box;">' +
            '<div style="font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; margin-bottom: 4px;">Reason</div>' +
            '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 14px; color: #2c1e14;">' + escapeHtml(d.cancellationReason) + '</div>' +
          '</div>'
        ) : '') +
        '<div style="margin: 0 auto 28px; text-align: center;">' +
          '<a href="' + siteUrl + '/roasts/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 32px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'Explore Fresh Roasts &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    function renderUpdatedOrderMagicLink(d) {
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;
      var content =
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          'Manage Your Order' +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 22px;">' +
          'Order #' + d.orderId +
        '</div>' +
        '<p style="font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.7; color: #4a3b32; margin: 0 auto 26px; max-width: 440px;">' +
          'Here is your link to view roast progress, update delivery coordinates, or manage your order.' +
        '</p>' +
        '<div style="margin: 0 auto 30px; text-align: center;">' +
          '<a href="' + manageUrl + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 34px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'Open Order Manager &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    function renderUpdatedGiftRecipient(d) {
      var content =
        '<div style="margin-bottom: 14px;">' +
          '<span style="display: inline-block; background-color: #f8eed0; color: #9c6d12; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 14px; border-radius: 999px;">' +
            'Gift From the Flock' +
          '</span>' +
        '</div>' +
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          'A Fresh Roast For You' +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 22px;">' +
          'From ' + escapeHtml(d.senderName) +
        '</div>' +
        (d.giftMessage ? (
          '<div style="background-color: #ffffff; border: 1px solid rgba(44, 30, 20, 0.1); border-radius: 12px; padding: 18px 22px; margin: 0 auto 24px; max-width: 440px; text-align: center; box-sizing: border-box;">' +
            '<p style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; line-height: 1.6; color: #3a2a1d; margin: 0 0 8px;">' +
              '&ldquo;' + escapeHtml(d.giftMessage) + '&rdquo;' +
            '</p>' +
            '<div style="font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: #8a7060;">' +
              '&mdash; ' + escapeHtml(d.senderName) +
            '</div>' +
          '</div>'
        ) : '') +
        '<div style="background-color: #f5efe6; border-radius: 14px; padding: 24px 20px; margin: 0 auto 28px; max-width: 420px; box-sizing: border-box; text-align: center;">' +
          '<div style="font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: #8a7060; margin-bottom: 4px;">Gift Card Value</div>' +
          '<div style="font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 600; color: #2c1e14; margin-bottom: 12px;">$' + escapeHtml(d.giftAmount) + '</div>' +
          '<div style="display: inline-block; background-color: #ffffff; border: 1px solid rgba(44, 30, 20, 0.16); border-radius: 8px; padding: 10px 20px; font-family: monospace; font-size: 18px; font-weight: 600; letter-spacing: 3px; color: #2c1e14;">' +
            escapeHtml(d.giftCode) +
          '</div>' +
          '<div style="font-family: Georgia, \'Lora\', serif; font-size: 12px; font-style: italic; color: #8a7060; margin-top: 10px;">Apply code during checkout on any roast or flight</div>' +
        '</div>' +
        '<div style="margin: 0 auto 28px; text-align: center;">' +
          '<a href="' + siteUrl + '/roasts/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 34px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'Redeem &amp; Choose Roasts &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    function renderUpdatedSubscription(d) {
      var content =
        '<div style="margin-bottom: 14px;">' +
          '<span style="display: inline-block; background-color: #edf0f4; color: #2c1e14; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 14px; border-radius: 999px;">' +
            'Roastery Subscription' +
          '</span>' +
        '</div>' +
        '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 500; color: #2c1e14; letter-spacing: -0.01em; margin: 0 0 6px; line-height: 1.2;">' +
          'Welcome to the Roost' +
        '</h1>' +
        '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 15px; color: #8a7060; margin-bottom: 22px;">' +
          'Standing Roaster Dispatch' +
        '</div>' +
        '<p style="font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.7; color: #4a3b32; margin: 0 auto 24px; max-width: 440px;">' +
          'Your recurring coffee subscription is active! Fresh small-batch roasts will drop directly onto your porch according to your roastery schedule.' +
        '</p>' +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 440px; margin: 0 auto 26px; background-color: #f5efe6; border-radius: 12px; padding: 20px; text-align: left; box-sizing: border-box;">' +
          '<tr>' +
            '<td style="padding: 6px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; width: 32%;">Selection</td>' +
            '<td style="padding: 6px 10px; font-family: Georgia, \'Lora\', serif; font-size: 14px; font-weight: 600; color: #2c1e14;">' + escapeHtml(d.subPlan) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 6px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060;">Frequency</td>' +
            '<td style="padding: 6px 10px; font-family: Georgia, \'Lora\', serif; font-size: 14px; color: #2c1e14;">' + escapeHtml(d.subFrequency) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 6px 10px; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060;">Size &amp; Grind</td>' +
            '<td style="padding: 6px 10px; font-family: Georgia, \'Lora\', serif; font-size: 14px; color: #2c1e14;">' + escapeHtml(d.subSize) + ' &middot; ' + escapeHtml(d.subGrind) + '</td>' +
          '</tr>' +
        '</table>' +
        '<div style="margin: 0 auto 28px; text-align: center;">' +
          '<a href="' + siteUrl + '/subscriptions/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff; padding: 13px 32px; border-radius: 999px; text-decoration: none; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">' +
            'Manage Subscription &rarr;' +
          '</a>' +
        '</div>';
      return renderUpdatedWrapper(content);
    }

    /* ── Renderers: LEGACY BOXED CARD THEME (The Previous Discordant Style) ── */

    function renderLegacyWrapper(innerContent) {
      return (
        '<div style="background-color: #fdfbf7; padding: 20px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #2c1e14; -webkit-font-smoothing: antialiased;">' +
          '<div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e0d5; border-radius: 8px; padding: 24px; box-sizing: border-box; text-align: left;">' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; font-size: 20px; color: #f0c838; border-bottom: 2px solid #e8e0d5; padding-bottom: 12px; margin-bottom: 20px;">' +
              '<table border="0" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; width: 100%;">' +
                '<tr>' +
                  '<td style="vertical-align: middle; padding-right: 12px; width: 60px;">' +
                    '<img src="' + featherImgUrl + '" height="60" alt="Logo" style="height: 60px; width: auto; display: block;" />' +
                  '</td>' +
                  '<td style="vertical-align: middle; color: #f0c838; font-weight: 900; font-family: \'Montserrat\', sans-serif;">' +
                    'Yellow Wing Roasters' +
                  '</td>' +
                '</tr>' +
              '</table>' +
            '</div>' +
            innerContent +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 900; font-size: 15px; color: #f0c838; margin-top: 24px; border-top: 1px solid #e8e0d5; padding-top: 12px;">' +
              'Chirp,<br><strong>Yellow Wing Roasters</strong>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderLegacyOrderConfirmation(d) {
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;
      var content =
        '<p style="font-size: 15px; line-height: 1.5; color: #4a3b32; margin-top: 0;">' +
          'Your order has been registered!' +
        '</p>' +
        '<div style="background: #f9f6f0; border-left: 4px solid #f0c838; padding: 12px 14px; margin: 16px 0; line-height: 1.6; font-size: 14px;">' +
          '<strong>Order ID:</strong> #' + d.orderId + '<br>' +
          '<strong>Items:</strong> ' + d.items + '<br>' +
          '<strong>Total:</strong> ' + d.cost + '<br>' +
          '<strong>Delivery Method:</strong> ' + d.deliveryMethod +
        '</div>' +
        '<div style="text-align: center; margin: 24px 0;">' +
          '<a href="' + manageUrl + '" style="display: inline-block; background-color: #2c1e14; color: #fdfbf7; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 14px;">' +
            'Manage Your Order &rarr;' +
          '</a>' +
        '</div>' +
        '<p style="font-size: 14px; line-height: 1.5; color: #6e5e54;">' +
          'We will email you back shortly to coordinate payment and pickup/delivery details.' +
        '</p>';
      return renderLegacyWrapper(content);
    }

    function renderLegacyOrderStatusUpdate(d) {
      var st = STATUS_THEMES[currentStatusKey] || STATUS_THEMES['roasted'];
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;
      var content =
        '<div style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; background: ' + st.badgeBg + '; color: ' + st.badgeColor + '; border: 1px solid ' + st.border + ';">' +
          st.badge +
        '</div>' +
        '<h2 style="font-size: 18px; margin-top: 0; color: #2c1e14;">' + st.title + '</h2>' +
        '<p style="font-size: 15px; line-height: 1.5; color: #4a3b32;">' + st.message + '</p>' +
        (d.statusDetails ? (
          '<div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 12px 14px; margin: 16px 0; color: #92400e; font-size: 14px; line-height: 1.5;">' +
            '<strong>Roast Notes:</strong><br>' + escapeHtml(d.statusDetails) +
          '</div>'
        ) : '') +
        '<div style="background: #f9f6f0; border-left: 4px solid #f0c838; padding: 12px 14px; margin: 16px 0; line-height: 1.6; font-size: 14px;">' +
          '<strong>Order ID:</strong> #' + d.orderId + '<br>' +
          '<strong>Items:</strong> ' + d.items + '<br>' +
          '<strong>Total:</strong> ' + d.cost + '<br>' +
          '<strong>Delivery Method:</strong> ' + d.deliveryMethod +
        '</div>' +
        '<div style="text-align: center; margin: 24px 0;">' +
          '<a href="' + manageUrl + '" style="display: inline-block; background-color: #2c1e14; color: #fdfbf7; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 14px;">' +
            'Manage Your Order &rarr;' +
          '</a>' +
        '</div>';
      return renderLegacyWrapper(content);
    }

    function renderLegacyOrderCancellation(d) {
      var content =
        '<div style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; background: #fdf2f2; color: #c0392b; border: 1px solid #f8d7da;">' +
          'Order Cancelled' +
        '</div>' +
        '<h2 style="font-size: 18px; margin-top: 0; color: #2c1e14;">Order #' + d.orderId + ' Cancelled</h2>' +
        '<p style="font-size: 15px; line-height: 1.5; color: #4a3b32;">Your order has been cancelled.</p>' +
        (d.cancellationReason ? (
          '<div style="background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 6px; padding: 12px 14px; margin: 16px 0; color: #c0392b; font-size: 14px; line-height: 1.5;">' +
            '<strong>Cancellation Reason:</strong><br>' + escapeHtml(d.cancellationReason) +
          '</div>'
        ) : '') +
        '<div style="background: #f9f6f0; border-left: 4px solid #c0392b; padding: 12px 14px; margin: 16px 0; line-height: 1.6; font-size: 14px;">' +
          '<strong>Order ID:</strong> #' + d.orderId + '<br>' +
          '<strong>Items:</strong> ' + d.items + '<br>' +
          '<strong>Total:</strong> ' + d.cost +
        '</div>';
      return renderLegacyWrapper(content);
    }

    function renderLegacyOrderMagicLink(d) {
      var manageUrl = siteUrl + '/order/manage/?orderId=' + d.orderId + '&token=' + d.manageToken;
      var content =
        '<p style="font-size: 15px; line-height: 1.5; color: #4a3b32; margin-top: 0;">' +
          'Here is your link to view and manage your Yellow Wing Roasters order.' +
        '</p>' +
        '<div style="background: #f9f6f0; border-left: 4px solid #f0c838; padding: 12px 14px; margin: 16px 0; line-height: 1.6; font-size: 14px;">' +
          '<strong>Order ID:</strong> #' + d.orderId + '<br>' +
          '<strong>Items:</strong> ' + d.items + '<br>' +
          '<strong>Total:</strong> ' + d.cost +
        '</div>' +
        '<div style="text-align: center; margin: 24px 0;">' +
          '<a href="' + manageUrl + '" style="display: inline-block; background-color: #2c1e14; color: #fdfbf7; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-size: 14px;">' +
            'Manage Your Order &rarr;' +
          '</a>' +
        '</div>';
      return renderLegacyWrapper(content);
    }

    function renderLegacyGiftRecipient(d) {
      var content =
        '<div style="display: inline-block; background-color: #f0c838; color: #2c1e14; font-family: \'Montserrat\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 999px; margin-bottom: 14px;">' +
          'Gift Code Inside' +
        '</div>' +
        '<p style="font-size: 15px; line-height: 1.5; color: #2c1e14; margin: 0 0 14px 0;">' +
          'Hello <strong>' + escapeHtml(d.recipientName) + '</strong>,<br><br>' +
          '<strong>' + escapeHtml(d.senderName) + '</strong> sent you a Yellow Wing Roasters digital gift card!' +
        '</p>' +
        (d.giftMessage ? (
          '<div style="background: #fdfbf7; border: 1px dashed #e8d085; border-radius: 6px; padding: 14px 16px; margin: 16px 0; font-style: italic; color: #443022; line-height: 1.5; font-size: 14px;">' +
            '&ldquo;' + escapeHtml(d.giftMessage) + '&rdquo;' +
            '<div style="font-style: normal; font-weight: bold; margin-top: 8px; font-size: 12px; color: #8a7060; text-align: right;">— ' + escapeHtml(d.senderName) + '</div>' +
          '</div>'
        ) : '') +
        '<div style="background-color: #faf7f2; border: 2px dashed #f0c838; border-radius: 8px; padding: 22px 18px; margin: 22px 0; text-align: center;">' +
          '<div style="font-family: \'Montserrat\', sans-serif; font-size: 32px; font-weight: 900; color: #2c1e14; margin-bottom: 8px;">$' + escapeHtml(d.giftAmount) + '</div>' +
          '<div style="font-family: monospace; font-size: 22px; font-weight: 700; letter-spacing: 3px; color: #2c1e14; background-color: #ffffff; padding: 10px 18px; border: 1px solid #e0d0c0; border-radius: 6px; display: inline-block;">' +
            escapeHtml(d.giftCode) +
          '</div>' +
        '</div>';
      return renderLegacyWrapper(content);
    }

    function renderLegacySubscription(d) {
      var content =
        '<p style="font-size: 15px; line-height: 1.5; color: #4a3b32; margin-top: 0;">' +
          'Your recurring coffee subscription is registered!' +
        '</p>' +
        '<div style="background: #f9f6f0; border-left: 4px solid #f0c838; padding: 12px 14px; margin: 16px 0; line-height: 1.6; font-size: 14px;">' +
          '<strong>Plan:</strong> ' + escapeHtml(d.subPlan) + '<br>' +
          '<strong>Frequency:</strong> ' + escapeHtml(d.subFrequency) + '<br>' +
          '<strong>Size:</strong> ' + escapeHtml(d.subSize) + '<br>' +
          '<strong>Grind:</strong> ' + escapeHtml(d.subGrind) +
        '</div>';
      return renderLegacyWrapper(content);
    }

    /* ── Render Dispatcher ── */

    function getRenderedHtml(templateId, isLegacy) {
      if (isLegacy) {
        if (templateId === 'order_confirmation') return renderLegacyOrderConfirmation(mockData);
        if (templateId === 'order_status') return renderLegacyOrderStatusUpdate(mockData);
        if (templateId === 'order_cancel') return renderLegacyOrderCancellation(mockData);
        if (templateId === 'order_magic_link') return renderLegacyOrderMagicLink(mockData);
        if (templateId === 'gift_recipient') return renderLegacyGiftRecipient(mockData);
        if (templateId === 'subscription') return renderLegacySubscription(mockData);
      } else {
        if (templateId === 'order_confirmation') return renderUpdatedOrderConfirmation(mockData);
        if (templateId === 'order_status') return renderUpdatedOrderStatusUpdate(mockData);
        if (templateId === 'order_cancel') return renderUpdatedOrderCancellation(mockData);
        if (templateId === 'order_magic_link') return renderUpdatedOrderMagicLink(mockData);
        if (templateId === 'gift_recipient') return renderUpdatedGiftRecipient(mockData);
        if (templateId === 'subscription') return renderUpdatedSubscription(mockData);
      }
      return '';
    }

    function renderStage() {
      // Toggle status row visibility
      statusRow.style.display = (currentTemplate === 'order_status') ? 'flex' : 'none';

      var maxWidth = currentViewport === 'mobile' ? '375px' : '560px';

      if (currentTheme === 'compare') {
        var updatedHtml = getRenderedHtml(currentTemplate, false);
        var legacyHtml = getRenderedHtml(currentTemplate, true);

        previewStage.innerHTML =
          '<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; align-items: flex-start; width: 100%;">' +
            '<div style="flex: 1; min-width: 320px; max-width: ' + maxWidth + ';">' +
              '<div style="font-family: \'Montserrat\', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #2c1e14; margin-bottom: 8px; text-align: center;">' +
                '✨ Updated Minimalist Theme (Matches Website)' +
              '</div>' +
              '<div style="border: 1px solid rgba(44, 30, 20, 0.12); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(44, 30, 20, 0.05);">' +
                updatedHtml +
              '</div>' +
            '</div>' +
            '<div style="flex: 1; min-width: 320px; max-width: ' + maxWidth + ';">' +
              '<div style="font-family: \'Montserrat\', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a7060; margin-bottom: 8px; text-align: center;">' +
                '⏳ Legacy Theme (Boxed Card / 900-wt Yellow)' +
              '</div>' +
              '<div style="border: 1px solid rgba(44, 30, 20, 0.12); border-radius: 12px; overflow: hidden; opacity: 0.85; box-shadow: 0 4px 20px rgba(44, 30, 20, 0.05);">' +
                legacyHtml +
              '</div>' +
            '</div>' +
          '</div>';
      } else {
        var isLegacy = (currentTheme === 'legacy');
        var html = getRenderedHtml(currentTemplate, isLegacy);
        var label = isLegacy ? 'Legacy Boxed Theme' : 'Updated Minimalist Theme';

        previewStage.innerHTML =
          '<div style="max-width: ' + maxWidth + '; margin: 0 auto; border: 1px solid rgba(44, 30, 20, 0.12); border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(44, 30, 20, 0.06);">' +
            html +
          '</div>';
      }
    }

    function showStatus(text) {
      copyStatusEl.textContent = text;
      setTimeout(function () {
        if (copyStatusEl.textContent === text) {
          copyStatusEl.textContent = '';
        }
      }, 3500);
    }

    /* ── Event Handlers ── */

    Array.prototype.forEach.call(templateTabs, function (tab) {
      tab.addEventListener('click', function () {
        var tmpl = tab.getAttribute('data-template');
        if (tmpl === currentTemplate) return;
        currentTemplate = tmpl;

        Array.prototype.forEach.call(templateTabs, function (t) {
          var active = (t === tab);
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        renderStage();
      });
    });

    Array.prototype.forEach.call(themeBtns, function (btn) {
      btn.addEventListener('click', function () {
        var thm = btn.getAttribute('data-theme');
        if (thm === currentTheme) return;
        currentTheme = thm;

        Array.prototype.forEach.call(themeBtns, function (b) {
          var active = (b === btn);
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-checked', active ? 'true' : 'false');
        });

        renderStage();
      });
    });

    Array.prototype.forEach.call(viewportBtns, function (btn) {
      btn.addEventListener('click', function () {
        var vp = btn.getAttribute('data-viewport');
        if (vp === currentViewport) return;
        currentViewport = vp;

        Array.prototype.forEach.call(viewportBtns, function (b) {
          var active = (b === btn);
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-checked', active ? 'true' : 'false');
        });

        renderStage();
      });
    });

    statusSelect.addEventListener('change', function () {
      currentStatusKey = statusSelect.value;
      renderStage();
    });

    copyHtmlBtn.addEventListener('click', function () {
      var isLegacy = (currentTheme === 'legacy');
      var html = getRenderedHtml(currentTemplate, isLegacy);
      navigator.clipboard.writeText(html).then(function () {
        showStatus('✓ Copied raw HTML to clipboard!');
      }).catch(function (err) {
        console.error('Copy failed:', err);
      });
    });

    copyGmailBtn.addEventListener('click', function () {
      var isLegacy = (currentTheme === 'legacy');
      var html = getRenderedHtml(currentTemplate, isLegacy);
      var htmlBlob = new Blob([html], { type: 'text/html' });
      var textBlob = new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
      var item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });
      navigator.clipboard.write([item]).then(function () {
        showStatus('✓ Copied formatted email! Paste directly (Cmd+V) into Gmail or email client.');
      }).catch(function (err) {
        console.error('Rich copy failed:', err);
      });
    });

    // Initial render
    renderStage();
  };
});
