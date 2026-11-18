---
layout: menu-item
title: "BYOB — Build Your Own Blend"
subtitle: "Build Your Own Blend"
intro: "Combine up to three varieties of green beans, select individual roast levels and percentage ratios, and design a custom coffee profile exactly to your taste."
slug: build-your-own-blend
category: custom
order: 1
permalink: /roasts/build-your-own-blend/
price: 32
overlay_notes: "Formulate up to three varieties with individual roast degrees"
shop_meta: "Custom Batch"
mascot_file: build-a-bird-transparent.png
mascot_alt: "Build Your Own Blend mascot"
custom_css: custom-roasts.css
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" | where_exp: "item", "item.status != 'archived'" %}
{% assign default_bag_size = site.data.bag_sizes | where: "default", true | map: "id" | first %}

<form class="hst-form" id="byob-blend-form" onsubmit="return false;">
  <!-- Component 1 -->
  <div class="byob-component-card" data-component="1">
    <div class="byob-component-head">
      <span>Component 1 (Primary)</span>
    </div>
    <div class="byob-component-grid">
      <div>
        <label class="hst-label" for="blend-origin-1">Single Origin Bean</label>
        <select id="blend-origin-1" class="hst-select byob-origin-input" required>
          {% for r in active_so %}
            <option value="{{ r.title }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-roast-1">Roast Level</label>
        <select id="blend-roast-1" class="hst-select byob-roast-input" required>
          {% for lvl_num in (1..5) %}
            {% assign lvl_data = site.data.roast_levels[lvl_num] %}
            <option value="{{ lvl_data.specialty }} ({{ lvl_data.layman }})"{% if lvl_num == 3 %} selected{% endif %}>{{ lvl_data.specialty }} ({{ lvl_data.layman }})</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-pct-1">Ratio (%)</label>
        <input type="number" id="blend-pct-1" class="hst-input byob-pct-input" min="1" max="100" value="50" required>
      </div>
    </div>
  </div>

  <!-- Component 2 -->
  <div class="byob-component-card" data-component="2">
    <div class="byob-component-head">
      <span>Component 2 (Secondary)</span>
      <button type="button" class="byob-component-remove" aria-label="Remove Component 2" title="Remove component">&times;</button>
    </div>
    <div class="byob-component-grid">
      <div>
        <label class="hst-label" for="blend-origin-2">Single Origin Bean</label>
        <select id="blend-origin-2" class="hst-select byob-origin-input" required>
          {% for r in active_so %}
            <option value="{{ r.title }}"{% if forloop.index == 2 %} selected{% endif %}>{{ r.title }}</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-roast-2">Roast Level</label>
        <select id="blend-roast-2" class="hst-select byob-roast-input" required>
          {% for lvl_num in (1..5) %}
            {% assign lvl_data = site.data.roast_levels[lvl_num] %}
            <option value="{{ lvl_data.specialty }} ({{ lvl_data.layman }})"{% if lvl_num == 2 %} selected{% endif %}>{{ lvl_data.specialty }} ({{ lvl_data.layman }})</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-pct-2">Ratio (%)</label>
        <input type="number" id="blend-pct-2" class="hst-input byob-pct-input" min="0" max="100" value="30" required>
      </div>
    </div>
  </div>

  <!-- Component 3 -->
  <div class="byob-component-card" data-component="3">
    <div class="byob-component-head">
      <span>Component 3 (Accent)</span>
      <button type="button" class="byob-component-remove" aria-label="Remove Component 3" title="Remove component">&times;</button>
    </div>
    <div class="byob-component-grid">
      <div>
        <label class="hst-label" for="blend-origin-3">Single Origin Bean</label>
        <select id="blend-origin-3" class="hst-select byob-origin-input" required>
          {% for r in active_so %}
            <option value="{{ r.title }}"{% if forloop.index == 3 %} selected{% endif %}>{{ r.title }}</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-roast-3">Roast Level</label>
        <select id="blend-roast-3" class="hst-select byob-roast-input" required>
          {% for lvl_num in (1..5) %}
            {% assign lvl_data = site.data.roast_levels[lvl_num] %}
            <option value="{{ lvl_data.specialty }} ({{ lvl_data.layman }})"{% if lvl_num == 4 %} selected{% endif %}>{{ lvl_data.specialty }} ({{ lvl_data.layman }})</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-pct-3">Ratio (%)</label>
        <input type="number" id="blend-pct-3" class="hst-input byob-pct-input" min="0" max="100" value="20" required>
      </div>
    </div>
  </div>

  <button type="button" class="byob-add-component-btn" id="byob-add-component-btn" hidden>
    + Add Component
  </button>

  <!-- Total Ratio Indicator -->
  <div id="byob-ratio-total-wrap" class="byob-ratio-status">
    Total Ratio: <strong id="byob-ratio-sum">100%</strong>
    <span id="byob-ratio-msg" class="byob-ratio-msg"></span>
  </div>

  <!-- Grind Style -->
  <div>
    <label class="hst-label" for="byob-blend-grind">Grind Style</label>
    <select id="byob-blend-grind" class="hst-select">
      {% include grind-options.html %}
    </select>
  </div>

  <!-- Notes -->
  <div>
    <label class="hst-label" for="byob-blend-notes">Notes</label>
    <textarea id="byob-blend-notes" class="hst-textarea" rows="2" placeholder="Roasting preferences or instructions..."></textarea>
  </div>

  <button type="submit" class="hst-btn" id="byob-blend-add-btn">
    Add to Cart
  </button>
</form>

