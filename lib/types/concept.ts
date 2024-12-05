import { Link } from './link'
import { LocaleCode } from './locale'

type ISODateString = string

export type ConceptSys = {
  id: string
  type: 'TaxonomyConcept'
  createdAt: ISODateString
  updatedAt: ISODateString
  version: number
}

export interface Concept<Locales extends LocaleCode> {
  sys: ConceptSys
  uri?: string
  prefLabel: {
    [locale in Locales]: string
  }
  altLabels?: {
    [locale in Locales]: string[]
  }
  hiddenLabels?: {
    [locale in Locales]: string[]
  }
  note?:
    | {
        [locale in Locales]: string
      }
    | null
  changeNote?:
    | {
        [locale in Locales]: string
      }
    | null
  definition?:
    | {
        [locale in Locales]: string
      }
    | null
  editorialNote?:
    | {
        [locale in Locales]: string
      }
    | null
  example?:
    | {
        [locale in Locales]: string
      }
    | null
  historyNote?:
    | {
        [locale in Locales]: string
      }
    | null
  scopeNote?:
    | {
        [locale in Locales]: string
      }
    | null
  notations?: string[]
  broader?: Link<'TaxonomyConcept'>[]
  related?: Link<'TaxonomyConcept'>[]
}

export type ConceptCollection<Locale extends LocaleCode> = {
  sys: {
    type: 'Array'
  }
  items: Concept<Locale>[]
  limit: number
  pages?: {
    prev?: string
    next?: string
  }
}
