---
layout: menu-item
title: "BYOB — Bank Your Own Burner"
card_title: "BYOB"
subtitle: "Bank your own burner"
intro: "Love one of our single-origin coffees, but want to explore it at a different roast level? Pick any of our available single-origin beans, choose your desired roast level from City to Vienna, and we'll custom-fire it fresh to order."
slug: bank-your-own-burner
category: custom
price: "Cost of Selected Bean"
data_roast: byob-burner
order: 3
permalink: /roasts/bank-your-own-burner/
mascot_file: bird-on-spit-transparent.png
mascot_alt: "BYOB mascot"
descriptor: Bank Your Own Burner
overlay_notes: "pick any single origin and customize your roast level"
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign first_so = active_so.first %}
{% assign first_so_price = first_so.price["12oz"] | default: first_so.price.first[1] %}

<form class="hst-form" id="byob-burner-form" onsubmit="return false;">
  <div>
    <label class="hst-label" for="byob-origin-select">Single Origin Coffee</label>
    <select id="byob-origin-select" class="hst-select">
      {% for r in active_so %}
        <option value="{{ r.slug }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
      {% endfor %}
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-roast-select">Target Roast Level</label>
    <select id="byob-roast-select" class="hst-select">
      {% for lvl_num in (1..5) %}
        {% assign lvl_data = site.data.roast_levels[lvl_num] %}
        <option value="{{ lvl_data.specialty }}">{{ lvl_data.specialty }}</option>
      {% endfor %}
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-size-select">Bag Size</label>
    <select id="byob-size-select" class="hst-select">
      {% for sz in site.data.bag_sizes %}
        <option value="{{ sz.id }}"{% if sz.id == "12oz" %} selected{% endif %}>{{ sz.label }}</option>
      {% endfor %}
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-grind-select">Grind Style</label>
    <select id="byob-grind-select" class="hst-select">
      {% for g in site.data.grind_levels %}
        <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
      {% endfor %}
    </select>
  </div>

  <button type="submit" class="hst-btn" id="byob-burner-add-btn">
    Add to Cart
  </button>
</form>

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Roaster's Note</button>
    <div class="hst-drawer-body">
      Every origin possesses a distinctive development curve. While we prescribe a standard roast profile designed to emphasize brightness, florals, or deep sugar browning, customizing the roast level allows you to discover completely different flavor notes in your favorite single-origin coffee.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Custom Burner Specifications</button>
    <div class="hst-drawer-body">
      <strong>Service Type:</strong> Single-Origin Bespoke Roasting<br>
      <strong>Roast Spectrum:</strong> City (Light) &ndash; Vienna (Dark)<br>
      <strong>Sourcing:</strong> Active micro-lot single origins<br>
      <strong>Freshness:</strong> Fired fresh to order on demand
    </div>
  </div>
</div>

<script>
  (function() {
    const originsData = {
      {% for r in active_so %}
        {% assign rp = r.price %}
        {{ r.slug | jsonify }}: {
          title: {{ r.title | jsonify }},
          mascot: {{ r.mascot_file | jsonify }},
          prices: {
            {% for entry in rp %}
              {% assign s = entry[0] %}
              {% assign p = entry[1] %}
              {% if r.temporary_price and r.temporary_price[s] %}{% assign p = r.temporary_price[s] %}{% endif %}
              {{ s | jsonify }}: {{ p }}{% unless forloop.last %},{% endunless %}
            {% endfor %}
          }
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };

    const originSelect = document.getElementById("byob-origin-select");
    const roastSelect = document.getElementById("byob-roast-select");
    const sizeSelect = document.getElementById("byob-size-select");
    const grindSelect = document.getElementById("byob-grind-select");
    const addBtn = document.getElementById("byob-burner-add-btn");
    const priceDisplay = document.getElementById("product-price-display");

    function updatePrice() {
      const orig = originsData[originSelect.value];
      if (orig && orig.prices[sizeSelect.value]) {
        priceDisplay.innerHTML = `$${orig.prices[sizeSelect.value]}.00`;
      }
    }

    originSelect.addEventListener("change", updatePrice);
    sizeSelect.addEventListener("change", updatePrice);
    updatePrice();

    const form = document.getElementById("byob-burner-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const orig = originsData[originSelect.value];
        const price = orig.prices[sizeSelect.value];

        const item = {
          type: "custom",
          slug: "bank-your-own-burner",
          title: "Bank Your Own Burner",
          subtitle: `${orig.title} (${roastSelect.value})`,
          size: sizeSelect.value,
          roastLevel: roastSelect.value,
          grind: grindSelect.value,
          price: price,
          mascot: orig.mascot || {{ page.mascot_file | jsonify }}
        };

        const added = window.ywrAddToCart(item, 1);
        if (added) {
          const origText = addBtn.textContent;
          addBtn.textContent = "Added to Cart!";
          addBtn.disabled = true;
          setTimeout(() => {
            addBtn.textContent = origText;
            addBtn.disabled = false;
          }, 1400);
        } else {
          console.error("Failed to add Bank Your Own Burner to cart:", item);
        }
      });
    }
  })();
</script>
