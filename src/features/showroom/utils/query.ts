import queryString, { UrlObject, StringifyOptions, ParseOptions } from 'query-string';

export const stringify = (params: Record<string, any>, options?: StringifyOptions) => {
  return queryString.stringify(params, { arrayFormat: 'comma', skipNull: true, skipEmptyString: true, ...options });
};

export const stringifyUrl = (object: UrlObject, options?: StringifyOptions) => {
  return queryString.stringifyUrl(object, { arrayFormat: 'comma', skipNull: true, skipEmptyString: true, ...options });
};

export const parse = <T = any>(query: string, options?: ParseOptions) => {
  return queryString.parse(query, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'comma',
    ...options,
  }) as unknown as T;
};
