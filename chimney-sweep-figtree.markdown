---
layout: default
title: "Chimney Sweep — Figtree Font Preview"
permalink: /chimney-sweep-figtree/
---

<!-- Figtree Google Font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">

<div class="figtree-preview-wrapper" id="figtree-preview-wrapper">

  <!-- Interactive Font Preview Toolbar -->
  <aside class="figtree-preview-toolbar" aria-label="Font Preview Controls">
    <div class="figtree-toolbar-top">
      <div class="figtree-toolbar-brand">
        <span class="figtree-toolbar-badge">Font Preview</span>
        <span class="figtree-toolbar-title">Figtree</span>
        <span class="figtree-toolbar-meta">Geometric / Friendly Sans &middot; Erik Kennedy</span>
      </div>

      <!-- Page Switcher Tabs -->
      <div class="figtree-page-tabs">
        <a href="/subscriptions-figtree/" class="figtree-tab-btn">Subscriptions Page</a>
        <a href="/chimney-sweep-figtree/" class="figtree-tab-btn is-active">Chimney Sweep (Detail)</a>
      </div>
    </div>

    <div class="figtree-toolbar-controls">
      <!-- Font Variant Modes -->
      <div class="figtree-control-group">
        <span class="figtree-control-label">Font Application:</span>
        <div class="figtree-btn-group" id="figtree-mode-group">
          <button type="button" class="figtree-btn is-active" data-mode="figtree-all" title="Apply Figtree everywhere on the page">
            Figtree (Full Site)
          </button>
          <button type="button" class="figtree-btn" data-mode="figtree-display" title="Figtree for headers, buttons, prices, & navigation; Lora for body">
            Figtree Display + Lora Body
          </button>
          <button type="button" class="figtree-btn" data-mode="original" title="Revert to current site fonts (Montserrat + Lora)">
            Original Site Fonts (Montserrat + Lora)
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="figtree-control-group figtree-control-group--right">
        <button type="button" class="figtree-btn figtree-btn--secondary" id="specimen-toggle-btn" aria-expanded="false">
          <span class="btn-icon">Aa</span> Show Font Specimen &amp; Comparison
        </button>
        <a href="/roasts/chimney-sweep/" class="figtree-link-plain" target="_blank" rel="noopener">Open Live Chimney Sweep Page &nearr;</a>
      </div>
    </div>

    <!-- Collapsible Font Specimen / Comparison Drawer -->
    <div class="figtree-specimen-drawer" id="figtree-specimen-drawer" style="display: none;">
      <div class="figtree-specimen-grid">
        <!-- Figtree Specimen -->
        <div class="figtree-specimen-card font-sample-figtree">
          <div class="specimen-header">
            <h4>Figtree (Candidate)</h4>
            <span class="specimen-tag">Geometric &bull; Modern &bull; High Legibility</span>
          </div>
          <div class="specimen-alphabet">
            <p class="sample-lg">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
            <p class="sample-nums">0 1 2 3 4 5 6 7 8 9 &nbsp;&bull;&nbsp; $12 &middot; $14 &middot; $15 &middot; $28 &middot; $70 &middot; 12oz &middot; 5lb</p>
          </div>
          <div class="specimen-weights">
            <span style="font-weight: 300;">Light 300</span>
            <span style="font-weight: 400;">Regular 400</span>
            <span style="font-weight: 500;">Medium 500</span>
            <span style="font-weight: 600;">SemiBold 600</span>
            <span style="font-weight: 700;">Bold 700</span>
            <span style="font-weight: 800;">ExtraBold 800</span>
          </div>
          <p class="specimen-blurb">
            Examine how the clean geometry renders prices ($12, $14, $28, $70), specifications labels, and button CTAs.
          </p>
        </div>

        <!-- Montserrat Specimen -->
        <div class="figtree-specimen-card font-sample-montserrat">
          <div class="specimen-header">
            <h4>Montserrat (Current Display Font)</h4>
            <span class="specimen-tag">Classic Urban Geometric</span>
          </div>
          <div class="specimen-alphabet">
            <p class="sample-lg">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
            <p class="sample-nums">0 1 2 3 4 5 6 7 8 9 &nbsp;&bull;&nbsp; $12 &middot; $14 &middot; $15 &middot; $28 &middot; $70 &middot; 12oz &middot; 5lb</p>
          </div>
          <div class="specimen-weights">
            <span style="font-weight: 300;">Light 300</span>
            <span style="font-weight: 400;">Regular 400</span>
            <span style="font-weight: 500;">Medium 500</span>
            <span style="font-weight: 600;">SemiBold 600</span>
            <span style="font-weight: 700;">Bold 700</span>
            <span style="font-weight: 800;">ExtraBold 800</span>
          </div>
          <p class="specimen-blurb">
            Notice Montserrat's wider tracking and sharp diagonals compared to Figtree's more compact footprint.
          </p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Chimney Sweep Product Detail Layout -->
  {% assign r = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign roast_prices = r.price %}
  {% assign sizes = "" | split: "," %}
  {% for entry in roast_prices %}
    {% assign sizes = sizes | push: entry[0] %}
  {% endfor %}
  {% assign first_size = sizes.first %}
  {% assign first_price = roast_prices[first_size] %}
  {% assign first_eff = first_price %}

  <div class="sleek-detail-layout">
    <!-- Left Column: Artwork Showcase -->
    <div class="sleek-detail-visual-col">
      <img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="Chimney Sweep" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
      <div class="sleek-detail-bird-label">Chimney Swift</div>
      <div class="sleek-detail-fun-fact">Chimney swifts cannot perch upright; their tiny claws are built strictly for clinging vertically to rough chimney brick and hollow trees after a full day on the wing.</div>
    </div>

    <!-- Right Column: Purchasing, Specifications & Lot History -->
    <div class="sleek-detail-info-col">
      <!-- Category & Status Badges -->
      <div class="sleek-detail-category-row">
        <span class="sleek-detail-cat-badge">{{ r.category }}</span>
        {% if r.best_seller %}
          <span class="sleek-detail-cat-badge sleek-detail-cat-badge--bestseller">&starf; Best Seller</span>
        {% endif %}
      </div>

      <!-- Title & Subtitle -->
      <h1 class="sleek-detail-title">{{ r.title }}</h1>

      <!-- Tasting Notes Banner -->
      <div class="sleek-detail-tasting-banner">
        {{ r.tasting_notes | replace: ", ", " &middot; " }}
      </div>

      <!-- Roast Level Dots & Name -->
      <div class="sleek-detail-roast-level">
        <span class="roast-label-tag">Roast:</span>
        <span class="roast-dots">
          <span class="roast-dot roast-dot-1"></span>
          <span class="roast-dot roast-dot-2"></span>
          <span class="roast-dot roast-dot-3"></span>
          <span class="roast-dot"></span>
          <span class="roast-dot"></span>
        </span>
        <span class="sleek-detail-roast-name">Full City (medium)</span>
      </div>

      <!-- Roast Description -->
      <div class="sleek-detail-description">
        <p>{{ r.description }}</p>
      </div>

      <!-- Tactile Buy Box -->
      <div class="sleek-detail-buy-box">
        <div class="sleek-buy-price-row">
          <div>
            <span class="price-label-tag">Price</span>
            <span class="sleek-buy-price-val" id="roast-detail-price">${{ first_eff }}</span>
          </div>
          <span class="sleek-buy-price-note">Roasted to order</span>
        </div>

        <div class="sleek-buy-field">
          <label for="order-size-select">Bag Size</label>
          <select id="order-size-select" class="subscribe-select" data-label="Bag Size" style="width: 100%;">
            {% for s in sizes %}
              <option value="{{ s }}"{% if forloop.first %} selected{% endif %}>{{ s }}</option>
            {% endfor %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label for="order-grind-select">Grind Preparation</label>
          <select id="order-grind-select" class="subscribe-select" data-label="Grind" style="width: 100%;">
            {% include grind-options.html %}
          </select>
        </div>

        <div class="sleek-buy-field">
          <label>Purchase Option</label>
          <div class="roast-purchase-toggle" role="radiogroup" aria-label="Purchase Option" style="display: flex; gap: 0.5rem; width: 100%;">
            <button type="button" role="radio" aria-checked="true" class="roast-purchase-toggle-btn is-active" data-val="onetime" style="flex: 1; padding: 0.55rem; font-size: 0.76rem; font-weight: 500;">One-Time Purchase</button>
            <button type="button" role="radio" aria-checked="false" class="roast-purchase-toggle-btn" data-val="subscribe" style="flex: 1; padding: 0.55rem; font-size: 0.76rem; font-weight: 500;">Subscribe</button>
          </div>
        </div>

        <div id="sub-details-panel" class="sleek-buy-field" style="display: none;">
          <label for="sub-freq-select">Delivery Frequency</label>
          <select id="sub-freq-select" class="subscribe-select" data-label="Frequency" style="width: 100%;">
            {% for f in r.subscription.frequencies %}
              <option value="{{ f }}">{{ f }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="sleek-buy-add-btn add-to-order-btn" id="add-to-cart-btn">
          Add to Cart
        </button>
      </div>

      <!-- Specifications Grid -->
      <div class="sleek-spec-wrap">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Blend Specifications</h2>
        </div>

        <div class="sleek-spec-grid">
          <div class="sleek-spec-tile">
            <span class="sleek-spec-label">Recommended Brew</span>
            <span class="sleek-spec-val">{{ r.brewing_method }}</span>
          </div>

          <div class="sleek-spec-tile is-full-width">
            <span class="sleek-spec-label">Component Origins</span>
            <span class="sleek-spec-val">{{ r.origins | join: " &middot; " }}</span>
          </div>
        </div>
      </div>

      <!-- Lot & Harvest / Recipe History -->
      {% if r.history and r.history.size > 0 %}
      <div class="sleek-history-section">
        <div class="sleek-spec-section-header">
          <h2 class="sleek-spec-heading">Recipe History</h2>
          <span class="sleek-spec-subheading">Crop Traceability</span>
        </div>

        <div class="sleek-history-list">
          {% for h in r.history %}
            <div class="sleek-history-card">
              <div class="sleek-history-card-top">
                <div class="sleek-history-lot-title">
                  Recipe Version {{ forloop.index }}
                </div>
                <span class="sleek-history-tag-date">{{ h.date }}{% if forloop.first %} &middot; Current{% endif %}</span>
              </div>

              {% if h.components %}
                <div class="sleek-history-chips-row">
                  {% for c in h.components %}
                    <span class="sleek-history-chip">
                      <span class="chip-k">{{ c.name }}:</span>
                      {% if c.ratio %}<span class="chip-v">{{ c.ratio }}</span>{% endif %}
                    </span>
                  {% endfor %}
                </div>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}

    </div>
  </div>

</div>

<!-- 
  ============================================================
  CSS COMPLETELY ENCOMPASSED IN THIS PREVIEW PAGE
  No changes to _sass or css/main.css
  ============================================================
-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');

  /* Base preview variables */
  :root {
    --preview-font-figtree: 'Figtree', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --preview-font-montserrat: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --preview-font-lora: "Lora", Georgia, "Times New Roman", serif;
  }

  /* -------------------------------------------------------------------------
     Interactive Toolbar Styling
     ------------------------------------------------------------------------- */
  .figtree-preview-toolbar {
    background: #f7f3ec;
    border: 1px solid rgba(44, 30, 20, 0.12);
    border-radius: 12px;
    padding: 1.15rem 1.4rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
    box-shadow: 0 4px 18px rgba(44, 30, 20, 0.04);
  }

  .figtree-toolbar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid rgba(44, 30, 20, 0.08);
  }

  .figtree-toolbar-brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  .figtree-toolbar-badge {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: #2c1e14;
    color: #faf8f5;
    padding: 0.22rem 0.55rem;
    border-radius: 4px;
  }

  .figtree-toolbar-title {
    font-family: var(--preview-font-figtree) !important;
    font-size: 1.15rem;
    font-weight: 700;
    color: #2c1e14;
  }

  .figtree-toolbar-meta {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.8rem;
    color: #7d6b5e;
  }

  .figtree-page-tabs {
    display: inline-flex;
    gap: 0.4rem;
    background: rgba(44, 30, 20, 0.06);
    padding: 0.25rem;
    border-radius: 8px;
  }

  .figtree-tab-btn {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
    color: #554133;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .figtree-tab-btn:hover {
    color: #2c1e14;
    background: rgba(255, 255, 255, 0.6);
  }

  .figtree-tab-btn.is-active {
    background: #ffffff;
    color: #2c1e14;
    box-shadow: 0 1px 4px rgba(44, 30, 20, 0.08);
  }

  .figtree-toolbar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    padding-top: 0.85rem;
  }

  .figtree-control-group {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  .figtree-control-label {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #5a4536;
  }

  .figtree-btn-group {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .figtree-btn {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.76rem;
    font-weight: 600;
    padding: 0.38rem 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(44, 30, 20, 0.16);
    background: #ffffff;
    color: #332317;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1.25;
  }

  .figtree-btn:hover {
    border-color: #2c1e14;
    background: #fdfcfb;
    color: #2c1e14;
  }

  .figtree-btn.is-active {
    background: #2c1e14;
    color: #faf8f5;
    border-color: #2c1e14;
    box-shadow: 0 2px 6px rgba(44, 30, 20, 0.15);
  }

  .figtree-btn--secondary {
    background: #efebe4;
    border-color: rgba(44, 30, 20, 0.18);
  }

  .figtree-link-plain {
    font-family: var(--preview-font-figtree) !important;
    font-size: 0.76rem;
    font-weight: 600;
    color: #6a5342;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .figtree-link-plain:hover {
    color: #2c1e14;
  }

  /* Specimen comparison drawer */
  .figtree-specimen-drawer {
    margin-top: 1.2rem;
    padding-top: 1.2rem;
    border-top: 1px dashed rgba(44, 30, 20, 0.15);
    animation: fadeIn 0.2s ease;
  }

  .figtree-specimen-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: 1.2rem;
  }

  .figtree-specimen-card {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.1);
    border-radius: 8px;
    padding: 1.2rem 1.4rem;
  }

  .specimen-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.8rem;
    border-bottom: 1px solid rgba(44, 30, 20, 0.08);
    padding-bottom: 0.4rem;
  }

  .specimen-header h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2c1e14;
  }

  .specimen-tag {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #887465;
  }

  .font-sample-figtree {
    font-family: var(--preview-font-figtree) !important;
  }
  .font-sample-figtree * {
    font-family: var(--preview-font-figtree) !important;
  }

  .font-sample-montserrat {
    font-family: var(--preview-font-montserrat) !important;
  }
  .font-sample-montserrat * {
    font-family: var(--preview-font-montserrat) !important;
  }

  .sample-lg {
    font-size: 1.05rem;
    line-height: 1.45;
    margin: 0 0 0.5rem;
    letter-spacing: 0.02em;
    word-break: break-word;
  }

  .sample-nums {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.8rem;
    color: #2c1e14;
  }

  .specimen-weights {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 1rem;
    font-size: 0.78rem;
    padding: 0.6rem 0;
    border-top: 1px dashed rgba(44, 30, 20, 0.1);
    border-bottom: 1px dashed rgba(44, 30, 20, 0.1);
    margin-bottom: 0.7rem;
    color: #3f2e22;
  }

  .specimen-blurb {
    font-size: 0.75rem;
    line-height: 1.4;
    color: #6a5a4e;
    margin: 0;
  }

  /* Detail Tags */
  .roast-label-tag,
  .price-label-tag {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8a7f6e;
    display: inline-block;
  }
  .price-label-tag {
    display: block;
    margin-bottom: 0.2rem;
  }

  /* -------------------------------------------------------------------------
     DEFAULT MODE: FIGTREE (FULL SITE)
     All UI, titles, badges, prices, links, descriptors, cards, and body
     ------------------------------------------------------------------------- */
  body:not(.font-mode-original):not(.font-mode-display-only),
  body:not(.font-mode-original):not(.font-mode-display-only) * {
    font-family: var(--preview-font-figtree) !important;
  }

  /* -------------------------------------------------------------------------
     MODE 2: FIGTREE DISPLAY + LORA BODY
     Figtree for all headings, titles, buttons, pills, tags, prices, inputs, nav
     Lora for paragraphs, descriptors, and reading prose
     ------------------------------------------------------------------------- */
  body.font-mode-display-only h1,
  body.font-mode-display-only h2,
  body.font-mode-display-only h3,
  body.font-mode-display-only h4,
  body.font-mode-display-only h5,
  body.font-mode-display-only h6,
  body.font-mode-display-only .sleek-detail-title,
  body.font-mode-display-only .sleek-detail-cat-badge,
  body.font-mode-display-only .sleek-detail-roast-name,
  body.font-mode-display-only .sleek-buy-price-val,
  body.font-mode-display-only .sleek-buy-price-note,
  body.font-mode-display-only .sleek-buy-field label,
  body.font-mode-display-only .subscribe-select,
  body.font-mode-display-only .roast-purchase-toggle-btn,
  body.font-mode-display-only .add-to-order-btn,
  body.font-mode-display-only .sleek-spec-heading,
  body.font-mode-display-only .sleek-spec-subheading,
  body.font-mode-display-only .sleek-spec-label,
  body.font-mode-display-only .sleek-spec-val,
  body.font-mode-display-only .sleek-history-lot-title,
  body.font-mode-display-only .sleek-history-tag-date,
  body.font-mode-display-only .sleek-history-chip,
  body.font-mode-display-only .chip-k,
  body.font-mode-display-only .chip-v,
  body.font-mode-display-only .roast-label-tag,
  body.font-mode-display-only .price-label-tag,
  body.font-mode-display-only .sleek-brand-inline-name,
  body.font-mode-display-only .sleek-brand-inline-sub,
  body.font-mode-display-only .sleek-nav-link,
  body.font-mode-display-only .sleek-nav-dropdown-link,
  body.font-mode-display-only .sleek-nav-menu-header,
  body.font-mode-display-only .sleek-nav-cart-label,
  body.font-mode-display-only .sleek-nav-cart-count,
  body.font-mode-display-only button,
  body.font-mode-display-only .figtree-preview-toolbar *,
  body.font-mode-display-only .sleek-bottom-nav-footer * {
    font-family: var(--preview-font-figtree) !important;
  }

  body.font-mode-display-only .sleek-detail-description,
  body.font-mode-display-only .sleek-detail-description p,
  body.font-mode-display-only .sleek-detail-tasting-banner,
  body.font-mode-display-only .sleek-detail-fun-fact,
  body.font-mode-display-only .sleek-history-desc,
  body.font-mode-display-only p {
    font-family: var(--preview-font-lora) !important;
  }

  /* -------------------------------------------------------------------------
     MODE 3: ORIGINAL SITE FONTS (MONTSERRAT + LORA)
     Reverts back to standard theme stylesheets without Figtree overrides
     ------------------------------------------------------------------------- */
  body.font-mode-original h1,
  body.font-mode-original h2,
  body.font-mode-original h3,
  body.font-mode-original h4,
  body.font-mode-original h5,
  body.font-mode-original h6,
  body.font-mode-original .sleek-detail-title,
  body.font-mode-original .sleek-detail-cat-badge,
  body.font-mode-original .sleek-detail-roast-name,
  body.font-mode-original .sleek-buy-price-val,
  body.font-mode-original .sleek-buy-price-note,
  body.font-mode-original .sleek-buy-field label,
  body.font-mode-original .subscribe-select,
  body.font-mode-original .roast-purchase-toggle-btn,
  body.font-mode-original .add-to-order-btn,
  body.font-mode-original .sleek-spec-heading,
  body.font-mode-original .sleek-spec-subheading,
  body.font-mode-original .sleek-spec-label,
  body.font-mode-original .sleek-history-lot-title,
  body.font-mode-original .sleek-history-tag-date,
  body.font-mode-original .sleek-history-chip,
  body.font-mode-original .chip-k,
  body.font-mode-original .chip-v,
  body.font-mode-original .roast-label-tag,
  body.font-mode-original .price-label-tag,
  body.font-mode-original .sleek-brand-inline-name,
  body.font-mode-original .sleek-brand-inline-sub,
  body.font-mode-original .sleek-nav-link,
  body.font-mode-original .sleek-nav-dropdown-link,
  body.font-mode-original .sleek-nav-menu-header,
  body.font-mode-original .sleek-nav-cart-label,
  body.font-mode-original .sleek-nav-cart-count {
    font-family: var(--preview-font-montserrat) !important;
  }

  body.font-mode-original .sleek-detail-description,
  body.font-mode-original .sleek-detail-description p,
  body.font-mode-original .sleek-detail-tasting-banner,
  body.font-mode-original .sleek-detail-fun-fact,
  body.font-mode-original .sleek-history-desc,
  body.font-mode-original p {
    font-family: var(--preview-font-lora) !important;
  }

  /* Keep the preview toolbar itself in Figtree so controls remain clean and legible */
  body.font-mode-original .figtree-preview-toolbar,
  body.font-mode-original .figtree-preview-toolbar * {
    font-family: var(--preview-font-figtree) !important;
  }
