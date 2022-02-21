import createContentfulApi, {
  ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithAllLocalesAndWithoutLinkResolution,
  ClientWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithoutLinkResolution,
  ContentfulClientApi,
  CreateContentfulApiParams,
  DefaultClient,
} from './create-contentful-api'
import {
  ChainOptions,
  ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  ChainOptionWithAllLocalesAndWithoutLinkResolution,
  ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  ChainOptionWithLinkResolutionAndWithUnresolvableLinks,
  ChainOptionWithoutLinkResolution,
  ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks,
  DefaultChainOption,
  isClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  isClientWithAllLocalesAndWithoutLinkResolution,
  isClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  isClientWithLinkResolutionAndWithUnresolvableLinks,
  isClientWithoutLinkResolution,
  isClientWithLinkResolutionAndWithoutUnresolvableLinks,
} from './utils/client-helpers'

function create<OptionsType extends ChainOptions, ClientType>(
  { http, getGlobalOptions }: CreateContentfulApiParams,
  options: OptionsType,
  makeInnerClient: (options: OptionsType) => ClientType
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
  return Object.create(response) as ClientType
}

export const makeClient = ({
  http,
  getGlobalOptions,
}: CreateContentfulApiParams): ContentfulClientApi => {
  // TODO: how to deal with default based on global config.
  // maybe we should get default from global options as such:
  // const { removeUnresolved, resolveLinks } = getGlobalOptions()

  function makeInnerClient(options: DefaultChainOption): DefaultClient & {
    withAllLocales: ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
    withoutLinkResolution: ClientWithoutLinkResolution
    withoutUnresolvableLinks: ClientWithLinkResolutionAndWithoutUnresolvableLinks
  }
  function makeInnerClient(
    options: ChainOptionWithoutLinkResolution
  ): ClientWithoutLinkResolution & {
    withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
  }
  function makeInnerClient(
    options: ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  ): ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks & {
    withoutLinkResolution: ClientWithAllLocalesAndWithoutLinkResolution
    withoutUnresolvableLinks: ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  }
  function makeInnerClient(
    options: ChainOptionWithAllLocalesAndWithoutLinkResolution
  ): ClientWithAllLocalesAndWithoutLinkResolution
  function makeInnerClient(
    options: ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  ): ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks

  function makeInnerClient(
    options: ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks
  ): ClientWithLinkResolutionAndWithoutUnresolvableLinks & {
    withAllLocales: ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  }
  function makeInnerClient(options: ChainOptions):
    | ClientWithLinkResolutionAndWithUnresolvableLinks
    | ClientWithoutLinkResolution
    | ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
    | ClientWithAllLocalesAndWithoutLinkResolution
    | ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks // TODO
    | ClientWithLinkResolutionAndWithoutUnresolvableLinks {
    if (isClientWithAllLocalesAndWithoutLinkResolution(options)) {
      return create<
        ChainOptionWithAllLocalesAndWithoutLinkResolution,
        ClientWithAllLocalesAndWithoutLinkResolution
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks(options)) {
      return create<
        ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
        ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithLinkResolutionAndWithUnresolvableLinks(options)) {
      return create<
        ChainOptionWithLinkResolutionAndWithUnresolvableLinks,
        ClientWithLinkResolutionAndWithUnresolvableLinks
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks(options)) {
      return create<
        ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
        ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithLinkResolutionAndWithoutUnresolvableLinks(options)) {
      return create<
        ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks,
        ClientWithLinkResolutionAndWithoutUnresolvableLinks
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithoutLinkResolution(options)) {
      return create<ChainOptionWithoutLinkResolution, ClientWithoutLinkResolution>(
        { http, getGlobalOptions },
        options,
        makeInnerClient
      )
    }

    return create<DefaultChainOption, DefaultClient>(
      { http, getGlobalOptions },
      {
        withoutLinkResolution: false,
        withAllLocales: false,
        withoutUnresolvableLinks: false,
      },
      makeInnerClient
    )
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
      return makeInnerClient({ withAllLocales: false, withoutLinkResolution: true })
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
