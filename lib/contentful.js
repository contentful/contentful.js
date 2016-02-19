/* @flow */

/**
 * Contentful CDA Client
 * @namespace contentful
 */

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
 * Create a client instance
 * @func
 * @name createClient
 * @memberof contentful
 * @param {Object} params - Client initialization parameters
 * @prop {string} params.space - Space ID
 * @prop {string} params.accessToken - Contentful CDA Access Token
 * @prop {boolean=} params.insecure - Requests will be made over http instead of the default https (default: true)
 * @prop {string=} params.host - API host (default: cda.contentful.com)
 * @prop {Object=} params.agent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.headers - Optional additional headers
 * @returns {ContentfulCdaApi.ClientApi}
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
