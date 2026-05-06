# Agent Guide

Read this file first. It tells you where to find context in this repo.

## Quick Reference

| What you need | Where to look |
|---|---|
| How this repo is structured | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| How to build/test/run | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Why decisions were made | [docs/ADRs/](./docs/ADRs/) |
| What this repo does | [README.md](./README.md) |
| PR review rules | [.bito/guidelines/](./.bito/guidelines/) |
| Active specs/work | [docs/specs/](./docs/specs/) |
| Version migration guides | [MIGRATION.md](./MIGRATION.md) |
| Advanced usage patterns | [ADVANCED.md](./ADVANCED.md) |
| TypeScript usage | [TYPESCRIPT.md](./TYPESCRIPT.md) |

## Sharp Edges & Invariants

- **Always run `npm run test:types` after modifying types** — type regressions are not caught by Vitest unit tests. The `tsd` type tests in `test/types/` are the only gate.
- **Always run `npm run check` after changing build targets** — es-check validates that output matches declared ES version targets (ES2017 for CJS/ESM, ES2018 for browser bundles).
- **Never modify the axios instance directly** — HTTP configuration flows through `contentful-sdk-core`'s `createHttpClient`. Custom headers go in `CreateClientParams.headers`.
- **Bundle size is CI-enforced** — `size-limit` checks run in CI. If you add a dependency, verify it doesn't blow the 85KB (browser) / 45KB (min) limits via `npm run test:size`.
- **`dist/esm-raw/` is an intermediate build artifact** — it's Rollup input, not a shipped output. Never import from it or reference it in package.json exports.
- **Link resolution happens in `contentful-resolve-response`** — not in this repo. If link resolution is broken, look there.
- **Content Source Maps only work with CPA** — `includeContentSourceMaps: true` requires `host: 'preview.contentful.com'`. It will not work with the CDA.
- **`__VERSION__` is replaced at Rollup build time** — it's defined in `rollup.config.js` via `@rollup/plugin-replace`. Don't reference it expecting a value at dev/test time without building first.

## Key Conventions

- **Commit format:** Conventional Commits (enforced by commitizen + husky pre-commit hook)
- **Branch strategy:** `master` (production, semantic-release on push) + feature branches, squash merge
- **Test location:** `test/unit/`, `test/integration/`, `test/types/`
- **Module system:** Dual ESM + CJS (source is ESM, Rollup produces CJS bundle)
- **Import paths:** Use `.js` extensions in TypeScript source imports (ESM convention)
- **Source lives in:** `lib/` (not `src/`)
- **Types live in:** `lib/types/` (shipped as `dist/types/`)

## Integration Points

**Upstream (this repo consumes):**
- `contentful-sdk-core` — HTTP client factory, rate limiting, retry, error normalization
- `contentful-resolve-response` — link resolution algorithm
- `@contentful/content-source-maps` — CSM encoding/decoding
- `@contentful/rich-text-types` — Rich Text type definitions
- Contentful CDA/CPA HTTP APIs

**Downstream (consumes this repo):**
- Customer JavaScript/TypeScript applications
- Framework integrations (Next.js, Gatsby, Nuxt)
- Contentful Live Preview SDK
- Vercel Content Link

## Build & Quality

```bash
# Quick verification loop
npm ci && npm run build && npm test && npm run check
```
