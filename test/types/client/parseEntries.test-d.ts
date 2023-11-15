import { expectType } from 'tsd'
import {
  createClient,
  EntryCollection,
  EntrySys,
  EntrySkeletonType,
  EntryFieldTypes,
} from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type Fields = {
  title: EntryFieldTypes.Symbol
  link: EntryFieldTypes.EntryLink<EntrySkeletonType>
  moreLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>
}

type EntrySkeleton = EntrySkeletonType<Fields>

const data: EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'> = {
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
  EntrySkeleton,
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

expectType<EntryCollection<EntrySkeleton, undefined>>(client.parseEntries(data))
expectType<EntryCollection<EntrySkeleton, undefined>>(client.parseEntries<EntrySkeleton>(data))

expectType<EntryCollection<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries(data),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withoutUnresolvableLinks.parseEntries<EntrySkeleton>(data),
)

expectType<EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries(data),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  client.withoutLinkResolution.parseEntries<EntrySkeleton>(data),
)

expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries(dataWithAllLocales),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES'>>(
  client.withAllLocales.parseEntries<EntrySkeleton>(dataWithAllLocales),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES', Locales>>(
  client.withAllLocales.parseEntries<EntrySkeleton, Locales>(dataWithAllLocales),
)

expectType<
  EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>
>(client.withAllLocales.withoutUnresolvableLinks.parseEntries(dataWithAllLocales))
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<EntrySkeleton>(dataWithAllLocales),
)
expectType<
  EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>
>(
  client.withAllLocales.withoutUnresolvableLinks.parseEntries<EntrySkeleton, Locales>(
    dataWithAllLocales,
  ),
)

expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>>(
  client.withAllLocales.withoutLinkResolution.parseEntries(dataWithAllLocales),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  client.withAllLocales.withoutLinkResolution.parseEntries<EntrySkeleton>(dataWithAllLocales),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>>(
  client.withAllLocales.withoutLinkResolution.parseEntries<EntrySkeleton, Locales>(
    dataWithAllLocales,
  ),
)
