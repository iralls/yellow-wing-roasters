/**
 * Yellow Wing Roasters - Owner Subscription Dashboard Controller (/subscriptions/admin/)
 * Provides secure owner authentication, live subscription queue management, filtering & search,
 * status updates with automatic subscriber email dispatch, and recurring rollups.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminSubscriptions = exp.initAdminSubscriptions;
    root.filterSubscriptions = exp.filterSubscriptions;
    root.computeSubscriptionStats = exp.computeSubscriptionStats;
    root.computeSubscriptionTotals = exp.computeSubscriptionTotals;
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
    if (!str) return 0;
    var clean = String(str).replace(/[$,]/g, '').trim();
    var val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }

  function getStatusBadgeClass(status) {
    var s = (status || '').toLowerCase();
    if (s === 'active') return 'status-active';
    if (s === 'paused') return 'status-paused';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-active';
  }

  function filterSubscriptions(subscriptions, activeFilter, searchQuery) {
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
      var matchName = String(sub.name || '').toLowerCase().indexOf(q) !== -1;
      var matchEmail = String(sub.email || '').toLowerCase().indexOf(q) !== -1;
      var matchRoast = String(sub.roast || '').toLowerCase().indexOf(q) !== -1;
      var matchCity = String(sub.city || '').toLowerCase().indexOf(q) !== -1;

      return matchId || matchName || matchEmail || matchRoast || matchCity;
    });
  }

  function computeSubscriptionStats(subscriptions) {
    var active = 0;
    var paused = 0;
    var cancelled = 0;
    var recurringRev = 0;

    (subscriptions || []).forEach(function (s) {
      var st = (s.status || '').toLowerCase();
      var cost = parseCurrency(s.cost);
      if (st === 'active') {
        active++;
        recurringRev += cost;
      } else if (st === 'paused') {
        paused++;
      } else if (st === 'cancelled') {
        cancelled++;
      }
    });

    return {
      active: active,
      paused: paused,
      cancelled: cancelled,
      total: (subscriptions || []).length,
      recurringRevenue: recurringRev
    };
  }

  function computeSubscriptionTotals(subscriptions, groupByKeys, filters) {
    filters = filters || {};
    var statusFilter = (filters.status || 'all').toLowerCase();
    var roastFilter = (filters.roast || 'all').toLowerCase();
    var sizeFilter = (filters.size || 'all').toLowerCase();
    var freqFilter = (filters.frequency || 'all').toLowerCase();

    var filtered = (subscriptions || []).filter(function (s) {
      var st = (s.status || '').toLowerCase();
      if (statusFilter === 'all' && st === 'cancelled') return false; // Active only default
      if (statusFilter !== 'all' && statusFilter !== 'all_with_cancelled' && st !== statusFilter) return false;

      if (roastFilter !== 'all' && String(s.roast || '').toLowerCase() !== roastFilter) return false;
      if (sizeFilter !== 'all' && String(s.size || '').toLowerCase() !== sizeFilter) return false;
      if (freqFilter !== 'all' && String(s.frequency || '').toLowerCase() !== freqFilter) return false;

      return true;
    });

    var groups = {};
    filtered.forEach(function (s) {
      var groupParts = (groupByKeys && groupByKeys.length) ? groupByKeys.map(function (k) {
        return s[k] || 'N/A';
      }) : ['All Active'];
      var groupKey = groupParts.join(' — ');

      if (!groups[groupKey]) {
        groups[groupKey] = {
          label: groupKey,
          count: 0,
          revenue: 0,
          activeCount: 0,
          pausedCount: 0
        };
      }
      groups[groupKey].count++;
      groups[groupKey].revenue += parseCurrency(s.cost);
      var st = (s.status || '').toLowerCase();
      if (st === 'active') groups[groupKey].activeCount++;
      if (st === 'paused') groups[groupKey].pausedCount++;
    });

    return Object.keys(groups).map(function (k) {
      return groups[k];
    });
  }

  function initAdminSubscriptions(config) {
    config = config || {};
    var API_URL = config.apiUrl || '';
    var manageBaseUrl = config.manageBaseUrl || '/subscriptions/manage/';

    var gateSection = document.getElementById('sub-admin-gate-section');
    var dashboardSection = document.getElementById('sub-admin-dashboard-section');
    var gateForm = document.getElementById('sub-admin-gate-form');
    var passcodeInput = document.getElementById('sub-admin-passcode-input');
    var gateError = document.getElementById('sub-admin-gate-error');

    var statsContainer = document.getElementById('sub-admin-stats');
    var queueContainer = document.getElementById('sub-admin-queue');
    var inspectorContainer = document.getElementById('sub-admin-inspector');
    var searchInput = document.getElementById('sub-admin-search-input');
    var filterPills = document.querySelectorAll('#sub-admin-filters .order-admin-filter-pill');
    var tabBtns = document.querySelectorAll('#sub-admin-tabs .roast-admin-tab-btn');
    var refreshBtn = document.getElementById('sub-admin-refresh-btn');
    var logoutBtn = document.getElementById('sub-admin-logout-btn');

    var panelQueue = document.getElementById('sub-admin-panel-queue');
    var panelTotals = document.getElementById('sub-admin-panel-totals');
    var totalsKpis = document.getElementById('sub-totals-kpis');
    var totalsTableWrap = document.getElementById('sub-totals-table-wrap');
    var totalsGroupPills = document.querySelectorAll('#sub-totals-group-pills .order-admin-filter-pill');
    var filterRoastSelect = document.getElementById('sub-totals-filter-roast');
    var filterSizeSelect = document.getElementById('sub-totals-filter-size');
    var filterFreqSelect = document.getElementById('sub-totals-filter-freq');
    var filterStatusSelect = document.getElementById('sub-totals-filter-status');

    var allSubscriptions = [];
    var currentFilter = 'all';
    var currentSearch = '';
    var currentSelectedId = null;
    var currentGroupBy = ['roast'];
    var currentPasscode = '';

    function checkAuth() {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        currentPasscode = saved;
        showDashboard();
        loadSubscriptions();
      } else {
        showGate();
      }
    }

    function showGate() {
      document.documentElement.classList.remove('ywr-admin-authenticated');
      gateSection.style.display = 'block';
      dashboardSection.style.display = 'none';
      if (passcodeInput) passcodeInput.focus();
    }

    function showDashboard() {
      document.documentElement.classList.add('ywr-admin-authenticated');
      gateSection.style.display = 'none';
      dashboardSection.style.display = 'block';
    }

    function resolveAdminHash(passcode) {
      var trimmed = (passcode || '').trim();
      if (trimmed.length === 64 && /^[0-9a-f]+$/i.test(trimmed)) {
        return Promise.resolve(trimmed.toLowerCase());
      }
      return computeBrowserHash(trimmed, DEFAULT_SALT);
    }

    function loadSubscriptions() {
      queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #8a7060; font-style: italic;">Loading recurring subscriptions...</div>';

      if (!API_URL) {
        queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #c0392b;">API URL is not configured.</div>';
        return;
      }

      resolveAdminHash(currentPasscode).then(function (adminHash) {
        var fetchUrl = API_URL + (API_URL.indexOf('?') === -1 ? '?' : '&') +
          'action=admin_list&adminHash=' + encodeURIComponent(adminHash);

        fetch(fetchUrl, { credentials: 'omit' })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              if (data.error.indexOf('Unauthorized') !== -1) {
                localStorage.removeItem(STORAGE_KEY);
                showGate();
                if (gateError) {
                  gateError.textContent = 'Invalid roaster passcode.';
                  gateError.style.display = 'block';
                }
              } else {
                queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #c0392b; font-weight: 500;">API Error: ' + escapeHtml(data.error) + '</div>';
              }
            } else {
              allSubscriptions = data.subscriptions || [];
              renderAll();
            }
          })
          .catch(function (err) {
            console.error('admin-subscriptions: Fetch error:', err);
            queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #c0392b; font-weight: 500;">Could not connect to live subscription API (' + escapeHtml(err.message || 'Network error') + ').</div>';
          });
      });
    }

    function renderAll() {
      renderStats();
      renderQueue();
      populateTotalsFilters();
      renderTotals();
    }

    function renderStats() {
      var stats = computeSubscriptionStats(allSubscriptions);
      statsContainer.innerHTML =
        '<span style="font-weight: 700; color: #2c1e14;">' + stats.active + '</span> Active &bull; ' +
        '<span style="font-weight: 700; color: #f39c12;">' + stats.paused + '</span> Paused &bull; ' +
        '<span style="font-weight: 700; color: #8a7060;">$' + stats.recurringRevenue.toFixed(2) + '</span>/cycle';
    }

    function renderQueue() {
      var filtered = filterSubscriptions(allSubscriptions, currentFilter, currentSearch);
      queueContainer.innerHTML = '';

      if (filtered.length === 0) {
        currentSelectedId = null;
        if (!allSubscriptions || allSubscriptions.length === 0) {
          queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #8a7060; font-style: italic;">No subscriptions found in database.</div>';
        } else {
          queueContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #8a7060; font-style: italic;">No subscriptions found matching this filter.</div>';
        }
        renderInspector(null);
        return;
      }

      if (currentSelectedId) {
        var isSelectedInFiltered = filtered.some(function (s) { return s.orderId === currentSelectedId; });
        if (!isSelectedInFiltered) {
          currentSelectedId = null;
        }
      }

      filtered.forEach(function (sub) {
        var item = document.createElement('div');
        item.className = 'order-admin-card-item' + (sub.orderId === currentSelectedId ? ' order-admin-card-item--selected' : '');
        item.setAttribute('data-id', sub.orderId);

        var badgeClass = getStatusBadgeClass(sub.status);
        var timeHtml = sub.timestamp ? '<span class="order-admin-card-time">' + escapeHtml(sub.timestamp) + '</span>' : '';
        item.innerHTML =
          '<div class="order-admin-card-header">' +
          '<div class="order-admin-card-id-wrap">' +
          '<span class="order-admin-card-id">#' + escapeHtml(sub.orderId) + '</span>' +
          timeHtml +
          '</div>' +
          '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
          '</div>' +
          '<div class="order-admin-card-sub">' +
          '<span class="order-admin-card-name">' + escapeHtml(sub.name || 'Subscriber') + '</span>' +
          '<span class="order-admin-card-delivery">' + escapeHtml(sub.deliveryMethod || 'Pickup') + '</span>' +
          '</div>';

        item.addEventListener('click', function () {
          currentSelectedId = sub.orderId;
          document.querySelectorAll('.order-admin-card-item').forEach(function (el) {
            el.classList.remove('order-admin-card-item--selected');
          });
          item.classList.add('order-admin-card-item--selected');
          renderInspector(sub);
        });

        queueContainer.appendChild(item);
      });

      var currentSelected = currentSelectedId
        ? allSubscriptions.find(function (s) { return s.orderId === currentSelectedId; })
        : null;
      renderInspector(currentSelected);
    }

    function renderInspector(sub) {
      if (!sub) {
        inspectorContainer.innerHTML = '<div class="order-admin-inspector-empty">Select a subscription from the queue to view details and update status.</div>';
        return;
      }
      var badgeClass = getStatusBadgeClass(sub.status);
      var magicLink = window.location.origin + manageBaseUrl + '?orderId=' + encodeURIComponent(sub.orderId) + '&token=' + encodeURIComponent(sub.token);

      var costDisplay = sub.cost ? (sub.cost.indexOf('$') === 0 ? sub.cost : '$' + sub.cost) : '';
      var priceHtml = costDisplay
        ? '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
          '<span class="order-admin-inspector-price">' + escapeHtml(costDisplay) + (sub.frequency ? ' <span style="font-size: 0.8rem; font-weight: 500; color: #8a7060;">/ ' + escapeHtml(sub.frequency) + '</span>' : '') + '</span>'
        : '';

      var fulfillmentHtml = '<div class="order-admin-info-line"><strong>Method:</strong> ' + escapeHtml(sub.deliveryMethod || 'Pickup') + '</div>';
      if ((sub.deliveryMethod || '').toLowerCase() === 'hand delivery' && sub.address) {
        var addressLine = escapeHtml(sub.address) + (sub.city ? ', ' + escapeHtml(sub.city) : '') +
          (sub.state ? ' ' + escapeHtml(sub.state) : '') + (sub.zip ? ' ' + escapeHtml(sub.zip) : '');
        fulfillmentHtml += '<div class="order-admin-info-line"><strong>Address:</strong> ' + addressLine + '</div>';
      }

      var itemsList = [];
      if (sub.roast) itemsList.push('<strong>Roast:</strong> ' + escapeHtml(sub.roast));
      if (sub.size) itemsList.push('<strong>Size:</strong> ' + escapeHtml(sub.size));
      if (sub.frequency) itemsList.push('<strong>Frequency:</strong> ' + escapeHtml(sub.frequency));
      if (sub.cost) itemsList.push('<strong>Price / Period:</strong> ' + escapeHtml(sub.cost));

      var itemsBoxHtml = '<div class="order-admin-items-box">' +
        '<ul class="order-admin-items-list">' +
        itemsList.map(function (it) {
          return '<li>' + it + '</li>';
        }).join('') +
        '</ul>' +
        '</div>';

      var notesHtml = '';
      if (sub.notes) {
        notesHtml = '<div class="order-admin-section-block">' +
          '<div class="order-admin-section-label">Customer Instructions</div>' +
          '<div class="order-admin-info-line">' + escapeHtml(sub.notes) + '</div>' +
          '</div>';
      }

      var html = '<div class="order-admin-inspector-header">' +
        '<div class="order-admin-inspector-title-wrap">' +
        '<h3 class="order-admin-inspector-title">Subscription #' + escapeHtml(sub.orderId) + '</h3>' +
        priceHtml +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Contact</div>' +
        '<div class="order-admin-info-line"><strong>Name:</strong> ' + escapeHtml(sub.name || 'Subscriber') + '</div>' +
        '<div class="order-admin-info-line"><strong>Email:</strong> <a href="mailto:' + escapeHtml(sub.email) + '">' + escapeHtml(sub.email) + '</a></div>' +
        (sub.phone ? '<div class="order-admin-info-line"><strong>Phone:</strong> ' + escapeHtml(sub.phone) + '</div>' : '') +
        (sub.timestamp ? '<div class="order-admin-info-line"><strong>Started:</strong> ' + escapeHtml(sub.timestamp) + '</div>' : '') +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Fulfillment Details</div>' +
        fulfillmentHtml +
        '</div>' +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Subscribed Plan</div>' +
        itemsBoxHtml +
        '</div>' +

        notesHtml +

        '<div class="order-admin-section-block">' +
        '<div class="order-admin-section-label">Customer Portal Link</div>' +
        '<div class="order-admin-info-line"><a href="' + escapeHtml(magicLink) + '" target="_blank" rel="noopener">Open Customer View &rarr;</a></div>' +
        '</div>' +

        '<div class="order-admin-status-box">' +
        '<div class="order-admin-section-label">Fulfillment Status</div>' +
        '<select id="sub-status-select" class="order-admin-status-picker">' +
        '<option value="Active"' + (sub.status === 'Active' ? ' selected' : '') + '>Active</option>' +
        '<option value="Paused"' + (sub.status === 'Paused' ? ' selected' : '') + '>Paused</option>' +
        '<option value="Cancelled"' + (sub.status === 'Cancelled' ? ' selected' : '') + '>Cancelled</option>' +
        '</select>' +
        '<textarea id="sub-status-details-input" class="order-admin-textarea" placeholder="Update notes, roaster note, or delivery cycle info...">' +
        escapeHtml(sub.statusDetails || '') +
        '</textarea>' +
        '<label class="order-admin-checkbox-label">' +
        '<input type="checkbox" id="sub-notify-customer-check">' +
        '<span>Send email notification to subscriber (BCC roaster)</span>' +
        '</label>' +
        '<div id="sub-notice-pill" class="order-admin-notice-pill">' +
        '<span>🔕 Silent update: No email will be sent to the subscriber.</span>' +
        '</div>' +
        '<button type="button" id="sub-save-status-btn" class="order-admin-save-btn">Save Status</button>' +
        '<div id="sub-save-feedback" class="order-admin-feedback" style="display: none;"></div>' +
        '</div>';

      inspectorContainer.innerHTML = html;

      // Wire status update controls
      var statusSelect = document.getElementById('sub-status-select');
      var detailsInput = document.getElementById('sub-status-details-input');
      var notifyCheck = document.getElementById('sub-notify-customer-check');
      var noticePill = document.getElementById('sub-notice-pill');
      var saveBtn = document.getElementById('sub-save-status-btn');
      var feedback = document.getElementById('sub-save-feedback');

      if (notifyCheck && saveBtn && noticePill) {
        notifyCheck.addEventListener('change', function () {
          if (notifyCheck.checked) {
            saveBtn.textContent = 'Save & Send Notification';
            noticePill.className = 'order-admin-notice-pill order-admin-notice-pill--notify';
            noticePill.innerHTML = '<span>⚡ Status update email will be sent to subscriber and BCC roaster.</span>';
          } else {
            saveBtn.textContent = 'Save Status';
            noticePill.className = 'order-admin-notice-pill';
            noticePill.innerHTML = '<span>🔕 Silent update: No email will be sent to the subscriber.</span>';
          }
        });
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', function () {
          var newStatus = statusSelect.value;
          var newDetails = detailsInput.value.trim();
          var notify = notifyCheck ? notifyCheck.checked : false;

          saveBtn.textContent = notify ? 'Saving & Notifying...' : 'Saving...';
          saveBtn.disabled = true;
          feedback.style.display = 'none';

          resolveAdminHash(currentPasscode).then(function (adminHash) {
            fetch(API_URL, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              body: JSON.stringify({
                action: 'admin_update_status',
                adminHash: adminHash,
                orderId: sub.orderId,
                status: newStatus,
                statusDetails: newDetails,
                notifyCustomer: notify
              })
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
              saveBtn.disabled = false;
              saveBtn.textContent = notify ? 'Save & Send Notification' : 'Save Status';
              if (data.error) {
                feedback.className = 'order-admin-feedback order-admin-feedback--error';
                feedback.textContent = 'Failed to update: ' + data.error;
                feedback.style.display = 'block';
              } else {
                sub.status = newStatus;
                sub.statusDetails = newDetails;

                renderStats();
                renderQueue();
                renderInspector(sub);
                populateTotalsFilters();
                if (panelTotals.classList.contains('roast-admin-panel--active')) {
                  renderTotals();
                }

                var newFeedback = document.getElementById('sub-save-feedback');
                if (newFeedback) {
                  newFeedback.className = 'order-admin-feedback order-admin-feedback--success';
                  newFeedback.textContent = '✓ Subscription #' + sub.orderId + ' updated to ' + newStatus + (notify ? ' (email sent)!' : ' (saved silently)!');
                  newFeedback.style.display = 'block';
                }
              }
            })
            .catch(function (err) {
              console.error('admin-subscriptions: Update error:', err);
              saveBtn.disabled = false;
              saveBtn.textContent = notify ? 'Save & Send Notification' : 'Save Status';
              feedback.className = 'order-admin-feedback order-admin-feedback--error';
              feedback.textContent = 'Error updating subscription: ' + (err.message || 'Network error');
              feedback.style.display = 'block';
            });
          });
        });
      }
    }

    function populateTotalsFilters() {
      var roasts = [];
      var sizes = [];
      var freqs = [];

      allSubscriptions.forEach(function (s) {
        if (s.roast && roasts.indexOf(s.roast) === -1) roasts.push(s.roast);
        if (s.size && sizes.indexOf(s.size) === -1) sizes.push(s.size);
        if (s.frequency && freqs.indexOf(s.frequency) === -1) freqs.push(s.frequency);
      });

      if (filterRoastSelect) {
        var currentRoast = filterRoastSelect.value;
        filterRoastSelect.innerHTML = '<option value="all">All Roasts</option>' +
          roasts.map(function (r) {
            return '<option value="' + escapeHtml(r.toLowerCase()) + '"' + (currentRoast === r.toLowerCase() ? ' selected' : '') + '>' + escapeHtml(r) + '</option>';
          }).join('');
      }

      if (filterSizeSelect) {
        var currentSize = filterSizeSelect.value;
        filterSizeSelect.innerHTML = '<option value="all">All Sizes</option>' +
          sizes.map(function (sz) {
            return '<option value="' + escapeHtml(sz.toLowerCase()) + '"' + (currentSize === sz.toLowerCase() ? ' selected' : '') + '>' + escapeHtml(sz) + '</option>';
          }).join('');
      }

      if (filterFreqSelect) {
        var currentFreq = filterFreqSelect.value;
        filterFreqSelect.innerHTML = '<option value="all">All Frequencies</option>' +
          freqs.map(function (fq) {
            return '<option value="' + escapeHtml(fq.toLowerCase()) + '"' + (currentFreq === fq.toLowerCase() ? ' selected' : '') + '>' + escapeHtml(fq) + '</option>';
          }).join('');
      }
    }

    function renderTotals() {
      var filters = {
        roast: filterRoastSelect ? filterRoastSelect.value : 'all',
        size: filterSizeSelect ? filterSizeSelect.value : 'all',
        frequency: filterFreqSelect ? filterFreqSelect.value : 'all',
        status: filterStatusSelect ? filterStatusSelect.value : 'all'
      };

      var groups = computeSubscriptionTotals(allSubscriptions, currentGroupBy, filters);
      var stats = computeSubscriptionStats(allSubscriptions);

      // Render KPIs
      totalsKpis.innerHTML =
        '<div class="roast-admin-kpi-card">' +
        '<div class="roast-admin-kpi-value">' + stats.active + '</div>' +
        '<div class="roast-admin-kpi-label">Active Subscribers</div>' +
        '</div>' +
        '<div class="roast-admin-kpi-card">' +
        '<div class="roast-admin-kpi-value">' + stats.paused + '</div>' +
        '<div class="roast-admin-kpi-label">Paused Subscribers</div>' +
        '</div>' +
        '<div class="roast-admin-kpi-card">' +
        '<div class="roast-admin-kpi-value">$' + stats.recurringRevenue.toFixed(2) + '</div>' +
        '<div class="roast-admin-kpi-label">Active Recurring / Cycle</div>' +
        '</div>' +
        '<div class="roast-admin-kpi-card">' +
        '<div class="roast-admin-kpi-value">' + groups.reduce(function (sum, g) { return sum + g.count; }, 0) + '</div>' +
        '<div class="roast-admin-kpi-label">Filtered Deliveries</div>' +
        '</div>';

      // Render Table
      if (groups.length === 0) {
        totalsTableWrap.innerHTML = '<div style="padding: 2rem; text-align: center; color: #8a7060; font-style: italic;">No subscription groups match current filters.</div>';
        return;
      }

      var tableHtml = '<table class="roast-admin-table">' +
        '<thead>' +
        '<tr>' +
        '<th>' + currentGroupBy.map(function (k) { return k.charAt(0).toUpperCase() + k.slice(1); }).join(' / ') + '</th>' +
        '<th style="text-align: right;">Subscriptions</th>' +
        '<th style="text-align: right;">Active</th>' +
        '<th style="text-align: right;">Paused</th>' +
        '<th style="text-align: right;">Revenue</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

      var totalCount = 0;
      var totalActive = 0;
      var totalPaused = 0;
      var totalRev = 0;

      groups.forEach(function (g) {
        totalCount += g.count;
        totalActive += g.activeCount;
        totalPaused += g.pausedCount;
        totalRev += g.revenue;

        tableHtml += '<tr>' +
          '<td style="font-weight: 600; color: #2c1e14;">' + escapeHtml(g.label) + '</td>' +
          '<td style="text-align: right; font-weight: 700;">' + g.count + '</td>' +
          '<td style="text-align: right; color: #1e824c;">' + g.activeCount + '</td>' +
          '<td style="text-align: right; color: #f39c12;">' + g.pausedCount + '</td>' +
          '<td style="text-align: right; font-weight: 700; color: #2c1e14;">$' + g.revenue.toFixed(2) + '</td>' +
          '</tr>';
      });

      tableHtml += '</tbody>' +
        '<tfoot>' +
        '<tr style="border-top: 2px solid #2c1e14; font-weight: 700;">' +
        '<td>Total</td>' +
        '<td style="text-align: right;">' + totalCount + '</td>' +
        '<td style="text-align: right; color: #1e824c;">' + totalActive + '</td>' +
        '<td style="text-align: right; color: #f39c12;">' + totalPaused + '</td>' +
        '<td style="text-align: right;">$' + totalRev.toFixed(2) + '</td>' +
        '</tr>' +
        '</tfoot>' +
        '</table>';

      totalsTableWrap.innerHTML = tableHtml;
    }

    // Event Listeners: Passcode Form
    if (gateForm) {
      gateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var key = passcodeInput ? passcodeInput.value.trim() : '';
        if (!key) return;

        computeBrowserHash(key, DEFAULT_SALT).then(function (hash) {
          if (hash === ADMIN_PASSWORD_HASH) {
            localStorage.setItem(STORAGE_KEY, key);
            currentPasscode = key;
            if (gateError) gateError.style.display = 'none';
            showDashboard();
            loadSubscriptions();
          } else {
            if (gateError) {
              gateError.textContent = 'Invalid passcode. Please check and try again.';
              gateError.style.display = 'block';
            }
          }
        });
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        currentPasscode = '';
        showGate();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        loadSubscriptions();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value.trim();
        renderQueue();
      });
    }

    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
        pill.classList.add('order-admin-filter-pill--active');
        currentFilter = pill.getAttribute('data-filter');
        renderQueue();
      });
    });

    tabBtns.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabBtns.forEach(function (t) {
          t.classList.remove('roast-admin-tab-btn--active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('roast-admin-tab-btn--active');
        tab.setAttribute('aria-selected', 'true');

        var targetTab = tab.getAttribute('data-tab');
        if (targetTab === 'queue') {
          panelQueue.classList.add('roast-admin-panel--active');
          panelTotals.classList.remove('roast-admin-panel--active');
        } else {
          panelTotals.classList.add('roast-admin-panel--active');
          panelQueue.classList.remove('roast-admin-panel--active');
          renderTotals();
        }
      });
    });

    totalsGroupPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        totalsGroupPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
        pill.classList.add('order-admin-filter-pill--active');
        currentGroupBy = [pill.getAttribute('data-group')];
        renderTotals();
      });
    });

    [filterRoastSelect, filterSizeSelect, filterFreqSelect, filterStatusSelect].forEach(function (sel) {
      if (sel) {
        sel.addEventListener('change', function () {
          renderTotals();
        });
      }
    });

    // Initial Auth Check
    checkAuth();
  }

  return {
    initAdminSubscriptions: initAdminSubscriptions,
    filterSubscriptions: filterSubscriptions,
    computeSubscriptionStats: computeSubscriptionStats,
    computeSubscriptionTotals: computeSubscriptionTotals
  };
});
