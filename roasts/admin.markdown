---
layout: default
title: "Roaster Inventory & Roast Log"
permalink: /roasts/admin/
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
  .ywr-admin-authenticated #roast-admin-gate-section { display: none !important; }
  .ywr-admin-authenticated #roast-admin-dashboard-section { display: block !important; }
</style>

<div class="roast-minimal-vertical">
<div class="roast-admin-terminal">
<div class="order-admin-container" style="max-width: 72rem;">

  <div class="order-admin-header-compact roast-admin-header-compact">
    <h1 class="order-admin-page-title">Roaster Inventory &amp; Roast Log</h1>
  </div>

  <!-- Passcode Gate View -->
  <div id="roast-admin-gate-section" class="order-admin-gate">
    <div class="order-admin-gate-icon">
      <span class="status-badge status-received">Passcode Required</span>
    </div>
    <h2 class="order-admin-gate-title">Owner Authentication</h2>
    <p class="order-admin-gate-desc">Enter your roaster management passcode to access green bean inventory, roast logs, and packaging records.</p>

    <form id="roast-admin-gate-form" class="order-admin-gate-form">
      <div>
        <input type="password" id="roast-admin-passcode-input" class="order-admin-input" placeholder="Enter owner passcode..." required autocomplete="current-password" autofocus>
      </div>
      <button type="submit" id="roast-admin-gate-btn" class="order-admin-save-btn">Unlock Console</button>
      <div id="roast-admin-gate-error" class="order-admin-gate-error" style="display: none;"></div>
    </form>
  </div>

  <!-- Authenticated Console View -->
  <div id="roast-admin-dashboard-section" style="display: none;">
    <!-- Top Bar Controls -->
    <div class="order-admin-topbar">
      <div class="order-admin-header-row">
        <div id="roast-admin-error-banner" class="order-admin-gate-error" style="display: none; margin: 0; padding: 0.35rem 0.65rem; font-size: 0.74rem;"></div>
        <div class="order-admin-actions" style="margin-left: auto;">
          <a href="{{ '/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Admin</a>
          <button type="button" id="roast-admin-refresh-btn" class="order-admin-btn-sm" title="Refresh inventory data">Refresh</button>
          <button type="button" id="roast-admin-logout-btn" class="order-admin-btn-sm order-admin-btn-sm--logout" title="Log out of console">Log Out</button>
        </div>
      </div>

      <div class="order-admin-controls-row">
        <div id="roast-admin-tabs" class="roast-admin-tabs" role="tablist">
          <button type="button" class="roast-admin-tab-btn roast-admin-tab-btn--active" data-tab="beans" role="tab" aria-selected="true">Active Green Beans</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="orders" role="tab" aria-selected="false">Green Bean Orders</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="roasts" role="tab" aria-selected="false">Roast Log</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="packaging" role="tab" aria-selected="false">Master Blend &amp; Packaging</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="roast-admin-search-input" class="order-admin-search-input" placeholder="Search IDs, beans, suppliers, blends..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Tab 1: Active Green Beans -->
    <div id="roast-admin-panel-beans" class="roast-admin-panel roast-admin-panel--active">
      <div class="roast-admin-card">
        <div class="roast-admin-card-title">
          <span>Active Green Beans</span>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <label class="order-admin-checkbox-label" style="margin: 0; font-size: 0.78rem;">
              <input type="checkbox" id="roast-admin-show-depleted">
              <span>Show depleted beans (0g)</span>
            </label>
            <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="beans-filter-drawer">
              <span>+</span> <strong>Filters</strong>
            </button>
          </div>
        </div>
        <div id="beans-filter-drawer" style="display: none;">
          <div class="query-drawer-box">
            <div class="query-drawer-row">
              <span class="query-drawer-label">Filters:</span>
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="beans-filter-bean">Filter Bean</label>
                <select id="beans-filter-bean" class="roast-admin-select">
                  <option value="all">All Beans</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 10rem;">
                <label for="beans-filter-supplier">Filter Supplier</label>
                <select id="beans-filter-supplier" class="roast-admin-select">
                  <option value="all">All Suppliers</option>
                </select>
              </div>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Group By:</span>
              <div class="order-admin-filters">
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="beans:supplier">Supplier</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="beans:bean">Bean Name</button>
              </div>
              <button type="button" class="query-clear-btn" data-clear-groupby="beans">Raw Rows (Clear Group)</button>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Aggregations:</span>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="beans-agg-stock">Active Stock</label>
                <select id="beans-agg-stock" class="roast-admin-select" data-agg-mod="beans">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="beans-agg-orders">Order Count</label>
                <select id="beans-agg-orders" class="roast-admin-select" data-agg-mod="beans">
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
        <div id="roast-admin-beans-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>

    <!-- Tab 2: Green Bean Orders -->
    <div id="roast-admin-panel-orders" class="roast-admin-panel">
      <div id="orders-drawer-toggle-wrap" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="order-entry-drawer">
          <span>+</span> <strong id="order-drawer-btn-label">Record Green Bean Order</strong>
        </button>
      </div>

      <div id="order-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <div class="form-title-row">
          <h3 class="roast-admin-card-title" style="margin: 0;">
            <span id="order-form-title">Record Green Bean Order</span>
          </h3>
          <button type="button" id="order-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.2rem 0.6rem; font-size: 0.72rem;">Cancel Edit</button>
        </div>
        <form id="roast-admin-order-form" class="roast-admin-form roast-admin-entry-form">
          <div class="form-grid form-grid-4">
            <div class="form-field col-span-2">
              <label for="order-bean-select" class="form-label">Green Bean Selection</label>
              <select id="order-bean-select" class="roast-admin-select" required></select>
            </div>
            <div class="form-field col-span-2">
              <label for="order-bean-name" class="form-label">Bean Name (Full Display Title)</label>
              <input type="text" id="order-bean-name" class="roast-admin-input" placeholder="e.g. Colombia Supremo Huila" required>
            </div>
            <div class="form-field col-span-1">
              <label for="order-supplier" class="form-label">Supplier</label>
              <input type="text" id="order-supplier" class="roast-admin-input" placeholder="e.g. Roastmasters" required>
            </div>
            <div class="form-field col-span-1">
              <label for="order-supplier-id" class="form-label">Supplier Order #</label>
              <input type="text" id="order-supplier-id" class="roast-admin-input" placeholder="Invoice / Order #">
            </div>
            <div class="form-field col-span-1">
              <label for="order-date" class="form-label">Order Date</label>
              <input type="date" id="order-date" class="roast-admin-input" required>
            </div>
            <div class="form-field col-span-1">
              <label for="order-cost" class="form-label">Total Cost ($)</label>
              <input type="number" id="order-cost" class="roast-admin-input" step="0.01" min="0" placeholder="0.00" required>
            </div>
            <div class="form-field col-span-1">
              <label for="order-weight-lbs" class="form-label">Weight (lbs)</label>
              <input type="number" id="order-weight-lbs" class="roast-admin-input" step="0.01" min="0.01" placeholder="e.g. 5" required>
            </div>
            <div class="form-field col-span-1">
              <label for="order-adjust-grams" class="form-label">Adj (g)</label>
              <input type="number" id="order-adjust-grams" class="roast-admin-input" step="1" placeholder="+/- g" value="0">
            </div>
            <div class="form-field col-span-2">
              <label for="order-bean-url" class="form-label">Supplier URL to Bean</label>
              <input type="url" id="order-bean-url" class="roast-admin-input" placeholder="https://..." required>
            </div>
          </div>

          <div id="order-weight-preview" class="form-metric-strip">
            <div class="form-metric-item">Base: <strong>0.00 lbs (0 g)</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">Total Weight: <strong style="color: #1e7e44;">0.00 lbs (0 g)</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">Unit Cost: <strong>$0.00 / lb</strong></div>
          </div>

          <div class="form-action-row">
            <button type="submit" id="order-submit-btn" class="order-admin-save-btn">Save Green Bean Order</button>
          </div>
          <div id="order-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <div class="roast-admin-card-title">
          <span>Green Bean Orders</span>
          <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="orders-filter-drawer">
            <span>+</span> <strong>Filters</strong>
          </button>
        </div>
        <div id="orders-filter-drawer" style="display: none;">
          <div class="query-drawer-box">
            <div class="query-drawer-row">
              <span class="query-drawer-label">Filters:</span>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="orders-filter-year">Filter Year</label>
                <select id="orders-filter-year" class="roast-admin-select">
                  <option value="all">All Years</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="orders-filter-month">Filter Month</label>
                <select id="orders-filter-month" class="roast-admin-select">
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
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="orders-filter-bean">Filter Bean</label>
                <select id="orders-filter-bean" class="roast-admin-select">
                  <option value="all">All Beans</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 10rem;">
                <label for="orders-filter-supplier">Filter Supplier</label>
                <select id="orders-filter-supplier" class="roast-admin-select">
                  <option value="all">All Suppliers</option>
                </select>
              </div>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Group By:</span>
              <div class="order-admin-filters">
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="orders:month">Date (Month)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="orders:year">Date (Year)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="orders:date">Date (Day)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="orders:supplier">Supplier</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="orders:bean">Bean Selection</button>
              </div>
              <button type="button" class="query-clear-btn" data-clear-groupby="orders">Raw Rows (Clear Group)</button>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Aggregations:</span>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="orders-agg-weight">Weight</label>
                <select id="orders-agg-weight" class="roast-admin-select" data-agg-mod="orders">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="orders-agg-cost">Total Spend ($)</label>
                <select id="orders-agg-cost" class="roast-admin-select" data-agg-mod="orders">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="orders-agg-unit-cost">Unit Cost ($/lb)</label>
                <select id="orders-agg-unit-cost" class="roast-admin-select" data-agg-mod="orders">
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="orders-agg-remaining">Available Stock</label>
                <select id="orders-agg-remaining" class="roast-admin-select" data-agg-mod="orders">
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
        <div id="orders-ledger-container">
          <div id="roast-admin-orders-table-wrap" class="roast-admin-table-wrap"></div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Roast Log -->
    <div id="roast-admin-panel-roasts" class="roast-admin-panel">
      <div id="roasts-drawer-toggle-wrap" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="roast-entry-drawer">
          <span>+</span> <strong id="roast-drawer-btn-label">Record Roast Log</strong>
        </button>
      </div>

      <div id="roast-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <div class="form-title-row">
          <h3 class="roast-admin-card-title" style="margin: 0;">
            <span id="roast-form-title">Record Roast Log</span>
          </h3>
          <button type="button" id="roast-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.2rem 0.6rem; font-size: 0.72rem;">Cancel Edit</button>
        </div>
        <form id="roast-admin-roast-form" class="roast-admin-form roast-admin-entry-form">
          <div class="form-grid form-grid-3">
            <div class="form-field col-span-1">
              <label for="roast-date" class="form-label">Roast Date</label>
              <input type="date" id="roast-date" class="roast-admin-input" required>
            </div>
            <div class="form-field col-span-1">
              <label for="roast-level-select" class="form-label">Roast Level</label>
              <select id="roast-level-select" class="roast-admin-select" required>
                {% for lvl in site.data.roast_levels %}
                <option value="{{ lvl[0] }}">{{ lvl[1].specialty | default: lvl[1].name }}</option>
                {% endfor %}
              </select>
            </div>
            <div class="form-field col-span-1">
              <label for="roast-profile-url" class="form-label">Roast Profile URL</label>
              <input type="url" id="roast-profile-url" class="roast-admin-input" placeholder="https://..." required>
            </div>
          </div>

          <div class="form-component-section">
            <div class="roast-admin-components-header">
              <span class="form-label">Green Bean Orders &amp; Amount Used</span>
              <button type="button" id="roast-add-component-btn" class="order-admin-btn-sm">+ Add Green Bean Order</button>
            </div>
            <div id="roast-components-container" class="roast-admin-components-list"></div>
          </div>

          <div class="form-grid form-grid-3">
            <div class="form-field col-span-1">
              <label for="roast-end-grams" class="form-label">Roasted End Weight (g)</label>
              <input type="number" id="roast-end-grams" class="roast-admin-input" step="1" min="1" placeholder="e.g. 386" required>
            </div>
            <div class="form-field col-span-2">
              <label for="roast-notes" class="form-label">Batch Notes (Crack times, temperature, profile remarks)</label>
              <input type="text" id="roast-notes" class="roast-admin-input" placeholder="e.g. First crack at 9:15, 1:45 development time...">
            </div>
          </div>

          <div id="roast-loss-preview" class="form-metric-strip">
            <div class="form-metric-item">Green Weight: <strong>0.00 lbs (0 g)</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">End Weight: <strong>0.00 lbs (0 g)</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">Weight Loss: <strong>0.0%</strong></div>
          </div>

          <div class="form-action-row">
            <button type="submit" id="roast-submit-btn" class="order-admin-save-btn">Save Roast Log</button>
          </div>
          <div id="roast-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <div class="roast-admin-card-title">
          <span>Roast Logs</span>
          <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="roasts-filter-drawer">
            <span>+</span> <strong>Filters</strong>
          </button>
        </div>
        <div id="roasts-filter-drawer" style="display: none;">
          <div class="query-drawer-box">
            <div class="query-drawer-row">
              <span class="query-drawer-label">Filters:</span>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="roasts-filter-year">Filter Year</label>
                <select id="roasts-filter-year" class="roast-admin-select">
                  <option value="all">All Years</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="roasts-filter-month">Filter Month</label>
                <select id="roasts-filter-month" class="roast-admin-select">
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
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="roasts-filter-bean">Filter Bean</label>
                <select id="roasts-filter-bean" class="roast-admin-select">
                  <option value="all">All Beans</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 10rem;">
                <label for="roasts-filter-roast-level">Filter Roast Level</label>
                <select id="roasts-filter-roast-level" class="roast-admin-select">
                  <option value="all">All Levels</option>
                  {% for lvl in site.data.roast_levels %}
                  <option value="{{ lvl[0] }}">{{ lvl[1].specialty | default: lvl[1].name }}</option>
                  {% endfor %}
                </select>
              </div>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Group By:</span>
              <div class="order-admin-filters">
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:month">Date (Month)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:year">Date (Year)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:date">Date (Day)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:bean">Bean Selection</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:roastLevel">Roast Level</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="roasts:supplier">Supplier</button>
              </div>
              <button type="button" class="query-clear-btn" data-clear-groupby="roasts">Raw Rows (Clear Group)</button>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Aggregations:</span>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="roasts-agg-green">Green Weight</label>
                <select id="roasts-agg-green" class="roast-admin-select" data-agg-mod="roasts">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="roasts-agg-end">End Weight</label>
                <select id="roasts-agg-end" class="roast-admin-select" data-agg-mod="roasts">
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="roasts-agg-loss">Loss %</label>
                <select id="roasts-agg-loss" class="roast-admin-select" data-agg-mod="roasts">
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="roasts-agg-avail">Available Yield</label>
                <select id="roasts-agg-avail" class="roast-admin-select" data-agg-mod="roasts">
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
        <div id="roasts-ledger-container">
          <div id="roast-admin-roasts-table-wrap" class="roast-admin-table-wrap"></div>
        </div>
      </div>
    </div>

    <!-- Tab 4: Master Blend & Packaging Log -->
    <div id="roast-admin-panel-packaging" class="roast-admin-panel">
      <div id="pkg-drawer-toggle-wrap" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="pkg-entry-drawer">
          <span>+</span> <strong id="pkg-drawer-btn-label">Record Master Blend &amp; Packaging</strong>
        </button>
      </div>

      <div id="pkg-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <div class="form-title-row">
          <h3 class="roast-admin-card-title" style="margin: 0;">
            <span id="pkg-form-title">Record Master Blend &amp; Packaging</span>
          </h3>
          <button type="button" id="pkg-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.2rem 0.6rem; font-size: 0.72rem;">Cancel Edit</button>
        </div>
        <form id="roast-admin-packaging-form" class="roast-admin-form roast-admin-entry-form">
          <div class="form-grid form-grid-4">
            <div class="form-field col-span-1">
              <label for="pkg-date" class="form-label">Packaging Date</label>
              <input type="date" id="pkg-date" class="roast-admin-input" required>
            </div>
            <div class="form-field col-span-1">
              <label for="pkg-purpose" class="form-label">Purpose</label>
              <select id="pkg-purpose" class="roast-admin-select" required>
                <option value="Order">Customer Order</option>
                <option value="Sample">Free Sample</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div id="pkg-customer-order-wrap" class="form-field col-span-1">
              <label for="pkg-order-select" class="form-label">Customer Order</label>
              <div style="display: flex; gap: 0.35rem;">
                <select id="pkg-order-select" class="roast-admin-select" style="flex: 1.2;">
                  <option value="">Select Order...</option>
                </select>
                <input type="text" id="pkg-order-id" class="roast-admin-input" placeholder="ID (1011)" style="flex: 0.8;">
              </div>
            </div>
            <div class="form-field col-span-1">
              <label for="pkg-bag-size" class="form-label">Bag Size</label>
              <select id="pkg-bag-size" class="roast-admin-select">
                {% for s in site.data.bag_sizes %}
                <option value="{{ s.id }}" data-weight-oz="{{ s.weight_oz }}" data-weight-grams="{{ s.weight_oz | times: 453.592 | divided_by: 16 | round }}" {% if s.default %}selected{% endif %}>{{ s.label }}</option>
                {% endfor %}
                <option value="Custom">Custom / Loose</option>
              </select>
            </div>
            <div class="form-field col-span-4">
              <label for="pkg-product" class="form-label">Product / Blend Label</label>
              <input type="text" id="pkg-product" class="roast-admin-input" list="pkg-catalog-roasts" placeholder="e.g. Early Bird, Colombia..." required>
              <datalist id="pkg-catalog-roasts">
                {% for r in site.roasts %}
                <option value="{{ r.title }}"></option>
                {% endfor %}
              </datalist>
            </div>
          </div>

          <div class="form-component-section">
            <div class="roast-admin-components-header">
              <span class="form-label">Roast Batches &amp; Amount Used</span>
              <button type="button" id="pkg-add-component-btn" class="order-admin-btn-sm">+ Add Roast Batch</button>
            </div>
            <div id="pkg-components-container" class="roast-admin-component-list"></div>
          </div>

          <div id="pkg-blend-preview" class="form-metric-strip">
            <div class="form-metric-item">Total Packaged: <strong>0.00 lbs (0 g)</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">Blend Check: <strong>0.0%</strong></div>
            <span class="form-metric-divider">&bull;</span>
            <div class="form-metric-item">Target Bag: <strong>0.75 lbs (340 g / 12oz)</strong></div>
          </div>

          <div class="form-field" style="margin-top: 0.4rem;">
            <label for="pkg-notes" class="form-label">Notes (Optional)</label>
            <input type="text" id="pkg-notes" class="roast-admin-input" placeholder="Customer order #, sample recipient, blend notes...">
          </div>

          <div class="form-action-row">
            <button type="submit" id="pkg-submit-btn" class="order-admin-save-btn">Save Blend / Packaging Log</button>
          </div>
          <div id="pkg-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <div class="roast-admin-card-title">
          <span>Master Blend &amp; Packaging Log</span>
          <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="pkg-filter-drawer">
            <span>+</span> <strong>Filters</strong>
          </button>
        </div>
        <div id="pkg-filter-drawer" style="display: none;">
          <div class="query-drawer-box">
            <div class="query-drawer-row">
              <span class="query-drawer-label">Filters:</span>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="pkg-filter-year">Filter Year</label>
                <select id="pkg-filter-year" class="roast-admin-select">
                  <option value="all">All Years</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 8rem;">
                <label for="pkg-filter-month">Filter Month</label>
                <select id="pkg-filter-month" class="roast-admin-select">
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
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="pkg-filter-product">Filter Product</label>
                <select id="pkg-filter-product" class="roast-admin-select">
                  <option value="all">All Products</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 11rem;">
                <label for="pkg-filter-bean">Filter Bean</label>
                <select id="pkg-filter-bean" class="roast-admin-select">
                  <option value="all">All Beans</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 10rem;">
                <label for="pkg-filter-purpose">Filter Purpose</label>
                <select id="pkg-filter-purpose" class="roast-admin-select">
                  <option value="all">All Purposes</option>
                  <option value="Order">Customer Orders Only</option>
                  <option value="Sample">Sample Only</option>
                  <option value="Personal">Personal Only</option>
                </select>
              </div>
              <div class="roast-admin-field" style="min-width: 10rem;">
                <label for="pkg-filter-bag-size">Filter Bag Size</label>
                <select id="pkg-filter-bag-size" class="roast-admin-select">
                  <option value="all">All Sizes</option>
                  {% for s in site.data.bag_sizes %}
                  <option value="{{ s.id }}">{{ s.label }}</option>
                  {% endfor %}
                  <option value="Custom">Custom / Loose</option>
                </select>
              </div>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Group By:</span>
              <div class="order-admin-filters">
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:month">Date (Month)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:year">Date (Year)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:date">Date (Day)</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:product">Product / Blend</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:bagSize">Bag Size</button>
                <button type="button" class="order-admin-filter-pill" data-toggle-groupby="packaging:purpose">Purpose</button>
              </div>
              <button type="button" class="query-clear-btn" data-clear-groupby="packaging">Raw Rows (Clear Group)</button>
            </div>
            <div class="query-drawer-row">
              <span class="query-drawer-label">Aggregations:</span>
              <div class="roast-admin-field" style="min-width: 9rem;">
                <label for="pkg-agg-weight">Packaged Weight</label>
                <select id="pkg-agg-weight" class="roast-admin-select" data-agg-mod="packaging">
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
        <div id="pkg-ledger-container">
          <div id="roast-admin-packaging-table-wrap" class="roast-admin-table-wrap"></div>
        </div>
      </div>
    </div>

  </div>

</div>
</div>
</div>

<script src="{{ '/js/admin-roasts.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminRoasts({
    apiUrl: {{ site.roast_inventory_api_url | jsonify }},
    orderApiUrl: {{ site.order_api_url | jsonify }},
    roastLevels: {{ site.data.roast_levels | jsonify }},
    bagSizes: {{ site.data.bag_sizes | jsonify }}
  });
</script>
