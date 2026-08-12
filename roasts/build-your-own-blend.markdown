---
layout: default
title: "BYOB — Build Your Own Blend"
permalink: /roasts/build-your-own-blend/
---

<style>
.byob-container {
  max-width: 900px;
  margin: 0 auto;
}



/* Workspace Layout */
.selection-workspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

@media (min-width: 768px) {
  .selection-workspace {
    grid-template-columns: 1fr 1fr;
  }
}

.selection-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

.selection-left label {
  font-weight: 700;
  font-size: 1.05rem;
}


.add-to-blend-button {
  background-color: #e8e0d5;
  color: #555555;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.15s, color 0.15s, opacity 0.15s;
}

.add-to-blend-button:hover:not(:disabled) {
  background-color: #2c1e14;
  color: #faf8f5;
}

.add-to-blend-button:disabled {
  background-color: #f1ebd9;
  color: #bbbbbb;
  cursor: not-allowed;
  opacity: 0.5;
}

.selection-right {
  border-left: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 150px;
}

@media (min-width: 768px) {
  .selection-right {
    border-left: 1px solid #eaeaea;
    padding-left: 2rem;
  }
}

.details-placeholder {
  color: #888888;
  font-style: italic;
  text-align: center;
  width: 100%;
}

.details-active {
  animation: fadeIn 0.3s ease;
}

.details-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0.8rem;
  color: #222222;
}

.details-characteristics {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555555;
  margin-bottom: 1.2rem;
}

.details-stats-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.details-stat-pill {
  background: #f8f9fa;
  border: 1px solid #eaeaea;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
}

/* Mixer & Preview Panels */
.mixer-preview-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.mixer-panel, .preview-panel {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
}

.mixer-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.mixer-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.mixer-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.mixer-item-title {
  font-weight: normal;
  font-size: 0.9rem;
}

.remove-bean-btn {
  background: #fdf2f2;
  border: 1px solid #fbd5d5;
  color: #c0392b;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.remove-bean-btn:hover {
  background: #c0392b;
  border-color: #c0392b;
  color: #ffffff;
}

.mixer-item-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.percentage-slider {
  flex-grow: 1;
  accent-color: #8a7060;
  cursor: pointer;
}

.percentage-label {
  font-weight: bold;
  font-size: 1rem;
  min-width: 45px;
  text-align: right;
  color: #8a7060;
}




/* Taste Preview Gauge */
.preview-stat {
  margin-bottom: 2rem;
}

.preview-stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
}

.preview-stat-name {
  font-weight: normal;
  color: #333333;
}

.preview-stat-value {
  color: #8a7060;
  font-weight: normal;
}

.preview-bar-outer {
  height: 20px;
  background: #f0f0f5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
}

.preview-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #8a7060, #a88f7f);
  border-radius: 10px;
  width: 0%;
  transition: width 0.3s ease;
  box-shadow: 0 1px 2px rgba(138,112,96,0.15);
}

.preview-notes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.preview-note-tag {
  background: #fdfcfb;
  color: #8a7060;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e7dbd5;
}

.preview-placeholder {
  color: #888888;
  font-style: italic;
  text-align: center;
  padding: 2rem 0;
}

/* Form Section */
.order-section {
  background: #fdfdfd;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.price-box {
  background: #fcfaf7;
  border: 1px solid #e7dbd5;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.15rem;
  color: #2c1e14;
}

.order-submit:disabled {
  background-color: #cccccc;
  border-color: #cccccc;
  cursor: not-allowed;
}

