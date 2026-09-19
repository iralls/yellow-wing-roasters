---
layout: default
title: "Coffee Quiz — Find Your Roast"
permalink: /quiz/
---

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/question-mark-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true" fetchpriority="high" decoding="async">
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
          <span class="quiz-option-icon">
            <img src="{{ '/images/drip-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Drip Maker</span>
          <span class="quiz-option-hint">Auto drip or batch brewer</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Pour-over" data-label="Pour-Over" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/pour-over-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Pour-Over</span>
          <span class="quiz-option-hint">V60, Chemex, Kalita Wave</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="French Press" data-label="French Press" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/french-press-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">French Press</span>
          <span class="quiz-option-hint">Immersion & full body</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Espresso" data-label="Espresso" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/espresso-machine-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Espresso</span>
          <span class="quiz-option-hint">Espresso machine shots & lattes</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="Cold Brew" data-label="Cold Brew" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/cold-brew-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Cold Brew</span>
          <span class="quiz-option-hint">Slow-steeped, crisp & chilled</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="AeroPress" data-label="AeroPress / Moka Pot" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/aeropress-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">AeroPress / Moka Pot</span>
          <span class="quiz-option-hint">Concentrated & versatile</span>
        </div>
        <div class="quiz-option-card" data-step="1" data-value="any" data-label="Any Method" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/flock-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Any / All Methods</span>
          <span class="quiz-option-hint">I use multiple brewers</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Drink Style / Preparation -->
    <div class="quiz-step" id="quiz-step-2">
      <h2 class="quiz-question-title">How do you take your cup?</h2>
      <p class="quiz-question-desc">How you enjoy your coffee helps us pair the right body and acidity.</p>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Coffee Style">
        <div class="quiz-option-card" data-step="2" data-value="black" data-label="Black" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/black-coffee-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Black</span>
          <span class="quiz-option-hint">Pure origin notes, bright florals & crisp acidity</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="milk" data-label="With Milk or Cream" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/milk-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">With Milk or Cream</span>
          <span class="quiz-option-hint">Full-bodied roasts that cut smoothly through dairy</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="sugar" data-label="With Sugar" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/sugar-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">With Sugar</span>
          <span class="quiz-option-hint">Naturally sweet finishes and warm spice profiles</span>
        </div>
        <div class="quiz-option-card" data-step="2" data-value="milk_sugar" data-label="Milk & Sugar" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/milk-with-sugar-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Milk & Sugar</span>
          <span class="quiz-option-hint">Rich, comforting chocolate-forward blends</span>
        </div>
      </div>
    </div>

    <!-- Step 3: Roast Level -->
    <div class="quiz-step" id="quiz-step-3">
      <h2 class="quiz-question-title">What roast level do you prefer?</h2>
      <p class="quiz-question-desc">From tea-like delicate origins to bold, smoky Viennas.</p>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Roast Level">
        <div class="quiz-option-card" data-step="3" data-value="light" data-label="Light Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/light-roast-coffee-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Light Roast</span>
          <span class="quiz-option-hint">City / City+ · Crisp, vibrant & origin-focused</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="medium" data-label="Medium Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/medium-roast-coffee-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Medium Roast</span>
          <span class="quiz-option-hint">Full City · Balanced caramel, toasted nut & smooth</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="dark" data-label="Dark Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/dark-roast-coffee-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Dark Roast</span>
          <span class="quiz-option-hint">Full City+ / Vienna · Bold, dark cocoa & low acidity</span>
        </div>
        <div class="quiz-option-card" data-step="3" data-value="any" data-label="Any Roast" role="radio" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/flock-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Any Roast</span>
          <span class="quiz-option-hint">Open to exploring the full roast spectrum</span>
        </div>
      </div>
    </div>

    <!-- Step 4: Tasting Notes -->
    <div class="quiz-step" id="quiz-step-4">
      <h2 class="quiz-question-title">Favorite tasting notes?</h2>
      <p class="quiz-question-desc">Select up to 3 flavor directions or choose any flavor.</p>
      <div class="quiz-notes-counter" id="quiz-notes-counter">Select up to 3 flavors (0 of 3 selected)</div>
      <div class="quiz-options-grid" role="group" aria-label="Tasting Notes">
        <div class="quiz-option-card" data-step="4" data-value="chocolate" data-label="Chocolate" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/chocolate-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Chocolate</span>
          <span class="quiz-option-hint">Rich cocoa, dark chocolate & fudge</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="citrus" data-label="Citrus" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/citrus-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Citrus</span>
          <span class="quiz-option-hint">Crisp lemon, bergamot & bright zest</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="fruits" data-label="Fruits" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/fruits-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Fruits</span>
          <span class="quiz-option-hint">Ripe berries, stone fruit & apple</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="sweet" data-label="Sweet" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/caramel-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Sweet</span>
          <span class="quiz-option-hint">Caramel, brown sugar & honey</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="floral" data-label="Floral" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/jasmine-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Floral</span>
          <span class="quiz-option-hint">Delicate jasmine, rosewater & tea</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="nuts" data-label="Nuts" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/hazelnut-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Nuts</span>
          <span class="quiz-option-hint">Toasted hazelnut, almond & pecan</span>
        </div>
        <div class="quiz-option-card" data-step="4" data-value="any" data-label="Any Flavor" role="checkbox" aria-checked="false" tabindex="0">
          <span class="quiz-option-icon">
            <img src="{{ '/images/flock-transparent.png' | relative_url }}" alt="" loading="lazy" decoding="async">
          </span>
          <span class="quiz-option-name">Any Flavor</span>
          <span class="quiz-option-hint">Open to all delicious flavor profiles</span>
        </div>
      </div>
    </div>

    <!-- Navigation Actions -->
    <div class="quiz-actions">
      <button type="button" class="quiz-btn quiz-btn-secondary" id="quiz-prev-btn" style="visibility: hidden;">← Back</button>
      <button type="button" class="quiz-btn quiz-btn-primary" id="quiz-next-btn" style="display: none;">Find My Coffees →</button>
    </div>
  </div>

  <!-- Results Interface -->
  <div id="quiz-results" class="quiz-results-container">
    <div class="quiz-results-summary">
      <div class="quiz-results-summary-title">Your Flavor Profile</div>
      <div class="quiz-results-chips" id="quiz-summary-chips"></div>
      <div>
        <button type="button" class="quiz-retake-btn" id="quiz-retake-btn">↺ Retake Quiz</button>
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
