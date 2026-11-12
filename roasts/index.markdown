---
layout: default
title: Roasts
permalink: /roasts/
---

<div class="roasts-catalog-wrap" style="max-width: 74rem; margin: 0 auto;">
<div class="roasts-header-row" style="margin-bottom: 4rem;">
  <div class="roasts-header-main">
    <h1 class="roasts-page-title">Current Offerings</h1>
  </div>
</div>

<!-- Unified Neutral Cards Grid (3-column gallery) -->
{% assign all_roasts = site.roasts | sort: "order" %}
<div class="roast-trans-grid sleek-comparison-grid" id="catalog-grid" style="margin-bottom: 4rem;">
  {% for r in all_roasts %}
    {% include roast-card.html roast=r card_class="sleek-catalog-item" %}
  {% endfor %}
</div>
</div>
