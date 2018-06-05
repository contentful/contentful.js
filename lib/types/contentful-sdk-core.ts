declare module 'contentful-sdk-core' {
  import { AxiosInstance, AxiosStatic } from '@contentful/axios';

  export function createHttpClient(
    axios: AxiosInstance,
    options: { [key: string]: any }
  ): AxiosInstance;

  export function getUserAgentHeader(
    sdk: string,
    application?: string,
    integration?: string
  ): string;

  export interface ContentfulQuery {
    content_type?: string;
    resolveLinks?: boolean;
    [key: string]: any;
  }

  // TODO: check if works
  export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  interface ContentfulRequestConfig {
    params: Omit<ContentfulQuery, 'resolveLinks'>;
  }

  export function createRequestConfig({
    query
  }: {
    query: ContentfulQuery;
  }): ContentfulRequestConfig;

  export function toPlainObject<T>(data: T): T & {toPlainObject(): T};

  // TODO: add more details to T: accepts only with .sys , returns Readonly<...>
  export function freezeSys<T>(obj: T): T;
}
