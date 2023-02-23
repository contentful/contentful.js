// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields, NewEntry } from '../../lib'
// @ts-ignore
import * as mocks from './mocks'

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry with generic fields
 */
expectAssignable<NewEntry<Record<string, any>>>({
  ...mocks.entryBasics,
  fields: {
    stringField: mocks.stringValue,
    anyRandomFieldName: mocks.numberValue,
  },
})

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry generic
 */
expectAssignable<NewEntry<{ stringField: EntryFields.Text }>>({
  ...mocks.entryBasics,
  fields: {
    stringField: mocks.stringValue,
  },
})

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry generic with a referenced fields wildcard
 */
expectAssignable<
  NewEntry<{
    stringField: EntryFields.Text
    referenceField: EntryFields.Link<Record<string, any>>
  }>
>({
  ...mocks.entryBasics,
  fields: {
    stringField: mocks.stringValue,
    referenceField: {
      ...mocks.entryBasics,
      fields: {},
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithoutLinkResolution linked entities are all rendered as links
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      entryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      multiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      assetReferenceField: EntryFields.AssetLink
      multiAssetReferenceField: EntryFields.AssetLink[]
    },
    'WITHOUT_LINK_RESOLUTION'
  >
>(
  mocks.getEntry({
    stringField: mocks.stringValue,
    entryReferenceField: mocks.entryLink,
    multiEntryReferenceField: [mocks.entryLink, mocks.entryLink],
    assetReferenceField: mocks.assetLink,
    multiAssetReferenceField: [mocks.assetLink, mocks.assetLink],
  })
)

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields> },
    'WITHOUT_LINK_RESOLUTION'
  >
>(mocks.getEntry({ referenceField: undefined }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.Link<mocks.SimpleEntryFields> }, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.getEntry({ referenceField: mocks.entry }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITHOUT_LINK_RESOLUTION'
  >
>(mocks.getEntry({ referenceField: [undefined] }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.Link<mocks.SimpleEntryFields>[] },
    'WITHOUT_LINK_RESOLUTION'
  >
>(mocks.getEntry({ referenceField: [mocks.entry] }))

expectNotAssignable<NewEntry<{ referenceField: EntryFields.AssetLink }, 'WITHOUT_LINK_RESOLUTION'>>(
  mocks.getEntry({ referenceField: undefined })
)

expectNotAssignable<NewEntry<{ referenceField: EntryFields.AssetLink }, 'WITHOUT_LINK_RESOLUTION'>>(
  mocks.getEntry({ referenceField: mocks.asset })
)

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.AssetLink[] }, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.getEntry({ referenceField: [undefined] }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.AssetLink[] }, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.getEntry({ referenceField: [mocks.asset] }))

/**
 * @namespace: Typescript - type test
 * @description: EntryWithLinkResolutionAndWithUnresolvableLinks referenced entities can be either resolved or unresolved.
 * unresolved entities are referenced as links. Fields with multiple references can have resolved and unresolved mixed.
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      resolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      unresolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      resolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      unresolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      mixedMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      resolvableAssetReferenceField: EntryFields.AssetLink
      unresolvableAssetReferenceField: EntryFields.AssetLink
      resolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      unresolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      mixedMultiAssetReferenceField: EntryFields.AssetLink[]
    },
    undefined
  >
>(
  mocks.getEntry({
    stringField: mocks.stringValue,
    resolvableEntryReferenceField: mocks.entry,
    unresolvableEntryReferenceField: mocks.entryLink,
    resolvableMultiEntryReferenceField: [mocks.entry],
    unresolvableMultiEntryReferenceField: [mocks.entryLink],
    mixedMultiEntryReferenceField: [mocks.entry, mocks.entryLink],
    resolvableAssetReferenceField: mocks.asset,
    unresolvableAssetReferenceField: mocks.assetLink,
    resolvableMultiAssetReferenceField: [mocks.asset],
    unresolvableMultiAssetReferenceField: [mocks.assetLink],
    mixedMultiAssetReferenceField: [mocks.asset, mocks.assetLink],
  })
)

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields> }, undefined>
>(mocks.getEntry({ referenceField: undefined }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] }, undefined>
>(mocks.getEntry({ referenceField: [undefined] }))

expectNotAssignable<NewEntry<{ referenceField: EntryFields.AssetLink }, undefined>>(
  mocks.getEntry({ referenceField: undefined })
)

expectNotAssignable<NewEntry<{ referenceField: EntryFields.AssetLink[] }, undefined>>(
  mocks.getEntry({ referenceField: [undefined] })
)

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithoutLinkResolution All fields are mapped to the given set of locales.
 * linked entites are all rendered as links.
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      entryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      multiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      assetReferenceField: EntryFields.AssetLink
      multiAssetReferenceField: EntryFields.AssetLink[]
    },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(
  mocks.getEntry({
    stringField: { US: mocks.stringValue, DE: mocks.stringValue },
    entryReferenceField: { DE: mocks.entryLink, US: mocks.entryLink },
    multiEntryReferenceField: { DE: [mocks.entryLink], US: [mocks.entryLink] },
    assetReferenceField: { DE: mocks.assetLink, US: mocks.assetLink },
    multiAssetReferenceField: { DE: [mocks.assetLink], US: [mocks.assetLink] },
  })
)

/* links in single reference fields can be undefined because we can’t distinguish between missing translation and missing links */
expectAssignable<
  NewEntry<
    {
      entryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      assetReferenceField: EntryFields.AssetLink
    },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(
  mocks.getEntry({ entryReferenceField: { US: undefined }, assetReferenceField: { US: undefined } })
)

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields> },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: mocks.localizedEntry } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [undefined] } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [mocks.localizedEntry] } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.AssetLink },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: mocks.asset } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.AssetLink[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [undefined] } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.AssetLink[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [mocks.asset] } }))

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks All fields are mapped to the given set of locales.
 * linked entities are all rendered as inlined references, or if not resolvable, as links. multi reference fields can have mixed content.
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      resolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      unresolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      resolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      unresolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      mixedMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      resolvableAssetReferenceField: EntryFields.AssetLink
      unresolvableAssetReferenceField: EntryFields.AssetLink
      resolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      unresolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      mixedMultiAssetReferenceField: EntryFields.AssetLink[]
    },
    'WITH_ALL_LOCALES',
    'US' | 'DE'
  >
