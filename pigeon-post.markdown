---
layout: menu-item
title: Pigeon Post
descriptor: Newsletter & Dispatches
mascot_file: audubon-pigeon-post-transparent.png
mascot_alt: "Pigeon Post"
permalink: /pigeon-post/
no_order: true
intro: "Sign up to hear about fresh roast releases, seasonal blend arrivals, and roastery restocks delivered straight to your inbox."
---

<form action="{{ site.google_forms.pigeon_post.url }}" method="POST" class="hst-form" id="pigeon-post-form" style="padding-top: 0; border-top: none;">
  <div>
    <label for="pigeon-post-email" class="hst-label">Email Address</label>
    <input id="pigeon-post-email" type="email" name="{{ site.google_forms.pigeon_post.entries.email }}" placeholder="your@email.com" aria-label="Email address" autocomplete="email" required class="hst-input">
  </div>
  <button type="submit" class="hst-btn" id="pigeon-post-submit">Sign Me Up</button>
  <p class="order-status" id="pigeon-post-status" role="status" aria-live="polite"></p>
</form>

<div class="hst-drawers" style="margin-top: 2rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">Dispatches &amp; Frequency</button>
    <div class="hst-drawer-body">
      We roast in small batches on demand. Pigeon Post emails are sent only when new single origins land, seasonal coffees launch, or limited batches restock. No spam, ever.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Community &amp; Social</button>
    <div class="hst-drawer-body">
      Follow along on Instagram for behind-the-scenes roasting, cupping notes, and fresh drop announcements: <a href="https://www.instagram.com/yellowwingroasters/" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align: middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>@yellowwingroasters</a>
    </div>
  </div>
</div>

<script src="{{ '/js/form-submit.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initPigeonPostForm();
</script>
