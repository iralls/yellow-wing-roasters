---
layout: index
title: Home
hide_header: true
hide_footer: true
---

<style>
  /* ── Homepage Specific Layout (standalone centered landing) ── */
  body.home-layout .site-wrap {
    justify-content: center;
  }

  body.home-layout .main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem 1.5rem;
  }

  .home-hero {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 38rem;
    margin: 0 auto;
  }

  /* ── Main Feather Mark Above Text ── */
  .home-feather-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .home-feather-img {
    display: block;
    width: auto;
    height: 440px;
    max-height: 48vh;
    aspect-ratio: 231 / 800;
    object-fit: contain;
    /* Static feather: no hover scale or shape change */
  }

  /* ── Typographic Brand Wordmark ── */
  .hero-brand-wordmark .brand-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 7vw, 4.25rem);
    font-weight: 600;
    color: #f0c838;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1.05;
  }

  .hero-brand-wordmark .brand-sub {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(1.3rem, 3.5vw, 1.95rem);
    font-weight: 500;
    color: #302010;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    line-height: 1;
    margin-top: 0.35rem;
  }

  /* ── Hero Description & Actions ── */
  .hero-description {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 400;
    color: #6e5e54;
    letter-spacing: 0.01em;
    margin-top: 0.25rem;
  }

  .hero-actions {
    margin-top: 0.5rem;
  }

  .hero-btn {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    display: inline-block;
    padding: 0.85rem 2.25rem;
    background: #302010;
    color: #ffffff;
    border-radius: 999px;
    font-weight: 500;
    font-size: 1rem;
    letter-spacing: 0.01em;
    text-decoration: none;
    transition: background 0.2s ease;
  }

  .hero-btn:hover {
    background: #9c6d12;
    color: #ffffff;
    text-decoration: none;
  }
</style>

<div class="home-hero">
  <div class="home-feather-wrap">
    <img src="{{ '/images/audubon-feather-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Feather" class="home-feather-img" fetchpriority="high" decoding="async">
  </div>
  <div class="brand-wordmark hero-brand-wordmark">
    <span class="brand-name">Yellow Wing</span>
    <span class="brand-sub">Roasters</span>
  </div>
  <p class="hero-description">Wake up with a chirp</p>
  <div class="hero-actions">
    <a href="{{ '/shop-menu/' | relative_url }}" class="hero-btn">Explore Coffee</a>
  </div>
</div>
