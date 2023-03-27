import * as contentful from '../../lib/contentful'
import { EntryFieldTypes, EntrySkeletonType, Link } from '../../lib/types'
import { EntryCollection } from '../../lib/types/entry'
import { params } from './utils'

interface TypeCatFields {
  name: EntryFieldTypes.Text
  likes?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  color?: EntryFieldTypes.Symbol
  bestFriend?: EntryFieldTypes.EntryLink<EntrySkeletonType>
  birthday?: EntryFieldTypes.Date
  lifes?: EntryFieldTypes.Integer
  lives?: EntryFieldTypes.Integer
  image?: EntryFieldTypes.AssetLink
}

export type TypeCatSkeleton = EntrySkeletonType<TypeCatFields, 'cat'>

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

let dataWithResolvableLink = {} as EntryCollection<TypeCatSkeleton, 'WITHOUT_LINK_RESOLUTION'>
let dataWithResolvableLinkAndAllLocales = {} as EntryCollection<
  TypeCatSkeleton,
  'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
  'en-US' | 'tlh'
>
let dataWithUnresolvableLink = {} as EntryCollection<TypeCatSkeleton, 'WITHOUT_LINK_RESOLUTION'>
let dataWithUnresolvableLinkAndAllLocales = {} as EntryCollection<
  TypeCatSkeleton,
  'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION',
  'en-US' | 'tlh'
>

const resolvedHappyCatEntry = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'happycat',
    type: 'Entry',
    createdAt: '2018-02-26T14:19:51.031Z',
    updatedAt: '2018-02-26T14:21:57.199Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 2,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
    locale: 'en-US',
  },
  fields: {
    name: 'Happy Cat',
    likes: ['cheezburger'],
    color: 'gray',
    bestFriend: { sys: { type: 'Link', linkType: 'Entry', id: 'nyancat' } },
    birthday: '2003-10-28T23:00:00+00:00',
    lives: 1,
    image: { sys: { type: 'Link', linkType: 'Asset', id: 'happycat' } },
  },
}

const resolvedHappyCatEntryAllLocales = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'happycat',
    type: 'Entry',
    createdAt: '2018-02-26T14:19:51.031Z',
    updatedAt: '2018-02-26T14:21:57.199Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 2,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
    locale: 'en-US',
  },
  fields: {
    name: {
      'en-US': 'Happy Cat',
    },
    likes: {
      'en-US': ['cheezburger'],
    },
    color: {
      'en-US': 'gray',
    },
    bestFriend: {
      'en-US': { sys: { type: 'Link', linkType: 'Entry', id: 'nyancat' } },
    },
    birthday: {
      'en-US': '2003-10-28T23:00:00+00:00',
    },
    lives: {
      'en-US': 1,
    },
    image: {
      'en-US': { sys: { type: 'Link', linkType: 'Asset', id: 'happycat' } },
    },
  },
}

const resolvedHappyCatAsset = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'happycat',
    type: 'Asset',
    createdAt: '2018-02-26T15:25:58.703Z',
    updatedAt: '2018-02-26T15:25:58.703Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 1,
    locale: 'en-US',
  },
  fields: {
    title: 'happycat',
    file: {
      url: '//images.ctfassets.net/ezs1swce23xe/happycat/9fba4eee22e443f29307aa17f42b61fe/happycatw.jpg',
      details: { size: 59939, image: { width: 273, height: 397 } },
      fileName: 'happycatw.jpg',
      contentType: 'image/jpeg',
    },
  },
}

const resolvedNyanCatAsset = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'nyancat',
    type: 'Asset',
    createdAt: '2018-02-26T15:24:53.213Z',
    updatedAt: '2018-02-26T15:25:05.238Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 2,
    locale: 'en-US',
  },
  fields: {
    title: 'Nyan Cat',
    file: {
      url: '//images.ctfassets.net/ezs1swce23xe/nyancat/374b77c88da7bdcff898120dace765f9/Nyan_cat_250px_frame.png',
      details: { size: 12273, image: { width: 250, height: 250 } },
      fileName: 'Nyan_cat_250px_frame.png',
      contentType: 'image/png',
    },
  },
}

