---
layout: default
title: "Option 2: Visual Roastery Desk &bull; Roast Admin Preview"
permalink: /roasts/ui-cards/
sitemap: false
---

<div class="order-admin-container" style="max-width: 76rem; margin-top: 1.5rem;">

  <div class="roast-preview-banner">
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span class="roast-preview-banner-badge" style="background: #e67e22; color: #ffffff;">Option 2</span>
      <h2 class="roast-preview-banner-title">Visual Roastery Desk &mdash; Modern Cards &amp; Gauges</h2>
    </div>
    <div class="roast-preview-banner-switcher">
      <span style="font-size: 0.76rem; color: #d0c4b6; margin-right: 0.25rem;">Switch Preview:</span>
      <a href="{{ '/roasts/preview/' | relative_url }}" class="roast-preview-banner-link">Overview</a>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-banner-link">1. Master-Detail Studio</a>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="roast-preview-banner-link roast-preview-banner-link--active">2. Visual Cards</a>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="roast-preview-banner-link">3. Minimal Ledger</a>
      <a href="{{ '/roasts/admin/' | relative_url }}" class="roast-preview-banner-link" style="border: 1px dashed rgba(255,255,255,0.3);">Current Terminal &rarr;</a>
    </div>
  </div>

  <div style="margin-bottom: 1rem;">
    <h1 style="font-size: 1.4rem; font-weight: 700; color: #2c1e14; margin: 0 0 0.25rem;">Visual Roastery Workbench</h1>
    <p style="font-size: 0.85rem; color: #7d6b5e; margin: 0;">
      Built for tactile roastery monitoring: graphical remaining-stock meters, roast loss badges, and clear blend recipe breakdowns.
    </p>
  </div>

  <div id="cards-preview-mount"></div>

</div>

<script src="{{ '/js/roast-ui-alternatives.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initCardsPreview('cards-preview-mount');
</script>
