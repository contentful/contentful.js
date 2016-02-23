# contentful.js

TODO: add badges

Javascript SDK for [Contentful's](https://www.contentful.com) Content Delivery API.

# About

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

# Getting started

In order to get started with the Contentful JS SDK you'll need not only to install it, but also to get credentials which will allow you to have access to your content in Contentful.

## Installation

In node, using [npm](http://npmjs.org):

``` sh
npm install contentful
```

TODO: add npmcdn instructions

## Authentication

To get content from Contentful, an app should authenticate with an with an OAuth bearer token.

You can create API keys using [Contentful's web interface](https://app.contentful.com). Go to the app, open the space that you want to access (top left corner lists all the spaces), and navigate to the APIs area. Open the API Keys section and create your first token. Done.

Don't forget to also get your Space ID.

For more information, check the Contentful's REST API reference on [Authentication](https://www.contentful.com/developers/docs/references/authentication/).

## Documentation/References

* [Contentful's JS SDK reference](https://contentful.github.io/contentful.js)
  * From version 3.0.0 onwards, you can access documentation for a specific version by visiting https://contentful.github.io/contentful.js/contentful/VERSION
  * For versions prior to 3.0.0, you can access documentation at https://github.com/contentful/contentful.js/tree/legacy
* Check the [Contentful for JavaScript](https://www.contentful.com/developers/docs/javascript/) page for Tutorials, Demo Apps, and more information on other ways of using JavaScript with Contentful
* [Contentful's CDA REST API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/) for additional details on the Delivery API

## Versioning

This project strictly follows [Semantic Versioning](http://semver.org/) by use of [semantic-release](https://github.com/semantic-release/semantic-release).

This means that new versions are released automatically as fixes, features or breaking changes are released.

You can check the changelog on the [releases](https://github.com/contentful/contentful.js/releases) page.

## Migration from contentful.js 2.x and older

contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

See the [migration guide](migration_from_2_x.md) for more information.

## Support

Please open an [issue](https://github.com/contentful/contentful.js/issues/new)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
