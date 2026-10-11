---
layout: index
---

<!-- Hero Section (matching existing home) -->
<section class="sleek-home-hero">
  <h1 class="sleek-home-headline">Small-Batch<br>Coffee Roasting</h1>
  <p class="sleek-home-sub">
    We craft flavors we love, and hope you will too.
  </p>

  <div class="sleek-home-cta-row">
    <a href="{{ '/roasts/' | relative_url }}" class="sleek-home-btn-primary">
      Explore All Roasts &rarr;
    </a>
  </div>

  <div class="sleek-home-birds">
    <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="Robin mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="Canary mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-hummingbird-transparent.png' | relative_url }}" alt="Hummingbird mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-bluebird-transparent.png' | relative_url }}" alt="Bluebird mascot" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-osprey-transparent.png' | relative_url }}" alt="Osprey mascot" fetchpriority="high" decoding="async">
  </div>
</section>

<!-- Curated Seasonal / Featured Offerings Showcase -->
<section class="sleek-home-showcase-section">
  <div class="sleek-home-showcase-header">
    <div>
      <span style="font-family: Montserrat, sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #9c6d12;">Current Selections</span>
      <h2 class="sleek-home-showcase-title">Featured Offerings</h2>
    </div>
    <a href="{{ '/roasts/' | relative_url }}" class="sleek-home-showcase-link">
      <span>View all coffees</span>
      <span aria-hidden="true">&rarr;</span>
    </a>
  </div>

  {% assign active_roasts = site.roasts | where_exp: "r", "r.status != 'flown_south'" %}
  {% assign showcase_roasts = active_roasts | where: "best_seller", true %}
  {% if showcase_roasts.size < 3 %}
    {% assign showcase_roasts = active_roasts %}
  {% endif %}

  <div class="sleek-comparison-grid">
    {% for r in showcase_roasts limit:3 %}
      {% include roast-card.html roast=r %}
    {% endfor %}

  </div>
</section>
