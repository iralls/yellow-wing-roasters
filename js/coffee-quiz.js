(function() {
  'use strict';

  // Keyword mappings for Step 4 tasting notes
  var NOTE_KEYWORDS = {
    chocolate: ['chocolate', 'cocoa', 'cacao', 'fudge', 'mocha'],
    citrus: ['citrus', 'lemon', 'bergamot', 'lime', 'orange', 'grapefruit', 'tangerine'],
    fruits: ['fruit', 'fruits', 'berry', 'berries', 'blackberry', 'blueberry', 'apple', 'grape', 'fig', 'currant', 'blackcurrant', 'cranberry', 'cherry', 'stone fruit', 'prune', 'peach', 'plum'],
    sweet: ['sweet', 'sweetness', 'caramel', 'sugar', 'brown sugar', 'honey', 'maple', 'syrup', 'molasses', 'toffee', 'vanilla'],
    floral: ['floral', 'florals', 'flower', 'rosewater', 'jasmine', 'honeysuckle', 'tea', 'blossom', 'lavender', 'aromatic', 'delicate'],
    nuts: ['nut', 'nuts', 'nutty', 'hazelnut', 'pecan', 'almond', 'walnut', 'peanut', 'cashew']
  };

  var STEP_TITLES = [
    'Step 1 of 4: Brewing Method',
    'Step 2 of 4: Coffee Style',
    'Step 3 of 4: Roast Level',
    'Step 4 of 4: Tasting Notes'
  ];

  var state = {
    currentStep: 1,
    answers: {
      brewing: null,
      brewingLabel: '',
      preparation: null,
      preparationLabel: '',
      roast: null,
      roastLabel: '',
      notes: []
    }
  };

  function initQuiz() {
    var quizContainer = document.getElementById('coffee-quiz-app');
    if (!quizContainer) return;

    bindOptionSelection();
    bindNotesSelection();
    bindNavigationButtons();
    updateStepUI();
  }

  function bindOptionSelection() {
    // Single select steps: 1, 2, 3
    var optionCards = document.querySelectorAll('.quiz-option-card');
    optionCards.forEach(function(card) {
      card.addEventListener('click', function() {
        var stepNum = parseInt(card.getAttribute('data-step'), 10);
        var value = card.getAttribute('data-value');
        var label = card.getAttribute('data-label') || value;

        // Clear sibling selections
        var siblings = card.parentElement.querySelectorAll('.quiz-option-card');
        siblings.forEach(function(s) {
          s.classList.remove('is-selected');
          s.setAttribute('aria-checked', 'false');
        });

        // Select this one
        card.classList.add('is-selected');
        card.setAttribute('aria-checked', 'true');

        if (stepNum === 1) {
          state.answers.brewing = value;
          state.answers.brewingLabel = label;
        } else if (stepNum === 2) {
          state.answers.preparation = value;
          state.answers.preparationLabel = label;
        } else if (stepNum === 3) {
          state.answers.roast = value;
          state.answers.roastLabel = label;
        }

        updateStepUI();
      });
    });
  }

  function bindNotesSelection() {
    var noteChips = document.querySelectorAll('.quiz-note-chip');
    noteChips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var value = chip.getAttribute('data-value');
        var idx = state.answers.notes.indexOf(value);

        if (idx > -1) {
          // Deselect
          state.answers.notes.splice(idx, 1);
          chip.classList.remove('is-selected');
        } else {
          // Select if under max 3
          if (state.answers.notes.length < 3) {
            state.answers.notes.push(value);
            chip.classList.add('is-selected');
          }
        }

        updateNotesCounter();
      });
    });
  }

  function updateNotesCounter() {
    var counterEl = document.getElementById('quiz-notes-counter');
    var count = state.answers.notes.length;
    if (counterEl) {
      counterEl.textContent = count + ' of 3 selected' + (count === 3 ? ' (Maximum reached)' : '');
    }

    // Disable unselected chips if 3 are selected
    var noteChips = document.querySelectorAll('.quiz-note-chip');
    noteChips.forEach(function(chip) {
      var val = chip.getAttribute('data-value');
      var isSel = state.answers.notes.indexOf(val) > -1;
      if (!isSel && count >= 3) {
        chip.classList.add('is-disabled');
      } else {
        chip.classList.remove('is-disabled');
      }
    });
  }

  function bindNavigationButtons() {
    var prevBtn = document.getElementById('quiz-prev-btn');
    var nextBtn = document.getElementById('quiz-next-btn');
    var retakeBtn = document.getElementById('quiz-retake-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (state.currentStep > 1) {
          state.currentStep--;
          updateStepUI();
          scrollToQuizTop();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (state.currentStep < 4) {
          state.currentStep++;
          updateStepUI();
          scrollToQuizTop();
        } else if (state.currentStep === 4) {
          showResults();
        }
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        resetQuiz();
      });
    }
  }

  function scrollToQuizTop() {
    var container = document.getElementById('coffee-quiz-app');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateStepUI() {
    var step = state.currentStep;
    var prevBtn = document.getElementById('quiz-prev-btn');
    var nextBtn = document.getElementById('quiz-next-btn');
    var stepTitle = document.getElementById('quiz-step-title');
    var progressFill = document.getElementById('quiz-progress-fill');

    // Update progress track
    if (progressFill) {
      progressFill.style.width = (step * 25) + '%';
    }

    if (stepTitle) {
      stepTitle.textContent = STEP_TITLES[step - 1];
    }

    // Toggle step containers
    for (var i = 1; i <= 4; i++) {
      var stepContainer = document.getElementById('quiz-step-' + i);
      if (stepContainer) {
        if (i === step) {
          stepContainer.classList.add('is-active');
        } else {
          stepContainer.classList.remove('is-active');
        }
      }
    }

    // Toggle Prev Button
    if (prevBtn) {
      prevBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
    }

    // Validate Next Button
    var canProceed = false;
    if (step === 1) {
      canProceed = !!state.answers.brewing;
    } else if (step === 2) {
      canProceed = !!state.answers.preparation;
    } else if (step === 3) {
      canProceed = !!state.answers.roast;
    } else if (step === 4) {
      canProceed = true; // 0 to 3 notes allowed
    }

    if (nextBtn) {
      nextBtn.disabled = !canProceed;
      nextBtn.textContent = step === 4 ? 'Find My Coffees →' : 'Next Step →';
    }
  }

  function calculateScore(card) {
    var brewing = (card.getAttribute('data-brewing') || '').toLowerCase();
    var roastLevel = parseInt(card.getAttribute('data-roast-level') || card.getAttribute('data-roast-dots') || '3', 10);
    var tastingNotes = (card.getAttribute('data-tasting-notes') || '').toLowerCase();
    var descriptor = (card.getAttribute('data-descriptor') || '').toLowerCase();
    var fullNotesText = tastingNotes + ' ' + descriptor;

    var score = 0;

    // 1. Roast Level (Strict Disqualification & Scoring - 25 points)
    var roastPref = state.answers.roast;
    if (roastPref === 'any') {
      score += 25;
    } else if (roastPref === 'light') {
      if (roastLevel >= 4) return -1; // Disqualify dark roasts
      if (roastLevel === 1) score += 25;
      else if (roastLevel === 2) score += 22;
      else if (roastLevel === 3) score += 8;
    } else if (roastPref === 'medium') {
      if (roastLevel === 5) return -1; // Disqualify extreme Vienna dark
      if (roastLevel === 3) score += 25;
      else if (roastLevel === 2) score += 20;
      else if (roastLevel === 4) score += 18;
      else if (roastLevel === 1) score += 6;
    } else if (roastPref === 'dark') {
      if (roastLevel <= 2) return -1; // Disqualify light roasts
      if (roastLevel >= 4) score += 25;
      else if (roastLevel === 3) score += 16;
    }

    // 2. Brewing Method (Strict Disqualification & Scoring - 35 points)
    var selectedBrew = state.answers.brewing;
    if (selectedBrew === 'any') {
      score += 35;
    } else if (selectedBrew) {
      var brewQuery = selectedBrew.toLowerCase();
      var brewMatchScore = 0;

      if (brewing.indexOf(brewQuery) > -1) {
        brewMatchScore = 35;
      } else if (brewQuery === 'pour-over' && brewing.indexOf('chemex') > -1) {
        brewMatchScore = 35;
      } else if (brewQuery === 'aeropress' && (brewing.indexOf('moka pot') > -1 || brewing.indexOf('espresso') > -1)) {
        brewMatchScore = 25;
      } else if (brewQuery === 'drip' && brewing.indexOf('pour-over') > -1) {
        brewMatchScore = 25;
      } else if (brewQuery === 'french press' && brewing.indexOf('drip') > -1) {
        brewMatchScore = 20;
      } else if (brewQuery === 'cold brew' && (roastLevel >= 3 || fullNotesText.indexOf('chocolate') > -1)) {
        brewMatchScore = 20;
      }

      // If brew method is completely incompatible (e.g. espresso query on pour-over only bean), disqualify
      if (brewMatchScore === 0) {
        return -1;
      }
      score += brewMatchScore;
    }

    // 3. Coffee Style / Preparation (20 points)
    var prep = state.answers.preparation;
    if (prep === 'black') {
      if (roastLevel <= 2) score += 15;
      else if (roastLevel === 3) score += 12;
      else score += 6;

      if (/citrus|floral|fruit|lemon|berry|delicate|clean/.test(fullNotesText)) {
        score += 5;
      } else {
        score += 2;
      }
    } else if (prep === 'milk') {
      if (roastLevel >= 3) score += 15;
      else if (roastLevel === 2) score += 10;
      else score += 4;

      if (/chocolate|cocoa|nut|toasted|caramel|bold|robust/.test(fullNotesText)) {
        score += 5;
      } else {
        score += 2;
      }
    } else if (prep === 'sugar') {
      if (roastLevel === 2 || roastLevel === 3 || roastLevel === 4) score += 14;
      else score += 8;

      if (/sweet|caramel|sugar|maple|honey|chocolate/.test(fullNotesText)) {
        score += 6;
      } else {
        score += 2;
      }
    } else if (prep === 'milk_sugar') {
      if (roastLevel >= 3) score += 15;
      else score += 8;

      if (/chocolate|cocoa|caramel|sweet|nut|spiced|bold/.test(fullNotesText)) {
        score += 5;
      } else {
        score += 2;
      }
    }

    // 4. Tasting Notes (20 points)
    var chosenNotes = state.answers.notes;
    if (chosenNotes.length === 0) {
      score += 20; // neutral bonus if no specific notes selected
    } else {
      var ptsPerNote = 20 / chosenNotes.length;
      var matchesCount = 0;
      chosenNotes.forEach(function(noteCategory) {
        var kws = NOTE_KEYWORDS[noteCategory] || [];
        var matched = false;
        for (var i = 0; i < kws.length; i++) {
          if (fullNotesText.indexOf(kws[i]) > -1) {
            matched = true;
            break;
          }
        }
        if (matched) {
          matchesCount++;
          score += ptsPerNote;
        }
      });
    }

    // Minimum baseline threshold to qualify as a match
    var finalScore = Math.min(100, Math.round(score));
    if (finalScore < 50) {
      return -1; // Disqualified for low compatibility
    }

    return finalScore;
  }

  function showResults() {
    var wizard = document.getElementById('quiz-wizard');
    var resultsContainer = document.getElementById('quiz-results');
    var topGrid = document.getElementById('quiz-top-matches-grid');
    var emptyMessage = document.getElementById('quiz-empty-message');
    var summaryChips = document.getElementById('quiz-summary-chips');

    if (!resultsContainer || !topGrid) return;

    // Build summary chips
    if (summaryChips) {
      summaryChips.innerHTML = '';
      var chips = [
        state.answers.brewingLabel || state.answers.brewing,
        state.answers.preparationLabel || state.answers.preparation,
        state.answers.roastLabel || state.answers.roast
      ];
      if (state.answers.notes.length > 0) {
        var capitalizedNotes = state.answers.notes.map(function(n) {
          return n.charAt(0).toUpperCase() + n.slice(1);
        }).join(', ');
        chips.push('Notes: ' + capitalizedNotes);
      } else {
        chips.push('All Flavors');
      }

      chips.forEach(function(chipText) {
        var span = document.createElement('span');
        span.className = 'quiz-result-chip';
        span.textContent = chipText;
        summaryChips.appendChild(span);
      });
    }

    // Score all roasts from the hidden pre-rendered pool
    var poolCards = document.querySelectorAll('.quiz-pool .roasts-entry');
    var scoredRoasts = [];

    poolCards.forEach(function(card) {
      var score = calculateScore(card);
      // Filter out non-matching roasts (score === -1)
      if (score >= 50) {
        var cloned = card.cloneNode(true);
        scoredRoasts.push({
          element: cloned,
          score: score,
          status: card.getAttribute('data-status') || ''
        });
      }
    });

    // Sort descending by score (order of match)
    scoredRoasts.sort(function(a, b) {
      return b.score - a.score;
    });

    // List ONLY the top 4 matching choices
    var topMatches = scoredRoasts.slice(0, 4);

    topGrid.innerHTML = '';

    if (topMatches.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
    } else {
      if (emptyMessage) emptyMessage.style.display = 'none';
      topMatches.forEach(function(item) {
        // Append clean canonical card (no percentage badge)
        topGrid.appendChild(item.element);
      });
    }

    if (wizard) wizard.style.display = 'none';
    resultsContainer.classList.add('is-active');
    scrollToQuizTop();
  }

  function resetQuiz() {
    state.currentStep = 1;
    state.answers = {
      brewing: null,
      brewingLabel: '',
      preparation: null,
      preparationLabel: '',
      roast: null,
      roastLabel: '',
      notes: []
    };

    // Unselect cards
    var optionCards = document.querySelectorAll('.quiz-option-card');
    optionCards.forEach(function(c) {
      c.classList.remove('is-selected');
      c.setAttribute('aria-checked', 'false');
    });

    // Unselect note chips
    var noteChips = document.querySelectorAll('.quiz-note-chip');
    noteChips.forEach(function(chip) {
      chip.classList.remove('is-selected', 'is-disabled');
    });
    updateNotesCounter();

    var wizard = document.getElementById('quiz-wizard');
    var resultsContainer = document.getElementById('quiz-results');

    if (resultsContainer) resultsContainer.classList.remove('is-active');
    if (wizard) wizard.style.display = 'block';

    updateStepUI();
    scrollToQuizTop();
  }

  // Self-init on DOMContentLoaded or immediate if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }
})();
