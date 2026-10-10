---
layout: default
title: "Catalog Filters Preview"
permalink: /roasts/filters-preview/
sitemap: false
---

<div class="roasts-header-row">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Filters Preview Lab</h1>
    <p class="category-intro">Test and compare 3 interaction models for the roast catalog filters.</p>
  </div>
  <a href="{{ '/roasts/' | relative_url }}" class="roasts-quiz-cta" title="Return to production roasts catalog">
    <span>&larr; Back to /roasts</span>
  </a>
</div>

<!-- Preview Header Banner & Tab Switcher -->
<div class="preview-header-banner">
  <span class="preview-header-tag">Interactive Design Prototype</span>
  <h2 class="preview-header-title">Choose a Filter Variation to Test</h2>
  <p class="preview-header-desc">
    Each option explores a different approach to balancing catalog discoverability with visual simplicity. Try selecting filters in any variation below—it actively filters the live coffee catalog in real time!
  </p>

  <div class="preview-tabs-row" role="tablist" aria-label="Filter Variations">
    <button type="button" class="preview-tab-btn is-active" data-preview-mode="combined" role="tab" aria-selected="true">
      <span class="tab-badge">&starf;</span>
      <span>Featured: Minimizable Multi-Selects</span>
    </button>
    <button type="button" class="preview-tab-btn" data-preview-mode="1" role="tab" aria-selected="false">
      <span class="tab-badge">1</span>
      <span>Minimal Dropdowns</span>
    </button>
    <button type="button" class="preview-tab-btn" data-preview-mode="2" role="tab" aria-selected="false">
      <span class="tab-badge">2</span>
      <span>Minimizable Drawer</span>
    </button>
    <button type="button" class="preview-tab-btn" data-preview-mode="3" role="tab" aria-selected="false">
      <span class="tab-badge">3</span>
      <span>Multi-Select Pills</span>
    </button>
    <button type="button" class="preview-tab-btn" data-preview-mode="all" role="tab" aria-selected="false">
      <span>Compare All Stacked</span>
    </button>
  </div>
</div>

<!-- Combined Featured Info Card -->
<div class="variation-info-card" id="info-var-combined">
  <div class="variation-info-main">
    <div class="variation-info-title">Featured: Minimizable Drawer with Minimal Multi-Select Dropdowns</div>
    <p class="variation-info-desc">
      Combines the best of both worlds: a collapsible drawer to keep the page clean, containing minimal dropdowns that expand into floating multi-select menus with checkboxes. <strong>Choices within a dropdown are OR'd; different dropdowns are AND'd.</strong>
    </p>
  </div>
  <div class="variation-info-badges">
    <span class="v-badge-pill">Minimizable drawer</span>
    <span class="v-badge-pill">Minimal multi-select popovers</span>
    <span class="v-badge-pill">Live tags in header</span>
  </div>
</div>

<!-- Variation 1 Info Card -->
<div class="variation-info-card" id="info-var-1" style="display: none;">
  <div class="variation-info-main">
    <div class="variation-info-title">Variation 1: Minimal Dropdown Design</div>
    <p class="variation-info-desc">
      A quiet, ultra-compact single pill bar. Removes chunky labels and high-contrast form outlines in favor of understated inline labels with subtle background tinting when active.
    </p>
  </div>
  <div class="variation-info-badges">
    <span class="v-badge-pill">Single select per category</span>
    <span class="v-badge-pill">Low visual weight</span>
    <span class="v-badge-pill">Zero vertical sprawl</span>
  </div>
</div>

<!-- Variation 2 Info Card -->
<div class="variation-info-card" id="info-var-2" style="display: none;">
  <div class="variation-info-main">
    <div class="variation-info-title">Variation 2: Minimizable Filters Row</div>
    <p class="variation-info-desc">
      A collapsible drawer with a toggle button, active filter counter, and quick-remove pill chips. Keep the page focused entirely on the coffee artwork, and expand filters only when needed.
    </p>
  </div>
  <div class="variation-info-badges">
    <span class="v-badge-pill">Collapsible drawer</span>
    <span class="v-badge-pill">Direct tag chips in header</span>
    <span class="v-badge-pill">Clean distraction-free browsing</span>
  </div>
