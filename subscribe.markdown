---
layout: default
title: Subscribe
permalink: /subscribe/
---

# Subscribe

<p id="sub-intro">Set up a recurring delivery of your favorite roast. Pick a bean below to get started.</p>

{% assign roasts = site.roasts | sort: "order" %}

<div class="sub-picker">

  {% for r in roasts %}
    {% unless r.coming_soon or r.category == "ugly duckling" or r.category == "pack" or r.category == "byob" %}{% if r.frequencies and r.frequencies.size == 0 %}{% continue %}{% endif %}
  <div class="sub-card" data-roast="{{ r.title }}" data-slug="{{ r.slug }}" data-mascot="{{ r.mascot_file }}" data-frequencies="{% if r.frequencies %}{{ r.frequencies | join: ',' }}{% else %}Every 2 weeks,Monthly{% endif %}">
    <div class="roasts-entry-visual">
      {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="" class="roasts-entry-mascot">{% endif %}
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">{{ r.title }}</div>
      {% if r.roast_dots %}<span class="roasts-entry-level"><span class="roast-dots roast-dots-sm"><span class="roast-dot{% if r.roast_dots >= 1 %} roast-dot-1{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 2 %} roast-dot-2{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 3 %} roast-dot-3{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 4 %} roast-dot-4{% endif %}"></span><span class="roast-dot{% if r.roast_dots >= 5 %} roast-dot-5{% endif %}"></span></span></span>{% endif %}
      {% if r.tasting_notes %}<div class="roasts-entry-notes">{{ r.tasting_notes | replace: ", ", " · " }}</div>{% endif %}
      {% if r.brewing_method %}<div class="roasts-entry-brew">{{ r.brewing_method }}</div>{% endif %}
    </div>
  </div>
    {% endunless %}
  {% endfor %}

  <div class="sub-card" data-roast="Rotating Single Origin" data-slug="rotating-single-origin" data-mascot="audubon-feather-transparent.png" data-frequencies="Monthly">
    <div class="roasts-entry-visual">
      <img src="{{ '/images/audubon-feather-transparent.png' | relative_url }}" alt="" class="roasts-entry-mascot">
    </div>
    <div class="roasts-entry-info">
      <div class="roasts-entry-title">Rotating Single Origin</div>
      <div class="roasts-entry-notes">A new single origin each delivery</div>
      <div class="roasts-entry-brew">We pick, you enjoy</div>
    </div>
  </div>

</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form sub-form" id="subscribe-form" style="display:none;">
  <input type="hidden" name="entry.1935997805" id="sub-roast-hidden" value="">

  <div class="sub-selected-summary" id="sub-selected-summary"></div>

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
    <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup (we'll coordinate)</label>
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
    <button type="button" class="order-clear" id="sub-change-btn">Change roast</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script>
(function () {
  var form = document.getElementById('subscribe-form');
  var cards = document.querySelectorAll('.sub-card');
  var hiddenInput = document.getElementById('sub-roast-hidden');
  var summary = document.getElementById('sub-selected-summary');
  var picker = document.querySelector('.sub-picker');
  var intro = document.getElementById('sub-intro');

  var params = new URLSearchParams(window.location.search);

  function selectRoast(roast, slug, mascot, frequencies) {
    hiddenInput.value = roast;
    summary.innerHTML = '<div style="text-align:center;">' + roast + (mascot ? '<br><img src="/images/' + mascot + '" alt="" style="height:4rem; margin-top:0.5rem;">' : '') + '</div>';
    intro.textContent = 'Subscribing to ' + roast + '. Fill out the details below.';
    picker.style.display = 'none';
    form.style.display = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });

    params.set('roast', slug);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname + '?' + params.toString());
    }

    var allowed = frequencies ? frequencies.split(',') : ['Every 2 weeks', 'Monthly'];
    var freqRadios = form.querySelectorAll('input[name="entry.2064801247"]');
    var firstVisible = null;
    for (var f = 0; f < freqRadios.length; f++) {
      var pill = freqRadios[f].closest('.order-radio');
      if (allowed.indexOf(freqRadios[f].value) >= 0) {
        pill.style.display = '';
        if (!firstVisible) firstVisible = freqRadios[f];
      } else {
        pill.style.display = 'none';
        freqRadios[f].checked = false;
      }
    }
    if (firstVisible && !form.querySelector('input[name="entry.2064801247"]:checked')) {
      firstVisible.checked = true;
    }

    var size = params.get('size');
    if (size) {
      var sizeRadios = form.querySelectorAll('input[name="entry.1606791078"]');
      for (var s = 0; s < sizeRadios.length; s++) {
        if (sizeRadios[s].value === size) { sizeRadios[s].checked = true; break; }
      }
    }

    var freq = params.get('frequency');
    if (freq) {
      for (var fi = 0; fi < freqRadios.length; fi++) {
        if (freqRadios[fi].value === freq) { freqRadios[fi].checked = true; break; }
      }
    }
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function () {
      selectRoast(this.getAttribute('data-roast'), this.getAttribute('data-slug'), this.getAttribute('data-mascot'), this.getAttribute('data-frequencies'));
    });
  }

  document.getElementById('sub-change-btn').addEventListener('click', function () {
    picker.style.display = '';
    form.style.display = 'none';
    hiddenInput.value = '';
    intro.textContent = 'Set up a recurring delivery of your favorite roast. Pick a bean below to get started.';
  });

  var qpRoast = params.get('roast');
  if (qpRoast) {
    for (var j = 0; j < cards.length; j++) {
      if (cards[j].getAttribute('data-slug') === qpRoast) {
        selectRoast(cards[j].getAttribute('data-roast'), qpRoast, cards[j].getAttribute('data-mascot'), cards[j].getAttribute('data-frequencies'));
        break;
      }
    }
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
