# contentful-sdk-core as Shared Foundation

## Status

Accepted

## Context

The Contentful JavaScript ecosystem has multiple SDKs (CDA client, CMA client, and supporting tools) that all need common HTTP behaviors: client creation, rate limiting, retry logic, error normalization, user-agent header construction, and query string serialization.

Options:
- **Inline in each SDK** — duplicated logic, divergent behaviors over time
- **Shared package** — centralized maintenance, consistent behavior, single patch point for security issues

## Decision

Use `contentful-sdk-core` as the shared runtime foundation for all Contentful JS SDKs.

It provides:
- `createHttpClient(axios, config)` — standardized HTTP client factory
- `getUserAgentHeader()` — consistent user-agent construction
- Rate limiting and retry logic
- Error normalization
- Query string serialization (via `qs`)

Changes to HTTP behavior (security patches, rate limit adjustments, new headers) are made once in sdk-core and propagated to consuming SDKs via version bumps.

## Consequences

- Security patches (e.g., axios CVEs, qs vulnerabilities) are fixed in sdk-core and propagated via dependency bumps in each SDK — tracked in Jira (DX-663, DX-704, DX-748, etc.)
- SDKs share identical HTTP behavior by default, reducing surprising differences between CDA and CMA clients
- sdk-core changes can break consuming SDKs if semver isn't respected
- The DX team owns sdk-core, contentful.js, and contentful-management.js — coordination is internal
- sdk-core's own build (ESM + CJS via Rollup) must stay compatible with both SDK consumers
