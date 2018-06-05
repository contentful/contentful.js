
declare module 'contentful-resolve-response' {
  export default function<T>(
    response: { includes?: { Asset: object[], Entry: object[] }; items?: T[] },
    options: { removeUnresolved: boolean; itemEntryPoints: string[] }
  ): T[];
}
