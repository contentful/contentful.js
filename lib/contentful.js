/**
 * Contentful CDA SDK. Allows you to create instances of a client with access
 * to the Contentful Content Delivery API.
 * @namespace contentful
 */

import createHttpClient from './create-http-client'
import createCdaApi from './create-cda-api'
import entities from './entities'

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
 * @returns {CDAClient.ClientAPI}
 * @example
 * const client = contentful.createClient({
 *  accessToken: 'myAccessToken',
 *  space: 'mySpaceId'
 * })
 */
export default function createClient (axios, params) {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  // Use resolveLinks param if specified, otherwise default to true
  const resolveLinks = !!('resolveLinks' in params ? params.resolveLinks : true)

  return createCdaApi({
    http: createHttpClient(axios, params),
    entities: entities,
    resolveLinksGlobalSetting: resolveLinks
  })
}
