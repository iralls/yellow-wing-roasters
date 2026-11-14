---
layout: default
title: Roast Preview (DrinkOther Minimal) — Yellow Wing Roasters
permalink: /roast-minimal/
---

<style>
  /* ── DrinkOther Minimalist Product Page Prototype ── */
  :root {
    --roast-min-bg: #faf9f6;
    --roast-min-surface: #ffffff;
    --roast-min-text: #191410;
    --roast-min-muted: #756a5f;
    --roast-min-light: #9c9186;
    --roast-min-border: #e8e4dc;
    --roast-min-accent: #9c6d12;
    --roast-min-sale: #b45309;
  }

  body {
    background-color: var(--roast-min-bg) !important;
    color: var(--roast-min-text);
  }

  .roast-min-wrap {
    max-width: 1140px;
    margin: 0 auto;
    padding: 2.5rem 24px 8rem;
  }

  /* ── Roast Switcher Bar ── */
  .roast-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 3.5rem;
    padding: 0.5rem;
    background: rgba(25, 20, 16, 0.04);
    border-radius: 999px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .switcher-label {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--roast-min-muted);
    padding: 0 0.5rem 0 0.75rem;
  }

  .switcher-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--roast-min-muted);
    padding: 0.45rem 1.15rem;
    border-radius: 999px;
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .switcher-btn:hover {
    color: var(--roast-min-text);
  }

  .switcher-btn.active {
    background: var(--roast-min-surface);
    color: var(--roast-min-text);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* ── 2-Column Product Layout ── */
  .roast-panel {
    display: none;
  }

  .roast-panel.active {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  /* ── Left Column: Stage ── */
  .roast-min-gallery {
    position: sticky;
    top: 2rem;
  }

  .roast-min-stage {
    background: var(--roast-min-surface);
    border: 1px solid var(--roast-min-border);
    border-radius: 20px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    box-shadow: 0 4px 20px rgba(25, 20, 16, 0.03);
  }

  .roast-min-badge {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.35rem 0.75rem;
    background: rgba(25, 20, 16, 0.05);
    color: var(--roast-min-text);
    border-radius: 999px;
  }

  .roast-min-img {
    max-width: 82%;
    max-height: 82%;
    object-fit: contain;
    filter: drop-shadow(0 12px 24px rgba(25, 20, 16, 0.1));
    transition: transform 0.35s ease;
  }

  .roast-min-stage:hover .roast-min-img {
    transform: translateY(-4px) scale(1.03);
  }

  /* ── Right Column: Info & Buy Box ── */
  .roast-min-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .roast-min-eyebrow {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--roast-min-accent);
  }

  .roast-min-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.4rem);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--roast-min-text);
    margin: 0;
  }

  .roast-min-price-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-top: -0.5rem;
  }

  .roast-min-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--roast-min-text);
  }

  .roast-min-price s {
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--roast-min-light);
  }

  .roast-min-price.is-sale {
    color: var(--roast-min-sale);
  }

  .roast-min-desc {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--roast-min-muted);
    margin: 0;
  }

  /* ── Option Selectors ── */
  .roast-opt-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .roast-opt-label {
    display: flex;
    justify-content: space-between;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--roast-min-muted);
  }

  .roast-pills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .roast-pill {
    flex: 1;
    min-width: 68px;
    padding: 0.7rem 0.5rem;
    border: 1px solid var(--roast-min-border);
    border-radius: 8px;
    background: var(--roast-min-surface);
    color: var(--roast-min-text);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .roast-pill:hover {
    border-color: var(--roast-min-text);
  }

  .roast-pill.active {
    background: var(--roast-min-text);
    color: #ffffff;
    border-color: var(--roast-min-text);
  }

  .roast-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--roast-min-border);
    border-radius: 8px;
    background: var(--roast-min-surface);
    color: var(--roast-min-text);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23191410' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 14px;
  }

  /* ── Add to Cart Button ── */
  .roast-atc-btn {
    width: 100%;
    padding: 1.05rem;
    border: none;
    border-radius: 999px;
    background: var(--roast-min-text);
    color: #ffffff;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.02rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.18s ease, transform 0.15s ease;
    margin-top: 0.5rem;
  }

  .roast-atc-btn:hover {
    background: #000000;
    transform: translateY(-1px);
  }

  /* ── Accordion Specs ── */
  .roast-accordion {
    border-top: 1px solid var(--roast-min-border);
    margin-top: 1rem;
  }

  .roast-accordion-item {
    border-bottom: 1px solid var(--roast-min-border);
  }

  .roast-accordion-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.15rem 0;
    background: transparent;
    border: none;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--roast-min-text);
    text-align: left;
    cursor: pointer;
  }

  .roast-accordion-header::after {
    content: '+';
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--roast-min-light);
    transition: transform 0.2s ease;
  }

  .roast-accordion-item.open .roast-accordion-header::after {
    content: '−';
  }

  .roast-accordion-body {
    display: none;
    padding-bottom: 1.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--roast-min-muted);
  }

  .roast-accordion-item.open .roast-accordion-body {
    display: block;
  }

  /* ── Component Ratio List ── */
  .ratio-bar-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .ratio-bar-item {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0.6rem;
    background: rgba(25, 20, 16, 0.03);
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .ratio-bar-item strong {
    color: var(--roast-min-text);
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .roast-panel.active {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .roast-min-gallery {
      position: static;
    }

    .roast-min-stage {
      aspect-ratio: 4 / 3;
      padding: 2rem;
    }
  }
</style>

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="roast-min-wrap">
  <!-- ── Roast Preview Switcher ── -->
  <nav class="roast-switcher" aria-label="Roast Preview Selector">
    <span class="switcher-label">Preview Roast:</span>
    {% for r in house_blends %}
      <button type="button" class="switcher-btn{% if forloop.first %} active{% endif %}" data-target="panel-{{ r.slug }}">{{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    <div class="roast-panel{% if forloop.first %} active{% endif %}" id="panel-{{ r.slug }}">
      <!-- Visual Stage -->
      <div class="roast-min-gallery">
        <div class="roast-min-stage">
          <span class="roast-min-badge">{{ r_level.layman }} Roast</span>
          {% assign r_img = '/images/' | append: r.mascot_file %}
          <img src="{{ r_img | relative_url }}" alt="{{ r.title }} mascot" class="roast-min-img">
        </div>
      </div>

      <!-- Product Info -->
      <div class="roast-min-info">
        <div>
          <div class="roast-min-eyebrow">Signature House Blend</div>
          <h1 class="roast-min-title">{{ r.title }}</h1>
        </div>

        <div class="roast-min-price-row">
          {% if r.temporary_price and r.temporary_price["12oz"] %}
            <div class="roast-min-price is-sale" id="{{ r.slug }}-price-display">
              <s>${{ r.price["12oz"] }}</s> ${{ r.temporary_price["12oz"] }}
            </div>
          {% else %}
            <div class="roast-min-price" id="{{ r.slug }}-price-display">${{ r.price["12oz"] }}</div>
          {% endif %}
        </div>

        <p class="roast-min-desc">{{ r.description }}</p>

        <!-- Size Selection -->
        <div class="roast-opt-group">
          <div class="roast-opt-label">
            <span>Bag Size</span>
            <span id="{{ r.slug }}-size-selected-label">12oz</span>
          </div>
          <div class="roast-pills" id="{{ r.slug }}-size-pills">
            {% for sz in site.data.bag_sizes %}
              <button type="button" class="roast-pill{% if sz.id == '12oz' %} active{% endif %}"
                      data-size="{{ sz.id }}"
                      data-regular="{{ r.price[sz.id] }}"
                      {% if r.temporary_price and r.temporary_price[sz.id] %}data-sale="{{ r.temporary_price[sz.id] }}"{% endif %}>
                {{ sz.label }}
              </button>
            {% endfor %}
          </div>
        </div>

        <!-- Grind Selection -->
        <div class="roast-opt-group">
          <div class="roast-opt-label">
            <span>Grind</span>
          </div>
          <select class="roast-select" id="{{ r.slug }}-grind-select">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <!-- Add to Cart -->
        <button type="button" class="roast-atc-btn">Add to Cart</button>

        <!-- Accordion Drawers -->
        <div class="roast-accordion">
          <div class="roast-accordion-item open">
            <button type="button" class="roast-accordion-header">Flavor &amp; Sensory Notes</button>
            <div class="roast-accordion-body">
              <strong>Tasting Notes:</strong> {{ r.tasting_notes }}<br>
              <strong>Roast Level:</strong> {{ r_level.name }} ({{ r_level.layman }})<br>
              <strong>Descriptor:</strong> {{ r.descriptor | capitalize }}
            </div>
          </div>

          <div class="roast-accordion-item">
            <button type="button" class="roast-accordion-header">Blend Components &amp; Origins</button>
            <div class="roast-accordion-body">
              Active Formulation:
              <div class="ratio-bar-wrap">
                {% for comp in latest_history.components %}
                  <div class="ratio-bar-item">
                    <span>{{ comp.name }}</span>
                    <strong>{{ comp.ratio }}</strong>
                  </div>
                {% endfor %}
              </div>
            </div>
          </div>

          <div class="roast-accordion-item">
            <button type="button" class="roast-accordion-header">Brewing Methods</button>
            <div class="roast-accordion-body">
              Recommended for: {{ r.brewing_method }}.
            </div>
          </div>

          <div class="roast-accordion-item">
            <button type="button" class="roast-accordion-header">Naturalist Field Note</button>
            <div class="roast-accordion-body">
              {{ r.fun_fact }}
            </div>
          </div>
        </div>
      </div>
    </div>
  {% endfor %}
</div>

<script>
  (function() {
    // ── 1. Switcher Logic ──
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const panels = document.querySelectorAll('.roast-panel');

    switcherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switcherBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // ── 2. Pill Size & Price Logic ──
    document.querySelectorAll('.roast-pills').forEach(container => {
      const panel = container.closest('.roast-panel');
      const display = panel.querySelector('.roast-min-price');
      const label = panel.querySelector('.roast-opt-label span:last-child');
      const pills = container.querySelectorAll('.roast-pill');

      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');

          const size = pill.getAttribute('data-size');
          const reg = pill.getAttribute('data-regular');
          const sale = pill.getAttribute('data-sale');

          label.textContent = size;
          if (sale) {
            display.innerHTML = `<s>$${reg}</s> $${sale}`;
            display.classList.add('is-sale');
          } else {
            display.innerHTML = `$${reg}`;
            display.classList.remove('is-sale');
          }
        });
      });
    });

    // ── 3. Accordion Toggle Logic ──
    document.querySelectorAll('.roast-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.roast-accordion-item');
        item.classList.toggle('open');
      });
    });
  })();
</script>
