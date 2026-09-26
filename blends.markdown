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
  {% include roast-card.html roast=r %}
{% endfor %}
  <div class="roasts-entry" data-roast="byob" data-category="blend" data-type="blend">
    <a class="roasts-entry-visual" href="{{ '/roasts/build-your-own-blend/' | relative_url }}" aria-label="BYOB - Build Your Own Blend">
      <div class="lazy-susan-container">
        <div class="lazy-susan-track">
          <div class="susan-dots susan-dots--grad-left" aria-hidden="true">
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
          </div>
          <div class="susan-birds susan-birds--depth">
            <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
            <img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-center" loading="lazy" decoding="async">
            <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="susan-bird susan-bird-side" loading="lazy" decoding="async">
          </div>
          <div class="susan-dots susan-dots--grad-right" aria-hidden="true">
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
            <span class="susan-dot"></span>
          </div>
        </div>
      </div>
      <div class="roasts-entry-overlay">
        <div class="roasts-entry-overlay-notes">craft your own custom blend from our single origin roasts</div>
      </div>
    </a>
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
  </div>
</div>
