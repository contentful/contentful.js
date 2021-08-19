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

const assetKeyMock = {
  policy:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE6MSJ9.eyJleHAiOjE2MTIyODE0MTEsInN1YiI6Inl6MjJwOGZzeGhpNiIsImF1ZCI6ImFkbiIsImp0aSI6ImQ1NWI2YmM1LTkyMGEtNDRjNi1hNmQ0LTM0YzRhYmIyYjdkNiIsImN0Zjp1bnB1YiI6dHJ1ZX0',
  secret: '-jE6hqytutc_dygbjShVq0PijvDn80SdT0EWD1mNHgc'
}

const localeMock = {
  sys: Object.assign(copy(sysMock), {
    type: 'Locale'
  }),
  name: 'English. United State',
  code: 'en-US'
}

const tagMock = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'ezs1swce23xe'
      }
    },
    id: 'publicTag1',
    type: 'Tag',
    createdAt: '2021-02-11T14:44:48.594Z',
    updatedAt: '2021-02-11T14:44:48.594Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment'
      }
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '1a9rUrb3AjDqTxUGOYxBDe'
      }
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '1a9rUrb3AjDqTxUGOYxBDe'
      }
    },
    version: 1,
    visibility: 'public'
  },
  name: 'mock tag'
}

export {
  linkMock,
  sysMock,
  contentTypeMock,
  entryMock,
  assetMock,
  assetKeyMock,
  localeMock,
  tagMock
}
