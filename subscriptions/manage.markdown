---
layout: menu-item
title: Manage Subscription
subtitle: Member Portal
category: subscription
no_order: true
mascot_file: cuckoo-transparent.png
mascot_alt: "Subscription Portal Cuckoo"
permalink: /subscriptions/manage/
custom_css: manage.css
intro: "Check your recurring delivery schedule, or pause, resume, or cancel your active coffee subscription anytime using your secure magic link."
---

<!-- Phase 1: Unauthenticated Lookup Form (Magic Link Request) -->
<div id="sub-lookup-section">
  <form id="sub-lookup-form" class="hst-form hst-form--flush">
    <div>
      <label for="sub-lookup-email" class="hst-label">Email Address</label>
      <input id="sub-lookup-email" type="email" class="hst-input" required placeholder="Enter the email address you subscribed with..." autocomplete="email">
    </div>
    <button type="submit" id="sub-lookup-btn" class="hst-btn">Email Me My Secure Link</button>
    <p id="sub-lookup-status" role="status" aria-live="polite" class="manage-lookup-status"></p>
  </form>
</div>

<!-- Phase 2: Authenticated Subscription Display & Actions -->
<div id="sub-results-section" class="manage-results-section">
  <div class="manage-results-header">
    <h2 class="manage-results-title">Your Subscriptions</h2>
    <span id="sub-results-id-display" class="manage-results-id"></span>
  </div>
  
  <div id="subscription-content"></div>

  <div class="manage-results-footer">
    <a href="{{ '/subscriptions/manage/' | relative_url }}" id="sub-back-search-btn" class="action-pill-btn btn-secondary-pill">Look Up Different Email</a>
  </div>
</div>

<div class="hst-drawers hst-drawers--spacious">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Self-Service Flexibility</button>
    <div class="hst-drawer-body">
      <strong>Pause Deliveries:</strong> Heading out of town or have plenty of beans? Pause recurring dispatches with an optional note and keep your plan intact.<br>
      <strong>Instant Resumption:</strong> Ready for fresh roasts again? Reactivate with a single click anytime.<br>
      <strong>Cancel Anytime:</strong> Cancel your subscription immediately without penalties, fees, or phone calls.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Magic Links &amp; Privacy</button>
    <div class="hst-drawer-body">
      We utilize passwordless magic links delivered directly to your subscriber email address to access your subscription and update your delivery schedule.
    </div>
  </div>
</div>

<script src="{{ '/js/manage-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    initManageSubscriptions({
      apiUrl: {{ site.subscription_api_url | jsonify }},
      resubscribeUrl: {{ '/subscriptions/' | relative_url | jsonify }}
    });
  });
</script>
