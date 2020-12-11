import { AxiosInstance } from 'contentful-sdk-core'
export type HttpClientInstance = AxiosInstance
export interface AssetDetails {
  size: number;
  image?: {
    width: number;
    height: number;
  }
}
export interface AssetFile {
  url: string;
  details: AssetDetails;
  fileName: string;
  contentType: string;
}
export interface AssetFields {
  title: string;
  description: string;
  file: AssetFile
}
export interface Asset {
  sys: Sys;
  fields: AssetFields;
}
export interface ContentfulCollection<T> {
  total: number;
  skip: number;
  limit: number;
  items: Array<T>;
}
export type AssetCollection = ContentfulCollection<Asset>;
export interface Entry<T> {
  sys: Sys;
  fields: T;
}
export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<any>;
  includes?: any;
}
export interface ContentType {
  sys: Sys;
  name: string;
  description: string;
  displayField: string;
  fields: Array<Field>;
}
export declare type ContentTypeCollection = ContentfulCollection<ContentType>;
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
export declare type LocaleCollection = ContentfulCollection<Locale>;
export interface SyncCollection {
  entries: Array<Entry<any>>;
  assets: Array<Asset>;
  deletedEntries: Array<Entry<any>>;
  deletedAssets: Array<Asset>;
  nextSyncToken: string;
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
export interface Link<T extends string> {
    type: 'Link'
    linkType: T
    id: string
}
export interface SpaceLink extends Link<'Space'>{}
export interface ContentTypeLink extends Link<'ContentType'>{}
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
export declare type FieldType = 'Symbol' | 'Text' | 'Integer' | 'Number' | 'Date' | 'Boolean' | 'Location' | 'Link' | 'Array' | 'Object' | 'RichText';
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
/**
 * Types of fields found in an Entry
 */
export declare namespace EntryFields {
  type Symbol = string;
  type Text = string;
  type Integer = number;
  type Number = number;
  type Date = string;
  type Boolean = boolean;
  interface Location {
    lat: string;
    lon: string;
  }
  type Link<T> = Asset | Entry<T>;
  type Array<T = any> = Symbol[] | Entry<T>[] | Asset[];
  type Object<T = any> = T;
  interface RichText {
    data: {};
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
declare type RichTextNodeType = 'text' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 'paragraph' | 'hyperlink' | 'entry-hyperlink' | 'asset-hyperlink' | 'unordered-list' | 'ordered-list' | 'list-item' | 'blockquote' | 'hr' | 'embedded-entry-block' | 'embedded-entry-inline';
interface RichTextContent {
  data: RichTextData;
  content?: RichTextContent[];
  marks: {
    type: ('bold' | 'underline' | 'code' | 'italic');
  }[];
  value?: string;
  nodeType: RichTextNodeType;
}
export interface Space {
  sys: Sys;
  name: string;
  locales: Array<string>;
}
