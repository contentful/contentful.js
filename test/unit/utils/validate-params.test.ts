import {
  checkIncludeContentSourceMapsParamIsAllowed,
  checkIncludeContentSourceMapsParamIsValid,
} from '../../../lib/utils/validate-params'
import { ValidationError } from '../../../lib/utils/validation-error'

describe('checkIncludeContentSourceMapsParamIsValid', () => {
  it('returns false if host/alphaFeatures is not provided', () => {
    expect(checkIncludeContentSourceMapsParamIsValid()).toBe(false)
  })

  it('throws ValidationError if includeContentSourceMaps is not a boolean', () => {
    expect(() =>
      checkIncludeContentSourceMapsParamIsValid({ includeContentSourceMaps: 'not a boolean' }),
    ).toThrow(ValidationError)
  })

  it('returns true if includeContentSourceMaps is a boolean', () => {
    expect(checkIncludeContentSourceMapsParamIsValid({ includeContentSourceMaps: true })).toBe(true)
  })
})

describe('checkIncludeContentSourceMapsParamIsAllowed', () => {
  it('returns false if alphaFeatures is not provided', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com')).toBe(false)
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com', {})).toBe(false)
  })

  it('throws ValidationError if includeContentSourceMaps is valid but baseUrl does not include preview.contentful.com', () => {
    expect(() =>
      checkIncludeContentSourceMapsParamIsAllowed('cdn.contentful.com', {
        includeContentSourceMaps: true,
      }),
    ).toThrow(ValidationError)
  })

  it('returns true if includeContentSourceMaps is valid and baseUrl includes preview.contentful.com', () => {
    expect(
      checkIncludeContentSourceMapsParamIsAllowed('preview.contentful.com', {
        includeContentSourceMaps: true,
      }),
    ).toBe(true)
  })
})
