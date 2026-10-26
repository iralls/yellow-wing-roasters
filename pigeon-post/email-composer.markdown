---
layout: default
title: "Pigeon Post Email Composer"
permalink: /pigeon-post/email-composer/
published: false
sitemap: false
---

<div class="roast-minimal-vertical">
  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Pigeon Post Composer</h1>
  </div>

  <p class="roast-mv-tasting">Preview &amp; copy subscriber dispatches for Google Workspace</p>

  <!-- Minimal Unboxed Composer Controls -->
  <div style="max-width: 34rem; margin: 1.5rem auto 2.5rem; padding: 0 1rem; text-align: center;">
    <div style="margin-bottom: 1.25rem;">
      <div class="roast-purchase-toggle" role="radiogroup" aria-label="Email Template Type" style="display: inline-flex; gap: 0.5rem; width: 100%; max-width: 24rem;">
        <button type="button" role="radio" aria-checked="true" class="roast-purchase-toggle-btn pp-mode-btn is-active" data-mode="new_roast" style="flex: 1; padding: 0.55rem 0.85rem; font-size: 0.75rem; font-weight: 500;">
          New Roast Dispatch
        </button>
        <button type="button" role="radio" aria-checked="false" class="roast-purchase-toggle-btn pp-mode-btn" data-mode="welcome" style="flex: 1; padding: 0.55rem 0.85rem; font-size: 0.75rem; font-weight: 500;">
          Welcome to the Flock
        </button>
      </div>
    </div>

    <div id="pp-roast-field-wrap" style="margin-bottom: 1rem;">
      <label for="pp-roast-select" class="roast-mv-meta-label roast-mv-meta-label--center">Roast</label>
      <select id="pp-roast-select" class="subscribe-select" data-label="Roast" style="width: 100%;">
        {% assign published_roasts = site.roasts | where_exp: "r", "r.published != false" | sort: "order" %}
        {% for r in published_roasts %}
          <option value="{{ r.slug }}"{% if r.status == 'just_hatched' %} selected{% endif %}>{{ r.title }} ({{ r.category | capitalize }})</option>
        {% endfor %}
      </select>
    </div>

    <div style="margin-bottom: 1rem;">
      <label for="pp-subject-input" class="roast-mv-meta-label roast-mv-meta-label--center">Subject Line</label>
      <input id="pp-subject-input" type="text" class="mailing-list-input" style="width: 100%; box-sizing: border-box; text-align: center;" />
    </div>

    <div style="margin-bottom: 1.25rem;">
      <label for="pp-intro-input" class="roast-mv-meta-label roast-mv-meta-label--center">Optional Personal Note</label>
      <textarea id="pp-intro-input" rows="2" placeholder="Optional note above the main copy..." class="mailing-list-input" style="width: 100%; box-sizing: border-box; font-family: inherit; resize: vertical; text-align: center; border-radius: 16px; padding: 0.65rem 1rem;"></textarea>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; align-items: center;">
      <button type="button" id="pp-copy-gmail-btn" class="sleek-buy-add-btn" style="width: auto; margin-top: 0; padding: 0.65rem 1.4rem;">
        Copy Email for Gmail
      </button>
      <button type="button" id="pp-copy-subject-btn" class="sleek-buy-add-btn" style="width: auto; margin-top: 0; padding: 0.65rem 1.15rem; background: transparent; color: #2c1e14; border: 1px solid rgba(44, 30, 20, 0.25);">
        Copy Subject
      </button>
      <button type="button" id="pp-copy-html-btn" class="sleek-buy-add-btn" style="width: auto; margin-top: 0; padding: 0.65rem 1.15rem; background: transparent; color: #2c1e14; border: 1px solid rgba(44, 30, 20, 0.25);">
        Copy Raw HTML
      </button>
    </div>

    <p id="pp-copy-status" role="status" aria-live="polite" style="margin: 0.75rem 0 0; min-height: 1.25rem; font-family: Montserrat, sans-serif; font-size: 0.75rem; font-weight: 600; color: #2e7d32;"></p>
  </div>

  <!-- Live Email Preview (Unboxed, Direct Canvas) -->
  <div id="pp-email-preview-container" style="max-width: 640px; margin: 0 auto 3rem;"></div>

  <!-- Collapsible Raw HTML Source -->
  <details style="max-width: 38rem; margin: 0 auto 4rem; padding: 0 1rem; text-align: center;">
    <summary style="font-family: Montserrat, sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; cursor: pointer;">
      Raw HTML Source
    </summary>
    <textarea id="pp-raw-html-output" readonly rows="12" style="width: 100%; box-sizing: border-box; margin-top: 0.85rem; padding: 0.75rem; font-family: monospace; font-size: 0.76rem; color: #2c1e14; background: #ffffff; border: 1px solid rgba(44, 30, 20, 0.15); border-radius: 6px; text-align: left;"></textarea>
  </details>
</div>

<script src="{{ '/js/pigeon-post-email.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initPigeonPostEmailComposer({
    siteUrl: {{ site.url | jsonify }},
    siteTitle: {{ site.title | jsonify }},
    roasterEmail: {{ site.email | jsonify }},
    statuses: {{ site.data.statuses | jsonify }},
    badgeColors: {{ site.data.badge_colors | jsonify }},
    roasts: {
      {% assign published_roasts = site.roasts | where_exp: "r", "r.published != false" | sort: "order" %}
      {% for r in published_roasts %}
        {% assign level_info = site.data.roast_levels[r.roast_level] %}
        {% assign mascot_name = site.data.mascots[r.mascot] %}
        {{ r.slug | jsonify }}: {
          slug: {{ r.slug | jsonify }},
          title: {{ r.title | jsonify }},
          subtitle: {{ r.subtitle | jsonify }},
          category: {{ r.category | jsonify }},
          status: {{ r.status | jsonify }},
          roastLevel: {{ r.roast_level | jsonify }},
          roastLevelName: {{ level_info.name | jsonify }},
          roastDots: {{ level_info.dots | jsonify }},
          descriptor: {{ r.descriptor | jsonify }},
          tastingNotes: {{ r.tasting_notes | jsonify }},
          region: {{ r.region | jsonify }},
          elevation: {{ r.elevation | jsonify }},
          processingMethod: {{ r.processing_method | jsonify }},
          origins: {{ r.origins | jsonify }},
          brewingMethod: {{ r.brewing_method | jsonify }},
          certification: {{ r.certification | jsonify }},
          mascotName: {{ mascot_name | jsonify }},
          mascotUrl: {{ site.url | append: '/images/' | append: r.mascot_file | jsonify }},
          roastUrl: {{ site.url | append: r.url | jsonify }},
          description: {{ r.description | strip | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    }
  });
</script>
