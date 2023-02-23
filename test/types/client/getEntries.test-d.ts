import { expectType } from 'tsd'
import { createClient, EntryCollection, LocaleCode, NewEntry } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type LinkedFields = {
  name: string
}

type Fields = {
  title: string
  link: NewEntry<LinkedFields>
  moreLinks: NewEntry<LinkedFields>[]
}

expectType<NewEntry<Fields, undefined>>(await client.getEntry<Fields>('entry-id'))
expectType<EntryCollection<NewEntry<Fields, undefined>>>(await client.getEntries<Fields>())

expectType<NewEntry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<NewEntry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  await client.withoutUnresolvableLinks.getEntries<Fields>()
)

expectType<NewEntry<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<Fields>('entry-id')
)
expectType<EntryCollection<NewEntry<Fields, 'WITHOUT_LINK_RESOLUTION'>>>(
  await client.withoutLinkResolution.getEntries<Fields>()
)

expectType<NewEntry<Fields, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<NewEntry<Fields, 'WITH_ALL_LOCALES'>>>(
  await client.withAllLocales.getEntries<Fields, LocaleCode>()
)

expectType<Promise<NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  client.withAllLocales.withoutUnresolvableLinks.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<Fields, LocaleCode>()
)

expectType<Promise<NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>>(
  client.withAllLocales.withoutLinkResolution.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollection<NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<Fields, LocaleCode>()
)
