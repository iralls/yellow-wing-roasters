---
layout: default
title: "Manage Subscription"
permalink: /subscriptions/manage/
---

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <img src="{{ '/images/cuckoo-transparent.png' | relative_url }}" alt="" class="roast-mv-bird roast-mv-bird--lg" aria-hidden="true" fetchpriority="high" decoding="async">
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Manage Subscription</h1>
  </div>

  <p class="roast-mv-tasting">Look up your active subscriptions, and temporarily pause, resume, or cancel your deliveries.</p>

  <div class="roast-mv-divider"></div>

  <!-- Phase 1: Lookup Form -->
  <div id="lookup-section" class="lookup-container lookup-container--narrow">
    <form id="lookup-form" class="order-form">
      <div class="order-field">
        <label for="lookup-email" class="roast-mv-meta-label">Email Address</label>
        <input id="lookup-email" type="email" required placeholder="Enter the email address you subscribed with..." autocomplete="email">
      </div>
      <div class="order-actions">
        <button type="submit" id="lookup-btn" class="order-submit">Look Up Subscription</button>
      </div>
      <p id="lookup-status" class="order-status" role="status" aria-live="polite"></p>
    </form>
  </div>

  <!-- Phase 2 & 3: Results & Status Management -->
  <div id="results-section" class="lookup-container lookup-container--results" style="display: none;">
    <div class="results-header">
      <h2 class="roasts-category">Your Subscriptions <span id="mock-indicator" class="mock-badge" style="display: none;">MOCK MODE</span></h2>
      <span id="results-email-display" class="results-email-display"></span>
    </div>
    
    <div id="subscriptions-list"></div>

    <div class="order-actions manage-sub-actions">
      <button id="back-search-btn" class="action-pill-btn btn-secondary-pill">Search Different Email</button>
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
