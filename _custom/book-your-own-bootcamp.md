---
layout: menu-item
title: "BYOB — Book Your Own Bootcamp"
card_title: "BYOB"
subtitle: "Book your own bootcamp"
intro: "Want to step behind the roaster yourself? Pick any 12oz single-origin coffee, bring up to three people total, and join us for a personalized, hands-on roasting session."
slug: book-your-own-bootcamp
category: custom
price: "$30 + $15/guest"
base_price: 30
guest_fee: 15
max_guests: 3
session_fees:
  1: 0
  2: 15
  3: 30
data_roast: byob-bootcamp
order: 4
permalink: /roasts/book-your-own-bootcamp/
mascot_file: teacher-transparent.png
mascot_alt: "Book Your Own Bootcamp mascot"
descriptor: Book Your Own Bootcamp
overlay_notes: "pick any 12oz single origin and book a personalized roasting session"
---

{% assign single_origins = site.roasts | where: "category", "single origin" | sort: "order" %}
{% assign active_so = single_origins | where_exp: "item", "item.status != 'flown_south'" | where_exp: "item", "item.status != 'incubating'" %}
{% assign first_so = active_so.first %}
{% assign initial_total = page.base_price | plus: page.session_fees[1] %}

<form class="hst-form" id="byob-bootcamp-form" onsubmit="return false;">
  <div>
    <label class="hst-label" for="byob-origin-select">Select 12oz Single Origin</label>
    <select id="byob-origin-select" class="hst-select">
      {% for r in active_so %}
        <option value="{{ r.slug }}"{% if forloop.first %} selected{% endif %}>{{ r.title }}</option>
      {% endfor %}
    </select>
  </div>

  <div>
    <label class="hst-label" for="byob-guests-select">Number of Guests (Max {{ page.max_guests }})</label>
    <select id="byob-guests-select" class="hst-select">
      {% for entry in page.session_fees %}
        {% assign g_num = entry[0] %}
        {% assign g_fee = entry[1] %}
        <option value="{{ g_num }}"{% if forloop.first %} selected{% endif %}>
          {{ g_num }} {% if g_num == 1 %}Guest (included){% else %}Guests (+${{ g_fee }}){% endif %}
        </option>
      {% endfor %}
    </select>
    <span style="display: block; font-size: 0.76rem; color: var(--hst-muted); margin-top: 0.35rem;">
      Accommodates up to {{ page.max_guests }} guests maximum ($30 for 1 guest, +$15 each additional guest).
    </span>
  </div>

  <div>
    <label class="hst-label" for="byob-bootcamp-notes">Session / availability notes (optional)</label>
    <textarea id="byob-bootcamp-notes" class="hst-textarea" rows="2" placeholder="Preferred days/times, roast profile goals, or anything else we should know..."></textarea>
  </div>

  <button type="submit" class="hst-btn" id="byob-bootcamp-add-btn">
    Add to Cart
  </button>
</form>

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">How It Works</button>
    <div class="hst-drawer-body">
      <ol style="margin: 0; padding-left: 1.2rem; line-height: 1.7;">
        <li style="margin-bottom: 0.4rem;">Choose any active 12oz single-origin lot and select your group size (up to {{ page.max_guests }} guests).</li>
        <li style="margin-bottom: 0.4rem;">Place your order through the cart &mdash; we'll reach out via email or phone after checkout to schedule a date and time that works for you.</li>
        <li>Step up to the roaster to guide your batch through drying, Maillard browning, and first crack, then take home your freshly roasted 12oz bag.</li>
      </ol>
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Bootcamp Specifications</button>
    <div class="hst-drawer-body">
      <strong>Service Type:</strong> Personalized Hands-On Roasting Session<br>
      <strong>Take-Home Coffee:</strong> One 12oz single-origin bag roasted live<br>
      <strong>Group Capacity:</strong> 1 &ndash; {{ page.max_guests }} guests maximum<br>
      <strong>Pricing:</strong> ${{ page.base_price }} (1 guest) &middot; ${{ page.base_price | plus: page.session_fees[2] }} (2 guests) &middot; ${{ page.base_price | plus: page.session_fees[3] }} (3 guests)<br>
      <strong>Scheduling:</strong> Coordinated directly via email or phone after order placement
    </div>
  </div>
</div>

<script>
  (function() {
    const sessionFees = {{ page.session_fees | jsonify }};
    const basePrice = {{ page.base_price }};
    const originsData = {
      {% for r in active_so %}
        {{ r.slug | jsonify }}: {
          title: {{ r.title | jsonify }},
          mascot: {{ r.mascot_file | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };

    const originSelect = document.getElementById("byob-origin-select");
    const guestsSelect = document.getElementById("byob-guests-select");
    const notesTextarea = document.getElementById("byob-bootcamp-notes");
    const addBtn = document.getElementById("byob-bootcamp-add-btn");
    const priceDisplay = document.getElementById("product-price-display");

    function updatePrice() {
      const gNum = parseInt(guestsSelect.value, 10);
      const fee = sessionFees[gNum] || 0;
      const total = basePrice + fee;
      priceDisplay.innerHTML = `$${total}.00`;
    }

    guestsSelect.addEventListener("change", updatePrice);
    updatePrice();

    const form = document.getElementById("byob-bootcamp-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const gNum = parseInt(guestsSelect.value, 10);
        const fee = sessionFees[gNum] || 0;
        const total = basePrice + fee;
        const orig = originsData[originSelect.value];

        const item = {
          type: "custom",
          slug: "book-your-own-bootcamp",
          title: "Book Your Own Bootcamp",
          subtitle: `${orig.title} (${gNum} ${gNum === 1 ? "Guest" : "Guests"})`,
          size: "12oz + Live Session",
          price: total,
          mascot: {{ page.mascot_file | jsonify }},
          notes: notesTextarea.value.trim()
        };

        const added = window.ywrAddToCart(item, 1);
        if (added) {
          const origText = addBtn.textContent;
          addBtn.textContent = "Added to Cart!";
          addBtn.disabled = true;
          setTimeout(() => {
            addBtn.textContent = origText;
            addBtn.disabled = false;
          }, 1400);
        } else {
          console.error("Failed to add Book Your Own Bootcamp to cart:", item);
        }
      });
    }
  })();
</script>
