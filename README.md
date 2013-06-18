# contentful.js

## Install

``` sh
npm install contentful
```

## Usage

``` js
var contentful = require('contentful');

var client = contentful.createClient({
  // ID of Space
  space: '...',

  // A valid access token within the Space
  accessToken: '...',

  // Enable or disable SSL. Enabled by default.
  secure: true
});

// Get Space
client.space().then(console.log, console.log);

// Get all Entries
client.entries().then(console.log, console.log);
```

For now, please check out the
[Content Delivey API's documentation](https://www.contentful.com/developers/documentation/content-delivery-api)
to learn how the API and the JavaScript client work.
