---
layout: default
title: Buttons, Dropdowns & Pills Design Studio
permalink: /buttons-preview/
---

<div class="buttons-preview-page" data-density="compact">
  <!-- Sticky Interactive Control Toolbar -->
  <div class="bp-toolbar-sticky">
    <div class="bp-toolbar-inner">
      <!-- Row 1: Style Presets & Views -->
      <div class="bp-toolbar-row">
        <div class="bp-toolbar-group">
          <span class="bp-toolbar-label">Style Preset:</span>
          <button type="button" class="bp-style-btn is-active" data-style="minimal-compact">Minimal Compact (4px)</button>
          <button type="button" class="bp-style-btn" data-style="micro-slim">Micro Slim (2px)</button>
          <button type="button" class="bp-style-btn" data-style="ghost-outline">Ghost Outline (4px)</button>
          <button type="button" class="bp-style-btn" data-style="sharp-modernist">Sharp Modernist (0px)</button>
          <button type="button" class="bp-style-btn" data-style="soft-rounded">Soft Rounded (6px)</button>
          <button type="button" class="bp-style-btn" data-style="capsule-pill">Classic Pill (999px)</button>
        </div>

        <div class="bp-view-mode-tabs" role="tablist">
          <button type="button" class="bp-tab-btn is-active" data-mode="sandbox" role="tab" aria-selected="true">Live Sandbox</button>
          <button type="button" class="bp-tab-btn" data-mode="gallery" role="tab" aria-selected="false">All Styles Matrix</button>
          <button type="button" class="bp-tab-btn" data-mode="comparison" role="tab" aria-selected="false">Side-by-Side Columns</button>
        </div>
      </div>

      <!-- Row 2: Density / Size Scale & Fine-Tune Slider -->
      <div class="bp-toolbar-row">
        <div class="bp-toolbar-group">
          <span class="bp-toolbar-label">Size & Padding:</span>
          <button type="button" class="bp-density-btn is-active" data-density="compact">Compact (Recommended)</button>
          <button type="button" class="bp-density-btn" data-density="dense">Dense / Micro</button>
          <button type="button" class="bp-density-btn" data-density="generous">Generous (Original)</button>
        </div>

        <div class="bp-slider-wrap">
          <span class="bp-toolbar-label">Custom Radius:</span>
          <input type="range" id="bp-radius-slider" min="0" max="24" value="4" aria-label="Adjust border radius in pixels">
          <span class="bp-slider-val" id="bp-slider-val">4px</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Page Introduction -->
  <div class="bp-intro">
    <h1>Buttons, Dropdowns & Badges Design Studio</h1>
    <p>
      Compare minimal rectangular aesthetics across catalog, detail, and admin console components. Explore refined compact padding, micro corners, ghost outlines, and admin fulfillment pills.
    </p>
    <div class="bp-intro-badges">
      <span class="bp-intro-badge">✨ Multi-Style Presets</span>
      <span class="bp-intro-badge">📐 Compact vs Dense Sizing</span>
      <span class="bp-intro-badge">⚙️ Admin Console Elements Included</span>
      <span class="bp-intro-badge">☕ Live In-Context Cards</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       VIEW A: LIVE INTERACTIVE SANDBOX
       ══════════════════════════════════════════════════════════════ -->
  <div id="bp-sandbox-view" class="bp-sandbox-view">

    <!-- 1. Catalog Filters & Dropdowns -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>1. Catalog Filters & Dropdown Controls</h2>
        <p>The catalog bar elements, multi-select popover triggers, active tag chips, and layout switcher.</p>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Drawer Toggle</span>
        <div class="bp-row-items">
          <button type="button" class="bp-drawer-toggle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Filters</span>
            <span class="bp-active-count">3</span>
            <span style="font-size: 0.65rem;">&darr;</span>
          </button>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Multi-Select Triggers</span>
        <div class="bp-row-items">
          <button type="button" class="bp-mms-trigger is-active" title="Click to toggle state">
            <span class="mms-label">Type:</span>
            <span class="mms-value">Single Origin</span>
            <span class="mms-chevron">&darr;</span>
          </button>

          <button type="button" class="bp-mms-trigger" title="Click to toggle state">
            <span class="mms-label">Roast:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron">&darr;</span>
          </button>

          <button type="button" class="bp-mms-trigger is-active" title="Click to toggle state">
            <span class="mms-label">Flavor:</span>
            <span class="mms-value">2 selected</span>
            <span class="mms-chevron">&darr;</span>
          </button>

          <button type="button" class="bp-mms-trigger" title="Click to toggle state">
            <span class="mms-label">Origin:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron">&darr;</span>
          </button>
        </div>
      </div>

      <div class="bp-row" style="align-items: flex-start;">
        <span class="bp-row-label">Dropdown Menu & Options</span>
        <div class="bp-row-items">
          <div class="bp-menu-mockup">
            <div class="bp-menu-header">
              <span class="bp-menu-title">Roast Level</span>
              <button type="button" class="bp-menu-clear">Clear</button>
            </div>
            <label class="bp-menu-opt is-checked">
              <input type="checkbox" checked>
              <span>Light</span>
            </label>
            <label class="bp-menu-opt is-checked">
              <input type="checkbox" checked>
              <span>Medium</span>
            </label>
            <label class="bp-menu-opt">
              <input type="checkbox">
              <span>Dark</span>
            </label>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem; max-width: 320px;">
            <span style="font-size: 0.8rem; color: #8a7060; line-height: 1.4;">
              Native select dropdown:
            </span>
            <select class="bp-select" aria-label="Native select example">
              <option>Grind: Whole Bean</option>
              <option>Grind: Drip / Pour-Over</option>
              <option>Grind: French Press</option>
              <option>Grind: Espresso</option>
            </select>

            <span style="font-size: 0.8rem; color: #8a7060; line-height: 1.4; margin-top: 0.5rem;">
              Custom interactive pill dropdown (Live on roast pages):
            </span>
            <select data-pill-dropdown data-label="Grind" aria-label="Custom pill dropdown example">
              <option value="Whole Bean" selected>Whole Bean</option>
              <option value="Drip / Pour-Over">Drip / Pour-Over</option>
              <option value="French Press">French Press</option>
              <option value="Espresso">Espresso</option>
              <option value="Cold Brew">Cold Brew</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Active Filter Tag Chips</span>
        <div class="bp-row-items">
          <span class="bp-active-chip">
            <span>Type: Single Origin</span>
            <button type="button" class="chip-remove" title="Remove">&times;</button>
          </span>
          <span class="bp-active-chip">
            <span>Roast: Light, Medium</span>
            <button type="button" class="chip-remove" title="Remove">&times;</button>
          </span>
          <span class="bp-active-chip">
            <span>Brew: Espresso</span>
            <button type="button" class="chip-remove" title="Remove">&times;</button>
          </span>
          <button type="button" style="font-family: Montserrat, sans-serif; font-size: 0.75rem; font-weight: 700; color: #c0392b; background: transparent; border: none; cursor: pointer;">Clear all</button>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Layout View Switcher</span>
        <div class="bp-row-items">
          <div class="bp-view-switcher" role="group" aria-label="View layout">
            <button type="button" class="bp-view-btn is-active" aria-label="Standard Grid" title="Standard Grid">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            </button>
            <button type="button" class="bp-view-btn" aria-label="Compact Grid" title="Compact Grid">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="4" height="4"></rect><rect x="10" y="3" width="4" height="4"></rect><rect x="17" y="3" width="4" height="4"></rect><rect x="3" y="10" width="4" height="4"></rect><rect x="10" y="10" width="4" height="4"></rect><rect x="17" y="10" width="4" height="4"></rect><rect x="3" y="17" width="4" height="4"></rect><rect x="10" y="17" width="4" height="4"></rect><rect x="17" y="17" width="4" height="4"></rect></svg>
            </button>
            <button type="button" class="bp-view-btn" aria-label="List View" title="List View">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Primary & Action Buttons -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>2. Action & Call-to-Action Buttons</h2>
        <p>Main calls to action, form submissions, and secondary buttons with compact minimal scaling.</p>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Quiz CTA Banner</span>
        <div class="bp-row-items">
          <button type="button" class="bp-quiz-cta">
            <span aria-hidden="true">✨</span>
            <span>Take the Coffee Quiz</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Primary Actions</span>
        <div class="bp-row-items">
          <button type="button" class="bp-btn-primary">Add to Cart &bull; $16</button>
          <button type="button" class="bp-btn-accent">Order Roaster's Choice</button>
          <button type="button" class="bp-btn-outline">Reset All Filters</button>
          <button type="button" class="bp-btn-quick-add">+ Quick Add</button>
        </div>
      </div>
    </div>

    <!-- 3. Product Option Selectors -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>3. Product Option Selectors</h2>
        <p>Bag size selector buttons (<code>12oz</code>, <code>2lb</code>, <code>5lb</code>), grind choices, and purchase toggles.</p>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Bag Sizes</span>
        <div class="bp-row-items">
          <div class="bp-size-group">
            <button type="button" class="bp-size-btn is-selected">12oz &middot; $16</button>
            <button type="button" class="bp-size-btn">2lb &middot; $38</button>
            <button type="button" class="bp-size-btn">5lb &middot; $85</button>
          </div>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Grind Options</span>
        <div class="bp-row-items">
          <div class="bp-size-group">
            <button type="button" class="bp-size-btn is-selected">Whole Bean</button>
            <button type="button" class="bp-size-btn">Drip / Pour-Over</button>
            <button type="button" class="bp-size-btn">French Press</button>
            <button type="button" class="bp-size-btn">Espresso</button>
          </div>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Purchase Toggle</span>
        <div class="bp-row-items">
          <div class="bp-freq-toggle">
            <button type="button" class="bp-freq-btn is-selected">One-time purchase</button>
            <button type="button" class="bp-freq-btn">Subscribe &amp; Save 10%</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Status Badges & Nav Elements -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>4. Status Badges & Nav Indicators</h2>
        <p>Roasting status labels, organic/FTO cert tags, and the fixed cart pill indicator.</p>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Roasting Status</span>
        <div class="bp-row-items">
          <span class="bp-badge bp-badge--just-hatched">Just Hatched</span>
          <span class="bp-badge bp-badge--incubating">Incubating</span>
          <span class="bp-badge bp-badge--mid-molt">Mid-Molt</span>
          <span class="bp-badge bp-badge--fto">FTO</span>
          <span class="bp-badge bp-badge--organic">Organic</span>
        </div>
      </div>

      <div class="bp-row">
        <span class="bp-row-label">Cart Indicator</span>
        <div class="bp-row-items">
          <button type="button" class="bp-cart-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>Cart</span>
            <span class="bp-cart-count">2</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 5. Admin Order Manager Elements (New!) -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>5. Admin Order Manager Console Elements</h2>
        <p>Private roaster dashboard controls from <code>/order/admin/</code>: filter pills, status badges, search input, and action buttons.</p>
      </div>

      <div class="bp-admin-panel">
        <div class="bp-admin-top-row">
          <div class="bp-admin-stats">
            <span class="bp-admin-stat-pill bp-admin-stat-pill--highlight">Total: 14</span>
            <span class="bp-admin-stat-pill">Pending: 3</span>
            <span class="bp-admin-stat-pill">Delivered: 8</span>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="bp-admin-btn-sm">Refresh Queue</button>
            <button type="button" class="bp-admin-btn-sm bp-admin-btn-sm--logout">Log Out</button>
          </div>
        </div>

        <div class="bp-row" style="margin-bottom: 1rem;">
          <span class="bp-row-label">Order Filters</span>
          <div class="bp-row-items">
            <div class="bp-admin-filter-pills">
              <button type="button" class="bp-admin-filter-pill is-active">All (14)</button>
              <button type="button" class="bp-admin-filter-pill">Received (3)</button>
              <button type="button" class="bp-admin-filter-pill">Roasted (2)</button>
              <button type="button" class="bp-admin-filter-pill">Ready for Pickup (1)</button>
              <button type="button" class="bp-admin-filter-pill">Delivered (8)</button>
            </div>
          </div>
        </div>

        <div class="bp-row" style="margin-bottom: 1rem;">
          <span class="bp-row-label">Search Input</span>
          <div class="bp-row-items">
            <input type="search" class="bp-admin-search" placeholder="Search orders (ID, name, email)..." value="Colombia">
          </div>
        </div>

        <div class="bp-row" style="margin-bottom: 1rem;">
          <span class="bp-row-label">Semantic Badges</span>
          <div class="bp-row-items">
            <span class="bp-status-badge bp-status-badge--received">Received</span>
            <span class="bp-status-badge bp-status-badge--roasted">Roasted</span>
            <span class="bp-status-badge bp-status-badge--ready">Ready for Pickup</span>
            <span class="bp-status-badge bp-status-badge--delivered">Delivered</span>
            <span class="bp-status-badge bp-status-badge--delayed">Delayed</span>
            <span class="bp-status-badge bp-status-badge--cancelled">Cancelled</span>
          </div>
        </div>

        <div class="bp-row" style="margin-bottom: 1rem;">
          <span class="bp-row-label">Save Action CTA</span>
          <div class="bp-row-items" style="max-width: 280px;">
            <button type="button" class="bp-admin-save-btn">Save Fulfillment Changes</button>
          </div>
        </div>

        <div class="bp-row">
          <span class="bp-row-label">Queue Card Preview</span>
          <div class="bp-row-items">
            <div class="bp-admin-card-mockup">
              <div class="card-top">
                <span class="card-id">#YWR-8912</span>
                <span class="card-time">2h ago</span>
              </div>
              <div class="card-cust">Sarah Jenkins &middot; Local Delivery</div>
              <div class="card-coffee">2x Colombia Supremo (12oz, Whole Bean)</div>
              <div class="card-foot">
                <span class="bp-status-badge bp-status-badge--received">Received</span>
                <span class="card-price">$32.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Real-World Composite Roast Card Mockup -->
    <div class="bp-section">
      <div class="bp-section-header">
        <h2>6. In-Context Roast Card Mockups</h2>
        <p>How the minimal rectangular button and badge look on actual coffee cards in the catalog.</p>
      </div>

      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <!-- Card 1 -->
        <div class="bp-card-mockup">
          <div class="bp-card-visual" style="background-color: #f5efe6;">
            <span class="bp-badge bp-badge--just-hatched bp-card-badge-top-left">Just Hatched</span>
            <img src="{{ '/images/audubon-chimney-swift-2-transparent.png' | relative_url }}" alt="Chimney Sweep">
          </div>
          <div class="bp-card-body">
            <h3>Chimney Sweep</h3>
            <p class="bp-card-notes">smoky, chocolate, dark cherry</p>
            <div class="bp-card-foot">
              <span class="bp-card-price">$16.00</span>
              <button type="button" class="bp-btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bp-card-mockup">
          <div class="bp-card-visual" style="background-color: #edf2ec;">
            <span class="bp-badge bp-badge--incubating bp-card-badge-top-left">Incubating</span>
            <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="Early Bird">
          </div>
          <div class="bp-card-body">
            <h3>Early Bird</h3>
            <p class="bp-card-notes">citrus, caramel, milk chocolate</p>
            <div class="bp-card-foot">
              <span class="bp-card-price">$16.00</span>
              <button type="button" class="bp-btn-outline">Order Roast</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       VIEW B: MULTI-STYLE GALLERY MATRIX
       Direct side-by-side showcase of all 6 design styles simultaneously
       ══════════════════════════════════════════════════════════════ -->
  <div id="bp-gallery-view" class="bp-gallery-view">
    <div class="bp-gallery-grid">

      <!-- Style 1: Minimal Compact (4px) -->
      <div class="bp-gallery-card bp-gallery-card--minimal-compact is-recommended">
        <div class="bp-recommended-tag">Recommended</div>
        <div class="bp-gal-head">
          <h3>Minimal Compact <span class="bp-gal-tag">4px Radius</span></h3>
          <p>Crisp 4px softened rectangle with balanced compact padding. Solves the bulky feeling.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-primary">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-outline">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Style 2: Micro Slim (2px) -->
      <div class="bp-gallery-card bp-gallery-card--micro-slim">
        <div class="bp-gal-head">
          <h3>Micro Slim <span class="bp-gal-tag">2px Radius</span></h3>
          <p>Ultra-dense, razor-sharp 2px corners with minimal footprint. Modern technical aesthetic.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-primary">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-outline">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Style 3: Ghost Outline (4px) -->
      <div class="bp-gallery-card bp-gallery-card--ghost-outline">
        <div class="bp-gal-head">
          <h3>Ghost Outline <span class="bp-gal-tag">4px Border</span></h3>
          <p>Delicate outline borders with light surfaces. Low visual weight that never dominates the layout.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-outline" style="border-width: 2px;">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-accent">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched" style="border: 1px solid #a3d4a3;">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Style 4: Sharp Modernist (0px) -->
      <div class="bp-gallery-card bp-gallery-card--sharp-modernist">
        <div class="bp-gal-head">
          <h3>Sharp Modernist <span class="bp-gal-tag">0px Radius</span></h3>
          <p>Pure right angles, Bauhaus geometry, architectural typography with crisp definition.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-primary">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-outline">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Style 5: Soft Rounded (6px) -->
      <div class="bp-gallery-card bp-gallery-card--soft-rounded">
        <div class="bp-gal-head">
          <h3>Soft Rounded <span class="bp-gal-tag">6px Radius</span></h3>
          <p>Gentle softened corners without turning into a capsule pill. Welcoming and approachable.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-primary">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-outline">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Style 6: Classic Pill (999px) -->
      <div class="bp-gallery-card bp-gallery-card--capsule-pill">
        <div class="bp-gal-head">
          <h3>Classic Pill <span class="bp-gal-tag">999px Radius</span></h3>
          <p>Full capsule rounded ends from the original theme for direct side-by-side contrast.</p>
        </div>
        <div class="bp-gal-items">
          <div class="bp-gal-row">
            <span class="bp-gal-label">Primary &amp; Outline Button</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-btn-primary">Add to Cart &bull; $16</button>
              <button type="button" class="g-btn-outline">Order Roast</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Dropdown Filter Trigger</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-trigger is-active">Type: Single Origin &darr;</button>
              <button type="button" class="g-trigger">Roast: All &darr;</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Product Size Selector</span>
            <div class="bp-gal-row-inner">
              <button type="button" class="g-size-btn is-selected">12oz</button>
              <button type="button" class="g-size-btn">2lb</button>
              <button type="button" class="g-size-btn">5lb</button>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Catalog Badge</span>
            <div class="bp-gal-row-inner">
              <span class="g-badge g-badge--just-hatched">Just Hatched</span>
              <span class="g-badge g-badge--fto">FTO</span>
            </div>
          </div>
          <div class="bp-gal-row">
            <span class="bp-gal-label">Admin Filter Pill &amp; Status</span>
            <div class="bp-gal-row-inner">
              <span class="g-admin-filter is-active">All (14)</span>
              <span class="g-admin-filter">Received (3)</span>
              <span class="g-admin-status g-admin-status--received">Received</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       VIEW C: SIDE-BY-SIDE COMPARISON
       ══════════════════════════════════════════════════════════════ -->
  <div id="bp-comparison-view" class="bp-comparison-grid">

    <!-- Column 1: Existing Capsule / Pill (999px) -->
    <div class="bp-comp-col bp-comp-col--pill">
      <div class="bp-comp-title">
        <span>A. Classic Pill</span>
        <span class="bp-comp-tag">999px &bull; Puffy</span>
      </div>
      <p class="bp-comp-desc">Full capsule rounded ends with generous padding.</p>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Primary Actions</h4>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="bp-btn-primary">Add to Cart &bull; $16</button>
          <button type="button" class="bp-btn-outline">Order Roast</button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Filter Triggers</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button type="button" class="bp-drawer-toggle"><span>Filters</span><span class="bp-active-count">2</span></button>
          <button type="button" class="bp-mms-trigger is-active"><span class="mms-label">Type:</span><span class="mms-value">Blend</span></button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Admin Status Badges</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="bp-status-badge bp-status-badge--received">Received</span>
          <span class="bp-status-badge bp-status-badge--roasted">Roasted</span>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Bag Size Selector</h4>
        <div class="bp-size-group">
          <button type="button" class="bp-size-btn is-selected">12oz</button>
          <button type="button" class="bp-size-btn">2lb</button>
          <button type="button" class="bp-size-btn">5lb</button>
        </div>
      </div>
    </div>

    <!-- Column 2: Minimal 4px (Generous / Too Big) -->
    <div class="bp-comp-col bp-comp-col--rect-generous">
      <div class="bp-comp-title">
        <span>B. Minimal Standard</span>
        <span class="bp-comp-tag" style="background: #a8421a;">4px &bull; Generous</span>
      </div>
      <p class="bp-comp-desc">The original pill padding with 4px corners. Why it felt "too big" &amp; bulky.</p>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Primary Actions</h4>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="bp-btn-primary">Add to Cart &bull; $16</button>
          <button type="button" class="bp-btn-outline">Order Roast</button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Filter Triggers</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button type="button" class="bp-drawer-toggle"><span>Filters</span><span class="bp-active-count">2</span></button>
          <button type="button" class="bp-mms-trigger is-active"><span class="mms-label">Type:</span><span class="mms-value">Blend</span></button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Admin Status Badges</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="bp-status-badge bp-status-badge--received">Received</span>
          <span class="bp-status-badge bp-status-badge--roasted">Roasted</span>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Bag Size Selector</h4>
        <div class="bp-size-group">
          <button type="button" class="bp-size-btn is-selected">12oz</button>
          <button type="button" class="bp-size-btn">2lb</button>
          <button type="button" class="bp-size-btn">5lb</button>
        </div>
      </div>
    </div>

    <!-- Column 3: Minimal 4px (Compact Scale - Recommended) -->
    <div class="bp-comp-col bp-comp-col--rect-compact">
      <div class="bp-comp-title">
        <span>C. Sleek Compact</span>
        <span class="bp-comp-tag" style="background: #27ae60;">4px &bull; Compact</span>
      </div>
      <p class="bp-comp-desc">Refined 4px corners with balanced compact padding. Clean &amp; proportional.</p>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Primary Actions</h4>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="bp-btn-primary">Add to Cart &bull; $16</button>
          <button type="button" class="bp-btn-outline">Order Roast</button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Filter Triggers</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button type="button" class="bp-drawer-toggle"><span>Filters</span><span class="bp-active-count">2</span></button>
          <button type="button" class="bp-mms-trigger is-active"><span class="mms-label">Type:</span><span class="mms-value">Blend</span></button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Admin Status Badges</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="bp-status-badge bp-status-badge--received">Received</span>
          <span class="bp-status-badge bp-status-badge--roasted">Roasted</span>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Bag Size Selector</h4>
        <div class="bp-size-group">
          <button type="button" class="bp-size-btn is-selected">12oz</button>
          <button type="button" class="bp-size-btn">2lb</button>
          <button type="button" class="bp-size-btn">5lb</button>
        </div>
      </div>
    </div>

    <!-- Column 4: Micro Slim 2px -->
    <div class="bp-comp-col bp-comp-col--micro">
      <div class="bp-comp-title">
        <span>D. Micro Slim</span>
        <span class="bp-comp-tag" style="background: #2c1e14;">2px &bull; Dense</span>
      </div>
      <p class="bp-comp-desc">Ultra-compact 2px micro corners with high-density spacing.</p>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Primary Actions</h4>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="bp-btn-primary">Add to Cart &bull; $16</button>
          <button type="button" class="bp-btn-outline">Order Roast</button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Filter Triggers</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button type="button" class="bp-drawer-toggle"><span>Filters</span><span class="bp-active-count">2</span></button>
          <button type="button" class="bp-mms-trigger is-active"><span class="mms-label">Type:</span><span class="mms-value">Blend</span></button>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Admin Status Badges</h4>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="bp-status-badge bp-status-badge--received">Received</span>
          <span class="bp-status-badge bp-status-badge--roasted">Roasted</span>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060; margin-bottom: 0.5rem;">Bag Size Selector</h4>
        <div class="bp-size-group">
          <button type="button" class="bp-size-btn is-selected">12oz</button>
          <button type="button" class="bp-size-btn">2lb</button>
          <button type="button" class="bp-size-btn">5lb</button>
        </div>
      </div>
    </div>

  </div>
</div>

<script src="{{ '/js/buttons-preview.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
