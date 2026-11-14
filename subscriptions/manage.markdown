---
layout: menu-item
title: Manage Subscription
subtitle: Member Portal
category: subscription
no_order: true
mascot_file: cuckoo-transparent.png
mascot_alt: "Subscription Portal Cuckoo"
permalink: /subscriptions/manage/
intro: "Check your recurring delivery schedule, or pause, resume, or cancel your active coffee subscription anytime using your secure magic link."
---

<!-- Phase 1: Unauthenticated Lookup Form (Magic Link Request) -->
<div id="sub-lookup-section">
  <form id="sub-lookup-form" class="hst-form" style="padding-top: 0; border-top: none;">
    <div>
      <label for="sub-lookup-email" class="hst-label">Email Address</label>
      <input id="sub-lookup-email" type="email" class="hst-input" required placeholder="Enter the email address you subscribed with..." autocomplete="email">
    </div>
    <div>
      <label for="sub-lookup-id" class="hst-label">Subscription / Order ID (Optional)</label>
      <input id="sub-lookup-id" type="text" class="hst-input" placeholder="e.g. 1001" autocomplete="off">
    </div>
    <button type="submit" id="sub-lookup-btn" class="hst-btn">Email Me My Secure Link</button>
    <p id="sub-lookup-status" role="status" aria-live="polite" style="font-size: 0.88rem; margin: 0.5rem 0 0; color: var(--hst-muted);"></p>
  </form>
</div>

<!-- Phase 2: Authenticated Subscription Display & Actions -->
<div id="sub-results-section" style="display: none; margin-top: 1rem;">
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; border-bottom: 1px solid var(--hst-border); padding-bottom: 0.5rem;">
    <h2 style="font-family: 'Figtree', var(--font-sans, sans-serif); font-size: 1.15rem; font-weight: 600; margin: 0; color: var(--hst-text);">Subscription Details</h2>
    <span id="sub-results-id-display" style="font-size: 0.85rem; color: var(--hst-muted); font-weight: 600;"></span>
  </div>
  
  <div id="subscription-content"></div>

  <div style="margin-top: 1.5rem; border-top: 1px solid var(--hst-border); padding-top: 1.25rem; text-align: center;">
    <a href="{{ '/subscriptions/manage/' | relative_url }}" id="sub-back-search-btn" class="action-pill-btn btn-secondary-pill" style="display: inline-block; text-decoration: none;">Look Up Different Subscription</a>
  </div>
</div>

<div class="hst-drawers" style="margin-top: 2rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Self-Service Flexibility</button>
    <div class="hst-drawer-body">
      <strong>Pause Deliveries:</strong> Heading out of town or have plenty of beans? Pause recurring dispatches with an optional note and keep your plan intact.<br>
      <strong>Instant Resumption:</strong> Ready for fresh roasts again? Reactivate with a single click anytime.<br>
      <strong>Cancel Anytime:</strong> Cancel your subscription immediately without penalties, fees, or phone calls.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Magic Links &amp; Privacy</button>
    <div class="hst-drawer-body">
      We utilize passwordless magic links delivered directly to your subscriber email address to access your subscription and update your delivery schedule.
    </div>
  </div>
</div>

<script src="{{ '/js/manage-subscriptions.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initManageSubscriptions({
    apiUrl: {{ site.subscription_api_url | jsonify }},
    resubscribeUrl: {{ '/subscriptions/' | relative_url | jsonify }}
  });
</script>
