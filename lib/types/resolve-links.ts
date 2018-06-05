
declare module 'contentful-resolve-response' {
  export default function<TSource, TResult>(
    response: { includes: Array<any>; items: Array<TSource> },
    options: { removeUnresolved: boolean; itemEntryPoints: string[] }
  ): TResult[];
}
