import copy from 'fast-copy'
import { Asset, ContentType, ContentTypeLink, Entry, EnvironmentLink, Locale, Sys } from '../../lib'

/*
const linkMock = {
  id: 'linkid',
  type: 'Link',
  linkType: 'linkType',
}
const spaceLinkMock: SpaceLink = {
  type: 'Link',
  linkType: 'Space',
  id: 'mySpace',
}
 */

const contentTypeLinkMock: ContentTypeLink = {
  type: 'Link',
  linkType: 'ContentType',
  id: 'myContentType',
}

const environmentLinkMock: EnvironmentLink = {
  id: 'master',
  linkType: 'Environment',
  type: 'Link',
}

const sysMock: Sys = {
  type: 'Type',
  id: 'id',
  createdAt: 'createdatdate',
  updatedAt: 'updatedatdate',
  revision: 1,
  locale: 'en',
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
  ],
}

export type EntryFields = {
  field1: string
}

const entryMock: Entry<EntryFields> = {
  sys: {
    ...copy(sysMock),
    type: 'Entry',
    locale: 'locale',
  },
  fields: {
    field1: 'str',
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

export { sysMock, contentTypeMock, entryMock, assetMock, localeMock }
