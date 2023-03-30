export type ChainModifiers =
  | 'WITH_ALL_LOCALES'
  | 'WITHOUT_LINK_RESOLUTION'
  | 'WITHOUT_UNRESOLVABLE_LINKS'
  | undefined

export type AddChainModifier<
  Modifiers extends ChainModifiers,
  AddedModifiers extends Exclude<ChainModifiers, undefined>
> = undefined extends Modifiers ? AddedModifiers : Modifiers | AddedModifiers

export type ChainOption<Modifiers extends ChainModifiers = ChainModifiers> = {
  withoutLinkResolution: ChainModifiers extends Modifiers
    ? boolean
    : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? true
    : false
  withAllLocales: ChainModifiers extends Modifiers
    ? boolean
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? true
    : false
  withoutUnresolvableLinks: ChainModifiers extends Modifiers
    ? boolean
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? true
    : false
}

export type DefaultChainOption = ChainOption<undefined>

export type ChainOptions = ChainOption

export type ModifiersFromOptions<Options extends ChainOption> = Options extends ChainOption<
  infer Modifiers
>
  ? Modifiers
  : never
