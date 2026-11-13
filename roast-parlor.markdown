---
layout: default
title: Roast Preview (Parlor Editorial) — Yellow Wing Roasters
permalink: /roast-parlor/
---

<style>
  /* ── Parlor Coffee Boutique Editorial Roast Prototype ── */
  :root {
    --parlor-bg: #f9f7f2;
    --parlor-surface: #ffffff;
    --parlor-text: #231b14;
    --parlor-muted: #796c5e;
    --parlor-light: #ab9f91;
    --parlor-border: rgba(35, 27, 20, 0.1);
    --parlor-accent: #9c6d12;
    --parlor-sale: #b45309;
  }

  body {
    background-color: var(--parlor-bg) !important;
    color: var(--parlor-text);
  }

  .parlor-wrap {
    max-width: 1220px;
    margin: 0 auto;
    padding: 2.5rem 32px 9rem;
  }

  /* ── Switcher ── */
  .parlor-switcher {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 4rem;
    border-bottom: 1px solid var(--parlor-border);
    padding-bottom: 1rem;
  }

  .parlor-switcher-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--parlor-light);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem 0.5rem;
    position: relative;
    transition: color 0.18s ease;
  }

  .parlor-switcher-btn:hover {
    color: var(--parlor-text);
  }

  .parlor-switcher-btn.active {
    color: var(--parlor-text);
  }

  .parlor-switcher-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--parlor-text);
  }

  /* ── Product Panels ── */
  .parlor-panel {
    display: none;
  }

  .parlor-panel.active {
    display: block;
  }

  /* ── Primary Hero Split ── */
  .parlor-hero {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 5rem;
    align-items: center;
    margin-bottom: 6rem;
  }

  /* Artwork Stage (Borderless, Floating) */
  .parlor-visual-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 480px;
    padding: 2rem;
    position: relative;
  }

  .parlor-bird-img {
    max-width: 85%;
    max-height: 480px;
    object-fit: contain;
    filter: drop-shadow(0 20px 30px rgba(35, 27, 20, 0.08));
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .parlor-visual-stage:hover .parlor-bird-img {
    transform: translateY(-6px) scale(1.02);
  }

  /* Product Details */
  .parlor-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 500px;
  }

  .parlor-meta-tag {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--parlor-muted);
  }

  .parlor-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 0;
    color: var(--parlor-text);
  }

  .parlor-price-row {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.45rem;
    font-weight: 500;
    color: var(--parlor-text);
    margin-top: -0.5rem;
  }

  .parlor-price-row s {
    font-size: 1.15rem;
    color: var(--parlor-light);
    margin-right: 0.4rem;
  }

  .parlor-price-row .is-sale {
    color: var(--parlor-sale);
  }

  /* Italic Sensory Lead */
  .parlor-sensory-lead {
    font-family: 'Figtree', Georgia, serif;
    font-size: 1.35rem;
    font-style: italic;
    color: #3d3126;
    line-height: 1.4;
    border-left: 2px solid var(--parlor-accent);
    padding-left: 1.25rem;
    margin: 0.5rem 0;
  }

  .parlor-story-p {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--parlor-muted);
    margin: 0;
  }

  /* ── Buy Box Controls ── */
  .parlor-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--parlor-border);
  }

  .parlor-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .parlor-label {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--parlor-muted);
  }

  .parlor-select {
    padding: 0.8rem 1rem;
    background: transparent;
    border: 1px solid var(--parlor-border);
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--parlor-text);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23231b14' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 13px;
    transition: border-color 0.16s ease;
  }

  .parlor-select:hover,
  .parlor-select:focus {
    border-color: var(--parlor-text);
    outline: none;
  }

  .parlor-atc-btn {
    padding: 1.1rem;
    background: var(--parlor-text);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background-color 0.18s ease;
    margin-top: 0.5rem;
  }

  .parlor-atc-btn:hover {
    background: #000000;
  }

  /* ── Editorial 3-Column Specifications Section ── */
  .parlor-specs {
    border-top: 1px solid var(--parlor-border);
    padding-top: 4rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }

  .parlor-spec-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .parlor-spec-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--parlor-text);
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--parlor-border);
  }

  .parlor-spec-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--parlor-muted);
  }

  .parlor-spec-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.4rem;
    border-bottom: 1px dashed rgba(35, 27, 20, 0.08);
  }

  .parlor-spec-row strong {
    color: var(--parlor-text);
  }

  @media (max-width: 900px) {
    .parlor-hero {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .parlor-specs {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
</style>

<div class="parlor-wrap">
  <!-- ── Preview Switcher ── -->
  <nav class="parlor-switcher" aria-label="Parlor Coffee Roast Switcher">
    <button type="button" class="parlor-switcher-btn active" data-target="parlor-eb">Early Bird</button>
    <button type="button" class="parlor-switcher-btn" data-target="parlor-cs">Chimney Sweep</button>
  </nav>

  <!-- ════════════════════════════════════════════
       PANEL 1: EARLY BIRD
       ════════════════════════════════════════════ -->
  {% assign eb = site.roasts | where: "slug", "early-bird" | first %}
  {% assign eb_level = site.data.roast_levels[eb.roast_level] %}
  <div class="parlor-panel active" id="parlor-eb">
    <section class="parlor-hero">
      <div class="parlor-visual-stage">
        {% assign eb_img = '/images/' | append: eb.mascot_file %}
        <img src="{{ eb_img | relative_url }}" alt="{{ eb.title }}" class="parlor-bird-img">
      </div>

      <div class="parlor-details">
        <span class="parlor-meta-tag">House Blend &bull; {{ eb_level.layman }} Roast</span>
        <h1 class="parlor-title">{{ eb.title }}</h1>

        <div class="parlor-price-row" id="parlor-eb-price">
          {% if eb.temporary_price and eb.temporary_price["12oz"] %}
            <s>${{ eb.price["12oz"] }}</s> <span class="is-sale">${{ eb.temporary_price["12oz"] }}</span>
          {% else %}
            ${{ eb.price["12oz"] }}
          {% endif %}
        </div>

        <blockquote class="parlor-sensory-lead">
          &ldquo;{{ eb.tasting_notes | capitalize }}.&rdquo;
        </blockquote>

        <p class="parlor-story-p">{{ eb.description }}</p>

        <form class="parlor-form" onsubmit="return false;">
          <div class="parlor-field">
            <label class="parlor-label" for="parlor-eb-size">Bag Size</label>
            <select class="parlor-select" id="parlor-eb-size">
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

          <div class="parlor-field">
            <label class="parlor-label" for="parlor-eb-grind">Grind Style</label>
            <select class="parlor-select" id="parlor-eb-grind">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
              {% endfor %}
            </select>
          </div>

          <button type="submit" class="parlor-atc-btn">Add to Cart</button>
        </form>
      </div>
    </section>

    <!-- 3-Column Editorial Specs -->
    <section class="parlor-specs">
      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">The Blend</h3>
        <div class="parlor-spec-list">
          {% assign latest_eb = eb.history | first %}
          {% for c in latest_eb.components %}
            <div class="parlor-spec-row">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
          <div style="font-size: 0.85rem; color: var(--parlor-light); margin-top: 0.5rem;">
            Formulation dated: {{ latest_eb.date }}
          </div>
        </div>
      </div>

      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">Brewing Parameters</h3>
        <div class="parlor-spec-list">
          <div class="parlor-spec-row">
            <span>Recommended Styles</span>
            <strong>{{ eb.brewing_method }}</strong>
          </div>
          <div class="parlor-spec-row">
            <span>Roast Degree</span>
            <strong>{{ eb_level.name }}</strong>
          </div>
          <div class="parlor-spec-row">
            <span>Status</span>
            <strong>Mid Molt</strong>
          </div>
        </div>
      </div>

      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">Field Notes</h3>
        <div class="parlor-spec-list">
          <p style="margin: 0;">{{ eb.fun_fact }}</p>
          <div style="font-size: 0.82rem; font-style: italic; color: var(--parlor-light);">
            Mascot: American Robin (Turdus migratorius)
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- ════════════════════════════════════════════
       PANEL 2: CHIMNEY SWEEP
       ════════════════════════════════════════════ -->
  {% assign cs = site.roasts | where: "slug", "chimney-sweep" | first %}
  {% assign cs_level = site.data.roast_levels[cs.roast_level] %}
  <div class="parlor-panel" id="parlor-cs">
    <section class="parlor-hero">
      <div class="parlor-visual-stage">
        {% assign cs_img = '/images/' | append: cs.mascot_file %}
        <img src="{{ cs_img | relative_url }}" alt="{{ cs.title }}" class="parlor-bird-img">
      </div>

      <div class="parlor-details">
        <span class="parlor-meta-tag">Espresso Blend &bull; {{ cs_level.layman }} Roast</span>
        <h1 class="parlor-title">{{ cs.title }}</h1>

        <div class="parlor-price-row" id="parlor-cs-price">
          ${{ cs.price["12oz"] }}
        </div>

        <blockquote class="parlor-sensory-lead">
          &ldquo;{{ cs.tasting_notes | capitalize }}.&rdquo;
        </blockquote>

        <p class="parlor-story-p">{{ cs.description }}</p>

        <form class="parlor-form" onsubmit="return false;">
          <div class="parlor-field">
            <label class="parlor-label" for="parlor-cs-size">Bag Size</label>
            <select class="parlor-select" id="parlor-cs-size">
              {% for sz in site.data.bag_sizes %}
                <option value="{{ sz.id }}"
                        data-reg="{{ cs.price[sz.id] }}"
                        {% if sz.id == '12oz' %} selected{% endif %}>
                  {{ sz.label }} &mdash; ${{ cs.price[sz.id] }}
                </option>
              {% endfor %}
            </select>
          </div>

          <div class="parlor-field">
            <label class="parlor-label" for="parlor-cs-grind">Grind Style</label>
            <select class="parlor-select" id="parlor-cs-grind">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
              {% endfor %}
            </select>
          </div>

          <button type="submit" class="parlor-atc-btn">Add to Cart</button>
        </form>
      </div>
    </section>

    <!-- 3-Column Editorial Specs -->
    <section class="parlor-specs">
      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">The Blend</h3>
        <div class="parlor-spec-list">
          {% assign latest_cs = cs.history | first %}
          {% for c in latest_cs.components %}
            <div class="parlor-spec-row">
              <span>{{ c.name }}</span>
              <strong>{{ c.ratio }}</strong>
            </div>
          {% endfor %}
          <div style="font-size: 0.85rem; color: var(--parlor-light); margin-top: 0.5rem;">
            Formulation dated: {{ latest_cs.date }}
          </div>
        </div>
      </div>

      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">Brewing Parameters</h3>
        <div class="parlor-spec-list">
          <div class="parlor-spec-row">
            <span>Recommended Styles</span>
            <strong>{{ cs.brewing_method }}</strong>
          </div>
          <div class="parlor-spec-row">
            <span>Roast Degree</span>
            <strong>{{ cs_level.name }}</strong>
          </div>
          <div class="parlor-spec-row">
            <span>Profile</span>
            <strong>{{ cs.descriptor | capitalize }}</strong>
          </div>
        </div>
      </div>

      <div class="parlor-spec-col">
        <h3 class="parlor-spec-title">Field Notes</h3>
        <div class="parlor-spec-list">
          <p style="margin: 0;">{{ cs.fun_fact }}</p>
          <div style="font-size: 0.82rem; font-style: italic; color: var(--parlor-light);">
            Mascot: Chimney Swift (Chaetura pelagica)
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<script>
  (function() {
    // Switcher Logic
    const switcherBtns = document.querySelectorAll('.parlor-switcher-btn');
    const panels = document.querySelectorAll('.parlor-panel');

    switcherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switcherBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });

    // Dynamic Price on Bag Size Select
    const ebSelect = document.getElementById('parlor-eb-size');
    const ebPrice = document.getElementById('parlor-eb-price');
    if (ebSelect && ebPrice) {
      ebSelect.addEventListener('change', () => {
        const opt = ebSelect.options[ebSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          ebPrice.innerHTML = `<s>$${reg}</s> <span class="is-sale">$${sale}</span>`;
        } else {
          ebPrice.innerHTML = `$${reg}`;
        }
      });
    }

    const csSelect = document.getElementById('parlor-cs-size');
    const csPrice = document.getElementById('parlor-cs-price');
    if (csSelect && csPrice) {
      csSelect.addEventListener('change', () => {
        const opt = csSelect.options[csSelect.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        csPrice.innerHTML = `$${reg}`;
      });
    }
  })();
</script>
