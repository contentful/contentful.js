# size-limit for Bundle Size Monitoring

## Status

Accepted

## Context

The SDK ships browser bundles that are loaded by end-user applications. Bundle size directly impacts page load performance. The previous tool (`bundlesize`) was unmaintained and had reliability issues.

Options:
- **bundlesize** — existing tool, unmaintained, flaky CI integration
- **size-limit** — actively maintained, flexible configuration, supports multiple file checks

## Decision

Replace bundlesize with size-limit (commit 64d739ed). Configure CI to enforce size limits on browser bundles:

- `dist/contentful.browser.js` — limit 85 KB
- `dist/contentful.browser.min.js` — limit 45 KB

Checked in CI via `npm run test:size` (the `test-bundle-size` job in check.yaml).

## Consequences

- Bundle size regressions are caught before merge
- Developers get immediate feedback if a dependency addition or code change bloats the browser bundle
- Limits are configured in `package.json` under the `"size-limit"` key — easy to adjust
- Any new dependency must be evaluated for its bundle size impact
