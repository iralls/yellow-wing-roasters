---
layout: menu-item
title: Peck Your Own
slug: peck-your-own
category: flight
order: 2
permalink: /flights/peck-your-own/
price: 40
price_per_bag: 10
min_bags: 4
no_order: true
mascot_file: peck-your-own-transparent.png
mascot_alt: "Peck Your Own"
intro: "Build your own custom sampler flight: pick any 4 or more of our fresh coffees in 8oz bags ($10/bag)."
descriptor: "Sample Flight"
---

{% assign all_roasts = site.roasts | sort: "order" %}
{% assign active_roasts = all_roasts | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}

<form class="hst-form" id="pyo-form" onsubmit="return false;">
  <!-- Roast Selector Dropdown -->
  <div>
    <label class="hst-label" for="pyo-roast-select">Select a Roast to Add</label>
    <select id="pyo-roast-select" class="hst-select">
      <option value="" disabled selected>-- Choose a roast to add to your flight --</option>
      {% for r in active_roasts %}
        {% assign lvl = site.data.roast_levels[r.roast_level] %}
        <option value="{{ r.title | escape }}" data-slug="{{ r.slug }}" data-level="{{ lvl.specialty }} ({{ lvl.layman }})" data-cat="{{ r.category | capitalize }}">
          {{ r.title }} &mdash; {{ lvl.specialty }} ({{ lvl.layman }})
        </option>
      {% endfor %}
    </select>
  </div>

  <!-- Appended Chosen Roasts List -->
  <div style="margin-top: 0.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
      <label class="hst-label" style="margin: 0;">Selected Roasts in Flight</label>
      <span id="pyo-count-indicator" class="pyo-status-badge">0 of 4 minimum selected</span>
    </div>
    <ul id="pyo-chosen-list" class="pyo-chosen-list">
      <li class="pyo-empty-placeholder" id="pyo-empty-msg">Choose a roast above to start building your sampler.</li>
    </ul>
  </div>

  <!-- Grind Style -->
  <div>
    <label class="hst-label" for="pyo-grind-select">Grind Level</label>
    <select id="pyo-grind-select" class="hst-select">
      {% for g in site.data.grind_levels %}
        <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
      {% endfor %}
    </select>
  </div>

  <button type="submit" class="hst-btn" id="pyo-add-btn" disabled>Add to Cart</button>
</form>

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Flight Details &amp; Pricing</button>
    <div class="hst-drawer-body">
      <strong>Minimum Order:</strong> 4 coffees minimum ($40 flight total)<br>
      <strong>Bag Size:</strong> 8oz individual sampler bag per coffee<br>
      <strong>Additional Bags:</strong> $10 for each additional 8oz bag beyond 4<br>
      <strong>Selection:</strong> Pick any combination of our signature blends and single origins
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Freshness &amp; Roasting</button>
    <div class="hst-drawer-body">
      Every bag in your flight is roasted to order in small batches, degassed, and sealed fresh with its roast profile.
    </div>
  </div>
</div>

<script>
  (function() {
    const minBags = {{ page.min_bags }};
    const pricePerBag = {{ page.price_per_bag }};
    const roastSelect = document.getElementById("pyo-roast-select");
    const chosenList = document.getElementById("pyo-chosen-list");
    const countIndicator = document.getElementById("pyo-count-indicator");
    const emptyMsg = document.getElementById("pyo-empty-msg");
    const priceDisplay = document.getElementById("product-price-display");
    const grindSelect = document.getElementById("pyo-grind-select");
    const addBtn = document.getElementById("pyo-add-btn");
    const form = document.getElementById("pyo-form");

    let chosenRoasts = [];

    function updateUI() {
      const count = chosenRoasts.length;
      const total = Math.max(minBags, count) * pricePerBag;

      priceDisplay.textContent = "$" + total + ".00";

      if (count === 0) {
        countIndicator.textContent = "0 of " + minBags + " minimum selected";
        countIndicator.classList.remove("met");
        addBtn.disabled = true;
      } else if (count < minBags) {
        const remaining = minBags - count;
        countIndicator.textContent = count + " of " + minBags + " selected (" + remaining + " more needed)";
        countIndicator.classList.remove("met");
        addBtn.disabled = true;
      } else {
        countIndicator.textContent = "✓ " + count + " roasts selected ($" + total + ".00)";
        countIndicator.classList.add("met");
        addBtn.disabled = false;
      }

      // Render list items
      chosenList.innerHTML = "";
      if (count === 0) {
        chosenList.appendChild(emptyMsg);
      } else {
        chosenRoasts.forEach((r, idx) => {
          const li = document.createElement("li");
          li.className = "pyo-chosen-item";

          const info = document.createElement("div");
          info.className = "pyo-chosen-info";

          const name = document.createElement("span");
          name.className = "pyo-chosen-name";
          name.textContent = r.title;
          info.appendChild(name);

          const meta = document.createElement("span");
          meta.className = "pyo-chosen-meta";
          meta.textContent = "8oz bag · " + r.level;
          info.appendChild(meta);

          li.appendChild(info);

          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "pyo-remove-btn";
          removeBtn.innerHTML = "&times;";
          removeBtn.setAttribute("aria-label", "Remove " + r.title);
          removeBtn.addEventListener("click", () => {
            chosenRoasts.splice(idx, 1);
            updateUI();
          });
          li.appendChild(removeBtn);

          chosenList.appendChild(li);
        });
      }
    }

    roastSelect.addEventListener("change", () => {
      const opt = roastSelect.options[roastSelect.selectedIndex];
      if (!opt.value) return;

      chosenRoasts.push({
        title: opt.value,
        slug: opt.getAttribute("data-slug"),
        level: opt.getAttribute("data-level"),
        cat: opt.getAttribute("data-cat")
      });

      // Reset dropdown back to default placeholder
      roastSelect.selectedIndex = 0;
      updateUI();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (chosenRoasts.length < minBags) return;

      const count = chosenRoasts.length;
      const total = count * pricePerBag;

      const item = {
        type: "flight",
        slug: "peck-your-own",
        title: "Peck Your Own",
        size: count + " x 8oz bags",
        grind: grindSelect.value,
        price: total,
        subtitle: chosenRoasts.map(r => r.title).join(", "),
        mascot: {{ page.mascot_file | jsonify }}
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
        console.error("ywrAddToCart failed for item:", item);
      }
    });

    updateUI();
  })();
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
