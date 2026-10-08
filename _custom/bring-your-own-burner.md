---
layout: detail-page
title: "BYOB — Bring Your Own Burner"
card_title: "BYOB"
subtitle: "Bring your own burner"
intro: "Love one of our single-origin coffees, but want to explore it at a different roast level? Pick any of our available single-origin beans, choose your desired roast level from City to Vienna, and we'll custom-fire it fresh to order."
slug: bring-your-own-burner
category: custom
data_roast: byob-burner
order: 3
permalink: /roasts/bring-your-own-burner/
mascot_file: bird-on-spit-transparent.png
mascot_alt: "BYOB mascot"
descriptor: custom roast level
overlay_notes: "pick any single origin and customize your roast level"
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}

<div id="byob-burner-form" class="byob-burner-form">

  <!-- Step 1: Choose Single Origin Coffee -->
  <div class="roast-mv-center roast-mv-center--mt-md">
    <label for="byob-origin-select" class="roast-mv-meta-label">1. Select Single Origin</label>
    <select id="byob-origin-select" class="subscribe-select">
      {% for r in active_so %}
        <option value="{{ r.slug }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
      {% endfor %}
    </select>
  </div>

  <!-- Origin Bean Card Info Preview -->
  <div id="byob-origin-preview" class="byob-origin-preview">
    <div id="byob-origin-notes" class="byob-origin-notes"></div>
    <div id="byob-origin-prescribed" class="byob-origin-prescribed"></div>
  </div>

  <!-- Step 2: Choose Roast Level -->
  <div class="roast-mv-center roast-mv-center--mt-lg">
    <label for="byob-roast-select" class="roast-mv-meta-label">2. Choose Roast Level</label>
    
    <!-- Interactive Dots Preview -->
    <div id="byob-dots-stepper" class="roast-dots" title="Click any dot to select roast level">
      <span class="roast-dot roast-dot-1" data-level="1" title="City (Light)"></span>
      <span class="roast-dot roast-dot-2" data-level="2" title="City+ (Light-Medium)"></span>
      <span class="roast-dot" data-level="3" title="Full City (Medium)"></span>
      <span class="roast-dot" data-level="4" title="Full City+ (Medium-Dark)"></span>
      <span class="roast-dot" data-level="5" title="Vienna (Dark)"></span>
    </div>

    <select id="byob-roast-select" class="subscribe-select">
      {% for lvl_num in (1..5) %}
        {% assign lvl_data = site.data.roast_levels[lvl_num] %}
        <option value="{{ lvl_data.specialty }}" data-dots="{{ lvl_data.dots }}" data-num="{{ lvl_num }}">{{ lvl_data.specialty }}</option>
      {% endfor %}
    </select>
    
    <div id="byob-level-status" class="byob-level-status">
      <span id="byob-level-status-text">Recommended for this origin</span>
    </div>
  </div>

  <!-- Step 3: Roast Amount & Grind -->
  <div class="roast-mv-center roast-mv-center--mt-lg">
    <label for="byob-size-select" class="roast-mv-meta-label">3. Roast Amount</label>
    <select id="byob-size-select" class="subscribe-select">
      {% include bag-size-options.html %}
    </select>
  </div>

  <div class="roast-mv-center roast-mv-center--mt-md">
    <label for="byob-grind-select" class="roast-mv-meta-label">4. Grind</label>
    <select id="byob-grind-select" class="subscribe-select">
      {% include grind-options.html %}
    </select>
  </div>

  <!-- Step 4: Price & Add to Cart -->
  <div class="roast-mv-center roast-mv-center--mt-xl">
    <div class="roast-detail-price-line" id="byob-price-display">$12</div>
    <button type="button" class="add-to-order-btn" id="byob-add-to-cart-btn">Add to Cart</button>
  </div>

</div>

<script src="{{ '/js/byob-burner.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var originsData = {
    {% for r in active_so %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      {% assign r_specialty = level_info.specialty %}
      {% assign r_dots = level_info.dots %}
      {% assign rp = r.price %}
      {{ r.slug | jsonify }}: {
        title: {{ r.title | jsonify }},
        mascot: {{ r.mascot_file | jsonify }},
        prescribed_level: {{ r_specialty | jsonify }},
        prescribed_dots: {{ r_dots }},
        tasting_notes: {{ r.tasting_notes | default: r.descriptor | default: "" | jsonify }},
        prices: {
          {% for entry in rp %}
            {% assign s = entry[0] %}
            {% if r.sizes == nil or r.sizes contains s %}
              {% assign p = entry[1] %}
              {% if r.temporary_price and r.temporary_price[s] %}{% assign p = r.temporary_price[s] %}{% endif %}
              {{ s | jsonify }}: {{ p }}{% unless forloop.last %},{% endunless %}
            {% endif %}
          {% endfor %}
        }
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  initBYOBBurner({
    origins: originsData,
    orderUrl: {{ '/order/' | relative_url | jsonify }},
    imagesBase: {{ '/images/' | relative_url | jsonify }}
  });
})();
</script>
