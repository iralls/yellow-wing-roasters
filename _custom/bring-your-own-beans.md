---
layout: default
title: "BYOB — Bring Your Own Beans"
card_title: "BYOB"
subtitle: "Bring your own beans"
intro: "Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell us how you'd like it roasted, and we'll handle the rest."
slug: bring-your-own-beans
category: custom
data_roast: byob
order: 2
permalink: /roasts/bring-your-own-beans/
mascot_file: binocular-birds-transparent.png
mascot_alt: "Bring your own beans mascot"
descriptor: Bring Your Own Beans
overlay_notes: "send us your green beans and we'll roast them to perfection"
---

<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
  <a href="{{ '/roasts/' | relative_url }}" style="font-family: Montserrat, sans-serif; font-size: 0.8rem; font-weight: 500; color: #887060; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
    &larr; Back to All Roasts
  </a>
</div>

<div class="sleek-detail-layout">
  <!-- Left Column: Artwork Showcase & Editorial Details -->
  <div class="sleek-detail-visual-col">
    {% if page.mascot_file %}
      <img src="{{ '/images/' | append: page.mascot_file | relative_url }}" alt="{{ page.mascot_alt | default: page.title | escape }}" class="sleek-detail-big-bird" fetchpriority="high" decoding="async">
      <div class="sleek-detail-bird-label">Binocular Birds</div>
    {% endif %}

    <div style="font-family: Lora, serif; font-size: 0.95rem; font-weight: 400; color: #5e5248; line-height: 1.7; margin-top: 2rem; border-top: 1px solid rgba(44,30,20,0.12); padding-top: 1.5rem; text-align: left; width: 100%;">
      <p>{{ page.intro }}</p>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">Approved Suppliers</h3>
        <ul style="margin: 0; padding-left: 1.2rem; font-family: Montserrat, sans-serif; font-size: 0.85rem; font-weight: 500; line-height: 1.8;">
          <li><a href="https://www.roastmasters.com/" target="_blank" rel="noopener" style="color: #2c1e14; text-decoration: underline;">Roastmasters</a></li>
          <li><a href="https://burmancoffee.com/" target="_blank" rel="noopener" style="color: #2c1e14; text-decoration: underline;">Burman Coffee</a></li>
          <li><a href="https://www.sweetmarias.com/" target="_blank" rel="noopener" style="color: #2c1e14; text-decoration: underline;">Sweet Maria's</a></li>
        </ul>
      </div>

      <div style="margin-top: 1.75rem; border-top: 1px solid rgba(44,30,20,0.08); padding-top: 1.25rem;">
        <h3 style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin: 0 0 0.75rem;">How It Works</h3>
        <ol style="margin: 0; padding-left: 1.2rem; font-family: Lora, serif; font-size: 0.9rem; line-height: 1.7; color: #5e5248;">
          <li style="margin-bottom: 0.4rem;">Browse green coffee beans from any of our approved suppliers above.</li>
          <li style="margin-bottom: 0.4rem;">Paste the direct link, specify your target roast profile, and choose quantity.</li>
          <li>We procure the lot, custom-fire the batch, and ship it freshly rested.</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- Right Column: Configurator, Purchasing & Specifications -->
  <div class="sleek-detail-info-col">
    <!-- Category Badge -->
    <div class="sleek-detail-category-row">
      <span class="sleek-detail-cat-badge">CUSTOM</span>
    </div>

    <!-- Title & Subtitle -->
    <h1 class="sleek-detail-title">{{ page.title }}</h1>
    {% if page.subtitle %}
      <div class="sleek-detail-subtitle">{{ page.subtitle }}</div>
    {% endif %}

    <!-- Tasting Notes / Descriptor Banner -->
    <div class="sleek-detail-tasting-banner">
      {{ page.overlay_notes | capitalize }}
    </div>

    <!-- Tactile Unboxed Buy Box / Configurator -->
    <div class="sleek-detail-buy-box">
      <div class="sleek-buy-price-row">
        <div>
          <span style="font-family: Montserrat, sans-serif; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: #8a7f6e; display: block; margin-bottom: 0.2rem;">Service Billing</span>
          <span class="sleek-buy-price-val" style="font-size: 1.35rem;">Custom Quote</span>
        </div>
        <span class="sleek-buy-price-note">Green coffee cost + roasting invoiced upon procurement</span>
      </div>

      <div class="sleek-buy-field">
        <label for="byob-link">Link to green beans</label>
        <input id="byob-link" type="url" required placeholder="https://burmancoffee.com/... or https://sweetmarias.com/..." style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14;">
      </div>

      <div class="sleek-buy-field">
        <label for="byob-roast">Roast level</label>
        <select id="byob-roast" class="subscribe-select" data-label="Roast Level" required style="width: 100%;">
          <option value="" disabled selected>Choose a roast level</option>
          <option value="City (light)">City (light)</option>
          <option value="City+ (medium-light)">City+ (medium-light)</option>
          <option value="Full City (medium)">Full City (medium)</option>
          <option value="Full City+ (medium-dark)">Full City+ (medium-dark)</option>
          <option value="Vienna (dark)">Vienna (dark)</option>
        </select>
      </div>

      <div class="sleek-buy-field">
        <label for="byob-grind">Grind Preparation</label>
        <select id="byob-grind" class="subscribe-select" data-label="Grind" style="width: 100%;">
          {% include grind-options.html %}
        </select>
      </div>

      <div class="sleek-buy-field">
        <label for="byob-qty">Quantity (lbs)</label>
        <input id="byob-qty" type="number" min="1" max="10" value="1" required style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14;">
        <span style="display: block; font-family: Montserrat, sans-serif; font-size: 0.7rem; font-weight: 400; color: #8a7f6e; margin-top: 0.35rem;">Roasting loses ~15% of the bean weight on average.</span>
      </div>

      <div class="sleek-buy-field">
        <label for="byob-notes">Roasting notes / instructions (optional)</label>
        <textarea id="byob-notes" rows="2" placeholder="Any preferences — first crack, second crack, development time, etc." style="width: 100%; box-sizing: border-box; padding: 0.6rem 0.85rem; font-family: Montserrat, sans-serif; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(44, 30, 20, 0.2); border-radius: 4px; background: transparent; color: #2c1e14; resize: vertical;"></textarea>
      </div>

      <button type="button" class="sleek-buy-add-btn add-to-order-btn" id="byob-beans-add-btn">
        Add to Cart
      </button>
    </div>

    <!-- Specifications Grid -->
    <div class="sleek-spec-wrap">
      <div class="sleek-spec-section-header">
        <h2 class="sleek-spec-heading">Custom Service Specifications</h2>
        <span class="sleek-spec-subheading">Procurement &amp; Roasting</span>
      </div>

      <div class="sleek-spec-grid">
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Service Type</span>
          <span class="sleek-spec-val">Green Bean Procurement &amp; Roasting</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Batch Size</span>
          <span class="sleek-spec-val">1 &ndash; 10 lbs per order</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Roast Spectrum</span>
          <span class="sleek-spec-val">City (light) to Vienna (dark)</span>
        </div>
        <div class="sleek-spec-tile">
          <span class="sleek-spec-label">Moisture Loss</span>
          <span class="sleek-spec-val">~15% weight loss during roast</span>
        </div>
        <div class="sleek-spec-tile is-full-width">
          <span class="sleek-spec-label">Approved Suppliers</span>
          <span class="sleek-spec-val">Roastmasters, Burman Coffee, Sweet Maria's</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/js/byob-beans.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initBYOBBeans({
    mascot: {{ page.mascot_file | jsonify }}
  });
</script>
