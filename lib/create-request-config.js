/* @flow */
import {cloneDeep} from 'lodash/lang'

export default function createRequestConfig ({query}: {query?: Object}): {params?: Object} {
  const config = {}
  if (query) {
    config.params = cloneDeep(query)
  }
  return config
}
