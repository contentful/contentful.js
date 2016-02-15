/* @flow */
import test from 'tape'
import {cloneDeep} from 'lodash/lang'

import {entryMock} from '../mocks'
import {wrapEntry, wrapEntryCollection} from '../../../lib/entities/entry'

test('Entry is wrapped', t => {
  const wrappedEntry = wrapEntry(entryMock)
  t.looseEqual(wrappedEntry.toPlainObject(), entryMock)
  t.end()
})

test('Entry collection is wrapped', t => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      entryMock
    ],
    includes: {
      Entry: []
    }
  }
  const wrappedEntry = wrapEntryCollection(entryCollection)
  t.looseEqual(wrappedEntry.toPlainObject(), entryCollection)
  t.end()
})
