/* @flow */
import type {Entry, DeletedEntry} from './entities/entry'
import type {Asset, DeletedAsset} from './entities/asset'

export type IncludesCollection = {
  Entry?: Array<Entry>,
  Asset?: Array<Asset>
}

export type ResponseItems = Array<Entry|Asset|DeletedEntry|DeletedAsset>
