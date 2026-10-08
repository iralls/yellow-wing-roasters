---
layout: detail-page
title: "BYOB — Build Your Own Blend"
card_title: "BYOB"
subtitle: "Build Your Own Blend"
intro: "Combine up to three varieties of green beans, select individual roast levels, and design a custom coffee profile exactly to your taste."
slug: build-your-own-blend
category: custom
data_roast: byob-blend
order: 1
permalink: /roasts/build-your-own-blend/
price: 32
descriptor: custom blend
overlay_notes: "craft your own custom blend from our single origin roasts"
mascot_file: build-a-bird-transparent.png
mascot_alt: "Build Your Own Blend mascot"
---

<div class="byob-container">

  <!-- Step 1: Bean Selection & Filters -->
  {% assign single_origins = site.roasts | where: "category", "single origin" %}
  {% assign active_origins = "" | split: "," %}
  {% assign active_procs = "" | split: "," %}
  {% for r in single_origins %}
    {% assign s_meta = site.data.statuses[r.status] %}
    {% if s_meta == nil or s_meta.orderable != false %}
      {% assign o_first = r.origins.first %}
      {% assign country = o_first | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
      {% if country == nil or country == "" %}{% assign country = r.title | split: " " | first %}{% endif %}
      {% assign active_origins = active_origins | push: country %}
      {% assign proc = r.processing_method | replace: " (Dry Process)", "" | strip %}
      {% if proc and proc != "" %}{% assign active_procs = active_procs | push: proc %}{% endif %}
    {% endif %}
  {% endfor %}
  {% assign uniq_origins = active_origins | uniq | sort %}
  {% assign uniq_procs = active_procs | uniq | sort %}

  <div class="bean-selector-section">
    <h2 class="roasts-category">1. Choose Coffee Beans</h2>
    
    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-group">
        <label for="filter-origin" class="roast-mv-meta-label">Origin</label>
        <select id="filter-origin" class="subscribe-select">
          <option value="">All Origins</option>
          {% for o in uniq_origins %}
            <option value="{{ o }}">{{ o }}</option>
          {% endfor %}
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-process" class="roast-mv-meta-label">Process</label>
        <select id="filter-process" class="subscribe-select">
          <option value="">All Processes</option>
          {% for p in uniq_procs %}
            <option value="{{ p | downcase }}">{{ p }}</option>
          {% endfor %}
        </select>
      </div>
      
      <div class="filter-group">
        <label for="filter-notes" class="roast-mv-meta-label">Flavor Profile</label>
        <select id="filter-notes" class="subscribe-select">
          <option value="">All Flavors</option>
          <option value="chocolate">Chocolate / Cocoa</option>
          <option value="fruit">Fruity (Berry, Apple, Plum)</option>
          <option value="citrus">Citrus (Lemon, Lime, Orange)</option>
          <option value="sweet">Sweet (Honey, Maple, Butterscotch)</option>
          <option value="floral">Floral (Jasmine, Rosewater)</option>
          <option value="nutty">Nutty (Almond, Hazelnut)</option>
          <option value="earthy">Earthy / Smoky</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-acidity" class="roast-mv-meta-label">Acidity</label>
        <select id="filter-acidity" class="subscribe-select">
          <option value="">All Acidity Levels</option>
          <option value="low">Low (1-2)</option>
          <option value="medium">Medium (3)</option>
          <option value="high">High (4-5)</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-body" class="roast-mv-meta-label">Body</label>
        <select id="filter-body" class="subscribe-select">
          <option value="">All Body Levels</option>
          <option value="light">Light (1-2)</option>
          <option value="medium">Medium (3)</option>
          <option value="heavy">Heavy (4-5)</option>
        </select>
      </div>
    </div>

    <!-- Workspace: Dropdown on left, Details on right -->
    <div class="selection-workspace">
      <div class="selection-left">
        <label for="bean-select-dropdown" class="roast-mv-meta-label">Select a Coffee Bean</label>
        <select id="bean-select-dropdown" class="subscribe-select">
          <option value="" disabled selected>Select from list...</option>
          {% for r in single_origins %}
            {% assign s_meta = site.data.statuses[r.status] %}
            {% if s_meta == nil or s_meta.orderable != false %}
              <option value="{{ r.title }}">{{ r.title }}</option>
            {% endif %}
          {% endfor %}
        </select>
        <button type="button" id="add-to-blend-btn" class="add-to-blend-button" disabled>+ Add to Blend</button>
      </div>

      <div class="selection-right" id="bean-details-panel">
        <div class="details-placeholder" id="details-placeholder">
          Choose a bean from the list to view its cup characteristics.
        </div>
        <div class="details-active" id="details-active" style="display: none;">
          <h3 class="details-title" id="details-title"></h3>
          <p class="details-characteristics" id="details-desc"></p>
          <div class="details-stats-row">
            <span class="details-stat-pill" id="details-process-pill">Process: Washed</span>
            <span class="details-stat-pill" id="details-acidity-pill">Acidity: 3/5</span>
            <span class="details-stat-pill" id="details-body-pill">Body: 3/5</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Step 2 & 3: Mixer & Live Taste Preview -->
  <div class="mixer-preview-layout">
    
    <!-- Mixer Panel -->
    <div class="mixer-panel">
      <h2 class="roasts-category byob-step-title">2. Adjust Composition & Roasts</h2>
      <div class="mixer-empty-note" id="mixer-empty-note">
        No beans added. Use the selector above to build your recipe.
      </div>
      <div id="mixer-container"></div>
    </div>

    <!-- Preview Panel -->
    <div class="preview-panel">
      <h2 class="roasts-category byob-step-title">3. Predicted Taste Profile</h2>
      <div id="preview-content" style="display: none;">
        
        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Acidity</span>
            <span class="preview-stat-value" id="preview-acidity-text">Medium</span>
          </div>
          <div class="preview-bar-outer">
            <div class="preview-bar-inner" id="preview-acidity-bar"></div>
          </div>
        </div>

        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Body</span>
            <span class="preview-stat-value" id="preview-body-text">Medium</span>
          </div>
          <div class="preview-bar-outer">
            <div class="preview-bar-inner" id="preview-body-bar"></div>
          </div>
        </div>

        <div class="preview-stat">
          <div class="preview-stat-header">
            <span class="preview-stat-name">Tasting Notes</span>
          </div>
          <div class="preview-notes-container" id="preview-notes-tags">
            <!-- Tags generated here -->
          </div>
        </div>

      </div>
      <div class="preview-placeholder" id="preview-placeholder">
        Add coffee beans to display predicted tasting profile.
      </div>
    </div>

  </div>

  <!-- Step 4: Checkout Form -->
  <div class="order-section" id="order-section">
    <h2 class="roasts-category byob-step-title byob-step-title--center">4. Place Your Custom Blend Order</h2>
    
    <div class="roast-detail-price-line byob-price-line">
      ${{ page.price }} <span class="byob-unit-note">(one 12oz bag)</span>
    </div>

    <form action="{{ site.google_forms.byob_blend.url }}" method="POST" class="order-form" id="byob-form">
      
      <!-- Recipe details and total price are dynamically injected here on submission -->
      <input type="hidden" name="{{ site.google_forms.byob_blend.entries.recipe }}" id="hidden-recipe" value="">
      <input type="hidden" name="{{ site.google_forms.byob_blend.entries.total }}" id="hidden-total" value="${{ page.price }}">

      <div class="order-field">
        <label for="byob-name" class="roast-mv-meta-label">Name</label>
        <input id="byob-name" type="text" name="{{ site.google_forms.byob_blend.entries.name }}" required autocomplete="name">
      </div>

      <div class="order-field">
        <label for="byob-email" class="roast-mv-meta-label">Email</label>
        <input id="byob-email" type="email" name="{{ site.google_forms.byob_blend.entries.email }}" required autocomplete="email">
      </div>

      <div class="order-field">
        <label for="byob-blend-grind-select" class="roast-mv-meta-label">Grind level</label>
        <select id="byob-blend-grind-select" class="subscribe-select">
          {% include grind-options.html %}
        </select>
      </div>

      <fieldset class="order-delivery">
        <legend class="roast-mv-meta-label">Delivery method</legend>
        <div class="pill-radios">
          <label class="order-radio"><input type="radio" name="{{ site.google_forms.byob_blend.entries.delivery }}" value="Pickup" checked> Pickup</label>
          <label class="order-radio"><input type="radio" name="{{ site.google_forms.byob_blend.entries.delivery }}" value="Hand delivery"> Hand delivery</label>
        </div>
        <p id="byob-delivery-note" class="order-delivery-note" data-pickup-msg="Please specify in the notes how you want to coordinate pickup." data-delivery-msg="Available in {{ site.local_delivery_towns | join: ', ' }}.">Please specify in the notes how you want to coordinate pickup.</p>
      </fieldset>

      <div id="byob-shipping" class="order-shipping" style="display:none;">
        <div class="order-field">
          <label for="byob-address" class="roast-mv-meta-label">Street address</label>
          <input id="byob-address" type="text" name="{{ site.google_forms.byob_blend.entries.address }}" autocomplete="street-address">
        </div>
        <div class="order-field">
          <label for="byob-city" class="roast-mv-meta-label">City</label>
          <input id="byob-city" type="text" name="{{ site.google_forms.byob_blend.entries.city }}" autocomplete="address-level2">
        </div>
        <div class="order-field-row">
          <div class="order-field">
            <label for="byob-state" class="roast-mv-meta-label">State</label>
            <select id="byob-state" name="{{ site.google_forms.byob_blend.entries.state }}" autocomplete="address-level1">
              {% include state-options.html %}
            </select>
          </div>
          <div class="order-field">
            <label for="byob-zip" class="roast-mv-meta-label">ZIP</label>
            <input id="byob-zip" type="text" name="{{ site.google_forms.byob_blend.entries.zip }}" autocomplete="postal-code">
          </div>
        </div>
      </div>

      <div class="order-field">
        <label for="byob-notes" class="roast-mv-meta-label">Notes (optional)</label>
        <textarea id="byob-notes" name="{{ site.google_forms.byob_blend.entries.notes }}" rows="3" placeholder="Any preferences, notes, or roast instructions..."></textarea>
      </div>

      <div class="order-actions">
        <button type="submit" class="order-submit" id="byob-submit-btn" disabled>Submit Blend Order</button>
      </div>

      <p class="order-status" role="status" aria-live="polite"></p>
    </form>
  </div>

</div>

<script src="{{ '/js/byob-mixer.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var rawBeans = [
    {% for r in single_origins %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta == nil or s_meta.orderable != false %}
        {% assign o_first = r.origins.first %}
        {% assign country = o_first | replace: " Wet-Hulled", "" | replace: " Washed", "" | replace: " Natural", "" | replace: " Honey", "" | strip %}
        {% if country == nil or country == "" %}{% assign country = r.title | split: " " | first %}{% endif %}
        {% assign proc = r.processing_method | replace: " (Dry Process)", "" | strip %}
        {% assign notes_raw = r.tasting_notes | replace: " · ", ", " | split: ", " %}
        {
          name: {{ r.title | jsonify }},
          origin: {{ country | jsonify }},
          process: {{ proc | jsonify }},
          tasting_notes: {{ notes_raw | jsonify }},
          descriptor: {{ r.descriptor | default: "" | jsonify }},
          url: {{ r.url | relative_url | jsonify }},
          cup_characteristics: {{ r.description | default: "" | strip | jsonify }}
        },
      {% endif %}
    {% endfor %}
  ];

  initBYOBMixer({
    rawBeans: rawBeans,
    thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
  });
})();
</script>
