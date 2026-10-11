---
layout: sleek
title: "Sleek & Minimal Design Studio"
permalink: /sleek-preview/
sitemap: false
---

<div class="sleek-intro-banner">
  <span class="sleek-intro-tag">Design Studio & Comparison Lab</span>
  <h1 class="sleek-intro-title">Refining Yellow Wing to Sleek & Minimal</h1>
  <p class="sleek-intro-desc">
    Interactive sandbox comparing modern specialty coffee aesthetics against the current production design. Test live component variations below, or jump directly into the full-page prototypes.
  </p>

  <div class="sleek-hub-tabs" role="tablist" aria-label="Sleek Preview Modules">
    <button type="button" class="sleek-hub-tab-btn is-active" data-tab="cards" role="tab" aria-selected="true">
      <span>🎴 1. Roast Cards & Badges</span>
    </button>
    <button type="button" class="sleek-hub-tab-btn" data-tab="specs" role="tab" aria-selected="false">
      <span>📊 2. Coffee Specifications & Lot History</span>
    </button>
    <button type="button" class="sleek-hub-tab-btn" data-tab="filters" role="tab" aria-selected="false">
      <span>🔍 3. Filter Systems</span>
    </button>
    <button type="button" class="sleek-hub-tab-btn" data-tab="directory" role="tab" aria-selected="false">
      <span>🚀 4. Full-Page Prototypes</span>
    </button>
  </div>
</div>

<!-- ==========================================
     MODULE 1: ROAST CARDS & SURFACES
     ========================================== -->
