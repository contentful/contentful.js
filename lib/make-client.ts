import type { CreateContentfulApiParams } from './create-contentful-api.js'
import createContentfulApi from './create-contentful-api.js'
import type {
  ChainOptions,
  DefaultChainOption,
  ChainOption,
  ModifiersFromOptions,
} from './utils/client-helpers.js'
import type { ContentfulClientApi } from './types/index.js'
import type { ChainModifiers } from './types/client.js'

/**
 * Wraps an async method with error handling to invoke logHandler on errors
 */
function wrapAsyncMethod(
  method: (...args: any[]) => Promise<any>,
  logHandler: (level: string, data: any) => void,
): (...args: any[]) => Promise<any> {
  return async (...args: any[]) => {
    try {
      return await method(...args)
    } catch (error) {
      logHandler('error', error)
      throw error
    }
  }
}

/**
 * Creates an error boundary around all async API methods in the client
 */
function withErrorBoundary(
  client: ContentfulClientApi<any>,
  logHandler: (level: string, data: any) => void,
): ContentfulClientApi<any> {
  // List of all async methods that should be wrapped with error handling
  // Note: parseEntries is NOT async, so it's not included
  const asyncMethods = [
    'getSpace',
    'getContentType',
    'getContentTypes',
    'getAsset',
    'getAssets',
    'getAssetsWithCursor',
    'getTag',
    'getTags',
    'getLocales',
    // 'parseEntries',
    'sync',
    'getEntry',
    'getEntries',
    'getEntriesWithCursor',
    'getConceptScheme',
    'getConceptSchemes',
    'getConcept',
    'getConcepts',
    'getConceptAncestors',
    'getConceptDescendants',
    'createAssetKey',
  ] as const

  const wrappedMethods: any = {}

  for (const methodName of asyncMethods) {
    const originalMethod = client[methodName as keyof ContentfulClientApi<any>]
    if (typeof originalMethod === 'function') {
      wrappedMethods[methodName] = wrapAsyncMethod(originalMethod as any, logHandler)
    }
  }

  // Return client with wrapped methods, preserving non-wrapped methods
  return Object.assign({}, client, wrappedMethods) as ContentfulClientApi<any>
}

function create<OptionsType extends ChainOptions>(
  { http, getGlobalOptions }: CreateContentfulApiParams,
  options: OptionsType,
  makeInnerClient: (options: OptionsType) => ContentfulClientApi<ModifiersFromOptions<OptionsType>>,
) {
  const client = createContentfulApi<OptionsType>(
    {
      http,
      getGlobalOptions,
    },
    options,
  )

  // Apply error boundary to catch and log errors from all API methods
  const logHandler = http.defaults.logHandler
  const clientWithErrorBoundary = withErrorBoundary(client, logHandler) as any

  Object.defineProperty(clientWithErrorBoundary, 'withAllLocales', {
    get: () => makeInnerClient({ ...options, withAllLocales: true }),
  })
  Object.defineProperty(clientWithErrorBoundary, 'withoutLinkResolution', {
    get: () => makeInnerClient({ ...options, withoutLinkResolution: true }),
  })
  Object.defineProperty(clientWithErrorBoundary, 'withoutUnresolvableLinks', {
    get: () => makeInnerClient({ ...options, withoutUnresolvableLinks: true }),
  })
  Object.defineProperty(clientWithErrorBoundary, 'withLocaleBasedPublishing', {
    get: () => makeInnerClient({ ...options, withLocaleBasedPublishing: true }),
  })
  return clientWithErrorBoundary as ContentfulClientApi<ModifiersFromOptions<OptionsType>>
}

export const makeClient = ({
  http,
  getGlobalOptions,
}: CreateContentfulApiParams): ContentfulClientApi<undefined> => {
  function makeInnerClient<Options extends ChainOptions>(
    options: Options,
  ): ContentfulClientApi<ModifiersFromOptions<Options>> {
    return create<Options>({ http, getGlobalOptions }, options, makeInnerClient)
  }

  const client = createContentfulApi<DefaultChainOption>(
    { http, getGlobalOptions },
    {
      withoutLinkResolution: false,
      withAllLocales: false,
      withoutUnresolvableLinks: false,
      withLocaleBasedPublishing: false,
    },
  )

  // Apply error boundary to the main client
  const logHandler = http.defaults.logHandler
  const clientWithErrorBoundary = withErrorBoundary(client, logHandler)

  return Object.assign(clientWithErrorBoundary, {
    get withAllLocales() {
      return makeInnerClient<ChainOption<'WITH_ALL_LOCALES'>>({
        withAllLocales: true,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
        withLocaleBasedPublishing: false,
      })
    },
    get withoutLinkResolution() {
      return makeInnerClient<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
        withAllLocales: false,
        withoutLinkResolution: true,
        withoutUnresolvableLinks: false,
        withLocaleBasedPublishing: false,
      })
    },
    get withoutUnresolvableLinks() {
      return makeInnerClient<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: true,
        withLocaleBasedPublishing: false,
      })
    },
    get withLocaleBasedPublishing() {
      return makeInnerClient<ChainOption<'WITH_LOCALE_BASED_PUBLISHING'>>({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
        withLocaleBasedPublishing: true,
      })
    },
  })
}
