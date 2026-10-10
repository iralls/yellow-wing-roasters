---
layout: default
title: Best Seller Badge Design Preview
permalink: /best-seller-preview/
---

<style>
.bsp-container {
  max-width: 1120px;
  margin: 1rem auto 4rem;
  padding: 0 1rem;
}
.bsp-intro {
  text-align: center;
  margin-bottom: 2.5rem;
}
.bsp-intro h1 {
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: #2c1e14;
  margin-bottom: 0.5rem;
}
.bsp-intro p {
  color: #6e5e54;
  font-size: 0.95rem;
  max-width: 660px;
  margin: 0 auto;
  line-height: 1.5;
}
.bsp-legend {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.bsp-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: Montserrat, sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  color: #443022;
}
.bsp-legend-bullet {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.bsp-section-heading {
  font-family: Montserrat, sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #2c1e14;
  margin: 2.5rem 0 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(44, 30, 20, 0.08);
}
.bsp-section-sub {
  font-size: 0.85rem;
  color: #8a7060;
  margin-bottom: 1.5rem;
}
.bsp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.bsp-card-wrap {
  display: flex;
  flex-direction: column;
}
.bsp-option-label {
  font-family: Montserrat, sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  color: #2c1e14;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.bsp-option-tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #2c1e14;
  color: #ffffff;
}
.bsp-option-tag--gold {
  background: #f0c838;
  color: #2c1e14;
}
.bsp-option-desc {
  font-size: 0.78rem;
  color: #8a7060;
  margin-bottom: 0.85rem;
  line-height: 1.35;
  min-height: 2.2rem;
}
.bsp-detail-mock-card {
  background: #ffffff;
  border: 1px solid rgba(44, 30, 20, 0.12);
  border-radius: 14px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 14px rgba(44, 30, 20, 0.06);
  max-width: 480px;
  margin: 0 auto 3rem;
}
.bsp-detail-bird {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin: 0 auto 0.75rem;
  display: block;
}
.bsp-detail-title {
  font-family: Montserrat, sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #2c1e14;
  margin: 0.4rem 0 0.15rem;
}
.bsp-detail-sub {
  font-family: Montserrat, sans-serif;
  font-size: 0.85rem;
  color: #8a7060;
  margin-bottom: 0.75rem;
}
.bsp-detail-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 230, 0, 0.2);
  border: 1px solid rgba(255, 230, 0, 0.4);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-family: Montserrat, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #443022;
  margin-bottom: 0.85rem;
}
.bsp-detail-notes {
  font-family: Lora, Georgia, serif;
  font-style: italic;
  font-size: 0.95rem;
  color: #5c4434;
  margin-top: 0.5rem;
}
</style>

