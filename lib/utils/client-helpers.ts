export type ChainOptions = {
  withoutLinkResolution?: boolean
  withAllLocales?: boolean
}

export interface ChainOptionWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
}

export interface ChainOptionWithAllLocalesAndWithLinkResolution extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
}

export interface ChainOptionWithAllLocalesAndWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
  withAllLocales: true
}

export interface ChainOptionWithLinkResolution extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: false
}

export type DefaultChainOption = ChainOptionWithLinkResolution

export function isClientWithLinkResolution(
  options: ChainOptions
): options is ChainOptionWithLinkResolution {
  return options.withoutLinkResolution === false && options.withAllLocales === false
}

export function isClientWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithoutLinkResolution {
  return options.withoutLinkResolution === true
}

export function isClientWithAllLocalesAndWithLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithLinkResolution {
  return options.withAllLocales === true && options.withoutLinkResolution === false
}

export function isClientWithAllLocalesAndWithoutLinkResolution(
  options: ChainOptions
): options is ChainOptionWithAllLocalesAndWithoutLinkResolution {
  return options.withAllLocales === true && options.withoutLinkResolution === true
}
