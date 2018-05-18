# contentful.js

> JavaScript SDK for [Contentful's](https://www.contentful.com) Content Delivery API.

[![npm](https://img.shields.io/npm/v/contentful.svg)](https://www.npmjs.com/package/contentful)
[![Build Status](https://travis-ci.org/contentful/contentful.js.svg?branch=master)](https://travis-ci.org/contentful/contentful.js)
[![codecov](https://codecov.io/gh/contentful/contentful.js/branch/master/graph/badge.svg)](https://codecov.io/gh/contentful/contentful.js)
[![Dependency Status](https://img.shields.io/david/contentful/contentful.js.svg)](https://david-dm.org/contentful/contentful.js)
[![devDependency Status](https://img.shields.io/david/dev/contentful/contentful.js.svg)](https://david-dm.org/contentful/contentful.js#info=devDependencies)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm downloads](https://img.shields.io/npm/dm/contentful.svg)](http://npm-stat.com/charts.html?package=contentful)
[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/contentful/dist/contentful.browser.min.js?compression=gzip
)](https://unpkg.com/contentful/dist/contentful.browser.min.js)

[Contentful](https://www.contentful.com) provides a content infrastructure for digital teams to power content in websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content creators to ship digital products faster.

## Features

- Content retrieval through Contentful's [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)
- Built in rate limiting with recovery procedures

Browsers and Node.js:
- Chrome
- Firefox
- Edge
- IE11 (with [legacy version](#legacy-browsers) of the library)
- Safari
- node.js (6.x, 8.x)

Other browsers should also work, but at the moment we're only running automated tests on the browsers and Node.js versions specified above.

# Getting started

In order to get started with the Contentful JS SDK you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

- [Installation](#installation)
- [Authentication](#authentication)
- [Using ES6 import](#using-es6-import)
- [Your first request](#your-first-request)
- [Using this SDK with the Preview API](#using-this-sdk-with-the-preview-api)
- [Advanced features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Documentation/References](#documentationreferences)
## Installation

### Node:

Using [npm](http://npmjs.org):

``` sh
npm install contentful
```

Using [yarn](https://yarnpkg.com/lang/en/):

``` sh
yarn add contentful
```

### Browser:

For browsers, we recommend to download the SDK via npm or yarn to ensure 100% availability.

If you'd like to use a standalone built file you can use the following script tag or download it from [jsDelivr](https://www.jsdelivr.com/package/npm/contentful), under the `dist` directory:

``` html
<script src="https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js"></script>
```

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number:

``` html
<script src="https://cdn.jsdelivr.net/npm/contentful@5.0.1/dist/contentful.browser.min.js"></script>
```

The Contentful Delivery SDK will be accessible via the `contentful` global variable.

Check the [releases](https://github.com/contentful/contentful.js/releases) page to know which versions are available.

### Legacy browsers:

This library also comes with a legacy version to support Internet Explorer 11 and other older browsers. It already contains a polyfill for Promises.

To support legacy browsers in your application, use `contentful.legacy.min.js` instead of `contentful.browser.min.js`

## Authentication

To get content from Contentful, an app should authenticate with an OAuth bearer token.

You can create API keys using [Contentful's web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the Contentful's REST API reference on [Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## Using ES6 import
You can use the es6 import with the SDK as follow

```js
// import createClient directly
import {createClient} from 'contentful'
const client = createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'developer_bookshelf',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '0b7f6x59a0'
})
//....
```
OR
```js
// import everything from contentful
import * as contentful from 'contentful'
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'developer_bookshelf',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '0b7f6x59a0'
})
// ....
```
## Your first request

The following code snippet is the most basic one you can use to get some content from Contentful with this SDK:

```js
const contentful = require('contentful')
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'developer_bookshelf',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '0b7f6x59a0'
})
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client.getEntry('5PeGS2SoZGSa4GuiQsigQu')
.then((entry) => console.log(entry)).catch((err) => console.log(err))
```

You can try and change the above example at [Tonic](https://tonicdev.com/npm/contentful), or if you'd prefer a more Browser oriented example, check out this [JSFiddle](https://jsfiddle.net/contentful/kefaj4s8/) version of our Product Catalogue demo app.

## Using this SDK with the Preview API

This SDK can also be used with the Preview API. In order to do so, you need to use the Preview API Access token, available on the same page where you get the Delivery API token, and specify the host of the preview API, such as:

```js
const contentful = require('contentful')
const client = contentful.createClient({
  space: 'developer_bookshelf',
  accessToken: 'preview_0b7f6x59a0',
  host: 'preview.contentful.com'
})
```

You can check other options for the client on our reference documentation

## Advanced features

### Link resolution

contentful.js does resolve links by default unless specified otherwise.
To disable it just set `resolveLinks` to `false` when creating the Contentful client. Like so

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken:'<you-access-token>',
  space: '<your-space-id>',
  resolveLinks: false
})
```

Please note that the link resolution is only possible when requesting records from the collection endpoint using `client.getEntries()` or by performing an initial sync `client.sync({initial: true})`. In case you want to request one entry and benefit from the link resolution you can use the collection end point with the following query parameter `'sys.id': '<your-entry-id>'`.

**e.g.** assuming that you have a Content Type `post` that has a reference field `author`

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken:'<you-access-token>',
  space: '<your-space-id>',
})
// getting a specific Post
client.getEntries({'sys.id': '<entry-id>'}).then((response) => {
  // output the author name
  console.log(response.items[0].fields.author.fields.name)
}).catch((err) => console.log(err))
```
The link resolution is applied to one level deep by default. If you need it to be applied deeper, you may specify the `include` parameter when fetching your entries as follows `client.getEntries({include: <value>})`. The `include` parameter can be set to a number up to 10..

By default, the SDK will keep links, which could not get resolved, in your response. If you want to completely remove fields which could not be resolved, set `removeUnresolved: true` in the configuration options.

### Sync

The Sync API allows you to keep a local copy of all content in a space up-to-date via delta updates, meaning only changes that occurred since last sync call.
Whenever you perform a sync operation the endpoint will send back a `syncToken` which you can use in a subsequent sync to only retrieve data which changed since the last call.
**e.g.**

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken:'<you-access-token>',
  space: '<your-space-id>',
})
// first time you are syncing make sure to specify `initial: true`
client.sync({initial: true}).then((response) => {
  // You should save the `nextSyncToken` to use in the following sync
  console.log(response.nextSyncToken)
}).catch((err) => console.log(err))
```
The SDK will go through all the pages for you and gives you back a response object with the full data so you don't need to handle pagination.

#### Sync without pagination

You may use syncing without pagination if you want to handle it on your own. To do this, you have to pass `paginate: false` as option when calling sync. You manually have to take care to pass `nextPageToken` or `nextSyncToken` to your subsequent calls. The logic follows our [sync API docs](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/synchronization/pagination-and-subsequent-syncs) while you pass tokens instead of full urls.

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken:'<you-access-token>',
  space: '<your-space-id>',
})

function customPaginatedSync (query) {
  // Call sync, make sure you set paginate to false for every call
  return client.sync(query, {paginate: false}).then((response) => {
    // Do something with the respond. For example save result to disk.
    console.log('Result of current sync page:', response.items)

    // Sync finished when `nextSyncToken` is available
    if (response.nextSyncToken) {
      console.log('Syncing done. Start a new sync via ' + response.nextSyncToken)
      return
    }

    // Otherwise, just continue to next page of the current sync run
    return customPaginatedSync({nextPageToken: response.nextPageToken})
  })
}

customPaginatedSync({initial: true})
  .then(() => console.log('Sync done'))
```

### Querying & Search parameters

You can pass your query parameters as `key: value` pairs in the query object whenever request a resource.
**e.g.**

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken:'<you-access-token>',
  space: '<your-space-id>',
})

// getting a specific Post
client.getEntries({'sys.id': '<entry-id>'}).then((response) => {
  // output the author name
  console.log(response.items[0].fields.author.fields.name)
}).catch((err) => console.log(err))

// You can pass a query when requesting a single entity
client.getEntry('<entry-id>', {key: value})
```

for more information about the search parameters check the [documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters)

## Troubleshooting

- **Can I use the SDK in react native projects**
	- Yes it is possible
- **I get the error: Unable to resolve module `http`**
	- Our SDK is supplied as node and browser version. Most non-node environments, like React Native, act like a browser. To force using of the browser version, you can require it via: `const { createClient } = require('contentful/dist/contentful.browser.min.js')`

- **Link resolution does not work when using `client.getEntry('<entry-id>')`**
	- Link resolution does not work with the single entity endpoint, you can use `client.getEntries({'sys.id': '<entry-id>'})` to link an entry with resolved links
- **Can I use it with typescript?**
	- Yes, there is also a type definition file
- **Is the SDK doing any caching?**
	- No, check this [issue](https://github.com/contentful/contentful.js/issues/83) for more infos
- 😱 **Something is wrong what should I do?**
	- If it is a bug related to the code create a Github issue and make sure to remove any credential for your code before sharing it.
	- If you need to share your credentials, for example you have an issue with your space, please create a support ticket in the [support page](parameters).


## Documentation/References

To help you get the most out of this SDK, we've prepared reference documentation, tutorials and other examples that will help you learn and understand how to use this library.

### Configuration

The `createClient` method supports several options you may set to achieve the expected behavior:

```js
contentful.createClient({
  ... your config here ...
})
```

#### accessToken (required)
Your CDA access token.

#### space (required)
Your Space ID.

#### host (default: `'cdn.contentful.com'`)
Set the host used to build the request URI's.

#### basePath (default: ``)
This path gets appended to the host to allow request urls like `https://gateway.example.com/contentful/` for custom gateways/proxies.

#### httpAgent (default: `undefined`)
Custom agent to perform HTTP requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).

#### httpsAgent (default: `undefined`)
Custom agent to perform HTTPS requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).

#### headers (default: `{}`)
Additional headers to attach to the requests. We add/overwrite the following headers:

* Content-Type: `application/vnd.contentful.management.v1+json`
* X-Contentful-User-Agent: `sdk contentful.js/1.2.3; platform node.js/1.2.3; os macOS/1.2.3`
 (Automatically generated)

 #### proxy (default: `undefined`)
Axios proxy configuration. See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config) for further information about the supported values.

#### resolveLinks (default: `true`)
Turn off to disable link resolving.

#### removeUnresolved (default: `false`)
Remove fields from response for unresolved links.

#### retryOnError (default: `true`)
By default, this SDK is retrying requests which resulted in a 500 server error and 429 rate limit response. Set this to `false` to disable this behavior.

#### logHandler (default: `function (level, data) {}`)
Errors and warnings will be logged by default to the node or browser console. Pass your own log handler to intercept here and handle errors, warnings and info on your own.

### Reference documentation

The [Contentful's JS SDK reference](https://contentful.github.io/contentful.js) documents what objects and methods are exposed by this library, what arguments they expect and what kind of data is returned.

Most methods also have examples which show you how to use them.

You can start by looking at the top level [`contentful`](./contentful.html) namespace.

    From version 3.0.0 onwards, you can access documentation for a specific version by visiting `https://contentful.github.io/contentful.js/contentful/<VERSION>`

### Contentful JavaScript resources

Check the [Contentful for JavaScript](https://www.contentful.com/developers/docs/javascript/) page for Tutorials, Demo Apps, and more information on other ways of using JavaScript with Contentful

### REST API reference

This library is a wrapper around our Contentful Delivery REST API. Some more specific details such as search parameters and pagination are better explained on the [REST API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/), and you can also get a better understanding of how the requests look under the hood.

### Legacy contentful.js

For versions prior to 3.0.0, you can access documentation at [https://github.com/contentful/contentful.js/tree/legacy](https://github.com/contentful/contentful.js/tree/legacy)

## Versioning

This project strictly follows [Semantic Versioning](http://semver.org/) by use of [semantic-release](https://github.com/semantic-release/semantic-release).

This means that new versions are released automatically as fixes, features or breaking changes are released.

You can check the changelog on the [releases](https://github.com/contentful/contentful.js/releases) page.

## Migration from contentful.js 4.x

The bundle for browsers is now called `contentful.browser.min.js` to mark it clearly as browser only bundle. If you need to support IE 11 or other old browsers, you may use the `contentful.legacy.min.js`. Node will automatically use the `contentful.node.min.js` while bundlers like Webpack will resolve to the new ES-modules version of the library.

No changes to the API of the library were made.

## Migration from contentful.js 3.x

From version 4.0.0 and up contentful.js is exported as a single `umd` bundle the cdn distribution has changed, there is no more `browser-dist`. the new link format is https://unpkg.com/contentful@version/dist/contentful.min.js instead of https://unpkg.com/contentful@version/browser-dist/contentful.min.js. to access version 3 you can still use https://unpkg.com/contentful@3.0.0/browser-dist/contentful.min.js

## Migration from contentful.js 2.x and older
contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

See the [migration guide](MIGRATION.md) for more information.

## Support

If you have a problem with this library, please file an [issue](https://github.com/contentful/contentful.js/issues/new) here on GitHub.

If you have other problems with Contentful not related to this library, you can contact [Customer Support](https://support.contentful.com).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
