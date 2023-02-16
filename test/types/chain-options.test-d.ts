import { expectAssignable, expectNotType, expectType } from 'tsd'
import { ChainOption, ChainOptions } from '../../lib/utils/client-helpers'

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

expectType<ChainOption<'noUnresolvableLinks'>>({
  withoutLinkResolution: false,
  withAllLocales: false,
  withoutUnresolvableLinks: true,
})

expectType<ChainOption<'noLinkResolution'>>({
  withoutLinkResolution: true,
  withAllLocales: false,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'allLocales'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})

expectAssignable<ChainOption<'allLocales' | 'noUnresolvableLinks'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: true,
})

expectNotType<ChainOption<'allLocales' | 'noUnresolvableLinks'>>({
  withoutLinkResolution: false,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})

expectType<ChainOption<'allLocales' | 'noLinkResolution'>>({
  withoutLinkResolution: true,
  withAllLocales: true,
  withoutUnresolvableLinks: false,
})
