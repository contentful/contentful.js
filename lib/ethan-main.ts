// import { createClient } from 'contentful';
// import type {
//   ChainModifiers,
//   Entry,
//   EntryCollection,
//   EntryFieldTypes,
//   EntrySkeletonType,
//   LocaleCode,
// } from 'contentful';

import { createClient } from '../dist/esm/index.js'
import type { EntryCollection, LocaleCode, EntryFieldTypes } from '../dist/esm/types'

export type SkillsEntriesCollectionType = EntryCollection<SkillEntrySkeleton>

export type SkillEntrySkeleton = {
  contentTypeId: 'skill-asdf'
  publishedVersion: number
  revision: number
  createdAt: string
  updatedAt: string
  locale: LocaleCode
  type: 'Entry'
  sys: {
    contentType: {
      sys: {
        type: 'Link'
        linkType: 'ContentType'
        id: 'skill-asdf'
      }
    }
  }
  fields: {
    title: EntryFieldTypes.Symbol
  }
}

const logHandler = (level: string, data?: string | Record<string, any>) => {
  console.log('[ ETHAN_MAIN.ts CUSTOM LOG HANDLER! ] level !!! =>', level)
  console.log('[ ETHAN_MAIN.ts CUSTOM LOG HANDLER! ] data !!! =>', data)
  return
}

const client = createClient({
  space: 'uxmn6t2ipova',
  // CDA
  accessToken: '<CDA_ACCESS_TOKEN>',

  // Preview
  // accessToken: "<PREVIEW_ACCESS_TOKEN>",
  // host: "preview.contentful.com",
  environment: 'master',
  logHandler,
})

const wait5 = async () => {
  let count = 0

  const i = setInterval(() => {
    count++
    console.log('[ wait5() ] waiting... count => ', count)
  }, 1000)

  return new Promise((resolve) => {
    return setTimeout(() => {
      console.log('[ wait5() ] resolving')
      clearInterval(i)
      resolve(true)
    }, 5000)
  })
}

const main = async () => {
  await wait5()

  // const first35skillEntries = await client.getEntries<SkillEntrySkeleton>({
  //   content_type: 'skill',
  //   limit: 25,
  //   skip: 0,
  // });

  // const next9skillEntries = await client.getEntries<SkillEntrySkeleton>({
  //   content_type: 'skill',
  //   limit: 25,
  //   skip: 25,
  // });

  const skipAllSkillEntries = await client.getEntries<SkillEntrySkeleton>({
    content_type: 'skill-asdf',
    limit: 5,
  })

  return skipAllSkillEntries
}

main().then((allEntries) => {
  console.log('JSON.stringify(allEntries) => ', JSON.stringify(allEntries, null, 4))
})
