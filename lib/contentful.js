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
function createClient (params: ClientParams) : ContentfulClient {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  return createCdaApi(createHttpClient(params), params.resolveLinks)
}

export default {
  createClient: createClient
}
