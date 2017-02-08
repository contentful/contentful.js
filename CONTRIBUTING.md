We appreciate any community contributions to this project, whether in the form of issues or Pull Requests.

This document outlines what we'd like you to follow in terms of commit messages and code style.

It also explains what to do in case you want to setup the project locally and run tests.

# Setup

This project is written in ES2015 and transpiled to ES5 using Babel, to the `dist` directory. This should generally only happen at publishing time, or for testing purposes only.

Run `npm install` to install all necessary dependencies. When running `npm install` locally, `dist` is not compiled.

All necessary dependencies are installed under `node_modules` and any necessary tools can be accessed via npm scripts. There is no need to install anything globally.

When importing local, in develoment code, via `index.js`, this file checks if `dist` exists and uses that. Otherwise, it uses the code from `lib`.

If you have a `dist` directory, run `npm run clean`.

Axios, one of the main dependencies is vendored. This generally shouldn't matter, but if you'd like to understand why, check [SETUP.md](SETUP.md)

# Code style

This project uses [standard](https://github.com/feross/standard). Install a relevant editor plugin if you'd like.

Everywhere where it isn't applicable, follow a style similar to the existing code.

# Commit messages and issues

This project uses the [Angular JS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit), via semantic-release. See the semantic-release [Default Commit Message Format](https://github.com/semantic-release/semantic-release#default-commit-message-format) section for more details.

# Running tests

This project has unit and integration tests. Both of these run on both Node.js and Browser environments.

Both of these test environments are setup to deal with Babel and code transpiling, so there's no need to worry about that

- `npm test` runs all three kinds of tests and generates a coverage report
- `npm run test:only` runs Node.js unit tests without coverage. `npm run test:cover` to run Node.js unit tests with coverage. `npm run test:debug` runs babel-node in debug mode (same as running `node debug`).
- `npm run test:integration` runs the integration tests against the Contentful CDA API
- `npm run test:browser-local` runs both the unit and integration tests using Karma against local browsers.
- `npm run test:ci` runs tests in CI
- `npm run test:browser-remote` runs both the unit and integration tests using Karma against Sauce Labs. This is only usable in the CI environment, as it expects the credentials and connection tunnel to be present.

# Documentation

Code is documented using JSDoc 3, and reference documentation is published automatically with each new version.

- `npm run docs:watch` watches code directory, and rebuilds documentation when anything changes. Useful for documentation writing and development.
- `npm run docs:dev` builds code and builds docs afterwards. Used by `npm run docs:watch`. Code building is required as the documentation is generated from the unminified ES5 compiled sources, rather than the original ES6 sources. You should then open the generated `out/contentful/index.html` in your browser.
- `npm run docs:build` builds documentation.
- `npm run docs:publish` builds documentation and publishes it to github pages.

# Other tasks

- `npm run clean` removes any built files
- `npm run build` builds vendored files, node package and browser version
- `npm run build:dist` builds ES5 sources from ES6 ones
- `npm run build:standalone` builds unminified and minified sources for browsers
