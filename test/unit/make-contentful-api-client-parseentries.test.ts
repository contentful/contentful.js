// import { makeClient } from '../../lib/make-client'
// import createGlobalOptions from '../../lib/create-global-options'

// TODO
test('Given json should be parsed correctly as a collection of entries', () => {
  //   const api = makeClient({
  //     // @ts-ignore
  //     http: {},
  //     // @ts-ignore
  //     getGlobalOptions: createGlobalOptions({ resolveLinks: true }),
  //   })
  //   const data = {
  //     items: [
  //       {
  //         sys: {
  //           type: 'Entry',
  //           locale: 'en-US',
  //         },
  //         fields: {
  //           animal: {
  //             sys: {
  //               type: 'Link',
  //               linkType: 'Animal',
  //               id: 'oink',
  //             },
  //           },
  //           anotheranimal: {
  //             sys: {
  //               type: 'Link',
  //               linkType: 'Animal',
  //               id: 'middle-parrot',
  //             },
  //           },
  //         },
  //       },
  //     ],
  //     includes: {
  //       Animal: [
  //         {
  //           sys: {
  //             type: 'Animal',
  //             id: 'oink',
  //             locale: 'en-US',
  //           },
  //           fields: {
  //             name: 'Pig',
  //             friend: {
  //               sys: {
  //                 type: 'Link',
  //                 linkType: 'Animal',
  //                 id: 'groundhog',
  //               },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   }
  //   const parsedData = api.parseEntries<any>(data)
  //   expect(parsedData).toBeDefined()
  //   expect(parsedData.items[0].fields.animal.sys).toEqual(data.includes.Animal[0].sys)
})

// TODO
// test('Given json should be parsed correctly as a collection of entries where an item is called metadata', () => {
//   const api = makeClient({
//     // @ts-ignore
//     http: {},
//     // @ts-ignore
//     getGlobalOptions: createGlobalOptions({ resolveLinks: true }),
//   })
//   const data = {
//     items: [
//       {
//         sys: {
//           type: 'Entry',
//           locale: 'en-US',
//         },
//         fields: {
//           metadata: {
//             sys: {
//               type: 'Link',
//               linkType: 'Animal',
//               id: 'oink',
//             },
//           },
//           anotheranimal: {
//             sys: {
//               type: 'Link',
//               linkType: 'Animal',
//               id: 'middle-parrot',
//             },
//           },
//         },
//         metadata: {
//           tags: [
//             {
//               sys: {
//                 type: 'Link',
//                 linkType: 'Tag',
//                 id: 'tagId',
//               },
//             },
//           ],
//         },
//       },
//     ],
//     includes: {
//       Metadata: [
//         {
//           sys: {
//             type: 'Animal',
//             id: 'oink',
//             locale: 'en-US',
//           },
//           fields: {
//             name: 'Pig',
//             friend: {
//               sys: {
//                 type: 'Link',
//                 linkType: 'Animal',
//                 id: 'groundhog',
//               },
//             },
//           },
//         },
//       ],
//     },
//   }
//   const parsedData = api.parseEntries<any>(data)
//   expect(parsedData).toBeDefined()
//   expect(parsedData.items[0].fields.metadata.sys).toEqual(data.includes.Metadata[0].sys)
// })

// TODO
// test('Given json should be parsed correctly as a collection of entries with resource links', () => {
//   const api = makeClient({
//     // @ts-ignore
//     http: {},
//     // @ts-ignore
//     getGlobalOptions: createGlobalOptions({ resolveLinks: false }),
//   })

//   const data = {
//     items: [
//       {
//         sys: {
//           type: 'Entry',
//         },
//         fields: {
//           xspace: [
//             {
//               sys: {
//                 type: 'ResourceLink',
//                 linkType: 'Contentful:Entry',
//                 urn: 'crn:test:::content:spaces/0i1ksbf51zos/entries/U4X2TI5qzC0w6Rk947mdX',
//               },
//             },
//           ],
//           xspace2: [
//             {
//               sys: {
//                 type: 'ResourceLink',
//                 linkType: 'Contentful:Entry',
//                 urn: 'crn:test:::content:spaces/8kouir73nbuz/entries/BfmNpEsQSFuh2lybiVkoq',
//               },
//             },
//             {
//               sys: {
//                 type: 'ResourceLink',
//                 linkType: 'Contentful:Entry',
//                 urn: 'crn:test:::content:spaces/kdtd0watvk6m/entries/irF9JXBHqNhwMwelu9HYt',
//               },
//             },
//           ],
//         },
//       },
//     ],
//   }

//   const parsedData = api.parseEntries<any>(data)
//   expect(parsedData).toBeDefined()
//   expect(parsedData.items[0].fields.xspace[0].sys).toEqual(data.items[0].fields.xspace[0].sys)
//   expect(parsedData.items[0].fields.xspace2[0].sys).toEqual(data.items[0].fields.xspace2[0].sys)
//   expect(parsedData.items[0].fields.xspace2[1].sys).toEqual(data.items[0].fields.xspace2[1].sys)
// })
