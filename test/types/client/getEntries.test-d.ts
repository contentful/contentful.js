import { expectType } from 'tsd'
import { createClient, EntryCollection, Entry, FieldsType } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type LinkedFields = {
  name: string
}

type Fields = {
  title: string
  link: Entry<LinkedFields>
  moreLinks: Entry<LinkedFields>[]
}

type Locale = 'en'

expectType<Entry<FieldsType, undefined>>(await client.getEntry('entry-id'))
expectType<Entry<Fields, undefined>>(await client.getEntry<Fields>('entry-id'))
expectType<EntryCollection<FieldsType, undefined>>(await client.getEntries())
expectType<EntryCollection<Fields, undefined>>(await client.getEntries<Fields>())

expectType<Entry<FieldsType, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry('entry-id')
)
expectType<Entry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<FieldsType, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries()
)
expectType<EntryCollection<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries<Fields>()
)

expectType<Entry<FieldsType, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry('entry-id')
)
expectType<Entry<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<FieldsType, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries()
)
expectType<EntryCollection<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries<Fields>()
)

expectType<Entry<FieldsType, 'WITH_ALL_LOCALES'>>(await client.withAllLocales.getEntry('entry-id'))
expectType<Entry<Fields, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<Fields>('entry-id')
)
expectType<Entry<Fields, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntry<Fields, Locale>('entry-id')
)
expectType<EntryCollection<FieldsType, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries<Fields>()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntries<Fields, Locale>()
)

expectType<Entry<FieldsType, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry('entry-id')
)
expectType<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<Fields>('entry-id')
)
expectType<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<Fields, Locale>('entry-id')
)
expectType<EntryCollection<FieldsType, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<Fields>()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<Fields, Locale>()
)

expectType<Entry<FieldsType, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry('entry-id')
)
expectType<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<Fields>('entry-id')
)
expectType<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<Fields, Locale>('entry-id')
)
expectType<EntryCollection<FieldsType, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<Fields>()
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<Fields, Locale>()
)
