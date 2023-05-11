import queryString, { ParseOptions, StringifyOptions, UrlObject } from 'query-string';

export const parser = (search: string, option: ParseOptions = {}) => {
  return queryString.parse(search, {
    arrayFormat: 'comma',
    parseBooleans: true,
    parseNumbers: true,
    ...option,
  });
};

export const stringify = (query: Record<string, any>, option: StringifyOptions = {}) => {
  return queryString.stringify(query, {
    arrayFormat: 'comma',
    skipEmptyString: true,
    ...option,
  });
};

export const stringifyUrl = (
  { url = '', query = {}, fragmentIdentifier }: Partial<UrlObject>,
  option: StringifyOptions = {},
) => {
  return queryString.stringifyUrl(
    { url, query, fragmentIdentifier },
    {
      arrayFormat: 'comma',
      skipEmptyString: true,
      skipNull: true,
      ...option,
    },
  );
};
