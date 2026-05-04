# Architecture

## Overview

contentful.js is a typed JavaScript/TypeScript client for the Contentful Content Delivery API (CDA) and Content Preview API (CPA). It provides a high-level interface over HTTP that handles link resolution, response normalization, sync orchestration, Content Source Maps, and cursor-based pagination.

## System Context

```mermaid
graph TD
    App[Customer Application] --> SDK[contentful.js]
    SDK --> CDA[Contentful CDA / CPA]
    SDK --> CSM[@contentful/content-source-maps]
    SDK --> Core[contentful-sdk-core]
    SDK --> Resolve[contentful-resolve-response]
    Core --> Axios[axios]
    LivePreview[Live Preview SDK] -.-> CSM
    Vercel[Vercel Content Link] -.-> CSM
```

## Internal Structure

```
lib/
├── index.ts                  Public exports
├── contentful.ts             createClient() — entry point, client configuration
├── make-client.ts            Assembles the ContentfulClientApi from mixins
├── create-contentful-api.ts  Wires HTTP methods to API endpoints
├── create-global-options.ts  Space/environment URL configuration
├── paged-sync.ts             Sync API orchestration (initial + incremental)
├── global.d.ts               Global type declarations (__VERSION__)
├── mixins/
│   └── stringify-safe.ts     Safe JSON serialization for circular references
├── types/
│   ├── index.ts              Re-exports all public types
│   ├── client.ts             ContentfulClientApi interface
│   ├── entry.ts              Entry types with generic content type support
│   ├── asset.ts              Asset types
│   ├── content-type.ts       Content type definitions
│   ├── collection.ts         Paginated collection types
│   ├── sync.ts               Sync response types
│   ├── query/                Query parameter types (filtering, ordering, etc.)
│   └── ...                   Other entity types (locale, tag, concept, etc.)
└── utils/
    ├── normalize-select.ts              Ensures sys fields in select queries
    ├── normalize-search-parameters.ts   Query parameter normalization
    ├── normalize-cursor-pagination-*.ts Cursor pagination helpers
    ├── resolve-circular.ts              Circular reference resolution
    ├── validate-params.ts               Client parameter validation
    ├── validate-search-parameters.ts    Search query validation
    └── ...                              Other utilities
```

## Build Pipeline

The SDK produces three output formats from a single TypeScript source:

```
lib/**/*.ts
    │
    ├── tsc ──────────► dist/esm-raw/    (intermediate, not shipped)
    │                       │
    │                       ├── Rollup (ESM) ──► dist/esm/          (preserveModules)
    │                       ├── Rollup (CJS) ──► dist/contentful.cjs
    │                       ├── Rollup (Browser) ──► dist/contentful.browser.js
    │                       └── Rollup (Browser min) ──► dist/contentful.browser.min.js
    │
    └── tsc (declarations) ──► dist/types/   (.d.ts files)
```

**Package exports:**
- `import` → `dist/esm/index.js` (tree-shakeable ESM)
- `require` → `dist/contentful.cjs` (CJS bundle)
- `types` → `dist/types/index.d.ts`

## Data Flow

### Standard Query

```
createClient({ space, accessToken })
    → createHttpClient(axios, config)     [contentful-sdk-core]
    → makeClient({ http, getGlobalOptions })
    → client.getEntries(query)
        → normalizeSearchParameters(query)
        → HTTP GET /entries?...
        → resolveResponse(response)       [contentful-resolve-response]
        → return typed Collection<Entry>
```

### Content Source Maps (Preview only)

```
createClient({ ..., includeContentSourceMaps: true })
    → adds includeContentSourceMaps=true to all CPA requests
    → response includes CSM metadata
    → @contentful/content-source-maps decorates string values with hidden metadata
    → Live Preview SDK / Vercel reads the metadata for field-to-entry mapping
```

### Sync API

```
client.sync({ initial: true })
    → GET /sync?initial=true
    → paged-sync.ts handles pagination via nextPageUrl
    → returns { entries, assets, deletedEntries, deletedAssets, nextSyncToken }

client.sync({ nextSyncToken })
    → GET /sync?sync_token=...
    → returns incremental delta
```

## Key Dependencies

| Dependency | Why it's here |
|---|---|
| `axios` | Shared HTTP client across JS SDK family; consistent Node+browser abstraction; interceptor support (see ADR) |
| `contentful-sdk-core` | Shared foundation: HTTP client creation, rate limiting, error handling, user-agent headers |
| `contentful-resolve-response` | Link resolution — resolves `Link` objects to their full entry/asset representations |
| `@contentful/content-source-maps` | Encodes/decodes Content Source Maps metadata for visual editing integrations |
| `@contentful/rich-text-types` | Type definitions for Rich Text fields |
| `tslib` | TypeScript helper runtime (importHelpers: true) to reduce bundle size |
| `type-fest` | Utility types for advanced TypeScript generics |
| `json-stringify-safe` | Safe serialization handling circular references in resolved responses |

## Configuration

| Parameter | Purpose | Default |
|---|---|---|
| `space` | Contentful space ID | (required) |
| `accessToken` | CDA or CPA access token | (required) |
| `environment` | Environment ID | `"master"` |
| `host` | API hostname | `"cdn.contentful.com"` |
| `includeContentSourceMaps` | Enable Content Source Maps (CPA only) | `false` |
| `timelinePreview` | Enable Timeline Preview (CPA only) | `undefined` |
| `retryOnError` | Retry on 429/5xx | `true` |
| `retryLimit` | Max retry attempts | `5` |
| `timeout` | Connection timeout (ms) | `30000` |

## Integration Points

### Upstream (this repo consumes)

- **Contentful CDA** (`cdn.contentful.com`) — production content delivery
- **Contentful CPA** (`preview.contentful.com`) — draft/preview content
- **contentful-sdk-core** — HTTP client factory, shared behaviors
- **contentful-resolve-response** — link resolution algorithm

### Downstream (consumes this repo)

- **Customer applications** — Node.js servers, SPAs, SSR frameworks
- **Framework integrations** — Next.js, Gatsby, Nuxt contentful plugins
- **Live Preview SDK** — consumes Content Source Maps for visual editing
- **Vercel Content Link** — consumes Content Source Maps for in-page editing indicators
