---
layout: default
title: Subscriptions
permalink: /subscriptions/
subtitle: >-
  Roasted to order and delivered on your schedule.<br>
  Pause, resume, or cancel anytime.
---

<div class="menu-listing-wrap">
  <!-- ── Header ── -->
  <header class="menu-header">
    <h1 class="menu-title">Subscriptions</h1>
    {% if page.subtitle %}
      <p class="menu-subtitle">{{ page.subtitle }}</p>
    {% endif %}
  </header>

  <!-- ── 1. Curated Roaster's Choice Clubs ── -->
  {% assign all_subs = site.subscriptions | sort: "order" %}
  <section class="menu-section">
    <h2 class="menu-section-title">Curated Roaster's Choice Clubs</h2>

    {% for sub in all_subs %}
      {% if sub.order <= 3 %}
        <a href="{{ sub.url | relative_url }}" class="menu-item">
          <div class="menu-item-row">
            <h3 class="menu-item-name">{{ sub.title }}</h3>
            <div class="menu-item-leader" aria-hidden="true"></div>
            <div class="menu-item-price">${{ sub.price["12oz"] }} / mo</div>
          </div>
          <div class="menu-item-desc">
            <span class="menu-item-notes">{{ sub.subtitle }}</span>
            <span class="menu-item-meta">12oz Monthly</span>
          </div>
        </a>
      {% endif %}
    {% endfor %}
  </section>

  <!-- ── 2. The Roastery Lab & Test Batches ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">The Roastery Lab &amp; Experimental Tiers</h2>

    {% for sub in all_subs %}
      {% if sub.order > 3 %}
        <a href="{{ sub.url | relative_url }}" class="menu-item">
          <div class="menu-item-row">
            <h3 class="menu-item-name">{{ sub.title }}</h3>
            <div class="menu-item-leader" aria-hidden="true"></div>
            <div class="menu-item-price">${{ sub.price["12oz"] }} / mo</div>
          </div>
          <div class="menu-item-desc">
            <span class="menu-item-notes">{{ sub.subtitle }}</span>
            <span class="menu-item-meta">12oz Monthly</span>
          </div>
        </a>
      {% endif %}
    {% endfor %}
  </section>

  <!-- ── 3. Individual Roast Subscriptions ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">All Catalog Roasts &bull; Individual Subscriptions</h2>

    <a href="{{ '/shop/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Signature Blends &amp; Single Origins</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Subscribe on Page</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Have a favorite house roast? Every coffee in our regular lineup can be ordered as a recurring subscription directly from its individual roast page.</span>
        <span class="menu-item-meta">View Coffee Catalog &rarr;</span>
      </div>
    </a>
  </section>

  <!-- ── 4. Subscriber Services & Management ── -->
  <section class="menu-section">
    <h2 class="menu-section-title">Membership Services &amp; Account</h2>

    <a href="{{ '/subscriptions/manage/' | relative_url }}" class="menu-item">
      <div class="menu-item-row">
        <h3 class="menu-item-name">Manage Existing Subscription</h3>
        <div class="menu-item-leader" aria-hidden="true"></div>
        <div class="menu-item-price">Self-Service</div>
      </div>
      <div class="menu-item-desc">
        <span class="menu-item-notes">Secure magic link lookup to pause, resume, change grind, or cancel anytime</span>
        <span class="menu-item-meta">Member Portal</span>
      </div>
    </a>
  </section>
</div>
