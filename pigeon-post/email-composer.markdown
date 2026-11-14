---
layout: default
title: "Pigeon Post Email Composer"
permalink: /pigeon-post/email-composer/
sitemap: false
---

<link rel="stylesheet" href="{{ '/css/menu-theme.css' | relative_url }}?v={{ site.time | date: '%s' }}">
<link rel="stylesheet" href="{{ '/css/admin-theme.css' | relative_url }}?v={{ site.time | date: '%s' }}">

<div class="hst-wrap pp-composer-wrap">
  <a href="{{ '/admin/' | relative_url }}" class="hst-back-link">&larr; Back to Admin Portal</a>

  <div style="text-align: center; margin-bottom: 2rem;">
    <div class="hst-cat">Pigeon Post Dispatch</div>
    <h1 class="hst-title" style="margin-bottom: 0.5rem;">Email Composer</h1>
    <p style="color: var(--hst-muted); font-size: 0.95rem; margin: 0 auto; max-width: 28rem;">Generate beautiful, responsive email newsletters for new roasts, custom drops, and subscriber welcomes.</p>
  </div>

  <!-- Minimal Unboxed Composer Controls -->
  <div style="max-width: 36rem; margin: 0 auto 2.5rem; text-align: center;">
    <div style="margin-bottom: 1.5rem;">
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

    <div id="pp-roast-field-wrap" style="margin-bottom: 1.25rem; text-align: left;">
      <label for="pp-roast-select" class="hst-label">Roast</label>
      <select id="pp-roast-select" class="hst-select" data-label="Roast">
        {% assign published_roasts = site.roasts | where_exp: "r", "r.published != false" | sort: "order" %}
        {% for r in published_roasts %}
          <option value="{{ r.slug }}"{% if r.status == 'just_hatched' %} selected{% endif %}>{{ r.title }} ({{ r.category | capitalize }})</option>
        {% endfor %}
      </select>
    </div>

    <div id="pp-custom-field-wrap" style="margin-bottom: 1.25rem; text-align: left; display: none;">
      <label for="pp-custom-select" class="hst-label">Custom Offering</label>
      <select id="pp-custom-select" class="hst-select" data-label="Custom Offering">
        {% assign sorted_custom = site.custom | sort: "order" %}
        {% for c in sorted_custom %}
          <option value="{{ c.slug }}">{{ c.title }}</option>
        {% endfor %}
      </select>
    </div>

    <div style="margin-bottom: 1.25rem; text-align: left;">
      <label for="pp-subject-input" class="hst-label">Subject Line</label>
      <input id="pp-subject-input" type="text" class="hst-input" />
    </div>

    <div style="margin-bottom: 1.5rem; text-align: left;">
      <label for="pp-intro-input" class="hst-label">Optional Personal Note</label>
      <textarea id="pp-intro-input" rows="2" placeholder="Optional note above the main copy..." class="hst-textarea"></textarea>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; align-items: center;">
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

    <p id="pp-copy-status" role="status" aria-live="polite" style="margin: 0.75rem 0 0; min-height: 1.25rem; font-size: 0.82rem; font-weight: 600; color: #166534;"></p>
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
    },
    customRoasts: {
      {% assign sorted_custom = site.custom | sort: "order" %}
      {% for c in sorted_custom %}
        {{ c.slug | jsonify }}: {
          slug: {{ c.slug | jsonify }},
          title: {{ c.title | jsonify }},
          subtitle: {{ c.subtitle | jsonify }},
          category: {{ c.category | jsonify }},
          descriptor: {{ c.descriptor | jsonify }},
          overlayNotes: {{ c.overlay_notes | capitalize | jsonify }},
          intro: {{ c.intro | strip | jsonify }},
          mascotUrl: {{ site.url | append: '/images/' | append: c.mascot_file | jsonify }},
          customUrl: {{ site.url | append: c.url | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    }
  });
</script>
