---
layout: default
title: Order
permalink: /order/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title" id="order-page-title">Order</h1>
</div>

<div class="roast-mv-divider"></div>

<div id="order-cart-empty" class="order-empty" style="display:none;">
  <p>Your cart is empty.</p>
  <a href="{{ '/roasts/' | relative_url }}" class="order-browse-link">Browse coffees &rarr;</a>
</div>

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
    <div class="order-checkout-main">
      <div class="order-field">
        <label for="order-name" class="roast-mv-meta-label">Name</label>
        <input id="order-name" type="text" name="{{ site.google_forms.order.entries.name }}" required autocomplete="name">
      </div>

      <div class="order-field">
        <label for="order-email" class="roast-mv-meta-label">Email</label>
        <input id="order-email" type="email" name="{{ site.google_forms.order.entries.email }}" required autocomplete="email">
      </div>

      <div class="order-field">
        <label for="order-phone" class="roast-mv-meta-label">Phone number (optional)</label>
        <input id="order-phone" type="tel" name="{{ site.google_forms.order.entries.phone }}" autocomplete="tel" placeholder="123-456-7890" maxlength="12" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Please enter a 10-digit phone number (e.g. 123-456-7890)">
      </div>

      <fieldset class="order-delivery">
        <legend>Delivery method</legend>
        <div class="pill-radios">
          <label class="order-radio"><input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Pickup" checked> Pickup</label>
          <label class="order-radio"><input type="radio" name="{{ site.google_forms.order.entries.delivery }}" value="Hand delivery"> Hand delivery</label>
        </div>
        <p id="order-delivery-note" class="order-delivery-note" data-pickup-msg="Please specify in the notes how you want to coordinate pickup." data-delivery-msg="Available in {{ site.local_delivery_towns | join: ', ' }}.">Please specify in the notes how you want to coordinate pickup.</p>
      </fieldset>

      <div id="order-address-fields" class="order-shipping" style="display:none;">
        <div class="order-field">
          <label for="order-address" class="roast-mv-meta-label">Street address</label>
          <input id="order-address" type="text" name="{{ site.google_forms.order.entries.address }}" autocomplete="street-address">
        </div>
        <div class="order-field">
          <label for="order-city" class="roast-mv-meta-label">City</label>
          <input id="order-city" type="text" name="{{ site.google_forms.order.entries.city }}" autocomplete="address-level2">
        </div>
        <div class="order-field-row">
          <div class="order-field">
            <label for="order-state" class="roast-mv-meta-label">State</label>
            <select id="order-state" name="{{ site.google_forms.order.entries.state }}" autocomplete="address-level1">
              {% include state-options.html %}
            </select>
          </div>
          <div class="order-field">
            <label for="order-zip" class="roast-mv-meta-label">ZIP</label>
            <input id="order-zip" type="text" name="{{ site.google_forms.order.entries.zip }}" autocomplete="postal-code">
          </div>
        </div>
      </div>

      <div class="order-field">
        <label for="order-notes" class="roast-mv-meta-label">Notes (optional)</label>
        <textarea id="order-notes" name="{{ site.google_forms.order.entries.notes }}" rows="3"></textarea>
      </div>

      <div class="order-actions">
        <button type="submit" class="order-submit" id="order-submit-btn">Place order</button>
      </div>

      <p class="order-status" role="status" aria-live="polite"></p>
    </div>

    <div class="order-checkout-sidebar">
      <div class="order-summary-card">
        <div class="order-summary-header">
          <h2 class="order-summary-title" id="order-summary-title">Order Summary</h2>
          <span class="order-summary-count" id="order-summary-count"></span>
        </div>
        <div class="order-cart-items" id="order-cart-items"></div>

        <!-- Discount / Gift Code (Located at bottom of Order Summary sidebar, above totals; hidden in Subscription mode) -->
        <div class="order-field order-summary-discount" id="discount-code-section" style="display: none;">
          <label for="discount-code-input" class="roast-mv-meta-label">Discount code or Gift card</label>
          <div class="discount-input-row">
            <input id="discount-code-input" type="text" class="discount-code-input" placeholder="Promo or GIFT-..." autocomplete="off">
            <button id="apply-discount-btn" type="button" class="order-submit discount-apply-btn">Apply</button>
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

<script src="{{ '/js/order-checkout.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  (function () {
    initOrderCheckout({
      discountApiUrl: {{ site.discount_codes_api_url | jsonify }},
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
    });
  })();
</script>
