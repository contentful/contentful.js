import { expectType } from 'tsd'
import { createClient, EntryCollection, LocaleCode, Entry } from '../../../lib'

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

expectType<Entry<Fields, undefined>>(await client.getEntry<Fields>('entry-id'))
expectType<EntryCollection<Entry<Fields, undefined>>>(await client.getEntries<Fields>())

expectType<Entry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<Entry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  await client.withoutUnresolvableLinks.getEntries<Fields>()
)

expectType<Entry<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<Entry<Fields, 'WITHOUT_LINK_RESOLUTION'>>>(
  await client.withoutLinkResolution.getEntries<Fields>()
)

expectType<Entry<Fields, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<Entry<Fields, 'WITH_ALL_LOCALES'>>>(
  await client.withAllLocales.getEntries<Fields, LocaleCode>()
)

expectType<Promise<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  client.withAllLocales.withoutUnresolvableLinks.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<Fields, LocaleCode>()
)

expectType<Promise<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>>(
  client.withAllLocales.withoutLinkResolution.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<Entry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<Fields, LocaleCode>()
)
