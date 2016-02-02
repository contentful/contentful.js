# Setup

Details and notes about the build process and setup

## Don't build on publish

```
"prepublish": "in-publish && npm run build || not-in-publish",
```

See https://www.npmjs.com/package/in-publish and https://medium.com/greenkeeper-blog/what-is-npm-s-prepublish-and-why-is-it-so-confusing-a948373e6be1#.u5ht8hn77

## Vendored axios

The `vendor` directory contains a vendored build of [axios](https://github.com/mzabriskie/axios).

Axios is vendored because it expects a native or polyfilled implementation of promises. In this particular case, we vendor axios using babel, which uses the babel-plugin-transform-runtime to transform any usage of promises to requires to `babel-runtime/core-js/promise`.

Axios can be vendored with `npm run vendor`.
