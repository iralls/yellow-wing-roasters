---
layout: default
title: "BYOB — Bring Your Own Beans"
permalink: /roasts/byob/
---

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-byob-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

# BYOB

*Bring Your Own Beans*

Have a specific green coffee you've been eyeing? Pick any green (unroasted) bean from one of these suppliers, tell me how you'd like it roasted, and I'll handle the rest.

<h2 class="roasts-category">Approved Suppliers</h2>

<ul class="byob-suppliers">
  <li><a href="https://www.roastmasters.com/" target="_blank" rel="noopener">Roastmasters</a></li>
  <li><a href="https://burmancoffee.com/" target="_blank" rel="noopener">Burman Coffee</a></li>
  <li><a href="https://www.sweetmarias.com/" target="_blank" rel="noopener">Sweet Maria's</a></li>
</ul>

<h2 class="roasts-category">How it works</h2>

1. Browse one of the suppliers above and find a green bean you'd like roasted.
2. Fill out the form below with the link, your preferred roast level, and quantity.
3. I'll order the beans, roast them, and reach out when they're ready.

<h2 class="roasts-category">Place a BYOB Order</h2>

<form action="https://formspree.io/f/mojraaql" method="POST" class="order-form" id="byob-form">
  <input type="hidden" name="_subject" value="New BYOB order">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="order-gotcha">

  <div class="order-field">
    <label for="byob-name">Name</label>
    <input id="byob-name" type="text" name="name" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="byob-email">Email</label>
    <input id="byob-email" type="email" name="email" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="byob-link">Link to green beans</label>
    <input id="byob-link" type="url" name="bean_link" required placeholder="https://burmancoffee.com/...">
  </div>

  <div class="order-field">
    <label for="byob-roast">Roast level</label>
    <select id="byob-roast" name="roast_level" required>
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
    <label for="byob-qty">Quantity (lbs of green beans to order)</label>
    <input id="byob-qty" type="number" name="quantity_lbs" min="1" max="10" value="1" required>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
    <label class="order-radio"><input type="radio" name="delivery" value="Pickup" checked onchange="document.getElementById('byob-shipping').style.display='none'; document.getElementById('byob-delivery-note').style.display='none';"> Pickup</label>
    <label class="order-radio"><input type="radio" name="delivery" value="Hand delivery" onchange="document.getElementById('byob-shipping').style.display=''; document.getElementById('byob-delivery-note').style.display='';"> Hand delivery</label>
    <label class="order-radio order-radio--disabled"><input type="radio" name="delivery" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p id="byob-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
    <p class="order-delivery-note">Shipping coming soon.</p>
  </fieldset>

  <div id="byob-shipping" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="byob-address">Street address</label>
      <input id="byob-address" type="text" name="address" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="byob-city">City</label>
      <input id="byob-city" type="text" name="city" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="byob-state">State</label>
        <input id="byob-state" type="text" name="state" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="byob-zip">ZIP</label>
        <input id="byob-zip" type="text" name="zip" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field">
    <label for="byob-notes">Notes (optional)</label>
    <textarea id="byob-notes" name="notes" rows="3" placeholder="Any preferences — first crack, second crack, specific development time, etc."></textarea>
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }
    if (submitBtn) submitBtn.disabled = true;

    var data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      return res.json().then(function (body) { return { ok: res.ok, body: body }; });
    }).then(function (result) {
      if (result.ok) {
        window.location.href = '{{ "/thanks/" | relative_url }}';
      } else {
        var msg = 'Something went wrong. Please try again.';
        if (result.body && result.body.errors && result.body.errors.length) {
          msg = result.body.errors.map(function (er) { return er.message; }).join(' ');
        }
        if (status) {
          status.textContent = msg;
          status.className = 'order-status order-status-error';
        }
        if (submitBtn) submitBtn.disabled = false;
      }
    }).catch(function () {
      if (status) {
        status.textContent = 'Network error. Check your connection and try again.';
        status.className = 'order-status order-status-error';
      }
      if (submitBtn) submitBtn.disabled = false;
    });
  });
})();
</script>
