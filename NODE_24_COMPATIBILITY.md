# Node.js 24 Compatibility Guide

This document details the current compatibility status, required changes, and recommended practices to ensure the **Yellow Wing Roasters** codebase and developer tooling run seamlessly on **Node.js 24 (Active LTS)**.

---

## 1. Architectural Context: How Node.js is Used

Yellow Wing Roasters is a static site powered by **Jekyll (Ruby)**. Node.js is **not** a production server runtime for this repository. Instead, Node.js serves four key developer roles:

1. **Local Syntax & AST Validation**: Running `node -c js/*.js` to verify JavaScript validity across all frontend modules.
2. **Headless Unit Testing**: Running automated tests in [`scratch/test_*.js`](file:///Users/ianr/Documents/yellow-wing-roasters/scratch/) using CommonJS `require()` and Node's native `assert` module to verify cart calculations, pricing, sanitization, and form selectors without a browser.
3. **CDP & Utility Scripting**: Running automation scripts like [`scratch/compare_inputs.mjs`](file:///Users/ianr/Documents/yellow-wing-roasters/scratch/compare_inputs.mjs) using native `fetch`, `WebSocket`, and Chrome DevTools Protocol.
4. **Developer Tooling & Agent Execution**: Running AI coding assistants (`agy`, Antigravity CLI), formatters, and local helper utilities.

---

## 2. Current Compatibility Assessment

| Area | Status | Node 24 Impact & Notes |
| :--- | :---: | :--- |
| **Frontend Scripts (`js/*.js`)** | **100% Compatible** | Written in vanilla ES5/ES6 with Universal Module Definition (UMD). Zero deprecated V8/Node APIs (no `arguments.callee`, no `with`, no legacy crypto). |
| **CommonJS / UMD Exports** | **100% Compatible** | Node 24 supports synchronous `require(esm)` by default and maintains full CommonJS backward compatibility. |
| **Scratch Unit Tests (`scratch/test_*.js`)** | **Compatible with 1 nuance** | Direct assignment to `global.localStorage` in test mocks should be hardened for Node 24's native Web Storage API. |
| **ESM & Top-Level Await (`scratch/*.mjs`)** | **100% Compatible** | Fully supported out-of-the-box in Node 24. |
| **Native Web APIs (`fetch`, `URLSearchParams`)** | **100% Compatible** | Node 24 ships with updated WHATWG `fetch` and global `URLSearchParams`, matching modern browser behavior. |

---

## 3. Required & Recommended Changes

### A. Environment & Version Management (Recommended)
The repository currently defines `.ruby-version` (`3.x`), but does not have a node version file. Adding a version pin ensures version managers (`fnm`, `nvm`, `volta`) and CI runners default to Node 24 automatically.

**Action**: Add a `.node-version` file to the root of the repository:
```text
24
```
*(Optionally symlinked or duplicated as `.nvmrc`)*

---

### B. Harden Test Mocks for Node 24 Native Web Storage (Recommended)
Node.js 22.4+ and Node.js 24 introduce built-in **Web Storage** (`localStorage` and `sessionStorage`).

In existing unit test files (such as [`scratch/test_cart_sanitization.js`](file:///Users/ianr/Documents/yellow-wing-roasters/scratch/test_cart_sanitization.js)), `localStorage` is mocked via direct assignment:
```javascript
// Existing mock:
global.localStorage = {
  getItem: (k) => ...,
  setItem: (k, v) => ...,
  ...
};
```
If Node 24 runs with native web storage enabled (`--experimental-webstorage` or future default), `global.localStorage` may have an existing non-configurable getter.

**Update**: Use `Object.defineProperty` or delete any existing property before defining the mock:
```javascript
const storage = {};
const mockStorage = {
  getItem: (k) => (k in storage ? storage[k] : null),
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); }
};

try {
  delete global.localStorage;
} catch (e) {}

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  configurable: true,
  writable: true
});
```

---

### C. Handle Jekyll Frontmatter in JS (`js/cart-data.js`)
[`js/cart-data.js`](file:///Users/ianr/Documents/yellow-wing-roasters/js/cart-data.js) contains Jekyll YAML frontmatter:
```yaml
---
permalink: /js/cart-data.js
---
```
When running AST linters or formatters under Node 24 (e.g. `npx prettier`), this file causes a `SyntaxError: Unexpected token`.

**Action**: If introducing any Node-based formatting or linting tools in the future:
1. Add `.prettierignore` or linter ignore rules for `js/cart-data.js`.
2. Or use a custom pre-parser that strips `--- ... ---` before AST traversal.

---

### D. Optional: Package Configuration (`package.json`)
If you decide to add a `package.json` for managing developer scripts and test runners:
```json
{
  "name": "yellow-wing-roasters",
  "private": true,
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "test": "node --test scratch/test_*.js",
    "check": "node -c js/*.js"
  }
}
```
*Note*: Do **not** set `"type": "module"` in `package.json` unless you intend to rename all existing `.js` test files to `.cjs`, because our unit tests rely on CommonJS `require()`.

---

### E. Optional: Modernize Test Suite to `node --test`
Node 24 includes a fast, stable, zero-dependency test runner (`node:test`). Existing scratch tests using ad-hoc `assert` and manual `console.log` can be natively executed with:
```bash
node --test scratch/test_*.js
```
This provides structured TAP/spec output, exit codes, and failure reports without installing third-party packages like Jest or Mocha.

---

## 4. Verification Checklist for Node 24

When running on Node 24, run the following verification commands from the project root:

```bash
# 1. Verify Node 24 runtime
node -v  # Expected: v24.x.x

# 2. Verify JavaScript syntax integrity across all client modules
node -c js/*.js

# 3. Run all scratch verification test suites
node scratch/test_cart_sanitization.js
node scratch/test_fail_fast_lookups.js
node scratch/test_hand_delivery_forms.js
node scratch/test_byob_burner.js
node scratch/test_pigeon_post.js

# 4. Verify Jekyll build (Ruby engine operates independently of Node)
bundle exec jekyll build
```
