import { expectTypeOf, test } from "vitest";
import { EntryFieldTypes, EntrySkeletonType, ResolvedField } from '../../lib'

// @ts-ignore
import * as mocks from './mocks'

type SimpleEntryFields = { title: EntryFieldTypes.Symbol }
type SimpleEntryWithContentTypeId = EntrySkeletonType<SimpleEntryFields>


test('resolved-field', async () => {
  expectTypeOf<ResolvedField<EntryFieldTypes.Symbol, undefined>>(mocks.stringValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Symbol<'a' | 'b'>, undefined>>('a')
  expectTypeOf<ResolvedField<EntryFieldTypes.Symbol<'a' | 'b'>, undefined>>('b')
  expectTypeOf('c').not.toEqualTypeOf<ResolvedField<EntryFieldTypes.Symbol<'a' | 'b'>, undefined>>()

  expectTypeOf<ResolvedField<EntryFieldTypes.Text, undefined>>(mocks.stringValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Text<'a' | 'b'>, undefined>>('a')
  expectTypeOf<ResolvedField<EntryFieldTypes.Text<'a' | 'b'>, undefined>>('b')
  expectTypeOf('c').not.toEqualTypeOf<ResolvedField<EntryFieldTypes.Text<'a' | 'b'>, undefined>>()

  expectTypeOf<ResolvedField<EntryFieldTypes.Integer, undefined>>(mocks.numberValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Integer<1 | 2>, undefined>>(1)
  expectTypeOf<ResolvedField<EntryFieldTypes.Integer<1 | 2>, undefined>>(2)
  expectTypeOf(3).not.toEqualTypeOf<ResolvedField<EntryFieldTypes.Integer<1 | 2>, undefined>>()

  expectTypeOf<ResolvedField<EntryFieldTypes.Number, undefined>>(mocks.numberValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Number<1 | 2>, undefined>>(1)
  expectTypeOf<ResolvedField<EntryFieldTypes.Number<1 | 2>, undefined>>(2)
  expectTypeOf(3).not.toEqualTypeOf<ResolvedField<EntryFieldTypes.Number<1 | 2>, undefined>>()

  expectTypeOf<ResolvedField<EntryFieldTypes.Date, undefined>>(mocks.dateValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Boolean, undefined>>(mocks.booleanValue)
  expectTypeOf<ResolvedField<EntryFieldTypes.Location, undefined>>(mocks.locationValue)

  expectTypeOf<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.Symbol>, undefined>>([
    mocks.stringValue,
  ])
  expectTypeOf<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.Symbol<'a' | 'b'>>, undefined>>([
    'a',
    'b',
  ])
  expectTypeOf(['c']).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.Symbol<'a' | 'b'>>, undefined>
  >()

  expectTypeOf<ResolvedField<EntryFieldTypes.Object, undefined>>(mocks.jsonValue)

  // entries in links

  expectTypeOf<ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
    mocks.entry,
  )
  expectTypeOf<ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
    mocks.entryLink,
  )
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entry])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entryLink])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entry, mocks.entryLink])
  expectTypeOf([mocks.entry, mocks.entryLink, undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()
  expectTypeOf([mocks.entry, mocks.entryLink, mocks.asset]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()
  expectTypeOf([mocks.entry, mocks.entryLink, mocks.assetLink]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()

  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(mocks.entry)
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(undefined)
  expectTypeOf(mocks.entryLink).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.entry])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([undefined])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.entry, undefined])
  expectTypeOf([mocks.entry, mocks.entryLink, undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()

  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >(mocks.entryLink)
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()
  expectTypeOf(mocks.entry).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()

  // entries in resource links

  expectTypeOf<
    ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
  >(mocks.entry)
  expectTypeOf<
    ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
  >(mocks.entryResourceLink)
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entry])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entryResourceLink])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >([mocks.entry, mocks.entryResourceLink])
  expectTypeOf([mocks.entry, mocks.entryResourceLink, undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()
  expectTypeOf([mocks.entry, mocks.entryResourceLink, mocks.asset]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()
  expectTypeOf([mocks.entry, mocks.entryResourceLink, mocks.assetLink]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      undefined
    >
  >()

  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(mocks.entry)
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(undefined)
  expectTypeOf(mocks.entryResourceLink).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.entry])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([undefined])
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.entry, undefined])
  expectTypeOf([mocks.entry, mocks.entryResourceLink, undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()

  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >(mocks.entryResourceLink)
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()
  expectTypeOf(mocks.entry).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()

  // external resource links

  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>>(
    mocks.externalResourceLink,
  )
  // assignable because 'Contentful:Entry' is a subtype of string
  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>>(
    mocks.entryResourceLink,
  )
  expectTypeOf(mocks.entry).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>
  >()
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>
  >()
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>
  >()
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, undefined>
  >()
  expectTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>, undefined>
  >([mocks.externalResourceLink, mocks.entryResourceLink])
  expectTypeOf([mocks.entry]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>, undefined>
  >()
  expectTypeOf([mocks.externalResourceLink, undefined]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>, undefined>
  >()
  expectTypeOf([mocks.externalResourceLink, mocks.asset]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>, undefined>
  >()
  expectTypeOf([mocks.externalResourceLink, mocks.assetLink]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>, undefined>
  >()

  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
    mocks.externalResourceLink,
  )
  // assignable because 'Contentful:Entry' is a subtype of string
  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
    mocks.entryResourceLink,
  )
  expectTypeOf(mocks.entry).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.externalResourceLink, mocks.entryResourceLink])
  expectTypeOf([mocks.entry]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()
  expectTypeOf([mocks.externalResourceLink, undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()
  expectTypeOf([mocks.externalResourceLink, mocks.asset]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()
  expectTypeOf([mocks.externalResourceLink, mocks.assetLink]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >()

  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>>(
    mocks.externalResourceLink,
  )
  // assignable because 'Contentful:Entry' is a subtype of string
  expectTypeOf<ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>>(
    mocks.entryResourceLink,
  )
  expectTypeOf(mocks.entry).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>
  >()
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>
  >()
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>
  >()
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.ExternalResourceLink, 'WITHOUT_LINK_RESOLUTION'>
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >([mocks.externalResourceLink, mocks.entryResourceLink])
  expectTypeOf([mocks.entry]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()
  expectTypeOf([undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()
  expectTypeOf([mocks.asset]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()
  expectTypeOf([mocks.assetLink]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<EntryFieldTypes.ExternalResourceLink>,
      'WITHOUT_LINK_RESOLUTION'
    >
  >()

  // mixed resource links

  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      undefined
    >
  >(mocks.entry)
  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      undefined
    >
  >(mocks.entryResourceLink)
  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      undefined
    >
  >(mocks.externalResourceLink)
  expectTypeOf(undefined).not.toEqualTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      undefined
    >
  >()
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<
        | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
        | EntryFieldTypes.ExternalResourceLink
      >,
      undefined
    >
  >([mocks.entry, mocks.entryResourceLink, mocks.externalResourceLink])
  expectTypeOf([undefined]).not.toEqualTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<
        | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
        | EntryFieldTypes.ExternalResourceLink
      >,
      undefined
    >
  >()

  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(mocks.entry)
  // assignable because 'Contentful:Entry' is a subtype of string
  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(mocks.entryResourceLink)
  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(mocks.externalResourceLink)
  expectTypeOf<
    ResolvedField<
      | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
      | EntryFieldTypes.ExternalResourceLink,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >(undefined)
  expectTypeOf<
    ResolvedField<
      EntryFieldTypes.Array<
        | EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>
        | EntryFieldTypes.ExternalResourceLink
      >,
      'WITHOUT_UNRESOLVABLE_LINKS'
    >
  >([mocks.entry, mocks.entryResourceLink, mocks.externalResourceLink, undefined])

  // assets

  expectTypeOf<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.asset)
  expectTypeOf<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.assetLink)
  expectTypeOf(undefined).not.toEqualTypeOf<ResolvedField<EntryFieldTypes.AssetLink, undefined>>()
  expectTypeOf(mocks.entry).not.toEqualTypeOf<ResolvedField<EntryFieldTypes.AssetLink, undefined>>()
  expectTypeOf(mocks.entryLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.AssetLink, undefined>
  >()
  expectTypeOf<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
    mocks.asset,
  ])
  expectTypeOf<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
    mocks.assetLink,
  ])
  expectTypeOf<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
    mocks.asset,
    mocks.assetLink,
  ])
  expectTypeOf([mocks.asset, mocks.assetLink, undefined]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>
  >()

  expectTypeOf<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(mocks.asset)
  expectTypeOf<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(undefined)
  expectTypeOf(mocks.assetLink).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >([mocks.asset])
  expectTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >([undefined])
  expectTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >([mocks.asset, undefined])
  expectTypeOf([mocks.assetLink, mocks.asset, undefined]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf([mocks.assetLink, mocks.asset, mocks.entry]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()
  expectTypeOf([mocks.assetLink, mocks.asset, mocks.entryLink]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >()

  expectTypeOf<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_LINK_RESOLUTION'>>(mocks.assetLink)
  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_LINK_RESOLUTION'>
  >()
  expectTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
  >([mocks.assetLink])
  expectTypeOf([mocks.asset]).not.toEqualTypeOf<
    ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
  >()
})