{% assign chimney_sweep = site.roasts | where: "slug", "chimney-sweep" | first %}
{% assign early_bird = site.roasts | where: "slug", "early-bird" | first %}
<div class="hst-drawers">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Blending Philosophy</button>
    <div class="hst-drawer-body">
      <p style="margin-top: 0;">Every custom blend is roasted component-by-component to its optimal development curve before being blended and packed fresh in a dedicated 12oz bag.</p>
      <p>A classic three-part blend works like a good recipe, with each coffee playing a distinct role:</p>
      <ul>
        <li><strong>Base bean (~50&ndash;60%):</strong> Anchors the cup with body, sweetness, and core structure.</li>
        <li><strong>Middle bean (~25&ndash;35%):</strong> Ties the blend together, bridging the base and the accent for balance and smoothness.</li>
        <li><strong>Accent bean (~10&ndash;20%):</strong> Adds brightness, fruit, or complexity without overpowering the cup.</li>
      </ul>
      <p style="margin-bottom: 0;"><strong>Examples:</strong></p>
      <ul style="margin-top: 0.35rem;">
        <li><a href="{{ early_bird.url | relative_url }}">{{ early_bird.title }}</a> &mdash; Colombia Supremo (50% base), Peru Fair Trade Organic (35% middle), and Kenya AB Gathaithi (15% accent).</li>
        <li><a href="{{ chimney_sweep.url | relative_url }}">{{ chimney_sweep.title }}</a> &mdash; Brazil Natural (50% base), Guatemala Antigua Washed (30% middle), and Ethiopia Guji Uraga Natural (20% accent).</li>
        <li><a href="https://www.willoughbyscoffee.com/product/willoughby-s-espresso-blend/M7AFNF5ZAQEEITVMSYYSHR5D" target="_blank" rel="noopener">Willoughby&rsquo;s Espresso Blend</a> &mdash; A two-component blend using the same origin at two roast levels: Guatemala Antigua French Roast paired with just enough of its Full City Roast counterpart for a zesty, caramelized cup.</li>
      </ul>
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Blend Studio Specifications</button>
    <div class="hst-drawer-body">
      <strong>Capacity:</strong> Up to 3 single-origin coffees<br>
      <strong>Roasting Control:</strong> Independent roast profile per component<br>
      <strong>Package Size:</strong> One 12oz custom roasted bag<br>
      <strong>Freshness:</strong> Roasted to order &amp; blended fresh
    </div>
  </div>
</div>

<script>
  (function() {
    const form = document.getElementById("byob-blend-form");
    const slots = [1, 2, 3].map(n => ({
      card: form.querySelector(`.byob-component-card[data-component="${n}"]`),
      origin: document.getElementById(`blend-origin-${n}`),
      roast: document.getElementById(`blend-roast-${n}`),
      pct: document.getElementById(`blend-pct-${n}`),
      removeBtn: form.querySelector(`.byob-component-card[data-component="${n}"] .byob-component-remove`)
    }));
    const addCompBtn = document.getElementById("byob-add-component-btn");
    const grindSelect = document.getElementById("byob-blend-grind");
    const notesInput = document.getElementById("byob-blend-notes");
    const sumEl = document.getElementById("byob-ratio-sum");
    const msgEl = document.getElementById("byob-ratio-msg");
    const addBtn = document.getElementById("byob-blend-add-btn");

    function setSlotActive(slot, active) {
      slot.card.hidden = !active;
      slot.origin.disabled = !active;
      slot.roast.disabled = !active;
      slot.pct.disabled = !active;
      addCompBtn.hidden = !slots.some(s => s.card.hidden);
      calcTotal();
    }

    function calcTotal() {
      let total = 0;
      for (const slot of slots) {
        if (!slot.card.hidden) {
          total += parseInt(slot.pct.value, 10) || 0;
        }
      }
      sumEl.textContent = `${total}%`;
      if (total === 100) {
        sumEl.style.color = "var(--hst-text)";
        msgEl.textContent = "";
        addBtn.disabled = false;
      } else {
        sumEl.style.color = "var(--hst-sale)";
        msgEl.textContent = ` (Percentages must add up to 100%)`;
        addBtn.disabled = true;
      }
      return total;
    }

    slots.forEach(slot => {
      slot.pct.addEventListener("input", calcTotal);
      slot.origin.addEventListener("change", calcTotal);
      if (slot.removeBtn) {
        slot.removeBtn.addEventListener("click", () => setSlotActive(slot, false));
      }
    });

    addCompBtn.addEventListener("click", () => {
      const nextHidden = slots.find(s => s.card.hidden);
      if (nextHidden) {
        setSlotActive(nextHidden, true);
      }
    });

    calcTotal();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const total = calcTotal();
      if (total !== 100) {
        alert("The component percentages must add up to 100%.");
        return;
      }

      const components = [];
      for (const slot of slots) {
        if (slot.card.hidden) continue;
        const pctVal = parseInt(slot.pct.value, 10) || 0;
        if (pctVal > 0) {
          components.push({
            name: slot.origin.value,
            roast: slot.roast.value,
            pct: pctVal
          });
        }
      }

      // Sort descending by percentage as per Blend Component Order rule
      components.sort((a, b) => b.pct - a.pct);

      const subtitle = components.map(c => `${c.name} (${c.pct}% - ${c.roast})`).join(", ");

      const item = {
        type: "custom",
        slug: "build-your-own-blend",
        title: "Build Your Own Blend",
        subtitle: subtitle,
        size: {{ default_bag_size | jsonify }},
        grind: grindSelect.value,
        price: {{ page.price }},
        mascot: {{ page.mascot_file | jsonify }},
        notes: notesInput.value.trim()
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
        console.error("Failed to add Build Your Own Blend to cart:", item);
      }
    });
  })();
</script>
