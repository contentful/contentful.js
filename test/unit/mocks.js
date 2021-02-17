import copy from 'fast-copy'

const linkMock = {
  id: 'linkid',
  type: 'Link',
  linkType: 'linkType'
}

const sysMock = {
  type: 'Type',
  id: 'id',
  space: copy(linkMock),
  createdAt: 'createdatdate',
  updatedAt: 'updatedatdate',
  revision: 1
}

const contentTypeMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'ContentType'
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
      required: false
    }
  ]
}

const entryMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'Entry',
    contentType: Object.assign(copy(linkMock), { linkType: 'ContentType' }),
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  },
  metadata: {
    tags: [{ type: 'Link', linkType: 'Tag', id: 'sample-tag-id' }]
  }
}

const assetMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'Asset',
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  },
  metadata: {
    tags: []
  }
}

const localeMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'Locale'
  }),
  name: 'English. United State',
  code: 'en-US'
}

export {
  linkMock,
  sysMock,
  contentTypeMock,
  entryMock,
  assetMock,
  localeMock
}
