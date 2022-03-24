![header](https://github.com/contentful/contentful.js/raw/master/.github/header.png)
<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
  &nbsp;
  <a href="https://www.contentfulcommunity.com/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Forum-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600"
      alt="Join Contentful Community Forum">
  </a>
</p>

> ___
> :rotating_light: :rotating_light: :rotating_light: We have just released **contentful.js v10 in Beta** with enhanced :sparkles: **TypeScript** :sparkles: support! :rotating_light: :rotating_light: :rotating_light:
>
> You can check it out on [npm](https://www.npmjs.com/package/contentful) under the `beta-v10` tag (go to the "Versions" tab to find it). 
> The [migration guide](https://github.com/contentful/contentful.js/blob/beta-v10/MIGRATION.md#migration-to-contentfuljs-10x) and updated v10 [README](https://github.com/contentful/contentful.js/blob/beta-v10/README.md) and  can be found on the [beta-v10 branch](https://github.com/contentful/contentful.js/tree/beta-v10).
> ___

# <span style="line-height: 1.1">contentful.js - Contentful JavaScript Content Delivery Library</span>

_JavaScript library for the Contentful [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) and [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/). It helps you to easily access your Content stored in Contentful with your JavaScript applications._

<p align="center">
  <img src="https://img.shields.io/badge/Status-Maintained-green.svg" alt="This repository is actively maintained" /> &nbsp;
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="MIT License" />
  </a>
  &nbsp;
  <a href="https://travis-ci.org/contentful/contentful.js">
    <img src="https://travis-ci.org/contentful/contentful.js.svg?branch=master" alt="Build Status">
  </a>
</p>


<p align="center">
  <a href="https://www.npmjs.com/package/contentful">
    <img src="https://img.shields.io/npm/v/contentful.svg" alt="NPM">
  </a>
   <a href="https://www.jsdelivr.com/package/npm/contentful">
    <img src="https://data.jsdelivr.com/v1/package/npm/contentful/badge" alt="jsDelivr Hits">
  </a>
  &nbsp;
  <a href="https://npm-stat.com/charts.html?package=contentful">
    <img src="https://img.shields.io/npm/dm/contentful.svg" alt="NPM downloads">
  </a>
  &nbsp;
  <a href="https://unpkg.com/contentful/dist/contentful.browser.min.js">
    <img src="https://img.badgesize.io/https://unpkg.com/contentful/dist/contentful.browser.min.js?compression=gzip" alt="GZIP bundle size">
  </a>
</p>

**What is Contentful?**

[Contentful](https://www.contentful.com/) provides content infrastructure for digital teams to power websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content creators to ship their products faster.

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
    - [Reference documentation](#reference-documentation)
      - [Legacy contentful.js documentation](#legacy-contentfuljs-documentation)
    - [Tutorials & other resources](#tutorials--other-resources)
    - [Troubleshooting](#troubleshooting)
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

- Content retrieval through [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) and [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)
- Built in rate limiting with recovery procedures
- ES6 modules / bundler support (**since v5.0.1 - 17. October 2017**)
- Supports [Environments](https://www.contentful.com/developers/docs/concepts/multiple-environments/) (**since v6.0.0 - 06. April 2018**)

### Supported browsers and Node.js versions:

- Chrome
- Firefox
- Edge
- Safari
- node.js (LTS)

Other browsers should also work, but at the moment we're only running automated tests on the browsers and Node.js versions specified above.

## Getting started

In order to get started with the Contentful JS library you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

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

If you'd like to use a standalone built file you can use the following script tag or download it from [jsDelivr](https://www.jsdelivr.com/package/npm/contentful), under the `dist` directory:

```html
<script src="https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js"></script>
```

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number.

```html
<script src="https://cdn.jsdelivr.net/npm/contentful@5.0.1/dist/contentful.browser.min.js"></script>
```

The Contentful Delivery library will be accessible via the `contentful` global variable.

Check the [releases](https://github.com/contentful/contentful.js/releases) page to know which versions are available.

#### Legacy browsers:

~~This library also comes with a legacy version to support Internet Explorer 11 and other older browsers. It already contains a polyfill for Promises.~~

> With version `9.0.4` we dropped the support for IE 11. The legacy bundle will only be available for older versions. The full list of supported browsers can be found here [@contentful/browserslist-config](https://github.com/contentful/browserslist-config/blob/master/index.js)

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

This library can also be used with the Preview API. In order to do so, you need to use the Preview API Access token, available on the same page where you get the Delivery API token, and specify the host of the preview API, such as:

```js
const contentful = require("contentful");
const client = contentful.createClient({
  space: "developer_bookshelf",
  accessToken: "preview_0b7f6x59a0",
  host: "preview.contentful.com"
});
```

You can find all available methods of our client in our [reference documentation](https://contentful.github.io/contentful.js/contentful/9.1.18/)

### Authentication

To get your own content from Contentful, an app should authenticate with an OAuth bearer token.

You can create API keys using the [Contentful web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the [Contentful REST API reference on Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## Documentation & References

- [Configuration](#configuration)
- [Reference documentation](#reference-documentation)
- [Tutorials & other resources](#tutorials--other-resources)
- [Troubleshooting](#troubleshooting)
- [Advanced Concepts](#advanced-concepts)
- [Migration](#migration)

To help you get the most out of this library, we've prepared all available client configuration options, a reference documentation, tutorials and other examples that will help you learn and understand how to use this library.

### Configuration

The `createClient` method supports several options you may set to achieve the expected behavior:

```js
contentful.createClient({
  ... your config here ...
})
```

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>accessToken</code></td>
      <td></td>
      <td>
        <strong>Required</strong>. Your CDA access token.
      </td>
    </tr>
    <tr>
      <td><code>space</code></td>
      <td></td>
      <td>
        <strong>Required</strong>. Your Space ID.
      </td>
    </tr>
    <tr>
      <td><code>environment</code></td>
      <td><code>'master'</code></td>
      <td>
        Set the environment that the API key has access to.
      </td>
    </tr>
    <tr>
      <td><code>host</code></td>
      <td><code>'cdn.contentful.com'</code></td>
      <td>
        Set the host used to build the request URI's.
      </td>
    </tr>
    <tr>
      <td><code>basePath</code></td>
      <td><code>''</code></td>
      <td>
        This path gets appended to the host to allow request urls like <code>https://gateway.example.com/contentful/</code> for custom gateways/proxies.
      </td>
    </tr>
    <tr>
      <td><code>httpAgent</code></td>
      <td><code>undefined</code></td>
      <td>
        Custom agent to perform HTTP requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
      </td>
    </tr>
    <tr>
      <td><code>httpsAgent</code></td>
      <td><code>undefined</code></td>
      <td>
        Custom agent to perform HTTPS requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
      </td>
    </tr>
    <tr>
      <td><code>adapter</code></td>
      <td><code>undefined</code></td>
      <td>
        Custom adapter to handle making the requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
      </td>
    </tr>
    <tr>
      <td><code>headers</code></td>
      <td><code>{}</code></td>
      <td>
        <p>Additional headers to attach to the requests. We add/overwrite the following headers:</p>
        <ul>
          <li>Content-Type: <code>application/vnd.contentful.management.v1+json</code></li>
          <li>X-Contentful-User-Agent: <code>sdk contentful.js/1.2.3; platform node.js/1.2.3; os macOS/1.2.3</code> (Automatically generated)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>proxy</code></td>
      <td><code>undefined</code></td>
      <td>
        Axios proxy configuration. See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config) for further information about the supported values.
      </td>
    </tr>
    <tr>
      <td><code>resolveLinks</code></td>
      <td><code>true</code></td>
      <td>
        Turn off to disable link resolving.
      </td>
    </tr>
    <tr>
      <td><code>removeUnresolved</code></td>
      <td><code>false</code></td>
      <td>
        Remove fields from response for unresolved links.
      </td>
    </tr>
    <tr>
      <td><code>retryOnError</code></td>
      <td><code>true</code></td>
      <td>
        By default, this library is retrying requests which resulted in a 500 server error and 429 rate limit response. Set this to <code>false</code> to disable this behavior.
      </td>
    </tr>
    <tr>
      <td><code>application</code></td>
      <td><code>undefined</code></td>
      <td>
        Application name and version e.g myApp/version.
      </td>
    </tr>
    <tr>
      <td><code>integration</code></td>
      <td><code>undefined</code></td>
      <td>
        Integration name and version e.g react/version.
      </td>
    </tr>
    <tr>
      <td><code>timeout</code></td>
      <td><code>30000</code></td>
      <td>
        in milliseconds - connection timeout.
      </td>
    </tr>
    <tr>
      <td><code>retryLimit</code></td>
      <td><code>5</code></td>
      <td>
        Optional number of retries before failure.
      </td>
    </tr>
    <tr>
      <td><code>logHandler</code></td>
      <td><code>function (level, data) {}</code></td>
      <td>
        Errors and warnings will be logged by default to the node or browser console. Pass your own log handler to intercept here and handle errors, warnings and info on your own.
      </td>
    </tr>
        <tr>
      <td><code>requestLogger</code></td>
      <td><code>function (config) {}</code></td>
      <td>
        Interceptor called on every request. Takes Axios request config as an arg.
      </td>
    </tr>
        <tr>
      <td><code>responseLogger</code></td>
      <td><code>function (response) {}</code></td>
      <td>
        Interceptor called on every response. Takes Axios response object as an arg.
      </td>
    </tr>
  </tbody>
</table>

### Reference documentation

The [JS library reference](https://contentful.github.io/contentful.js/contentful/9.1.18/) documents what objects and methods are exposed by this library, what arguments they expect and what kind of data is returned.

Most methods also have examples which show you how to use them.

#### Legacy contentful.js documentation

For versions prior to 3.0.0, you can access documentation at [https://github.com/contentful/contentful.js/tree/legacy](https://github.com/contentful/contentful.js/tree/legacy)


### Tutorials & other resources

* This library is a wrapper around our Contentful Delivery REST API. Some more specific details such as search parameters and pagination are better explained on the [REST API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/), and you can also get a better understanding of how the requests look under the hood.
* Check the [Contentful for JavaScript](https://www.contentful.com/developers/docs/javascript/) page for Tutorials, Demo Apps, and more information on other ways of using JavaScript with Contentful

### Troubleshooting

- **I get the error: Unable to resolve module `http`** - Our library is supplied as node and browser version. Most non-node environments, like React Native, act like a browser. To force using of the browser version, you can require it via: `const { createClient } = require('contentful/dist/contentful.browser.min.js')`
- **Can I use it with typescript?** - Yes, there is also a type definition file
- **Is the library doing any caching?** - No, check this [issue](https://github.com/contentful/contentful.js/issues/83) for more infos

### Advanced Concepts

More information about how to use the library in advanced or special ways can be found in the [ADVANCED.md](ADVANCED.md) document.

### Migration

We gathered all information related to migrating from older versions of the library in our [MIGRATION.md](MIGRATION.md) document.

## Reach out to us

### You have questions about how to use this library?
* Reach out to our community forum: [![Contentful Community Forum](https://img.shields.io/badge/-Join%20Community%20Forum-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://support.contentful.com/)
* Jump into our community slack channel: [![Contentful Community Slack](https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600)](https://www.contentful.com/slack/)

### You found a bug or want to propose a feature?

* File an issue here on GitHub: [![File an issue](https://img.shields.io/badge/-Create%20Issue-6cc644.svg?logo=github&maxAge=31557600)](https://github.com/contentful/contentful.js/issues/new). Make sure to remove any credential from your code before sharing it.

### You need to share confidential information or have other questions?

* File a support ticket at our Contentful Customer Support: [![File support ticket](https://img.shields.io/badge/-Submit%20Support%20Ticket-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://www.contentful.com/support/)


## Get involved

We appreciate any help on our repositories. For more details about how to contribute see our [CONTRIBUTING.md](https://github.com/contentful/contentful.js/blob/master/CONTRIBUTING.md) document.

## License

This repository is published under the [MIT](LICENSE) license.

## Code of Conduct

We want to provide a safe, inclusive, welcoming, and harassment-free space and experience for all participants, regardless of gender identity and expression, sexual orientation, disability, physical appearance, socioeconomic status, body size, ethnicity, nationality, level of experience, age, religion (or lack thereof), or other identity markers.

[Read our full Code of Conduct](https://github.com/contentful-developer-relations/community-code-of-conduct).
