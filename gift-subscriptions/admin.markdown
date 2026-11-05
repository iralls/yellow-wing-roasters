---
layout: default
title: "Roaster Gift Subscriptions Manager"
permalink: /gift-subscriptions/admin/
sitemap: false
---

{% include admin-shell-top.html prefix="gift-sub" title="Roaster Gift Subscriptions Manager" gate_desc="Enter your roaster management passcode to access gift subscription orders, fulfillment tracking, and status notifications." %}

      <!-- Top KPI Summary Bar -->
      <div id="gift-sub-admin-kpis" class="roast-admin-kpi-grid" style="margin-top: 0.75rem; margin-bottom: 0.75rem;"></div>

      <div class="order-admin-controls-row">
        <div id="gift-sub-admin-tabs" class="roast-admin-tabs" role="tablist">
          <button type="button" class="roast-admin-tab-btn roast-admin-tab-btn--active" data-tab="queue" role="tab" aria-selected="true">Gift Orders Queue</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="totals" role="tab" aria-selected="false">Totals &amp; Rollups</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="gift-sub-admin-search-input" class="order-admin-search-input" placeholder="Search gift orders (ID, purchaser, recipient, roast, address)..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Tab 1: Queue & Inspector -->
    {% capture gift_sub_filters %}
      <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
      <button type="button" class="order-admin-filter-pill" data-filter="active">Active</button>
      <button type="button" class="order-admin-filter-pill" data-filter="roasted">Roasted</button>
      <button type="button" class="order-admin-filter-pill" data-filter="out for delivery">Out for Delivery</button>
      <button type="button" class="order-admin-filter-pill" data-filter="delivered">Delivered</button>
      <button type="button" class="order-admin-filter-pill" data-filter="paused">Paused</button>
      <button type="button" class="order-admin-filter-pill" data-filter="completed">Completed</button>
      <button type="button" class="order-admin-filter-pill" data-filter="cancelled">Cancelled</button>
    {% endcapture %}

    {% include admin-workspace.html
      id="gift-sub-panel-queue"
      active=true
      filters_id="gift-sub-filters"
      filter_html=gift_sub_filters
      queue_id="gift-sub-queue"
      inspector_id="gift-sub-inspector"
      empty_text="Select a gift subscription from the queue to view details, update fulfillment status, and send status emails."
    %}

    <!-- Tab 2: Totals & Rollups -->
    <div id="gift-sub-panel-totals" class="roast-admin-panel">
      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Gift Subscription Totals &amp; Rollups</h3>
        <div class="roast-admin-totals-bar">
          <div class="roast-admin-field" style="flex: 1 1 100%; margin-bottom: 0.5rem;">
            <label style="display: block; margin-bottom: 0.35rem; font-size: 0.8rem; font-weight: 600; color: #6e5e54;">Group By:</label>
            <div id="gift-sub-group-pills" class="order-admin-filters">
              <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-group="roast">Roast</button>
              <button type="button" class="order-admin-filter-pill" data-group="duration">Duration</button>
              <button type="button" class="order-admin-filter-pill" data-group="status">Status</button>
            </div>
          </div>
          <div class="roast-admin-field" style="min-width: 10rem;">
            <label for="gift-sub-filter-roast">Filter Roast</label>
            <select id="gift-sub-filter-roast" class="roast-admin-select">
              <option value="all">All Roasts</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="gift-sub-filter-dur">Filter Duration</label>
            <select id="gift-sub-filter-dur" class="roast-admin-select">
              <option value="all">All Durations</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="gift-sub-filter-status">Filter Status</label>
            <select id="gift-sub-filter-status" class="roast-admin-select">
              <option value="all">All (Non-Cancelled)</option>
              <option value="all_with_cancelled">All (Inc. Cancelled)</option>
              <option value="Active">Active</option>
              <option value="Roasted">Roasted</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div id="gift-sub-totals-kpis" class="roast-admin-kpi-grid"></div>
        <div id="gift-sub-totals-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>
{% include admin-shell-bottom.html %}

<script src="{{ '/js/admin-gift-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminGiftSubscriptions({
    apiUrl: {{ site.gift_subscription_api_url | jsonify }}
  });
</script>
