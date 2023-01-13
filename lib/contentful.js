/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 * @namespace contentful
 * @see ContentfulClientAPI
 */

import axios from 'axios'
import { createHttpClient, getUserAgentHeader } from 'contentful-sdk-core'
import createContentfulApi from './create-contentful-api'
import createGlobalOptions from './create-global-options'

/**
 * Create a client instance
 * @func
 * @name createClient
 * @memberof contentful
 * @param {Object} params - Client initialization parameters
 * @prop {string} params.space - Space ID
 * @prop {string} params.accessToken - Contentful CDA Access Token
 * @prop {string} [params.environment="master"] - Contentful Environment ID
 * @prop {boolean=} params.insecure - Requests will be made over http instead of the default https (default: true)
 * @prop {string=} params.host - API host (default: cdn.contentful.com). Also usable with preview.contentful.com.
 * @prop {string=} params.basePath - Path appended to the host to support gateways/proxies with custom urls.
 * @prop {Object=} params.httpAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.httpsAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.proxy - Optional Axios proxy (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
 * @prop {Object=} params.headers - Optional additional headers
 * @prop {function=} params.adapter - Optional axios request adapter (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
 * @prop {boolean=?} params.resolveLinks - If we should resolve links between entries (default: true)
 * @prop {boolean=?} params.removeUnresolved - If we should remove links to entries which could not be resolved (default: false)
 * @prop {boolean=?} params.retryOnError - If we should retry on errors and 429 rate limit exceptions (default: true)
 * @prop {function=} params.logHandler - A log handler function to process given log messages & errors. Receives the log level (error, warning & info) and the actual log data (Error object or string). (The default can be found at: https://github.com/contentful/contentful-sdk-core/blob/master/src/create-http-client.ts)
 * @prop {string=?} params.application - Application name and version e.g myApp/version
 * @prop {string=?} params.integration - Integration name and version e.g react/version
 * @prop {number=} params.timeout in milliseconds - connection timeout (default:30000)
 * @prop {number=} params.retryLimit - Optional number of retries before failure. Default is 5
 * @returns {ContentfulClientAPI.ClientAPI}
 * @example
 * const contentful = require('contentful')
 * const client = contentful.createClient({
 *  accessToken: 'myAccessToken',
 *  space: 'mySpaceId'
 * })
 */

export function createClient (params) {
  if (!params.accessTokenBySpaceId) {
    throw new TypeError('Expected parameter accessTokenBySpaceId')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  const defaultConfig = {
    resolveLinks: true,
    resolveResourceLinks: true,
    removeUnresolved: false,
    defaultHostname: 'cdn.contentful.com',
    environment: 'master',
    accessTokenBySpaceId: {}
  }

  const config = {
    ...defaultConfig,
    ...params // This would overwrite accessTokenBySpaceId
    // accessTokenBySpaceId: {kaubyxzjeuta: ''}
  }

  const userAgentHeader = getUserAgentHeader(`contentful.js/${__VERSION__}`,
    config.application,
    config.integration
  )
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/vnd.contentful.delivery.v1+json',
    'X-Contentful-User-Agent': userAgentHeader
  }

  console.time('createContentfulApi per space')
  const contentfulApiBySpaceId = Object.entries(config.accessTokenBySpaceId).reduce((acc, [spaceId, accessToken]) => {
    const httpClient = createHttpClient(axios, {
      ...config,
      headers: Object.assign({}, config.headers),
      accessToken,
      space: spaceId
    })
    const getGlobalOptions = createGlobalOptions({
      resolveLinks: config.resolveLinks,
      resolveResourceLinks: config.resolveResourceLinks,
      environment: config.environment,
      removeUnresolved: config.removeUnresolved,
      spaceBaseUrl: httpClient.defaults.baseURL,
      environmentBaseUrl: `${httpClient.defaults.baseURL}environments/${config.environment}`
    })
    // Append environment to baseURL
    httpClient.defaults.baseURL = getGlobalOptions().environmentBaseUrl

    const api = createContentfulApi({
      http: httpClient,
      getGlobalOptions
    })
    acc[spaceId] = api
    return acc
  }, {})
  // const http = createHttpClient(axios, config)

  // const getGlobalOptions = createGlobalOptions({
  //   resolveLinks: config.resolveLinks,
  //   environment: config.environment,
  //   removeUnresolved: config.removeUnresolved,
  //   spaceBaseUrl: http.defaults.baseURL,
  //   environmentBaseUrl: `${http.defaults.baseURL}environments/${config.environment}`
  // })
  // // Append environment to baseURL
  // http.defaults.baseURL = getGlobalOptions().environmentBaseUrl

  Object.keys(config.accessTokenBySpaceId).forEach(spaceId => { contentfulApiBySpaceId[spaceId].extraApis = contentfulApiBySpaceId })
  console.timeEnd('createContentfulApi per space')
  return contentfulApiBySpaceId[config.space]
}
