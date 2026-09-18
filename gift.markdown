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

<script src="{{ '/js/gift-order.js' | relative_url }}"></script>
<script>
(function () {
  var form = document.getElementById('gift-form');
  var params = new URLSearchParams(window.location.search);
  var productSelect = document.getElementById('gift-product');
  var pageTitle = document.getElementById('gift-page-title');

  var hiddenRoastInput = document.getElementById('gift-roast-hidden');
  var hiddenPriceInput = document.getElementById('gift-price-hidden');
  var hiddenNotesInput = document.getElementById('gift-notes-hidden');

  {% assign default_sub_sizes = "12oz,1lb,2lb,5lb" | split: "," %}
  var subConfig = {
    {% for r in site.roasts %}
      {% if r.subscription and r.subscription != false and r.subscription.available != false %}
        {% assign r_sub = r.subscription %}
        {% if r.sizes %}{% assign r_sizes = r.sizes %}{% else %}{% assign r_sizes = default_sub_sizes %}{% endif %}
        {% assign r_prices = r_sub.price | default: r_sub.prices | default: r.price %}
        '{{ r.slug }}': { sizes: {{ r_sizes | jsonify }}, prices: {{ r_prices | jsonify }} },
      {% endif %}
    {% endfor %}
    {% for s in site.subscriptions %}
      {% if s.sizes %}{% assign s_sizes = s.sizes %}{% else %}{% assign s_sizes = "12oz" | split: "," %}{% endif %}
      {% assign s_prices = s.price | default: s.prices %}
      '{{ s.slug }}': { sizes: {{ s_sizes | jsonify }}, prices: {{ s_prices | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  var roastPricing = {
    {% for r in site.roasts %}
      {% assign rp = r.price | default: r.prices %}
      '{{ r.slug }}': {{ rp | jsonify }}{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  function getUnitPrice(product, size) {
    var isSubscriptionOnly = ['migrator', 'wingshot-collective', 'fledglings', 'murmurations', 'runts-rations', 'rubber-duck-club'].indexOf(product) >= 0;
    if (isSubscriptionOnly) {
      var config = subConfig[product];
      return (config && config.prices && config.prices[size]) ? config.prices[size] : null;
    } else {
      var roastPrices = roastPricing[product];
      if (roastPrices && roastPrices[size]) {
        return roastPrices[size];
      }
      return null;
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


  if (window.initGiftOrder) {
    window.initGiftOrder({
      subConfig: subConfig,
      roastPricing: roastPricing,
      disabledSubRoasts: disabledSubRoasts,
      digitalFormUrl: {{ site.digital_gift_form_url | jsonify }},
      digitalFormEntries: {{ site.digital_gift_entries | jsonify }},
      thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
    });
  }
})();
</script>
