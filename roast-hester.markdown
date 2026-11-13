---
layout: default
title: Roast Preview (Hester Gallery) — Yellow Wing Roasters
permalink: /roast-hester/
---

<style>
  /* ── Hester Squarespace Gallery Roast Page Prototype ── */
  :root {
    --hst-bg: #f5f4f0;
    --hst-card-bg: #eceae3;
    --hst-text: #1a1612;
    --hst-muted: #6f655a;
    --hst-border: #dedad0;
    --hst-accent: #9c6d12;
    --hst-sale: #b45309;
  }

  body {
    background-color: var(--hst-bg) !important;
    color: var(--hst-text);
  }

  .hst-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 2.5rem 24px 9rem;
  }

  /* ── Switcher ── */
  .hst-switcher {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3.5rem;
  }

  .hst-switcher-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--hst-muted);
    background: transparent;
    border: 1px solid var(--hst-border);
    padding: 0.5rem 1.25rem;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.16s ease;
  }

  .hst-switcher-btn:hover {
    border-color: var(--hst-text);
    color: var(--hst-text);
  }

  .hst-switcher-btn.active {
    background: var(--hst-text);
    color: #ffffff;
    border-color: var(--hst-text);
  }

  /* ── Product Panels ── */
  .hst-panel {
    display: none;
  }

  .hst-panel.active {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4.5rem;
    align-items: start;
  }

  /* ── Left Column: Artwork Frame ── */
  .hst-frame {
    background-color: var(--hst-card-bg);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    border-radius: 2px;
  }

  .hst-frame-tag {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--hst-muted);
  }

  .hst-mascot-img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: drop-shadow(0 14px 24px rgba(26, 22, 18, 0.08));
    transition: transform 0.3s ease;
  }

  .hst-frame:hover .hst-mascot-img {
    transform: scale(1.03);
  }

  /* ── Right Column: Info & Action ── */
  .hst-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hst-cat {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--hst-muted);
  }

  .hst-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--hst-text);
    margin: 0;
  }

  .hst-price-row {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--hst-text);
    margin-top: -0.5rem;
  }

  .hst-price-row s {
    font-size: 1.2rem;
    font-weight: 400;
    color: #9e9386;
    margin-right: 0.4rem;
  }

  .hst-sale-price {
    color: var(--hst-sale);
  }

  .hst-intro {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.02rem;
    line-height: 1.65;
    color: var(--hst-muted);
    margin: 0;
  }

  /* ── Form Inputs ── */
  .hst-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 0.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--hst-border);
  }

  .hst-label {
    display: block;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--hst-muted);
    margin-bottom: 0.4rem;
  }

  .hst-select {
    width: 100%;
    padding: 0.85rem 1rem;
    background: transparent;
    border: 1px solid var(--hst-border);
    border-radius: 2px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--hst-text);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a1612' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 13px;
    transition: border-color 0.16s ease;
  }

  .hst-select:hover,
  .hst-select:focus {
    border-color: var(--hst-text);
    outline: none;
  }

  .hst-btn {
    width: 100%;
    padding: 1.15rem;
    background-color: var(--hst-text);
    color: #ffffff;
    border: 1px solid var(--hst-text);
    border-radius: 2px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: all 0.18s ease;
    margin-top: 0.5rem;
  }

  .hst-btn:hover {
    background-color: transparent;
    color: var(--hst-text);
  }

  /* ── Accordion / Details ── */
  .hst-drawers {
    margin-top: 1.5rem;
    border-top: 1px solid var(--hst-border);
  }

  .hst-drawer {
    border-bottom: 1px solid var(--hst-border);
  }

  .hst-drawer-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 0;
    background: none;
    border: none;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--hst-text);
    cursor: pointer;
    text-align: left;
  }

  .hst-drawer-head::after {
    content: '+';
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--hst-muted);
  }

  .hst-drawer.open .hst-drawer-head::after {
    content: '−';
  }

  .hst-drawer-body {
    display: none;
    padding-bottom: 1.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--hst-muted);
  }

  .hst-drawer.open .hst-drawer-body {
    display: block;
  }

  .hst-component-list {
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;
  }

  .hst-component-list li {
    display: flex;
    justify-content: space-between;
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(222, 218, 208, 0.5);
  }

  @media (max-width: 860px) {
    .hst-panel.active {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
</style>

<div class="hst-wrap">
  <!-- ── Switcher ── -->
  <nav class="hst-switcher" aria-label="Hester Preview Switcher">
    <button type="button" class="hst-switcher-btn active" data-target="hst-cs">Chimney Sweep</button>
    <button type="button" class="hst-switcher-btn" data-target="hst-eb">Early Bird</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="hst-panel active" id="hst-cs">
    <!-- Visual Frame -->
    <div class="hst-frame">
      <span class="hst-frame-tag">{{ cs_level.layman }} Roast</span>
      {% assign cs_img = '/images/' | append: cs.mascot_file %}
      <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="hst-mascot-img">
    </div>

    <!-- Info Column -->
    <div class="hst-info">
      <div>
        <div class="hst-cat">Signature Espresso Blend</div>
        <h1 class="hst-title">{{ cs.title }}</h1>
      </div>

      <div class="hst-price-row" id="hst-cs-price-display">
        ${{ cs.price["12oz"] }}.00
      </div>

      <p class="hst-intro">{{ cs.description }}</p>

      <form class="hst-form" onsubmit="return false;">
        <div>
          <label class="hst-label" for="hst-cs-size">Bag Size</label>
          <select class="hst-select" id="hst-cs-size">
            {% for sz in site.data.bag_sizes %}
              <option value="{{ sz.id }}"
                      data-reg="{{ cs.price[sz.id] }}"
                      {% if sz.id == '12oz' %} selected{% endif %}>
                {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}.00
              </option>
            {% endfor %}
          </select>
        </div>

        <div>
          <label class="hst-label" for="hst-cs-grind">Grind</label>
          <select class="hst-select" id="hst-cs-grind">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="submit" class="hst-btn">Add to Cart</button>
      </form>

      <!-- Drawers -->
      <div class="hst-drawers">
        <div class="hst-drawer open">
          <button type="button" class="hst-drawer-head">Origins &amp; Components</button>
          <div class="hst-drawer-body">
            {% assign latest_cs = cs.history | first %}
            <ul class="hst-component-list">
              {% for c in latest_cs.components %}
                <li>
                  <span>{{ c.name }}</span>
                  <strong>{{ c.ratio }}</strong>
                </li>
              {% endfor %}
            </ul>
          </div>
        </div>

        <div class="hst-drawer">
          <button type="button" class="hst-drawer-head">Profile &amp; Tasting Notes</button>
          <div class="hst-drawer-body">
            <strong>Notes:</strong> {{ cs.tasting_notes }}<br>
            <strong>Descriptor:</strong> {{ cs.descriptor | capitalize }}<br>
            <strong>Brew Style:</strong> {{ cs.brewing_method }}
          </div>
        </div>

        <div class="hst-drawer">
          <button type="button" class="hst-drawer-head">Field Observation</button>
          <div class="hst-drawer-body">
            {{ cs.fun_fact }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="hst-panel" id="hst-eb">
    <!-- Visual Frame -->
    <div class="hst-frame">
      <span class="hst-frame-tag">{{ eb_level.layman }} Roast</span>
      {% assign eb_img = '/images/' | append: eb.mascot_file %}
      <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="hst-mascot-img">
    </div>

    <!-- Info Column -->
    <div class="hst-info">
      <div>
        <div class="hst-cat">Signature House Blend</div>
        <h1 class="hst-title">{{ eb.title }}</h1>
      </div>

      <div class="hst-price-row" id="hst-eb-price-display">
        {% if eb.temporary_price and eb.temporary_price["12oz"] %}
          <s>${{ eb.price["12oz"] }}.00</s> <span class="hst-sale-price">${{ eb.temporary_price["12oz"] }}.00</span>
        {% else %}
          ${{ eb.price["12oz"] }}.00
        {% endif %}
      </div>

      <p class="hst-intro">{{ eb.description }}</p>

      <form class="hst-form" onsubmit="return false;">
        <div>
          <label class="hst-label" for="hst-eb-size">Bag Size</label>
          <select class="hst-select" id="hst-eb-size">
            {% for sz in site.data.bag_sizes %}
              <option value="{{ sz.id }}"
                      data-reg="{{ eb.price[sz.id] }}"
                      {% if eb.temporary_price and eb.temporary_price[sz.id] %}data-sale="{{ eb.temporary_price[sz.id] }}"{% endif %}
                      {% if sz.id == '12oz' %} selected{% endif %}>
                {{ sz.label }} &mdash; {% if eb.temporary_price and eb.temporary_price[sz.id] %}${{ eb.temporary_price[sz.id] }}.00{% else %}${{ eb.price[sz.id] }}.00{% endif %}
              </option>
            {% endfor %}
          </select>
        </div>

        <div>
          <label class="hst-label" for="hst-eb-grind">Grind</label>
          <select class="hst-select" id="hst-eb-grind">
            {% for g in site.data.grind_levels %}
              <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
            {% endfor %}
          </select>
        </div>

        <button type="submit" class="hst-btn">Add to Cart</button>
      </form>

      <!-- Drawers -->
      <div class="hst-drawers">
        <div class="hst-drawer open">
          <button type="button" class="hst-drawer-head">Origins &amp; Components</button>
          <div class="hst-drawer-body">
            {% assign latest_eb = eb.history | first %}
            <ul class="hst-component-list">
              {% for c in latest_eb.components %}
                <li>
                  <span>{{ c.name }}</span>
                  <strong>{{ c.ratio }}</strong>
                </li>
              {% endfor %}
            </ul>
          </div>
        </div>

        <div class="hst-drawer">
          <button type="button" class="hst-drawer-head">Profile &amp; Tasting Notes</button>
          <div class="hst-drawer-body">
            <strong>Notes:</strong> {{ eb.tasting_notes }}<br>
            <strong>Descriptor:</strong> {{ eb.descriptor | capitalize }}<br>
            <strong>Brew Style:</strong> {{ eb.brewing_method }}
          </div>
        </div>

        <div class="hst-drawer">
          <button type="button" class="hst-drawer-head">Field Observation</button>
          <div class="hst-drawer-body">
            {{ eb.fun_fact }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    // Switcher Logic
    const switcherBtns = document.querySelectorAll('.hst-switcher-btn');
    const panels = document.querySelectorAll('.hst-panel');

    switcherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switcherBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    // Dynamic Price Logic
    const csSelect = document.getElementById('hst-cs-size');
    const csDisplay = document.getElementById('hst-cs-price-display');
    if (csSelect && csDisplay) {
      csSelect.addEventListener('change', () => {
        const opt = csSelect.options[csSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        csDisplay.innerHTML = `$${reg}.00`;
      });
    }

    const ebSelect = document.getElementById('hst-eb-size');
    const ebDisplay = document.getElementById('hst-eb-price-display');
    if (ebSelect && ebDisplay) {
      ebSelect.addEventListener('change', () => {
        const opt = ebSelect.options[ebSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          ebDisplay.innerHTML = `<s>$${reg}.00</s> <span class="hst-sale-price">$${sale}.00</span>`;
        } else {
          ebDisplay.innerHTML = `$${reg}.00`;
        }
      });
    }

    // Accordion Toggle
    document.querySelectorAll('.hst-drawer-head').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.hst-drawer').classList.toggle('open');
      });
    });
  })();
</script>
