---
layout: default
title: Shop
permalink: /shop/
subtitle: >-
  Roasted fresh to order. Free local delivery.
---

<div class="menu-listing-wrap">
  <!-- ── Header ── -->
  <header class="menu-header">
    <h1 class="menu-title">Shop</h1>
    {% if page.subtitle %}
      <p class="menu-subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>

  <!-- ── 1. Coffee: Signature Blends ── -->
  {% assign default_bag_size = site.data.bag_sizes | where: "default", true | map: "id" | first %}
  {% assign active_roasts = site.roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'archived'" %}
  {% assign blends = active_roasts | where: "category", "blend" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Signature Blends</h2>

    {% for r in blends %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price[default_bag_size] %}
              <s>${{ r.price[default_bag_size] }}</s><span class="sale-val">${{ r.temporary_price[default_bag_size] }}</span>
            {% else %}
              ${{ r.price[default_bag_size] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 2. Coffee: Single Origins ── -->
  {% assign single_origins = active_roasts | where: "category", "single origin" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Single Origins</h2>

    {% for r in single_origins %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price[default_bag_size] %}
              <s>${{ r.price[default_bag_size] }}</s><span class="sale-val">${{ r.temporary_price[default_bag_size] }}</span>
            {% else %}
              ${{ r.price[default_bag_size] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 3. Coffee: Seasonal Roasts ── -->
  {% assign seasonals = active_roasts | where: "category", "seasonal" | sort: "order" %}
  {% if seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Seasonal Roasts</h2>

    {% for r in seasonals %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price[default_bag_size] %}
              <s>${{ r.price[default_bag_size] }}</s><span class="sale-val">${{ r.temporary_price[default_bag_size] }}</span>
            {% else %}
              ${{ r.price[default_bag_size] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 4. Flights ── -->
  {% assign flights_list = site.flights | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Tasting Flights</h2>

    {% for f in flights_list %}
      <a href="{{ f.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ f.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if f.price_per_bag %}${{ f.price_per_bag }}.00 / bag{% else %}${{ f.price }}.00{% endif %}
          </div>
        </div>
        <div class="menu-item-desc">
          <span class="menu-item-notes">{{ f.shop_notes }}</span>
          <span class="menu-item-meta">{% if f.min_bags %}Min. {{ f.min_bags }} Bags{% else %}{{ f.shop_meta }}{% endif %}</span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 5. Custom Roastery ── -->
  {% assign custom_list = site.custom | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">BYOB &bull; Custom Roastery</h2>

    {% for c in custom_list %}
      <a href="{{ c.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ c.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if c.shop_price %}{{ c.shop_price }}{% elsif c.price contains "$" %}{{ c.price }}{% else %}${{ c.price }}.00{% endif %}
          </div>
        </div>
        <div class="menu-item-desc">
          <span class="menu-item-notes">{{ c.overlay_notes }}</span>
          <span class="menu-item-meta">{{ c.shop_meta }}</span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 6. Gift Cards ── -->
  {% assign gift_page = site.pages | where: "slug", "digital-gift-card" | first %}
  <section class="menu-section">
    <h2 class="menu-section-title">Gift Cards</h2>

    <a href="{{ gift_page.url | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">{{ gift_page.title }}</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">{{ gift_page.price }}</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">{{ gift_page.descriptor | capitalize }}</span>
        <span class="menu-item-meta">{{ gift_page.shop_meta }}</span>
      </div>
    </a>
  </section>

  <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--menu-line);">
    <p style="font-size: 0.95rem; color: var(--menu-muted); margin: 0;">
      Looking for a past seasonal or single origin?
      <a href="{{ '/archive/' | relative_url }}" style="color: var(--menu-text); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; margin-left: 0.25rem;">View the Coffee Archive &rarr;</a>
    </p>
  </div>
</div>
