import {
  checkEnableTimelinePreviewIsAllowed,
  checkIncludeContentSourceMapsParamIsAllowed,
} from '../../../lib/utils/validate-params'
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
    expect(checkIncludeContentSourceMapsParamIsAllowed('preview.eu.contentful.com', true)).toBe(
      true,
    )
  })

  it('returns false if includeContentSourceMaps is false, regardless of host', () => {
    expect(checkIncludeContentSourceMapsParamIsAllowed('preview.contentful.com', false)).toBe(false)
    expect(checkIncludeContentSourceMapsParamIsAllowed('cdn.contentful.com', false)).toBe(false)
  })
})

describe('checkEnableTimelinePreviewIsAllowed', () => {
  const validRelease = { release: { lte: 'release-id' } }
  const validTimestamp = { timestamp: { lte: '2026-01-01T00:00:00Z' } }
  const validTimestampDate = { timestamp: { lte: new Date('2026-01-01') } }

  it('returns false if timelinePreview is not provided', () => {
    expect(checkEnableTimelinePreviewIsAllowed('preview.contentful.com')).toBe(false)
    expect(checkEnableTimelinePreviewIsAllowed('preview.contentful.com', undefined)).toBe(false)
  })

  it('throws ValidationError if timelinePreview is not an object', () => {
    expect(() =>
      checkEnableTimelinePreviewIsAllowed('preview.contentful.com', 'not-an-object' as any),
    ).toThrow(ValidationError)
    expect(() =>
      checkEnableTimelinePreviewIsAllowed('preview.contentful.com', null as any),
    ).toThrow(ValidationError)
    expect(() => checkEnableTimelinePreviewIsAllowed('preview.contentful.com', [] as any)).toThrow(
      ValidationError,
    )
  })

  it('throws ValidationError if timelinePreview has neither valid release nor valid timestamp', () => {
    expect(() => checkEnableTimelinePreviewIsAllowed('preview.contentful.com', {} as any)).toThrow(
      ValidationError,
    )
    expect(() =>
      checkEnableTimelinePreviewIsAllowed('preview.contentful.com', { release: {} } as any),
    ).toThrow(ValidationError)
    expect(() =>
      checkEnableTimelinePreviewIsAllowed('preview.contentful.com', {
        timestamp: { lte: 123 },
      } as any),
    ).toThrow(ValidationError)
  })

  it('returns true for a valid release config on a preview host', () => {
    expect(checkEnableTimelinePreviewIsAllowed('preview.contentful.com', validRelease)).toBe(true)
    expect(checkEnableTimelinePreviewIsAllowed('preview.eu.contentful.com', validRelease)).toBe(
      true,
    )
  })

  it('returns true for a valid timestamp config (string or Date) on a preview host', () => {
    expect(checkEnableTimelinePreviewIsAllowed('preview.contentful.com', validTimestamp)).toBe(true)
    expect(checkEnableTimelinePreviewIsAllowed('preview.contentful.com', validTimestampDate)).toBe(
      true,
    )
  })

  it('throws ValidationError if a valid config is used with the CDN host', () => {
    expect(() => checkEnableTimelinePreviewIsAllowed('cdn.contentful.com', validRelease)).toThrow(
      ValidationError,
    )
    expect(() => checkEnableTimelinePreviewIsAllowed('cdn.contentful.com', validTimestamp)).toThrow(
      ValidationError,
    )
  })

  it('opts out of host validation for custom hosts that do not include "contentful"', () => {
    expect(checkEnableTimelinePreviewIsAllowed('my-proxy.example.com', validRelease)).toBe(true)
    expect(checkEnableTimelinePreviewIsAllowed('localhost', validTimestamp)).toBe(true)
  })

  it('opts out of host validation for custom proxy hosts whose name contains "contentful" as a substring', () => {
    expect(
      checkEnableTimelinePreviewIsAllowed(
        'pers-api-contentful-proxy-preview.np.gke.telus.digital',
        validRelease,
      ),
    ).toBe(true)
  })
})
