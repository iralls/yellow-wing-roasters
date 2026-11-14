---
layout: menu-item
title: "BYOB — Bring Your Own Beans"
card_title: "BYOB"
subtitle: "Bring your own beans"
intro: "Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell us how you'd like it roasted, and we'll handle the rest."
slug: bring-your-own-beans
category: custom
price: "Custom Quote"
data_roast: byob
order: 2
permalink: /roasts/bring-your-own-beans/
mascot_file: binocular-birds-transparent.png
mascot_alt: "Bring your own beans mascot"
descriptor: Bring Your Own Beans
overlay_notes: "send us your green beans and we'll roast them to perfection"
---

<form class="hst-form" id="byob-beans-form" onsubmit="return false;">
  <div>
    <label class="hst-label" for="byob-link">Link to Green Beans</label>
    <input id="byob-link" type="url" class="hst-input" required placeholder="https://burmancoffee.com/... or https://sweetmarias.com/...">
  </div>

  <div>
    <label class="hst-label" for="byob-roast">Target Roast Level</label>
    <select id="byob-roast" class="hst-select" required>
      <option value="" disabled selected>Choose a roast level</option>
      <option value="City (light)">City (light)</option>
      <option value="City+ (medium-light)">City+ (medium-light)</option>
      <option value="Full City (medium)">Full City (medium)</option>
      <option value="Full City+ (medium-dark)">Full City+ (medium-dark)</option>
      <option value="Vienna (dark)">Vienna (dark)</option>
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-grind">Grind Style</label>
    <select id="byob-grind" class="hst-select">
      {% for g in site.data.grind_levels %}
        <option value="{{ g.value }}"{% if g.default %} selected{% endif %}>{{ g.label }}</option>
      {% endfor %}
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-qty">Quantity (lbs)</label>
    <input id="byob-qty" type="number" class="hst-input" min="1" max="10" value="1" required>
    <span style="display: block; font-size: 0.76rem; color: var(--hst-muted); margin-top: 0.35rem;">Roasting loses ~15% of the bean weight on average.</span>
  </div>

  <div>
    <label class="hst-label" for="byob-notes">Roasting notes / preferences (optional)</label>
    <textarea id="byob-notes" class="hst-textarea" rows="2" placeholder="Any preferences — first crack, second crack, development time, etc."></textarea>
  </div>

  <button type="submit" class="hst-btn" id="byob-beans-add-btn">
    Add to Cart
  </button>
</form>

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Approved Suppliers</button>
    <div class="hst-drawer-body">
      <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.8;">
        <li><a href="https://www.roastmasters.com/" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Roastmasters</a></li>
        <li><a href="https://burmancoffee.com/" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Burman Coffee</a></li>
        <li><a href="https://www.sweetmarias.com/" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Sweet Maria's</a></li>
      </ul>
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">How It Works</button>
    <div class="hst-drawer-body">
      <ol style="margin: 0; padding-left: 1.2rem; line-height: 1.7;">
        <li style="margin-bottom: 0.4rem;">Browse green coffee beans from any of our approved suppliers above.</li>
        <li style="margin-bottom: 0.4rem;">Paste the direct link, specify your target roast profile, and choose quantity.</li>
        <li>We procure the lot, custom-fire the batch, and prepare it freshly rested.</li>
      </ol>
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Service Specifications</button>
    <div class="hst-drawer-body">
      <strong>Service Type:</strong> Green Bean Procurement &amp; Roasting<br>
      <strong>Batch Size:</strong> 1 &ndash; 10 lbs per order<br>
      <strong>Roast Spectrum:</strong> City (light) to Vienna (dark)<br>
      <strong>Moisture Loss:</strong> ~15% weight loss during roast<br>
      <strong>Billing:</strong> Green coffee cost + roasting invoiced upon procurement
    </div>
  </div>
</div>

<script>
  (function() {
    const form = document.getElementById("byob-beans-form");
    const linkInput = document.getElementById("byob-link");
    const roastSelect = document.getElementById("byob-roast");
    const grindSelect = document.getElementById("byob-grind");
    const qtyInput = document.getElementById("byob-qty");
    const notesTextarea = document.getElementById("byob-notes");
    const addBtn = document.getElementById("byob-beans-add-btn");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const linkVal = linkInput.value.trim();
        if (!linkVal) {
          linkInput.reportValidity();
          return;
        }
        const roastVal = roastSelect.value;
        if (!roastVal) {
          roastSelect.reportValidity();
          return;
        }
        const qtyVal = parseInt(qtyInput.value, 10);

        const item = {
          type: "custom",
          slug: "bring-your-own-beans",
          title: "Bring Your Own Beans",
          subtitle: linkVal,
          size: qtyVal + (qtyVal === 1 ? " lb" : " lbs"),
          roastLevel: roastVal,
          grind: grindSelect.value,
          price: 0,
          mascot: {{ page.mascot_file | jsonify }},
          notes: notesTextarea.value.trim()
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
          console.error("Failed to add Bring Your Own Beans to cart:", item);
        }
      });
    }
  })();
</script>
