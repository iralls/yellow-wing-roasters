---
layout: detail-page
title: "BYOB — Bring Your Own Beans"
card_title: "BYOB"
subtitle: "Bring your own beans"
intro: "Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell us how you'd like it roasted, and we'll handle the rest."
slug: bring-your-own-beans
category: custom
data_roast: byob
order: 2
permalink: /roasts/bring-your-own-beans/
mascot_file: binocular-birds-transparent.png
mascot_alt: "Bring your own beans mascot"
descriptor: custom roast
overlay_notes: "send us your green beans and we'll roast them to perfection"
---

<h2 class="roasts-category">Approved Suppliers</h2>

<ul class="byob-suppliers">
  <li><a href="https://www.roastmasters.com/" target="_blank" rel="noopener">Roastmasters</a></li>
  <li><a href="https://burmancoffee.com/" target="_blank" rel="noopener">Burman Coffee</a></li>
  <li><a href="https://www.sweetmarias.com/" target="_blank" rel="noopener">Sweet Maria's</a></li>
</ul>

<h2 class="roasts-category">How it works</h2>

<ol style="text-align: left; display: inline-block; max-width: 600px; margin: 0 auto 1.5rem; padding-left: 2rem; line-height: 1.6;">
  <li>Browse one of the suppliers above and find a green bean you'd like roasted.</li>
  <li>Fill out the form below with the link, your preferred roast level, and quantity.</li>
  <li>We'll order the beans, roast them, and reach out when they're ready.</li>
</ol>

<h2 class="roasts-category">Configure Your Roast</h2>

<div class="byob-beans-form" id="byob-beans-form" style="max-width: 32rem; margin: 0 auto;">
  <div class="order-field">
    <label for="byob-link" class="roast-mv-meta-label">Link to green beans</label>
    <input id="byob-link" type="url" required placeholder="https://burmancoffee.com/... or https://sweetmarias.com/..." style="width: 100%; box-sizing: border-box;">
  </div>

  <div class="order-field roast-mv-center roast-mv-center--mt-md">
    <label for="byob-roast" class="roast-mv-meta-label">Roast level</label>
    <select id="byob-roast" class="subscribe-select" required style="min-width: 14rem;">
      <option value="" disabled selected>Choose a roast level</option>
      <option value="City (light)">City (light)</option>
      <option value="City+ (medium-light)">City+ (medium-light)</option>
      <option value="Full City (medium)">Full City (medium)</option>
      <option value="Full City+ (medium-dark)">Full City+ (medium-dark)</option>
      <option value="Vienna (dark)">Vienna (dark)</option>
    </select>
  </div>

  <div class="order-field roast-mv-center roast-mv-center--mt-md">
    <label for="byob-grind" class="roast-mv-meta-label">Grind level</label>
    <select id="byob-grind" class="subscribe-select" style="min-width: 14rem;">
      {% include grind-options.html %}
    </select>
  </div>

  <div class="order-field roast-mv-center roast-mv-center--mt-md">
    <label for="byob-qty" class="roast-mv-meta-label">Quantity (lbs)</label>
    <input id="byob-qty" type="number" min="1" max="10" value="1" required style="width: 5rem; display: block; margin: 0 auto; text-align: center;">
    <p class="order-delivery-note">Roasting loses ~15% of the bean weight on average.</p>
  </div>

  <div class="order-field roast-mv-center roast-mv-center--mt-md" style="max-width: 28rem; margin-left: auto; margin-right: auto;">
    <label for="byob-notes" class="roast-mv-meta-label">Roasting notes / instructions (optional)</label>
    <textarea id="byob-notes" rows="2" placeholder="Any preferences — first crack, second crack, specific development time, etc." style="width: 100%; box-sizing: border-box;"></textarea>
  </div>

  <div class="roast-mv-center roast-mv-center--mt-lg" style="text-align: center; margin-bottom: 2rem;">
    <p class="order-delivery-note" style="margin-bottom: 0.75rem; font-style: italic;">Green bean cost and roasting invoiced upon procurement.</p>
    <button type="button" class="add-to-order-btn" id="byob-beans-add-btn">Add to Cart</button>
  </div>
</div>

<script src="{{ '/js/byob-beans.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initBYOBBeans({
    mascot: {{ page.mascot_file | jsonify }}
  });
</script>
