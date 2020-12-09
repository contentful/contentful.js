import createContentfulApi from '../../lib/create-contentful-api'
import createGlobalOptions from '../../lib/create-global-options'

test('Given json should be parsed correctly as a collection of entries', () => {
  const api = createContentfulApi({
  // @ts-ignore
    http: {},
    getGlobalOptions: createGlobalOptions({ resolveLinks: true })
  })
  const data = {
    items: [
      {
        sys: {
          type: 'Entry',
          locale: 'en-US'
        },
        fields: {
          animal: {
            sys: {
              type: 'Link',
              linkType: 'Animal',
              id: 'oink'
            }
          },
          anotheranimal: {
            sys: {
              type: 'Link',
              linkType: 'Animal',
              id: 'middle-parrot'
            }
          }
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: {
            type: 'Animal',
            id: 'oink',
            locale: 'en-US'
          },
          fields: {
            name: 'Pig',
            friend: {
              sys: {
                type: 'Link',
                linkType: 'Animal',
                id: 'groundhog'
              }
            }
          }
        }
      ]
    }
  }
  const parsedData = api.parseEntries<any>(data)
  expect(parsedData).toBeDefined()
  expect(parsedData.items[0].fields.animal.sys).toEqual(data.includes.Animal[0].sys)
})
