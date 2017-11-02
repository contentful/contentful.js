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

test('link resolving: links in response, without matching include should remain', (t) => {
  const response = {
    items: [
      {
        sys: {type: 'Entry', locale: 'en-US'},
        fields: {
          animal: {sys: {type: 'Link', linkType: 'Piglet', id: 'oink'}}
        }
      }
    ]
  }
  const collection = wrapEntryCollection(response, true)
  t.equal(collection.items[0].fields.animal.sys.type, 'Link')
  t.end()
})

test('link resolving: links in response, with matching include should resolve', (t) => {
  const response = {
    items: [
      {
        sys: {type: 'Entry', locale: 'en-US'},
        fields: {
          animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
          anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
        }
      },
      {
        sys: {type: 'Entry', locale: 'en-US'},
        fields: {
          birds: [
            {sys: {type: 'Link', linkType: 'Animal', id: 'parrot'}},
            {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}},
            {sys: {type: 'Link', linkType: 'Animal', id: 'aussie-parrot'}}
          ]
        }
      },
      {
        sys: {type: 'Entry'},
        fields: {
          animal: {
            'en-US': {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}
          },
          animals: {
            'en-US': [{sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}]
          }
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
          fields: {
            name: 'Pig',
            friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
          }
        },
        {
          sys: {type: 'Animal', id: 'groundhog', locale: 'en-US'},
          fields: {name: 'Phil'}
        },
        {
          sys: {type: 'Animal', id: 'parrot', locale: 'en-US'},
          fields: {name: 'Parrot'}
        },
        {
          sys: {type: 'Animal', id: 'aussie-parrot', locale: 'en-US'},
          fields: {name: 'Aussie Parrot'}
        }
      ]
    }
  }

  const collection = wrapEntryCollection(response, true)

  t.looseEquals(collection.items[0].fields.animal.sys, response.includes.Animal[0].sys, 'pig')
  t.looseEquals(collection.items[0].fields.animal.fields.friend.sys, response.includes.Animal[1].sys, 'groundhog')
  t.looseEquals(collection.items[0].fields.anotheranimal.sys.type, 'Link', 'first middle parrot not resolved')
  t.looseEquals(collection.items[1].fields.birds[0], response.includes.Animal[2], 'parrot')
  t.looseEquals(collection.items[1].fields.birds[1].sys.type, 'Link', 'second middle parrot not resolved')
  t.looseEquals(collection.items[1].fields.birds[2], response.includes.Animal[3], 'aussie parrot')
  t.looseEquals(collection.items[2].fields.animal['en-US'].sys, response.includes.Animal[0].sys, 'localized pig')
  t.looseEquals(collection.items[2].fields.animal['en-US'].fields.friend.sys, response.includes.Animal[1].sys, 'localized groundhog')
  t.looseEquals(collection.items[2].fields.animals['en-US'][0].sys, response.includes.Animal[0].sys, 'listed localized pig')
  t.looseEquals(collection.items[2].fields.animals['en-US'][0].fields.friend.sys, response.includes.Animal[1].sys, 'listed localized groundhog')
  t.end()
})

test('link resolving: links in response, with circular references', (t) => {
  const response = {
    items: [
      {
        sys: {type: 'Entry', locale: 'en-US'},
        fields: {
          animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
          fields: {name: 'Pig', friend: {sys: {type: 'Link', linkType: 'Animal', id: 'parrot'}}}
        },
        {
          sys: {type: 'Animal', id: 'parrot', locale: 'en-US'},
          fields: {name: 'Parrot', friend: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}}
        }
      ]
    }
  }

  const collection = wrapEntryCollection(response, true)

  t.equals(collection.items[0].fields.animal.sys.type, 'Animal', 'first link type')
  t.equals(collection.items[0].fields.animal.sys.id, 'oink', 'first link id')
  t.equals(collection.items[0].fields.animal.fields.friend.sys.type, 'Animal', 'sub link type')
  t.equals(collection.items[0].fields.animal.fields.friend.sys.id, 'parrot', 'sub link id')
  t.equals(collection.items[0].fields.animal.fields.friend.fields.friend.sys.type, 'Animal', 'sub sub link type')
  t.equals(collection.items[0].fields.animal.fields.friend.fields.friend.sys.id, 'oink', 'sub sub link id')
  t.end()
})

test('link resolving: links in response, with circular references #2', (t) => {
  const response = {
    items: [
      {
        sys: {type: 'Entry', locale: 'en-US', id: 'one'},
        fields: {
          linkfield: {sys: {type: 'Link', linkType: 'Entry', id: 'two'}}
        }
      },
      {
        sys: {type: 'Entry', locale: 'en-US', id: 'two'},
        fields: {
          linkfield: {sys: {type: 'Link', linkType: 'Entry', id: 'one'}}
        }
      }
    ]
  }

  const collection = wrapEntryCollection(response, true)

  t.equals(collection.items[0].fields.linkfield.sys.type, 'Entry', 'first link type')
  t.equals(collection.items[0].fields.linkfield.sys.id, 'two', 'first link id')
  t.equals(collection.items[0].fields.linkfield.fields.linkfield.sys.type, 'Entry', 'sub link type')
  t.equals(collection.items[0].fields.linkfield.fields.linkfield.sys.id, 'one', 'sub link id')
  t.equals(collection.items[0].fields.linkfield.fields.linkfield.fields.linkfield.sys.type, 'Entry', 'sub sub link type')
  t.equals(collection.items[0].fields.linkfield.fields.linkfield.fields.linkfield.sys.id, 'two', 'sub sub link id')
  t.end()
})

test('link resolving: links in response with locale: *', (t) => {
  const response = {
    items: [
      {
        sys: {type: 'Entry'},
        fields: {
          animal: { 'en': {sys: {type: 'Link', linkType: 'Entry', id: 'oink'}} },
          animals: { 'en': [{sys: {type: 'Link', linkType: 'Entry', id: 'oink'}}] }
        }
      }
    ],
    includes: {
      Entry: [
        {
          sys: {type: 'Entry', id: 'oink'},
          fields: {
            name: {
              'en': 'Pig'
            }
          }
        }
      ]
    }
  }

  const collection = wrapEntryCollection(response, true)

  t.equals(collection.items[0].fields.animal['en'].fields.name['en'], response.includes.Entry[0].fields.name['en'])
  t.end()
})
