/**
 * Yellow Wing Roasters - Custom Pill Dropdown Enhancer
 * Converts native <select> elements into accessible, custom pill dropdown triggers
 * matching the buttons-preview & catalog filters aesthetic.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initPillSelect = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function createPillDropdown(selectEl, customLabel) {
    if (!selectEl || selectEl.dataset.pillEnhanced === 'true') return;
    if (selectEl.classList.contains('u-sr-only') && !selectEl.hasAttribute('data-pill-dropdown')) {
      // Don't auto-enhance already hidden selects unless explicitly requested
      return;
    }
    selectEl.dataset.pillEnhanced = 'true';

    var label = customLabel || selectEl.getAttribute('data-label') || '';
    if (!label && selectEl.id) {
      var associatedLabel = document.querySelector('label[for="' + selectEl.id + '"]');
      if (associatedLabel) {
        label = associatedLabel.textContent.trim();
      }
    }
    // Clean label text
    if (label && label.slice(-1) !== ':') {
      label += ':';
    }

    // Visually hide original label when label is integrated into the pill
    if (selectEl.id && label) {
      var lblEl = document.querySelector('label[for="' + selectEl.id + '"]');
      if (lblEl && !lblEl.classList.contains('u-sr-only')) {
        lblEl.classList.add('u-sr-only');
      }
    }

    // Hide the select visually, but keep accessible in DOM for forms & scripts
    selectEl.classList.add('u-sr-only');
    selectEl.setAttribute('tabindex', '-1');
    selectEl.setAttribute('aria-hidden', 'true');

    // Create wrapper
    var wrap = document.createElement('div');
    wrap.className = 'pill-select-wrap';

    // Create trigger
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'pill-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    if (selectEl.disabled) trigger.disabled = true;

    if (label) {
      var lblSpan = document.createElement('span');
      lblSpan.className = 'ps-label';
      lblSpan.textContent = label;
      trigger.appendChild(lblSpan);
    }

    var valSpan = document.createElement('span');
    valSpan.className = 'ps-value';
    trigger.appendChild(valSpan);

    var chevronSpan = document.createElement('span');
    chevronSpan.className = 'ps-chevron';
    chevronSpan.setAttribute('aria-hidden', 'true');
    chevronSpan.innerHTML = '&darr;';
    trigger.appendChild(chevronSpan);

    wrap.appendChild(trigger);

    // Create menu
    var menu = document.createElement('div');
    menu.className = 'pill-select-menu';
    menu.setAttribute('role', 'listbox');
    menu.style.display = 'none';

    function buildOptions() {
      menu.innerHTML = '';
      var currentVal = selectEl.value;

      Array.prototype.forEach.call(selectEl.options, function (opt) {
        if (opt.disabled && !opt.value) return;

        var optDiv = document.createElement('div');
        optDiv.className = 'ps-option' + (opt.value === currentVal ? ' is-selected' : '');
        optDiv.setAttribute('role', 'option');
        optDiv.setAttribute('data-val', opt.value);
        optDiv.setAttribute('aria-selected', (opt.value === currentVal).toString());
        optDiv.setAttribute('tabindex', '0');

        var textSpan = document.createElement('span');
        textSpan.className = 'ps-option-text';
        textSpan.textContent = opt.textContent.trim();
        optDiv.appendChild(textSpan);

        optDiv.addEventListener('click', function (e) {
          e.stopPropagation();
          selectOption(opt.value, opt.textContent.trim());
        });

        optDiv.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectOption(opt.value, opt.textContent.trim());
          }
        });

        menu.appendChild(optDiv);
      });

      var selectedOpt = selectEl.options[selectEl.selectedIndex];
      valSpan.textContent = selectedOpt ? selectedOpt.textContent.trim() : selectEl.value;
    }

    function selectOption(val, text) {
      if (selectEl.value !== val) {
        selectEl.value = val;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      valSpan.textContent = text;
      closeMenu();
      trigger.focus();

      var allOpts = menu.querySelectorAll('.ps-option');
      allOpts.forEach(function (o) {
        var isSel = (o.getAttribute('data-val') === val);
        o.classList.toggle('is-selected', isSel);
        o.setAttribute('aria-selected', isSel.toString());
      });
    }

    function openMenu() {
      if (trigger.disabled) return;
      document.querySelectorAll('.pill-select-menu').forEach(function (m) {
        if (m !== menu) {
          m.style.display = 'none';
          var otherTrig = m.parentElement ? m.parentElement.querySelector('.pill-select-trigger') : null;
          if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
          if (m.parentElement) m.parentElement.classList.remove('is-open');
        }
      });

      buildOptions();
      menu.style.display = 'block';
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('is-open');

      var sel = menu.querySelector('.ps-option.is-selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function closeMenu() {
      menu.style.display = 'none';
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    }

    function toggleMenu() {
      if (menu.style.display === 'none' || !menu.style.display) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
        var first = menu.querySelector('.ps-option.is-selected') || menu.querySelector('.ps-option');
        if (first) first.focus();
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    });

    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = document.activeElement ? document.activeElement.nextElementSibling : null;
        if (next && next.classList.contains('ps-option')) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = document.activeElement ? document.activeElement.previousElementSibling : null;
        if (prev && prev.classList.contains('ps-option')) prev.focus();
      }
    });

    selectEl.addEventListener('change', function () {
      var opt = selectEl.options[selectEl.selectedIndex];
      if (opt) {
        valSpan.textContent = opt.textContent.trim();
        var allOpts = menu.querySelectorAll('.ps-option');
        allOpts.forEach(function (o) {
          var isSel = (o.getAttribute('data-val') === opt.value);
          o.classList.toggle('is-selected', isSel);
          o.setAttribute('aria-selected', isSel.toString());
        });
      }
    });

    selectEl.addEventListener('invalid', function () {
      trigger.focus();
    });

    var observer = new MutationObserver(function (mutations) {
      var needsRebuild = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].type === 'childList') {
          needsRebuild = true;
          break;
        }
      }
      if (needsRebuild) {
        buildOptions();
      }
      trigger.disabled = selectEl.disabled;
    });
    observer.observe(selectEl, { attributes: true, attributeFilter: ['disabled'], childList: true });

    wrap.appendChild(menu);
    selectEl.parentNode.insertBefore(wrap, selectEl.nextSibling);

    buildOptions();
  }

  // Global document click to close menus
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.pill-select-wrap')) {
      document.querySelectorAll('.pill-select-menu').forEach(function (m) {
        m.style.display = 'none';
        var t = m.parentElement ? m.parentElement.querySelector('.pill-select-trigger') : null;
        if (t) t.setAttribute('aria-expanded', 'false');
        if (m.parentElement) m.parentElement.classList.remove('is-open');
      });
    }
  });

  function initPillSelects(selector) {
    var sel = selector || 'select.subscribe-select:not(.u-sr-only), select[data-pill-dropdown]';
    var selects = document.querySelectorAll(sel);
    selects.forEach(function (s) {
      createPillDropdown(s);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initPillSelects();
    });
  } else {
    initPillSelects();
  }

  return {
    enhance: createPillDropdown,
    initAll: initPillSelects
  };
});
