import mixinToPlainObject from 'contentful-sdk-core/mixins/to-plain-object'
import freezeSys from 'contentful-sdk-core/freeze-sys'

/**
 * @memberof Entities
 * @typedef Space
 * @prop {Object} sys - System metadata
 * @prop {string} sys.id - Space id
 * @prop {string} sys.type - Entity type
 * @prop {string} name - Space name
 * @prop {Array<string>} locales - Array with locale codes
 * @prop {function(): Object} toPlainObject() - Returns this Space as a plain JS object
 */

/**
 * @private
 * @param  {Object} data - API response for a Space
 * @return {Space}
 */
export function wrapSpace (data) {
  return freezeSys(mixinToPlainObject(data))
}