>({
  ...mocks.entryBasics,
  fields: {
    stringField: { US: mocks.stringValue, DE: mocks.stringValue },
    resolvableEntryReferenceField: { DE: mocks.localizedEntry, US: mocks.localizedEntry },
    unresolvableEntryReferenceField: { US: mocks.entryLink, DE: mocks.entryLink },
    resolvableMultiEntryReferenceField: { DE: [mocks.localizedEntry], US: [mocks.localizedEntry] },
    unresolvableMultiEntryReferenceField: { DE: [mocks.entryLink], US: [mocks.entryLink] },
    mixedMultiEntryReferenceField: {
      DE: [mocks.localizedEntry, mocks.entryLink],
      US: [mocks.localizedEntry, mocks.entryLink],
    },
    resolvableAssetReferenceField: { DE: mocks.asset, US: mocks.asset },
    unresolvableAssetReferenceField: { US: mocks.assetLink, DE: mocks.assetLink },
    resolvableMultiAssetReferenceField: { DE: [mocks.asset], US: [mocks.asset] },
    unresolvableMultiAssetReferenceField: { DE: [mocks.assetLink], US: [mocks.assetLink] },
    mixedMultiAssetReferenceField: {
      DE: [mocks.asset, mocks.assetLink],
      US: [mocks.asset, mocks.assetLink],
    },
  },
})

/* links in single reference fields can be undefined because we can’t distinguish between missing translation and missing links */
expectAssignable<
  NewEntry<
    {
      entryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      assetReferenceField: EntryFields.AssetLink
    },
    'WITH_ALL_LOCALES',
    'US' | 'DE'
  >
