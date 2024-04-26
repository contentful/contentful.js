import { makeClient } from '../../lib/make-client'
import { createGlobalOptions } from '../../lib/create-global-options'
import { EntrySys, EntryCollection, EntrySkeletonType, EntryFieldTypes } from '../../lib/types'

interface AnimalTypeFields {
  animal?: EntryFieldTypes.EntryLink<EntrySkeletonType>
  metadata?: EntryFieldTypes.EntryLink<EntrySkeletonType>
  anotheranimal?: EntryFieldTypes.EntryLink<EntrySkeletonType>
}

type AnimalTypeSkeleton = EntrySkeletonType<AnimalTypeFields>

export interface XspaceTypeFields {
  xspace?: EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<EntrySkeletonType>>
  xspace2?: EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<EntrySkeletonType>>
}

type XspaceTypeSkeleton = EntrySkeletonType<XspaceTypeFields>

const pigEntry = {
  sys: {
    type: 'Entry',
    id: 'oink',
    locale: 'en-US',
  },
  fields: {
    name: 'Pig',
    friend: {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: 'groundhog',
      },
    },
  },
}

test('Given json should be parsed correctly as a collection of entries', () => {
  const api = makeClient({
    // @ts-ignore
    http: {},
    // @ts-ignore
    getGlobalOptions: createGlobalOptions({ resolveLinks: true }),
  })

  const data: EntryCollection<AnimalTypeSkeleton, 'WITHOUT_LINK_RESOLUTION'> = {
    total: 1,
    skip: 0,
    limit: 1,
    items: [
      {
        sys: {
          type: 'Entry',
          locale: 'en-US',
        } as EntrySys,
        metadata: {
          tags: [],
        },
        fields: {
          animal: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'oink',
            },
          },
          anotheranimal: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'middle-parrot',
            },
          },
        },
      },
    ],
    includes: {
      Entry: [pigEntry],
    },
  }
  const parsedData = api.parseEntries(data)
  expect(parsedData).toBeDefined()
  expect(parsedData.items[0].fields.animal?.sys).toEqual(pigEntry.sys)
})

test('Given json should be parsed correctly as a collection of entries where a field is called metadata', () => {
  const api = makeClient({
    // @ts-ignore
    http: {},
    // @ts-ignore
    getGlobalOptions: createGlobalOptions({ resolveLinks: true }),
  })
  const data: EntryCollection<AnimalTypeSkeleton, 'WITHOUT_LINK_RESOLUTION'> = {
    total: 1,
    skip: 0,
    limit: 1,
    items: [
      {
        sys: {
          type: 'Entry',
          locale: 'en-US',
        } as EntrySys,
        fields: {
          metadata: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'oink',
            },
          },
          anotheranimal: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'middle-parrot',
            },
          },
        },
        metadata: {
          tags: [
            {
              sys: {
                type: 'Link',
                linkType: 'Tag',
                id: 'tagId',
              },
            },
          ],
        },
      },
    ],
    includes: {
      Entry: [pigEntry],
    },
  }
  const parsedData = api.parseEntries<any>(data)
  expect(parsedData).toBeDefined()
  expect(parsedData.items[0].fields.metadata).toHaveProperty('sys', pigEntry.sys)
})

test('Given json should be parsed correctly as a collection of entries with resource links', () => {
  const api = makeClient({
    // @ts-ignore
    http: {},
    // @ts-ignore
    getGlobalOptions: createGlobalOptions({ resolveLinks: false }),
  })

  const data: EntryCollection<XspaceTypeSkeleton, 'WITHOUT_LINK_RESOLUTION'> = {
    total: 1,
    skip: 0,
    limit: 1,
    items: [
      {
        sys: {
          type: 'Entry',
        } as EntrySys,
        metadata: {
          tags: [],
        },
        fields: {
          xspace: [
            {
              sys: {
                type: 'ResourceLink',
                linkType: 'Contentful:Entry',
                urn: 'crn:test:::content:spaces/0i1ksbf51zos/entries/U4X2TI5qzC0w6Rk947mdX',
              },
            },
          ],
          xspace2: [
            {
              sys: {
                type: 'ResourceLink',
                linkType: 'Contentful:Entry',
                urn: 'crn:test:::content:spaces/8kouir73nbuz/entries/BfmNpEsQSFuh2lybiVkoq',
              },
            },
            {
              sys: {
                type: 'ResourceLink',
                linkType: 'Contentful:Entry',
                urn: 'crn:test:::content:spaces/kdtd0watvk6m/entries/irF9JXBHqNhwMwelu9HYt',
              },
            },
          ],
        },
      },
    ],
  }

  const parsedData = api.parseEntries(data)
  expect(parsedData).toBeDefined()
  expect(parsedData.items[0].fields.xspace?.[0].sys).toEqual(data.items[0].fields.xspace?.[0].sys)
  expect(parsedData.items[0].fields.xspace2?.[0].sys).toEqual(data.items[0].fields.xspace2?.[0].sys)
  expect(parsedData.items[0].fields.xspace2?.[1].sys).toEqual(data.items[0].fields.xspace2?.[1].sys)
})
