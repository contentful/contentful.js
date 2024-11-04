import { ContentfulCollection } from './collection'
import { Link } from './link'

type ISODateString = string

export type ConceptSys = {
  id: string
  type: 'TaxonomyConcept'
  createdAt: ISODateString
  updatedAt: ISODateString
  version: number
}

export interface Concept<Locales extends string = string> {
  sys: ConceptSys
  prefLabel?: {
    [locale in Locales]: string
  }
  altLabels?: {
    [locale in Locales]: string
  }
  hiddenLabels?: {
    [locale in Locales]: string
  }
  note?: {
    [locale in Locales]: string
  }
  notations?: string[]
  broader?: Link<'TaxonomyConcept'>[]
  related?: Link<'TaxonomyConcept'>[]
}

export interface ConceptScheme {}

export type ConceptCollection<Locale extends string> = ContentfulCollection<Concept<Locale>>
export type ConceptSchemeCollection = ContentfulCollection<ConceptScheme>
