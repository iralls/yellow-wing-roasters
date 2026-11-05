---
layout: default
title: "Manage Subscription"
permalink: /subscriptions/manage/
---

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-center roast-mv-bird-wrap">
    <img src="{{ '/images/cuckoo-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Subscription" class="roast-mv-bird roast-mv-bird--lg" aria-hidden="true" fetchpriority="high" decoding="async">
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Manage Subscription</h1>
  </div>

  <p class="roast-mv-tasting">Check your recurring delivery schedule, or temporarily pause, resume, or cancel your subscription.</p>

  <!-- Phase 1: Unauthenticated Lookup Form (Magic Link Request) -->
  <div id="sub-lookup-section" class="lookup-container lookup-container--narrow">
    <form id="sub-lookup-form" class="order-form">
      <div class="order-field">
        <label for="sub-lookup-email" class="roast-mv-meta-label">Email Address</label>
        <input id="sub-lookup-email" type="email" required placeholder="Enter the email address you subscribed with..." autocomplete="email">
      </div>
      <div class="order-field">
        <label for="sub-lookup-id" class="roast-mv-meta-label">Subscription / Order ID (Optional)</label>
        <input id="sub-lookup-id" type="text" placeholder="e.g. 1001" autocomplete="off">
      </div>
      <div class="order-actions">
        <button type="submit" id="sub-lookup-btn" class="order-submit">Email Me My Secure Link</button>
      </div>
      <p id="sub-lookup-status" class="order-status" role="status" aria-live="polite"></p>
    </form>
  </div>

  <!-- Phase 2: Authenticated Subscription Display & Actions -->
  <div id="sub-results-section" class="lookup-container lookup-container--results" style="display: none;">
    <div class="results-header">
      <h2 class="roasts-category">Subscription Details</h2>
      <span id="sub-results-id-display" class="results-email-display"></span>
    </div>
    
    <div id="subscription-content"></div>

    <div class="order-actions manage-sub-actions">
      <a href="{{ '/subscriptions/manage/' | relative_url }}" id="sub-back-search-btn" class="action-pill-btn btn-secondary-pill">Look Up Different Subscription</a>
    </div>
  </div>

</div>
</div>

<script src="{{ '/js/manage-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initManageSubscriptions({
    apiUrl: {{ site.subscription_api_url | jsonify }},
    resubscribeUrl: {{ '/subscriptions/' | relative_url | jsonify }}
  });
</script>
