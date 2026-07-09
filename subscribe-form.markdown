---
layout: default
title: Subscribe
permalink: /subscribe/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-center">
  <h1 class="roast-mv-title" id="sub-title">Subscribe</h1>
</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="subscribe-form">
  <input type="hidden" name="entry.1935997805" id="sub-roast-hidden" value="">

  <div class="order-field">
    <label for="sub-name">Name</label>
    <input id="sub-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="sub-email">Email</label>
    <input id="sub-email" type="email" name="entry.65766604" required autocomplete="email">
  </div>

  <div class="order-field">
    <label>Size</label>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="12oz" checked> 12oz</label>
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="2lb"> 2lb</label>
      <label class="order-radio"><input type="radio" name="entry.1606791078" value="5lb"> 5lb</label>
    </div>
  </div>

  <div class="order-field">
    <label>Frequency</label>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="entry.2064801247" value="Every 2 weeks" checked> Every 2 weeks</label>
      <label class="order-radio"><input type="radio" name="entry.2064801247" value="Monthly"> Monthly</label>
    </div>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Ship to me"> Ship to me</label>
    </div>
    <p id="sub-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
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

</div>

<script>
(function () {
  var form = document.getElementById('subscribe-form');
  var params = new URLSearchParams(window.location.search);
  var roast = params.get('roast') || '';
  var hiddenInput = document.getElementById('sub-roast-hidden');
  var title = document.getElementById('sub-title');

  var subConfig = {
    {% for entry in site.data.subscriptions %}
    '{{ entry[0] }}': { sizes: {{ entry[1].sizes | jsonify }}, frequencies: {{ entry[1].frequencies | jsonify }}, prices: {{ entry[1].prices | default: "" | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  hiddenInput.value = roast;
  if (roast) {
    title.textContent = 'Subscribe — ' + roast.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  var config = subConfig[roast];
  if (config) {
    var sizeRadios = form.querySelectorAll('input[name="entry.1606791078"]');
    var firstSize = null;
    for (var si = 0; si < sizeRadios.length; si++) {
      var sizePill = sizeRadios[si].closest('.order-radio');
      var sizeVal = sizeRadios[si].value;
      if (config.sizes.indexOf(sizeVal) >= 0) {
        sizePill.style.display = '';
        if (config.prices && config.prices[sizeVal]) {
          sizePill.childNodes[sizePill.childNodes.length - 1].textContent = ' ' + sizeVal + ' — $' + config.prices[sizeVal];
        }
        if (!firstSize) firstSize = sizeRadios[si];
      } else {
        sizePill.style.display = 'none';
        sizeRadios[si].checked = false;
      }
    }
    var qpSize = params.get('size');
    if (qpSize) {
      for (var qs = 0; qs < sizeRadios.length; qs++) {
        if (sizeRadios[qs].value === qpSize) { sizeRadios[qs].checked = true; firstSize = null; break; }
      }
    }
    if (firstSize) firstSize.checked = true;

    var freqRadios = form.querySelectorAll('input[name="entry.2064801247"]');
    var firstFreq = null;
    for (var fi = 0; fi < freqRadios.length; fi++) {
      var freqPill = freqRadios[fi].closest('.order-radio');
      if (config.frequencies.indexOf(freqRadios[fi].value) >= 0) {
        freqPill.style.display = '';
        if (!firstFreq) firstFreq = freqRadios[fi];
      } else {
        freqPill.style.display = 'none';
        freqRadios[fi].checked = false;
      }
    }
    var qpFreq = params.get('frequency');
    if (qpFreq) {
      for (var qf = 0; qf < freqRadios.length; qf++) {
        if (freqRadios[qf].value === qpFreq) { freqRadios[qf].checked = true; firstFreq = null; break; }
      }
    }
    if (firstFreq) firstFreq.checked = true;
  }

  var deliveryRadios = form.querySelectorAll('input[name="entry.1896226742"]');
  var addressFields = document.getElementById('sub-address-fields');
  var deliveryNote = document.getElementById('sub-delivery-note');
  for (var di = 0; di < deliveryRadios.length; di++) {
    deliveryRadios[di].addEventListener('change', function () {
      var v = this.value;
      addressFields.style.display = (v === 'Pickup') ? 'none' : '';
      deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';
    });
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
