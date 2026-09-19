---
layout: default
title: "Coffee Quiz — Find Your Roast"
permalink: /quiz/
---

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-goldfinch-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true" fetchpriority="high" decoding="async">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">Find Your Perfect Roast</h1>
</div>

<p class="category-intro" style="text-align: center; margin-top: -0.25rem; margin-bottom: 2.25rem;">
  Answer 4 quick questions to discover your ideal coffees across our entire roost — from seasonal favorites to upcoming batches.
</p>

<div id="coffee-quiz-app">
  <!-- Wizard Interface -->
  <div id="quiz-wizard" class="quiz-wizard-container">
    <div class="quiz-progress-bar-wrap">
      <div class="quiz-progress-header">
        <span id="quiz-step-title">Step 1 of 4: Brewing Method</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" id="quiz-progress-fill" style="width: 25%;"></div>
      </div>
    </div>

    <!-- Step 1: Brewing Method -->
    <div class="quiz-step is-active" id="quiz-step-1">
      <h2 class="quiz-question-title">How do you brew your coffee?</h2>
      <p class="quiz-question-desc">Select your primary brewing setup or routine.</p>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Brewing Method">
        <div class="quiz-option-card" data-step="1" data-value="Drip" data-label="Drip Maker" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">☕</span>
          <span class="quiz-option-name">Drip Maker</span>
          <span class="quiz-option-hint">Auto drip or batch brewer</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Pour-over" data-label="Pour-Over" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">⏳</span>
          <span class="quiz-option-name">Pour-Over</span>
          <span class="quiz-option-hint">V60, Chemex, Kalita Wave</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="French Press" data-label="French Press" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🫖</span>
          <span class="quiz-option-name">French Press</span>
          <span class="quiz-option-hint">Immersion & full body</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Espresso" data-label="Espresso" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🎯</span>
          <span class="quiz-option-name">Espresso</span>
          <span class="quiz-option-hint">Espresso machine shots & lattes</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Cold Brew" data-label="Cold Brew" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🧊</span>
          <span class="quiz-option-name">Cold Brew</span>
          <span class="quiz-option-hint">Slow-steeped, crisp & chilled</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="AeroPress" data-label="AeroPress / Moka Pot" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">⚙️</span>
          <span class="quiz-option-name">AeroPress / Moka Pot</span>
          <span class="quiz-option-hint">Concentrated & versatile</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="any" data-label="Any Method" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">✨</span>
          <span class="quiz-option-name">Any / All Methods</span>
          <span class="quiz-option-hint">I use multiple brewers</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Drink Style / Preparation -->
    <div class="quiz-step" id="quiz-step-2">
      <h2 class="quiz-question-title">How do you take your cup?</h2>
      <p class="quiz-question-desc">How you enjoy your coffee helps us pair the right body and acidity.</p>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Coffee Style">
        <div class="quiz-option-card" data-step="2" data-value="black" data-label="Black" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🖤</span>
          <span class="quiz-option-name">Black</span>
          <span class="quiz-option-hint">Pure origin notes, bright florals & crisp acidity</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="milk" data-label="With Milk or Cream" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🥛</span>
          <span class="quiz-option-name">With Milk or Cream</span>
          <span class="quiz-option-hint">Full-bodied roasts that cut smoothly through dairy</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="sugar" data-label="With Sugar" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🍯</span>
          <span class="quiz-option-name">With Sugar</span>
          <span class="quiz-option-hint">Naturally sweet finishes and warm spice profiles</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="milk_sugar" data-label="Milk & Sugar" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">✨</span>
          <span class="quiz-option-name">Milk & Sugar</span>
          <span class="quiz-option-hint">Rich, comforting chocolate-forward blends</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
      </div>
    </div>

    <!-- Step 3: Roast Level -->
    <div class="quiz-step" id="quiz-step-3">
      <h2 class="quiz-question-title">What roast level do you prefer?</h2>
      <p class="quiz-question-desc">From tea-like delicate origins to bold, smoky Viennas.</p>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Roast Level">
        <div class="quiz-option-card" data-step="3" data-value="light" data-label="Light Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🌱</span>
          <span class="quiz-option-name">Light Roast</span>
          <span class="quiz-option-hint">City / City+ · Crisp, vibrant & origin-focused</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="medium" data-label="Medium Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🌰</span>
          <span class="quiz-option-name">Medium Roast</span>
          <span class="quiz-option-hint">Full City · Balanced caramel, toasted nut & smooth</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="dark" data-label="Dark Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🍫</span>
          <span class="quiz-option-name">Dark Roast</span>
          <span class="quiz-option-hint">Full City+ / Vienna · Bold, dark cocoa & low acidity</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="any" data-label="Any Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">🕊️</span>
          <span class="quiz-option-name">Any Roast</span>
          <span class="quiz-option-hint">Open to exploring the full roast spectrum</span>
          <span class="quiz-option-check">&#10003;</span>
        </div>
      </div>
    </div>

    <!-- Step 4: Tasting Notes -->
    <div class="quiz-step" id="quiz-step-4">
      <h2 class="quiz-question-title">Favorite tasting notes?</h2>
      <p class="quiz-question-desc">Choose up to 3 flavor directions you enjoy most.</p>
      <div class="quiz-notes-grid" role="group" aria-label="Tasting Notes">
        <div class="quiz-note-chip" data-value="chocolate" tabindex="0">
          <div class="quiz-note-label"><span>🍫</span> Chocolate</div>
          <span class="quiz-note-tag">Cocoa & Fudge</span>
        </div>
        <div class="quiz-note-chip" data-value="citrus" tabindex="0">
          <div class="quiz-note-label"><span>🍋</span> Citrus</div>
          <span class="quiz-note-tag">Lemon & Bergamot</span>
        </div>
        <div class="quiz-note-chip" data-value="fruits" tabindex="0">
          <div class="quiz-note-label"><span>🍓</span> Fruits</div>
          <span class="quiz-note-tag">Berry & Stone Fruit</span>
        </div>
        <div class="quiz-note-chip" data-value="sweet" tabindex="0">
          <div class="quiz-note-label"><span>🍯</span> Sweet</div>
          <span class="quiz-note-tag">Caramel & Honey</span>
        </div>
        <div class="quiz-note-chip" data-value="floral" tabindex="0">
          <div class="quiz-note-label"><span>🌸</span> Floral</div>
          <span class="quiz-note-tag">Jasmine & Rosewater</span>
        </div>
        <div class="quiz-note-chip" data-value="nuts" tabindex="0">
          <div class="quiz-note-label"><span>🥜</span> Nuts</div>
          <span class="quiz-note-tag">Hazelnut & Pecan</span>
        </div>
      </div>
      <div class="quiz-notes-counter" id="quiz-notes-counter">0 of 3 selected</div>
    </div>

    <!-- Navigation Actions -->
    <div class="quiz-actions">
      <button type="button" class="quiz-btn quiz-btn-secondary" id="quiz-prev-btn" style="visibility: hidden;">← Back</button>
      <button type="button" class="quiz-btn quiz-btn-primary" id="quiz-next-btn" disabled>Next Step →</button>
    </div>
  </div>

  <!-- Results Interface -->
  <div id="quiz-results" class="quiz-results-container">
    <div class="quiz-results-summary">
      <div class="quiz-results-summary-title">Your Flavor Profile</div>
      <div class="quiz-results-chips" id="quiz-summary-chips"></div>
      <div>
        <button type="button" class="quiz-retake-btn" id="quiz-retake-btn">↺ Retake Quiz / Change Answers</button>
      </div>
    </div>

    <div class="roasts-category">Top Coffee Matches</div>
    <div class="roasts-grid" id="quiz-top-matches-grid"></div>
    <div id="quiz-empty-message" class="quiz-empty-results" style="display: none;">
      <p>No exact coffee matches found for this combination.</p>
      <button type="button" class="quiz-btn quiz-btn-primary" onclick="document.getElementById('quiz-retake-btn').click();">Adjust Preferences</button>
    </div>
  </div>

  <!-- Hidden Pre-rendered Pool of ALL Roasts -->
  <div class="quiz-pool" id="quiz-pool" style="display: none;" aria-hidden="true">
    {% for r in site.roasts %}
      {% include roast-card.html roast=r %}
    {% endfor %}
  </div>
</div>

<script src="{{ '/js/coffee-quiz.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
