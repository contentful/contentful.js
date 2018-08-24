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
    getAsset(id: string, query?: any): Promise<Asset>;
    getAssets(query?: any): Promise<AssetCollection>;
    getContentType(id: string): Promise<ContentType>;
    getContentTypes(query?: any): Promise<ContentTypeCollection>;
    getEntries<T>(query?: any): Promise<EntryCollection<T>>;
    getEntry<T>(id: string, query?: any): Promise<Entry<T>>;
    getSpace(): Promise<Space>;
    getLocales(): Promise<LocaleCollection>;
    sync(query: any): Promise<SyncCollection>;
}

export interface Asset {
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
    toPlainObject(): Asset;
}

export interface ContentfulCollection<T> {
    total: number;
    skip: number;
    limit: number;
    items: Array<T>;
    toPlainObject(): this;
}

export type AssetCollection = ContentfulCollection<Asset>

export interface Entry<T> {
    sys: Sys;
    fields: T;
    toPlainObject(): Entry<T>;
}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
    errors?: Array<any>;
    includes?: any;
    stringifySafe(replacer?: any, space?: any): string;
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

export interface Locale {
  code: string
  name: string
  default: boolean
  fallbackCode: string | null
  sys: {
    id: string
    type: 'Locale'
    version: number
  }
}

export type LocaleCollection = ContentfulCollection<Locale>;

export interface SyncCollection {
    entries: Array<Entry<any>>;
    assets: Array<Asset>;
    deletedEntries: Array<Entry<any>>;
    deletedAssets: Array<Asset>;
    nextSyncToken: string;
    toPlainObject(): SyncCollection;
    stringifySafe(replacer?: any, space?: any): string;
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

export function createClient(params: CreateClientParams): ContentfulClientApi;
