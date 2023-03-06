import { expectAssignable, expectNotAssignable } from 'tsd'
import { AssetQueries } from '../../../lib'

// select operator

expectAssignable<AssetQueries>({ select: ['sys'] })
expectAssignable<AssetQueries>({ select: ['sys.createdAt'] })
expectNotAssignable<AssetQueries>({ select: ['sys.unknownProperty'] })

expectAssignable<AssetQueries>({ select: ['fields'] })
expectNotAssignable<AssetQueries>({ select: ['fields.unknownField'] })

expectAssignable<AssetQueries<{ someField: string }>>({ select: ['sys'] })
expectAssignable<AssetQueries<{ someField: string }>>({ select: ['sys.createdAt'] })
expectNotAssignable<AssetQueries<{ someField: string }>>({ select: ['sys.unknownProperty'] })

expectAssignable<AssetQueries<{ someField: string }>>({ select: ['fields'] })
expectAssignable<AssetQueries<{ someField: string }>>({
  select: ['fields.someField'],
})
expectNotAssignable<AssetQueries<{ someField: string }>>({
  select: ['fields.unknownField'],
})
