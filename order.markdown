---
layout: default
title: Order
permalink: /order/
---

<p class="logo-wrap"><img src="/images/cup-logo-transparent.png" alt="Yellow Wing Roasters" class="logo"></p>

# Order

Pick your roasts and sizes. We'll email you back to confirm pricing, payment, and pickup or shipping.

<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="order-form">
  <input type="hidden" name="_subject" value="New Yellow Wing order">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="order-gotcha">

  <div class="order-field">
    <label for="order-name">Name</label>
    <input id="order-name" type="text" name="name" required autocomplete="name">
  </div>

  <div class="order-field">
    <label for="order-email">Email</label>
    <input id="order-email" type="email" name="email" required autocomplete="email">
  </div>

  <fieldset class="order-roasts">
    <legend>Roasts</legend>
    {% assign roasts = site.roasts | sort: "order" %}
    {% for r in roasts %}
      <div class="order-roast-row">
        <div class="order-roast-name">{{ r.title }}</div>
        <div class="order-sizes">
          {% assign sizes = "6oz,8oz,12oz,16oz" | split: "," %}
          {% for s in sizes %}
            <label class="order-size">
              <span class="order-size-label">{{ s }}</span>
              <input type="number" name="{{ r.title }} {{ s }}" min="0" value="0" inputmode="numeric">
            </label>
          {% endfor %}
        </div>
      </div>
    {% endfor %}
  </fieldset>

  <div class="order-field">
    <label for="order-notes">Notes (optional)</label>
    <textarea id="order-notes" name="notes" rows="3"></textarea>
  </div>

  <button type="submit" class="order-submit">Place order</button>
</form>
