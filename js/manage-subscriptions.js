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
    var lookupId = document.getElementById('sub-lookup-id');
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

    function renderSubscriptionCard(sub) {
      subscriptionContent.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'sub-card';

      var badgeClass = getStatusBadgeClass(sub.status);
      var lowerStatus = (sub.status || '').toLowerCase();

      var html = '<div class="sub-header">' +
        '<h3 class="sub-title">Subscription #' + escapeHtml(sub.orderId) + '</h3>' +
        '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
        '</div>';

      if (sub.timestamp) {
        html += '<div class="order-date" style="font-size: 0.85rem; color: #8a7060; margin-bottom: 1rem;">Started: ' + escapeHtml(sub.timestamp) + '</div>';
      }

      // Contextual status banners
      if (lowerStatus === 'paused') {
        html += '<div style="background-color: #fef9e7; border-left: 4px solid #f39c12; border-radius: 4px; padding: 12px 14px; margin-bottom: 1.25rem; font-size: 0.9rem; line-height: 1.5; color: #7d5a00;">' +
          '<strong>Deliveries Temporarily Paused:</strong> Your recurring orders are currently on hold.' +
          (sub.statusDetails ? ' <br><span style="font-style: italic;">Reason: ' + escapeHtml(sub.statusDetails) + '</span>' : '') +
          '</div>';
      } else if (lowerStatus === 'cancelled') {
        html += '<div style="background-color: #fdf2f2; border-left: 4px solid #c0392b; border-radius: 4px; padding: 12px 14px; margin-bottom: 1.25rem; font-size: 0.9rem; line-height: 1.5; color: #78281f;">' +
          '<strong>Subscription Cancelled:</strong> This subscription is no longer active.' +
          (sub.statusDetails ? ' <br><span style="font-style: italic;">Reason: ' + escapeHtml(sub.statusDetails) + '</span>' : '') +
          '</div>';
      } else {
        html += '<div style="background-color: #f4fbf7; border-left: 4px solid #1e824c; border-radius: 4px; padding: 12px 14px; margin-bottom: 1.25rem; font-size: 0.9rem; line-height: 1.5; color: #1e824c;">' +
          '<strong>Subscription Active:</strong> Your coffee is scheduled for fulfillment according to our regular roast cycles.' +
          '</div>';
      }

      // Delivery Method
      html += '<div style="font-size: 0.88rem; color: #554338; margin-bottom: 1.25rem;">' +
        '<strong>Delivery Method:</strong> ' + escapeHtml(sub.deliveryMethod);
      if (sub.deliveryMethod === 'Hand delivery' && sub.address) {
        html += ' &bull; ' + escapeHtml(sub.address) + ', ' + escapeHtml(sub.city) + ' ' + escapeHtml(sub.state) + ' ' + escapeHtml(sub.zip);
      }
      html += '</div>';

      // Linen Detail Table
      html += '<div style="background-color: #f5efe6; border-radius: 8px; padding: 16px 18px; margin-bottom: 1.5rem;">' +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align: left;">' +
        '<tr>' +
        '<td style="padding: 4px 8px; font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7060; width: 32%;">Roast</td>' +
        '<td style="padding: 4px 8px; font-family: Montserrat, sans-serif; font-size: 0.95rem; font-weight: 600; color: #2c1e14;">' + escapeHtml(sub.roast) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="padding: 4px 8px; font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7060;">Bag Size</td>' +
        '<td style="padding: 4px 8px; font-family: Georgia, serif; font-size: 0.95rem; color: #2c1e14;">' + escapeHtml(sub.size) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="padding: 4px 8px; font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7060;">Frequency</td>' +
        '<td style="padding: 4px 8px; font-family: Georgia, serif; font-size: 0.95rem; color: #2c1e14;">' + escapeHtml(sub.frequency) + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>';

      // Customer Actions
      if (lowerStatus === 'active') {
        html += '<div class="sub-actions" id="sub-actions-active">' +
          '<button type="button" id="trigger-pause-btn" class="action-pill-btn btn-secondary-pill">Pause Deliveries</button>' +
          '<button type="button" id="trigger-cancel-btn" class="action-pill-btn btn-danger-pill">Cancel Subscription</button>' +
          '</div>';

        // Hidden Pause Prompt
        html += '<div id="pause-container" class="cancel-reason-container" style="display: none;">' +
          '<label for="pause-reason-input" style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; color: #2c1e14;">Optional note for pausing:</label>' +
          '<textarea id="pause-reason-input" class="cancel-textarea" rows="2" placeholder="e.g. Taking a vacation, resuming next month..."></textarea>' +
          '<div style="display: flex; gap: 0.5rem;">' +
          '<button type="button" id="confirm-pause-btn" class="action-pill-btn btn-primary-pill">Confirm Pause</button>' +
          '<button type="button" id="abort-pause-btn" class="action-pill-btn btn-secondary-pill">Keep Active</button>' +
          '</div>' +
          '</div>';

        // Hidden Cancel Prompt
        html += '<div id="cancel-container" class="cancel-reason-container" style="display: none;">' +
          '<label for="cancel-reason-input" style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; color: #2c1e14;">Reason for cancelling (optional):</label>' +
          '<textarea id="cancel-reason-input" class="cancel-textarea" rows="2" placeholder="Tell us if there\'s anything we can do better..."></textarea>' +
          '<div style="display: flex; gap: 0.5rem;">' +
          '<button type="button" id="confirm-cancel-btn" class="action-pill-btn btn-danger-pill">Confirm Cancellation</button>' +
          '<button type="button" id="abort-cancel-btn" class="action-pill-btn btn-secondary-pill">Keep Subscription</button>' +
          '</div>' +
          '</div>';
      } else if (lowerStatus === 'paused') {
        html += '<div class="sub-actions" id="sub-actions-paused">' +
          '<button type="button" id="confirm-resume-btn" class="action-pill-btn btn-primary-pill">Resume Deliveries</button>' +
          '<button type="button" id="trigger-cancel-btn" class="action-pill-btn btn-danger-pill">Cancel Subscription</button>' +
          '</div>';

        // Hidden Cancel Prompt
        html += '<div id="cancel-container" class="cancel-reason-container" style="display: none;">' +
          '<label for="cancel-reason-input" style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; color: #2c1e14;">Reason for cancelling (optional):</label>' +
          '<textarea id="cancel-reason-input" class="cancel-textarea" rows="2" placeholder="Tell us if there\'s anything we can do better..."></textarea>' +
          '<div style="display: flex; gap: 0.5rem;">' +
          '<button type="button" id="confirm-cancel-btn" class="action-pill-btn btn-danger-pill">Confirm Cancellation</button>' +
          '<button type="button" id="abort-cancel-btn" class="action-pill-btn btn-secondary-pill">Keep Paused</button>' +
          '</div>' +
          '</div>';
      } else if (lowerStatus === 'cancelled') {
        html += '<p style="margin: 1.5rem 0 0; font-size: 0.92rem; color: #8a7060; font-style: italic; text-align: center;">' +
          'Ready to receive fresh roasts again? <a href="' + escapeHtml(resubscribeUrl) + '" style="font-weight: 700; text-decoration: underline; color: #2c1e14;">Browse Subscription Plans &rarr;</a>' +
          '</p>';
      }

      card.innerHTML = html;
      subscriptionContent.appendChild(card);

      // Wire action listeners
      var triggerPauseBtn = card.querySelector('#trigger-pause-btn');
      var pauseContainer = card.querySelector('#pause-container');
      var confirmPauseBtn = card.querySelector('#confirm-pause-btn');
      var abortPauseBtn = card.querySelector('#abort-pause-btn');
      var pauseReasonInput = card.querySelector('#pause-reason-input');

      var triggerCancelBtn = card.querySelector('#trigger-cancel-btn');
      var cancelContainer = card.querySelector('#cancel-container');
      var confirmCancelBtn = card.querySelector('#confirm-cancel-btn');
      var abortCancelBtn = card.querySelector('#abort-cancel-btn');
      var cancelReasonInput = card.querySelector('#cancel-reason-input');

      var confirmResumeBtn = card.querySelector('#confirm-resume-btn');
      var actionsActive = card.querySelector('#sub-actions-active');
      var actionsPaused = card.querySelector('#sub-actions-paused');

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
          performStatusUpdate(sub, 'Paused', reason, confirmPauseBtn);
        });
      }

      if (confirmResumeBtn) {
        confirmResumeBtn.addEventListener('click', function () {
          performStatusUpdate(sub, 'Active', '', confirmResumeBtn);
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
          performStatusUpdate(sub, 'Cancelled', reason, confirmCancelBtn);
        });
      }
    }

    function performStatusUpdate(sub, newStatus, reason, buttonEl) {
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
          renderSubscriptionCard(sub);
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
        var orderId = lookupId ? lookupId.value.trim() : '';
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
            email: email,
            orderId: orderId
          })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          lookupStatus.textContent = data.message || "If a subscription matches that information, we've emailed a secure link to manage it.";
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

    // Phase 2 Direct URL Authenticated Load (?orderId=1001&token=xyz)
    var urlParams = new URLSearchParams(window.location.search);
    var paramOrderId = urlParams.get('orderId');
    var paramToken = urlParams.get('token');

    if (paramOrderId && paramToken) {
      lookupSection.style.display = 'none';
      resultsSection.style.display = 'block';
      if (resultsIdDisplay) resultsIdDisplay.textContent = '#' + paramOrderId;

      subscriptionContent.innerHTML = '<p style="text-align: center; color: #8a7060; font-style: italic; margin: 2rem 0;">Loading subscription details...</p>';
      fetch(API_URL + '?orderId=' + encodeURIComponent(paramOrderId) + '&token=' + encodeURIComponent(paramToken))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.error || !data.subscription) {
            subscriptionContent.innerHTML = '<p class="order-status order-status-error" style="text-align: center; margin: 2rem 0;">' +
              (data.error || 'Subscription not found or link has expired.') +
              '</p>';
          } else {
            renderSubscriptionCard(data.subscription);
          }
        })
        .catch(function (err) {
          console.error('manage-subscriptions: Error loading subscription:', err);
          subscriptionContent.innerHTML = '<p class="order-status order-status-error" style="text-align: center; margin: 2rem 0;">Technical glitch loading subscription. Please try again or contact orders@yellowwingroasters.com</p>';
        });
    }
  };
});
