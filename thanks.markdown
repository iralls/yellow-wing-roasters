---
layout: menu-item
title: Order Received
slug: thanks
descriptor: Confirmation
mascot_file: thank-you-transparent.png
mascot_alt: "Thank You"
permalink: /thanks/
sitemap: false
no_order: true
back_url: /shop/
back_label: Back to Shop
custom_css: thanks.css
intro: "Thanks for your order! We'll email you back shortly to confirm your batch, payment details, and pickup or delivery schedule."
---

<!-- Gift Card Ready Card (Displayed dynamically if ?code= is present in URL) -->
<div id="gift-card-container" class="gift-ready-card">
  <div class="gift-ready-title">Your Gift Card is Ready!</div>
  <p class="gift-ready-desc">This code has been emailed to you and your recipient. It can be redeemed directly at checkout for any coffee or subscription.</p>
  <div class="gift-ready-code-row">
    <div id="gift-card-code" class="gift-ready-code">GIFT-XXXXXX</div>
    <button id="copy-btn" type="button" class="action-pill-btn btn-primary-pill gift-ready-copy-btn">Copy Code</button>
  </div>
  <span id="copy-status" class="gift-ready-status"></span>
</div>

<div class="hst-actions-row hst-actions-row--mb">
  <a href="{{ '/shop/' | relative_url }}" class="action-pill-btn btn-primary-pill">Browse Coffees</a>
  <a href="{{ '/order/manage/' | relative_url }}" class="action-pill-btn btn-secondary-pill">Manage Order</a>
</div>

<div class="hst-drawers">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">What Happens Next?</button>
    <div class="hst-drawer-body">
      <strong>Roasting Schedule:</strong> All coffees are roasted fresh to order in small batches. Once your beans are roasted and degassed, we'll notify you right away.<br>
      <strong>Payment &amp; Coordination:</strong> We'll reach out directly to confirm your order total and coordinate pickup or local hand delivery.<br>
      <strong>Self-Service:</strong> You can check on your order status or request changes anytime through our <a href="{{ '/order/manage/' | relative_url }}">Order Management</a> portal.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Questions or Changes?</button>
    <div class="hst-drawer-body">
      Need to update an address, add notes, or adjust a grind setting before roasting begins? Send a quick note to <a href="mailto:chirp@yellowwingroasters.com">chirp@yellowwingroasters.com</a> with your name.
    </div>
  </div>
</div>

<script src="{{ '/js/thanks.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
