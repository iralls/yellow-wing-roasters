/**
 * Yellow Wing Roasters - Subscription Management
 * Handles lookup, status display, pause, resume, and cancellation.
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
    options = options || {};
    var API_URL = options.apiUrl || '';
    var resubscribeUrl = options.resubscribeUrl || '/subscriptions/';
    var isMockMode = false;

    // Detect if the API URL is still a placeholder or empty
    if (!API_URL || API_URL.indexOf("YOUR_DEPLOYMENT_ID_HERE") >= 0 || API_URL.trim() === "") {
      isMockMode = true;
    }

    // Local storage cache for mock data to allow local interactivity
    var MOCK_DB = JSON.parse(localStorage.getItem('ywr_mock_subscriptions')) || {
      "test@test.com": [
        { roast: "Wingshot Collective", size: "12oz", frequency: "Monthly", status: "Active" },
        { roast: "Fledglings", size: "2lb", frequency: "Every 2 weeks", status: "Paused" }
      ],
      "jane@test.com": [
        { roast: "The Migrator", size: "12oz", frequency: "Monthly", status: "Cancelled" }
      ],
      "friend@example.com": [
        { roast: "Murmurations", size: "5lb", frequency: "Monthly", status: "Active" }
      ]
    };

    function saveMockDb() {
      try {
        localStorage.setItem('ywr_mock_subscriptions', JSON.stringify(MOCK_DB));
      } catch (e) {}
    }

    var lookupForm = document.getElementById('lookup-form');
    var lookupEmail = document.getElementById('lookup-email');
    var lookupBtn = document.getElementById('lookup-btn');
    var lookupStatus = document.getElementById('lookup-status');

    var lookupSection = document.getElementById('lookup-section');
    var resultsSection = document.getElementById('results-section');
    var resultsEmailDisplay = document.getElementById('results-email-display');
    var subscriptionsList = document.getElementById('subscriptions-list');
    var mockIndicator = document.getElementById('mock-indicator');
    var backSearchBtn = document.getElementById('back-search-btn');

    if (!lookupForm || !lookupEmail || !lookupBtn || !lookupSection || !resultsSection) return;

    var currentSearchEmail = "";

    if (isMockMode && mockIndicator) {
      mockIndicator.style.display = 'inline-block';
    }

    function escapeHtml(str) {
      if (!str) return '';
      return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function showError(msg) {
      lookupStatus.textContent = msg;
      lookupStatus.className = 'order-status order-status-error';
      lookupBtn.disabled = false;
    }

    function showResults(email) {
      lookupStatus.textContent = '';
      lookupStatus.className = 'order-status';
      lookupBtn.disabled = false;
      lookupSection.style.display = 'none';
      resultsSection.style.display = 'block';
      if (resultsEmailDisplay) resultsEmailDisplay.textContent = email;
    }

    function renderSubscriptions(subs) {
      subscriptionsList.innerHTML = '';
      if (subs.length === 0) {
        subscriptionsList.innerHTML = '<p style="color: #6e5e54; font-style: italic; text-align: center; margin: 2rem 0;">No subscriptions found associated with this email address.</p>';
        return;
      }

      subs.forEach(function (sub) {
        var card = document.createElement('div');
        card.className = 'sub-card';

        var badgeClass = 'status-active';
        if (sub.status.toLowerCase() === 'paused') {
          badgeClass = 'status-paused';
        } else if (sub.status.toLowerCase() === 'cancelled') {
          badgeClass = 'status-cancelled';
        }

        var html = '<div class="sub-header">' +
          '<h3 class="sub-title">' + escapeHtml(sub.roast) + '</h3>' +
          '<span class="status-badge ' + badgeClass + '">' + escapeHtml(sub.status) + '</span>' +
          '</div>' +
          '<p class="sub-details">Size: <strong>' + escapeHtml(sub.size) + '</strong> &bull; Frequency: <strong>' + escapeHtml(sub.frequency) + '</strong></p>';

        if (sub.status.toLowerCase() === 'cancelled') {
          html += '<p style="margin: 0; font-size: 0.9rem; color: #8a7060; font-style: italic;">This subscription has been cancelled. If you\'d like to start receiving deliveries again, please <a href="' + escapeHtml(resubscribeUrl) + '" style="font-weight: 700; text-decoration: underline;">resubscribe</a>.</p>';
          card.innerHTML = html;
          subscriptionsList.appendChild(card);
          return;
        }

        // Add actions container
        html += '<div class="sub-actions">';
        if (sub.status.toLowerCase() === 'active') {
          html += '<button class="action-pill-btn btn-primary-pill pause-btn">Pause</button>';
        } else if (sub.status.toLowerCase() === 'paused') {
          html += '<button class="action-pill-btn btn-primary-pill resume-btn">Resume</button>';
        }
        html += '<button class="action-pill-btn btn-danger-pill cancel-trigger-btn">Cancel</button>';
        html += '</div>';

        // Cancellation details hidden container
        html += '<div class="cancel-reason-container" style="display: none;">' +
          '<label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; color: #2c1e14;">Reason for cancelling (optional)</label>' +
          '<textarea class="cancel-textarea" rows="2" placeholder="Tell us if there\'s anything we can do better..."></textarea>' +
          '<div style="display: flex; gap: 0.5rem;">' +
          '<button class="action-pill-btn btn-danger-pill confirm-cancel-btn">Confirm</button>' +
          '<button class="action-pill-btn btn-secondary-pill abort-cancel-btn">Keep</button>' +
          '</div>' +
          '</div>';

        card.innerHTML = html;

        // Event listener wiring
        var pauseBtn = card.querySelector('.pause-btn');
        var resumeBtn = card.querySelector('.resume-btn');
        var cancelTriggerBtn = card.querySelector('.cancel-trigger-btn');
        var cancelReasonContainer = card.querySelector('.cancel-reason-container');
        var abortCancelBtn = card.querySelector('.abort-cancel-btn');
        var confirmCancelBtn = card.querySelector('.confirm-cancel-btn');
        var cancelTextarea = card.querySelector('.cancel-textarea');
        var actionsDiv = card.querySelector('.sub-actions');

        if (pauseBtn) {
          pauseBtn.addEventListener('click', function () {
            updateStatus(sub.roast, 'Paused', '', pauseBtn);
          });
        }

        if (resumeBtn) {
          resumeBtn.addEventListener('click', function () {
            updateStatus(sub.roast, 'Active', '', resumeBtn);
          });
        }

        if (cancelTriggerBtn) {
          cancelTriggerBtn.addEventListener('click', function () {
            actionsDiv.style.display = 'none';
            cancelReasonContainer.style.display = 'block';
            cancelTextarea.focus();
          });
        }

        if (abortCancelBtn) {
          abortCancelBtn.addEventListener('click', function () {
            cancelReasonContainer.style.display = 'none';
            actionsDiv.style.display = 'flex';
            cancelTextarea.value = '';
          });
        }

        if (confirmCancelBtn) {
          confirmCancelBtn.addEventListener('click', function () {
            var reason = cancelTextarea.value.trim();
            updateStatus(sub.roast, 'Cancelled', reason, confirmCancelBtn);
          });
        }

        subscriptionsList.appendChild(card);
      });
    }

    function updateStatus(roast, newStatus, reason, buttonEl) {
      var originalText = buttonEl.textContent;
      buttonEl.textContent = 'Updating...';
      buttonEl.disabled = true;

      if (isMockMode) {
        setTimeout(function () {
          var userSubs = MOCK_DB[currentSearchEmail.toLowerCase()] || [];
          for (var i = 0; i < userSubs.length; i++) {
            if (userSubs[i].roast.toLowerCase() === roast.toLowerCase()) {
              userSubs[i].status = newStatus;
              break;
            }
          }
          MOCK_DB[currentSearchEmail.toLowerCase()] = userSubs;
          saveMockDb();
          renderSubscriptions(userSubs);
        }, 800);
      } else {
        // Live POST request
        fetch(API_URL, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            email: currentSearchEmail,
            roast: roast,
            status: newStatus,
            statusDetails: reason
          })
        })
        .then(function (response) {
          if (!response.ok) throw new Error('Update failed');
          return response.json();
        })
        .then(function (data) {
          if (data.error) {
            alert("Technical glitch. Please reach out to chirp@yellowwingroasters.com");
            buttonEl.textContent = originalText;
            buttonEl.disabled = false;
          } else {
            fetch(API_URL + "?email=" + encodeURIComponent(currentSearchEmail))
              .then(function (res) { return res.json(); })
              .then(function (lookupData) {
                renderSubscriptions(lookupData.subscriptions || []);
              });
          }
        })
        .catch(function (err) {
          alert("Technical glitch. Please reach out to chirp@yellowwingroasters.com");
          buttonEl.textContent = originalText;
          buttonEl.disabled = false;
        });
      }
    }

    lookupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = lookupEmail.value.trim();
      if (!email) return;

      currentSearchEmail = email;
      lookupStatus.textContent = 'Searching...';
      lookupStatus.className = 'order-status order-status-pending';
      lookupBtn.disabled = true;

      if (isMockMode) {
        setTimeout(function () {
          var subs = MOCK_DB[email.toLowerCase()] || [];
          if (subs.length === 0 && email.toLowerCase().indexOf('@') > 0 && email.toLowerCase() !== 'none@test.com') {
            subs = [{ roast: "Wingshot Collective", size: "12oz", frequency: "Monthly", status: "Active" }];
            MOCK_DB[email.toLowerCase()] = subs;
            saveMockDb();
          }
          renderSubscriptions(subs);
          showResults(email);
        }, 600);
      } else {
        var fetchUrl = API_URL + "?email=" + encodeURIComponent(email);
        fetch(fetchUrl)
          .then(function (response) {
            if (!response.ok) throw new Error('Network error');
            return response.json();
          })
          .then(function (data) {
            if (data.error) {
              showError("Technical glitch. Please reach out to chirp@yellowwingroasters.com");
            } else {
              renderSubscriptions(data.subscriptions || []);
              showResults(email);
            }
          })
          .catch(function (err) {
            showError("Technical glitch. Please reach out to chirp@yellowwingroasters.com");
          });
      }
    });

    if (backSearchBtn) {
      backSearchBtn.addEventListener('click', function () {
        resultsSection.style.display = 'none';
        lookupSection.style.display = 'block';
        lookupEmail.value = '';
        lookupEmail.focus();
      });
    }
  };
});
