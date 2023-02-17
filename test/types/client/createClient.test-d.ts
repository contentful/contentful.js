import { expectType } from 'tsd'

import { createClient } from '../../../lib'
import {
  ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithAllLocalesAndWithoutLinkResolution,
  ClientWithLinkResolutionAndWithoutUnresolvableLinks,
  ClientWithLinkResolutionAndWithUnresolvableLinks,
  ClientWithoutLinkResolution,
} from '../../../lib/create-contentful-api'

const CLIENT_OPTIONS = {
  accessToken: 'accessToken',
  space: 'spaceId',
}

expectType<ClientWithLinkResolutionAndWithUnresolvableLinks>(createClient(CLIENT_OPTIONS))

expectType<ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks>(
  createClient(CLIENT_OPTIONS).withAllLocales
)

expectType<ClientWithAllLocalesAndWithoutLinkResolution>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutLinkResolution
)

expectType<ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks>(
  createClient(CLIENT_OPTIONS).withAllLocales.withoutUnresolvableLinks
)
expectType<ClientWithoutLinkResolution>(createClient(CLIENT_OPTIONS).withoutLinkResolution)

expectType<ClientWithLinkResolutionAndWithoutUnresolvableLinks>(
  createClient(CLIENT_OPTIONS).withoutUnresolvableLinks
)
