---
layout: default
title: Roasts
permalink: /roasts/
---


# Roasts

Our current lineup. All roasts ship as whole bean.

{% assign roasts = site.roasts | sort: "order" %}
{% assign categories = roasts | group_by: "category" %}
{% for cat in categories %}
  <h2 class="roasts-category">{{ cat.name | capitalize }}s</h2>
  <div class="roasts-grid">
  {% for r in cat.items %}
    <a class="roasts-entry{% if r.coming_soon %} roasts-entry--soon{% endif %}" href="{{ r.url | relative_url }}" style="--ca: {{ r.mark_color_a }}; --cb: {{ r.mark_color_b }};">
      <div class="roasts-entry-visual">
        {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
      </div>
      {% if r.coming_soon %}<div class="roasts-entry-soon-badge">Coming Soon</div>{% endif %}
      <div class="roasts-entry-info">
        <div class="roasts-entry-title">{{ r.title }}</div>
        {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
        {% if r.roast_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r.roast_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
        {% if r.tasting_notes %}<div class="roasts-entry-notes">{{ r.tasting_notes }}</div>{% endif %}
        {% if r.brewing_method %}<div class="roasts-entry-brew">{{ r.brewing_method }}</div>{% endif %}
      </div>
    </a>
  {% endfor %}
  </div>
{% endfor %}
