---
layout: default
title: Roast Preview (Parlor Editorial) — Yellow Wing Roasters
permalink: /roast-parlor/
---

<style>
  /* ── Parlor Coffee Boutique Editorial Roast Prototype ── */
  :root {
    --parlor-bg: #fcfbfa;
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

{% assign house_blends = site.roasts | where: "category", "blend" | sort: "order" | slice: 0, 4 %}

<div class="parlor-wrap">
  <!-- ── Preview Switcher ── -->
  <nav class="parlor-switcher" aria-label="Parlor Coffee Roast Switcher">
    {% for r in house_blends %}
      <button type="button" class="parlor-switcher-btn{% if forloop.first %} active{% endif %}" data-target="parlor-{{ r.slug }}">{{ r.card_title | default: r.title }}</button>
    {% endfor %}
  </nav>

  {% for r in house_blends %}
    {% assign r_level = site.data.roast_levels[r.roast_level] %}
    {% assign latest_history = r.history | first %}
    <div class="parlor-panel{% if forloop.first %} active{% endif %}" id="parlor-{{ r.slug }}">
      <section class="parlor-hero">
        <div class="parlor-visual-stage">
          {% assign r_img = "/images/" | append: r.mascot_file %}
          <img src="{{ r_img | relative_url }}" alt="{{ r.title }}" class="parlor-bird-img">
        </div>

        <div class="parlor-details">
          <span class="parlor-meta-tag">House Blend &bull; {{ r_level.layman }} Roast</span>
          <h1 class="parlor-title">{{ r.title }}</h1>

          <div class="parlor-price-row" id="parlor-{{ r.slug }}-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s> <span class="is-sale">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>

          <blockquote class="parlor-sensory-lead">
            &ldquo;{{ r.tasting_notes | capitalize }}.&rdquo;
          </blockquote>

          <p class="parlor-story-p">{{ r.description }}</p>

          <form class="parlor-form" onsubmit="return false;">
            <div class="parlor-field">
              <label class="parlor-label" for="parlor-{{ r.slug }}-size">Bag Size</label>
              <select class="parlor-select parlor-size-select" id="parlor-{{ r.slug }}-size" data-target-price="parlor-{{ r.slug }}-price">
                {% for sz in site.data.bag_sizes %}
                  <option value="{{ sz.id }}"
                          data-reg="{{ r.price[sz.id] }}"
                          {% if r.temporary_price and r.temporary_price[sz.id] %}data-sale="{{ r.temporary_price[sz.id] }}"{% endif %}
                          {% if sz.id == "12oz" %} selected{% endif %}>
                    {{ sz.label }} &mdash; {% if r.temporary_price and r.temporary_price[sz.id] %}${{ r.temporary_price[sz.id] }}{% else %}${{ r.price[sz.id] }}{% endif %}
                  </option>
                {% endfor %}
              </select>
            </div>

            <div class="parlor-field">
              <label class="parlor-label" for="parlor-{{ r.slug }}-grind">Grind Style</label>
              <select class="parlor-select" id="parlor-{{ r.slug }}-grind">
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
            {% for c in latest_history.components %}
              <div class="parlor-spec-row">
                <span>{{ c.name }}</span>
                <strong>{{ c.ratio }}</strong>
              </div>
            {% endfor %}
            {% if latest_history.date %}
              <div style="font-size: 0.85rem; color: var(--parlor-light); margin-top: 0.5rem;">
                Formulation dated: {{ latest_history.date }}
              </div>
            {% endif %}
          </div>
        </div>

        <div class="parlor-spec-col">
          <h3 class="parlor-spec-title">Brewing Parameters</h3>
          <div class="parlor-spec-list">
            <div class="parlor-spec-row">
              <span>Recommended Styles</span>
              <strong>{{ r.brewing_method }}</strong>
            </div>
            <div class="parlor-spec-row">
              <span>Roast Degree</span>
              <strong>{{ r_level.name }}</strong>
            </div>
            <div class="parlor-spec-row">
              <span>Status</span>
              <strong>{{ r.status | default: "Active Batch" | replace: "_", " " | capitalize }}</strong>
            </div>
          </div>
        </div>

        <div class="parlor-spec-col">
          <h3 class="parlor-spec-title">Field Notes</h3>
          <div class="parlor-spec-list">
            <p style="margin: 0;">{{ r.fun_fact }}</p>
            {% if r.mascot %}
              <div style="font-size: 0.82rem; font-style: italic; color: var(--parlor-light); margin-top: 0.5rem;">
                Mascot: {{ r.mascot | replace: "-", " " | capitalize }}
              </div>
            {% endif %}
          </div>
        </div>
      </section>
    </div>
  {% endfor %}
</div>

<script>
  (function() {
    // Switcher Logic
    const switcherBtns = document.querySelectorAll(".parlor-switcher-btn");
    const panels = document.querySelectorAll(".parlor-panel");

    switcherBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        switcherBtns.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetId = btn.getAttribute("data-target");
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });

    // Dynamic Price on Bag Size Select
    document.querySelectorAll(".parlor-size-select").forEach(select => {
      const priceId = select.getAttribute("data-target-price");
      const priceEl = document.getElementById(priceId);
      if (priceEl) {
        select.addEventListener("change", () => {
          const opt = select.options[select.selectedIndex];
          const reg = opt.getAttribute("data-reg");
          const sale = opt.getAttribute("data-sale");
          if (sale) {
            priceEl.innerHTML = `<s>$${reg}</s> <span class="is-sale">$${sale}</span>`;
          } else {
            priceEl.innerHTML = `$${reg}`;
          }
        });
      }
    });
  })();
</script>
