/* @flow */

// To understand why axios is vendored, check SETUP.md
import axios from '../vendor/axios'
import {defaults} from 'lodash/object'
import qs from 'querystring'

type HttpClientParams = {
  space: string,
  accessToken: string,
  insecure?: boolean,
  host?: string,
  agent?: Object,
  headers?: Object
}

/**
 * @private
 * Create pre configured axios instance
 */
export default function createHttpClient ({space, accessToken, insecure, host, agent, headers}: HttpClientParams): Object {
  let [hostname, port] = (host && host.split(':')) || []
  hostname = hostname || 'cdn.contentful.com'
  port = port || (insecure ? 80 : 443)

  return axios.create({
    baseURL: `${insecure ? 'http' : 'https'}://${hostname}:${port}/spaces/${space}/`,
    headers: defaults({
      'Content-Type': 'application/vnd.contentful.delivery.v1+json',
      'X-Contentful-User-Agent': 'contentful.js/3.x'
    }, headers),
    agent: agent,
    params: {
      access_token: accessToken
    },
    paramsSerializer: params => qs.stringify(params)
  })
}
