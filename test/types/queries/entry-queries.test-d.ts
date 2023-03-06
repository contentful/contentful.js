import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntriesQueries } from '../../../lib'

// select operator

expectAssignable<EntriesQueries>({ select: ['sys'] })
expectAssignable<EntriesQueries>({ select: ['sys.createdAt'] })
expectNotAssignable<EntriesQueries>({ select: ['sys.unknownProperty'] })

expectAssignable<EntriesQueries>({ select: ['fields'] })
expectNotAssignable<EntriesQueries>({ select: ['fields.unknownField'] })

expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys'] })
expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys.createdAt'] })
expectNotAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys.unknownProperty'] })

expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['fields'] })
expectNotAssignable<EntriesQueries<{ someField: string }>>({ select: ['fields.someField'] })
expectAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  select: ['fields.someField'],
})
expectNotAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  select: ['fields.unknownField'],
})
