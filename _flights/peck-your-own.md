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
descriptor: "choose four or more roasts to sample"
---

{% assign default_min = page.min_bags %}
{% assign default_price = default_min | times: page.price_per_bag %}

<div class="roasts-catalog-wrap" style="max-width: 74rem; margin: 1.5rem auto 0;">
  <!-- Top Controls & Action Bar -->
  <div class="pyo-controls-bar">
    <div class="pyo-controls-status">
      <div class="pyo-price-wrap">
        <span class="pyo-price-label">Flight Total</span>
        <span class="pyo-price-val" id="pyo-price">${{ default_price }}</span>
      </div>
      <div class="pyo-status-divider" aria-hidden="true"></div>
      <div class="pyo-count-wrap">
        <span class="pyo-count-text" id="pyo-count">Select at least {{ default_min }} roasts</span>
        <span class="pyo-count-sub" id="pyo-sub">{{ default_min }} &times; 8oz bags minimum (${{ page.price_per_bag }}/bag)</span>
      </div>
    </div>

    <div class="pyo-controls-actions">
      <div class="pyo-grind-field">
        <label for="pyo-grind-select" class="roast-mv-meta-label">Grind</label>
        <select id="pyo-grind-select" class="subscribe-select" data-label="Grind">
          {% include grind-options.html %}
        </select>
      </div>
      <button type="button" class="sleek-buy-add-btn add-to-order-btn add-to-order-btn--disabled" id="pyo-add" disabled>Select {{ default_min }} more &mdash; ${{ default_price }}</button>
    </div>
  </div>

  <!-- Cellar List Picker -->
  <div class="min-cellar-list pyo-cellar-list" id="pyo-picker">
    {% assign roasts = site.roasts | sort: "order" %}
    {% for r in roasts %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta == nil or s_meta.orderable != false %}
        {% assign r_url = r.permalink | default: r.url %}
        <div class="min-cellar-item pyo-option"
             role="checkbox"
             aria-checked="false"
             tabindex="0"
             data-category="{{ r.category }}"
             data-roast-level="{{ r.roast_level }}"
             data-title="{{ r.title | escape }}"
             data-notes="{{ r.tasting_notes | escape }}"
             data-slug="{{ r.slug }}">
          <span class="pyo-check-indicator" aria-hidden="true">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="pyo-check-icon">
              <path d="M11.5 3.5L5.5 9.5L2.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="min-cellar-info">
            <span class="min-cellar-name">{{ r.card_title | default: r.title }}</span>
            <span class="min-cellar-sub">{{ r.category }} &middot; {{ r.descriptor | default: r.subtitle }}</span>
          </div>
          <div class="min-cellar-level" title="Roast Level: {{ r.roast_level }}/5">
            {% include roast-dots.html roast=r class="roast-dots-sm" %}
            <span class="min-cellar-level-text">{{ site.data.roast_levels[r.roast_level].layman }}</span>
          </div>
          <span class="min-cellar-origin">
            {% if r.origins %}
              {{ r.origins | join: ", " }}
            {% elsif r.category == 'single origin' %}
              {{ r.title | split: " " | first }}
            {% endif %}
          </span>
          <span class="min-cellar-notes">{{ r.tasting_notes }}</span>
        </div>
      {% endif %}
    {% endfor %}
  </div>
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
