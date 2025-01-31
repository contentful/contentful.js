import { expectTypeOf, test } from 'vitest'

import { ContentfulClientApi, createClient } from '../../../lib'

const CLIENT_OPTIONS = {
  accessToken: 'accessToken',
  space: 'spaceId',
}

test('createClient', () => {
  expectTypeOf<ContentfulClientApi<undefined>>(createClient(CLIENT_OPTIONS))

  expectTypeOf<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION'>>(
    createClient(CLIENT_OPTIONS).withoutLinkResolution,
  )
  expectTypeOf<never>(createClient(CLIENT_OPTIONS).withoutLinkResolution.withoutLinkResolution)
  expectTypeOf<never>(createClient(CLIENT_OPTIONS).withoutLinkResolution.withoutUnresolvableLinks)

  expectTypeOf<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES'>>(
    createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withoutLinkResolution,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withAllLocales,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withoutLinkResolution,
  )

  expectTypeOf<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'>>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withoutUnresolvableLinks,
  )
  expectTypeOf<never>(createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withoutLinkResolution)

  expectTypeOf<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES'>>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withoutUnresolvableLinks,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withAllLocales,
  )
  expectTypeOf<never>(
    createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withoutLinkResolution,
  )

  expectTypeOf<ContentfulClientApi<'WITH_ALL_LOCALES'>>(createClient(CLIENT_OPTIONS).withAllLocales)
  expectTypeOf<never>(createClient(CLIENT_OPTIONS).withAllLocales.withAllLocales)

  expectTypeOf<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
    createClient(CLIENT_OPTIONS).withAllLocales.withoutLinkResolution,
  )

  expectTypeOf<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
    createClient(CLIENT_OPTIONS).withAllLocales.withoutUnresolvableLinks,
  )
})
