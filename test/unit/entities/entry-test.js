import test from 'blue-tape'
import cloneDeep from 'lodash/cloneDeep'

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

  const wrappedCollection = wrapEntryCollection(entryCollection, {resolveLinks: true})
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

test('Entry collection with circular references are decycled and stringified safely', (t) => {
  const entry1 = cloneDeep(entryMock)
  const entry2 = cloneDeep(entryMock)
  const entry3 = cloneDeep(entryMock)

  entry1.sys.id = 'entry1'
  entry2.sys.id = 'entry2'
  entry3.sys.id = 'entry3'

  // set up circular structure:
  // entry1 -> entry2, entry 3
  // entry2 -> entry1
  // entry3 -> entry1

  entry1.fields.entry2link = {
    sys: {
      id: 'entry2',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  entry1.fields.entry3link = {
    sys: {
      id: 'entry3',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  entry2.fields.linked = {
    sys: {
      id: 'entry1',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  entry3.fields.linked = {
    sys: {
      id: 'entry1',
      type: 'Link',
      linkType: 'Entry'
    }
  }

  // define entry collection
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      entry1,
      entry2
    ],
    includes: {
      Entry: [ entry3 ]
    }
  }

  // circular entries will be replaced in decycle procedure
  const replacedEntry1 = { sys: { type: 'Link', linkType: 'Entry', id: 'entry1', circular: true } }
  const replacedEntry2 = { sys: { type: 'Link', linkType: 'Entry', id: 'entry2', circular: true } }
  const replacedEntry3 = { sys: { type: 'Link', linkType: 'Entry', id: 'entry3', circular: true } }

  const wrappedCollection = wrapEntryCollection(entryCollection, {resolveLinks: true})
  const safelystringed = wrappedCollection.stringifySafe()

  t.ok(safelystringed, 'safely stringify completes')
  const parsed = JSON.parse(safelystringed)

  t.deepEquals(parsed.items[0].fields.entry2link.fields.linked, replacedEntry1, 'first circular link replaced correctly in nested fields')
  t.deepEquals(parsed.items[0].fields.entry3link.fields.linked, replacedEntry1, 'second circular link replaced correctly in nested fields')
  t.deepEquals(parsed.items[1], replacedEntry2, 'circular link replaced correctly in items list')
  t.deepEquals(parsed.includes.Entry[0], replacedEntry3, 'circular link replaced correctly in includes')
  t.end()
})
