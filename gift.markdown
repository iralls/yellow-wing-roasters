---
layout: menu-item
title: Digital Gift Card
subtitle: Prepaid Instant Voucher
descriptor: prepaid instant digital code delivered via email
slug: digital-gift-card
category: gift
price: "$15 – $90"
mascot_file: qr-code2-full-transparent.png
mascot_alt: "Digital Gift Card"
permalink: /gift/
intro: "Send a fresh coffee experience directly to their inbox. Digital gift cards come with a unique redemption code, credited toward any roast, flight, or subscription."
---

<form class="hst-form" id="digital-gift-form" onsubmit="return false;">
  <div>
    <label class="hst-label" for="gift-amount-select">Gift Card Amount</label>
    <select id="gift-amount-select" class="hst-select">
      <option value="15">$15.00</option>
      <option value="25">$25.00</option>
      <option value="45" selected>$45.00 (Recommended)</option>
      <option value="60">$60.00</option>
      <option value="90">$90.00</option>
    </select>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
    <div>
      <label class="hst-label" for="gift-recipient-name">Recipient Name</label>
      <input type="text" id="gift-recipient-name" class="hst-input" required placeholder="Recipient's Name">
    </div>
    <div>
      <label class="hst-label" for="gift-recipient-email">Recipient Email</label>
      <input type="email" id="gift-recipient-email" class="hst-input" required placeholder="recipient@example.com">
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
    <div>
      <label class="hst-label" for="gift-sender-name">Your Name</label>
      <input type="text" id="gift-sender-name" class="hst-input" required placeholder="Your Name">
    </div>
    <div>
      <label class="hst-label" for="gift-sender-email">Your Email</label>
      <input type="email" id="gift-sender-email" class="hst-input" required placeholder="you@example.com">
    </div>
  </div>

  <div>
    <label class="hst-label" for="gift-message">Gift Message (Optional)</label>
    <textarea id="gift-message" class="hst-textarea" rows="3" placeholder="Add a personal note to be included in their gift email..."></textarea>
  </div>

  <button type="submit" class="hst-btn" id="gift-atc-btn">
    Add to Cart
  </button>
</form>

<div class="hst-drawers" style="margin-top: 1.5rem;">
  <div class="hst-drawer open">
    <button type="button" class="hst-drawer-head">How Redemption Works</button>
    <div class="hst-drawer-body">
      <strong>Payment from Purchaser:</strong> After you place the gift order, we will reach out directly to coordinate payment.<br>
      <strong>Digital Code Delivery:</strong> A unique digital gift code is emailed to your recipient with your note.<br>
      <strong>Credit Toward Purchase:</strong> When the recipient redeems their code at checkout, we will apply the gift credit directly toward their coffee order.
    </div>
  </div>

  <div class="hst-drawer">
    <button type="button" class="hst-drawer-head">Terms &amp; Flexibility</button>
    <div class="hst-drawer-body">
      <strong>No Expiration:</strong> Digital gift cards never expire and carry zero maintenance fees.<br>
      <strong>Storewide Usability:</strong> Valid toward all single-origin coffees, signature blends, tasting flights, and custom roasting subscriptions.
    </div>
  </div>
</div>

<script>
  (function() {
    const form = document.getElementById("digital-gift-form");
    const amountSelect = document.getElementById("gift-amount-select");
    const priceDisplay = document.getElementById("product-price-display");
    const atcBtn = document.getElementById("gift-atc-btn");
    const recipientName = document.getElementById("gift-recipient-name");
    const recipientEmail = document.getElementById("gift-recipient-email");
    const senderName = document.getElementById("gift-sender-name");
    const senderEmail = document.getElementById("gift-sender-email");
    const messageInput = document.getElementById("gift-message");

    function updateAmount() {
      const val = amountSelect.value;
      if (priceDisplay) {
        priceDisplay.innerHTML = `$${val}.00`;
      }
    }

    amountSelect.addEventListener("change", updateAmount);
    updateAmount();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = parseFloat(amountSelect.value);
      const rName = recipientName.value.trim();
      const rEmail = recipientEmail.value.trim();
      const sName = senderName.value.trim();
      const sEmail = senderEmail.value.trim();
      const msg = messageInput.value.trim();

      const item = {
        type: "gift",
        slug: "digital-gift-card",
        title: `Digital Gift Card ($${amount})`,
        subtitle: `To: ${rName} (${rEmail}) · From: ${sName}`,
        size: `$${amount}`,
        price: amount,
        mascot: {{ page.mascot_file | jsonify }},
        recipientName: rName,
        recipientEmail: rEmail,
        senderName: sName,
        senderEmail: sEmail,
        notes: msg
      };

      const added = window.ywrAddToCart(item, 1);
      if (added) {
        const origText = atcBtn.innerHTML;
        atcBtn.textContent = "Added to Cart!";
        atcBtn.disabled = true;
        setTimeout(() => {
          atcBtn.innerHTML = origText;
          atcBtn.disabled = false;
        }, 1400);
      } else {
        console.error("Failed to add Digital Gift Card to cart:", item);
      }
    });
  })();
</script>
