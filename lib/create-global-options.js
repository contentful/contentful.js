/**
 * Link resolution can be set globally, or it can be turned off for the methods
 * which make use of it. The local setting always overrides the global setting.
 * @private
 * @param {boolean} globalSetting - Global library setting for link resolution
 * @returns {function} Link resolver method preconfigured with global setting
 */
export default function createGlobalOptions (globalSettings) {
  /**
   * Link resolver method
   * @param {Object} query - regular query object used for collection endpoints
   */
  return function getGlobalOptions (query) {
    return Object.assign({}, globalSettings, query)
  }
}
