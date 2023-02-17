import { expectAssignable, expectNotAssignable, expectNotType, expectType } from 'tsd'
import { ChainModifiers, ChainOption, ChainOptions } from '../../lib/utils/client-helpers'

expectNotAssignable<ChainModifiers>('ANY_STRING')

expectAssignable<ChainOptions>({
  withoutLinkResolution: true as boolean,
  withAllLocales: true as boolean,
  withoutUnresolvableLinks: true as boolean,
})

expectType<ChainOption>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: true,
})

expectType<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: true,
})

expectNotType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})