const resolvedHappyCatAssetAllLocales = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'happycat',
    type: 'Asset',
    createdAt: '2018-02-26T15:25:58.703Z',
    updatedAt: '2018-02-26T15:25:58.703Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 1,
    locale: 'en-US',
  },
  fields: {
    title: {
      'en-US': 'happycat',
    },
    file: {
      'en-US': {
        url: '//images.ctfassets.net/ezs1swce23xe/happycat/9fba4eee22e443f29307aa17f42b61fe/happycatw.jpg',
        details: { size: 59939, image: { width: 273, height: 397 } },
        fileName: 'happycatw.jpg',
        contentType: 'image/jpeg',
      },
    },
  },
}

const resolvedNyanCatAssetAllLocales = {
  metadata: { tags: [] },
  sys: {
    space: {
      sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
    },
    id: 'nyancat',
    type: 'Asset',
    createdAt: '2018-02-26T15:24:53.213Z',
    updatedAt: '2018-02-26T15:25:05.238Z',
    environment: {
      sys: { id: 'master', type: 'Link', linkType: 'Environment' },
    },
    revision: 2,
    locale: 'en-US',
  },
  fields: {
    title: {
      'en-US': 'Nyan Cat',
    },
    file: {
      'en-US': {
        url: '//images.ctfassets.net/ezs1swce23xe/nyancat/374b77c88da7bdcff898120dace765f9/Nyan_cat_250px_frame.png',
        details: { size: 12273, image: { width: 250, height: 250 } },
        fileName: 'Nyan_cat_250px_frame.png',
        contentType: 'image/png',
      },
    },
  },
}

beforeEach(() => {
  dataWithResolvableLink = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
          },
          id: 'nyancat',
          type: 'Entry',
          createdAt: '2018-02-26T14:19:51.680Z',
          updatedAt: '2018-02-26T14:21:57.766Z',
          environment: {
            sys: { id: 'master', type: 'Link', linkType: 'Environment' },
          },
          revision: 2,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
          locale: 'en-US',
        },
        fields: {
          name: 'Nyan Cat',
          likes: ['rainbows', 'fish'],
          color: 'rainbow',
          bestFriend: { sys: { type: 'Link', linkType: 'Entry', id: 'happycat' } },
          birthday: '2011-04-04T22:00:00Z',
          lives: 1337,
          image: { sys: { type: 'Link', linkType: 'Asset', id: 'nyancat' } },
        },
      },
    ],
    includes: {
      Entry: [resolvedHappyCatEntry],
      Asset: [resolvedHappyCatAsset, resolvedNyanCatAsset],
    },
  }
  dataWithResolvableLinkAndAllLocales = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
          },
          id: '4SEhTg8sYJ1H3wDAinzhTp',
          type: 'Entry',
          createdAt: '2021-04-15T12:27:36.723Z',
          updatedAt: '2021-04-15T12:27:36.723Z',
          environment: {
            sys: { id: 'master', type: 'Link', linkType: 'Environment' },
          },
          revision: 1,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
          locale: 'en-US',
        },
        fields: {
          name: {
            'en-US': 'CatWithUnpublishedFriend',
            tlh: 'CatWithUnpublishedFriend',
          },
          likes: {
            'en-US': ['dogs'],
          },
          color: {
            'en-US': 'black',
          },
          bestFriend: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: 'happycat',
              },
            },
          },
          birthday: {
            'en-US': '2020-07-02T00:00:00Z',
          },
          lives: {
            'en-US': 9,
          },
          image: {
            'en-US': { sys: { type: 'Link', linkType: 'Asset', id: 'happycat' } },
          },
        },
      },
    ],
    includes: {
      Entry: [resolvedHappyCatEntryAllLocales],
      Asset: [resolvedHappyCatAssetAllLocales, resolvedNyanCatAssetAllLocales],
    },
  }
  dataWithUnresolvableLink = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
          },
          id: '4SEhTg8sYJ1H3wDAinzhTp',
          type: 'Entry',
          createdAt: '2021-04-15T12:27:36.723Z',
          updatedAt: '2021-04-15T12:27:36.723Z',
          environment: {
            sys: { id: 'master', type: 'Link', linkType: 'Environment' },
          },
          revision: 1,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
          locale: 'en-US',
        },
        fields: {
          name: 'CatWithUnpublishedFriend',
          likes: ['dogs'],
          color: 'black',
          bestFriend: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: '6SiPbntBPYYjnVHmipxJBF',
            },
          },
          birthday: '2020-07-02T00:00:00Z',
          lives: 9,
          image: { sys: { type: 'Link', linkType: 'Asset', id: 'happycat' } },
        },
      },
    ],
    errors: [
      {
        sys: { id: 'notResolvable', type: 'error' },
        details: { type: 'Link', linkType: 'Entry', id: '6SiPbntBPYYjnVHmipxJBF' },
      },
    ],
    includes: {
      Asset: [resolvedHappyCatAsset],
    },
  }
  dataWithUnresolvableLinkAndAllLocales = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: 'Link', linkType: 'Space', id: 'ezs1swce23xe' },
          },
          id: '4SEhTg8sYJ1H3wDAinzhTp',
          type: 'Entry',
          createdAt: '2021-04-15T12:27:36.723Z',
          updatedAt: '2021-04-15T12:27:36.723Z',
          environment: {
            sys: { id: 'master', type: 'Link', linkType: 'Environment' },
          },
          revision: 1,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'cat' } },
          locale: 'en-US',
        },
        fields: {
          name: {
            'en-US': 'CatWithUnpublishedFriend',
            tlh: 'CatWithUnpublishedFriend',
          },
          likes: {
            'en-US': ['dogs'],
          },
          color: {
            'en-US': 'black',
          },
          bestFriend: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: '6SiPbntBPYYjnVHmipxJBF',
              },
            },
          },
          birthday: {
            'en-US': '2020-07-02T00:00:00Z',
          },
          lives: {
            'en-US': 9,
          },
          image: {
            'en-US': { sys: { type: 'Link', linkType: 'Asset', id: 'happycat' } },
          },
        },
      },
    ],
    errors: [
      {
        sys: { id: 'notResolvable', type: 'error' },
        details: { type: 'Link', linkType: 'Entry', id: '6SiPbntBPYYjnVHmipxJBF' },
      },
    ],
    includes: {
      Asset: [resolvedHappyCatAssetAllLocales],
    },
  }
})

