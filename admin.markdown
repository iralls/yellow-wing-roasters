---
layout: default
title: "Roaster Admin Portal"
permalink: /admin/
sitemap: false
---

<script>
  (function () {
    try {
      if (localStorage.getItem('ywr_admin_passcode')) {
        document.documentElement.classList.add('ywr-admin-authenticated');
      }
    } catch (e) {}
  })();
</script>
<style>
  .ywr-admin-authenticated #admin-portal-gate-section { display: none !important; }
  .ywr-admin-authenticated #admin-portal-dashboard-section { display: block !important; }
</style>

<div class="roast-minimal-vertical">
<div class="order-admin-container" style="max-width: 42rem;">

  <div class="order-admin-header-compact roast-admin-header-compact">
    <img src="{{ '/images/bean-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Admin" class="order-admin-bird-icon" fetchpriority="high" decoding="async">
    <h1 class="order-admin-page-title">Roaster Admin Portal</h1>
  </div>

  <!-- Passcode Gate View -->
  <div id="admin-portal-gate-section" class="order-admin-gate">
    <div class="order-admin-gate-icon">
      <span class="status-badge status-received">Passcode Required</span>
    </div>
    <h2 class="order-admin-gate-title">Owner Authentication</h2>
    <p class="order-admin-gate-desc">Sign in once with your roaster passcode to unlock all management consoles.</p>

    <form id="admin-portal-gate-form" class="order-admin-gate-form">
      <div>
        <input type="password" id="admin-portal-passcode-input" class="order-admin-input" placeholder="Enter owner passcode..." required autocomplete="current-password" autofocus>
      </div>
      <button type="submit" id="admin-portal-gate-btn" class="order-admin-save-btn">Unlock Admin Portal</button>
      <div id="admin-portal-gate-error" class="order-admin-gate-error" style="display: none;"></div>
    </form>
  </div>

  <!-- Authenticated Admin Links View -->
  <div id="admin-portal-dashboard-section" style="display: none;">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 0.75rem;">
      <button type="button" id="admin-portal-logout-btn" class="order-admin-btn-sm order-admin-btn-sm--logout">Log Out</button>
    </div>

    <div class="order-admin-queue" style="gap: 0.75rem;">
      <a href="{{ '/order/admin/' | relative_url }}" class="order-admin-card-item" style="text-decoration: none; display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.15rem;">
        <span class="roast-admin-id-chip" style="font-size: 0.95rem; padding: 0.3rem 0.75rem;">/order/admin/</span>
        <span style="color: #8a7060; font-size: 1.1rem; font-weight: bold;">&rarr;</span>
      </a>

      <a href="{{ '/roasts/admin/' | relative_url }}" class="order-admin-card-item" style="text-decoration: none; display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.15rem;">
        <span class="roast-admin-id-chip" style="font-size: 0.95rem; padding: 0.3rem 0.75rem;">/roasts/admin/</span>
        <span style="color: #8a7060; font-size: 1.1rem; font-weight: bold;">&rarr;</span>
      </a>

      <a href="{{ '/pigeon-post/email-composer/' | relative_url }}" class="order-admin-card-item" style="text-decoration: none; display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.15rem;">
        <span class="roast-admin-id-chip" style="font-size: 0.95rem; padding: 0.3rem 0.75rem;">/pigeon-post/email-composer/</span>
        <span style="color: #8a7060; font-size: 1.1rem; font-weight: bold;">&rarr;</span>
      </a>
    </div>
  </div>

</div>
</div>

<script src="{{ '/js/admin-roasts.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initAdminPortal();
</script>
