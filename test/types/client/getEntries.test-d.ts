import { expectType, expectError } from 'tsd'
import { createClient, EntryCollection, Entry, EntrySkeletonType } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type LinkedFields = {
  name: string
}

type LinkedSkeleton = EntrySkeletonType<LinkedFields, 'linked-type-id'>

type Fields = {
  title: string
  link: Entry<LinkedSkeleton>
  moreLinks: Entry<LinkedSkeleton>[]
}

type EntrySkeleton = EntrySkeletonType<Fields, 'content-type-id'>

type Locale = 'en'

expectType<Entry<EntrySkeleton, undefined>>(await client.getEntry('entry-id'))
expectType<Entry<EntrySkeleton, undefined>>(await client.getEntry<EntrySkeleton>('entry-id'))
expectType<EntryCollection<EntrySkeleton, undefined>>(await client.getEntries())
expectType<EntryCollection<EntrySkeleton, undefined>>(await client.getEntries<EntrySkeleton>())

expectType<EntryCollection<EntrySkeleton, undefined>>(
  await client.getEntries<EntrySkeleton>({ content_type: 'content-type-id' }),
)

expectError(await client.getEntries<EntrySkeleton>({ content_type: 'unexpected' }))
expectType<EntryCollection<EntrySkeleton | LinkedSkeleton, undefined>>(
  await client.getEntries<EntrySkeleton | LinkedSkeleton>({
    content_type: 'content-type-id',
  }),
)

expectType<Entry<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<EntrySkeleton>('entry-id'),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries(),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries<EntrySkeleton>(),
)

expectType<Entry<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<EntrySkeleton>('entry-id'),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries(),
)
expectType<EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries<EntrySkeleton>(),
)

expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<EntrySkeleton>('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntry<EntrySkeleton, Locale>('entry-id'),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries(),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries<EntrySkeleton>(),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntries<EntrySkeleton, Locale>(),
)

expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<EntrySkeleton>('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<EntrySkeleton, Locale>('entry-id'),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries(),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<EntrySkeleton>(),
)
expectType<
  EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries<EntrySkeleton, Locale>())

expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<EntrySkeleton>('entry-id'),
)
expectType<Entry<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<EntrySkeleton, Locale>('entry-id'),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries(),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<EntrySkeleton>(),
)
expectType<EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<EntrySkeleton, Locale>(),
)
