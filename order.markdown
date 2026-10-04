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

<form action="https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse" method="POST" class="order-form order-form--checkout" id="order-form" style="display:none;">
  <!-- Shared & Order-specific hidden inputs -->
  <input type="hidden" name="entry.1935997805" id="order-items-hidden" value="">
  <input type="hidden" name="entry.552044967" id="order-total-hidden" value="">

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
        <input id="order-name" type="text" name="entry.1153405702" required autocomplete="name">
      </div>

      <div class="order-field">
        <label for="order-email" class="roast-mv-meta-label">Email</label>
        <input id="order-email" type="email" name="entry.40149380" required autocomplete="email">
      </div>

      <div class="order-field">
        <label for="order-phone" class="roast-mv-meta-label">Phone number (optional)</label>
        <input id="order-phone" type="tel" name="entry.1852073865" autocomplete="tel" placeholder="123-456-7890" maxlength="12" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Please enter a 10-digit phone number (e.g. 123-456-7890)">
      </div>

      <fieldset class="order-delivery">
        <legend>Delivery method</legend>
        <div class="pill-radios">
          <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
          <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
        </div>
        <p id="order-delivery-note" class="order-delivery-note">Please specify in the notes how you want to coordinate pickup.</p>
      </fieldset>

      <div id="order-address-fields" class="order-shipping" style="display:none;">
        <div class="order-field">
          <label for="order-address" class="roast-mv-meta-label">Street address</label>
          <input id="order-address" type="text" name="entry.148046999" autocomplete="street-address">
        </div>
        <div class="order-field">
          <label for="order-city" class="roast-mv-meta-label">City</label>
          <input id="order-city" type="text" name="entry.1534670804" autocomplete="address-level2">
        </div>
        <div class="order-field-row">
          <div class="order-field">
            <label for="order-state" class="roast-mv-meta-label">State</label>
            <select id="order-state" name="entry.414179858" autocomplete="address-level1">
              {% include state-options.html %}
            </select>
          </div>
          <div class="order-field">
            <label for="order-zip" class="roast-mv-meta-label">ZIP</label>
            <input id="order-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
          </div>
        </div>
      </div>

      <div class="order-field">
        <label for="order-notes" class="roast-mv-meta-label">Notes (optional)</label>
        <textarea id="order-notes" name="entry.1381358427" rows="3"></textarea>
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
        <div class="order-field order-summary-discount" id="discount-code-section" style="display: none; margin-top: 1rem; margin-bottom: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color, #e5e5e5);">
          <label for="discount-code-input" class="roast-mv-meta-label" style="margin-bottom: 0.35rem;">Discount code or Gift card</label>
          <div style="display: flex; gap: 0.5rem; width: 100%;">
            <input id="discount-code-input" type="text" placeholder="Promo or GIFT-..." style="flex: 1; margin-bottom: 0; height: 38px; font-size: 0.85rem; text-transform: uppercase;" autocomplete="off">
            <button id="apply-discount-btn" type="button" class="order-submit" style="margin: 0; width: auto; padding: 0 1.25rem; min-height: unset; height: 38px; border-radius: 999px; font-size: 0.8rem;">Apply</button>
          </div>
          <span id="discount-status" style="font-size: 0.8rem; font-weight: 500; display: block; margin-top: 0.25rem; min-height: 1.1rem; text-align: center;"></span>
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
