// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import { Entry, EntryLink, EntrySys, ResolvedField } from '../../lib'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true
export const dateValue = '2018-05-03T09:18:16.329Z'
export const metadataValue = { tags: [] }
export const entryLinkValue: EntryLink = {
  type: 'Link',
  linkType: 'Entry',
  id: stringValue,
}

const entrySysValue: EntrySys = {
  contentType: { sys: { id: stringValue, type: 'Link', linkType: 'ContentType' } },
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: '', //?
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}

const entryBasics = {
  sys: entrySysValue,
  metadata: metadataValue,
}

const entryValue = {
  ...entryBasics,
  fields: {
    title: 'title',
  },
}

type SimpleEntryFields = { title: string }

expectAssignable<ResolvedField<Entry<SimpleEntryFields>, undefined>>(entryValue)
expectAssignable<ResolvedField<Entry<SimpleEntryFields>, undefined>>(entryLinkValue)
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], undefined>>([entryValue])
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], undefined>>([entryLinkValue])
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], undefined>>([entryValue, entryLinkValue])

expectAssignable<ResolvedField<Entry<SimpleEntryFields>, 'WITHOUT_UNRESOLVABLE_LINKS'>>(entryValue)
expectAssignable<ResolvedField<Entry<SimpleEntryFields>, 'WITHOUT_UNRESOLVABLE_LINKS'>>(undefined)
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], 'WITHOUT_UNRESOLVABLE_LINKS'>>([
  entryValue,
])
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], 'WITHOUT_UNRESOLVABLE_LINKS'>>([
  undefined,
])
expectAssignable<ResolvedField<Entry<SimpleEntryFields>[], 'WITHOUT_UNRESOLVABLE_LINKS'>>([
  entryValue,
  undefined,
])

expectNotAssignable<ResolvedField<Entry<SimpleEntryFields>, 'WITHOUT_LINK_RESOLUTION'>>(entryValue)
expectAssignable<ResolvedField<Entry<SimpleEntryFields>, 'WITHOUT_LINK_RESOLUTION'>>(entryLinkValue)
