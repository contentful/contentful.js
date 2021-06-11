import test from 'blue-tape'
import { tagMock } from '../mocks'
import { wrapTag, wrapTagCollection } from '../../../lib/entities/tag'

test('Tag is wrapped', (t) => {
  const wrappedTag = wrapTag(tagMock)
  t.looseEqual(wrappedTag.toPlainObject(), tagMock)
  t.end()
})

test('Tag collection is wrapped', (t) => {
  const tagCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      tagMock
    ]
  }
  const wrappedTag = wrapTagCollection(tagCollection)
  t.looseEqual(wrappedTag.toPlainObject(), tagCollection)
  t.end()
})
