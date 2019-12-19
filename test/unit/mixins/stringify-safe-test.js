import test from 'blue-tape'
import cloneDeep from 'lodash/cloneDeep'
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

test('must stringify circular objects in an array', t => {
  const obj = {sys: {id: 'Alice'}}
  obj.self = [obj, obj]

  const expected = cloneDeep(obj)
  const objReplacer = {sys: {type: 'Link', linkType: 'Entry', id: 'Alice', circular: true}}
  expected.self = [objReplacer, objReplacer]
  mixinStringifySafe(obj, null, 2)
  t.deepEqual(obj.stringifySafe(), JSON.stringify(expected))
  t.end()
})

test('must stringify repeated objects in objects', t => {
  const alice = {sys: {id: 'Alice'}}
  const obj = {}
  obj.alice1 = alice
  obj.alice2 = alice

  const aliceReplacer = {sys: {type: 'Link', linkType: 'Entry', id: 'Alice', circular: true}}
  const expected = {
    alice1: alice,
    alice2: aliceReplacer
  }
  mixinStringifySafe(obj, null, 2)
  t.deepEqual(obj.stringifySafe(), JSON.stringify(expected))
  t.end()
})
