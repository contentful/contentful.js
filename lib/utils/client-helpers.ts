export type ChainModifiers =
  | 'allLocales'
  | 'noLinkResolution'
  | 'noUnresolvableLinks'
  | unknown
  | undefined

export type ChainOption<Modifiers extends ChainModifiers = undefined> = {
  withoutLinkResolution: unknown extends Modifiers
    ? boolean
    : 'noLinkResolution' extends Modifiers
    ? true
    : false
  withAllLocales: unknown extends Modifiers
    ? boolean
    : 'allLocales' extends Modifiers
    ? true
    : false
  withoutUnresolvableLinks: unknown extends Modifiers
    ? boolean
    : 'noUnresolvableLinks' extends Modifiers
    ? true
    : false
}

export type BaseChainOptions = {
  withoutLinkResolution: boolean
  withAllLocales: boolean
  withoutUnresolvableLinks: boolean
}

export type ChainOptionWithoutLinkResolution = ChainOption<'noLinkResolution'>
export type ChainOptionWithLinkResolutionAndWithUnresolvableLinks = ChainOption
export type ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks =
  ChainOption<'noUnresolvableLinks'>
export type ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks =
  ChainOption<'allLocales'>
export type ChainOptionWithAllLocalesAndWithoutLinkResolution = ChainOption<
  'allLocales' | 'noLinkResolution'
>
export type ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks = ChainOption<
  'allLocales' | 'noUnresolvableLinks'
>

export type DefaultChainOption = ChainOptionWithLinkResolutionAndWithUnresolvableLinks

export type ChainOptions = ChainOption<unknown>
