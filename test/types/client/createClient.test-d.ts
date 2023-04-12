import { expectType } from 'tsd'

import { ContentfulClientApi, createClient } from '../../../lib'

const CLIENT_OPTIONS = {
  accessToken: 'accessToken',
  space: 'spaceId',
}

expectType<ContentfulClientApi<undefined>>(createClient(CLIENT_OPTIONS))

expectType<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION'>>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)
expectType<never>(createClient(CLIENT_OPTIONS).withoutLinkResolution.withoutLinkResolution)
expectType<never>(createClient(CLIENT_OPTIONS).withoutLinkResolution.withoutUnresolvableLinks)

expectType<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES'>>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales
)
expectType<never>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withoutLinkResolution
)
expectType<never>(createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withAllLocales)
expectType<never>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales.withoutLinkResolution
)

expectType<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
expectType<never>(createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withoutUnresolvableLinks)
expectType<never>(createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withoutLinkResolution)

expectType<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES'>>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales
)
expectType<never>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withoutUnresolvableLinks
)
expectType<never>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withAllLocales
)
expectType<never>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales.withoutLinkResolution
)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES'>>(createClient(CLIENT_OPTIONS).withAllLocales)
expectType<never>(createClient(CLIENT_OPTIONS).withAllLocales.withAllLocales)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutLinkResolution
)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutUnresolvableLinks
)
