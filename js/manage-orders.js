/**
 * Yellow Wing Roasters - Order Management Module
 * Handles secure token lookup, Magic Link dispatch, status tracking,
 * in-place item editing with live catalog lookups, and order cancellations.
 * Includes interactive Order Status Previewer for design & customer journey review.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initManageOrders = exp.initManageOrders;
    root.initOrderPreview = exp.initOrderPreview;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ----------------------------------------------------
  // Canonical Mock Database for All 7 Lifecycle Statuses
  // ----------------------------------------------------
  var DEFAULT_MOCK_DB = {
    "1001": {
      orderId: "1001",
      token: "mock-token-1",
      name: "Jane Doe",
      email: "jane@test.com",
      items: "1x Early Bird 12oz (Grind: Whole Bean), 1x Feather Soot 2lb (Grind: Medium — Drip / Filter)",
      total: "$40.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "Please call when ready",
      status: "Received",
      statusDetails: "",
      timestamp: "10/08/2026, 10:15:00 AM"
    },
    "1002": {
      orderId: "1002",
      token: "mock-token-2",
      name: "Sam Smith",
      email: "sam@test.com",
      items: "2x Colombia Supremo 12oz (Grind: Whole Bean)",
      total: "$24.00",
      deliveryMethod: "Hand delivery",
      address: "123 Elm St",
      city: "Guilford",
      state: "CT",
      zip: "06437",
      notes: "Leave by back porch",
      status: "Delayed",
      statusDetails: "Awaiting Colombia green bean shipment from importer, roasting scheduled for Friday.",
      timestamp: "10/07/2026, 02:30:00 PM"
    },
    "1003": {
      orderId: "1003",
      token: "mock-token-3",
      name: "Chris Brown",
      email: "chris@test.com",
      items: "1x Early Bird 2lb (Grind: Whole Bean)",
      total: "$26.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Roasted",
      statusDetails: "Freshly roasted and currently degassing.",
      timestamp: "10/06/2026, 11:45:00 AM"
    },
    "1004": {
      orderId: "1004",
      token: "mock-token-4",
      name: "Morgan Lee",
      email: "morgan@test.com",
      items: "1x Morning Meep 12oz (Grind: Whole Bean), 1x Colombia Supremo 12oz (Grind: Coarser — French Press)",
      total: "$24.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Ready for Pickup",
      statusDetails: "Your beans are roasted, bagged, and waiting in our pickup bin at 45 Soundview Rd, Guilford! Available Mon–Sat 8am–6pm.",
      timestamp: "10/05/2026, 08:30:00 AM"
    },
    "1005": {
      orderId: "1005",
      token: "mock-token-5",
      name: "Taylor Swift",
      email: "taylor@test.com",
      items: "1x Lil' Sipper 12oz (Grind: Whole Bean), 1x Guatemala Antigua 12oz (Grind: Medium — Drip / Filter)",
      total: "$22.00",
      deliveryMethod: "Hand delivery",
      address: "78 Broad St",
      city: "Guilford",
      state: "CT",
      zip: "06437",
      notes: "Ring bell twice",
      status: "Ready to Deliver",
      statusDetails: "Packed and out for afternoon delivery in Guilford. Estimated delivery between 2:00 PM and 4:30 PM.",
      timestamp: "10/04/2026, 09:15:00 AM"
    },
    "1006": {
      orderId: "1006",
      token: "mock-token-6",
      name: "Jordan Case",
      email: "jordan@test.com",
      items: "2x Feather Soot 12oz (Grind: Medium — Drip / Filter)",
      total: "$24.00",
      deliveryMethod: "Hand delivery",
      address: "44 River St",
      city: "Madison",
      state: "CT",
      zip: "06443",
      notes: "Leave by back door",
      status: "Delivered",
      statusDetails: "Left safely on the back porch as requested. Enjoy your fresh cup!",
      timestamp: "10/03/2026, 01:20:00 PM"
    },
    "1007": {
      orderId: "1007",
      token: "mock-token-7",
      name: "Robin Hood",
      email: "robin@test.com",
      items: "1x Early Bird 12oz (Grind: Whole Bean)",
      total: "$10.00",
      deliveryMethod: "Pickup",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      status: "Cancelled",
      statusDetails: "Customer requested cancellation.",
      timestamp: "10/02/2026, 10:00:00 AM"
    }
  };

  // Purge any stale mock storage keys from prior test sessions
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem('ywr_mock_orders');
      localStorage.removeItem('ywr_mock_orders_v2');
      localStorage.removeItem('ywr_mock_orders_v3');
      localStorage.removeItem('ywr_mock_orders_v4');
    } catch (e) {}
  }

  function getMockDb() {
    return JSON.parse(JSON.stringify(DEFAULT_MOCK_DB));
  }

  function resetMockDb() {
    return getMockDb();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getStatusBadgeClass(status) {
    var s = (status || '').toLowerCase();
    if (s === 'received') return 'status-received';
    if (s === 'delayed') return 'status-delayed';
    if (s === 'roasted') return 'status-roasted';
    if (s === 'ready for pickup' || s === 'ready to deliver' || s === 'out for delivery') return 'status-ready';
    if (s === 'delivered') return 'status-delivered';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-received';
  }

  function findRoastKeyByTitle(title, roastsData) {
    if (!title || !roastsData) return null;
    var normTitle = title.toLowerCase().replace(/['’]/g, '');
    var keys = Object.keys(roastsData);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var rTitle = (roastsData[k].title || '').toLowerCase().replace(/['’]/g, '');
      if (rTitle === normTitle) {
        return k;
      }
    }
    return null;
  }

  function parseOrderItems(itemsString, roastsData, defaultGrind) {
    if (!itemsString) return [];
    var parts = itemsString.split(/,\s*(?=\d+x\s+)/);
    var result = [];

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      var qtyMatch = part.match(/^(\d+)x\s+(.+)$/);
      var qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
      var rest = qtyMatch ? qtyMatch[2] : part;

      var detailsMatch = rest.match(/\((.*?)\)$/);
      var detailsStr = detailsMatch ? detailsMatch[1] : '';
      var mainPart = detailsMatch ? rest.replace(/\s*\(.*?\)$/, '').trim() : rest;

      var sizeMatch = mainPart.match(/(12oz|1lb|2lb|5lb)$/);
      var size = sizeMatch ? sizeMatch[1] : '12oz';
      var namePart = sizeMatch ? mainPart.replace(/(12oz|1lb|2lb|5lb)$/, '').trim() : mainPart;

      var grind = defaultGrind || 'Whole Bean';
      var roastLevel = '';
      if (detailsStr) {
        var grindMatch = detailsStr.match(/Grind:\s*([^,)]+)/i);
        if (grindMatch) grind = grindMatch[1].trim();

        var levelMatch = detailsStr.match(/Roast:\s*([^,)]+)/i);
        if (levelMatch) roastLevel = levelMatch[1].trim();
      }

      var roastSlug = findRoastKeyByTitle(namePart, roastsData) || namePart.toLowerCase().replace(/['’]/g, '').replace(/\s+/g, '-');
      var roastConfig = roastsData[roastSlug];
      var unitPrice = (roastConfig && roastConfig.prices) ? roastConfig.prices[size] : 0;

      result.push({
        qty: qty,
        slug: roastSlug,
        label: (roastConfig && roastConfig.title) ? roastConfig.title : namePart,
        size: size,
        grind: grind,
        roastLevel: roastLevel,
        unitPrice: unitPrice
      });
    }

    return result;
  }

  // ----------------------------------------------------
  // Core Order Card Rendering (Shared by Live & Preview)
  // ----------------------------------------------------
  function renderOrderCard(order, targetContainer, options) {
    options = options || {};
    var roastsData = options.roastsData || (typeof window !== 'undefined' ? window.YWR_ROASTS_DATA : {}) || {};
    var defaultGrind = options.defaultGrind || (typeof window !== 'undefined' ? window.YWR_DEFAULT_GRIND : 'Whole Bean') || 'Whole Bean';
    var isMockMode = !!options.isMockMode;
    var apiUrl = options.apiUrl || '';
    var onMutate = options.onMutate || function () {};

    targetContainer.innerHTML = '';

    var lowerStatus = (order.status || '').toLowerCase();
    var canCancel = (lowerStatus === 'received' || lowerStatus === 'delayed');
    var parsedItems = parseOrderItems(order.items, roastsData, defaultGrind);

    var card = document.createElement('div');
    card.className = 'order-card';

    var badgeClass = getStatusBadgeClass(order.status);

    var html = '<div class="order-header">' +
      '<h3 class="order-title">Order #' + escapeHtml(order.orderId) + '</h3>' +
      '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
      '</div>';

    if (order.timestamp) {
      html += '<div class="order-date">Placed: ' + escapeHtml(order.timestamp) + '</div>';
    }

    // Delay Banner
    if (lowerStatus === 'delayed' && order.statusDetails) {
      html += '<div class="order-delay-box">' +
        '<strong>Roaster Update (Delay):</strong>' +
        escapeHtml(order.statusDetails) +
        '</div>';
    }

    // Roasted Banner
    if (lowerStatus === 'roasted') {
      html += '<div class="order-roasted-box">' +
        '<strong>Coffee Freshly Roasted:</strong> Your batch has been roasted and is currently degassing.' +
        '</div>';
    }

    // Ready for Pickup / Delivery Banner
    if (lowerStatus === 'ready for pickup') {
      html += '<div class="order-ready-box">' +
        '<strong>Pickup Instructions:</strong> ' +
        (order.statusDetails ? escapeHtml(order.statusDetails) : 'Your coffee is roasted, packaged, and ready for pickup!') +
        '</div>';
    } else if (lowerStatus === 'ready to deliver' || lowerStatus === 'out for delivery') {
      html += '<div class="order-ready-box">' +
        '<strong>Out for Delivery:</strong> ' +
        (order.statusDetails ? escapeHtml(order.statusDetails) : 'Your coffee is packaged and on its way to your doorstep today!') +
        '</div>';
    } else if (lowerStatus === 'delivered') {
      html += '<div class="order-delivered-box">' +
        '<strong>Order Delivered:</strong> Your coffee has been hand delivered. ' +
        (order.statusDetails ? escapeHtml(order.statusDetails) : 'Enjoy every fresh cup!') +
        '</div>';
    } else if (lowerStatus === 'cancelled') {
      html += '<div class="order-cancelled-box">' +
        '<strong>Order Cancelled:</strong> This order has been cancelled.' +
        (order.statusDetails ? ' ' + escapeHtml(order.statusDetails) : '') +
        '</div>';
    }

    // Delivery Method Meta
    html += '<div class="order-delivery-meta">' +
      '<strong>Delivery Method:</strong> ' + escapeHtml(order.deliveryMethod);
    if (order.deliveryMethod === 'Hand delivery' && order.address) {
      html += ' &bull; ' + escapeHtml(order.address) + ', ' + escapeHtml(order.city) + ' ' + escapeHtml(order.state) + ' ' + escapeHtml(order.zip);
    }
    html += '</div>';

    // Items Box Display
    html += '<div class="order-items-box" id="order-items-box">';
    parsedItems.forEach(function (it) {
      html += '<div class="order-item-line">' +
        '<div class="order-item-desc">' +
        '<div class="order-item-name">' + it.qty + 'x ' + escapeHtml(it.label) + '</div>' +
        '<div class="order-item-meta">' + escapeHtml(it.size) + ' &bull; ' + escapeHtml(it.grind) + (it.roastLevel ? ' &bull; ' + escapeHtml(it.roastLevel) : '') + '</div>' +
        '</div>' +
        '<div class="order-item-price">$' + (it.unitPrice * it.qty).toFixed(2) + '</div>' +
        '</div>';
    });

    html += '<div class="order-summary-row">' +
      '<span class="order-total-label">Total</span>' +
      '<span class="order-total-val">' + escapeHtml(order.total) + '</span>' +
      '</div>' +
      '</div>';

    // Action Buttons (Orders are immutable; cancellation allowed before roasting)
    if (canCancel) {
      html += '<div class="sub-actions" id="order-actions-container">' +
        '<button id="cancel-order-btn" class="action-pill-btn btn-danger-pill">Cancel Order</button>' +
        '</div>' +
        '<div class="cancel-reason-container" id="cancel-reason-container" style="display: none;">' +
        '<p class="cancel-confirm-prompt">Are you sure you want to cancel this order?</p>' +
        '<div class="cancel-reason-actions">' +
        '<button id="confirm-cancel-btn" class="action-pill-btn btn-danger-pill">Confirm Cancellation</button>' +
        '<button id="abort-cancel-btn" class="action-pill-btn btn-secondary-pill">Keep Order</button>' +
        '</div>' +
        '</div>';
    }

    card.innerHTML = html;
    targetContainer.appendChild(card);

    // Event Listeners Wiring
    var cancelBtn = card.querySelector('#cancel-order-btn');
    var cancelReasonContainer = card.querySelector('#cancel-reason-container');
    var confirmCancelBtn = card.querySelector('#confirm-cancel-btn');
    var abortCancelBtn = card.querySelector('#abort-cancel-btn');
    var actionsContainer = card.querySelector('#order-actions-container');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        actionsContainer.style.display = 'none';
        cancelReasonContainer.style.display = 'block';
      });
    }

    if (abortCancelBtn) {
      abortCancelBtn.addEventListener('click', function () {
        cancelReasonContainer.style.display = 'none';
        actionsContainer.style.display = 'flex';
      });
    }

    if (confirmCancelBtn) {
      confirmCancelBtn.addEventListener('click', function () {
        confirmCancelBtn.textContent = 'Cancelling...';
        confirmCancelBtn.disabled = true;

        if (isMockMode) {
          setTimeout(function () {
            order.status = 'Cancelled';
            order.statusDetails = '';
            renderOrderCard(order, targetContainer, options);
            onMutate(order);
          }, 300);
        } else {
          fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
              action: 'cancel',
              orderId: order.orderId,
              token: order.token
            })
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              alert(data.error);
              confirmCancelBtn.textContent = 'Confirm Cancellation';
              confirmCancelBtn.disabled = false;
            } else {
              order.status = 'Cancelled';
              order.statusDetails = '';
              renderOrderCard(order, targetContainer, options);
              onMutate(order);
            }
          })
          .catch(function (err) {
            console.error('executeCancellation: Network error:', err);
            alert('Technical glitch cancelling order. Please reach out to orders@yellowwingroasters.com');
            confirmCancelBtn.textContent = 'Confirm Cancellation';
            confirmCancelBtn.disabled = false;
          });
        }
      });
    }
  }

  // ----------------------------------------------------
  // Module 1: Production Manage Order Controller (/order/manage/)
  // ----------------------------------------------------
  function initManageOrders(options) {
    options = options || {};
    var API_URL = options.apiUrl || '';
    var roastsData = options.roastsData || (typeof window !== 'undefined' ? window.YWR_ROASTS_DATA : {}) || {};
    var defaultGrind = options.defaultGrind || (typeof window !== 'undefined' ? window.YWR_DEFAULT_GRIND : 'Whole Bean') || 'Whole Bean';

    var isMockMode = (!API_URL || API_URL.indexOf("YOUR_ORDER_API_DEPLOYMENT_ID") >= 0 || API_URL.trim() === "");

    var lookupSection = document.getElementById('order-lookup-section');
    var lookupForm = document.getElementById('order-lookup-form');
    var lookupEmail = document.getElementById('order-lookup-email');
    var lookupId = document.getElementById('order-lookup-id');
    var lookupBtn = document.getElementById('order-lookup-btn');
    var lookupStatus = document.getElementById('order-lookup-status');

    var resultsSection = document.getElementById('order-results-section');
    var resultsIdDisplay = document.getElementById('order-results-id-display');
    var orderContent = document.getElementById('order-content');
    var mockIndicator = document.getElementById('order-mock-indicator');
    var mockPreviewBanner = document.getElementById('order-mock-preview-banner');

    if (isMockMode) {
      if (mockIndicator) mockIndicator.style.display = 'inline-block';
      if (mockPreviewBanner) mockPreviewBanner.style.display = 'flex';
    }

    var cardOptions = {
      roastsData: roastsData,
      defaultGrind: defaultGrind,
      isMockMode: isMockMode,
      apiUrl: API_URL
    };

    // Unauthenticated Lookup: Request Magic Link
    if (lookupForm) {
      lookupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = lookupEmail.value.trim().toLowerCase();
        var orderId = lookupId.value.trim();

        if (!email || !orderId) return;

        lookupStatus.textContent = 'Sending secure link…';
        lookupStatus.className = 'order-status order-status-pending';
        lookupBtn.disabled = true;

        if (isMockMode) {
          setTimeout(function () {
            lookupBtn.disabled = false;
            var currentDb = getMockDb();
            var matched = currentDb[orderId];
            if (matched && matched.email.toLowerCase() === email) {
              lookupStatus.textContent = 'Secure link sent to ' + email + '! (In Mock Mode, access token is: ' + matched.token + ')';
              lookupStatus.className = 'order-status order-status-success';
              var testLink = document.createElement('div');
              testLink.className = 'order-mock-link-wrap';
              testLink.innerHTML = '<a href="/order/manage/?orderId=' + orderId + '&token=' + matched.token + '" class="order-mock-link">&rarr; Open Order #' + orderId + '</a>';
              lookupStatus.appendChild(testLink);
            } else {
              lookupStatus.textContent = "If an order matches that information, we've emailed a secure link to manage it.";
              lookupStatus.className = 'order-status order-status-success';
            }
          }, 400);
        } else {
          fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
              action: 'request_link',
              email: email,
              orderId: orderId
            })
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            lookupBtn.disabled = false;
            lookupStatus.textContent = data.message || "If an order matches that information, we've emailed a secure link to manage it.";
            lookupStatus.className = 'order-status order-status-success';
          })
          .catch(function (err) {
            console.error('request_link: Network error:', err);
            lookupBtn.disabled = false;
            lookupStatus.textContent = "Technical glitch. Please contact orders@yellowwingroasters.com";
            lookupStatus.className = 'order-status order-status-error';
          });
        }
      });
    }

    // URL Parameter Parsing & Direct Authenticated Loading
    var urlParams = new URLSearchParams(window.location.search);
    var urlOrderId = urlParams.get('orderId');
    var urlToken = urlParams.get('token');

    if (urlOrderId && urlToken) {
      if (lookupSection) lookupSection.style.display = 'none';
      if (resultsSection) resultsSection.style.display = 'block';
      if (resultsIdDisplay) resultsIdDisplay.textContent = 'Order #' + urlOrderId;

      if (isMockMode) {
        var currentDb = getMockDb();
        var mockOrder = currentDb[urlOrderId];
        if (mockOrder && mockOrder.token === urlToken) {
          renderOrderCard(mockOrder, orderContent, cardOptions);
        } else {
          orderContent.innerHTML = '<p class="order-msg-error">Unauthorized: Invalid or expired access token for Order #' + escapeHtml(urlOrderId) + '.</p>';
        }
      } else {
        orderContent.innerHTML = '<p class="order-msg-loading">Loading order details…</p>';
        var fetchUrl = API_URL + '?orderId=' + encodeURIComponent(urlOrderId) + '&token=' + encodeURIComponent(urlToken);

        fetch(fetchUrl)
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              orderContent.innerHTML = '<p class="order-msg-error">' + escapeHtml(data.error) + '</p>';
            } else if (data.order) {
              renderOrderCard(data.order, orderContent, cardOptions);
            }
          })
          .catch(function (err) {
            console.error('loadOrder: Error loading order:', err);
            orderContent.innerHTML = '<p class="order-msg-error">Could not load order details. Please reach out to orders@yellowwingroasters.com</p>';
          });
      }
    }
  }

  // ----------------------------------------------------
  // Module 2: Order Status Preview Controller (/order/preview/)
  // ----------------------------------------------------
  var PREVIEW_STAGES = [
    { id: '1001', label: 'Received', defaultStatus: 'Received' },
    { id: '1002', label: 'Delayed', defaultStatus: 'Delayed' },
    { id: '1003', label: 'Roasted', defaultStatus: 'Roasted' },
    { id: '1004', label: 'Ready for Pickup', defaultStatus: 'Ready for Pickup' },
    { id: '1005', label: 'Ready to Deliver', defaultStatus: 'Ready to Deliver' },
    { id: '1006', label: 'Delivered', defaultStatus: 'Delivered' },
    { id: '1007', label: 'Cancelled', defaultStatus: 'Cancelled' }
  ];

  function initOrderPreview(options) {
    options = options || {};
    var rootEl = document.getElementById(options.containerId || 'order-preview-root');
    var roastsData = options.roastsData || (typeof window !== 'undefined' ? window.YWR_ROASTS_DATA : {}) || {};
    var defaultGrind = options.defaultGrind || (typeof window !== 'undefined' ? window.YWR_DEFAULT_GRIND : 'Whole Bean') || 'Whole Bean';

    var activeTab = '1001';

    function renderPreviewView() {
      rootEl.innerHTML = '';

      // Toolbar Container
      var toolbar = document.createElement('div');
      toolbar.className = 'order-preview-toolbar';

      var toolbarTitle = document.createElement('div');
      toolbarTitle.className = 'order-preview-toolbar-title';
      toolbarTitle.textContent = 'Select Lifecycle Stage to Preview:';
      toolbar.appendChild(toolbarTitle);

      var tabsContainer = document.createElement('div');
      tabsContainer.className = 'order-preview-tabs';

      // Status Pill Tabs
      PREVIEW_STAGES.forEach(function (stage) {
        var tabBtn = document.createElement('button');
        tabBtn.type = 'button';
        tabBtn.className = 'order-preview-tab' + (activeTab === stage.id ? ' order-preview-tab--active' : '');
        tabBtn.textContent = stage.label;
        tabBtn.addEventListener('click', function () {
          activeTab = stage.id;
          renderPreviewView();
        });
        tabsContainer.appendChild(tabBtn);
      });

      // Stacked Mode Tab
      var allTabBtn = document.createElement('button');
      allTabBtn.type = 'button';
      allTabBtn.className = 'order-preview-tab' + (activeTab === 'all' ? ' order-preview-tab--active' : '');
      allTabBtn.textContent = '📑 All Statuses (Stacked)';
      allTabBtn.addEventListener('click', function () {
        activeTab = 'all';
        renderPreviewView();
      });
      tabsContainer.appendChild(allTabBtn);

      toolbar.appendChild(tabsContainer);

      // Info Box for active selection
      var infoBox = document.createElement('div');
      infoBox.className = 'order-preview-info-box';

      if (activeTab === 'all') {
        infoBox.innerHTML = '<span>Comparing all 7 order lifecycle stages sequentially.</span>';
      } else {
        var currentOrder = DEFAULT_MOCK_DB[activeTab];
        var badgeCls = getStatusBadgeClass(currentOrder.status);

        var infoHtml = '<div class="order-preview-perm-item"><strong>Status:</strong> <span class="status-badge ' + badgeCls + '">' + escapeHtml(currentOrder.status) + '</span></div>' +
          '<div><a href="/order/manage/?orderId=' + currentOrder.orderId + '&token=' + currentOrder.token + '" class="order-preview-link-btn" target="_blank">Open in /order/manage/ &rarr;</a></div>';

        infoBox.innerHTML = infoHtml;
      }

      toolbar.appendChild(infoBox);
      rootEl.appendChild(toolbar);

      // Card Area
      var cardsArea = document.createElement('div');
      cardsArea.id = 'order-preview-cards-area';
      rootEl.appendChild(cardsArea);

      var cardOptions = {
        roastsData: roastsData,
        defaultGrind: defaultGrind,
        isMockMode: true
      };

      if (activeTab === 'all') {
        // Stacked View: Render all 7 orders in succession
        PREVIEW_STAGES.forEach(function (stage) {
          var ord = JSON.parse(JSON.stringify(DEFAULT_MOCK_DB[stage.id]));

          var sectionHeader = document.createElement('div');
          sectionHeader.className = 'order-preview-stack-header';
          sectionHeader.innerHTML = '<h3 class="order-preview-stack-title">' + escapeHtml(stage.label) + ' &bull; Order #' + ord.orderId + '</h3>' +
            '<a href="/order/manage/?orderId=' + ord.orderId + '&token=' + ord.token + '" class="order-preview-link-btn" target="_blank">Direct Link &rarr;</a>';
          cardsArea.appendChild(sectionHeader);

          var cardSlot = document.createElement('div');
          cardsArea.appendChild(cardSlot);
          renderOrderCard(ord, cardSlot, cardOptions);
        });
      } else {
        // Single View: Render selected order card
        var singleOrder = JSON.parse(JSON.stringify(DEFAULT_MOCK_DB[activeTab]));
        var singleSlot = document.createElement('div');
        cardsArea.appendChild(singleSlot);
        renderOrderCard(singleOrder, singleSlot, cardOptions);
      }
    }

    renderPreviewView();
  }

  initManageOrders.initManageOrders = initManageOrders;
  initManageOrders.initOrderPreview = initOrderPreview;
  initManageOrders.parseOrderItems = parseOrderItems;
  initManageOrders.resetMockDb = resetMockDb;

  return initManageOrders;
});
