import pick from 'lodash/pick';
import { format } from 'date-fns';
import { ExportProps } from '@utils/excel';
import { parse } from '../utils';
import { ProviderSettlementSearchForm, ProviderSettlementListItem, ProviderNamesForComboBox } from '../types';
import { BaseListSchema, ProviderSettlementItemSchema, ExportExcelSchema, ComboListSchema } from '../schemas';
import { ProviderSettlementSearchFormDefaultValues } from '../constants';
import { GetProviderSettlementListParams, GetExcelAllListByProviderSettlementParams } from '../apis';

/** 입점사명 리스트 */
export const toProviderNamesModel = (schemas: ComboListSchema): ProviderNamesForComboBox => {
  return (schemas?.items || []).map(({ name }) => name);
};

/** 정산 목록 검색 폼 */
export const toProviderSettlementSearchFormModel = (query?: string): ProviderSettlementSearchForm => {
  const qs = parse<Partial<ProviderSettlementSearchForm>>(query || '');
  const keys: Array<keyof ProviderSettlementSearchForm> = [
    'yyyyMm',
    'round',
    'count',
    'providerName',
    'isPaid',
    'isTaxBillPublished',
    'page',
    'size',
  ];

  return {
    ...ProviderSettlementSearchFormDefaultValues,
    ...pick(qs, keys),
  };
};

/** 정산 목록 조회 파라미터 */
export const toProviderSettlementListParamsModel = (
  values: ProviderSettlementSearchForm,
): GetProviderSettlementListParams => {
  const { yyyyMm, count, round, providerName, isPaid, isTaxBillPublished, size, page } = values;

  return {
    yyyyMm: yyyyMm ? format(yyyyMm, 'yyyyMM') : null,
    count: count || null,
    round: round || null,
    size,
    page,
    isPaid: JSON.parse(isPaid),
    isTaxBillPublished: JSON.parse(isTaxBillPublished),
    providerName,
  };
};

/** 입점사별 정산 리스트 */
export const toProviderSettlementListModel = (
  schemas: BaseListSchema<ProviderSettlementItemSchema>,
): ProviderSettlementListItem[] => {
  return (schemas?.content || []).map(({ provider, ...rest }) => ({
    ...rest,
    providerName: provider.name,
  }));
};

/** 엑셀 데이터 포멧팅 */
export const toExportExcelModel = (schemas: ExportExcelSchema): Pick<ExportProps, 'headers' | 'sheetData'> => {
  const { headers, refs } = schemas.headers.reduce(
    (acc, { key, label }) => ({
      headers: [...acc.headers, label],
      refs: { ...acc.refs, [key]: label },
    }),
    { headers: [], refs: {} },
  );

  const sheetData = schemas.items.map((item) =>
    Object.keys(refs).reduce((acc, key) => ({ ...acc, [refs[key]]: item[key] }), {}),
  );

  return { sheetData, headers: [headers] };
};

/** 상세다운로드 */
export const toExcelByProviderSettlementModel = (
  schemas: ExportExcelSchema,
  values: ProviderSettlementListItem,
): ExportProps => {
  const fileName = `${values.providerName}_${values.yyyyMm}.xlsx`;

  return { ...toExportExcelModel(schemas), fileName, sheetName: '정산 내역' };
};

/** 전체다운로드 */
export const toExcelByProviderSettlementListModel = (
  schemas: ExportExcelSchema,
  values: ProviderSettlementSearchForm,
): ExportProps => {
  const { yyyyMm, round, count } = values;
  const providerName = values.providerName ? `${values.providerName}_` : '';
  const fileName = `${providerName}${format(yyyyMm, 'yyyyMM')}(${count}/${round}).xlsx`;

  return { ...toExportExcelModel(schemas), fileName, sheetName: '정산 내역' };
};

/** 전체 다운로드 api 파라미터 모델 */
export const toExcelByProviderSettlementListParamsModel = (
  values: ProviderSettlementSearchForm,
): GetExcelAllListByProviderSettlementParams => {
  const { yyyyMm, round, count, isPaid, isTaxBillPublished, providerName } = values;

  return {
    yyyyMm: yyyyMm ? format(yyyyMm, 'yyyyMM') : null,
    count: count || null,
    round: round || null,
    isPaid: JSON.parse(isPaid),
    isTaxBillPublished: JSON.parse(isTaxBillPublished),
    providerName,
  };
};
