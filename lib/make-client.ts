import createContentfulApi, {
  ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithAllLocalesAndWithoutLinkResolution,
  ClientWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithoutLinkResolution,
  ContentfulClientApi,
  CreateContentfulApiParams,
} from './create-contentful-api'
import { ChainOptions, DefaultChainOption, ChainOption } from './utils/client-helpers'

function create<OptionsType extends ChainOptions>(
  { http, getGlobalOptions }: CreateContentfulApiParams,
  options: OptionsType,
  makeInnerClient: (options: OptionsType) => ConfiguredClient<OptionsType>
) {
  const client = createContentfulApi<OptionsType>(
    {
      http,
      getGlobalOptions,
    },
    options
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
  return Object.create(response) as ConfiguredClient<OptionsType>
}

type ConfiguredClient<Options extends ChainOptions> = Options extends ChainOption<'allLocales'>
  ? ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  : Options extends ChainOption<'allLocales' | 'noLinkResolution'>
  ? ClientWithAllLocalesAndWithoutLinkResolution
  : Options extends ChainOption<'allLocales' | 'noUnresolvableLinks'>
  ? ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  : Options extends ChainOption<'noLinkResolution'>
  ? ClientWithoutLinkResolution
  : Options extends ChainOption
  ? ClientWithLinkResolutionAndWithUnresolvableLinks
  : Options extends ChainOption<'noUnresolvableLinks'>
  ? ClientWithLinkResolutionAndWithoutUnresolvableLinks
  : never

export const makeClient = ({
  http,
  getGlobalOptions,
}: CreateContentfulApiParams): ContentfulClientApi => {
  function makeInnerClient<Options extends ChainOptions>(
    options: Options
  ): ConfiguredClient<Options> {
    return create<Options>({ http, getGlobalOptions }, options, makeInnerClient)
  }

  const client = createContentfulApi<DefaultChainOption>(
    { http, getGlobalOptions },
    {
      withoutLinkResolution: false,
      withAllLocales: false,
      withoutUnresolvableLinks: false,
    }
  )

  return {
    ...client,
    get withAllLocales() {
      return makeInnerClient({
        withAllLocales: true,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: false,
      })
    },
    get withoutLinkResolution() {
      return makeInnerClient({
        withAllLocales: false,
        withoutLinkResolution: true,
        withoutUnresolvableLinks: false,
      })
    },
    get withoutUnresolvableLinks() {
      return makeInnerClient({
        withAllLocales: false,
        withoutLinkResolution: false,
        withoutUnresolvableLinks: true,
      })
    },
  }
}
