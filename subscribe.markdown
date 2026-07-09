---
layout: default
title: Subscriptions
permalink: /subscriptions/
---

# Subscriptions

<div class="roasts-grid">
  <a class="roasts-entry" href="{{ '/subscriptions/the-migrator/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-arctic-tern-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Migrator</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["rotating-single-origin"] %}${{ sub.prices["12oz"] }}/mo</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/1200bpm-collective/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-hummingbird-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">1200bpm Collective</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["1200bpm-collective"] %}${{ sub.prices["12oz"] }}/mo</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/fledglings/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-chicks-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Fledglings</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["fledglings"] %}${{ sub.prices["12oz"] }}/mo</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/murmurations/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/flock-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Murmurations</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["murmurations"] %}${{ sub.prices["12oz"] }}/mo</div>
    </div>
  </a>
  <a class="roasts-entry" href="{{ '/subscriptions/ugly-ducklings/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-duckling-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Ugly Ducklings</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["ugly-ducklings"] %}${{ sub.prices["12oz"] }}/mo</div>
    </div>
  </a>
</div>
