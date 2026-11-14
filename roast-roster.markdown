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

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="rstr-wrap">
  <!-- ── Switcher ── -->
  <nav class="rstr-switcher" aria-label="Roster Item Switcher">
    {% for r in house_blends %}
      <button type="button" class="rstr-switch-btn{% if forloop.first %} active{% endif %}" data-target="rstr-{{ r.slug }}">Roster Item 0{{ forloop.index }} &bull; {{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    <div class="rstr-panel{% if forloop.first %} active{% endif %}" id="rstr-{{ r.slug }}">
      <!-- Top Hero Banner -->
      <div class="rstr-top-row">
        <div class="rstr-top-left">
          <div class="rstr-icon-circle">
            {% assign r_img = '/images/' | append: r.mascot_file %}
            <img src="{{ r_img | relative_url }}" alt="{{ r.title }}" class="rstr-bird-thumb">
          </div>
          <div>
            <h1 class="rstr-hero-title">{{ r.title }}</h1>
            <p class="rstr-hero-sub">Signature House Blend &bull; {{ r_level.layman }} Roast</p>
          </div>
        </div>

        <div class="rstr-hero-price" id="rstr-{{ r.slug }}-price">
          {% if r.temporary_price and r.temporary_price["12oz"] %}
            <s>${{ r.price["12oz"] }}</s> <span class="rstr-sale-txt">${{ r.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ r.price["12oz"] }}
          {% endif %}
        </div>
      </div>

      <!-- Tabular Specification Rows -->
      <div class="rstr-rows-wrap">
        <div class="rstr-row-item">
          <span class="rstr-row-key">Sensory Profile</span>
          <div class="rstr-row-val">
            <strong>{{ r.tasting_notes | capitalize }}</strong> &mdash; {{ r.descriptor | capitalize }}.
            <div style="color: var(--rstr-muted); margin-top: 0.35rem;">{{ r.description }}</div>
          </div>
        </div>

        <div class="rstr-row-item">
          <span class="rstr-row-key">Roast Degree</span>
          <div class="rstr-row-val">
            <strong>{{ r_level.name }}</strong> (Specialty {{ r_level.specialty }}, Level {{ r.roast_level }}/5)
          </div>
        </div>

        <div class="rstr-row-item">
          <span class="rstr-row-key">Blend Formulation</span>
          <div class="rstr-row-val">
            <div class="rstr-comp-chips">
              {% for c in latest_history.components %}
                <span class="rstr-chip">{{ c.name }}: <strong>{{ c.ratio }}</strong></span>
              {% endfor %}
            </div>
          </div>
        </div>

        <div class="rstr-row-item">
          <span class="rstr-row-key">Brew Guide</span>
          <div class="rstr-row-val">{{ r.brewing_method }}</div>
        </div>

        <div class="rstr-row-item">
          <span class="rstr-row-key">Field Observation</span>
          <div class="rstr-row-val" style="font-style: italic; color: var(--rstr-muted);">
            &ldquo;{{ r.fun_fact }}&rdquo;
          </div>
        </div>
      </div>

      <!-- Order Console -->
      <div class="rstr-action-bar">
        <div>
          <label for="rstr-{{ r.slug }}-size" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Package Size</label>
          <select class="rstr-select rstr-size-select" id="rstr-{{ r.slug }}-size" data-target-price="rstr-{{ r.slug }}-price" style="width: 100%;">
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

        <div>
          <label for="rstr-{{ r.slug }}-grind" class="rstr-row-key" style="display: block; margin-bottom: 0.35rem;">Grind Selection</label>
          <select class="rstr-select" id="rstr-{{ r.slug }}-grind" style="width: 100%;">
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
  {% endfor %}
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
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.rstr-size-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const targetId = sel.getAttribute('data-target-price');
        const priceDisplay = document.getElementById(targetId);
        const opt = sel.options[sel.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          priceDisplay.innerHTML = `<s>$${reg}</s> <span class="rstr-sale-txt">$${sale}</span>`;
        } else {
          priceDisplay.innerHTML = `$${reg}`;
        }
      });
    });
  })();
</script>
