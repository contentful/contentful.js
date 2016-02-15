/* @flow */
import mixinToPlainObject from '../mixins/to-plain-object'

/**
 * Space type
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
