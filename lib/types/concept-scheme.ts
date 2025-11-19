import type { CursorPaginatedCollection } from './collection'
import type { UnresolvedLink } from './link'
import type { LocaleCode } from './locale'

type ISODateString = string

export type ConceptSchemeSys = {
  id: string
  type: 'TaxonomyConceptScheme'
  createdAt: ISODateString
  updatedAt: ISODateString
  version: number
}

export interface ConceptScheme<Locales extends LocaleCode> {
  sys: ConceptSchemeSys
  uri?: string
  prefLabel: {
    [locale in Locales]: string
  }
  definition?:
    | {
        [locale in Locales]: string
      }
    | null
  topConcepts: UnresolvedLink<'TaxonomyConcept'>[]
  concepts: UnresolvedLink<'TaxonomyConcept'>[]
  totalConcepts: number
}

export type ConceptSchemeCollection<Locale extends LocaleCode> = CursorPaginatedCollection<
  ConceptScheme<Locale>
>
