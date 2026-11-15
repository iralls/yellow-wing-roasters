---
layout: default
title: Coffee Archive
permalink: /archive/
subtitle: >-
  Past single-origin releases and seasonal roasts that have flown south.
---

<div class="menu-listing-wrap">
  <a href="{{ '/shop/' | relative_url }}" class="hst-back-link">&larr; Back to Shop</a>

  <!-- ── Header ── -->
  <header class="menu-header">
    <h1 class="menu-title">Coffee Archive</h1>
    {% if page.subtitle %}
      <p class="menu-subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>

  <!-- ── 1. Archived Single Origins ── -->
  {% assign archived_single_origins = site.roasts | where: "category", "single origin" | where: "status", "archived" | sort: "order" %}
  {% if archived_single_origins.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Single Origins &mdash; Archived</h2>

    {% for r in archived_single_origins %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price" style="font-size: 0.9rem; font-weight: 500; color: var(--menu-muted);">Archived</div>
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

  <!-- ── 2. Flown South Seasonals ── -->
  {% assign flown_seasonals = site.roasts | where: "category", "seasonal" | where: "status", "flown_south" | sort: "order" %}
  {% if flown_seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Seasonal Roasts &mdash; Flown South</h2>

    {% for r in flown_seasonals %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price" style="font-size: 0.9rem; font-weight: 500; color: var(--menu-muted);">Flown South</div>
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

  <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--menu-line);">
    <p style="font-size: 0.95rem; color: var(--menu-muted); margin: 0;">
      Want a heads-up if a seasonal roast returns?
      <a href="{{ '/pigeon-post/' | relative_url }}" style="color: var(--menu-text); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; margin-left: 0.25rem;">Join Pigeon Post &rarr;</a>
    </p>
  </div>
</div>
