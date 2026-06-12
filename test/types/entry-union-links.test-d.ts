// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import { Entry, EntryFieldTypes, EntrySkeletonType } from '../../lib'

// @ts-ignore
import * as mocks from './mocks'

/**
 * Two distinct skeletons that share a single field (`internalName`) but each
 * carry a member-specific field (`headline` / `ctaText`).
 */
interface HeroSkeleton extends EntrySkeletonType {
  contentTypeId: 'hero'
  fields: {
    internalName: EntryFieldTypes.Symbol
    headline: EntryFieldTypes.Symbol
  }
}

interface CtaSkeleton extends EntrySkeletonType {
  contentTypeId: 'cta'
  fields: {
    internalName: EntryFieldTypes.Symbol
    ctaText: EntryFieldTypes.Symbol
  }
}

type SectionSkeleton = HeroSkeleton | CtaSkeleton

type HeroEntry = Entry<HeroSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>
type CtaEntry = Entry<CtaSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>

/**
 * A page whose `section` / `sections` fields link to a *union* of section
 * skeletons. The resolved field must distribute into `Entry<A> | Entry<B>`,
 * preserving each member's fields, rather than collapsing `fields` to the keys
 * common to all members (which would drop `headline` / `ctaText`).
 */
type PageSkeleton = EntrySkeletonType<{
  section: EntryFieldTypes.EntryLink<SectionSkeleton>
  sections: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SectionSkeleton>>
}>

// Single linked reference resolved with `WITHOUT_UNRESOLVABLE_LINKS`:
// `Entry<Hero> | Entry<Cta> | undefined`.
type ResolvedSection = Entry<PageSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>['fields']['section']

expectType<HeroEntry | CtaEntry | undefined>(null as unknown as ResolvedSection)

// Multi reference resolved with `WITHOUT_UNRESOLVABLE_LINKS`:
// `(Entry<Hero> | Entry<Cta> | undefined)[]`.
type ResolvedSections = Entry<PageSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>['fields']['sections']

expectType<(HeroEntry | CtaEntry | undefined)[]>(null as unknown as ResolvedSections)

// A resolved member entry carrying a member-specific field must be assignable.
// This fails before the fix because the resolved link collapses to
// `fields: { internalName }`, dropping `headline` / `ctaText`.
const heroValue = {
  ...mocks.entryBasics,
  sys: {
    ...mocks.entrySys,
    contentType: { sys: { ...mocks.entrySys.contentType.sys, id: 'hero' as const } },
  },
  fields: {
    internalName: mocks.stringValue,
    headline: mocks.stringValue,
  },
}

expectAssignable<NonNullable<ResolvedSection>>(heroValue)

const ctaValue = {
  ...mocks.entryBasics,
  sys: {
    ...mocks.entrySys,
    contentType: { sys: { ...mocks.entrySys.contentType.sys, id: 'cta' as const } },
  },
  fields: {
    internalName: mocks.stringValue,
    ctaText: mocks.stringValue,
  },
}

expectAssignable<NonNullable<ResolvedSection>>(ctaValue)

// A `hero`-tagged entry must NOT be allowed to carry a `cta`-only field —
// discrimination on `sys.contentType.sys.id` is preserved by distribution.
expectNotAssignable<NonNullable<ResolvedSection>>({
  ...mocks.entryBasics,
  sys: {
    ...mocks.entrySys,
    contentType: { sys: { ...mocks.entrySys.contentType.sys, id: 'hero' as const } },
  },
  fields: {
    internalName: mocks.stringValue,
    ctaText: mocks.stringValue,
  },
})
