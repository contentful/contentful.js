import { expectTypeOf, test } from "vitest";
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

// A skeleton with no fields
type BaseEntrySkeleton = EntrySkeletonType

// Skeleton with some specific fields
type TestEntrySkeleton = EntrySkeletonType<Fields, 'content-type-id'>

type Locale = 'en'

test('getEntries', async () => {

/**
 * With no extra parameters
 */
expectTypeOf<Entry<TestEntrySkeleton, undefined>>(await client.getEntry('entry-id'))

expectTypeOf<Entry<TestEntrySkeleton, undefined>>(
  await client.getEntry<TestEntrySkeleton>('entry-id'),
)
expectTypeOf<EntryCollection<TestEntrySkeleton, undefined>>(await client.getEntries())

expectTypeOf<EntryCollection<TestEntrySkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton>(),
)
expectTypeOf<Entry<BaseEntrySkeleton, undefined>>((await client.getEntries()).includes!.Entry![0])

expectTypeOf<EntryCollection<TestEntrySkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton>({ content_type: 'content-type-id' }),
)

expectError(await client.getEntries<TestEntrySkeleton>({ content_type: 'unexpected' }))

expectTypeOf<EntryCollection<TestEntrySkeleton | LinkedSkeleton, undefined>>(
  await client.getEntries<TestEntrySkeleton | LinkedSkeleton>({
    content_type: 'content-type-id',
  }),
)

/**
 * Without unresolvable Links
 */
expectTypeOf<Entry<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry('entry-id'),
)
expectTypeOf<Entry<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntry<TestEntrySkeleton>('entry-id'),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>(),
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  (await client.withoutUnresolvableLinks.getEntries()).includes!.Entry![0],
)

/**
 * Without link resolution
 */
expectTypeOf<Entry<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntry<TestEntrySkeleton>('entry-id'),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withoutLinkResolution.getEntries<TestEntrySkeleton>(),
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>>(
  (await client.withoutLinkResolution.getEntries()).includes!.Entry![0],
)

/**
 * With all Locales
 */
expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntry<TestEntrySkeleton>('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntry<TestEntrySkeleton, Locale>('entry-id'),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  await client.withAllLocales.getEntries<TestEntrySkeleton>(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getEntries<TestEntrySkeleton, Locale>(),
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES', Locale>>(
  (await client.withAllLocales.getEntries<TestEntrySkeleton, Locale>()).includes!.Entry![0],
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES'>>(
  (await client.withAllLocales.getEntries<TestEntrySkeleton>()).includes!.Entry![0],
)

/**
 * With all Locales and without unresolvable Links
 */
expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<TestEntrySkeleton>('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntry<TestEntrySkeleton, Locale>(
    'entry-id',
  ),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>(),
)

expectTypeOf<
  EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>
>(await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton, Locale>())

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>(
  (await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton>()).includes!
    .Entry![0],
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locale>>(
  (await client.withAllLocales.withoutUnresolvableLinks.getEntries<TestEntrySkeleton, Locale>())
    .includes!.Entry![0],
)

/**
 * With all Locales and without link resolution
 */
expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<TestEntrySkeleton>('entry-id'),
)

expectTypeOf<Entry<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  await client.withAllLocales.withoutLinkResolution.getEntry<TestEntrySkeleton, Locale>('entry-id'),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries(),
)

expectTypeOf<EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton>(),
)

expectTypeOf<
  EntryCollection<TestEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>
>(await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton, Locale>())

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>(
  (await client.withAllLocales.withoutLinkResolution.getEntries()).includes!.Entry![0],
)

expectTypeOf<Entry<BaseEntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locale>>(
  (await client.withAllLocales.withoutLinkResolution.getEntries<TestEntrySkeleton, Locale>())
    .includes!.Entry![0],
)})