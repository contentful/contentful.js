contentful.js 3.x was a major rewrite, with some API changes. While the base functionality remains the same, some method names have changed, as well as some internal behaviors.

The two major changes you should look out for are the method renamings, and the way link resolution works.

This file lists the changes to the API and behavior, and how you should proceed to update your code.

For more specific details consult the [reference documentation](https://contentful.github.io/contentful.js/) for the current version.

Future releases will have any changes listed in the changelog on the [releases page](https://github.com/contentful/contentful.js/releases).

## Method renaming

Before contentful.js 3.x, the main methods were named such as `entry()` or `entries()`. Now they have changed to `getEntry()` or `getEntries()`.

This helps bring the API of this SDK more in line with that of [contentful-management.js](https://github.com/contentful/contentful-management.js).

For contentful.js, all of these methods were renamed, apart from `sync()`. The complete list is on the following table:

Old name | New name
---------|---------
`space()` | `getSpace()`
`entry()` | `getEntry()`
`entries()` | `getEntries()`
`contentType()` | `getContentType()`
`contentTypes()` | `getContentTypes()`
`asset()` | `getAsset()`
`assets()` | `getAssets()`
`sync()` | `sync()`

## Format of collection replies

Before contentful.js 3.x, collection replies were essentially JavaScript Arrays with some additional properties (`total`, `skip` and `limit`) added to their prototypes.

Now, collection replies are Objects, with those same properties, and an additional `items` property containing an array with all the items returned. This is more similar to what is actually returned from the REST API.

## Callback API removal

While not documented, older version of this SDK supported a callback API such as `entry('id', function(data){})`.

This has now been removed.

## Class removal

Before contentful.js 3.x, the entities returned from the API such as Entries or Content Types were wrapped in prototype based classes.

From contentful.js 3.x this is not the case anymore.

The objects returned by the promises are now [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) JavaScript Objects, which contain the relevant data and some helper methods (more to come in the future).

You can get a plain version of this object with only the data by using the `toPlainObject()` method.

Also note that Date fields such as `sys.createdAt` are not turned into JavaScript `Date` objects anymore, and are now plain ISO-8601 strings.

## Link resolution

In previous versions of contentful.js, [Links](https://www.contentful.com/developers/docs/concepts/links/) to other entries and assets were resolved by replacing the link objects with references to the objects containing the Entry or Asset.

This caused problems with serialization when circular links were present, which meant that if you used `JSON.stringify` you would get an exception, and you'd be required to use something like [json-stringify-safe](https://github.com/isaacs/json-stringify-safe) and have some additional work around the circular links.

From contentful.js 3.x onwards, links are now resolved by [getter methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), and their results memoized. This means that you can use them the same way as before, but you won't get problems with resolution of circular links when serializing them.

However, you can still turn off link resolution if you so wish.