</div>

<!-- Variation 3 Info Card -->
<div class="variation-info-card" id="info-var-3" style="display: none;">
  <div class="variation-info-main">
    <div class="variation-info-title">Variation 3: Multiple Choice Filters (Chips & Pills)</div>
    <p class="variation-info-desc">
      Replaces dropdowns with clickable chips. Allows selecting multiple options per category. <strong>Within a category, choices are OR'd</strong> (e.g. Light OR Medium), and <strong>across categories, they are AND'd</strong>.
    </p>
  </div>
  <div class="variation-info-badges">
    <span class="v-badge-pill">OR within category</span>
    <span class="v-badge-pill">AND across categories</span>
    <span class="v-badge-pill">One-tap toggle chips</span>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     FEATURED VARIATION: Minimizable Drawer with Minimal Multi-Select Dropdowns
     ══════════════════════════════════════════════════════════════ -->
<div class="variation-panel is-active" id="panel-var-combined">
  <div class="filters-var-combined">
    <div class="vc-toggle-bar">
      <button type="button" class="vc-toggle-btn" id="vc-toggle-btn" aria-expanded="false" aria-controls="vc-drawer">
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
        <span class="vc-active-count" id="vc-active-count" style="display: none;">0</span>
        <span class="vc-chevron" aria-hidden="true">&darr;</span>
      </button>

      <div class="vc-tags-preview" id="vc-tags-preview" aria-live="polite">
        <!-- Active tags rendered dynamically -->
      </div>

      <button type="button" class="vc-clear-all-link" id="vc-clear-all-link">Clear all</button>
    </div>

    <!-- Expandable Drawer with Minimal Multi-Select Dropdowns -->
    <div class="vc-drawer" id="vc-drawer">
      <div class="vc-drawer-row">
        <!-- Type Multi-Select -->
        <div class="min-multiselect" data-filter="type">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-type">
            <span class="mms-label">Type:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-type">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Type</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="type">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-type"></div>
          </div>
        </div>

        <!-- Roast Level Multi-Select -->
        <div class="min-multiselect" data-filter="level">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-level">
            <span class="mms-label">Roast:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-level">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Roast Level</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="level">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-level"></div>
          </div>
        </div>

        <!-- Flavor Profile Multi-Select -->
        <div class="min-multiselect" data-filter="flavor">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-flavor">
            <span class="mms-label">Flavor:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-flavor">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Flavor Profile</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="flavor">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-flavor"></div>
          </div>
        </div>

        <!-- Certification Multi-Select -->
        <div class="min-multiselect" data-filter="cert">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-cert">
            <span class="mms-label">Cert:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-cert">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Certification</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="cert">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-cert"></div>
          </div>
        </div>

        <!-- Origin Multi-Select -->
        <div class="min-multiselect" data-filter="origin">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-origin">
            <span class="mms-label">Origin:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-origin">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Origin</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="origin">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-origin"></div>
          </div>
        </div>

        <!-- Process Multi-Select -->
        <div class="min-multiselect" data-filter="process">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-process">
            <span class="mms-label">Process:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-process">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Process</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="process">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-process"></div>
          </div>
        </div>

        <!-- Brewing Multi-Select -->
        <div class="min-multiselect" data-filter="brewing">
          <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-vc-brewing">
            <span class="mms-label">Brew:</span>
            <span class="mms-value">All</span>
            <span class="mms-chevron" aria-hidden="true">&darr;</span>
          </button>
          <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-vc-brewing">
            <div class="mms-menu-header">
              <span class="mms-menu-title">Brewing Method</span>
              <button type="button" class="mms-menu-clear" data-clear-dropdown="brewing">Clear</button>
            </div>
            <div class="mms-menu-options" id="mms-options-brewing"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     VARIATION 1 CONTAINER: Minimal Dropdowns
     ══════════════════════════════════════════════════════════════ -->
