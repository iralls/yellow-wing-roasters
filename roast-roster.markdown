---
layout: default
title: Roast Preview (Field Roster) — Yellow Wing Roasters
permalink: /roast-roster/
---

<style>
  /* ── Field Roster Line-Item Roast Detail Prototype ── */
  :root {
    --rstr-bg: #fbf9f5;
    --rstr-surface: #ffffff;
    --rstr-text: #1d1814;
    --rstr-muted: #786f65;
    --rstr-light: #a3998e;
    --rstr-line: rgba(29, 24, 20, 0.1);
    --rstr-hover-bg: #f4efe6;
    --rstr-accent: #9c6d12;
    --rstr-sale: #b45309;
  }

  body {
    background-color: var(--rstr-bg) !important;
    color: var(--rstr-text);
  }

  .rstr-wrap {
    max-width: 1040px;
    margin: 0 auto;
    padding: 2.5rem 24px 9rem;
  }

  /* ── Switcher ── */
  .rstr-switcher {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 3.5rem;
  }

  .rstr-switch-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--rstr-muted);
    background: transparent;
    border: 1px solid var(--rstr-line);
    padding: 0.5rem 1.25rem;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.16s ease;
  }

  .rstr-switch-btn:hover {
    border-color: var(--rstr-text);
    color: var(--rstr-text);
  }

  .rstr-switch-btn.active {
    background: var(--rstr-text);
    color: #ffffff;
    border-color: var(--rstr-text);
  }

  /* ── Panels ── */
  .rstr-panel {
    display: none;
    background: var(--rstr-surface);
    border: 1px solid var(--rstr-line);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(29, 24, 20, 0.03);
    overflow: hidden;
  }

  .rstr-panel.active {
    display: block;
  }

  /* Top Hero Row */
  .rstr-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2.5rem 2.5rem 2rem;
    border-bottom: 1px solid var(--rstr-line);
    background: #ffffff;
    flex-wrap: wrap;
  }

  .rstr-top-left {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }

  .rstr-icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(29, 24, 20, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .rstr-bird-thumb {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
    transition: transform 0.2s ease;
  }

  .rstr-top-row:hover .rstr-bird-thumb {
    transform: scale(1.08);
  }

  .rstr-hero-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 0 0 0.25rem;
  }

  .rstr-hero-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    color: var(--rstr-muted);
    margin: 0;
  }

  .rstr-hero-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.75rem;
    font-weight: 700;
    text-align: right;
  }

  .rstr-hero-price s {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--rstr-light);
    margin-right: 0.4rem;
  }

  .rstr-sale-txt {
    color: var(--rstr-sale);
  }

  /* ── Tabular Specification Rows ── */
  .rstr-rows-wrap {
    display: flex;
    flex-direction: column;
  }

  .rstr-row-item {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2rem;
    padding: 1.35rem 2.5rem;
    border-bottom: 1px solid var(--rstr-line);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    align-items: baseline;
    transition: background-color 0.14s ease;
  }

  .rstr-row-item:hover {
    background-color: var(--rstr-hover-bg);
  }

  .rstr-row-key {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--rstr-muted);
  }

  .rstr-row-val {
    font-size: 0.98rem;
    line-height: 1.6;
    color: var(--rstr-text);
  }

  .rstr-row-val strong {
    color: var(--rstr-text);
  }

  .rstr-comp-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .rstr-chip {
    padding: 0.35rem 0.75rem;
    background: rgba(29, 24, 20, 0.05);
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* ── Order Action Console Row ── */
  .rstr-action-bar {
    display: grid;
    grid-template-columns: 220px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.75rem 2.5rem;
    background: #fbf9f5;
  }

  .rstr-select {
    padding: 0.8rem 1rem;
    background: #ffffff;
    border: 1px solid var(--rstr-line);
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    color: var(--rstr-text);
    cursor: pointer;
  }

  .rstr-order-btn {
    padding: 0.95rem 2rem;
    background: var(--rstr-text);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.15s ease;
    white-space: nowrap;
  }

  .rstr-order-btn:hover {
    background: #000000;
  }

  @media (max-width: 860px) {
    .rstr-row-item {
      grid-template-columns: 1fr;
      gap: 0.4rem;
      padding: 1.15rem 1.5rem;
    }
    .rstr-action-bar {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1.5rem;
    }
    .rstr-top-row {
      padding: 1.5rem;
    }
  }
</style>

<div class="rstr-wrap">
  <!-- ── Switcher ── -->
  <nav class="rstr-switcher" aria-label="Roster Item Switcher">
    <button type="button" class="rstr-switch-btn active" data-target="rstr-eb">Roster Item 01 &bull; Early Bird</button>
    <button type="button" class="rstr-switch-btn" data-target="rstr-cs">Roster Item 02 &bull; Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="rstr-panel active" id="rstr-eb">
    <!-- Top Hero Banner -->
    <div class="rstr-top-row">
      <div class="rstr-top-left">
        <div class="rstr-icon-circle">
          {% assign eb_img = '/images/' | append: eb.mascot_file %}
          <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="rstr-bird-thumb">
        </div>
        <div>
          <h1 class="rstr-hero-title">{{ eb.title }}</h1>
          <p class="rstr-hero-sub">Signature House Blend &bull; {{ eb_level.layman }} Roast</p>
        </div>
      </div>

      <div class="rstr-hero-price" id="rstr-eb-price">
        {% if eb.temporary_price and eb.temporary_price["12oz"] %}
          <s>${{ eb.price["12oz"] }}</s> <span class="rstr-sale-txt">${{ eb.temporary_price["12oz"] }}</span>
        {% else %}
          ${{ eb.price["12oz"] }}
        {% endif %}
      </div>
    </div>

    <!-- Tabular Specification Rows -->
    <div class="rstr-rows-wrap">
      <div class="rstr-row-item">
        <span class="rstr-row-key">Sensory Profile</span>
        <div class="rstr-row-val">
          <strong>{{ eb.tasting_notes | capitalize }}</strong> &mdash; {{ eb.descriptor | capitalize }}.
          <div style="color: var(--rstr-muted); margin-top: 0.35rem;">{{ eb.description }}</div>
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Roast Degree</span>
        <div class="rstr-row-val">
          <strong>{{ eb_level.name }}</strong> (Specialty {{ eb_level.specialty }}, Level {{ eb.roast_level }}/5)
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Blend Formulation</span>
        <div class="rstr-row-val">
          {% assign latest_eb = eb.history | first %}
          <div class="rstr-comp-chips">
            {% for c in latest_eb.components %}
              <span class="rstr-chip">{{ c.name }}: <strong>{{ c.ratio }}</strong></span>
            {% endfor %}
          </div>
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Brew Guide</span>
        <div class="rstr-row-val">{{ eb.brewing_method }}</div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Field Observation</span>
        <div class="rstr-row-val" style="font-style: italic; color: var(--rstr-muted);">
          &ldquo;{{ eb.fun_fact }}&rdquo;
        </div>
      </div>
    </div>

    <!-- Order Console -->
    <div class="rstr-action-bar">
      <div>
        <label for="rstr-eb-size" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Package Size</label>
        <select class="rstr-select" id="rstr-eb-size" style="width: 100%;">
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

      <div>
        <label for="rstr-eb-grind" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Grind Selection</label>
        <select class="rstr-select" id="rstr-eb-grind" style="width: 100%;">
          {% for g in site.data.grind_levels %}
            <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
          {% endfor %}
        </select>
      </div>

      <div style="align-self: flex-end;">
        <button type="button" class="rstr-order-btn">Add to Cart</button>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="rstr-panel" id="rstr-cs">
    <!-- Top Hero Banner -->
    <div class="rstr-top-row">
      <div class="rstr-top-left">
        <div class="rstr-icon-circle">
          {% assign cs_img = '/images/' | append: cs.mascot_file %}
          <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="rstr-bird-thumb">
        </div>
        <div>
          <h1 class="rstr-hero-title">{{ cs.title }}</h1>
          <p class="rstr-hero-sub">Signature Espresso Blend &bull; {{ cs_level.layman }} Roast</p>
        </div>
      </div>

      <div class="rstr-hero-price" id="rstr-cs-price">
        ${{ cs.price["12oz"] }}
      </div>
    </div>

    <!-- Tabular Specification Rows -->
    <div class="rstr-rows-wrap">
      <div class="rstr-row-item">
        <span class="rstr-row-key">Sensory Profile</span>
        <div class="rstr-row-val">
          <strong>{{ cs.tasting_notes | capitalize }}</strong> &mdash; {{ cs.descriptor | capitalize }}.
          <div style="color: var(--rstr-muted); margin-top: 0.35rem;">{{ cs.description }}</div>
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Roast Degree</span>
        <div class="rstr-row-val">
          <strong>{{ cs_level.name }}</strong> (Specialty {{ cs_level.specialty }}, Level {{ cs.roast_level }}/5)
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Blend Formulation</span>
        <div class="rstr-row-val">
          {% assign latest_cs = cs.history | first %}
          <div class="rstr-comp-chips">
            {% for c in latest_cs.components %}
              <span class="rstr-chip">{{ c.name }}: <strong>{{ c.ratio }}</strong></span>
            {% endfor %}
          </div>
        </div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Brew Guide</span>
        <div class="rstr-row-val">{{ cs.brewing_method }}</div>
      </div>

      <div class="rstr-row-item">
        <span class="rstr-row-key">Field Observation</span>
        <div class="rstr-row-val" style="font-style: italic; color: var(--rstr-muted);">
          &ldquo;{{ cs.fun_fact }}&rdquo;
        </div>
      </div>
    </div>

    <!-- Order Console -->
    <div class="rstr-action-bar">
      <div>
        <label for="rstr-cs-size" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Package Size</label>
        <select class="rstr-select" id="rstr-cs-size" style="width: 100%;">
          {% for sz in site.data.bag_sizes %}
            <option value="{{ sz.id }}"
                    data-reg="{{ cs.price[sz.id] }}"
                    {% if sz.id == '12oz' %} selected{% endif %}>
              {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}
            </option>
          {% endfor %}
        </select>
      </div>

      <div>
        <label for="rstr-cs-grind" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Grind Selection</label>
        <select class="rstr-select" id="rstr-cs-grind" style="width: 100%;">
          {% for g in site.data.grind_levels %}
            <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
          {% endfor %}
        </select>
      </div>

      <div style="align-self: flex-end;">
        <button type="button" class="rstr-order-btn">Add to Cart</button>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    const switchBtns = document.querySelectorAll('.rstr-switch-btn');
    const panels = document.querySelectorAll('.rstr-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    const ebSelect = document.getElementById('rstr-eb-size');
    const ebPrice = document.getElementById('rstr-eb-price');
    if (ebSelect && ebPrice) {
      ebSelect.addEventListener('change', () => {
        const opt = ebSelect.options[ebSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          ebPrice.innerHTML = `<s>$${reg}</s> <span class="rstr-sale-txt">$${sale}</span>`;
        } else {
          ebPrice.innerHTML = `$${reg}`;
        }
      });
    }

    const csSelect = document.getElementById('rstr-cs-size');
    const csPrice = document.getElementById('rstr-cs-price');
    if (csSelect && csPrice) {
      csSelect.addEventListener('change', () => {
        const opt = csSelect.options[csSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        csPrice.innerHTML = `$${reg}`;
      });
    }
  })();
</script>