>(
  mocks.getEntry({ entryReferenceField: { US: undefined }, assetReferenceField: { US: undefined } })
)

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITH_ALL_LOCALES',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [undefined] } }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.AssetLink[] }, 'WITH_ALL_LOCALES', 'US' | 'DE'>
>(mocks.getEntry({ referenceField: { US: [undefined] } }))

/**
 * @namespace: Typescript - type test
 * @description: EntryWithLinkResolutionAndWithoutUnresolvableLinks only resolvable entities are present.
 * unresolvable links are completely removed.
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      resolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      unresolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      resolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      unresolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      mixedMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      resolvableAssetReferenceField: EntryFields.AssetLink
      unresolvableAssetReferenceField: EntryFields.AssetLink
      resolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      unresolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      mixedMultiAssetReferenceField: EntryFields.AssetLink[]
    },
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(
  mocks.getEntry({
    stringField: mocks.stringValue,
    resolvableEntryReferenceField: mocks.entry,
    unresolvableEntryReferenceField: undefined,
    resolvableMultiEntryReferenceField: [mocks.entry],
    unresolvableMultiEntryReferenceField: [undefined],
    mixedMultiEntryReferenceField: [mocks.entry, undefined],
    resolvableAssetReferenceField: mocks.asset,
    unresolvableAssetReferenceField: undefined,
    resolvableMultiAssetReferenceField: [mocks.asset],
    unresolvableMultiAssetReferenceField: [undefined],
    mixedMultiAssetReferenceField: [mocks.asset, undefined],
  })
)

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields> },
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.getEntry({ referenceField: mocks.entryLink }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.getEntry({ referenceField: [mocks.entryLink] }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.AssetLink }, 'WITHOUT_UNRESOLVABLE_LINKS'>
>(mocks.getEntry({ referenceField: mocks.assetLink }))

expectNotAssignable<
  NewEntry<{ referenceField: EntryFields.AssetLink[] }, 'WITHOUT_UNRESOLVABLE_LINKS'>
>(mocks.getEntry({ referenceField: [mocks.assetLink] }))

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks All unresolvable fields are removed
 */
expectAssignable<
  NewEntry<
    {
      stringField: EntryFields.Text
      resolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      unresolvableEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>
      resolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      unresolvableMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      mixedMultiEntryReferenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[]
      resolvableAssetReferenceField: EntryFields.AssetLink
      unresolvableAssetReferenceField: EntryFields.AssetLink
      resolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      unresolvableMultiAssetReferenceField: EntryFields.AssetLink[]
      mixedMultiAssetReferenceField: EntryFields.AssetLink[]
    },
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    'US' | 'DE'
  >
>(
  mocks.getEntry({
    stringField: { US: mocks.stringValue, DE: mocks.stringValue },
    resolvableEntryReferenceField: { US: mocks.localizedEntry, DE: mocks.localizedEntry },
    unresolvableEntryReferenceField: { US: undefined, DE: undefined },
    resolvableMultiEntryReferenceField: { US: [mocks.localizedEntry], DE: [mocks.localizedEntry] },
    unresolvableMultiEntryReferenceField: { US: [undefined], DE: [undefined] },
    mixedMultiEntryReferenceField: {
      US: [mocks.localizedEntry, undefined],
      DE: [mocks.localizedEntry, undefined],
    },
    resolvableAssetReferenceField: { US: mocks.asset, DE: mocks.asset },
    unresolvableAssetReferenceField: { US: undefined, DE: undefined },
    resolvableMultiAssetReferenceField: { US: [mocks.asset], DE: [mocks.asset] },
    unresolvableMultiAssetReferenceField: { US: [undefined], DE: [undefined] },
    mixedMultiAssetReferenceField: { US: [mocks.asset, undefined], DE: [mocks.asset, undefined] },
  })
)

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields> },
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: mocks.entryLink } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.EntryLink<mocks.SimpleEntryFields>[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [mocks.entryLink] } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.AssetLink },
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: mocks.assetLink } }))

expectNotAssignable<
  NewEntry<
    { referenceField: EntryFields.AssetLink[] },
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    'US' | 'DE'
  >
>(mocks.getEntry({ referenceField: { US: [mocks.assetLink] } }))
