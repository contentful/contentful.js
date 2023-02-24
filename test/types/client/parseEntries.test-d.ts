import { expectType } from 'tsd'
import {
  createClient,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithoutLinkResolution,
  EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithoutLinkResolution,
  EntrySys,
  Link,
  LocaleCode,
  LocalizedGenericEntryCollection,
  UnlocalizedGenericEntryCollection,
} from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type Fields = {
  title: string
  link: { sys: Link<'Entry'> }
  moreLinks: { sys: Link<'Entry'> }[]
}

const data: UnlocalizedGenericEntryCollection<Fields> = {
  total: 10,
  skip: 0,
  limit: 1,
  items: [
    {
      sys: {
        id: '0',
      } as EntrySys,
      metadata: {
        tags: [],
      },
      fields: {
        title: 'title',
        link: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: '1',
          },
        },
        moreLinks: [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: '2',
            },
          },
        ],
      },
    },
  ],
}

const dataWithAllLocales: LocalizedGenericEntryCollection<Fields, 'en' | 'de'> = {
  total: 10,
  skip: 0,
  limit: 1,
  items: [
    {
      sys: {
        id: '0',
      } as EntrySys,
      metadata: {
        tags: [],
      },
      fields: {
        title: {
          en: 'title',
          de: 'titel',
        },
        link: {
          en: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: '1',
            },
          },
        },
        moreLinks: {
          en: [
            {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: '2',
              },
            },
          ],
        },
      },
    },
  ],
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
>(await client.withAllLocales.parseEntries<Fields, LocaleCode>(dataWithAllLocales))

expectType<
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, LocaleCode>
>(
  await client.withAllLocales.withoutUnresolvableLinks.parseEntries<Fields, LocaleCode>(
    dataWithAllLocales
  )
)

expectType<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, LocaleCode>>(
  await client.withAllLocales.withoutLinkResolution.parseEntries<Fields, LocaleCode>(
    dataWithAllLocales
  )
)
