import { expectType } from 'tsd'
import { createClient, EntryCollection, EntrySys, FieldsType, Link, LocaleCode } from '../../../lib'

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

type Locales = 'en' | 'de'

const dataWithAllLocales: EntryCollection<
  Fields,
  'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES',
  Locales
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

expectType<EntryCollection<Fields, undefined>>(client.parseEntries(data))
expectType<EntryCollection<Fields, undefined>>(client.parseEntries<Fields>(data))

expectType<EntryCollection<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries(data)
)
expectType<EntryCollection<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries<Fields>(data)
)

expectType<EntryCollection<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries(data)
)
expectType<EntryCollection<Fields, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries<Fields>(data)
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES'>>(
  client.withAllLocales.parseEntries<Fields>(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries<Fields, Locales>(dataWithAllLocales)
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<Fields>(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<Fields, Locales>(dataWithAllLocales)
)

expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>>(
  client.withAllLocales.withoutLinkResolution.parseEntries(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  client.withAllLocales.withoutLinkResolution.parseEntries<Fields>(dataWithAllLocales)
)
expectType<EntryCollection<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>>(
  client.withAllLocales.withoutLinkResolution.parseEntries<Fields, Locales>(dataWithAllLocales)
)