<div class="sleek-section is-active" id="section-cards">
  <div class="sleek-card-box">
    <div class="sleek-card-box-header">
      <div>
        <h2 class="sleek-card-box-title">Roast Cards: High-Level Descriptor & Resting Clarity</h2>
        <p class="sleek-card-box-desc">
          Compare the current production card (with multi-corner badges and heavy opaque hover overlay) against sleek cards that feature the high-level descriptor ("balanced and smooth") at rest, preserve status badges like "Mid-Molt", and reveal detailed tasting notes cleanly on hover.
        </p>
      </div>

      <div class="sleek-control-pill-group" role="group" aria-label="Card Surface Selector">
        <button type="button" class="sleek-control-pill-btn is-active" data-surface-btn="linen">Warm Linen</button>
        <button type="button" class="sleek-control-pill-btn" data-surface-btn="white">Studio White</button>
        <button type="button" class="sleek-control-pill-btn" data-surface-btn="pastel">Production Pastel</button>
      </div>
    </div>

    {% assign sample_roast = site.roasts | where: "slug", "early-bird" | first %}
    {% if sample_roast == nil %}
      {% assign sample_roast = site.roasts.first %}
    {% endif %}

    <div class="sleek-comparison-grid">
      <!-- Option A: Current Production Card -->
      <div class="sleek-col-wrap">
        <div class="sleek-col-header">
          <span class="sleek-col-title">Current Production</span>
          <span class="sleek-col-badge sleek-col-badge--current">Production</span>
        </div>
        <div>
          {% include roast-card.html roast=sample_roast %}
        </div>
        <p style="font-size: 0.8rem; color: #887060; margin-top: 0.75rem; line-height: 1.4;">
          <strong>Issues:</strong> Hovering triggers an opaque 95% blur takeover covering the artwork with bag-size pricing tables; multiple badges crowd the corners; tinted category tile.
        </p>
      </div>

      <!-- Option B: Sleek Editorial (Recommended) -->
      <div class="sleek-col-wrap">
        <div class="sleek-col-header">
          <span class="sleek-col-title">Sleek Editorial</span>
          <span class="sleek-col-badge sleek-col-badge--recommended">Recommended</span>
        </div>

        <div class="sleek-roast-card" id="demo-sleek-card" data-surface="linen">
          <div class="sleek-card-visual">
            <!-- Top-left: Category tag pill only (No status overlap!) -->
            <div class="sleek-card-tags-left">
              <span class="sleek-card-tag">{{ sample_roast.category | upcase }}</span>
            </div>

            {% if sample_roast.best_seller %}
              <div class="sleek-card-tag--best-seller">★ Best Seller</div>
            {% endif %}

            <img src="{{ '/images/' | append: sample_roast.mascot_file | relative_url }}" alt="{{ sample_roast.title }}" class="sleek-card-mascot" loading="lazy">

            <!-- Hover reveal bar: Tasting notes revealed smoothly on hover -->
            <div class="sleek-card-reveal-bar">
              <span>{{ sample_roast.tasting_notes | replace: ", ", " · " | downcase }}</span>
            </div>
          </div>

          <!-- Horizontal Divider Status Line -->
          {% if sample_roast.status and site.data.statuses[sample_roast.status].badge %}
            {% assign s_info = site.data.statuses[sample_roast.status] %}
            <div class="sleek-card-divider-status sleek-card-divider-status--{{ sample_roast.status }}">
              <span class="sleek-status-pip"></span>
              <span class="sleek-status-text">{{ s_info.badge }}</span>
              <span class="sleek-status-note">· profile dialing in</span>
            </div>
          {% endif %}

          <div class="sleek-card-body">
            <div class="sleek-card-eyebrow">
              <div class="sleek-card-dots">
                {% include roast-dots.html roast=sample_roast %}
              </div>
            </div>

            <h3 class="sleek-card-title">{{ sample_roast.title }}</h3>
            {% if sample_roast.subtitle %}
              <div class="sleek-card-subtitle">{{ sample_roast.subtitle }}</div>
            {% endif %}

            <!-- High-level descriptor ("balanced and smooth") in resting state -->
            <p class="sleek-card-descriptor">{{ sample_roast.descriptor | downcase }}</p>

            <div class="sleek-card-footer">
              <div class="sleek-card-price">
                {% if sample_roast.temporary_price and sample_roast.temporary_price["12oz"] %}
                  <s>${{ sample_roast.price["12oz"] }}</s> <span style="color:#b45309;">${{ sample_roast.temporary_price["12oz"] }}</span><span class="sleek-card-price-sub">/ 12oz</span>
                {% elsif sample_roast.price["12oz"] %}
                  ${{ sample_roast.price["12oz"] }}<span class="sleek-card-price-sub">/ 12oz</span>
                {% endif %}
              </div>
            </div>
          </div>
        </div>

        <p style="font-size: 0.8rem; color: #887060; margin-top: 0.75rem; line-height: 1.4;">
          <strong>Advantages:</strong> Artwork breathes; resting text uses high-level descriptor ("balanced and smooth"); detailed tasting notes reveal smoothly on hover; status badge ("Mid-Molt") is preserved; FTO/organic pill clutter removed.
        </p>
      </div>

      <!-- Option C: Studio Minimal -->
      <div class="sleek-col-wrap">
        <div class="sleek-col-header">
          <span class="sleek-col-title">Studio Minimal</span>
          <span class="sleek-col-badge sleek-col-badge--ultra">Ultra Minimal</span>
        </div>

        <div class="sleek-roast-card" data-surface="white" style="box-shadow: none; border-color: rgba(44,30,20,0.12);">
          <div class="sleek-card-visual" style="min-height: 12rem; padding: 2rem 1rem;">
            <div class="sleek-card-tags-left">
              <span class="sleek-card-tag">{{ sample_roast.category | upcase }}</span>
              {% if sample_roast.status %}
                {% assign s_info = site.data.statuses[sample_roast.status] %}
                <span class="sleek-card-status-badge sleek-card-status-badge--{{ sample_roast.status }}">
                  {{ s_info.badge }}
                </span>
              {% endif %}
            </div>
            <img src="{{ '/images/' | append: sample_roast.mascot_file | relative_url }}" alt="{{ sample_roast.title }}" class="sleek-card-mascot" style="max-height: 8.5rem;" loading="lazy">
          </div>

          <div class="sleek-card-body" style="padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <h3 class="sleek-card-title" style="font-size: 1.05rem;">{{ sample_roast.title }}</h3>
              <div class="sleek-card-price" style="font-size: 0.88rem;">${{ sample_roast.price["12oz"] }}</div>
            </div>
            <p class="sleek-card-descriptor" style="margin: 0.2rem 0 0.5rem;">{{ sample_roast.descriptor }}</p>
            <div style="font-family: Montserrat, sans-serif; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7060;">
              {{ sample_roast.category | upcase }} · Level {{ sample_roast.roast_level }}
            </div>
          </div>
        </div>

        <p style="font-size: 0.8rem; color: #887060; margin-top: 0.75rem; line-height: 1.4;">
          <strong>Advantages:</strong> Pure crisp white ground; zero decorative frames; clean typography inspired by boutique Nordic roasters.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     MODULE 2: COFFEE SPECIFICATIONS & LOT HISTORY
     ========================================== -->
