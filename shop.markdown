---
layout: default
title: Shop
permalink: /shop/
subtitle: >-
  Roasted fresh to order. Free local delivery.
---

<div class="menu-listing-wrap">
  <!-- ── Header ── -->
  <header class="menu-header">
    <h1 class="menu-title">Shop</h1>
    {% if page.subtitle %}
      <p class="menu-subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>

  <!-- ── 1. Coffee: Signature Blends ── -->
  {% assign blends = site.roasts | where: "category", "blend" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Signature Blends</h2>

    {% for r in blends %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 2. Coffee: Single Origins ── -->
  {% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Single Origins</h2>

    {% for r in single_origins %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>

  <!-- ── 3. Coffee: Seasonal Roasts ── -->
  {% assign seasonals = site.roasts | where: "category", "seasonal" | sort: "order" %}
  {% if seasonals.size > 0 %}
  <section class="menu-section">
    <h2 class="menu-section-title">Coffee &mdash; Seasonal Roasts</h2>

    {% for r in seasonals %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}
      <a href="{{ r.url | relative_url }}" class="menu-item">
        <div class="menu-item-row">
          <h3 class="menu-item-name">{{ r.card_title | default: r.title }}</h3>
          <div class="menu-item-leader" aria-hidden="true"></div>
          <div class="menu-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s>${{ r.price["12oz"] }}</s><span class="sale-val">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              ${{ r.price["12oz"] }}
            {% endif %}
          </div>
        </div>

        <div class="menu-item-desc">
          <span class="menu-item-notes">
            {% if r.descriptor %}{{ r.descriptor | capitalize }}{% endif %}
            {% if r.tasting_notes %} &mdash; {{ r.tasting_notes }}{% endif %}
          </span>
          <span class="menu-item-meta">
            {% if level_info %}{{ level_info.layman }} Roast{% endif %}
          </span>
        </div>
      </a>
    {% endfor %}
  </section>
  {% endif %}

  <!-- ── 4. Flights ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">Tasting Flights</h2>

    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">The Aviary</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$38.00</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Four 8oz signature blend bags: Early Bird, Feather Soot, Chimney Sweep, Lil' Sipper</span>
        <span class="menu-item-meta">4 x 8oz</span>
      </div>
    </a>

    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Peck Your Own</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$10.00 / bag</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Build a custom tasting flight with four or more 8oz bags from our active roster</span>
        <span class="menu-item-meta">Min. 4 Bags</span>
      </div>
    </a>
  </section>

  <!-- ── 5. Custom Roastery ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">BYOB &bull; Custom Roastery</h2>

    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Build Your Own Blend</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$32.00</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Formulate up to three varieties with individual roast degrees</span>
        <span class="menu-item-meta">Custom Batch</span>
      </div>
    </a>

    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Bring Your Own Beans</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Quote</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Send us your raw unroasted coffee beans for custom profiling</span>
        <span class="menu-item-meta">Custom Sourced</span>
      </div>
    </a>

    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Bank Your Own Burner</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Bean Cost</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Designate your target roast level on any single-origin bean in our catalog</span>
        <span class="menu-item-meta">Profile Spec</span>
      </div>
    </a>

    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">BYOB &mdash; Book Your Own Bootcamp</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$30 + $15/guest</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Hands-on personalized roasting session for up to 3 guests</span>
        <span class="menu-item-meta">Bootcamp Session</span>
      </div>
    </a>
  </section>

  <!-- ── 6. Gift Cards ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">Gift Cards</h2>

    <a href="{{ '/gift/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Digital Gift Card</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">$15 &ndash; $90</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Prepaid instant digital code delivered via email</span>
        <span class="menu-item-meta">Voucher</span>
      </div>
    </a>
  </section>
</div>
