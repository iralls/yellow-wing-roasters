---
layout: default
title: Roasts
permalink: /roasts/
---

<p class="logo-wrap"><a href="{{ '/' | relative_url }}" class="logo-link"><img src="/images/logo.png" alt="Yellow Wing Roasters" class="logo"></a></p>

# Roasts

Our current lineup.

{% assign roasts = site.roasts | sort: "order" %}
{% assign categories = roasts | group_by: "category" %}
{% for cat in categories %}
  <h2 class="roast-category">{{ cat.name | capitalize }}{% if cat.items.size != 1 %}s{% endif %}</h2>
  <div class="roast-grid">
  {% for r in cat.items %}
    <a class="roast-card" href="{{ r.url | relative_url }}">
      {% if r.logo and r.logo != "" %}<img src="{{ r.logo | relative_url }}" alt="{{ r.title }}" class="roast-card-logo">{% endif %}
      <h3 class="roast-card-title">{{ r.title }}</h3>
      {% if r.blurb %}<p class="roast-card-blurb">{{ r.blurb }}</p>{% endif %}
    </a>
  {% endfor %}
  </div>
{% endfor %}
