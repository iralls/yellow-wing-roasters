---
layout: index
---

<!-- Hero Section (matching existing home) -->
<section class="sleek-home-hero">
  <div class="sleek-home-brand-lockup">
    <a href="{{ '/' | relative_url }}" class="sleek-home-brand-link">
      <img src="{{ '/images/audubon-feather-transparent.png' | relative_url }}" alt="Yellow Wing Roasters" class="sleek-home-feather-icon" width="231" height="800" fetchpriority="high" decoding="async">
      <h1 class="sleek-home-brand-name">Yellow Wing</h1>
      <div class="sleek-home-brand-sub">Roasters</div>
    </a>
  </div>

  <p class="sleek-home-sub">
    {{ site.slogan }}
  </p>

  <div class="sleek-home-cta-row">
    <a href="{{ '/roasts/' | relative_url }}" class="sleek-home-btn-primary">
      Explore All Roasts
    </a>
  </div>

  <div class="sleek-home-birds">
    <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="Robin mascot (Early Bird)" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="Canary mascot (Feather & Soot)" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-chimney-swift-2-transparent.png' | relative_url }}" alt="Chimney Swift mascot (Chimney Sweep)" fetchpriority="high" decoding="async">
    <img src="{{ '/images/audubon-hummingbird-transparent.png' | relative_url }}" alt="Hummingbird mascot (Lil' Sipper)" fetchpriority="high" decoding="async">
  </div>
</section>
