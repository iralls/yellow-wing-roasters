---
layout: default
title: "Roaster Admin UI Alternatives Preview"
permalink: /roasts/preview/
sitemap: false
---

<div class="order-admin-container" style="max-width: 76rem; margin-top: 1.5rem;">

  <div class="roast-preview-banner">
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span class="roast-preview-banner-badge">Design Preview</span>
      <h2 class="roast-preview-banner-title">Roast Management UI: Simplified &amp; Unbloated Alternatives</h2>
    </div>
    <div class="roast-preview-banner-switcher">
      <span style="font-size: 0.76rem; color: #d0c4b6; margin-right: 0.25rem;">Switch Preview:</span>
      <a href="{{ '/roasts/preview/' | relative_url }}" class="roast-preview-banner-link roast-preview-banner-link--active">Overview</a>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-banner-link">1. Master-Detail Studio</a>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="roast-preview-banner-link">2. Visual Cards</a>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="roast-preview-banner-link">3. Minimal Ledger</a>
      <a href="{{ '/roasts/admin/' | relative_url }}" class="roast-preview-banner-link" style="border: 1px dashed rgba(255,255,255,0.3);">Current Terminal &rarr;</a>
    </div>
  </div>

  <div style="text-align: center; max-width: 46rem; margin: 0 auto 2rem;">
    <h1 style="font-size: 1.8rem; font-weight: 700; color: #2c1e14; margin-bottom: 0.6rem;">Simplifying the Roaster Console</h1>
    <p style="font-size: 0.95rem; color: #6e5e54; line-height: 1.5;">
      The current roast console suffered from spreadsheet bloat: 11-column tables, tiny 11px font sizes, 5 stacked filter dropdown bars, and heavy pushdown drawers. Below are three distinct, lighter alternatives designed specifically for fast roasting workflows.
    </p>
  </div>

  <!-- Comparison Cards Grid -->
  <div class="roast-preview-comparison-grid">
    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 1 &bull; Recommended</div>
        <h3 class="compare-title">Master-Detail Studio</h3>
        <p class="compare-desc">
          Unifies Roasting with the existing Yellow Wing Roasters <strong>Order Admin</strong> &amp; <strong>Subscriptions</strong> design language.
        </p>
        <ul class="compare-points">
          <li><strong>Zero horizontal scrolling</strong>: Left list + right contextual inspector.</li>
          <li><strong>Connected data</strong>: Selecting a roast shows its green bean lot &amp; packaged orders.</li>
          <li><strong>Readable typography</strong>: Restores comfortable font sizes and natural spacing.</li>
          <li><strong>No dropdown clutter</strong>: Fast search replaces 4 separate select boxes.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="compare-cta">Launch Studio Preview &rarr;</a>
    </div>

    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 2 &bull; Visual &amp; Tactile</div>
        <h3 class="compare-title">Visual Roastery Desk</h3>
        <p class="compare-desc">
          Card and gauge UI designed for quick at-a-glance scanning on workshop desktops and mobile tablets near the roaster.
        </p>
        <ul class="compare-points">
          <li><strong>Stock gauges</strong>: Visual progress bars show capacity remaining at a glance.</li>
          <li><strong>Batch curve cards</strong>: Roast loss percentage badges &amp; quick Artisan profile links.</li>
          <li><strong>Segmented packaging</strong>: Grouped into customer orders vs. samples &amp; personal.</li>
          <li><strong>High contrast cards</strong>: Immediate visual distinction between healthy vs. low stock.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-cards/' | relative_url }}" class="compare-cta">Launch Visual Cards Preview &rarr;</a>
    </div>

    <div class="roast-preview-compare-card">
      <div>
        <div class="compare-badge">Option 3 &bull; Clean Data</div>
        <h3 class="compare-title">Streamlined Minimal Ledger</h3>
        <p class="compare-desc">
          For fast tabular scanning, drastically edited down from 12 dense columns to 4&ndash;5 essential composite columns.
        </p>
        <ul class="compare-points">
          <li><strong>Smart composite cells</strong>: Merges ID + Date, Bean + Supplier, Green &rarr; Roasted Yield.</li>
          <li><strong>Full row comfort</strong>: Normal line heights without cramping your eyes.</li>
          <li><strong>Unified filter bar</strong>: Instant search and quick pill toggles instead of select boxes.</li>
          <li><strong>Fast actions</strong>: Quick inline buttons to edit lots, log roasts, or print labels.</li>
        </ul>
      </div>
      <a href="{{ '/roasts/ui-ledger/' | relative_url }}" class="compare-cta">Launch Minimal Ledger Preview &rarr;</a>
    </div>
  </div>

  <!-- Interactive Live Studio Showcase on this page -->
  <div style="margin-top: 2.5rem; background: #ffffff; border: 1px solid #dfd7cc; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(44, 30, 20, 0.04);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid #eee5da; padding-bottom: 0.75rem;">
      <div>
        <h3 style="margin: 0; font-size: 1.15rem; color: #2c1e14;">Live Interactive Prototype: Master-Detail Studio</h3>
        <p style="margin: 0.2rem 0 0; font-size: 0.8rem; color: #7d6b5e;">Click any tab or card below to test the active inventory, orders, roasts, and packaging workflows.</p>
      </div>
      <a href="{{ '/roasts/ui-studio/' | relative_url }}" class="roast-preview-btn-primary" style="text-decoration: none;">Open Fullscreen Studio &rarr;</a>
    </div>

    <div id="hub-studio-preview"></div>
  </div>

</div>

<script src="{{ '/js/roast-ui-alternatives.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initStudioPreview('hub-studio-preview');
</script>
