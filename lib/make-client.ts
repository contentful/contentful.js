import createContentfulApi, { CreateContentfulApiParams } from './create-contentful-api'
import { ContentfulClientApi } from './types'
import {
  ChainOption,
  ChainOptions,
  DefaultChainOption,
  ModifiersFromOptions,
} from './utils/client-helpers'

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
  const response: any = client
  Object.defineProperty(response, 'withAllLocales', {
    get: () => makeInnerClient({ ...options, withAllLocales: true }),
  })
  Object.defineProperty(response, 'withoutLinkResolution', {
    get: () => makeInnerClient({ ...options, withoutLinkResolution: true }),
  })
  Object.defineProperty(response, 'withoutUnresolvableLinks', {
    get: () => makeInnerClient({ ...options, withoutUnresolvableLinks: true }),
  })
  Object.defineProperty(response, 'alpha_withContentSourceMaps', {
    get: () => makeInnerClient({ ...options, alpha_withContentSourceMaps: true }),
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
      alpha_withContentSourceMaps: false,
    },
  )

  return {
    ...client,
    get withAllLocales() {
      return makeInnerClient<ChainOption<'WITH_ALL_LOCALES'>>({
        withAllLocales: true,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
        alpha_withContentSourceMaps: false,
      })
    },
    get withoutLinkResolution() {
      return makeInnerClient<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
        withAllLocales: false,
        withoutLinkResolution: true,
        withoutUnresolvableLinks: false,
        alpha_withContentSourceMaps: false,
      })
    },
    get withoutUnresolvableLinks() {
      return makeInnerClient<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: true,
        alpha_withContentSourceMaps: false,
      })
    },
    get alpha_withContentSourceMaps() {
      console.log('alpha_withContentSourceMaps')
      return makeInnerClient<ChainOption<'ALPHA_WITH_CONTENT_SOURCE_MAPS'>>({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
        alpha_withContentSourceMaps: true,
      })
    },
  }
}
