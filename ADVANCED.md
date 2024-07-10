<!-- shared header  START -->

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">Advanced Concepts & Tips</h3>

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

> Find helpful concepts and tips about how to use this library.

- [Using ES6 import](#using-es6-import)
- [Framework specifics](#framework-specifics)
- [Link resolution](#link-resolution)
  - [Note: link resolution for versions older than 10.0.0](#note:-link-resolution-for-versions-older-than-10.0.0)
  - [Note: link resolution for versions older than 7.0.0](#note:-link-resolution-for-versions-older-than-7.0.0)
- [Sync](#sync)
  - [Sync without pagination](#sync-without-pagination)
- [Querying & Search parameters](#querying--search-parameters)

## Using ES6 import

You can use the es6 import with the SDK as follows:

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

### React Native & Server Side Rendering

This library is able to handle Server Side Rendering and React Native. Depending on your implementation, you may need to explicitly require the `browser` or `node` variant of the library. (webpack usually is able to handle this on its own).

```js
const contentful = require('contentful')
// will become the following to enforce the browser version
const contentful = require('contentful/dist/contentful.browser.min.js')
```

### Angular Universal

This library is able to handle Server Side Rendering with Angular Universal. To use it, you will have to provide a custom [Axios adapter](https://github.com/axios/axios/tree/main/lib/adapters), one example for Angular would be the [ngx-axios-adapter](https://github.com/patrickhousley/ngx-axios-adapter).

## Link resolution

In Contentful, you can create content that references other content. We call them "linked" or "referenced" entries. In contrast to a simple REST call, this library can render the content of a linked entry in place, using the [contentful-resolve-response](https://github.com/contentful/contentful-resolve-response) package. This enables what we call link resolution.

**Example entry response without link resolution:**

```
{
  "sys": { ... },
  "metadata": { ... },
  "fields": {
    "referencedEntry": {
      "type": "Link",
      "linkType": "Entry",
      "id": "<referenced-entry-id>"
    }
  }
}
```

**Example entry response with link resolution:**

```
{
  "sys": { ... },
  "metadata": { ... },
  "fields": {
    "referencedEntry": {
      "sys": { ... },
      "metadata": { ... },
      "fields": {
        ...
      }
    }
  }
}
```

This makes parsing the response easier, and you don't need to manually extract every linked entry from the response object.

The link resolution is applied to one level deep by default. If you need it to be applied deeper, you may specify the `include` parameter when fetching your entries as follows `client.getEntries( { include: <value> })`. The `include` parameter can be set to a number up to 10, which would represent a ten layers deep link resolution.

**We resolve links by default**. If this behaviour is not what you want, you can use the chain modifier `withoutLinkResolution` on the Contentful client to keep the link objects instead of the inlined entries in your response object. See [client chain modifiers](README.md#client-chain-modifiers).

**Links which could not get resolved will be kept by default** as `UnresolvedLink`. If you want to completely remove fields which could not be resolved, you can use the chain modifier `withoutUnresolvableLinks`.

Please see the notes below for link resolution prior to v.10.0.0 and v.7.0.0.

#### Note: link resolution for versions older than 10.0.0

Please note that for versions older than 10.0.0, disabling link resolution needs to be done via [configuration options](README.md#response-configuration-options) during client creation.
To disable it, set `resolveLinks` to `false` when creating the Contentful client. Like so:

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
  resolveLinks: false,
})
```

If you want to completely remove fields which could not be resolved, set `removeUnresolved` to `true` in the configuration options.

#### Note: link resolution for versions older than 7.0.0

Please note that for versions older than 7.0.0, link resolution is only possible when requesting records from the collection endpoint using `client.getEntries()` or by performing an initial sync `client.sync({ initial: true })`. In case you want to request one entry and benefit from the link resolution you can use the collection end point with the following query parameter `'sys.id': '<your-entry-id>'`.

##### Example

Assuming that you have a Content Type `post` that has a reference field `author`:

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
})
// getting a specific Post
client
  .getEntries({ 'sys.id': '<entry-id>' })
  .then((response) => {
    // output the author name
    console.log(response.items[0].fields.author.fields.name)
  })
  .catch((err) => console.log(err))
```

### Links to other spaces

As they are part of another space, resolving cross-space linked entities requires a special header to be passed named `x-contentful-resource-resolution`.

To be able to create this header, you need to follow the instructions in this [subsection of our documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/resource-links:~:text=Extra%20header%20for%20cross%2Dspace%20resolution)

Once you created the Base64 encoded token, you can pass the new header to your client as part of the `headers` option.

When calling the `getEntries` method, The resolved cross space links will be available under the `Entry` array in the `includes` part of the response.

#### Example

```ts
import { createClient } from 'contentful'
const client = createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
  environment: '<your-environment-id>',
  headers: {
    'x-contentful-resource-resolution': '<your-base64-generated-header>'
  }
})
// getting all Entries
client
  .getEntries()
  .then((response) => {
    // You should find the linked entries in the includes.Entry array
    console.log(response.includes.Entry)
  })
  .catch((err) => console.log(err))

// filtering on one entry
client
  .getEntries({ 'sys.id': '<entry-id>' })
  .then((response) => {
    // You should find the linked entries in the includes.Entry array
    console.log(response.includes.Entry)
  })
  .catch((err) => console.log(err))
```

## Sync

The Sync API allows you to keep a local copy of all content in a space up-to-date via delta updates, meaning only changes that occurred since the last sync call.
Whenever you perform a sync operation the endpoint will send back a `syncToken` which you can use in a subsequent sync to only retrieve data which changed since the last call.

##### Example

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
})
// first time you are syncing make sure to specify `initial: true`
client
  .sync({ initial: true })
  .then((response) => {
    // You should save the `nextSyncToken` to use in the following sync
    console.log(response.nextSyncToken)
  })
  .catch((err) => console.log(err))
```

The SDK will go through all the pages for you and give you back a response object with the full data so you don't need to handle pagination.

### Sync without pagination

You may use syncing without pagination if you want to handle it on your own. To do this, you have to pass `paginate: false` as an option when calling sync. You manually have to take care to pass `nextPageToken` or `nextSyncToken` to your subsequent calls. The logic follows our [sync API docs](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/synchronization/pagination-and-subsequent-syncs) while you pass tokens instead of full urls.

##### Example

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
})

function customPaginatedSync(query) {
  // Call sync, make sure you set paginate to false for every call
  return client.sync(query, { paginate: false }).then((response) => {
    // Do something with the respond. For example save result to disk.
    console.log('Result of current sync page:', response.items)

    // Sync finished when `nextSyncToken` is available
    if (response.nextSyncToken) {
      console.log('Syncing done. Start a new sync via ' + response.nextSyncToken)
      return
    }

    // Otherwise, just continue to next page of the current sync run
    return customPaginatedSync({ nextPageToken: response.nextPageToken })
  })
}

customPaginatedSync({ initial: true }).then(() => console.log('Sync done'))
```

## Querying & Search parameters

You can pass your query parameters as `key: value` pairs in the query object whenever you request a resource. For example:

```js
const contentful = require('contentful')
const client = contentful.createClient({
  accessToken: '<you-access-token>',
  space: '<your-space-id>',
})

// getting a specific Post
client
  .getEntries({ 'sys.id': '<entry-id>' })
  .then((response) => {
    // output the author name
    console.log(response.items[0].fields.author.fields.name)
  })
  .catch((err) => console.log(err))

// You can pass a query when requesting a single entity
client.getEntry('<entry-id>', { key: value })
```

For more information about the search parameters, check the [documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters).
