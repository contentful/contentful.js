<!-- shared header  START --> 

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="150">
  </a>
</p>

<h1 align='center'>Content Delivery API</h1>

<h3 align="center">TypeScript</h3>

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


## Table of contents
- [Introduction](#introduction)
- [Query types](#query-types)
    - [Static query types](#static-query-keys)
    - [Dynamic query types](#dynamic-field-query-keys)
- [Response types](#response-types)
    - [withAllLocales](#withalllocales)
    - [withoutLinkResolution](#withoutlinkresolution)
    - [withoutUnresolvableLinks](#withoutunresolvablelinks)
- [Generating type definitions](#generating-type-definitions-for-content-types)

## Introduction
<a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="MIT License" />
  </a><a href="https://travis-ci.org/contentful/contentful.js">
    <img src="https://travis-ci.org/contentful/contentful.js.svg?branch=master" alt="Build Status">
  </a>
 <a href="https://www.npmjs.com/package/contentful">
    <img src="https://img.shields.io/npm/v/contentful.svg" alt="NPM">
  </a>
   <a href="https://www.jsdelivr.com/package/npm/contentful">
    <img src="https://data.jsdelivr.com/v1/package/npm/contentful/badge" alt="jsDelivr Hits">
  </a>
<a href="https://npm-stat.com/charts.html?package=contentful">
    <img src="https://img.shields.io/npm/dm/contentful.svg" alt="NPM downloads">
  </a>
<a href="https://unpkg.com/contentful/dist/contentful.browser.min.js">
    <img src="https://img.badgesize.io/https://unpkg.com/contentful/dist/contentful.browser.min.js?compression=gzip" alt="GZIP bundle size">
  </a>

With version `10.0.0` we have completely rewritten the client to give the user more support on types.



## Query types
When querying for entries and assets, you get full type support for keys and values.
This applies to:
- `getEntry`
- `getEntries`
- `getAsset`
- `getAssets`

We have 2 levels of support:

### Static query keys
![](images/static-query-keys.png)

```
getEntries({
    'skip': 10,
    'limit': 20,
    'include': 5
})
```

### Dynamic (field) query keys
![](images/dynamic-query-keys.png)

Dynamic query keys are based on the given shape of the expected entries' content type.
To calculate dynamic keys, we have to define the shape of the fields of the entries' content type:
```typescript
type ExampleEntryFields = {
  productName: Contentful.EntryFields.Text,
  image: Contentful.Asset,
  price: Contentful.EntryFields.Number,
  categories: Contentful.Entry<CategoryEntryFields>[],
}
```

We can then pass this shape to our `getEntries` call. This gives us the relevant information needed to calculate the dynamic keys and their possible value types.
```typescript
getEntries<ExampleEntryFields>({
    'fields.price[in]': [10, 20]
})
```

#### Limitation
Due to the limitation with recursive types, we can only calculate keys on the root level of your content type.
There is currently no way to calculate keys for nested (recursive) content types.

## Response types
With version `10.0.0` we introduce [chained clients](./README.md#chained-clients) to make better assumptions on response types. 


### `withAllLocales`
If the current chain includes `withAllLocales`, `getEntry` and `getEntries` expect an optional second generic parameter for all existing locales in your space.
If the `Locale` type is provided, your response type will define all locale keys for your field values:

```typescript
import * as contentful from "contentful";

const client = contentful.createClient({
  space: "<space-id>",
  accessToken: "<content-delivery-token>",
});

const Fields = { productName: Contentful.EntryFields.Text }
const Locales = 'en-US' | 'de-DE';
const entry = client.withAllLocales.getEntry<Fields, Locales>() 
```

The return type of `getEntry` is matching the shape
```json
{
  "fields": {
    "productName": {
      "de-DE": "<field-value>",
      "en-US": "<field-value>"
    }
  }
}
```

### `withoutLinkResolution`
If the current chain includes `withoutLinkResolution`, the returned type doesn't define linked entities as Link objects.

```typescript
import * as contentful from "contentful";

const client = contentful.createClient({
  space: "<space-id>",
  accessToken: "<content-delivery-token>",
});

const Fields = { 
  relatedProduct: Contentful.EntryFields.Entry 
}
const Locales = 'en-US' | 'de-DE';
const entry = client.withoutLinkResolution.getEntry<Fields, Locales>() 
```

The return type of `getEntry` is matching the shape

```json
{
  "fields": {
    "productName": {
      "type": "Link",
      "linkType": "Entry",
      "id": "linkedProductId" 
    }
  }
}
```
### `withoutUnresolvableLinks`
If the current chain includes `withoutUnresolvableLinks`, the returned type doesn't include linked fields that are not resolvable, for example if the linked entity does not exist anymore or is not yet published.

```typescript
import * as contentful from "contentful";

const client = contentful.createClient({
  space: "<space-id>",
  accessToken: "<content-delivery-token>",
});

const Fields = { 
  relatedProduct: Contentful.EntryFields.Entry 
}
const Locales = 'en-US' | 'de-DE';
const entry = client.withoutUnresolvableLinks.getEntry<Fields, Locales>() 
```

The return type of `getEntry` is matching the shape

```json
{
  "fields": {}
}
```


## Generating type definitions for content types
It is recommended to define field types for all your content types. This helps the type system to infer all possible query keys/value types for you.
There are several OSS projects out there to generate type definitions for content types:

- [cf-content-types-generator](https://github.com/contentful-userland/cf-content-types-generator)
- [contentful-typescript-codegen](https://github.com/intercom/contentful-typescript-codegen)
- [contentful-ts-type-generator](https://github.com/arimkevi/contentful-ts-type-generator)
- [contentful-ts-generator](https://github.com/watermarkchurch/contentful-ts-generator)

