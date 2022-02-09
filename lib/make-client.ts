import createContentfulApi from './create-contentful-api'

import {
  ChainOptions,
  ChainOptionWithAllLocalesAndWithLinkResolution,
  ChainOptionWithAllLocalesAndWithoutLinkResolution,
  ChainOptionWithLinkResolution,
  ChainOptionWithoutLinkResolution,
  Client,
  ClientChain,
  ClientWithAllLocalesAndWithLinkResolution,
  ClientWithAllLocalesAndWithoutLinkResolution,
  ClientWithLinkResolution,
  ClientWithoutLinkResolution,
  DefaultChainOption,
  DefaultClient,
  EntriesResponse,
} from './types/client'

function isClientWithLinkResolution(
  options: ChainOptions
): options is ChainOptionWithLinkResolution {
  return options.withoutLinkResolution === false && options.withAllLocales === false
}

function isClientWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithoutLinkResolution {
  return options.withoutLinkResolution === true
}

function isClientWithAllLocalesAndWithLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolution {
  return options.withAllLocales === true && options.withoutLinkResolution === false
}

function isClientWithAllLocalesAndWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithoutLinkResolution {
  return options.withAllLocales === true && options.withoutLinkResolution === true
}

// "makeGreeter"
// createContentfulApi
function createChainedClient<ReturnType extends EntriesResponse, OptionType extends ChainOptions>(
  options: OptionType
): ClientChain<ReturnType> {
  if (!options.withoutLinkResolution && !options.withAllLocales) {
    // This is the default client instantiation so
    // return the client with all its default methods.
  }
  // If not, only return getEntries, as we are an innerClient
  return {
    getEntries: makeGetEntries(options) as unknown as ClientChain<ReturnType>['getEntries'],
  }
}

function createDefaultClient<ReturnType extends EntriesResponse, OptionType>(
  options: OptionType
): ClientChain<ReturnType> {
  // Refactor: move "as unknown" logic into makeGetEntries
  return {
    getEntries: makeGetEntries(options) as unknown as ClientChain<ReturnType>['getEntries'],
  }
}

// This is where we will based on generics define different return
// shapes for several getEntries methods.
// "makeGreeting"
function makeGetEntries(options: ChainOptions) {
  if (isClientWithAllLocalesAndWithoutLinkResolution(options)) {
    return () => Promise.resolve(EntriesResponse.WithAllLocalesAndWithoutLinkResolution)
  }
  if (isClientWithAllLocalesAndWithLinkResolution(options)) {
    return () => Promise.resolve(EntriesResponse.WithAllLocalesAndWithLinkResolution)
  }
  if (isClientWithoutLinkResolution(options)) {
    return () => Promise.resolve(EntriesResponse.WithoutLinkResolution)
  }
  if (isClientWithLinkResolution(options)) {
    return () => Promise.resolve(EntriesResponse.WithLinkResolution)
  }
  return () => Promise.resolve(EntriesResponse.Default)
}

function create<ResponseT extends EntriesResponse, OptionsType, ClientType>(
  options: OptionsType,
  makeInnerClient: (options: OptionsType) => ClientType
) {
  console.log({ options })

  const client = createChainedClient<ResponseT, OptionsType>(options)
  const response: any = client
  Object.defineProperty(response, 'withAllLocales', {
    get: () => makeInnerClient({ ...options, withAllLocales: true }),
  })
  Object.defineProperty(response, 'withoutLinkResolution', {
    get: () => makeInnerClient({ ...options, withoutLinkResolution: true }),
  })
  return Object.create(response) as ClientType
}

export const makeClient = ({ http, getGlobalOptions }): Client => {
  // and call to createContentfulApi (= createChainedClient)
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
        EntriesResponse.WithAllLocalesAndWithoutLinkResolution,
        ChainOptionWithAllLocalesAndWithoutLinkResolution,
        ClientWithAllLocalesAndWithoutLinkResolution
      >(options, makeInnerClient)
    }

    if (isClientWithAllLocalesAndWithLinkResolution(options)) {
      return create<
        EntriesResponse.WithAllLocalesAndWithLinkResolution,
        ChainOptionWithAllLocalesAndWithLinkResolution,
        ClientWithAllLocalesAndWithLinkResolution
      >(options, makeInnerClient)
    }

    if (isClientWithLinkResolution(options)) {
      return create<
        EntriesResponse.WithLinkResolution,
        ChainOptionWithLinkResolution,
        ClientWithLinkResolution
      >(options, makeInnerClient)
    }

    if (isClientWithoutLinkResolution(options)) {
      return create<
        EntriesResponse.WithoutLinkResolution,
        ChainOptionWithoutLinkResolution,
        ClientWithoutLinkResolution
      >(options, makeInnerClient)
    }

    return create<EntriesResponse.Default, DefaultChainOption, DefaultClient>(
      {
        withoutLinkResolution: false,
        withAllLocales: false,
      },
      makeInnerClient
    )
  }

  // This client most likely needs to be instantiated with ALL methods, not just getEntries
  const client = createChainedClient<EntriesResponse.Default, DefaultChainOption>({
    withoutLinkResolution: false,
    withAllLocales: false,
  })

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
