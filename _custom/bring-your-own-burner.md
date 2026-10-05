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

<div id="byob-burner-form" style="max-width: 26rem; margin: 0 auto; text-align: center;">

  <!-- Step 1: Choose Single Origin Coffee -->
  <div class="roast-mv-center" style="margin-top: 1rem;">
    <label for="byob-origin-select" class="roast-mv-meta-label" style="display:block; margin-bottom: 0.35rem;">1. Select Single Origin</label>
    <select id="byob-origin-select" class="subscribe-select" style="min-width: 16rem; width: 100%;">
      {% for r in active_so %}
        <option value="{{ r.slug }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
      {% endfor %}
    </select>
  </div>

  <!-- Origin Bean Card Info Preview -->
  <div id="byob-origin-preview" style="margin: 0.85rem auto 1.25rem; padding: 0.75rem 1rem; background: rgba(253, 250, 243, 0.85); border: 1px solid rgba(230, 220, 205, 0.9); border-radius: 0.5rem; text-align: center;">
    <div id="byob-origin-notes" style="font-size: 0.85rem; font-style: italic; color: #8a7060; margin-bottom: 0.35rem;"></div>
    <div id="byob-origin-prescribed" style="font-size: 0.75rem; font-weight: 600; color: #2c1e14; text-transform: uppercase; letter-spacing: 0.05em;"></div>
  </div>

  <!-- Step 2: Choose Roast Level -->
  <div class="roast-mv-center" style="margin-top: 1.25rem;">
    <label for="byob-roast-select" class="roast-mv-meta-label" style="display:block; margin-bottom: 0.35rem;">2. Choose Roast Level</label>
    
    <!-- Interactive Dots Preview -->
    <div id="byob-dots-stepper" class="roast-dots" style="margin-bottom: 0.6rem; cursor: pointer;" title="Click any dot to select roast level">
      <span class="roast-dot roast-dot-1" data-level="1" style="width: 14px; height: 14px; cursor: pointer;" title="City (Light)"></span>
      <span class="roast-dot roast-dot-2" data-level="2" style="width: 14px; height: 14px; cursor: pointer;" title="City+ (Light-Medium)"></span>
      <span class="roast-dot" data-level="3" style="width: 14px; height: 14px; cursor: pointer;" title="Full City (Medium)"></span>
      <span class="roast-dot" data-level="4" style="width: 14px; height: 14px; cursor: pointer;" title="Full City+ (Medium-Dark)"></span>
      <span class="roast-dot" data-level="5" style="width: 14px; height: 14px; cursor: pointer;" title="Vienna (Dark)"></span>
    </div>

    <select id="byob-roast-select" class="subscribe-select" style="min-width: 16rem; width: 100%;">
      {% for lvl_num in (1..5) %}
        {% assign lvl_data = site.data.roast_levels[lvl_num] %}
        <option value="{{ lvl_data.specialty }}" data-dots="{{ lvl_data.dots }}" data-num="{{ lvl_num }}">{{ lvl_data.specialty }}</option>
      {% endfor %}
    </select>
    
    <div id="byob-level-status" style="margin-top: 0.35rem; font-size: 0.8rem; color: #8a7060;">
      <span id="byob-level-status-text">Recommended for this origin</span>
    </div>
  </div>

  <!-- Step 3: Roast Amount & Grind -->
  <div class="roast-mv-center" style="margin-top: 1.25rem;">
    <label for="byob-size-select" class="roast-mv-meta-label" style="display:block; margin-bottom: 0.35rem;">3. Roast Amount</label>
    <select id="byob-size-select" class="subscribe-select" style="min-width: 16rem; width: 100%;">
      {% include bag-size-options.html %}
    </select>
  </div>

  <div class="roast-mv-center" style="margin-top: 1rem;">
    <label for="byob-grind-select" class="roast-mv-meta-label" style="display:block; margin-bottom: 0.35rem;">4. Grind</label>
    <select id="byob-grind-select" class="subscribe-select" style="min-width: 16rem; width: 100%;">
      {% include grind-options.html %}
    </select>
  </div>

  <!-- Step 4: Price & Add to Cart -->
  <div class="roast-mv-center" style="margin-top: 1.5rem;">
    <div class="roast-detail-price-line" id="byob-price-display" style="margin-bottom: 0.75rem;">$12</div>
    <button type="button" class="add-to-order-btn" id="byob-add-to-cart-btn" style="min-width: 14rem; padding: 0.65rem 1.8rem; font-size: 0.9rem;">Add to Cart</button>
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
