import cloneDeep from 'lodash/cloneDeep'

const linkMock = {
  id: 'linkid',
  type: 'Link',
  linkType: 'linkType'
}

const sysMock = {
  type: 'Type',
  id: 'id',
  space: cloneDeep(linkMock),
  createdAt: 'createdatdate',
  updatedAt: 'updatedatdate',
  revision: 1
}

const contentTypeMock = {
  sys: Object.assign(cloneDeep(sysMock), {
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
  sys: Object.assign(cloneDeep(sysMock), {
    type: 'Entry',
    contentType: Object.assign(cloneDeep(linkMock), {linkType: 'ContentType'}),
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

const assetMock = {
  sys: Object.assign(cloneDeep(sysMock), {
    type: 'Asset',
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

const localeMock = {
  sys: Object.assign(cloneDeep(sysMock), {
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
