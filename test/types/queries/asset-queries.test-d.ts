import { expectAssignable, expectNotAssignable } from 'tsd'
import { AssetFields, AssetQueries } from '../../../lib'
// @ts-ignore
import * as mocks from '../mocks'

type DefaultAssetQueries = AssetQueries<AssetFields>

// all operator

expectAssignable<DefaultAssetQueries>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
})

// equality operator

expectAssignable<DefaultAssetQueries>({
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
  'fields.title[exists]': mocks.booleanValue,
  'metadata.tags[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[exists]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[exists]': mocks.anyValue,
})

// gt operator (range)

expectAssignable<DefaultAssetQueries>({
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[gt]': mocks.anyValue,
})

// gte operator (range)

expectAssignable<DefaultAssetQueries>({
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[gte]': mocks.anyValue,
})

// in operator

expectAssignable<DefaultAssetQueries>({
  'fields.title[in]': mocks.stringArrayValue,
  'metadata.tags.sys.id[in]': mocks.stringArrayValue,
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
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[lt]': mocks.anyValue,
})

// lte operator (range)

expectAssignable<DefaultAssetQueries>({
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[lte]': mocks.anyValue,
})

// match operator (full-text search)

expectAssignable<DefaultAssetQueries>({
  'fields.title[match]': mocks.stringValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[match]': mocks.anyValue,
})

// ne operator (inequality)

expectAssignable<DefaultAssetQueries>({
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
  'fields.title[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'fields.unknownField[nin]': mocks.anyValue,
})
expectNotAssignable<DefaultAssetQueries>({
  'sys.unknownProp[nin]': mocks.anyValue,
})

// select operator

expectAssignable<DefaultAssetQueries>({ select: ['sys'] })
expectAssignable<DefaultAssetQueries>({ select: ['sys.createdAt'] })
expectNotAssignable<DefaultAssetQueries>({ select: ['sys.unknownProperty'] })

expectAssignable<DefaultAssetQueries>({ select: ['fields'] })
expectAssignable<DefaultAssetQueries>({ select: ['fields.title'] })
expectNotAssignable<DefaultAssetQueries>({ select: ['fields.unknownField'] })
