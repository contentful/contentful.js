/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 * @namespace contentful
 * @see ContentfulClientAPI
 */

import axios, { AxiosInstance } from '@contentful/axios'
// TODO: fix the decalration
import {createHttpClient, getUserAgentHeader} from 'contentful-sdk-core'
import createContentfulApi from './create-contentful-api'
import createGlobalOptions from './create-global-options'
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { AxiosProxyConfig } from './interfaces';

let __VERSION__:string;

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
 * @prop {boolean=?} params.resolveLinks - If we should resolve links between entries (default: true)
 * @prop {boolean=?} params.removeUnresolved - If we should remove links to entries which could not be resolved (default: false)
 * @prop {boolean=?} params.retryOnError - If we should retry on errors and 429 rate limit exceptions (default: true)
 * @prop {function=} params.logHandler - A log handler function to process given log messages & errors. Receives the log level (error, warning & info) and the actual log data (Error object or string). (The default can be found at: https://github.com/contentful/contentful-sdk-core/blob/master/lib/create-http-client.js)
 * @prop {string=?} params.application - Application name and version e.g myApp/version
 * @prop {string=?} params.integration - Integration name and version e.g react/version
 * @prop {number=?} params.timeout in milliseconds - connection timeout (default:30000)
 * @returns {ContentfulClientAPI.ClientAPI}
 * @example
 * const contentful = require('contentful')
 * const client = contentful.createClient({
 *  accessToken: 'myAccessToken',
 *  space: 'mySpaceId'
 * })
 */

interface ContentfulOptions {
  space: string;
  accessToken: string;
  insecure?: boolean;
  host?: string;
  basePath?: string;
  httpAgent?: HttpAgent;
  httpsAgent?: HttpsAgent;
  proxy?: AxiosProxyConfig;
  headers?: object;
  resolveLinks: boolean;
  removeUnresolved: boolean;
  retryOnError?: boolean;
  logHandler?: (level: string) => void;
  defaultHostname: string;
  environment: string;
  application?: string;
  integration?: string;
  timeout?: number;
}

function ensureValueExists(value: string | null | undefined, variableName: string ): string {
  if(!value) {
    throw new TypeError(`Expected parameter ${variableName}`)
  }
  return value
}

export function createClient (params: Partial<ContentfulOptions>) {
  const accessToken = ensureValueExists(params.accessToken, 'accessToken')
  const space = ensureValueExists(params.space, 'space')

  const defaultConfig = {
    resolveLinks: true,
    removeUnresolved: false,
    defaultHostname: 'cdn.contentful.com',
    environment: 'master'
  }

  const config: ContentfulOptions = {
    ...defaultConfig,
    ...params,
    accessToken: accessToken,
    space: space
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

  const http: AxiosInstance = createHttpClient(axios, config)

  const getGlobalOptions = createGlobalOptions({
    resolveLinks: config.resolveLinks,
    environment: config.environment,
    removeUnresolved: config.removeUnresolved,
    spaceBaseUrl: http.defaults.baseURL,
    environmentBaseUrl: `${http.defaults.baseURL}environments/${config.environment}`
  })
  // Append environment to baseURL
  http.defaults.baseURL = getGlobalOptions().environmentBaseUrl

  return createContentfulApi({
    http,
    getGlobalOptions
  })
}
