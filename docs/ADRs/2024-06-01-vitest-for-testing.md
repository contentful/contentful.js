# Vitest as Test Framework

## Status

Accepted

## Context

As part of a developer quality-of-life modernization effort (commit 9991a646), the testing infrastructure was reviewed. The repo needed a test framework compatible with the ESM-first build and TypeScript source.

Options:
- **Jest** — widely used but ESM support was experimental and required complex configuration
- **Vitest** — native ESM support, TypeScript out of the box, fast (Vite-powered), compatible API
- **Mocha + chai** — flexible but requires more setup for TypeScript/ESM

## Decision

Adopt Vitest as the test framework for all unit and integration tests.

Configuration is minimal (`vitest.config.ts`):
- `globals: true` — no explicit imports needed for describe/it/expect
- `environment: 'node'`
- Coverage targets `lib/**/*`
- Setup file: `vitest.setup.ts`

Type tests remain separate using `tsd` (a dedicated tool for testing TypeScript type behavior).

## Consequences

- Native ESM support eliminates the configuration burden Jest had with `"type": "module"`
- Fast test execution (Vite's transform pipeline)
- Compatible API means migration from Jest-style tests was straightforward
- `tsd` remains the tool for type-level assertions (Vitest doesn't cover this)
- Watch mode works reliably with ESM imports
