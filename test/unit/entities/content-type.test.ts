import copy from 'fast-copy'

import { sysMock } from '../mocks'
import { wrapContentType, wrapContentTypeCollection } from '../../../lib/entities/content-type'

const contentType = {
  sys: Object.assign(copy(sysMock), {
    type: 'ContentType'
  }),
  name: 'ct',
  description: 'this is a ct',
  displayField: 'fieldname',
  fields: [
    {
      id: 'fieldname',
      name: 'field name',
      type: 'Text',
      localized: false,
      required: false
    }
  ]
}

test('ContentType is wrapped', () => {
  const wrappedContentType = wrapContentType(contentType)
  expect(wrappedContentType.toPlainObject()).toEqual(contentType)
})

test('ContentType collection is wrapped', () => {
  const contentTypeCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      contentType
    ]
  }
  const wrappedContentType = wrapContentTypeCollection(contentTypeCollection)
  expect(wrappedContentType.toPlainObject()).toEqual(contentTypeCollection)
})
