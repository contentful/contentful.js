import {cloneDeep} from 'lodash/lang'

/**
 * Mixes in a method to return just a plain object with no additional methods
 * @private
 * @param {Object} data - Any plain JSON response returned from the API
 * @return {Object} Enhanced object with toPlainObject method
 */
export default function mixinToPlainObject (data) {
  return Object.defineProperty(data, 'toPlainObject', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function () {
      return cloneDeep(this)
    }
  })
}
