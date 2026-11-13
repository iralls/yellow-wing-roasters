---
layout: default
title: Roast Preview (Wine List Menu) — Yellow Wing Roasters
permalink: /roast-menu/
---

<style>
  /* ── Fine-Dining Wine List Roast Detail Prototype ── */
  :root {
    --rmenu-bg: #faf7f2;
    --rmenu-text: #241d17;
    --rmenu-muted: #7a7065;
    --rmenu-light: #a89e93;
    --rmenu-line: rgba(36, 29, 23, 0.12);
    --rmenu-accent: #9c6d12;
    --rmenu-sale: #b45309;
  }

  body {
    background-color: var(--rmenu-bg) !important;
    color: var(--rmenu-text);
  }

  .rmenu-wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 3rem 24px 9rem;
  }

  /* ── Switcher ── */
  .rmenu-switcher {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 4rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rmenu-line);
  }

  .rmenu-switch-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--rmenu-light);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.16s ease;
    padding: 0.25rem 0;
    position: relative;
  }

  .rmenu-switch-btn:hover {
    color: var(--rmenu-text);
  }

  .rmenu-switch-btn.active {
    color: var(--rmenu-text);
  }

  .rmenu-switch-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1.25rem;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--rmenu-text);
  }

  /* ── Panels ── */
  .rmenu-panel {
    display: none;
  }

  .rmenu-panel.active {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
  }

  /* ── Header ── */
  .rmenu-header {
    text-align: center;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--rmenu-line);
  }

  .rmenu-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--rmenu-accent);
    margin-bottom: 0.85rem;
  }

  .rmenu-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.8rem, 5.5vw, 4.2rem);
    font-weight: 500;
    letter-spacing: -0.025em;
    line-height: 1.05;
    margin: 0 0 1rem;
    color: var(--rmenu-text);
  }

  .rmenu-insignia {
    width: 140px;
    height: 140px;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(36, 29, 23, 0.08));
    margin: 1.5rem auto 1rem;
    display: block;
  }

  .rmenu-subtitle {
    font-family: 'Figtree', Georgia, serif;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--rmenu-muted);
    line-height: 1.5;
    margin: 0.5rem auto 0;
    max-width: 580px;
  }

  /* ── Menu Section Block ── */
  .rmenu-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .rmenu-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--rmenu-muted);
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--rmenu-line);
    margin: 0;
  }

  /* ── Dotted Leader Row ── */
  .rmenu-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
  }

  .rmenu-label {
    font-weight: 600;
    white-space: nowrap;
  }

  .rmenu-dots {
    flex-grow: 1;
    border-bottom: 1px dotted var(--rmenu-line);
    margin: 0 1rem;
    height: 1px;
    align-self: flex-end;
    margin-bottom: 5px;
  }

  .rmenu-val {
    font-weight: 600;
    white-space: nowrap;
    text-align: right;
  }

  .rmenu-val s {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--rmenu-light);
    margin-right: 0.35rem;
  }

  .rmenu-val .sale-color {
    color: var(--rmenu-sale);
  }

  .rmenu-subline {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.86rem;
    color: var(--rmenu-muted);
    margin-top: -0.85rem;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  /* ── Purchase Console ── */
  .rmenu-order-card {
    background: rgba(36, 29, 23, 0.03);
    border: 1px solid var(--rmenu-line);
    border-radius: 4px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .rmenu-form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .rmenu-form-label {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--rmenu-muted);
  }

  .rmenu-select {
    padding: 0.75rem 1rem;
    background: #ffffff;
    border: 1px solid var(--rmenu-line);
    border-radius: 3px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--rmenu-text);
    cursor: pointer;
    min-width: 220px;
  }

  .rmenu-btn {
    padding: 1.15rem;
    background: var(--rmenu-text);
    color: #ffffff;
    border: none;
    border-radius: 3px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    transition: background 0.16s ease;
    margin-top: 0.5rem;
  }

  .rmenu-btn:hover {
    background: #000000;
  }

  .rmenu-field-story {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--rmenu-muted);
    font-style: italic;
    text-align: center;
    border-top: 1px solid var(--rmenu-line);
    padding-top: 2rem;
    margin: 0;
  }
</style>

