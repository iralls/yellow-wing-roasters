---
layout: default
title: "BYOB — Build Your Own Blend"
permalink: /roasts/build-your-own-blend/
---

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <div class="mascot-grid mascot-grid-lg">
      <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" style="filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));">
      <img src="{{ '/images/audubon-bluejay-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" style="filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));">
      <img src="{{ '/images/audubon-barred-owl-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" style="filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15)); transform: scale(0.8) translateY(-22px);">
      <img src="{{ '/images/audubon-red-winged-blackbird-transparent.png' | relative_url }}" alt="" class="mascot-grid-item" style="filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));">
    </div>
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">BYOB</h1>
  </div>

  <p class="roast-mv-tasting"><em>Build Your Own Blend</em><br>Combine up to three varieties of green beans, select individual roast levels, and design a custom coffee profile exactly to your taste.</p>

  <div class="roast-mv-divider"></div>

  <!-- Step 1: Bean Selection & Filters -->
  <div class="bean-selector-section">
    <h2 class="bean-selector-title">1. Choose Coffee Beans</h2>
    
    <!-- Filters Row -->
    <div class="filters-row" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-origin" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Origin</label>
        <select id="filter-origin" class="subscribe-select" style="min-width: 140px;">
          <option value="">All Origins</option>
          <option value="Bolivia">Bolivia</option>
          <option value="Brazil">Brazil</option>
          <option value="Burundi">Burundi</option>
          <option value="Colombia">Colombia</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Guatemala">Guatemala</option>
          <option value="Kenya">Kenya</option>
          <option value="Panama">Panama</option>
          <option value="Peru">Peru</option>
          <option value="Sumatra">Sumatra</option>
        </select>
      </div>

      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-process" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Process</label>
        <select id="filter-process" class="subscribe-select" style="min-width: 140px;">
          <option value="">All Processes</option>
        </select>
      </div>
      
      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-notes" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Flavor Profile</label>
        <select id="filter-notes" class="subscribe-select" style="min-width: 140px;">
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

      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-acidity" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Acidity</label>
        <select id="filter-acidity" class="subscribe-select" style="min-width: 140px;">
          <option value="">All Acidity Levels</option>
          <option value="low">Low (1-2)</option>
          <option value="medium">Medium (3)</option>
          <option value="high">High (4-5)</option>
        </select>
      </div>

      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-body" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Body</label>
        <select id="filter-body" class="subscribe-select" style="min-width: 140px;">
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
        <label for="bean-select-dropdown">Select a Coffee Bean</label>
        <select id="bean-select-dropdown" class="subscribe-select" style="width: 100%;">
          <option value="" disabled selected>Select from list...</option>
        </select>
        <button type="button" id="add-to-blend-btn" class="add-to-blend-button" disabled>+ Add to Blend</button>
      </div>

      <div class="selection-right" id="bean-details-panel">
        <div class="details-placeholder" id="details-placeholder">
          Choose a bean from the list to view its cup characteristics.
        </div>
        <div class="details-active" id="details-active" style="display: none;">
          <h3 class="details-title" id="details-title">Burundi Kayave</h3>
          <p class="details-characteristics" id="details-desc">Aromas of maple syrup...</p>
          <div class="details-stats-row">
            <span class="details-stat-pill" id="details-process-pill">Process: Washed</span>
            <span class="details-stat-pill" id="details-acidity-pill">Acidity: 4/5</span>
            <span class="details-stat-pill" id="details-body-pill">Body: 4/5</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Step 2 & 3: Mixer & Live Taste Preview -->
  <div class="mixer-preview-layout">
    
    <!-- Mixer Panel -->
    <div class="mixer-panel">
      <h2 class="panel-title">2. Adjust Composition & Roasts</h2>
      <div class="mixer-empty-note" id="mixer-empty-note">
        No beans added. Use the selector above to build your recipe.
      </div>
      <div id="mixer-container"></div>
    </div>

    <!-- Preview Panel -->
    <div class="preview-panel">
      <h2 class="panel-title">3. Predicted Taste Profile</h2>
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
    <h2 class="bean-selector-title" style="margin-top: 0;">4. Place Your Custom Blend Order</h2>
    
    <div class="price-box">
      Price: $32 for one 12oz bag
    </div>

    <form action="https://docs.google.com/forms/d/e/1FAIpQLSdqjeaQw5cFzSsCq2IMTZraYBSclfbjnXSwZ8KvqpCEuWTHdA/formResponse" method="POST" class="order-form" id="byob-form">
      
      <!-- Recipe details and total price are dynamically injected here on submission -->
      <input type="hidden" name="entry.52896454" id="hidden-recipe" value="">
      <input type="hidden" name="entry.260019949" id="hidden-total" value="$32">

      <div class="order-field">
        <label for="byob-name">Name</label>
        <input id="byob-name" type="text" name="entry.1582897284" required autocomplete="name">
      </div>

      <div class="order-field">
        <label for="byob-email">Email</label>
        <input id="byob-email" type="email" name="entry.1584009735" required autocomplete="email">
      </div>

      <div class="order-field">
        <label for="byob-blend-grind-select">Grind level</label>
        <select id="byob-blend-grind-select" class="subscribe-select" style="width: 100%;">
          <option value="Whole Bean" selected>Whole Bean</option>
          <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
          <option value="Coarser — French Press">Coarser — French Press</option>
          <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
          <option value="Finer — Pour Over">Finer — Pour Over</option>
          <option value="Finest — Espresso">Finest — Espresso</option>
        </select>
      </div>

      <fieldset class="order-delivery">
        <legend>Delivery method</legend>
        <div class="pill-radios">
          <label class="order-radio"><input type="radio" name="entry.577333073" value="Pickup" checked> Pickup</label>
          <label class="order-radio"><input type="radio" name="entry.577333073" value="Hand delivery"> Hand delivery</label>
          <label class="order-radio order-radio--disabled"><input type="radio" name="entry.577333073" value="Ship to me" disabled> Ship to me</label>
        </div>
        <p id="byob-delivery-note" class="order-delivery-note" style="display:none;">Available in Guilford, (North) Branford, Madison, and Durham.</p>
        <p class="order-delivery-note">Shipping coming soon.</p>
      </fieldset>

      <div id="byob-shipping" class="order-shipping" style="display:none;">
        <div class="order-field">
          <label for="byob-address">Street address</label>
          <input id="byob-address" type="text" name="entry.1996760403" autocomplete="street-address">
        </div>
        <div class="order-field">
          <label for="byob-city">City</label>
          <input id="byob-city" type="text" name="entry.571087983" autocomplete="address-level2">
        </div>
        <div class="order-field-row">
          <div class="order-field">
            <label for="byob-state">State</label>
            <input id="byob-state" type="text" name="entry.821511879" autocomplete="address-level1">
          </div>
          <div class="order-field">
            <label for="byob-zip">ZIP</label>
            <input id="byob-zip" type="text" name="entry.445360762" autocomplete="postal-code">
          </div>
        </div>
      </div>

      <div class="order-field">
        <label for="byob-notes">Notes (optional)</label>
        <textarea id="byob-notes" name="entry.2042833038" rows="3" placeholder="Any preferences, notes, or roast instructions..."></textarea>
      </div>

      <div class="order-actions">
        <button type="submit" class="order-submit" id="byob-submit-btn" disabled>Submit Blend Order</button>
      </div>

      <p class="order-status" role="status" aria-live="polite"></p>
    </form>
  </div>

