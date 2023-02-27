import { expectNotAssignable, expectType } from 'tsd'

import { createClient } from '../../../lib'
import { Client } from '../../../lib/create-contentful-api'

const CLIENT_OPTIONS = {
  accessToken: 'accessToken',
  space: 'spaceId',
}

expectType<Client<undefined>>(createClient(CLIENT_OPTIONS))

expectType<Client<'WITHOUT_LINK_RESOLUTION'>>(createClient(CLIENT_OPTIONS).withoutLinkResolution)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)
expectNotAssignable<{ withoutUnresolvableLinks: any }>(
  createClient(CLIENT_OPTIONS).withoutLinkResolution
)

expectType<Client<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES'>>(
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

expectType<Client<'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
expectNotAssignable<{ withoutUnresolvableLinks: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
expectNotAssignable<{ withoutLinkResolution: any }>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)

expectType<Client<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES'>>(
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

expectType<Client<'WITH_ALL_LOCALES'>>(createClient(CLIENT_OPTIONS).withAllLocales)
expectNotAssignable<{ withAllLocales: any }>(createClient(CLIENT_OPTIONS).withAllLocales)

expectType<Client<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutLinkResolution
)

expectType<Client<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutUnresolvableLinks
)
