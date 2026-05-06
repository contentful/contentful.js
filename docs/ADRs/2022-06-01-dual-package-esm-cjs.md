# Dual Package: ESM + CJS

## Status

Accepted

## Context

The JavaScript ecosystem was transitioning from CommonJS to ESM. The SDK needed to support:

- Modern bundlers (webpack, Rollup, Vite) that benefit from ESM tree-shaking
- Legacy Node.js applications still using `require()`
- Browser environments via CDN script tags
- TypeScript projects expecting `.d.ts` type declarations

The package needed to work across all these contexts without requiring consumers to change their code.

## Decision

Ship as a dual package using Node.js conditional exports:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/contentful.cjs"
    }
  }
}
```

Build pipeline:
1. `tsc` compiles to `dist/esm-raw/` (intermediate)
2. Rollup produces `dist/esm/` (preserveModules, tree-shakeable)
3. Rollup produces `dist/contentful.cjs` (single CJS bundle)
4. Rollup produces `dist/contentful.browser.js` + `.min.js` (browser bundles)

This mirrors the approach taken in the CMA.js v12 modernization and `contentful-sdk-core` v9.

## Consequences

- Consumers can use `import` or `require()` without configuration
- Tree-shaking works for ESM consumers (preserveModules)
- Browser bundles are available via CDN (jsDelivr, unpkg)
- Build pipeline is more complex (tsc + Rollup with multiple output configs)
- `dist/esm-raw/` is an intermediate artifact that must not be shipped (excluded from npm package)
- es-check in CI validates that output matches declared target versions (ES2017 for CJS/ESM, ES2018 for browser)
