---
layout: default
title: Roasts
permalink: /roasts/
---

<p class="logo-wrap"><a href="{{ '/' | relative_url }}" class="logo-link"><img src="/images/logo.png" alt="Yellow Wing Roasters" class="logo"></a></p>

# Roasts

Our current lineup. All roasts ship as whole bean.

{% assign roasts = site.roasts | sort: "order" %}
{% assign categories = roasts | group_by: "category" %}
{% for cat in categories %}
  <h2 class="roast-category">{{ cat.name | capitalize }}s</h2>
  <div class="roast-grid">
  {% for r in cat.items %}
    <a class="roast-card" href="{{ r.url | relative_url }}"{% if r.mark_color_a %} style="--card-theme: {{ r.mark_color_a }};"{% endif %}>
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="card-mark card-mark-image" aria-hidden="true">{% elsif r.mark_color_a %}<svg class="card-mark" viewBox="-1 -1 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="9" cy="9" r="9" fill="{{ r.mark_color_a }}"/><circle cx="19" cy="9" r="9" fill="{{ r.mark_color_b }}"/></svg>{% endif %}
      <h3 class="roast-card-title">{{ r.title }}</h3>
      {% if r.blurb %}<p class="roast-card-blurb">{{ r.blurb }}</p>
      {% elsif r.tasting_notes %}<p class="roast-card-blurb">{{ r.tasting_notes }}</p>{% endif %}
    </a>
  {% endfor %}
  </div>
{% endfor %}
