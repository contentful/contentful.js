export type BaseChainOptions = {
  withoutLinkResolution: boolean
  withAllLocales: boolean
  withoutUnresolvableLinks: boolean
}

export interface ChainOptionWithoutLinkResolution extends BaseChainOptions {
  withoutLinkResolution: true
  withAllLocales: false
  withoutUnresolvableLinks: false
}

export interface ChainOptionWithLinkResolutionAndWithUnresolvableLinks extends BaseChainOptions {
  withAllLocales: false
  withoutLinkResolution: false
  withoutUnresolvableLinks: false
}
export interface ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks extends BaseChainOptions {
  withAllLocales: false
  withoutLinkResolution: false
  withoutUnresolvableLinks: true
}

export interface ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  extends BaseChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
  withoutUnresolvableLinks: false
}

export interface ChainOptionWithAllLocalesAndWithoutLinkResolution extends BaseChainOptions {
  withoutLinkResolution: true
  withAllLocales: true
  withoutUnresolvableLinks: false
}

export interface ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  extends BaseChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
  withoutUnresolvableLinks: true
}

export type ChainOptions =
  | ChainOptionWithoutLinkResolution
  | ChainOptionWithLinkResolutionAndWithUnresolvableLinks
  | ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks
  | ChainOptionWithAllLocalesAndWithoutLinkResolution
  | ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  | ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks

export type DefaultChainOption = ChainOptionWithLinkResolutionAndWithUnresolvableLinks

export function isClientWithLinkResolutionAndWithUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithLinkResolutionAndWithUnresolvableLinks {
  return (
    !options.withoutLinkResolution && !options.withAllLocales && !options.withoutUnresolvableLinks
  )
}

export function isClientWithLinkResolutionAndWithoutUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks {
  return (
    !options.withoutLinkResolution && !options.withAllLocales && options.withoutUnresolvableLinks
  )
}

export function isClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks {
  return (
    !options.withoutLinkResolution && options.withAllLocales && !options.withoutUnresolvableLinks
  )
}

export function isClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks {
  return (
    !options.withoutLinkResolution && options.withAllLocales && options.withoutUnresolvableLinks
  )
}

export function isClientWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithoutLinkResolution {
  return options.withoutLinkResolution
}

export function isClientWithAllLocalesAndWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithoutLinkResolution {
  return options.withoutLinkResolution && options.withAllLocales
}
