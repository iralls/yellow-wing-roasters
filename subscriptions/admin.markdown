---
layout: default
title: "Roaster Subscription Manager"
permalink: /subscriptions/admin/
sitemap: false
---

<script>
  (function () {
    try {
      if (localStorage.getItem('ywr_admin_passcode')) {
        document.documentElement.classList.add('ywr-admin-authenticated');
      }
    } catch (e) {}
  })();
</script>
<style>
  .ywr-admin-authenticated #sub-admin-gate-section { display: none !important; }
  .ywr-admin-authenticated #sub-admin-dashboard-section { display: block !important; }
</style>

<div class="roast-minimal-vertical">
<div class="order-admin-container">

  <div class="order-admin-header-compact roast-admin-header-compact">
    <h1 class="order-admin-page-title">Roaster Subscription Manager</h1>
  </div>

  <!-- Passcode Gate View -->
  <div id="sub-admin-gate-section" class="order-admin-gate">
    <div class="order-admin-gate-icon">
      <span class="status-badge status-received">Passcode Required</span>
    </div>
    <h2 class="order-admin-gate-title">Owner Authentication</h2>
    <p class="order-admin-gate-desc">Enter your roaster management passcode to access the recurring subscriptions queue and controls.</p>
    
    <form id="sub-admin-gate-form" class="order-admin-gate-form">
      <div>
        <input type="password" id="sub-admin-passcode-input" class="order-admin-input" placeholder="Enter owner passcode..." required autocomplete="current-password" autofocus>
      </div>
      <button type="submit" id="sub-admin-gate-btn" class="order-admin-save-btn">Unlock Dashboard</button>
      <div id="sub-admin-gate-error" class="order-admin-gate-error" style="display: none;"></div>
    </form>
  </div>

  <!-- Authenticated Subscription Dashboard View -->
  <div id="sub-admin-dashboard-section" style="display: none;">
    <!-- Top Bar Controls -->
    <div class="order-admin-topbar">
      <div class="order-admin-header-row">
        <div id="sub-admin-stats" class="order-admin-stats"></div>
        <div class="order-admin-actions">
          <a href="{{ '/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Admin Portal</a>
          <a href="{{ '/order/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Orders</a>
          <a href="{{ '/roasts/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Roast Log</a>
          <button type="button" id="sub-admin-refresh-btn" class="order-admin-btn-sm" title="Refresh subscription queue">Refresh</button>
          <button type="button" id="sub-admin-logout-btn" class="order-admin-btn-sm order-admin-btn-sm--logout" title="Log out of subscription manager">Log Out</button>
        </div>
      </div>
      
      <div class="order-admin-controls-row">
        <div id="sub-admin-tabs" class="roast-admin-tabs" role="tablist">
          <button type="button" class="roast-admin-tab-btn roast-admin-tab-btn--active" data-tab="queue" role="tab" aria-selected="true">Subscription Queue</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="totals" role="tab" aria-selected="false">Totals &amp; Rollups</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="sub-admin-search-input" class="order-admin-search-input" placeholder="Search subscriptions (ID, name, email, roast)..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Tab 1: Subscription Queue -->
    <div id="sub-admin-panel-queue" class="roast-admin-panel roast-admin-panel--active">
      <div class="order-admin-controls-row" style="margin-bottom: 0.75rem;">
        <div id="sub-admin-filters" class="order-admin-filters">
          <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
          <button type="button" class="order-admin-filter-pill" data-filter="active">Active</button>
          <button type="button" class="order-admin-filter-pill" data-filter="paused">Paused</button>
          <button type="button" class="order-admin-filter-pill" data-filter="cancelled">Cancelled</button>
        </div>
      </div>

      <!-- Master-Detail Workspace -->
      <div class="order-admin-workspace">
        <!-- Left Column: Subscription Queue -->
        <div id="sub-admin-queue" class="order-admin-queue"></div>

        <!-- Right Column: Detail Inspector -->
        <div id="sub-admin-inspector" class="order-admin-inspector">
          <div class="order-admin-inspector-empty">Select a subscription from the queue to view details and update status.</div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Totals & Recurring Rollups -->
    <div id="sub-admin-panel-totals" class="roast-admin-panel">
      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Recurring Totals &amp; Rollups</h3>
        <div class="roast-admin-totals-bar">
          <div class="roast-admin-field" style="flex: 1 1 100%; margin-bottom: 0.5rem;">
            <label style="display: block; margin-bottom: 0.35rem; font-size: 0.8rem; font-weight: 600; color: #6e5e54;">Group By:</label>
            <div id="sub-totals-group-pills" class="order-admin-filters">
              <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-group="roast">Roast</button>
              <button type="button" class="order-admin-filter-pill" data-group="size">Bag Size</button>
              <button type="button" class="order-admin-filter-pill" data-group="frequency">Frequency</button>
              <button type="button" class="order-admin-filter-pill" data-group="deliveryMethod">Delivery Method</button>
              <button type="button" class="order-admin-filter-pill" data-group="status">Status</button>
              <button type="button" class="order-admin-filter-pill" data-group="city">City</button>
            </div>
          </div>
          <div class="roast-admin-field" style="min-width: 10rem;">
            <label for="sub-totals-filter-roast">Filter Roast</label>
            <select id="sub-totals-filter-roast" class="roast-admin-select">
              <option value="all">All Roasts</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="sub-totals-filter-size">Filter Size</label>
            <select id="sub-totals-filter-size" class="roast-admin-select">
              <option value="all">All Sizes</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="sub-totals-filter-freq">Filter Frequency</label>
            <select id="sub-totals-filter-freq" class="roast-admin-select">
              <option value="all">All Frequencies</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="sub-totals-filter-status">Filter Status</label>
            <select id="sub-totals-filter-status" class="roast-admin-select">
              <option value="all">Active Only</option>
              <option value="all_with_cancelled">All (Inc. Cancelled)</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div id="sub-totals-kpis" class="roast-admin-kpi-grid"></div>
        <div id="sub-totals-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>
  </div>

</div>
</div>

<script src="{{ '/js/admin-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminSubscriptions({
    apiUrl: {{ site.subscription_api_url | jsonify }},
    manageBaseUrl: {{ '/subscriptions/manage/' | relative_url | jsonify }}
  });
</script>
