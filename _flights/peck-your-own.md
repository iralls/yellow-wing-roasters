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

<div class="roasts-grid" id="pyo-picker">
  {% assign roasts = site.roasts | sort: "order" %}
  {% for r in roasts %}
    {% assign s_meta = site.data.statuses[r.status] %}
    {% if s_meta == nil or s_meta.orderable != false %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign r_dots = level_info.dots %}
      {% assign r_layman = level_info.layman %}
      {% assign r_specialty = level_info.specialty %}
      {% assign is_100_fto = false %}
      {% assign is_100_organic = false %}
      {% if r.certification == "fair_trade_organic" %}
        {% assign is_100_fto = true %}
        {% assign is_100_organic = true %}
      {% elsif r.certification == "organic" %}
        {% assign is_100_organic = true %}
      {% endif %}
  <div class="roasts-entry pyo-option" data-slug="{{ r.slug }}" data-title="{{ r.title }}" data-roast="{{ r.slug }}" data-category="{{ r.category }}" data-type="{{ r.category | slugify }}" data-has-fto="{{ is_100_fto }}" data-has-organic="{{ is_100_organic }}" data-certification="{{ r.certification }}">
    <div class="roasts-entry-visual">
      {% include roast-status-badge.html roast=r %}
      {% if r.featured %}<div class="roasts-entry-seasonal-badge">Featured</div>{% endif %}
      {% if is_100_fto %}
        <div class="roasts-entry-fto-badge" title="Fair Trade Organic">FTO</div>
      {% elsif is_100_organic %}
        <div class="roasts-entry-organic-badge" title="Organic">Organic</div>
      {% endif %}
      <span class="gift-type-badge">&#10003; Selected</span>
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot" loading="lazy" decoding="async">{% endif %}
      <div class="roasts-entry-overlay">
        {% if r.tasting_notes %}<div class="roasts-entry-overlay-notes">{{ r.tasting_notes | replace: ", ", " · " | downcase }}</div>{% endif %}
        {% if r_dots %}
          <div class="roasts-entry-overlay-level">
            {% include roast-dots.html dots=r_dots %}
            <span class="roasts-entry-overlay-specialty">{{ r_specialty }}</span>
          </div>
        {% endif %}
        {% if r.origins %}
          {% assign c_arr = "" | split: "," %}
          {% for o in r.origins %}
            {% assign c = o | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
            {% assign c_arr = c_arr | push: c %}
          {% endfor %}
          <div class="roasts-entry-overlay-origins">{{ c_arr | uniq | join: " · " }}</div>
        {% elsif r.brewing_method %}
          <div class="roasts-entry-overlay-brewing">{{ r.brewing_method | replace: ", ", " · " }}</div>
        {% endif %}
        {% include roast-overlay-status.html roast=r %}
      </div>
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-header">
        <div class="roasts-entry-main">
          <div class="roasts-entry-title">{{ r.title }}</div>
          {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
        </div>
        <div class="roasts-entry-meta">
          {% if r_layman %}<div class="roasts-entry-layman">{{ r_layman }}</div>{% endif %}
          {% if r.descriptor %}<div class="roasts-entry-descriptor">{{ r.descriptor | downcase }}</div>{% endif %}
        </div>
      </div>
    </div>
  </div>
    {% endif %}
  {% endfor %}
</div>

<div class="roast-mv-center" style="margin-top:1.5rem; margin-bottom:0.5rem;">
  <label for="pyo-grind-select" class="roast-mv-meta-label">Grind</label>
  <select id="pyo-grind-select" class="subscribe-select" style="min-width: 12rem;">
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
