/**
 * Yellow Wing Roasters - Buttons, Dropdowns & Pills Preview Engine
 * Supports Multi-Style Presets, Density/Scale Switching, Admin Controls & Live Sliders
 */
(function () {
  'use strict';

  function initButtonsPreview() {
    var page = document.querySelector('.buttons-preview-page');
    if (!page) return;

    var styleBtns = document.querySelectorAll('.bp-style-btn');
    var densityBtns = document.querySelectorAll('.bp-density-btn');
    var slider = document.getElementById('bp-radius-slider');
    var sliderValText = document.getElementById('bp-slider-val');
    var tabBtns = document.querySelectorAll('.bp-tab-btn');

    var sandboxView = document.getElementById('bp-sandbox-view');
    var galleryView = document.getElementById('bp-gallery-view');
    var comparisonView = document.getElementById('bp-comparison-view');

    // Radius helper
    function setRadius(pxVal) {
      if (pxVal === 'pill' || pxVal === '999px' || pxVal >= 999) {
        page.style.setProperty('--preview-radius', '999px');
        page.style.setProperty('--preview-radius-menu', '14px');
        page.style.setProperty('--preview-radius-badge', '999px');
        if (sliderValText) sliderValText.textContent = 'Pill';
        if (slider) slider.value = 24;
      } else {
        var n = parseInt(pxVal, 10);
        page.style.setProperty('--preview-radius', n + 'px');
        var menuR = n === 0 ? 0 : Math.min(n + 2, 12);
        var badgeR = n === 0 ? 0 : Math.max(1, n - 1);
        page.style.setProperty('--preview-radius-menu', menuR + 'px');
        page.style.setProperty('--preview-radius-badge', badgeR + 'px');
        if (sliderValText) sliderValText.textContent = n + 'px';
        if (slider) slider.value = n;
      }
    }

    // Density scale switcher
    function setDensity(density) {
      page.setAttribute('data-density', density);
      densityBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-density') === density);
      });
    }

    // Style preset handler
    styleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var style = btn.getAttribute('data-style');
        styleBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        switch (style) {
          case 'minimal-compact':
            setRadius(4);
            setDensity('compact');
            break;
          case 'micro-slim':
            setRadius(2);
            setDensity('dense');
            break;
          case 'ghost-outline':
            setRadius(4);
            setDensity('compact');
            break;
          case 'sharp-modernist':
            setRadius(0);
            setDensity('compact');
            break;
          case 'soft-rounded':
            setRadius(6);
            setDensity('compact');
            break;
          case 'capsule-pill':
            setRadius(999);
            setDensity('generous');
            break;
          default:
            setRadius(4);
            setDensity('compact');
        }
      });
    });

    // Density button handler
    densityBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var d = btn.getAttribute('data-density');
        setDensity(d);
      });
    });

    // Slider handler
    if (slider) {
      slider.addEventListener('input', function () {
        var val = parseInt(slider.value, 10);
        styleBtns.forEach(function (b) { b.classList.remove('is-active'); });
        setRadius(val);
      });
    }

    // View Mode Tabs Switcher (Sandbox vs Gallery vs Comparison)
    tabBtns.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var mode = tab.getAttribute('data-mode');
        tabBtns.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        if (sandboxView) sandboxView.classList.add('is-hidden');
        if (galleryView) galleryView.classList.remove('is-visible');
        if (comparisonView) comparisonView.classList.remove('is-visible');

        if (mode === 'gallery') {
          if (galleryView) galleryView.classList.add('is-visible');
        } else if (mode === 'comparison') {
          if (comparisonView) comparisonView.classList.add('is-visible');
        } else {
          if (sandboxView) sandboxView.classList.remove('is-hidden');
        }
      });
    });

    // Interactive Size Buttons
    document.querySelectorAll('.bp-size-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.bp-size-group');
        if (group) {
          group.querySelectorAll('.bp-size-btn').forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
        }
      });
    });

    // Interactive Frequency Buttons
    document.querySelectorAll('.bp-freq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.bp-freq-toggle');
        if (group) {
          group.querySelectorAll('.bp-freq-btn').forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
        }
      });
    });

    // Interactive View Switcher Buttons
    document.querySelectorAll('.bp-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.bp-view-switcher');
        if (group) {
          group.querySelectorAll('.bp-view-btn').forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
        }
      });
    });

    // Interactive Multi-Select Trigger Simulation
    document.querySelectorAll('.bp-mms-trigger').forEach(function (trig) {
      trig.addEventListener('click', function () {
        trig.classList.toggle('is-active');
      });
    });

    // Interactive Admin Filter Pills
    document.querySelectorAll('.bp-admin-filter-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var group = pill.closest('.bp-admin-filter-pills');
        if (group) {
          group.querySelectorAll('.bp-admin-filter-pill').forEach(function (p) { p.classList.remove('is-active'); });
          pill.classList.add('is-active');
        }
      });
    });

    // Interactive Checkboxes inside Mockup Menu
    document.querySelectorAll('.bp-menu-opt').forEach(function (opt) {
      var input = opt.querySelector('input[type="checkbox"]');
      if (input) {
        input.addEventListener('change', function () {
          opt.classList.toggle('is-checked', input.checked);
        });
      }
    });

    // Initial state: Minimal Compact (4px, compact scale)
    setRadius(4);
    setDensity('compact');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonsPreview);
  } else {
    initButtonsPreview();
  }
})();
