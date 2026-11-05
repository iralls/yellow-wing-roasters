/**
 * Yellow Wing Roasters - Owner Gift Subscription Dashboard Controller (/gift-subscriptions/admin/)
 * Provides secure owner authentication, live gift subscription queue management, fulfillment tracking,
 * status updates with recipient/purchaser email dispatch, and recurring gift rollups.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminGiftSubscriptions = exp.initAdminGiftSubscriptions;
    root.filterGiftSubscriptions = exp.filterGiftSubscriptions;
    root.computeGiftSubscriptionStats = exp.computeGiftSubscriptionStats;
    root.computeGiftSubscriptionTotals = exp.computeGiftSubscriptionTotals;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'ywr_admin_passcode';
  var DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';
  var ADMIN_PASSWORD_HASH = 'fe65aec7e9795f3d9f4d55755b8c3bc82818e8955ac270c5ab5ebc09e28b3de9';

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

  function resolveAdminHash(passcode) {
    var trimmed = (passcode || '').trim();
    if (/^[0-9a-f]{64}$/i.test(trimmed)) {
      return Promise.resolve(trimmed.toLowerCase());
    }
    return computeBrowserHash(trimmed);
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

  function parseCurrency(str) {
    if (!str && str !== 0) return 0;
    var clean = String(str).replace(/[$,]/g, '').trim();
    var val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }

  function formatCurrency(val) {
    var num = parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return '$' + num.toFixed(2);
  }

  function getMonthsFromDuration(dur) {
    var s = (dur || '').toLowerCase();
    if (s.indexOf('6') !== -1) return 6;
    if (s.indexOf('3') !== -1) return 3;
    return 1;
  }

  function getStatusBadgeClass(status) {
    var s = (status || '').toLowerCase();
    if (s === 'active') return 'status-active';
    if (s === 'roasted') return 'status-roasted';
    if (s === 'ready for pickup' || s === 'out for delivery') return 'status-ready';
    if (s === 'delivered') return 'status-delivered';
    if (s === 'paused') return 'status-paused';
    if (s === 'completed') return 'status-active';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-active';
  }

  function filterGiftSubscriptions(subscriptions, activeFilter, searchQuery) {
    if (!subscriptions || !subscriptions.length) return [];
    var q = (searchQuery || '').trim().toLowerCase();
    var filter = (activeFilter || 'all').toLowerCase();

    return subscriptions.filter(function (sub) {
      var sStatus = (sub.status || '').toLowerCase();
      if (filter !== 'all' && sStatus !== filter) {
        return false;
      }
      if (!q) return true;

      var matchId = String(sub.orderId || '').toLowerCase().indexOf(q) !== -1;
      var matchPName = String(sub.purchaserName || '').toLowerCase().indexOf(q) !== -1;
      var matchPEmail = String(sub.purchaserEmail || '').toLowerCase().indexOf(q) !== -1;
      var matchRName = String(sub.recipientName || '').toLowerCase().indexOf(q) !== -1;
      var matchREmail = String(sub.recipientEmail || '').toLowerCase().indexOf(q) !== -1;
      var matchRoast = String(sub.roast || '').toLowerCase().indexOf(q) !== -1;
      var matchDur = String(sub.duration || '').toLowerCase().indexOf(q) !== -1;
      var matchNotes = String(sub.notes || '').toLowerCase().indexOf(q) !== -1;

      return matchId || matchPName || matchPEmail || matchRName || matchREmail || matchRoast || matchDur || matchNotes;
    });
  }

  function computeGiftSubscriptionStats(subscriptions) {
    var activeCount = 0;
    var completedCount = 0;
    var scheduledBags = 0;
    var totalRevenue = 0;

    (subscriptions || []).forEach(function (sub) {
      var st = (sub.status || '').toLowerCase();
      var cost = parseCurrency(sub.cost);
      var months = getMonthsFromDuration(sub.duration);

      totalRevenue += cost;

      if (st === 'completed') {
        completedCount++;
      } else if (st !== 'cancelled') {
        activeCount++;
        scheduledBags += months;
      }
    });

    return {
      activeCount: activeCount,
      completedCount: completedCount,
      scheduledBags: scheduledBags,
      totalRevenue: totalRevenue
    };
  }

  function computeGiftSubscriptionTotals(subscriptions, groupBy, filterRoast, filterDur, filterStatus) {
    var list = (subscriptions || []).filter(function (s) {
      var st = (s.status || '').toLowerCase();
      if (filterStatus === 'all' && st === 'cancelled') return false;
      if (filterStatus && filterStatus !== 'all' && filterStatus !== 'all_with_cancelled' && s.status !== filterStatus) return false;
      if (filterRoast && filterRoast !== 'all' && s.roast !== filterRoast) return false;
      if (filterDur && filterDur !== 'all' && s.duration !== filterDur) return false;
      return true;
    });

    var groups = {};
    list.forEach(function (sub) {
      var key = 'Other';
      if (groupBy === 'roast') key = sub.roast || 'Unspecified Roast';
      else if (groupBy === 'duration') key = sub.duration || 'One-time';
      else if (groupBy === 'status') key = sub.status || 'Active';

      if (!groups[key]) {
        groups[key] = { label: key, count: 0, bags: 0, revenue: 0 };
      }
      groups[key].count++;
      groups[key].bags += getMonthsFromDuration(sub.duration);
      groups[key].revenue += parseCurrency(sub.cost);
    });

    return Object.keys(groups).map(function (k) { return groups[k]; }).sort(function (a, b) {
      return b.revenue - a.revenue;
    });
  }

  return {
    filterGiftSubscriptions: filterGiftSubscriptions,
    computeGiftSubscriptionStats: computeGiftSubscriptionStats,
    computeGiftSubscriptionTotals: computeGiftSubscriptionTotals,

    initAdminGiftSubscriptions: function initAdminGiftSubscriptions(options) {
      options = options || {};
      var API_URL = options.apiUrl || '';

      var gateSection = document.getElementById('gift-sub-admin-gate-section');
      var gateForm = document.getElementById('gift-sub-admin-gate-form');
      var gateInput = document.getElementById('gift-sub-admin-passcode-input');
      var gateError = document.getElementById('gift-sub-admin-gate-error');
      var gateBtn = document.getElementById('gift-sub-admin-gate-btn');

      var dashboardSection = document.getElementById('gift-sub-admin-dashboard-section');
      var refreshBtn = document.getElementById('gift-sub-admin-refresh-btn');
      var logoutBtn = document.getElementById('gift-sub-admin-logout-btn');
      var kpiGrid = document.getElementById('gift-sub-admin-kpis');
      var statsText = document.getElementById('gift-sub-admin-stats');
      var searchInput = document.getElementById('gift-sub-admin-search-input');

      var panelQueue = document.getElementById('gift-sub-panel-queue');
      var panelTotals = document.getElementById('gift-sub-panel-totals');
      var queueContainer = document.getElementById('gift-sub-queue');
      var inspectorContainer = document.getElementById('gift-sub-inspector');

      // Totals controls
      var totalsGroupPills = document.querySelectorAll('#gift-sub-group-pills .order-admin-filter-pill');
      var totalsFilterRoast = document.getElementById('gift-sub-filter-roast');
      var totalsFilterDur = document.getElementById('gift-sub-filter-dur');
      var totalsFilterStatus = document.getElementById('gift-sub-filter-status');
      var totalsKpis = document.getElementById('gift-sub-totals-kpis');
      var totalsTableWrap = document.getElementById('gift-sub-totals-table-wrap');

      // State
      var allSubscriptions = [];
      var activeTab = 'queue';
      var activeFilter = 'all';
      var selectedOrderId = null;
      var activeTotalsGroup = 'roast';

      function unlockDashboard() {
        document.documentElement.classList.add('ywr-admin-authenticated');
        gateSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchData();
      }

      function lockDashboard() {
        document.documentElement.classList.remove('ywr-admin-authenticated');
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        dashboardSection.style.display = 'none';
        gateSection.style.display = 'block';
        allSubscriptions = [];
      }

      function renderKPIs() {
        var stats = computeGiftSubscriptionStats(allSubscriptions);
        statsText.innerHTML =
          '<span class="order-admin-stat-pill order-admin-stat-pill--highlight">Total: ' + allSubscriptions.length + '</span>' +
          '<span class="order-admin-stat-pill">Active: ' + stats.activeCount + '</span>' +
          '<span class="order-admin-stat-pill" style="color: #1e824c; background: #eafaf1; font-weight: 700;">' + formatCurrency(stats.totalRevenue) + '</span>' +
          '<span class="order-admin-stat-pill">Completed: ' + stats.completedCount + '</span>';

        kpiGrid.innerHTML =
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #1e824c;">' + stats.activeCount + ' Active</div>' +
            '<div class="roast-admin-kpi-label">Active Gifts (' + stats.scheduledBags + ' bags total)</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #2c1e14;">' + stats.completedCount + ' Done</div>' +
            '<div class="roast-admin-kpi-label">Completed Gift Subscriptions</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #92400e;">' + formatCurrency(stats.totalRevenue) + '</div>' +
            '<div class="roast-admin-kpi-label">Total Gift Revenue</div>' +
          '</div>';
      }

      function renderQueue() {
        var query = searchInput ? searchInput.value : '';
        var filtered = filterGiftSubscriptions(allSubscriptions, activeFilter, query);

        if (!filtered.length) {
          queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">No gift subscriptions match the selected filter.</div>';
          inspectorContainer.innerHTML = '<div class="order-admin-inspector-empty">Select a gift subscription from the queue to view details, update fulfillment status, and send status emails.</div>';
          return;
        }

        queueContainer.innerHTML = '';
        var selectedItem = null;

        filtered.forEach(function (sub) {
          var isSelected = sub.orderId === selectedOrderId;
          if (isSelected) selectedItem = sub;

          var itemEl = document.createElement('div');
          itemEl.className = 'order-admin-card-item' + (isSelected ? ' order-admin-card-item--selected' : '');

          var badgeClass = getStatusBadgeClass(sub.status);
          var recipientName = sub.recipientName || sub.purchaserName || 'Gift Recipient';
          var costDisplay = sub.cost ? (sub.cost.indexOf('$') === 0 ? sub.cost : '$' + sub.cost) : '';
          var timeHtml = sub.timestamp ? '<span class="order-admin-card-time">' + escapeHtml(sub.timestamp) + '</span>' : '';

          itemEl.innerHTML =
            '<div class="order-admin-card-header">' +
              '<div class="order-admin-card-id-wrap">' +
                '<span class="order-admin-card-id">#' + escapeHtml(sub.orderId) + '</span>' +
                timeHtml +
              '</div>' +
              '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
            '</div>' +
            '<div class="order-admin-card-sub">' +
              '<span class="order-admin-card-name">' + escapeHtml(recipientName) + '</span>' +
              '<span class="order-admin-card-delivery">' + escapeHtml(costDisplay) + '</span>' +
            '</div>';

          itemEl.addEventListener('click', function () {
            selectedOrderId = sub.orderId;
            renderQueue();
          });

          queueContainer.appendChild(itemEl);
        });

        renderInspector(selectedItem);
      }

      function renderInspector(sub) {
        if (!sub) {
          inspectorContainer.innerHTML = '<div class="order-admin-inspector-empty">Select a gift subscription from the queue to view details, update fulfillment status, and send status emails.</div>';
          return;
        }

        var badgeClass = getStatusBadgeClass(sub.status);
        var costDisplay = sub.cost ? (sub.cost.indexOf('$') === 0 ? sub.cost : '$' + sub.cost) : '';
        var priceHtml = costDisplay
          ? '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
            '<span class="order-admin-inspector-price">' + escapeHtml(costDisplay) + '</span>'
          : '';

        var itemsBoxHtml = '<div class="order-admin-items-box">' +
          '<ul class="order-admin-items-list">' +
            '<li><strong>Coffee:</strong> ' + escapeHtml(sub.roast) + '</li>' +
            '<li><strong>Duration:</strong> ' + escapeHtml(sub.duration) + '</li>' +
            (sub.cost ? '<li><strong>Total Price:</strong> ' + escapeHtml(sub.cost) + '</li>' : '') +
          '</ul>' +
          '</div>';

        var notesHtml = '';
        if (sub.notes) {
          notesHtml += '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Notes &amp; Address</div>' +
            '<div class="order-admin-info-line">' + escapeHtml(sub.notes) + '</div>' +
            '</div>';
        }
        if (sub.giftMessage) {
          notesHtml += '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Gift Message</div>' +
            '<div class="order-admin-items-box" style="font-style: italic;">&ldquo;' + escapeHtml(sub.giftMessage) + '&rdquo;</div>' +
            '</div>';
        }

        inspectorContainer.innerHTML =
          '<div class="order-admin-inspector-header">' +
            '<div class="order-admin-inspector-title-wrap">' +
              '<h3 class="order-admin-inspector-title">Gift #' + escapeHtml(sub.orderId) + '</h3>' +
              priceHtml +
            '</div>' +
            '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
          '</div>' +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Gift Parties</div>' +
            '<div class="order-admin-info-line"><strong>Purchaser:</strong> ' + escapeHtml(sub.purchaserName || 'Anonymous') + ' (' + escapeHtml(sub.purchaserEmail) + ')</div>' +
            '<div class="order-admin-info-line"><strong>Recipient:</strong> ' + escapeHtml(sub.recipientName || 'Friend') + (sub.recipientEmail ? ' (' + escapeHtml(sub.recipientEmail) + ')' : ' <span style="color: #8a7060; font-style: italic;">(No email on file)</span>') + '</div>' +
            (sub.timestamp ? '<div class="order-admin-info-line" style="margin-top: 0.35rem; color: #8a7060;"><strong>Ordered:</strong> ' + escapeHtml(sub.timestamp) + '</div>' : '') +
          '</div>' +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Gift Subscription Plan</div>' +
            itemsBoxHtml +
          '</div>' +

          notesHtml +

          '<div class="order-admin-status-box">' +
            '<div class="order-admin-section-label">Fulfillment &amp; Status Editor</div>' +
            '<select id="edit-gift-sub-status" class="order-admin-status-picker">' +
              '<option value="Active"' + (sub.status === 'Active' ? ' selected' : '') + '>Active</option>' +
              '<option value="Roasted"' + (sub.status === 'Roasted' ? ' selected' : '') + '>Roasted</option>' +
              '<option value="Ready for Pickup"' + (sub.status === 'Ready for Pickup' ? ' selected' : '') + '>Ready for Pickup</option>' +
              '<option value="Out for Delivery"' + (sub.status === 'Out for Delivery' ? ' selected' : '') + '>Out for Delivery</option>' +
              '<option value="Delivered"' + (sub.status === 'Delivered' ? ' selected' : '') + '>Delivered</option>' +
              '<option value="Paused"' + (sub.status === 'Paused' ? ' selected' : '') + '>Paused</option>' +
              '<option value="Completed"' + (sub.status === 'Completed' ? ' selected' : '') + '>Completed</option>' +
              '<option value="Cancelled"' + (sub.status === 'Cancelled' ? ' selected' : '') + '>Cancelled</option>' +
            '</select>' +
            '<textarea id="edit-gift-sub-details" class="order-admin-textarea" placeholder="Update notes, delay reason, or fulfillment cycle info...">' +
              escapeHtml(sub.statusDetails || '') +
            '</textarea>' +
            '<label class="order-admin-checkbox-label">' +
              '<input type="checkbox" id="notify-recipient-check" checked' + (!sub.recipientEmail ? ' disabled' : '') + '>' +
              '<span>Email status update to Recipient (no prices shown)' + (!sub.recipientEmail ? ' &mdash; <em style="color:#8a7060;">no email</em>' : '') + '</span>' +
            '</label>' +
            '<label class="order-admin-checkbox-label">' +
              '<input type="checkbox" id="notify-purchaser-check">' +
              '<span>Email status update to Purchaser</span>' +
            '</label>' +
            '<div style="margin-top: 0.6rem;">' +
              '<button type="button" id="save-gift-sub-btn" class="order-admin-save-btn">Update Gift Subscription</button>' +
            '</div>' +
            '<div id="edit-status-feedback" class="order-admin-feedback" style="display: none;"></div>' +
          '</div>' +

          '<div class="order-admin-section-block" style="border-top: 1px solid #e8e0d5; padding-top: 0.75rem; margin-top: 1rem;">' +
            '<div class="order-admin-section-label">Resend Welcome &amp; Receipts</div>' +
            '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">' +
              '<button type="button" id="resend-recipient-announcement-btn" class="order-admin-btn-sm"' + (!sub.recipientEmail ? ' disabled' : '') + '>Resend Recipient Announcement</button>' +
              '<button type="button" id="resend-purchaser-receipt-btn" class="order-admin-btn-sm"' + (!sub.purchaserEmail ? ' disabled' : '') + '>Resend Purchaser Receipt</button>' +
            '</div>' +
            '<div id="resend-email-feedback" class="order-status" style="margin-top: 0.5rem;"></div>' +
          '</div>';

        // Wire update button
        var saveBtn = inspectorContainer.querySelector('#save-gift-sub-btn');
        var editFeedback = inspectorContainer.querySelector('#edit-status-feedback');
        if (saveBtn) {
          saveBtn.addEventListener('click', function () {
            var newStatus = inspectorContainer.querySelector('#edit-gift-sub-status').value;
            var newDetails = inspectorContainer.querySelector('#edit-gift-sub-details').value.trim();
            var notifyRecip = inspectorContainer.querySelector('#notify-recipient-check').checked;
            var notifyPurch = inspectorContainer.querySelector('#notify-purchaser-check').checked;

            var origText = saveBtn.textContent;
            saveBtn.textContent = 'Updating...';
            saveBtn.disabled = true;
            editFeedback.textContent = '';

            var storedPass = localStorage.getItem(STORAGE_KEY) || '';
            resolveAdminHash(storedPass).then(function (hash) {
              return fetch(API_URL, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify({
                  action: 'admin_update_status',
                  adminHash: hash,
                  orderId: sub.orderId,
                  status: newStatus,
                  statusDetails: newDetails,
                  notifyRecipient: notifyRecip,
                  notifyPurchaser: notifyPurch
                })
              });
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
              saveBtn.textContent = origText;
              saveBtn.disabled = false;
              if (data.error) {
                editFeedback.textContent = data.error;
                editFeedback.className = 'order-status order-status-error';
              } else {
                editFeedback.textContent = 'Updated successfully!' + (data.sentRecipient ? ' (Recipient emailed)' : '') + (data.sentPurchaser ? ' (Purchaser emailed)' : '');
                editFeedback.className = 'order-status order-status-success';
                sub.status = newStatus;
                sub.statusDetails = newDetails;
                fetchData();
              }
            })
            .catch(function (err) {
              console.error('Error updating gift subscription:', err);
              saveBtn.textContent = origText;
              saveBtn.disabled = false;
              editFeedback.textContent = 'Network glitch updating status.';
              editFeedback.className = 'order-status order-status-error';
            });
          });
        }

        // Wire resend buttons
        var resendRecipBtn = inspectorContainer.querySelector('#resend-recipient-announcement-btn');
        var resendPurchBtn = inspectorContainer.querySelector('#resend-purchaser-receipt-btn');
        var resendFeedback = inspectorContainer.querySelector('#resend-email-feedback');

        function triggerResend(type, btn) {
          var orig = btn.textContent;
          btn.textContent = 'Sending...';
          btn.disabled = true;
          resendFeedback.textContent = '';

          var storedPass = localStorage.getItem(STORAGE_KEY) || '';
          resolveAdminHash(storedPass).then(function (hash) {
            return fetch(API_URL, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              body: JSON.stringify({
                action: 'admin_resend_email',
                adminHash: hash,
                orderId: sub.orderId,
                recipientType: type
              })
            });
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            btn.textContent = orig;
            btn.disabled = false;
            if (data.error) {
              resendFeedback.textContent = data.error;
              resendFeedback.className = 'order-status order-status-error';
            } else {
              resendFeedback.textContent = 'Email dispatched successfully!';
              resendFeedback.className = 'order-status order-status-success';
            }
          })
          .catch(function (err) {
            console.error('Error resending email:', err);
            btn.textContent = orig;
            btn.disabled = false;
            resendFeedback.textContent = 'Failed to dispatch email.';
            resendFeedback.className = 'order-status order-status-error';
          });
        }

        if (resendRecipBtn) {
          resendRecipBtn.addEventListener('click', function () {
            triggerResend('recipient', resendRecipBtn);
          });
        }
        if (resendPurchBtn) {
          resendPurchBtn.addEventListener('click', function () {
            triggerResend('purchaser', resendPurchBtn);
          });
        }
      }

      function populateTotalsFilters() {
        var roasts = {};
        var durs = {};
        allSubscriptions.forEach(function (s) {
          if (s.roast) roasts[s.roast] = true;
          if (s.duration) durs[s.duration] = true;
        });

        totalsFilterRoast.innerHTML = '<option value="all">All Roasts</option>';
        Object.keys(roasts).sort().forEach(function (r) {
          var opt = document.createElement('option');
          opt.value = r;
          opt.textContent = r;
          totalsFilterRoast.appendChild(opt);
        });

        totalsFilterDur.innerHTML = '<option value="all">All Durations</option>';
        Object.keys(durs).sort().forEach(function (d) {
          var opt = document.createElement('option');
          opt.value = d;
          opt.textContent = d;
          totalsFilterDur.appendChild(opt);
        });
      }

      function renderTotals() {
        var fRoast = totalsFilterRoast ? totalsFilterRoast.value : 'all';
        var fDur = totalsFilterDur ? totalsFilterDur.value : 'all';
        var fStatus = totalsFilterStatus ? totalsFilterStatus.value : 'all';

        var rows = computeGiftSubscriptionTotals(allSubscriptions, activeTotalsGroup, fRoast, fDur, fStatus);

        var totalCount = 0;
        var totalBags = 0;
        var totalRev = 0;

        rows.forEach(function (r) {
          totalCount += r.count;
          totalBags += r.bags;
          totalRev += r.revenue;
        });

        totalsKpis.innerHTML =
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #2c1e14;">' + totalCount + '</div>' +
            '<div class="roast-admin-kpi-label">Filtered Gifts</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #1e824c;">' + totalBags + '</div>' +
            '<div class="roast-admin-kpi-label">Total Bags / Deliveries</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #92400e;">' + formatCurrency(totalRev) + '</div>' +
            '<div class="roast-admin-kpi-label">Filtered Revenue</div>' +
          '</div>';

        var groupHeader = activeTotalsGroup.charAt(0).toUpperCase() + activeTotalsGroup.slice(1);
        var html = '<table class="roast-admin-table">' +
          '<thead><tr>' +
            '<th>' + escapeHtml(groupHeader) + '</th>' +
            '<th style="text-align: right;">Gift Orders</th>' +
            '<th style="text-align: right;">Bags / Deliveries</th>' +
            '<th style="text-align: right;">Total Revenue</th>' +
          '</tr></thead>' +
          '<tbody>';

        if (!rows.length) {
          html += '<tr><td colspan="4" style="text-align: center; color: #8a7060; padding: 2rem;">No gift subscriptions match current filters.</td></tr>';
        } else {
          rows.forEach(function (r) {
            html += '<tr>' +
              '<td style="font-weight: 600; color: #2c1e14;">' + escapeHtml(r.label) + '</td>' +
              '<td style="text-align: right;">' + r.count + '</td>' +
              '<td style="text-align: right;">' + r.bags + '</td>' +
              '<td style="text-align: right; font-weight: 600; color: #92400e;">' + formatCurrency(r.revenue) + '</td>' +
            '</tr>';
          });
        }

        html += '</tbody></table>';
        totalsTableWrap.innerHTML = html;
      }

      function fetchData() {
        var storedPass = localStorage.getItem(STORAGE_KEY) || '';
        if (!storedPass) return;

        if (queueContainer) {
          queueContainer.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading gift subscriptions...</div>';
        }

        resolveAdminHash(storedPass).then(function (hash) {
          return fetch(API_URL + '?action=admin_list&adminHash=' + encodeURIComponent(hash));
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            console.error('Error fetching gift subscriptions:', data.error);
            if (data.error.indexOf('Unauthorized') !== -1) {
              lockDashboard();
            }
            return;
          }
          allSubscriptions = data.giftSubscriptions || [];
          renderKPIs();
          populateTotalsFilters();
          if (activeTab === 'queue') {
            renderQueue();
          } else if (activeTab === 'totals') {
            renderTotals();
          }
        })
        .catch(function (err) {
          console.error('Network glitch loading gift subscriptions:', err);
        });
      }

      // Wire Tabs
      var tabBtns = document.querySelectorAll('#gift-sub-admin-tabs .roast-admin-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = this.getAttribute('data-tab');
          activeTab = tab;

          tabBtns.forEach(function (b) {
            b.classList.remove('roast-admin-tab-btn--active');
            b.setAttribute('aria-selected', 'false');
          });
          this.classList.add('roast-admin-tab-btn--active');
          this.setAttribute('aria-selected', 'true');

          panelQueue.classList.remove('roast-admin-panel--active');
          panelTotals.classList.remove('roast-admin-panel--active');

          if (tab === 'queue') {
            panelQueue.classList.add('roast-admin-panel--active');
            renderQueue();
          } else if (tab === 'totals') {
            panelTotals.classList.add('roast-admin-panel--active');
            renderTotals();
          }
        });
      });

      // Wire Filter Pills
      var filterPills = document.querySelectorAll('#gift-sub-filters .order-admin-filter-pill');
      filterPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          filterPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          this.classList.add('order-admin-filter-pill--active');
          activeFilter = this.getAttribute('data-filter');
          renderQueue();
        });
      });

      // Wire Totals Group Pills
      totalsGroupPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          totalsGroupPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          this.classList.add('order-admin-filter-pill--active');
          activeTotalsGroup = this.getAttribute('data-group');
          renderTotals();
        });
      });

      if (totalsFilterRoast) totalsFilterRoast.addEventListener('change', renderTotals);
      if (totalsFilterDur) totalsFilterDur.addEventListener('change', renderTotals);
      if (totalsFilterStatus) totalsFilterStatus.addEventListener('change', renderTotals);

      // Wire Search
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          renderQueue();
        });
      }

      // Wire Refresh & Logout
      if (refreshBtn) refreshBtn.addEventListener('click', fetchData);
      if (logoutBtn) logoutBtn.addEventListener('click', lockDashboard);

      // Wire Passcode Gate
      if (gateForm) {
        gateForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var enteredPass = gateInput.value.trim();
          if (!enteredPass) return;

          gateBtn.disabled = true;
          gateBtn.textContent = 'Authenticating...';
          gateError.style.display = 'none';

          resolveAdminHash(enteredPass).then(function (hash) {
            if (hash === ADMIN_PASSWORD_HASH) {
              try { localStorage.setItem(STORAGE_KEY, enteredPass); } catch (err) {}
              gateBtn.disabled = false;
              gateBtn.textContent = 'Unlock Dashboard';
              unlockDashboard();
            } else {
              gateBtn.disabled = false;
              gateBtn.textContent = 'Unlock Dashboard';
              gateError.textContent = 'Incorrect owner passcode. Please try again.';
              gateError.style.display = 'block';
              gateInput.focus();
            }
          });
        });
      }

      // Auto-unlock if already authenticated
      var existingPass = localStorage.getItem(STORAGE_KEY);
      if (existingPass) {
        resolveAdminHash(existingPass).then(function (hash) {
          if (hash === ADMIN_PASSWORD_HASH) {
            unlockDashboard();
          } else {
            lockDashboard();
          }
        });
      }
    }
  };
});
