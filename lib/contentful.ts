/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 */

import axios from 'axios'
import { createHttpClient, getUserAgentHeader } from 'contentful-sdk-core'
import { ContentfulClientApi } from './create-contentful-api'
import createGlobalOptions from './create-global-options'
import { makeClient } from './make-client'
import type { AxiosRequestConfig } from 'axios'

export type ClientLogLevel = 'error' | 'warning' | 'info' | string

export interface CreateClientParams {
  space: string
  accessToken: string
  environment?: string
  insecure?: boolean
  host?: string
  basePath?: string
  httpAgent?: AxiosRequestConfig['httpAgent']
  httpsAgent?: AxiosRequestConfig['httpsAgent']
  proxy?: AxiosRequestConfig['proxy']
  headers?: any
  adapter?: any
  application?: string
  integration?: string
  retryOnError?: boolean
  logHandler?: (level: ClientLogLevel, data?: any) => void
  timeout?: number
  retryLimit?: number
}

export function createClient(params: CreateClientParams): ContentfulClientApi {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

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
    resolveLinks: config.resolveLinks,
    environment: config.environment,
    removeUnresolved: config.removeUnresolved,
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
