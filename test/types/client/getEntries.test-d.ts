import { expectType, expectError } from 'tsd'
import {
  createClient,
  EntryCollection,
  Entry,
  EntrySkeletonType,
  EntryCursorPaginatedCollection,
} from '../../../lib'

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

// A skeleton with no fields
type BaseEntrySkeleton = EntrySkeletonType

// Skeleton with some specific fields
type TestEntrySkeleton = EntrySkeletonType<Fields, 'content-type-id'>

type Locale = 'en'

/**
 * With no extra parameters
 */
expectType<Entry<TestEntrySkeleton, undefined>>(await client.getEntry('entry-id'))

expectType<Entry<TestEntrySkeleton, undefined>>(
  await client.getEntry<TestEntrySkeleton>('entry-id'),
)
expectType<EntryCollection<TestEntrySkeleton, undefined>>(await client.getEntries())

expectType<EntryCollection<TestEntrySkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton>(),
)
expectType<Entry<BaseEntrySkeleton, undefined>>((await client.getEntries()).includes!.Entry![0])

expectType<EntryCollection<TestEntrySkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton>({ content_type: 'content-type-id' }),
)

expectError(await client.getEntries<TestEntrySkeleton>({ content_type: 'unexpected' }))

expectType<EntryCollection<TestEntrySkeleton | LinkedSkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton | LinkedSkeleton>({
    content_type: 'content-type-id',
  }),
)

expectType<EntryCursorPaginatedCollection<TestEntrySkeleton>>(await client.getEntriesCursor())
expectType<EntryCursorPaginatedCollection<TestEntrySkeleton>>(
  await client.getEntriesCursor({ limit: 40 }),
)
expectType<EntryCursorPaginatedCollection<TestEntrySkeleton>>(
  await client.getEntriesCursor({ pageNext: 'next_page_token' }),
)

/**
 * Without unresolvable Links
 */
expectType<Entry<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry('entry-id'),
)
expectType<Entry<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<TestEntrySkeleton>('entry-id'),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>(),
)

expectType<Entry<BaseEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  (await client.withoutUnresolvableLinks.getEntries()).includes!.Entry![0],
)

/**
 * Without link resolution
 */
expectType<Entry<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<TestEntrySkeleton>('entry-id'),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries<TestEntrySkeleton>(),
)

expectType<Entry<BaseEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  (await client.withoutLinkResolution.getEntries()).includes!.Entry![0],
)

/**
 * With all Locales
 */
expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<TestEntrySkeleton>('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntry<TestEntrySkeleton, Locale>('entry-id'),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries<TestEntrySkeleton>(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntries<TestEntrySkeleton, Locale>(),
)

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  (await client.withAllLocales.getEntries<TestEntrySkeleton, Locale>()).includes!.Entry![0],
)

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  (await client.withAllLocales.getEntries<TestEntrySkeleton>()).includes!.Entry![0],
)

/**
 * With all Locales and without unresolvable Links
 */
expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<TestEntrySkeleton>('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<TestEntrySkeleton, Locale>(
    'entry-id',
  ),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>(),
)

expectType<
  EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton, Locale>())

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  (await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>()).includes!
    .Entry![0],
)

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  (await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton, Locale>())
    .includes!.Entry![0],
)

/**
 * With all Locales and without link resolution
 */
expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<TestEntrySkeleton>('entry-id'),
)

expectType<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<TestEntrySkeleton, Locale>('entry-id'),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries(),
)

expectType<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton>(),
)

expectType<
  EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>
>(await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton, Locale>())

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  (await client.withAllLocales.withoutLinkResolution.getEntries()).includes!.Entry![0],
)

expectType<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  (await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton, Locale>())
    .includes!.Entry![0],
)
