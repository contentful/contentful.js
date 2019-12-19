import test from 'blue-tape'
import mixinStringifySafe from '../../../lib/mixins/stringify-safe'

test('Stringifies circular object', t => {
  const obj = { sys: { id: 'foo' } }
  obj.self = obj
  mixinStringifySafe(obj)
  t.looseEqual(
    obj.stringifySafe(),
    JSON.stringify({
      sys: { id: 'foo' },
      self: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: 'foo',
          circular: true
        }
      }
    })
  )
  t.end()
})

test('Stringifies nested circular object', t => {
  const obj = { sys: { id: 'foo' } }
  obj.identity = { self: obj }
  mixinStringifySafe(obj)
  t.looseEqual(
    obj.stringifySafe(),
    JSON.stringify({
      sys: { id: 'foo' },
      identity: {
        self: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'foo',
            circular: true
          }
        }
      }
    })
  )
  t.end()
})
