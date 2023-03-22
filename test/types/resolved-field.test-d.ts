// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields, FieldsWithContentTypeIdType, ResolvedField } from '../../lib'
// @ts-ignore
import * as mocks from './mocks'

type SimpleEntryFields = { title: string }
type SimpleEntryWithContentTypeId = FieldsWithContentTypeIdType<SimpleEntryFields>

expectAssignable<ResolvedField<EntryFields.Symbol, undefined>>(mocks.stringValue)
expectAssignable<ResolvedField<EntryFields.Text, undefined>>(mocks.stringValue)
expectAssignable<ResolvedField<EntryFields.Integer, undefined>>(mocks.numberValue)
expectAssignable<ResolvedField<EntryFields.Number, undefined>>(mocks.numberValue)
expectAssignable<ResolvedField<EntryFields.Date, undefined>>(mocks.dateValue)
expectAssignable<ResolvedField<EntryFields.Boolean, undefined>>(mocks.booleanValue)
expectAssignable<ResolvedField<EntryFields.Location, undefined>>(mocks.locationValue)
expectAssignable<ResolvedField<EntryFields.Array<EntryFields.Symbol>, undefined>>([
  mocks.stringValue,
])
expectAssignable<ResolvedField<EntryFields.Object, undefined>>(mocks.jsonValue)

// entries

expectAssignable<ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.entry
)
expectAssignable<ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.entryLink
)
expectNotAssignable<ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  undefined
)
expectNotAssignable<ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.asset
)
expectNotAssignable<ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, undefined>>(
  mocks.assetLink
)
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entry])
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entryLink])
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entry, mocks.entryLink])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entry, mocks.entryLink, undefined])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entry, mocks.entryLink, mocks.asset])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>, undefined>
>([mocks.entry, mocks.entryLink, mocks.assetLink])

expectAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>(mocks.entry)
expectAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>(undefined)
expectNotAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>(mocks.entryLink)
expectAssignable<
  ResolvedField<
    EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry])
expectAssignable<
  ResolvedField<
    EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([undefined])
expectAssignable<
  ResolvedField<
    EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, undefined])
expectNotAssignable<
  ResolvedField<
    EntryFields.Array<EntryFields.EntryLink<SimpleEntryWithContentTypeId>>,
    'WITHOUT_UNRESOLVABLE_LINKS'
  >
>([mocks.entry, mocks.entryLink, undefined])

expectAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.entryLink)
expectNotAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(undefined)
expectNotAssignable<
  ResolvedField<EntryFields.EntryLink<SimpleEntryWithContentTypeId>, 'WITHOUT_LINK_RESOLUTION'>
>(mocks.entry)

// assets

expectAssignable<ResolvedField<EntryFields.AssetLink, undefined>>(mocks.asset)
expectAssignable<ResolvedField<EntryFields.AssetLink, undefined>>(mocks.assetLink)
expectNotAssignable<ResolvedField<EntryFields.AssetLink, undefined>>(undefined)
expectNotAssignable<ResolvedField<EntryFields.AssetLink, undefined>>(mocks.entry)
expectNotAssignable<ResolvedField<EntryFields.AssetLink, undefined>>(mocks.entryLink)
expectAssignable<ResolvedField<EntryFields.Array<EntryFields.AssetLink>, undefined>>([mocks.asset])
expectAssignable<ResolvedField<EntryFields.Array<EntryFields.AssetLink>, undefined>>([
  mocks.assetLink,
])
expectAssignable<ResolvedField<EntryFields.Array<EntryFields.AssetLink>, undefined>>([
  mocks.asset,
  mocks.assetLink,
])
expectNotAssignable<ResolvedField<EntryFields.Array<EntryFields.AssetLink>, undefined>>([
  mocks.asset,
  mocks.assetLink,
  undefined,
])

expectAssignable<ResolvedField<EntryFields.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(mocks.asset)
expectAssignable<ResolvedField<EntryFields.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(undefined)
expectNotAssignable<ResolvedField<EntryFields.AssetLink, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  mocks.assetLink
)
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.asset])
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([undefined])
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.asset, undefined])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, undefined])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, mocks.entry])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_UNRESOLVABLE_LINKS'>
>([mocks.assetLink, mocks.asset, mocks.entryLink])

expectAssignable<ResolvedField<EntryFields.AssetLink, 'WITHOUT_LINK_RESOLUTION'>>(mocks.assetLink)
expectNotAssignable<ResolvedField<EntryFields.AssetLink, 'WITHOUT_LINK_RESOLUTION'>>(mocks.asset)
expectAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
>([mocks.assetLink])
expectNotAssignable<
  ResolvedField<EntryFields.Array<EntryFields.AssetLink>, 'WITHOUT_LINK_RESOLUTION'>
>([mocks.asset])
