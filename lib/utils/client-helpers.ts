export type ChainOptions = {
  withoutLinkResolution?: boolean
  withAllLocales?: boolean
  withoutUnresolvableLinks?: boolean
}

export interface ChainOptionWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
}

export interface ChainOptionWithLinkResolutionAndWithUnresolvableLinks extends ChainOptions {
  withAllLocales: false
  withoutLinkResolution: false
  withoutUnresolvableLinks: false
}
export interface ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks extends ChainOptions {
  withAllLocales: false
  withoutLinkResolution: false
  withoutUnresolvableLinks: true
}

export interface ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
  withoutUnresolvableLinks: false
}

export interface ChainOptionWithAllLocalesAndWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
  withAllLocales: true
}

export interface ChainOptionWithLinkResolutionAndWithUnresolvableLinks extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: false
  withoutUnresolvableLinks: false
}

export interface ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
  withoutUnresolvableLinks: true
}

export type DefaultChainOption = ChainOptionWithLinkResolutionAndWithUnresolvableLinks

export function isClientWithLinkResolutionAndWithUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithLinkResolutionAndWithUnresolvableLinks {
  return (
    options.withoutLinkResolution === false &&
    options.withAllLocales === false &&
    options.withoutUnresolvableLinks === false
  )
}

export function isClientWithLinkResolutionAndWithoutUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks {
  return (
    options.withAllLocales === false &&
    options.withoutLinkResolution === false &&
    options.withoutUnresolvableLinks === true
  )
}

export function isClientWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithoutLinkResolution {
  return options.withoutLinkResolution === true
}

export function isClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks {
  return (
    options.withAllLocales === true &&
    options.withoutLinkResolution === false &&
    options.withoutUnresolvableLinks === false
  )
}

export function isClientWithAllLocalesAndWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithoutLinkResolution {
  return options.withAllLocales === true && options.withoutLinkResolution === true
}

export function isClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks {
  return (
    options.withAllLocales === true &&
    options.withoutLinkResolution === false &&
    options.withoutUnresolvableLinks === true
  )
}
