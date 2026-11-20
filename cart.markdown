---
layout: default
title: Cart
permalink: /cart/
custom_css: cart.css
---

<div class="hst-wrap cart-page-wrap">
  <div class="cart-header-section">
    <div class="hst-cat">Checkout &amp; Delivery</div>
    <h1 class="hst-title" id="order-page-title">Cart</h1>
  </div>

  <!-- Empty Cart State -->
  <div id="order-cart-empty" class="order-empty">
    <div class="order-empty-media">
      <img src="{{ '/images/empty-nest-transparent.png' | relative_url }}" alt="Empty Nest" class="hst-mascot-img">
    </div>
    <h2 class="order-empty-title">Your nest is empty.</h2>
    <p class="order-empty-desc">Discover our small-batch coffees, custom roasts, and subscription offerings.</p>
    <div class="order-empty-actions">
      <a href="{{ '/shop/' | relative_url }}" class="action-pill-btn btn-primary-pill">Browse Coffees</a>
      <a href="{{ '/order/manage/' | relative_url }}" class="action-pill-btn btn-secondary-pill">Manage Order</a>
    </div>
  </div>

  <!-- Active Order Form & Summary Grid -->
  <form action="{{ site.google_forms.order.url }}" data-sub-action="{{ site.google_forms.subscription.url }}" method="POST" class="order-form order-form--checkout" id="order-form">
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
        <div class="hst-form hst-form--flush">
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

          <fieldset class="order-delivery">
            <legend class="hst-label">Delivery Method</legend>
            <div class="pill-radios">
              <label class="order-radio-label">
                <input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Pickup" checked>
                <span>Pickup</span>
              </label>
              <label class="order-radio-label">
                <input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Hand delivery">
                <span>Hand delivery</span>
              </label>
            </div>
            <p id="order-delivery-note" class="order-delivery-note" data-pickup-msg="Please specify in the notes how you want to coordinate pickup." data-delivery-msg="Available in {{ site.local_delivery_towns | join: ', ' }}.">Please specify in the notes how you want to coordinate pickup.</p>
          </fieldset>

          <div id="order-address-fields" class="order-shipping">
            <div>
              <label for="order-address" class="hst-label">Street Address</label>
              <input id="order-address" type="text" class="hst-input" name="{{ site.google_forms.order.entries.address }}" autocomplete="street-address" placeholder="123 Main St">
            </div>
            <div>
              <label for="order-city" class="hst-label">City</label>
              <input id="order-city" type="text" class="hst-input" name="{{ site.google_forms.order.entries.city }}" autocomplete="address-level2" placeholder="Guilford">
            </div>
            <div class="hst-grid-2col">
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

          <div class="order-actions">
            <button type="submit" class="hst-btn" id="order-submit-btn">Place Order</button>
          </div>

          <p class="order-status" role="status" aria-live="polite"></p>
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
          <div class="order-field order-summary-discount" id="discount-code-section">
            <label for="discount-code-input" class="hst-label">Discount Code or Gift Card</label>
            <div class="discount-input-row">
              <input id="discount-code-input" type="text" class="hst-input discount-code-input" placeholder="Promo or GIFT-..." autocomplete="off">
              <button id="apply-discount-btn" type="button" class="action-pill-btn btn-primary-pill discount-apply-btn">Apply</button>
            </div>
            <span id="discount-status" class="discount-status"></span>
          </div>

          <!-- Totals dynamically rendered by order-checkout.js -->
          <div id="order-summary-totals"></div>
        </div>
      </div>
    </div>
  </form>
</div>

<script src="{{ '/js/cart-data.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script src="{{ '/js/order-checkout.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    initOrderCheckout({
      discountApiUrl: {{ site.discount_codes_api_url | jsonify }},
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }},
      orderEntries: {{ site.google_forms.order.entries | jsonify }},
      subscriptionEntries: {{ site.google_forms.subscription.entries | jsonify }},
      digitalGiftUrl: {{ site.google_forms.digital_gift.url | jsonify }},
      digitalGiftEntries: {{ site.google_forms.digital_gift.entries | jsonify }}
    });
  });
</script>
