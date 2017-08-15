# Setup

Details and notes about the build process and setup

## Stop building on prepublish when running npm install locally

```
"prepublish": "in-publish && npm run build || not-in-publish",
```

See https://www.npmjs.com/package/in-publish and https://medium.com/greenkeeper-blog/what-is-npm-s-prepublish-and-why-is-it-so-confusing-a948373e6be1#.u5ht8hn77