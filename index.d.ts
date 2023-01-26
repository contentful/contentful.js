// Type definitions for contentful
// Definitions by: Miika Hänninen <https://github.com/googol>
import type { BLOCKS, INLINES } from '@contentful/rich-text-types';

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
    getTag(id: string): Promise<Tag>;
    getTags(query?: any): Promise<TagCollection>;
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
    metadata: Metadata;
    toPlainObject(): object;
}

export interface ContentfulCollection<T> {
    total: number;
    skip: number;
    limit: number;
    items: Array<T>;
    toPlainObject(): object;
}

export type AssetCollection = ContentfulCollection<Asset>;

export interface Entry<T> {
    sys: Sys;
    fields: T;
    metadata: Metadata;
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
    code: string;
    name: string;
    default: boolean;
    fallbackCode: string | null;
    sys: {
        id: string;
        type: 'Locale';
        version: number;
    };
}

export type LocaleCollection = ContentfulCollection<Locale>;

export interface Tag {
    name: string;
    sys: {
        id: string;
        type: 'Tag';
        version: number;
        visibility: 'public';
    };
}

export type TagCollection = ContentfulCollection<Tag>;

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
    environment?: {
        sys: EnvironmentLink;
    };
    contentType: {
        sys: ContentTypeLink;
    };
}

export type LinkType = 'Space' | 'ContentType' | 'Environment';

export interface Link<T extends LinkType> {
    type: 'Link';
    linkType: T;
    id: string;
}

export type SpaceLink = Link<'Space'>;
export type EnvironmentLink = Link<'Environment'>;
export type ContentTypeLink = Link<'ContentType'>;

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
    allowedFields?: ContentTypeAllowedResources
}

interface ContentTypeAllowedResources {
    type: string
    source: string
    contentTypes: string[]
}

export type FieldType =
    | 'Symbol'
    | 'Text'
    | 'Integer'
    | 'Number'
    | 'Date'
    | 'Boolean'
    | 'Location'
    | 'Link'
    | 'Array'
    | 'Object'
    | 'RichText'
    | 'ResourceLink';

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
        lat: number;
        lon: number;
    }
    export type Link<T> = Asset | Entry<T>;
    export type Array<T = any> = Symbol[] | Entry<T>[] | Asset[];
    export type Object<T = any> = T;
    export interface RichText {
        data: {};
        content: RichTextContent[];
        nodeType: 'document';
    }
}

interface RichTextDataTarget {
    sys: {
        id: string;
        type: 'Link';
        linkType: 'Entry' | 'Asset';
    };
}

interface RichTextData {
    uri?: string;
    target?: RichTextDataTarget;
}

// Requires TypeScript v4.1+
type RichTextNodeType = `${BLOCKS}` | `${INLINES}` | 'text';

interface RichTextContent {
    data: RichTextData;
    content?: RichTextContent[];
    marks: { type: 'bold' | 'underline' | 'code' | 'italic' }[];
    value?: string;
    nodeType: RichTextNodeType;
}

interface TagLink {
    sys: {
        type: 'Link';
        linkType: 'Tag';
        id: string;
    };
}

interface Metadata {
    tags: TagLink[];
}
