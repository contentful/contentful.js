import { expectType } from 'tsd'
import { createClient, EntryCollection, EntrySys, Link, LocaleCode } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type Fields = {
  title: string
  link: { sys: Link<'Entry'> }
  moreLinks: { sys: Link<'Entry'> }[]
}

const data: EntryCollection<Fields, 'WITHOUT_LINK_RESOLUTION'> = {
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

const dataWithAllLocales: EntryCollection<
  Fields,
  'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES',
  'en' | 'de'
> = {
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

expectType<EntryCollection<Fields, undefined>>(await client.parseEntries<Fields>(data))

expectType<EntryCollection<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.parseEntries<Fields>(data)
)

expectType<EntryCollection<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.parseEntries<Fields>(data)
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES', LocaleCode>>(
  await client.withAllLocales.parseEntries<Fields, LocaleCode>(dataWithAllLocales)
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>>(
  await client.withAllLocales.withoutUnresolvableLinks.parseEntries<Fields, LocaleCode>(
    dataWithAllLocales
  )
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', LocaleCode>>(
  await client.withAllLocales.withoutLinkResolution.parseEntries<Fields, LocaleCode>(
    dataWithAllLocales
  )
)
