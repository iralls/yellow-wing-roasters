---
layout: default
title: Roast Preview (Naturalist Specimen) — Yellow Wing Roasters
permalink: /roast-specimen/
---

<style>
  /* ── Audubon Naturalist Field Plate Specimen Roast Prototype ── */
  :root {
    --spc-bg: #fbf9f4;
    --spc-plate-bg: #ffffff;
    --spc-text: #211b15;
    --spc-muted: #73675a;
    --spc-light: #9c9082;
    --spc-border: #e3ded4;
    --spc-accent: #9c6d12;
    --spc-sale: #b45309;
    --spc-ink: #110e0b;
  }

  body {
    background-color: var(--spc-bg) !important;
    color: var(--spc-text);
  }

  .spc-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 24px 9rem;
  }

  /* ── Switcher ── */
  .spc-switcher {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3.5rem;
  }

  .spc-switcher-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--spc-muted);
    background: transparent;
    border: 1px solid var(--spc-border);
    padding: 0.5rem 1.25rem;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.16s ease;
  }

  .spc-switcher-btn:hover {
    border-color: var(--spc-ink);
    color: var(--spc-ink);
  }

  .spc-switcher-btn.active {
    background: var(--spc-ink);
    color: #ffffff;
    border-color: var(--spc-ink);
  }

  /* ── Specimen Plate Frame ── */
  .spc-panel {
    display: none;
    background: var(--spc-plate-bg);
    border: 1px solid var(--spc-border);
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(33, 27, 21, 0.04);
    padding: 3.5rem;
  }

  .spc-panel.active {
    display: block;
  }

  /* Plate Title Bar */
  .spc-plate-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid var(--spc-ink);
    margin-bottom: 3.5rem;
  }

  .spc-plate-num {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--spc-muted);
  }

  .spc-plate-org {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--spc-light);
  }

  /* Plate Body (2-Col) */
  .spc-plate-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 4.5rem;
    align-items: center;
  }

  /* Left: Illustrated Plate */
  .spc-plate-artwork {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #faf8f2;
    border: 1px solid var(--spc-border);
    padding: 3.5rem 2rem 2.5rem;
    border-radius: 3px;
    position: relative;
  }

  .spc-bird-render {
    max-width: 86%;
    max-height: 420px;
    object-fit: contain;
    filter: drop-shadow(0 16px 28px rgba(33, 27, 21, 0.1));
    margin-bottom: 2rem;
  }

  .spc-latin-tag {
    font-family: 'Figtree', Georgia, serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--spc-text);
    text-align: center;
    margin: 0;
  }

  .spc-latin-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--spc-light);
    margin-top: 0.35rem;
  }

  /* Right: Specimen Details */
  .spc-plate-content {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .spc-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--spc-ink);
    margin: 0;
  }

  .spc-price-box {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.55rem;
    font-weight: 600;
  }

  .spc-price-box s {
    font-size: 1.15rem;
    color: var(--spc-light);
  }

  .spc-price-box .sale-ink {
    color: var(--spc-sale);
  }

  .spc-notes-quote {
    font-family: 'Figtree', Georgia, serif;
    font-style: italic;
    font-size: 1.25rem;
    color: #4a3e33;
    line-height: 1.4;
    border-left: 2px solid var(--spc-accent);
    padding-left: 1rem;
    margin: 0;
  }

  .spc-description {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.98rem;
    line-height: 1.65;
    color: var(--spc-muted);
    margin: 0;
  }

  /* Taxonomic Data Box */
  .spc-data-box {
    border: 1px solid var(--spc-border);
    border-radius: 4px;
    padding: 1.25rem;
    background: #faf8f3;
  }

  .spc-data-head {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--spc-text);
    margin-bottom: 0.75rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--spc-border);
  }

  .spc-data-table {
    width: 100%;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.88rem;
    border-collapse: collapse;
  }

  .spc-data-table td {
    padding: 0.35rem 0;
  }

  .spc-data-table td:last-child {
    text-align: right;
    font-weight: 600;
  }

  /* Form Controls */
  .spc-order-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .spc-select {
    padding: 0.85rem 1rem;
    border: 1px solid var(--spc-border);
    background: #ffffff;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    color: var(--spc-text);
    border-radius: 3px;
    cursor: pointer;
  }

  .spc-atc-btn {
    padding: 1.1rem;
    background: var(--spc-ink);
    color: #ffffff;
    border: 1px solid var(--spc-ink);
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.92rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.16s ease;
  }

  .spc-atc-btn:hover {
    background: #382e25;
  }

  @media (max-width: 900px) {
    .spc-panel {
      padding: 2rem;
    }

    .spc-plate-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
</style>

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="spc-wrap">
  <!-- ── Switcher ── -->
  <nav class="spc-switcher" aria-label="Specimen Switcher">
    {% for r in house_blends %}
      <button type="button" class="spc-switcher-btn{% if forloop.first %} active{% endif %}" data-target="spc-{{ r.slug }}">Plate 0{{ forloop.index }} &bull; {{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    {% case r.slug %}
      {% when 'early-bird' %}
        {% assign latin_tag = 'Turdus migratorius' %}
        {% assign latin_sub = 'American Robin &bull; Pre-Dawn Chorus' %}
      {% when 'feather-soot' %}
        {% assign latin_tag = 'Serinus canaria' %}
        {% assign latin_sub = 'Island Canary &bull; Deep Shaft Guardian' %}
      {% when 'chimney-sweep' %}
        {% assign latin_tag = 'Chaetura pelagica' %}
        {% assign latin_sub = 'Chimney Swift &bull; Aerial Velocity' %}
      {% when 'lil-sipper' %}
        {% assign latin_tag = 'Archilochus colubris' %}
        {% assign latin_sub = 'Ruby-throated Hummingbird &bull; Nectar Hover' %}
    {% endcase %}
    <article class="spc-panel{% if forloop.first %} active{% endif %}" id="spc-{{ r.slug }}">
      <header class="spc-plate-header">
        <span class="spc-plate-num">Plate No. 0{{ forloop.index }} &mdash; Naturalist Specimen</span>
        <span class="spc-plate-org">Yellow Wing Roasters Collection</span>
      </header>

      <div class="spc-plate-grid">
        <!-- Illustrated Plate -->
        <div class="spc-plate-artwork">
          {% assign r_img = '/images/' | append: r.mascot_file %}
          <img src="{{ r_img | relative_url }}" alt="{{ r.title }}" class="spc-bird-render">
          <h2 class="spc-latin-tag">{{ latin_tag }}</h2>
          <span class="spc-latin-sub">{{ latin_sub }}</span>
        </div>

        <!-- Specimen Content -->
        <div class="spc-plate-content">
          <div>
            <span style="font-family: 'Figtree', sans-serif; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: var(--spc-accent);">
              {{ r_level.layman }} Roast // Level {{ r.roast_level }}
            </span>
            <h1 class="spc-title">{{ r.title }}</h1>
          </div>

          <div class="spc-price-box" id="spc-{{ r.slug }}-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s> <span class="sale-ink">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>

          <blockquote class="spc-notes-quote">&ldquo;{{ r.tasting_notes | capitalize }}.&rdquo;</blockquote>

          <p class="spc-description">{{ r.description }}</p>

          <!-- Composition Specimen Data -->
          <div class="spc-data-box">
            <div class="spc-data-head">Blend Lot Formulation</div>
            <table class="spc-data-table">
              {% for c in latest_history.components %}
                <tr>
                  <td>{{ c.name }}</td>
                  <td>{{ c.ratio }}</td>
                </tr>
              {% endfor %}
              <tr>
                <td style="color: var(--spc-light); font-size: 0.8rem; padding-top: 0.5rem;">Recommended Extraction</td>
                <td style="color: var(--spc-light); font-size: 0.8rem; padding-top: 0.5rem;">{{ r.brewing_method }}</td>
              </tr>
            </table>
          </div>

          <!-- Purchase Controls -->
          <div class="spc-order-box">
            <select class="spc-select spc-size-select" id="spc-{{ r.slug }}-size-select" data-target-price="spc-{{ r.slug }}-price">
              {% for sz in site.data.bag_sizes %}
                <option value="{{ sz.id }}"
                        data-reg="{{ r.price[sz.id] }}"
                        {% if r.temporary_price and r.temporary_price[sz.id] %}data-sale="{{ r.temporary_price[sz.id] }}"{% endif %}
                        {% if sz.id == '12oz' %} selected{% endif %}>
                  {{ sz.label }} Weight &mdash; {% if r.temporary_price and r.temporary_price[sz.id] %}${{ r.temporary_price[sz.id] }}{% else %}${{ r.price[sz.id] }}{% endif %}
                </option>
              {% endfor %}
            </select>

            <select class="spc-select">
              {% for g in site.data.grind_levels %}
                <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }} Grind</option>
              {% endfor %}
            </select>

            <button type="button" class="spc-atc-btn">Collect Specimen Bag</button>
          </div>

          <!-- Field Fact -->
          <p style="font-family: 'Figtree', sans-serif; font-size: 0.86rem; color: var(--spc-muted); line-height: 1.5; margin: 0; border-top: 1px solid var(--spc-border); padding-top: 1rem;">
            <em>Naturalist Observation:</em> {{ r.fun_fact }}
          </p>
        </div>
      </div>
    </article>
  {% endfor %}
</div>

<script>
  (function() {
    // Switcher Logic
    const switcherBtns = document.querySelectorAll('.spc-switcher-btn');
    const panels = document.querySelectorAll('.spc-panel');

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

    // Dynamic Price Logic
    document.querySelectorAll('.spc-size-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const targetId = sel.getAttribute('data-target-price');
        const priceBox = document.getElementById(targetId);
        const opt = sel.options[sel.selectedIndex];
        const reg = opt.getAttribute('data-reg');
        const sale = opt.getAttribute('data-sale');
        if (sale) {
          priceBox.innerHTML = `<s>$${reg}</s> <span class="sale-ink">$${sale}</span>`;
        } else {
          priceBox.innerHTML = `$${reg}`;
        }
      });
    });
  })();
</script>
