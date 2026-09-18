---
layout: default
title: Order
permalink: /order/
---


# Order

<div id="order-cart-empty" class="order-empty" style="display:none;">
  <p>Your cart is empty.</p>
</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSezZ8Cg4gcc1E-t72_pv4yt1s3ooXSMaP47R7iTD31mQE7zng/formResponse" method="POST" class="order-form" id="order-form" style="display:none;">
  <input type="hidden" name="entry.1935997805" id="order-items-hidden" value="">
  <input type="hidden" name="entry.552044967" id="order-total-hidden" value="">

  <div class="order-cart-items" id="order-cart-items"></div>

  <div class="order-field">
    <label for="order-name">Name</label>
    <input id="order-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="order-email">Email</label>
    <input id="order-email" type="email" name="entry.40149380" autocomplete="email">
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
    <label class="order-radio order-radio--disabled"><input type="radio" name="entry.1896226742" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p class="order-delivery-note">Shipping coming soon.</p>
    <p id="order-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
  </fieldset>

  <div id="order-address-fields" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="order-address">Street address</label>
      <input id="order-address" type="text" name="entry.148046999" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="order-city">City</label>
      <input id="order-city" type="text" name="entry.1534670804" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="order-state">State</label>
        <input id="order-state" type="text" name="entry.414179858" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="order-zip">ZIP</label>
        <input id="order-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field" id="discount-code-section" style="margin-bottom: 1.5rem;">
    <label for="discount-code-input">Discount / Gift Code</label>
    <div style="display: flex; gap: 0.5rem; width: 100%;">
      <input id="discount-code-input" type="text" placeholder="Enter code" style="flex: 1; margin-bottom: 0;" autocomplete="off">
      <button id="apply-discount-btn" type="button" class="order-submit" style="margin: 0; width: auto; padding: 0 1.5rem; min-height: unset; height: 38px; border-radius: 4px; font-size: 0.9rem;">Apply</button>
    </div>
    <span id="discount-status" style="font-size: 0.85rem; font-weight: 500; display: block; margin-top: 0.35rem; min-height: 1.2rem;"></span>
  </div>

  <div class="order-field">
    <label for="order-notes">Notes (optional)</label>
    <textarea id="order-notes" name="entry.1381358427" rows="3"></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Place order</button>
    <button type="button" class="order-clear">Clear cart</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

{% assign flight_aviary_doc = site.flights | where: "slug", "the-aviary" | first %}
{% assign flight_pyo_doc = site.flights | where: "slug", "peck-your-own" | first %}
{% assign flight_aviary = flight_aviary_doc.price | default: 38 %}
{% assign flight_pyo = flight_pyo_doc.price_per_bag | default: 10 %}

<script src="{{ '/js/order-checkout.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  (function () {
    initOrderCheckout({
      flightAviaryPrice: {{ flight_aviary }},
      flightPyoPrice: {{ flight_pyo }},
      discountApiUrl: {{ site.discount_codes_api_url | jsonify }},
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
    });
  })();
</script>
