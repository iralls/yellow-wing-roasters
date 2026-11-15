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
  {% assign active_roasts = site.roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'archived'" %}
  {% assign blends = active_roasts | where: "category", "blend" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Signature Blends</h2>

    {% for r in blends %}
      {% include menu-listing-item.html roast=r %}
    {% endfor %}
  </section>

  <!-- ── 2. Coffee: Single Origins ── -->
  {% assign single_origins = active_roasts | where: "category", "single origin" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Single Origins</h2>

    {% for r in single_origins %}
      {% include menu-listing-item.html roast=r %}
    {% endfor %}
  </section>

  <!-- ── 3. Coffee: Seasonal Roasts ── -->
  {% assign seasonals = active_roasts | where: "category", "seasonal" | sort: "order" %}
  {% if seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Seasonal Roasts</h2>

    {% for r in seasonals %}
      {% include menu-listing-item.html roast=r %}
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 4. Flights ── -->
  {% assign flights_list = site.flights | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Tasting Flights</h2>

    {% for f in flights_list %}
      {% capture f_price %}{% if f.price_per_bag %}${{ f.price_per_bag }}.00 / bag{% else %}${{ f.price }}.00{% endif %}{% endcapture %}
      {% capture f_meta %}{% if f.min_bags %}Min. {{ f.min_bags }} Bags{% else %}{{ f.shop_meta }}{% endif %}{% endcapture %}
      {% include menu-listing-item.html url=f.url title=f.title price=f_price notes=f.shop_notes meta=f_meta %}
    {% endfor %}
  </section>

  <!-- ── 5. Custom Roastery ── -->
  {% assign custom_list = site.custom | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">BYOB &bull; Custom Roastery</h2>

    {% for c in custom_list %}
      {% capture c_price %}{% if c.shop_price %}{{ c.shop_price }}{% elsif c.price contains "$" %}{{ c.price }}{% else %}${{ c.price }}.00{% endif %}{% endcapture %}
      {% include menu-listing-item.html url=c.url title=c.title price=c_price notes=c.overlay_notes meta=c.shop_meta %}
    {% endfor %}
  </section>

  <!-- ── 6. Gift Cards ── -->
  {% assign gift_page = site.pages | where: "slug", "digital-gift-card" | first %}
  {% assign gift_notes = gift_page.descriptor | capitalize %}
  <section class="menu-section">
    <h2 class="menu-section-title">Gift Cards</h2>

    {% include menu-listing-item.html url=gift_page.url title=gift_page.title price=gift_page.price notes=gift_notes meta=gift_page.shop_meta %}
  </section>

  <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--menu-line);">
    <p style="font-size: 0.95rem; color: var(--menu-muted); margin: 0;">
      Looking for a past seasonal or single origin?
      <a href="{{ '/archive/' | relative_url }}" style="color: var(--menu-text); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; margin-left: 0.25rem;">View the Coffee Archive &rarr;</a>
    </p>
  </div>
</div>
