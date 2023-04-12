import validateTimestamp from '../../../lib/utils/validate-timestamp'

const now = () => Math.floor(Date.now() / 1000)

test('validateTimestamp passes if timestamp is numeric', () => {
  expect(() => validateTimestamp('testTimestamp', now())).not.toThrowError()
})

test('validateTimestamp fails if timestamp is not a numeric', () => {
  const timestamp = now().toString()
  const expectedErrorMessage = /only numeric values are allowed for timestamps/

  // @ts-ignore
  expect(() => validateTimestamp('testTimestamp', timestamp)).toThrow(expectedErrorMessage)
})

test('validateTimestamp fails if timestamp is greater than expected maximum', () => {
  const maximum = now() + 60
  const timestamp = now() + 120
  const expectedErrorMessage = new RegExp(
    `value \\(${timestamp}\\) cannot be further in the future than expected maximum \\(${maximum}\\)`
  )

  expect(() => validateTimestamp('testTimestamp', timestamp, { maximum })).toThrow(
    expectedErrorMessage
  )
})

test('validateTimestamp fails if timestamp is in the past', () => {
  const current = now()
  const timestamp = now() - 120
  const expectedErrorMessage = new RegExp(
    `value \\(${timestamp}\\) cannot be in the past, current time was ${current}`
  )

  expect(() => validateTimestamp('testTimestamp', timestamp, { now: current })).toThrow(
    expectedErrorMessage
  )
})
