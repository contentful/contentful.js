// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'
import {
  Entry,
  EntryFields,
  EntryLink,
  EntrySys,
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithAllLocalesAndWithoutLinkResolution,
  EntryWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithoutLinkResolution,
} from '../../lib'

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
 * @description: EntryWithoutLinkResolution linked entries are all rendered as entry links
 */
expectAssignable<
  EntryWithoutLinkResolution<{
    stringField: EntryFields.Text
    referenceField: EntryFields.Link<ExampleEntryFields>
    multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    referenceField: entryLinkValue,
    multiReferenceField: [entryLinkValue, entryLinkValue],
  },
})

expectNotAssignable<
  EntryWithoutLinkResolution<{
    stringField: EntryFields.Text
    referenceField: EntryFields.Link<ExampleEntryFields>
    multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    referenceField: undefined,
    multiReferenceField: [undefined, undefined],
  },
})

expectNotAssignable<
  EntryWithoutLinkResolution<{
    stringField: EntryFields.Text
    referenceField: EntryFields.Link<ExampleEntryFields>
    multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    stringField: stringValue,
    referenceField: {
      ...entryBasics,
      fields: {
        numberField: numberValue,
      },
    },
    multiReferenceField: [
      {
        ...entryBasics,
        fields: {
          numberField: numberValue,
        },
      },
    ],
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithLinkResolutionAndWithUnresolvableLinks referenced entries can be either resolved or unresolved.
 * unresolved entries are referenced as entry links. Fields with multiple references can have resolved and unresolved mixed.
 */
expectAssignable<
  EntryWithLinkResolutionAndWithUnresolvableLinks<{
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

/* unresolved links in reference fields cannot be undefined */
expectNotAssignable<
  EntryWithLinkResolutionAndWithUnresolvableLinks<{
    unresolvableReferenceField: EntryFields.Link<ExampleEntryFields>
  }>
>({
  ...entryBasics,
  fields: {
    unresolvableReferenceField: undefined,
  },
})

/* unresolved links in multi reference fields cannot be undefined */
expectNotAssignable<
  EntryWithLinkResolutionAndWithUnresolvableLinks<{
    unresolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    mixedMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    unresolvableMultiReferenceField: [undefined],
    mixedMultiReferenceField: [
      {
        ...entryBasics,
        fields: {
          numberField: numberValue,
        },
      },
      undefined,
    ],
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithoutLinkResolution All fields are mapped to the given set of locales.
 * linked entries are all rendered as entry links.
 */
expectAssignable<
  EntryWithAllLocalesAndWithoutLinkResolution<
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
  EntryWithAllLocalesAndWithoutLinkResolution<
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

/* links in reference fields can be undefined because we can’t distinguish between missing translation and missing link */
expectAssignable<
  EntryWithAllLocalesAndWithoutLinkResolution<
    {
      referenceField: EntryFields.Link<ExampleEntryFields>
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    referenceField: {
      DE: undefined,
      US: undefined,
    },
  },
})

/* links in multi reference fields cannot be undefined */
expectNotAssignable<
  EntryWithAllLocalesAndWithoutLinkResolution<
    {
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    multiReferenceField: {
      DE: [undefined],
      US: [undefined],
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks All fields are mapped to the given set of locales.
 * linked entries are all rendered as inlined references, or if not resolvable, as entry links. multi reference fields can have mixed content.
 */
expectAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
    {
      stringField: EntryFields.Text
      resolvableReferenceField: EntryFields.Link<ExampleEntryFields>
      unresolvableReferenceField: EntryFields.Link<ExampleEntryFields>
      resolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
      unresolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
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
    resolvableReferenceField: {
      DE: {
        ...entryBasics,
        fields: { numberField: { US: numberValue, DE: numberValue } },
      },
      US: {
        ...entryBasics,
        fields: { numberField: { US: numberValue } },
      },
    },
    unresolvableReferenceField: { US: entryLinkValue, DE: entryLinkValue },
    resolvableMultiReferenceField: {
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
    unresolvableMultiReferenceField: {
      DE: [entryLinkValue],
      US: [entryLinkValue],
    },
  },
})

/* links in reference fields can be undefined because we can’t distinguish between missing translation and missing link */
expectAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
    {
      referenceField: EntryFields.Link<ExampleEntryFields>
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    referenceField: {
      DE: undefined,
      US: undefined,
    },
  },
})

/* links in multi reference fields cannot be undefined */
expectNotAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
    {
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    multiReferenceField: {
      DE: [undefined],
      US: [undefined],
    },
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithLinkResolutionAndWithoutUnresolvableLinks only resolvable entries are present.
 * unresolvable entries are completely removed.
 */
expectAssignable<
  EntryWithLinkResolutionAndWithoutUnresolvableLinks<{
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
    unresolvableMultiReferenceField: [undefined],
  },
})

/* links in reference fields cannot be resolved links */
expectNotAssignable<
  EntryWithLinkResolutionAndWithoutUnresolvableLinks<{
    unresolvableReferenceField: EntryFields.Link<ExampleEntryFields>
  }>
>({
  ...entryBasics,
  fields: {
    unresolvableReferenceField: entryLinkValue,
  },
})

/* links in reference fields cannot be resolved links */
expectNotAssignable<
  EntryWithLinkResolutionAndWithoutUnresolvableLinks<{
    unresolvableMultiReferenceField: EntryFields.Link<ExampleEntryFields>[]
  }>
>({
  ...entryBasics,
  fields: {
    unresolvableMultiReferenceField: [entryLinkValue],
  },
})

/**
 * @namespace: Typescript - type test
 * @description: EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks All unresolvable fields are removed
 */
expectAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
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

/* links in reference fields cannot be resolved links */
expectNotAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
    {
      referenceField: EntryFields.Link<ExampleEntryFields>
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    referenceField: { DE: entryLinkValue, US: entryLinkValue },
  },
})

/* links in reference fields cannot be resolved links */
expectNotAssignable<
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
    {
      multiReferenceField: EntryFields.Link<ExampleEntryFields>[]
    },
    'US' | 'DE'
  >
>({
  ...entryBasics,
  fields: {
    multiReferenceField: { DE: [entryLinkValue], US: [entryLinkValue] },
  },
})
