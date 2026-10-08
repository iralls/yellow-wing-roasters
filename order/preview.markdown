---
layout: default
title: "Order Status Preview"
permalink: /order/preview/
sitemap: false
---

<div class="roast-minimal-vertical">
<div class="order-preview-container">
  
  <div class="roast-mv-divider"></div>

  <div class="roast-mv-center roast-mv-bird-wrap">
    <img src="{{ '/images/delivery-box-transparent.png' | relative_url }}" alt="Yellow Wing Roasters Delivery Box" class="roast-mv-bird roast-mv-bird--lg" fetchpriority="high" decoding="async">
  </div>

  <div class="roast-mv-center">
    <h1 class="roast-mv-title">Order Status Preview</h1>
  </div>

  <p class="roast-mv-tasting">Interactive preview of the customer order management experience across each lifecycle stage. Switch between statuses or inspect all states stacked.</p>

  <div class="roast-mv-divider"></div>

  <div id="order-preview-root"></div>

</div>
</div>

<script src="{{ '/js/cart-data.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ '/js/manage-orders.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script>
  initOrderPreview({
    containerId: 'order-preview-root',
    roastsData: window.YWR_ROASTS_DATA,
    bagSizes: window.YWR_BAG_SIZES,
    defaultGrind: window.YWR_DEFAULT_GRIND
  });
</script>
