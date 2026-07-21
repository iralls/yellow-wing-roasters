---
layout: default
title: Flights
permalink: /flights/
---

# Flights

<div class="roasts-grid">
  <a class="roasts-entry" href="{{ '/flights/the-aviary/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">The Aviary</div>
      <div class="roasts-entry-notes">Four blends, one box</div>
      <div class="roasts-entry-prices">${{ site.data.flights["the-aviary"].price }}</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/flights/peck-your-own/' | relative_url }}">
    <div class="roasts-entry-visual">
      <div class="mascot-grid"><img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"><img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"><img src="{{ '/images/audubon-chimney-swift-2-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"><img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item"></div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Peck Your Own</div>
      <div class="roasts-entry-notes">Choose at least {{ site.data.flights["peck-your-own"].min_bags }} 8oz bags</div>
      <div class="roasts-entry-prices">${{ site.data.flights["peck-your-own"].price_per_bag }} per bag (${{ site.data.flights["peck-your-own"].min_bags | times: site.data.flights["peck-your-own"].price_per_bag }} min)</div>
    </div>
  </a>
</div>
