/**
 * Yellow Wing Roasters - Owner Order Dashboard Controller (/order/admin/)
 * Provides secure owner authentication, live queue management, filtering & search,
 * and roaster status updates with automatic customer email dispatch.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminOrders = exp.initAdminOrders;
    root.filterOrders = exp.filterOrders;
    root.computeStats = exp.computeStats;
    root.getStatusBadgeClass = exp.getStatusBadgeClass;
    root.computeBrowserHash = exp.computeBrowserHash;
    root.DEFAULT_MOCK_HASH = exp.DEFAULT_MOCK_HASH;
    root.DEFAULT_MOCK_PASSCODE = exp.DEFAULT_MOCK_PASSCODE;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_MOCK_PASSCODE = 'yellowwing-roaster-secret';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var DEFAULT_MOCK_HASH = '35ad8e83336a3fd0137981caaaa1e2c0d63260378aab3a1d3c4dc2b372f2d7f3';

  function computeBrowserHash(key, salt) {
    salt = salt || DEFAULT_SALT;
    var rawText = salt + (key || '').trim();
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      var msg = new TextEncoder().encode(rawText);
      return crypto.subtle.digest('SHA-256', msg).then(function (buf) {
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    return Promise.resolve('');
  }

  var CANONICAL_MOCK_ORDERS = [
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
  ];

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

  function computeStats(orders) {
    var total = orders.length;
    var received = 0;
    var delayed = 0;
    var roasted = 0;
    var readyForPickup = 0;
    var readyToDeliver = 0;
    var delivered = 0;
    var cancelled = 0;

    for (var i = 0; i < orders.length; i++) {
      var s = (orders[i].status || '').toLowerCase();
      if (s === 'received') received++;
      else if (s === 'delayed') delayed++;
      else if (s === 'roasted') roasted++;
      else if (s === 'ready for pickup') readyForPickup++;
      else if (s === 'ready to deliver' || s === 'out for delivery') readyToDeliver++;
      else if (s === 'delivered') delivered++;
      else if (s === 'cancelled') cancelled++;
    }

    return {
      total: total,
      received: received,
      delayed: delayed,
      roasted: roasted,
      readyForPickup: readyForPickup,
      readyToDeliver: readyToDeliver,
      delivered: delivered,
      cancelled: cancelled
    };
  }

  function filterOrders(orders, filterCategory, searchQuery) {
    var result = orders.slice();

    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(function (order) {
        var s = (order.status || '').toLowerCase();
        if (filterCategory === 'received') return s === 'received';
        if (filterCategory === 'delayed') return s === 'delayed';
        if (filterCategory === 'roasted') return s === 'roasted';
        if (filterCategory === 'ready_for_pickup') return s === 'ready for pickup';
        if (filterCategory === 'ready_to_deliver') return s === 'ready to deliver' || s === 'out for delivery';
        if (filterCategory === 'delivered') return s === 'delivered';
        if (filterCategory === 'cancelled') return s === 'cancelled';
        return true;
      });
    }

    if (searchQuery) {
      var q = searchQuery.toLowerCase().trim();
      result = result.filter(function (order) {
        var text = [
          order.orderId || '',
          order.name || '',
          order.email || '',
          order.items || '',
          order.deliveryMethod || '',
          order.status || '',
          order.notes || ''
        ].join(' ').toLowerCase();
        return text.indexOf(q) !== -1;
      });
    }

    return result;
  }

  function initAdminOrders(options) {
    options = options || {};
    var apiUrl = options.apiUrl || '';
    var manageBaseUrl = options.manageBaseUrl || '/order/manage/';

    var hasMockParam = typeof window !== 'undefined' &&
      (window.location.search.indexOf('mock=1') !== -1 || window.location.search.indexOf('demo=1') !== -1);

    var gateSection = document.getElementById('order-admin-gate-section');
    var gateForm = document.getElementById('order-admin-gate-form');
    var passcodeInput = document.getElementById('order-admin-passcode-input');
    var gateError = document.getElementById('order-admin-gate-error');
    var gateBtn = document.getElementById('order-admin-gate-btn');

    var dashboardSection = document.getElementById('order-admin-dashboard-section');
    var statsContainer = document.getElementById('order-admin-stats');
    var refreshBtn = document.getElementById('order-admin-refresh-btn');
    var logoutBtn = document.getElementById('order-admin-logout-btn');
    var filtersContainer = document.getElementById('order-admin-filters');
    var searchInput = document.getElementById('order-admin-search-input');
    var queueContainer = document.getElementById('order-admin-queue');
    var inspectorContainer = document.getElementById('order-admin-inspector');

    var currentOrders = [];
    var activeFilter = 'all';
    var currentSearch = '';
    var selectedOrderId = null;
    var isMockModeActive = false;
    var isDeliveredCollapsed = true;
    var isCancelledCollapsed = true;

    function getStoredKey() {
      try {
        return sessionStorage.getItem(STORAGE_KEY) || '';
      } catch (e) {
        return '';
      }
    }

    function saveKey(key) {
      try {
        sessionStorage.setItem(STORAGE_KEY, key);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('ywr-admin-authenticated');
        }
      } catch (e) {}
    }

    function clearStoredKey() {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('ywr-admin-authenticated');
        }
      } catch (e) {}
    }

    function showGate(errorMessage) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('ywr-admin-authenticated');
      }
      if (dashboardSection) dashboardSection.style.display = 'none';
      if (gateSection) gateSection.style.display = 'block';
      if (gateError) {
        if (errorMessage) {
          gateError.textContent = errorMessage;
          gateError.style.display = 'block';
        } else {
          gateError.style.display = 'none';
        }
      }
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.focus();
      }
    }

    function showDashboard() {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('ywr-admin-authenticated');
      }
      if (gateSection) gateSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'block';
    }

    function renderStats() {
      var stats = computeStats(currentOrders);
      var html = '<span class="order-admin-stat-pill order-admin-stat-pill--highlight">Total: ' + stats.total + '</span>' +
        '<span class="order-admin-stat-pill">Received: ' + stats.received + '</span>';

      if (stats.delayed > 0) {
        html += '<span class="order-admin-stat-pill" style="color: #b45309; background: #fef3c7;">Delayed: ' + stats.delayed + '</span>';
      }

      if (stats.roasted > 0) {
        html += '<span class="order-admin-stat-pill">Roasted: ' + stats.roasted + '</span>';
      }

      if (stats.readyForPickup > 0) {
        html += '<span class="order-admin-stat-pill">Ready for Pickup: ' + stats.readyForPickup + '</span>';
      }

      if (stats.readyToDeliver > 0) {
        html += '<span class="order-admin-stat-pill">Ready to Deliver: ' + stats.readyToDeliver + '</span>';
      }

      html += '<span class="order-admin-stat-pill">Delivered: ' + stats.delivered + '</span>';

      if (isMockModeActive) {
        html += '<span class="order-admin-stat-pill" style="color: #92400e; background: #fde68a; font-weight: 800;">MOCK MODE</span>';
      }

      statsContainer.innerHTML = html;
    }

    function formatPrice(val) {
      if (!val && val !== 0) return '';
      var str = String(val).trim();
      if (!str) return '';
      var clean = str.replace(/^\$/, '').trim();
      var num = parseFloat(clean);
      if (!isNaN(num) && clean.match(/^\d+(\.\d+)?$/)) {
        return '$' + num.toFixed(2);
      }
      if (str.charAt(0) === '$') return str;
      return '$' + str;
    }

    function parseOrderItems(raw) {
      if (!raw) return [];
      var str = String(raw).trim();
      if (!str) return [];

      if (str.indexOf('\n') !== -1) {
        return str.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      }

      var parts = [];
      var current = '';
      var depth = 0;
      for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (char === '(') depth++;
        else if (char === ')') depth = Math.max(0, depth - 1);

        if (char === ',' && depth === 0) {
          if (current.trim()) parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) parts.push(current.trim());
      return parts;
    }

    function renderInspector(order) {
      if (!order) {
        inspectorContainer.innerHTML = '<div class="order-admin-inspector-empty">Select an order from the queue to view details and update fulfillment status.</div>';
        return;
      }

      var badgeClass = getStatusBadgeClass(order.status);
      var magicLinkUrl = manageBaseUrl + (manageBaseUrl.indexOf('?') === -1 ? '?' : '&') +
        'orderId=' + encodeURIComponent(order.orderId) + '&token=' + encodeURIComponent(order.token || '');

      var fulfillmentHtml = '<div class="order-admin-info-line"><strong>Method:</strong> ' + escapeHtml(order.deliveryMethod || 'Pickup') + '</div>';
      if ((order.deliveryMethod || '').toLowerCase() === 'hand delivery' && order.address) {
        var addressLine = escapeHtml(order.address) + (order.city ? ', ' + escapeHtml(order.city) : '') +
          (order.state ? ' ' + escapeHtml(order.state) : '') + (order.zip ? ' ' + escapeHtml(order.zip) : '');
        fulfillmentHtml += '<div class="order-admin-info-line"><strong>Address:</strong> ' + addressLine + '</div>';
      }

      var notesHtml = '';
      if (order.notes) {
        notesHtml = '<div class="order-admin-section-block">' +
          '<div class="order-admin-section-label">Customer Instructions</div>' +
          '<div class="order-admin-info-line">' + escapeHtml(order.notes) + '</div>' +
          '</div>';
      }

      var itemLines = parseOrderItems(order.items);
      var itemsBoxHtml = '';
      if (itemLines.length === 0) {
        itemsBoxHtml = '<div class="order-admin-items-box">No items listed</div>';
      } else {
        itemsBoxHtml = '<div class="order-admin-items-box">' +
          '<ul class="order-admin-items-list">' +
          itemLines.map(function (it) {
            return '<li>' + escapeHtml(it) + '</li>';
          }).join('') +
          '</ul>' +
          '</div>';
      }

      var formattedTotal = formatPrice(order.total);
      var totalHtml = formattedTotal
        ? '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
          '<span class="order-admin-inspector-price">' + escapeHtml(formattedTotal) + '</span>'
        : '';

      var html = '<div class="order-admin-inspector-header">' +
        '<div class="order-admin-inspector-title-wrap">' +
        '<h3 class="order-admin-inspector-title">Order #' + escapeHtml(order.orderId) + '</h3>' +
        totalHtml +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Contact</div>' +
        '<div class="order-admin-info-line"><strong>Name:</strong> ' + escapeHtml(order.name || 'Customer') + '</div>' +
        '<div class="order-admin-info-line"><strong>Email:</strong> <a href="mailto:' + escapeHtml(order.email) + '">' + escapeHtml(order.email) + '</a></div>' +
        (order.timestamp ? '<div class="order-admin-info-line"><strong>Placed:</strong> ' + escapeHtml(order.timestamp) + '</div>' : '') +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Fulfillment Details</div>' +
        fulfillmentHtml +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Ordered Items</div>' +
        itemsBoxHtml +
        '</div>' +

        notesHtml +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Portal Link</div>' +
        '<div class="order-admin-info-line"><a href="' + magicLinkUrl + '" target="_blank" rel="noopener">Open Customer View &rarr;</a></div>' +
        '</div>' +

        '<div class="order-admin-status-box">' +
        '<div class="order-admin-section-label">Fulfillment Status</div>' +
        '<select id="admin-status-select" class="order-admin-status-picker">' +
        '<option value="Received"' + (order.status === 'Received' ? ' selected' : '') + '>Received</option>' +
        '<option value="Delayed"' + (order.status === 'Delayed' ? ' selected' : '') + '>Delayed</option>' +
        '<option value="Roasted"' + (order.status === 'Roasted' ? ' selected' : '') + '>Roasted</option>' +
        '<option value="Ready for Pickup"' + (order.status === 'Ready for Pickup' ? ' selected' : '') + '>Ready for Pickup</option>' +
        '<option value="Ready to Deliver"' + (order.status === 'Ready to Deliver' ? ' selected' : '') + '>Ready to Deliver</option>' +
        '<option value="Delivered"' + (order.status === 'Delivered' ? ' selected' : '') + '>Delivered</option>' +
        '<option value="Cancelled"' + (order.status === 'Cancelled' ? ' selected' : '') + '>Cancelled</option>' +
        '</select>' +
        '<textarea id="admin-status-details" class="order-admin-textarea" placeholder="Update notes, delay reason, or pickup instructions...">' +
        escapeHtml(order.statusDetails || '') +
        '</textarea>' +
        '<label class="order-admin-checkbox-label">' +
        '<input type="checkbox" id="admin-notify-customer">' +
        '<span>Send email notification to customer (BCC roaster)</span>' +
        '</label>' +
        '<div id="admin-notice-pill" class="order-admin-notice-pill">' +
        '<span>🔕 Silent update: No email will be sent to the customer.</span>' +
        '</div>' +
        '<button type="button" id="admin-save-status-btn" class="order-admin-save-btn">Save Status</button>' +
        '<div id="admin-status-feedback" class="order-admin-feedback" style="display: none;"></div>' +
        '</div>';

      inspectorContainer.innerHTML = html;

      var saveBtn = document.getElementById('admin-save-status-btn');
      var statusSelect = document.getElementById('admin-status-select');
      var detailsTextarea = document.getElementById('admin-status-details');
      var notifyCheckbox = document.getElementById('admin-notify-customer');
      var noticePill = document.getElementById('admin-notice-pill');
      var feedbackDiv = document.getElementById('admin-status-feedback');

      if (notifyCheckbox && saveBtn && noticePill) {
        notifyCheckbox.addEventListener('change', function () {
          if (notifyCheckbox.checked) {
            saveBtn.textContent = 'Save & Send Notification';
            noticePill.className = 'order-admin-notice-pill order-admin-notice-pill--notify';
            noticePill.innerHTML = '<span>⚡ Status update email will be sent to customer and BCC roaster.</span>';
          } else {
            saveBtn.textContent = 'Save Status';
            noticePill.className = 'order-admin-notice-pill';
            noticePill.innerHTML = '<span>🔕 Silent update: No email will be sent to the customer.</span>';
          }
        });
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', function () {
          var newStatus = statusSelect.value;
          var newDetails = detailsTextarea.value.trim();
          var shouldNotify = notifyCheckbox ? notifyCheckbox.checked : false;

          saveBtn.disabled = true;
          saveBtn.textContent = shouldNotify ? 'Saving & Notifying...' : 'Saving...';
          feedbackDiv.style.display = 'none';

          updateOrderStatus(order.orderId, newStatus, newDetails, shouldNotify, function (err, res) {
            saveBtn.disabled = false;
            saveBtn.textContent = shouldNotify ? 'Save & Send Notification' : 'Save Status';

            if (err) {
              feedbackDiv.className = 'order-admin-feedback order-admin-feedback--error';
              feedbackDiv.textContent = 'Failed to update: ' + err;
              feedbackDiv.style.display = 'block';
            } else {
              order.status = newStatus;
              order.statusDetails = newDetails;

              renderStats();
              renderQueue();
              renderInspector(order);

              var newFeedbackDiv = document.getElementById('admin-status-feedback');
              newFeedbackDiv.className = 'order-admin-feedback order-admin-feedback--success';
              newFeedbackDiv.textContent = '✓ Order #' + order.orderId + ' updated to ' + newStatus + (shouldNotify ? ' (email sent)!' : ' (saved silently)!');
              newFeedbackDiv.style.display = 'block';
            }
          });
        });
      }
    }

    function createCardElement(order) {
      var card = document.createElement('div');
      card.className = 'order-admin-card-item' + (order.orderId === selectedOrderId ? ' order-admin-card-item--selected' : '');
      card.setAttribute('data-order-id', order.orderId);

      var badgeClass = getStatusBadgeClass(order.status);
      var timeHtml = order.timestamp ? '<span class="order-admin-card-time">' + escapeHtml(order.timestamp) + '</span>' : '';

      card.innerHTML = '<div class="order-admin-card-header">' +
        '<div class="order-admin-card-id-wrap">' +
        '<span class="order-admin-card-id">#' + escapeHtml(order.orderId) + '</span>' +
        timeHtml +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(order.status) + '</span>' +
        '</div>' +
        '<div class="order-admin-card-sub">' +
        '<span class="order-admin-card-name">' + escapeHtml(order.name || 'Customer') + '</span>' +
        '<span class="order-admin-card-delivery">' + escapeHtml(order.deliveryMethod || 'Pickup') + '</span>' +
        '</div>';

      card.addEventListener('click', function () {
        selectedOrderId = order.orderId;
        // Re-render queue selected highlight
        var allCards = queueContainer.querySelectorAll('.order-admin-card-item');
        allCards.forEach(function (c) { c.classList.remove('order-admin-card-item--selected'); });
        card.classList.add('order-admin-card-item--selected');
        renderInspector(order);

        if (window.innerWidth <= 860 && inspectorContainer) {
          inspectorContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });

      return card;
    }

    function renderQueue() {
      var filtered = filterOrders(currentOrders, activeFilter, currentSearch);

      if (filtered.length === 0) {
        selectedOrderId = null;
        queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">No orders match the selected filter.</div>';
        renderInspector(null);
        return;
      }

      if (selectedOrderId) {
        var isSelectedInFiltered = filtered.some(function (o) { return o.orderId === selectedOrderId; });
        if (!isSelectedInFiltered) {
          selectedOrderId = null;
        }
      }

      queueContainer.innerHTML = '';

      if (activeFilter === 'all') {
        var activeOrders = [];
        var deliveredOrders = [];
        var cancelledOrders = [];
        filtered.forEach(function (order) {
          var s = (order.status || '').toLowerCase();
          if (s === 'delivered') {
            deliveredOrders.push(order);
          } else if (s === 'cancelled') {
            cancelledOrders.push(order);
          } else {
            activeOrders.push(order);
          }
        });

        // Render active orders
        activeOrders.forEach(function (order) {
          queueContainer.appendChild(createCardElement(order));
        });

        function appendCollapsibleSection(title, orders, isCollapsed, setCollapsed) {
          if (orders.length === 0) return;

          var collWrap = document.createElement('div');
          collWrap.className = 'order-admin-collapsible-wrap';

          var toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'order-admin-collapse-toggle';
          toggleBtn.innerHTML = '<span class="order-admin-collapse-title">' + title + ' (' + orders.length + ')</span>' +
            '<span class="order-admin-collapse-icon">' + (isCollapsed ? '▶' : '▼') + '</span>';

          var content = document.createElement('div');
          content.className = 'order-admin-collapsed-content';
          content.style.display = isCollapsed ? 'none' : 'flex';

          orders.forEach(function (order) {
            content.appendChild(createCardElement(order));
          });

          toggleBtn.addEventListener('click', function () {
            var next = !isCollapsed;
            setCollapsed(next);
            isCollapsed = next;
            content.style.display = next ? 'none' : 'flex';
            toggleBtn.querySelector('.order-admin-collapse-icon').textContent = next ? '▶' : '▼';
          });

          collWrap.appendChild(toggleBtn);
          collWrap.appendChild(content);
          queueContainer.appendChild(collWrap);
        }

        appendCollapsibleSection('Delivered Orders', deliveredOrders, isDeliveredCollapsed, function (c) {
          isDeliveredCollapsed = c;
        });

        appendCollapsibleSection('Cancelled Orders', cancelledOrders, isCancelledCollapsed, function (c) {
          isCancelledCollapsed = c;
        });
      } else {
        // Direct rendering when a specific filter is active (including 'delivered' and 'cancelled')
        filtered.forEach(function (order) {
          queueContainer.appendChild(createCardElement(order));
        });
      }

      var currentSelected = selectedOrderId
        ? currentOrders.find(function (o) { return o.orderId === selectedOrderId; })
        : null;
      renderInspector(currentSelected);
    }

    function loadOrders(passcode, callback) {
      var isMockPasscode = (passcode === 'test-admin' || passcode === DEFAULT_MOCK_PASSCODE);
      var isMockModeIntended = isMockPasscode || hasMockParam || !apiUrl || apiUrl.indexOf('YOUR_ORDER_API_DEPLOYMENT_ID') !== -1;

      if (isMockModeIntended) {
        computeBrowserHash(passcode).then(function (computedHash) {
          if (computedHash === DEFAULT_MOCK_HASH || isMockPasscode) {
            isMockModeActive = true;
            setTimeout(function () {
              currentOrders = JSON.parse(JSON.stringify(CANONICAL_MOCK_ORDERS));
              callback(null, currentOrders);
            }, 200);
          } else {
            callback("Unauthorized: Invalid Admin Key. (Use 'test-admin' to access Mock Mode)");
          }
        });
        return;
      }

      var fetchUrl = apiUrl + (apiUrl.indexOf('?') === -1 ? '?' : '&') +
        'action=admin_list&adminKey=' + encodeURIComponent(passcode);

      fetch(fetchUrl)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            callback(data.error);
          } else if (data.orders) {
            isMockModeActive = false;
            currentOrders = data.orders;
            callback(null, currentOrders);
          } else {
            callback("Unexpected server response format");
          }
        })
        .catch(function (err) {
          callback("Could not connect to live order API (" + (err.message || 'Network error') + "). If testing offline, enter 'test-admin' for Mock Mode.");
        });
    }

    function updateOrderStatus(orderId, newStatus, newDetails, notifyCustomer, callback) {
      if (typeof notifyCustomer === 'function') {
        callback = notifyCustomer;
        notifyCustomer = false;
      }
      var currentKey = getStoredKey();

      if (isMockModeActive) {
        setTimeout(function () {
          callback(null, { success: true, orderId: orderId, status: newStatus, emailSent: !!notifyCustomer });
        }, 300);
        return;
      }

      fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          action: 'admin_update_status',
          adminKey: currentKey,
          orderId: orderId,
          status: newStatus,
          statusDetails: newDetails,
          notifyCustomer: !!notifyCustomer
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) {
          callback(data.error);
        } else {
          callback(null, data);
        }
      })
      .catch(function (err) {
        callback("Network error during status update: " + err.message);
      });
    }

    // Gate form submit handler
    if (gateForm) {
      gateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var key = passcodeInput.value.trim();
        if (!key) return;

        gateBtn.disabled = true;
        gateBtn.textContent = 'Verifying...';
        gateError.style.display = 'none';

        loadOrders(key, function (err, orders) {
          gateBtn.disabled = false;
          gateBtn.textContent = 'Unlock Dashboard';

          if (err) {
            clearStoredKey();
            gateError.textContent = typeof err === 'string' ? err : 'Invalid roaster passcode. Please check your credentials.';
            gateError.style.display = 'block';
          } else {
            saveKey(key);
            showDashboard();
            renderStats();
            renderQueue();
          }
        });
      });
    }

    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        var key = getStoredKey();
        if (!key) {
          showGate();
          return;
        }

        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Refreshing...';

        loadOrders(key, function (err, orders) {
          refreshBtn.disabled = false;
          refreshBtn.textContent = 'Refresh';

          if (err) {
            alert('Failed to refresh orders: ' + err);
          } else {
            renderStats();
            renderQueue();
          }
        });
      });
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearStoredKey();
        currentOrders = [];
        selectedOrderId = null;
        showGate();
      });
    }

    // Filter pills
    if (filtersContainer) {
      var pills = filtersContainer.querySelectorAll('.order-admin-filter-pill');
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          pill.classList.add('order-admin-filter-pill--active');
          activeFilter = pill.getAttribute('data-filter') || 'all';
          renderQueue();
        });
      });
    }

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value.trim();
        renderQueue();
      });
    }

    // Check stored key on init
    var storedKey = getStoredKey();
    if (storedKey) {
      showDashboard();
      queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading orders...</div>';

      loadOrders(storedKey, function (err, orders) {
        if (err) {
          var isAuthFailure = typeof err === 'string' && (err.indexOf('Unauthorized') !== -1 || err.indexOf('Invalid') !== -1);
          if (isAuthFailure) {
            clearStoredKey();
            showGate('Previous session expired. Please enter your passcode again.');
          } else {
            queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #c0392b; cursor: default;">' +
              'Could not connect to live order API (' + escapeHtml(err) + ').<br>' +
              '<button type="button" id="order-admin-retry-btn" class="order-admin-btn-sm" style="margin-top: 0.6rem; display: inline-block;">Retry Connection</button>' +
              '</div>';
            var retryBtn = document.getElementById('order-admin-retry-btn');
            retryBtn.addEventListener('click', function () {
              refreshBtn.click();
            });
          }
        } else {
          renderStats();
          renderQueue();
        }
      });
    } else {
      showGate();
    }
  }

  return {
    initAdminOrders: initAdminOrders,
    filterOrders: filterOrders,
    computeStats: computeStats,
    getStatusBadgeClass: getStatusBadgeClass,
    computeBrowserHash: computeBrowserHash,
    DEFAULT_MOCK_HASH: DEFAULT_MOCK_HASH,
    DEFAULT_MOCK_PASSCODE: DEFAULT_MOCK_PASSCODE,
    DEFAULT_SALT: DEFAULT_SALT,
    CANONICAL_MOCK_ORDERS: CANONICAL_MOCK_ORDERS
  };
});
