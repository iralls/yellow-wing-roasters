---
layout: default
title: Subscriptions — Yellow Wing Roasters
permalink: /subscriptions-menu/
subtitle: >-
  Roasted to order and delivered on your schedule.<br>
  Pause, resume, or cancel anytime.
---

<style>
  /* ── Subscriptions Typographic Menu Prototype ── */
  :root {
    --menu-bg: #fcfbfa;
    --menu-text: #241d17;
    --menu-muted: #7a7065;
    --menu-accent: #9c6d12;
    --menu-sale: #b45309;
    --menu-line: rgba(36, 29, 23, 0.12);
  }

  body {
    background-color: var(--menu-bg) !important;
    color: var(--menu-text);
  }

  .menu-listing-wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 3.5rem 24px 9rem;
  }

  /* ── Header ── */
  .menu-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .menu-header-mark {
    display: inline-block;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--menu-muted);
    margin-bottom: 0.75rem;
  }

  .menu-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 5vw, 3.75rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--menu-text);
    margin: 0 0 1rem;
  }

  .menu-subtitle {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.05rem;
    color: var(--menu-muted);
    line-height: 1.6;
    margin: 0;
  }

  /* ── Section Dividers ── */
  .menu-section {
    margin-bottom: 4.5rem;
  }

  .menu-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--menu-muted);
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--menu-line);
    margin: 0 0 2rem;
  }

  /* ── Single Menu Listing Item ── */
  .menu-item {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 1rem 0;
    transition: opacity 0.18s ease;
  }

  .menu-item:hover {
    text-decoration: none;
    color: inherit;
    opacity: 0.75;
  }

  /* Top row: Name on left, dots leader, price on right */
  .menu-item-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .menu-item-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--menu-text);
    margin: 0;
    white-space: nowrap;
  }

  .menu-item-leader {
    flex-grow: 1;
    border-bottom: 1px dotted var(--menu-line);
    margin: 0 0.25rem;
    transform: translateY(-4px);
  }

  .menu-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--menu-text);
    white-space: nowrap;
  }

  .menu-item-price s {
    color: #a89e94;
    font-weight: 400;
    font-size: 0.95rem;
    margin-right: 0.35rem;
  }

  .menu-item-price .sale-val {
    color: var(--menu-sale);
  }

  /* Bottom row: Subtitle / notes */
  .menu-item-desc {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-top: 0.25rem;
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.9rem;
    color: var(--menu-muted);
  }

  .menu-item-notes {
    font-style: italic;
  }

  .menu-item-meta {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    text-align: right;
  }

  @media (max-width: 580px) {
    .menu-item-leader {
      display: none;
    }
    .menu-item-desc {
      flex-direction: column;
      gap: 0.15rem;
    }
  }
</style>

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

    <a href="{{ '/shop-menu/' | relative_url }}" class="menu-item">
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
