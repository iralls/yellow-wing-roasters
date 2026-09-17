---
layout: default
title: Seasonals
permalink: /seasonals/
---

# Seasonals

<p class="category-intro">Special limited-edition blends and seasonal favorites that migrate into the roost throughout the year.</p>

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign cat_roasts = all_roasts | where: "category", "seasonal" %}
{% assign cat_active = cat_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign cat_incubating = cat_roasts | where_exp: "item", "item.status == 'incubating'" %}
{% assign cat_flown = cat_roasts | where_exp: "item", "item.status == 'flown_south'" %}
{% assign cat_roasts = cat_active | concat: cat_incubating | concat: cat_flown %}

<div class="roasts-grid">
{% for r in cat_roasts %}
  {% include roast-card.html roast=r %}
{% endfor %}
</div>
