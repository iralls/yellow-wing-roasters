---
layout: default
title: "Roaster Order Manager"
permalink: /order/admin/
sitemap: false
---

<script>
  (function () {
    try {
      if (sessionStorage.getItem('ywr_admin_passcode')) {
        document.documentElement.classList.add('ywr-admin-authenticated');
      }
    } catch (e) {}
  })();
</script>
<style>
  .ywr-admin-authenticated #order-admin-gate-section { display: none !important; }
  .ywr-admin-authenticated #order-admin-dashboard-section { display: block !important; }
</style>

<div class="roast-minimal-vertical">
<div class="order-admin-container">

  <div class="order-admin-header-compact">
    <img src="{{ '/images/delivery-box-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Delivery Box" class="order-admin-bird-icon" fetchpriority="high" decoding="async">
    <h1 class="order-admin-page-title">Roaster Order Manager</h1>
    <p class="order-admin-page-desc">Private management console to view, track, and update all customer coffee orders.</p>
  </div>

  <!-- Passcode Gate View -->
  <div id="order-admin-gate-section" class="order-admin-gate">
    <div class="order-admin-gate-icon">
      <span class="status-badge status-received">Passcode Required</span>
    </div>
    <h2 class="order-admin-gate-title">Owner Authentication</h2>
    <p class="order-admin-gate-desc">Enter your roaster management passcode to access the live order queue and fulfillment controls.</p>
    
    <form id="order-admin-gate-form" class="order-admin-gate-form">
      <div>
        <input type="password" id="order-admin-passcode-input" class="order-admin-input" placeholder="Enter owner passcode..." required autocomplete="current-password" autofocus>
      </div>
      <button type="submit" id="order-admin-gate-btn" class="order-admin-save-btn">Unlock Dashboard</button>
      <div id="order-admin-gate-error" class="order-admin-gate-error" style="display: none;"></div>
    </form>
  </div>

  <!-- Authenticated Order Dashboard View -->
  <div id="order-admin-dashboard-section" style="display: none;">
    <!-- Top Bar Controls -->
    <div class="order-admin-topbar">
      <div class="order-admin-header-row">
        <div id="order-admin-stats" class="order-admin-stats"></div>
        <div class="order-admin-actions">
          <button type="button" id="order-admin-refresh-btn" class="order-admin-btn-sm" title="Refresh order queue">Refresh</button>
          <button type="button" id="order-admin-logout-btn" class="order-admin-btn-sm order-admin-btn-sm--logout" title="Log out of order manager">Log Out</button>
        </div>
      </div>
      
      <div class="order-admin-controls-row">
        <div id="order-admin-filters" class="order-admin-filters">
          <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
          <button type="button" class="order-admin-filter-pill" data-filter="received">Received</button>
          <button type="button" class="order-admin-filter-pill" data-filter="delayed">Delayed</button>
          <button type="button" class="order-admin-filter-pill" data-filter="roasted">Roasted</button>
          <button type="button" class="order-admin-filter-pill" data-filter="ready_for_pickup">Ready for Pickup</button>
          <button type="button" class="order-admin-filter-pill" data-filter="ready_to_deliver">Ready to Deliver</button>
          <button type="button" class="order-admin-filter-pill" data-filter="delivered">Delivered</button>
          <button type="button" class="order-admin-filter-pill" data-filter="cancelled">Cancelled</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="order-admin-search-input" class="order-admin-search-input" placeholder="Search orders (ID, name, email, coffee)..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Master-Detail Workspace -->
    <div class="order-admin-workspace">
      <!-- Left Column: Order Queue -->
      <div id="order-admin-queue" class="order-admin-queue"></div>

      <!-- Right Column: Detail Inspector -->
      <div id="order-admin-inspector" class="order-admin-inspector">
        <div class="order-admin-inspector-empty">Select an order from the queue to view details and update fulfillment status.</div>
      </div>
    </div>
  </div>

</div>
</div>

<script src="{{ '/js/admin-orders.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminOrders({
    apiUrl: {{ site.order_api_url | jsonify }},
    manageBaseUrl: {{ '/order/manage/' | relative_url | jsonify }}
  });
</script>
