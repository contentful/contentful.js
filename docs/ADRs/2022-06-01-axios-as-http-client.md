# Axios as HTTP Client

## Status

Accepted

## Context

The SDK needs an HTTP client that works in both Node.js and browser environments with a consistent API. Options considered:

- **axios** — mature, unified Node/browser abstraction, interceptor/adapter support
- **node-fetch + browser fetch** — native but requires polyfills and separate error handling per environment
- **got / ky** — modern but Node-only (got) or browser-only (ky)

The Contentful JS SDK family (`contentful.js`, `contentful-management.js`, `contentful-sdk-core`) all need the same HTTP behavior: rate limiting, retry, error normalization, and request/response interceptors.

## Decision

Use axios as the shared HTTP client across the entire JS SDK family, centralized through `contentful-sdk-core`.

Key reasons:
- Unified abstraction over Node `http` and browser `XMLHttpRequest`/`fetch` with consistent error shapes
- Built-in interceptor support used for Content Source Maps, request logging, and framework integrations
- Shared across `contentful-sdk-core`, `contentful.js`, and `contentful-management.js` — one HTTP behavior to maintain
- Mature ecosystem; security patches are applied centrally via `contentful-sdk-core` dependency bumps

The DX team has explicitly noted that migrating away from axios would be a major cross-SDK re-architecture effort, not currently planned.

## Consequences

- Axios security vulnerabilities affect all three SDKs (mitigated by centralized patching via sdk-core bumps)
- Bundle size includes axios (~14KB gzipped) even though modern browsers have native fetch
- Any future migration to fetch would require coordinated changes across all three SDKs plus sdk-core
- Interceptor-based features (CSM, logging) are tightly coupled to the axios API
