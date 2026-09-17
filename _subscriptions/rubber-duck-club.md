---
layout: default
title: Rubber Duck Club
slug: rubber-duck-club
order: 6
permalink: /subscriptions/rubber-duck-club/
mascot_file: audubon-rubber-duck-transparent.png
descriptor: help us debug brand-new beans and experimental test roasts before release
sizes:
  - 12oz
frequencies:
  - Monthly
price:
  12oz: 10
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-rubber-duck-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">Rubber Duck Club</h1>
</div>

<p class="roast-mv-tasting">The Debugging Roast</p>

<div class="roast-mv-divider"></div>

<div class="roast-mv-body">
Help us debug our roasts. Every month, we’ll send you our latest experimental profile, a brand-new bean we're dialing in, or a test roast we're tuning. Your mission: brew it, ponder it, and help us "debug" the coffee (a nod to <a href="https://en.wikipedia.org/wiki/Rubber_duck_debugging" target="_blank" rel="noopener noreferrer">rubber duck debugging</a>) by submitting your tasting notes via the <a href="{{ '/feedback/' | relative_url }}">feedback form</a> before it hits the main site.
</div>

<div class="roast-mv-center" style="margin-top:1rem;">
  <a href="{{ '/subscribe/?roast=rubber-duck-club' | relative_url }}" class="add-to-order-btn">Subscribe — ${{ page.price["12oz"] | default: page.price }}/mo</a>
</div>

</div>
