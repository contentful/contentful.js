import cloneDeep from 'lodash/cloneDeep'

/**
 * Creates request parameters configuration by parsing an existing query object
 * @private
 * @param {Object} query
 * @return {Object} Config object with `params` property, ready to be used in axios
 */
export default function createRequestConfig ({query}) {
  const config = {}
  delete query.resolveLinks
  config.params = cloneDeep(query)
  return config
}
