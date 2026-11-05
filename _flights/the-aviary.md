---
layout: detail-page
title: The Aviary
slug: the-aviary
category: flight
order: 1
permalink: /flights/the-aviary/
price: 38
mascot_file: audubon-cage-transparent.png
mascot_alt: "The Aviary cage"
intro: 'Our four "nest" blends, ranging from bright and floral to dark and smoky'
notes: "Four blends, one box"
descriptor: "a sample pack of our most popular blends"
---

<p class="roast-mv-body">Four blends, each individually packaged in its own 8oz bag — a great way to explore the full range before committing to a full bag.</p>

{% assign aviary_slugs = "early-bird,feather-soot,chimney-sweep,lil-sipper" | split: "," %}

<ul class="aviary-list">
  {% for slug in aviary_slugs %}
    {% assign r = site.roasts | where: "slug", slug | first %}
    <li class="aviary-list-item">
      <a href="{{ r.permalink | default: r.url | relative_url }}" class="aviary-list-name">{{ r.card_title | default: r.title }}</a>
      <span class="aviary-list-level" title="Roast Level: {{ r.roast_level }}/5">
        {% include roast-dots.html roast=r class="roast-dots-sm" %}
        <span class="aviary-list-level-text">{{ site.data.roast_levels[r.roast_level].layman }}</span>
      </span>
      <span class="aviary-list-notes">{{ r.tasting_notes }}</span>
    </li>
  {% endfor %}
</ul>


<p class="roast-mv-body" style="font-size: 0.85rem; color: #8a7060; font-style: italic; margin-top: 1.25rem; margin-bottom: 2rem;">Brewing method varies by blend — click any roast for full profile and brew details.</p>

<div class="roast-mv-center" style="margin-bottom:1rem;">
  <label for="aviary-grind-select" class="roast-mv-meta-label">Grind</label>
  <select id="aviary-grind-select" class="subscribe-select" data-label="Grind" style="min-width: 12rem;">
    {% include grind-options.html %}
  </select>
</div>

<div class="roast-mv-center" id="add-to-cart-wrap" style="text-align:center;">
  <button class="sleek-buy-add-btn add-to-order-btn" id="aviary-add-btn" style="width: auto; min-width: 14rem;">Add to Cart</button>
</div>

<script src="{{ '/js/flights.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAviaryFlight({
    price: {{ page.price }},
    mascot: {{ page.mascot_file | jsonify }}
  });
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "The Aviary Flight",
  "image": {{ page.mascot_file | prepend: '/images/' | absolute_url | jsonify }},
  "description": "A sampler flight of four signature Yellow Wing Roasters blends, each individually packaged in an 8oz bag.",
  "brand": {
    "@type": "Brand",
    "name": "Yellow Wing Roasters"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "{{ page.price }}",
    "availability": "https://schema.org/InStock"
  }
}
</script>

