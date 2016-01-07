# Change Log
All notable changes to this project will be documented in this file.

## v2.1.0
- Allow an agent to be passed down to axios and subsequently to Node's http module (see https://nodejs.org/api/http.html#http_class_http_agent)

## v2.0.0
- Updated axios to 0.8.1 (no more auto polyfilled Promises)

## v1.2.1
- Remove initial parameter on sync() call if nextSyncToken is also defined
- Fix docs for sync()

## v1.2.0 - 2015-10-13
- Allow response resolving to be turned off
- Fix sync on non initial sync
- Removed dist/contentful.js

## v1.1.5 - 2015-08-24
- Regenerated bower build

## v1.1.4 - 2015-08-24
- Removed lodash dependency

## 1.1.3
### Fixed
- Bug in 1.1.2 where list responses without an `includes` property would error.

## 1.1.2
### Added
- Development dependencies `uglifyify`, `jscs`, and `exorcist`.

### Changed
- Ignore `node_modules` directory in git
- Move from redefine to ES6 classes using babel
- Update to recent version of browserify
- Replace Makefile build with npm scripts
- Update dist files, include sourcemaps

## v1.1.1 - 2015-03-25
- Fix issue where type parameter was sent on sync requests with a sync
  token

## v1.1.0 - 2015-03-24
### Added
- Add support for the sync endpoint

## v1.0.0 - 2015-03-24
### Changed
- Replace `questor` with `axios`
