import test from 'tape'
import cloneDeep from 'clone'

import {sysMock} from '../mocks'
import {wrapContentType, wrapContentTypeCollection} from '../../../lib/entities/content-type'

const contentType = {
  sys: Object.assign(cloneDeep(sysMock), {
    type: 'ContentType'
  }),
  name: 'ct',
  description: 'this is a ct',
  displayField: 'fieldname',
  fields: [
    {id: 'fieldname', name: 'field name', type: 'Text', localized: false, required: false}
  ]
}

test('ContentType is wrapped', (t) => {
  const wrappedContentType = wrapContentType(contentType)
  t.looseEqual(wrappedContentType.toPlainObject(), contentType)
  t.end()
})

test('ContentType collection is wrapped', (t) => {
  const contentTypeCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      contentType
    ]
  }
  const wrappedContentType = wrapContentTypeCollection(contentTypeCollection)
  t.looseEqual(wrappedContentType.toPlainObject(), contentTypeCollection)
  t.end()
})
