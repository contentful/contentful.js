import test from 'blue-tape'
import copy from 'fast-copy'

import { entryMock, assetMock } from '../mocks'
import { wrapEntry, wrapEntryCollection } from '../../../lib/entities/entry'

test('Entry is wrapped', () => {
  const wrappedEntry = wrapEntry(entryMock)
  expect(wrappedEntry.toPlainObject()).toEqual(entryMock)
})

test('Localized entry is wrapped', () => {
  const entry = copy(entryMock)
  const field = entry.fields.field1
  entry.fields = {
    en: {
      field1: field
    }
  }
  const wrappedEntry = wrapEntry(entry)
  expect(wrappedEntry.toPlainObject()).toEqual(entry)
})

test('Entry collection is wrapped', () => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      entryMock
    ]
  }
  const wrappedEntry = wrapEntryCollection(entryCollection, true)
  expect(wrappedEntry.toPlainObject()).toEqual(entryCollection)
})

test('Entry collection links are resolved', (t) => {
  const entryCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      copy(entryMock),
      copy(entryMock)
    ],
    includes: {
      Entry: [copy(entryMock)],
      Asset: [copy(assetMock)]
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

  const wrappedCollection = wrapEntryCollection(entryCollection, { resolveLinks: true })
  const wrappedEntry = wrappedCollection.toPlainObject()

  // first linked entry resolved from includes
  expect(wrappedEntry.items[0].fields.linked1.sys.type).toBe('Asset')
  expect(wrappedEntry.items[0].fields.linked1.fields).toBeDefined()
  // second linked entry resolved from items list
  expect(wrappedEntry.items[0].fields.linked2.sys.type).toBe('Entry')
  expect(wrappedEntry.items[0].fields.linked2.fields).toBeDefined()
  expect(wrappedEntry.items[1].fields.linked1.sys.type).toBe('Entry')
  expect(wrappedEntry.items[1].fields.linked1.fields).toBeDefined()
  expect(wrappedCollection.stringifySafe()).toBeDefined()
})
