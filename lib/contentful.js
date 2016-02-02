/* @flow */

import axios from '../vendor/axios'

/**
 * The contentful client
 */
function createClient (path: string, token: string) : Promise {
  return axios.get('https://cdn.contentful.com/' + path + '?access_token=' + token)
}

export default {
  createClient: createClient
}
