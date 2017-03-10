/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 * @namespace contentful
 * @see ContentfulClientAPI
 */

import defaults from 'lodash/defaults'
import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import version from '../version'
import {createHttpClient, wrapHttpClient} from 'contentful-sdk-core'
import createContentfulApi from './create-contentful-api'
import createLinkResolver from './create-link-resolver'

/**
 * Create a client instance
 * @func
 * @name createClient
 * @memberof contentful
 * @param {Object} params - Client initialization parameters
 * @prop {string} params.space - Space ID
 * @prop {string} params.accessToken - Contentful CDA Access Token
 * @prop {boolean=} params.insecure - Requests will be made over http instead of the default https (default: true)
 * @prop {string=} params.host - API host (default: cdn.contentful.com). Also usable with preview.contentful.com.
 * @prop {Object=} params.agent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.headers - Optional additional headers
 * @prop {number=} params.concurrency - Number of allowed concurrent requests. Changing this value is not recommended. (default: 6)
 * @prop {number=} params.delay - Delay in milliseconds for waiting after hitting the allowed number of concurrent requests. Changing this value is not recommended. (default: 1000)
 * @prop {number=} params.maxRetries - Maximum number of retries when a 429 is received (default: 5)
 * @prop {boolean=} params.retryOnTooManyRequests - If we should retry on 429s (default: true)
 * @prop {boolean=} params.resolveLinks - If we should resolve links between entries
 * @returns {ContentfulClientAPI.ClientAPI}
 * @example
 * const client = contentful.createClient({
 *  accessToken: 'myAccessToken',
 *  space: 'mySpaceId'
 * })
 */
export default function createClient (axios, params) {
  params = defaults(cloneDeep(params), {
    concurrency: 9,
    delay: 1000,
    maxRetries: 5,
    retryOnTooManyRequests: true
  })

  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  // Use resolveLinks param if specified, otherwise default to true
  const resolveLinks = !!('resolveLinks' in params ? params.resolveLinks : true)
  const shouldLinksResolve = createLinkResolver(resolveLinks)

  params.defaultHostname = 'cdn.contentful.com'
  params.headers = assign(params.headers, {
    'Content-Type': 'application/vnd.contentful.delivery.v1+json',
    'X-Contentful-User-Agent': 'contentful.js/' + version
  })

  const http = wrapHttpClient(createHttpClient(axios, params), {
    concurrency: params.concurrency,
    delay: params.delay,
    maxRetries: params.maxRetries,
    retryOnTooManyRequests: params.retryOnTooManyRequests
  })

  return createContentfulApi({
    http: http,
    shouldLinksResolve: shouldLinksResolve
  })
}
