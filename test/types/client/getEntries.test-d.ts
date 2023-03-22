import { expectType, expectError } from 'tsd'
import { createClient, EntryCollection, Entry, FieldsWithContentTypeIdType } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type LinkedFields = {
  name: string
}

type LinkedFieldsWithContentTypeId = FieldsWithContentTypeIdType<LinkedFields, 'linked-type-id'>

type Fields = {
  title: string
  link: Entry<LinkedFieldsWithContentTypeId>
  moreLinks: Entry<LinkedFieldsWithContentTypeId>[]
}

type FieldsWithContentTypeId = FieldsWithContentTypeIdType<Fields, 'content-type-id'>

type Locale = 'en'

expectType<Entry<FieldsWithContentTypeIdType, undefined>>(await client.getEntry('entry-id'))
expectType<Entry<FieldsWithContentTypeId, undefined>>(
  await client.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<EntryCollection<FieldsWithContentTypeIdType, undefined>>(await client.getEntries())
expectType<EntryCollection<FieldsWithContentTypeId, undefined>>(
  await client.getEntries<FieldsWithContentTypeId>()
)

expectType<EntryCollection<FieldsWithContentTypeId, undefined>>(
  await client.getEntries<FieldsWithContentTypeId>({ content_type: 'content-type-id' })
)
expectError(await client.getEntries<FieldsWithContentTypeId>({ content_type: 'unexpected' }))
expectType<EntryCollection<FieldsWithContentTypeId | LinkedFieldsWithContentTypeId, undefined>>(
  await client.getEntries<FieldsWithContentTypeId | LinkedFieldsWithContentTypeId>({
    content_type: 'content-type-id',
  })
)

expectType<Entry<FieldsWithContentTypeIdType, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<EntryCollection<FieldsWithContentTypeIdType, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries()
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries<FieldsWithContentTypeId>()
)

expectType<Entry<FieldsWithContentTypeIdType, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<EntryCollection<FieldsWithContentTypeIdType, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries()
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries<FieldsWithContentTypeId>()
)

expectType<Entry<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntry<FieldsWithContentTypeId, Locale>('entry-id')
)
expectType<EntryCollection<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries()
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries<FieldsWithContentTypeId>()
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntries<FieldsWithContentTypeId, Locale>()
)

expectType<Entry<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<
  Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>
>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<FieldsWithContentTypeId, Locale>(
    'entry-id'
  )
)
expectType<
  EntryCollection<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries())
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries<FieldsWithContentTypeId>())
expectType<
  EntryCollection<
    FieldsWithContentTypeId,
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    Locale
  >
>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<FieldsWithContentTypeId, Locale>()
)

expectType<Entry<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<FieldsWithContentTypeId>('entry-id')
)
expectType<Entry<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<FieldsWithContentTypeId, Locale>(
    'entry-id'
  )
)
expectType<
  EntryCollection<FieldsWithContentTypeIdType, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>
>(await client.withAllLocales.withoutLinkResolution.getEntries())
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>
>(await client.withAllLocales.withoutLinkResolution.getEntries<FieldsWithContentTypeId>())
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>
>(await client.withAllLocales.withoutLinkResolution.getEntries<FieldsWithContentTypeId, Locale>())
