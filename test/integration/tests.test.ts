import * as contentful from '../../lib/contentful'
import { ValidationError } from '../../lib/utils/validation-error'
// @ts-ignore
import { localeSpaceParams, params, previewParams } from './utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

const responseLoggerStub = jest.fn()
const requestLoggerStub = jest.fn()
const clientWithLoggers = contentful.createClient({
  ...params,
  // @ts-ignore
  responseLogger: responseLoggerStub,
  requestLogger: requestLoggerStub,
})

const now = () => Math.floor(Date.now() / 1000)
const withExpiryIn1Hour = () => now() + 60 * 60
const withExpiryIn48Hours = () => now() + 48 * 60 * 60

test('Gets space', async () => {
  const response = await client.getSpace()
  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.locales).toBeDefined()
})

test('Gets content type', async () => {
  const response = await client.getContentType('1t9IbcfdCk6m04uISSsaIK')
  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Gets content types', async () => {
  const response = await client.getContentTypes()
  expect(response.items).toBeDefined()
})

test('Gets a content type that has resource links', async () => {
  const response = await client.getContentType('catalog')

  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.fields).toBeDefined()
  expect(response.fields).toEqual([
    {
      id: 'items',
      name: 'items',
      type: 'Array',
      localized: false,
      required: false,
      disabled: false,
      omitted: false,
      allowedResources: [
        {
          type: 'Contentful:Entry',
          source: 'crn:contentful:::content:spaces/ocrd5ofpzqgz',
          contentTypes: ['manufacturer', 'product'],
        },
      ],
      items: { type: 'ResourceLink', validations: [] },
    },
    {
      id: 'productOfTheMonth',
      name: 'product of the month',
      type: 'ResourceLink',
      localized: false,
      required: false,
      disabled: false,
      omitted: false,
      allowedResources: [
        {
          type: 'Contentful:Entry',
          source: 'crn:contentful:::content:spaces/ocrd5ofpzqgz',
          contentTypes: ['product'],
        },
      ],
    },
  ])
})

test('Gets assets with only images', async () => {
  const response = await client.getAssets({
    mimetype_group: 'image',
  })
  expect(response.items[0].fields.file?.contentType).toMatch(/image/)
})

test('Gets asset', async () => {
  const response = await client.getAsset('1x0xpXu4pSGS4OukSyWGUK')
  expect(response.sys).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Gets assets', async () => {
  const response = await client.getAssets()
  expect(response.items).toBeDefined()
  expect(response.items.length).toBeGreaterThan(0)
})

test('Gets Locales', async () => {
  const response = await client.getLocales()
  expect(response.items).toBeDefined()
  expect(response.items[0].code).toBe('en-US')
})

test('Gets tag', async () => {
  const response = await client.getTag('publicTag1')
  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.name).toEqual('public tag 1')
})

test('Gets tags', async () => {
  const response = await client.getTags()
  expect(response.items).toBeDefined()
  const publicTag = response.items.find((tag) => tag.sys.id === 'publicTag1')
  expect(publicTag).toBeDefined()
  expect(publicTag?.name).toEqual('public tag 1')
})

test('Logs request and response with custom loggers', async () => {
  await clientWithLoggers.getEntries()
  expect(responseLoggerStub).toHaveBeenCalledTimes(1)
  expect(requestLoggerStub).toHaveBeenCalledTimes(1)
})

describe('Embargoed Assets', () => {
  test('Creates asset key on CDA', async () => {
    const response = await client.createAssetKey(withExpiryIn48Hours())
    expect(response.policy).toBeDefined()
    expect(response.secret).toBeDefined()
  })

  test('Creates asset key on CDA with a different lifetime', async () => {
    const response = await client.createAssetKey(withExpiryIn1Hour())
    expect(response.policy).toBeDefined()
    expect(response.secret).toBeDefined()
  })

  test('Creates asset key on CPA', async () => {
    const response = await previewClient.createAssetKey(withExpiryIn48Hours())
    expect(response.policy).toBeDefined()
    expect(response.secret).toBeDefined()
  })

  test('Does not create asset key if feature is not enabled', async () => {
    await expect(localeClient.createAssetKey(withExpiryIn48Hours())).rejects.toThrowError()
  })

  test('Does not create asset key if no/undefined expiresAt is given', async () => {
    // @ts-ignore
    await expect(localeClient.createAssetKey()).rejects.toThrow(ValidationError)
  })

  test('Does not create asset key if invalid expiresAt is given', async () => {
    // @ts-ignore
    await expect(localeClient.createAssetKey('invalidExpiresAt')).rejects.toThrow(ValidationError)
  })

  test('Does not create asset key if expiresAt is in the past', async () => {
    const shortExpiresAt = now() - 60
    await expect(localeClient.createAssetKey(shortExpiresAt)).rejects.toThrow(ValidationError)
  })

  test('Does not create asset key if expiresAt is too far in the future (> 48 hours)', async () => {
    const longExpiresAt = now() + 72 * 60 * 60
    await expect(localeClient.createAssetKey(longExpiresAt)).rejects.toThrow(ValidationError)
  })
})

test('Client object exposes current version', async () => {
  expect(client.version).toEqual(version)
})
