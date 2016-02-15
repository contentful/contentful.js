import test from 'tape'
import mixinLinkGetters from '../../../lib/mixins/link-getters'

test('links in response, without matching include should remain', t => {
  const items = [{
    sys: {type: 'Entry', locale: 'en-US'},
    fields: {
      animal: {sys: {type: 'Link', linkType: 'Piglet', id: 'oink'}}
    }
  }]
  mixinLinkGetters(items, {})
  t.equal(items[0].fields.animal.sys.type, 'Link')
  t.end()
})

test('links in response, with matching include should resolve', t => {
  const items = [
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
  ]
  const includes = {
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

  mixinLinkGetters(items, includes)
  t.looseEquals(items[0].fields.animal.sys, includes.Animal[0].sys, 'pig')
  t.looseEquals(items[0].fields.animal.fields.friend.sys, includes.Animal[1].sys, 'groundhog')
  t.looseEquals(items[0].fields.anotheranimal.sys.type, 'Link', 'first middle parrot not resolved')
  t.looseEquals(items[1].fields.birds[0], includes.Animal[2], 'parrot')
  t.looseEquals(items[1].fields.birds[1].sys.type, 'Link', 'second middle parrot not resolved')
  t.looseEquals(items[1].fields.birds[2], includes.Animal[3], 'aussie parrot')
  t.looseEquals(items[2].fields.animal['en-US'].sys, includes.Animal[0].sys, 'localized pig')
  t.looseEquals(items[2].fields.animal['en-US'].fields.friend.sys, includes.Animal[1].sys, 'localized groundhog')
  t.looseEquals(items[2].fields.animals['en-US'][0].sys, includes.Animal[0].sys, 'listed localized pig')
  t.looseEquals(items[2].fields.animals['en-US'][0].fields.friend.sys, includes.Animal[1].sys, 'listed localized groundhog')
  t.end()
})

test('links in response, with circular references', t => {
  const items = [
    {
      sys: {type: 'Entry', locale: 'en-US'},
      fields: {
        animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}
      }
    }
  ]
  const includes = {
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

  mixinLinkGetters(items, includes)

  t.equals(items[0].fields.animal.sys.type, 'Animal', 'first link type')
  t.equals(items[0].fields.animal.sys.id, 'oink', 'first link id')
  t.equals(items[0].fields.animal.fields.friend.sys.type, 'Animal', 'sub link type')
  t.equals(items[0].fields.animal.fields.friend.sys.id, 'parrot', 'sub link id')
  t.equals(items[0].fields.animal.fields.friend.fields.friend.sys.type, 'Animal', 'sub sub link type')
  t.equals(items[0].fields.animal.fields.friend.fields.friend.sys.id, 'oink', 'sub sub link id')
  t.end()
})
