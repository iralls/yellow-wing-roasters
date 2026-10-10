---
layout: default
title: Roasts
permalink: /roasts/
---

<div class="roasts-header-row">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Roasts</h1>
    <p class="category-intro">Explore our current selection of coffees.</p>
  </div>
  <a href="{{ '/quiz/' | relative_url }}" class="roasts-quiz-cta" title="Find your perfect roast with our interactive quiz">
    <span class="roasts-quiz-cta-icon" aria-hidden="true">✨</span>
    <span>Take the Coffee Quiz</span>
    <span class="roasts-quiz-cta-arrow" aria-hidden="true">→</span>
  </a>
</div>

<!-- Minimizable Filters Drawer with Minimal Multi-Select Dropdowns -->
<div class="filters-bar filters-bar--drawer" id="filters-bar">
  <!-- Top Toggle & Control Bar -->
  <div class="filters-toggle-bar">
    <button type="button" class="filters-drawer-toggle" id="filters-drawer-toggle" aria-expanded="false" aria-controls="filters-drawer-content">
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
      <span class="filters-active-count" id="filters-active-count" style="display: none;">0</span>
      <span class="filters-drawer-chevron" aria-hidden="true">&darr;</span>
    </button>

    <div class="filters-tags-preview" id="filters-tags-preview" aria-live="polite">
      <!-- Active tag chips rendered dynamically -->
    </div>

    <button type="button" class="filters-clear-all" id="filters-clear-all">Clear all</button>

    <div class="filter-group filter-group--view">
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

  <!-- Expandable Drawer with Minimal Multi-Select Dropdowns -->
  <div class="filters-drawer-content" id="filters-drawer-content" role="region" aria-label="Coffee filters">
    <div class="filters-drawer-row">
      <!-- Type Multi-Select -->
      <div class="min-multiselect" data-filter="type">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-type">
          <span class="mms-label">Type:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-type">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Type</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="type">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-type"></div>
        </div>
      </div>

      <!-- Roast Level Multi-Select -->
      <div class="min-multiselect" data-filter="level">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-level">
          <span class="mms-label">Roast:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-level">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Roast Level</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="level">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-level"></div>
        </div>
      </div>

      <!-- Flavor Profile Multi-Select -->
      <div class="min-multiselect" data-filter="flavor">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-flavor">
          <span class="mms-label">Flavor:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-flavor">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Flavor Profile</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="flavor">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-flavor"></div>
        </div>
      </div>

      <!-- Origin Multi-Select -->
      <div class="min-multiselect" data-filter="origin">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-origin">
          <span class="mms-label">Origin:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-origin">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Origin</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="origin">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-origin"></div>
        </div>
      </div>

      <!-- Process Multi-Select -->
      <div class="min-multiselect" data-filter="process">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-process">
          <span class="mms-label">Process:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-process">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Process</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="process">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-process"></div>
        </div>
      </div>

      <!-- Brewing Method Multi-Select -->
      <div class="min-multiselect" data-filter="brewing">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-brewing">
          <span class="mms-label">Brew:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-brewing">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Brewing Method</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="brewing">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-brewing"></div>
        </div>
      </div>

      <!-- Certification Multi-Select -->
      <div class="min-multiselect" data-filter="cert">
        <button type="button" class="min-multiselect-trigger" aria-haspopup="listbox" aria-expanded="false" id="trigger-filter-cert">
          <span class="mms-label">Cert:</span>
          <span class="mms-value">All</span>
          <span class="mms-chevron" aria-hidden="true">&darr;</span>
        </button>
        <div class="min-multiselect-menu" role="listbox" aria-multiselectable="true" aria-labelledby="trigger-filter-cert">
          <div class="mms-menu-header">
            <span class="mms-menu-title">Certification</span>
            <button type="button" class="mms-menu-clear" data-clear-dropdown="cert">Clear</button>
          </div>
          <div class="mms-menu-options" id="mms-options-cert"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Roasts Grid -->
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
  <button type="button" id="reset-filters-btn" class="action-pill-btn btn-secondary-pill">Reset All Filters</button>
</div>

<!-- JavaScript for Dynamic Filters -->
<script src="{{ '/js/catalog-filters.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

