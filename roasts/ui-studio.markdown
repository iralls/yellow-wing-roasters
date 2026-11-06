---
layout: default
title: "Option 1: Master-Detail Studio &bull; Roast Admin Preview"
permalink: /roasts/ui-studio/
sitemap: false
---

<div class="order-admin-container" style="max-width: 76rem; margin-top: 1.5rem;">

  <div class="roast-preview-banner">
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span class="roast-preview-banner-badge">Option 1</span>
      <h2 class="roast-preview-banner-title">Master-Detail Studio &mdash; Workspace Pattern</h2>
    </div>
    <div class="roast-preview-banner-switcher">
      <span style="font-size: 0.76rem; color: #d0c4b6; margin-right: 0.25rem;">Switch Preview:</span>
      <a href="{{ '/roasts/preview/' | relative_url }}" class="roast-preview-banner-link">Overview</a>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-banner-link roast-preview-banner-link--active">1. Master-Detail Studio</a>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="roast-preview-banner-link">2. Visual Cards</a>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="roast-preview-banner-link">3. Minimal Ledger</a>
      <a href="{{ '/roasts/admin/' | relative_url }}" class="roast-preview-banner-link" style="border: 1px dashed rgba(255,255,255,0.3);">Current Terminal &rarr;</a>
    </div>
  </div>

  <div style="margin-bottom: 1rem;">
    <h1 style="font-size: 1.4rem; font-weight: 700; color: #2c1e14; margin: 0 0 0.25rem;">Roaster Inventory &amp; Roast Log Studio</h1>
    <p style="font-size: 0.85rem; color: #7d6b5e; margin: 0;">
      Browse beans, shipments, batches, and blend logs on the left &mdash; inspect complete history, calculations, and actions on the right without table overflow.
    </p>
  </div>

  <div id="studio-preview-mount"></div>

</div>

<script src="{{ '/js/roast-ui-alternatives.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initStudioPreview('studio-preview-mount');
</script>