<div class="bsp-container">
  <div class="bsp-intro">
    <h1>Updated Badge Architecture Preview</h1>
    <p>Permanent bean certifications (<strong>FTO</strong>, <strong>Organic</strong>) moved to the <strong>bottom-right corner</strong>, while temporary status remains <strong>top-left</strong> and merchandising callouts (<strong>★ Best Seller</strong>, <strong>Featured</strong>) sit proudly <strong>top-right</strong>.</p>
    
    <div class="bsp-legend">
      <span class="bsp-legend-item">
        <span class="bsp-legend-bullet" style="background: #2e7d32;"></span>
        Top-Left: Roasting Status (Lifecycle)
      </span>
      <span class="bsp-legend-item">
        <span class="bsp-legend-bullet" style="background: #f0c838;"></span>
        Top-Right: Best Seller / Featured (Promotional)
      </span>
      <span class="bsp-legend-item">
        <span class="bsp-legend-bullet" style="background: #0075a2;"></span>
        Bottom-Right: FTO / Organic (Permanent Bean Traits)
      </span>
    </div>
  </div>

  <h2 class="bsp-section-heading">Part 1: In-Context Catalog Cards</h2>
  <p class="bsp-section-sub">Hover over any card to see how certifications smoothly fade out so the hover overlay text is 100% clean and unobstructed.</p>

  <div class="bsp-grid">
    <!-- Card 1: Talon Pull (Status on Left + Best Seller on Right) -->
    <div class="bsp-card-wrap">
      <div class="bsp-option-label">
        <span>Talon Pull</span>
        <span class="bsp-option-tag bsp-option-tag--gold">Both Top Pills</span>
      </div>
      <div class="bsp-option-desc">Status on left ("Just Hatched"), Best Seller on right. Both pills are now identically aligned vertically at <code>top: 1rem</code> with matching <code>1.45rem</code> height.</div>

      {% assign r_tp = site.roasts | where: "slug", "talon-pull" | first %}
      {% if r_tp %}
        {% include roast-card.html roast=r_tp %}
      {% endif %}
    </div>

    <!-- Card 2: Sumatra Mandheling (Best Seller on Right + FTO Bottom-Right) -->
    <div class="bsp-card-wrap">
      <div class="bsp-option-label">
        <span>Sumatra Mandheling</span>
        <span class="bsp-option-tag">Best Seller + FTO</span>
      </div>
      <div class="bsp-option-desc">Top-right Best Seller gold pill, and permanent FTO badge cleanly in the bottom-right corner.</div>

      {% assign r_sumatra = site.roasts | where: "slug", "sumatra-mandheling" | first %}
      {% if r_sumatra %}
        {% include roast-card.html roast=r_sumatra %}
      {% endif %}
    </div>

    <!-- Card 3: Feather Soot (Best Seller Only) -->
    <div class="bsp-card-wrap">
      <div class="bsp-option-label">
        <span>Feather Soot</span>
        <span class="bsp-option-tag bsp-option-tag--gold">Best Seller</span>
      </div>
      <div class="bsp-option-desc">Classic dark blend with prominent Best Seller callout in the top-right corner.</div>

      {% assign r_fs = site.roasts | where: "slug", "feather-soot" | first %}
      {% if r_fs %}
        {% include roast-card.html roast=r_fs %}
      {% endif %}
    </div>
  </div>

  <h2 class="bsp-section-heading">Part 2: On Individual Roast Detail Page Header</h2>
  <p class="bsp-section-sub">Rendered directly above the roast title on <a href="/roasts/early-bird/">/roasts/early-bird/</a>.</p>

  <div class="bsp-detail-mock-card">
    <img src="{{ '/images/audubon-robin-transparent.png' | relative_url }}" alt="Robin mascot" class="bsp-detail-bird">
    <div class="roast-mv-bestseller-wrap">
      <span class="roast-bestseller-badge">★ Best Seller</span>
    </div>
    <div class="bsp-detail-title">Early Bird</div>
    <div class="bsp-detail-sub">Nest Blend</div>
    <div class="bsp-detail-status">
      <span>Mid-Molt</span>
      <span style="font-weight: 500; font-size: 0.7rem; opacity: 0.85;">Current Roast Batch</span>
    </div>
    <div class="bsp-detail-notes">milk chocolate · caramel · smooth body</div>
  </div>

  <h2 class="bsp-section-heading">Part 3: List View Placement Options</h2>
  <p class="bsp-section-sub">In List View, the thumbnail is 4.75rem square so the badge is removed from the image. Here are the two ways to display it on the right side of the roast:</p>

  <div style="display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem;">
    <!-- List Option 1: Next to Title -->
    <div>
      <div class="bsp-option-label" style="margin-bottom: 0.5rem;">
        <span>Option 1: Directly Next to Roast Title</span>
        <span class="bsp-option-tag bsp-option-tag--gold">Recommended</span>
      </div>
      <p class="bsp-option-desc">Immediately follows the coffee name inline on the right side of the roast.</p>

      <div class="roasts-grid--list" style="display: grid;">
        <div class="roasts-entry" data-category="blend">
          <div class="roasts-entry-visual" style="background-color: #faf7f2;">
            <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="Feather Soot" class="roasts-entry-mascot">
          </div>
          <div class="roasts-entry-info">
            <div class="roasts-entry-header">
              <div class="roasts-entry-main">
                <div class="roasts-entry-title" style="display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;">
                  <a href="/roasts/feather-soot/">Feather Soot</a>
                  <span class="bsp-badge bsp-badge--gold" style="font-size: 0.58rem; padding: 0.16rem 0.52rem;">★ Best Seller</span>
                </div>
                <div class="roasts-entry-subtitle">Dark Roast</div>
                <div class="roasts-entry-notes">creamy, sweet milk chocolate</div>
                <div class="roasts-entry-prices">$12</div>
              </div>
              <div class="roasts-entry-meta">
                <div class="roasts-entry-layman">Dark</div>
                <div class="roasts-entry-descriptor">rich and chocolatey</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List Option 2: Far Right Side (In Meta Column) -->
    <div>
      <div class="bsp-option-label" style="margin-bottom: 0.5rem;">
        <span>Option 2: Far Right Side of Row (Meta Column)</span>
        <span class="bsp-option-tag">Right Aligned</span>
      </div>
      <p class="bsp-option-desc">Placed on the far right edge of the roast row, above the roast descriptors.</p>

      <div class="roasts-grid--list" style="display: grid;">
        <div class="roasts-entry" data-category="blend">
          <div class="roasts-entry-visual" style="background-color: #faf7f2;">
            <img src="{{ '/images/audubon-canary-transparent.png' | relative_url }}" alt="Feather Soot" class="roasts-entry-mascot">
          </div>
          <div class="roasts-entry-info">
            <div class="roasts-entry-header">
              <div class="roasts-entry-main">
                <div class="roasts-entry-title"><a href="/roasts/feather-soot/">Feather Soot</a></div>
                <div class="roasts-entry-subtitle">Dark Roast</div>
                <div class="roasts-entry-notes">creamy, sweet milk chocolate</div>
                <div class="roasts-entry-prices">$12</div>
              </div>
              <div class="roasts-entry-meta" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                <span class="bsp-badge bsp-badge--gold" style="font-size: 0.58rem; padding: 0.16rem 0.52rem; margin-bottom: 0.15rem;">★ Best Seller</span>
                <div class="roasts-entry-layman">Dark</div>
                <div class="roasts-entry-descriptor">rich and chocolatey</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
