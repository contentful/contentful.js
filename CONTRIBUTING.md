<!-- shared header  START -->

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">Contributing</h3>

<p align="center">
  <a href="README.md">Readme</a> · 
  <a href="MIGRATION.md">Migration</a> · 
  <a href="ADVANCED.md">Advanced</a> · 
  <a href="TYPESCRIPT.md">Typescript</a> · 
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
</p>

<!-- shared header  END -->

<p align="center">
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?maxAge=31557600" alt="PRs Welcome">
  </a>
  &nbsp;
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?maxAge=31557600" alt="Semantic Release">
  </a>
  &nbsp;
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=31557600" alt="JS Standard Style">
  </a>
</p>

We appreciate any community contributions to this project, whether in the form of issues or pull requests.

This document outlines what we'd like you to follow in terms of commit messages and code style.

It also explains what to do in case you want to set up the project locally and run tests.

**Working on your first Pull Request?** You can learn how from this extensive [list of resources for people who are new to contributing to Open Source](https://github.com/freeCodeCamp/how-to-contribute-to-open-source).

## Setup

This project is written in ES2015 and transpiled to ES5 using Babel, to the `dist` directory. This should generally only happen at publishing time, or for testing purposes only.

Run `npm install` to install all necessary dependencies. When running `npm install` locally, `dist` is not compiled.

All necessary dependencies are installed under `node_modules` and any necessary tools can be accessed via npm scripts. There is no need to install anything globally.

When importing local, in development code, via `index.js`, this file checks if `dist` exists and uses that. Otherwise, it uses the code from `lib`.

If you have a `dist` directory, run `npm run clean`.

## Useful npm scripts

- `npm run clean` removes any built files
- `npm run build:dev` builds vendored files, node package and browser version
- `npm run build:prod` builds production-ready minified sources
- `npm run build` combines `clean`, `build:dev` and `build:prod`
- `npm run build:types` emits type declaration files for js files

## Running tests

This project has unit and integration tests, as well as tests checking types. All of these run on both Node.js and browser environments.

Both of these test environments are setup to deal with Babel and code transpiling, so there's no need to worry about that.

- `npm run test:unit` runs Node.js unit tests
- `npm run test:integration` runs the integration tests against the Contentful CDA API
- `npm run test:types` runs type checking tests
- `npm test` runs linting on the test code and runs all three kinds of tests
- `test:demo-node` runs a Node.js demo application and its tests, making sure that Node.js builds are functioning and are bundled correctly
- `test:demo-browser` runs a browser client demo application and its tests, making sure that browser builds are functioning and are bundled correctly
- `test:demo-projects` runs both Node.js and browser application tests

## Documentation

Code is documented using TypeDoc, and reference documentation is published automatically with each new version.

- `npm run docs:watch` watches code directory, and rebuilds documentation when anything changes. Useful for documentation writing and development
- `npm run docs:build` builds documentation
- `npm run docs:publish` builds documentation and publishes it to github pages

## Code style

This project uses ESLint configuration from [standard](https://github.com/feross/standard). Install a relevant editor plugin if you'd like.

Everywhere where it isn't applicable, follow a style similar to the existing code.

## Commit messages and issues

This project uses the [Angular JS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit), via semantic-release. See the semantic-release [commit message format](https://github.com/semantic-release/semantic-release#commit-message-format) section for more details.

## Versioning

This project strictly follows [Semantic Versioning](http://semver.org/) by use of [semantic-release](https://github.com/semantic-release/semantic-release).

This means that new versions are released automatically as fixes, features or breaking changes are released.

You can check the changelog on the [releases](https://github.com/contentful/contentful.js/releases) page.
