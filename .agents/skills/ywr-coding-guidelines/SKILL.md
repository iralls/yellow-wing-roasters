---
name: ywr-coding-guidelines
description: >-
  Coding standards and architectural rules for Yellow Wing Roasters. Use whenever writing,
  refactoring, or reviewing JavaScript, Liquid templates, or cart logic to avoid hardcoded values,
  defensive guessing, and silent early returns.
---

# Yellow Wing Roasters Coding Guidelines

> **Guiding Principle**: *"I'd rather a failure than a default value that doesn't make sense."*

Follow these three mandatory architectural principles when writing or modifying code in this repository:

---

## 1. Config-Driven Over Hardcoded Values (Fail Rather Than Guess)

Never hardcode product prices, bag sizes, grind options, or categories in JavaScript or templates.

* **Single Source of Truth**:
  * Coffee metadata and options live in Jekyll frontmatter (`_roasts/`, `_custom/`, `_subscriptions/`, `_flights/`) and site config (`_config.yml`).
  * In HTML/Liquid, bind values using `{{ page.price[size] }}`, `data-size="{{ s }}"`, or `site.data`.
  * In JavaScript, read prices and sizes directly from `config.origins`, `window.YWR_ROASTS_DATA`, or element `data-*` attributes.
* **Why Fallbacks Are Harmful**:
  * If a template misnames an element or a coffee is a special 8oz micro-lot, a fallback like `'12oz'` or `$12` silently hides the bug, mischarges the customer, and corrupts orders with non-existent products.
  * A fast, loud failure immediately alerts developers to the missing configuration during testing and is trivially easy to fix.
* **Anti-Patterns**:
  * ❌ `var size = sizeSelect ? sizeSelect.value : '12oz';`
  * ❌ `var price = prices[size] || 12;`
  * ❌ `if (sizes.length === 0) sizes = ['12oz', '1lb', '2lb', '5lb'];`
* **Correct Pattern**:
  * ✅ Derive sizes and prices strictly from the configured data object. If the config is missing, let it fail immediately rather than fabricating arbitrary defaults.

---

## 2. Simple & Direct Lookups (No Defensive Guessing, No Phantom Variables)

Keep code simple, predictable, and direct. Do not write defensive ternaries, fallback chains, or intermediate defensive variables that guess or fabricate missing data.

* **Direct Lookups**:
  * Read DOM selections directly: `var size = sizeSelect.value;`.
  * Read dictionary prices directly: `var price = orig.prices[size];` or `price: orig.prices[sizeSelect.value]`.
* **No Phantom / Intermediate Variables (`priceVal`)**:
  * Do not introduce intermediate defensive variables like `priceVal` with default numbers.
  * Perform clean lookups directly where the value is used.
* **Anti-Patterns**:
  * ❌ `var grind = grindSelect ? grindSelect.value : 'Whole Bean';`
  * ❌ `var priceVal = (orig.prices && typeof orig.prices[size] === 'number') ? orig.prices[size] : 12;`
  * ❌ `var size = sizeSelect ? sizeSelect.value : '12oz';`
* **Correct Pattern**:
  * ✅
    ```javascript
    var size = sizeSelect.value;
    var item = {
      ...
      size: size,
      grind: grindSelect.value,
      roastLevel: roastSelect.value,
      price: orig.prices[size]
    };
    ```

---

## 3. Natural Runtime Exceptions (No Manual `console.log` Guard Overhead)

Do not clutter code with redundant `if (!element) console.log(...)` guard boilerplate before reading expected DOM elements or config properties.

* **Let JavaScript Fail Naturally**:
  * Direct lookups like `sizeSelect.value` or `orig.prices[sizeSelect.value]` will naturally throw an uncaught `TypeError: Cannot read properties of null (reading 'value')` if `sizeSelect` is missing from the DOM.
  * Modern browser DevTools already automatically captures and logs uncaught exceptions with the exact source file path, line number, column number, and full interactive stack trace. Manual guards before property lookups add zero diagnostic value and add unnecessary noise.
* **When `console.error` IS Appropriate**:
  * Use `console.error` strictly for **non-throwing logical failures** where JavaScript would otherwise fail silently without throwing an exception.
  * Example: when an API or cart function returns `false` (e.g. `localStorage` quota exceeded in `ywrAddToCart`), or when a network request fails.
* **Anti-Patterns**:
  * ❌ `if (!sizeSelect) { console.error('sizeSelect missing'); return; }` (redundant boilerplate before a read)
  * ❌ `var size = sizeSelect ? sizeSelect.value : '12oz';` (swallows the error and fabricates bad data)
  * ❌ `if (!orig) return;` (swallows the failure silently)
* **Correct Pattern**:
  * ✅ Direct access: `var size = sizeSelect.value;`
  * ✅ Diagnostic on non-throwing failure:
    ```javascript
    var added = window.ywrAddToCart(item, 1);
    if (!added) {
      console.error('Failed to add item to cart:', item);
    }
    ```
