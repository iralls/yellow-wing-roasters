---
layout: default
title: Blends
permalink: /blends/
---

# Blends

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign cat_roasts = all_roasts | where: "category", "blend" %}

<div class="roasts-grid">
{% for r in cat_roasts %}
  <a class="roasts-entry{% if r.coming_soon %} roasts-entry--soon{% endif %}" href="{{ r.url | relative_url }}">
    <div class="roasts-entry-visual">
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
    </div>
    {% if r.under_construction %}
      <div class="roasts-entry-construction-badge">{{ r.status_badge | default: "Mid-Molt" }}</div>
    {% elsif r.coming_soon %}
      <div class="roasts-entry-soon-badge">Coming Soon</div>
    {% elsif r.low_stock %}
      <div class="roasts-entry-lowstock-badge">Low Stock</div>
    {% endif %}
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">{{ r.title }}</div>
      {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
      {% assign r_level_key = r.roast_level | append: "" %}{% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}{% if level_info %}{% assign r_dots = level_info.dots %}{% else %}{% assign r_dots = r.roast_dots %}{% endif %}
      {% if r_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
      {% assign rp = site.data.pricing.overrides[r.slug] %}{% if rp and rp["12oz"] %}{% assign price_12 = rp["12oz"] %}{% else %}{% assign price_12 = site.data.pricing.default["12oz"] %}{% endif %}
      {% if r.temporary_price and r.temporary_price["12oz"] %}
        <div class="roasts-entry-prices"><s>${{ price_12 }}</s> <span style="color:#d32f2f; font-weight:700;">${{ r.temporary_price["12oz"] }}</span></div>
      {% else %}
        <div class="roasts-entry-prices">${{ price_12 }}</div>
      {% endif %}
    </div>
  </a>
{% endfor %}
  <a class="roasts-entry" href="{{ '/roasts/build-your-own-blend/' | relative_url }}">
    <div class="roasts-entry-visual">
      <div class="mascot-grid">
        <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="mascot-grid-item">
        <img src="{{ '/images/audubon-bluejay-transparent.png' | relative_url }}" alt="" class="mascot-grid-item">
        <img src="{{ '/images/audubon-barred-owl-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" style="transform: scale(0.8) translateY(-6px);">
        <img src="{{ '/images/audubon-red-winged-blackbird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item">
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">BYOB</div>
      <div class="roasts-entry-notes">Build Your Own Blend</div>
      <div class="roasts-entry-prices">$32</div>
    </div>
  </a>
</div>
