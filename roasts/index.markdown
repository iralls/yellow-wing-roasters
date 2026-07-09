---
layout: default
title: Roasts
permalink: /roasts/
---


# Roasts

Our current lineup. All roasts ship as whole bean.

{% assign all_roasts = site.roasts | sort: "order" %}

{% for cat_name in site.category_order %}

{% if cat_name == "subscriptions" %}
<h2 class="roasts-category">Subscriptions</h2>
<div class="roasts-grid">
  <a class="roasts-entry" href="{{ '/subscriptions/the-migrator/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-arctic-tern-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">The Migrator</div>
      <div class="roasts-entry-notes">Rotating single origin</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/1200bpm-collective/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-hummingbird-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">1200bpm Collective</div>
      <div class="roasts-entry-notes">Espresso focused</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/fledglings/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-chicks-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Fledglings</div>
      <div class="roasts-entry-notes">Coffee 101</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/ugly-ducklings/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-duckling-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Ugly Ducklings</div>
      <div class="roasts-entry-notes">Leftover and test beans</div>
    </div>
  </a>
</div>
{% elsif cat_name == "byob" %}
<h2 class="roasts-category">BYOB (Bring Your Own Beans)</h2>
<div class="byob-section">
  <a href="{{ '/roasts/byob/' | relative_url }}" class="byob-entry">
    <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="byob-mascot">
    <p class="byob-intro">Have a specific green coffee you've been eyeing? Send me a link and I'll roast it for you.</p>
    <span class="byob-link">Learn more &rarr;</span>
  </a>
</div>
{% else %}
{% assign cat_roasts = all_roasts | where: "category", cat_name %}
{% if cat_roasts.size > 0 %}
  <h2 class="roasts-category">{{ cat_name | capitalize }}s</h2>
  <div class="roasts-grid">
  {% for r in cat_roasts %}
    <a class="roasts-entry{% if r.coming_soon %} roasts-entry--soon{% endif %}" href="{{ r.url | relative_url }}" style="--ca: {{ r.mark_color_a }}; --cb: {{ r.mark_color_b }};">
      <div class="roasts-entry-visual">
        {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
      </div>
      {% if r.coming_soon %}<div class="roasts-entry-soon-badge">Coming Soon</div>{% endif %}
      {% if r.rotating %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
      <div class="roasts-entry-info">
        <div class="roasts-entry-title">{{ r.title }}</div>
        {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
        {% if r.roast_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r.roast_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
        {% if r.tasting_notes %}<div class="roasts-entry-notes">{{ r.tasting_notes | replace: ", ", " · " }}</div>{% endif %}
        {% if r.brewing_method %}<div class="roasts-entry-brew">{{ r.brewing_method }}</div>{% endif %}
      </div>
    </a>
  {% endfor %}
  </div>
{% endif %}
{% endif %}

{% endfor %}
