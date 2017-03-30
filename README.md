[![npm](https://img.shields.io/npm/v/contentful.svg)](https://www.npmjs.com/package/contentful)
[![Build Status](https://travis-ci.org/contentful/contentful.js.svg?branch=master)](https://travis-ci.org/contentful/contentful.js)
[![Coverage Status](https://coveralls.io/repos/github/contentful/contentful.js/badge.svg?branch=master)](https://coveralls.io/github/contentful/contentful.js?branch=master)
[![Dependency Status](https://img.shields.io/david/contentful/contentful.js.svg)](https://david-dm.org/contentful/contentful.js)
[![devDependency Status](https://img.shields.io/david/dev/contentful/contentful.js.svg)](https://david-dm.org/contentful/contentful.js#info=devDependencies)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm downloads](https://img.shields.io/npm/dm/contentful.svg)](http://npm-stat.com/charts.html?package=contentful)

Javascript SDK for [Contentful's](https://www.contentful.com) Content Delivery API.

# About

[Contentful](https://www.contentful.com) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via a powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

## Features

- Content retrieval through Contentful's [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)
- Built in rate limiting with recovery procedures

Browsers and Node.js:
- Chrome
- Firefox
- IE11 / Edge
- Safari
- node.js (4.x, 6.x)

Other browsers should also work, but at the moment we're only running automated tests on the browsers and Node.js versions specified above.

# Getting started

In order to get started with the Contentful JS SDK you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

- [Installation](#installation)
- [Authentication](#authentication)
- [Your first request](#your-first-request)
- [Using this SDK with the Preview API](#using-this-SDK-with-the-Preview-API)
- [Advanced features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Documentation/References](#documentationreferences)

## Installation

In node, using [npm](http://npmjs.org):

``` sh
npm install contentful
```

Or, if you'd like to use a standalone built file you can use the following script tag or just download it from [unpkg](https://unpkg.com), under the `dist` directory:

``` html
<script src="https://unpkg.com/contentful@latest/dist/contentful.min.js"></script>
```
**It is not recommended to use the above URL for production.**

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number:

``` html
<script src="https://unpkg.com/contentful@4.1.1/dist/contentful.min.js"></script>
```

Check the [releases](https://github.com/contentful/contentful.js/releases) page to know which versions are available.

## Authentication

To get content from Contentful, an app should authenticate with an OAuth bearer token.

You can create API keys using [Contentful's web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the Contentful's REST API reference on [Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## Your first request

The following code snippet is the most basic one you can use to get some content from Contentful with this SDK:

```js
var contentful = require('contentful')
var client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'developer_bookshelf',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '0b7f6x59a0'
})
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client.getEntry('5PeGS2SoZGSa4GuiQsigQu')
.then((entry) => console.log(entry))
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

Please note that the link resolution is only possible when requesting records from the collection endpoint using `client.getEntries()` or by performing and initial sync `client.sync({initial: true})`. In case you want to request one entry and benefit from the link resolution you can use the collection end point with the following query parameter `'sys.id': '<your-entry-id>'`.

**e.g.** assuming that you have a contentType `post` that has a reference field `author`

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
})
```
The link resolution is applied to one level deep by default. If you need it to be applied deeper, you may specify the `include` parameter when fetching your entries as follows `client.getEntries({include: <value>})`. The `include` parameter can be set to a number up to 10..

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
// first time you are syncing make sure to spcify `initial: true`
client.sync({initial: true}).then((response) => {
	// You should save the `nextSyncToken` to use in the following sync
	console.log(response.nextSyncToken)
})
```
The SDK will go through all the pages for you and gives you back a response object with the full data so you don't need to handle pagination.

### Querying & Search parameters

You can pass your query params as `key: value` pairs in the query object whenever request a resource.
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
})

// You can pass a query when requesting a single entity
client.getEntry('<entry-id>', {key: value})
``` 

for more infos about the search parameters check the [documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters)

## Troubleshooting

- **Can I use the SDK in react native projects**
	- Yes it is possible
- **Link resolution does not work when using `client.getEntry('<entry-id>')`**
	- Link resolution does not work with the single entity endpoint, you can use `client.getEntries({'sys.id': '<entry-id>'})` to link an entry with resolved links
- **Can I use it with typescript?**
	- Yes, there is also a type definition file
- **Is there a caching done by the SDK ?**
	- No, check this [issue](https://github.com/contentful/contentful.js/issues/83) for more infos 
- 😱 **something is wrong what should I do?** 
	- If it is a bug related to the code create a Github issue and make sure to remove any credential for your code before sharing it.
	- If you need to share your credentials, for example you have an issue with your space, please create a support ticket in the [support page](parameters).
	

## Documentation/References

To help you get the most out of this SDK, we've prepared reference documentation, tutorials and other examples that will help you learn and understand how to use this library.

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

## Migration from contentful.js 3.x

From version 4.0.0 and up contenful.js is exported as a single `umd` bundle the cdn distribution has changed, there is no more `browser-dist`. the new link format is https://unpkg.com/contentful@version/dist/contentful.min.js instead of https://unpkg.com/contentful@version/browser-dist/contentful.min.js. to access version 3 you can still use https://unpkg.com/contentful@3.0.0/browser-dist/contentful.min.js

## Migration from contentful.js 2.x and older
contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

See the [migration guide](MIGRATION.md) for more information.

## Support

If you have a problem with this library, please file an [issue](https://github.com/contentful/contentful.js/issues/new) here on Github.

If you have other problems with Contentful not related to this library, you can contact [Customer Support](https://support.contentful.com).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
