# Setup

Details and notes about the build process and setup

## Stop building on prepublish when running npm install locally

```
"prepublish": "in-publish && npm run build || not-in-publish",
```

See https://www.npmjs.com/package/in-publish and https://medium.com/greenkeeper-blog/what-is-npm-s-prepublish-and-why-is-it-so-confusing-a948373e6be1#.u5ht8hn77

## Vendored axios

`index.js` is the entry point for the node.js package, and it requires a vendored version of Axios from the [contentful-sdk-core](https://github.com/contentful/contentful-sdk-core) package.

`browser.js` is the entry point for the CommonJS package when required from a browser aware environment (webpack or browserify) and for the standalone `browser-dist` build which is generated with webpack. This version requires a different vendored version of Axios which contains no code that isn't necessary for browsers.
