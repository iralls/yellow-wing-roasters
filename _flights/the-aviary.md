---
layout: menu-item
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

<p class="hst-intro" style="margin-top: 1rem;">Four blends, each individually packaged in its own 8oz bag &mdash; a great way to explore the full range before committing to a full bag.</p>

{% assign aviary_slugs = "early-bird,feather-soot,chimney-sweep,lil-sipper" | split: "," %}

<ul class="aviary-list">
  {% for slug in aviary_slugs %}
    {% assign r = site.roasts | where: "slug", slug | first %}
    <li class="aviary-list-item">
      <a href="{{ r.permalink | default: r.url | relative_url }}" class="aviary-list-name">{{ r.card_title | default: r.title }}</a>
      <span class="aviary-list-level">
        {{ site.data.roast_levels[r.roast_level].layman }} Roast
      </span>
      <span class="aviary-list-notes">{{ r.tasting_notes }}</span>
    </li>
  {% endfor %}
</ul>

<p style="font-size: 0.88rem; color: var(--hst-muted); font-style: italic; margin-top: 0.5rem; margin-bottom: 1.5rem;">Brewing method varies by blend &mdash; click any roast for full profile and brew details.</p>

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

