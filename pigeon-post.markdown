---
layout: default
title: Pigeon Post
permalink: /pigeon-post/
---

<div class="roast-minimal-vertical">

<div class="roast-mv-divider"></div>

<div class="roast-mv-center roast-mv-bird-wrap">
  <img src="{{ '/images/audubon-pigeon-post-transparent.png' | relative_url }}" alt="" class="roast-mv-bird" aria-hidden="true">
</div>

<div class="roast-mv-center">
  <h1 class="roast-mv-title">Pigeon Post</h1>
</div>

<p class="roast-mv-tasting">Stay in the Loop</p>

<div class="roast-mv-divider"></div>

<div class="roast-mv-body">
  <p style="text-align: center; margin-bottom: 2rem;">Sign up to hear about new roasts, seasonal blends, and restocks.</p>

  <form action="https://docs.google.com/forms/d/e/1FAIpQLSc2fpSWVJxRnC3hBamoq-7JqXVVypLoVaDHoKiQldEymJW7vw/formResponse" method="POST" class="mailing-list-form" id="pigeon-post-form" style="margin: 0 auto; max-width: 480px;">
    <input type="email" name="entry.1049864914" placeholder="your@email.com" required class="mailing-list-input">
    <button type="submit" class="mailing-list-btn" id="pigeon-post-submit">Sign Me Up</button>
  </form>

  <p class="order-status" id="pigeon-post-status" role="status" aria-live="polite" style="margin-top: 1.5rem; min-height: 1.5rem; text-align: center;"></p>
</div>

</div>

<script>
(function () {
  var form = document.getElementById('pigeon-post-form');
  var status = document.getElementById('pigeon-post-status');
  var submitBtn = document.getElementById('pigeon-post-submit');

  var iframe = document.createElement('iframe');
  iframe.name = 'pigeon-post-submit-frame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  form.target = 'pigeon-post-submit-frame';

  form.addEventListener('submit', function () {
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'order-status order-status-pending';
    }
    if (submitBtn) submitBtn.disabled = true;

    iframe.onload = function () {
      window.location.href = '{{ "/thanks/" | relative_url }}';
    };
  });
})();
</script>
