---
layout: default
title: Subscriptions
permalink: /subscriptions/
---

# Subscriptions

<p class="category-intro">Enjoy freshly roasted coffee delivered straight to your door on your schedule, from curated rotating flights to everyday favorites.</p>

<p style="margin: -1.75rem 0 2.5rem; font-size: 0.95rem;">
  Already subscribed? <a href="{{ '/subscriptions/manage/' | relative_url }}">Manage your subscription &rarr;</a>
</p>

<div class="roasts-grid">
{% assign subs = site.subscriptions | sort: "order" %}
{% for s in subs %}
  <div class="roasts-entry" data-category="subscriptions" data-type="subscriptions">
    <a class="roasts-entry-visual" href="{{ s.url | relative_url }}" aria-label="{{ s.title | escape }}">
      {% if s.mascot_file %}<img src="{{ '/images/' | append: s.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot" loading="lazy" decoding="async">{% endif %}
      <div class="roasts-entry-overlay">
        {% if s.descriptor %}<div class="roasts-entry-overlay-notes">{{ s.descriptor }}</div>{% endif %}
      </div>
    </a>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">{{ s.title }}</div>
      <div class="roasts-entry-prices">${{ s.price["12oz"] | default: s.price }}</div>
    </div>
  </div>
{% endfor %}
</div>
