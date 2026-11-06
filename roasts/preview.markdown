---
layout: default
title: "Roaster Admin UI Alternatives Preview"
permalink: /roasts/preview/
sitemap: false
---

<div class="roast-minimal-vertical">
<div class="order-admin-container" style="max-width: 68rem;">

  <div class="roast-preview-banner">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span class="roast-preview-banner-badge">Preview</span>
      <h2 class="roast-preview-banner-title">Roast Management UI Alternatives</h2>
    </div>
    <div class="roast-preview-banner-switcher">
      <span style="font-size: 0.7rem; color: #7d6b5e; margin-right: 0.15rem;">Switch:</span>
      <a href="{{ '/roasts/preview/' | relative_url }}" class="roast-preview-banner-link roast-preview-banner-link--active">Overview</a>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-banner-link">1. Studio</a>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="roast-preview-banner-link">2. Cards</a>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="roast-preview-banner-link">3. Ledger</a>
      <a href="{{ '/roasts/admin/' | relative_url }}" class="roast-preview-banner-link" style="border-style: dashed;">Terminal &rarr;</a>
    </div>
  </div>

  <div class="order-admin-header-compact roast-admin-header-compact" style="margin-bottom: 0.75rem;">
    <h1 class="order-admin-page-title" style="font-size: 1.25rem;">Roaster Console Alternatives</h1>
    <p class="order-admin-page-desc" style="font-size: 0.78rem;">
      Three lighter, unbloated workflow options designed for fast roasting, inventory tracking, and packaging.
    </p>
  </div>

  <!-- Comparison Cards Grid -->
  <div class="roast-preview-comparison-grid">
    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 1 &bull; Recommended</div>
        <h3 class="compare-title">Master-Detail Studio</h3>
        <p class="compare-desc">
          Aligned with the Order and Subscription Admin pattern.
        </p>
        <ul class="compare-points">
          <li><strong>Zero horizontal scrolling</strong>: Left list + right inspector.</li>
          <li><strong>Connected data</strong>: Select a roast to view lot &amp; packaging.</li>
          <li><strong>Tight typography</strong>: Clean font sizes and natural spacing.</li>
          <li><strong>Instant search</strong>: Replaces stacked select boxes.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="compare-cta">Launch Studio &rarr;</a>
    </div>

    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 2 &bull; Visual</div>
        <h3 class="compare-title">Visual Roastery Desk</h3>
        <p class="compare-desc">
          Card and meter UI for quick at-a-glance scanning near the roaster.
        </p>
        <ul class="compare-points">
          <li><strong>Stock meters</strong>: Visual progress tracks remaining capacity.</li>
          <li><strong>Batch loss</strong>: Loss percentage badges &amp; Artisan links.</li>
          <li><strong>Segmented packaging</strong>: Customer orders vs. samples.</li>
          <li><strong>Clear contrast</strong>: Immediate healthy vs. low stock states.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="compare-cta">Launch Cards &rarr;</a>
    </div>

    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 3 &bull; Compact</div>
        <h3 class="compare-title">Minimal Ledger</h3>
        <p class="compare-desc">
          Tabular scanning edited down to 4&ndash;5 composite columns.
        </p>
        <ul class="compare-points">
          <li><strong>Composite cells</strong>: ID + Date, Bean + Supplier, Yields.</li>
          <li><strong>Compact density</strong>: Clean row heights without clutter.</li>
          <li><strong>Unified filters</strong>: Fast search and pill toggles.</li>
          <li><strong>Direct actions</strong>: Inline buttons to edit or log.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="compare-cta">Launch Ledger &rarr;</a>
    </div>
  </div>

  <!-- Interactive Live Studio Showcase on this page -->
  <div style="margin-top: 1.25rem; background: #ffffff; border: 1px solid #dfd7cc; border-radius: 4px; padding: 0.85rem 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid #eee5da; padding-bottom: 0.5rem;">
      <div>
        <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #2c1e14;">Live Prototype: Master-Detail Studio</h3>
        <p style="margin: 0.15rem 0 0; font-size: 0.74rem; color: #7d6b5e;">Interactive preview across inventory, orders, roasts, and packaging.</p>
      </div>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-btn-primary" style="text-decoration: none; font-size: 0.72rem; padding: 0.22rem 0.55rem;">Fullscreen Studio &rarr;</a>
    </div>

    <div id="hub-studio-preview"></div>
  </div>

</div>
</div>

<script src="{{ '/js/roast-ui-alternatives.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initStudioPreview('hub-studio-preview');
</script>
