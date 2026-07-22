---
layout: default
title: "Manage Subscription"
permalink: /subscriptions/manage/
---

<style>
.lookup-container {
  max-width: 40rem;
  margin: 2rem auto;
  text-align: left;
}

.sub-card {
  background: #fcfbfa;
  border: 1px solid #e8e0d5;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sub-title {
  margin: 0;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.15rem;
  color: #2c1e14;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid;
  text-transform: uppercase;
}

.status-active {
  background-color: #eafaf1;
  color: #27ae60;
  border-color: #c2f0d5;
}

.status-paused {
  background-color: #fef9e7;
  color: #f39c12;
  border-color: #fdebd0;
}

.status-cancelled {
  background-color: #fdf2f2;
  color: #c0392b;
  border-color: #f8d7da;
}

.sub-details {
  margin: 0 0 1.25rem;
  color: #6e5e54;
  font-size: 0.95rem;
}

.sub-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-pill-btn {
  font-family: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.5rem 1.25rem;
  border-radius: 1.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-primary-pill {
  background-color: #e8e0d5;
  color: #2c1e14;
}

.btn-primary-pill:hover {
  background-color: #2c1e14;
  color: #e8e0d5;
}

.btn-danger-pill {
  background-color: #fdf2f2;
  color: #c0392b;
}

.btn-danger-pill:hover {
  background-color: #c0392b;
  color: #fff;
}

.btn-secondary-pill {
  background-color: #f7f5f2;
  color: #2c1e14;
  border-color: #d3c4b9;
}

.btn-secondary-pill:hover {
  background-color: #2c1e14;
  color: #fff;
  border-color: #2c1e14;
}

.cancel-reason-container {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e8e0d5;
}

.cancel-textarea {
  width: 100%;
  border: 1px solid #d3c4b9;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  box-sizing: border-box;
  resize: vertical;
}

.cancel-textarea:focus {
  outline: none;
  border-color: #8a7060;
}

.mock-badge {
  background-color: #e8e8e8;
  color: #555;
  border: 1px solid #ccc;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 0.5rem;
  vertical-align: middle;
}
</style>

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <img src="{{ '/images/cuckoo-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true" style="height: 14rem;">
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Manage Subscription</h1>
  </div>

  <p class="roast-mv-tasting">Look up your active subscriptions, and temporarily pause, resume, or cancel your deliveries.</p>

  <div class="roast-mv-divider"></div>

  <!-- Phase 1: Lookup Form -->
  <div id="lookup-section" class="lookup-container">
    <form id="lookup-form">
      <div class="order-field">
        <label for="lookup-email">Email Address</label>
        <input id="lookup-email" type="email" class="subscribe-select" style="width: 100%; font-family: inherit; padding: 0.6rem;" required placeholder="Enter the email address you subscribed with...">
      </div>
      <div class="order-actions" style="margin-top: 1.5rem;">
        <button type="submit" id="lookup-btn" class="order-submit">Look Up Subscription</button>
      </div>
      <p id="lookup-status" class="order-status" role="status" aria-live="polite" style="margin-top: 1.25rem; min-height: 1.5rem;"></p>
    </form>
  </div>

  <!-- Phase 2 & 3: Results & Status Management -->
  <div id="results-section" class="lookup-container" style="display: none;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <h2 class="roasts-category" style="margin: 0;">Your Subscriptions <span id="mock-indicator" class="mock-badge" style="display: none;">MOCK MODE</span></h2>
      <span id="results-email-display" style="font-weight: 700; color: #8a7060;"></span>
    </div>
    
    <div id="subscriptions-list"></div>

    <div class="order-actions" style="margin-top: 2rem; border-top: 1px solid #e8e0d5; padding-top: 1.5rem;">
      <button id="back-search-btn" class="action-pill-btn btn-secondary-pill">Search Different Email</button>
    </div>
  </div>

</div>
</div>

<script>
(function () {
  var API_URL = "{{ site.subscription_api_url }}";
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
    localStorage.setItem('ywr_mock_subscriptions', JSON.stringify(MOCK_DB));
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

  var currentSearchEmail = "";

  if (isMockMode) {
    mockIndicator.style.display = 'inline-block';
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
        // Add a default mock entry if the email is not in MOCK_DB, just to showcase UI
        if (subs.length === 0 && email.toLowerCase().indexOf('@') > 0 && email.toLowerCase() !== 'none@test.com') {
          subs = [{ roast: "Wingshot Collective", size: "12oz", frequency: "Monthly", status: "Active" }];
          MOCK_DB[email.toLowerCase()] = subs;
          saveMockDb();
        }
        renderSubscriptions(subs);
        showResults(email);
      }, 600);
    } else {
      // Live fetch
      var fetchUrl = API_URL + "?email=" + encodeURIComponent(email);
      fetch(fetchUrl)
        .then(function (response) {
          if (!response.ok) throw new Error('Network error');
          return response.json();
        })
        .then(function (data) {
          if (data.error) {
            showError(data.error);
          } else {
            renderSubscriptions(data.subscriptions || []);
            showResults(email);
          }
        })
        .catch(function (err) {
          showError("Could not connect to the lookup database. Please verify your internet connection or try again later.");
        });
    }
  });

  backSearchBtn.addEventListener('click', function () {
    resultsSection.style.display = 'none';
    lookupSection.style.display = 'block';
    lookupEmail.value = '';
    lookupEmail.focus();
  });

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
    resultsEmailDisplay.textContent = email;
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
        html += '<p style="margin: 0; font-size: 0.9rem; color: #8a7060; font-style: italic;">This subscription has been cancelled. If you\'d like to start receiving deliveries again, please <a href="{{ "/subscriptions/" | relative_url }}" style="font-weight: 700; text-decoration: underline;">resubscribe</a>.</p>';
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

      cancelTriggerBtn.addEventListener('click', function () {
        actionsDiv.style.display = 'none';
        cancelReasonContainer.style.display = 'block';
        cancelTextarea.focus();
      });

      abortCancelBtn.addEventListener('click', function () {
        cancelReasonContainer.style.display = 'none';
        actionsDiv.style.display = 'flex';
        cancelTextarea.value = '';
      });

      confirmCancelBtn.addEventListener('click', function () {
        var reason = cancelTextarea.value.trim();
        updateStatus(sub.roast, 'Cancelled', reason, confirmCancelBtn);
      });

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
          alert("Error: " + data.error);
          buttonEl.textContent = originalText;
          buttonEl.disabled = false;
        } else {
          // Re-fetch lookup data to update UI state
          fetch(API_URL + "?email=" + encodeURIComponent(currentSearchEmail))
            .then(function (res) { return res.json(); })
            .then(function (lookupData) {
              renderSubscriptions(lookupData.subscriptions || []);
            });
        }
      })
      .catch(function (err) {
        alert("Failed to update status. Please check your internet connection.");
        buttonEl.textContent = originalText;
        buttonEl.disabled = false;
      });
    }
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
})();
</script>
