Javascript SDK for [Contentful's](https://www.contentful.com) Content Delivery API.

## About

[Contentful](https://www.contentful.com) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via a powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

## Features

- Content retrieval through Contentful's [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/).
- [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/)
- [Localization support](https://www.contentful.com/developers/docs/concepts/locales/)
- [Link resolution](https://www.contentful.com/developers/docs/concepts/links/)

## Supported environments

Browsers and Node.js:
- Chrome
- Firefox
- IE11 / Edge
- node.js >= 0.10

## Getting started

In order to get started with the Contentful JS SDK you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

## Installation

In node, using [npm](http://npmjs.org):

``` sh
npm install contentful
```

Or, if you'd like to use a standalone built file you can use the following script tag or just download it from [npmcdn](https://npmcdn.com), under the `browser-dist` directory:

``` html
<script src="https://npmcdn.com/contentful@latest/browser-dist/contentful.min.js"></script>
```

Using `contentful@latest` will always get you the latest version, but you can also specify a specific version number:

``` html
<script src="https://npmcdn.com/contentful@3.0.0/browser-dist/contentful.min.js"></script>
```

## Authentication

To get content from Contentful, an app should authenticate with an with an OAuth bearer token.

You can create API keys using [Contentful's web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the Contentful's REST API reference on [Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## Documentation/References

The first thing you want to look at is the [`contentful`](./contentful.html) namespace.

Here's a quick description of the other namespaces:
* [`ContentfulAPIClient`](./ContentfulAPIClient.html) - The main client object, which provides the methods to get entities out of Contentful such as Entries, Assets and Content Types.
* [`Entities`](./Entities.html) - Defines properties and methods for each of the different entities you'll find in Contentful.
* [`EntryFields`](./EntryFields.html) - Defines the different kinds of fields you will find in Entries.
* [`Sync`](./Sync.html) - Defines the types used when working with the [Synchronization](https://www.contentful.com/developers/docs/concepts/sync/) endpoint

Additional resources:
* Check the [Contentful for JavaScript](https://www.contentful.com/developers/docs/javascript/) page for Tutorials, Demo Apps, and more information on other ways of using JavaScript with Contentful
* [Contentful's CDA REST API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/) for additional details on the Delivery API


## Versioning

This project strictly follows [Semantic Versioning](http://semver.org/) by use of [semantic-release](https://github.com/semantic-release/semantic-release).

This means that new versions are released automatically as fixes, features or breaking changes are released.

You can check the changelog on the [releases](https://github.com/contentful/contentful.js/releases) page.

## Support

Please open an [issue](https://github.com/contentful/contentful.js/issues/new)

## Contributing

See [CONTRIBUTING.md](https://github.com/contentful/contentful.js/blob/master/CONTRIBUTING.md)

## License

MIT
