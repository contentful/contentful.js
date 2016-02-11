import test from 'tape'
import mixinLinkGetters from '../../../lib/mixins/link-getters'

test('empty response', t => {
  const response = {items: []}
  t.looseEquals(mixinLinkGetters(response), response)
  t.end()
})

test('no links in response', t => {
  const response = {
    items: [{
      foo: 'bar'
    }]
  }
  const mixedResponse = mixinLinkGetters(response)
  t.looseEquals(mixedResponse, response)
  t.end()
})

test('links in response, without matching include should remain', t => {
  const response = {
    items: [
      {sys: {type: 'Link', linkType: 'Piglet', id: 'oink'}
      }]
  }
  const mixedResponse = mixinLinkGetters(response)
  t.looseEquals(mixedResponse, response)
  t.end()
})

test('links in response, with matching include should resolve', t => {
  const response = {
    items: [
      {
        sys: {type: 'Entry'},
        fields: {
          animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
          anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
        }
      },
      {
        sys: {type: 'Entry'},
        fields: {
          birds: [
            {sys: {type: 'Link', linkType: 'Animal', id: 'parrot'}},
            {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}},
            {sys: {type: 'Link', linkType: 'Animal', id: 'aussie-parrot'}}
          ]
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: {type: 'Animal', id: 'oink'},
          fields: {
            name: 'Pig',
            friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
          }
        },
        {
          sys: {type: 'Animal', id: 'groundhog'},
          fields: {name: 'Phil'}
        },
        {
          sys: {type: 'Animal', id: 'parrot'},
          fields: {name: 'Parrot'}
        },
        {
          sys: {type: 'Animal', id: 'aussie-parrot'},
          fields: {name: 'Aussie Parrot'}
        }
      ]
    }
  }

  const mixedResponse = mixinLinkGetters(response)
  const items = mixedResponse.items
  t.looseEquals(items[0].fields.animal.sys, response.includes.Animal[0].sys, 'pig')
  t.looseEquals(items[0].fields.animal.fields.friend.sys, response.includes.Animal[1].sys, 'groundhog')
  t.looseEquals(items[0].fields.anotheranimal.sys.type, 'Link', 'first middle parrot not resolved')
  t.looseEquals(items[1].fields.birds[0], response.includes.Animal[2], 'parrot')
  t.looseEquals(items[1].fields.birds[1].sys.type, 'Link', 'second middle parrot not resolved')
  t.looseEquals(items[1].fields.birds[2], response.includes.Animal[3], 'aussie parrot')
  t.end()
})

test('links in response, with circular references', t => {
  const response = {
    items: [
      {
        sys: {type: 'Entry'},
        fields: {
          animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: {type: 'Animal', id: 'oink'},
          fields: {name: 'Pig', friend: {sys: {type: 'Link', linkType: 'Animal', id: 'parrot'}}}
        },
        {
          sys: {type: 'Animal', id: 'parrot'},
          fields: {name: 'Parrot', friend: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}}
        }
      ]
    }
  }

  const mixedResponse = mixinLinkGetters(response)
  const items = mixedResponse.items

  t.equals(items[0].fields.animal.sys.type, 'Animal', 'first link type')
  t.equals(items[0].fields.animal.sys.id, 'oink', 'first link id')
  t.equals(items[0].fields.animal.fields.friend.sys.type, 'Animal', 'sub link type')
  t.equals(items[0].fields.animal.fields.friend.sys.id, 'parrot', 'sub link id')
  t.equals(items[0].fields.animal.fields.friend.fields.friend.sys.type, 'Animal', 'sub sub link type')
  t.equals(items[0].fields.animal.fields.friend.fields.friend.sys.id, 'oink', 'sub sub link id')
  t.end()
})
