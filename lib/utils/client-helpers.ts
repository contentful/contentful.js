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
