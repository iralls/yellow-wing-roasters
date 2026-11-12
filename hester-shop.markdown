---
layout: default
title: "Shop Preview — Hester Style"
permalink: /hester-shop/
---

<!-- 
  Hester Shop Style Preview:
  - Bare birds without card boxes, borders, or shadows.
  - Directional bird shadows (Side Right, Side Left, Back Bloom, Ground Perch).
  - Centered names and prices underneath.
  - Roast level in layman's terms underneath.
  - Completely self-contained CSS (scoped under #hester-preview-page).
-->

<div id="hester-preview-page" class="hester-preview-root">

  <!-- Interactive Controls Toolbar for testing variants -->
  <div class="hester-preview-toolbar">
    <div class="hester-toolbar-header">
      <span class="hester-toolbar-badge">Hester Shop Preview</span>
      <span class="hester-toolbar-note">Bare birds, centered typography, customizable shadows</span>
    </div>

    <div class="hester-toolbar-controls">
      <!-- Design Style Toggle (Option A vs Option B vs Option C) -->
      <div class="hester-toolbar-group hester-toolbar-group--featured">
        <span class="hester-toolbar-label">Design Style:</span>
        <div class="hester-btn-pill-group" id="style-toggles">
          <button type="button" class="hester-pill-btn is-active" data-style="art-mat">Option A: Art Print Mat</button>
          <button type="button" class="hester-pill-btn" data-style="editorial-card">Option B: Editorial Card</button>
          <button type="button" class="hester-pill-btn" data-style="bare-bird">Option C: Bare Bird Float</button>
        </div>
      </div>

      <!-- Shadow Style Toggle (Active on Option C) -->
      <div class="hester-toolbar-group" id="toolbar-shadow-group" style="display: none;">
        <span class="hester-toolbar-label">Bird Shadow:</span>
        <div class="hester-btn-pill-group" id="shadow-toggles">
          <button type="button" class="hester-pill-btn is-active" data-shadow="side-right">Side (Right)</button>
          <button type="button" class="hester-pill-btn" data-shadow="side-left">Side (Left)</button>
          <button type="button" class="hester-pill-btn" data-shadow="back-depth">Back (Depth Bloom)</button>
          <button type="button" class="hester-pill-btn" data-shadow="ground-perch">Ground Perch</button>
          <button type="button" class="hester-pill-btn" data-shadow="soft-ambient">Soft Ambient</button>
          <button type="button" class="hester-pill-btn" data-shadow="none">None</button>
        </div>
      </div>

      <!-- Collection Filter -->
      <div class="hester-toolbar-group">
        <span class="hester-toolbar-label">Collection:</span>
        <div class="hester-btn-pill-group" id="collection-filters">
          <button type="button" class="hester-pill-btn is-active" data-filter="all">All Coffees</button>
          <button type="button" class="hester-pill-btn" data-filter="single origin">Single Origins</button>
          <button type="button" class="hester-pill-btn" data-filter="blend">Blends</button>
          <button type="button" class="hester-pill-btn" data-filter="seasonal">Seasonals</button>
          <button type="button" class="hester-pill-btn" data-filter="subscription">Subscriptions</button>
          <button type="button" class="hester-pill-btn" data-filter="pantry">Pantry</button>
        </div>
      </div>

      <!-- Column Layout Toggle -->
      <div class="hester-toolbar-group">
        <span class="hester-toolbar-label">Columns:</span>
        <div class="hester-btn-pill-group" id="column-toggles">
          <button type="button" class="hester-pill-btn is-active" data-cols="3">3 Columns</button>
          <button type="button" class="hester-pill-btn" data-cols="4">4 Columns</button>
        </div>
      </div>

      <!-- Text Alignment Toggle -->
      <div class="hester-toolbar-group">
        <span class="hester-toolbar-label">Alignment:</span>
        <div class="hester-btn-pill-group" id="align-toggles">
          <button type="button" class="hester-pill-btn is-active" data-align="center">Centered</button>
          <button type="button" class="hester-pill-btn" data-align="left">Left-Aligned</button>
        </div>
      </div>

      <!-- Roast Level Format Toggle -->
      <div class="hester-toolbar-group">
        <span class="hester-toolbar-label">Roast Level:</span>
        <div class="hester-btn-pill-group" id="roast-toggles">
          <button type="button" class="hester-pill-btn is-active" data-roast-format="with-dots">Dots + Layman</button>
          <button type="button" class="hester-pill-btn" data-roast-format="dots-only">Dots Only</button>
          <button type="button" class="hester-pill-btn" data-roast-format="layman-suffix">"Medium Roast"</button>
          <button type="button" class="hester-pill-btn" data-roast-format="layman-bare">"Medium"</button>
          <button type="button" class="hester-pill-btn" data-roast-format="hidden">Hidden</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Side-by-Side Design Style Shootout -->
  <section class="hester-style-showcase-section">
    <div class="hester-showcase-header">
      <span class="hester-showcase-kicker">Design Shootout</span>
      <h2 class="hester-showcase-title">How Should Audubon Illustrations Be Framed?</h2>
      <p class="hester-showcase-desc">Comparing how different containment models handle detailed 19th-century naturalist linework:</p>
    </div>

    <div class="hester-style-showcase-grid">
      <!-- 1. Option A: Art Print Mat -->
      <div class="hester-showcase-item card--art-mat">
        <div class="hester-showcase-pill-tag tag--opt-a">Option A · Art Print Mat</div>
        <div class="hester-bird-stage stage--art-mat">
          <img src="{{ '/images/audubon-blue-jay-transparent.png' | relative_url }}" alt="Dawn Drum" class="hester-bird-image" loading="lazy" decoding="async">
        </div>
        <div class="hester-item-meta">
          <h3 class="hester-item-title">Dawn Drum</h3>
          <div class="hester-item-level">
            <span class="hester-level-dots" aria-hidden="true">
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot"></span>
            </span>
            <span class="hester-level-text-bare">Medium-Dark</span>
          </div>
          <div class="hester-item-price">$13</div>
        </div>
        <div class="hester-style-explainer">
          <strong>Archival Paper Mat:</strong> Clean geometric containment like Hester, but a soft paper tint (<code>#f6f2ea</code>) grounds the etching naturally. Zero drop-shadows, zero card borders.
        </div>
      </div>

      <!-- 2. Option B: Clean Editorial Card -->
      <div class="hester-showcase-item card--editorial-card">
        <div class="hester-showcase-pill-tag tag--opt-b">Option B · Editorial Card</div>
        <div class="hester-editorial-inner">
          <div class="hester-bird-stage stage--editorial">
            <img src="{{ '/images/audubon-blue-jay-transparent.png' | relative_url }}" alt="Dawn Drum" class="hester-bird-image" loading="lazy" decoding="async">
          </div>
          <div class="hester-item-meta">
            <h3 class="hester-item-title">Dawn Drum</h3>
            <div class="hester-item-level">
              <span class="hester-level-dots" aria-hidden="true">
                <span class="hester-dot is-filled"></span>
                <span class="hester-dot is-filled"></span>
                <span class="hester-dot is-filled"></span>
                <span class="hester-dot is-filled"></span>
                <span class="hester-dot"></span>
              </span>
              <span class="hester-level-text-bare">Medium-Dark</span>
            </div>
            <div class="hester-item-price">$13</div>
          </div>
        </div>
        <div class="hester-style-explainer">
          <strong>Unified Editorial Card:</strong> Physical card with hairline border, subtle nested art plate, and ambient hover lift. Gives the apothecary/field-guide identity an intentional, tactile presence.
        </div>
      </div>

      <!-- 3. Option C: Bare Bird Float (Hester) -->
      <div class="hester-showcase-item card--bare-bird">
        <div class="hester-showcase-pill-tag tag--opt-c">Option C · Bare Bird Float</div>
        <div class="hester-bird-stage stage--bare">
          <img src="{{ '/images/audubon-blue-jay-transparent.png' | relative_url }}" alt="Dawn Drum" class="hester-bird-image" loading="lazy" decoding="async">
        </div>
        <div class="hester-item-meta">
          <h3 class="hester-item-title">Dawn Drum</h3>
          <div class="hester-item-level">
            <span class="hester-level-dots" aria-hidden="true">
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot is-filled"></span>
              <span class="hester-dot"></span>
            </span>
            <span class="hester-level-text-bare">Medium-Dark</span>
          </div>
          <div class="hester-item-price">$13</div>
        </div>
        <div class="hester-style-explainer">
          <strong>Floating Cutout:</strong> The current bare bird attempt. Without a boundary, high-frequency feather contours float uncontained in white space with synthetic drop-shadow.
        </div>
      </div>
    </div>
  </section>

  <!-- Page Header -->
  <div class="hester-page-header">
    <h1 class="hester-page-title" id="preview-page-title">Shop</h1>
  </div>

  <!-- Hester Product Grid -->
  <div class="hester-shop-grid grid-cols-3 align-center roast-format-with-dots style-art-mat shadow-mode-side-right" id="hester-shop-grid">

    <!-- Roasts Items -->
    {% assign all_roasts = site.roasts | sort: "order" %}
    {% for r in all_roasts %}
      {% assign s_info = site.data.statuses[r.status] %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign r_url = r.permalink | default: r.url %}

      <div class="hester-shop-item" data-category="{{ r.category | downcase }}">
        <a href="{{ r_url | relative_url }}" class="hester-item-link" aria-label="{{ r.title | escape }}">
          
          <!-- Bare Bird Illustration Stage (No Card Box, No Border) -->
          <div class="hester-bird-stage">
            {% if r.mascot_file %}
              <img src="{{ '/images/' | append: r.mascot_file | relative_url }}" 
                   alt="{{ r.title | escape }}" 
                   class="hester-bird-image" 
                   loading="lazy" 
                   decoding="async">
            {% endif %}

            <span class="hester-ground-shadow" aria-hidden="true"></span>

            {% if r.status == 'flown_south' %}
              <span class="hester-status-chip">Sold Out</span>
            {% elsif r.status == 'incubating' %}
              <span class="hester-status-chip">Coming Soon</span>
            {% endif %}
          </div>

          <!-- Product Details Underneath Bird (Centered) -->
          <div class="hester-item-meta">
            <h3 class="hester-item-title">{{ r.card_title | default: r.title }}</h3>
            
            {% if level_info.layman %}
              <div class="hester-item-level" data-dots="{{ level_info.dots }}">
                <span class="hester-level-dots" aria-hidden="true">
                  {% for i in (1..5) %}
                    <span class="hester-dot{% if i <= level_info.dots %} is-filled{% endif %}"></span>
                  {% endfor %}
                </span>
                <span class="hester-level-text-bare">{{ level_info.layman }}</span>
                <span class="hester-level-text-suffix">{{ level_info.layman }} Roast</span>
              </div>
            {% endif %}

            <div class="hester-item-price">
              {% if r.temporary_price and r.temporary_price["12oz"] %}
                <s class="hester-price-orig">${{ r.price["12oz"] }}</s> 
                <span class="hester-price-sale">${{ r.temporary_price["12oz"] }}</span>
              {% elsif r.price and r.price["12oz"] %}
                ${{ r.price["12oz"] }}
              {% elsif r.price and r.price.first %}
                ${{ r.price.first[1] }}
              {% elsif r.price %}
                ${{ r.price }}
              {% endif %}
            </div>
          </div>
        </a>
      </div>
    {% endfor %}

    <!-- Subscriptions Items -->
    {% assign all_subs = site.subscriptions | sort: "order" %}
    {% for s in all_subs %}
      {% assign s_url = s.permalink | default: s.url %}
      <div class="hester-shop-item" data-category="subscription" style="display: none;">
        <a href="{{ s_url | relative_url }}" class="hester-item-link" aria-label="{{ s.title | escape }}">
          <div class="hester-bird-stage">
            {% if s.mascot_file %}
              <img src="{{ '/images/' | append: s.mascot_file | relative_url }}" 
                   alt="{{ s.title | escape }}" 
                   class="hester-bird-image" 
                   loading="lazy" 
                   decoding="async">
            {% endif %}
            <span class="hester-ground-shadow" aria-hidden="true"></span>
          </div>
          <div class="hester-item-meta">
            <h3 class="hester-item-title">{{ s.title }}</h3>
            <div class="hester-item-level">
              <span class="hester-level-text-bare">Subscription</span>
              <span class="hester-level-text-suffix">Coffee Subscription</span>
            </div>
            <div class="hester-item-price">
              {% if s.price and s.price["12oz"] %}
                ${{ s.price["12oz"] }} / delivery
              {% elsif s.price %}
                ${{ s.price }} / delivery
              {% endif %}
            </div>
          </div>
        </a>
      </div>
    {% endfor %}

    <!-- Pantry Items -->
    {% assign all_pantry = site.pantry | sort: "order" %}
    {% for p in all_pantry %}
      {% assign p_url = p.permalink | default: p.url %}
      <div class="hester-shop-item" data-category="pantry" style="display: none;">
        <a href="{{ p_url | relative_url }}" class="hester-item-link" aria-label="{{ p.title | escape }}">
          <div class="hester-bird-stage">
            {% if p.mascot_file %}
              <img src="{{ '/images/' | append: p.mascot_file | relative_url }}" 
                   alt="{{ p.title | escape }}" 
                   class="hester-bird-image" 
                   loading="lazy" 
                   decoding="async">
            {% endif %}
            <span class="hester-ground-shadow" aria-hidden="true"></span>
          </div>
          <div class="hester-item-meta">
            <h3 class="hester-item-title">{{ p.title }}</h3>
            <div class="hester-item-level">
              <span class="hester-level-text-bare">Pantry</span>
              <span class="hester-level-text-suffix">Pantry Treat</span>
            </div>
            <div class="hester-item-price">
              ${{ p.price }}{% if p.size %} &middot; {{ p.size }}{% endif %}
            </div>
          </div>
        </a>
      </div>
    {% endfor %}

  </div>
</div>

<style>
  /* ── Hester Shop Preview: Fully Encapsulated Scoped Styles ── */

  #hester-preview-page {
    max-width: 92rem;
    margin: 0 auto;
    padding: 0 1.5rem 6rem;
  }

  /* ── Interactive Preview Toolbar ── */
  #hester-preview-page .hester-preview-toolbar {
    background: #f7f3ec;
    border: 1px solid rgba(44, 30, 20, 0.1);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 2.5rem;
  }

  #hester-preview-page .hester-toolbar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  #hester-preview-page .hester-toolbar-badge {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: #2c1e14;
    color: #ffffff;
  }

  #hester-preview-page .hester-toolbar-note {
    font-family: var(--font-body, "Lora", serif);
    font-size: 0.88rem;
    font-style: italic;
    color: #6e5e54;
  }

  #hester-preview-page .hester-toolbar-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem 2rem;
    align-items: center;
  }

  #hester-preview-page .hester-toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  #hester-preview-page .hester-toolbar-label {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #443022;
  }

  #hester-preview-page .hester-btn-pill-group {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  #hester-preview-page .hester-pill-btn {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.76rem;
    font-weight: 500;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(44, 30, 20, 0.15);
    background: #ffffff;
    color: #2c1e14;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  #hester-preview-page .hester-pill-btn:hover {
    border-color: #2c1e14;
    background: #faf8f5;
  }

  #hester-preview-page .hester-pill-btn.is-active {
    background: #2c1e14;
    color: #ffffff;
    border-color: #2c1e14;
  }

  /* Highlight the featured Design Style group */
  #hester-preview-page .hester-toolbar-group--featured {
    background: rgba(44, 30, 20, 0.05);
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
  }
  #hester-preview-page .hester-toolbar-group--featured .hester-toolbar-label {
    color: #9c6d12;
    font-weight: 700;
  }

  /* ── Design Shootout Showcase Section ── */
  #hester-preview-page .hester-style-showcase-section {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.08);
    border-radius: 14px;
    padding: 2.25rem 2rem 2.5rem;
    margin-bottom: 4rem;
  }

  #hester-preview-page .hester-showcase-kicker {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #9c6d12;
    display: block;
    margin-bottom: 0.35rem;
  }

  #hester-preview-page .hester-showcase-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  #hester-preview-page .hester-showcase-title {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c1e14;
    margin: 0 0 0.5rem;
  }

  #hester-preview-page .hester-showcase-desc {
    font-family: var(--font-body, "Lora", serif);
    font-size: 0.95rem;
    color: #776558;
    margin: 0;
    font-style: italic;
  }

  #hester-preview-page .hester-style-showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.25rem;
    align-items: stretch;
  }

  @media (max-width: 900px) {
    #hester-preview-page .hester-style-showcase-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  #hester-preview-page .hester-showcase-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem 1.25rem 1.5rem;
    border-radius: 12px;
    position: relative;
    background: #fcfbf9;
    border: 1px solid rgba(44, 30, 20, 0.08);
  }

  /* Tag pills for Shootout */
  #hester-preview-page .hester-showcase-pill-tag {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    margin-bottom: 1.25rem;
    display: inline-block;
  }

  #hester-preview-page .tag--opt-a {
    background: #2c1e14;
    color: #ffffff;
  }

  #hester-preview-page .tag--opt-b {
    background: #ebe4d8;
    color: #2c1e14;
  }

  #hester-preview-page .tag--opt-c {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Shootout Card 1: Option A Art Mat */
  #hester-preview-page .card--art-mat .stage--art-mat {
    background: #f6f2ea;
    border-radius: 6px;
    padding: 2rem;
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: none;
  }

  #hester-preview-page .card--art-mat .hester-bird-image {
    filter: none;
  }

  /* Shootout Card 2: Option B Clean Editorial Card */
  #hester-preview-page .card--editorial-card {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.12);
    box-shadow: 0 4px 16px rgba(44, 30, 20, 0.06);
    padding: 0 0 1.5rem;
    overflow: hidden;
  }

  #hester-preview-page .card--editorial-card .hester-showcase-pill-tag {
    margin: 1.25rem 0 0.75rem;
  }

  #hester-preview-page .hester-editorial-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #hester-preview-page .card--editorial-card .stage--editorial {
    background: #faf7f2;
    border-bottom: 1px solid rgba(44, 30, 20, 0.06);
    padding: 2rem;
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #hester-preview-page .card--editorial-card .hester-item-meta {
    padding: 1.25rem 1.25rem 0;
    margin-top: 0;
  }

  #hester-preview-page .card--editorial-card .hester-bird-image {
    filter: none;
  }

  /* Shootout Card 3: Option C Bare Bird */
  #hester-preview-page .card--bare-bird {
    background: #ffffff;
    border: 1px dashed rgba(44, 30, 20, 0.2);
  }

  #hester-preview-page .card--bare-bird .stage--bare {
    background: transparent;
    padding: 1.5rem;
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #hester-preview-page .card--bare-bird .hester-bird-image {
    filter: drop-shadow(10px 12px 14px rgba(44, 30, 20, 0.2));
  }

  #hester-preview-page .hester-style-explainer {
    font-family: var(--font-body, "Lora", serif);
    font-size: 0.82rem;
    color: #6e5e54;
    line-height: 1.45;
    margin-top: auto;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(44, 30, 20, 0.08);
    width: 100%;
    text-align: left;
  }

  #hester-preview-page .hester-style-explainer strong {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.82rem;
    color: #2c1e14;
    display: block;
    margin-bottom: 0.25rem;
  }

  /* ── Header Title (3rem, -0.01em) ── */
  #hester-preview-page .hester-page-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  #hester-preview-page .hester-page-title {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #302010;
    line-height: 1.15;
    margin: 0;
    text-align: center;
  }

  /* ── Hester Product Grid (3 Columns or 4 Columns) ── */
  #hester-preview-page .hester-shop-grid {
    display: grid;
    gap: 4.5rem 3.5rem;
  }

  #hester-preview-page .hester-shop-grid.grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  #hester-preview-page .hester-shop-grid.grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1024px) {
    #hester-preview-page .hester-shop-grid.grid-cols-4 {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 820px) {
    #hester-preview-page .hester-shop-grid.grid-cols-3,
    #hester-preview-page .hester-shop-grid.grid-cols-4 {
      grid-template-columns: repeat(2, 1fr);
      gap: 3.5rem 2rem;
    }
  }

  @media (max-width: 520px) {
    #hester-preview-page .hester-shop-grid.grid-cols-3,
    #hester-preview-page .hester-shop-grid.grid-cols-4 {
      grid-template-columns: 1fr;
      gap: 3rem 1.5rem;
    }
  }

  /* ── Individual Product Item ── */
  #hester-preview-page .hester-shop-item {
    display: flex;
    flex-direction: column;
  }

  #hester-preview-page .hester-item-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  #hester-preview-page .hester-item-link:hover {
    text-decoration: none;
    color: inherit;
  }

  /* ── Bare Bird Illustration Stage (No background card, no border, pure ground) ── */
  #hester-preview-page .hester-bird-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }

  #hester-preview-page .hester-bird-image {
    max-height: 85%;
    max-width: 85%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    position: relative;
    z-index: 2;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease;
  }

  #hester-preview-page .hester-status-chip {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    background: #f0ebe4;
    color: #6e5e54;
    z-index: 3;
  }

  /* ══════════════════════════════════════════════════════════
     PRESENTATION MODES: Option A (Art Mat), Option B (Card), Option C (Bare)
     ══════════════════════════════════════════════════════════ */

  /* ── Option A: Art Print Mat (Active Default) ── */
  #hester-preview-page .hester-shop-grid.style-art-mat .hester-shop-item {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    transition: transform 0.25s ease;
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-bird-stage {
    background: #f6f2ea;
    border-radius: 6px;
    border: none;
    box-shadow: none;
    aspect-ratio: 1 / 1;
    padding: 2.25rem;
    transition: background-color 0.25s ease, transform 0.25s ease;
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-item-link:hover .hester-bird-stage {
    background: #eee8de;
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-bird-image {
    filter: none !important;
    max-height: 85%;
    max-width: 85%;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-item-link:hover .hester-bird-image {
    transform: scale(1.04);
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-ground-shadow {
    display: none !important;
  }

  #hester-preview-page .hester-shop-grid.style-art-mat .hester-item-meta {
    margin-top: 1.35rem;
    padding: 0;
  }

  /* ── Option B: Clean Editorial Card ── */
  #hester-preview-page .hester-shop-grid.style-editorial-card {
    gap: 3.5rem 2.5rem;
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-shop-item {
    background: #ffffff;
    border: 1px solid rgba(44, 30, 20, 0.1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(44, 30, 20, 0.04);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-shop-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(44, 30, 20, 0.09);
    border-color: rgba(44, 30, 20, 0.22);
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-bird-stage {
    background: #faf7f2;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid rgba(44, 30, 20, 0.06);
    box-shadow: none;
    aspect-ratio: 1 / 1;
    padding: 2rem;
    transition: background-color 0.25s ease;
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-item-link:hover .hester-bird-stage {
    background: #f4eee3;
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-bird-image {
    filter: none !important;
    max-height: 85%;
    max-width: 85%;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-item-link:hover .hester-bird-image {
    transform: scale(1.04);
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-ground-shadow {
    display: none !important;
  }

  #hester-preview-page .hester-shop-grid.style-editorial-card .hester-item-meta {
    margin-top: 0;
    padding: 1.35rem 1.25rem 1.6rem;
  }

  /* ── Option C: Bare Bird Float (Hester) ── */
  #hester-preview-page .hester-shop-grid.style-bare-bird .hester-shop-item {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  }

  #hester-preview-page .hester-shop-grid.style-bare-bird .hester-bird-stage {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    aspect-ratio: 1 / 1;
    padding: 1.5rem;
  }

  #hester-preview-page .hester-shop-grid.style-bare-bird .hester-item-meta {
    margin-top: 1.5rem;
    padding: 0;
  }

  /* ══════════════════════════════════════════════════════════
     SHADOW DEFINITIONS: Directional Side, Back, Ground, etc.
     ══════════════════════════════════════════════════════════ */

  /* 1. Side Shadow (Right): Light from upper-left casting right */
  #hester-preview-page .shadow-variant-side-right .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-side-right .hester-bird-image {
    filter: drop-shadow(10px 12px 14px rgba(44, 30, 20, 0.2)) drop-shadow(3px 4px 6px rgba(44, 30, 20, 0.12));
  }
  #hester-preview-page .shadow-variant-side-right:hover .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-side-right .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: drop-shadow(14px 18px 22px rgba(44, 30, 20, 0.26)) drop-shadow(5px 6px 8px rgba(44, 30, 20, 0.15));
  }

  /* 2. Side Shadow (Left): Light from upper-right casting left */
  #hester-preview-page .shadow-variant-side-left .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-side-left .hester-bird-image {
    filter: drop-shadow(-10px 12px 14px rgba(44, 30, 20, 0.2)) drop-shadow(-3px 4px 6px rgba(44, 30, 20, 0.12));
  }
  #hester-preview-page .shadow-variant-side-left:hover .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-side-left .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: drop-shadow(-14px 18px 22px rgba(44, 30, 20, 0.26)) drop-shadow(-5px 6px 8px rgba(44, 30, 20, 0.15));
  }

  /* 3. Back Shadow (Depth Bloom): Centered depth bloom directly behind bird */
  #hester-preview-page .shadow-variant-back-depth .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-back-depth .hester-bird-image {
    filter: drop-shadow(0 14px 22px rgba(44, 30, 20, 0.22)) drop-shadow(0 4px 8px rgba(44, 30, 20, 0.12));
  }
  #hester-preview-page .shadow-variant-back-depth:hover .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-back-depth .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: drop-shadow(0 20px 30px rgba(44, 30, 20, 0.28)) drop-shadow(0 6px 12px rgba(44, 30, 20, 0.16));
  }

  /* 4. Ground Perch Shadow: Subtle bird shadow + elliptical perch ground wash */
  #hester-preview-page .hester-ground-shadow {
    display: none;
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-40%) skewX(-15deg);
    width: 58%;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(44, 30, 20, 0.26) 0%, rgba(44, 30, 20, 0) 72%);
    filter: blur(5px);
    pointer-events: none;
    z-index: 1;
    transition: all 0.35s ease;
  }
  #hester-preview-page .shadow-variant-ground-perch .hester-ground-shadow,
  #hester-preview-page .hester-shop-grid.shadow-mode-ground-perch .hester-ground-shadow {
    display: block;
  }
  #hester-preview-page .shadow-variant-ground-perch .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-ground-perch .hester-bird-image {
    filter: drop-shadow(6px 8px 12px rgba(44, 30, 20, 0.15));
  }
  #hester-preview-page .shadow-variant-ground-perch:hover .hester-bird-image,
  #hester-preview-page .hester-shop-grid.shadow-mode-ground-perch .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: drop-shadow(8px 12px 18px rgba(44, 30, 20, 0.2));
  }
  #hester-preview-page .shadow-variant-ground-perch:hover .hester-ground-shadow,
  #hester-preview-page .hester-shop-grid.shadow-mode-ground-perch .hester-item-link:hover .hester-ground-shadow {
    transform: translateX(-40%) skewX(-15deg) scale(0.9);
    opacity: 0.75;
  }

  /* 5. Soft Studio Ambient Shadow: Close, gentle contour wrap */
  #hester-preview-page .hester-shop-grid.shadow-mode-soft-ambient .hester-bird-image {
    filter: drop-shadow(0 4px 8px rgba(44, 30, 20, 0.12)) drop-shadow(0 1px 3px rgba(44, 30, 20, 0.08));
  }
  #hester-preview-page .hester-shop-grid.shadow-mode-soft-ambient .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: drop-shadow(0 8px 16px rgba(44, 30, 20, 0.16)) drop-shadow(0 2px 4px rgba(44, 30, 20, 0.1));
  }

  /* 6. No Shadow */
  #hester-preview-page .hester-shop-grid.shadow-mode-none .hester-bird-image {
    filter: none;
  }
  #hester-preview-page .hester-shop-grid.shadow-mode-none .hester-item-link:hover .hester-bird-image {
    transform: translateY(-4px) scale(1.03);
    filter: none;
  }

  /* ── Typography & Meta Underneath Bird (Centered Default) ── */
  #hester-preview-page .hester-item-meta {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  /* Alignment Variants */
  #hester-preview-page .hester-shop-grid.align-center .hester-item-meta {
    text-align: center;
    align-items: center;
  }

  #hester-preview-page .hester-shop-grid.align-center .hester-item-title,
  #hester-preview-page .hester-shop-grid.align-center .hester-item-price {
    text-align: center;
    justify-content: center;
  }

  #hester-preview-page .hester-shop-grid.align-center .hester-item-level {
    text-align: center;
    justify-content: center;
  }

  #hester-preview-page .hester-shop-grid.align-left .hester-item-meta {
    text-align: left;
    align-items: flex-start;
  }

  #hester-preview-page .hester-shop-grid.align-left .hester-item-title,
  #hester-preview-page .hester-shop-grid.align-left .hester-item-price {
    text-align: left;
    justify-content: flex-start;
  }

  #hester-preview-page .hester-shop-grid.align-left .hester-item-level {
    text-align: left;
    justify-content: flex-start;
  }

  /* Product Title */
  #hester-preview-page .hester-item-title {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 1.15rem;
    font-weight: 500;
    color: #2c1e14;
    margin: 0;
    line-height: 1.25;
    text-align: center;
    width: 100%;
    transition: color 0.15s ease;
  }

  #hester-preview-page .hester-item-link:hover .hester-item-title {
    color: #9c6d12;
  }

  /* Roast Level (Layman's terms + Dots, placed above price) */
  #hester-preview-page .hester-item-level {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.76rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9c6d12;
    margin-top: 0.35rem;
    width: 100%;
    text-align: center;
  }

  /* Dots sub-component */
  #hester-preview-page .hester-level-dots {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  #hester-preview-page .hester-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e2d9ce;
    display: inline-block;
  }

  #hester-preview-page .hester-dot.is-filled {
    background: #9c6d12;
  }

  /* Price (Placed below roast level with generous breathing room) */
  #hester-preview-page .hester-item-price {
    font-family: var(--font-display, "Montserrat", sans-serif);
    font-size: 0.95rem;
    font-weight: 400;
    color: #6e5e54;
    margin: 0.85rem 0 0 0;
    line-height: 1.3;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.35rem;
  }

  #hester-preview-page .hester-price-orig {
    color: #a89484;
    margin-right: 0.25rem;
  }

  #hester-preview-page .hester-price-sale {
    color: #b45309;
    font-weight: 600;
  }

  /* Format switching via parent classes */
  /* 1. Default: Dots + Layman Bare ("Light-Medium") */
  #hester-preview-page .hester-shop-grid.roast-format-with-dots .hester-level-dots {
    display: inline-flex;
  }
  #hester-preview-page .hester-shop-grid.roast-format-with-dots .hester-level-text-bare {
    display: inline;
  }
  #hester-preview-page .hester-shop-grid.roast-format-with-dots .hester-level-text-suffix {
    display: none;
  }

  /* 2. Dots Only */
  #hester-preview-page .hester-shop-grid.roast-format-dots-only .hester-level-dots {
    display: inline-flex;
  }
  #hester-preview-page .hester-shop-grid.roast-format-dots-only .hester-level-text-bare,
  #hester-preview-page .hester-shop-grid.roast-format-dots-only .hester-level-text-suffix {
    display: none;
  }

  /* 3. Layman Suffix ("Medium Roast") */
  #hester-preview-page .hester-shop-grid.roast-format-layman-suffix .hester-level-text-suffix {
    display: inline;
  }
  #hester-preview-page .hester-shop-grid.roast-format-layman-suffix .hester-level-text-bare,
  #hester-preview-page .hester-shop-grid.roast-format-layman-suffix .hester-level-dots {
    display: none;
  }

  /* 4. Layman Bare ("Medium") */
  #hester-preview-page .hester-shop-grid.roast-format-layman-bare .hester-level-text-bare {
    display: inline;
  }
  #hester-preview-page .hester-shop-grid.roast-format-layman-bare .hester-level-text-suffix,
  #hester-preview-page .hester-shop-grid.roast-format-layman-bare .hester-level-dots {
    display: none;
  }

  /* 5. Hidden */
  #hester-preview-page .hester-shop-grid.roast-format-hidden .hester-item-level {
    display: none;
  }
