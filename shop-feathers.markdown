---
layout: default
title: Shop (Feathers)
permalink: /shop-feathers/
---

<style>
  /* ── Shop Container (Hester / Parlor Coffee aesthetic) ── */
  .shop-container {
    max-width: 82rem;
    margin: 0 auto;
    padding: 1rem 1.5rem 6rem;
  }

  .shop-header {
    text-align: center;
    margin-bottom: 5.5rem;
  }

  .shop-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 600;
    color: #302010;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0;
  }

  /* ── 3-Column Grid ── */
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5.5rem 3.5rem;
  }

  @media (max-width: 900px) {
    .shop-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 4rem 2.25rem;
    }
    .shop-header {
      margin-bottom: 3.5rem;
    }
  }

  @media (max-width: 580px) {
    .shop-grid {
      grid-template-columns: 1fr;
      gap: 3.5rem 1.5rem;
    }
    .shop-header {
      margin-bottom: 2.75rem;
    }
  }

  /* ── Product Item Card ── */
  .shop-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .shop-item:hover {
    text-decoration: none;
    color: inherit;
  }

  /* ── Feather Visual Area ── */
  .shop-item-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
    width: 100%;
    margin-bottom: 1.5rem;
    border-radius: 16px;
  }

  /* ── CSS Mask-Image Feather (Height: 250px, Width: 72px) ── */
  .feather-mask {
    display: inline-block;
    width: 72px;
    height: 250px;
    -webkit-mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  /* Hover: grey out image */
  .shop-item:hover .feather-mask {
    filter: grayscale(100%);
    opacity: 0.12;
  }

  /* ── Sliced Feather (Build Your Own Blend - Height: 250px) ── */
  .feather-split-wrap {
    position: relative;
    width: 72px;
    height: 250px;
    display: inline-block;
  }

  .feather-slice {
    position: absolute;
    inset: 0;
    width: 72px;
    height: 250px;
    -webkit-mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .feather-slice-top {
    background-color: #D4572A; /* Robin Terracotta */
    clip-path: polygon(0% 0%, 100% 0%, 100% 30%, 0% 34%);
    transform: translate(-3px, -5px);
  }

  .feather-slice-mid {
    background-color: #F0C838; /* Canary Gold */
    clip-path: polygon(0% 37%, 100% 33%, 100% 64%, 0% 68%);
    transform: translate(3px, 0);
  }

  .feather-slice-bot {
    background-color: #2C6E9E; /* Bluebird Cobalt */
    clip-path: polygon(0% 71%, 100% 67%, 100% 100%, 0% 100%);
    transform: translate(-2px, 5px);
  }

  /* Hover: grey out split feather slices */
  .shop-item:hover .feather-slice {
    filter: grayscale(100%);
    opacity: 0.12;
  }

  /* ── Burner Flame Feather (Bank Your Own Burner) ── */
  .feather-flame {
    background-color: #ff6d00;
    background-image:
      /* White-hot ignition flare in the heart */
      radial-gradient(ellipse 40% 45% at 50% 66%, rgba(255, 255, 245, 0.98) 0%, rgba(255, 235, 59, 0.85) 35%, transparent 70%),
      /* Blue gas flame root at the burner base */
      radial-gradient(ellipse 60% 25% at 50% 97%, #00e5ff 0%, #0051ff 45%, transparent 75%),
      /* Combustion plume: smoky crimson tip -> blazing orange -> radiant gold -> gas blue */
      linear-gradient(180deg,
        #7f0000 0%,
        #b71c1c 12%,
        #e64a19 28%,
        #f57c00 46%,
        #ffb300 62%,
        #ffea00 78%,
        #ff6d00 89%,
        #0091ea 96%,
        #00e5ff 100%
      );
    filter: drop-shadow(0 0 14px rgba(255, 140, 0, 0.45)) drop-shadow(0 -4px 20px rgba(255, 215, 0, 0.3));
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .shop-item:hover .feather-flame {
    filter: grayscale(100%);
    opacity: 0.12;
  }

  /* ── Hover Overlay Placed on Top of Visual ── */
  .shop-item-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    gap: 0.65rem;
    opacity: 0;
    transition: opacity 0.28s ease;
    pointer-events: none;
    z-index: 2;
  }

  .shop-item:hover .shop-item-overlay {
    opacity: 1;
  }

  /* Roast level dots inside overlay */
  .overlay-level {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  .roast-dots {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .roast-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(48, 32, 16, 0.22);
    transition: background 0.15s ease;
  }

  .roast-dot.roast-dot-1,
  .roast-dot.roast-dot-2,
  .roast-dot.roast-dot-3,
  .roast-dot.roast-dot-4,
  .roast-dot.roast-dot-5 {
    background: #302010;
  }

  .overlay-level-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8a7060;
  }

  .overlay-tag {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9c6d12;
  }

  /* Short descriptor inside overlay */
  .overlay-descriptor {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.15rem;
    font-weight: 600;
    color: #302010;
    line-height: 1.3;
    margin: 0;
    letter-spacing: -0.01em;
    text-transform: capitalize;
  }

  /* Tasting notes inside overlay */
  .overlay-notes {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 400;
    font-style: italic;
    color: #554133;
    line-height: 1.45;
    margin: 0;
    max-width: 18rem;
  }

  /* ── Main Layout Info (Below Image) ── */
  .shop-item-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.45rem;
    width: 100%;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  /* Hover: grey out info text along with the image */
  .shop-item:hover .shop-item-info {
    filter: grayscale(100%);
    opacity: 0.12;
  }

  .shop-item-name {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.55rem;
    font-weight: 600;
    color: #302010;
    line-height: 1.25;
    margin: 0;
    letter-spacing: -0.015em;
  }

  .shop-item-price {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: #302010;
    letter-spacing: 0.01em;
  }

  .price-orig {
    color: #a89484;
    font-size: 1.1rem;
    margin-right: 0.35rem;
    font-weight: 400;
  }

  .price-sale {
    color: #b45309;
    font-weight: 700;
  }

  /* ── Custom Section Header ── */
  .shop-section-header {
    text-align: center;
    margin-top: 8rem;
    margin-bottom: 5rem;
  }

  @media (max-width: 900px) {
    .shop-section-header {
      margin-top: 6rem;
      margin-bottom: 3.5rem;
    }
  }

  @media (max-width: 580px) {
    .shop-section-header {
      margin-top: 4.5rem;
      margin-bottom: 2.75rem;
    }
  }

  .shop-section-title {
    font-family: 'Figtree', var(--font-sans, sans-serif);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 600;
    color: #302010;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0;
  }

  /* ── 2-Column Grid for Flights ── */
  .shop-grid-flights {
    grid-template-columns: repeat(2, 1fr);
    max-width: 58rem;
    margin: 0 auto;
    gap: 5.5rem 4rem;
  }

  @media (max-width: 650px) {
    .shop-grid-flights {
      grid-template-columns: 1fr;
      gap: 3.5rem 1.5rem;
    }
  }

  /* ── Single-Item Centered Layout for Gifts ── */
  .shop-grid-gifts {
    display: flex;
    justify-content: center;
    max-width: 28rem;
    margin: 0 auto;
  }

  /* ── Fanned Feather Clusters (Flights - Height: 250px) ── */
  .feather-fan-wrap {
    position: relative;
    width: 145px;
    height: 250px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .feather-fan-item {
    position: absolute;
    width: 60px;
    height: 220px;
    -webkit-mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    mask-image: url('{{ "/images/audubon-feather-transparent.png" | relative_url }}');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transform-origin: 50% 90%;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.3s ease;
    will-change: transform, filter, opacity;
  }

  /* The Aviary: 4 signature blend feathers fanning out */
  .aviary-fan-1 {
    background: #D4572A; /* Robin */
    transform: rotate(-18deg) translate(-17px, 5px);
    z-index: 1;
  }
  .aviary-fan-2 {
    background: #F0C838; /* Canary */
    transform: rotate(-6deg) translate(-5px, 0);
    z-index: 2;
  }
  .aviary-fan-3 {
    background: #8A7060; /* Swift */
    transform: rotate(6deg) translate(5px, 0);
    z-index: 2;
  }
  .aviary-fan-4 {
    background: #1E6446; /* Hummingbird */
    transform: rotate(18deg) translate(17px, 5px);
    z-index: 1;
  }

  /* Peck Your Own: 3 fanned feathers */
  .pyo-fan-1 {
    background: #B0824E; /* Killdeer tan */
    transform: rotate(-16deg) translate(-12px, 4px);
    z-index: 1;
  }
  .pyo-fan-2 {
    background: #F0C838; /* Gold */
    transform: rotate(0deg);
    z-index: 2;
  }
  .pyo-fan-3 {
    background: #2C6E9E; /* Bluebird */
    transform: rotate(16deg) translate(12px, 4px);
    z-index: 1;
  }

  /* Hover state: grey out fanned feathers */
  .shop-item:hover .feather-fan-item {
    filter: grayscale(100%);
    opacity: 0.12;
  }

  /* ── Gifts Visuals (Height: 250px) ── */
  .feather-card-frame {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 175px;
    height: 250px;
    border: 1.5px dashed rgba(240, 200, 56, 0.6);
    border-radius: 16px;
    background: rgba(254, 250, 238, 0.45);
    transition: border-color 0.3s ease, background 0.3s ease, filter 0.3s ease, opacity 0.3s ease;
  }

  .feather-card-frame .feather-mask {
    width: 60px;
    height: 210px;
  }

  .feather-gold-card {
    background: linear-gradient(145deg, #fff3b0 0%, #f0c838 30%, #c99414 65%, #ffd54f 85%, #b8860b 100%);
    filter: drop-shadow(0 2px 10px rgba(240, 200, 56, 0.45));
  }

  .shop-item:hover .feather-card-frame {
    border-color: rgba(140, 130, 120, 0.2);
    background: transparent;
    opacity: 0.15;
  }

  /* ── Pantry & Mascot Objects (1.5x) ── */
  .pantry-item-img,
  .coffee-mascot-img {
    max-height: 285px;
    max-width: 255px;
    width: auto;
    height: auto;
    object-fit: contain;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .shop-item:hover .pantry-item-img,
  .shop-item:hover .coffee-mascot-img {
    filter: grayscale(100%);
    opacity: 0.12;
  }
</style>

<div class="shop-container">
  <!-- ── 1. Coffee Section ── -->
  <div class="shop-header">
    <h1 class="shop-title">Coffee</h1>
  </div>

  {% assign all_roasts = site.roasts | sort: "order" %}
  <div class="shop-grid">
    {% for r in all_roasts %}
      {% assign level_info = site.data.roast_levels[r.roast_level] %}

      {% comment %}
        Determine feather color:
        - Blends: gradient of colors encompassed within the bird
        - Single Origins: solid color incorporating the bird color
        Can also be overridden by r.feather_color in frontmatter
      {% endcomment %}
      {% if r.feather_color %}
        {% assign feather_style = r.feather_color %}
      {% else %}
        {% case r.slug %}
          {% when "early-bird" %}
            {% assign feather_style = "linear-gradient(180deg, #D4572A 0%, #3D3028 100%)" %}
          {% when "feather-soot" %}
            {% assign feather_style = "linear-gradient(180deg, #F0C838 0%, #201E18 100%)" %}
          {% when "chimney-sweep" %}
            {% assign feather_style = "linear-gradient(180deg, #8A7060 0%, #362822 100%)" %}
          {% when "lil-sipper" %}
            {% assign feather_style = "linear-gradient(180deg, #BA1C38 0%, #1E6446 100%)" %}
          {% when "gobble-wobble" %}
            {% assign feather_style = "linear-gradient(180deg, #B85C2A 0%, #384832 100%)" %}
          {% when "colombia-supremo" %}
            {% assign feather_style = "#2C6E9E" %}
          {% when "guatemala-antigua" %}
            {% assign feather_style = "#5A6848" %}
          {% when "sumatra-mandheling" %}
            {% assign feather_style = "#5A636C" %}
          {% when "peru-fair-trade-organic" %}
            {% assign feather_style = "#B0824E" %}
          {% when "ethiopia-yirgacheffe" %}
            {% assign feather_style = "#24444C" %}
          {% else %}
            {% if r.category == "blend" or r.category == "seasonal" %}
              {% assign feather_style = "linear-gradient(180deg, #F0C838 0%, #9C6D12 100%)" %}
            {% else %}
              {% assign feather_style = "#9C6D12" %}
            {% endif %}
        {% endcase %}
      {% endif %}

      <a href="{{ r.url | relative_url }}" class="shop-item">
        <div class="shop-item-visual">
          <span class="feather-mask" style="background: {{ feather_style }};" aria-label="{{ r.title }} feather mark"></span>

          <div class="shop-item-overlay">
            {% if r.roast_level %}
              <div class="overlay-level" title="Roast Level: {{ r.roast_level }}/5">
                {% include roast-dots.html roast=r %}
                {% if level_info %}
                  <span class="overlay-level-name">{{ level_info.layman }}</span>
                {% endif %}
              </div>
            {% endif %}

            {% if r.descriptor %}
              <div class="overlay-descriptor">{{ r.descriptor }}</div>
            {% endif %}

            {% if r.tasting_notes %}
              <p class="overlay-notes">{{ r.tasting_notes }}</p>
            {% endif %}
          </div>
        </div>

        <div class="shop-item-info">
          <h2 class="shop-item-name">{{ r.card_title | default: r.title }}</h2>

          <div class="shop-item-price">
            {% if r.temporary_price and r.temporary_price["12oz"] %}
              <s class="price-orig">${{ r.price["12oz"] }}</s>
              <span class="price-sale">${{ r.temporary_price["12oz"] }}</span>
            {% else %}
              <span>${{ r.price["12oz"] }}</span>
            {% endif %}
          </div>
        </div>
      </a>
    {% endfor %}
  </div>

  <!-- ── 2. Custom Roasts Section ── -->
  <div class="shop-section-header">
    <h2 class="shop-section-title">BYOB &bull; Custom Roasts</h2>
  </div>

  <div class="shop-grid">
    <!-- BYOB: Build Your Own Blend (Feather Split into Parts) -->
    <a href="{{ '/roasts/build-your-own-blend/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <div class="feather-split-wrap" aria-label="Build Your Own Blend split feather mark">
          <span class="feather-slice feather-slice-top"></span>
          <span class="feather-slice feather-slice-mid"></span>
          <span class="feather-slice feather-slice-bot"></span>
        </div>

        <div class="shop-item-overlay">
          <div class="overlay-tag">BYOB &bull; Custom Blend</div>
          <p class="overlay-notes">Combine up to three varieties of green beans and select individual roast levels</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">BYOB &mdash; Build Your Own Blend</h2>
        <div class="shop-item-price">$32</div>
      </div>
    </a>

    <!-- BYOB: Bring Your Own Beans -->
    <a href="{{ '/roasts/bring-your-own-beans/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <span class="feather-mask" style="background: #4E7D59;" aria-label="Bring Your Own Beans feather mark"></span>

        <div class="shop-item-overlay">
          <div class="overlay-tag">BYOB &bull; Custom Sourced</div>
          <p class="overlay-notes">Send us your green unroasted beans and we'll craft your custom roast profile</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">BYOB &mdash; Bring Your Own Beans</h2>
        <div class="shop-item-price">Custom Quote</div>
      </div>
    </a>

    <!-- BYOB: Bank Your Own Burner -->
    <a href="{{ '/roasts/bank-your-own-burner/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <span class="feather-mask feather-flame" aria-label="Bank Your Own Burner flame feather mark"></span>

        <div class="shop-item-overlay">
          <div class="overlay-tag">BYOB &bull; Custom Profile</div>
          <p class="overlay-notes">Pick any single origin bean and customize your desired roast level from City to Vienna</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">BYOB &mdash; Bank Your Own Burner</h2>
        <div class="shop-item-price">Cost of Selected Bean</div>
      </div>
    </a>

    <!-- BYOB: Book Your Own Bootcamp -->
    <a href="{{ '/roasts/book-your-own-bootcamp/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <span class="feather-mask" style="background: #2563EB;" aria-label="Book Your Own Bootcamp feather mark"></span>

        <div class="shop-item-overlay">
          <div class="overlay-tag">BYOB &bull; Bootcamp</div>
          <p class="overlay-notes">Step behind the roaster yourself. Pick any single origin, bring up to three guests, and roast live with us</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">BYOB &mdash; Book Your Own Bootcamp</h2>
        <div class="shop-item-price">$30 + $15/guest</div>
      </div>
    </a>
  </div>

  <!-- ── 3. Flights Section ── -->
  <div class="shop-section-header">
    <h2 class="shop-section-title">Flights</h2>
  </div>

  <div class="shop-grid shop-grid-flights">
    <!-- The Aviary -->
    <a href="{{ '/flights/the-aviary/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <div class="feather-fan-wrap" aria-label="The Aviary four-feather flight mark">
          <span class="feather-fan-item aviary-fan-1"></span>
          <span class="feather-fan-item aviary-fan-2"></span>
          <span class="feather-fan-item aviary-fan-3"></span>
          <span class="feather-fan-item aviary-fan-4"></span>
        </div>

        <div class="shop-item-overlay">
          <div class="overlay-tag">Sampler Flight</div>
          <p class="overlay-notes">Four 8oz bags of our signature blends: Early Bird, Feather Soot, Chimney Sweep, and Lil' Sipper</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">The Aviary</h2>
        <div class="shop-item-price">$38</div>
      </div>
    </a>

    <!-- Peck Your Own -->
    <a href="{{ '/flights/peck-your-own/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <div class="feather-fan-wrap" aria-label="Peck Your Own flight mark">
          <span class="feather-fan-item pyo-fan-1"></span>
          <span class="feather-fan-item pyo-fan-2"></span>
          <span class="feather-fan-item pyo-fan-3"></span>
        </div>

        <div class="shop-item-overlay">
          <div class="overlay-tag">Custom Flight</div>
          <p class="overlay-notes">Choose four or more of our available roasts to build your custom 8oz sample box</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">Peck Your Own</h2>
        <div class="shop-item-price">$10 / bag <span style="font-size: 0.85rem; font-weight: 400; color: #8a7060;">(min. 4)</span></div>
      </div>
    </a>
  </div>

  <!-- ── 4. Gifts Section ── -->
  <div class="shop-section-header">
    <h2 class="shop-section-title">Gifts</h2>
  </div>

  <div class="shop-grid-gifts">
    <!-- Digital Gift Card -->
    <a href="{{ '/gift/' | relative_url }}" class="shop-item">
      <div class="shop-item-visual">
        <div class="feather-card-frame" aria-label="Digital Gift Card feather voucher mark">
          <span class="feather-mask feather-gold-card"></span>
        </div>

        <div class="shop-item-overlay">
          <div class="overlay-tag">Instant Delivery</div>
          <p class="overlay-notes">Prepaid digital gift code sent via email for them to choose their own favorite beans, flights, and grind</p>
        </div>
      </div>

      <div class="shop-item-info">
        <h2 class="shop-item-name">Digital Gift Card</h2>
        <div class="shop-item-price">$15 &ndash; $90</div>
      </div>
    </a>
  </div>
</div>
