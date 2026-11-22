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

  <!-- ── 2. Past Rotating Lots ── -->
  {% assign rotating_roasts = site.roasts | where: "category", "single origin" | where: "rotating", true | sort: "order" %}
  {% assign has_past_rotating = false %}
  {% for r in rotating_roasts %}
    {% if r.history.size > 1 %}
      {% assign has_past_rotating = true %}
    {% endif %}
  {% endfor %}
  {% if has_past_rotating %}
  <section class="menu-section">
    <h2 class="menu-section-title">Rotating Single Origins &mdash; Past Lots</h2>

    {% for r in rotating_roasts %}
      {% for entry in r.history offset:1 %}
        {% assign comp = entry.components.first %}
        {% if comp.slug %}
          {% assign lot_url = "/roasts/" | append: comp.slug | append: "/" %}
          {% assign lot_meta = "Archived Lot &rarr;" %}
        {% else %}
          {% assign lot_url = r.url %}
          {% assign lot_meta = "View Current Lot &rarr;" %}
        {% endif %}
        {% assign lot_date = entry.date | append: "-01" | date: "%b %Y" %}
        {% include menu-listing-item.html
          url=lot_url
          title=comp.name
          subtitle=r.title
          price=lot_date
          notes=entry.description
          meta=lot_meta
        %}
      {% endfor %}
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 3. Flown South Seasonals ── -->
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
