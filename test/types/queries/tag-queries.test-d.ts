import { expectAssignable, expectNotAssignable } from 'tsd'
import { TagQueries } from '../../../lib'

const dateFilter = '2023-03-03T09:18:16.329Z'
const tagId = 'tagId'
const userId = 'userId'

// Tag sys queries
expectAssignable<TagQueries>({ 'sys.id': tagId })

expectAssignable<TagQueries>({ 'sys.createdAt': dateFilter })

expectAssignable<TagQueries>({ 'sys.updatedAt': dateFilter })

expectAssignable<TagQueries>({ 'sys.visibility': 'private' })

expectAssignable<TagQueries>({ 'sys.type': 'Tag' })

expectNotAssignable<TagQueries>({ 'sys.createdBy': userId })

expectNotAssignable<TagQueries>({ 'sys.updatedBy': userId })

expectNotAssignable<TagQueries>({ 'sys.version': 2 })

expectNotAssignable<TagQueries>({ 'sys.revision': 2 })

// Tag fixed Query filters

expectAssignable<TagQueries>({ skip: 1 })

expectAssignable<TagQueries>({ limit: 1 })

expectAssignable<TagQueries>({ order: 'sys.updatedAt' })

expectNotAssignable<TagQueries>({ locale: 'en' })
