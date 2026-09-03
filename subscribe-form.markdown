---
layout: default
title: Subscribe
permalink: /subscribe/
---

<div class="roast-mv-divider"></div>

<h1 id="sub-title">Subscribe</h1>

<div id="sub-image-wrap" style="display: none; margin-bottom: 2rem;">
  <img id="sub-image" src="" alt="" style="max-height: 8rem; width: auto;">
</div>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="subscribe-form">
  <input type="hidden" name="entry.1935997805" id="sub-roast-hidden" value="">
  <input type="hidden" name="entry.903789519" id="sub-price-hidden" value="">
  <input type="hidden" name="entry.1261348961" value="Active">
  <input type="hidden" name="entry.1336119512" value="">

  <div class="order-field">
    <label for="sub-name">Name</label>
    <input id="sub-name" type="text" name="entry.1153405702" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="sub-email">Email</label>
    <input id="sub-email" type="email" name="entry.65766604" required autocomplete="email">
  </div>

  <div class="order-field">
    <label for="sub-size-select">Size</label>
    <select id="sub-size-select" name="entry.1606791078" class="subscribe-select" style="width: 100%;">
      <option value="12oz" selected>12oz</option>
      <option value="1lb">1lb</option>
      <option value="2lb">2lb</option>
      <option value="5lb">5lb</option>
    </select>
  </div>

  <div class="order-field">
    <label for="sub-grind-select">Grind</label>
    <select id="sub-grind-select" class="subscribe-select" style="width: 100%;">
      <option value="Whole Bean" selected>Whole Bean</option>
      <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
      <option value="Coarser — French Press">Coarser — French Press</option>
      <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
      <option value="Finer — Pour Over">Finer — Pour Over</option>
      <option value="Finest — Espresso">Finest — Espresso</option>
    </select>
  </div>

  <div class="order-field">
    <label for="sub-freq-select">Frequency</label>
    <select id="sub-freq-select" name="entry.2064801247" class="subscribe-select" style="width: 100%;">
      <option value="Every 2 weeks" selected>Every 2 weeks</option>
      <option value="Monthly">Monthly</option>
    </select>
  </div>

  <fieldset class="order-delivery">
    <legend>Delivery method</legend>
    <div class="pill-radios">
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Pickup" checked> Pickup</label>
      <label class="order-radio"><input type="radio" name="entry.1896226742" value="Hand delivery"> Hand delivery</label>
      <label class="order-radio order-radio--disabled"><input type="radio" name="entry.1896226742" value="Ship to me" disabled> Ship to me</label>
    </div>
    <p id="sub-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
    <p class="order-delivery-note">Shipping coming soon.</p>
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
  var params = new URLSearchParams(window.location.search);
  var roast = params.get('roast') || '';
  var hiddenInput = document.getElementById('sub-roast-hidden');
  var priceHiddenInput = document.getElementById('sub-price-hidden');
  var title = document.getElementById('sub-title');

  var subConfig = {
    {% for entry in site.data.subscriptions %}
    '{{ entry[0] }}': { sizes: {{ entry[1].sizes | jsonify }}, frequencies: {{ entry[1].frequencies | jsonify }}, prices: {{ entry[1].prices | default: "" | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var roastDescriptions = {
    {% for r in site.roasts %}
    '{{ r.slug }}': {{ r.description | default: "" | jsonify }}{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var imageWrap = document.getElementById('sub-image-wrap');
  var imageEl = document.getElementById('sub-image');
  var mascotMap = {
    {% for r in site.roasts %}
    '{{ r.slug }}': '{{ "/images/" | append: r.mascot_file | relative_url }}',
    {% endfor %}
    'migrator': '{{ "/images/audubon-arctic-tern-transparent.png" | relative_url }}',
    'wingshot-collective': '{{ "/images/audubon-crosshair-transparent.png" | relative_url }}',
    'fledglings': '{{ "/images/audubon-chicks-transparent.png" | relative_url }}',
    'murmurations': '{{ "/images/flock-transparent.png" | relative_url }}',
    'runts-rations': '{{ "/images/audubon-runt-transparent.png" | relative_url }}',
    'rubber-duck-club': '{{ "/images/audubon-rubber-duck-transparent.png" | relative_url }}'
  };

  hiddenInput.value = roast;
  if (roast) {
    title.textContent = 'Subscribe — ' + roast.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    var mascotSrc = mascotMap[roast];
    if (mascotSrc) {
      imageEl.src = mascotSrc;
      imageWrap.style.display = 'block';
    } else {
      imageWrap.style.display = 'none';
    }
  } else {
    imageWrap.style.display = 'none';
  }

  var disabledSubRoasts = {
    {% for r in site.roasts %}
    {% if r.status %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta.subscribable == false %}
    '{{ r.slug }}': {
      status: '{{ r.status }}',
      badge: '{{ r.status_badge | default: s_meta.badge }}',
      footnote: '{{ s_meta.sub_footnote | default: s_meta.footnote }}'
    },
      {% endif %}
    {% endif %}
    {% endfor %}
  };

  if (disabledSubRoasts[roast]) {
    form.style.display = 'none';
    var item = disabledSubRoasts[roast];
    var notice = document.createElement('div');
    notice.className = 'roast-status-bar roast-status-bar--' + item.status;
    notice.style.marginTop = '1.5rem';
    notice.innerHTML = '<span class="roast-status-bar-badge roast-status-bar-badge--' + item.status + '">' + item.badge + '</span><span class="roast-status-bar-text">' + item.footnote + '</span>';
    form.parentNode.insertBefore(notice, form);
    return;
  }

  var config = subConfig[roast];
  if (config) {
    var sizeSelect = document.getElementById('sub-size-select');
    if (sizeSelect && config.sizes) {
      sizeSelect.innerHTML = '';
      var qpSize = params.get('size');
      var selectedSizeIdx = 0;
      for (var si = 0; si < config.sizes.length; si++) {
        var sizeVal = config.sizes[si];
        var opt = document.createElement('option');
        opt.value = sizeVal;
        opt.textContent = sizeVal;
        sizeSelect.appendChild(opt);
        if (qpSize && qpSize === sizeVal) {
          selectedSizeIdx = si;
        }
      }
      if (sizeSelect.options.length > 0) {
        sizeSelect.selectedIndex = selectedSizeIdx;
      }
    }

    var freqSelect = document.getElementById('sub-freq-select');
    if (freqSelect && config.frequencies) {
      freqSelect.innerHTML = '';
      var qpFreq = params.get('frequency');
      var selectedFreqIdx = 0;
      for (var fi = 0; fi < config.frequencies.length; fi++) {
        var freqVal = config.frequencies[fi];
        var fOpt = document.createElement('option');
        fOpt.value = freqVal;
        fOpt.textContent = freqVal;
        freqSelect.appendChild(fOpt);
        if (qpFreq && qpFreq === freqVal) {
          selectedFreqIdx = fi;
        }
      }
      if (freqSelect.options.length > 0) {
        freqSelect.selectedIndex = selectedFreqIdx;
      }
    }

    var qpGrind = params.get('grind');
    if (qpGrind) {
      var grindSelect = document.getElementById('sub-grind-select');
      if (grindSelect) {
        for (var gr = 0; gr < grindSelect.options.length; gr++) {
          var optVal = grindSelect.options[gr].value.toLowerCase();
          if (optVal === qpGrind.toLowerCase() || optVal.indexOf(qpGrind.toLowerCase()) >= 0) {
            grindSelect.selectedIndex = gr;
            break;
          }
        }
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
    var grindSelect = document.getElementById('sub-grind-select');
    var grindVal = grindSelect ? grindSelect.value : 'Whole Bean';
    if (hiddenInput.value && hiddenInput.value.indexOf('Grind:') < 0) {
      hiddenInput.value = hiddenInput.value + ' (Grind: ' + grindVal + ')';
    }

    // Gather and set the price right before form submission to Google Forms
    if (config && config.prices && priceHiddenInput) {
      var selectedSize = form.querySelector('select[name="entry.1606791078"]');
      if (selectedSize && config.prices[selectedSize.value]) {
        priceHiddenInput.value = '$' + config.prices[selectedSize.value];
      }
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
