---
layout: default
title: "Option 2: Visual Roastery Desk &bull; Roast Admin Preview"
permalink: /roasts/ui-cards/
sitemap: false
---

<div class="roast-minimal-vertical">
<div class="order-admin-container" style="max-width: 68rem;">

  <div class="roast-preview-banner">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span class="roast-preview-banner-badge">Option 2</span>
      <h2 class="roast-preview-banner-title">Visual Roastery Desk &mdash; Modern Cards &amp; Gauges</h2>
    </div>
    <div class="roast-preview-banner-switcher">
      <span style="font-size: 0.7rem; color: #7d6b5e; margin-right: 0.15rem;">Switch:</span>
      <a href="{{ '/roasts/preview/' | relative_url }}" class="roast-preview-banner-link">Overview</a>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-banner-link">1. Studio</a>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="roast-preview-banner-link roast-preview-banner-link--active">2. Cards</a>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="roast-preview-banner-link">3. Ledger</a>
      <a href="{{ '/roasts/admin/' | relative_url }}" class="roast-preview-banner-link" style="border-style: dashed;">Terminal &rarr;</a>
    </div>
  </div>

  <div class="order-admin-header-compact roast-admin-header-compact" style="margin-bottom: 0.65rem; text-align: left;">
    <h1 class="order-admin-page-title" style="font-size: 1.15rem; margin-bottom: 0.15rem;">Visual Roastery Workbench</h1>
    <p class="order-admin-page-desc" style="font-size: 0.76rem;">
      Built for tactile roastery monitoring: graphical remaining-stock meters, roast loss badges, and clear blend recipe breakdowns.
    </p>
  </div>

  <div id="cards-preview-mount"></div>

</div>
</div>

<script src="{{ '/js/roast-ui-alternatives.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initCardsPreview('cards-preview-mount');
</script>
