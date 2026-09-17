---
layout: default
title: Single Origins
permalink: /single-origins/
---

# Single Origins

<p class="category-intro">Exceptional coffees highlighting the unique character of individual farms and regions, with select offerings rotating throughout the year.</p>

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign cat_roasts = all_roasts | where: "category", "single origin" %}
{% assign cat_active = cat_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign cat_incubating = cat_roasts | where_exp: "item", "item.status == 'incubating'" %}
{% assign cat_flown = cat_roasts | where_exp: "item", "item.status == 'flown_south'" %}
{% assign cat_roasts = cat_active | concat: cat_incubating | concat: cat_flown %}

{% assign byob_rendered = false %}
<div class="roasts-grid">
{% for r in cat_roasts %}
  {% if r.status == 'flown_south' and byob_rendered == false %}
  <a class="roasts-entry" data-roast="byob" href="{{ '/roasts/byob/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">send us your green beans and we'll roast them to perfection</div>
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own beans</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast</div>
        </div>
      </div>
    </div>
  </a>
  {% assign byob_rendered = true %}
  {% endif %}
  {% include roast-card.html roast=r %}
{% endfor %}
{% if byob_rendered == false %}
  <a class="roasts-entry" data-roast="byob" href="{{ '/roasts/byob/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">send us your green beans and we'll roast them to perfection</div>
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Bring your own beans</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom roast</div>
        </div>
      </div>
    </div>
  </a>
{% endif %}
</div>
