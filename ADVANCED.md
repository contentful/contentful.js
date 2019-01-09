# contentful.js - Advanced concepts & tips

> Find helpful concepts and tips about how to use this library.

- [Using ES6 import](#using-es6-import)
- [Framework specifics](#framework-specifics)
- [Link resolution](#link-resolution)
  - [Note: link resolution for versions older than 7.0.0](#note:-link-resolution-for-versions-older-than-7.0.0)
- [Sync](#sync)
  - [Sync without pagination](#sync-without-pagination)
- [Querying & Search parameters](#querying--search-parameters)

## Using ES6 import

You can use the es6 import with the SDK as follow

```js
import { createClient } from "contentful";
const client = createClient({...});
```

OR

```js
import * as contentful from "contentful";
const client = contentful.createClient({...});
```

## Framework specifics

### React Native & Server Side Rendering:

This library is able to handle Server Side Rendering and React Native. Depending on your implementation, you may need to explicitly require the `browser` or `node` variant of the library. (Webpack usually is able to handle this on its own)

```js
const contentful = require("contentful");
// will become the following to enforce the browser version
const contentful = require("contentful/dist/contentful.browser.min.js");
```

### Angular universal:

This library is able to handle Server Side Rendering with angular universal. To use it you will have to provide a custom [axios adapter](https://github.com/axios/axios/tree/master/lib/adapters), one example for angular would be the [ngx-axios-adapter](https://github.com/patrickhousley/ngx-axios-adapter)

## Link resolution

contentful.js does resolve links by default unless specified otherwise.
To disable it just set `resolveLinks` to `false` when creating the Contentful client. Like so

```js
const contentful = require("contentful");
const client = contentful.createClient({
  accessToken: "<you-access-token>",
  space: "<your-space-id>",
  resolveLinks: false
});
```

Link resolution occurs on the `getEntry` and `getEntries` endpoints as of version 7.0.0. For previous versions, only the collections endpoint resolved links. See [note](#note:-link-resolution-for-versions-older-than-7.0.0) below for more details.

The link resolution is applied to one level deep by default. If you need it to be applied deeper, you may specify the `include` parameter when fetching your entries as follows `client.getEntries({include: <value>})`. The `include` parameter can be set to a number up to 10.

By default, the SDK will keep links, which could not get resolved, in your response. If you want to completely remove fields which could not be resolved, set `removeUnresolved: true` in the configuration options.

### Note: link resolution for versions older than 7.0.0

Please note that for versions older than 7.0.0, link resolution is only possible when requesting records from the collection endpoint using `client.getEntries()` or by performing an initial sync `client.sync({initial: true})`. In case you want to request one entry and benefit from the link resolution you can use the collection end point with the following query parameter `'sys.id': '<your-entry-id>'`.

**e.g.** assuming that you have a Content Type `post` that has a reference field `author`

```js
const contentful = require("contentful");
const client = contentful.createClient({
  accessToken: "<you-access-token>",
  space: "<your-space-id>"
});
// getting a specific Post
client
  .getEntries({ "sys.id": "<entry-id>" })
  .then(response => {
    // output the author name
    console.log(response.items[0].fields.author.fields.name);
  })
  .catch(err => console.log(err));
```


## Sync

The Sync API allows you to keep a local copy of all content in a space up-to-date via delta updates, meaning only changes that occurred since last sync call.
Whenever you perform a sync operation the endpoint will send back a `syncToken` which you can use in a subsequent sync to only retrieve data which changed since the last call.
**e.g.**

```js
const contentful = require("contentful");
const client = contentful.createClient({
  accessToken: "<you-access-token>",
  space: "<your-space-id>"
});
// first time you are syncing make sure to specify `initial: true`
client
  .sync({ initial: true })
  .then(response => {
    // You should save the `nextSyncToken` to use in the following sync
    console.log(response.nextSyncToken);
  })
  .catch(err => console.log(err));
```

The SDK will go through all the pages for you and gives you back a response object with the full data so you don't need to handle pagination.

### Sync without pagination

You may use syncing without pagination if you want to handle it on your own. To do this, you have to pass `paginate: false` as option when calling sync. You manually have to take care to pass `nextPageToken` or `nextSyncToken` to your subsequent calls. The logic follows our [sync API docs](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/synchronization/pagination-and-subsequent-syncs) while you pass tokens instead of full urls.

```js
const contentful = require("contentful");
const client = contentful.createClient({
  accessToken: "<you-access-token>",
  space: "<your-space-id>"
});

function customPaginatedSync(query) {
  // Call sync, make sure you set paginate to false for every call
  return client.sync(query, { paginate: false }).then(response => {
    // Do something with the respond. For example save result to disk.
    console.log("Result of current sync page:", response.items);

    // Sync finished when `nextSyncToken` is available
    if (response.nextSyncToken) {
      console.log(
        "Syncing done. Start a new sync via " + response.nextSyncToken
      );
      return;
    }

    // Otherwise, just continue to next page of the current sync run
    return customPaginatedSync({ nextPageToken: response.nextPageToken });
  });
}

customPaginatedSync({ initial: true }).then(() => console.log("Sync done"));
```

## Querying & Search parameters

You can pass your query parameters as `key: value` pairs in the query object whenever request a resource.
**e.g.**

```js
const contentful = require("contentful");
const client = contentful.createClient({
  accessToken: "<you-access-token>",
  space: "<your-space-id>"
});

// getting a specific Post
client
  .getEntries({ "sys.id": "<entry-id>" })
  .then(response => {
    // output the author name
    console.log(response.items[0].fields.author.fields.name);
  })
  .catch(err => console.log(err));

// You can pass a query when requesting a single entity
client.getEntry("<entry-id>", { key: value });
```

for more information about the search parameters check the [documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters)
