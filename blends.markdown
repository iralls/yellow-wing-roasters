---
layout: default
title: Blends
permalink: /blends/
---

# Blends

<p class="category-intro">Our signature and everyday blends, carefully balanced to bring out rich, complementary flavors in every cup.</p>

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign cat_roasts = all_roasts | where: "category", "blend" %}
{% assign cat_active = cat_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign cat_incubating = cat_roasts | where_exp: "item", "item.status == 'incubating'" %}
{% assign cat_flown = cat_roasts | where_exp: "item", "item.status == 'flown_south'" %}
{% assign cat_roasts = cat_active | concat: cat_incubating | concat: cat_flown %}

<div class="roasts-grid">
{% for r in cat_roasts %}
  {% assign r_level_key = r.roast_level | append: "" %}
  {% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}
  {% if level_info %}
    {% assign r_dots = level_info.dots %}
    {% assign r_layman = level_info.layman %}
    {% assign r_specialty = level_info.specialty | default: level_info.name %}
  {% else %}
    {% assign r_dots = r.roast_dots %}
    {% assign r_layman = "" %}
    {% assign r_specialty = r.roast_level %}
  {% endif %}
  {% assign rp = site.data.pricing.overrides[r.slug] %}
  {% if rp and rp["12oz"] %}{% assign price_12 = rp["12oz"] %}{% else %}{% assign price_12 = site.data.pricing.default["12oz"] %}{% endif %}
  <a class="roasts-entry{% if r.status == 'incubating' or r.status == 'flown_south' %} roasts-entry--soon{% endif %}" data-roast="{{ r.slug }}" href="{{ r.url | relative_url }}">
    <div class="roasts-entry-visual">
      {% include roast-status-badge.html roast=r %}
      {% if r.rotating %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
      <div class="roasts-entry-overlay">
        {% if r.tasting_notes %}<div class="roasts-entry-overlay-notes">{{ r.tasting_notes | replace: ", ", " · " | downcase }}</div>{% endif %}
        {% if r_dots %}
          <div class="roasts-entry-overlay-level">
            <span class="roast-dots">
              <span class="roast-dot{% if r_dots >= 1 %} roast-dot-1{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 2 %} roast-dot-2{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 3 %} roast-dot-3{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 4 %} roast-dot-4{% endif %}"></span>
              <span class="roast-dot{% if r_dots >= 5 %} roast-dot-5{% endif %}"></span>
            </span>
            <span class="roasts-entry-overlay-specialty">{{ r_specialty }}</span>
          </div>
        {% endif %}
        {% if r.origins %}
          {% assign c_arr = "" | split: "," %}
          {% for o in r.origins %}
            {% assign c = o | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
            {% assign c_arr = c_arr | push: c %}
          {% endfor %}
          <div class="roasts-entry-overlay-origins">{{ c_arr | uniq | join: " · " }}</div>
        {% endif %}
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">{{ r.title }}</div>
          {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
          <div class="roasts-entry-prices">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ price_12 }}</s> <span class="roasts-entry-temp-price">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ price_12 }}
            {% endif %}
          </div>
        </div>
        <div class="roasts-entry-meta">
          {% if r_layman %}<div class="roasts-entry-layman">{{ r_layman }}</div>{% endif %}
          {% if r.descriptor %}<div class="roasts-entry-descriptor">{{ r.descriptor | downcase }}</div>{% endif %}
        </div>
      </div>
    </div>
  </a>
{% endfor %}
  <a class="roasts-entry" data-roast="byob" href="{{ '/roasts/build-your-own-blend/' | relative_url }}">
    <div class="roasts-entry-visual">
      <div class="mascot-grid mascot-grid-3x3">
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-rose-breasted-grosbeak-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-grey-catbird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-baltimore-oriole-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-red-tailed-hawk-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-killdeer-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/audubon-great-horned-owl-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
        <div class="mascot-grid-cell"><img src="{{ '/images/double-crested-cormorant-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
      </div>
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">craft your own custom blend from our single origin roasts</div>
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">BYOB</div>
          <div class="roasts-entry-subtitle">Build Your Own Blend</div>
          <div class="roasts-entry-prices">$32</div>
        </div>
        <div class="roasts-entry-meta">
          <div class="roasts-entry-layman">Custom</div>
          <div class="roasts-entry-descriptor">custom blend</div>
        </div>
      </div>
    </div>
  </a>
</div>
