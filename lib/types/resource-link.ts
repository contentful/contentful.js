/**
 * Definition of an external resource link
 * @category Link
 */
export interface ResourceLink<LinkType extends string = 'Contentful:Entry'> {
  type: 'ResourceLink'
  linkType: LinkType
  urn: string
}