</style>

<!-- Roast detail interaction script -->
<script src="{{ '/js/roast-detail.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initRoastDetail({
    roastSlug: {{ r.slug | jsonify }},
    pricesOneTime: {
      {% for s in sizes %}
        {% assign price = roast_prices[s] %}
        {{ s | jsonify }}: { price: {{ price }}, effective: {{ price }} }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    },
    pricesSub: {
      {% for entry in roast_prices %}
        {{ entry[0] | jsonify }}: {{ entry[1] }}{% unless forloop.last %},{% endunless %}
      {% endfor %}
    }
  });
</script>

<!-- Interactive Script for Preview Switcher -->
<script>
  (function() {
    const STORAGE_KEY = 'ywr-font-preview-mode';
    const savedMode = localStorage.getItem(STORAGE_KEY) || 'figtree-all';

    function setFontMode(mode) {
      document.body.classList.remove('font-mode-original', 'font-mode-display-only');
      if (mode === 'original') {
        document.body.classList.add('font-mode-original');
      } else if (mode === 'figtree-display') {
        document.body.classList.add('font-mode-display-only');
      }
      localStorage.setItem(STORAGE_KEY, mode);

      document.querySelectorAll('#figtree-mode-group .figtree-btn').forEach(btn => {
        btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
      });
    }

    // Initialize mode
    setFontMode(savedMode);

    // Setup mode button handlers
    document.querySelectorAll('#figtree-mode-group .figtree-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        setFontMode(mode);
      });
    });

    // Toggle specimen drawer
    const specimenBtn = document.getElementById('specimen-toggle-btn');
    const specimenDrawer = document.getElementById('figtree-specimen-drawer');
    if (specimenBtn && specimenDrawer) {
      specimenBtn.addEventListener('click', () => {
        const isHidden = specimenDrawer.style.display === 'none';
        specimenDrawer.style.display = isHidden ? 'block' : 'none';
        specimenBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        specimenBtn.classList.toggle('is-active', isHidden);
      });
    }
  })();
</script>
