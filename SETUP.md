<!-- shared header  START --> 

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">Setup</h3>

<p align="center">
  <a href="README.md">Readme</a> · 
  <a href="SETUP.md">Setup</a> · 
  <a href="MIGRATION.md">Migration</a> · 
  <a href="ADVANCED.md">Advanced</a> · 
  <a href="TYPESCRIPT.md">Typescript</a> · 
  <a href="CONTRIBUTING.md">Contributing</a> · 
  <a href="SECURITY.md">Security</a>
</p>

<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
</p>

<!-- shared header  END --> 


Details and notes about the build process and setup

## Stop building on prepublish when running npm install locally

```
"prepublish": "in-publish && npm run build || not-in-publish",
```

See https://www.npmjs.com/package/in-publish and https://medium.com/greenkeeper-blog/what-is-npm-s-prepublish-and-why-is-it-so-confusing-a948373e6be1#.u5ht8hn77
