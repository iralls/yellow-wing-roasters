---
layout: default
title: Cart
permalink: /cart/
---

<link rel="stylesheet" href="{{ '/css/menu-theme.css' | relative_url }}?v={{ site.time | date: '%s' }}">

<div class="hst-wrap cart-page-wrap">
  <a href="{{ '/shop/' | relative_url }}" class="hst-back-link">&larr; Back to Shop</a>

  <div class="cart-header-section" style="margin-bottom: 2.5rem;">
    <div class="hst-cat">Checkout &amp; Delivery</div>
    <h1 class="hst-title" id="order-page-title">Cart</h1>
  </div>

  <!-- Empty Cart State -->
  <div id="order-cart-empty" class="order-empty" style="display:none; text-align: center; padding: 3rem 1rem;">
    <div style="max-width: 14rem; margin: 0 auto 1.5rem;">
      <img src="{{ '/images/empty-nest-transparent.png' | relative_url }}" alt="Empty Nest" class="hst-mascot-img" style="max-height: 12rem;">
    </div>
    <h2 style="font-family: 'Figtree', var(--font-sans, sans-serif); font-size: 1.5rem; font-weight: 600; color: var(--hst-text); margin-bottom: 0.5rem;">Your nest is empty.</h2>
    <p style="color: var(--hst-muted); font-size: 1rem; margin-bottom: 2rem;">Discover our small-batch coffees, custom roasts, and subscription offerings.</p>
    <div style="display: flex; gap: 0.75rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;">
      <a href="{{ '/shop/' | relative_url }}" class="action-pill-btn btn-primary-pill">Browse Coffees</a>
      <a href="{{ '/order/manage/' | relative_url }}" class="action-pill-btn btn-secondary-pill">Manage Order</a>
    </div>
  </div>

  <!-- Active Order Form & Summary Grid -->
  <form action="{{ site.google_forms.order.url }}" data-sub-action="{{ site.google_forms.subscription.url }}" method="POST" class="order-form order-form--checkout" id="order-form" style="display:none;">
    <!-- Shared & Order-specific hidden inputs -->
    <input type="hidden" name="{{ site.google_forms.order.entries.items }}" id="order-items-hidden" value="">
    <input type="hidden" name="{{ site.google_forms.order.entries.total }}" id="order-total-hidden" value="">

    <!-- Subscription-specific hidden inputs (activated in Subscription mode) -->
    <input type="hidden" id="sub-price-hidden" value="">
    <input type="hidden" id="sub-status-hidden" value="Active">
    <input type="hidden" id="sub-status-details-hidden" value="">
    <input type="hidden" id="sub-size-hidden" value="">
    <input type="hidden" id="sub-freq-hidden" value="">

    <div class="order-checkout-grid">
      <!-- Left Column: Form Fields -->
      <div class="order-checkout-main">
        <div class="hst-form" style="padding-top: 0; border-top: none;">
          <div>
            <label for="order-name" class="hst-label">Full Name</label>
            <input id="order-name" type="text" class="hst-input" name="{{ site.google_forms.order.entries.name }}" required autocomplete="name" placeholder="Your name">
          </div>

          <div>
            <label for="order-email" class="hst-label">Email Address</label>
            <input id="order-email" type="email" class="hst-input" name="{{ site.google_forms.order.entries.email }}" required autocomplete="email" placeholder="you@example.com">
          </div>

          <div>
            <label for="order-phone" class="hst-label">Phone Number (optional)</label>
            <input id="order-phone" type="tel" class="hst-input" name="{{ site.google_forms.order.entries.phone }}" autocomplete="tel" placeholder="123-456-7890" maxlength="12" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Please enter a 10-digit phone number (e.g. 123-456-7890)">
          </div>

          <fieldset class="order-delivery" style="border: none; padding: 0; margin: 0.5rem 0 0;">
            <legend class="hst-label" style="margin-bottom: 0.65rem;">Delivery Method</legend>
            <div class="pill-radios" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <label class="order-radio-label">
                <input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Pickup" checked>
                <span>Pickup</span>
              </label>
              <label class="order-radio-label">
                <input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Hand delivery">
                <span>Hand delivery</span>
              </label>
            </div>
            <p id="order-delivery-note" class="order-delivery-note" data-pickup-msg="Please specify in the notes how you want to coordinate pickup." data-delivery-msg="Available in {{ site.local_delivery_towns | join: ', ' }}." style="font-size: 0.88rem; color: var(--hst-muted); margin-top: 0.65rem;">Please specify in the notes how you want to coordinate pickup.</p>
          </fieldset>

          <div id="order-address-fields" class="order-shipping" style="display:none; flex-direction: column; gap: 1rem; margin-top: 0.5rem;">
            <div>
              <label for="order-address" class="hst-label">Street Address</label>
              <input id="order-address" type="text" class="hst-input" name="{{ site.google_forms.order.entries.address }}" autocomplete="street-address" placeholder="123 Main St">
            </div>
            <div>
              <label for="order-city" class="hst-label">City</label>
              <input id="order-city" type="text" class="hst-input" name="{{ site.google_forms.order.entries.city }}" autocomplete="address-level2" placeholder="Guilford">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label for="order-state" class="hst-label">State</label>
                <select id="order-state" class="hst-select" name="{{ site.google_forms.order.entries.state }}" autocomplete="address-level1">
                  {% include state-options.html %}
                </select>
              </div>
              <div>
                <label for="order-zip" class="hst-label">ZIP Code</label>
                <input id="order-zip" type="text" class="hst-input" name="{{ site.google_forms.order.entries.zip }}" autocomplete="postal-code" placeholder="06437">
              </div>
            </div>
          </div>

          <div>
            <label for="order-notes" class="hst-label">Notes (optional)</label>
            <textarea id="order-notes" class="hst-textarea" name="{{ site.google_forms.order.entries.notes }}" rows="3" placeholder="Special delivery instructions, pickup preferences, or notes..."></textarea>
          </div>

          <div class="order-actions" style="margin-top: 1rem;">
            <button type="submit" class="hst-btn" id="order-submit-btn" style="width: 100%;">Place Order</button>
          </div>

          <p class="order-status" role="status" aria-live="polite" style="font-size: 0.88rem; margin-top: 0.75rem; text-align: center;"></p>
        </div>
      </div>

      <!-- Right Column: Order Summary Sidebar -->
      <div class="order-checkout-sidebar">
        <div class="order-summary-card">
          <div class="order-summary-header">
            <h2 class="order-summary-title" id="order-summary-title">Order Summary</h2>
            <span class="order-summary-count" id="order-summary-count"></span>
          </div>
          
          <div class="order-cart-items" id="order-cart-items"></div>

          <!-- Discount / Gift Code Section -->
          <div class="order-field order-summary-discount" id="discount-code-section" style="display: none; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--hst-border);">
            <label for="discount-code-input" class="hst-label" style="margin-bottom: 0.5rem;">Discount Code or Gift Card</label>
            <div class="discount-input-row" style="display: flex; gap: 0.5rem;">
              <input id="discount-code-input" type="text" class="hst-input discount-code-input" placeholder="Promo or GIFT-..." autocomplete="off" style="text-transform: uppercase;">
              <button id="apply-discount-btn" type="button" class="action-pill-btn btn-primary-pill discount-apply-btn" style="white-space: nowrap;">Apply</button>
            </div>
            <span id="discount-status" class="discount-status" style="display: block; font-size: 0.85rem; margin-top: 0.5rem;"></span>
          </div>

          <!-- Totals dynamically rendered by order-checkout.js -->
          <div id="order-summary-totals"></div>
        </div>
      </div>
    </div>
  </form>
</div>

<script src="{{ '/js/cart-data.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ '/js/order-checkout.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  (function () {
    initOrderCheckout({
      discountApiUrl: {{ site.discount_codes_api_url | jsonify }},
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
    });
  })();
</script>
