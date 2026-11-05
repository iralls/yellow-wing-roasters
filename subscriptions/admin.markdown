---
layout: default
title: "Roaster Subscription Manager"
permalink: /subscriptions/admin/
sitemap: false
---

{% include admin-shell-top.html prefix="sub" title="Roaster Subscription Manager" gate_desc="Enter your roaster management passcode to access the recurring subscriptions queue and controls." %}

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
    {% capture sub_filters %}
      <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
      <button type="button" class="order-admin-filter-pill" data-filter="active">Active</button>
      <button type="button" class="order-admin-filter-pill" data-filter="paused">Paused</button>
      <button type="button" class="order-admin-filter-pill" data-filter="cancelled">Cancelled</button>
    {% endcapture %}

    {% include admin-workspace.html
      id="sub-admin-panel-queue"
      active=true
      filters_id="sub-admin-filters"
      filter_html=sub_filters
      queue_id="sub-admin-queue"
      inspector_id="sub-admin-inspector"
      empty_text="Select a subscription from the queue to view details and update status."
    %}

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
{% include admin-shell-bottom.html %}

<script src="{{ '/js/admin-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminSubscriptions({
    apiUrl: {{ site.subscription_api_url | jsonify }},
    manageBaseUrl: {{ '/subscriptions/manage/' | relative_url | jsonify }}
  });
</script>
