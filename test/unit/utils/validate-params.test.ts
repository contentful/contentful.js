import { checkIncludeContentSourceMapsParamIsAllowed } from '../../../lib/utils/validate-params'
import { ValidationError } from '../../../lib/utils/validation-error'

describe('checkIncludeContentSourceMapsParamIsAllowed', () => {
  it('returns false if includeContentSourceMaps is not provided', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com')).toBe(false)
    expect(checkIncludeContentSourceMapsParamIsAllowed('http://example.com', undefined)).toBe(false)
  })

  it('throws ValidationError if includeContentSourceMaps is not a boolean', () => {
    expect(() =>
      checkIncludeContentSourceMapsParamIsAllowed('http://example.com', 'not a boolean' as any),
    ).toThrow(ValidationError)
    expect(() =>
      checkIncludeContentSourceMapsParamIsAllowed('http://example.com', 1 as any),
    ).toThrow(ValidationError)
  })

  it('throws ValidationError if includeContentSourceMaps is true but host is not preview.contentful.com', () => {
    expect(() => checkIncludeContentSourceMapsParamIsAllowed('cdn.contentful.com', true)).toThrow(
      ValidationError,
    )
  })

  it('returns true if includeContentSourceMaps is true and host is preview.contentful.com', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('preview.contentful.com', true)).toBe(true)
  })

  it('returns true if includeContentSourceMaps is true and host is preview.eu.contentful.com', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('preview.eu.contentful.com', true)).toBe(true)
  })

  it('returns false if includeContentSourceMaps is false, regardless of host', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('preview.contentful.com', false)).toBe(false)
    expect(checkIncludeContentSourceMapsParamIsAllowed('cdn.contentful.com', false)).toBe(false)
  })
})
