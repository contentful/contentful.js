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

# Running tests

This project has unit and integration tests. Both of these run on both Node.js and Browser environments.

Both of these test environments are setup to deal with Babel and code transpiling, so there's no need to worry about that

- `npm test` runs all three kinds of tests and generates a coverage report
- `npm run test:only` runs Node.js unit tests without coverage. `npm run test:cover` to run Node.js unit tests with coverage. `npm run test:debug` runs babel-node in debug mode (same as running `node debug`).
- `npm run test:integration` runs the integration tests against the Contentful CDA API
- `npm run test:browser-local` runs both the unit and integration tests using Karma against local browsers.

# Documentation

Code is documented using JSDoc 3, and reference documentation is published automatically with each new version.

# Other tasks

Check `package.json` or run `npm run` to see additional tasks. Some of these are used only on CI environments and not relevant for usual development.
