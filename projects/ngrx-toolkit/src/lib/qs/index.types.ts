export type defaultEncoder = (
  str: any,
  defaultEncoder?: any,
  charset?: string
) => string;

export interface IStringifyOptions {
  delimiter?: string | undefined;
  strictNullHandling?: boolean | undefined;
  skipNulls?: boolean | undefined;
  encode?: boolean | undefined;
  encoder?:
    | ((
        str: any,
        defaultEncoder: defaultEncoder,
        charset: string,
        type: 'key' | 'value'
      ) => string)
    | undefined;
  filter?:
    | Array<string | number>
    | ((prefix: string, value: any) => any)
    | undefined;
  arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma' | undefined;
  indices?: boolean | undefined;
  sort?: ((a: any, b: any) => number) | undefined;
  serializeDate?: ((d: Date) => string) | undefined;
  format?: 'RFC1738' | 'RFC3986' | undefined;
  encodeValuesOnly?: boolean | undefined;
  addQueryPrefix?: boolean | undefined;
  allowDots?: boolean | undefined;
  charset?: 'utf-8' | 'iso-8859-1' | undefined;
  charsetSentinel?: boolean | undefined;
}