</div>
</div>

<script src="{{ '/js/byob-mixer.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
(function () {
  var rawBeans = [
    {% if site.data.custom_beans %}
      {% for b in site.data.custom_beans %}
        {% if b.name and b.name != "" %}
        {
          name: {{ b.name | jsonify }},
          url: {{ b.url | default: "" | jsonify }},
          price: parseFloat({{ b.price_1lb | jsonify }}) || 0,
          cup_characteristics: {{ b.cup_characteristics | default: "" | jsonify }},
          roasting_notes: {{ b.roasting_notes | default: "" | jsonify }}
        },
        {% endif %}
      {% endfor %}
    {% endif %}
    {% if site.data.other_beans %}
      {% for b in site.data.other_beans %}
        {% if b.name and b.name != "" %}
        {
          name: {{ b.name | jsonify }},
          url: {{ b.url | default: "" | jsonify }},
          price: parseFloat({{ b.price_1lb | jsonify }}) || 0,
          cup_characteristics: {{ b.cup_characteristics | default: "" | jsonify }},
          roasting_notes: {{ b.roasting_notes | default: "" | jsonify }}
        },
        {% endif %}
      {% endfor %}
    {% endif %}
    {% if site.data.roastmasters_beans %}
      {% for b in site.data.roastmasters_beans %}
        {% if b.name and b.name != "" %}
        {
          name: {{ b.name | jsonify }},
          url: {{ b.url | default: "" | jsonify }},
          price: parseFloat({{ b.price_1lb | jsonify }}) || 0,
          cup_characteristics: {{ b.cup_characteristics | default: "" | jsonify }},
          roasting_notes: {{ b.roasting_notes | default: "" | jsonify }}
        },
        {% endif %}
      {% endfor %}
    {% endif %}
  ];

  initBYOBMixer({
    rawBeans: rawBeans,
    thanksUrl: {{ '/thanks/' | relative_url | jsonify }}
  });
})();
</script>