.mixer-empty-note {
  text-align: center;
  color: #888888;
  padding: 2rem 0;
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

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

<script>
(function () {
  var BEANS_DATA = [
    {% for b in site.data.roastmasters_beans %}
      {
        name: {{ b.name | jsonify }},
        url: {{ b.url | jsonify }},
        price: parseFloat("{{ b.price_1lb }}") || 0,
        cup_characteristics: {{ b.cup_characteristics | jsonify }},
        roasting_notes: {{ b.roasting_notes | jsonify }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  function getProfile(name) {
    var bean = getBeanData(name);
    var text = (bean.cup_characteristics || "").toLowerCase();
    var nameLower = (name || "").toLowerCase();

    var origin = "";
    var origins = ["Bolivia", "Brazil", "Burundi", "Colombia", "Costa Rica", "Ethiopia", "Guatemala", "Kenya", "Panama", "Peru", "Sumatra"];
    for (var i = 0; i < origins.length; i++) {
      if (nameLower.indexOf(origins[i].toLowerCase()) >= 0) {
        origin = origins[i];
        break;
      }
    }
    if (!origin && name) {
      origin = name.split(" ")[0];
    }

    var acidity = 3;
    if (text.indexOf("zesty") >= 0 || text.indexOf("bright") >= 0 || text.indexOf("piquant") >= 0 || text.indexOf("high acidity") >= 0 || text.indexOf("acetic") >= 0 || text.indexOf("tart") >= 0 || text.indexOf("citric") >= 0 || nameLower.indexOf("kenya") >= 0 || nameLower.indexOf("yirgacheffe") >= 0) {
      acidity = 4;
    } else if (text.indexOf("low acidity") >= 0 || text.indexOf("light acidity") >= 0 || text.indexOf("mild acidity") >= 0 || nameLower.indexOf("sumatra") >= 0 || nameLower.indexOf("brazil") >= 0) {
      acidity = 2;
    }

    var body = 3;
    if (text.indexOf("heavy") >= 0 || text.indexOf("viscous") >= 0 || text.indexOf("creamy") >= 0 || text.indexOf("thick") >= 0 || text.indexOf("smooth body") >= 0 || text.indexOf("broad mouthfeel") >= 0 || text.indexOf("syrupy") >= 0 || nameLower.indexOf("sumatra") >= 0) {
      body = 4;
    } else if (text.indexOf("delicate") >= 0 || text.indexOf("light body") >= 0 || text.indexOf("silky") >= 0) {
      body = 2;
    }

    var notes = [];
    var possibleNotes = [
      "Bittersweet Chocolate", "Dark Chocolate", "Milk Chocolate", "Baker's Chocolate", "Chocolate", "Cocoa",
      "Plum", "Raisin", "Dates", "Red Apple", "Green Apple", "Meyer Lemon", "Lemon", "Lime", "Orange", "Tangerine",
      "Blackberry", "Blueberry", "Blackcurrant", "Cherry", "Black Cherry", "Peach", "Nectarine", "Melon", "Papaya", "Fig", "Tamarind", "Pineapple", "Mango", "Kiwi", "Grape",
      "Honey", "Maple Syrup", "Maple", "Butterscotch", "Brown Sugar", "Sugar", "Molasses",
      "Jasmine", "Rosewater", "Lavender", "Magnolia", "Floral", "Bergamot", "Lemongrass",
      "Hazelnut", "Toasted Almond", "Almond", "Chestnut", "Pecan", "Vanilla",
      "Black Tea", "Cedar", "Earthy", "Smoky", "Tobacco", "Cola"
    ];
    possibleNotes.forEach(function (pn) {
      if (text.indexOf(pn.toLowerCase()) >= 0 && notes.indexOf(pn) < 0) {
        notes.push(pn);
      }
    });
    if (notes.length === 0) {
      notes = ["Sweet", "Balanced"];
    }

    return {
      origin: origin,
      acidity: acidity,
      body: body,
      notes: notes
    };
  }

  var selectedBeans = []; // Array of selected bean name strings

  // Elements
  var filterOrigin = document.getElementById('filter-origin');
  var filterNotes = document.getElementById('filter-notes');
  var filterAcidity = document.getElementById('filter-acidity');
  var filterBody = document.getElementById('filter-body');
  
  var beanDropdown = document.getElementById('bean-select-dropdown');
  var addBtn = document.getElementById('add-to-blend-btn');
  
  var detailsPlaceholder = document.getElementById('details-placeholder');
  var detailsActive = document.getElementById('details-active');
  var detailsTitle = document.getElementById('details-title');
  var detailsDesc = document.getElementById('details-desc');
  var detailsAcidity = document.getElementById('details-acidity-pill');
  var detailsBody = document.getElementById('details-body-pill');

  var mixerContainer = document.getElementById('mixer-container');
  
  var previewPlaceholder = document.getElementById('preview-placeholder');
  var previewContent = document.getElementById('preview-content');
  var acidityText = document.getElementById('preview-acidity-text');
  var acidityBar = document.getElementById('preview-acidity-bar');
  var bodyText = document.getElementById('preview-body-text');
  var bodyBar = document.getElementById('preview-body-bar');
  var notesTags = document.getElementById('preview-notes-tags');

  var submitBtn = document.getElementById('byob-submit-btn');
  var hiddenRecipe = document.getElementById('hidden-recipe');

  // Initialize
  updateDropdownOptions();

  // Listeners for Filters
  filterOrigin.addEventListener('change', updateDropdownOptions);
  filterNotes.addEventListener('change', updateDropdownOptions);
  filterAcidity.addEventListener('change', updateDropdownOptions);
  filterBody.addEventListener('change', updateDropdownOptions);

  // Listen for Dropdown Selection change
  beanDropdown.addEventListener('change', function () {
    var name = this.value;
    if (!name) {
      clearDetails();
      addBtn.disabled = true;
      return;
    }

    var bean = getBeanData(name);
    var profile = getProfile(name);

    detailsPlaceholder.style.display = 'none';
    detailsActive.style.display = '';
    
    detailsTitle.textContent = name;
    detailsDesc.textContent = bean.cup_characteristics || "No description available.";
    detailsAcidity.textContent = 'Acidity: ' + profile.acidity + '/5';
    detailsBody.textContent = 'Body: ' + profile.body + '/5';

    // Enable add button if not already in blend and less than 3
    if (selectedBeans.indexOf(name) < 0 && selectedBeans.length < 3) {
      addBtn.disabled = false;
    } else {
      addBtn.disabled = true;
    }
  });

  // Listen for Add to Blend button
  addBtn.addEventListener('click', function () {
    var name = beanDropdown.value;
    if (!name || selectedBeans.indexOf(name) >= 0 || selectedBeans.length >= 3) return;

    selectedBeans.push(name);
    
    rebuildMixer();
    updateTasteProfile();
    validateForm();
    
    // Reset selection workspace
    beanDropdown.value = '';
    clearDetails();
    addBtn.disabled = true;
    
    // Refresh dropdown options (which removes this bean from options)
    updateDropdownOptions();
  });

  // Re-filter and update options in dropdown
  function updateDropdownOptions() {
    var originVal = filterOrigin.value;
    var noteKeyword = filterNotes.value;
    var acidityVal = filterAcidity.value;
    var bodyVal = filterBody.value;

    var currentSelect = beanDropdown.value;

    // Clear dropdown except first placeholder option
    beanDropdown.innerHTML = '<option value="" disabled selected>Select from list...</option>';

    BEANS_DATA.forEach(function (b) {
      // Exclude if already in blend
      if (selectedBeans.indexOf(b.name) >= 0) return;

      // Exclude decafs, espresso blends, price over $12/lb, and specific excluded beans
      var nameLower = b.name.toLowerCase();
      if (nameLower.indexOf('decaf') >= 0 || 
          nameLower.indexOf('espresso') >= 0 || 
          nameLower.indexOf('villa sarchi') >= 0 || 
          b.price > 12.00) {
        return;
      }

      var profile = getProfile(b.name);

      // Apply origin filter
      if (originVal && profile.origin !== originVal) return;

      // Apply flavor profile keyword filter
      if (noteKeyword) {
        var hasMatch = false;
        var characteristicsText = b.cup_characteristics.toLowerCase();
        
        if (noteKeyword === 'chocolate' && (characteristicsText.indexOf('chocolate') >= 0 || characteristicsText.indexOf('cocoa') >= 0)) hasMatch = true;
        else if (noteKeyword === 'fruit' && (characteristicsText.indexOf('plum') >= 0 || characteristicsText.indexOf('berry') >= 0 || characteristicsText.indexOf('cherry') >= 0 || characteristicsText.indexOf('fig') >= 0 || characteristicsText.indexOf('apple') >= 0 || characteristicsText.indexOf('grape') >= 0 || characteristicsText.indexOf('melon') >= 0 || characteristicsText.indexOf('date') >= 0)) hasMatch = true;
        else if (noteKeyword === 'citrus' && (characteristicsText.indexOf('lemon') >= 0 || characteristicsText.indexOf('lime') >= 0 || characteristicsText.indexOf('orange') >= 0 || characteristicsText.indexOf('tangerine') >= 0 || characteristicsText.indexOf('citrus') >= 0)) hasMatch = true;
        else if (noteKeyword === 'sweet' && (characteristicsText.indexOf('honey') >= 0 || characteristicsText.indexOf('maple') >= 0 || characteristicsText.indexOf('sugar') >= 0 || characteristicsText.indexOf('molasses') >= 0 || characteristicsText.indexOf('butterscotch') >= 0)) hasMatch = true;
        else if (noteKeyword === 'floral' && (characteristicsText.indexOf('jasmine') >= 0 || characteristicsText.indexOf('floral') >= 0 || characteristicsText.indexOf('rosewater') >= 0 || characteristicsText.indexOf('lavender') >= 0)) hasMatch = true;
        else if (noteKeyword === 'nutty' && (characteristicsText.indexOf('hazelnut') >= 0 || characteristicsText.indexOf('almond') >= 0 || characteristicsText.indexOf('chestnut') >= 0 || characteristicsText.indexOf('pecan') >= 0)) hasMatch = true;
        else if (noteKeyword === 'earthy' && (characteristicsText.indexOf('earthy') >= 0 || characteristicsText.indexOf('smoky') >= 0 || characteristicsText.indexOf('tobacco') >= 0 || characteristicsText.indexOf('cedar') >= 0)) hasMatch = true;

        if (!hasMatch) return;
      }

      // Apply acidity filter
      if (acidityVal) {
        if (acidityVal === 'low' && profile.acidity > 2) return;
        if (acidityVal === 'medium' && profile.acidity !== 3) return;
        if (acidityVal === 'high' && profile.acidity < 4) return;
      }

      // Apply body filter
      if (bodyVal) {
        if (bodyVal === 'light' && profile.body > 2) return;
        if (bodyVal === 'medium' && profile.body !== 3) return;
        if (bodyVal === 'heavy' && profile.body < 4) return;
      }

      // Add to dropdown
      var opt = document.createElement('option');
      opt.value = b.name;
      opt.textContent = b.name;
      beanDropdown.appendChild(opt);
    });

    // Try to restore previous selection if it is still available
    var opts = beanDropdown.querySelectorAll('option');
    var found = false;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === currentSelect) {
        beanDropdown.value = currentSelect;
        found = true;
        break;
      }
    }

    if (!found) {
      clearDetails();
      addBtn.disabled = true;
    }
  }

  function clearDetails() {
    detailsPlaceholder.style.display = '';
    detailsActive.style.display = 'none';
  }

  function getBeanData(name) {
    for (var i = 0; i < BEANS_DATA.length; i++) {
      if (BEANS_DATA[i].name === name) return BEANS_DATA[i];
    }
    return {};
  }

  // Auto-balance sliders to maintain exactly 100% total (only in multiples of 10%)
  function adjustSliders(changedName, newValue) {
    if (selectedBeans.length <= 1) {
      // If only 1 bean, lock it at 100%
      var id = escapeId(selectedBeans[0]);
      var slider = document.getElementById('slider-' + id);
      var label = document.getElementById('label-' + id);
      if (slider) slider.value = 100;
      if (label) label.textContent = '100%';
      return;
    }

    // Save current slider values
    var values = {};
    selectedBeans.forEach(function (name) {
      var slider = document.getElementById('slider-' + escapeId(name));
      values[name] = slider ? parseInt(slider.value, 10) : 0;
    });

    // Update the changed one
    values[changedName] = newValue;

    // Remaining percentage to distribute
    var remaining = 100 - newValue;

    // Filter to other beans
    var otherBeans = selectedBeans.filter(function (name) {
      return name !== changedName;
    });

    if (otherBeans.length === 1) {
      // 2 beans total: other bean gets the remaining percentage
      values[otherBeans[0]] = remaining;
    } else if (otherBeans.length === 2) {
      // 3 beans total: distribute remaining proportionally, rounded to nearest 10%
      var otherSum = values[otherBeans[0]] + values[otherBeans[1]];
      if (otherSum === 0) {
        values[otherBeans[0]] = Math.round((remaining / 2) / 10) * 10;
        values[otherBeans[1]] = remaining - values[otherBeans[0]];
      } else {
        var val0 = Math.round(((values[otherBeans[0]] / otherSum) * remaining) / 10) * 10;
        values[otherBeans[0]] = val0;
        values[otherBeans[1]] = remaining - val0;
      }
    }

    // Write values back to sliders and labels in the DOM
    selectedBeans.forEach(function (name) {
      var id = escapeId(name);
      var slider = document.getElementById('slider-' + id);
      var label = document.getElementById('label-' + id);
      if (slider) {
        slider.value = values[name];
        if (label) label.textContent = values[name] + '%';
      }
    });
  }

  // 2. Rebuild the Mixer Controls based on selected beans
  function rebuildMixer() {
    // Save current values if they exist, to restore them
    var currentValues = {};
    var currentRoasts = {};
    selectedBeans.forEach(function (name) {
      var slider = document.getElementById('slider-' + escapeId(name));
      var roast = document.getElementById('roast-' + escapeId(name));
      if (slider) currentValues[name] = parseInt(slider.value, 10);
      if (roast) currentRoasts[name] = roast.value;
    });

    mixerContainer.innerHTML = '';

    if (selectedBeans.length === 0) {
      document.getElementById('mixer-empty-note').style.display = '';
      return;
    }

    document.getElementById('mixer-empty-note').style.display = 'none';

    selectedBeans.forEach(function (name, idx) {
      var val;
      if (selectedBeans.length === 1) {
        val = 100;
      } else if (selectedBeans.length === 2) {
        val = 50;
      } else {
        val = (idx === 0) ? 40 : 30;
      }

      var roastVal = currentRoasts[name] !== undefined ? currentRoasts[name] : 'Medium';
      var id = escapeId(name);

      var item = document.createElement('div');
      item.className = 'mixer-item';
      item.innerHTML = 
        '<div class="mixer-item-header">' +
          '<span class="mixer-item-title">' + escapeHtml(name) + '</span>' +
          '<button type="button" class="remove-bean-btn" data-bean="' + escapeHtml(name) + '">Remove</button>' +
        '</div>' +
        '<div class="mixer-item-controls">' +
          '<div class="slider-container">' +
            '<input type="range" class="percentage-slider" id="slider-' + id + '" min="0" max="100" step="10" value="' + val + '">' +
            '<span class="percentage-label" id="label-' + id + '">' + val + '%</span>' +
          '</div>' +
          '<select class="subscribe-select" style="width: 100%;" id="roast-' + id + '">' +
            '<option value="Light"' + (roastVal === 'Light' ? ' selected' : '') + '>Light Roast</option>' +
            '<option value="Medium"' + (roastVal === 'Medium' ? ' selected' : '') + '>Medium Roast</option>' +
            '<option value="Dark"' + (roastVal === 'Dark' ? ' selected' : '') + '>Dark Roast</option>' +
          '</select>' +
        '</div>';

      mixerContainer.appendChild(item);

      // Listen for slider adjustment
      var slider = item.querySelector('.percentage-slider');
      
      slider.addEventListener('input', function () {
        adjustSliders(name, parseInt(this.value, 10));
        updateTasteProfile();
        validateForm();
      });

      // Listen for roast select adjustment
      var select = item.querySelector('.subscribe-select');
      select.addEventListener('change', function () {
        updateTasteProfile();
        validateForm();
      });

      // Listen for remove button click
      var removeBtn = item.querySelector('.remove-bean-btn');
      removeBtn.addEventListener('click', function () {
        var beanToRemove = this.getAttribute('data-bean');
        var index = selectedBeans.indexOf(beanToRemove);
        if (index >= 0) {
          selectedBeans.splice(index, 1);
          rebuildMixer();
          updateTasteProfile();
          validateForm();
          updateDropdownOptions();
        }
      });
    });
  }

  // Helper to adjust tasting notes based on roast level
  function getAdjustedNotes(name, baseNotes, roastVal) {
    var notes = baseNotes.slice();
    if (roastVal === 'Light') {
      notes = notes.filter(function (note) {
        var n = note.toLowerCase();
        return n.indexOf('chocolate') < 0 && 
               n.indexOf('bittersweet') < 0 && 
               n.indexOf('smoky') < 0 && 
               n.indexOf('tobacco') < 0 && 
               n.indexOf('earthy') < 0 &&
               n.indexOf('molasses') < 0 &&
               n.indexOf('cedar') < 0;
      });
      if (notes.indexOf('Bright Citrus') < 0 && name.toLowerCase().indexOf('kenya') >= 0) {
        notes.push('Bright Citrus');
      }
      if (notes.indexOf('Floral Nuances') < 0 && (name.toLowerCase().indexOf('geisha') >= 0 || name.toLowerCase().indexOf('yirgacheffe') >= 0)) {
        notes.push('Floral Nuances');
      }
    } else if (roastVal === 'Dark') {
      notes = notes.filter(function (note) {
        var n = note.toLowerCase();
        return n.indexOf('floral') < 0 && 
               n.indexOf('jasmine') < 0 && 
               n.indexOf('rosewater') < 0 && 
               n.indexOf('lemon') < 0 && 
               n.indexOf('lime') < 0 && 
               n.indexOf('citrus') < 0 && 
               n.indexOf('bright') < 0 && 
               n.indexOf('apple') < 0;
      });
      if (notes.indexOf('Bittersweet Chocolate') < 0) {
        notes.push('Bittersweet Chocolate');
      }
      if (notes.indexOf('Smoky / Roasty') < 0 && (name.toLowerCase().indexOf('sumatra') >= 0 || name.toLowerCase().indexOf('brazil') >= 0 || name.toLowerCase().indexOf('antigua') >= 0)) {
        notes.push('Smoky / Roasty');
      }
    }
    return notes;
  }

  // 3. Compute taste profile in real-time
  function updateTasteProfile() {
    if (selectedBeans.length === 0) {
      previewPlaceholder.style.display = '';
      previewContent.style.display = 'none';
      return;
    }

    previewPlaceholder.style.display = 'none';
    previewContent.style.display = '';

    var totalAcidity = 0;
    var totalBody = 0;
    var sumOfWeights = 0;
    var notesWeight = {};

    selectedBeans.forEach(function (name) {
      var slider = document.getElementById('slider-' + escapeId(name));
      var weight = slider ? parseInt(slider.value, 10) : 0;
      var profile = getProfile(name);

      var roast = document.getElementById('roast-' + escapeId(name));
      var roastVal = roast ? roast.value : 'Medium';
      
      var acidityMod = 0;
      var bodyMod = 0;
      if (roastVal === 'Light') {
        acidityMod = 0.5;
        bodyMod = -0.5;
      } else if (roastVal === 'Dark') {
        acidityMod = -0.8;
        bodyMod = 0.5;
      }

      var adjAcidity = Math.max(1, Math.min(5, profile.acidity + acidityMod));
      var adjBody = Math.max(1, Math.min(5, profile.body + bodyMod));

      totalAcidity += adjAcidity * weight;
      totalBody += adjBody * weight;
      sumOfWeights += weight;

      // Group tasting notes by weight, adjusting notes for roast level
      var adjustedNotes = getAdjustedNotes(name, profile.notes, roastVal);
      adjustedNotes.forEach(function (note) {
        notesWeight[note] = (notesWeight[note] || 0) + weight;
      });
    });

    // Handle 0 weights division safely
    var avgAcidity = sumOfWeights > 0 ? (totalAcidity / sumOfWeights) : 3;
    var avgBody = sumOfWeights > 0 ? (totalBody / sumOfWeights) : 3;

    // Display acidity bar and text
    var acidityPercent = (avgAcidity / 5) * 100;
    acidityBar.style.width = acidityPercent + '%';
    if (avgAcidity > 3.8) {
      acidityText.textContent = 'Bright & Crisp (' + avgAcidity.toFixed(1) + '/5)';
    } else if (avgAcidity < 2.5) {
      acidityText.textContent = 'Smooth & Low-acid (' + avgAcidity.toFixed(1) + '/5)';
    } else {
      acidityText.textContent = 'Balanced (' + avgAcidity.toFixed(1) + '/5)';
    }

    // Display body bar and text
    var bodyPercent = (avgBody / 5) * 100;
    bodyBar.style.width = bodyPercent + '%';
    if (avgBody > 3.8) {
      bodyText.textContent = 'Full & Viscous (' + avgBody.toFixed(1) + '/5)';
    } else if (avgBody < 2.5) {
      bodyText.textContent = 'Light & Tea-like (' + avgBody.toFixed(1) + '/5)';
    } else {
      bodyText.textContent = 'Medium Body (' + avgBody.toFixed(1) + '/5)';
    }

    // Sort and display tasting notes
    notesTags.innerHTML = '';
    var sortedNotes = Object.keys(notesWeight).sort(function (a, b) {
      return notesWeight[b] - notesWeight[a];
    });

    // Take top 6 notes
    sortedNotes.slice(0, 6).forEach(function (note) {
      var tag = document.createElement('span');
      tag.className = 'preview-note-tag';
      tag.textContent = note;
      notesTags.appendChild(tag);
    });
  }

  // Enable/disable form submission button
  function validateForm() {
    if (selectedBeans.length > 0) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  // Compile recipe details string for form submission
  function getRecipeString() {
    var parts = [];
    selectedBeans.forEach(function (name) {
      var slider = document.getElementById('slider-' + escapeId(name));
      var roast = document.getElementById('roast-' + escapeId(name));
      var pct = slider ? slider.value : '0';
      var rst = roast ? roast.value : 'Medium';
      parts.push(name + ' (' + pct + '% - ' + rst + ')');
    });
    var grindEl = document.getElementById('byob-blend-grind-select');
    var grindVal = grindEl ? grindEl.value : 'Whole Bean';
    return parts.join(', ') + ' [Grind: ' + grindVal + ']';
  }

  // Escape helpers
  function escapeId(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // 4. Form Submission and Safely Redirecting
  var form = document.getElementById('byob-form');
  var status = form.querySelector('.order-status');

  var deliveryRadios = form.querySelectorAll('input[name="entry.577333073"]');
  var addressFields = document.getElementById('byob-shipping');
  var deliveryNote = document.getElementById('byob-delivery-note');
  
  for (var di = 0; di < deliveryRadios.length; di++) {
    deliveryRadios[di].addEventListener('change', function () {
      var v = this.value;
      addressFields.style.display = (v === 'Pickup') ? 'none' : '';
      deliveryNote.style.display = (v === 'Hand delivery') ? '' : 'none';

      // Toggle required attribute for address inputs
      var inputs = addressFields.querySelectorAll('input');
      inputs.forEach(function (inp) {
        if (v === 'Pickup') {
          inp.removeAttribute('required');
        } else {
          inp.setAttribute('required', 'true');
        }
      });
    });
  }

  var iframe = document.createElement('iframe');
  iframe.name = 'byob-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'byob-submit-frame';

  form.addEventListener('submit', function (e) {
    // Populate hidden field with the recipe
    hiddenRecipe.value = getRecipeString();

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
