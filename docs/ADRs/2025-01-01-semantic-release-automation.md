# Automated Releases with semantic-release

## Status

Accepted

## Context

Manual release processes are error-prone and slow. The SDK is published to npm and needs consistent versioning, changelogs, and GitHub releases.

## Decision

Use semantic-release to fully automate the release process:

- **Trigger:** Push to `master` (or `next` for pre-releases)
- **Version determination:** Conventional Commits analyzed by `@semantic-release/commit-analyzer`
- **Outputs:** npm publish, GitHub release, CHANGELOG.md update
- **Custom rule:** `build(deps)` commits trigger a patch release (important for security patch propagation)

Release credentials are managed via HashiCorp Vault (OIDC trusted publishing), not stored as GitHub secrets directly.

The `contentful-automation[bot]` GitHub App creates the release commit and tag.

## Consequences

- No manual version bumps, tag creation, or npm publish steps
- Commit discipline matters: wrong commit types produce wrong versions
- `build(deps)` → patch ensures security dependency bumps are released automatically
- Pre-release channel (`next`) available for breaking changes that need validation
- Release happens after CI passes — if tests fail, no release occurs
- API documentation (TypeDoc) is published automatically on master releases
