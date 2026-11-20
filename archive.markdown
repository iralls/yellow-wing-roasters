---
layout: default
title: Coffee Archive
permalink: /archive/
subtitle: >-
  Past single-origin releases and seasonal roasts that have flown south.
---

<div class="menu-listing-wrap">
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
      {% include menu-listing-item.html roast=r %}
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 2. Flown South Seasonals ── -->
  {% assign flown_seasonals = site.roasts | where: "category", "seasonal" | where: "status", "flown_south" | sort: "order" %}
  {% if flown_seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Seasonal Roasts &mdash; Flown South</h2>

    {% for r in flown_seasonals %}
      {% include menu-listing-item.html roast=r %}
    {% endfor %}
  </section>
  {% endif %}

  <div class="menu-footer-callout">
    <p>
      Want a heads-up if a seasonal roast returns?
      <a href="{{ '/pigeon-post/' | relative_url }}">Join Pigeon Post &rarr;</a>
    </p>
  </div>
</div>
