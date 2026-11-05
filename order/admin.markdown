---
layout: default
title: "Roaster Order Manager"
permalink: /order/admin/
sitemap: false
---

{% include admin-shell-top.html prefix="order" title="Roaster Order Manager" gate_desc="Enter your roaster management passcode to access the live order queue and fulfillment controls." %}

      <div class="order-admin-controls-row">
        <div id="order-admin-tabs" class="roast-admin-tabs" role="tablist">
          <button type="button" class="roast-admin-tab-btn roast-admin-tab-btn--active" data-tab="queue" role="tab" aria-selected="true">Order Queue</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="totals" role="tab" aria-selected="false">Totals</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="order-admin-search-input" class="order-admin-search-input" placeholder="Search orders (ID, name, email, coffee)..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Tab 1: Order Queue -->
    {% capture order_filters %}
      <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
      <button type="button" class="order-admin-filter-pill" data-filter="received">Received</button>
      <button type="button" class="order-admin-filter-pill" data-filter="delayed">Delayed</button>
      <button type="button" class="order-admin-filter-pill" data-filter="roasted">Roasted</button>
      <button type="button" class="order-admin-filter-pill" data-filter="ready_for_pickup">Ready for Pickup</button>
      <button type="button" class="order-admin-filter-pill" data-filter="ready_to_deliver">Ready to Deliver</button>
      <button type="button" class="order-admin-filter-pill" data-filter="delivered">Delivered</button>
      <button type="button" class="order-admin-filter-pill" data-filter="cancelled">Cancelled</button>
    {% endcapture %}

    {% include admin-workspace.html
      id="order-admin-panel-queue"
      active=true
      filters_id="order-admin-filters"
      filter_html=order_filters
      queue_id="order-admin-queue"
      inspector_id="order-admin-inspector"
      empty_text="Select an order from the queue to view details and update fulfillment status."
    %}

    <!-- Tab 2: Totals & Historical Rollups -->
    <div id="order-admin-panel-totals" class="roast-admin-panel">
      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Order Totals &amp; Historical Rollups</h3>
        <div class="roast-admin-totals-bar">
          <div class="roast-admin-field" style="flex: 1 1 100%; margin-bottom: 0.5rem;">
            <label style="display: block; margin-bottom: 0.35rem; font-size: 0.8rem; font-weight: 600; color: #6e5e54;">Group By (select any combination):</label>
            <div id="order-totals-group-pills" class="order-admin-filters">
              <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-group="month">Month</button>
              <button type="button" class="order-admin-filter-pill" data-group="year">Year</button>
              <button type="button" class="order-admin-filter-pill" data-group="roast">Roast</button>
              <button type="button" class="order-admin-filter-pill" data-group="size">Bag Size</button>
              <button type="button" class="order-admin-filter-pill" data-group="deliveryMethod">Delivery Method</button>
              <button type="button" class="order-admin-filter-pill" data-group="status">Status</button>
              <button type="button" class="order-admin-filter-pill" data-group="city">City</button>
            </div>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="order-totals-filter-year">Filter Year</label>
            <select id="order-totals-filter-year" class="roast-admin-select">
              <option value="all">All Years</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="order-totals-filter-month">Filter Month</label>
            <select id="order-totals-filter-month" class="roast-admin-select">
              <option value="all">All Months</option>
              <option value="01">01 — Jan</option>
              <option value="02">02 — Feb</option>
              <option value="03">03 — Mar</option>
              <option value="04">04 — Apr</option>
              <option value="05">05 — May</option>
              <option value="06">06 — Jun</option>
              <option value="07">07 — Jul</option>
              <option value="08">08 — Aug</option>
              <option value="09">09 — Sep</option>
              <option value="10">10 — Oct</option>
              <option value="11">11 — Nov</option>
              <option value="12">12 — Dec</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 10rem;">
            <label for="order-totals-filter-roast">Filter Roast</label>
            <select id="order-totals-filter-roast" class="roast-admin-select">
              <option value="all">All Roasts</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="order-totals-filter-size">Filter Size</label>
            <select id="order-totals-filter-size" class="roast-admin-select">
              <option value="all">All Sizes</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="order-totals-filter-status">Filter Status</label>
            <select id="order-totals-filter-status" class="roast-admin-select">
              <option value="all">Active Orders (Non-Cancelled)</option>
              <option value="all_with_cancelled">All Orders (Inc. Cancelled)</option>
              <option value="Received">Received</option>
              <option value="Delayed">Delayed</option>
              <option value="Roasted">Roasted</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Ready to Deliver">Ready to Deliver</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="order-totals-filter-delivery">Filter Delivery</label>
            <select id="order-totals-filter-delivery" class="roast-admin-select">
              <option value="all">All Methods</option>
              <option value="Pickup">Pickup</option>
              <option value="Hand delivery">Hand delivery</option>
            </select>
          </div>
        </div>

        <div id="order-totals-kpis" class="roast-admin-kpi-grid"></div>
        <div id="order-totals-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>
{% include admin-shell-bottom.html %}

<script src="{{ '/js/admin-orders.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminOrders({
    apiUrl: {{ site.order_api_url | jsonify }},
    manageBaseUrl: {{ '/order/manage/' | relative_url | jsonify }},
    bagSizes: {{ site.data.bag_sizes | jsonify }}
  });
</script>
