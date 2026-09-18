/**
 * Yellow Wing Roasters - BYOB (Build Your Own Blend) Mixer
 * Interactive blend ratio calculator, bean selector, and custom batch submission.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initBYOBMixer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initBYOBMixer(config) {
    config = config || {};
    var rawBeans = config.rawBeans || [];
  // Deduplicate beans by name (custom beans listed first take priority)
  var seen = {};
  var BEANS_DATA = [];
  for (var i = 0; i < rawBeans.length; i++) {
    var item = rawBeans[i];
    if (item && item.name) {
      var key = item.name.trim().toLowerCase();
      if (!seen[key]) {
        seen[key] = true;
        BEANS_DATA.push(item);
      }
    }
  }

  function getProfile(name) {
    var bean = getBeanData(name);
    var text = (((bean.cup_characteristics || "") + " " + (bean.roasting_notes || ""))).toLowerCase();
    var nameLower = (name || "").toLowerCase();

    var origin = "";
    var origins = [
      "Bolivia", "Brazil", "Burundi", "Colombia", "Costa Rica", "DR Congo",
      "Ecuador", "El Salvador", "Ethiopia", "Guatemala", "Honduras", "Indonesia",
      "Java", "Kenya", "Mexico", "Nicaragua", "Panama", "Papua New Guinea",
      "Peru", "Rwanda", "Sumatra", "Tanzania", "Uganda", "Yemen"
    ];
    for (var i = 0; i < origins.length; i++) {
      if (nameLower.indexOf(origins[i].toLowerCase()) >= 0) {
        origin = origins[i];
        break;
      }
    }
    if (!origin && name) {
      origin = name.split(" ")[0];
    }

    var process = "washed";
    var processLabel = "Washed";

    if (nameLower.indexOf("asd") >= 0 || nameLower.indexOf("anaerobic") >= 0 || /\b(?:anaerobic|carbonic|thermal shock)\b/i.test(text)) {
      process = "anaerobic";
      processLabel = "Anaerobic / ASD";
    } else if (nameLower.indexOf("honey") >= 0 || /\b(?:honey process|pulped natural|semi-washed)\b/i.test(text)) {
      process = "honey";
      processLabel = "Honey";
    } else if (nameLower.indexOf("natural") >= 0 || nameLower.indexOf("dry process") >= 0 || nameLower.indexOf("dry-process") >= 0 || /\b(?:natural process|natural method|dry process|dry-process|naturals as beans)\b/i.test(text) || /\bnaturals\b/i.test(text)) {
      process = "natural";
      processLabel = "Natural";
    } else if (/\b(?:wet hulled|wet-hulled|giling basah)\b/i.test(text) || nameLower.indexOf("sumatra") >= 0) {
      process = "wet-hulled";
      processLabel = "Wet-Hulled";
    } else if (nameLower.indexOf("washed") >= 0 || nameLower.indexOf("washing station") >= 0 || /\b(?:washed coffee|washed coffees|washed process|fully washed|washing station)\b/i.test(text)) {
      process = "washed";
      processLabel = "Washed";
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
      process: process,
      processLabel: processLabel,
      acidity: acidity,
      body: body,
      notes: notes
    };
  }

  var selectedBeans = []; // Array of selected bean name strings

  // Elements
  var filterOrigin = document.getElementById('filter-origin');
  var filterProcess = document.getElementById('filter-process');
  var filterNotes = document.getElementById('filter-notes');
  var filterAcidity = document.getElementById('filter-acidity');
  var filterBody = document.getElementById('filter-body');
  
  var beanDropdown = document.getElementById('bean-select-dropdown');
  var addBtn = document.getElementById('add-to-blend-btn');
  
  var detailsPlaceholder = document.getElementById('details-placeholder');
  var detailsActive = document.getElementById('details-active');
  var detailsTitle = document.getElementById('details-title');
  var detailsDesc = document.getElementById('details-desc');
  var detailsProcess = document.getElementById('details-process-pill');
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

  // Populate origin filter options dynamically from available beans
  function populateOriginFilter() {
    var originSet = {};
    BEANS_DATA.forEach(function (b) {
      var nameLower = b.name.toLowerCase();
      if (nameLower.indexOf('decaf') >= 0 || 
          nameLower.indexOf('espresso') >= 0 || 
          nameLower.indexOf('villa sarchi') >= 0 || 
          b.price > 12.00) {
        return;
      }
      var prof = getProfile(b.name);
      if (prof.origin) {
        originSet[prof.origin] = true;
      }
    });

    var origins = Object.keys(originSet).sort();
    var currentVal = filterOrigin.value;
    filterOrigin.innerHTML = '<option value="">All Origins</option>';
    origins.forEach(function (orig) {
      var opt = document.createElement('option');
      opt.value = orig;
      opt.textContent = orig;
      if (orig === currentVal) opt.selected = true;
      filterOrigin.appendChild(opt);
    });
  }

  // Populate process filter options dynamically from available beans
  function populateProcessFilter() {
    if (!filterProcess) return;
    var processMap = {};
    BEANS_DATA.forEach(function (b) {
      var nameLower = b.name.toLowerCase();
      if (nameLower.indexOf('decaf') >= 0 || 
          nameLower.indexOf('espresso') >= 0 || 
          nameLower.indexOf('villa sarchi') >= 0 || 
          b.price > 12.00) {
        return;
      }
      var prof = getProfile(b.name);
      if (prof.process && prof.processLabel) {
        processMap[prof.process] = prof.processLabel;
      }
    });

    var order = ["washed", "natural", "honey", "anaerobic", "wet-hulled"];
    var availableKeys = Object.keys(processMap).sort(function(a, b) {
      var idxA = order.indexOf(a);
      var idxB = order.indexOf(b);
      if (idxA >= 0 && idxB >= 0) return idxA - idxB;
      if (idxA >= 0) return -1;
      if (idxB >= 0) return 1;
      return a.localeCompare(b);
    });

    var currentVal = filterProcess.value;
    filterProcess.innerHTML = '<option value="">All Processes</option>';
    availableKeys.forEach(function (procKey) {
      var opt = document.createElement('option');
      opt.value = procKey;
      opt.textContent = processMap[procKey];
      if (procKey === currentVal) opt.selected = true;
      filterProcess.appendChild(opt);
    });
  }

  // Initialize
  populateOriginFilter();
  populateProcessFilter();
  updateDropdownOptions();

  // Listeners for Filters
  filterOrigin.addEventListener('change', updateDropdownOptions);
  if (filterProcess) filterProcess.addEventListener('change', updateDropdownOptions);
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
    if (detailsProcess) detailsProcess.textContent = 'Process: ' + profile.processLabel;
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
    var processVal = filterProcess ? filterProcess.value : '';
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

      // Apply process filter
      if (processVal && profile.process !== processVal) return;

      // Apply flavor profile keyword filter
      if (noteKeyword) {
        var hasMatch = false;
        var characteristicsText = (b.cup_characteristics || "").toLowerCase();
        
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
      window.location.href = config.thanksUrl || '/thanks/';
    };
  });

  };
});
