# TypeScript Compilation + Rollup Bundling

## Status

Accepted

## Context

The SDK is written in TypeScript and needs to produce multiple output formats (ESM modules, CJS bundle, browser bundles, type declarations). Options for the build pipeline:

- **tsc only** — simple but no bundling, no minification, no browser-specific transforms
- **Rollup only** — handles bundling but TypeScript type generation is awkward
- **tsc + Rollup** — tsc for type-safe compilation and declarations, Rollup for bundling and optimization
- **esbuild / swc** — fast but less mature plugin ecosystems at the time of decision

## Decision

Use `tsc` for TypeScript compilation and type declaration generation, and `Rollup` for bundling, minification, and format-specific output.

Pipeline:
- `tsc` → `dist/esm-raw/` (ES2017 target, declaration files to `dist/types/`)
- Rollup reads `dist/esm-raw/` and produces:
  - `dist/esm/` — tree-shakeable ESM with preserveModules
  - `dist/contentful.cjs` — single CJS bundle
  - `dist/contentful.browser.js` — browser bundle (ES2018 via Babel)
  - `dist/contentful.browser.min.js` — minified browser bundle

## Consequences

- Clear separation of concerns: tsc handles typing/compilation, Rollup handles bundling/optimization
- Rollup plugin pipeline (Babel, terser, replace, node-resolve, commonjs) gives fine-grained control over each output format
- `__VERSION__` replacement happens at Rollup time (from package.json)
- `tslib` is used as importHelpers to avoid duplicating TypeScript runtime helpers across modules
- Build is slower than esbuild but produces more optimized and configurable output
- The `dist/esm-raw/` intermediate step is a build artifact that exists only as Rollup input
