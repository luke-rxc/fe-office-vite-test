import pick from 'lodash/pick';
import { parse, stringifyUrl } from '../utils';
import { SettlementSearchForm, SettlementListItem } from '../types';
import { SettlementSearchFormDefaultValues } from '../constants';
import { BaseListSchema, SettlementItemSchema } from '../schemas';
import { GetSettlementListParams, PostSettlementExecuteParams } from '../apis';

/** 정산 목록 검색 폼 */
export const toSettlementSearchFormModel = (query?: string): SettlementSearchForm => {
  const qs = parse<Partial<SettlementSearchForm>>(query || '');
  const keys: Array<keyof SettlementSearchForm> = ['year', 'count', 'round', 'size', 'page'];

  return {
    ...SettlementSearchFormDefaultValues,
    ...pick(qs, keys),
  };
};

/** 정산 목록 조회 파라미터 가공 */
export const toSettlementListParamsModel = (values: SettlementSearchForm): GetSettlementListParams => {
  const { year, count, round, size, page } = values;

  return {
    year: new Date(year || new Date()).getFullYear(),
    count: count || null,
    round: round || null,
    size,
    page,
  };
};

/** 정산 요청 파라미터 가공 */
export const toSettlementExecuteParamsModel = ({
  yyyyMm: yyyyMM,
  count,
  round,
}: SettlementListItem): PostSettlementExecuteParams => {
  return { yyyyMM, count, round };
};

/** 정산 테이블 Row 데이터 추출  */
export const toSettlementModel = (schema: SettlementItemSchema) => {
  const { count, round, yearMonth } = schema;

  return {
    ...schema,
    url: stringifyUrl({
      url: '/settlement/provider/list',
      query: { count, round, yyyyMm: new Date(yearMonth).getTime() },
    }),
  };
};

/** 정산 테이블 Rows 데이터 추출 */
export const toSettlementListModel = (schema: BaseListSchema<SettlementItemSchema>): SettlementListItem[] => {
  return (schema?.content || []).map(toSettlementModel);
};
