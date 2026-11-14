---
layout: menu-item
title: "BYOB — Build Your Own Blend"
card_title: "BYOB"
subtitle: "Build Your Own Blend"
intro: "Combine up to three varieties of green beans, select individual roast levels and percentage ratios, and design a custom coffee profile exactly to your taste."
slug: build-your-own-blend
category: custom
data_roast: byob-blend
order: 1
permalink: /roasts/build-your-own-blend/
price: 32
descriptor: Build Your Own Blend
overlay_notes: "craft your own custom blend from our single origin roasts"
mascot_file: build-a-bird-transparent.png
mascot_alt: "Build Your Own Blend mascot"
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}

<form class="hst-form" id="byob-blend-form" onsubmit="return false;">
  <!-- Component 1 -->
  <div class="byob-component-card">
    <div class="byob-component-head">Component 1 (Primary)</div>
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
  <div class="byob-component-card">
    <div class="byob-component-head">Component 2 (Secondary)</div>
    <div class="byob-component-grid">
      <div>
        <label class="hst-label" for="blend-origin-2">Single Origin Bean</label>
        <select id="blend-origin-2" class="hst-select byob-origin-input">
          <option value="">None (Single component)</option>
          {% for r in active_so %}
            <option value="{{ r.title }}"{% if forloop.index == 2 %} selected{% endif %}>{{ r.title }}</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-roast-2">Roast Level</label>
        <select id="blend-roast-2" class="hst-select byob-roast-input">
          {% for lvl_num in (1..5) %}
            {% assign lvl_data = site.data.roast_levels[lvl_num] %}
            <option value="{{ lvl_data.specialty }} ({{ lvl_data.layman }})"{% if lvl_num == 2 %} selected{% endif %}>{{ lvl_data.specialty }} ({{ lvl_data.layman }})</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-pct-2">Ratio (%)</label>
        <input type="number" id="blend-pct-2" class="hst-input byob-pct-input" min="0" max="100" value="30">
      </div>
    </div>
  </div>

  <!-- Component 3 -->
  <div class="byob-component-card">
    <div class="byob-component-head">Component 3 (Accent)</div>
    <div class="byob-component-grid">
      <div>
        <label class="hst-label" for="blend-origin-3">Single Origin Bean</label>
        <select id="blend-origin-3" class="hst-select byob-origin-input">
          <option value="">None (2 components only)</option>
          {% for r in active_so %}
            <option value="{{ r.title }}"{% if forloop.index == 3 %} selected{% endif %}>{{ r.title }}</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-roast-3">Roast Level</label>
        <select id="blend-roast-3" class="hst-select byob-roast-input">
          {% for lvl_num in (1..5) %}
            {% assign lvl_data = site.data.roast_levels[lvl_num] %}
            <option value="{{ lvl_data.specialty }} ({{ lvl_data.layman }})"{% if lvl_num == 4 %} selected{% endif %}>{{ lvl_data.specialty }} ({{ lvl_data.layman }})</option>
          {% endfor %}
        </select>
      </div>
      <div>
        <label class="hst-label" for="blend-pct-3">Ratio (%)</label>
        <input type="number" id="blend-pct-3" class="hst-input byob-pct-input" min="0" max="100" value="20">
      </div>
    </div>
  </div>

  <!-- Total Ratio Indicator -->
  <div id="byob-ratio-total-wrap" class="byob-ratio-status">
    Total Ratio: <strong id="byob-ratio-sum">100%</strong>
    <span id="byob-ratio-msg" class="byob-ratio-msg"></span>
  </div>

  <!-- Grind Style -->
  <div>
    <label class="hst-label" for="byob-blend-grind">Grind Style</label>
    <select id="byob-blend-grind" class="hst-select">
      {% for g in site.data.grind_levels %}
        <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
      {% endfor %}
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

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Blending Philosophy</button>
    <div class="hst-drawer-body">
      Every custom blend is roasted component-by-component to its optimal development curve before being blended and packed fresh in a dedicated 12oz bag.
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
    const pcts = [
      document.getElementById("blend-pct-1"),
      document.getElementById("blend-pct-2"),
      document.getElementById("blend-pct-3")
    ];
    const origins = [
      document.getElementById("blend-origin-1"),
      document.getElementById("blend-origin-2"),
      document.getElementById("blend-origin-3")
    ];
    const roasts = [
      document.getElementById("blend-roast-1"),
      document.getElementById("blend-roast-2"),
      document.getElementById("blend-roast-3")
    ];
    const grindSelect = document.getElementById("byob-blend-grind");
    const notesInput = document.getElementById("byob-blend-notes");
    const sumEl = document.getElementById("byob-ratio-sum");
    const msgEl = document.getElementById("byob-ratio-msg");
    const addBtn = document.getElementById("byob-blend-add-btn");

    function calcTotal() {
      let total = 0;
      for (let i = 0; i < 3; i++) {
        if (origins[i].value) {
          total += parseInt(pcts[i].value, 10) || 0;
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

    pcts.forEach(p => p.addEventListener("input", calcTotal));
    origins.forEach(o => o.addEventListener("change", calcTotal));
    calcTotal();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const total = calcTotal();
      if (total !== 100) {
        alert("The component percentages must add up to 100%.");
        return;
      }

      const components = [];
      for (let i = 0; i < 3; i++) {
        const origVal = origins[i].value;
        const pctVal = parseInt(pcts[i].value, 10) || 0;
        const roastVal = roasts[i].value;
        if (origVal && pctVal > 0) {
          components.push({
            name: origVal,
            roast: roastVal,
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
        size: "12oz",
        grind: grindSelect.value,
        price: 32,
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
