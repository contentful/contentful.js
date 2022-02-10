import createContentfulApi, {
  ClientWithAllLocalesAndWithLinkResolution,
  ClientWithAllLocalesAndWithoutLinkResolution,
  ClientWithLinkResolution,
  ClientWithoutLinkResolution,
  ContentfulClientApi,
  CreateContentfulApiParams,
  DefaultClient,
} from './create-contentful-api'
import {
  ChainOptions,
  ChainOptionWithAllLocalesAndWithLinkResolution,
  ChainOptionWithAllLocalesAndWithoutLinkResolution,
  ChainOptionWithLinkResolution,
  ChainOptionWithoutLinkResolution,
  DefaultChainOption,
  isClientWithAllLocalesAndWithLinkResolution,
  isClientWithAllLocalesAndWithoutLinkResolution,
  isClientWithLinkResolution,
  isClientWithoutLinkResolution,
} from './utils/client-helpers'

function create<OptionsType, ClientType>(
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
    withAllLocales: ClientWithAllLocalesAndWithLinkResolution
    withoutLinkResolution: ClientWithoutLinkResolution
  }
  function makeInnerClient(
    options: ChainOptionWithoutLinkResolution
  ): ClientWithoutLinkResolution & {
    withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
  }
  function makeInnerClient(
    options: ChainOptionWithAllLocalesAndWithLinkResolution
  ): ClientWithAllLocalesAndWithLinkResolution & {
    withoutLinkResolution: ClientWithAllLocalesAndWithoutLinkResolution
  }
  function makeInnerClient(
    options: ChainOptionWithAllLocalesAndWithoutLinkResolution
  ): ClientWithAllLocalesAndWithoutLinkResolution
  function makeInnerClient(
    options: ChainOptions
  ):
    | ClientWithLinkResolution
    | ClientWithoutLinkResolution
    | ClientWithAllLocalesAndWithLinkResolution
    | ClientWithAllLocalesAndWithoutLinkResolution {
    if (isClientWithAllLocalesAndWithoutLinkResolution(options)) {
      return create<
        ChainOptionWithAllLocalesAndWithoutLinkResolution,
        ClientWithAllLocalesAndWithoutLinkResolution
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithAllLocalesAndWithLinkResolution(options)) {
      return create<
        ChainOptionWithAllLocalesAndWithLinkResolution,
        ClientWithAllLocalesAndWithLinkResolution
      >({ http, getGlobalOptions }, options, makeInnerClient)
    }

    if (isClientWithLinkResolution(options)) {
      return create<ChainOptionWithLinkResolution, ClientWithLinkResolution>(
        { http, getGlobalOptions },
        options,
        makeInnerClient
      )
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
      },
      makeInnerClient
    )
  }

  const client = createContentfulApi<DefaultChainOption>(
    { http, getGlobalOptions },
    {
      withoutLinkResolution: false,
      withAllLocales: false,
    }
  )

  return {
    ...client,
    get withAllLocales() {
      return makeInnerClient({ withAllLocales: true, withoutLinkResolution: false })
    },
    get withoutLinkResolution() {
      return makeInnerClient({ withAllLocales: false, withoutLinkResolution: true })
    },
  }
}
