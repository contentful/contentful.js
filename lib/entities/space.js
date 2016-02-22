import {typeCheck} from '../type-check'
import mixinToPlainObject from '../mixins/to-plain-object'

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
const Space = `{
  sys: {
    id: String,
    type: String
  },
  name: String,
  locales: [String]
}`

/**
 * @private
 * @param  {Object} data - API response for a Space
 * @return {Space}
 */
export function wrapSpace (data) {
  typeCheck(Space, data)
  return Object.freeze(mixinToPlainObject(data))
}
