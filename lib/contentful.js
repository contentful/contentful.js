/* @flow */
import createHttpClient from './create-http-client'
import createCdaApi from './create-cda-api'
import type {ContentfulClient} from './create-cda-api'

type ClientParams = {
  space: string,
  accessToken: string,
  insecure?: boolean,
  host?: string,
  resolveLinks?: boolean,
  agent?: Object,
  headers?: Object
}

/**
 * The contentful client
 */
export default function createClient (axios: Object, params: ClientParams) : ContentfulClient {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  // Use resolveLinks param if specified, otherwise default to true
  const resolveLinks = !!('resolveLinks' in params ? params.resolveLinks : true)

  return createCdaApi(createHttpClient(axios, params), resolveLinks)
}
