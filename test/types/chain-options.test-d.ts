import { expectAssignable, expectNotAssignable, expectNotType, expectType } from 'tsd'
import { ChainModifiers } from '../../lib'
import { ChainOption, ChainOptions } from '../../lib/utils/client-helpers'

expectNotAssignable<ChainModifiers>('ANY_STRING')

expectAssignable<ChainOptions>({
  withoutLinkResolution: true as boolean,
  withAllLocales: true as boolean,
  withoutUnresolvableLinks: true as boolean,
  alpha_withContentSourceMaps: true as boolean,
})

expectType<ChainOption<undefined>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: true,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: true,
  alpha_withContentSourceMaps: false,
})

expectNotType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: false,
})

expectType<ChainOption<'ALPHA_WITH_CONTENT_SOURCE_MAPS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: true,
})

expectType<ChainOption<'ALPHA_WITH_CONTENT_SOURCE_MAPS' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: true,
  alpha_withContentSourceMaps: true,
})

expectNotType<ChainOption<'ALPHA_WITH_CONTENT_SOURCE_MAPS' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: true,
})

expectType<ChainOption<'ALPHA_WITH_CONTENT_SOURCE_MAPS' | 'WITHOUT_LINK_RESOLUTION'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
  alpha_withContentSourceMaps: true,
})
