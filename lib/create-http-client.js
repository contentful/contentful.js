import qs from 'qs'

/**
 * Create pre configured axios instance
 * @private
 * @param {Object} axios - Axios library
 * @param {Object} HTTPClientParams - Initialization parameters for the HTTP client
 * @prop {string} space - Space ID
 * @prop {string} accessToken - Access Token
 * @prop {boolean=} insecure - If we should use http instead
 * @prop {string=} host - Alternate host
 * @prop {Object=} agent - HTTP agent for node
 * @prop {Object=} headers - Additional headers
 * @return {Object} Initialized axios instance
 */
export default function createHttpClient (axios, {space, accessToken, insecure, host, defaultHostname, agent, headers}) {
  let [hostname, port] = (host && host.split(':')) || []
  hostname = hostname || defaultHostname
  port = port || (insecure ? 80 : 443)
  headers = headers || {}
  headers['Authorization'] = 'Bearer ' + accessToken

  if (process && process.release && process.release.name === 'node') {
    headers['user-agent'] = 'node.js/' + process.version
  }

  return axios.create({
    baseURL: `${insecure ? 'http' : 'https'}://${hostname}:${port}/spaces/${space}/`,
    headers: headers,
    agent: agent,
    paramsSerializer: qs.stringify
  })
}
