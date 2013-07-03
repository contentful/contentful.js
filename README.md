# contentful.js

Javascript client for [Contentful's](https://www.contentful.com) Content Delivery API:

- [Documentation](https://www.contentful.com/developers/documentation/content-delivery-api)
- Examples
  - [browser](http://contentful.github.io/contentful.js/example/browser/): Simple data browser (Angular app)
  - [ufos](http://contentful.github.io/contentful.js/example/ufos/):  Map of UFO sightings (Angular app)

## Install

In node, using [npm](http://npmjs.org):

``` sh
npm install contentful
```

In a browser, using [bower](http://bower.io):

``` sh
bower install contentful
# After installing, add this as a script tag:
# <script src="components/contentful/dist/contentful.min.js"></script>
```

Note: The next minor version release of `dist/contentful.min.js` will
be much smaller. Please use bower to keep your JS dependencies up to
date and get the newest version right when it's ready!

## Usage

``` js
// Don't require if you've already included contentful as a script tag
var contentful = require('contentful');

var client = contentful.createClient({
  // ID of Space
  space: 'cfexampleapi',

  // A valid access token within the Space
  accessToken: 'b4c0n73n7fu1',

  // Enable or disable SSL. Enabled by default.
  secure: true
});

var log = console.log.bind(console); // wat

// Get Space
client.space().then(log, log);

// Get all Entries
client.entries().then(log, log);
```

For now, please check out the
[Content Delivery API documentation](https://www.contentful.com/developers/documentation/content-delivery-api)
to learn how the API and the JavaScript client work.

## License

MIT
