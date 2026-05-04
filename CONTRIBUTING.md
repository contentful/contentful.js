# Contributing

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | CI runs on Node 24; local dev works on 18+ |
| npm | latest | `npm install -g npm@latest` |

## Getting Started

```bash
# Clone and install
git clone git@github.com:contentful/contentful.js.git
cd contentful.js
npm ci

# Build (required before running tests)
npm run build

# Run all tests
npm test
```

## Development Workflow

```bash
# Build ESM output only (faster iteration)
npm run build:esm

# Run unit tests in watch mode
npm run test:unit:watch

# Run integration tests in watch mode
npm run test:integration:watch

# Lint
npm run lint

# Format
npm run prettier
```

### Full build pipeline

```bash
npm run build    # clean → tsc → rollup (CJS + browser bundles)
npm run check    # es-check on all output formats (ES2017/ES2018 compliance)
```

## Testing

- **Framework:** Vitest
- **Location:** `test/unit/`, `test/integration/`, `test/types/`
- **Run all:** `npm test` (unit + integration + lint + type tests)
- **Run unit only:** `npm run test:unit`
- **Run integration only:** `npm run test:integration`
- **Watch mode:** `npm run test:unit:watch`
- **Type tests:** `npm run test:types` (uses `tsd`)
- **Bundle size:** `npm run test:size` (uses `size-limit`)
- **Output integration:** `npm run test:demo-projects` (Node + browser demo projects)

### Test structure

```
test/
├── unit/           Unit tests (mocked HTTP)
├── integration/    Integration tests (mocked CDA responses)
├── types/          Type assertion tests (tsd)
└── output-integration/
    ├── node/       Verifies the built package works in a Node project
    └── browser/    Verifies the built package works in a browser project
```

## Commit Convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitizen:

```
type(scope): description
```

Valid types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`

Examples:
```
feat: add cursor-based pagination for entries
fix(deps): bump axios to address CVE-2026-40175
build(deps): bump contentful-sdk-core and qs deps
docs: update migration guide for v11
```

A pre-commit hook runs lint-staged (prettier + eslint) via husky.

## Branch Strategy

- `master` — production; semantic-release on every push
- `next` — pre-release channel (when active)
- Feature branches — `feat/<name>`, `fix/<name>`, `chore/<name>`

## Release Process

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release):

1. Push/merge to `master`
2. CI runs build + all checks
3. If passing, semantic-release determines version from commit history:
   - `fix` → patch
   - `feat` → minor
   - `BREAKING CHANGE` / `feat!` → major
   - `build(deps)` → patch
4. Publishes to npm, creates GitHub release, updates CHANGELOG.md
5. Publishes TypeDoc API documentation

**You do not manually bump versions, create tags, or publish.** The commit type determines everything.

Pre-releases are published from the `next` branch when active.

## Pull Requests

- All tests must pass (CI runs on every push and PR)
- Husky pre-commit hook runs lint-staged (prettier + eslint)
- Squash merge to master is standard
- Bundle size is checked in CI via `size-limit`
- Bito automated review runs on every PR using `.bito/guidelines/` as its ruleset

## CI/CD

| Job | Trigger | What it does |
|---|---|---|
| `build` | Push, PR | `npm ci` → `npm run build` → cache dist/ |
| `lint` | Push, PR | ESLint |
| `prettier` | Push, PR | Prettier format check |
| `test` | Push, PR | Vitest (unit + integration) + demo projects |
| `test-bundle-size` | Push, PR | size-limit check |
| `test-types` | Push, PR | tsd type tests + es-check |
| `release` | Push to master/next | semantic-release → npm publish + docs |
| `codeql` | Push/PR (`.github/workflows/**` changes only) | GitHub Actions workflow security scanning |

All workflows live in `.github/workflows/`. The main pipeline is orchestrated by `main.yaml` which calls `build.yaml`, `check.yaml`, and `release.yaml` as reusable workflows.
