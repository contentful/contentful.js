/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 */

import axios from 'axios'
import { createHttpClient, getUserAgentHeader } from 'contentful-sdk-core'
import { ContentfulClientApi } from './create-contentful-api'
import createGlobalOptions from './create-global-options'
import { makeClient } from './make-client'
import type { AxiosAdapter, AxiosRequestConfig } from 'axios'
import { validateRemoveUnresolvedParam, validateResolveLinksParam } from './utils/validate-params'

export type ClientLogLevel = 'error' | 'warning' | 'info' | string

/**
 * Client initialization parameters
 */
export interface CreateClientParams {
  /**
   * Space ID
   */
  space: string
  /**
   * Contentful CDA Access Token
   */
  accessToken: string
  /**
   * Contentful Environment ID
   * @defaultValue "master"
   */
  environment?: string
  /**
   * Requests will be made over http instead of the default https
   * @defaultValue true
   */
  insecure?: boolean
  /**
   * API host. Also usable with preview.contentful.com.
   * @defaultValue "cdn.contentful.com"
   */
  host?: string
  /**
   * Path appended to the host to support gateways/proxies with custom urls
   */
  basePath?: string
  /**
   * Optional Node.js HTTP agent for proxying
   * (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a>
   * and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
   */
  httpAgent?: AxiosRequestConfig['httpAgent']
  /**
   * Optional Node.js HTTP agent for proxying
   * (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a>
   * and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
   */
  httpsAgent?: AxiosRequestConfig['httpsAgent']
  /**
   * Optional Axios proxy (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
   */
  proxy?: AxiosRequestConfig['proxy']
  /**
   * Optional additional headers
   */
  headers?: Record<string, string>
  /**
   * Optional axios request adapter (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
   */
  adapter?: AxiosAdapter
  /**
   * Application name and version e.g myApp/version
   */
  application?: string
  /**
   * Integration name and version e.g react/version
   */
  integration?: string
  /**
   * If we should retry on errors and 429 rate limit exceptions
   * @defaultValue true
   */
  retryOnError?: boolean
  /**
   * A log handler function to process given log messages and errors.
   * (The default can be found at: https://github.com/contentful/contentful-sdk-core/blob/master/src/create-http-client.ts)
   * @param level Log level, e.g. error, warning, or info
   * @param data Log data
   */
  logHandler?: (level: ClientLogLevel, data?: Record<string, any> | string) => void
  /**
   * connection timeout in milliseconds (default:30000)
   */
  timeout?: number
  /**
   * Optional number of retries before failure.
   * @defaultValue 5
   */
  retryLimit?: number
}

/**
 * Create a client instance
 * @param params Client initialization parameters
 * @example
 * const contentful = require('contentful')
 * const client = contentful.createClient({
 *   accessToken: 'myAccessToken',
 *   space: 'mySpaceId'
 * })
 */
export function createClient(params: CreateClientParams): ContentfulClientApi {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  validateResolveLinksParam(params)
  validateRemoveUnresolvedParam(params)

  const defaultConfig = {
    resolveLinks: true,
    removeUnresolved: false,
    defaultHostname: 'cdn.contentful.com',
    environment: 'master',
  }

  const config = {
    ...defaultConfig,
    ...params,
  }

  const userAgentHeader = getUserAgentHeader(
    `contentful.js/${__VERSION__}`,
    config.application,
    config.integration
  )
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/vnd.contentful.delivery.v1+json',
    'X-Contentful-User-Agent': userAgentHeader,
  }

  const http = createHttpClient(axios, config)

  if (!http.defaults.baseURL) {
    throw new Error('Please define a baseURL')
  }

  const getGlobalOptions = createGlobalOptions({
    space: config.space,
    environment: config.environment,
    spaceBaseUrl: http.defaults.baseURL,
    environmentBaseUrl: `${http.defaults.baseURL}environments/${config.environment}`,
  })
  // Append environment to baseURL
  http.defaults.baseURL = getGlobalOptions({}).environmentBaseUrl

  return makeClient({
    http,
    getGlobalOptions,
  })
}
