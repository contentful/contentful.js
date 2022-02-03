export type ChainOptions = {
  withoutLinkResolution?: boolean
  withAllLocales?: boolean
}

export enum EntriesResponse {
  WithoutLinkResolution = 'WithoutLinkResolution',
  WithLinkResolution = 'WithLinkResolution',
  WithAllLocales = 'WithAllLocales',
  WithAllLocalesAndWithLinkResolution = 'WithAllLocalesAndWithLinkResolution',
  WithAllLocalesAndWithoutLinkResolution = 'WithAllLocalesAndWithoutLinkResolution',
  Default = WithLinkResolution,
}

export interface ClientChain<ResponseType extends EntriesResponse> {
  getEntries(): Promise<ResponseType>
}

export type DefaultClient = ClientWithLinkResolution
export type ClientWithLinkResolution = ClientChain<EntriesResponse.WithLinkResolution>
export type ClientWithAllLocalesAndWithoutLinkResolution =
  ClientChain<EntriesResponse.WithAllLocalesAndWithoutLinkResolution>

export type ClientWithoutLinkResolution = ClientChain<EntriesResponse.WithoutLinkResolution>
export type ClientWithAllLocalesAndWithLinkResolution =
  ClientChain<EntriesResponse.WithAllLocalesAndWithLinkResolution>

export interface ChainOptionWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
}

export interface ChainOptionWithAllLocalesAndWithLinkResolution extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: true
}

export interface ChainOptionWithAllLocalesAndWithoutLinkResolution extends ChainOptions {
  withoutLinkResolution: true
  withAllLocales: true
}

export interface ChainOptionWithLinkResolution extends ChainOptions {
  withoutLinkResolution: false
  withAllLocales: false
}

export type DefaultChainOption = ChainOptionWithLinkResolution

export type Client = {
  withAllLocales: {
    withoutLinkResolution: ClientWithAllLocalesAndWithoutLinkResolution
  } & ClientWithAllLocalesAndWithLinkResolution
  withoutLinkResolution: {
    withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
  } & ClientWithoutLinkResolution
} & DefaultClient

// Previous implementation (from create-contentful-api.ts)

// export type ClientWithoutLinkResolution = {
//   getEntry<Fields extends FieldsType>(
//     id: string,
//     query?: EntryQueries
//   ): Promise<EntryWithoutLinkResolution<Fields>>
//   getEntries<Fields extends FieldsType = FieldsType>(
//     query?: EntriesQueries<Fields>
//   ): Promise<EntryCollectionWithoutLinkResolution<Fields>>
//   withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
// }

// export type ClientWithAllLocalesAndWithoutLinkResolution = {
//   getEntry<Fields extends FieldsType, Locales extends LocaleCode = any>(
//     id: string,
//     query?: EntryQueries
//   ): Promise<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>
//   getEntries<Fields extends FieldsType = FieldsType, Locales extends LocaleCode = any>(
//     query?: EntriesQueries<Fields>
//   ): Promise<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>
// }

// export type ClientWithAllLocalesAndWithLinkResolution = {
//   getEntry<Fields extends FieldsType = FieldsType, Locales extends LocaleCode = any>(
//     id: string,
//     query?: EntryQueries
//   ): Promise<EntryWithAllLocalesAndWithLinkResolution<Fields, Locales>>
//   getEntries<Fields extends FieldsType = FieldsType, Locales extends LocaleCode = any>(
//     query?: EntriesQueries<Fields>
//   ): Promise<EntryCollectionWithAllLocalesAndWithLinkResolution<Fields, Locales>>
// }
