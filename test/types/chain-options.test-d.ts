import { expectTypeOf, test } from "vitest";
import { ChainOption, ChainOptions } from '../../lib/utils/client-helpers'
import { ChainModifiers } from '../../lib'

test('chain-options', async () => {
  expectTypeOf('ANY_STRING').not.toEqualTypeOf<ChainModifiers>()

  expectTypeOf<ChainOptions>({
    withoutLinkResolution: true as boolean,
    withAllLocales: true as boolean,
    withoutUnresolvableLinks: true as boolean,
  })

  expectTypeOf<ChainOption<undefined>>({
    withoutLinkResolution: false,
    withAllLocales: false,
    withoutUnresolvableLinks: false,
  })

  expectTypeOf<ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>({
    withoutLinkResolution: false,
    withAllLocales: false,
    withoutUnresolvableLinks: true,
  })

  expectTypeOf<ChainOption<'WITHOUT_LINK_RESOLUTION'>>({
    withoutLinkResolution: true,
    withAllLocales: false,
    withoutUnresolvableLinks: false,
  })

  expectTypeOf<ChainOption<'WITH_ALL_LOCALES'>>({
    withoutLinkResolution: false,
    withAllLocales: true,
    withoutUnresolvableLinks: false,
  })

  expectTypeOf<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
    withoutLinkResolution: false,
    withAllLocales: true,
    withoutUnresolvableLinks: true,
  })

  expectTypeOf<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>({
    withoutLinkResolution: false,
    withAllLocales: true,
    withoutUnresolvableLinks: false,
  })

  expectTypeOf<ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>({
    withoutLinkResolution: true,
    withAllLocales: true,
    withoutUnresolvableLinks: false,
  })
})