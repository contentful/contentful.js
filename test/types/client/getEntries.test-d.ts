import { expectType } from 'tsd'
import {
  createClient,
  Entry,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithoutLinkResolution,
  EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithoutLinkResolution,
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithAllLocalesAndWithoutLinkResolution,
  EntryWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithoutLinkResolution,
  LocaleCode,
} from '../../../lib'

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
}

expectType<EntryWithLinkResolutionAndWithUnresolvableLinks<Fields>>(
  await client.getEntry<Fields>('entry-id')
)
expectType<EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields>>(
  await client.getEntries<Fields>()
)

// @ts-ignore
expectType<EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>(
  await client.withoutUnresolvableLinks.getEntry<Fields>('entry-id')
)
expectType<EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>(
  await client.withoutUnresolvableLinks.getEntries<Fields>()
)

expectType<EntryWithoutLinkResolution<Fields>>(
  await client.withoutLinkResolution.getEntry<Fields>('entry-id')
)
expectType<EntryCollectionWithoutLinkResolution<Fields>>(
  await client.withoutLinkResolution.getEntries<Fields>()
)

expectType<
  Promise<EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, LocaleCode>>
>(client.withAllLocales.getEntry<Fields, LocaleCode>('entry-id'))
expectType<
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, LocaleCode>
>(await client.withAllLocales.getEntries<Fields, LocaleCode>())

expectType<
  Promise<EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, LocaleCode>>
>(client.withAllLocales.withoutUnresolvableLinks.getEntry<Fields, LocaleCode>('entry-id'))
expectType<
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, LocaleCode>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries<Fields, LocaleCode>())

expectType<Promise<EntryWithAllLocalesAndWithoutLinkResolution<Fields, LocaleCode>>>(
  client.withAllLocales.withoutLinkResolution.getEntry<Fields, LocaleCode>('entry-id')
)
expectType<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, LocaleCode>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<Fields, LocaleCode>()
)
