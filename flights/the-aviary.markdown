---
layout: default
title: The Aviary
permalink: /flights/the-aviary/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-cage-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">The Aviary</h1>
</div>

<p class="roast-mv-tasting">A range of four blends, from bright and floral to dark and smoky</p>

<div class="roast-mv-divider"></div>

<p class="roast-mv-body">Four blends, each individually packaged in its own 8oz bag — a great way to explore the full range before committing to a full bag.</p>

{% assign aviary_slugs = "early-bird,feather-soot,chimney-sweep,lil-sipper" | split: "," %}

<div class="aviary-grid">
  {% for slug in aviary_slugs %}
    {% assign r = site.roasts | where: "slug", slug | first %}
    {% if r %}
      {% assign r_level_key = r.roast_level | append: "" %}
      {% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}
      {% if level_info %}
        {% assign r_dots = level_info.dots %}
        {% assign r_layman = level_info.layman %}
        {% assign r_specialty = level_info.specialty | default: level_info.name %}
      {% else %}
        {% assign r_dots = r.roast_dots %}
        {% assign r_layman = "" %}
        {% assign r_specialty = r.roast_level %}
      {% endif %}
      <a class="roasts-entry aviary-card" data-roast="{{ r.slug }}" href="{{ r.url | relative_url }}">
        <div class="roasts-entry-visual">
          {% if r.mascot_file %}<img src="{{ '/images/' | append: r.mascot_file | relative_url }}" alt="{{ r.title }}" class="roasts-entry-mascot">{% endif %}
          <div class="roasts-entry-overlay">
            {% if r.tasting_notes %}<div class="roasts-entry-overlay-notes">{{ r.tasting_notes | replace: ", ", " · " | downcase }}</div>{% endif %}
            {% if r_dots %}
              <div class="roasts-entry-overlay-level">
                <span class="roast-dots roast-dots-sm">
                  <span class="roast-dot{% if r_dots >= 1 %} roast-dot-1{% endif %}"></span>
                  <span class="roast-dot{% if r_dots >= 2 %} roast-dot-2{% endif %}"></span>
                  <span class="roast-dot{% if r_dots >= 3 %} roast-dot-3{% endif %}"></span>
                  <span class="roast-dot{% if r_dots >= 4 %} roast-dot-4{% endif %}"></span>
                  <span class="roast-dot{% if r_dots >= 5 %} roast-dot-5{% endif %}"></span>
                </span>
                <span class="roasts-entry-overlay-specialty">{{ r_specialty }}</span>
              </div>
            {% endif %}
            {% if r.brewing_method %}
              <div class="roasts-entry-overlay-brewing">{{ r.brewing_method | replace: ", ", " · " }}</div>
            {% endif %}
          </div>
        </div>
        <div class="roasts-entry-info">
          <div class="roasts-entry-header">
            <div class="roasts-entry-main">
              <div class="roasts-entry-title">{{ r.title }}</div>
              {% if r.subtitle %}<div class="roasts-entry-subtitle">{{ r.subtitle }}</div>{% endif %}
            </div>
            <div class="roasts-entry-meta">
              {% if r_layman %}<div class="roasts-entry-layman">{{ r_layman }}</div>{% endif %}
              {% if r.descriptor %}<div class="roasts-entry-descriptor">{{ r.descriptor | downcase }}</div>{% endif %}
            </div>
          </div>
        </div>
      </a>
    {% endif %}
  {% endfor %}
</div>

<p class="roast-mv-body" style="font-size: 0.85rem; color: #8a7060; font-style: italic; margin-top: -0.5rem; margin-bottom: 2rem;">Brewing method varies by blend — click any roast for full profile and brew details.</p>

<div class="roast-mv-divider"></div>

<div class="roast-mv-center" style="margin-bottom:1rem;">
  <div class="roast-mv-meta-label" style="margin-bottom:0.35rem;">Grind</div>
  <select id="aviary-grind-select" class="subscribe-select" style="min-width: 12rem;">
    <option value="Whole Bean" selected>Whole Bean</option>
    <option value="Coarsest — Cold Brew">Coarsest — Cold Brew</option>
    <option value="Coarser — French Press">Coarser — French Press</option>
    <option value="Medium — Drip / Filter">Medium — Drip / Filter</option>
    <option value="Finer — Pour Over">Finer — Pour Over</option>
    <option value="Finest — Espresso">Finest — Espresso</option>
  </select>
</div>

<div class="roast-mv-center" id="add-to-cart-wrap" style="text-align:center;">
  <button class="add-to-order-btn" id="aviary-add-btn">Add to Order — ${{ site.data.flights["the-aviary"].price }}</button>
</div>

</div>

<script>
(function () {
  var STORAGE_KEY = 'ywr_cart';
  var addBtn = document.getElementById('aviary-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var grindSelect = document.getElementById('aviary-grind-select');
      var grind = grindSelect ? grindSelect.value : 'Whole Bean';
      var cart;
      try { var raw = localStorage.getItem(STORAGE_KEY); cart = raw ? JSON.parse(raw) : {}; } catch (e) { cart = {}; }
      var key = 'the-aviary|||' + grind;
      cart[key] = (cart[key] || 0) + 1;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('ywr-cart-changed'));
      addBtn.textContent = 'Added!';
      addBtn.disabled = true;
      setTimeout(function () {
        addBtn.textContent = 'Add to Order — ${{ site.data.flights["the-aviary"].price }}';
        addBtn.disabled = false;
      }, 1200);
    });
  }
})();
</script>
