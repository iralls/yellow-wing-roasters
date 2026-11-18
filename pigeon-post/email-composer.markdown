---
layout: default
title: "Pigeon Post Email Composer"
permalink: /pigeon-post/email-composer/
sitemap: false
custom_css: email-composer.css
---

<link rel="stylesheet" href="{{ '/css/admin-theme.css' | relative_url }}?v={{ site.time | date: '%s' }}">

<div class="hst-wrap pp-composer-wrap">
  <a href="{{ '/admin/' | relative_url }}" class="hst-back-link">&larr; Back to Admin Portal</a>

  <div class="pp-header">
    <div class="hst-cat">Pigeon Post Dispatch</div>
    <h1 class="hst-title">Email Composer</h1>
    <p class="pp-subtitle">Generate beautiful, responsive email newsletters for new roasts, custom drops, and subscriber welcomes.</p>
  </div>

  <!-- Minimal Unboxed Composer Controls -->
  <div class="pp-controls">
    <div class="pp-mode-wrap">
      <div class="pp-mode-group" role="radiogroup" aria-label="Email Template Type">
        <button type="button" role="radio" aria-checked="true" class="pp-mode-btn is-active" data-mode="new_roast">
          New Roast
        </button>
        <button type="button" role="radio" aria-checked="false" class="pp-mode-btn" data-mode="custom_roast">
          Custom Roast
        </button>
        <button type="button" role="radio" aria-checked="false" class="pp-mode-btn" data-mode="welcome">
          Welcome
        </button>
      </div>
    </div>

    <div id="pp-roast-field-wrap" class="pp-field">
      <label for="pp-roast-select" class="hst-label">Roast</label>
      <select id="pp-roast-select" class="hst-select" data-label="Roast">
        {% assign published_roasts = site.roasts | where_exp: "r", "r.published != false" | sort: "order" %}
        {% for r in published_roasts %}
          <option value="{{ r.slug }}"{% if r.status == 'just_hatched' %} selected{% endif %}>{{ r.title }} ({{ r.category | capitalize }})</option>
        {% endfor %}
      </select>
    </div>

    <div id="pp-custom-field-wrap" class="pp-field" style="display: none;">
      <label for="pp-custom-select" class="hst-label">Custom Offering</label>
      <select id="pp-custom-select" class="hst-select" data-label="Custom Offering">
        {% assign sorted_custom = site.custom | sort: "order" %}
        {% for c in sorted_custom %}
          <option value="{{ c.slug }}">{{ c.title }}</option>
        {% endfor %}
      </select>
    </div>

    <div class="pp-field">
      <label for="pp-subject-input" class="hst-label">Subject Line</label>
      <input id="pp-subject-input" type="text" class="hst-input" />
    </div>

    <div class="pp-field pp-field--spaced">
      <label for="pp-intro-input" class="hst-label">Optional Personal Note</label>
      <textarea id="pp-intro-input" rows="2" placeholder="Optional note above the main copy..." class="hst-textarea"></textarea>
    </div>

    <div class="pp-actions">
      <button type="button" id="pp-copy-gmail-btn" class="action-pill-btn btn-primary-pill">
        Copy Email for Gmail
      </button>
      <button type="button" id="pp-copy-subject-btn" class="action-pill-btn btn-outline-pill">
        Copy Subject
      </button>
      <button type="button" id="pp-copy-html-btn" class="action-pill-btn btn-outline-pill">
        Copy Raw HTML
      </button>
    </div>

    <p id="pp-copy-status" role="status" aria-live="polite" class="pp-copy-status"></p>
  </div>

  <!-- Live Email Preview (Unboxed, Direct Canvas) -->
  <div id="pp-email-preview-container" class="pp-preview"></div>

  <!-- Collapsible Raw HTML Source -->
  <details class="pp-raw-details">
    <summary class="pp-raw-summary">
      Raw HTML Source
    </summary>
    <textarea id="pp-raw-html-output" readonly rows="12" class="pp-raw-textarea"></textarea>
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
    },
    customRoasts: {
      {% assign sorted_custom = site.custom | sort: "order" %}
      {% for c in sorted_custom %}
        {{ c.slug | jsonify }}: {
          slug: {{ c.slug | jsonify }},
          title: {{ c.title | jsonify }},
          subtitle: {{ c.subtitle | jsonify }},
          category: {{ c.category | jsonify }},
          overlayNotes: {{ c.overlay_notes | capitalize | jsonify }},
          intro: {{ c.intro | strip | jsonify }},
          mascotUrl: {{ site.url | append: '/images/' | append: c.mascot_file | jsonify }},
          customUrl: {{ site.url | append: c.url | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    }
  });
</script>
