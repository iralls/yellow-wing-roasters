# Agent Rules

- **Git Commits & Pushes**: Do not run `git commit` or `git push` unless explicitly asked by the user in the prompt.
- **Config-Driven Over Hardcoded (Fail Rather Than Guess)**: Never hardcode prices, bag sizes, or grind options (e.g. no `'12oz'`, `'Whole Bean'`, default `$12`, or fabricated size arrays). Always utilize configs and YAML frontmatter as the single source of truth.
- **Simple & Direct Lookups (No Defensive Guessing, No Phantom Variables)**: Do not write defensive fallback ternaries (e.g. `sizeSelect ? sizeSelect.value : '12oz'`) or intermediate phantom variables like `priceVal`. Read DOM values and catalog dictionary entries directly (`orig.prices[sizeSelect.value]`).
- **Natural Runtime Exceptions (No Manual Guard Boilerplate)**: Do not write redundant `if (!element)` guard boilerplate before DOM reads. Direct lookups naturally throw `TypeError` if something is missing, which browser DevTools automatically logs with file, line, and stack trace. Reserve explicit `console.error` strictly for non-throwing logical failures (such as `ywrAddToCart` returning `false`).
