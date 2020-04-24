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
    adapter?: any;
    application?: string;
    integration?: string;
    resolveLinks?: boolean;
    removeUnresolved?: boolean;
    retryOnError?: boolean;
    logHandler?: (level: ClientLogLevel, data?: any) => void;
    timeout?: number;
    retryLimit?: number;
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
    parseEntries<T>(raw: any): Promise<EntryCollection<T>>;
    sync(query: any): Promise<SyncCollection>;
}

export interface Asset {
    sys: Sys;
    fields: {
        title: string;
        description: string;
        file: {
            url: string;
            details: {
                size: number;
                image?: {
                    width: number;
                    height: number;
                };
            };
            fileName: string;
            contentType: string;
        };
    };
    toPlainObject(): object;
}

export interface ContentfulCollection<T> {
    total: number;
    skip: number;
    limit: number;
    items: Array<T>;
    toPlainObject(): object;
}

export type AssetCollection = ContentfulCollection<Asset>

export interface Entry<T> {
    sys: Sys;
    fields: T;
    toPlainObject(): object;
    update(): Promise<Entry<T>>;
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
    toPlainObject(): object;
}

export type ContentTypeCollection = ContentfulCollection<ContentType>;

export interface Space {
    sys: Sys;
    name: string;
    locales: Array<string>;
    toPlainObject(): object;
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
    toPlainObject(): object;
    stringifySafe(replacer?: any, space?: any): string;
}

export interface Sys {
    type: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    revision?: number;
    space?: {
        sys: SpaceLink;
    };
    contentType: {
        sys: ContentTypeLink;
    };
}

export interface SpaceLink {
    type: 'Link';
    linkType: 'Space';
    id: string;
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
    type: FieldType;
    validations: FieldValidation[];
    items?: FieldItem;
}

export type FieldType = 'Symbol' | 'Text' | 'Integer' | 'Number' | 'Date' | 'Boolean' | 'Location' | 'Link' | 'Array' | 'Object' | 'RichText';

export interface FieldValidation {
    unique?: boolean;
    size?: {
        min?: number;
        max?: number;
    };
    regexp?: {
        pattern: string;
    };
    linkMimetypeGroup?: string[];
    in?: string[];
    linkContentType?: string[];
    message?: string;
    nodes?: {
        'entry-hyperlink'?: FieldValidation[];
        'embedded-entry-block'?: FieldValidation[];
        'embedded-entry-inline'?: FieldValidation[];
    };
    enabledNodeTypes?: string[];
}

export interface FieldItem {
    type: 'Link' | 'Symbol';
    validations: FieldValidation[];
    linkType?: 'Entry' | 'Asset';
}

export function createClient(params: CreateClientParams): ContentfulClientApi;

/**
 * Types of fields found in an Entry
 */
export namespace EntryFields {
    export type Symbol = string;
    export type Text = string;
    export type Integer = number;
    export type Number = number;
    export type Date = string;
    export type Boolean = boolean;
    export interface Location {
        lat: string;
        lon: string;
    }
    export type Link<T> = Asset | Entry<T>;
    export type Array<T = any> = Symbol[] | Entry<T>[] | Asset[];
    export type Object<T = any> = T;
    export interface RichText {
        data:{};
        content: RichTextContent[];
        nodeType: 'document';
    }
}

interface RichTextDataTarget {
    sys: {
        id: string;
        type: "Link";
        "linkType": 'Entry' | 'Asset';
    };
}

interface RichTextData {
    uri?: string;
    target?: RichTextDataTarget;
}

type RichTextNodeType = 'text' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5'
    | 'heading-6' | 'paragraph' | 'hyperlink' | 'entry-hyperlink' | 'asset-hyperlink'
    | 'unordered-list' | 'ordered-list' | 'list-item' | 'blockquote' | 'hr' | 'embedded-entry-block'
    | 'embedded-entry-inline';

interface RichTextContent {
    data: RichTextData;
    content?: RichTextContent[]
    marks: {type: ('bold' | 'underline' | 'code' | 'italic')}[];
    value?: string;
    nodeType: RichTextNodeType;
}
