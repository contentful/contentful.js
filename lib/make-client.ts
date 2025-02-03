import type { CreateContentfulApiParams } from './create-contentful-api.js'
import createContentfulApi from './create-contentful-api.js'
import type {
  ChainOptions,
  DefaultChainOption,
  ChainOption,
  ModifiersFromOptions,
} from './utils/client-helpers.js'
import type { ContentfulClientApi } from './types/index.js'

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
  const response: any = client ? client : {}

  Object.defineProperty(response, 'withAllLocales', {
    get: () => makeInnerClient({ ...options, withAllLocales: true }),
  })
  Object.defineProperty(response, 'withoutLinkResolution', {
    get: () => makeInnerClient({ ...options, withoutLinkResolution: true }),
  })
  Object.defineProperty(response, 'withoutUnresolvableLinks', {
    get: () => makeInnerClient({ ...options, withoutUnresolvableLinks: true }),
  })
  return Object.create(response) as ContentfulClientApi<ModifiersFromOptions<OptionsType>>
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
    },
  )

  return {
    ...client,
    get withAllLocales() {
      return makeInnerClient<ChainOption<'WITH_ALL_LOCALES'>>({
        withAllLocales: true,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
      })
    },
    get withoutLinkResolution() {
      return makeInnerClient<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
        withAllLocales: false,
        withoutLinkResolution: true,
        withoutUnresolvableLinks: false,
      })
    },
    get withoutUnresolvableLinks() {
      return makeInnerClient<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: true,
      })
    },
  }
}
