import { expectTypeOf, test } from "vitest";
import { AssetFields, AssetsQueries } from '../../../lib'
import * as mocks from '../mocks'

type DefaultAssetQueries = AssetsQueries<AssetFields, undefined>

test('assetQueries', async () => {

// all operator

expectTypeOf<DefaultAssetQueries>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
})

// equality operator

expectTypeOf<DefaultAssetQueries>({
  'fields.description': mocks.stringValue,
  'fields.file.contentType': mocks.stringValue,
  'fields.file.details.size': mocks.numberValue,
  'fields.file.fileName': mocks.stringValue,
  'fields.file.url': mocks.stringValue,
  'fields.title': mocks.stringValue,
  'sys.updatedAt': mocks.dateValue,
})
expectTypeOf({
  'fields.unknownField': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

expectTypeOf({
  'sys.unknownProp': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// exists operator (field is present)

expectTypeOf<DefaultAssetQueries>({
  'fields.description[exists]': mocks.booleanValue,
  'fields.file[exists]': mocks.booleanValue,
  'fields.file.contentType[exists]': mocks.booleanValue,
  'fields.file.details[exists]': mocks.booleanValue,
  'fields.file.details.size[exists]': mocks.booleanValue,
  'fields.file.fileName[exists]': mocks.booleanValue,
  'fields.file.url[exists]': mocks.booleanValue,
  'fields.title[exists]': mocks.booleanValue,
  'metadata.tags[exists]': mocks.booleanValue,
  'metadata.concepts[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectTypeOf<DefaultAssetQueries>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.descendants[in]': mocks.stringArrayValue,
})
expectTypeOf({
  'fields.unknownField[exists]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()
expectTypeOf({
  'sys.unknownProp[exists]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// gt operator (range)

expectTypeOf<DefaultAssetQueries>({
  'fields.file.details.size[gt]': mocks.numberValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[gt]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// gte operator (range)

expectTypeOf<DefaultAssetQueries>({
  'fields.file.details.size[gte]': mocks.numberValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[gte]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// in operator

expectTypeOf<DefaultAssetQueries>({
  'fields.description[in]': mocks.stringArrayValue,
  'fields.file.contentType[in]': mocks.stringArrayValue,
  'fields.file.details.size[in]': mocks.numberArrayValue,
  'fields.file.fileName[in]': mocks.stringArrayValue,
  'fields.file.url[in]': mocks.stringArrayValue,
  'fields.title[in]': mocks.stringArrayValue,
  'metadata.tags.sys.id[in]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectTypeOf({
  'fields.unknownField[in]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()
expectTypeOf({
  'sys.unknownProp[in]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// lt operator (range)

expectTypeOf<DefaultAssetQueries>({
  'fields.file.details.size[lt]': mocks.numberValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[lt]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// lte operator (range)

expectTypeOf<DefaultAssetQueries>({
  'fields.file.details.size[lte]': mocks.numberValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[lte]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// match operator (full-text search)

expectTypeOf<DefaultAssetQueries>({
  'fields.description[match]': mocks.stringValue,
  'fields.file.contentType[match]': mocks.stringValue,
  'fields.file.fileName[match]': mocks.stringValue,
  'fields.file.url[match]': mocks.stringValue,
  'fields.title[match]': mocks.stringValue,
})
expectTypeOf({
  'fields.unknownField[match]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// ne operator (inequality)

expectTypeOf<DefaultAssetQueries>({
  'fields.description[ne]': mocks.stringValue,
  'fields.file.contentType[ne]': mocks.stringValue,
  'fields.file.details.size[ne]': mocks.numberValue,
  'fields.file.fileName[ne]': mocks.stringValue,
  'fields.file.url[ne]': mocks.stringValue,
  'fields.title[ne]': mocks.stringValue,
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectTypeOf({
  'fields.unknownField[ne]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()
expectTypeOf({
  'sys.unknownProp[ne]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// nin operator

expectTypeOf<DefaultAssetQueries>({
  'fields.description[nin]': mocks.stringArrayValue,
  'fields.file.contentType[nin]': mocks.stringArrayValue,
  'fields.file.details.size[nin]': mocks.numberArrayValue,
  'fields.file.fileName[nin]': mocks.stringArrayValue,
  'fields.file.url[nin]': mocks.stringArrayValue,
  'fields.title[nin]': mocks.stringArrayValue,
  'metadata.tags.sys.id[nin]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectTypeOf({
  'fields.unknownField[nin]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()
expectTypeOf({
  'sys.unknownProp[nin]': mocks.anyValue,
}).not.toEqualTypeOf<DefaultAssetQueries>()

// order operator

expectTypeOf<DefaultAssetQueries>({ order: ['sys.createdAt', '-sys.createdAt'] })
expectTypeOf({ order: ['sys.unknownProperty'] }).not.toEqualTypeOf<DefaultAssetQueries>()

expectTypeOf<DefaultAssetQueries>({
  order: [
    'fields.file.contentType',
    '-fields.file.contentType',
    'fields.file.fileName',
    '-fields.file.fileName',
    'fields.file.url',
    '-fields.file.url',
    'fields.file.details.size',
    '-fields.file.details.size',
  ],
})
expectTypeOf({ order: ['fields.unknownField'] }).not.toEqualTypeOf<DefaultAssetQueries>()

// select operator

expectTypeOf<DefaultAssetQueries>({ select: ['sys'] })
expectTypeOf<DefaultAssetQueries>({ select: ['sys.createdAt'] })
expectTypeOf({ select: ['sys.unknownProperty'] }).not.toEqualTypeOf<DefaultAssetQueries>()

expectTypeOf<DefaultAssetQueries>({ select: ['fields'] })
expectTypeOf<DefaultAssetQueries>({ select: ['fields.title'] })
expectTypeOf({ select: ['fields.unknownField'] }).not.toEqualTypeOf<DefaultAssetQueries>()

// locale option

expectTypeOf<AssetsQueries<AssetFields, undefined>>({ locale: mocks.stringValue })
expectTypeOf({ locale: mocks.anyValue }).not.toEqualTypeOf<AssetsQueries<AssetFields, 'WITH_ALL_LOCALES'>>()})