import test from 'blue-tape'
import normalizeSelect from '../../../lib/utils/normalize-select'

test('normalizeSelect does nothing if sys is selected', (t) => {
  const query = {
    select: 'fields.foo,sys'
  }

  const normalized = normalizeSelect(query)

  t.equal(normalized.select, 'fields.foo,sys')
  t.end()
})

test('normalizeSelect adds required properties if sys is not selected', (t) => {
  const query = {
    select: 'fields.foo'
  }

  const normalized = normalizeSelect(query)

  t.equal(normalized.select, 'fields.foo,sys.id,sys.type')
  t.notEqual(query, normalized)
  t.end()
})

test('normalizeSelect adds required properties if different sys properties are selected', (t) => {
  const query = {
    select: 'fields.foo,sys.createdAt'
  }

  const normalized = normalizeSelect(query)

  t.equal(normalized.select, 'fields.foo,sys.createdAt,sys.id,sys.type')
  t.notEqual(query, normalized)
  t.end()
})

test('normalizeSelect adds required properties if only some required sys properties are selected', (t) => {
  const query = {
    select: 'fields.foo,sys.type'
  }

  const normalized = normalizeSelect(query)

  t.equal(normalized.select, 'fields.foo,sys.type,sys.id')
  t.notEqual(query, normalized)

  t.end()
})

test('normalizeSelect supports arrays but normalizes to strings', (t) => {
  const query = {
    select: [
      'fields.foo',
      'sys.type'
    ]
  }

  const normalized = normalizeSelect(query)

  t.equal(normalized.select, 'fields.foo,sys.type,sys.id')
  t.notEqual(query, normalized)
  t.end()
})
