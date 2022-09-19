import { AssetKey } from './../../lib/types/asset-key'
import { TagLink, UserLink } from './../../lib/types/link'
import copy from 'fast-copy'
import {
  Asset,
  ContentType,
  ContentTypeLink,
  Entry,
  EnvironmentLink,
  Locale,
  EntrySys,
  SpaceLink,
  EntryFields,
  Tag,
  TagSys,
} from '../../lib'

const date: EntryFields.Date = '2018-05-03T09:18:16.329Z'

const spaceLinkMock: SpaceLink = {
  type: 'Link',
  linkType: 'Space',
  id: 'mySpace',
}

const contentTypeLinkMock: ContentTypeLink = {
  type: 'Link',
  linkType: 'ContentType',
  id: 'myContentType',
}

const environmentLinkMock: EnvironmentLink = {
  type: 'Link',
  linkType: 'Environment',
  id: 'master',
}

const tagLinkMock: TagLink = {
  type: 'Link',
  linkType: 'Tag',
  id: 'myTag',
}

const userLinkMock: UserLink = {
  type: 'Link',
  linkType: 'User',
  id: 'myUser',
}

const tagSysMock: TagSys = {
  type: 'Tag',
  id: 'id',
  createdAt: date,
  updatedAt: date,
  version: 1,
  visibility: 'public',
  createdBy: { sys: copy(userLinkMock) },
  updatedBy: { sys: copy(userLinkMock) },
  space: { sys: copy(spaceLinkMock) },
  environment: { sys: copy(environmentLinkMock) },
}

// TODO make more generic
const sysMock: EntrySys = {
  type: 'Entry',
  id: 'id',
  createdAt: date,
  updatedAt: date,
  revision: 1,
  locale: 'en',
  space: { sys: copy(spaceLinkMock) },
  contentType: { sys: copy(contentTypeLinkMock) },
  environment: { sys: copy(environmentLinkMock) },
}

const contentTypeMock: ContentType = {
  sys: Object.assign(copy(sysMock), {
    type: 'ContentType',
  }),
  name: 'name',
  description: 'desc',
  displayField: 'displayfield',
  fields: [
    {
      id: 'fieldid',
      name: 'fieldname',
      type: 'Text',
      localized: true,
      required: false,
      disabled: false,
      omitted: false,
      validations: [],
    },
    {
      id: 'resourceLinkArray',
      name: 'resource link array',
      type: 'Array',
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
      items: {
        type: 'ResourceLink',
        validations: [],
      },
      allowedResources: [
        {
          type: 'Contentful:Entry',
          source: 'crn:test:::content:spaces/ywdl9lsbthy5',
          contentTypes: ['termsAndConditions', 'sla'],
        },
        {
          type: 'Contentful:Entry',
          source: 'crn:test:::content:spaces/u57131yuvvgb',
          contentTypes: ['oneTime', 'plan'],
        },
      ],
    },
  ],
}

export type EntryFields = {
  field1: string
}

const entryMock: Entry<EntryFields> = {
  sys: {
    ...copy(sysMock),
    locale: 'locale',
  },
  fields: {
    field1: 'str',
  },
  metadata: {
    tags: [{ sys: copy(tagLinkMock) }],
  },
}

const assetMock: Asset = {
  sys: {
    ...copy(sysMock),
    type: 'Asset',
    locale: 'locale',
  },
  fields: {
    title: 'assetTitle',
    description: 'assetDescription',
    file: {
      url: 'assetUrl',
      details: {
        size: 1000,
      },
      fileName: 'assetFileName',
      contentType: 'assetContentType',
    },
  },
  metadata: {
    tags: [],
  },
}

const localeMock: Locale = {
  sys: {
    id: 'id',
    type: 'Locale',
    version: 1,
  },
  default: true,
  fallbackCode: null,
  name: 'English. United State',
  code: 'en-US',
}

const tagMock: Tag = {
  name: 'mock tag',
  sys: copy(tagSysMock),
}

const assetKeyMock: AssetKey = {
  policy:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE6MSJ9.eyJleHAiOjE2MTIyODE0MTEsInN1YiI6Inl6MjJwOGZzeGhpNiIsImF1ZCI6ImFkbiIsImp0aSI6ImQ1NWI2YmM1LTkyMGEtNDRjNi1hNmQ0LTM0YzRhYmIyYjdkNiIsImN0Zjp1bnB1YiI6dHJ1ZX0',
  secret: '-jE6hqytutc_dygbjShVq0PijvDn80SdT0EWD1mNHgc',
}

const entryWithResourceLinksMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'Entry',
    contentType: Object.assign(copy(spaceLinkMock), { linkType: 'ContentType' }),
    locale: 'locale',
  }),
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
  metadata: {
    tags: [],
  },
}

export {
  sysMock,
  contentTypeMock,
  entryMock,
  assetMock,
  localeMock,
  tagMock,
  assetKeyMock,
  entryWithResourceLinksMock,
}
