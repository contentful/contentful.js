![header](https://user-images.githubusercontent.com/1737026/40924850-8e920376-6818-11e8-8805-563356d4f3b6.png)
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

# contentful.js - Contentful JavaScript Delivery SDK

> JavaScript SDK for [Contentful's](https://www.contentful.com) Content Delivery API. It helps you to easily access your Content stored in Contentful with your JavaScript applications.

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
  &nbsp;
  <a href="http://npm-stat.com/charts.html?package=contentful">
    <img src="https://img.shields.io/npm/dm/contentful.svg" alt="NPM downloads">
  </a>
  &nbsp;
  <a href="https://unpkg.com/contentful/dist/contentful.browser.min.js">
    <img src="http://img.badgesize.io/https://unpkg.com/contentful/dist/contentful.browser.min.js?compression=gzip" alt="GZIP bundle size">
  </a>
</p>

<details>
  <summary>
    <strong>What is Contentful?</strong>
  </summary>
  <p>
      <a href="https://www.contentful.com/">Contentful</a>
      provides a content infrastructure for digital teams to power content in websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content creators to ship digital products faster.
  </p>
</details>

## 🚀 Core Features

- Content retrieval through Contentful's [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)
- Built in rate limiting with recovery procedures
- ES6 modules / bundler support (**since v5.0.1 - 17. Oktober 2017**)
- Supports [Environments](https://www.contentful.com/developers/docs/concepts/multiple-environments/) (**since v6.0.0 - 06. April 2018**)

### Supported browsers and Node.js versions:

- Chrome
- Firefox
- Edge
- IE11 (with [legacy version](#legacy-browsers) of the library)
- Safari
- node.js (6.x, 8.x)

Other browsers should also work, but at the moment we're only running automated tests on the browsers and Node.js versions specified above.

## 🛫 Getting started

In order to get started with the Contentful JS SDK you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

- [Installation](#installation)
- [Your first request](#your-first-request)
- [Using this SDK with the Preview API](#using-this-sdk-with-the-preview-api)
- [Authentication](#authentication)
- [Documentation & References](#documentationreferences)

### ☁️ Installation

```sh
npm install contentful
```

#### Using it directly in the browser:

For browsers, we recommend to download the SDK via npm or yarn to ensure 100% availability.

If you'd like to use a standalone built file you can use the following script tag or download it from [jsDelivr](https://www.jsdelivr.com/package/npm/contentful), under the `dist` directory:

```html
<script src="https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js"></script>
```

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number.

<details>
<summary>
  Click here to learn how to do it.
</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/contentful@5.0.1/dist/contentful.browser.min.js"></script>
```

The Contentful Delivery SDK will be accessible via the `contentful` global variable.

Check the [releases](https://github.com/contentful/contentful.js/releases) page to know which versions are available.

</details>

#### 🏚 Legacy browsers:

This library also comes with a legacy version to support Internet Explorer 11 and other older browsers. It already contains a polyfill for Promises.

To support legacy browsers in your application, use `contentful.legacy.min.js` instead of `contentful.browser.min.js`

## 🐣 Your first request

The following code snippet is the most basic one you can use to get some content from Contentful with this SDK:

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

You can try and change the above example at [Tonic](https://tonicdev.com/npm/contentful), or if you'd prefer a more Browser oriented example, check out this [JSFiddle](https://jsfiddle.net/contentful/kefaj4s8/) version of our Product Catalogue demo app.

## Using this SDK with the Preview API

This SDK can also be used with the Preview API. In order to do so, you need to use the Preview API Access token, available on the same page where you get the Delivery API token, and specify the host of the preview API, such as:

```js
const contentful = require("contentful");
const client = contentful.createClient({
  space: "developer_bookshelf",
  accessToken: "preview_0b7f6x59a0",
  host: "preview.contentful.com"
});
```

You can find all available methods of our client in our [reference documentation](https://contentful.github.io/contentful.js)

### 🔑 Authentication

To get your own content from Contentful, an app should authenticate with an OAuth bearer token.

You can create API keys using [Contentful's web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the Contentful's REST API reference on [Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## 📚 Documentation & References

<table border="0" align="center">
  <tr>
    <td>
      <a href="https://contentful.github.io/contentful.js">
        <img src="http://img.shields.io/badge/read_the-docs-2196f3.svg" alt="Documentation">
      </a>
    </td>
    <td>
      <a href="ADVANCED.md">
        <img src="http://img.shields.io/badge/advanced-concepts-2196f3.svg" alt="Advanced Concepts">
      </a>
    </td>
    <td>
       <a href="MIGRATING.md">
        <img src="http://img.shields.io/badge/migrating-from%20old%20versions-2196f3.svg" alt="Migrating from old versions">
      </a>
    </td>
  </tr>
</table>

To help you get the most out of this SDK, we've prepared reference documentation, tutorials and other examples that will help you learn and understand how to use this library.

### ⚙️ Configuration

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
      <td>accessToken<br/>(required)</td>
      <td></td>
      <td>
        Your CDA access token.
      </td>
    </tr>
    <tr>
      <td>space<br/>(required)</td>
      <td></td>
      <td>
        Your Space ID.
      </td>
    </tr>
    <tr>
      <td>host</td>
      <td><code>'cdn.contentful.com'</code></td>
      <td>
        Set the host used to build the request URI's.
      </td>
    </tr>
    <tr>
      <td>basePath</td>
      <td><code></code></td>
      <td>
        This path gets appended to the host to allow request urls like `https://gateway.example.com/contentful/` for custom gateways/proxies.
      </td>
    </tr>
    <tr>
      <td>httpAgent</td>
      <td><code>undefined</code></td>
      <td>
        Custom agent to perform HTTP requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
      </td>
    </tr>
    <tr>
      <td>httpsAgent</td>
      <td><code>undefined</code></td>
      <td>
        Custom agent to perform HTTPS requests. Find further information in the [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
      </td>
    </tr>
    <tr>
      <td>headers</td>
      <td><code>{}</code></td>
      <td>
        Additional headers to attach to the requests. We add/overwrite the following headers: - Content-Type: `application/vnd.contentful.management.v1+json`
        - X-Contentful-User-Agent: `sdk contentful.js/1.2.3; platform node.js/1.2.3; os macOS/1.2.3` (Automatically generated)
      </td>
    </tr>
    <tr>
      <td>proxy</td>
      <td><code>undefined</code></td>
      <td>
        Axios proxy configuration. See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config)
        for further information about the supported values.
      </td>
    </tr>
    <tr>
      <td>resolveLinks</td>
      <td><code>true</code></td>
      <td>
        Turn off to disable link resolving.
      </td>
    </tr>
    <tr>
      <td>removeUnresolved</td>
      <td><code>false</code></td>
      <td>
        Remove fields from response for unresolved links.
      </td>
    </tr>
    <tr>
      <td>retryOnError</td>
      <td><code>true</code></td>
      <td>
        By default, this SDK is retrying requests which resulted in a 500 server error and 429 rate limit response. Set this to `false`
        to disable this behavior.
      </td>
    </tr>
    <tr>
      <td>logHandler</td>
      <td><code>function (level, data) {}</code></td>
      <td>
        Errors and warnings will be logged by default to the node or browser console. Pass your own log handler to intercept here
        and handle errors, warnings and info on your own.
      </td>
    </tr>
  </tbody>
</table>

### 📚 Reference documentation

### 👨‍🏫 Tutorials


## Troubleshooting

- **Can I use the SDK in react native projects** - Yes it is possible
- **I get the error: Unable to resolve module `http`** - Our SDK is supplied as node and browser version. Most non-node environments, like React Native, act like a browser. To force using of the browser version, you can require it via: `const { createClient } = require('contentful/dist/contentful.browser.min.js')`

- **Link resolution does not work when using `client.getEntry('<entry-id>')`** - Link resolution does not work with the single entity endpoint, you can use `client.getEntries({'sys.id': '<entry-id>'})` to link an entry with resolved links
- **Can I use it with typescript?** - Yes, there is also a type definition file
- **Is the SDK doing any caching?** - No, check this [issue](https://github.com/contentful/contentful.js/issues/83) for more infos
- 😱 **Something is wrong what should I do?** - If it is a bug related to the code create a Github issue and make sure to remove any credential for your code before sharing it. - If you need to share your credentials, for example you have an issue with your space, please create a support ticket in the [support page](parameters).


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


## Support

If you have a problem with this library, please file an [issue](https://github.com/contentful/contentful.js/issues/new) here on GitHub.

If you have other problems with Contentful not related to this library, you can contact [Customer Support](https://support.contentful.com).

## Contributing

[![devDependency Status](https://img.shields.io/david/dev/contentful/contentful.js.svg)](https://david-dm.org/contentful/contentful.js#info=devDependencies)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