</style>

<script>
  (function () {
    const grid = document.getElementById('hester-shop-grid');
    const titleEl = document.getElementById('preview-page-title');
    const items = document.querySelectorAll('.hester-shop-item');
    const shadowGroup = document.getElementById('toolbar-shadow-group');

    // 0. Design Style Toggle (Option A vs Option B vs Option C)
    const styleBtns = document.querySelectorAll('#style-toggles .hester-pill-btn');
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const style = btn.getAttribute('data-style');
        grid.classList.remove('style-art-mat', 'style-editorial-card', 'style-bare-bird');
        grid.classList.add('style-' + style);

        if (shadowGroup) {
          shadowGroup.style.display = (style === 'bare-bird') ? 'flex' : 'none';
        }
      });
    });

    // 1. Shadow Mode Toggle
    const shadowBtns = document.querySelectorAll('#shadow-toggles .hester-pill-btn');
    shadowBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shadowBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const shadow = btn.getAttribute('data-shadow');
        grid.classList.remove(
          'shadow-mode-side-right', 
          'shadow-mode-side-left', 
          'shadow-mode-back-depth', 
          'shadow-mode-ground-perch', 
          'shadow-mode-soft-ambient', 
          'shadow-mode-none'
        );
        grid.classList.add('shadow-mode-' + shadow);
      });
    });

    // 2. Collection Filter Switching
    const collectionBtns = document.querySelectorAll('#collection-filters .hester-pill-btn');
    collectionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        collectionBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter');
        
        // Update Title dynamically to match collection
        if (filter === 'all') titleEl.textContent = 'Shop';
        else if (filter === 'single origin') titleEl.textContent = 'Single Origins';
        else if (filter === 'blend') titleEl.textContent = 'Blends';
        else if (filter === 'seasonal') titleEl.textContent = 'Seasonals';
        else if (filter === 'subscription') titleEl.textContent = 'Subscriptions';
        else if (filter === 'pantry') titleEl.textContent = 'Pantry & Treats';

        items.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all') {
            item.style.display = (cat === 'single origin' || cat === 'blend' || cat === 'seasonal') ? '' : 'none';
          } else {
            item.style.display = (cat === filter) ? '' : 'none';
          }
        });
      });
    });

    // 3. Columns Toggle
    const columnBtns = document.querySelectorAll('#column-toggles .hester-pill-btn');
    columnBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        columnBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cols = btn.getAttribute('data-cols');
        grid.classList.remove('grid-cols-3', 'grid-cols-4');
        grid.classList.add('grid-cols-' + cols);
      });
    });

    // 4. Alignment Toggle
    const alignBtns = document.querySelectorAll('#align-toggles .hester-pill-btn');
    alignBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        alignBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const align = btn.getAttribute('data-align');
        grid.classList.remove('align-left', 'align-center');
        grid.classList.add('align-' + align);
      });
    });

    // 5. Roast Level Format Toggle
    const roastBtns = document.querySelectorAll('#roast-toggles .hester-pill-btn');
    roastBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roastBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const fmt = btn.getAttribute('data-roast-format');
        grid.classList.remove('roast-format-with-dots', 'roast-format-dots-only', 'roast-format-layman-suffix', 'roast-format-layman-bare', 'roast-format-hidden');
        grid.classList.add('roast-format-' + fmt);
      });
    });
  })();
</script>
