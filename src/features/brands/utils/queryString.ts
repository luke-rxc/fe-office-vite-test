import { parse, stringify, ParseOptions } from 'query-string';

/**
 * 유효한 파라미터만 추출
 */
export const extractValidParams = (params: Record<string, unknown> | string, options: ParseOptions = {}) => {
  const skipped = stringify(typeof params === 'string' ? parse(params) : params, {
    skipNull: true,
    skipEmptyString: true,
  });

  return parse(skipped, options);
};
