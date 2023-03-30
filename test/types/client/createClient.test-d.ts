import { expectNotAssignable, expectType } from 'tsd'

import { ContentfulClientApi, createClient } from '../../../lib'

const CLIENT_OPTIONS = {
  accessToken: 'accessToken',
  space: 'spaceId',
}

expectType<ContentfulClientApi<undefined>>(createClient(CLIENT_OPTIONS))

expectType<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION'>>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)
expectNotAssignable<{ withoutUnresolvableLinks: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)

expectType<ContentfulClientApi<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES'>>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales
)
expectNotAssignable<{ withAllLocales: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution.withAllLocales
)

expectType<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
expectNotAssignable<{ withoutUnresolvableLinks: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)

expectType<ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES'>>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales
)
expectNotAssignable<{ withoutUnresolvableLinks: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales
)
expectNotAssignable<{ withAllLocales: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks.withAllLocales
)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES'>>(createClient(CLIENT_OPTIONS).withAllLocales)
expectNotAssignable<{ withAllLocales: any }>(createClient(CLIENT_OPTIONS).withAllLocales)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutLinkResolution
)

expectType<ContentfulClientApi<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutUnresolvableLinks
)
