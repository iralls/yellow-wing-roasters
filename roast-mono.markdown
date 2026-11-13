---
layout: default
title: Roast Preview (Swiss Mono Grid) — Yellow Wing Roasters
permalink: /roast-mono/
---

<style>
  /* ── Swiss Architectural Mono Grid Roast Prototype ── */
  :root {
    --sm-bg: #f7f7f7;
    --sm-cell-bg: #ffffff;
    --sm-text: #0e0e0e;
    --sm-muted: #5e5e5e;
    --sm-line: #0e0e0e;
    --sm-sale: #c2410c;
  }

  body {
    background-color: var(--sm-bg) !important;
    color: var(--sm-text);
  }

  .sm-wrap {
    max-width: 1240px;
    margin: 0 auto;
    padding: 2.5rem 24px 9rem;
  }

  /* ── Switcher ── */
  .sm-switcher {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 3.5rem;
    border: 1px solid var(--sm-line);
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .sm-switch-btn {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0.5rem 1.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--sm-muted);
    transition: all 0.14s ease;
  }

  .sm-switch-btn:first-child {
    border-right: 1px solid var(--sm-line);
  }

  .sm-switch-btn.active {
    background: var(--sm-line);
    color: #ffffff;
  }

  /* ── Panels ── */
  .sm-panel {
    display: none;
    border: 1px solid var(--sm-line);
    background: var(--sm-line);
    gap: 1px;
  }

  .sm-panel.active {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
  }

  /* ── Left Grid Block: Hero Image & Top Bar ── */
  .sm-col-left {
    background: var(--sm-cell-bg);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--sm-line);
  }

  .sm-cell-header {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--sm-line);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--sm-muted);
  }

  .sm-visual-stage {
    padding: 4rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 440px;
    background: #ffffff;
    position: relative;
  }

  .sm-bird-img {
    max-width: 80%;
    max-height: 400px;
    object-fit: contain;
    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.08));
    transition: transform 0.25s ease;
  }

  .sm-visual-stage:hover .sm-bird-img {
    transform: scale(1.04);
  }

  .sm-meta-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid var(--sm-line);
    background: #fbfbfb;
  }

  .sm-meta-box {
    padding: 1rem 1.25rem;
    border-right: 1px solid var(--sm-line);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.74rem;
  }

  .sm-meta-box:last-child {
    border-right: none;
  }

  .sm-meta-box span {
    display: block;
    color: var(--sm-muted);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 3px;
  }

  /* ── Right Grid Block: Action & Specs ── */
  .sm-col-right {
    background: var(--sm-cell-bg);
    display: flex;
    flex-direction: column;
  }

  .sm-action-pad {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-bottom: 1px solid var(--sm-line);
  }

  .sm-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .sm-price-tag {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .sm-price-tag s {
    font-size: 1.15rem;
    color: var(--sm-muted);
    font-weight: 400;
    margin-right: 0.5rem;
  }

  .sm-sale-num {
    color: var(--sm-sale);
  }

  .sm-desc {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.98rem;
    line-height: 1.65;
    color: var(--sm-muted);
    margin: 0;
  }

  /* Form Elements */
  .sm-opt-row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .sm-opt-label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--sm-muted);
  }

  .sm-pills {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--sm-line);
  }

  .sm-pill-btn {
    padding: 0.75rem 0.5rem;
    background: transparent;
    border: none;
    border-right: 1px solid var(--sm-line);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.14s ease;
  }

  .sm-pill-btn:last-child {
    border-right: none;
  }

  .sm-pill-btn.active {
    background: var(--sm-line);
    color: #ffffff;
  }

  .sm-select {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid var(--sm-line);
    background: #ffffff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.88rem;
    color: var(--sm-text);
    cursor: pointer;
  }

  .sm-btn {
    width: 100%;
    padding: 1.25rem;
    background: var(--sm-line);
    color: #ffffff;
    border: none;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .sm-btn:hover {
    background: #333333;
  }

  /* Formulation Specs */
  .sm-specs-pad {
    padding: 2rem 2.5rem;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
  }

  .sm-spec-line {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.45rem;
    border-bottom: 1px dashed rgba(14, 14, 14, 0.15);
  }

  @media (max-width: 900px) {
    .sm-panel.active {
      grid-template-columns: 1fr;
    }
    .sm-col-left {
      border-right: none;
      border-bottom: 1px solid var(--sm-line);
    }
  }
</style>

<div class="sm-wrap">
  <!-- ── Switcher ── -->
  <nav class="sm-switcher" aria-label="Swiss Grid Switcher">
    <button type="button" class="sm-switch-btn active" data-target="sm-eb">MOD 01 // Early Bird</button>
    <button type="button" class="sm-switch-btn" data-target="sm-cs">MOD 02 // Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="sm-panel active" id="sm-eb">
    <!-- Left Column -->
    <div class="sm-col-left">
      <div class="sm-cell-header">
        <span>ARCHITECTURAL CELL // 01</span>
        <span>VISUAL ARTIFACT</span>
      </div>

      <div class="sm-visual-stage">
        {% assign eb_img = '/images/' | append: eb.mascot_file %}
        <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="sm-bird-img">
      </div>

      <div class="sm-meta-strip">
        <div class="sm-meta-box">
          <span>Roast Level</span>
          {{ eb_level.layman }} ({{ eb.roast_level }}/5)
        </div>
        <div class="sm-meta-box">
          <span>Status</span>
          Mid Molt
        </div>
        <div class="sm-meta-box">
          <span>Mascot Taxon</span>
          Robin
        </div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="sm-col-right">
      <div class="sm-cell-header">
        <span>ARCHITECTURAL CELL // 02</span>
        <span>SPECIFICATION &amp; ORDER</span>
      </div>

      <div class="sm-action-pad">
        <div>
          <span style="font-family: ui-monospace, monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--sm-muted);">
            CLASS // SIGNATURE BLEND
          </span>
          <h1 class="sm-title">{{ eb.title }}</h1>
        </div>

        <div class="sm-price-tag" id="sm-eb-price">
          {% if eb.temporary_price and eb.temporary_price["12oz"] %}
            <s>${{ eb.price["12oz"] }}</s> <span class="sm-sale-num">${{ eb.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ eb.price["12oz"] }}
          {% endif %}
        </div>

        <p class="sm-desc">{{ eb.description }}</p>

        <!-- Size Pills -->
        <div class="sm-opt-row">
          <span class="sm-opt-label">Package Volume</span>
          <div class="sm-pills" id="sm-eb-pills">
            {% for sz in site.data.bag_sizes %}
              <button type="button" class="sm-pill-btn{% if sz.id == '12oz' %} active{% endif %}"
                      data-size="{{ sz.id }}"
                      data-reg="{{ eb.price[sz.id] }}"
                      {% if eb.temporary_price and eb.temporary_price[sz.id] %}data-sale="{{ eb.temporary_price[sz.id] }}"{% endif %}>
                {{ sz.id }}
              </button>
            {% endfor %}
          </div>
        </div>

        <!-- Grind -->
        <div class="sm-opt-row">
          <span class="sm-opt-label">Milling Specification</span>
          <select class="sm-select">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="sm-btn">Add to Cart &mdash; Order</button>
      </div>

      <!-- Formulation Specs -->
      <div class="sm-specs-pad">
        <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
          [ Blend Component Breakdown ]
        </div>
        {% assign latest_eb = eb.history | first %}
        {% for c in latest_eb.components %}
          <div class="sm-spec-line">
            <span>{{ c.name }}</span>
            <strong>{{ c.ratio }}</strong>
          </div>
        {% endfor %}
        <div class="sm-spec-line">
          <span>Flavor Notes</span>
          <strong>{{ eb.tasting_notes }}</strong>
        </div>
        <div class="sm-spec-line">
          <span>Brew Guide</span>
          <strong>{{ eb.brewing_method }}</strong>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="sm-panel" id="sm-cs">
    <!-- Left Column -->
    <div class="sm-col-left">
      <div class="sm-cell-header">
        <span>ARCHITECTURAL CELL // 01</span>
        <span>VISUAL ARTIFACT</span>
      </div>

      <div class="sm-visual-stage">
        {% assign cs_img = '/images/' | append: cs.mascot_file %}
        <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="sm-bird-img">
      </div>

      <div class="sm-meta-strip">
        <div class="sm-meta-box">
          <span>Roast Level</span>
          {{ cs_level.layman }} ({{ cs.roast_level }}/5)
        </div>
        <div class="sm-meta-box">
          <span>Status</span>
          Best Seller
        </div>
        <div class="sm-meta-box">
          <span>Mascot Taxon</span>
          Swift
        </div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="sm-col-right">
      <div class="sm-cell-header">
        <span>ARCHITECTURAL CELL // 02</span>
        <span>SPECIFICATION &amp; ORDER</span>
      </div>

      <div class="sm-action-pad">
        <div>
          <span style="font-family: ui-monospace, monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--sm-muted);">
            CLASS // ESPRESSO BLEND
          </span>
          <h1 class="sm-title">{{ cs.title }}</h1>
        </div>

        <div class="sm-price-tag" id="sm-cs-price">
          ${{ cs.price["12oz"] }}
        </div>

        <p class="sm-desc">{{ cs.description }}</p>

        <!-- Size Pills -->
        <div class="sm-opt-row">
          <span class="sm-opt-label">Package Volume</span>
          <div class="sm-pills" id="sm-cs-pills">
            {% for sz in site.data.bag_sizes %}
              <button type="button" class="sm-pill-btn{% if sz.id == '12oz' %} active{% endif %}"
                      data-size="{{ sz.id }}"
                      data-reg="{{ cs.price[sz.id] }}">
                {{ sz.id }}
              </button>
            {% endfor %}
          </div>
        </div>

        <!-- Grind -->
        <div class="sm-opt-row">
          <span class="sm-opt-label">Milling Specification</span>
          <select class="sm-select">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="sm-btn">Add to Cart &mdash; Order</button>
      </div>

      <!-- Formulation Specs -->
      <div class="sm-specs-pad">
        <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
          [ Blend Component Breakdown ]
        </div>
        {% assign latest_cs = cs.history | first %}
        {% for c in latest_cs.components %}
          <div class="sm-spec-line">
            <span>{{ c.name }}</span>
            <strong>{{ c.ratio }}</strong>
          </div>
        {% endfor %}
        <div class="sm-spec-line">
          <span>Flavor Notes</span>
          <strong>{{ cs.tasting_notes }}</strong>
        </div>
        <div class="sm-spec-line">
          <span>Brew Guide</span>
          <strong>{{ cs.brewing_method }}</strong>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    const switchBtns = document.querySelectorAll('.sm-switch-btn');
    const panels = document.querySelectorAll('.sm-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    function setupPills(pillsId, priceId) {
      const container = document.getElementById(pillsId);
      const display = document.getElementById(priceId);
      if (!container || !display) return;

      const pills = container.querySelectorAll('.sm-pill-btn');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');

          const reg = pill.getAttribute('data-reg');
          const sale = pill.getAttribute('data-sale');
          if (sale) {
            display.innerHTML = `<s>$${reg}</s> <span class="sm-sale-num">$${sale}</span>`;
          } else {
            display.innerHTML = `$${reg}`;
          }
        });
      });
    }

    setupPills('sm-eb-pills', 'sm-eb-price');
    setupPills('sm-cs-pills', 'sm-cs-price');
  })();
</script>
