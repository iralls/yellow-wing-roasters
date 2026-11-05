/**
 * Yellow Wing Roasters - Owner Gift Card & Promo Dashboard Controller (/gift/admin/)
 * Provides secure owner authentication, live gift card balance tracking, promo code management,
 * email dispatch, and code creation tools.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.initAdminGiftCodes = exp.initAdminGiftCodes;
    root.filterGiftCards = exp.filterGiftCards;
    root.filterPromoCodes = exp.filterPromoCodes;
    root.computeGiftStats = exp.computeGiftStats;
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

  function formatCurrency(val) {
    var num = parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return '$' + num.toFixed(2);
  }

  function getStatusBadgeClass(status) {
    var s = (status || '').toLowerCase();
    if (s === 'active') return 'status-active';
    if (s === 'scheduled') return 'status-paused';
    if (s === 'redeemed' || s === 'expired') return 'status-cancelled';
    return 'status-active';
  }

  function generateRandomGiftCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var res = '';
    for (var i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'GIFT-' + res;
  }

  function filterGiftCards(cards, activeFilter, searchQuery) {
    if (!cards || !cards.length) return [];
    var q = (searchQuery || '').trim().toLowerCase();
    var filter = (activeFilter || 'all').toLowerCase();

    return cards.filter(function (card) {
      var s = (card.status || '').toLowerCase();
      if (filter === 'active' && s !== 'active') return false;
      if (filter === 'redeemed' && s !== 'redeemed') return false;
      if (filter === 'expired' && s !== 'expired') return false;

      if (!q) return true;

      var matchCode = String(card.code || '').toLowerCase().indexOf(q) !== -1;
      var matchPName = String(card.purchaserName || '').toLowerCase().indexOf(q) !== -1;
      var matchPEmail = String(card.purchaserEmail || '').toLowerCase().indexOf(q) !== -1;
      var matchRName = String(card.recipientName || '').toLowerCase().indexOf(q) !== -1;
      var matchREmail = String(card.recipientEmail || '').toLowerCase().indexOf(q) !== -1;
      var matchMsg = String(card.giftMessage || '').toLowerCase().indexOf(q) !== -1;
      var matchNotes = String(card.notes || '').toLowerCase().indexOf(q) !== -1;

      return matchCode || matchPName || matchPEmail || matchRName || matchREmail || matchMsg || matchNotes;
    });
  }

  function filterPromoCodes(promos, activeFilter, searchQuery) {
    if (!promos || !promos.length) return [];
    var q = (searchQuery || '').trim().toLowerCase();
    var filter = (activeFilter || 'all').toLowerCase();

    return promos.filter(function (promo) {
      var s = (promo.status || '').toLowerCase();
      if (filter === 'active' && s !== 'active') return false;
      if (filter === 'scheduled' && s !== 'scheduled') return false;
      if (filter === 'expired' && s !== 'expired') return false;

      if (!q) return true;

      var matchCode = String(promo.code || '').toLowerCase().indexOf(q) !== -1;
      var matchDesc = String(promo.description || '').toLowerCase().indexOf(q) !== -1;

      return matchCode || matchDesc;
    });
  }

  function computeGiftStats(giftCards, promoCodes) {
    var activeCardsCount = 0;
    var activeCardsBalance = 0;
    var redeemedCardsCount = 0;
    var redeemedTotal = 0;

    (giftCards || []).forEach(function (g) {
      var bal = parseFloat(g.currentBalance) || 0;
      var orig = parseFloat(g.originalAmount) || bal;
      if ((g.status || '').toLowerCase() === 'active' && bal > 0) {
        activeCardsCount++;
        activeCardsBalance += bal;
      } else {
        redeemedCardsCount++;
      }
      redeemedTotal += Math.max(0, orig - bal);
    });

    var activePromosCount = (promoCodes || []).filter(function (p) {
      return (p.status || '').toLowerCase() === 'active';
    }).length;

    return {
      activeCardsCount: activeCardsCount,
      activeCardsBalance: activeCardsBalance,
      redeemedCardsCount: redeemedCardsCount,
      redeemedTotal: redeemedTotal,
      activePromosCount: activePromosCount
    };
  }

  return {
    filterGiftCards: filterGiftCards,
    filterPromoCodes: filterPromoCodes,
    computeGiftStats: computeGiftStats,

    initAdminGiftCodes: function initAdminGiftCodes(config) {
      config = config || {};
      var API_URL = config.apiUrl;
      var orderUrl = config.orderUrl || '/order/';

      var gateSection = document.getElementById('gift-admin-gate-section');
      var gateForm = document.getElementById('gift-admin-gate-form');
      var gateInput = document.getElementById('gift-admin-passcode-input');
      var gateError = document.getElementById('gift-admin-gate-error');
      var gateBtn = document.getElementById('gift-admin-gate-btn');

      var dashboardSection = document.getElementById('gift-admin-dashboard-section');
      var refreshBtn = document.getElementById('gift-admin-refresh-btn');
      var logoutBtn = document.getElementById('gift-admin-logout-btn');
      var kpiGrid = document.getElementById('gift-admin-kpis');
      var statsText = document.getElementById('gift-admin-stats');
      var searchInput = document.getElementById('gift-admin-search-input');

      // Panels & Queues
      var panelCards = document.getElementById('gift-panel-cards');
      var panelPromos = document.getElementById('gift-panel-promos');
      var panelCreate = document.getElementById('gift-panel-create');

      var cardsQueue = document.getElementById('gift-cards-queue');
      var cardsInspector = document.getElementById('gift-cards-inspector');
      var promosQueue = document.getElementById('gift-promos-queue');
      var promosInspector = document.getElementById('gift-promos-inspector');

      // Creation forms
      var createGiftForm = document.getElementById('create-gift-form');
      var createPromoForm = document.getElementById('create-promo-form');
      var genCodeBtn = document.getElementById('create-gift-gen-btn');
      var createGiftCodeInput = document.getElementById('create-gift-code');

      // State
      var allGiftCards = [];
      var allPromoCodes = [];
      var activeTab = 'gift-cards';
      var activeCardFilter = 'all';
      var activePromoFilter = 'all';
      var selectedGiftCode = null;
      var selectedPromoCode = null;

      function unlockDashboard() {
        document.documentElement.classList.add('ywr-admin-authenticated');
        gateSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchAdminData();
      }

      function lockDashboard() {
        document.documentElement.classList.remove('ywr-admin-authenticated');
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        dashboardSection.style.display = 'none';
        gateSection.style.display = 'block';
        allGiftCards = [];
        allPromoCodes = [];
      }

      function renderKPIs() {
        var stats = computeGiftStats(allGiftCards, allPromoCodes);
        statsText.innerHTML =
          '<span class="order-admin-stat-pill order-admin-stat-pill--highlight">Cards: ' + allGiftCards.length + '</span>' +
          '<span class="order-admin-stat-pill">Active: ' + stats.activeCardsCount + '</span>' +
          '<span class="order-admin-stat-pill" style="color: #1e824c; background: #eafaf1; font-weight: 700;">' + formatCurrency(stats.activeCardsBalance) + '</span>' +
          '<span class="order-admin-stat-pill">Promos: ' + stats.activePromosCount + ' Active</span>';

        kpiGrid.innerHTML =
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #1e824c;">' + formatCurrency(stats.activeCardsBalance) + '</div>' +
            '<div class="roast-admin-kpi-label">Active Balance (' + stats.activeCardsCount + ' cards)</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #8a7060;">' + formatCurrency(stats.redeemedTotal) + '</div>' +
            '<div class="roast-admin-kpi-label">Redeemed (' + stats.redeemedCardsCount + ' used)</div>' +
          '</div>' +
          '<div class="roast-admin-kpi-card">' +
            '<div class="roast-admin-kpi-val" style="color: #92400e;">' + stats.activePromosCount + ' Active</div>' +
            '<div class="roast-admin-kpi-label">Live Promo Codes (' + allPromoCodes.length + ' total)</div>' +
          '</div>';
      }

      function renderGiftCards() {
        var query = searchInput ? searchInput.value : '';
        var filtered = filterGiftCards(allGiftCards, activeCardFilter, query);

        if (!filtered.length) {
          cardsQueue.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">No digital gift cards match the selected filter.</div>';
          cardsInspector.innerHTML = '<div class="order-admin-inspector-empty">Select a gift card from the queue to view metadata, edit balance, or resend emails.</div>';
          return;
        }

        cardsQueue.innerHTML = '';
        var selectedItem = null;

        filtered.forEach(function (card) {
          var isSelected = card.code === selectedGiftCode;
          if (isSelected) selectedItem = card;

          var itemEl = document.createElement('div');
          itemEl.className = 'order-admin-card-item' + (isSelected ? ' order-admin-card-item--selected' : '');

          var badgeClass = getStatusBadgeClass(card.status);
          var balStr = formatCurrency(card.currentBalance);
          var origStr = formatCurrency(card.originalAmount);

          var partySummary = card.recipientName || card.purchaserName || card.description || 'Gift Card';

          var balanceDisplay = balStr + (parseFloat(card.currentBalance) < parseFloat(card.originalAmount) ? ' <span style="font-size: 0.72rem; color: #8a7060; font-weight: normal;">/ ' + origStr + '</span>' : '');

          itemEl.innerHTML =
            '<div class="order-admin-card-header">' +
              '<div class="order-admin-card-id-wrap">' +
                '<span class="order-admin-card-id" style="font-family: monospace;">' + escapeHtml(card.code) + '</span>' +
                (card.timestamp ? '<span class="order-admin-card-time">' + escapeHtml(card.timestamp) + '</span>' : '') +
              '</div>' +
              '<span class="status-badge ' + badgeClass + '">' + escapeHtml(card.status) + '</span>' +
            '</div>' +
            '<div class="order-admin-card-sub">' +
              '<span class="order-admin-card-name">' + escapeHtml(partySummary) + '</span>' +
              '<span class="order-admin-card-delivery">' + balanceDisplay + '</span>' +
            '</div>';

          itemEl.addEventListener('click', function () {
            selectedGiftCode = card.code;
            renderGiftCards();
          });

          cardsQueue.appendChild(itemEl);
        });

        renderGiftInspector(selectedItem);
      }

      function renderGiftInspector(card) {
        if (!card) {
          cardsInspector.innerHTML = '<div class="order-admin-inspector-empty">Select a gift card from the queue to view metadata, edit balance, or resend emails.</div>';
          return;
        }

        var badgeClass = getStatusBadgeClass(card.status);
        var applyUrl = orderUrl + '?code=' + encodeURIComponent(card.code);
        var fullApplyUrl = window.location.origin + applyUrl;

        var balDisplay = formatCurrency(card.currentBalance);
        var origDisplay = formatCurrency(card.originalAmount);
        var priceDisplay = balDisplay + (parseFloat(card.currentBalance) < parseFloat(card.originalAmount) ? ' <span style="font-size: 0.8rem; font-weight: 500; color: #8a7060;">/ ' + origDisplay + '</span>' : '');

        var messageHtml = '';
        if (card.giftMessage) {
          messageHtml = '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Gift Message</div>' +
            '<div class="order-admin-items-box" style="font-style: italic;">&ldquo;' + escapeHtml(card.giftMessage) + '&rdquo;</div>' +
            '</div>';
        }

        var notesHtml = '';
        if (card.notes || card.description) {
          notesHtml = '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Internal Description / Notes</div>' +
            '<div class="order-admin-info-line">' + escapeHtml(card.notes || card.description) + '</div>' +
            '</div>';
        }

        cardsInspector.innerHTML =
          '<div class="order-admin-inspector-header">' +
            '<div class="order-admin-inspector-title-wrap">' +
              '<h3 class="order-admin-inspector-title" style="font-family: monospace;">' + escapeHtml(card.code) + '</h3>' +
              '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
              '<span class="order-admin-inspector-price">' + priceDisplay + '</span>' +
            '</div>' +
            '<span class="status-badge ' + badgeClass + '">' + escapeHtml(card.status) + '</span>' +
          '</div>' +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Parties &amp; Contact</div>' +
            '<div class="order-admin-info-line"><strong>Purchaser:</strong> ' + (card.purchaserName ? escapeHtml(card.purchaserName) + ' (' + escapeHtml(card.purchaserEmail) + ')' : '<span style="color:#8a7060; font-style:italic;">None recorded</span>') + '</div>' +
            '<div class="order-admin-info-line"><strong>Recipient:</strong> ' + (card.recipientName ? escapeHtml(card.recipientName) + ' (' + escapeHtml(card.recipientEmail) + ')' : '<span style="color:#8a7060; font-style:italic;">None recorded</span>') + '</div>' +
            (card.timestamp ? '<div class="order-admin-info-line"><strong>Created:</strong> ' + escapeHtml(card.timestamp) + '</div>' : '') +
            (card.endDate ? '<div class="order-admin-info-line"><strong>Expires:</strong> ' + escapeHtml(card.endDate) + '</div>' : '') +
          '</div>' +

          messageHtml +
          notesHtml +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Customer Portal Link</div>' +
            '<div class="order-admin-info-line"><a href="' + escapeHtml(fullApplyUrl) + '" target="_blank" rel="noopener">Open Customer View &rarr;</a></div>' +
          '</div>' +

          '<div class="order-admin-status-box">' +
            '<div class="order-admin-section-label">Balance &amp; Status Editor</div>' +
            '<div class="order-field-row">' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">Current Balance ($)</label>' +
                '<input type="number" id="edit-gift-balance" step="0.01" value="' + parseFloat(card.currentBalance) + '" class="order-admin-input">' +
              '</div>' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">Expiration Date</label>' +
                '<input type="date" id="edit-gift-end" value="' + escapeHtml(card.endDate) + '" class="order-admin-input">' +
              '</div>' +
            '</div>' +
            '<div class="order-field">' +
              '<label class="roast-mv-meta-label">Notes / Description</label>' +
              '<input type="text" id="edit-gift-desc" value="' + escapeHtml(card.description) + '" class="order-admin-input">' +
            '</div>' +
            '<div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">' +
              '<button type="button" id="save-gift-btn" class="order-admin-save-btn">Save Changes</button>' +
              '<button type="button" id="deactivate-gift-btn" class="order-admin-btn-sm" style="color: #c0392b;">Deactivate ($0)</button>' +
            '</div>' +
            '<div id="edit-gift-status" class="order-status" style="margin-top: 0.5rem;"></div>' +
          '</div>' +

          '<div class="order-admin-section-block" style="border-top: 1px solid #e8e0d5; padding-top: 0.75rem; margin-top: 1rem;">' +
            '<div class="order-admin-section-label">Resend Notifications</div>' +
            '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">' +
              '<button type="button" id="resend-recipient-btn" class="order-admin-btn-sm"' + (!card.recipientEmail ? ' disabled title="No recipient email on file"' : '') + '>Resend to Recipient</button>' +
              '<button type="button" id="resend-purchaser-btn" class="order-admin-btn-sm"' + (!card.purchaserEmail ? ' disabled title="No purchaser email on file"' : '') + '>Resend to Purchaser</button>' +
            '</div>' +
            '<div id="resend-status" class="order-status" style="margin-top: 0.5rem;"></div>' +
          '</div>';

        // Wire save changes
        var saveBtn = cardsInspector.querySelector('#save-gift-btn');
        var deactBtn = cardsInspector.querySelector('#deactivate-gift-btn');
        var editStatus = cardsInspector.querySelector('#edit-gift-status');

        if (saveBtn) {
          saveBtn.addEventListener('click', function () {
            var newBal = cardsInspector.querySelector('#edit-gift-balance').value;
            var newEnd = cardsInspector.querySelector('#edit-gift-end').value;
            var newDesc = cardsInspector.querySelector('#edit-gift-desc').value;
            updateCode({
              target: 'gift',
              code: card.code,
              value: newBal,
              endDate: newEnd,
              description: newDesc
            }, saveBtn, editStatus);
          });
        }

        if (deactBtn) {
          deactBtn.addEventListener('click', function () {
            if (!confirm('Deactivate gift card ' + card.code + '? This sets balance to $0.')) return;
            updateCode({
              target: 'gift',
              code: card.code,
              value: 0
            }, deactBtn, editStatus);
          });
        }

        // Wire resend email
        var resendRecipBtn = cardsInspector.querySelector('#resend-recipient-btn');
        var resendPurchBtn = cardsInspector.querySelector('#resend-purchaser-btn');
        var resendStatus = cardsInspector.querySelector('#resend-status');

        if (resendRecipBtn) {
          resendRecipBtn.addEventListener('click', function () {
            resendEmail(card.code, 'recipient', resendRecipBtn, resendStatus);
          });
        }
        if (resendPurchBtn) {
          resendPurchBtn.addEventListener('click', function () {
            resendEmail(card.code, 'purchaser', resendPurchBtn, resendStatus);
          });
        }
      }

      function renderPromoCodes() {
        var query = searchInput ? searchInput.value : '';
        var filtered = filterPromoCodes(allPromoCodes, activePromoFilter, query);

        if (!filtered.length) {
          promosQueue.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">No promo codes match the selected filter.</div>';
          promosInspector.innerHTML = '<div class="order-admin-inspector-empty">Select a promo code from the queue to view details or adjust validity.</div>';
          return;
        }

        promosQueue.innerHTML = '';
        var selectedItem = null;

        filtered.forEach(function (promo) {
          var isSelected = promo.code === selectedPromoCode;
          if (isSelected) selectedItem = promo;

          var itemEl = document.createElement('div');
          itemEl.className = 'order-admin-card-item' + (isSelected ? ' order-admin-card-item--selected' : '');

          var badgeClass = getStatusBadgeClass(promo.status);
          var discBadge = promo.type === 'percent' ? (promo.value + '% Off') : (formatCurrency(promo.value) + ' Off');

          itemEl.innerHTML =
            '<div class="order-admin-card-header">' +
              '<div class="order-admin-card-id-wrap">' +
                '<span class="order-admin-card-id" style="font-family: monospace;">' + escapeHtml(promo.code) + '</span>' +
                (promo.startDate ? '<span class="order-admin-card-time">' + escapeHtml(promo.startDate) + '</span>' : '') +
              '</div>' +
              '<span class="status-badge ' + badgeClass + '">' + escapeHtml(promo.status) + '</span>' +
            '</div>' +
            '<div class="order-admin-card-sub">' +
              '<span class="order-admin-card-name">' + escapeHtml(promo.description || 'Storewide Discount') + '</span>' +
              '<span class="order-admin-card-delivery">' + escapeHtml(discBadge) + '</span>' +
            '</div>';

          itemEl.addEventListener('click', function () {
            selectedPromoCode = promo.code;
            renderPromoCodes();
          });

          promosQueue.appendChild(itemEl);
        });

        renderPromoInspector(selectedItem);
      }

      function renderPromoInspector(promo) {
        if (!promo) {
          promosInspector.innerHTML = '<div class="order-admin-inspector-empty">Select a promo code from the queue to view details or adjust validity.</div>';
          return;
        }

        var badgeClass = getStatusBadgeClass(promo.status);
        var discBadge = promo.type === 'percent' ? (promo.value + '% Off') : (formatCurrency(promo.value) + ' Off');
        var applyUrl = orderUrl + '?code=' + encodeURIComponent(promo.code);
        var fullApplyUrl = window.location.origin + applyUrl;

        promosInspector.innerHTML =
          '<div class="order-admin-inspector-header">' +
            '<div class="order-admin-inspector-title-wrap">' +
              '<h3 class="order-admin-inspector-title" style="font-family: monospace;">' + escapeHtml(promo.code) + '</h3>' +
              '<span class="order-admin-inspector-divider" aria-hidden="true">|</span>' +
              '<span class="order-admin-inspector-price">' + escapeHtml(discBadge) + '</span>' +
            '</div>' +
            '<span class="status-badge ' + badgeClass + '">' + escapeHtml(promo.status) + '</span>' +
          '</div>' +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Promotion Details</div>' +
            '<div class="order-admin-info-line"><strong>Discount:</strong> ' + escapeHtml(discBadge) + '</div>' +
            (promo.description ? '<div class="order-admin-info-line"><strong>Description:</strong> ' + escapeHtml(promo.description) + '</div>' : '') +
            (promo.startDate ? '<div class="order-admin-info-line"><strong>Start Date:</strong> ' + escapeHtml(promo.startDate) + '</div>' : '') +
            (promo.endDate ? '<div class="order-admin-info-line"><strong>End Date:</strong> ' + escapeHtml(promo.endDate) + '</div>' : '') +
          '</div>' +

          '<div class="order-admin-section-block">' +
            '<div class="order-admin-section-label">Customer Portal Link</div>' +
            '<div class="order-admin-info-line"><a href="' + escapeHtml(fullApplyUrl) + '" target="_blank" rel="noopener">Open Customer View &rarr;</a></div>' +
          '</div>' +

          '<div class="order-admin-status-box">' +
            '<div class="order-admin-section-label">Promo Rule Editor</div>' +
            '<div class="order-field-row">' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">Discount Type</label>' +
                '<select id="edit-promo-type" class="roast-admin-select">' +
                  '<option value="percent"' + (promo.type === 'percent' ? ' selected' : '') + '>Percent Off (%)</option>' +
                  '<option value="flat"' + (promo.type === 'flat' ? ' selected' : '') + '>Flat Amount ($)</option>' +
                '</select>' +
              '</div>' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">Value</label>' +
                '<input type="number" id="edit-promo-value" step="0.01" value="' + parseFloat(promo.value) + '" class="order-admin-input">' +
              '</div>' +
            '</div>' +
            '<div class="order-field-row">' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">Start Date</label>' +
                '<input type="date" id="edit-promo-start" value="' + escapeHtml(promo.startDate) + '" class="order-admin-input">' +
              '</div>' +
              '<div class="order-field">' +
                '<label class="roast-mv-meta-label">End Date</label>' +
                '<input type="date" id="edit-promo-end" value="' + escapeHtml(promo.endDate) + '" class="order-admin-input">' +
              '</div>' +
            '</div>' +
            '<div class="order-field">' +
              '<label class="roast-mv-meta-label">Description / Note</label>' +
              '<input type="text" id="edit-promo-desc" value="' + escapeHtml(promo.description) + '" class="order-admin-input">' +
            '</div>' +
            '<div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">' +
              '<button type="button" id="save-promo-btn" class="order-admin-save-btn">Save Changes</button>' +
              '<button type="button" id="deactivate-promo-btn" class="order-admin-btn-sm" style="color: #c0392b;">Expire Now</button>' +
            '</div>' +
            '<div id="edit-promo-status" class="order-status" style="margin-top: 0.5rem;"></div>' +
          '</div>';

        // Wire save & deactivate
        var saveBtn = promosInspector.querySelector('#save-promo-btn');
        var deactBtn = promosInspector.querySelector('#deactivate-promo-btn');
        var editStatus = promosInspector.querySelector('#edit-promo-status');

        if (saveBtn) {
          saveBtn.addEventListener('click', function () {
            var newType = promosInspector.querySelector('#edit-promo-type').value;
            var newVal = promosInspector.querySelector('#edit-promo-value').value;
            var newStart = promosInspector.querySelector('#edit-promo-start').value;
            var newEnd = promosInspector.querySelector('#edit-promo-end').value;
            var newDesc = promosInspector.querySelector('#edit-promo-desc').value;
            updateCode({
              target: 'promo',
              code: promo.code,
              type: newType,
              value: newVal,
              startDate: newStart,
              endDate: newEnd,
              description: newDesc
            }, saveBtn, editStatus);
          });
        }

        if (deactBtn) {
          deactBtn.addEventListener('click', function () {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            var yStr = yesterday.toISOString().split('T')[0];
            updateCode({
              target: 'promo',
              code: promo.code,
              endDate: yStr
            }, deactBtn, editStatus);
          });
        }
      }

      function updateCode(payload, btnEl, statusEl) {
        var origText = btnEl.textContent;
        btnEl.textContent = 'Saving...';
        btnEl.disabled = true;
        if (statusEl) statusEl.textContent = '';

        var storedPass = localStorage.getItem(STORAGE_KEY) || '';
        resolveAdminHash(storedPass).then(function (hash) {
          payload.action = 'admin_update_code';
          payload.adminHash = hash;

          return fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(payload)
          });
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          btnEl.textContent = origText;
          btnEl.disabled = false;
          if (data.error) {
            if (statusEl) {
              statusEl.textContent = data.error;
              statusEl.className = 'order-status order-status-error';
            }
          } else {
            if (statusEl) {
              statusEl.textContent = 'Updated successfully!';
              statusEl.className = 'order-status order-status-success';
            }
            fetchAdminData();
          }
        })
        .catch(function (err) {
          console.error('Error updating code:', err);
          btnEl.textContent = origText;
          btnEl.disabled = false;
          if (statusEl) {
            statusEl.textContent = 'Network glitch updating code.';
            statusEl.className = 'order-status order-status-error';
          }
        });
      }

      function resendEmail(code, type, btnEl, statusEl) {
        var origText = btnEl.textContent;
        btnEl.textContent = 'Sending...';
        btnEl.disabled = true;
        if (statusEl) statusEl.textContent = '';

        var storedPass = localStorage.getItem(STORAGE_KEY) || '';
        resolveAdminHash(storedPass).then(function (hash) {
          return fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({
              action: 'admin_resend_email',
              adminHash: hash,
              code: code,
              recipientType: type
            })
          });
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          btnEl.textContent = origText;
          btnEl.disabled = false;
          if (data.error) {
            if (statusEl) {
              statusEl.textContent = data.error;
              statusEl.className = 'order-status order-status-error';
            }
          } else {
            if (statusEl) {
              statusEl.textContent = 'Email sent successfully!';
              statusEl.className = 'order-status order-status-success';
            }
          }
        })
        .catch(function (err) {
          console.error('Error resending email:', err);
          btnEl.textContent = origText;
          btnEl.disabled = false;
          if (statusEl) {
            statusEl.textContent = 'Failed to dispatch email.';
            statusEl.className = 'order-status order-status-error';
          }
        });
      }

      function fetchAdminData() {
        var storedPass = localStorage.getItem(STORAGE_KEY) || '';
        if (!storedPass) return;

        if (cardsQueue) {
          cardsQueue.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading gift cards...</div>';
        }
        if (promosQueue) {
          promosQueue.innerHTML = '<div class="order-admin-card-item" style="text-align: center; color: #8a7060; cursor: default;">Loading promo codes...</div>';
        }

        resolveAdminHash(storedPass).then(function (hash) {
          return fetch(API_URL + '?action=admin_list&adminHash=' + encodeURIComponent(hash));
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            console.error('Error fetching admin list:', data.error);
            if (data.error.indexOf('Unauthorized') !== -1) {
              lockDashboard();
            }
            return;
          }
          allGiftCards = data.giftCards || [];
          allPromoCodes = data.promoCodes || [];
          renderKPIs();
          if (activeTab === 'gift-cards') {
            renderGiftCards();
          } else if (activeTab === 'promo-codes') {
            renderPromoCodes();
          }
        })
        .catch(function (err) {
          console.error('Network glitch loading gift/promo codes:', err);
        });
      }

      // Wire Tab switching
      var tabBtns = document.querySelectorAll('#gift-admin-tabs .roast-admin-tab-btn');
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

          panelCards.classList.remove('roast-admin-panel--active');
          panelPromos.classList.remove('roast-admin-panel--active');
          panelCreate.classList.remove('roast-admin-panel--active');

          if (tab === 'gift-cards') {
            panelCards.classList.add('roast-admin-panel--active');
            renderGiftCards();
          } else if (tab === 'promo-codes') {
            panelPromos.classList.add('roast-admin-panel--active');
            renderPromoCodes();
          } else if (tab === 'create-code') {
            panelCreate.classList.add('roast-admin-panel--active');
          }
        });
      });

      // Wire Gift Card Filter Pills
      var cardFilterPills = document.querySelectorAll('#gift-card-filters .order-admin-filter-pill');
      cardFilterPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          cardFilterPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          this.classList.add('order-admin-filter-pill--active');
          activeCardFilter = this.getAttribute('data-filter');
          renderGiftCards();
        });
      });

      // Wire Promo Filter Pills
      var promoFilterPills = document.querySelectorAll('#gift-promo-filters .order-admin-filter-pill');
      promoFilterPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          promoFilterPills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          this.classList.add('order-admin-filter-pill--active');
          activePromoFilter = this.getAttribute('data-filter');
          renderPromoCodes();
        });
      });

      // Wire Create Code Type Pills
      var createTypePills = document.querySelectorAll('#gift-create-type-pills .order-admin-filter-pill');
      createTypePills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          createTypePills.forEach(function (p) { p.classList.remove('order-admin-filter-pill--active'); });
          this.classList.add('order-admin-filter-pill--active');
          var type = this.getAttribute('data-type');
          if (type === 'gift') {
            createGiftForm.style.display = 'block';
            createPromoForm.style.display = 'none';
          } else {
            createGiftForm.style.display = 'none';
            createPromoForm.style.display = 'block';
          }
        });
      });

      // Wire Random Code Generator
      if (genCodeBtn && createGiftCodeInput) {
        genCodeBtn.addEventListener('click', function () {
          createGiftCodeInput.value = generateRandomGiftCode();
        });
      }

      // Wire Create Gift Card Form
      if (createGiftForm) {
        createGiftForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var submitBtn = document.getElementById('create-gift-submit-btn');
          var statusEl = document.getElementById('create-gift-status');
          var origText = submitBtn.textContent;
          submitBtn.textContent = 'Creating...';
          submitBtn.disabled = true;
          statusEl.textContent = '';

          var payload = {
            target: 'gift',
            code: createGiftCodeInput.value.trim().toUpperCase(),
            value: document.getElementById('create-gift-amount').value,
            endDate: document.getElementById('create-gift-end-date').value,
            purchaserName: document.getElementById('create-gift-purchaser-name').value,
            purchaserEmail: document.getElementById('create-gift-purchaser-email').value,
            recipientName: document.getElementById('create-gift-recipient-name').value,
            recipientEmail: document.getElementById('create-gift-recipient-email').value,
            giftMessage: document.getElementById('create-gift-message').value,
            description: document.getElementById('create-gift-notes').value,
            sendRecipientEmail: document.getElementById('create-gift-send-recipient').checked,
            sendPurchaserEmail: document.getElementById('create-gift-send-purchaser').checked
          };

          var storedPass = localStorage.getItem(STORAGE_KEY) || '';
          resolveAdminHash(storedPass).then(function (hash) {
            payload.action = 'admin_create_code';
            payload.adminHash = hash;

            return fetch(API_URL, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              body: JSON.stringify(payload)
            });
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            if (data.error) {
              statusEl.textContent = data.error;
              statusEl.className = 'order-status order-status-error';
            } else {
              statusEl.textContent = 'Gift card created successfully!';
              statusEl.className = 'order-status order-status-success';
              createGiftForm.reset();
              selectedGiftCode = payload.code;
              // Switch to gift cards tab
              var giftTabBtn = document.querySelector('#gift-admin-tabs .roast-admin-tab-btn[data-tab="gift-cards"]');
              if (giftTabBtn) giftTabBtn.click();
              fetchAdminData();
            }
          })
          .catch(function (err) {
            console.error('Error creating gift card:', err);
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            statusEl.textContent = 'Technical glitch creating gift card.';
            statusEl.className = 'order-status order-status-error';
          });
        });
      }

      // Wire Create Promo Code Form
      if (createPromoForm) {
        createPromoForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var submitBtn = document.getElementById('create-promo-submit-btn');
          var statusEl = document.getElementById('create-promo-status');
          var origText = submitBtn.textContent;
          submitBtn.textContent = 'Creating...';
          submitBtn.disabled = true;
          statusEl.textContent = '';

          var payload = {
            target: 'promo',
            code: document.getElementById('create-promo-code').value.trim().toUpperCase(),
            type: document.getElementById('create-promo-type').value,
            value: document.getElementById('create-promo-value').value,
            startDate: document.getElementById('create-promo-start-date').value,
            endDate: document.getElementById('create-promo-end-date').value,
            description: document.getElementById('create-promo-desc').value
          };

          var storedPass = localStorage.getItem(STORAGE_KEY) || '';
          resolveAdminHash(storedPass).then(function (hash) {
            payload.action = 'admin_create_code';
            payload.adminHash = hash;

            return fetch(API_URL, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              body: JSON.stringify(payload)
            });
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            if (data.error) {
              statusEl.textContent = data.error;
              statusEl.className = 'order-status order-status-error';
            } else {
              statusEl.textContent = 'Promo code created successfully!';
              statusEl.className = 'order-status order-status-success';
              createPromoForm.reset();
              selectedPromoCode = payload.code;
              // Switch to promo codes tab
              var promoTabBtn = document.querySelector('#gift-admin-tabs .roast-admin-tab-btn[data-tab="promo-codes"]');
              if (promoTabBtn) promoTabBtn.click();
              fetchAdminData();
            }
          })
          .catch(function (err) {
            console.error('Error creating promo code:', err);
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            statusEl.textContent = 'Technical glitch creating promo code.';
            statusEl.className = 'order-status order-status-error';
          });
        });
      }

      // Wire Search Input
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          if (activeTab === 'gift-cards') renderGiftCards();
          else if (activeTab === 'promo-codes') renderPromoCodes();
        });
      }

      // Wire Refresh Button
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
          fetchAdminData();
        });
      }

      // Wire Logout Button
      if (logoutBtn) {
        logoutBtn.addEventListener('click', lockDashboard);
      }

      // Wire Gate Form Submission
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
