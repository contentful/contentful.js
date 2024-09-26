<!-- shared header  START -->

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">Migration</h3>

<p align="center">
  <a href="README.md">Readme</a> · 
  <a href="MIGRATION.md">Migration</a> · 
  <a href="ADVANCED.md">Advanced</a> · 
  <a href="TYPESCRIPT.md">TypeScript</a> · 
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
</p>

<!-- shared header  END -->

# Migration information

- [Migration information](#migration-information)
  - [Migration to contentful.js 10.x](#migration-to-contentfuljs-10x)
    - [Breaking changes](#breaking-changes)
    - [Version compatibility](#version-compatibility)
    - [Response modifiers](#response-modifiers)
    - [TypeScript](#typescript)
  - [Migration to contentful.js 9.x](#migration-to-contentfuljs-9x)
  - [Migration to contentful.js 8.x](#migration-to-contentfuljs-8x)
  - [Migration to contentful.js 7.x](#migration-to-contentfuljs-7x)
  - [Migration to contentful.js 6.x](#migration-to-contentfuljs-6x)
  - [Migration to contentful.js 5.x](#migration-to-contentfuljs-5x)
  - [Migration to contentful.js 4.x](#migration-to-contentfuljs-4x)
  - [Migration to contentful.js 3.x from previous versions](#migration-to-contentfuljs-3x-from-previous-versions)
    - [Method renaming](#method-renaming)
    - [Format of collection replies](#format-of-collection-replies)
    - [Callback API removal](#callback-api-removal)
    - [Class removal](#class-removal)
    - [Link resolution](#link-resolution)
  - [Migration from contentful.js 2.x and older](#migration-from-contentfuljs-2x-and-older)

From version 3.0.0 onwards, you can access documentation for a specific version by visiting `https://contentful.github.io/contentful.js/contentful/<VERSION>`.

You can upgrade to a major version using `npm update contentful`

## Migration to version 11.x
Version 11.0.0 introduces full ESM support by default, with CJS variants still available for legacy environments. This version is a significant step forward in modernizing our build and improving performance while maintaining wide compatibility across various environments.

### Breaking changes

#### Node.js core modules

We no longer bundle Node.js core modules. If you’re bundling for the browser, you may need to configure your bundler to provide fallbacks or empty functions, particularly for the fs module. This change was introduced in version 11.x and may affect projects using Node.js-specific modules in the browser.
Pre-bundled code

Pre-bundled code for Node.js is no longer provided. If your setup relies on pre-bundled packages, you may need to adjust your build configuration.


### Improvements

#### Tree shaking

Tree shaking is significantly improved, ensuring that only the necessary parts of the library are included in your final bundle.
Smaller browser bundles

Browser bundle sizes have been reduced by nearly threefold, from 128KB to 45KB, contributing to faster load times and improved performance.

#### Module support and package configuration
The package now uses "type": "module" in package.json to define the default module format as ESM, while also providing support for CJS through the exports field. This allows us to support a wide range of environments including Node.js (with and without TypeScript, both CJS and ESM), AngularJS, GatsbyJS, Next.js, Nuxt, React Native (Expo), Rollup, Svelte, Vite, Webpack, and more.

#### Testing framework
We’ve migrated our internal test environment from Jest to Vitest, aligning with modern testing frameworks and tools.

## Security

### Removal of eval

We have completely removed the use of eval in our exported code, improving security and compatibility with strict environments.


## Migration to contentful.js 10.x

Version `10.0.0` is a complete rewrite in TypeScript. This version introduces a new concept of [client chain modifiers](README.md#client-chain-modifiers).

### Breaking changes

**Browser support**

- We completely dropped support for old IE browsers (no `legacy` bundle). See [version compatibility](#version-compatibility) for more info.

**Configuration**

- Using `resolveLinks` as a client config option or as a query parameter are no longer supported for `getEntries`, `getEntry`, `parseEntries`, or initial `sync` calls. Instead, you should use the client chain modifier `withoutLinkResolution` to achieve the same result.

- Using `removeUnresolved` as a client config option is no longer supported for `getEntries` and `getEntry`, `parseEntries`, or initial `sync` calls. Instead, you should use the client chain modifier `withoutUnresolvableLinks` to achieve the same result.

- Similarly, `getEntries`, `getEntry`, initial `sync` calls, `getAssets`, and `getAsset` no longer support setting the query parameter `locale` to `*`. In order to fetch entities in all locales, you should use the client chain modifier `withAllLocales` to achieve the same result.

See [response modifiers](#response-modifiers) for migration instructions.

**Query filters**

- Query filters that accept a string of comma-separated array of values now only accept Arrays. For more details check the [breaking change section](TYPESCRIPT.md#breaking-change) of Dynamic (field) query keys.

### Version compatibility

- Node: >= 12 (LTS)
- Chrome: >= 80,
- Edge >= 80,
- Firefox >= 75,
- Safari >= 13,

We completely dropped support for old IE browsers (no `legacy` bundle)

> You can always find the supported browsers in our shared [browserlist-config](https://github.com/contentful/browserslist-config/blob/main/index.js)

### Response modifiers

_Response modifiers were introduced to provide better type support when using contentful.js in TypeScript projects (or using TypeScript-based [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) in a JavaScript project), supporting each of the six response shapes that entries can have. See [response types](TYPESCRIPT.md#response-types) to learn more about response type support._

#### Query params `resolveLinks` and `removeUnresolved`

Calls to `getEntries`, `getEntry`, `parseEntries` and initial `sync` calls no longer support the `resolveLinks` and `removeUnresolved` parameters. Instead, you should use one of the [client chain modifiers](README.md#client-chain-modifiers) to achieve the same result.

The default behavior is as before: linked entities are by default resolved, and, if unresolvable, represented as a `Link` object. In order to change these defaults, do the following:

:warning: Instead of `resolveLinks: false`, please use the client chain modifier `withoutLinkResolution`.

:warning: Instead of `removeUnresolved: true`, please use the client chain modifier `withoutUnresolvableLinks`

**Previously:**

```js
// config options
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
  resolveLinks: false, // resolveLinks no longer supported
  removeUnresolved: true, // removeUnresolved no longer supported
})

// query params
const entries = client.getEntries({
  resolveLinks: false, // resolveLinks no longer supported
})
```

**Now:**

```js
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
})

// get entries without link resolution (previously `resolveLinks: false`)
const entries = client.withoutLinkResolution.getEntries()

// get entries without unresolvable links (previoulsy `removeUnresolved: true`)
const entries = client.withoutUnresolvableLinks.getEntries()
```

#### Query param `locale='*'`

Calls to `getEntries`, `getEntry`, `getAssets`, `getAsset` and initial `sync` calls no longer support setting the `locale` parameter to `'*'`. If you want to fetch entries in all locales, you should use one of the [client chain modifiers](README.md#client-chain-modifiers) to achieve the same result.

:warning: Instead of `locale: '*'`, please use the client chain modifier `withAllLocales`.

**Previously:**

```js
const entries = client.getEntries({
  locale: '*', // locale='*' no longer supported
})
```

**Now:**

```js
// get entries with all locales (previously `locale: '*'`)
const entries = client.withAllLocales.getEntries()
```

Setting the `locale` parameter to a specific language (e.g. `locale: 'en-US'`) still works as before.

### TypeScript

We have completely reworked the underlying type definitions, to give more accurate types based on your query/request. Read more about the new types in the [TYPESCRIPT](TYPESCRIPT.md) document.

## Migration to contentful.js 9.x

We introduced a new error handler that throws a better formed error with details from the server and obscured tokens.
We also no longer send the axios error object as is for errors without data or response objects.

```
{
  "status": 404,
  "statusText": "Not Found",
  "message": "datamessage",
  "details": "errordetails",
  "request": {
    "url": "requesturl",
    "headers": {
      "Authorization": "Bearer ...token"
    }
  },
  "requestId": "requestid"
}
```

## Migration to contentful.js 8.x

We refactored the code, replacing promises with async/await.

Some functions that used to throw synchronously for things like bad parameters now reject the promise.
In many cases users may not have to do anything assuming the calls already happened within a promise chain, but in rare cases this may need some refactoring of error handling cases.

## Migration to contentful.js 7.x

We dropped support for Node v11 and older. Please ensure you are running Node v12 or newer.
We also made [browser support track](https://github.com/contentful/browserslist-config).

Currently that means:

- Chrome >= 75
- Edge >= 17
- Firefox >= 70
- Safari >= 12

For all other browsers you will have to use the legacy bundle and possibly set up [Regenerator Runtime](https://www.npmjs.com/package/regenerator-runtime) for the browser, for example using:

```
<script src="https://cdn.jsdelivr.net/npm/regenerator-runtime@latest/runtime.min.js"></script>
```

## Migration to contentful.js 6.x

We dropped support for Node v4 and older. Please ensure you are running Node v5 or newer.

## Migration to contentful.js 5.x

The bundle for browsers is now called `contentful.browser.min.js` to mark it clearly as browser only bundle. If you need to support IE 11 or other old browsers, you may use the `contentful.legacy.min.js`. Node will automatically use the `contentful.node.min.js` while bundlers like Webpack will resolve to the new ES-modules version of the library.

No changes to the API of the library were made.

## Migration to contentful.js 4.x

From version 4.0.0 and up contentful.js is exported as a single `umd` bundle the cdn distribution has changed, there is no more `browser-dist`. the new link format is https://unpkg.com/contentful@version/dist/contentful.min.js instead of https://unpkg.com/contentful@version/browser-dist/contentful.min.js. To access version 3 you can still use https://unpkg.com/contentful@3.0.0/browser-dist/contentful.min.js

## Migration to contentful.js 3.x from previous versions

**(March 8th, 2016)**

contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

The two major changes you should look out for are the method renamings, and the way link resolution works.

This file lists the changes to the API and behavior, and how you should proceed to update your code.

For more specific details consult the [reference documentation](https://contentful.github.io/contentful.js/) for the current version.

Future releases will have any changes listed in the changelog on the [releases page](https://github.com/contentful/contentful.js/releases).

### Method renaming

Before contentful.js 3.x, the main methods were named such as `entry()` or `entries()`. Now they have changed to `getEntry()` or `getEntries()`.

This helps bring the API of this SDK more in line with that of [contentful-management.js](https://github.com/contentful/contentful-management.js).

For contentful.js, all of these methods were renamed, apart from `sync()`. The complete list is on the following table:

| Old name         | New name            |
| ---------------- | ------------------- |
| `space()`        | `getSpace()`        |
| `entry()`        | `getEntry()`        |
| `entries()`      | `getEntries()`      |
| `contentType()`  | `getContentType()`  |
| `contentTypes()` | `getContentTypes()` |
| `asset()`        | `getAsset()`        |
| `assets()`       | `getAssets()`       |
| `sync()`         | `sync()`            |

### Format of collection replies

Before contentful.js 3.x, collection replies were essentially JavaScript Arrays with some additional properties (`total`, `skip` and `limit`) added to their prototypes.

Now, collection replies are Objects, with those same properties, and an additional `items` property containing an array with all the items returned. This is more similar to what is actually returned from the REST API.

### Callback API removal

While not documented, older version of this SDK supported a callback API such as `entry('id', function(data){})`.

This has now been removed.

### Class removal

Before contentful.js 3.x, the entities returned from the API such as Entries or Content Types were wrapped in prototype based classes.

From contentful.js 3.x this is not the case anymore.

The objects returned by the promises are now [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) JavaScript Objects, which contain the relevant data and some helper methods (more to come in the future).

You can get a plain version of this object with only the data by using the `toPlainObject()` method.

Also note that Date fields such as `sys.createdAt` are not turned into JavaScript `Date` objects anymore, and are now plain ISO-8601 strings.

### Link resolution

In previous versions of contentful.js, [Links](https://www.contentful.com/developers/docs/concepts/links/) to other entries and assets were resolved by replacing the link objects with references to the objects containing the Entry or Asset.

This caused problems with serialization when circular links were present, which meant that if you used `JSON.stringify` you would get an exception, and you'd be required to use something like [json-stringify-safe](https://github.com/isaacs/json-stringify-safe) and have some additional work around the circular links.

From contentful.js 3.x onwards, links are now resolved by [getter methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), and their results memoized. This means that you can use them the same way as before, but you won't get problems with resolution of circular links when serializing them.

However, you can still turn off link resolution if you so wish.

## Migration from contentful.js 2.x and older

contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.