<div class="sleek-section" id="section-specs">
  <div class="sleek-card-box">
    <div class="sleek-card-box-header">
      <div>
        <h2 class="sleek-card-box-title">Coffee Specifications & Lot Traceability</h2>
        <p class="sleek-card-box-desc">
          Replacing simple HTML tables with tactile modern spec tiles and rich Lot & Harvest History cards that clearly show lot names, regions, and terroir.
        </p>
      </div>
    </div>

    {% assign spec_roast = site.roasts | where: "slug", "colombia-supremo" | first %}

    <!-- Tactile Spec Grid -->
    <div class="sleek-spec-wrap">
      <div class="sleek-spec-section-header">
        <h3 class="sleek-spec-heading">Tactile Spec Grid Tiles</h3>
        <span class="sleek-spec-subheading">Elevated beyond simple table rows</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">📍 Region</span>
          <span class="sleek-spec-val">{{ spec_roast.region }}</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">⛰️ Terroir / Elevation</span>
          <span class="sleek-spec-val">{{ spec_roast.elevation }}</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">💧 Processing</span>
          <span class="sleek-spec-val">{{ spec_roast.processing_method }}</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">☕ Recommended Brew</span>
          <span class="sleek-spec-val">{{ spec_roast.brewing_method }}</span>
        </div>
      </div>
    </div>

    <!-- Structured Lot & Terroir History Card -->
    <div class="sleek-history-section">
      <div class="sleek-spec-section-header">
        <h3 class="sleek-spec-heading">Lot & Harvest History with Terroir Breakdown</h3>
        <span class="sleek-spec-subheading">Full Lot Traceability</span>
      </div>

      <div class="sleek-history-list">
        {% for h in spec_roast.history limit:2 %}
          <div class="sleek-history-card">
            <div class="sleek-history-card-top">
              <div class="sleek-history-lot-title">
                {{ h.components.first.name | default: spec_roast.title }}
              </div>
              <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} · Current Lot{% endif %}</span>
            </div>

            <!-- Structured Detail Chips: Lot, Region, Terroir, Process -->
            <div class="sleek-history-chips-row">
              <span class="sleek-history-chip">
                <span class="chip-k">Lot:</span>
                <span class="chip-v">Supremo Preparation</span>
              </span>
              <span class="sleek-history-chip">
                <span class="chip-k">Region:</span>
                <span class="chip-v">{{ spec_roast.region }}</span>
              </span>
              <span class="sleek-history-chip">
                <span class="chip-k">Terroir:</span>
                <span class="chip-v">{{ spec_roast.elevation }}</span>
              </span>
              <span class="sleek-history-chip">
                <span class="chip-k">Process:</span>
                <span class="chip-v">{{ spec_roast.processing_method }}</span>
              </span>
            </div>

            <p class="sleek-history-desc">{{ h.description }}</p>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>

<!-- ==========================================
     MODULE 3: FILTER SYSTEMS
     ========================================== -->
<div class="sleek-section" id="section-filters">
  <div class="sleek-card-box">
    <div class="sleek-card-box-header">
      <div>
        <h2 class="sleek-card-box-title">Minimalist Catalog Filter Systems</h2>
        <p class="sleek-card-box-desc">
          Replacing complex drawers, multi-tiered toggles, and dense dropdown trees with lightweight horizontal filter chips.
        </p>
      </div>
    </div>

    <div class="sleek-header-demo-box">
      <div class="sleek-header-demo-label">Option: Minimalist Horizontal Filter Chips (Instant 1-Click Filtering)</div>
      <div class="sleek-filter-chips-bar" id="demo-filter-chips">
        <button type="button" class="sleek-filter-chip is-active" data-chip="all">All Coffees</button>
        <button type="button" class="sleek-filter-chip" data-chip="single-origin">Single Origins</button>
        <button type="button" class="sleek-filter-chip" data-chip="blend">Blends</button>
        <button type="button" class="sleek-filter-chip" data-chip="seasonal">Seasonals</button>
        <button type="button" class="sleek-filter-chip" data-chip="light">Light Roast</button>
        <button type="button" class="sleek-filter-chip" data-chip="medium">Medium Roast</button>
        <button type="button" class="sleek-filter-chip" data-chip="dark">Dark Roast</button>
      </div>
      <p style="font-size: 0.8rem; color: #887060; margin: 0;">
        <strong>Why it feels sleeker:</strong> Clean, zero-dropdown horizontal pills with instant tactile feedback. Doesn't push catalog items down when expanded.
      </p>
    </div>
  </div>
