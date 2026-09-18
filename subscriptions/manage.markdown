---
layout: default
title: "Manage Subscription"
permalink: /subscriptions/manage/
---

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
    <form id="lookup-form" class="order-form" style="margin: 0;">
      <div class="order-field">
        <label for="lookup-email">Email Address</label>
        <input id="lookup-email" type="email" required placeholder="Enter the email address you subscribed with..." autocomplete="email">
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

<script src="{{ '/js/manage-subscriptions.js' | relative_url }}"></script>
<script>
  if (window.initManageSubscriptions) {
    window.initManageSubscriptions({
      apiUrl: {{ site.subscription_api_url | jsonify }},
      resubscribeUrl: {{ '/subscriptions/' | relative_url | jsonify }}
    });
  }
</script>
