---
layout: default
title: Roasts
permalink: /roasts/
---

<div class="roasts-header-row" style="margin-top: 2rem; margin-bottom: 1.5rem;">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Current Offerings</h1>
    <p class="category-intro">Small-batch coffees, roasted fresh to order.</p>
  </div>
  <a href="{{ '/quiz/' | relative_url }}" class="roasts-quiz-cta" title="Find your match">
    <span class="roasts-quiz-cta-icon" aria-hidden="true">✨</span>
    <span>Find Your Match</span>
    <span class="roasts-quiz-cta-arrow" aria-hidden="true">&rarr;</span>
  </a>
</div>

<!-- Minimalist Horizontal Filter Chips Bar -->
<div class="sleek-filter-chips-bar" id="catalog-chips-bar">
  <button type="button" class="sleek-filter-chip is-active" data-cat-filter="all">All Coffees</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="single origin">Single Origins</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="blend">Blends</button>
  <button type="button" class="sleek-filter-chip" data-cat-filter="seasonal">Seasonals</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="1">Light Roast</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="2">Medium-Light</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="3">Medium</button>
  <button type="button" class="sleek-filter-chip" data-level-filter="4">Dark</button>
</div>

<!-- Unified Neutral Cards Grid -->
{% assign all_roasts = site.roasts | sort: "order" %}
<div class="sleek-comparison-grid" id="catalog-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
  {% for r in all_roasts %}
    {% include roast-card.html roast=r card_class="sleek-catalog-item" %}
  {% endfor %}

</div>

<script>
  // Instant Filter Chips Interaction
  const chips = document.querySelectorAll('#catalog-chips-bar .sleek-filter-chip');
  const items = document.querySelectorAll('.sleek-catalog-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const catFilter = chip.getAttribute('data-cat-filter');
      const levelFilter = chip.getAttribute('data-level-filter');

      items.forEach(item => {
        let match = true;
        if (catFilter && catFilter !== 'all') {
          if (item.getAttribute('data-category') !== catFilter) {
            match = false;
          }
        }
        if (levelFilter) {
          if (item.getAttribute('data-roast-level') !== levelFilter) {
            match = false;
          }
        }

        item.style.display = match ? 'flex' : 'none';
      });
    });
  });

  // Activate chip from URL query param if present
  const urlParams = new URLSearchParams(window.location.search);
  const qCat = urlParams.get('category');
  if (qCat) {
    const targetChip = Array.from(chips).find(c => c.getAttribute('data-cat-filter') === qCat.toLowerCase());
    if (targetChip) targetChip.click();
  }
</script>
