---
layout: default
title: Shop (Cards)
permalink: /shop-cards/
---

<style>
  .shop-wrap {
    max-width: 76rem;
    margin: 0 auto;
    padding: 1rem 0 5rem;
  }

  .shop-header {
    text-align: center;
    margin-bottom: 4.5rem;
  }

  .shop-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 600;
    color: #302010;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0;
  }

  .shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.25rem 2rem;
  }

  @media (max-width: 960px) {
    .shop-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.75rem 1.5rem;
    }
    .shop-header {
      margin-bottom: 3.25rem;
    }
  }

  @media (max-width: 600px) {
    .shop-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .shop-header {
      margin-bottom: 2.5rem;
    }
  }

  .shop-card {
    background: #ffffff;
    border: 1px solid rgba(48, 32, 16, 0.08);
    border-radius: 14px;
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .shop-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(48, 32, 16, 0.08);
    border-color: rgba(48, 32, 16, 0.2);
    text-decoration: none;
    color: inherit;
  }

  .shop-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .shop-card-category {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9c6d12;
    background: #fbf6ec;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
  }

  .shop-card-level {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 500;
    color: #6e5e54;
  }

  .shop-card-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.35rem;
    font-weight: 600;
    color: #302010;
    line-height: 1.25;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.01em;
  }

  .shop-card-descriptor {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 400;
    color: #6e5e54;
    line-height: 1.45;
    margin: 0 0 1rem 0;
  }

  .shop-card-notes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .shop-card-note {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.78rem;
    font-weight: 500;
    color: #4a382c;
    background: #f7f4f0;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
  }

  .shop-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 1rem;
    border-top: 1px solid rgba(48, 32, 16, 0.06);
    margin-top: auto;
  }

  .shop-card-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: #302010;
  }

  .shop-card-orig-price {
    color: #a89484;
    font-weight: 400;
    font-size: 0.95rem;
    margin-right: 0.35rem;
  }

  .shop-card-sale-price {
    color: #b45309;
    font-weight: 700;
  }

  .shop-card-cta {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 600;
    color: #9c6d12;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .shop-card:hover .shop-card-cta {
    color: #302010;
  }
</style>

<div class="shop-wrap">
  <div class="shop-header">
    <h1 class="shop-title">Shop</h1>
  </div>

  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="shop-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="shop-card">
        <div class="shop-card-main">
          <div class="shop-card-top">
            <span class="shop-card-category">{{ r.category }}</span>
            {% if level_info %}
              <span class="shop-card-level">{{ level_info.layman }}</span>
            {% endif %}
          </div>

          <h2 class="shop-card-title">{{ r.card_title | default: r.title }}</h2>

          {% if r.descriptor %}
            <p class="shop-card-descriptor">{{ r.descriptor }}</p>
          {% endif %}

          {% if r.tasting_notes %}
            {% assign notes_list = r.tasting_notes | split: ", " %}
            <div class="shop-card-notes">
              {% for note in notes_list limit:3 %}
                <span class="shop-card-note">{{ note }}</span>
              {% endfor %}
            </div>
          {% endif %}
        </div>

        <div class="shop-card-footer">
          <div class="shop-card-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s class="shop-card-orig-price">${{ r.price["12oz"] }}</s>
              <span class="shop-card-sale-price">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              <span>${{ r.price["12oz"] }}</span>
            {% endif %}
          </div>
          <span class="shop-card-cta">View &rarr;</span>
        </div>
      </a>
    {% endfor %}
  </div>
</div>
