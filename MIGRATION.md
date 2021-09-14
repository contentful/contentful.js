# Migration information

- [Migration information](#migration-information)
  - [Migration from contentful.js 7.x](#migration-from-contentfuljs-7x)
  - [Migration from contentful.js 5.x](#migration-from-contentfuljs-5x)
  - [Migration from contentful.js 4.x](#migration-from-contentfuljs-4x)
  - [Migration from contentful.js 3.x](#migration-from-contentfuljs-3x)
  - [Migration to contentful.js 3.x from previous versions](#migration-to-contentfuljs-3x-from-previous-versions)
    - [Method renaming](#method-renaming)
    - [Format of collection replies](#format-of-collection-replies)
    - [Callback API removal](#callback-api-removal)
    - [Class removal](#class-removal)
    - [Link resolution](#link-resolution)
  - [Migration from contentful.js 2.x and older](#migration-from-contentfuljs-2x-and-older)

From version 3.0.0 onwards, you can access documentation for a specific version by visiting `https://contentful.github.io/contentful.js/contentful/<VERSION>`
You can upgrade to a major version using `npm update contentful`

## Migration from contentful.js 9.x

We introduced a new error handler that throws a better formed error with details from the server and obscured tokens.
We also no longer send the axios error object as is for errors without data or response objects.

```
{
  "status": 404,
  "statusText": "Not Found",
  "message": "datamessage",
  "details": "errordetails",
  "request": {
    "url": "requesturl",
    "headers": {
      "Authorization": "Bearer ...token"
    }
  },
  "requestId": "requestid"
}
```

## Migration from contentful.js 8.x

We refactored the code, replacing promises with async/await.

Some functions that used to throw synchronously for things like bad parameters now reject the promise.
In many cases users may not have to do anything assuming the calls already happened within a promise chain, but in rare cases this may need some refactoring of error handling cases.

## Migration from contentful.js 7.x

We dropped support for Node v11 and older. Please ensure you are running Node v12 or newer.
We also made browser support track https://github.com/contentful/browserslist-config
Currently that means:

- Chrome >= 75
- Edge >= 17
- Firefox >= 70
- Safari >= 12

For all other browsers you will have to use the legacy bundle and possibly set up [Regenerator Runtime](https://www.npmjs.com/package/regenerator-runtime) for the browser, for example using:

```
<script src="https://cdn.jsdelivr.net/npm/regenerator-runtime@latest/runtime.min.js"></script>
```

## Migration from contentful.js 5.x

We dropped support for Node v4 and older. Please ensure you are running Node v5 or newer.

## Migration from contentful.js 4.x

The bundle for browsers is now called `contentful.browser.min.js` to mark it clearly as browser only bundle. If you need to support IE 11 or other old browsers, you may use the `contentful.legacy.min.js`. Node will automatically use the `contentful.node.min.js` while bundlers like Webpack will resolve to the new ES-modules version of the library.

No changes to the API of the library were made.

## Migration from contentful.js 3.x

From version 4.0.0 and up contentful.js is exported as a single `umd` bundle the cdn distribution has changed, there is no more `browser-dist`. the new link format is https://unpkg.com/contentful@version/dist/contentful.min.js instead of https://unpkg.com/contentful@version/browser-dist/contentful.min.js. to access version 3 you can still use https://unpkg.com/contentful@3.0.0/browser-dist/contentful.min.js

## Migration to contentful.js 3.x from previous versions

**(March 8th, 2016)**

contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

The two major changes you should look out for are the method renamings, and the way link resolution works.

This file lists the changes to the API and behavior, and how you should proceed to update your code.

For more specific details consult the [reference documentation](https://contentful.github.io/contentful.js/) for the current version.

Future releases will have any changes listed in the changelog on the [releases page](https://github.com/contentful/contentful.js/releases).

### Method renaming

Before contentful.js 3.x, the main methods were named such as `entry()` or `entries()`. Now they have changed to `getEntry()` or `getEntries()`.

This helps bring the API of this SDK more in line with that of [contentful-management.js](https://github.com/contentful/contentful-management.js).

For contentful.js, all of these methods were renamed, apart from `sync()`. The complete list is on the following table:

| Old name         | New name            |
| ---------------- | ------------------- |
| `space()`        | `getSpace()`        |
| `entry()`        | `getEntry()`        |
| `entries()`      | `getEntries()`      |
| `contentType()`  | `getContentType()`  |
| `contentTypes()` | `getContentTypes()` |
| `asset()`        | `getAsset()`        |
| `assets()`       | `getAssets()`       |
| `sync()`         | `sync()`            |

### Format of collection replies

Before contentful.js 3.x, collection replies were essentially JavaScript Arrays with some additional properties (`total`, `skip` and `limit`) added to their prototypes.

Now, collection replies are Objects, with those same properties, and an additional `items` property containing an array with all the items returned. This is more similar to what is actually returned from the REST API.

### Callback API removal

While not documented, older version of this SDK supported a callback API such as `entry('id', function(data){})`.

This has now been removed.

### Class removal

Before contentful.js 3.x, the entities returned from the API such as Entries or Content Types were wrapped in prototype based classes.

From contentful.js 3.x this is not the case anymore.

The objects returned by the promises are now [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) JavaScript Objects, which contain the relevant data and some helper methods (more to come in the future).

You can get a plain version of this object with only the data by using the `toPlainObject()` method.

Also note that Date fields such as `sys.createdAt` are not turned into JavaScript `Date` objects anymore, and are now plain ISO-8601 strings.

### Link resolution

In previous versions of contentful.js, [Links](https://www.contentful.com/developers/docs/concepts/links/) to other entries and assets were resolved by replacing the link objects with references to the objects containing the Entry or Asset.

This caused problems with serialization when circular links were present, which meant that if you used `JSON.stringify` you would get an exception, and you'd be required to use something like [json-stringify-safe](https://github.com/isaacs/json-stringify-safe) and have some additional work around the circular links.

From contentful.js 3.x onwards, links are now resolved by [getter methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), and their results memoized. This means that you can use them the same way as before, but you won't get problems with resolution of circular links when serializing them.

However, you can still turn off link resolution if you so wish.

## Migration from contentful.js 2.x and older

contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.
