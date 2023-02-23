import { expectType } from 'tsd'
import { EntryCollection } from '../../../dist/types/types/entry'
import {
  createClient,
  Entry,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithoutLinkResolution,
  EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithoutLinkResolution,
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
  moreLinks: Entry<LinkedFields>[]
}

const data: EntryCollection<Fields> = {
  total: 10,
  skip: 0,
  limit: 5,
  items: [],
}

expectType<EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields>>(
  await client.parseEntries<Fields>(data)
)

expectType<EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>(
  await client.withoutUnresolvableLinks.parseEntries<Fields>(data)
)

expectType<EntryCollectionWithoutLinkResolution<Fields>>(
  await client.withoutLinkResolution.parseEntries<Fields>(data)
)

expectType<
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, LocaleCode>
>(await client.withAllLocales.parseEntries<Fields, LocaleCode>(data))

expectType<
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, LocaleCode>
>(await client.withAllLocales.withoutUnresolvableLinks.parseEntries<Fields, LocaleCode>(data))

expectType<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, LocaleCode>>(
  await client.withAllLocales.withoutLinkResolution.parseEntries<Fields, LocaleCode>(data)
)
