---
layout: default
title: Gift Coffee
permalink: /gift/
---

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-raven-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title" id="gift-page-title">Corvid care packages</h1>
</div>

<p class="category-intro" style="text-align: center; margin-top: -0.25rem; margin-bottom: 2.25rem;">Send freshly roasted coffees, recurring gift subscriptions, or digital gift cards directly to their door.</p>

<form action="https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse" method="POST" class="order-form" id="gift-form">
  <!-- Dynamic Name Hidden Inputs -->
  <input type="hidden" id="gift-roast-hidden" value="">
  <input type="hidden" id="gift-price-hidden" value="">
  <input type="hidden" id="gift-status-hidden" value="Active">
  <input type="hidden" id="gift-frequency-hidden" value="Monthly">
  <input type="hidden" id="gift-delivery-hidden" value="Hand delivery">
  <input type="hidden" id="gift-notes-hidden" value="">
  <input type="hidden" id="gift-size-hidden" value="12oz">
  <input type="hidden" id="gift-card-amount-hidden" value="">
  <input type="hidden" id="gift-code-hidden" value="">

  <div class="order-field" style="margin-bottom: 2rem;">
    <label style="text-align: center; margin-bottom: 0.85rem; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7060; font-weight: 700;">Choose Gift Type</label>

    <div style="position: absolute; opacity: 0; pointer-events: none; width: 1px; height: 1px;">
      <input type="radio" name="gift-type" id="gift-type-direct" value="direct" checked>
      <input type="radio" name="gift-type" id="gift-type-code" value="code">
    </div>

    <div class="gift-type-grid" role="radiogroup" aria-label="Gift Type">
      <!-- Card 1: Subscription -->
      <div class="gift-type-card is-selected" data-value="direct" role="radio" aria-checked="true" tabindex="0">
        <div class="roasts-entry-visual">
          <span class="gift-type-badge">&#10003; Selected</span>
          <img src="{{ '/images/mailbox-transparent.png' | relative_url }}" alt="Subscription" class="roasts-entry-mascot">
          <div class="roasts-entry-overlay">
            <div class="roasts-entry-overlay-notes">a recurring subscription or fresh single bag delivered directly to their door</div>
            <div class="roasts-entry-overlay-brewing">Physical Delivery</div>
          </div>
        </div>
        <div class="roasts-entry-info">
          <div class="roasts-entry-header">
            <div class="roasts-entry-main">
              <div class="roasts-entry-title">Subscription</div>
              <div class="roasts-entry-subtitle">Direct Delivery</div>
            </div>
            <div class="roasts-entry-meta">
              <div class="roasts-entry-layman">Physical</div>
              <div class="roasts-entry-descriptor">ships to their door</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Digital Gift Card -->
      <div class="gift-type-card" data-value="code" role="radio" aria-checked="false" tabindex="0">
        <div class="roasts-entry-visual">
          <span class="gift-type-badge">&#10003; Selected</span>
          <img src="{{ '/images/qr-code2-full-transparent.png' | relative_url }}" alt="Digital Gift Card" class="roasts-entry-mascot">
          <div class="roasts-entry-overlay">
            <div class="roasts-entry-overlay-notes">an instant prepaid digital gift code sent via email for them to pick any roasts</div>
            <div class="roasts-entry-overlay-brewing">Email Delivery</div>
          </div>
        </div>
        <div class="roasts-entry-info">
          <div class="roasts-entry-header">
            <div class="roasts-entry-main">
              <div class="roasts-entry-title">Digital Gift Card</div>
              <div class="roasts-entry-subtitle">Prepaid Code</div>
            </div>
            <div class="roasts-entry-meta">
              <div class="roasts-entry-layman">Digital</div>
              <div class="roasts-entry-descriptor">sent via email</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Direct Gifting Fields -->
  <div id="direct-gift-fields">
    <div class="order-field">
      <label for="gift-select-trigger">Select Coffee / Subscription</label>

      <!-- Hidden native select for form submission & data mapping -->
      <select id="gift-product" class="subscribe-select" style="position: absolute; opacity: 0; pointer-events: none; width: 1px; height: 1px;" tabindex="-1" aria-hidden="true">
        <option value="" disabled selected>Choose a coffee...</option>
        <option disabled>── Blends ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "blend" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled>── Single Origins ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "single origin" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled>── Seasonals ──</option>
        {% for roast in site.roasts %}
          {% assign s_meta = site.data.statuses[roast.status] %}
          {% if s_meta == nil or s_meta.orderable != false %}
            {% if roast.category == "seasonal" %}
              <option value="{{ roast.slug }}">{{ roast.title }}</option>
            {% endif %}
          {% endif %}
        {% endfor %}

        <option disabled>── Subscriptions ──</option>
        <option value="migrator">Migrator</option>
        <option value="wingshot-collective">Wingshot Collective</option>
        <option value="fledglings">Fledglings</option>
        <option value="murmurations">Murmurations</option>
        <option value="runts-rations">Runt's Rations</option>
        <option value="rubber-duck-club">Rubber Duck Club</option>
      </select>

      <!-- Custom Dropdown with Thumbnails -->
      <div class="gift-select-wrap" id="gift-select-wrap">
        <button type="button" class="gift-select-trigger" id="gift-select-trigger" aria-haspopup="listbox" aria-expanded="false">
          <div class="gift-select-trigger-content">
            <div class="gift-select-trigger-thumb" id="gift-select-trigger-thumb">
              <span class="gift-select-trigger-ph" id="gift-select-trigger-ph" aria-hidden="true">&#9749;</span>
              <img src="" alt="" class="gift-select-trigger-img" id="gift-select-trigger-img" style="display: none;">
            </div>
            <div class="gift-select-trigger-info">
              <div class="gift-select-trigger-title gift-select-trigger-title--placeholder" id="gift-select-trigger-title">Choose a coffee or subscription...</div>
              <div class="gift-select-trigger-meta" id="gift-select-trigger-meta" style="display: none;"></div>
            </div>
          </div>
          <span class="gift-select-chevron" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#2c1e14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>

        <div class="gift-select-menu" id="gift-select-menu" role="listbox" style="display: none;">
          <!-- Blends -->
          <div class="gift-select-group">
            <div class="gift-select-group-header">Blends</div>
            {% for roast in site.roasts %}
              {% assign s_meta = site.data.statuses[roast.status] %}
              {% if s_meta == nil or s_meta.orderable != false %}
                {% if roast.category == "blend" %}
                  <div class="gift-select-option" data-value="{{ roast.slug }}" data-title="{{ roast.title }}" data-meta="{{ roast.descriptor | default: roast.subtitle | default: 'Blend' }}" data-img="{{ '/images/' | append: roast.mascot_file | relative_url }}" role="option" tabindex="0">
                    <div class="gift-select-option-thumb">
                      {% if roast.mascot_file %}
                        <img src="{{ '/images/' | append: roast.mascot_file | relative_url }}" alt="" class="gift-select-option-img">
                      {% else %}
                        <span class="gift-select-trigger-ph">&#9749;</span>
                      {% endif %}
                    </div>
                    <div class="gift-select-option-info">
                      <div class="gift-select-option-title">{{ roast.title }}</div>
                      <div class="gift-select-option-meta">{{ roast.descriptor | default: roast.subtitle | default: "Blend" }}</div>
                    </div>
                    <a href="{{ roast.url | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore {{ roast.title }} in a new tab">Explore <span>&nearr;</span></a>
                  </div>
                {% endif %}
              {% endif %}
            {% endfor %}
          </div>

          <!-- Single Origins -->
          <div class="gift-select-group">
            <div class="gift-select-group-header">Single Origins</div>
            {% for roast in site.roasts %}
              {% assign s_meta = site.data.statuses[roast.status] %}
              {% if s_meta == nil or s_meta.orderable != false %}
                {% if roast.category == "single origin" %}
                  <div class="gift-select-option" data-value="{{ roast.slug }}" data-title="{{ roast.title }}" data-meta="{{ roast.region | default: roast.descriptor | default: 'Single Origin' }}" data-img="{{ '/images/' | append: roast.mascot_file | relative_url }}" role="option" tabindex="0">
                    <div class="gift-select-option-thumb">
                      {% if roast.mascot_file %}
                        <img src="{{ '/images/' | append: roast.mascot_file | relative_url }}" alt="" class="gift-select-option-img">
                      {% else %}
                        <span class="gift-select-trigger-ph">&#9749;</span>
                      {% endif %}
                    </div>
                    <div class="gift-select-option-info">
                      <div class="gift-select-option-title">{{ roast.title }}</div>
                      <div class="gift-select-option-meta">{{ roast.region | default: roast.descriptor | default: "Single Origin" }}</div>
                    </div>
                    <a href="{{ roast.url | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore {{ roast.title }} in a new tab">Explore <span>&nearr;</span></a>
                  </div>
                {% endif %}
              {% endif %}
            {% endfor %}
          </div>

          <!-- Seasonals -->
          <div class="gift-select-group">
            <div class="gift-select-group-header">Seasonals</div>
            {% for roast in site.roasts %}
              {% assign s_meta = site.data.statuses[roast.status] %}
              {% if s_meta == nil or s_meta.orderable != false %}
                {% if roast.category == "seasonal" %}
                  <div class="gift-select-option" data-value="{{ roast.slug }}" data-title="{{ roast.title }}" data-meta="{{ roast.descriptor | default: 'Seasonal Roast' }}" data-img="{{ '/images/' | append: roast.mascot_file | relative_url }}" role="option" tabindex="0">
                    <div class="gift-select-option-thumb">
                      {% if roast.mascot_file %}
                        <img src="{{ '/images/' | append: roast.mascot_file | relative_url }}" alt="" class="gift-select-option-img">
                      {% else %}
                        <span class="gift-select-trigger-ph">&#9749;</span>
                      {% endif %}
                    </div>
                    <div class="gift-select-option-info">
                      <div class="gift-select-option-title">{{ roast.title }}</div>
                      <div class="gift-select-option-meta">{{ roast.descriptor | default: "Seasonal Roast" }}</div>
                    </div>
                    <a href="{{ roast.url | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore {{ roast.title }} in a new tab">Explore <span>&nearr;</span></a>
                  </div>
                {% endif %}
              {% endif %}
            {% endfor %}
          </div>

          <!-- Subscriptions -->
          <div class="gift-select-group">
            <div class="gift-select-group-header">Subscriptions</div>
            <div class="gift-select-option" data-value="migrator" data-title="Migrator" data-meta="Rotating roaster's choice single origin" data-img="{{ '/images/audubon-arctic-tern-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/audubon-arctic-tern-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Migrator</div>
                <div class="gift-select-option-meta">Rotating roaster's choice single origin</div>
              </div>
              <a href="{{ '/subscriptions/the-migrator/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Migrator in a new tab">Explore <span>&nearr;</span></a>
            </div>

            <div class="gift-select-option" data-value="wingshot-collective" data-title="Wingshot Collective" data-meta="Rotating espresso exploration pick" data-img="{{ '/images/audubon-crosshair-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/audubon-crosshair-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Wingshot Collective</div>
                <div class="gift-select-option-meta">Rotating espresso exploration pick</div>
              </div>
              <a href="{{ '/subscriptions/wingshot-collective/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Wingshot Collective in a new tab">Explore <span>&nearr;</span></a>
            </div>

            <div class="gift-select-option" data-value="fledglings" data-title="Fledglings" data-meta="Approachable monthly coffee &amp; brew guide" data-img="{{ '/images/audubon-chicks-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/audubon-chicks-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Fledglings</div>
                <div class="gift-select-option-meta">Approachable monthly coffee &amp; brew guide</div>
              </div>
              <a href="{{ '/subscriptions/fledglings/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Fledglings in a new tab">Explore <span>&nearr;</span></a>
            </div>

            <div class="gift-select-option" data-value="murmurations" data-title="Murmurations" data-meta="Small-batch roasts leftover beans blend" data-img="{{ '/images/flock-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/flock-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Murmurations</div>
                <div class="gift-select-option-meta">Small-batch roasts leftover beans blend</div>
              </div>
              <a href="{{ '/subscriptions/murmurations/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Murmurations in a new tab">Explore <span>&nearr;</span></a>
            </div>

            <div class="gift-select-option" data-value="runts-rations" data-title="Runt's Rations" data-meta="Test roasts &amp; experimental profiles" data-img="{{ '/images/audubon-runt-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/audubon-runt-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Runt's Rations</div>
                <div class="gift-select-option-meta">Test roasts &amp; experimental profiles</div>
              </div>
              <a href="{{ '/subscriptions/runts-rations/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Runt's Rations in a new tab">Explore <span>&nearr;</span></a>
            </div>

            <div class="gift-select-option" data-value="rubber-duck-club" data-title="Rubber Duck Club" data-meta="Debug brand-new experimental test roasts" data-img="{{ '/images/audubon-rubber-duck-transparent.png' | relative_url }}" role="option" tabindex="0">
              <div class="gift-select-option-thumb">
                <img src="{{ '/images/audubon-rubber-duck-transparent.png' | relative_url }}" alt="" class="gift-select-option-img">
              </div>
              <div class="gift-select-option-info">
                <div class="gift-select-option-title">Rubber Duck Club</div>
                <div class="gift-select-option-meta">Debug brand-new experimental test roasts</div>
              </div>
              <a href="{{ '/subscriptions/rubber-duck-club/' | relative_url }}" class="gift-select-option-link" target="_blank" rel="noopener noreferrer" title="Explore Rubber Duck Club in a new tab">Explore <span>&nearr;</span></a>
            </div>
          </div>
        </div>
      </div>
      <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; margin-bottom: 0;">* All physical gifts are packaged in our standard 12 oz bag size.</p>
    </div>

    <div class="order-field">
      <label>Gift Duration</label>
      <div class="pill-radios">
        <label class="order-radio"><input type="radio" name="gift-duration" value="One-time" checked> One-time</label>
        <label class="order-radio"><input type="radio" name="gift-duration" value="3 months"> 3 months</label>
        <label class="order-radio"><input type="radio" name="gift-duration" value="6 months"> 6 months</label>
      </div>
      <p id="gift-duration-note" style="font-size: 0.85rem; color: #666; margin-top: 0.35rem; display: none;">* Multi-month subscriptions are not available for this coffee.</p>
    </div>
  </div>

  <!-- Digital Gift Card Fields -->
  <div id="digital-gift-fields" style="display: none;">
    <div class="order-field">
      <label>Gift Card Value</label>
      <div class="pill-radios">
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="15"> $15</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="30"> $30</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="45" checked> $45</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="60"> $60</label>
        <label class="order-radio"><input type="radio" name="gift-card-amount" value="90"> $90</label>
      </div>
    </div>
  </div>

  <div style="border: 1px solid #e0d0c0; border-radius: 0.5rem; padding: 1.25rem; margin: 2rem 0; background-color: #faf8f5;">
    <h3 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.15rem; color: #2c1e14; border-bottom: 1px solid #e0d0c0; padding-bottom: 0.5rem;">Gift Details</h3>
    
    <div class="order-field">
      <label for="gift-purchaser-name">Your Name (Purchaser)</label>
      <input id="gift-purchaser-name" type="text" required autocomplete="name">
    </div>

    <div class="order-field">
      <label for="gift-purchaser-email">Your Email</label>
      <input id="gift-purchaser-email" type="email" required autocomplete="email">
    </div>

    <div class="order-field">
      <label for="gift-recipient-name">Recipient's Name</label>
      <input id="gift-recipient-name" type="text" required autocomplete="off">
    </div>

    <div class="order-field">
      <label id="gift-recipient-email-label" for="gift-recipient-email">Recipient's Email (optional)</label>
      <input id="gift-recipient-email" type="email" autocomplete="off">
    </div>

    <div class="order-field" style="margin-bottom: 0;">
      <label for="gift-message">Gift Message (optional)</label>
      <textarea id="gift-message" rows="3" placeholder="Write a note to the recipient..."></textarea>
    </div>
  </div>

  <!-- Direct Address Fields Container -->
  <div id="direct-address-container">
    <h3 style="font-size: 1.15rem; color: #2c1e14; margin-top: 2rem; margin-bottom: 1rem;">Recipient Delivery Address</h3>
    <div id="gift-address-fields" class="order-shipping">
      <div class="order-field">
        <label for="gift-address">Street address</label>
        <input id="gift-address" type="text" required autocomplete="street-address">
      </div>
      <div class="order-field">
        <label for="gift-city">City</label>
        <input id="gift-city" type="text" required autocomplete="address-level2">
      </div>
      <div class="order-field-row">
        <div class="order-field">
          <label for="gift-state">State</label>
          <input id="gift-state" type="text" required autocomplete="address-level1">
        </div>
        <div class="order-field">
          <label for="gift-zip">ZIP</label>
          <input id="gift-zip" type="text" required autocomplete="postal-code">
        </div>
      </div>
    </div>
  </div>

  <div class="order-field" style="margin-top: 1.5rem;">
    <label for="gift-notes">Additional Delivery Notes (optional)</label>
    <textarea id="gift-notes" rows="3" placeholder="Any delivery instructions..."></textarea>
  </div>

  <div id="gift-price-summary" style="font-size: 1.25rem; font-weight: 700; color: #2c1e14; margin: 1.5rem 0; padding: 1rem; background-color: #faf8f5; border: 1px solid #e0d0c0; border-radius: 0.5rem; text-align: center;">
    Total: <span id="gift-price-display">$0</span>
  </div>

  <div class="order-actions" style="margin-top: 2rem;">
    <button type="submit" class="order-submit">Order Corvid care packages</button>
  </div>

  <p class="order-status" role="status" aria-live="polite"></p>
