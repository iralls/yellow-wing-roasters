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

<div class="roast-admin-terminal">
<div class="order-admin-container">

  <div class="order-admin-header-compact roast-admin-header-compact">
    <img src="{{ '/images/bean-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Inventory Console" class="order-admin-bird-icon" fetchpriority="high" decoding="async">
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
        <div id="roast-admin-stats" class="order-admin-stats"></div>
        <div class="order-admin-actions">
          <a href="{{ '/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Admin Portal</a>
          <a href="{{ '/order/admin/' | relative_url }}" class="order-admin-btn-sm" style="text-decoration: none;">Order Manager</a>
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
          <button type="button" class="roast-admin-tab-btn" data-tab="totals" role="tab" aria-selected="false">Totals</button>
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
          <label class="order-admin-checkbox-label" style="margin: 0; font-size: 0.78rem;">
            <input type="checkbox" id="roast-admin-show-depleted">
            <span>Show depleted beans (0g)</span>
          </label>
        </div>
        <div id="roast-admin-beans-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>

    <!-- Tab 2: Green Bean Orders -->
    <div id="roast-admin-panel-orders" class="roast-admin-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="order-entry-drawer">
          <span>+</span> <strong id="order-drawer-btn-label">Record Green Bean Order</strong>
        </button>
      </div>

      <div id="order-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <h3 class="roast-admin-card-title">
          <span id="order-form-title">Record Green Bean Order</span>
          <button type="button" id="order-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.15rem 0.55rem; font-size: 0.72rem;">Cancel Edit</button>
        </h3>
        <form id="roast-admin-order-form" class="roast-admin-form roast-admin-entry-form">
          <div class="roast-admin-entry-row">
            <div class="roast-admin-field" style="flex: 1.2; min-width: 11rem;">
              <label for="order-bean-select">Green Bean</label>
              <select id="order-bean-select" class="roast-admin-select" required></select>
            </div>
            <div class="roast-admin-field" style="flex: 1.4; min-width: 13rem;">
              <label for="order-bean-name">Bean Name</label>
              <input type="text" id="order-bean-name" class="roast-admin-input" placeholder="e.g. Colombia Supremo Huila" required>
            </div>
            <div class="roast-admin-field" style="flex: 1; min-width: 10rem;">
              <label for="order-supplier">Supplier</label>
              <input type="text" id="order-supplier" class="roast-admin-input" placeholder="e.g. Roastmasters" required>
            </div>
            <div class="roast-admin-field" style="flex: 0.9; min-width: 8rem;">
              <label for="order-supplier-id">Supplier Order #</label>
              <input type="text" id="order-supplier-id" class="roast-admin-input" placeholder="Invoice / Order #">
            </div>
            <div class="roast-admin-field" style="flex: 0.9; min-width: 8.5rem;">
              <label for="order-date">Order Date</label>
              <input type="date" id="order-date" class="roast-admin-input" required>
            </div>
          </div>

          <div class="roast-admin-entry-row">
            <div class="roast-admin-field" style="flex: 0.7; min-width: 6.5rem;">
              <label for="order-cost">Cost ($)</label>
              <input type="number" id="order-cost" class="roast-admin-input" step="0.01" min="0" placeholder="0.00" required>
            </div>
            <div class="roast-admin-field" style="flex: 0.7; min-width: 6.5rem;">
              <label for="order-weight-lbs">Weight (lbs)</label>
              <input type="number" id="order-weight-lbs" class="roast-admin-input" step="0.01" min="0.01" placeholder="e.g. 5" required>
            </div>
            <div class="roast-admin-field" style="flex: 0.8; min-width: 7.5rem;">
              <label for="order-adjust-grams">Adj (g)</label>
              <input type="number" id="order-adjust-grams" class="roast-admin-input" step="1" placeholder="+/- g" value="0">
            </div>
            <div id="order-weight-preview" class="roast-admin-calc-preview" style="flex: 1.2; min-width: 14rem;">
              <span>Base: <strong>0 g</strong></span>
              <span>Total Weight (g): <strong>0 g</strong></span>
            </div>
            <div class="roast-admin-field" style="flex: 1.5; min-width: 13rem;">
              <label for="order-bean-url">URL to Bean</label>
              <input type="url" id="order-bean-url" class="roast-admin-input" placeholder="https://..." required>
            </div>
            <div class="roast-admin-entry-actions">
              <button type="submit" id="order-submit-btn" class="order-admin-save-btn">Save Green Bean Order</button>
            </div>
          </div>
          <div id="order-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Green Bean Orders</h3>
        <div id="roast-admin-orders-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>

    <!-- Tab 3: Roast Log -->
    <div id="roast-admin-panel-roasts" class="roast-admin-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="roast-entry-drawer">
          <span>+</span> <strong id="roast-drawer-btn-label">Record Roast Log</strong>
        </button>
      </div>

      <div id="roast-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <h3 class="roast-admin-card-title">
          <span id="roast-form-title">Record Roast Log</span>
          <button type="button" id="roast-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.15rem 0.55rem; font-size: 0.72rem;">Cancel Edit</button>
        </h3>
        <form id="roast-admin-roast-form" class="roast-admin-form roast-admin-entry-form">
          <div class="roast-admin-entry-row">
            <div class="roast-admin-field" style="flex: 0.9; min-width: 8.5rem;">
              <label for="roast-date">Roast Date</label>
              <input type="date" id="roast-date" class="roast-admin-input" required>
            </div>
            <div class="roast-admin-field" style="flex: 1.1; min-width: 11rem;">
              <label for="roast-level-select">Roast Level</label>
              <select id="roast-level-select" class="roast-admin-select" required>
                {% for lvl in site.data.roast_levels %}
                <option value="{{ lvl[0] }}">{{ lvl[1].specialty | default: lvl[1].name }}</option>
                {% endfor %}
              </select>
            </div>
            <div class="roast-admin-field" style="flex: 0.7; min-width: 7rem;">
              <label for="roast-end-grams">End Weight (g)</label>
              <input type="number" id="roast-end-grams" class="roast-admin-input" step="1" min="1" placeholder="e.g. 386" required>
            </div>
            <div id="roast-loss-preview" class="roast-admin-calc-preview" style="flex: 1.1; min-width: 13rem;">
              <span>Green Weight: <strong>0 g</strong></span>
              <span>Weight Loss: <strong>0.0%</strong></span>
            </div>
            <div class="roast-admin-field" style="flex: 1.4; min-width: 13rem;">
              <label for="roast-profile-url">Link to Roast Profile (URL)</label>
              <input type="url" id="roast-profile-url" class="roast-admin-input" placeholder="https://..." required>
            </div>
          </div>

          <div class="roast-admin-field" style="margin-top: 0.35rem;">
            <div class="roast-admin-components-header">
              <label>Green Bean Orders &amp; Grams Used</label>
              <button type="button" id="roast-add-component-btn" class="order-admin-btn-sm">+ Add Green Bean Order</button>
            </div>
            <div id="roast-components-container" class="roast-admin-components-list"></div>
          </div>

          <div class="roast-admin-entry-row" style="margin-top: 0.35rem; align-items: flex-end;">
            <div class="roast-admin-field" style="flex: 1; min-width: 14rem;">
              <label for="roast-notes">Notes (Optional)</label>
              <input type="text" id="roast-notes" class="roast-admin-input" placeholder="Crack times, charge temp, batch notes...">
            </div>
            <div class="roast-admin-entry-actions">
              <button type="submit" id="roast-submit-btn" class="order-admin-save-btn">Save Roast Log</button>
            </div>
          </div>
          <div id="roast-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Roast Logs</h3>
        <div id="roast-admin-roasts-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>

    <!-- Tab 4: Master Blend & Packaging Log -->
    <div id="roast-admin-panel-packaging" class="roast-admin-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <button type="button" class="roast-admin-toggle-drawer-btn" data-drawer-target="pkg-entry-drawer">
          <span>+</span> <strong id="pkg-drawer-btn-label">Record Master Blend &amp; Packaging</strong>
        </button>
      </div>

      <div id="pkg-entry-drawer" class="roast-admin-card roast-admin-entry-card" style="display: none; margin-bottom: 0.85rem;">
        <h3 class="roast-admin-card-title">
          <span id="pkg-form-title">Record Master Blend &amp; Packaging</span>
          <button type="button" id="pkg-cancel-edit-btn" class="order-admin-btn-sm" style="display: none; padding: 0.15rem 0.55rem; font-size: 0.72rem;">Cancel Edit</button>
        </h3>
        <form id="roast-admin-packaging-form" class="roast-admin-form roast-admin-entry-form">
          <div class="roast-admin-entry-row">
            <div class="roast-admin-field" style="flex: 0.85; min-width: 8.5rem;">
              <label for="pkg-date">Date</label>
              <input type="date" id="pkg-date" class="roast-admin-input" required>
            </div>
            <div class="roast-admin-field" style="flex: 0.95; min-width: 9rem;">
              <label for="pkg-purpose">Purpose</label>
              <select id="pkg-purpose" class="roast-admin-select" required>
                <option value="Order">Customer Order</option>
                <option value="Sample">Free Sample</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div id="pkg-customer-order-wrap" class="roast-admin-field" style="flex: 1.4; min-width: 14rem;">
              <label for="pkg-order-select">Customer Order</label>
              <div style="display: flex; gap: 0.4rem;">
                <select id="pkg-order-select" class="roast-admin-select" style="flex: 1.2;">
                  <option value="">Select Order...</option>
                </select>
                <input type="text" id="pkg-order-id" class="roast-admin-input" placeholder="ID (1011)" style="flex: 0.8;">
              </div>
            </div>
            <div class="roast-admin-field" style="flex: 1.2; min-width: 12rem;">
              <label for="pkg-product">Product / Blend Label</label>
              <input type="text" id="pkg-product" class="roast-admin-input" list="pkg-catalog-roasts" placeholder="e.g. Early Bird, Colombia..." required>
              <datalist id="pkg-catalog-roasts">
                {% for r in site.roasts %}
                <option value="{{ r.title }}"></option>
                {% endfor %}
              </datalist>
            </div>
            <div class="roast-admin-field" style="flex: 0.9; min-width: 9rem;">
              <label for="pkg-bag-size">Bag Size</label>
              <select id="pkg-bag-size" class="roast-admin-select">
                {% for s in site.data.bag_sizes %}
                <option value="{{ s.id }}" {% if s.default %}selected{% endif %}>{{ s.label }}</option>
                {% endfor %}
                <option value="Custom">Custom / Loose</option>
              </select>
            </div>
          </div>

          <div class="roast-admin-field" style="margin-top: 0.35rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <label>Roast IDs &amp; Amount Used (g)</label>
              <button type="button" id="pkg-add-component-btn" class="order-admin-btn-sm" style="padding: 0.15rem 0.55rem; font-size: 0.72rem;">+ Add Roast ID</button>
            </div>
            <div id="pkg-components-container" class="roast-admin-component-list"></div>
          </div>

          <div class="roast-admin-entry-row" style="margin-top: 0.35rem; align-items: flex-end;">
            <div class="roast-admin-field" style="flex: 1; min-width: 14rem;">
              <label for="pkg-notes">Notes (Optional)</label>
              <input type="text" id="pkg-notes" class="roast-admin-input" placeholder="Customer order #, sample recipient, blend notes...">
            </div>
            <div class="roast-admin-entry-actions">
              <button type="submit" id="pkg-submit-btn" class="order-admin-save-btn">Save Blend / Packaging Log</button>
            </div>
          </div>
          <div id="pkg-form-feedback" class="order-admin-feedback" style="display: none;"></div>
        </form>
      </div>

      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Master Blend &amp; Packaging Log</h3>
        <div id="roast-admin-packaging-table-wrap" class="roast-admin-table-wrap"></div>
      </div>
    </div>

    <!-- Tab 5: Totals & Aggregations -->
    <div id="roast-admin-panel-totals" class="roast-admin-panel">
      <div class="roast-admin-card">
        <h3 class="roast-admin-card-title">Totals &amp; Historical Rollups</h3>
        <div class="roast-admin-totals-bar">
          <div class="roast-admin-field" style="min-width: 9rem;">
            <label for="totals-group-by">Group By</label>
            <select id="totals-group-by" class="roast-admin-select">
              <option value="month">Month (YYYY-MM)</option>
              <option value="year">Year (YYYY)</option>
              <option value="bean">Green Bean</option>
              <option value="supplier">Supplier</option>
              <option value="purpose">Purpose (Order / Sample / Personal)</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="totals-filter-year">Filter Year</label>
            <select id="totals-filter-year" class="roast-admin-select">
              <option value="all">All Years</option>
            </select>
          </div>
          <div class="roast-admin-field" style="min-width: 8rem;">
            <label for="totals-filter-month">Filter Month</label>
            <select id="totals-filter-month" class="roast-admin-select">
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
            <label for="totals-filter-bean">Filter Bean</label>
            <select id="totals-filter-bean" class="roast-admin-select">
              <option value="all">All Beans</option>
            </select>
          </div>
        </div>

        <div id="roast-admin-totals-kpis" class="roast-admin-kpi-grid"></div>
        <div id="roast-admin-totals-table-wrap" class="roast-admin-table-wrap"></div>
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
    roastLevels: {{ site.data.roast_levels | jsonify }}
  });
</script>