<div class="rmenu-wrap">
  <!-- ── Switcher ── -->
  <nav class="rmenu-switcher" aria-label="Menu Course Switcher">
    <button type="button" class="rmenu-switch-btn active" data-target="rmenu-eb">Selection 01 &bull; Early Bird</button>
    <button type="button" class="rmenu-switch-btn" data-target="rmenu-cs">Selection 02 &bull; Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="rmenu-panel active" id="rmenu-eb">
    <header class="rmenu-header">
      <div class="rmenu-eyebrow">House Blend &bull; {{ eb_level.layman }} Roast</div>
      <h1 class="rmenu-title">{{ eb.title }}</h1>

      {% assign eb_img = '/images/' | append: eb.mascot_file %}
      <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }} insignia" class="rmenu-insignia">

      <p class="rmenu-subtitle">&ldquo;{{ eb.tasting_notes | capitalize }} &mdash; balanced and easy drinking with a cocoa sweetness.&rdquo;</p>
    </header>

    <!-- Volume & Pricing (Wine List Dotted Leaders) -->
    <section class="rmenu-section">
      <h2 class="rmenu-section-title">Roastery Volumes &amp; Offerings</h2>

      {% for sz in site.data.bag_sizes %}
        <div class="rmenu-row">
          <span class="rmenu-label">{{ sz.label }} Whole Bean</span>
          <span class="rmenu-dots" aria-hidden="true"></span>
          <span class="rmenu-val">
            {% if eb.temporary_price and eb.temporary_price[sz.id] %}
              <s>${{ eb.price[sz.id] }}</s><span class="sale-color">${{ eb.temporary_price[sz.id] }}</span>
            {% else %}
              ${{ eb.price[sz.id] }}
            {% endif %}
          </span>
        </div>
        <div class="rmenu-subline">
          {% if sz.id == '12oz' %}Standard tasting bag &bull; 340 grams{% endif %}
          {% if sz.id == '1lb' %}One pound roaster batch &bull; 454 grams{% endif %}
          {% if sz.id == '2lb' %}Bi-weekly pantry reserve &bull; 907 grams{% endif %}
          {% if sz.id == '5lb' %}Bespoke wholesale sack &bull; 2.27 kilograms{% endif %}
        </div>
      {% endfor %}
    </section>

    <!-- Blend Origins Formulation -->
    <section class="rmenu-section">
      <h2 class="rmenu-section-title">Origin Lot Formulation</h2>
      {% assign latest_eb = eb.history | first %}
      {% for c in latest_eb.components %}
        <div class="rmenu-row">
          <span class="rmenu-label">{{ c.name }}</span>
          <span class="rmenu-dots" aria-hidden="true"></span>
          <span class="rmenu-val">{{ c.ratio }}</span>
        </div>
      {% endfor %}
      <p class="rmenu-subline" style="margin-top: 0.5rem;">
        Recommended extraction styles: {{ eb.brewing_method }}.
      </p>
    </section>

    <!-- Order Console -->
    <section class="rmenu-order-card">
      <div class="rmenu-form-row">
        <label class="rmenu-form-label" for="rmenu-eb-size">Designate Bag Size</label>
        <select class="rmenu-select" id="rmenu-eb-size">
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

      <div class="rmenu-form-row">
        <label class="rmenu-form-label" for="rmenu-eb-grind">Grind Specification</label>
        <select class="rmenu-select" id="rmenu-eb-grind">
          {% for g in site.data.grind_levels %}
            <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
          {% endfor %}
        </select>
      </div>

      <button type="button" class="rmenu-btn">Order Offering</button>
    </section>

    <!-- Sommelier Observation -->
    <p class="rmenu-field-story">
      &ldquo;{{ eb.fun_fact }}&rdquo;
    </p>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="rmenu-panel" id="rmenu-cs">
    <header class="rmenu-header">
      <div class="rmenu-eyebrow">Espresso Blend &bull; {{ cs_level.layman }} Roast</div>
      <h1 class="rmenu-title">{{ cs.title }}</h1>

      {% assign cs_img = '/images/' | append: cs.mascot_file %}
      <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }} insignia" class="rmenu-insignia">

      <p class="rmenu-subtitle">&ldquo;{{ cs.tasting_notes | capitalize }} &mdash; rich milk chocolate base with bright punchy balance.&rdquo;</p>
    </header>

    <!-- Volume & Pricing (Wine List Dotted Leaders) -->
    <section class="rmenu-section">
      <h2 class="rmenu-section-title">Roastery Volumes &amp; Offerings</h2>

      {% for sz in site.data.bag_sizes %}
        <div class="rmenu-row">
          <span class="rmenu-label">{{ sz.label }} Whole Bean</span>
          <span class="rmenu-dots" aria-hidden="true"></span>
          <span class="rmenu-val">${{ cs.price[sz.id] }}</span>
        </div>
        <div class="rmenu-subline">
          {% if sz.id == '12oz' %}Standard tasting bag &bull; 340 grams{% endif %}
          {% if sz.id == '1lb' %}One pound roaster batch &bull; 454 grams{% endif %}
          {% if sz.id == '2lb' %}Bi-weekly pantry reserve &bull; 907 grams{% endif %}
          {% if sz.id == '5lb' %}Bespoke wholesale sack &bull; 2.27 kilograms{% endif %}
        </div>
      {% endfor %}
    </section>

    <!-- Blend Origins Formulation -->
    <section class="rmenu-section">
      <h2 class="rmenu-section-title">Origin Lot Formulation</h2>
      {% assign latest_cs = cs.history | first %}
      {% for c in latest_cs.components %}
        <div class="rmenu-row">
          <span class="rmenu-label">{{ c.name }}</span>
          <span class="rmenu-dots" aria-hidden="true"></span>
          <span class="rmenu-val">{{ c.ratio }}</span>
        </div>
      {% endfor %}
      <p class="rmenu-subline" style="margin-top: 0.5rem;">
        Recommended extraction styles: {{ cs.brewing_method }}.
      </p>
    </section>

    <!-- Order Console -->
    <section class="rmenu-order-card">
      <div class="rmenu-form-row">
        <label class="rmenu-form-label" for="rmenu-cs-size">Designate Bag Size</label>
        <select class="rmenu-select" id="rmenu-cs-size">
          {% for sz in site.data.bag_sizes %}
            <option value="{{ sz.id }}"
                    data-reg="{{ cs.price[sz.id] }}"
                    {% if sz.id == '12oz' %} selected{% endif %}>
              {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}
            </option>
          {% endfor %}
        </select>
      </div>

      <div class="rmenu-form-row">
        <label class="rmenu-form-label" for="rmenu-cs-grind">Grind Specification</label>
        <select class="rmenu-select" id="rmenu-cs-grind">
          {% for g in site.data.grind_levels %}
            <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
          {% endfor %}
        </select>
      </div>

      <button type="button" class="rmenu-btn">Order Offering</button>
    </section>

    <!-- Sommelier Observation -->
    <p class="rmenu-field-story">
      &ldquo;{{ cs.fun_fact }}&rdquo;
    </p>
  </div>
</div>

<script>
  (function() {
    const switchBtns = document.querySelectorAll('.rmenu-switch-btn');
    const panels = document.querySelectorAll('.rmenu-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });
  })();
</script>
