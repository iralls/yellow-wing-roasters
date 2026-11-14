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

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="rmnf-wrap">
  <!-- ── Switcher ── -->
  <nav class="rmnf-switcher" aria-label="Manifest Switcher">
    {% for r in house_blends %}
      <button type="button" class="rmnf-switch-btn{% if forloop.first %} active{% endif %}" data-target="rmnf-{{ r.slug }}">Manifest 0{{ forloop.index }} &bull; {{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    <div class="rmnf-panel{% if forloop.first %} active{% endif %}" id="rmnf-{{ r.slug }}">
      <header class="rmnf-header">
        <div>
          <div class="rmnf-eyebrow">Inventory Dossier &bull; {{ r_level.layman }} Roast</div>
          <h1 class="rmnf-title">{{ r.title }}</h1>
        </div>
        <div class="rmnf-header-meta">
          House Formulation &bull; Order 0{{ r.order | default: forloop.index }}<br>
          Status: {% if r.status == 'mid_molt' %}Mid Molt{% elsif r.best_seller %}Best Seller{% else %}Active{% endif %}
        </div>
      </header>

      <div class="rmnf-grid">
        <!-- Left: Dossier -->
        <div class="rmnf-dossier">
          <div class="rmnf-block">
            <div class="rmnf-block-head">Sensory Attributes</div>
            <blockquote class="rmnf-sub-notes">&ldquo;{{ r.tasting_notes | capitalize }}.&rdquo;</blockquote>
            <p class="rmnf-block-body" style="margin-top: 0.75rem;">{{ r.description }}</p>
          </div>

          <div class="rmnf-block">
            <div class="rmnf-block-head">Active Formulation Lots</div>
            {% for c in latest_history.components %}
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
              <strong>{{ r_level.name }} ({{ r_level.layman }})</strong>
            </div>
            <div class="rmnf-item-line">
              <span>Extraction Parameters</span>
              <strong>{{ r.brewing_method }}</strong>
            </div>
            <div class="rmnf-item-line">
              <span>Primary Origins</span>
              <strong>{{ r.origins | join: ", " }}</strong>
            </div>
          </div>

          <div class="rmnf-block" style="border-bottom: none;">
            <div class="rmnf-block-head">Field Log Observation</div>
            <p class="rmnf-block-body" style="font-size: 0.92rem; font-style: italic;">
              {{ r.fun_fact }}
            </p>
          </div>
        </div>

        <!-- Right: Artwork & Buy Card -->
        <div class="rmnf-right-col">
          <div class="rmnf-artwork-frame">
            {% assign r_img = '/images/' | append: r.mascot_file %}
            <img src="{{ r_img | relative_url }}" alt="{{ r.title }}" class="rmnf-bird-img">
          </div>

          <div class="rmnf-buy-card">
            <div class="rmnf-price-row">
              <span class="rmnf-label" style="margin: 0;">Fulfillment Price</span>
              <div class="rmnf-price" id="rmnf-{{ r.slug }}-price">
                {% if r.temporary_price and r.temporary_price["12oz"] %}
                  <s>${{ r.price["12oz"] }}</s> <span class="rmnf-sale-tag">${{ r.temporary_price["12oz"] }}</span>
                {% else %}
                  ${{ r.price["12oz"] }}
                {% endif %}
              </div>
            </div>

            <div class="rmnf-form-group">
              <label class="rmnf-label" for="rmnf-{{ r.slug }}-size">Package Volume</label>
              <select class="rmnf-select rmnf-size-select" id="rmnf-{{ r.slug }}-size" data-target-price="rmnf-{{ r.slug }}-price">
                {% for sz in site.data.bag_sizes %}
                  <option value="{{ sz.id }}"
                          data-reg="{{ r.price[sz.id] }}"
                          {% if r.temporary_price and r.temporary_price[sz.id] %}data-sale="{{ r.temporary_price[sz.id] }}"{% endif %}
                          {% if sz.id == '12oz' %} selected{% endif %}>
                    {{ sz.label }} &mdash; {% if r.temporary_price and r.temporary_price[sz.id] %}${{ r.temporary_price[sz.id] }}{% else %}${{ r.price[sz.id] }}{% endif %}
                  </option>
                {% endfor %}
              </select>
            </div>

            <div class="rmnf-form-group">
              <label class="rmnf-label" for="rmnf-{{ r.slug }}-grind">Grind Specification</label>
              <select class="rmnf-select" id="rmnf-{{ r.slug }}-grind">
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
  {% endfor %}
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
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.rmnf-size-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const targetId = sel.getAttribute('data-target-price');
        const priceDisplay = document.getElementById(targetId);
        const opt = sel.options[sel.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          priceDisplay.innerHTML = `<s>$${reg}</s> <span class="rmnf-sale-tag">$${sale}</span>`;
        } else {
          priceDisplay.innerHTML = `$${reg}`;
        }
      });
    });
  })();
</script>
