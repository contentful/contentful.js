/* @flow */
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
export type Space = {
  sys: {
    id: string,
    type: string,
  },
  name: string,
  locales: Array<Object>,
  toPlainObject: () => Object
}

export function wrapSpace (data: Space): Space {
  return Object.freeze(mixinToPlainObject(data))
}
