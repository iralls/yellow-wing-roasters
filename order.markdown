---
layout: default
title: Redirecting to Cart...
permalink: /order/
custom_css: order-redirect.css
---

<meta http-equiv="refresh" content="0; url={{ '/cart/' | relative_url }}">
<script>
  window.location.replace("{{ '/cart/' | relative_url }}" + (window.location.search || ''));
</script>

<div class="hst-wrap order-redirect-box">
  <p>
    Redirecting to your <a href="{{ '/cart/' | relative_url }}">cart</a>...
  </p>
</div>
