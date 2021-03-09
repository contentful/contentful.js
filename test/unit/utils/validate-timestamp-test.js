import test from 'blue-tape'
import validateTimestamp from '../../../lib/utils/validate-timestamp'

const now = () => Math.floor(Date.now() / 1000)

test('validateTimestamp passes if timestamp is numeric', (t) => {
  t.doesNotThrow(() => validateTimestamp('testTimestamp', now()))
  t.end()
})

test('validateTimestamp fails if timestamp is not a numeric', (t) => {
  const timestamp = now().toString()

  t.throws(
    () => validateTimestamp('testTimestamp', timestamp),
    /only numeric values are allowed for timestamps/
  )
  t.end()
})

test('validateTimestamp fails if timestamp is greater than expected maximum', (t) => {
  const maximum = now() + 60
  const timestamp = now() + 120
  const expectedMessage = new RegExp(`value \\(${timestamp}\\) cannot be further in the future than expected maximum \\(${maximum}\\)`)

  t.throws(
    () => validateTimestamp('testTimestamp', timestamp, { maximum }),
    expectedMessage
  )
  t.end()
})

test('validateTimestamp fails if timestamp is in the past', (t) => {
  const current = now()
  const timestamp = now() - 120
  const expectedMessage = new RegExp(`value \\(${timestamp}\\) cannot be in the past, current time was ${current}`)

  t.throws(
    () => validateTimestamp('testTimestamp', timestamp, { now: current }),
    expectedMessage
  )
  t.end()
})
