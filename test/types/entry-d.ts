// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import { Entry, EntryFields, EntryLink, EntrySys, EntryR } from '../../lib'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true
export const dateValue = '2018-05-03T09:18:16.329Z'
export const metadataValue = { tags: [] }
export const entryLinkValue: EntryLink = {
  type: 'Link',
  linkType: 'Entry',
  id: stringValue,
}

const entrySysValue: EntrySys = {
  contentType: { sys: { id: stringValue, type: 'Link', linkType: 'ContentType' } },
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: '', //?
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}

const entryBasics = {
  sys: entrySysValue,
  metadata: metadataValue,
}

type ExampleEntryFields = {
  numberField: EntryFields.Integer
}

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry with generic fields
 */
expectAssignable<Entry<Record<string, any>>>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    anyRandomFieldName: numberValue,
  },
})

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry generic
 */
expectAssignable<Entry<{ stringField: EntryFields.Text }>>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
  },
})

/**
 * @namespace: Typescript - type test
 * @description: A simple Entry generic with a referenced fields wildcard
 */
expectAssignable<
  Entry<{
    stringField: EntryFields.Text
    referenceField: EntryFields.Link<Record<string, any>>
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    referenceField: {
      ...entryBasics,
      fields: {},
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryR.WithLinkResolution.WithUnresolvableLinks: referenced entries can be either resolved or unresolved.
 * unresolved entries are referenced as entry links. Fields with multiple references can have resolved and unresolved mixed.
 */
expectAssignable<
  EntryR.WithLinkResolution.WithUnresolvableLinks<{
    stringField: EntryFields.Text
    resolvableReferenceField: EntryFields.Link<ExampleEntryFields>
    unresolvableReferenceField: EntryFields.Link<ExampleEntryFields>
    resolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    unresolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    mixedMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    resolvableReferenceField: {
      ...entryBasics,
      fields: {
        numberField: numberValue,
      },
    },
    unresolvableReferenceField: entryLinkValue,
    resolvableMultiReferenceField: [
      {
        ...entryBasics,
        fields: {
          numberField: numberValue,
        },
      },
    ],
    unresolvableMultiReferenceField: [entryLinkValue],
    mixedMultiReferenceField: [
      {
        ...entryBasics,
        fields: {
          numberField: numberValue,
        },
      },
      entryLinkValue,
    ],
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryR.WithAllLocales.WithoutLinkResolution: All fields are mapped to the given set of locales.
 * linked entries are all rendered as entry links.
 */
expectAssignable<
  EntryR.WithAllLocales.WithoutLinkResolution<
    {
      stringField: EntryFields.Text
      referenceField: EntryFields.Link<ExampleEntryFields>
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    stringField: {
      US: stringValue,
      DE: stringValue,
    },
    referenceField: {
      DE: entryLinkValue,
      US: entryLinkValue,
    },
    multiReferenceField: {
      DE: [entryLinkValue],
      US: [entryLinkValue],
    },
  },
})

/* resolved links are NOT assignable */
expectNotAssignable<
  EntryR.WithAllLocales.WithoutLinkResolution<
    {
      referenceField: EntryFields.Link<ExampleEntryFields>
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    referenceField: {
      DE: { numberField: { US: numberValue, DE: numberValue } },
      US: { numberField: { US: numberValue, DE: numberValue } },
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryR.WithAllLocales.WithLinkResolution.WithUnresolvableLinks: All fields are mapped to the given set of locales.
 * linked entries are all rendered as inlined references, or if not resolvable, as entry links. multi reference fields can have mixed content.
 */
expectAssignable<
  EntryR.WithAllLocales.WithLinkResolution.WithUnresolvableLinks<
    {
      stringField: EntryFields.Text
      referenceField: EntryFields.Link<ExampleEntryFields>
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    stringField: {
      US: stringValue,
      DE: stringValue,
    },
    referenceField: {
      DE: {
        ...entryBasics,
        fields: { numberField: { US: numberValue, DE: numberValue } },
      },
      US: {
        ...entryBasics,
        fields: { numberField: { US: numberValue } },
      },
    },
    multiReferenceField: {
      DE: [
        {
          ...entryBasics,
          fields: { numberField: { US: numberValue, DE: numberValue } },
        },
      ],
      US: [
        {
          ...entryBasics,
          fields: { numberField: { US: numberValue, DE: numberValue } },
        },
      ],
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryR.WithLinkResolution.WithoutUnresolvableLinks only resolvable entries are present.
 * unresolvable entries are completely removed.
 */
expectAssignable<
  EntryR.WithLinkResolution.WithoutUnresolvableLinks<{
    stringField: EntryFields.Text
    resolvableReferenceField: EntryFields.Link<ExampleEntryFields>
    unresolvableReferenceField: EntryFields.Link<ExampleEntryFields>
    resolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    unresolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    resolvableReferenceField: {
      ...entryBasics,
      fields: {
        numberField: numberValue,
      },
    },
    unresolvableReferenceField: undefined,
    resolvableMultiReferenceField: [
      {
        ...entryBasics,
        fields: {
          numberField: numberValue,
        },
      },
    ],
    unresolvableMultiReferenceField: undefined,
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryR.WithAllLocales.WithLinkResolution.WithoutUnresolvableLinks: All unresolvable fields are removed
 */
expectAssignable<
  EntryR.WithAllLocales.WithLinkResolution.WithoutUnresolvableLinks<
    {
      stringField: EntryFields.Text
      referenceField: EntryFields.Link<ExampleEntryFields>
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    stringField: {
      US: stringValue,
      DE: stringValue,
    },
    referenceField: {
      DE: {
        ...entryBasics,
        fields: { numberField: { US: numberValue, DE: numberValue } },
      },
      US: {
        ...entryBasics,
        fields: { numberField: { US: numberValue } },
      },
    },
    multiReferenceField: {
      DE: [
        {
          ...entryBasics,
          fields: { numberField: { US: numberValue, DE: numberValue } },
        },
      ],
    },
  },
})