</div>

<!-- ==========================================
     MODULE 4: FULL-PAGE PROTOTYPES DIRECTORY
     ========================================== -->
<div class="sleek-section" id="section-directory">
  <div class="sleek-card-box">
    <div class="sleek-card-box-header">
      <div>
        <h2 class="sleek-card-box-title">Full-Page Interactive Prototypes</h2>
        <p class="sleek-card-box-desc">
          Step into full-screen prototype pages with your site's authentic brand header and navigation preserved.
        </p>
      </div>
    </div>

    <div class="sleek-comparison-grid">
      <!-- Prototype 1: Catalog -->
      <a href="{{ '/sleek-preview/catalog/' | relative_url }}" class="sleek-roast-card" style="padding: 1.75rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">☕</div>
        <h3 class="sleek-card-title" style="font-size: 1.25rem;">Sleek Catalog Grid</h3>
        <p class="sleek-card-descriptor" style="font-size: 0.9rem; margin-top: 0.5rem;">
          Unified warm linen card surfaces, high-level descriptor resting text, status badges ("Mid-Molt"), tasting notes on hover, and minimal horizontal filter chips.
        </p>
        <div style="font-family: Montserrat, sans-serif; font-size: 0.78rem; font-weight: 800; color: #9c6d12; margin-top: auto; padding-top: 1rem;">
          Launch Catalog Prototype →
        </div>
      </a>

      <!-- Prototype 2: Product Detail -->
      <a href="{{ '/sleek-preview/roast-detail/' | relative_url }}" class="sleek-roast-card" style="padding: 1.75rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏷️</div>
        <h3 class="sleek-card-title" style="font-size: 1.25rem;">Two-Column Studio Detail</h3>
        <p class="sleek-card-descriptor" style="font-size: 0.9rem; margin-top: 0.5rem;">
          Two-column layout: unencumbered mascot art on the left, sticky tactile buy box, tactile spec grid tiles, and rich Lot & Harvest History with terroir on the right.
        </p>
        <div style="font-family: Montserrat, sans-serif; font-size: 0.78rem; font-weight: 800; color: #9c6d12; margin-top: auto; padding-top: 1rem;">
          Launch Detail Prototype →
        </div>
      </a>

      <!-- Prototype 3: Homepage -->
      <a href="{{ '/sleek-preview/home/' | relative_url }}" class="sleek-roast-card" style="padding: 1.75rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏠</div>
        <h3 class="sleek-card-title" style="font-size: 1.25rem;">Minimal Homepage</h3>
        <p class="sleek-card-descriptor" style="font-size: 0.9rem; margin-top: 0.5rem;">
          Airy hero, quiet typography, prominent action links (Explore Roasts / Quiz), and curated seasonal showcase cards.
        </p>
        <div style="font-family: Montserrat, sans-serif; font-size: 0.78rem; font-weight: 800; color: #9c6d12; margin-top: auto; padding-top: 1rem;">
          Launch Homepage Prototype →
        </div>
      </a>
    </div>
  </div>
</div>

<script>
  // Hub Tab Switcher
  const tabBtns = document.querySelectorAll('.sleek-hub-tab-btn');
  const sections = document.querySelectorAll('.sleek-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      sections.forEach(s => s.classList.remove('is-active'));

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const target = document.getElementById('section-' + btn.dataset.tab);
      target.classList.add('is-active');
    });
  });

  // Card Surface Switcher
  const surfaceBtns = document.querySelectorAll('[data-surface-btn]');
  const demoCard = document.getElementById('demo-sleek-card');

  surfaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      surfaceBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      demoCard.setAttribute('data-surface', btn.dataset.surfaceBtn);
    });
  });

  // Filter Chip Switcher (Interactive Demo)
  const chips = document.querySelectorAll('#demo-filter-chips .sleek-filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
    });
  });
</script>
