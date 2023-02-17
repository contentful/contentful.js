export type ChainModifiers =
  | 'WITH_ALL_LOCALES'
  | 'WITHOUT_LINK_RESOLUTION'
  | 'WITHOUT_UNRESOLVABLE_LINKS'
  | unknown
  | undefined

export type ChainOption<Modifiers extends ChainModifiers = undefined> = {
  withoutLinkResolution: unknown extends Modifiers
    ? boolean
    : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? true
    : false
  withAllLocales: unknown extends Modifiers
    ? boolean
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? true
    : false
  withoutUnresolvableLinks: unknown extends Modifiers
    ? boolean
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? true
    : false
}

export type DefaultChainOption = ChainOption

export type ChainOptions = ChainOption<unknown>
