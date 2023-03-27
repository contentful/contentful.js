// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFieldTypes, EntrySkeletonType, ResolvedField } from '../../lib'
// @ts-ignore
import * as mocks from './mocks'
import { entryResourceLink } from './mocks'

type SimpleEntryFields = { title: EntryFieldTypes.Symbol }
type SimpleEntryWithContentTypeId = EntrySkeletonType<SimpleEntryFields>

expectAssignable<ResolvedField<EntryFieldTypes.Symbol, undefined>>(mocks.stringValue)
expectAssignable<ResolvedField<EntryFieldTypes.Text, undefined>>(mocks.stringValue)
expectAssignable<ResolvedField<EntryFieldTypes.Integer, undefined>>(mocks.numberValue)
expectAssignable<ResolvedField<EntryFieldTypes.Number, undefined>>(mocks.numberValue)
expectAssignable<ResolvedField<EntryFieldTypes.Date, undefined>>(mocks.dateValue)
expectAssignable<ResolvedField<EntryFieldTypes.Boolean, undefined>>(mocks.booleanValue)
expectAssignable<ResolvedField<EntryFieldTypes.Location, undefined>>(mocks.locationValue)
expectAssignable<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.Symbol>, undefined>>([
  mocks.stringValue,
])
expectAssignable<ResolvedField<EntryFieldTypes.Object, undefined>>(mocks.jsonValue)

// entries in links

expectAssignable<ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.entry
)
expectAssignable<ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.entryLink
)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
>(undefined)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.asset)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.assetLink)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entryLink])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryLink])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryLink, undefined])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryLink, mocks.asset])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryLink, mocks.assetLink])

expectAssignable<
  ResolvedField<
    EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.entry)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(undefined)
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.entryLink)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([undefined])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, undefined])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, mocks.entryLink, undefined])

expectAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.entryLink)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(undefined)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.entry)

// entries in resource links

expectAssignable<
  ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.entry)
expectAssignable<
  ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.entryResourceLink)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
>(undefined)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.asset)
expectNotAssignable<
  ResolvedField<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>, undefined>
>(mocks.assetLink)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entryResourceLink])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryResourceLink])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryResourceLink, undefined])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryResourceLink, mocks.asset])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    undefined
  >
>([mocks.entry, mocks.entryResourceLink, mocks.assetLink])

expectAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.entry)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(undefined)
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>(mocks.entryResourceLink)
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([undefined])
expectAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, undefined])
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, mocks.entryResourceLink, undefined])

expectAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_LINK_RESOLUTION'
  >
>(mocks.entryResourceLink)
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_LINK_RESOLUTION'
  >
>(undefined)
expectNotAssignable<
  ResolvedField<
    EntryFieldTypes.EntryResourceLink<SimpleEntryWithContentTypeId>,
    'WITHOUT_LINK_RESOLUTION'
  >
>(mocks.entry)

// assets

expectAssignable<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.asset)
expectAssignable<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.assetLink)
expectNotAssignable<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(undefined)
expectNotAssignable<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.entry)
expectNotAssignable<ResolvedField<EntryFieldTypes.AssetLink, undefined>>(mocks.entryLink)
expectAssignable<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
  mocks.asset,
])
expectAssignable<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
  mocks.assetLink,
])
expectAssignable<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
  mocks.asset,
  mocks.assetLink,
])
expectNotAssignable<ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, undefined>>([
  mocks.asset,
  mocks.assetLink,
  undefined,
])

expectAssignable<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  mocks.asset
)
expectAssignable<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(undefined)
expectNotAssignable<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  mocks.assetLink
)
expectAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.asset])
expectAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([undefined])
expectAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.asset, undefined])
expectNotAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, undefined])
expectNotAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, mocks.entry])
expectNotAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, mocks.entryLink])

expectAssignable<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_LINK_RESOLUTION'>>(
  mocks.assetLink
)
expectNotAssignable<ResolvedField<EntryFieldTypes.AssetLink, 'WITHOUT_LINK_RESOLUTION'>>(
  mocks.asset
)
expectAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
>([mocks.assetLink])
expectNotAssignable<
  ResolvedField<EntryFieldTypes.Array<EntryFieldTypes.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
>([mocks.asset])
