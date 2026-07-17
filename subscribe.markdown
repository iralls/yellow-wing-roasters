---
layout: default
title: Subscriptions
permalink: /subscriptions/
---

# Subscriptions

<p style="text-align: center; margin: -0.5rem 0 2rem;">
  Already subscribed? <a href="{{ '/subscriptions/manage/' | relative_url }}">Manage your subscription &rarr;</a>
</p>

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
  <a class="roasts-entry" href="{{ '/subscriptions/wingshot-collective/' | relative_url }}">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-crosshair-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Wingshot Collective</div>
      <div class="roasts-entry-prices">{% assign sub = site.data.subscriptions["wingshot-collective"] %}${{ sub.prices["12oz"] }}/mo</div>
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
