import { expectAssignable, expectNotAssignable, expectNotType, expectType } from 'tsd'
import { ChainOption, ChainOptions } from '../../lib/utils/client-helpers'
import { ChainModifiers } from '../../lib'

expectNotAssignable<ChainModifiers>('ANY_STRING')

expectAssignable<ChainOptions>({
  withoutLinkResolution: true as boolean,
  withAllLocales: true as boolean,
  withoutUnresolvableLinks: true as boolean,
  withLocaleBasedPublishing: true as boolean,
})

expectType<ChainOption<undefined>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  withLocaleBasedPublishing: false,
})

expectType<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withLocaleBasedPublishing: false,
  withoutUnresolvableLinks: true,
})

expectType<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withLocaleBasedPublishing: false,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withLocaleBasedPublishing: false,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withLocaleBasedPublishing: false,
  withAllLocales: true,
  withoutUnresolvableLinks: true,
})

expectNotType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withLocaleBasedPublishing: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
  withLocaleBasedPublishing: false,
})

expectType<ChainOption<'WITH_LOCALE_BASED_PUBLISHING'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  withLocaleBasedPublishing: true,
})

expectType<ChainOption<'WITH_LOCALE_BASED_PUBLISHING' | 'WITH_ALL_LOCALES'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
  withLocaleBasedPublishing: true,
})

expectType<ChainOption<'WITH_LOCALE_BASED_PUBLISHING' | 'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  withLocaleBasedPublishing: true,
})

expectType<ChainOption<'WITH_LOCALE_BASED_PUBLISHING' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: true,
  withLocaleBasedPublishing: true,
})
