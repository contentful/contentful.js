/* @flow */
import test from 'tape'
import {assign} from 'lodash/object'
import {cloneDeep} from 'lodash/lang'
import {sysMock, linkMock} from '../mocks'

import {wrapEntry, wrapEntryCollection} from '../../../lib/entities/entry'

const entry = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Entry',
    contentType: assign(cloneDeep(linkMock), {linkType: 'ContentType'}),
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

test('Entry is wrapped', t => {
  const wrappedEntry = wrapEntry(entry)
  t.looseEqual(wrappedEntry.toPlainObject(), entry)
  t.end()
})

test('Entry collection is wrapped', t => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      entry
    ]
  }
  const wrappedEntry = wrapEntryCollection(entryCollection)
  t.looseEqual(wrappedEntry.toPlainObject(), entryCollection)
  t.end()
})
