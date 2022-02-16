<!-- shared header  START --> 

<p align="center">
  <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/">
    <img alt="Contentful Logo" title="Contentful" src="images/contentful-icon.png" width="250">
  </a>
</p>
<h3 align="center">Typescript</h3>

<p align='center'>Contentful Delivery API</p>
<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
</p>
<p align="center">
  <a href="README.md">Readme</a> | 
  <a href="CONTRIBUTING.md">Contributing</a> | 
  <a href="SETUP.md">Setup</a> | 
  <a href="TYPESCRIPT.md">Typescript</a> | 
  <a href="ADVANCED.md">Advanced</a> | 
  <a href="SECURITY.md">Security</a>
</p>

<!-- shared header  END --> 

## Table of contents
- [Introduction](#introduction)
- [Query types](#query-types)
  - [Static query types](#static-query-keys)
  - [Dynamic query types](#dynamic-field-query-keys)
- [Response types](#response-types)
  - [withAllLocales](#withalllocales)
- [Generating type definitions](#generating-type-definitions-for-content-types)

## Introduction
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

Dynamic query keys are based on the given shape of the expected entries content type.
To calculate dynamic keys, we have to pass-in the shape of the fields:
```typescript
type ExampleEntryFields = {
  productName: Contentful.EntryFields.Text,
  image: Contentful.Asset,
  price: Contentful.EntryFields.Number,
  categories: Contentful.Entry<CategoryEntryFields>[],
}
```

This gives us the relevant information needed, to calculate the dynamic keys and their possible value types.
```
getEntries<ExampleEntryFields>({
    'fields.price[in]': [10, 20]
})
```

#### Limitation
Due to the limitation with recursive types, we can only calculate keys on the root level of your content type.
There is currently no way to calculate keys for nested (recursive) content types.

## Response types
With version `10.0.0` we introduce chained clients to make better assumptions on response types.

### withAllLocales
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

## Generating type definitions for content types
It is recommended to define field types for all your content types. This helps the type system to infer all possible query keys/value types for you.
There are several OSS projects out there to generate type definitions for content types:

- [cf-content-types-generator](https://github.com/contentful-userland/cf-content-types-generator)
- [contentful-typescript-codegen](https://github.com/intercom/contentful-typescript-codegen)
- [contentful-ts-type-generator](https://github.com/arimkevi/contentful-ts-type-generator)
- [contentful-ts-generator](https://github.com/watermarkchurch/contentful-ts-generator)

