---
layout: default
title: "Feather Icon CSS Color Preview"
permalink: /feather-preview/
---

<div class="feather-preview-page">

  <!-- Header Section -->
  <div class="feather-preview-header">
    <div class="header-badge-row">
      <span class="preview-badge">CSS Technique Showcase</span>
      <span class="preview-tag">Transparent PNG Recolor</span>
    </div>
    <h1 class="preview-title">Feather Icon Color Lab</h1>
    <p class="preview-lead">
      Test and preview how the transparent Audubon feather cutout can be dynamically rendered in any color, variable, or gradient using pure CSS.
    </p>
  </div>

  <!-- Interactive Control Bar -->
  <div class="feather-toolbar">
    <div class="toolbar-section">
      <span class="toolbar-label">Brand Presets:</span>
      <div class="color-pill-group" id="preset-buttons">
        <button type="button" class="color-pill-btn is-active" data-color="#f0c838" data-name="Yellow Wing Gold">
          <span class="swatch" style="background: #f0c838;"></span> Gold (#f0c838)
        </button>
        <button type="button" class="color-pill-btn" data-color="#2c1e14" data-name="Dark Espresso">
          <span class="swatch" style="background: #2c1e14;"></span> Espresso (#2c1e14)
        </button>
        <button type="button" class="color-pill-btn" data-color="#9c6d12" data-name="Toasted Ochre">
          <span class="swatch" style="background: #9c6d12;"></span> Ochre (#9c6d12)
        </button>
        <button type="button" class="color-pill-btn" data-color="#4d6a50" data-name="Celadon Sage">
          <span class="swatch" style="background: #4d6a50;"></span> Sage (#4d6a50)
        </button>
        <button type="button" class="color-pill-btn" data-color="#b85233" data-name="Terracotta Rust">
          <span class="swatch" style="background: #b85233;"></span> Terracotta (#b85233)
        </button>
        <button type="button" class="color-pill-btn" data-color="#682d38" data-name="Dark Plum / Wine">
          <span class="swatch" style="background: #682d38;"></span> Plum (#682d38)
        </button>
        <button type="button" class="color-pill-btn" data-color="#ffffff" data-name="Pure White">
          <span class="swatch" style="background: #ffffff; border: 1px solid #ddd;"></span> White (#ffffff)
        </button>
      </div>
    </div>

    <div class="toolbar-section toolbar-section--custom">
      <div class="custom-color-picker-wrap">
        <label for="custom-feather-color" class="toolbar-label">Custom Hex:</label>
        <div class="input-inline">
          <input type="color" id="custom-feather-color" value="#f0c838">
          <input type="text" id="custom-hex-text" value="#f0c838" maxlength="7" spellcheck="false">
        </div>
      </div>

      <div class="gradient-toggle-wrap">
        <span class="toolbar-label">Gradients:</span>
        <div class="color-pill-group" id="gradient-buttons">
          <button type="button" class="color-pill-btn" data-gradient="linear-gradient(180deg, #f0c838 0%, #9c6d12 100%)" data-name="Gold to Ochre">
            Gold &rarr; Ochre
          </button>
          <button type="button" class="color-pill-btn" data-gradient="linear-gradient(180deg, #f0c838 0%, #b85233 100%)" data-name="Sunrise Flame">
            Sunrise Ember
          </button>
          <button type="button" class="color-pill-btn" data-gradient="linear-gradient(180deg, #443022 0%, #2c1e14 100%)" data-name="Espresso Velvet">
            Velvet Espresso
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Primary Showcase Arena -->
  <div class="feather-stage-grid">
    
    <!-- Hero Card (Mask-Image: The Recommended Standard) -->
    <div class="stage-card stage-card--hero" id="hero-stage">
      <div class="stage-card-header">
        <div>
          <span class="method-tag">Method 1 (Recommended)</span>
          <h3 class="method-title">CSS <code>mask-image</code> Fill</h3>
        </div>
        <div class="stage-bg-toggles">
          <button type="button" class="bg-toggle is-active" data-bg="cream" title="Light Cream Background">Cream</button>
          <button type="button" class="bg-toggle" data-bg="dark" title="Dark Espresso Background">Dark</button>
          <button type="button" class="bg-toggle" data-bg="checkerboard" title="Checkerboard Transparency">Grid</button>
        </div>
      </div>

      <div class="hero-feather-display" id="hero-feather-target">
        <!-- Pure CSS Mask-Colored Feather -->
        <div class="css-feather-mask" id="active-mask-feather"></div>
      </div>

      <div class="stage-card-footer">
        <div class="color-status">
          <span class="status-indicator" id="status-indicator"></span>
          <span class="status-text" id="status-name">Yellow Wing Gold</span>
          <code class="status-hex" id="status-hex">#f0c838</code>
        </div>
      </div>
    </div>

    <!-- Original vs Colored Comparison Card -->
    <div class="stage-card">
      <div class="stage-card-header">
        <div>
          <span class="method-tag">Reference</span>
          <h3 class="method-title">Original Master PNG</h3>
        </div>
      </div>

      <div class="reference-feather-display">
        <img src="{{ '/images/audubon-feather-transparent.png' | relative_url }}" alt="Original Audubon Feather" class="ref-feather-img">
      </div>

      <div class="stage-card-footer">
        <p class="stage-note">Untinted transparent cutout from John James Audubon's original source plate.</p>
      </div>
    </div>

  </div>

  <!-- Real-World UI Contexts -->
  <div class="ui-context-section">
    <h2 class="section-heading">How It Looks in Site UI Components</h2>
    <p class="section-sub">Testing the recolored feather in natural header lockups, badges, and action buttons:</p>

    <div class="context-grid">
      
      <!-- Context 1: Brand Wordmark (Header Lockup) -->
      <div class="context-card">
        <span class="context-card-label">Header Lockup</span>
        <div class="demo-header-lockup">
          <div class="demo-feather-icon css-feather-mask live-color-target"></div>
          <div class="demo-brand-text">
            <span class="demo-name">Yellow Wing</span>
            <span class="demo-sub">Roasters</span>
          </div>
        </div>
        <p class="context-desc">Feather as an inline vector-like crest in navigation.</p>
      </div>

      <!-- Context 2: Dark Header Lockup -->
      <div class="context-card context-card--dark">
        <span class="context-card-label">Dark Theme Lockup</span>
        <div class="demo-header-lockup">
          <div class="demo-feather-icon css-feather-mask live-color-target"></div>
          <div class="demo-brand-text">
            <span class="demo-name" style="color: #faf8f5;">Yellow Wing</span>
            <span class="demo-sub" style="color: #bfa897;">Roasters</span>
          </div>
        </div>
        <p class="context-desc" style="color: #bfa897;">Contrasting on espresso backgrounds or packaging stickers.</p>
      </div>

      <!-- Context 3: Interactive Button Icon -->
      <div class="context-card">
        <span class="context-card-label">Button CTA Badge</span>
        <button type="button" class="demo-btn">
          <span class="demo-btn-feather css-feather-mask live-color-target"></span>
          <span>Roaster's Club Subscription</span>
        </button>
        <p class="context-desc">Inline inside pill buttons or checkout buttons.</p>
      </div>

      <!-- Context 4: Category Pill Stamp -->
      <div class="context-card">
        <span class="context-card-label">Category Pill Tag</span>
        <div class="demo-pill">
          <span class="demo-pill-feather css-feather-mask live-color-target"></span>
          <span class="demo-pill-text">Limited Single Origin</span>
        </div>
        <p class="context-desc">Small 14px icon accent inside product metadata.</p>
      </div>

    </div>
  </div>

  <!-- Technical Implementation / Generated Code Block -->
  <div class="code-output-section">
    <div class="code-header">
      <div class="code-header-left">
        <span class="code-title">Generated CSS Code</span>
        <span class="code-hint">Ready to paste into your stylesheet</span>
      </div>
      <button type="button" class="copy-code-btn" id="copy-code-btn">
        Copy CSS
      </button>
    </div>
    <pre class="code-pre"><code id="css-snippet">/* CSS mask-image: dynamic feather recolor */
.feather-icon {
  display: inline-block;
  width: 32px;
  height: 96px;
  background-color: #f0c838;
  -webkit-mask-image: url('/images/audubon-feather-transparent.png');
  mask-image: url('/images/audubon-feather-transparent.png');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  transition: background-color 0.2s ease;
}</code></pre>
  </div>

  <!-- Comparison of All Methods Table -->
  <div class="methods-breakdown">
    <h2 class="section-heading">Comparing The 3 CSS Recoloring Techniques</h2>
    
    <div class="methods-grid">
      <div class="method-box is-preferred">
        <div class="method-box-badge">Best Choice</div>
        <h4>1. CSS <code>mask-image</code></h4>
        <p class="method-lead">Fills the feather's alpha shape with any background color or gradient.</p>
        <ul class="method-pros-cons">
          <li class="pro">&check; Supports exact HEX codes, CSS variables, and RGBA</li>
          <li class="pro">&check; Supports linear and radial gradients</li>
          <li class="pro">&check; Crisp, clean edges with smooth alpha anti-aliasing</li>
          <li class="pro">&check; Clean CSS transition on hover/active states</li>
        </ul>
      </div>

      <div class="method-box">
        <h4>2. CSS <code>filter</code> on <code>&lt;img&gt;</code></h4>
        <p class="method-lead">Applies color matrices or inverted brightness directly to an image tag.</p>
        <ul class="method-pros-cons">
          <li class="pro">&check; Works directly on <code>&lt;img&gt;</code> without HTML markup changes</li>
          <li class="pro">&check; Great for instant White (<code>brightness(0) invert(1)</code>) or Black</li>
          <li class="con">&cross; Complex filter calculation required for custom hex colors</li>
          <li class="con">&cross; Cannot render multi-color CSS gradients</li>
        </ul>
      </div>

      <div class="method-box">
        <h4>3. Offset <code>drop-shadow()</code></h4>
        <p class="method-lead">Translates the image off-canvas and projects an exact colored shadow back.</p>
        <ul class="method-pros-cons">
          <li class="pro">&check; Allows exact hex color without filter matrix formulas</li>
          <li class="con">&cross; Requires an <code>overflow: hidden</code> wrapper container</li>
          <li class="con">&cross; Harder to position and align responsively</li>
        </ul>
      </div>
    </div>
  </div>

</div>

<!-- 
  ============================================================
  ENCOMPASSED STYLES FOR THE PREVIEW PAGE
  No changes to main site SCSS
  ============================================================
-->
<style>
  .feather-preview-page {
    max-width: 72rem;
    margin: 2rem auto 5rem;
    padding: 0 1.25rem;
  }

  .feather-preview-header {
    margin-bottom: 2.25rem;
  }

  .header-badge-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }

  .preview-badge {
    background: #2c1e14;
    color: #faf8f5;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
  }

  .preview-tag {
    color: #8a7060;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .preview-title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #2c1e14;
    line-height: 1.15;
    margin: 0 0 0.6rem;
    letter-spacing: -0.02em;
  }

  .preview-lead {
    font-size: 1.05rem;
    color: #6a5342;
    max-width: 44rem;
    line-height: 1.5;
    margin: 0;
  }

  /* -------------------------------------------------------------------------
     Toolbar
     ------------------------------------------------------------------------- */
  .feather-toolbar {
    background: #f7f3ec;
    border: 1px solid rgba(44, 30, 20, 0.12);
    border-radius: 12px;
    padding: 1.25rem 1.4rem;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: 0 4px 16px rgba(44, 30, 20, 0.04);
  }

  .toolbar-section {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
  }

  .toolbar-section--custom {
    padding-top: 1rem;
    border-top: 1px dashed rgba(44, 30, 20, 0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }

  .toolbar-label {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #554133;
    white-space: nowrap;
  }

  .color-pill-group {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .color-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.15);
    border-radius: 999px;
    padding: 0.35rem 0.8rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #332317;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .color-pill-btn .swatch {
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    display: inline-block;
  }

  .color-pill-btn:hover {
    border-color: #2c1e14;
    background: #faf8f5;
  }

  .color-pill-btn.is-active {
    background: #2c1e14;
    color: #faf8f5;
    border-color: #2c1e14;
    box-shadow: 0 2px 6px rgba(44, 30, 20, 0.15);
  }

  .custom-color-picker-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .input-inline {
    display: inline-flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.18);
    border-radius: 8px;
    padding: 0.2rem 0.4rem;
    gap: 0.4rem;
  }

  input[type="color"] {
    -webkit-appearance: none;
    border: none;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 6px;
    cursor: pointer;
    background: transparent;
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
  }

  #custom-hex-text {
    border: none;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: #2c1e14;
    width: 5.5rem;
    outline: none;
    text-transform: uppercase;
  }

  .gradient-toggle-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  /* -------------------------------------------------------------------------
     Hero Showcase Grid
     ------------------------------------------------------------------------- */
  .feather-stage-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 1.75rem;
    margin-bottom: 3.5rem;
  }

  @media (max-width: 840px) {
    .feather-stage-grid {
      grid-template-columns: 1fr;
    }
  }

  .stage-card {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.12);
    border-radius: 12px;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 18px rgba(44, 30, 20, 0.04);
  }

  .stage-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    gap: 1rem;
  }

  .method-tag {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8a7060;
    display: block;
    margin-bottom: 0.2rem;
  }

  .method-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #2c1e14;
    margin: 0;
  }

  .stage-bg-toggles {
    display: inline-flex;
    background: rgba(44, 30, 20, 0.06);
    border-radius: 6px;
    padding: 0.15rem;
    gap: 0.15rem;
  }

  .bg-toggle {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.55rem;
    border-radius: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #554133;
    transition: all 0.12s ease;
  }

  .bg-toggle.is-active {
    background: #ffffff;
    color: #2c1e14;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* Display containers */
  .hero-feather-display {
    min-height: 22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #faf8f5;
    border-radius: 10px;
    padding: 2rem;
    transition: background 0.2s ease;
    border: 1px solid rgba(44, 30, 20, 0.06);
  }

  .hero-feather-display.bg-dark {
    background: #2c1e14;
  }

  .hero-feather-display.bg-checkerboard {
    background-color: #ffffff;
    background-image: 
      linear-gradient(45deg, #eee 25%, transparent 25%), 
      linear-gradient(-45deg, #eee 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #eee 75%), 
      linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
  }

  .reference-feather-display {
    min-height: 22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #faf8f5;
    border-radius: 10px;
    padding: 2rem;
    border: 1px solid rgba(44, 30, 20, 0.06);
  }

  .ref-feather-img {
    height: 18rem;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(44, 30, 20, 0.08));
  }

  /* THE CORE CSS MASK-IMAGE CLASS */
  .css-feather-mask {
    display: inline-block;
    background-color: #f0c838; /* Controlled via JS or CSS var */
    -webkit-mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transition: background 0.2s ease;
  }

  #active-mask-feather {
    width: 6.5rem;
    height: 18rem;
    filter: drop-shadow(0 4px 14px rgba(44, 30, 20, 0.12));
  }

  .stage-card-footer {
    margin-top: 1.25rem;
    padding-top: 0.85rem;
    border-top: 1px solid rgba(44, 30, 20, 0.08);
  }

  .color-status {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .status-indicator {
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    background: #f0c838;
    border: 1px solid rgba(0,0,0,0.15);
  }

  .status-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #2c1e14;
  }

  .status-hex {
    font-size: 0.78rem;
    background: #f4eee6;
    padding: 0.2rem 0.45rem;
    border-radius: 4px;
    color: #554133;
  }

  .stage-note {
    font-size: 0.8rem;
    color: #8a7060;
    margin: 0;
    line-height: 1.4;
  }

  /* -------------------------------------------------------------------------
     UI Context Section
     ------------------------------------------------------------------------- */
  .ui-context-section {
    margin-bottom: 3.5rem;
  }

  .section-heading {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c1e14;
    margin: 0 0 0.35rem;
    letter-spacing: -0.02em;
  }

  .section-sub {
    font-size: 0.95rem;
    color: #6a5342;
    margin: 0 0 1.5rem;
  }

  .context-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  .context-card {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.1);
    border-radius: 10px;
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.15rem;
  }

  .context-card--dark {
    background: #2c1e14;
    border-color: #2c1e14;
  }

  .context-card-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8a7060;
  }

  .context-card--dark .context-card-label {
    color: #a89484;
  }

  .context-desc {
    font-size: 0.78rem;
    color: #7d6b5e;
    margin: 0;
    line-height: 1.35;
  }

  /* Demo 1 & 2: Header Lockup */
  .demo-header-lockup {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    padding: 0.5rem 0.75rem;
  }

  .demo-feather-icon {
    width: 1.35rem;
    height: 3.2rem;
  }

  .demo-brand-text {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1;
  }

  .demo-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #2c1e14;
    letter-spacing: -0.01em;
  }

  .demo-sub {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #8a7060;
    margin-top: 0.2rem;
  }

  /* Demo 3: Button */
  .demo-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: #2c1e14;
    color: #faf8f5;
    border: none;
    border-radius: 999px;
    padding: 0.75rem 1.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(44, 30, 20, 0.15);
    transition: transform 0.15s ease;
  }

  .demo-btn:hover {
    transform: translateY(-1px);
  }

  .demo-btn-feather {
    width: 0.95rem;
    height: 1.8rem;
  }

  /* Demo 4: Pill Badge */
  .demo-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f5efe6;
    border: 1px solid rgba(44, 30, 20, 0.12);
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
  }

  .demo-pill-feather {
    width: 0.75rem;
    height: 1.4rem;
  }

  .demo-pill-text {
    font-size: 0.76rem;
    font-weight: 600;
    color: #2c1e14;
  }

  /* -------------------------------------------------------------------------
     Code Snippet Block
     ------------------------------------------------------------------------- */
  .code-output-section {
    background: #2c1e14;
    border-radius: 12px;
    padding: 1.4rem 1.6rem;
    margin-bottom: 3.5rem;
    box-shadow: 0 6px 20px rgba(44, 30, 20, 0.15);
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .code-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #faf8f5;
    margin-right: 0.5rem;
  }

  .code-hint {
    font-size: 0.76rem;
    color: #a89484;
  }

  .copy-code-btn {
    background: #f0c838;
    color: #2c1e14;
    border: none;
    border-radius: 6px;
    padding: 0.35rem 0.85rem;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .copy-code-btn:hover {
    background: #ffd95c;
  }

  .code-pre {
    margin: 0;
    overflow-x: auto;
  }

  .code-pre code {
    font-family: "SF Mono", Menlo, Consolas, Monaco, monospace;
    font-size: 0.82rem;
    color: #f7e9d7;
    line-height: 1.5;
    display: block;
  }

  /* -------------------------------------------------------------------------
     Methods Comparison Cards
     ------------------------------------------------------------------------- */
  .methods-breakdown {
    margin-bottom: 3rem;
  }

  .methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-top: 1.25rem;
  }

  .method-box {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.1);
    border-radius: 10px;
    padding: 1.5rem;
    position: relative;
  }

  .method-box.is-preferred {
    border: 2px solid #2c1e14;
    background: #fdfcfb;
  }

  .method-box-badge {
    position: absolute;
    top: -0.65rem;
    right: 1.2rem;
    background: #2c1e14;
    color: #f0c838;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
  }

  .method-box h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: #2c1e14;
  }

  .method-lead {
    font-size: 0.82rem;
    color: #6a5342;
    margin: 0 0 1rem;
    line-height: 1.4;
  }

  .method-pros-cons {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.78rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .method-pros-cons li.pro {
    color: #2e5a32;
  }

  .method-pros-cons li.con {
    color: #8c3b28;
  }
</style>

<!-- Interactive Script -->
<script>
  (function() {
    let currentColor = '#f0c838';
    let currentName = 'Yellow Wing Gold';
    let isGradient = false;

    const targets = document.querySelectorAll('.live-color-target, #active-mask-feather');
    const statusIndicator = document.getElementById('status-indicator');
    const statusName = document.getElementById('status-name');
    const statusHex = document.getElementById('status-hex');
    const cssSnippet = document.getElementById('css-snippet');
    const customColorInput = document.getElementById('custom-feather-color');
    const customHexText = document.getElementById('custom-hex-text');
    const heroTarget = document.getElementById('hero-feather-target');

    function applyColor(colorVal, name, gradient = false) {
      currentColor = colorVal;
      currentName = name;
      isGradient = gradient;

      targets.forEach(el => {
        if (gradient) {
          el.style.background = colorVal;
          el.style.backgroundColor = '';
        } else {
          el.style.background = '';
          el.style.backgroundColor = colorVal;
        }
      });

      if (statusIndicator) {
        statusIndicator.style.background = colorVal;
      }
      if (statusName) {
        statusName.textContent = name;
      }
      if (statusHex) {
        statusHex.textContent = gradient ? 'CSS Gradient' : colorVal;
      }

      if (!gradient && customColorInput && customHexText) {
        customColorInput.value = colorVal;
        customHexText.value = colorVal;
      }

      updateCodeSnippet();
    }

    function updateCodeSnippet() {
      if (!cssSnippet) return;
      const fillProp = isGradient 
        ? `  background: ${currentColor};` 
        : `  background-color: ${currentColor};`;

      cssSnippet.textContent = `/* CSS mask-image: dynamic feather recolor */
.feather-icon {
  display: inline-block;
  width: 32px;
  height: 96px;
${fillProp}
  -webkit-mask-image: url('/images/audubon-feather-transparent.png');
  mask-image: url('/images/audubon-feather-transparent.png');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  transition: background 0.2s ease;
}`;
    }

    // Preset Buttons
    document.querySelectorAll('#preset-buttons .color-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-pill-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const color = btn.getAttribute('data-color');
        const name = btn.getAttribute('data-name');
        applyColor(color, name, false);
      });
    });

    // Gradient Buttons
    document.querySelectorAll('#gradient-buttons .color-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-pill-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const gradient = btn.getAttribute('data-gradient');
        const name = btn.getAttribute('data-name');
        applyColor(gradient, name, true);
      });
    });

    // Custom Color Input
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        document.querySelectorAll('.color-pill-btn').forEach(b => b.classList.remove('is-active'));
        applyColor(e.target.value, 'Custom Color', false);
      });
    }

    if (customHexText) {
      customHexText.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          document.querySelectorAll('.color-pill-btn').forEach(b => b.classList.remove('is-active'));
          applyColor(val, 'Custom Hex', false);
        }
      });
    }

    // Background toggle on hero stage
    document.querySelectorAll('.bg-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bg-toggle').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const bg = btn.getAttribute('data-bg');
        if (heroTarget) {
          heroTarget.classList.remove('bg-dark', 'bg-checkerboard');
          if (bg === 'dark') heroTarget.classList.add('bg-dark');
          if (bg === 'checkerboard') heroTarget.classList.add('bg-checkerboard');
        }
      });
    });

    // Copy Code Button
    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn && cssSnippet) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssSnippet.textContent).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.background = '#8ee39b';
          setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.style.background = '';
          }, 1800);
        });
      });
    }

    // Initial setup
    applyColor(currentColor, currentName, false);
  })();
</script>
