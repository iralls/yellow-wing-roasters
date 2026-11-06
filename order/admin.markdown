---
layout: default
title: "Roaster Order Manager"
permalink: /order/admin/
sitemap: false
---

{% include admin-shell-top.html prefix="order" title="Roaster Order Manager" gate_desc="Enter your roaster management passcode to access the live order queue and fulfillment controls." %}

      <div class="order-admin-controls-row">
        <div class="order-admin-search-wrap" style="margin-left: auto;">
          <input type="search" id="order-admin-search-input" class="order-admin-search-input" placeholder="Search orders (ID, name, email, coffee)..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Unified Customer Orders Database Table & Fulfillment Inspector -->
    <div id="order-admin-panel-totals" class="roast-admin-panel roast-admin-panel--active">
      <div id="order-admin-inspector-card" class="order-admin-inspector" style="display: none; margin-bottom: 1rem;">
        <div id="order-admin-inspector"></div>
      </div>

      <div class="roast-admin-card">
        <div class="roast-admin-card-title">
          <span>Customer Orders</span>
          <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="order-totals-filter-drawer">
            <span>+</span> <strong>Filters</strong>
          </button>
        </div>

        <div id="order-totals-filter-drawer" style="display: none;">
          <div class="query-drawer-box">
            <div class="query-drawer-row">
              <span class="query-drawer-label">Filters:</span>
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="order-totals-filter-status">Filter Status</label>
                <select id="order-totals-filter-status" class="roast-admin-select">
                  <option value="active" selected>Active Orders (!Delivered, !Cancelled)</option>
                  <option value="all">All Non-Cancelled</option>
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
                <label for="order-totals-filter-delivery">Filter Delivery</label>
                <select id="order-totals-filter-delivery" class="roast-admin-select">
                  <option value="all">All Methods</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Hand delivery">Hand delivery</option>
                </select>
              </div>
            </div>

            <div class="query-drawer-row">
              <span class="query-drawer-label">Group By:</span>
              <div id="order-totals-group-pills" class="order-admin-filters">
                <button type="button" class="order-admin-filter-pill" data-group="month">Month</button>
                <button type="button" class="order-admin-filter-pill" data-group="year">Year</button>
                <button type="button" class="order-admin-filter-pill" data-group="date">Date (Day)</button>
                <button type="button" class="order-admin-filter-pill" data-group="roast">Roast</button>
                <button type="button" class="order-admin-filter-pill" data-group="size">Bag Size</button>
                <button type="button" class="order-admin-filter-pill" data-group="deliveryMethod">Delivery Method</button>
                <button type="button" class="order-admin-filter-pill" data-group="status">Status</button>
                <button type="button" class="order-admin-filter-pill" data-group="city">City</button>
                <button type="button" class="order-admin-filter-pill" data-group="customer">Customer</button>
              </div>
              <button type="button" id="order-clear-groupby" class="query-clear-btn">Raw Rows (Clear Group)</button>
            </div>

            <div class="query-drawer-row">
              <span class="query-drawer-label">Aggregations:</span>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="order-agg-bags">Bags</label>
                <select id="order-agg-bags" class="roast-admin-select">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="order-agg-weight">Weight (lbs)</label>
                <select id="order-agg-weight" class="roast-admin-select">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="order-agg-revenue">Revenue ($)</label>
                <select id="order-agg-revenue" class="roast-admin-select">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
            </div>
          </div>
        </div>

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
