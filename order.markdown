---
layout: default
title: Redirecting to Cart...
permalink: /order/
---

<meta http-equiv="refresh" content="0; url={{ '/cart/' | relative_url }}">
<script>
  window.location.replace("{{ '/cart/' | relative_url }}" + (window.location.search || ''));
</script>

<div class="hst-wrap" style="text-align: center; padding: 4rem 1rem;">
  <p style="font-family: 'Figtree', var(--font-sans, sans-serif); color: var(--hst-muted); font-size: 1.1rem;">
    Redirecting to your <a href="{{ '/cart/' | relative_url }}" style="color: var(--hst-text); text-decoration: underline;">cart</a>...
  </p>
</div>
