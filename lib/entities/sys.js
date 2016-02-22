import Link from './link'

/**
 * System metadata. See <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes">Common Resource Attributes</a> for more details.
 * @memberof Entities
 * @typedef Sys
 * @prop {string} type
 * @prop {string} id
 * @prop {Entities.Link} space
 * @prop {string} createdAt
 * @prop {string} updatedAt
 * @prop {number} revision
 */
export const SysProps = `
  id: String,
  type: String
  space: ${Link},
  createdAt: String,
  updatedAt: String,
  revision: Number
`
export default `{${SysProps}}`
