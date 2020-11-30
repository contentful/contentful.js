import test from 'blue-tape'
import normalizeSelect from '../../../lib/utils/normalize-select'

test('normalizeSelect does nothing if sys is selected', (t) => {
  const query = {
    select: 'fields.foo,sys'
  }

  normalizeSelect(query)

  t.equal(query.select, 'fields.foo,sys')
  t.end()
})

test('normalizeSelect adds required properties if sys is not selected', (t) => {
  const query = {
    select: 'fields.foo'
  }

  normalizeSelect(query)

  t.equal(query.select, 'fields.foo,sys.id,sys.type')
  t.end()
})

test('normalizeSelect adds required properties if different sys properties are selected', (t) => {
  const query = {
    select: 'fields.foo,sys.createdAt'
  }

  normalizeSelect(query)

  t.equal(query.select, 'fields.foo,sys.createdAt,sys.id,sys.type')
  t.end()
})

test('normalizeSelect adds required properties if only some required sys properties are selected', (t) => {
  const query = {
    select: 'fields.foo,sys.type'
  }

  normalizeSelect(query)

  t.equal(query.select, 'fields.foo,sys.type,sys.id')
  t.end()
})
