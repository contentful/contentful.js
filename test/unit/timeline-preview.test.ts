import { describe, expect, it, vi } from 'vitest'
import createContentfulApi from '../../lib/create-contentful-api'
import type { AxiosInstance } from 'contentful-sdk-core'

describe('Timeline Preview path and query', () => {
  it('changes path and query when timeline preview is enabled', async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: { items: [] } })
    const mockHttp = {
      get: mockGet,
      httpClientParams: {
        host: 'preview.contentful.com',

        timelinePreview: {
          release: { lte: 'black-friday' },
          timestamp: { lte: '2023-11-30T23:59:59Z' },
        },
      },
    } as unknown as AxiosInstance

    const getGlobalOptions = () => ({
      environmentBaseUrl: 'https://preview.contentful.com/spaces/spaceid/environments/master',
      spaceBaseUrl: 'https://preview.contentful.com/spaces/spaceid',
      environment: 'master',
      space: 'spaceid',
    })

    const api = createContentfulApi({ http: mockHttp, getGlobalOptions })

    await api.getEntries({ 'sys.id': 'entry-id' })

    // Check that the path is prefixed with "timeline/"
    expect(mockGet).toHaveBeenCalledWith(
      'https://preview.contentful.com/spaces/spaceid/environments/master/timeline/entries',
      {
        params: {
          release: {
            lte: 'black-friday',
          },
          'sys.id': 'entry-id',
          timestamp: {
            lte: '2023-11-30T23:59:59Z',
          },
        },
      },
    )
  })
})
