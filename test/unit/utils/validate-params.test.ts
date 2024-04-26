import {
  checkIncludeContentSourceMapsParamIsAllowed,
  checkIncludeContentSourceMapsParamIsValid,
} from '../../../lib/utils/validate-params'
import { ValidationError } from '../../../lib/utils/validation-error'

describe('checkIncludeContentSourceMapsParamIsValid', () => {
  it('returns false if host/alphaFeatures is not provided', () => {
    expect(checkIncludeContentSourceMapsParamIsValid()).toBe(false)
  })

  it('throws ValidationError if withContentSourceMaps is not a boolean', () => {
    expect(() =>
      checkIncludeContentSourceMapsParamIsValid({ withContentSourceMaps: 'not a boolean' }),
    ).toThrow(ValidationError)
  })

  it('returns true if withContentSourceMaps is a boolean', () => {
    expect(checkIncludeContentSourceMapsParamIsValid({ withContentSourceMaps: true })).toBe(true)
  })
})

describe('checkIncludeContentSourceMapsParamIsAllowed', () => {
  it('returns false if alphaFeatures is not provided', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com')).toBe(false)
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com', {})).toBe(false)
  })

  it('throws ValidationError if withContentSourceMaps is valid but baseUrl does not include preview.contentful.com', () => {
    expect(() =>
      checkIncludeContentSourceMapsParamIsAllowed('cdn.contentful.com', {
        withContentSourceMaps: true,
      }),
    ).toThrow(ValidationError)
  })

  it('returns true if withContentSourceMaps is valid and baseUrl includes preview.contentful.com', () => {
    expect(
      checkIncludeContentSourceMapsParamIsAllowed('preview.contentful.com', {
        withContentSourceMaps: true,
      }),
    ).toBe(true)
  })
})
