import { ContentfulQuery, Plainable } from 'contentful-sdk-core';

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
  parseEntries<T>(data: ContentfulCollectionResponse<EntryJSON<T>>): EntryCollection<T>;
  sync<T>(query: ContentfulQuery): Promise<SyncCollection<T>>;
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
export interface ContentfulCollection<T> {
  toPlainObject(): ContentfulCollectionResponse<T>;
}

export type AssetCollection = ContentfulCollection<AssetJSON>;
export type LocaleCollection = ContentfulCollection<LocaleJSON>;

export interface EntryJSON<T> {
  sys: Sys;
  fields: T;
}

export interface Entry<T> extends EntryJSON<T>, Plainable<EntryJSON<T>> {}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<any>;
  includes?: Array<EntryJSON<T> | AssetJSON>;
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

export type ContentTypeCollection = ContentfulCollection<ContentType>;

export interface SpaceJSON {
  sys: Sys;
  name: string;
  locales: Array<string>;
}

export interface Space extends SpaceJSON,  Plainable<SpaceJSON> {}

export interface SyncCollectionResponse<T> {
  items: Array<EntryJSON<T> | AssetJSON>;
  nextSyncToken: string;
}

export interface SyncCollectionJSON<T> {
  entries: Entry<T>[];
  assets: Asset[];
  deletedEntries: Entry<T>[];
  deletedAssets: Asset[];
  nextSyncToken: string;
}

export interface SafeStringifyible {
  stringifySafe(replacer: any, space: any): string;
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