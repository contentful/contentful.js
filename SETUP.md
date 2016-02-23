# Setup

Details and notes about the build process and setup

## Stop building on prepublish when running npm install locally

```
"prepublish": "in-publish && npm run build || not-in-publish",
```

See https://www.npmjs.com/package/in-publish and https://medium.com/greenkeeper-blog/what-is-npm-s-prepublish-and-why-is-it-so-confusing-a948373e6be1#.u5ht8hn77

## Vendored axios

The `vendor-browser` and `vendor-node` directories contain a vendored builds of [axios](https://github.com/mzabriskie/axios) which are used respectively on the standalone browser build and on the published npm package.

Axios is vendored because it expects a native or polyfilled implementation of promises. In this particular case, we vendor axios using babel, which uses the babel-plugin-transform-runtime to transform any usage of promises to requires to `babel-runtime/core-js/promise`.

Axios can be vendored with `npm run vendor:browser` and `npm run vendor:node`.

The browser vendored version runs on top of the standalone Axios browser version which is already optimized for this use case (it's not a good idea to try and run babel on top of the normal axios commonjs package as it produces an unnecessarily large file)