<div class="variation-panel" id="panel-var-1">
  <div class="filters-var-1" role="search" aria-label="Minimal Filters">
    <div class="min-filter-group">
      <select id="v1-category" class="min-select" aria-label="Coffee Type">
        <option value="">Type: All</option>
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-level" class="min-select" aria-label="Roast Level">
        <option value="">Roast: All</option>
        <option value="Light">Roast: Light</option>
        <option value="Medium">Roast: Medium</option>
        <option value="Dark">Roast: Dark</option>
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-flavor" class="min-select" aria-label="Flavor Profile">
        <option value="">Flavor: All</option>
        {% for profile in site.data.flavor_profiles %}
          <option value="{{ profile.id }}">Flavor: {{ profile.name }}</option>
        {% endfor %}
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-origin" class="min-select" aria-label="Origin">
        <option value="">Origin: All</option>
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-process" class="min-select" aria-label="Process">
        <option value="">Process: All</option>
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-brewing" class="min-select" aria-label="Brewing Method">
        <option value="">Brew: All</option>
      </select>
    </div>

    <div class="min-filter-group">
      <select id="v1-cert" class="min-select" aria-label="Certification">
        <option value="">Cert: All</option>
        <option value="organic">Organic</option>
        <option value="fair_trade_organic">Fair Trade Organic</option>
      </select>
    </div>

    <button type="button" id="v1-clear-btn" class="min-clear-btn" title="Clear all minimal filters">Reset &times;</button>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     VARIATION 2 CONTAINER: Minimizable Filters Row (Drawer)
     ══════════════════════════════════════════════════════════════ -->
