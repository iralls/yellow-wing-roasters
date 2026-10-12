---
layout: detail-page
title: Peck Your Own
slug: peck-your-own
category: flight
order: 2
permalink: /flights/peck-your-own/
price_per_bag: 10
min_bags: 4
mascot_file: peck-your-own-transparent.png
mascot_alt: "Peck Your Own"
intro: "Pick at least 4 of our available roasts — each one comes as an 8oz bag."
overlay_notes: "pick at least 4 of our available roasts in 8oz bags"
---

<p class="roast-mv-center" id="pyo-count" style="font-weight:600; margin-bottom:0.5rem;">Select at least {{ page.min_bags }} roasts:</p>

<div class="roasts-catalog-wrap" style="max-width: 74rem; margin: 0 auto;">
  <div class="roast-trans-grid sleek-comparison-grid" id="pyo-picker">
    {% assign roasts = site.roasts | sort: "order" %}
    {% for r in roasts %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta == nil or s_meta.orderable != false %}
        {% include roast-card.html roast=r card_class="pyo-option" is_picker=true hide_price=true %}
      {% endif %}
    {% endfor %}
  </div>
</div>


<div class="roast-mv-center" style="margin-top:1.5rem; margin-bottom:0.5rem;">
  <label for="pyo-grind-select" class="roast-mv-meta-label">Grind</label>
  <select id="pyo-grind-select" class="subscribe-select" data-label="Grind" style="min-width: 12rem;">
    {% include grind-options.html %}
  </select>
</div>

<div class="roast-mv-center" style="margin-top:1rem;">
  {% assign default_min = page.min_bags %}
  {% assign default_price = default_min | times: page.price_per_bag %}
  <button class="add-to-order-btn add-to-order-btn--disabled" id="pyo-add" disabled>Select at least {{ default_min }} roasts — ${{ default_price }}</button>
</div>

<script src="{{ '/js/flights.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initPYOFlight({
    pricePerBag: {{ page.price_per_bag }},
    minBags: {{ page.min_bags }},
    mascot: {{ page.mascot_file | jsonify }}
  });
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Peck Your Own Flight",
  "image": {{ page.mascot_file | prepend: '/images/' | absolute_url | jsonify }},
  "description": "Custom sampler flight: choose any four or more of our freshly roasted coffees in 8oz bags.",
  "brand": {
    "@type": "Brand",
    "name": "Yellow Wing Roasters"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "{{ page.min_bags | times: page.price_per_bag }}",
    "highPrice": "{{ page.min_bags | times: page.price_per_bag | plus: 40 }}",
    "price": "{{ page.min_bags | times: page.price_per_bag }}",
    "availability": "https://schema.org/InStock"
  }
}
</script>
