---
trigger: always_on
---
# Coding Principles Rule

> *"I'd rather a failure than a default value that doesn't make sense."*

Follow these three mandatory principles when writing, refactoring, or reviewing code:

1. **Config-Driven Over Hardcoded (Fail Rather Than Guess)**: Avoid unreasonable defaults and never hardcode fallback prices, bag sizes, or grind options (e.g. a fallback price doesn't make sense because it will charge someone the incorrect amount; no default `$12`, `'12oz'`, `'Whole Bean'`, or fabricated size arrays). Always utilize configs and YAML frontmatter as the single source of truth.
2. **Simple & Direct Lookups (No Defensive Guessing, No Phantom Variables)**: Do not write defensive fallback ternaries (e.g. `sizeSelect ? sizeSelect.value : '12oz'`) or intermediate phantom variables like `priceVal`. Read DOM values and catalog dictionary entries directly (`orig.prices[sizeSelect.value]`).
3. **Natural Runtime Exceptions (No Manual Guard Boilerplate)**: Do not write redundant `if (!element)` guard boilerplate before DOM reads. Direct lookups naturally throw `TypeError` if something is missing, which browser DevTools automatically logs with file, line, and stack trace. Reserve explicit `console.error` strictly for non-throwing logical failures (such as `ywrAddToCart` returning `false`).
