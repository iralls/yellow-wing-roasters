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
intro: "Thanks for your order! We'll email you back shortly to confirm your batch, payment details, and pickup or delivery schedule."
---

<!-- Gift Card Ready Card (Displayed dynamically if ?code= is present in URL) -->
<div id="gift-card-container" style="display: none; padding: 1.5rem; background: var(--hst-card-bg); border: 1px solid var(--hst-border); border-radius: 4px; margin-bottom: 2rem;">
  <div style="font-family: 'Figtree', var(--font-sans, sans-serif); font-size: 1.25rem; font-weight: 600; color: var(--hst-text); margin-bottom: 0.5rem;">Your Gift Card is Ready!</div>
  <p style="color: var(--hst-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">This code has been emailed to you and your recipient. It can be redeemed directly at checkout for any coffee or subscription.</p>
  <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
    <div id="gift-card-code" style="font-family: monospace; font-size: 1.35rem; font-weight: 700; letter-spacing: 0.08em; color: var(--menu-sale); padding: 0.65rem 1.25rem; border: 1px solid var(--hst-border); border-radius: 2px; background-color: #ffffff; word-break: break-all;">GIFT-XXXXXX</div>
    <button id="copy-btn" type="button" class="action-pill-btn btn-primary-pill" style="cursor: pointer;">Copy Code</button>
  </div>
  <span id="copy-status" style="font-size: 0.85rem; color: #1e824c; display: block; min-height: 1.25rem; font-weight: 500; margin-top: 0.5rem;"></span>
</div>

<div style="display: flex; gap: 0.85rem; flex-wrap: wrap; margin-bottom: 2rem;">
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
