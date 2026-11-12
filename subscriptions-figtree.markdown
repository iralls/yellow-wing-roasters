---
layout: default
title: "Subscriptions — Figtree Font Preview"
permalink: /subscriptions-figtree/
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
        <a href="/subscriptions-figtree/" class="figtree-tab-btn is-active">Subscriptions Page</a>
        <a href="/chimney-sweep-figtree/" class="figtree-tab-btn">Chimney Sweep (Detail)</a>
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
        <a href="/subscriptions/" class="figtree-link-plain" target="_blank" rel="noopener">Open Live Subscriptions Page &nearr;</a>
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
            Curved lowercase ‘t’, circular geometric bowls, open apertures, and crisp tabular figures designed specifically for clear digital interfaces and packaging.
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
            Wider character width, sharper angles, and traditional architectural uppercase proportions.
          </p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Subscriptions Content Header -->
  <div class="roasts-header-row" style="margin-bottom: 4rem;">
    <div class="roasts-header-main">
      <h1 class="roasts-page-title">Subscriptions</h1>
    </div>
  </div>

  <!-- Subscriptions Cards Grid (Live Data from site.subscriptions) -->
  <div class="sleek-comparison-grid" style="margin-bottom: 4rem;">
    {% include category-section.html category="subscription" %}
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
  body.font-mode-display-only .roasts-page-title,
  body.font-mode-display-only .sleek-card-title,
  body.font-mode-display-only .roast-trans-title,
  body.font-mode-display-only .sleek-card-price,
  body.font-mode-display-only .roast-trans-price,
  body.font-mode-display-only .sleek-card-tag,
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

  body.font-mode-display-only .roast-trans-descriptor,
  body.font-mode-display-only .sleek-card-descriptor,
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
  body.font-mode-original .roasts-page-title,
  body.font-mode-original .sleek-card-title,
  body.font-mode-original .roast-trans-title,
  body.font-mode-original .sleek-card-price,
  body.font-mode-original .roast-trans-price,
  body.font-mode-original .sleek-card-tag,
  body.font-mode-original .sleek-brand-inline-name,
  body.font-mode-original .sleek-brand-inline-sub,
  body.font-mode-original .sleek-nav-link,
  body.font-mode-original .sleek-nav-dropdown-link,
  body.font-mode-original .sleek-nav-menu-header,
  body.font-mode-original .sleek-nav-cart-label,
  body.font-mode-original .sleek-nav-cart-count {
    font-family: var(--preview-font-montserrat) !important;
  }

  body.font-mode-original .roast-trans-descriptor,
  body.font-mode-original .sleek-card-descriptor,
  body.font-mode-original p {
    font-family: var(--preview-font-lora) !important;
  }

  /* Keep the preview toolbar itself in Figtree so controls remain clean and legible */
  body.font-mode-original .figtree-preview-toolbar,
  body.font-mode-original .figtree-preview-toolbar * {
    font-family: var(--preview-font-figtree) !important;
  }
</style>

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
