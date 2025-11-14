import { expectAssignable, expectNotAssignable } from 'tsd'
import { AssetFields, AssetsQueries, AssetsQueriesCursor } from '../../../lib'
import * as mocks from '../mocks'

type DefaultAssetQueries = AssetsQueries<AssetFields, undefined>

// all operator

expectAssignable<DefaultAssetQueries>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
})

// equality operator

expectAssignable<DefaultAssetQueries>({
  'fields.description': mocks.stringValue,
  'fields.file.contentType': mocks.stringValue,
  'fields.file.details.size': mocks.numberValue,
  'fields.file.fileName': mocks.stringValue,
  'fields.file.url': mocks.stringValue,
  'fields.title': mocks.stringValue,
  'sys.updatedAt': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField': mocks.anyValue,
})

expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp': mocks.anyValue,
})

// exists operator (field is present)

expectAssignable<DefaultAssetQueries>({
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
expectAssignable<DefaultAssetQueries>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.descendants[in]': mocks.stringArrayValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[exists]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[exists]': mocks.anyValue,
})

// gt operator (range)

expectAssignable<DefaultAssetQueries>({
  'fields.file.details.size[gt]': mocks.numberValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[gt]': mocks.anyValue,
})

// gte operator (range)

expectAssignable<DefaultAssetQueries>({
  'fields.file.details.size[gte]': mocks.numberValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[gte]': mocks.anyValue,
})

// in operator

expectAssignable<DefaultAssetQueries>({
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
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[in]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[in]': mocks.anyValue,
})

// lt operator (range)

expectAssignable<DefaultAssetQueries>({
  'fields.file.details.size[lt]': mocks.numberValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[lt]': mocks.anyValue,
})

// lte operator (range)

expectAssignable<DefaultAssetQueries>({
  'fields.file.details.size[lte]': mocks.numberValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[lte]': mocks.anyValue,
})

// match operator (full-text search)

expectAssignable<DefaultAssetQueries>({
  'fields.description[match]': mocks.stringValue,
  'fields.file.contentType[match]': mocks.stringValue,
  'fields.file.fileName[match]': mocks.stringValue,
  'fields.file.url[match]': mocks.stringValue,
  'fields.title[match]': mocks.stringValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[match]': mocks.anyValue,
})

// ne operator (inequality)

expectAssignable<DefaultAssetQueries>({
  'fields.description[ne]': mocks.stringValue,
  'fields.file.contentType[ne]': mocks.stringValue,
  'fields.file.details.size[ne]': mocks.numberValue,
  'fields.file.fileName[ne]': mocks.stringValue,
  'fields.file.url[ne]': mocks.stringValue,
  'fields.title[ne]': mocks.stringValue,
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[ne]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[ne]': mocks.anyValue,
})

// nin operator

expectAssignable<DefaultAssetQueries>({
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
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[nin]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[nin]': mocks.anyValue,
})

// order operator

expectAssignable<DefaultAssetQueries>({ order: ['sys.createdAt', '-sys.createdAt'] })
expectNotAssignable<DefaultAssetQueries>({ order: ['sys.unknownProperty'] })

expectAssignable<DefaultAssetQueries>({
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
expectNotAssignable<DefaultAssetQueries>({ order: ['fields.unknownField'] })

// select operator

expectAssignable<DefaultAssetQueries>({ select: ['sys'] })
expectAssignable<DefaultAssetQueries>({ select: ['sys.createdAt'] })
expectNotAssignable<DefaultAssetQueries>({ select: ['sys.unknownProperty'] })

expectAssignable<DefaultAssetQueries>({ select: ['fields'] })
expectAssignable<DefaultAssetQueries>({ select: ['fields.title'] })
expectNotAssignable<DefaultAssetQueries>({ select: ['fields.unknownField'] })

// locale option

expectAssignable<AssetsQueries<AssetFields, undefined>>({ locale: mocks.stringValue })
expectNotAssignable<AssetsQueries<AssetFields, 'WITH_ALL_LOCALES'>>({ locale: mocks.anyValue })

// cursor pagination options

expectAssignable<AssetsQueriesCursor<AssetFields, undefined>>({})
expectAssignable<AssetsQueriesCursor<AssetFields, undefined>>({ pageNext: 'page_next' })
expectAssignable<AssetsQueriesCursor<AssetFields, undefined>>({
  pagePrev: 'page_prev',
  limit: 40,
})

expectNotAssignable<AssetsQueriesCursor<AssetFields, undefined>>({ skip: 20 })
expectNotAssignable<AssetsQueriesCursor<AssetFields, undefined>>({ pagePrev: 20 })
expectNotAssignable<AssetsQueriesCursor<AssetFields, undefined>>({
  pagePrev: 'page_prev',
  pageNext: 'page_next',
})
