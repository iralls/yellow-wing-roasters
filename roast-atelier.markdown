---
layout: default
title: Roast Preview (Studio Atelier) — Yellow Wing Roasters
permalink: /roast-atelier/
---

<style>
  /* ── Studio Atelier Roast Page Prototype ── */
  :root {
    --atl-bg: #faf9f6;
    --atl-surface: #ffffff;
    --atl-text: #1a1714;
    --atl-muted: #72685e;
    --atl-light: #a69c91;
    --atl-line: rgba(26, 23, 20, 0.12);
    --atl-accent: #9c6d12;
    --atl-sale: #b45309;
  }

  body {
    background-color: var(--atl-bg) !important;
    color: var(--atl-text);
  }

  .atl-wrap {
    max-width: 1220px;
    margin: 0 auto;
    padding: 2.5rem 32px 9rem;
  }

  /* ── Switcher ── */
  .atl-switcher {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 3.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--atl-line);
  }

  .atl-switch-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--atl-light);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.16s ease;
    padding: 0.25rem 0;
    position: relative;
  }

  .atl-switch-btn:hover {
    color: var(--atl-text);
  }

  .atl-switch-btn.active {
    color: var(--atl-text);
  }

  .atl-switch-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--atl-text);
  }

  /* ── Panels ── */
  .atl-panel {
    display: none;
  }

  .atl-panel.active {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 5rem;
    align-items: start;
  }

  /* ── Left Column: The Atelier Dossier ── */
  .atl-dossier {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .atl-step {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--atl-line);
  }

  .atl-step-tag {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--atl-accent);
  }

  .atl-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 0;
  }

  .atl-price-line {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--atl-text);
  }

  .atl-price-line s {
    font-size: 1.2rem;
    color: var(--atl-light);
    font-weight: 400;
    margin-right: 0.4rem;
  }

  .atl-sale-tag {
    color: var(--atl-sale);
  }

  .atl-sensory-quote {
    font-family: 'Figtree', Georgia, serif;
    font-size: 1.35rem;
    font-style: italic;
    color: #3b3026;
    line-height: 1.45;
    margin: 0;
  }

  .atl-body-p {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1rem;
    line-height: 1.65;
    color: var(--atl-muted);
    margin: 0;
  }

  /* Formulation Table */
  .atl-comp-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
  }

  .atl-comp-table td {
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--atl-line);
  }

  .atl-comp-table td:last-child {
    text-align: right;
    font-weight: 600;
  }

  /* Acquisition Form */
  .atl-form-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .atl-form-label {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--atl-muted);
  }

  .atl-select {
    padding: 0.85rem 1rem;
    background: var(--atl-surface);
    border: 1px solid var(--atl-line);
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--atl-text);
    cursor: pointer;
  }

  .atl-btn {
    padding: 1.15rem;
    background: var(--atl-text);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: background-color 0.16s ease;
  }

  .atl-btn:hover {
    background: #000000;
  }

  /* ── Right Column: Sticky Artwork Stage ── */
  .atl-stage-col {
    position: sticky;
    top: 3rem;
  }

  .atl-stage {
    background: var(--atl-surface);
    border: 1px solid var(--atl-line);
    border-radius: 6px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3.5rem 2rem 2rem;
    box-shadow: 0 8px 30px rgba(26, 23, 20, 0.04);
  }

  .atl-bird-render {
    max-width: 82%;
    max-height: 82%;
    object-fit: contain;
    filter: drop-shadow(0 14px 28px rgba(26, 23, 20, 0.09));
    transition: transform 0.35s ease;
  }

  .atl-stage:hover .atl-bird-render {
    transform: translateY(-4px) scale(1.03);
  }

  .atl-stage-caption {
    margin-top: 1.5rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--atl-light);
  }

  @media (max-width: 900px) {
    .atl-panel.active {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .atl-stage-col {
      position: static;
      order: -1;
    }
  }
</style>

<div class="atl-wrap">
  <!-- ── Switcher ── -->
  <nav class="atl-switcher" aria-label="Atelier Switcher">
    <button type="button" class="atl-switch-btn active" data-target="atl-eb">Atelier 01 &mdash; Early Bird</button>
    <button type="button" class="atl-switch-btn" data-target="atl-cs">Atelier 02 &mdash; Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="atl-panel active" id="atl-eb">
    <!-- Left: The Dossier -->
    <div class="atl-dossier">
      <div class="atl-step">
        <span class="atl-step-tag">01 // Identifier</span>
        <h1 class="atl-title">{{ eb.title }}</h1>
        <div class="atl-price-line" id="atl-eb-price">
          {% if eb.temporary_price and eb.temporary_price["12oz"] %}
            <s>${{ eb.price["12oz"] }}</s> <span class="atl-sale-tag">${{ eb.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ eb.price["12oz"] }}
          {% endif %}
        </div>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">02 // Sensory Profile</span>
        <blockquote class="atl-sensory-quote">&ldquo;{{ eb.tasting_notes | capitalize }}.&rdquo;</blockquote>
        <p class="atl-body-p">{{ eb.description }}</p>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">03 // Formulation &amp; Craft</span>
        <table class="atl-comp-table">
          {% assign latest_eb = eb.history | first %}
          {% for c in latest_eb.components %}
            <tr>
              <td>{{ c.name }}</td>
              <td>{{ c.ratio }}</td>
            </tr>
          {% endfor %}
          <tr>
            <td style="color: var(--atl-light);">Roast Profile</td>
            <td>{{ eb_level.name }} ({{ eb_level.layman }})</td>
          </tr>
          <tr>
            <td style="color: var(--atl-light);">Extraction Method</td>
            <td>{{ eb.brewing_method }}</td>
          </tr>
        </table>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">04 // Acquisition</span>
        <div class="atl-form-row">
          <label class="atl-form-label" for="atl-eb-size">Designate Bag Size</label>
          <select class="atl-select" id="atl-eb-size">
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

        <div class="atl-form-row" style="margin-top: 0.75rem;">
          <label class="atl-form-label" for="atl-eb-grind">Grind Specification</label>
          <select class="atl-select" id="atl-eb-grind">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="atl-btn" style="margin-top: 1rem;">Acquire Blend</button>
      </div>

      <div class="atl-step" style="border-bottom: none;">
        <span class="atl-step-tag">05 // Naturalist Note</span>
        <p class="atl-body-p" style="font-size: 0.92rem;">{{ eb.fun_fact }}</p>
      </div>
    </div>

    <!-- Right: Sticky Artwork Stage -->
    <div class="atl-stage-col">
      <div class="atl-stage">
        {% assign eb_img = '/images/' | append: eb.mascot_file %}
        <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="atl-bird-render">
        <span class="atl-stage-caption">Atelier Artwork &bull; American Robin</span>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="atl-panel" id="atl-cs">
    <!-- Left: The Dossier -->
    <div class="atl-dossier">
      <div class="atl-step">
        <span class="atl-step-tag">01 // Identifier</span>
        <h1 class="atl-title">{{ cs.title }}</h1>
        <div class="atl-price-line" id="atl-cs-price">
          ${{ cs.price["12oz"] }}
        </div>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">02 // Sensory Profile</span>
        <blockquote class="atl-sensory-quote">&ldquo;{{ cs.tasting_notes | capitalize }}.&rdquo;</blockquote>
        <p class="atl-body-p">{{ cs.description }}</p>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">03 // Formulation &amp; Craft</span>
        <table class="atl-comp-table">
          {% assign latest_cs = cs.history | first %}
          {% for c in latest_cs.components %}
            <tr>
              <td>{{ c.name }}</td>
              <td>{{ c.ratio }}</td>
            </tr>
          {% endfor %}
          <tr>
            <td style="color: var(--atl-light);">Roast Profile</td>
            <td>{{ cs_level.name }} ({{ cs_level.layman }})</td>
          </tr>
          <tr>
            <td style="color: var(--atl-light);">Extraction Method</td>
            <td>{{ cs.brewing_method }}</td>
          </tr>
        </table>
      </div>

      <div class="atl-step">
        <span class="atl-step-tag">04 // Acquisition</span>
        <div class="atl-form-row">
          <label class="atl-form-label" for="atl-cs-size">Designate Bag Size</label>
          <select class="atl-select" id="atl-cs-size">
            {% for sz in site.data.bag_sizes %}
              <option value="{{ sz.id }}"
                      data-reg="{{ cs.price[sz.id] }}"
                      {% if sz.id == '12oz' %} selected{% endif %}>
                {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}
              </option>
            {% endfor %}
          </select>
        </div>

        <div class="atl-form-row" style="margin-top: 0.75rem;">
          <label class="atl-form-label" for="atl-cs-grind">Grind Specification</label>
          <select class="atl-select" id="atl-cs-grind">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="button" class="atl-btn" style="margin-top: 1rem;">Acquire Blend</button>
      </div>

      <div class="atl-step" style="border-bottom: none;">
        <span class="atl-step-tag">05 // Naturalist Note</span>
        <p class="atl-body-p" style="font-size: 0.92rem;">{{ cs.fun_fact }}</p>
      </div>
    </div>

    <!-- Right: Sticky Artwork Stage -->
    <div class="atl-stage-col">
      <div class="atl-stage">
        {% assign cs_img = '/images/' | append: cs.mascot_file %}
        <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="atl-bird-render">
        <span class="atl-stage-caption">Atelier Artwork &bull; Chimney Swift</span>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    const switchBtns = document.querySelectorAll('.atl-switch-btn');
    const panels = document.querySelectorAll('.atl-panel');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    const ebSelect = document.getElementById('atl-eb-size');
    const ebPrice = document.getElementById('atl-eb-price');
    if (ebSelect && ebPrice) {
      ebSelect.addEventListener('change', () => {
        const opt = ebSelect.options[ebSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          ebPrice.innerHTML = `<s>$${reg}</s> <span class="atl-sale-tag">$${sale}</span>`;
        } else {
          ebPrice.innerHTML = `$${reg}`;
        }
      });
    }

    const csSelect = document.getElementById('atl-cs-size');
    const csPrice = document.getElementById('atl-cs-price');
    if (csSelect && csPrice) {
      csSelect.addEventListener('change', () => {
        const opt = csSelect.options[csSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        csPrice.innerHTML = `$${reg}`;
      });
    }
  })();
</script>
