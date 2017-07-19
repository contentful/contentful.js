import test from 'tape'
import cloneDeep from 'clone'

import {entryMock, assetMock} from '../mocks'
import {wrapEntry, wrapEntryCollection} from '../../../lib/entities/entry'

test('Entry is wrapped', (t) => {
  const wrappedEntry = wrapEntry(entryMock)
  t.looseEqual(wrappedEntry.toPlainObject(), entryMock)
  t.end()
})

test('Localized entry is wrapped', (t) => {
  const entry = cloneDeep(entryMock)
  const field = entry.fields.field1
  entry.fields = {
    en: {
      field1: field
    }
  }
  const wrappedEntry = wrapEntry(entry)
  t.looseEqual(wrappedEntry.toPlainObject(), entry)
  t.end()
})

test('Entry collection is wrapped', (t) => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      entryMock
    ]
  }
  const wrappedEntry = wrapEntryCollection(entryCollection, true)
  t.looseEqual(wrappedEntry.toPlainObject(), entryCollection)
  t.end()
})

test('Entry collection links are resolved', (t) => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      cloneDeep(entryMock),
      cloneDeep(entryMock)
    ],
    includes: {
      Entry: [ cloneDeep(entryMock) ],
      Asset: [ cloneDeep(assetMock) ]
    }
  }
  // setup first entry
  entryCollection.items[0].sys.id = 'entry1'
  entryCollection.items[0].fields.linked1 = {
    sys: {
      id: 'asset1',
      type: 'Link',
      linkType: 'Asset'
    }
  }
  entryCollection.items[0].fields.linked2 = {
    sys: {
      id: 'entry3',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  // setup first linked entry
  entryCollection.includes.Asset[0].sys.id = 'asset1'
  // setup second linked entry
  entryCollection.items[1].sys.id = 'entry3'
  entryCollection.items[1].fields.linked1 = {
    sys: {
      id: 'entry4',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  entryCollection.includes.Entry[0].sys.id = 'entry4'
  entryCollection.includes.Entry[0].fields.linked1 = {
    sys: {
      id: 'entry3',
      type: 'Link',
      linkType: 'Entry'
    }
  }

  const wrappedCollection = wrapEntryCollection(entryCollection, true)
  const wrappedEntry = wrappedCollection.toPlainObject()

  // first linked entry resolved from includes
  t.equals(wrappedEntry.items[0].fields.linked1.sys.type, 'Asset', 'first linked entity is resolved')
  t.ok(wrappedEntry.items[0].fields.linked1.fields, 'first linked entity has fields')
  // second linked entry resolved from items list
  t.equals(wrappedEntry.items[0].fields.linked2.sys.type, 'Entry', 'second linked entity is resolved')
  t.ok(wrappedEntry.items[0].fields.linked2.fields, 'second linked entity has fields')
  t.equals(wrappedEntry.items[1].fields.linked1.sys.type, 'Entry', 'third linked entity is resolved')
  t.ok(wrappedEntry.items[1].fields.linked1.fields, 'third linked entity has fields')
  t.ok(wrappedCollection.stringifySafe(), 'stringifies safely')
  t.end()
})
