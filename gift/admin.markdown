---
layout: default
title: "Gift Card & Promo Code Manager"
permalink: /gift/admin/
sitemap: false
---

{% include admin-shell-top.html prefix="gift" title="Gift Card & Promo Code Manager" gate_desc="Enter your roaster management passcode to access digital gift card balances, redemption queues, and promo codes." %}

      <!-- Top KPI Summary Bar -->
      <div id="gift-admin-kpis" class="roast-admin-kpi-grid" style="margin-top: 0.75rem; margin-bottom: 0.75rem;"></div>

      <div class="order-admin-controls-row">
        <div id="gift-admin-tabs" class="roast-admin-tabs" role="tablist">
          <button type="button" class="roast-admin-tab-btn roast-admin-tab-btn--active" data-tab="gift-cards" role="tab" aria-selected="true">Digital Gift Cards</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="promo-codes" role="tab" aria-selected="false">Promo &amp; Discount Codes</button>
          <button type="button" class="roast-admin-tab-btn" data-tab="create-code" role="tab" aria-selected="false">+ Create Code</button>
        </div>
        <div class="order-admin-search-wrap">
          <input type="search" id="gift-admin-search-input" class="order-admin-search-input" placeholder="Search codes, names, emails, notes..." autocomplete="off">
        </div>
      </div>
    </div>

    <!-- Tab 1: Digital Gift Cards -->
    {% capture gift_card_filters %}
      <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
      <button type="button" class="order-admin-filter-pill" data-filter="active">Active (Has Balance)</button>
      <button type="button" class="order-admin-filter-pill" data-filter="redeemed">Redeemed ($0)</button>
      <button type="button" class="order-admin-filter-pill" data-filter="expired">Expired</button>
    {% endcapture %}

    {% include admin-workspace.html
      id="gift-panel-cards"
      active=true
      filters_id="gift-card-filters"
      filter_html=gift_card_filters
      queue_id="gift-cards-queue"
      inspector_id="gift-cards-inspector"
      empty_text="Select a gift card from the queue to view metadata, edit balance, or resend emails."
    %}

    <!-- Tab 2: Promo & Discount Codes -->
    {% capture promo_filters %}
      <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-filter="all">All</button>
      <button type="button" class="order-admin-filter-pill" data-filter="active">Active</button>
      <button type="button" class="order-admin-filter-pill" data-filter="scheduled">Scheduled</button>
      <button type="button" class="order-admin-filter-pill" data-filter="expired">Expired</button>
    {% endcapture %}

    {% include admin-workspace.html
      id="gift-panel-promos"
      active=false
      filters_id="gift-promo-filters"
      filter_html=promo_filters
      queue_id="gift-promos-queue"
      inspector_id="gift-promos-inspector"
      empty_text="Select a promo code from the queue to view details or adjust validity."
    %}

    <!-- Tab 3: Create New Code -->
    <div id="gift-panel-create" class="roast-admin-panel">
      <div class="roast-admin-card" style="max-width: 44rem; margin: 0 auto;">
        <div class="order-admin-controls-row" style="margin-bottom: 1.25rem;">
          <div id="gift-create-type-pills" class="order-admin-filters">
            <button type="button" class="order-admin-filter-pill order-admin-filter-pill--active" data-type="gift">Digital Gift Card</button>
            <button type="button" class="order-admin-filter-pill" data-type="promo">Storewide Promo Code</button>
          </div>
        </div>

        <!-- Form 1: New Digital Gift Card -->
        <form id="create-gift-form" class="order-form">
          <div class="order-field">
            <label for="create-gift-code" class="roast-mv-meta-label">Gift Card Code</label>
            <div style="display: flex; gap: 0.5rem;">
              <input id="create-gift-code" type="text" class="order-admin-input" placeholder="e.g. GIFT-ABC12345" required style="font-family: monospace; text-transform: uppercase;">
              <button type="button" id="create-gift-gen-btn" class="order-admin-btn-sm" style="white-space: nowrap;">Generate Code</button>
            </div>
          </div>

          <div class="order-field-row">
            <div class="order-field">
              <label for="create-gift-amount" class="roast-mv-meta-label">Amount ($)</label>
              <input id="create-gift-amount" type="number" step="0.01" min="1" class="order-admin-input" placeholder="e.g. 25.00" required>
            </div>
            <div class="order-field">
              <label for="create-gift-end-date" class="roast-mv-meta-label">Expiration Date (Optional)</label>
              <input id="create-gift-end-date" type="date" class="order-admin-input">
            </div>
          </div>

          <div class="order-field-row">
            <div class="order-field">
              <label for="create-gift-purchaser-name" class="roast-mv-meta-label">Purchaser Name (Optional)</label>
              <input id="create-gift-purchaser-name" type="text" class="order-admin-input" placeholder="e.g. Jane Doe">
            </div>
            <div class="order-field">
              <label for="create-gift-purchaser-email" class="roast-mv-meta-label">Purchaser Email (Optional)</label>
              <input id="create-gift-purchaser-email" type="email" class="order-admin-input" placeholder="e.g. jane@example.com">
            </div>
          </div>

          <div class="order-field-row">
            <div class="order-field">
              <label for="create-gift-recipient-name" class="roast-mv-meta-label">Recipient Name (Optional)</label>
              <input id="create-gift-recipient-name" type="text" class="order-admin-input" placeholder="e.g. Alex River">
            </div>
            <div class="order-field">
              <label for="create-gift-recipient-email" class="roast-mv-meta-label">Recipient Email (Optional)</label>
              <input id="create-gift-recipient-email" type="email" class="order-admin-input" placeholder="e.g. alex@example.com">
            </div>
          </div>

          <div class="order-field">
            <label for="create-gift-message" class="roast-mv-meta-label">Gift Message (Optional)</label>
            <textarea id="create-gift-message" class="order-admin-textarea" rows="2" placeholder="e.g. Enjoy some fresh coffee on us!"></textarea>
          </div>

          <div class="order-field">
            <label for="create-gift-notes" class="roast-mv-meta-label">Internal Description / Notes (Optional)</label>
            <input id="create-gift-notes" type="text" class="order-admin-input" placeholder="e.g. Customer support makeup credit">
          </div>

          <div class="order-field" style="margin: 1rem 0;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #2c1e14; cursor: pointer; margin-bottom: 0.4rem;">
              <input type="checkbox" id="create-gift-send-recipient">
              <span>Send announcement email to recipient immediately (if email provided)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #2c1e14; cursor: pointer;">
              <input type="checkbox" id="create-gift-send-purchaser">
              <span>Send confirmation receipt to purchaser immediately (if email provided)</span>
            </label>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1.25rem;">
            <button type="submit" id="create-gift-submit-btn" class="order-admin-save-btn">Create Gift Card</button>
            <span id="create-gift-status" class="order-status" style="margin: 0;"></span>
          </div>
        </form>

        <!-- Form 2: New Storewide Promo Code -->
        <form id="create-promo-form" class="order-form" style="display: none;">
          <div class="order-field">
            <label for="create-promo-code" class="roast-mv-meta-label">Promo Code</label>
            <input id="create-promo-code" type="text" class="order-admin-input" placeholder="e.g. FLOCK15" required style="font-family: monospace; text-transform: uppercase;">
          </div>

          <div class="order-field-row">
            <div class="order-field">
              <label for="create-promo-type" class="roast-mv-meta-label">Discount Type</label>
              <select id="create-promo-type" class="roast-admin-select">
                <option value="percent">Percentage Off (%)</option>
                <option value="flat">Flat Dollar Amount Off ($)</option>
              </select>
            </div>
            <div class="order-field">
              <label for="create-promo-value" class="roast-mv-meta-label">Value (e.g. 15 for 15% or $15)</label>
              <input id="create-promo-value" type="number" step="0.01" min="0.01" class="order-admin-input" placeholder="e.g. 15" required>
            </div>
          </div>

          <div class="order-field-row">
            <div class="order-field">
              <label for="create-promo-start-date" class="roast-mv-meta-label">Start Date (Optional)</label>
              <input id="create-promo-start-date" type="date" class="order-admin-input">
            </div>
            <div class="order-field">
              <label for="create-promo-end-date" class="roast-mv-meta-label">End Date (Optional)</label>
              <input id="create-promo-end-date" type="date" class="order-admin-input">
            </div>
          </div>

          <div class="order-field">
            <label for="create-promo-desc" class="roast-mv-meta-label">Description / Promotion Note</label>
            <input id="create-promo-desc" type="text" class="order-admin-input" placeholder="e.g. 15% off for Spring Newsletter subscribers">
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1.25rem;">
            <button type="submit" id="create-promo-submit-btn" class="order-admin-save-btn">Create Promo Code</button>
            <span id="create-promo-status" class="order-status" style="margin: 0;"></span>
          </div>
        </form>
      </div>
    </div>
{% include admin-shell-bottom.html %}

<script src="{{ '/js/admin-gift-codes.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminGiftCodes({
    apiUrl: {{ site.discount_codes_api_url | jsonify }},
    orderUrl: {{ '/order/' | relative_url | jsonify }}
  });
</script>
