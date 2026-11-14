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

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="atl-wrap">
  <!-- ── Switcher ── -->
  <nav class="atl-switcher" aria-label="Atelier Switcher">
    {% for r in house_blends %}
      <button type="button" class="atl-switch-btn{% if forloop.first %} active{% endif %}" data-target="atl-{{ r.slug }}">Atelier 0{{ forloop.index }} &mdash; {{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    {% assign mascot_name = site.data.mascots[r.mascot] | default: r.mascot %}
    <div class="atl-panel{% if forloop.first %} active{% endif %}" id="atl-{{ r.slug }}">
      <!-- Left: The Dossier -->
      <div class="atl-dossier">
        <div class="atl-step">
          <span class="atl-step-tag">01 // Identifier</span>
          <h1 class="atl-title">{{ r.title }}</h1>
          <div class="atl-price-line" id="atl-{{ r.slug }}-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s> <span class="atl-sale-tag">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="atl-step">
          <span class="atl-step-tag">02 // Sensory Profile</span>
          <blockquote class="atl-sensory-quote">&ldquo;{{ r.tasting_notes | capitalize }}.&rdquo;</blockquote>
          <p class="atl-body-p">{{ r.description }}</p>
        </div>

        <div class="atl-step">
          <span class="atl-step-tag">03 // Formulation &amp; Craft</span>
          <table class="atl-comp-table">
            {% for c in latest_history.components %}
              <tr>
                <td>{{ c.name }}</td>
                <td>{{ c.ratio }}</td>
              </tr>
            {% endfor %}
            <tr>
              <td style="color: var(--atl-light);">Roast Profile</td>
              <td>{{ r_level.name }} ({{ r_level.layman }})</td>
            </tr>
            <tr>
              <td style="color: var(--atl-light);">Extraction Method</td>
              <td>{{ r.brewing_method }}</td>
            </tr>
          </table>
        </div>

        <div class="atl-step">
          <span class="atl-step-tag">04 // Acquisition</span>
          <div class="atl-form-row">
            <label class="atl-form-label" for="atl-{{ r.slug }}-size">Designate Bag Size</label>
            <select class="atl-select atl-size-select" id="atl-{{ r.slug }}-size" data-target-price="atl-{{ r.slug }}-price">
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

          <div class="atl-form-row" style="margin-top: 0.75rem;">
            <label class="atl-form-label" for="atl-{{ r.slug }}-grind">Grind Specification</label>
            <select class="atl-select" id="atl-{{ r.slug }}-grind">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
              {% endfor %}
            </select>
          </div>

          <button type="button" class="atl-btn" style="margin-top: 1rem;">Acquire Blend</button>
        </div>

        <div class="atl-step" style="border-bottom: none;">
          <span class="atl-step-tag">05 // Naturalist Note</span>
          <p class="atl-body-p" style="font-size: 0.92rem;">{{ r.fun_fact }}</p>
        </div>
      </div>

      <!-- Right: Sticky Artwork Stage -->
      <div class="atl-stage-col">
        <div class="atl-stage">
          {% assign r_img = '/images/' | append: r.mascot_file %}
          <img src="{{ r_img | relative_url }}" alt="{{ r.title }}" class="atl-bird-render">
          <span class="atl-stage-caption">Atelier Artwork &bull; {{ mascot_name }}</span>
        </div>
      </div>
    </div>
  {% endfor %}
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
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.atl-size-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const targetId = sel.getAttribute('data-target-price');
        const priceDisplay = document.getElementById(targetId);
        const opt = sel.options[sel.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          priceDisplay.innerHTML = `<s>$${reg}</s> <span class="atl-sale-tag">$${sale}</span>`;
        } else {
          priceDisplay.innerHTML = `$${reg}`;
        }
      });
    });
  })();
</script>
