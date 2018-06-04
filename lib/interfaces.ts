import { ContentfulQuery, Plainable } from 'contentful-sdk-core';
import { Plainable } from 'contentful-sdk-core';
import { Omit } from 'contentful-sdk-core';

// Type definitions for contentful
// Definitions by: Miika Hänninen <https://github.com/googol>

export interface AxiosProxyConfig {
  host: string;
  port?: number;
  auth?: {
    username: string;
    password: string;
  };
}

export type ClientLogLevel = 'error' | 'warning' | 'info';

export interface CreateClientParams {
  space: string;
  accessToken: string;
  environment?: string;
  insecure?: boolean;
  host?: string;
  basePath?: string;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig;
  headers?: any;
  application?: string;
  integration?: string;
  resolveLinks?: boolean;
  removeUnresolved?: boolean;
  retryOnError?: boolean;
  logHandler?: (level: ClientLogLevel, data?: any) => void;
  timeout?: number;
}

export interface ContentfulClientApi {
  getAsset(id: string, query?: ContentfulQuery): Promise<Asset>;
  getAssets(query?: ContentfulQuery): Promise<AssetCollection>;
  getContentType(id: string): Promise<ContentType>;
  getContentTypes(query?: ContentfulQuery): Promise<ContentTypeCollection>;
  getEntries<T>(query?: ContentfulQuery): Promise<EntryCollection<T>>;
  getEntry<T>(id: string, query?: ContentfulQuery): Promise<Entry<T>>;
  getSpace(): Promise<Space>;
  getLocales(query: ContentfulQuery): Promise<LocaleCollection>;
  parseEntries<T>(data: EntryCollection<T>): EntryCollection<T>;
  sync(query: ContentfulQuery): Promise<SyncCollection>;
}

export interface Locale {
  sys: Sys;
  name: string;
  code: string;
  fallbackCode: string;
  contentDeliveryApi: boolean;
  contentManagementApi: boolean;
  default: boolean;
  optional: boolean;
}

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

export interface Asset extends AssetJSON {
  toPlainObject(): AssetJSON;
}

export interface ContentfulCollectionResponse<T> {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: T[];
}
export interface ContentfulCollection<T> {
  toPlainObject(): ContentfulCollectionResponse<T>;
}

export type AssetCollection = ContentfulCollection<AssetJSON>;
export type LocaleCollection = ContentfulCollection<Locale>;

export interface Entry<T> {
  sys: Sys;
  fields: T;
  toPlainObject(): Entry<T>;
}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<any>;
  includes?: any;
  stringifySafe(replacer: any, space: any): string;
}

export interface ContentType {
  sys: Sys;
  name: string;
  description: string;
  displayField: string;
  fields: Array<Field>;
  toPlainObject(): ContentType;
}

export type ContentTypeCollection = ContentfulCollection<ContentType>;

export interface Space {
  sys: Sys;
  name: string;
  locales: Array<string>;
  toPlainObject(): Space;
}

export interface SyncCollection {
  entries: Array<Entry<any>>;
  assets: Array<Asset>;
  deletedEntries: Array<Entry<any>>;
  deletedAssets: Array<Asset>;
  nextSyncToken: string;
  toPlainObject(): SyncCollection;
  stringifySafe(replacer: any, space: any): string;
}

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

// export function createClient(params: CreateClientParams): ContentfulClientApi;
