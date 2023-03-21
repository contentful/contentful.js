import { expectType } from 'tsd'
import {
  createClient,
  EntryCollection,
  EntrySys,
  FieldsWithContentTypeIdType,
  Link,
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

type FieldsWithContentTypeId = FieldsWithContentTypeIdType<Fields>

const data: EntryCollection<FieldsWithContentTypeId, 'WITHOUT_LINK_RESOLUTION'> = {
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
  FieldsWithContentTypeId,
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

expectType<EntryCollection<FieldsWithContentTypeId, undefined>>(client.parseEntries(data))
expectType<EntryCollection<FieldsWithContentTypeId, undefined>>(
  client.parseEntries<FieldsWithContentTypeId>(data)
)

expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries(data)
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries<FieldsWithContentTypeId>(data)
)

expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries(data)
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries<FieldsWithContentTypeId>(data)
)

expectType<EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries(dataWithAllLocales)
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES'>>(
  client.withAllLocales.parseEntries<FieldsWithContentTypeId>(dataWithAllLocales)
)
expectType<EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries<FieldsWithContentTypeId, Locales>(dataWithAllLocales)
)

expectType<
  EntryCollection<
    FieldsWithContentTypeId,
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    Locales
  >
>(client.withAllLocales.withoutUnresolvableLinks.parseEntries(dataWithAllLocales))
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>
>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<FieldsWithContentTypeId>(
    dataWithAllLocales
  )
)
expectType<
  EntryCollection<
    FieldsWithContentTypeId,
    'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS',
    Locales
  >
>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<FieldsWithContentTypeId, Locales>(
    dataWithAllLocales
  )
)

expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>
>(client.withAllLocales.withoutLinkResolution.parseEntries(dataWithAllLocales))
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>
>(
  client.withAllLocales.withoutLinkResolution.parseEntries<FieldsWithContentTypeId>(
    dataWithAllLocales
  )
)
expectType<
  EntryCollection<FieldsWithContentTypeId, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>
>(
  client.withAllLocales.withoutLinkResolution.parseEntries<FieldsWithContentTypeId, Locales>(
    dataWithAllLocales
  )
)
