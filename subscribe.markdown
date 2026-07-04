---
layout: default
title: Subscribe
permalink: /subscribe/
---

# Subscribe

Set up a recurring delivery of your favorite roast.

<form action="https://docs.google.com/forms/d/e/1FAIpQLSeZfODHkbOWxBsESZ1w-RiALQTnpZdR3sNUmHuc6Y-PVjRA_Q/formResponse" method="POST" class="order-form" id="subscribe-form">

  <div class="order-field">
    <label for="sub-name">Name</label>
    <input id="sub-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="sub-email">Email</label>
    <input id="sub-email" type="email" name="entry.65766604" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="sub-roast">Roast</label>
    <select id="sub-roast" name="entry.1935997805" required>
      <option value="" disabled selected>Choose a roast</option>
      {% assign roasts = site.roasts | sort: "order" %}
      {% for r in roasts %}{% unless r.coming_soon or r.category == "ugly duckling" or r.category == "pack" %}<option value="{{ r.title }}" data-slug="{{ r.slug }}">{{ r.title }}</option>
      {% endunless %}{% endfor %}
    </select>
  </div>

  <div class="order-field">
    <label>Size</label>
    <div class="order-radio-group">
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="12oz" checked> 12oz</label>
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="2lb"> 2lb</label>
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="5lb"> 5lb</label>
    </div>
  </div>

  <div class="order-field">
    <label>Frequency</label>
    <div class="order-radio-group">
      <label class="order-radio"><input type="radio" name="entry.2064801247" value="Every 2 weeks" checked> Every 2 weeks</label>
      <label class="order-radio"><input type="radio" name="entry.2064801247" value="Monthly"> Monthly</label>
    </div>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup (we'll coordinate)</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Ship to me"> Ship to me</label>
    <p id="sub-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, Branford, Madison, and Durham.</p>
  </fieldset>

  <div id="sub-address-fields" class="order-shipping" style="display:none;">
    <div class="order-field">
      <label for="sub-address">Street address</label>
      <input id="sub-address" type="text" name="entry.148046999" autocomplete="street-address">
    </div>
    <div class="order-field">
      <label for="sub-city">City</label>
      <input id="sub-city" type="text" name="entry.1534670804" autocomplete="address-level2">
    </div>
    <div class="order-field-row">
      <div class="order-field">
        <label for="sub-state">State</label>
        <input id="sub-state" type="text" name="entry.414179858" autocomplete="address-level1">
      </div>
      <div class="order-field">
        <label for="sub-zip">ZIP</label>
        <input id="sub-zip" type="text" name="entry.1472936948" autocomplete="postal-code">
      </div>
    </div>
  </div>

  <div class="order-field">
    <label for="sub-notes">Notes (optional)</label>
    <textarea id="sub-notes" name="entry.1381358427" rows="3"></textarea>
  </div>

  <div class="order-actions">
    <button type="submit" class="order-submit">Subscribe</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script>
(function () {
  var form = document.getElementById('subscribe-form');
  var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
  var addressFields = document.getElementById('sub-address-fields');
  var deliveryNote = document.getElementById('sub-delivery-note');

  for (var i = 0; i < deliveryRadios.length; i++) {
    deliveryRadios[i].addEventListener('change', function () {
      var v = this.value;
      addressFields.style.display = (v === 'Pickup') ? 'none' : '';
      deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
    });
  }

  var params = new URLSearchParams(window.location.search);
  var qpRoast = params.get('roast');
  if (qpRoast) {
    var select = document.getElementById('sub-roast');
    for (var j = 0; j < select.options.length; j++) {
      if (select.options[j].getAttribute('data-slug') === qpRoast) {
        select.selectedIndex = j;
        break;
      }
    }
  }

  var iframe = document.createElement('iframe');
  iframe.name = 'sub-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'sub-submit-frame';

  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  form.addEventListener('submit', function () {
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(function () {
      window.location.href = '{{ "/thanks/" | relative_url }}';
    }, 1000);
  });
})();
</script>
