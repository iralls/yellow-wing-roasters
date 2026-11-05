---
layout: default
title: "Email Template Previewer"
permalink: /email-templates/
sitemap: false
---

<div class="roast-minimal-vertical">
  <div class="order-admin-header-compact roast-admin-header-compact">
    <h1 class="order-admin-page-title">Email Template Previewer</h1>
  </div>

  <p class="roast-mv-tasting" style="text-align: center; margin-bottom: 2rem;">
    Compare the updated minimalist email design system against the legacy boxed-card templates. Toggle themes, viewports, and templates live.
  </p>

  <!-- Controls Panel -->
  <div style="max-width: 44rem; margin: 0 auto 2.5rem; padding: 0 1rem; text-align: center;">

    <!-- Template Selection Tabs -->
    <div style="margin-bottom: 1.5rem;">
      <div style="font-family: Montserrat, sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin-bottom: 0.5rem;">
        Select Template
      </div>
      <div class="roast-purchase-toggle" role="tablist" aria-label="Email Templates" style="display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center;">
        <button type="button" role="tab" aria-selected="true" class="roast-purchase-toggle-btn ep-template-tab is-active" data-template="order_confirmation" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Order Confirmation
        </button>
        <button type="button" role="tab" aria-selected="false" class="roast-purchase-toggle-btn ep-template-tab" data-template="order_status" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Status Update
        </button>
        <button type="button" role="tab" aria-selected="false" class="roast-purchase-toggle-btn ep-template-tab" data-template="order_cancel" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Cancellation
        </button>
        <button type="button" role="tab" aria-selected="false" class="roast-purchase-toggle-btn ep-template-tab" data-template="order_magic_link" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Magic Link
        </button>
        <button type="button" role="tab" aria-selected="false" class="roast-purchase-toggle-btn ep-template-tab" data-template="gift_recipient" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Gift Card
        </button>
        <button type="button" role="tab" aria-selected="false" class="roast-purchase-toggle-btn ep-template-tab" data-template="subscription" style="padding: 0.5rem 0.85rem; font-size: 0.74rem;">
          Subscription
        </button>
      </div>
    </div>

    <!-- Theme Mode & Viewport Switchers -->
    <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; justify-content: center; align-items: center; margin-bottom: 1.5rem;">
      <!-- Theme Switcher -->
      <div>
        <div style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin-bottom: 0.35rem;">
          Theme Mode
        </div>
        <div class="roast-purchase-toggle" role="radiogroup" aria-label="Theme Mode" style="display: inline-flex; gap: 0.35rem;">
          <button type="button" role="radio" aria-checked="true" class="roast-purchase-toggle-btn ep-theme-btn is-active" data-theme="updated" style="padding: 0.4rem 0.8rem; font-size: 0.72rem;">
            ✨ Updated (Minimalist)
          </button>
          <button type="button" role="radio" aria-checked="false" class="roast-purchase-toggle-btn ep-theme-btn" data-theme="legacy" style="padding: 0.4rem 0.8rem; font-size: 0.72rem;">
            ⏳ Legacy (Old Boxed)
          </button>
          <button type="button" role="radio" aria-checked="false" class="roast-purchase-toggle-btn ep-theme-btn" data-theme="compare" style="padding: 0.4rem 0.8rem; font-size: 0.72rem;">
            ⚖️ Side-by-Side
          </button>
        </div>
      </div>

      <!-- Viewport Switcher -->
      <div>
        <div style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin-bottom: 0.35rem;">
          Viewport
        </div>
        <div class="roast-purchase-toggle" role="radiogroup" aria-label="Viewport Size" style="display: inline-flex; gap: 0.35rem;">
          <button type="button" role="radio" aria-checked="true" class="roast-purchase-toggle-btn ep-viewport-btn is-active" data-viewport="desktop" style="padding: 0.4rem 0.75rem; font-size: 0.72rem;">
            Desktop (560px)
          </button>
          <button type="button" role="radio" aria-checked="false" class="roast-purchase-toggle-btn ep-viewport-btn" data-viewport="mobile" style="padding: 0.4rem 0.75rem; font-size: 0.72rem;">
            Mobile (375px)
          </button>
        </div>
      </div>
    </div>

    <!-- Status Selector (Shown for Status Update template) -->
    <div id="ep-status-control-row" style="display: none; justify-content: center; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
      <label for="ep-status-select" style="font-family: Montserrat, sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e;">
        Simulate Status:
      </label>
      <select id="ep-status-select" class="subscribe-select" style="width: auto; min-width: 14rem; padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <option value="roasted" selected>Roasted</option>
        <option value="ready for pickup">Ready for Pickup</option>
        <option value="ready to deliver">Out for Delivery</option>
        <option value="delayed">Delayed</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>

    <!-- Action Buttons -->
    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; align-items: center; margin-bottom: 0.5rem;">
      <button type="button" id="ep-copy-gmail-btn" class="sleek-buy-add-btn" style="width: auto; margin-top: 0; padding: 0.55rem 1.25rem; font-size: 0.75rem;">
        Copy for Gmail (Rich HTML)
      </button>
      <button type="button" id="ep-copy-html-btn" class="sleek-buy-add-btn" style="width: auto; margin-top: 0; padding: 0.55rem 1.1rem; font-size: 0.75rem; background: transparent; color: #2c1e14; border: 1px solid rgba(44, 30, 20, 0.25);">
        Copy Raw HTML
      </button>
    </div>
    <p id="ep-copy-status" role="status" aria-live="polite" style="margin: 0.5rem 0 0; min-height: 1.25rem; font-family: Montserrat, sans-serif; font-size: 0.75rem; font-weight: 600; color: #2e7d32;"></p>
  </div>

  <!-- Live Stage Canvas -->
  <div id="ep-preview-stage" style="width: 100%; max-width: 1140px; margin: 0 auto 4rem; padding: 0 1rem; box-sizing: border-box;"></div>

</div>

<script src="{{ '/js/email-templates.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initEmailTemplatePreviewer({
    siteUrl: {{ site.url | jsonify }},
    roasterEmail: {{ site.email | jsonify }}
  });
</script>
