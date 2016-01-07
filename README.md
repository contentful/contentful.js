# contentful.js

Javascript client for [Contentful's](https://www.contentful.com) Content Delivery API:

- [Documentation](#api)
- [Example Apps](http://contentful.github.io/contentful.js/example/)
- [Tests](https://github.com/contentful/contentful.js/tree/master/test/integration) running in node and browsers via [BrowserStack](http://browserstack.com)

Supported browsers/environments:

- Chrome
- Firefox
- IE10
- node.js >= 0.8

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

Latest [contentful.min.js](https://raw.github.com/contentful/contentful.js/master/dist/contentful.min.js).

Note: The next minor version release of `dist/contentful.min.js` will
be much smaller. Please use a package manager to keep your JS
dependencies up to date and get the newest version right when it's
ready!

## Promises

contentful.js uses [axios](https://github.com/mzabriskie/axios) under the hood, which depends on a native ES6 Promise implementation to be supported. If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise#auto-polyfill) it.

## API

### createClient(opts) -> Client

``` js
// Don't require if you've already included contentful as a script tag
var contentful = require('contentful');

var client = contentful.createClient({
  // ID of Space
  space: 'cfexampleapi',

  // A valid access token within the Space
  accessToken: 'b4c0n73n7fu1',

  // Enable or disable SSL. Enabled by default.
  secure: true,

  // Set an alternate hostname, default shown.
  host: 'cdn.contentful.com',

  // Resolve links to entries and assets
  resolveLinks: true,

  // Optional HTTP agent for Node's http module
  agent: agentInstance

});
```

If you'd like to use contentful.js with an http proxy, look into [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent). If you pass down an agent through the relevant initialization option it gets passed down to axios and subsequently to Node's http module.

### Client#space() -> SpacePromise

```js
client.space()
.then(function (space) {
  console.log(space.name)
})
```

Returns a promise for a Space object:

```js
{
  "sys": {
    "type": "Space",
      "id": "cfexampleapi"
  },
    "name": "Contentful Example API",
    "locales": [
    {"code": "en-US", "name": "English"},
    {"code": "tlh", "name": "Klingon"}
  ]
}
```

### Client#entry(id) -> EntryPromise

Get an entry by it's `sys.id`. Note that this example uses an entry created
with a human-readable ID via the [Content Management API][cma-entry-put].
Entries created in the [Contentful app][cf-app] will have auto-generated ID's.

Links to other entries are not resolved when using this call. If you'd like to have your links resolved automatically, you should use the `entries()` call with [search parameters](#search-examples)

```js
client.entry('nyancat')
.then(function (entry) {
  console.log(entry.id)
})
```

Returns a promise for an Entry object:

```js
{
  "sys": {
    "type": "Entry",
    "id": "cat",
    "space": {"sys": {"type": "Link", "linkType": "Space", "id": "example"}},
    "contentType": {"sys": {"type": "Link", "linkType": "ContentType", "id": "cat"}},
    "createdAt": "2013-03-26T00:13:37.123Z",
    "updatedAt": "2013-03-26T00:13:37.123Z",
    "revision": 1
  },
  "fields": {
    "name": "Nyan cat",
    "color": "Rainbow",
    "nyan": true,
    "birthday": "2011-04-02T00:00:00.000Z",
    "diary": "Nyan cat has an epic rainbow trail.",
    "likes": ["rainbows", "fish"],
    "bestFriend": {"type": "Link", "linkType": "Entry", "id": "happycat"}
  }
}
```

### Client#entries(query) -> EntryCollectionPromise

Search & filter all of the entries in a space. The `query` parameter will be
added to the request querystring key-value pairs.

```js
client.entries({ content_type: 'cat' })
.then(function (entries) {
  console.log('Total entries:', entries.total)
  entries.forEach(function (entry) {
    console.log(entry.id)
  })
})
```

Returns a promise for a [collection][] of Entry objects, which is an array with 3 special properties:

```js
[
  "total": 2,
  "skip": 0,
  "limit": 100,
  /* Each item in the array is a full Entry object as shown above */
]
```

#### Search Examples

These examples show some of the searching you can do by passing query params
to [`Client#entries`][client-entries]. Each
query parameter name must be a dot-separated property path followed by an
optional operator in square brackets. For example: `fields.name[ne]` means
"entries where `fields.name` is not-equal to ...". Full documentation of the
allowed query parameters & field operators can be found in
[our API Documentation][search-parameters].

*Be aware that these search parameters are only applicable to `entries()` and not `entry()`

Search entries that have been updated since the 1st of January, 2013:

```js
client.entries({ 'sys.updatedAt[gte]': '2013-01-01T00:00:00Z' })
.then(function (entries) {
  // ...
})
```

Retrieve a specific set of entries by their multiple `sys.id` using the inclusion operator:

```js
client.entries({ 'sys.id[in]': 'finn,jake' ] })
.then(function (entries) {
  // ...
})
```

Search for `cat` entries that have less than three lives left:

```js
client.entries({
  'content_type': 'cat',
  'fields.lives[lt]': 3
})
.then(function (entries) {
  // ...
})
```

> Specifying the `content_type` query parameter is _required_ when querying on
> fields (such as `fields.lives` above). Note that `'cat'` is the content type
> **ID** and not it's name.

Full-text search for entries with "bacon" anywhere in their textual content:

```js
client.entries({ query: 'bacon' })
.then(function (entries) {
  // ...
})
```

Full-text search for dogs with "bacon" specifically in the `description` field:

```js
client.entries({
  'content_type': 'dog',
  'fields.description[match]': 'bacon'
})
.then(function (entries) {
  // ...
})
```

Get the 50 most recently created entries, and the next 50:

```js
client.entries({
  order: '-sys.createdAt',
  limit: 50
})
.then(function (entries) {
  // ...
})

client.entries({
  order: '-sys.createdAt',
  skip: 50,
  limit: 50
})
.then(function (entries) {
  // ...
})
```

Getting localized entries:

```js
client.entries({
  locale: 'es-ES'
})
.then(function (entries) {
  // ...
})
```

See also: [Collections and pagination][collection].

### Client#asset(id) -> Asset

Get an asset by it's `sys.id`. Note that this example uses an entry created
with a human-readable ID via the [Content Management API][cma-asset-put].
Assets created in the [Contentful app][cf-app] will have auto-generated ID's.

```js
client.asset('nyancat')
.then(function (asset) {
  console.log(asset.fields.file.url)
})
```

Returns a promise for an Asset object:

```js
{
  "sys": {
    "type": "Asset",
      "id": "nyancat",
      "space": {"sys": {"type": "Link", "linkType": "Space", "id": "example"}},
      "createdAt": "2013-03-26T00:13:37.123Z",
      "updatedAt": "2013-03-26T00:13:37.123Z",
      "revision": 1
  },
    "fields": {
      "title": "Nyan cat",
      "description": "A typical picture of Nyancat including the famous rainbow trail.",
      "file": {
        "fileName": "nyancat.png",
        "contentType": "image/png",
        "details": {
          "image": {
            "width": 250,
            "height": 250
          },
          "size": 12273
        },
        "url": "//images.contentful.com/cfexampleapi/4gp6taAwW4CmSgumq2ekUm/9da0cd1936871b8d72343e895a00d611/Nyan_cat_250px_frame.png"
      }
    }
}
```

### Client#assets(query) -> AssetCollectionPromise

Search & filter all of the assets in a space. The keys-value pairs from `query`
will be added to the request query string like [`Client#entries(query)`][client-entries].
See the [`Client#entries(query)` search examples](#search-examples) for more details.

```js
client.assets({ query: 'kitten' })
.then(function (assets) {
  assets.forEach(function (asset) {
    console.log(asset.fields.file.url)
  })
})
```

Returns a promise for a [collection][] of Asset objects, which is an array with 3 special properties:

```js
[
  "total": 2,
  "skip": 0,
  "limit": 100,
  /* Each item in the array is a full Asset object as shown above */
]
```

### Client#contentType(id) -> ContentTypePromise

Get a content type by it's `sys.id`. Note that this example uses a content type
created with a human-readable ID via the [Content Management API][cma-ct-put].
Content types created in the [Contentful app][cf-app] will have auto-generated
ID's.

```js
client.contentType('cat')
.then(function (contentType) {
  console.log(contentType.name)
})
```

Returns a promise for a ContentType object:

```js
{
  "sys": {
    "type": "ContentType",
      "id": "cat"
  },
  "name": "Cat",
  "description": "Meow.",
  "fields": [
    {"id": "name", "name": "Name", "type": "Text"},
    {"id": "diary", "name": "Diary", "type": "Text"},
    {"id": "likes", "name": "Likes", "type": "Array", "items": {"type": "Symbol"}},
    {"id": "bestFriend", "name": "Best Friend", "type": "Link"},
    {"id": "lifes", "name": "Lifes left", "type": "Integer"}
  ]
}
```

### Client#contentTypes() -> ContentTypeCollectionPromise

```js
client.contentTypes()
.then(function (contentTypes) {
  contentTypes.forEach(function (contentType) {
    console.log(contentType.name)
  })
})
```

Returns a promise for a [collection][] of ContentType objects, which is an array with 3 special properties:

```js
{
  "total": 3,
  "skip": 0,
  "limit": 100,
  /* Each item in the array is a full ContentType object as shown above */
}
```

### Client#sync(opts) -> SyncResponse

Our [Sync API][sync-api] allows to keep a local copy of the data in your space
up to date by receiving delta updates.

There are two supported options, pass `{ initial: true }` to start a brand new
copy, or `{ nextSyncToken: syncToken }` resume syncing using a token returned in a
previous call to `sync`.

Here is an example of syncing some local store:

```js
// Assuming you have some wrapper around browser storage
var syncToken = storage.get('syncToken')
var entries = storage.get('entries')

client.sync(token ? {nextSyncToken: syncToken} : {initial: true})
.then(function(response){
  response.items.forEach(function (entity) {
    if(entity.sys.type === 'Entry'){
      entries[entity.sys.id] = entity
    }
    if(entity.sys.type === 'DeletedEntry'){
      delete entries[entity.sys.id]
    }
  })
  storage.set('entries', entries)
  storage.set('syncToken', data.nextSyncToken)
});
```

Each call to `sync` returns a SyncResponse object:

```
{
  "sys": {
    "type": "Array"
  },
  "total": 3,
  "skip": 0,
  "limit": 100,
  "items": [
    /* Each item in the array is either an Entry, Asset, DeletedEntry or DeletedAsset */
  ]
}
```

In addition the entries and assets, a sync response may contain deletion items:

```js
{
  "sys": {
    "type": "DeletedEntry",
    "id": "cat",
    "space": {"sys": {"type": "Link", "linkType": "Space", "id": "example"}},
    "contentType": {"sys": {"type": "Link", "linkType": "ContentType", "id": "cat"}},
    "createdAt": "2013-03-26T00:13:37.123Z",
    "updatedAt": "2013-03-26T00:13:37.123Z"
  },
}
```

```js
{
  "sys": {
    "type": "DeletedAsset",
    "id": "nyancat",
    "space": {"sys": {"type": "Link", "linkType": "Space", "id": "example"}},
    "createdAt": "2013-03-26T00:13:37.123Z",
    "updatedAt": "2013-03-26T00:13:37.123Z"
  },
}
```

### Collections and pagination

Many methods return collections of resources. These collections are represented
as a JSON object containing items and pagination details:

```
{
  "total": 1,    // Total number of items matching the query
  "skip": 0,     // Offset into the result set represented by this response
  "limit": 100,  // Effective limit on # of items returned in this response
  // Full representations of each item
}
```

The `entries` and `assets` methods both accept `limit`, `skip`, and `order` as
query parameters, allowing you to paginate through larger result sets. Note that
you should specify a stable `order` property (such as `order: 'sys.createdAt'`)
when paginating.

## License

MIT

[contentful]: http://www.contentful.com
[search-parameters]: http://docs.contentfulcda.apiary.io/#reference/search-parameters
[cma-entry-put]: http://docs.contentfulcma.apiary.io/#reference/entries/entry/create/update-an-entry
[cma-asset-put]: http://docs.contentfulcma.apiary.io/#reference/assets/asset/create/update-an-asset
[cma-ct-put]: http://docs.contentfulcma.apiary.io/#reference/content-types/content-type/create/update-a-content-type
[cf-app]: https://app.contentful.com
[sync-api]: http://docs.contentfulcda.apiary.io/#reference/synchronization

[collection]: #collections-and-pagination
[client-entries]: #cliententriesquery---entrycollectionpromise
