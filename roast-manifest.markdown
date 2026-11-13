---
layout: default
title: Roast Preview (Archival Manifest) — Yellow Wing Roasters
permalink: /roast-manifest/
---

<style>
  /* ── Archival Inventory Manifest Roast Page Prototype ── */
  :root {
    --rmnf-bg: #fcfbf9;
    --rmnf-surface: #ffffff;
    --rmnf-text: #1d1712;
    --rmnf-muted: #73675a;
    --rmnf-line: rgba(29, 23, 18, 0.12);
    --rmnf-accent: #9c6d12;
    --rmnf-sale: #b45309;
  }

  body {
    background-color: var(--rmnf-bg) !important;
    color: var(--rmnf-text);
  }

  .rmnf-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 2.5rem 32px 9rem;
  }

  /* ── Switcher ── */
  .rmnf-switcher {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3.5rem;
  }

  .rmnf-switch-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--rmnf-muted);
    background: transparent;
    border: 1px solid var(--rmnf-line);
    padding: 0.5rem 1.25rem;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.16s ease;
  }

  .rmnf-switch-btn:hover {
    border-color: var(--rmnf-text);
    color: var(--rmnf-text);
  }

  .rmnf-switch-btn.active {
    background: var(--rmnf-text);
    color: #ffffff;
    border-color: var(--rmnf-text);
  }

  /* ── Panels ── */
  .rmnf-panel {
    display: none;
  }

  .rmnf-panel.active {
    display: block;
  }

  /* Header */
  .rmnf-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--rmnf-text);
    margin-bottom: 3.5rem;
  }

  .rmnf-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--rmnf-muted);
    margin-bottom: 0.35rem;
  }

  .rmnf-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.8rem);
    font-weight: 500;
    letter-spacing: -0.025em;
    line-height: 1.05;
    margin: 0;
  }

  .rmnf-header-meta {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    color: var(--rmnf-muted);
    text-align: right;
  }

  /* 2-Column Manifest Grid */
  .rmnf-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 4.5rem;
    align-items: start;
  }

  /* Left: Manifest Dossier */
  .rmnf-dossier {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .rmnf-block {
    padding-bottom: 1.75rem;
    border-bottom: 1px solid var(--rmnf-line);
  }

  .rmnf-block-head {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--rmnf-accent);
    margin-bottom: 0.5rem;
  }

  .rmnf-block-body {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.98rem;
    line-height: 1.65;
    color: var(--rmnf-text);
    margin: 0;
  }

  .rmnf-sub-notes {
    font-family: 'Figtree', Georgia, serif;
    font-style: italic;
    font-size: 1.25rem;
    color: #3f352b;
    line-height: 1.4;
    margin: 0.5rem 0 0;
  }

  .rmnf-item-line {
    display: flex;
    justify-content: space-between;
    padding: 0.45rem 0;
    border-bottom: 1px dashed var(--rmnf-line);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
  }

  .rmnf-item-line strong {
    color: var(--rmnf-text);
  }

  /* Right: Archival Visual & Checkout */
  .rmnf-right-col {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .rmnf-artwork-frame {
    background: #f5f3ec;
    border: 1px solid var(--rmnf-line);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    border-radius: 2px;
  }

  .rmnf-bird-img {
    max-width: 82%;
    max-height: 82%;
    object-fit: contain;
    filter: drop-shadow(0 14px 24px rgba(29, 23, 18, 0.08));
    transition: transform 0.25s ease;
  }

  .rmnf-artwork-frame:hover .rmnf-bird-img {
    transform: scale(1.03);
  }

  .rmnf-buy-card {
    border: 1px solid var(--rmnf-text);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background: var(--rmnf-surface);
  }

  .rmnf-price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .rmnf-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.6rem;
    font-weight: 600;
  }

  .rmnf-price s {
    font-size: 1.2rem;
    color: var(--rmnf-muted);
    font-weight: 400;
    margin-right: 0.4rem;
  }

  .rmnf-sale-tag {
    color: var(--rmnf-sale);
  }

  .rmnf-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .rmnf-label {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--rmnf-muted);
  }

  .rmnf-select {
    padding: 0.85rem 1rem;
    border: 1px solid var(--rmnf-line);
    background: #ffffff;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--rmnf-text);
    border-radius: 2px;
    cursor: pointer;
  }

  .rmnf-btn {
    padding: 1.15rem;
    background: var(--rmnf-text);
    color: #ffffff;
    border: 1px solid var(--rmnf-text);
    border-radius: 2px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    transition: all 0.16s ease;
    margin-top: 0.5rem;
  }

  .rmnf-btn:hover {
    background: transparent;
    color: var(--rmnf-text);
  }

  @media (max-width: 900px) {
    .rmnf-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
</style>

<div class="rmnf-wrap">
  <!-- ── Switcher ── -->
  <nav class="rmnf-switcher" aria-label="Manifest Switcher">
    <button type="button" class="rmnf-switch-btn active" data-target="rmnf-eb">Manifest 01 &bull; Early Bird</button>
    <button type="button" class="rmnf-switch-btn" data-target="rmnf-cs">Manifest 02 &bull; Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="rmnf-panel active" id="rmnf-eb">
    <header class="rmnf-header">
      <div>
        <div class="rmnf-eyebrow">Inventory Dossier &bull; {{ eb_level.layman }} Roast</div>
        <h1 class="rmnf-title">{{ eb.title }}</h1>
      </div>
      <div class="rmnf-header-meta">
        House Formulation &bull; Order 01<br>
        Status: Mid Molt
      </div>
    </header>

    <div class="rmnf-grid">
      <!-- Left: Dossier -->
      <div class="rmnf-dossier">
        <div class="rmnf-block">
          <div class="rmnf-block-head">Sensory Attributes</div>
          <blockquote class="rmnf-sub-notes">&ldquo;{{ eb.tasting_notes | capitalize }}.&rdquo;</blockquote>
          <p class="rmnf-block-body" style="margin-top: 0.75rem;">{{ eb.description }}</p>
        </div>

        <div class="rmnf-block">
          <div class="rmnf-block-head">Active Formulation Lots</div>
          {% assign latest_eb = eb.history | first %}
          {% for c in latest_eb.components %}
            <div class="rmnf-item-line">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
        </div>

        <div class="rmnf-block">
          <div class="rmnf-block-head">Roastery Specifications</div>
          <div class="rmnf-item-line">
            <span>Roast Degree</span>
            <strong>{{ eb_level.name }} ({{ eb_level.layman }})</strong>
          </div>
          <div class="rmnf-item-line">
            <span>Extraction Parameters</span>
            <strong>{{ eb.brewing_method }}</strong>
          </div>
          <div class="rmnf-item-line">
            <span>Primary Origins</span>
            <strong>{{ eb.origins | join: ", " }}</strong>
          </div>
        </div>

        <div class="rmnf-block" style="border-bottom: none;">
          <div class="rmnf-block-head">Field Log Observation</div>
          <p class="rmnf-block-body" style="font-size: 0.92rem; font-style: italic;">
            {{ eb.fun_fact }}
          </p>
        </div>
      </div>

      <!-- Right: Artwork & Buy Card -->
      <div class="rmnf-right-col">
        <div class="rmnf-artwork-frame">
          {% assign eb_img = '/images/' | append: eb.mascot_file %}
          <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="rmnf-bird-img">
        </div>

        <div class="rmnf-buy-card">
          <div class="rmnf-price-row">
            <span class="rmnf-label" style="margin: 0;">Fulfillment Price</span>
            <div class="rmnf-price" id="rmnf-eb-price">
              {% if eb.temporary_price and eb.temporary_price["12oz"] %}
                <s>${{ eb.price["12oz"] }}</s> <span class="rmnf-sale-tag">${{ eb.temporary_price["12oz"] }}</span>
              {% else %}
                ${{ eb.price["12oz"] }}
              {% endif %}
            </div>
          </div>

          <div class="rmnf-form-group">
            <label class="rmnf-label" for="rmnf-eb-size">Package Volume</label>
            <select class="rmnf-select" id="rmnf-eb-size">
              {% for sz in site.data.bag_sizes %}
                <option value="{{ sz.id }}"
                        data-reg="{{ eb.price[sz.id] }}"
                        {% if eb.temporary_price and eb.temporary_price[sz.id] %}data-sale="{{ eb.temporary_price[sz.id] }}"{% endif %}
                        {% if sz.id == '12oz' %} selected{% endif %}>
                  {{ sz.label }} &mdash; {% if eb.temporary_price and eb.temporary_price[sz.id] %}${{ eb.temporary_price[sz.id] }}{% else %}${{ eb.price[sz.id] }}{% endif %}
                </option>
              {% endfor %}
            </select>
          </div>

          <div class="rmnf-form-group">
            <label class="rmnf-label" for="rmnf-eb-grind">Grind Specification</label>
            <select class="rmnf-select" id="rmnf-eb-grind">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
              {% endfor %}
            </select>
          </div>

          <button type="button" class="rmnf-btn">Order Manifest Entry</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="rmnf-panel" id="rmnf-cs">
    <header class="rmnf-header">
      <div>
        <div class="rmnf-eyebrow">Inventory Dossier &bull; {{ cs_level.layman }} Roast</div>
        <h1 class="rmnf-title">{{ cs.title }}</h1>
      </div>
      <div class="rmnf-header-meta">
        Espresso Formulation &bull; Order 03<br>
        Status: Best Seller
      </div>
    </header>

    <div class="rmnf-grid">
      <!-- Left: Dossier -->
      <div class="rmnf-dossier">
        <div class="rmnf-block">
          <div class="rmnf-block-head">Sensory Attributes</div>
          <blockquote class="rmnf-sub-notes">&ldquo;{{ cs.tasting_notes | capitalize }}.&rdquo;</blockquote>
          <p class="rmnf-block-body" style="margin-top: 0.75rem;">{{ cs.description }}</p>
        </div>

        <div class="rmnf-block">
          <div class="rmnf-block-head">Active Formulation Lots</div>
          {% assign latest_cs = cs.history | first %}
          {% for c in latest_cs.components %}
            <div class="rmnf-item-line">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
        </div>

        <div class="rmnf-block">
          <div class="rmnf-block-head">Roastery Specifications</div>
          <div class="rmnf-item-line">
            <span>Roast Degree</span>
            <strong>{{ cs_level.name }} ({{ cs_level.layman }})</strong>
          </div>
          <div class="rmnf-item-line">
            <span>Extraction Parameters</span>
            <strong>{{ cs.brewing_method }}</strong>
          </div>
          <div class="rmnf-item-line">
            <span>Primary Origins</span>
            <strong>{{ cs.origins | join: ", " }}</strong>
          </div>
        </div>

        <div class="rmnf-block" style="border-bottom: none;">
          <div class="rmnf-block-head">Field Log Observation</div>
          <p class="rmnf-block-body" style="font-size: 0.92rem; font-style: italic;">
            {{ cs.fun_fact }}
          </p>
        </div>
      </div>

      <!-- Right: Artwork & Buy Card -->
      <div class="rmnf-right-col">
        <div class="rmnf-artwork-frame">
          {% assign cs_img = '/images/' | append: cs.mascot_file %}
          <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="rmnf-bird-img">
        </div>

        <div class="rmnf-buy-card">
          <div class="rmnf-price-row">
            <span class="rmnf-label" style="margin: 0;">Fulfillment Price</span>
            <div class="rmnf-price" id="rmnf-cs-price">
              ${{ cs.price["12oz"] }}
            </div>
          </div>

          <div class="rmnf-form-group">
            <label class="rmnf-label" for="rmnf-cs-size">Package Volume</label>
            <select class="rmnf-select" id="rmnf-cs-size">
              {% for sz in site.data.bag_sizes %}
                <option value="{{ sz.id }}"
                        data-reg="{{ cs.price[sz.id] }}"
                        {% if sz.id == '12oz' %} selected{% endif %}>
                  {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}
                </option>
              {% endfor %}
            </select>
          </div>

          <div class="rmnf-form-group">
            <label class="rmnf-label" for="rmnf-cs-grind">Grind Specification</label>
            <select class="rmnf-select" id="rmnf-cs-grind">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
              {% endfor %}
            </select>
          </div>

          <button type="button" class="rmnf-btn">Order Manifest Entry</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    const switchBtns = document.querySelectorAll('.rmnf-switch-btn');
    const panels = document.querySelectorAll('.rmnf-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    const ebSelect = document.getElementById('rmnf-eb-size');
    const ebPrice = document.getElementById('rmnf-eb-price');
    if (ebSelect && ebPrice) {
      ebSelect.addEventListener('change', () => {
        const opt = ebSelect.options[ebSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          ebPrice.innerHTML = `<s>$${reg}</s> <span class="rmnf-sale-tag">$${sale}</span>`;
        } else {
          ebPrice.innerHTML = `$${reg}`;
        }
      });
    }

    const csSelect = document.getElementById('rmnf-cs-size');
    const csPrice = document.getElementById('rmnf-cs-price');
    if (csSelect && csPrice) {
      csSelect.addEventListener('change', () => {
        const opt = csSelect.options[csSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        csPrice.innerHTML = `$${reg}`;
      });
    }
  })();
</script>
