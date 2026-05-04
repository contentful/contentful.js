# contentful.js

JavaScript client library for the Contentful [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) (CDA) and [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/) (CPA).

## What's in this repo

A single-package SDK that provides a typed JavaScript/TypeScript client for reading content from Contentful spaces. It handles:

- Querying entries, assets, content types, locales, tags, and concepts
- Automatic link resolution across entries and assets
- Sync API for incremental content updates
- Content Source Maps for visual editing integrations (Vercel, Live Preview)
- Cursor-based pagination
- Timeline Preview support

Published as the `contentful` package on npm.

## Quick Start

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | See `engines` field in package.json |
| npm | latest | Ships with Node.js |

### Setup

```bash
# Clone
git clone git@github.com:contentful/contentful.js.git
cd contentful.js

# Install
npm ci

# Build
npm run build

# Test
npm test
```

## Documentation

| Document | What it covers |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Internal structure, build pipeline, data flows |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development setup, workflow, commit conventions |
| [Architecture Decisions](./docs/ADRs/) | Why things look the way they do |
| [AGENTS.md](./AGENTS.md) | Agent-first context directory |
| [MIGRATION.md](./MIGRATION.md) | Version migration guides |
| [ADVANCED.md](./ADVANCED.md) | Advanced usage patterns |
| [TYPESCRIPT.md](./TYPESCRIPT.md) | TypeScript usage and type inference |

## Integration Context

**Upstream (this repo consumes):**
- `contentful-sdk-core` — shared HTTP plumbing, rate limiting, error handling, query building
- `contentful-resolve-response` — link resolution across entries/assets
- `@contentful/content-source-maps` — Content Source Maps encoding/decoding for visual editing
- `@contentful/rich-text-types` — Rich Text field type definitions
- Contentful Content Delivery API / Content Preview API — the backing HTTP APIs

**Downstream (consumes this repo):**
- Customer JavaScript/TypeScript applications (Node.js + browser)
- Contentful framework integrations (Next.js, Gatsby, Nuxt, etc.)
- Contentful Live Preview SDK
- Vercel Content Link / Visual Editing integrations
