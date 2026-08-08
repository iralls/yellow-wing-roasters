---
layout: default
title: "BYOB — Bring Your Own Beans"
permalink: /roasts/byob/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">BYOB</h1>
</div>

<p class="roast-mv-tasting"><em>Bring Your Own Beans</em><br>Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell us how you'd like it roasted, and we'll handle the rest.</p>

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

<form action="https://docs.google.com/forms/d/e/1FAIpQLSfClX9h3_082mkOk2-WhWsoQgZZ_loOwZ6eGRdZ9d6PSdFzjw/formResponse" method="POST" class="order-form" id="byob-form" style="text-align: left; margin: 2rem auto; max-width: 40rem;">

  <div class="order-field">
    <label for="byob-name">Name</label>
    <input id="byob-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="byob-email">Email</label>
    <input id="byob-email" type="email" name="entry.40149380" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="byob-link">Link to green beans</label>
    <input id="byob-link" type="url" name="entry.1935997805" required placeholder="https://burmancoffee.com/...">
  </div>

  <div class="order-field">
    <label for="byob-roast">Roast level</label>
    <select id="byob-roast" name="entry.1076774005" class="subscribe-select" required>
      <option value="" disabled selected>Choose a roast level</option>
      <option value="City (light)">City (light)</option>
      <option value="City+ (medium-light)">City+ (medium-light)</option>
      <option value="Full City (medium)">Full City (medium)</option>
      <option value="Full City+ (medium-dark)">Full City+ (medium-dark)</option>
      <option value="Vienna (dark)">Vienna (dark)</option>
      <option value="Surprise me">Surprise me</option>
    </select>
  </div>

  <div class="order-field">
    <label for="byob-grind">Grind level</label>
    <select id="byob-grind" class="subscribe-select">
      <option value="Whole Bean" selected>Whole Bean</option>
      <option value="Drip / Filter">Drip / Filter</option>
      <option value="Espresso">Espresso</option>
      <option value="French Press">French Press</option>
      <option value="Pour Over">Pour Over</option>
      <option value="Cold Brew">Cold Brew</option>
    </select>
  </div>

  <div class="order-field">
    <label for="byob-qty">Quantity (lbs of green beans to order)</label>
    <input id="byob-qty" type="number" name="entry.1351521045" min="1" max="10" value="1" required>
    <p class="order-delivery-note">Roasting loses ~15% of the bean weight on average.</p>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
    <label class="order-radio order-radio--disabled"><input type="radio" name="entry.1896226742" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p id="byob-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
    <p class="order-delivery-note">Shipping coming soon.</p>
  </fieldset>

  <div id="byob-shipping" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="byob-address">Street address</label>
      <input id="byob-address" type="text" name="entry.148046999" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="byob-city">City</label>
      <input id="byob-city" type="text" name="entry.1534670804" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="byob-state">State</label>
        <input id="byob-state" type="text" name="entry.414179858" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="byob-zip">ZIP</label>
        <input id="byob-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field">
    <label for="byob-notes">Notes (optional)</label>
    <textarea id="byob-notes" name="entry.1381358427" rows="3" placeholder="Any preferences — first crack, second crack, specific development time, etc."></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Submit BYOB order</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script>
(function () {
  var form = document.getElementById('byob-form');
  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
  var addressFields = document.getElementById('byob-shipping');
  var deliveryNote = document.getElementById('byob-delivery-note');
  for (var di = 0; di < deliveryRadios.length; di++) {
    deliveryRadios[di].addEventListener('change', function () {
      var v = this.value;
      addressFields.style.display = (v === 'Pickup') ? 'none' : '';
      deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
    });
  }

  var iframe = document.createElement('iframe');
  iframe.name = 'byob-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'byob-submit-frame';

  form.addEventListener('submit', function () {
    var grindEl = document.getElementById('byob-grind');
    var notesEl = document.getElementById('byob-notes');
    if (grindEl && notesEl) {
      var currentNotes = notesEl.value.trim();
      var grindPrefix = '[Grind: ' + grindEl.value + ']';
      notesEl.value = currentNotes ? grindPrefix + ' ' + currentNotes : grindPrefix;
    }

    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }
    if (submitBtn) submitBtn.disabled = true;
    iframe.onload = function () {
      window.location.href = '{{ "/thanks/" | relative_url }}';
    };
  });
})();
</script>

</div>
