import { ContentfulQuery } from 'contentful-sdk-core';
import { AxiosProxyConfig } from '@contentful/axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

interface Plainable<T> {
  toPlainObject(): T;
}

export type ClientLogLevel = 'error' | 'warning' | 'info';

export interface ContentfulOptions {
  space: string;
  accessToken: string;
  insecure?: boolean;
  host?: string;
  basePath?: string;
  httpAgent?: HttpAgent;
  httpsAgent?: HttpsAgent;
  proxy?: AxiosProxyConfig;
  headers?: object;
  resolveLinks: boolean;
  removeUnresolved: boolean;
  retryOnError?: boolean;
  logHandler?: (level: ClientLogLevel, data?: any) => void;
  defaultHostname: string;
  environment: string;
  application?: string;
  integration?: string;
  timeout?: number;
}

export interface ContentfulClientApi {
  getAsset(id: string, query?: ContentfulQuery): Promise<Asset>;
  getAssets(query?: ContentfulQuery): Promise<AssetCollection>;
  getContentType(id: string): Promise<ContentType>;
  getContentTypes(
    query?: ContentfulQuery
  ): Promise<ContentfulCollection<ContentTypeJSON>>;
  getEntries<T>(
    query?: ContentfulQuery
  ): Promise<EntryCollection<T> | EntryJSONCollection<T>>;
  getEntry<T>(id: string, query?: ContentfulQuery): Promise<Entry<T>>;
  getSpace(): Promise<Space>;
  getLocales(query: ContentfulQuery): Promise<LocaleCollection>;
  parseEntries<T>(
    data: EntryContentfulCollectionResponse<T>
  ): EntryCollection<T> | EntryJSONCollection<T>;
  sync<T>(query: SyncQuery): Promise<SyncCollection<T>>;
}

export interface LocaleJSON {
  sys: Sys;
  name: string;
  code: string;
  fallbackCode: string;
  contentDeliveryApi: boolean;
  contentManagementApi: boolean;
  default: boolean;
  optional: boolean;
}

export interface Locale extends LocaleJSON, Plainable<LocaleJSON> {}

export interface AssetJSON {
  sys: Sys;
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: any;
      fileName: string;
      contentType: string;
    };
  };
}

export interface Asset extends AssetJSON, Plainable<AssetJSON> {}

export interface ContentfulCollectionResponse<T> {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: T[];
}

interface Includes<T> {
  Asset: AssetJSON[];
  Entry: EntryJSON<T>[];
}
export interface EntryContentfulCollectionResponse<T>
  extends ContentfulCollectionResponse<EntryJSON<T>> {
  includes: Includes<T>;
}
export interface ContentfulCollection<T>
  extends ContentfulCollectionResponse<T>,
    Plainable<ContentfulCollectionResponse<T>> {}

export type AssetCollection = ContentfulCollection<AssetJSON>;
export type LocaleCollection = ContentfulCollection<LocaleJSON>;

export interface EntryJSON<T> {
  sys: Sys;
  fields: T;
}

export interface Entry<T> extends EntryJSON<T>, Plainable<EntryJSON<T>> {}

export interface EntryCollection<T> extends ContentfulCollection<EntryJSON<T>> {
  errors?: Array<any>;
  includes?: Includes<T>;
  items: EntryJSON<T>[];
  // TODO: fix signature of stringifySafe
  stringifySafe(replacer: any, space: any): void;
}

export interface EntryJSONCollection<T>
  extends EntryContentfulCollectionResponse<T> {
  errors?: Array<any>;
  // TODO: fix signature of stringifySafe
  stringifySafe(replacer: any, space: any): string;
}

export interface ContentTypeJSON {
  sys: Sys;
  name: string;
  description: string;
  displayField: string;
  fields: Array<Field>;
}

export interface ContentType
  extends ContentTypeJSON,
    Plainable<ContentTypeJSON> {}

export interface SpaceJSON {
  sys: Sys;
  name: string;
  locales: Array<string>;
}

export interface Space extends SpaceJSON, Plainable<SpaceJSON> {}

export interface SyncCollectionResponse<T> {
  items: Array<EntryJSON<T> | AssetJSON>;
  nextSyncToken?: string;
  nextPageToken?: string;
  nextPageUrl?: string;
  nextSyncUrl?: string;
}

export interface SyncOptions {
  resolveLinks: boolean,
  removeUnresolved: boolean,
  paginate: boolean
}

export interface SyncQuery {
  initial?: boolean;
  nextSyncToken?: string;
  nextPageToken?: string;
  content_type?: string;
  type?: string;
  sync_token?: string;
}

export interface SyncCollectionJSON<T> {
  entries: EntryJSON<T>[];
  assets: AssetJSON[];
  deletedEntries: EntryJSON<T>[];
  deletedAssets: AssetJSON[];
  nextSyncToken?: string;
  nextPageToken?: string;
}

export interface SafeStringifyible {
  stringifySafe: (replacer: any, space: any) => string
}
export interface SyncCollection<T>
  extends SyncCollectionJSON<T>,
    Plainable<SyncCollectionJSON<T>>,
    SafeStringifyible {}

export interface Sys {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  contentType: {
    sys: ContentTypeLink;
  };
}

export interface ContentTypeLink {
  type: 'Link';
  linkType: 'ContentType';
  id: string;
}

export interface Field {
  disabled: boolean;
  id: string;
  linkType?: string;
  localized: boolean;
  name: string;
  omitted: boolean;
  required: boolean;
  type: string;
}
