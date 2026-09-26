---
layout: default
title: "BYOB — Build Your Own Blend"
permalink: /roasts/build-your-own-blend/
---

<div class="roast-minimal-vertical">
<div class="byob-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <div class="hero-susan-wrap">
      <div class="susan-dots susan-dots--grad-left" aria-hidden="true">
        <span class="susan-dot"></span>
        <span class="susan-dot"></span>
        <span class="susan-dot"></span>
      </div>
      <div class="susan-birds susan-birds--hero">
        <img src="{{ '/images/audubon-cardinal-transparent.png' | relative_url }}" alt="" class="susan-hero-bird susan-hero-bird-side" aria-hidden="true" fetchpriority="high" decoding="async">
        <img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="susan-hero-bird susan-hero-bird-center" aria-hidden="true" fetchpriority="high" decoding="async">
        <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="" class="susan-hero-bird susan-hero-bird-side" aria-hidden="true" fetchpriority="high" decoding="async">
      </div>
      <div class="susan-dots susan-dots--grad-right" aria-hidden="true">
        <span class="susan-dot"></span>
        <span class="susan-dot"></span>
        <span class="susan-dot"></span>
      </div>
    </div>
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">BYOB</h1>
  </div>

  <p class="roast-mv-tasting"><em>Build Your Own Blend</em><br>Combine up to three varieties of green beans, select individual roast levels, and design a custom coffee profile exactly to your taste.</p>

  <div class="roast-mv-divider"></div>

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
    <h2 class="bean-selector-title">1. Choose Coffee Beans</h2>
    
    <!-- Filters Row -->
    <div class="filters-row" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-origin" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Origin</label>
        <select id="filter-origin" class="subscribe-select" style="min-width: 140px;">
          <option value="">All Origins</option>
          {% for o in uniq_origins %}
            <option value="{{ o }}">{{ o }}</option>
          {% endfor %}
        </select>
      </div>

      <div class="filter-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
        <label for="filter-process" class="roast-mv-meta-label" style="text-align: left; margin-bottom: 0;">Process</label>
        <select id="filter-process" class="subscribe-select" style="min-width: 140px;">
          <option value="">All Processes</option>
          {% for p in uniq_procs %}
            <option value="{{ p | downcase }}">{{ p }}</option>
          {% endfor %}
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
    {% for r in single_origins %}
      {% assign s_meta = site.data.statuses[r.status] %}
      {% if s_meta == nil or s_meta.orderable != false %}
        {% assign rp = r.price | default: r.prices %}
        {% assign p1 = rp["1lb"] | default: rp["12oz"] | default: 16 %}
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
          price: {{ p1 }},
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
