---
layout: default
title: Subscribe
permalink: /subscribe/
---

<div class="roast-minimal-vertical">
  <div class="roast-mv-center" style="margin: 4rem 0;">
    <p>Redirecting to checkout&hellip;</p>
  </div>
</div>

<script>
  (function () {
    var dest = '{{ "/order/" | relative_url }}' + (window.location.search || '');
    window.location.replace(dest);
  })();
</script>
<noscript>
  <meta http-equiv="refresh" content="0; url={{ '/order/' | relative_url }}">
</noscript>
