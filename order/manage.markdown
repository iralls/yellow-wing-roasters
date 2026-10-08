---
layout: default
title: "Manage Order"
permalink: /order/manage/
---

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <img src="{{ '/images/delivery-box-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Delivery Box" class="roast-mv-bird roast-mv-bird--lg" fetchpriority="high" decoding="async">
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Manage Order</h1>
  </div>

  <p class="roast-mv-tasting">Look up your order, check roasting and delivery progress, or cancel your order.</p>

  <div class="roast-mv-divider"></div>

  <!-- Phase 1: Unauthenticated Lookup Form (Magic Link Request) -->
  <div id="order-mock-preview-banner" class="order-preview-helper" style="display: none;">
    <span><strong>Mock Mode Active:</strong> Previewing order lifecycle stages?</span>
    <a href="{{ '/order/preview/' | relative_url }}" class="order-preview-link-btn">Open Status Previewer &rarr;</a>
  </div>

  <div id="order-lookup-section" class="lookup-container lookup-container--narrow">
    <form id="order-lookup-form" class="order-form">
      <div class="order-field">
        <label for="order-lookup-email" class="roast-mv-meta-label">Email Address</label>
        <input id="order-lookup-email" type="email" required placeholder="Enter the email address used for your order..." autocomplete="email">
      </div>
      <div class="order-field">
        <label for="order-lookup-id" class="roast-mv-meta-label">Order ID</label>
        <input id="order-lookup-id" type="text" required placeholder="e.g. 1001" autocomplete="off">
      </div>
      <div class="order-actions">
        <button type="submit" id="order-lookup-btn" class="order-submit">Email Me My Secure Link</button>
      </div>
      <p id="order-lookup-status" class="order-status" role="status" aria-live="polite"></p>
    </form>
  </div>

  <!-- Phase 2: Authenticated Order Display & Actions -->
  <div id="order-results-section" class="lookup-container lookup-container--results" style="display: none;">
    <div class="results-header">
      <h2 class="roasts-category">Order Details <span id="order-mock-indicator" class="mock-badge" style="display: none;">MOCK MODE</span></h2>
      <span id="order-results-id-display" class="results-email-display"></span>
    </div>
    
    <div id="order-content"></div>

    <div class="order-actions manage-sub-actions">
      <a href="{{ '/order/manage/' | relative_url }}" id="order-back-search-btn" class="action-pill-btn btn-secondary-pill">Look Up Different Order</a>
    </div>
  </div>

</div>
</div>

<script src="{{ '/js/cart-data.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ '/js/manage-orders.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initManageOrders({
    apiUrl: {{ site.order_api_url | jsonify }},
    catalogUrl: {{ '/roasts/' | relative_url | jsonify }},
    roastsData: window.YWR_ROASTS_DATA,
    bagSizes: window.YWR_BAG_SIZES,
    defaultGrind: window.YWR_DEFAULT_GRIND
  });
</script>
