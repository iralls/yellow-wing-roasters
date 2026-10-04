---
layout: default
title: "BYOB — Bring Your Own Beans"
card_title: "BYOB"
subtitle: "Bring your own beans"
slug: bring-your-own-beans
data_roast: byob
order: 2
permalink: /roasts/bring-your-own-beans/
mascot_file: binocular-birds-transparent.png
mascot_alt: "Bring your own beans mascot"
layman: Custom
descriptor: custom roast
overlay_notes: "send us your green beans and we'll roast them to perfection"
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/binocular-birds-transparent.png' | relative_url }}" alt="Bring Your Own Beans" class="roast-mv-bird" aria-hidden="true" fetchpriority="high" decoding="async">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">BYOB</h1>
</div>
<div class="roast-mv-subtitle">Bring Your Own Beans</div>

<p class="roast-mv-tasting">Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell us how you'd like it roasted, and we'll handle the rest.</p>

<div class="roast-mv-divider"></div>

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

<h2 class="roasts-category">Place a BYOB Order</h2>

<form action="{{ site.google_forms.byob_beans.url }}" method="POST" class="order-form" id="byob-form">

  <div class="order-field">
    <label for="byob-name" class="roast-mv-meta-label">Name</label>
    <input id="byob-name" type="text" name="{{ site.google_forms.byob_beans.entries.name }}" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="byob-email" class="roast-mv-meta-label">Email</label>
    <input id="byob-email" type="email" name="{{ site.google_forms.byob_beans.entries.email }}" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="byob-link" class="roast-mv-meta-label">Link to green beans</label>
    <input id="byob-link" type="url" name="{{ site.google_forms.byob_beans.entries.link }}" required placeholder="https://burmancoffee.com/...">
  </div>

  <div class="order-field roast-mv-center">
    <label for="byob-roast" class="roast-mv-meta-label">Roast level</label>
    <select id="byob-roast" name="{{ site.google_forms.byob_beans.entries.roast }}" class="subscribe-select" required>
      <option value="" disabled selected>Choose a roast level</option>
      <option value="City (light)">City (light)</option>
      <option value="City+ (medium-light)">City+ (medium-light)</option>
      <option value="Full City (medium)">Full City (medium)</option>
      <option value="Full City+ (medium-dark)">Full City+ (medium-dark)</option>
      <option value="Vienna (dark)">Vienna (dark)</option>
      <option value="Surprise me">Surprise me</option>
    </select>
  </div>

  <div class="order-field roast-mv-center">
    <label for="byob-grind" class="roast-mv-meta-label">Grind level</label>
    <select id="byob-grind" class="subscribe-select">
      {% include grind-options.html %}
    </select>
  </div>

  <div class="order-field roast-mv-center">
    <label for="byob-qty" class="roast-mv-meta-label">lbs</label>
    <input id="byob-qty" type="number" name="{{ site.google_forms.byob_beans.entries.qty }}" min="1" max="10" value="1" required style="width: 5rem; display: block; margin: 0 auto; text-align: center;">
    <p class="order-delivery-note">Roasting loses ~15% of the bean weight on average.</p>
  </div>

  <fieldset class="order-delivery">
    <legend class="roast-mv-meta-label">Delivery method</legend>
    <div class="pill-radios">
    <label class="order-radio"><input type="radio" name="{{ site.google_forms.byob_beans.entries.delivery }}" value="Pickup" checked> Pickup</label>
    <label class="order-radio"><input type="radio" name="{{ site.google_forms.byob_beans.entries.delivery }}" value="Hand delivery"> Hand delivery</label>
    </div>
    <p id="byob-delivery-note" class="order-delivery-note" data-pickup-msg="Please specify in the notes how you want to coordinate pickup." data-delivery-msg="Available in {{ site.local_delivery_towns | join: ', ' }}.">Please specify in the notes how you want to coordinate pickup.</p>
  </fieldset>

  <div id="byob-shipping" class="order-shipping" style="display:none; text-align: left;">
    <div class="order-field">
      <label for="byob-address" class="roast-mv-meta-label">Street address</label>
      <input id="byob-address" type="text" name="{{ site.google_forms.byob_beans.entries.address }}" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="byob-city" class="roast-mv-meta-label">City</label>
      <input id="byob-city" type="text" name="{{ site.google_forms.byob_beans.entries.city }}" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="byob-state" class="roast-mv-meta-label">State</label>
        <select id="byob-state" name="{{ site.google_forms.byob_beans.entries.state }}" autocomplete="address-level1">
          {% include state-options.html %}
        </select>
      </div>
      <div class="order-field">
        <label for="byob-zip" class="roast-mv-meta-label">ZIP</label>
        <input id="byob-zip" type="text" name="{{ site.google_forms.byob_beans.entries.zip }}" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field">
    <label for="byob-notes" class="roast-mv-meta-label">Notes (optional)</label>
    <textarea id="byob-notes" name="{{ site.google_forms.byob_beans.entries.notes }}" rows="3" placeholder="Any preferences — first crack, second crack, specific development time, etc."></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Submit BYOB order</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script src="{{ '/js/form-submit.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initBYOBForm({ thanksUrl: '{{ "/thanks/" | relative_url }}' });
</script>


</div>
