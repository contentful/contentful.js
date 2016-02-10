import {cloneDeep} from 'lodash/lang'

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
