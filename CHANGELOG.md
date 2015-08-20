# Change Log
All notable changes to this project will be documented in this file.

## Upcoming
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
