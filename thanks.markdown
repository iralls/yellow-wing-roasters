---
layout: default
title: Thanks
permalink: /thanks/
sitemap: false
---

# Order received

Thanks for your order. We'll email you back shortly to confirm pricing, payment, and pickup or shipping.

<div id="gift-card-container" style="display: none; max-width: 480px; margin: 2.5rem auto; padding: 2rem; border: 2px dashed #d0c0b0; border-radius: 1rem; background-color: #faf8f5; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
  <div style="font-size: 1.5rem; font-weight: 700; color: #2c1e14; margin-bottom: 0.5rem;">Your Gift Card is Ready!</div>
  <p style="color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.4;">This code has been emailed to you and your recipient. They can redeem it on our checkout page to order coffee.</p>
  <div id="gift-card-code" style="font-family: monospace; font-size: 1.8rem; font-weight: bold; letter-spacing: 2px; color: #5746e3; padding: 0.75rem 1.5rem; border: 1px solid #e0d0c0; border-radius: 0.5rem; background-color: #fff; margin-bottom: 1.5rem; display: inline-block; word-break: break-all;">GIFT-XXXXXX</div>
  <div style="margin-bottom: 0.5rem;">
    <button id="copy-btn" style="background-color: #5746e3; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s; font-size: 0.95rem;">Copy Code</button>
  </div>
  <span id="copy-status" style="font-size: 0.85rem; color: #2e7d32; display: block; min-height: 1.25rem; font-weight: 500; margin-top: 0.5rem;"></span>
</div>

<script src="{{ '/js/thanks.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

