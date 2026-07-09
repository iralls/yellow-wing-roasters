---
layout: default
title: Single Origins
permalink: /single-origins/
---

# Single Origins

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign cat_roasts = all_roasts | where: "category", "single origin" %}

<div class="roasts-grid">
{% for r in cat_roasts %}
  <a class="roasts-entry{% if r.coming_soon %} roasts-entry--soon{% endif %}" href="{{ r.url | relative_url }}">
    <div class="roasts-entry-visual">
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
    </div>
    {% if r.coming_soon %}<div class="roasts-entry-soon-badge">Coming Soon</div>{% endif %}
    {% if r.rotating %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">{{ r.title }}</div>
      {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
      {% if r.roast_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r.roast_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
      {% assign rp = site.data.pricing.overrides[r.slug] %}{% if rp and rp["12oz"] %}{% assign price_12 = rp["12oz"] %}{% else %}{% assign price_12 = site.data.pricing.default["12oz"] %}{% endif %}{% assign sub = site.data.subscriptions[r.slug] %}{% if sub and sub.prices %}{% assign sub_12 = sub.prices["12oz"] %}{% else %}{% assign sub_12 = nil %}{% endif %}
      <div class="roasts-entry-prices">${{ price_12 }}{% if sub_12 %} / <span class="roasts-entry-sub-price">${{ sub_12 }}</span>{% endif %}</div>
    </div>
  </a>
{% endfor %}
  <a class="roasts-entry" href="{{ '/roasts/byob/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">BYOB</div>
      <div class="roasts-entry-notes">Bring your own beans</div>
    </div>
  </a>
</div>
