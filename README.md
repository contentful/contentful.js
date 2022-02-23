<!-- shared header  START --> 

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">Javascript</h3>

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

## Introduction

<a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="MIT License" />
  </a><a href="https://travis-ci.org/contentful/contentful.js">
    <img src="https://travis-ci.org/contentful/contentful.js.svg?branch=master" alt="Build Status">
  </a>
 <a href="https://www.npmjs.com/package/contentful">
    <img src="https://img.shields.io/npm/v/contentful.svg" alt="NPM">
  </a>
   <a href="https://www.jsdelivr.com/package/npm/contentful">
    <img src="https://data.jsdelivr.com/v1/package/npm/contentful/badge" alt="jsDelivr Hits">
  </a>
<a href="https://npm-stat.com/charts.html?package=contentful">
    <img src="https://img.shields.io/npm/dm/contentful.svg" alt="NPM downloads">
  </a>
<a href="https://unpkg.com/contentful/dist/contentful.browser.min.js">
    <img src="https://img.badgesize.io/https://unpkg.com/contentful/dist/contentful.browser.min.js?compression=gzip" alt="GZIP bundle size">
  </a>

JavaScript library for the
Contentful [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
and [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/). It helps you to
easily access your content stored in Contentful with your JavaScript applications.

**What is Contentful?**

[Contentful](https://www.contentful.com/) provides content infrastructure for digital teams to power websites, apps, and
devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for
structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content
creators to ship their products faster.

<details>
<summary>Table of contents</summary>

<!-- TOC -->

- [contentful.js - Contentful JavaScript Delivery library](#contentfuljs---contentful-javascript-delivery-library)
    - [Core Features](#core-features)
        - [Supported browsers and Node.js versions:](#supported-browsers-and-nodejs-versions)
    - [Getting started](#getting-started)
        - [Installation](#installation)
            - [Using it directly in the browser:](#using-it-directly-in-the-browser)
            - [Legacy browsers:](#legacy-browsers)
            - [React Native & Server Side Rendering:](#react-native--server-side-rendering)
        - [Your first request](#your-first-request)
        - [Using this library with the Preview API](#using-this-library-with-the-preview-api)
        - [Authentication](#authentication)
    - [Documentation & References](#documentation--references)
        - [Configuration](#configuration)
        - [Chained clients](#chained-clients)
        - [Reference documentation](#reference-documentation)
        - [Tutorials & other resources](#tutorials--other-resources)
        - [Troubleshooting](#troubleshooting)
        - [Typscript](#typescript)
        - [Advanced Concepts](https://github.com/contentful/contentful.js/blob/master/ADVANCED.md)
        - [Migration](https://github.com/contentful/contentful.js/blob/master/MIGRATION.md)
    - [Reach out to us](#reach-out-to-us)
        - [You have questions about how to use this library?](#you-have-questions-about-how-to-use-this-library)
        - [You found a bug or want to propose a feature?](#you-found-a-bug-or-want-to-propose-a-feature)
        - [You need to share confidential information or have other questions?](#you-need-to-share-confidential-information-or-have-other-questions)
    - [Get involved](#get-involved)
    - [License](#license)
    - [Code of Conduct](#code-of-conduct)

<!-- /TOC -->

</details>

## Core Features

- Content retrieval
  through [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
  and [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)
- Built in rate limiting with recovery procedures
- Supports [Environments](https://www.contentful.com/developers/docs/concepts/multiple-environments/) (**since v6.0.0 -
  06. April 2018**)

### Supported browsers and Node.js versions:

- Chrome
- Firefox
- Edge
- Safari
- node.js (LTS)

> See list of min supported browser version here [@contentful/browserslist-config
](https://github.com/contentful/browserslist-config/blob/master/index.js)

The default export is an `es9` compliant module. in order to import the `commonJS` bundle, please use:

```js
const contentful = require("contentful/contentful.node")
```

## Getting started

In order to get started with the Contentful JS library you'll need not only to install it, but also to get credentials
which will allow you to have access to your content in Contentful.

- [Installation](#installation)
- [Your first request](#your-first-request)
- [Using this library with the Preview API](#using-this-library-with-the-preview-api)
- [Authentication](#authentication)
- [Documentation & References](#documentation--references)

### Installation

```sh
npm install contentful
```

#### Using it directly in the browser:

For browsers, we recommend to download the library via npm or yarn to ensure 100% availability.

If you'd like to use a standalone built file you can use the following script tag or download it
from [jsDelivr](https://www.jsdelivr.com/package/npm/contentful), under the `dist` directory:

```html

<script src='https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js'></script>
```

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number.

```html

<script src='https://cdn.jsdelivr.net/npm/contentful@9.0.1/dist/contentful.browser.min.js'></script>
```

The Contentful Delivery library will be accessible via the `contentful` global variable.

Check the [releases](https://github.com/contentful/contentful.js/releases) page to know which versions are available.

### Your first request

The following code snippet is the most basic one you can use to get some content from Contentful with this library:

```js
const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "developer_bookshelf",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "0b7f6x59a0"
});
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client
  .getEntry("5PeGS2SoZGSa4GuiQsigQu")
  .then(entry => console.log(entry))
  .catch(err => console.log(err));
```

Check out this [JSFiddle](https://jsfiddle.net/contentful/kefaj4s8/) version of our Product Catalogue demo app.

### Using this library with the Preview API

This library can also be used with the Preview API. In order to do so, you need to use the Preview API Access token,
available on the same page where you get the Delivery API token, and specify the host of the preview API, such as:

```js
const contentful = require("contentful");
const client = contentful.createClient({
  space: "developer_bookshelf",
  accessToken: "preview_0b7f6x59a0",
  host: "preview.contentful.com"
});
```

You can find all available methods of our client in
our [reference documentation](https://contentful.github.io/contentful.js)

### Authentication

To get your own content from Contentful, an app should authenticate with an OAuth bearer token.

You can create API keys using the [Contentful web interface](https://app.contentful.com). Go to the app, open the space
that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section
and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check
the [Contentful REST API reference on Authentication](https://www.contentful.com/developers/docs/references/authentication/)
.

## Documentation & References

- [Configuration](#configuration)
- [Reference documentation](#reference-documentation)
- [Tutorials & other resources](#tutorials--other-resources)
- [Troubleshooting](#troubleshooting)
- [Advanced Concepts](#advanced-concepts)
- [Migration](#migration)

To help you get the most out of this library, we've prepared all available client configuration options, a reference
documentation, tutorials and other examples that will help you learn and understand how to use this library.

### Configuration

The `createClient` method supports several options you may set to achieve the expected behavior:

```js
contentful.createClient({
  ...your
  config here ...
})
```

| Name                                 | Default                     | Description                                                                                                                                                                                                                                                                                                      |
|--------------------------------------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accessToken`                        |                             | **
Required**. Your CDA access token.                                                                                                                                                                                                                                                                             |
| `space`                              |                             | **
Required**. Your Space ID.                                                                                                                                                                                                                                                                                     |
| `environment`                        | `'master'`                  | Set the environment that the API key has access to.                                                                                                                                                                                                                                                              |
| `host`                               | `'cdn.contentful.com'`      | Set the host used to build the request URI's.                                                                                                                                                                                                                                                                    |
| `basePath`                           | `''`                        | This path gets appended to the host to allow request urls like `https://gateway.example.com/contentful/` for custom gateways/proxies.                                                                                                                                                                            |
| `httpAgent`                          | `undefined`                 | Custom agent to perform HTTP requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).                                                                                                                                                 |
| `httpsAgent`                         | `undefined`                 | Custom agent to perform HTTPS requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).                                                                                                                                                |
| `adapter`                            | `undefined`                 | Custom adapter to handle making the requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).                                                                                                                                          |
| `headers`                            | `{}`                        | Additional headers to attach to the requests. We add/overwrite the following headers: <ul><li><b>Content-Type:</b> `application/vnd.contentful.management.v1+json`</li><li><b>X-Contentful-User-Agent:</b> `sdk contentful.js/1.2.3; platform node.js/1.2.3; os macOS/1.2.3` (Automatically generated)</li></ul> |
| `proxy`                              | `undefined`                 | Axios proxy configuration. See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config) for further information about the supported values.                                                                                                                                  |
| <s><code>resolveLinks</code></s>     |                             | _**deprecated**_, see [Chained Clients](#chained-clients).                                                                                                                                                                                                                                                        |
| <s><code>removeUnresolved</code></s> |                             | _**deprecated**_, see [Chained Clients](#chained-clients).                                                                                                                                                                                                                                                        |
| `retryOnError`                       | `true`                      | By default, this library is retrying requests which resulted in a 500 server error and 429 rate limit response. Set this to `false` to disable this behavior.                                                                                                                                                    |
| `application`                        | `undefined`                 | Application name and version e.g myApp/version.                                                                                                                                                                                                                                                                  |
| `integration`                        | `undefined`                 | Integration name and version e.g react/version.                                                                                                                                                                                                                                                                  |
| `timeout`                            | `30000`                     | in milliseconds - connection timeout.                                                                                                                                                                                                                                                                            |
| `retryLimit`                         | `5`                         | Optional number of retries before failure.                                                                                                                                                                                                                                                                       |
| `logHandler`                         | `function (level, data) {}` | Errors and warnings will be logged by default to the node or browser console. Pass your own log handler to intercept here and handle errors, warnings and info on your own.                                                                                                                                      |
| `requestLogger`                      | `function (config) {}`      | Interceptor called on every request. Takes Axios request config as an arg.                                                                                                                                                                                                                                       |
| `responseLogger`                     | `function (response) {}`    | Interceptor called on every response. Takes Axios response object as an arg.                                                                                                                                                                                                                                     |

### Chained Clients

> Introduced in `v10.0.0`

The contentful.js library returns calls to `getEntries` (and `getEntry`) in six different shapes, depending on the three
configurations listed below.

In order to provide type support for each configuration, we provide the possibility to chain modifiers to the Contentful
client, providing the correct return types corresponding to the used modifiers.

This way, we make developing with `contentful.js` much more predictable and safer.

When initialising a client, you will receive an instance of the [`DefaultClient`](lib/create-contentful-api.ts#L91)
shape.

| Chain                      | Modifier                                                                                                                                                |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| default                    | Linked entries will be inlined while not resolvable links will be kept as link objects, single locale. [read more on link resolution](#link-resolution) |
| `withAllLocales`           | entries for all locales                                                                                                                                 |
| `withoutLinkResolution`    | All linked entries will be rendered as link objects. [read more on link resolution](#link-resolution)                                                   |
| `withoutUnresolvableLinks` | remove unresolvable links from response (if not, they are left as Link objects)                                                                         |

#### Example

```js
const entries = await client.withoutUnresolvableLinks.getEntries()
```

You can also combine client chains:

```js
const entries = await client.withoutLinkResolution.withAllLocales.getEntries()
```

The default behaviour doesn't change, you can still do:

```js
const entries = await client.getEntries()
```

#### Link Resolution

In Contentful, you can define content types that reference other content types. We call them "linked" or "referenced"
entries. In contrast to a simple REST call, this library can render the content of a linked entry in place, using
the [contentful-resolve-response](https://github.com/contentful/contentful-resolve-response) package. This enables what
we call link resolution.

**Example without Link resolution:**

```
{
  "sys": {
    ...
  },
  "metadata": {
    ...
  },
  "fields": {
    "referencedEntry": {
      "type": "Link",
      "linkType": "Entry",
      "id": "<referenced-entry-id>"
    }
  }
}
```

**Example with Link resolution:**

```
{
  "sys": {
    ...
  },
  "metadata": {
    ...
  },
  "fields": {
    "referencedEntry": {
      "sys": {
        ...
      },
      "metadata": {
        ...
      },
      fields {
        ...
      }
  }
}
```

This makes parsing the response easier, and you don't need to manually extract every linked entry from the response object.
We resolve links by default in our client. If this behaviour is not what you want, 
you can use the chain modifier `WithoutLinkResolution` to keep the link objects instead of the inlined entries in your response object.  


### Reference documentation

The [JS library reference](https://contentful.github.io/contentful.js) documents what objects and methods are exposed by
this library, what arguments they expect and what kind of data is returned.

Most methods also have examples which show you how to use them.

### Tutorials & other resources

* This library is a wrapper around our Contentful Delivery REST API. Some more specific details such as search
  parameters and pagination are better explained on
  the [REST API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/), and you can
  also get a better understanding of how the requests look under the hood.
* Check the [Contentful for JavaScript](https://www.contentful.com/developers/docs/javascript/) page for Tutorials, Demo
  Apps, and more information on other ways of using JavaScript with Contentful

### Troubleshooting

- **I get the error: Unable to resolve module `http`** - Our library is supplied as node and browser version. Most
  non-node environments, like React Native, act like a browser. To force using of the browser version, you can require
  it via: `const { createClient } = require('contentful/dist/contentful.browser.min.js')`
- **Can I use it with typescript?** - Yes, there is also a type definition file
- **Is the library doing any caching?** - No, check this [issue](https://github.com/contentful/contentful.js/issues/83)
  for more infos

### TypeScript

This library is 100% written in TypeScript. Type definitions are bundled. Find out more about the advantages of using
this library in conjunction with TypeScript in the [TYPESCRIPT.md](TYPESCRIPT.md) document.

### Advanced Concepts

More information about how to use the library in advanced or special ways can be found in the [ADVANCED.md](ADVANCED.md)
document.

### Migration

We gathered all information related to migrating from older versions of the library in our [MIGRATION.md](MIGRATION.md)
document.

## Reach out to us

### You have questions about how to use this library?

* Reach out to our community
  forum: [![Contentful Community Forum](https://img.shields.io/badge/-Join%20Community%20Forum-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://support.contentful.com/)
* Jump into our community slack
  channel: [![Contentful Community Slack](https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600)](https://www.contentful.com/slack/)

### You found a bug or want to propose a feature?

* File an issue here on
  GitHub: [![File an issue](https://img.shields.io/badge/-Create%20Issue-6cc644.svg?logo=github&maxAge=31557600)](https://github.com/contentful/contentful.js/issues/new)
  . Make sure to remove any credential from your code before sharing it.

### You need to share confidential information or have other questions?

* File a support ticket at our Contentful Customer
  Support: [![File support ticket](https://img.shields.io/badge/-Submit%20Support%20Ticket-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://www.contentful.com/support/)

## Get involved

We appreciate any help on our repositories. For more details about how to contribute see
our [CONTRIBUTING.md](https://github.com/contentful/contentful.js/blob/master/CONTRIBUTING.md) document.

## License

This repository is published under the [MIT](LICENSE) license.

## Code of Conduct

We want to provide a safe, inclusive, welcoming, and harassment-free space and experience for all participants,
regardless of gender identity and expression, sexual orientation, disability, physical appearance, socioeconomic status,
body size, ethnicity, nationality, level of experience, age, religion (or lack thereof), or other identity markers.

[Read our full Code of Conduct](https://github.com/contentful-developer-relations/community-code-of-conduct).
