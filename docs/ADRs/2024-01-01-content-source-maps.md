# Content Source Maps in the SDK

## Status

Accepted

## Context

Contentful needed to support visual editing integrations (Live Preview SDK, Vercel Content Link) that allow users to click rendered content and navigate directly to the corresponding field in the Contentful editor. This requires metadata that maps rendered strings back to their source entry/field.

Options:
- **Client-side only** — inject metadata at render time using entry IDs from the response
- **API-side source maps** — the CPA returns Content Source Maps metadata alongside content, SDK decorates values
- **Separate metadata endpoint** — fetch source map data from a different API

## Decision

Implement Content Source Maps as an SDK-level feature that:

1. Adds `includeContentSourceMaps=true` to all CPA requests when configured
2. Receives CSM metadata embedded in the API response
3. Uses `@contentful/content-source-maps` to decode and decorate string field values with hidden metadata
4. Downstream consumers (Live Preview SDK, Vercel) read the encoded metadata from string values

Activated via `createClient({ includeContentSourceMaps: true })` — only works with the Content Preview API.

## Consequences

- Visual editing works without requiring changes to customer rendering code
- Only available on CPA (preview), not CDA (production) — CSM metadata would bloat production responses
- Adds `@contentful/content-source-maps` as a runtime dependency
- String field values are modified (hidden characters appended) — could affect string length comparisons or strict equality checks in customer code
- Treated as "Tier 2" behavior in the SDK architecture: logic above the raw HTTP layer but inside the SDK wrapper, portable to future generated clients
- Timeline Preview builds on the same CPA infrastructure