</form>

<script>
(function () {
  var form = document.getElementById('gift-form');
  var params = new URLSearchParams(window.location.search);
  var productSelect = document.getElementById('gift-product');
  var pageTitle = document.getElementById('gift-page-title');

  var hiddenRoastInput = document.getElementById('gift-roast-hidden');
  var hiddenPriceInput = document.getElementById('gift-price-hidden');
  var hiddenNotesInput = document.getElementById('gift-notes-hidden');

  var subConfig = {
    {% for entry in site.data.subscriptions %}
    '{{ entry[0] }}': { sizes: {{ entry[1].sizes | jsonify }}, prices: {{ entry[1].prices | default: "" | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var regularPricing = {
    default: {{ site.data.pricing.default | jsonify }},
    overrides: {{ site.data.pricing.overrides | jsonify }}
  };

  function getUnitPrice(product, size) {
    var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
    if (isSubscriptionOnly) {
      var config = subConfig[product];
      return (config && config.prices && config.prices[size]) ? config.prices[size] : null;
    } else {
      var pricing = regularPricing;
      var roastPrices = pricing.overrides[product];
      if (roastPrices && roastPrices[size]) {
        return roastPrices[size];
      }
      return pricing.default[size] || null;
    }
  }

  // Disable multi-month gift subscriptions for roasts where subscribable is false
  var disabledSubRoasts = {
    {% for r in site.roasts %}
    {% if r.status %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta.subscribable == false %}
    '{{ r.slug }}': true,
      {% endif %}
    {% endif %}
    {% endfor %}
  };

  function updateSubscriptionAvailability() {
    var product = productSelect.value;
    var isSubscribable = false;

    if (product) {
      var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
      if ((isSubscriptionOnly || (subConfig && subConfig[product])) && !disabledSubRoasts[product]) {
        isSubscribable = true;
      }
    } else {
      isSubscribable = true;
    }

    var durationRadios = form.querySelectorAll('input[name="gift-duration"]');
    durationRadios.forEach(function (radio) {
      if (radio.value !== 'One-time') {
        var label = radio.closest('.order-radio');
        if (!isSubscribable) {
          radio.disabled = true;
          if (label) label.classList.add('order-radio--disabled');
          if (radio.checked) {
            var oneTimeRadio = form.querySelector('input[name="gift-duration"][value="One-time"]');
            if (oneTimeRadio) oneTimeRadio.checked = true;
          }
        } else {
          radio.disabled = false;
          if (label) label.classList.remove('order-radio--disabled');
        }
      }
    });

    var noteEl = document.getElementById('gift-duration-note');
    if (noteEl) {
      noteEl.style.display = (!isSubscribable && product) ? 'block' : 'none';
    }
  }

  function updatePrice() {
    updateSubscriptionAvailability();
    var giftType = form.querySelector('input[name="gift-type"]:checked').value;
    if (giftType === 'code') {
      var activeAmountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amount = activeAmountRadio ? activeAmountRadio.value : '45';
      document.getElementById('gift-price-display').textContent = '$' + amount;
      document.getElementById('gift-price-summary').style.display = 'block';
      return;
    }

    var product = productSelect.value;
    if (!product) {
      document.getElementById('gift-price-summary').style.display = 'none';
      return;
    }

    var duration = form.querySelector('input[name="gift-duration"]:checked').value;
    var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);

    var unitPrice = getUnitPrice(product, '12oz');
    if (unitPrice) {
      var totalVal = unitPrice * months;
      var displayStr = '$' + totalVal + ' total';
      if (duration !== 'One-time') {
        displayStr += ' ($' + unitPrice + '/mo)';
      }
      document.getElementById('gift-price-display').textContent = displayStr;
      document.getElementById('gift-price-summary').style.display = 'block';
    } else {
      document.getElementById('gift-price-summary').style.display = 'none';
    }
  }

  // Custom Select Elements
  var customSelectWrap = document.getElementById('gift-select-wrap');
  var customTrigger = document.getElementById('gift-select-trigger');
  var customTriggerImg = document.getElementById('gift-select-trigger-img');
  var customTriggerPh = document.getElementById('gift-select-trigger-ph');
  var customTriggerTitle = document.getElementById('gift-select-trigger-title');
  var customTriggerMeta = document.getElementById('gift-select-trigger-meta');
  var customMenu = document.getElementById('gift-select-menu');
  var customOptions = customMenu ? customMenu.querySelectorAll('.gift-select-option') : [];

  function updateCustomDropdownDisplay(val) {
    if (!val) {
      if (customTriggerImg) customTriggerImg.style.display = 'none';
      if (customTriggerPh) customTriggerPh.style.display = 'block';
      if (customTriggerTitle) {
        customTriggerTitle.textContent = 'Choose a coffee or subscription...';
        customTriggerTitle.classList.add('gift-select-trigger-title--placeholder');
      }
      if (customTriggerMeta) {
        customTriggerMeta.style.display = 'none';
        customTriggerMeta.textContent = '';
      }
      customOptions.forEach(function (opt) {
        opt.classList.remove('is-selected');
      });
      return;
    }

    customOptions.forEach(function (opt) {
      if (opt.getAttribute('data-value') === val) {
        opt.classList.add('is-selected');
        var title = opt.getAttribute('data-title');
        var meta = opt.getAttribute('data-meta');
        var img = opt.getAttribute('data-img');

        if (customTriggerTitle) {
          customTriggerTitle.textContent = title;
          customTriggerTitle.classList.remove('gift-select-trigger-title--placeholder');
        }
        if (customTriggerMeta) {
          if (meta) {
            customTriggerMeta.textContent = meta;
            customTriggerMeta.style.display = 'block';
          } else {
            customTriggerMeta.style.display = 'none';
          }
        }

        if (customTriggerImg && customTriggerPh) {
          if (img) {
            customTriggerImg.src = img;
            customTriggerImg.style.display = 'block';
            customTriggerPh.style.display = 'none';
          } else {
            customTriggerImg.style.display = 'none';
            customTriggerPh.style.display = 'block';
          }
        }
      } else {
        opt.classList.remove('is-selected');
      }
    });
  }

  function toggleDropdown(show) {
    if (!customMenu || !customTrigger) return;
    var isOpening = (typeof show === 'boolean') ? show : (customMenu.style.display !== 'block');
    customMenu.style.display = isOpening ? 'block' : 'none';
    customTrigger.classList.toggle('is-open', isOpening);
    customTrigger.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    if (isOpening) {
      var selectedOpt = customMenu.querySelector('.gift-select-option.is-selected');
      if (selectedOpt) {
        selectedOpt.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  if (customTrigger) {
    customTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDropdown();
    });
  }

  document.addEventListener('click', function (e) {
    if (customSelectWrap && !customSelectWrap.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && customMenu && customMenu.style.display === 'block') {
      toggleDropdown(false);
      if (customTrigger) customTrigger.focus();
    }
  });

  customOptions.forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      if (e.target.closest('.gift-select-option-link')) {
        return;
      }
      e.preventDefault();
      var val = this.getAttribute('data-value');
      productSelect.value = val;
      updateCustomDropdownDisplay(val);
      toggleDropdown(false);
      if (customTrigger) {
        customTrigger.focus();
        customTrigger.style.borderColor = '';
      }
      productSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    opt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.gift-select-option-link')) {
          return;
        }
        e.preventDefault();
        this.click();
      }
    });
  });

  var optionLinks = customMenu ? customMenu.querySelectorAll('.gift-select-option-link') : [];
  optionLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  // Gift Type Card selection
  var giftTypeCards = form.querySelectorAll('.gift-type-card');

  function selectGiftType(type) {
    var radio = form.querySelector('input[name="gift-type"][value="' + type + '"]');
    if (radio && !radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  giftTypeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var type = this.getAttribute('data-value');
      selectGiftType(type);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectGiftType(this.getAttribute('data-value'));
      }
    });
  });

  // Pre-populate product if set in URL params (Direct only)
  var queryProduct = params.get('product') || params.get('roast');
  if (queryProduct) {
    productSelect.value = queryProduct;
    if (productSelect.value && productSelect.selectedIndex >= 0) {
      pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
    }
  }

  // Pre-populate gift type if set in URL params
  var queryType = params.get('type');
  if (queryType === 'code' || queryType === 'digital') {
    selectGiftType('code');
  }

  updateCustomDropdownDisplay(productSelect.value);
  updatePrice();

  productSelect.addEventListener('change', function () {
    var selectedText = (this.options && this.selectedIndex >= 0 && this.options[this.selectedIndex])
      ? this.options[this.selectedIndex].text
      : '';
    if (selectedText && this.value) {
      pageTitle.textContent = 'Corvid care packages — ' + selectedText;
    } else {
      pageTitle.textContent = 'Corvid care packages';
    }
    updateCustomDropdownDisplay(this.value);
    updatePrice();
  });

  form.querySelectorAll('input[name="gift-duration"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  form.querySelectorAll('input[name="gift-card-amount"]').forEach(function (radio) {
    radio.addEventListener('change', updatePrice);
  });

  // Toggle Type Listeners
  form.querySelectorAll('input[name="gift-type"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var isDirect = this.value === 'direct';
      document.getElementById('direct-gift-fields').style.display = isDirect ? 'block' : 'none';
      document.getElementById('direct-address-container').style.display = isDirect ? 'block' : 'none';
      document.getElementById('digital-gift-fields').style.display = isDirect ? 'none' : 'block';

      // Update Card Visual State
      giftTypeCards.forEach(function (c) {
        var matches = c.getAttribute('data-value') === radio.value;
        c.classList.toggle('is-selected', matches);
        c.setAttribute('aria-checked', matches ? 'true' : 'false');
      });

      // Required fields toggling
      document.getElementById('gift-address').required = isDirect;
      document.getElementById('gift-city').required = isDirect;
      document.getElementById('gift-state').required = isDirect;
      document.getElementById('gift-zip').required = isDirect;

      var recEmail = document.getElementById('gift-recipient-email');
      var recEmailLabel = document.getElementById('gift-recipient-email-label');
      if (recEmail) recEmail.required = !isDirect;
      if (recEmailLabel) recEmailLabel.textContent = isDirect ? "Recipient's Email (optional)" : "Recipient's Email";

      // Reset titles & prices
      if (isDirect) {
        var product = productSelect.value;
        if (product && productSelect.selectedIndex >= 0) {
          pageTitle.textContent = 'Corvid care packages — ' + productSelect.options[productSelect.selectedIndex].text;
        } else {
          pageTitle.textContent = 'Corvid care packages';
        }
      } else {
        pageTitle.textContent = 'Corvid care packages';
      }

      updatePrice();
    });
  });
  var iframe = document.createElement('iframe');
  iframe.name = 'gift-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'gift-submit-frame';
  var status = form.querySelector('.order-status');
  var submitBtn = form.querySelector('.order-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var giftType = form.querySelector('input[name="gift-type"]:checked').value;

    var purchaserName = document.getElementById('gift-purchaser-name').value.trim();
    var purchaserEmail = document.getElementById('gift-purchaser-email').value.trim();
    var recipientName = document.getElementById('gift-recipient-name').value.trim();
    var recipientEmail = document.getElementById('gift-recipient-email').value.trim();
    var giftMessage = document.getElementById('gift-message').value.trim();
    var userNotes = document.getElementById('gift-notes').value.trim();

    if (giftType === 'direct') {
      var product = productSelect.value;
      if (!product) {
        alert('Please select a coffee or subscription product.');
        toggleDropdown(true);
        if (customTrigger) {
          customTrigger.focus();
          customTrigger.style.borderColor = '#d32f2f';
        }
        return;
      }

      var durationRadio = form.querySelector('input[name="gift-duration"]:checked');
      var duration = durationRadio ? durationRadio.value : 'One-time';

      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdEBWvbvQxmQOTD1DiqizruupFLmHSwcGM0cB9sUGjyWf-33A/formResponse';

      // Map Purchaser
      document.getElementById('gift-purchaser-name').name = 'entry.1153405702';
      document.getElementById('gift-purchaser-email').name = 'entry.65766604';

      // Map Shipping Address
      document.getElementById('gift-address').name = 'entry.148046999';
      document.getElementById('gift-city').name = 'entry.1534670804';
      document.getElementById('gift-state').name = 'entry.414179858';
      document.getElementById('gift-zip').name = 'entry.1472936948';

      // Map Hidden Fields
      var hiddenRoast = document.getElementById('gift-roast-hidden');
      hiddenRoast.name = 'entry.1935997805';
      hiddenRoast.value = product;

      var hiddenPrice = document.getElementById('gift-price-hidden');
      hiddenPrice.name = 'entry.903789519';
      var unitPrice = getUnitPrice(product, '12oz');
      var months = (duration === 'One-time') ? 1 : (parseInt(duration) || 3);
      if (unitPrice) {
        hiddenPrice.value = '$' + (unitPrice * months);
      }

      var hiddenStatus = document.getElementById('gift-status-hidden');
      hiddenStatus.name = 'entry.1261348961';

      var hiddenFreq = document.getElementById('gift-frequency-hidden');
      hiddenFreq.name = 'entry.2064801247';

      var hiddenDeliv = document.getElementById('gift-delivery-hidden');
      hiddenDeliv.name = 'entry.1896226742';

      var hiddenSize = document.getElementById('gift-size-hidden');
      hiddenSize.name = 'entry.1606791078';

      // Map Notes Field (recipient details serialized)
      var hiddenNotes = document.getElementById('gift-notes-hidden');
      hiddenNotes.name = 'entry.1381358427';

      var giftPrefix = '[GIFT_PURCHASE] Recipient: ' + recipientName;
      if (recipientEmail) {
        giftPrefix += ' (' + recipientEmail + ')';
      }
      giftPrefix += ' | Duration: ' + duration;
      if (giftMessage) {
        giftPrefix += ' | Msg: ' + giftMessage;
      }

      hiddenNotes.value = userNotes ? giftPrefix + ' | Original Notes: ' + userNotes : giftPrefix;

      // Remove unused digital inputs names
      document.getElementById('gift-card-amount-hidden').removeAttribute('name');
      document.getElementById('gift-code-hidden').removeAttribute('name');
      document.getElementById('gift-recipient-name').removeAttribute('name');
      document.getElementById('gift-recipient-email').removeAttribute('name');
      document.getElementById('gift-message').removeAttribute('name');
      document.getElementById('gift-notes').removeAttribute('name');

      submitFormAndRedirect('{{ "/thanks/" | relative_url }}');

    } else {
      // Code Flow (Digital Gift Card)
      if (!purchaserName || !purchaserEmail || !recipientName || !recipientEmail) {
        alert('Please fill out all required fields.');
        return;
      }

      var amountRadio = form.querySelector('input[name="gift-card-amount"]:checked');
      var amountValue = amountRadio ? amountRadio.value : '45';
      var randomCode = 'GIFT-' + generateRandomString(8);

      if (status) {
        status.textContent = 'Sending…';
        status.className = 'order-status order-status-pending';
      }
      if (submitBtn) submitBtn.disabled = true;

      // Remove unused direct inputs names
      document.getElementById('gift-address').removeAttribute('name');
      document.getElementById('gift-city').removeAttribute('name');
      document.getElementById('gift-state').removeAttribute('name');
      document.getElementById('gift-zip').removeAttribute('name');
      document.getElementById('gift-roast-hidden').removeAttribute('name');
      document.getElementById('gift-price-hidden').removeAttribute('name');
      document.getElementById('gift-status-hidden').removeAttribute('name');
      document.getElementById('gift-frequency-hidden').removeAttribute('name');
      document.getElementById('gift-delivery-hidden').removeAttribute('name');
      document.getElementById('gift-size-hidden').removeAttribute('name');
      document.getElementById('gift-notes-hidden').removeAttribute('name');

      proceedToSubmitDigital(randomCode, amountValue);
    }
  });

  function proceedToSubmitDigital(giftCode, amount) {
    form.action = '{{ site.digital_gift_form_url }}';

    document.getElementById('gift-purchaser-name').name = '{{ site.digital_gift_entries.purchaser_name }}';
    document.getElementById('gift-purchaser-email').name = '{{ site.digital_gift_entries.purchaser_email }}';
    
    var amountHidden = document.getElementById('gift-card-amount-hidden');
    amountHidden.name = '{{ site.digital_gift_entries.amount }}';
    amountHidden.value = amount;

    var codeHidden = document.getElementById('gift-code-hidden');
    codeHidden.name = '{{ site.digital_gift_entries.gift_code }}';
    codeHidden.value = giftCode;

    document.getElementById('gift-recipient-name').name = '{{ site.digital_gift_entries.recipient_name }}';
    document.getElementById('gift-recipient-email').name = '{{ site.digital_gift_entries.recipient_email }}';
    document.getElementById('gift-message').name = '{{ site.digital_gift_entries.gift_message }}';
    document.getElementById('gift-notes').name = '{{ site.digital_gift_entries.notes }}';

    submitFormAndRedirect('{{ "/thanks/" | relative_url }}?code=' + encodeURIComponent(giftCode));
  }

  function submitFormAndRedirect(redirectUrl) {
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }

    iframe.onload = function () {
      window.location.href = redirectUrl;
    };

    form.submit();
  }

  function generateRandomString(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
})();
</script>
