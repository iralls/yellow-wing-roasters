/**
 * Yellow Wing Roasters - Subscription Management
 * Handles secure token lookup, Magic Link dispatch, status tracking,
 * and subscriber self-service controls (Pause, Resume, Cancel).
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initManageSubscriptions = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initManageSubscriptions(options) {
    var API_URL = options.apiUrl;
    var resubscribeUrl = options.resubscribeUrl;

    var lookupForm = document.getElementById('sub-lookup-form');
    var lookupEmail = document.getElementById('sub-lookup-email');
    var lookupBtn = document.getElementById('sub-lookup-btn');
    var lookupStatus = document.getElementById('sub-lookup-status');

    var lookupSection = document.getElementById('sub-lookup-section');
    var resultsSection = document.getElementById('sub-results-section');
    var resultsIdDisplay = document.getElementById('sub-results-id-display');
    var subscriptionContent = document.getElementById('subscription-content');

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function formatPrice(val) {
      if (!val && val !== 0) return '';
      var str = String(val).trim();
      if (!str) return '';
      var clean = str.replace(/^\$/, '').replace(/,/g, '').trim();
      var num = parseFloat(clean);
      if (!isNaN(num) && /^(\d+(\.\d+)?|\.\d+)$/.test(clean)) {
        return '$' + num.toFixed(2);
      }
      if (str.charAt(0) === '$') return str;
      return '$' + str;
    }

    function getStatusBadgeClass(status) {
      var s = (status || '').toLowerCase();
      if (s === 'active') return 'status-active';
      if (s === 'paused') return 'status-paused';
      if (s === 'cancelled') return 'status-cancelled';
      return 'status-active';
    }

    function renderSubscriptionCard(sub, targetSlot) {
      targetSlot.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'sub-card';

      var badgeClass = getStatusBadgeClass(sub.status);
      var lowerStatus = (sub.status || '').toLowerCase();

      var html = '<div class="sub-header">' +
        '<h3 class="sub-title">Subscription #' + escapeHtml(sub.orderId) + '</h3>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
        '</div>';

      if (sub.timestamp) {
        html += '<div class="order-date">Started: ' + escapeHtml(sub.timestamp) + '</div>';
      }

      // Contextual status banners
      if (lowerStatus === 'paused') {
        html += '<div class="order-delay-box">' +
          '<strong>Deliveries Temporarily Paused:</strong> Your recurring orders are currently on hold.' +
          (sub.statusDetails ? ' <br><em>Reason: ' + escapeHtml(sub.statusDetails) + '</em>' : '') +
          '</div>';
      } else if (lowerStatus === 'cancelled') {
        html += '<div class="order-cancelled-box">' +
          '<strong>Subscription Cancelled:</strong> This subscription is no longer active.' +
          (sub.statusDetails ? ' <br><em>Reason: ' + escapeHtml(sub.statusDetails) + '</em>' : '') +
          '</div>';
      } else {
        html += '<div class="order-ready-box">' +
          '<strong>Subscription Active:</strong> Your coffee is scheduled for fulfillment according to our regular roast cycles.' +
          '</div>';
      }

      // Delivery Method
      html += '<div class="order-delivery-meta">' +
        '<strong>Delivery Method:</strong> ' + escapeHtml(sub.deliveryMethod);
      if (sub.deliveryMethod === 'Hand delivery' && sub.address) {
        html += ' &bull; ' + escapeHtml(sub.address) + ', ' + escapeHtml(sub.city) + ' ' + escapeHtml(sub.state) + ' ' + escapeHtml(sub.zip);
      }
      html += '</div>';

      // Detail Table
      html += '<div class="sub-detail-box">' +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="sub-detail-table">' +
        '<tr>' +
        '<td class="sub-detail-label">Roast</td>' +
        '<td class="sub-detail-val sub-detail-val--strong">' + escapeHtml(sub.roast) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="sub-detail-label">Bag Size</td>' +
        '<td class="sub-detail-val">' + escapeHtml(sub.size) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="sub-detail-label">Frequency</td>' +
        '<td class="sub-detail-val">' + escapeHtml(sub.frequency) + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>';

      var pauseInputId = 'pause-reason-' + escapeHtml(sub.orderId);
      var cancelInputId = 'cancel-reason-' + escapeHtml(sub.orderId);

      // Customer Actions
      if (lowerStatus === 'active') {
        html += '<div class="sub-actions js-actions-active">' +
          '<button type="button" class="action-pill-btn btn-secondary-pill js-trigger-pause">Pause Deliveries</button>' +
          '<button type="button" class="action-pill-btn btn-danger-pill js-trigger-cancel">Cancel Subscription</button>' +
          '</div>';

        // Hidden Pause Prompt
        html += '<div class="cancel-reason-container js-pause-container" style="display: none;">' +
          '<label for="' + pauseInputId + '" class="cancel-confirm-prompt">Optional note for pausing:</label>' +
          '<textarea id="' + pauseInputId + '" class="cancel-textarea js-pause-reason" rows="2" placeholder="e.g. Taking a vacation, resuming next month..."></textarea>' +
          '<div class="cancel-reason-actions">' +
          '<button type="button" class="action-pill-btn btn-primary-pill js-confirm-pause">Confirm Pause</button>' +
          '<button type="button" class="action-pill-btn btn-secondary-pill js-abort-pause">Keep Active</button>' +
          '</div>' +
          '</div>';

        // Hidden Cancel Prompt
        html += '<div class="cancel-reason-container js-cancel-container" style="display: none;">' +
          '<label for="' + cancelInputId + '" class="cancel-confirm-prompt">Reason for cancelling (optional):</label>' +
          '<textarea id="' + cancelInputId + '" class="cancel-textarea js-cancel-reason" rows="2" placeholder="Tell us if there\'s anything we can do better..."></textarea>' +
          '<div class="cancel-reason-actions">' +
          '<button type="button" class="action-pill-btn btn-danger-pill js-confirm-cancel">Confirm Cancellation</button>' +
          '<button type="button" class="action-pill-btn btn-secondary-pill js-abort-cancel">Keep Subscription</button>' +
          '</div>' +
          '</div>';
      } else if (lowerStatus === 'paused') {
        html += '<div class="sub-actions js-actions-paused">' +
          '<button type="button" class="action-pill-btn btn-primary-pill js-confirm-resume">Resume Deliveries</button>' +
          '<button type="button" class="action-pill-btn btn-danger-pill js-trigger-cancel">Cancel Subscription</button>' +
          '</div>';

        // Hidden Cancel Prompt
        html += '<div class="cancel-reason-container js-cancel-container" style="display: none;">' +
          '<label for="' + cancelInputId + '" class="cancel-confirm-prompt">Reason for cancelling (optional):</label>' +
          '<textarea id="' + cancelInputId + '" class="cancel-textarea js-cancel-reason" rows="2" placeholder="Tell us if there\'s anything we can do better..."></textarea>' +
          '<div class="cancel-reason-actions">' +
          '<button type="button" class="action-pill-btn btn-danger-pill js-confirm-cancel">Confirm Cancellation</button>' +
          '<button type="button" class="action-pill-btn btn-secondary-pill js-abort-cancel">Keep Paused</button>' +
          '</div>' +
          '</div>';
      } else if (lowerStatus === 'cancelled') {
        html += '<p class="sub-resubscribe-note">' +
          'Ready to receive fresh roasts again? <a href="' + escapeHtml(resubscribeUrl) + '">Browse Subscription Plans &rarr;</a>' +
          '</p>';
      }

      card.innerHTML = html;
      targetSlot.appendChild(card);

      // Wire action listeners
      var triggerPauseBtn = card.querySelector('.js-trigger-pause');
      var pauseContainer = card.querySelector('.js-pause-container');
      var confirmPauseBtn = card.querySelector('.js-confirm-pause');
      var abortPauseBtn = card.querySelector('.js-abort-pause');
      var pauseReasonInput = card.querySelector('.js-pause-reason');

      var triggerCancelBtn = card.querySelector('.js-trigger-cancel');
      var cancelContainer = card.querySelector('.js-cancel-container');
      var confirmCancelBtn = card.querySelector('.js-confirm-cancel');
      var abortCancelBtn = card.querySelector('.js-abort-cancel');
      var cancelReasonInput = card.querySelector('.js-cancel-reason');

      var confirmResumeBtn = card.querySelector('.js-confirm-resume');
      var actionsActive = card.querySelector('.js-actions-active');
      var actionsPaused = card.querySelector('.js-actions-paused');

      if (triggerPauseBtn) {
        triggerPauseBtn.addEventListener('click', function () {
          if (actionsActive) actionsActive.style.display = 'none';
          if (cancelContainer) cancelContainer.style.display = 'none';
          pauseContainer.style.display = 'block';
          if (pauseReasonInput) pauseReasonInput.focus();
        });
      }

      if (abortPauseBtn) {
        abortPauseBtn.addEventListener('click', function () {
          pauseContainer.style.display = 'none';
          if (actionsActive) actionsActive.style.display = 'flex';
          if (pauseReasonInput) pauseReasonInput.value = '';
        });
      }

      if (confirmPauseBtn) {
        confirmPauseBtn.addEventListener('click', function () {
          var reason = pauseReasonInput ? pauseReasonInput.value.trim() : '';
          performStatusUpdate(sub, 'Paused', reason, confirmPauseBtn, targetSlot);
        });
      }

      if (confirmResumeBtn) {
        confirmResumeBtn.addEventListener('click', function () {
          performStatusUpdate(sub, 'Active', '', confirmResumeBtn, targetSlot);
        });
      }

      if (triggerCancelBtn) {
        triggerCancelBtn.addEventListener('click', function () {
          if (actionsActive) actionsActive.style.display = 'none';
          if (actionsPaused) actionsPaused.style.display = 'none';
          if (pauseContainer) pauseContainer.style.display = 'none';
          cancelContainer.style.display = 'block';
          if (cancelReasonInput) cancelReasonInput.focus();
        });
      }

      if (abortCancelBtn) {
        abortCancelBtn.addEventListener('click', function () {
          cancelContainer.style.display = 'none';
          if (actionsActive) actionsActive.style.display = 'flex';
          if (actionsPaused) actionsPaused.style.display = 'flex';
          if (cancelReasonInput) cancelReasonInput.value = '';
        });
      }

      if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function () {
          var reason = cancelReasonInput ? cancelReasonInput.value.trim() : '';
          performStatusUpdate(sub, 'Cancelled', reason, confirmCancelBtn, targetSlot);
        });
      }
    }

    function performStatusUpdate(sub, newStatus, reason, buttonEl, targetSlot) {
      var origText = buttonEl.textContent;
      buttonEl.textContent = 'Updating...';
      buttonEl.disabled = true;

      fetch(API_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'update_status',
          orderId: sub.orderId,
          token: sub.token,
          status: newStatus,
          statusDetails: reason
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) {
          alert(data.error);
          buttonEl.textContent = origText;
          buttonEl.disabled = false;
        } else {
          sub.status = newStatus;
          sub.statusDetails = reason;
          renderSubscriptionCard(sub, targetSlot);
        }
      })
      .catch(function (err) {
        console.error('manage-subscriptions: Error updating status:', err);
        alert("Technical glitch. Please reach out to orders@yellowwingroasters.com");
        buttonEl.textContent = origText;
        buttonEl.disabled = false;
      });
    }

    // Phase 1 Lookup Form Submission
    if (lookupForm) {
      lookupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = lookupEmail.value.trim();
        if (!email) return;

        lookupStatus.textContent = 'Sending secure link...';
        lookupStatus.className = 'order-status order-status-pending';
        lookupBtn.disabled = true;

        fetch(API_URL, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            action: 'request_link',
            email: email
          })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          lookupStatus.textContent = data.message || "If a subscription matches that email, we've emailed a secure link to manage it.";
          lookupStatus.className = 'order-status order-status-success';
          lookupBtn.disabled = false;
        })
        .catch(function (err) {
          console.error('manage-subscriptions: Error requesting magic link:', err);
          lookupStatus.textContent = "Technical glitch. Please reach out to orders@yellowwingroasters.com";
          lookupStatus.className = 'order-status order-status-error';
          lookupBtn.disabled = false;
        });
      });
    }

    function renderSubscriptionsList(subs) {
      subscriptionContent.innerHTML = '';
      if (!subs || subs.length === 0) {
        subscriptionContent.innerHTML = '<p class="order-status order-status-error manage-error-msg">No subscriptions found for this email.</p>';
        return;
      }

      var statusRank = { active: 0, paused: 1, cancelled: 2 };
      var sorted = subs.slice().sort(function (a, b) {
        var ra = statusRank[(a.status || '').toLowerCase()];
        var rb = statusRank[(b.status || '').toLowerCase()];
        return (ra !== undefined ? ra : 3) - (rb !== undefined ? rb : 3);
      });

      if (resultsIdDisplay) {
        resultsIdDisplay.textContent = sorted.length + (sorted.length === 1 ? ' subscription' : ' subscriptions');
      }

      sorted.forEach(function (sub) {
        var slot = document.createElement('div');
        slot.className = 'sub-card-slot';
        subscriptionContent.appendChild(slot);
        renderSubscriptionCard(sub, slot);
      });
    }

    // Phase 2 Direct URL Authenticated Load (?email=...&token=xyz)
    var urlParams = new URLSearchParams(window.location.search);
    var paramEmail = urlParams.get('email');
    var paramToken = urlParams.get('token');
    if (paramEmail && paramEmail.indexOf('%') !== -1) {
      try { paramEmail = decodeURIComponent(paramEmail); } catch (e) {}
    }

    if (paramEmail && paramToken) {
      lookupSection.style.display = 'none';
      resultsSection.style.display = 'block';
      if (resultsIdDisplay) resultsIdDisplay.textContent = paramEmail;

      subscriptionContent.innerHTML = '<p class="manage-loading-msg">Loading subscription details...</p>';
      fetch(API_URL + '?email=' + encodeURIComponent(paramEmail) + '&token=' + encodeURIComponent(paramToken))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error) {
            subscriptionContent.innerHTML = '<p class="order-status order-status-error manage-error-msg">' +
              escapeHtml(data.error) +
              '</p>';
          } else {
            renderSubscriptionsList(data.subscriptions || []);
          }
        })
        .catch(function (err) {
          console.error('manage-subscriptions: Error loading subscriptions:', err);
          subscriptionContent.innerHTML = '<p class="order-status order-status-error manage-error-msg">Technical glitch loading subscriptions. Please try again or contact orders@yellowwingroasters.com</p>';
        });
    }
  };
});
