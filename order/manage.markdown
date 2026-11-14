---
layout: menu-item
title: Manage Order
subtitle: Customer Services
category: order
no_order: true
mascot_file: delivery-box-transparent.png
mascot_alt: "Delivery Box"
permalink: /order/manage/
intro: "Look up your order, track roasting and delivery progress, or cancel prior to roasting using your secure magic link."
---

<!-- Phase 1: Unauthenticated Lookup Form (Magic Link Request) -->
<div id="order-mock-preview-banner" class="order-preview-helper" style="display: none;">
  <span><strong>Mock Mode Active:</strong> Previewing order lifecycle stages?</span>
  <a href="{{ '/order/preview/' | relative_url }}" class="order-preview-link-btn">Open Status Previewer &rarr;</a>
</div>

<div id="order-lookup-section">
  <form id="order-lookup-form" class="hst-form" style="padding-top: 0; border-top: none;">
    <div>
      <label for="order-lookup-email" class="hst-label">Email Address</label>
      <input id="order-lookup-email" type="email" class="hst-input" required placeholder="Enter the email address used for your order..." autocomplete="email">
    </div>
    <div>
      <label for="order-lookup-id" class="hst-label">Order ID</label>
      <input id="order-lookup-id" type="text" class="hst-input" required placeholder="e.g. 1001" autocomplete="off">
    </div>
    <button type="submit" id="order-lookup-btn" class="hst-btn">Email Me My Secure Link</button>
    <p id="order-lookup-status" role="status" aria-live="polite" class="order-status"></p>
  </form>
</div>

<!-- Phase 2: Authenticated Order Display & Actions -->
<div id="order-results-section" style="display: none; margin-top: 1rem;">
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; border-bottom: 1px solid var(--hst-border); padding-bottom: 0.5rem;">
    <h2 style="font-family: 'Figtree', var(--font-sans, sans-serif); font-size: 1.15rem; font-weight: 600; margin: 0; color: var(--hst-text);">Order Details <span id="order-mock-indicator" class="mock-badge" style="display: none;">MOCK MODE</span></h2>
    <span id="order-results-id-display" style="font-size: 0.85rem; color: var(--hst-muted); font-weight: 600;"></span>
  </div>
  
  <div id="order-content"></div>

  <div style="margin-top: 1.5rem; border-top: 1px solid var(--hst-border); padding-top: 1.25rem; text-align: center;">
    <a href="{{ '/order/manage/' | relative_url }}" id="order-back-search-btn" class="action-pill-btn btn-secondary-pill" style="display: inline-block; text-decoration: none;">Look Up Different Order</a>
  </div>
</div>

<div class="hst-drawers" style="margin-top: 2rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Order Lifecycle &amp; Roasting</button>
    <div class="hst-drawer-body">
      <strong>Roasting Cycles:</strong> All coffee is roasted to order in small batches. Once roasted and degassed, orders are prepared for pickup or dispatch.<br>
      <strong>Order Cancellations:</strong> Need to change plans? You can cancel your order directly from this portal anytime before roasting begins.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Magic Links &amp; Privacy</button>
    <div class="hst-drawer-body">
      We utilize passwordless magic links delivered directly to your email address to access your order details and delivery status.
    </div>
  </div>
</div>

<script src="{{ '/js/cart-data.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ '/js/manage-orders.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initManageOrders({
    apiUrl: {{ site.order_api_url | jsonify }},
    catalogUrl: {{ '/shop-menu/' | relative_url | jsonify }},
    roastsData: window.YWR_ROASTS_DATA,
    bagSizes: window.YWR_BAG_SIZES,
    defaultGrind: window.YWR_DEFAULT_GRIND
  });
</script>
