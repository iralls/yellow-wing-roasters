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
        <strong style="display: block; font-size: 0.88rem; color: #2c1e14; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem;">Footer Variant</strong>
        <span style="font-size: 0.82rem; color: #776558;">Switch between the 4-column menu layout and the ultra-minimal feather mark:</span>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" id="toggle-variant-columns" class="preview-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #2c1e14; background: #2c1e14; color: #fff; cursor: pointer;">4-Column Menu Layout</button>
        <button type="button" id="toggle-variant-minimal" class="preview-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem; font-family: inherit; font-weight: 600; border-radius: 4px; border: 1px solid #d4c8be; background: #fff; color: #2c1e14; cursor: pointer;">Ultra-Minimal (Feather &amp; est 2026 only)</button>
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
      // Footer Variant Toggle
      var btnColumns = document.getElementById('toggle-variant-columns');
      var btnMinimal = document.getElementById('toggle-variant-minimal');

      // Header Behavior Toggle
      var btnHeaderStatic = document.getElementById('toggle-header-static');
      var btnHeaderSticky = document.getElementById('toggle-header-sticky');

      function setActive(activeBtn, inactiveBtn) {
        if (!activeBtn || !inactiveBtn) return;
        activeBtn.style.background = '#2c1e14';
        activeBtn.style.color = '#ffffff';
        activeBtn.style.borderColor = '#2c1e14';
        inactiveBtn.style.background = '#ffffff';
        inactiveBtn.style.color = '#2c1e14';
        inactiveBtn.style.borderColor = '#d4c8be';
      }

      function showColumns() {
        var footer = document.getElementById('streamlined-footer');
        if (footer) footer.classList.remove('streamlined-footer--minimal-only');
        setActive(btnColumns, btnMinimal);
      }

      function showMinimal() {
        var footer = document.getElementById('streamlined-footer');
        if (footer) footer.classList.add('streamlined-footer--minimal-only');
        setActive(btnMinimal, btnColumns);
      }

      function setHeaderStatic() {
        document.body.classList.remove('preview-sticky-header');
        setActive(btnHeaderStatic, btnHeaderSticky);
      }

      function setHeaderSticky() {
        document.body.classList.add('preview-sticky-header');
        setActive(btnHeaderSticky, btnHeaderStatic);
      }

      if (btnColumns && btnMinimal) {
        btnColumns.addEventListener('click', function () {
          showColumns();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname);
        });

        btnMinimal.addEventListener('click', function () {
          showMinimal();
          if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#minimal');
        });
      }

      if (btnHeaderStatic && btnHeaderSticky) {
        btnHeaderStatic.addEventListener('click', setHeaderStatic);
        btnHeaderSticky.addEventListener('click', setHeaderSticky);
      }

      if (window.location.hash === '#minimal') {
        showMinimal();
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPreviewControls);
    } else {
      initPreviewControls();
    }
  })();
</script>