describe('parseEntries via chained clients', () => {
  describe('default client', () => {
    test('client', () => {
      const response = client.parseEntries(dataWithResolvableLink)

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend?.sys.type).toBe('Entry')
      expect(response.items[0].fields.color).toBe('rainbow')
      expect(response.items[0].fields.color?.['en-US']).not.toBeDefined()
    })
  })

  describe('client has withoutUnresolvableLinks modifier', () => {
    test('client.withoutUnresolvableLinks', () => {
      const response = client.withoutUnresolvableLinks.parseEntries(dataWithUnresolvableLink)

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend).toBeUndefined()
    })
  })

  describe('client has withAllLocales modifier', () => {
    test('client.withAllLocales', () => {
      const response = client.withAllLocales.parseEntries(dataWithResolvableLinkAndAllLocales)

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.name).toHaveProperty('tlh')
      expect(response.items[0].fields.bestFriend?.['en-US']?.sys.type).not.toBe('Link')
    })

    test('client.withAllLocales.withoutLinkResolution', () => {
      const response = client.withAllLocales.withoutLinkResolution.parseEntries(
        dataWithResolvableLinkAndAllLocales
      )
      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.name).toHaveProperty('tlh')
      expect(response.items[0].fields.bestFriend?.['en-US']?.sys.type).toBe('Link')
    })

    test('client.withAllLocales.withoutUnresolvableLinks', () => {
      const response = client.withAllLocales.withoutUnresolvableLinks.parseEntries(
        dataWithUnresolvableLinkAndAllLocales
      )

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.name).toHaveProperty('tlh')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend).toEqual({})
    })
  })

  describe('client has withoutLinkResolution modifier', () => {
    test('client.withoutLinkResolution', () => {
      const response = client.withoutLinkResolution.parseEntries(dataWithResolvableLink)

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend?.sys.type).toBe('Link')
    })
  })
})
