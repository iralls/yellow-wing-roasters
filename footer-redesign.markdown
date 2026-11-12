---
layout: default
title: Footer Redesign Preview
permalink: /footer-redesign/
footer_variant: redesign
---

<style>
  /* Header behavior on preview page: static by default (does not follow scroll) */
  body:not(.preview-sticky-header) .sleek-sticky-navbar-wrap {
    position: static !important;
    top: auto !important;
  }

  /* Remove header borders on footer-redesign preview page */
  .sleek-sticky-navbar-wrap,
  .sleek-main-header,
  .sleek-navbar-container {
    border-top: none !important;
    border-bottom: none !important;
  }

  /* Remove border line in ultra-minimal footer mode */
  .sleek-bottom-nav-footer.streamlined-footer--minimal-only {
    border-top: none !important;
    border: none !important;
  }

  /* ── Header Variant 1: Hester Style (Menu Left, Center Logo, Cart Right) ── */
  body.header-variant-hester .sleek-navbar-container {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    align-items: center !important;
  }
  body.header-variant-hester .sleek-nav-links {
    order: 1 !important;
    justify-self: start !important;
    margin: 0 !important;
  }
  body.header-variant-hester .sleek-brand-lockup-inline {
    order: 2 !important;
    justify-self: center !important;
    display: inline-flex !important;
    align-items: center !important;
    opacity: 1 !important;
    visibility: visible !important;
    margin: 0 auto !important;
  }
  body.header-variant-hester .sleek-nav-actions {
    order: 3 !important;
    justify-self: end !important;
    display: flex !important;
    justify-content: flex-end !important;
    margin: 0 !important;
  }
  body.header-variant-hester .sleek-nav-item:first-child .sleek-nav-dropdown-menu {
    left: 0 !important;
    transform: translateX(0) translateY(4px) !important;
  }

  /* ── Header Variant 2: Hester Stacked (Menu Left, Centered Vertical Crest, Cart Right) ── */
  body.header-variant-hester-stacked .sleek-navbar-container {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    align-items: center !important;
    padding-top: 0.6rem !important;
    padding-bottom: 0.6rem !important;
  }
  body.header-variant-hester-stacked .sleek-nav-links {
    order: 1 !important;
    justify-self: start !important;
    margin: 0 !important;
  }
  body.header-variant-hester-stacked .sleek-brand-lockup-inline {
    order: 2 !important;
    justify-self: center !important;
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    opacity: 1 !important;
    visibility: visible !important;
    margin: 0 auto !important;
    gap: 0.2rem !important;
  }
  body.header-variant-hester-stacked .sleek-brand-inline-icon {
    height: 2.6rem !important;
    margin: 0 auto !important;
  }
  body.header-variant-hester-stacked .sleek-brand-inline-text {
    align-items: center !important;
    text-align: center !important;
  }
  body.header-variant-hester-stacked .sleek-brand-inline-name {
    font-size: 0.95rem !important;
  }
  body.header-variant-hester-stacked .sleek-brand-inline-sub {
    font-size: 0.52rem !important;
  }
  body.header-variant-hester-stacked .sleek-nav-actions {
    order: 3 !important;
    justify-self: end !important;
    display: flex !important;
    justify-content: flex-end !important;
    margin: 0 !important;
  }
  body.header-variant-hester-stacked .sleek-nav-item:first-child .sleek-nav-dropdown-menu {
    left: 0 !important;
    transform: translateX(0) translateY(4px) !important;
  }

  /* ── Header Variant 3: Classic (Logo Left, Menu Center, Cart Right) ── */
  body.header-variant-classic .sleek-navbar-container {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
    align-items: center !important;
  }
  body.header-variant-classic .sleek-brand-lockup-inline {
    order: 1 !important;
    justify-self: start !important;
    display: inline-flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  body.header-variant-classic .sleek-nav-links {
    order: 2 !important;
    justify-self: center !important;
  }
  body.header-variant-classic .sleek-nav-actions {
    order: 3 !important;
    justify-self: end !important;
  }

  /* ── Header Variant 4: Right-Aligned Menu (Logo Left, Nav & Cart on Right) ── */
  body.header-variant-right .sleek-navbar-container {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
  body.header-variant-right .sleek-brand-lockup-inline {
    order: 1 !important;
    margin-right: auto !important;
    display: inline-flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  body.header-variant-right .sleek-nav-links {
    order: 2 !important;
    margin-left: auto !important;
    margin-right: 2.5rem !important;
    justify-self: auto !important;
  }
  body.header-variant-right .sleek-nav-actions {
    order: 3 !important;
    margin-left: 0 !important;
  }

  /* ── Header Variant 5: Feather Only (6rem Height, Centered, Menu Left, Cart Right) ── */
  body.header-variant-feather-only .sleek-navbar-container {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    align-items: center !important;
    padding-top: 0.65rem !important;
    padding-bottom: 0.65rem !important;
  }
  body.header-variant-feather-only .sleek-nav-links {
    order: 1 !important;
    justify-self: start !important;
    margin: 0 !important;
  }
  body.header-variant-feather-only .sleek-brand-lockup-inline {
    order: 2 !important;
    justify-self: center !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    opacity: 1 !important;
    visibility: visible !important;
    margin: 0 auto !important;
  }
  body.header-variant-feather-only .sleek-brand-inline-icon {
    height: 6rem !important;
    width: auto !important;
    aspect-ratio: 231 / 800 !important;
    object-fit: contain !important;
    display: block !important;
    margin: 0 auto !important;
  }
  body.header-variant-feather-only .sleek-brand-inline-text {
    display: none !important;
  }
  body.header-variant-feather-only .sleek-nav-actions {
    order: 3 !important;
    justify-self: end !important;
    display: flex !important;
    justify-content: flex-end !important;
    margin: 0 !important;
  }
  body.header-variant-feather-only .sleek-nav-item:first-child .sleek-nav-dropdown-menu {
    left: 0 !important;
    transform: translateX(0) translateY(4px) !important;
  }

  /* ── Header Variant 6: Hester Wordmark (Menu Left, Centered Text Logo Without Feather, Larger Text) ── */
  body.header-variant-hester-wordmark .sleek-navbar-container {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    align-items: center !important;
    padding-top: 50px !important;
    padding-bottom: 1.25rem !important;
    padding-left: 5rem !important;
    padding-right: 5rem !important;
  }
  body.header-variant-hester-wordmark .sleek-nav-links {
    order: 1 !important;
    justify-self: start !important;
    margin: 0 !important;
    gap: 1rem !important;
  }
  body.header-variant-hester-wordmark .sleek-brand-lockup-inline {
    order: 2 !important;
    justify-self: center !important;
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    opacity: 1 !important;
    visibility: visible !important;
    margin: 0 auto !important;
    text-decoration: none !important;
  }
  body.header-variant-hester-wordmark .sleek-brand-inline-icon {
    display: none !important;
  }
  body.header-variant-hester-wordmark .sleek-brand-inline-text {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }
  body.header-variant-hester-wordmark .sleek-brand-inline-name {
    font-size: 1.7rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.05em !important;
    line-height: 1.05 !important;
    color: #f0c838 !important;
  }
  body.header-variant-hester-wordmark .sleek-brand-inline-sub {
    font-size: 1rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.22em !important;
    text-transform: uppercase !important;
    margin-top: 0.15rem !important;
    color: #302010 !important;
    line-height: 1 !important;
  }
  body.header-variant-hester-wordmark .sleek-nav-actions {
    order: 3 !important;
    justify-self: end !important;
    display: flex !important;
    justify-content: flex-end !important;
    margin: 0 !important;
  }
  body.header-variant-hester-wordmark .sleek-nav-item:first-child .sleek-nav-dropdown-menu {
    left: 0 !important;
    transform: translateX(0) translateY(4px) !important;
  }

  /* Mobile responsiveness for header variants */
  @media (max-width: 768px) {
    body.header-variant-hester .sleek-navbar-container,
    body.header-variant-hester-stacked .sleek-navbar-container,
    body.header-variant-hester-wordmark .sleek-navbar-container,
    body.header-variant-classic .sleek-navbar-container,
    body.header-variant-right .sleek-navbar-container,
    body.header-variant-feather-only .sleek-navbar-container {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
    body.header-variant-hester .sleek-brand-lockup-inline,
    body.header-variant-hester-stacked .sleek-brand-lockup-inline,
    body.header-variant-hester-wordmark .sleek-brand-lockup-inline,
    body.header-variant-feather-only .sleek-brand-lockup-inline {
      order: 1 !important;
      margin: 0 !important;
      flex-direction: row !important;
    }
    body.header-variant-hester .sleek-nav-actions,
    body.header-variant-hester-stacked .sleek-nav-actions,
    body.header-variant-hester-wordmark .sleek-nav-actions,
    body.header-variant-feather-only .sleek-nav-actions {
      order: 2 !important;
    }
    body.header-variant-hester-stacked .sleek-brand-inline-icon {
      height: 2.25rem !important;
    }
    body.header-variant-feather-only .sleek-brand-inline-icon {
      height: 4rem !important;
    }
    body.header-variant-hester-wordmark .sleek-brand-inline-name {
      font-size: 1.15rem !important;
    }
    body.header-variant-hester-wordmark .sleek-brand-inline-sub {
      font-size: 0.58rem !important;
    }
    body.header-variant-hester-wordmark .sleek-navbar-container {
      padding-top: 24px !important;
      padding-left: 1.25rem !important;
      padding-right: 1.25rem !important;
    }
  }

  /* ═════════════════════════════════════════════════════════════════════════
     PREVIEW FOOTER REDESIGN STYLES (Scoped strictly to this preview page)
     ═════════════════════════════════════════════════════════════════════════ */

  /* Base Quick Links (Hidden by default in standard footers) */
  .streamlined-footer-quick-links {
    display: none;
  }

  /* 3-Column Compact Grid */
  .streamlined-footer-grid {
    display: grid !important;
    grid-template-columns: 1.25fr 1fr 1.6fr !important;
    max-width: 56rem !important;
    margin: 0 auto 3.5rem !important;
    gap: 3rem !important;
  }

  @media (max-width: 850px) {
    .streamlined-footer-grid {
      grid-template-columns: 1fr !important;
      max-width: 26rem !important;
      gap: 2.25rem !important;
      text-align: center !important;
    }
    .streamlined-footer-grid .sleek-footer-heading {
      margin-top: 0.5rem !important;
    }
    .streamlined-footer-grid .sleek-footer-links-list {
      align-items: center !important;
    }
  }

  /* ── Variant: Feather & Slogan (6rem Feather directly above "Wake up with a chirp") ── */
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan {
    background: transparent !important;
    border-top: none !important;
    border: none !important;
    padding: 4.5rem 1.5rem 4rem !important;
    margin-top: 4rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-container {
    max-width: 40rem !important;
    margin: 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .streamlined-footer-grid {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin: 0 auto !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-col:nth-child(2),
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-col--signup,
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-bottom-bar,
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .streamlined-footer-quick-links {
    display: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-col--brand {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    width: fit-content !important;
    margin: 0 auto !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-brand-lockup {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin-bottom: 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-brand-title,
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-brand-sub {
    display: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-feather-icon {
    height: 6rem !important;
    width: auto !important;
    aspect-ratio: 231 / 800 !important;
    object-fit: contain !important;
    margin: 0 auto 0.75rem auto !important;
    display: block !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--feather-slogan .sleek-footer-tagline {
    text-align: center !important;
    margin: 0 !important;
    color: #6e5e54 !important;
    font-size: 1.1rem !important;
    font-style: italic !important;
    line-height: 1.5 !important;
    white-space: nowrap !important;
  }

  /* ── Variant: Centered Logo & Quick Links (No Bg) ── */
  .sleek-bottom-nav-footer.streamlined-footer--centered-links {
    background: transparent !important;
    border-top: none !important;
    border: none !important;
    padding: 4.5rem 1.5rem 4rem !important;
    margin-top: 4rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-container {
    max-width: 40rem !important;
    margin: 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .streamlined-footer-grid {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin: 0 auto !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-col:nth-child(2),
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-col--signup,
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-bottom-bar {
    display: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-col--brand {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    width: fit-content !important;
    margin: 0 auto !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-brand-lockup {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin-bottom: 0.45rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-feather-icon {
    height: 5rem !important;
    width: auto !important;
    aspect-ratio: 231 / 800 !important;
    object-fit: contain !important;
    margin: 0 auto 0.65rem auto !important;
    display: block !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-brand-title {
    text-align: center !important;
    color: #f0c838 !important;
    font-size: 1.35rem !important;
    letter-spacing: 0.09em !important;
    line-height: 1.1 !important;
    white-space: nowrap !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-brand-sub {
    text-align: center !important;
    color: #302010 !important;
    letter-spacing: 0.24em !important;
    margin-top: 0.2rem !important;
    font-size: 0.72rem !important;
    white-space: nowrap !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .sleek-footer-tagline {
    text-align: center !important;
    margin: 0.45rem 0 0 !important;
    color: #6e5e54 !important;
    font-size: 1.05rem !important;
    font-style: italic !important;
    line-height: 1.5 !important;
    white-space: nowrap !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .streamlined-footer-quick-links {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 1.25rem !important;
    flex-wrap: wrap !important;
    margin-top: 1.85rem !important;
    padding-top: 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .streamlined-footer-quick-link {
    font-family: "Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: #443022 !important;
    text-decoration: none !important;
    transition: color 0.15s ease !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .streamlined-footer-quick-link:hover {
    color: #f0c838 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered-links .streamlined-footer-quick-sep {
    color: rgba(44, 30, 20, 0.25) !important;
    font-size: 0.85rem !important;
  }

  /* ── Variant: Hester Left-Aligned Minimalist Footer ── */
  .sleek-bottom-nav-footer.streamlined-footer--hester-left {
    background: #ffffff !important;
    border-top: 1px solid rgba(44, 30, 20, 0.08) !important;
    padding: 4.5rem 2rem 5rem !important;
    margin-top: 5rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-container {
    max-width: 81.5rem !important;
    margin: 0 auto !important;
    padding: 0 1rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .streamlined-footer-grid {
    display: block !important;
    max-width: 100% !important;
    margin: 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col:nth-child(2),
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--signup,
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-bottom-bar,
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .streamlined-footer-quick-links {
    display: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    width: fit-content !important;
    margin: 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand .sleek-footer-brand-lockup {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin-bottom: 0.45rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand .sleek-footer-feather-icon {
    height: 5rem !important;
    width: auto !important;
    aspect-ratio: 231 / 800 !important;
    object-fit: contain !important;
    margin: 0 auto 0.65rem auto !important;
    display: block !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand .sleek-footer-brand-title {
    text-align: center !important;
    color: #f0c838 !important;
    font-size: 1.35rem !important;
    letter-spacing: 0.09em !important;
    line-height: 1.1 !important;
    white-space: nowrap !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand .sleek-footer-brand-sub {
    text-align: center !important;
    color: #302010 !important;
    letter-spacing: 0.24em !important;
    margin-top: 0.2rem !important;
    font-size: 0.72rem !important;
    white-space: nowrap !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left .sleek-footer-col--brand .sleek-footer-tagline {
    text-align: center !important;
    margin: 0.45rem 0 0 !important;
    color: #6e5e54 !important;
    font-size: 1.05rem !important;
    font-style: italic !important;
    line-height: 1.5 !important;
    white-space: nowrap !important;
  }

  /* Sub-options for Hester Left */
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand {
    align-items: flex-start !important;
    text-align: left !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand .sleek-footer-brand-lockup {
    align-items: flex-start !important;
    text-align: left !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand .sleek-footer-feather-icon {
    margin: 0 0 0.65rem 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand .sleek-footer-brand-title,
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand .sleek-footer-brand-sub,
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--flush-left .sleek-footer-col--brand .sleek-footer-tagline {
    text-align: left !important;
  }

  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--row-align .sleek-footer-col--brand .sleek-footer-brand-lockup {
    flex-direction: row !important;
    align-items: center !important;
    gap: 1.15rem !important;
    margin-bottom: 0.4rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--row-align .sleek-footer-col--brand .sleek-footer-feather-icon {
    margin: 0 !important;
    flex-shrink: 0 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--row-align .sleek-footer-col--brand .sleek-footer-brand-title,
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--row-align .sleek-footer-col--brand .sleek-footer-brand-sub {
    text-align: left !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--row-align .sleek-footer-col--brand .sleek-footer-tagline {
    text-align: left !important;
    margin: 0.35rem 0 0 0 !important;
  }

  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--cream {
    background: #faf8f5 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--linen {
    background: #f5efe6 !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--hester-left.streamlined-footer--borderless {
    border-top: none !important;
  }

  /* ── Variant: Centered Atelier Layout (2-Row) ── */
  .sleek-bottom-nav-footer.streamlined-footer--centered {
    padding: 3.75rem 1.5rem 3.5rem !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid {
    display: grid !important;
    grid-template-columns: 1fr 1.4fr !important;
    grid-template-areas:
      "brand brand"
      "contact signup" !important;
    max-width: 44rem !important;
    margin: 0 auto !important;
    column-gap: 3.5rem !important;
    row-gap: 2.5rem !important;
    align-items: start !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-col--brand {
    grid-area: brand !important;
    margin: 0 auto !important;
    max-width: 24rem !important;
    text-align: center !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-col:nth-child(2) {
    grid-area: contact !important;
    text-align: left !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-col--signup {
    grid-area: signup !important;
    text-align: left !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--centered .sleek-footer-bottom-bar,
  .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-quick-links {
    display: none !important;
  }

  @media (max-width: 650px) {
    .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid {
      grid-template-columns: 1fr !important;
      grid-template-areas:
        "brand"
        "contact"
        "signup" !important;
      max-width: 24rem !important;
      gap: 2rem !important;
      text-align: center !important;
    }
    .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-col:nth-child(2),
    .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-col--signup {
      text-align: center !important;
    }
    .sleek-bottom-nav-footer.streamlined-footer--centered .streamlined-footer-grid .sleek-footer-links-list {
      align-items: center !important;
    }
  }

  /* ── Variant: Ultra-Minimal Only ── */
  .sleek-bottom-nav-footer.streamlined-footer--minimal-only {
    padding: 3rem 1.5rem 2.5rem !important;
    margin-top: 4rem !important;
    border-top: none !important;
    border: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--minimal-only .streamlined-footer-grid,
  .sleek-bottom-nav-footer.streamlined-footer--minimal-only .streamlined-footer-quick-links {
    display: none !important;
  }
  .sleek-bottom-nav-footer.streamlined-footer--minimal-only .sleek-footer-bottom-bar {
    border-top: none !important;
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
</style>

<div class="roast-minimal-vertical" style="max-width: 52rem; margin: 0 auto; padding: 2rem 1rem;">

  <div class="roast-mv-center" style="margin-bottom: 2rem;">
    <span style="display: inline-block; padding: 0.3rem 0.85rem; border-radius: 999px; background: #eef2eb; color: #3b5e39; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem;">Design Preview</span>
    <h1 class="roast-mv-title" style="font-size: 2.2rem; margin-bottom: 0.5rem;">Footer Redesign Preview</h1>
    <p style="color: #6e5e54; font-size: 1rem; max-width: 40rem; margin: 0 auto; line-height: 1.6;">
      Compare the redesigned footer variants below. The header on this page is set to <strong>static</strong> (it remains at the top and will not follow your scroll).
    </p>
  </div>

  <!-- Interactive Controls Bar -->
  <div style="background: #ffffff; border: 1px solid rgba(44, 30, 20, 0.12); border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 3rem; box-shadow: 0 4px 12px rgba(44, 30, 20, 0.04); display: flex; flex-direction: column; gap: 1.25rem;">
    <!-- Footer Toggle Row -->
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
      <div>
        <strong style="display: block; font-size: 0.88rem; color: #2c1e14; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem;">Footer Layout Options</strong>
        <span style="font-size: 0.82rem; color: #776558;">Compare the streamlined minimal layout options below:</span>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" id="toggle-variant-feather-slogan" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #2c1e14; background: #2c1e14; color: #fff; cursor: pointer;">Feather &amp; Slogan (6rem)</button>
        <button type="button" id="toggle-variant-centered-links" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Centered Logo &amp; Links (No Bg)</button>
        <button type="button" id="toggle-variant-hester-white" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Hester Left (Vertically Aligned)</button>
        <button type="button" id="toggle-variant-hester-flush" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Hester Left (Flush Left)</button>
        <button type="button" id="toggle-variant-hester-row" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Hester Left (Side-by-Side)</button>
        <button type="button" id="toggle-variant-hester-cream" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Brand Cream (#faf8f5)</button>
        <button type="button" id="toggle-variant-hester-linen" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Oat Linen (#f5efe6)</button>
        <button type="button" id="toggle-variant-centered" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Centered Atelier (2-Row)</button>
        <button type="button" id="toggle-variant-columns" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">3-Column Compact</button>
        <button type="button" id="toggle-variant-minimal" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Ultra-Minimal (Feather Mark)</button>
      </div>
    </div>

    <!-- Header Layout Options Row -->
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid rgba(44, 30, 20, 0.08); padding-top: 1rem;">
      <div>
        <strong style="display: block; font-size: 0.88rem; color: #2c1e14; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem;">Header Layout Style</strong>
        <span style="font-size: 0.82rem; color: #776558;">Compare header arrangements (Hester logo centered, classic, right-aligned):</span>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" id="toggle-header-hester-wordmark" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #2c1e14; background: #2c1e14; color: #fff; cursor: pointer;">Hester (No Feather, Larger Text)</button>
        <button type="button" id="toggle-header-feather-only" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Feather Only (6rem)</button>
        <button type="button" id="toggle-header-hester" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Hester (Menu Left, Center Logo)</button>
        <button type="button" id="toggle-header-hester-stacked" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Hester Crest (Vertical Logo)</button>
        <button type="button" id="toggle-header-classic" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Classic (Logo Left, Menu Center)</button>
        <button type="button" id="toggle-header-right" class="preview-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Right-Aligned Menu</button>
      </div>
    </div>

    <!-- Header Scroll Behavior Toggle Row -->
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid rgba(44, 30, 20, 0.08); padding-top: 1rem;">
      <div>
        <strong style="display: block; font-size: 0.88rem; color: #2c1e14; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem;">Header Scroll Behavior</strong>
        <span style="font-size: 0.82rem; color: #776558;">Controls whether the header floats and follows your scroll:</span>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" id="toggle-header-static" class="preview-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #2c1e14; background: #2c1e14; color: #fff; cursor: pointer;">Static Header (Does Not Follow Scroll)</button>
        <button type="button" id="toggle-header-sticky" class="preview-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Sticky Header (Follows Scroll)</button>
      </div>
    </div>
  </div>

  <!-- Simulated Page Content (Generous height for scroll testing) -->
  <div style="display: flex; flex-direction: column; gap: 2rem; margin-bottom: 4rem;">
    <div style="background: #faf8f5; border: 1px dashed rgba(44, 30, 20, 0.15); border-radius: 8px; padding: 2.5rem 1.75rem; text-align: center; color: #5c4a3e;">
      <h2 style="font-family: var(--font-display, inherit); font-size: 1.35rem; color: #2c1e14; margin-bottom: 0.5rem;">Sample Content Block 1</h2>
      <p style="max-width: 32rem; margin: 0 auto 1.25rem; font-size: 0.92rem; line-height: 1.6;">
        Notice how as you scroll down past this section, the navigation header stays at the top of the page rather than docking to your screen.
      </p>
      <div style="display: inline-flex; gap: 1rem;">
        <a href="{{ '/about/' | relative_url }}" style="font-size: 0.85rem; font-weight: 600; color: #9c6d12; text-decoration: underline;">View About Us</a>
        <a href="{{ '/partners/' | relative_url }}" style="font-size: 0.85rem; font-weight: 600; color: #9c6d12; text-decoration: underline;">View Partner Roasts</a>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid rgba(44, 30, 20, 0.08); border-radius: 8px; padding: 3rem 1.75rem; text-align: center; color: #5c4a3e;">
      <h2 style="font-family: var(--font-display, inherit); font-size: 1.35rem; color: #2c1e14; margin-bottom: 0.5rem;">Sample Content Block 2</h2>
      <p style="max-width: 34rem; margin: 0 auto; font-size: 0.92rem; line-height: 1.6;">
        Continue scrolling downward to preview the transition into the footer below.
      </p>
    </div>
  </div>

</div>

<script>
  (function () {
    function initPreviewControls() {
      // Footer Variant Toggles
      var btnFeatherSlogan = document.getElementById('toggle-variant-feather-slogan');
      var btnCenteredLinks = document.getElementById('toggle-variant-centered-links');
      var btnHesterWhite = document.getElementById('toggle-variant-hester-white');
      var btnHesterFlush = document.getElementById('toggle-variant-hester-flush');
      var btnHesterRow = document.getElementById('toggle-variant-hester-row');
      var btnHesterCream = document.getElementById('toggle-variant-hester-cream');
      var btnHesterLinen = document.getElementById('toggle-variant-hester-linen');
      var btnCentered = document.getElementById('toggle-variant-centered');
      var btnColumns = document.getElementById('toggle-variant-columns');
      var btnMinimal = document.getElementById('toggle-variant-minimal');
      var footerButtons = [btnFeatherSlogan, btnCenteredLinks, btnHesterWhite, btnHesterFlush, btnHesterRow, btnHesterCream, btnHesterLinen, btnCentered, btnColumns, btnMinimal].filter(Boolean);

      // Header Behavior Toggles
      var btnHeaderStatic = document.getElementById('toggle-header-static');
      var btnHeaderSticky = document.getElementById('toggle-header-sticky');

      // Header Layout Style Toggles
      var btnHesterWordmark = document.getElementById('toggle-header-hester-wordmark');
      var btnFeatherOnly = document.getElementById('toggle-header-feather-only');
      var btnHester = document.getElementById('toggle-header-hester');
      var btnHesterStacked = document.getElementById('toggle-header-hester-stacked');
      var btnClassic = document.getElementById('toggle-header-classic');
      var btnRight = document.getElementById('toggle-header-right');
      var headerLayoutButtons = [
        { btn: btnHesterWordmark, cls: 'header-variant-hester-wordmark' },
        { btn: btnFeatherOnly, cls: 'header-variant-feather-only' },
        { btn: btnHester, cls: 'header-variant-hester' },
        { btn: btnHesterStacked, cls: 'header-variant-hester-stacked' },
        { btn: btnClassic, cls: 'header-variant-classic' },
        { btn: btnRight, cls: 'header-variant-right' }
      ].filter(function (item) { return item.btn !== null; });

      function setHeaderLayout(targetCls) {
        headerLayoutButtons.forEach(function (item) {
          document.body.classList.remove(item.cls);
          if (item.cls === targetCls) {
            item.btn.style.background = '#2c1e14';
            item.btn.style.color = '#ffffff';
            item.btn.style.borderColor = '#2c1e14';
          } else {
            item.btn.style.background = '#ffffff';
            item.btn.style.color = '#2c1e14';
            item.btn.style.borderColor = '#d4c8be';
          }
        });
        document.body.classList.add(targetCls);
      }

      headerLayoutButtons.forEach(function (item) {
        item.btn.addEventListener('click', function () {
          setHeaderLayout(item.cls);
        });
      });

      // Default header layout to Hester Wordmark (No Feather, Larger Text)
      setHeaderLayout('header-variant-hester-wordmark');

      function setActiveFooter(activeBtn) {
        footerButtons.forEach(function (btn) {
          if (btn === activeBtn) {
            btn.style.background = '#2c1e14';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#2c1e14';
          } else {
            btn.style.background = '#ffffff';
            btn.style.color = '#2c1e14';
            btn.style.borderColor = '#d4c8be';
          }
        });
      }

      function setActiveHeader(activeBtn, inactiveBtn) {
        if (!activeBtn || !inactiveBtn) return;
        activeBtn.style.background = '#2c1e14';
        activeBtn.style.color = '#ffffff';
        activeBtn.style.borderColor = '#2c1e14';
        inactiveBtn.style.background = '#ffffff';
        inactiveBtn.style.color = '#2c1e14';
        inactiveBtn.style.borderColor = '#d4c8be';
      }

      function clearFooterClasses() {
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.remove(
            'streamlined-footer--feather-slogan',
            'streamlined-footer--centered-links',
            'streamlined-footer--minimal-only',
            'streamlined-footer--centered',
            'streamlined-footer--hester-left',
            'streamlined-footer--flush-left',
            'streamlined-footer--row-align',
            'streamlined-footer--cream',
            'streamlined-footer--linen'
          );
        }
      }

      function showFeatherSlogan() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) footer.classList.add('streamlined-footer--feather-slogan');
        setActiveFooter(btnFeatherSlogan);
      }

      function showCenteredLinks() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) footer.classList.add('streamlined-footer--centered-links');
        setActiveFooter(btnCenteredLinks);
      }

      function showHesterWhite() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) footer.classList.add('streamlined-footer--hester-left');
        setActiveFooter(btnHesterWhite);
      }

      function showHesterFlush() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--hester-left', 'streamlined-footer--flush-left');
        }
        setActiveFooter(btnHesterFlush);
      }

      function showHesterRow() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--hester-left', 'streamlined-footer--row-align');
        }
        setActiveFooter(btnHesterRow);
      }

      function showHesterCream() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--hester-left', 'streamlined-footer--cream');
        }
        setActiveFooter(btnHesterCream);
      }

      function showHesterLinen() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--hester-left', 'streamlined-footer--linen');
        }
        setActiveFooter(btnHesterLinen);
      }

      function showColumns() {
        clearFooterClasses();
        setActiveFooter(btnColumns);
      }

      function showCentered() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--centered');
        }
        setActiveFooter(btnCentered);
      }

      function showMinimal() {
        clearFooterClasses();
        var footer = document.getElementById('streamlined-footer');
        if (footer) {
          footer.classList.add('streamlined-footer--minimal-only');
        }
        setActiveFooter(btnMinimal);
      }

      function setHeaderStatic() {
        document.body.classList.remove('preview-sticky-header');
        setActiveHeader(btnHeaderStatic, btnHeaderSticky);
      }

      function setHeaderSticky() {
        document.body.classList.add('preview-sticky-header');
        setActiveHeader(btnHeaderSticky, btnHeaderStatic);
      }

      if (btnFeatherSlogan) {
        btnFeatherSlogan.addEventListener('click', function () {
          showFeatherSlogan();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#feather-slogan');
        });
      }

      if (btnCenteredLinks) {
        btnCenteredLinks.addEventListener('click', function () {
          showCenteredLinks();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#centered-links');
        });
      }

      if (btnHesterWhite) {
        btnHesterWhite.addEventListener('click', function () {
          showHesterWhite();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#hester-white');
        });
      }

      if (btnHesterFlush) {
        btnHesterFlush.addEventListener('click', function () {
          showHesterFlush();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#hester-flush');
        });
      }

      if (btnHesterRow) {
        btnHesterRow.addEventListener('click', function () {
          showHesterRow();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#hester-row');
        });
      }

      if (btnHesterCream) {
        btnHesterCream.addEventListener('click', function () {
          showHesterCream();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#hester-cream');
        });
      }

      if (btnHesterLinen) {
        btnHesterLinen.addEventListener('click', function () {
          showHesterLinen();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#hester-linen');
        });
      }

      if (btnCentered) {
        btnCentered.addEventListener('click', function () {
          showCentered();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#centered');
        });
      }

      if (btnColumns) {
        btnColumns.addEventListener('click', function () {
          showColumns();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#columns');
        });
      }

      if (btnMinimal) {
        btnMinimal.addEventListener('click', function () {
          showMinimal();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#minimal');
        });
      }

      if (btnHeaderStatic && btnHeaderSticky) {
        btnHeaderStatic.addEventListener('click', setHeaderStatic);
        btnHeaderSticky.addEventListener('click', setHeaderSticky);
      }

      if (window.location.hash === '#centered-links') {
        showCenteredLinks();
      } else if (window.location.hash === '#hester-white') {
        showHesterWhite();
      } else if (window.location.hash === '#hester-flush') {
        showHesterFlush();
      } else if (window.location.hash === '#hester-row') {
        showHesterRow();
      } else if (window.location.hash === '#hester-cream') {
        showHesterCream();
      } else if (window.location.hash === '#hester-linen') {
        showHesterLinen();
      } else if (window.location.hash === '#centered') {
        showCentered();
      } else if (window.location.hash === '#columns') {
        showColumns();
      } else if (window.location.hash === '#minimal') {
        showMinimal();
      } else {
        showFeatherSlogan();
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPreviewControls);
    } else {
      initPreviewControls();
    }
  })();
</script>