<div class="variation-panel" id="panel-var-2">
  <div class="filters-var-2">
    <div class="v2-toggle-bar">
      <button type="button" class="v2-toggle-btn" id="v2-toggle-btn" aria-expanded="false" aria-controls="v2-drawer">
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
        <span class="v2-active-count" id="v2-active-count" style="display: none;">0</span>
        <span class="v2-chevron" aria-hidden="true">&darr;</span>
      </button>

      <div class="v2-tags-preview" id="v2-tags-preview" aria-live="polite">
        <!-- Active tags rendered dynamically -->
      </div>

      <button type="button" class="v2-clear-all-link" id="v2-clear-all-link">Clear all</button>
    </div>

    <!-- Expandable Drawer -->
    <div class="v2-drawer" id="v2-drawer">
      <div class="v2-drawer-grid">
        <div class="v2-drawer-group">
          <label for="v2-category">Type</label>
          <select id="v2-category" class="subscribe-select">
            <option value="">All Types</option>
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-level">Roast Level</label>
          <select id="v2-level" class="subscribe-select">
            <option value="">All Levels</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-flavor">Flavor Profile</label>
          <select id="v2-flavor" class="subscribe-select">
            <option value="">All Flavors</option>
            {% for profile in site.data.flavor_profiles %}
              <option value="{{ profile.id }}">{{ profile.name }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-origin">Origin</label>
          <select id="v2-origin" class="subscribe-select">
            <option value="">All Origins</option>
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-process">Process</label>
          <select id="v2-process" class="subscribe-select">
            <option value="">All Processes</option>
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-brewing">Brewing Method</label>
          <select id="v2-brewing" class="subscribe-select">
            <option value="">All Methods</option>
          </select>
        </div>

        <div class="v2-drawer-group">
          <label for="v2-cert">Certification</label>
          <select id="v2-cert" class="subscribe-select">
            <option value="">All</option>
            <option value="organic">Organic</option>
            <option value="fair_trade_organic">Fair Trade Organic</option>
          </select>
        </div>
      </div>

      <div class="v2-drawer-footer">
        <button type="button" class="v2-close-drawer-btn" id="v2-close-drawer-btn">Close Filters</button>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════════
     VARIATION 3 CONTAINER: Multiple Choice Filters (Chips & Pills)
     ══════════════════════════════════════════════════════════════ -->
<div class="variation-panel" id="panel-var-3">
  <div class="filters-var-3" role="search" aria-label="Multi-Choice Filters">
    <div class="v3-header">
      <div class="v3-title">Multi-Select Coffee Filters</div>
      <div class="v3-header-meta">
        <span class="v3-logic-badge">
          <span>&bull;</span>
          <span>OR within groups &middot; AND across groups</span>
        </span>
        <button type="button" id="v3-reset-all" class="v3-reset-all">Reset All Filters &times;</button>
      </div>
    </div>

    <!-- Category: Type -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Type</span>
        <button type="button" class="v3-category-clear" data-clear-category="type">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-type"></div>
    </div>

    <!-- Category: Roast Level -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Roast Level</span>
        <button type="button" class="v3-category-clear" data-clear-category="level">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-level"></div>
    </div>

    <!-- Category: Flavor Profile -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Flavor Profile</span>
        <button type="button" class="v3-category-clear" data-clear-category="flavor">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-flavor"></div>
    </div>

    <!-- Category: Certification -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Certification</span>
        <button type="button" class="v3-category-clear" data-clear-category="cert">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-cert"></div>
    </div>

    <!-- Category: Origin -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Origin</span>
        <button type="button" class="v3-category-clear" data-clear-category="origin">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-origin"></div>
    </div>

    <!-- Category: Brewing Method -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Brewing Method</span>
        <button type="button" class="v3-category-clear" data-clear-category="brewing">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-brewing"></div>
    </div>

    <!-- Category: Process -->
    <div class="v3-category-row">
      <div class="v3-category-header">
        <span class="v3-category-label">Process</span>
        <button type="button" class="v3-category-clear" data-clear-category="process">clear</button>
      </div>
      <div class="v3-chips-wrap" id="v3-chips-process"></div>
    </div>
  </div>
</div>

<!-- Live Results & Layout Switcher Bar -->
<div class="preview-results-bar">
  <div class="results-count">
    Showing <strong id="preview-visible-count">...</strong> of <span id="preview-total-count">...</span> coffees
  </div>

  <div class="results-layout-wrap">
    <span class="roast-mv-meta-label">Layout:</span>
    <div class="view-switcher" role="group" aria-label="Layout view">
      <button type="button" class="view-btn is-active" id="view-grid-btn" data-view="grid" aria-label="Standard grid view" title="Standard grid view" aria-pressed="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      </button>
      <button type="button" class="view-btn" id="view-compact-btn" data-view="compact" aria-label="Compact grid view" title="Compact grid view" aria-pressed="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="3" width="4" height="4" rx="0.75"></rect>
          <rect x="3" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="10" width="4" height="4" rx="0.75"></rect>
          <rect x="3" y="17" width="4" height="4" rx="0.75"></rect>
          <rect x="10" y="17" width="4" height="4" rx="0.75"></rect>
          <rect x="17" y="17" width="4" height="4" rx="0.75"></rect>
        </svg>
      </button>
      <button type="button" class="view-btn" id="view-list-btn" data-view="list" aria-label="List view" title="List view" aria-pressed="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Roasts Grid (Live Catalog) -->
<div class="roasts-grid" id="roasts-grid">
  {% include category-section.html category="blend" title="Blends" show_break=true %}
  {% include category-section.html category="seasonal" title="Seasonals" show_break=true %}
  {% include category-section.html category="single origin" title="Single Origins" show_break=true %}
  {% include category-section.html category="custom" title="Custom" show_break=true %}
  {% include category-section.html category="subscriptions" title="Subscriptions" show_break=true %}
  {% include category-section.html category="flight" title="Flights" show_break=true %}
</div>

<!-- Empty Filter State -->
<div id="roasts-empty-filters" class="roasts-empty-state" style="display: none; text-align: center; margin: 3rem auto; max-width: 28rem;">
  <p style="font-size: 1.05rem; color: #6e5e54; margin-bottom: 1.25rem;">No coffees match your current filter combination.</p>
  <button type="button" id="reset-filters-btn" class="action-pill-btn btn-secondary-pill">Reset Filters</button>
</div>

<!-- Filters Preview Engine -->
<script src="{{ '/js/filters-preview.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
