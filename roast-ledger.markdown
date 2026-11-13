---
layout: default
title: Roast Preview (Roaster's Ledger) — Yellow Wing Roasters
permalink: /roast-ledger/
---

<style>
  /* ── Swiss Architectural Monospace Ledger Roast Prototype ── */
  :root {
    --ldg-bg: #ffffff;
    --ldg-panel-bg: #fafafa;
    --ldg-text: #111111;
    --ldg-muted: #666666;
    --ldg-light: #999999;
    --ldg-line: #e2e2e2;
    --ldg-sale: #c2410c;
  }

  body {
    background-color: var(--ldg-bg) !important;
    color: var(--ldg-text);
  }

  .mono-wrap {
    max-width: 1220px;
    margin: 0 auto;
    padding: 2.5rem 24px 9rem;
  }

  /* ── Switcher ── */
  .mono-switcher {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 3.5rem;
  }

  .mono-switch-btn {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.45rem 1rem;
    background: transparent;
    border: 1px solid var(--ldg-line);
    cursor: pointer;
    transition: all 0.14s ease;
    color: var(--ldg-muted);
  }

  .mono-switch-btn:hover {
    border-color: var(--ldg-text);
    color: var(--ldg-text);
  }

  .mono-switch-btn.active {
    background: var(--ldg-text);
    color: #ffffff;
    border-color: var(--ldg-text);
  }

  /* ── Panels ── */
  .mono-panel {
    display: none;
    border: 1px solid var(--ldg-line);
  }

  .mono-panel.active {
    display: block;
  }

  /* Top Technical Banner */
  .mono-top-banner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--ldg-line);
    background: var(--ldg-panel-bg);
  }

  .mono-meta-cell {
    padding: 0.75rem 1.25rem;
    border-right: 1px solid var(--ldg-line);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .mono-meta-cell:last-child {
    border-right: none;
  }

  .mono-meta-cell span {
    color: var(--ldg-light);
    display: block;
    margin-bottom: 2px;
  }

  /* Main 2-Column Split */
  .mono-main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* Left: Artwork & Technical Metrics */
  .mono-left-col {
    border-right: 1px solid var(--ldg-line);
    display: flex;
    flex-direction: column;
  }

  .mono-artwork-frame {
    padding: 4rem 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 420px;
    background: #ffffff;
    border-bottom: 1px solid var(--ldg-line);
  }

  .mono-bird-img {
    max-width: 82%;
    max-height: 380px;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.06));
    transition: transform 0.25s ease;
  }

  .mono-artwork-frame:hover .mono-bird-img {
    transform: scale(1.04);
  }

  .mono-specs-table {
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.82rem;
  }

  .mono-spec-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.45rem;
    border-bottom: 1px dashed var(--ldg-line);
  }

  .mono-spec-item span:first-child {
    color: var(--ldg-muted);
  }

  /* Right: Catalog Description & Buy Action */
  .mono-right-col {
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .mono-lot-id {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--ldg-light);
  }

  .mono-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 0.25rem 0 0;
  }

  .mono-price-display {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .mono-price-display s {
    font-size: 1.15rem;
    color: var(--ldg-light);
    font-weight: 400;
    margin-right: 0.5rem;
  }

  .mono-sale-val {
    color: var(--ldg-sale);
  }

  .mono-notes-callout {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--ldg-muted);
    border-left: 2px solid var(--ldg-text);
    padding-left: 1.25rem;
    margin: 0;
  }

  /* Size Matrix Buttons */
  .mono-size-matrix {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mono-matrix-label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ldg-muted);
  }

  .mono-matrix-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .mono-matrix-btn {
    padding: 0.75rem 0.5rem;
    border: 1px solid var(--ldg-line);
    background: transparent;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.14s ease;
  }

  .mono-matrix-btn:hover {
    border-color: var(--ldg-text);
  }

  .mono-matrix-btn.active {
    background: var(--ldg-text);
    color: #ffffff;
    border-color: var(--ldg-text);
  }

  /* Grind Select */
  .mono-grind-select {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid var(--ldg-line);
    background: #ffffff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.88rem;
    color: var(--ldg-text);
    cursor: pointer;
  }

  /* Action Button */
  .mono-order-btn {
    width: 100%;
    padding: 1.15rem;
    background: var(--ldg-text);
    color: #ffffff;
    border: 1px solid var(--ldg-text);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .mono-order-btn:hover {
    background: #ffffff;
    color: var(--ldg-text);
  }

  @media (max-width: 900px) {
    .mono-top-banner {
      grid-template-columns: repeat(2, 1fr);
    }
    .mono-main-grid {
      grid-template-columns: 1fr;
    }
    .mono-left-col {
      border-right: none;
      border-bottom: 1px solid var(--ldg-line);
    }
  }
</style>

<div class="mono-wrap">
  <!-- ── Switcher ── -->
  <nav class="mono-switcher" aria-label="Ledger Switcher">
    <button type="button" class="mono-switch-btn active" data-target="mono-eb">LOT 01 // Early Bird</button>
    <button type="button" class="mono-switch-btn" data-target="mono-cs">LOT 02 // Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <section class="mono-panel active" id="mono-eb">
    <!-- Top Technical Banner -->
    <div class="mono-top-banner">
      <div class="mono-meta-cell">
        <span>Classification</span>
        Signature Blend
      </div>
      <div class="mono-meta-cell">
        <span>Roast Profile</span>
        {{ eb_level.name }}
      </div>
      <div class="mono-meta-cell">
        <span>Extraction Target</span>
        Pour-over / Espresso
      </div>
      <div class="mono-meta-cell">
        <span>Status</span>
        Active Production
      </div>
    </div>

    <!-- Main Grid -->
    <div class="mono-main-grid">
      <!-- Left Column -->
      <div class="mono-left-col">
        <div class="mono-artwork-frame">
          {% assign eb_img = '/images/' | append: eb.mascot_file %}
          <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="mono-bird-img">
        </div>

        <div class="mono-specs-table">
          <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
            [ Component Lot Composition ]
          </div>
          {% assign latest_eb = eb.history | first %}
          {% for c in latest_eb.components %}
            <div class="mono-spec-item">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
          <div class="mono-spec-item">
            <span>Primary Origins</span>
            <strong>{{ eb.origins | join: " / " }}</strong>
          </div>
          <div class="mono-spec-item">
            <span>Sensory Descriptors</span>
            <strong>{{ eb.descriptor | capitalize }}</strong>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="mono-right-col">
        <div>
          <span class="mono-lot-id">ROAST RECORD // 001</span>
          <h1 class="mono-title">{{ eb.title }}</h1>
        </div>

        <div class="mono-price-display" id="mono-eb-price">
          {% if eb.temporary_price and eb.temporary_price["12oz"] %}
            <s>${{ eb.price["12oz"] }}</s> <span class="mono-sale-val">${{ eb.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ eb.price["12oz"] }}
          {% endif %}
        </div>

        <p class="mono-notes-callout">
          <strong>Tasting Notes:</strong> {{ eb.tasting_notes }}<br>
          {{ eb.description }}
        </p>

        <!-- Size Matrix Buttons -->
        <div class="mono-size-matrix">
          <span class="mono-matrix-label">Select Volume (Weight)</span>
          <div class="mono-matrix-grid" id="mono-eb-sizes">
            {% for sz in site.data.bag_sizes %}
              <button type="button" class="mono-matrix-btn{% if sz.id == '12oz' %} active{% endif %}"
                      data-size="{{ sz.id }}"
                      data-reg="{{ eb.price[sz.id] }}"
                      {% if eb.temporary_price and eb.temporary_price[sz.id] %}data-sale="{{ eb.temporary_price[sz.id] }}"{% endif %}>
                {{ sz.id }}
              </button>
            {% endfor %}
          </div>
        </div>

        <!-- Grind Select -->
        <div>
          <span class="mono-matrix-label" style="display: block; margin-bottom: 0.4rem;">Designate Grind</span>
          <select class="mono-grind-select">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="mono-order-btn">Commit to Cart [12oz]</button>

        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; color: var(--ldg-light); line-height: 1.5; border-top: 1px solid var(--ldg-line); padding-top: 1rem;">
          OBSERVATION: {{ eb.fun_fact }}
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <section class="mono-panel" id="mono-cs">
    <!-- Top Technical Banner -->
    <div class="mono-top-banner">
      <div class="mono-meta-cell">
        <span>Classification</span>
        Espresso Blend
      </div>
      <div class="mono-meta-cell">
        <span>Roast Profile</span>
        {{ cs_level.name }}
      </div>
      <div class="mono-meta-cell">
        <span>Extraction Target</span>
        Espresso / Moka
      </div>
      <div class="mono-meta-cell">
        <span>Status</span>
        Active Production
      </div>
    </div>

    <!-- Main Grid -->
    <div class="mono-main-grid">
      <!-- Left Column -->
      <div class="mono-left-col">
        <div class="mono-artwork-frame">
          {% assign cs_img = '/images/' | append: cs.mascot_file %}
          <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="mono-bird-img">
        </div>

        <div class="mono-specs-table">
          <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
            [ Component Lot Composition ]
          </div>
          {% assign latest_cs = cs.history | first %}
          {% for c in latest_cs.components %}
            <div class="mono-spec-item">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
          <div class="mono-spec-item">
            <span>Primary Origins</span>
            <strong>{{ cs.origins | join: " / " }}</strong>
          </div>
          <div class="mono-spec-item">
            <span>Sensory Descriptors</span>
            <strong>{{ cs.descriptor | capitalize }}</strong>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="mono-right-col">
        <div>
          <span class="mono-lot-id">ROAST RECORD // 002</span>
          <h1 class="mono-title">{{ cs.title }}</h1>
        </div>

        <div class="mono-price-display" id="mono-cs-price">
          ${{ cs.price["12oz"] }}
        </div>

        <p class="mono-notes-callout">
          <strong>Tasting Notes:</strong> {{ cs.tasting_notes }}<br>
          {{ cs.description }}
        </p>

        <!-- Size Matrix Buttons -->
        <div class="mono-size-matrix">
          <span class="mono-matrix-label">Select Volume (Weight)</span>
          <div class="mono-matrix-grid" id="mono-cs-sizes">
            {% for sz in site.data.bag_sizes %}
              <button type="button" class="mono-matrix-btn{% if sz.id == '12oz' %} active{% endif %}"
                      data-size="{{ sz.id }}"
                      data-reg="{{ cs.price[sz.id] }}">
                {{ sz.id }}
              </button>
            {% endfor %}
          </div>
        </div>

        <!-- Grind Select -->
        <div>
          <span class="mono-matrix-label" style="display: block; margin-bottom: 0.4rem;">Designate Grind</span>
          <select class="mono-grind-select">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="mono-order-btn">Commit to Cart [12oz]</button>

        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; color: var(--ldg-light); line-height: 1.5; border-top: 1px solid var(--ldg-line); padding-top: 1rem;">
          OBSERVATION: {{ cs.fun_fact }}
        </div>
      </div>
    </div>
  </section>
</div>

<script>
  (function() {
    // Switcher Logic
    const switchBtns = document.querySelectorAll('.mono-switch-btn');
    const panels = document.querySelectorAll('.mono-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    // Matrix Size Buttons Logic
    function setupMatrix(gridId, priceId) {
      const grid = document.getElementById(gridId);
      const priceDisplay = document.getElementById(priceId);
      if (!grid || !priceDisplay) return;

      const btns = grid.querySelectorAll('.mono-matrix-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const reg = btn.getAttribute('data-reg');
          const sale = btn.getAttribute('data-sale');
          if (sale) {
            priceDisplay.innerHTML = `<s>$${reg}</s> <span class="mono-sale-val">$${sale}</span>`;
          } else {
            priceDisplay.innerHTML = `$${reg}`;
          }
        });
      });
    }

    setupMatrix('mono-eb-sizes', 'mono-eb-price');
    setupMatrix('mono-cs-sizes', 'mono-cs-price');
  })();
</script>
