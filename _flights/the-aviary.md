---
layout: default
title: The Aviary
slug: the-aviary
order: 1
permalink: /flights/the-aviary/
price: 38
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true" fetchpriority="high" decoding="async">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">The Aviary</h1>
</div>

<p class="roast-mv-tasting">A range of four blends, from bright and floral to dark and smoky</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-body">Four blends, each individually packaged in its own 8oz bag — a great way to explore the full range before committing to a full bag.</p>

{% assign aviary_slugs = "early-bird,feather-soot,chimney-sweep,lil-sipper" | split: "," %}

<div class="aviary-grid">
  {% for slug in aviary_slugs %}
    {% assign r = site.roasts | where: "slug", slug | first %}
    {% if r %}
      {% include roast-card.html roast=r card_class="aviary-card" hide_price=true hide_quick_add=true %}
    {% endif %}
  {% endfor %}
</div>

<p class="roast-mv-body" style="font-size: 0.85rem; color: #8a7060; font-style: italic; margin-top: -0.5rem; margin-bottom: 2rem;">Brewing method varies by blend — click any roast for full profile and brew details.</p>

<div class="roast-mv-divider"></div>

<div class="roast-mv-center" style="margin-bottom:1rem;">
  <label for="aviary-grind-select" class="roast-mv-meta-label" style="display:block; margin-bottom:0.35rem;">Grind</label>
  <select id="aviary-grind-select" class="subscribe-select" style="min-width: 12rem;">
    <option value="Whole Bean" selected>Whole Bean</option>
    <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
    <option value="Coarser — French Press">Coarser — French Press</option>
    <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
    <option value="Finer — Pour Over">Finer — Pour Over</option>
    <option value="Finest — Espresso">Finest — Espresso</option>
  </select>
</div>

<div class="roast-mv-center" id="add-to-cart-wrap" style="text-align:center;">
  <button class="add-to-order-btn" id="aviary-add-btn">Add to Order — ${{ page.price }}</button>
</div>

</div>

<script src="{{ '/js/flights.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAviaryFlight({ price: {{ page.price | default: 38 }} });
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "The Aviary Flight",
  "image": {{ '/images/audubon-cage-transparent.png' | absolute_url | jsonify }},
  "description": "A sampler flight of four signature Yellow Wing Roasters blends, each individually packaged in an 8oz bag.",
  "brand": {
    "@type": "Brand",
    "name": "Yellow Wing Roasters"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "{{ page.price | default: 38 }}",
    "availability": "https://schema.org/InStock"
  }
}
</script>

