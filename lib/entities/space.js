/* @flow */

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

