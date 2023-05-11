import { addDays } from 'date-fns';
import { toDateFormat } from '@utils/date';
import { BoolFlagType } from '../types';

/**
 * Util : Data Formatting
 *  - 1637655206000 => 2021-11-23T17:13
 */
export const toDataFormatExtend = (timeStamp: number) => {
  return toDateFormat(timeStamp, "yyyy-MM-dd'T'HH:mm");
};

/**
 * 할인율 계산
 *
 * @param {number} customerPrice 정상가
 * @param {number} price 판매가
 * @return {*} 할인율
 */
export const getRate = (customerPrice: number, price: number): number => {
  const rate = Math.floor(100 - (price / customerPrice) * 100);
  return !isNaN(rate) && isFinite(rate) ? rate : 0;
};

/**
 * 멀티 체크박스
 * @param baseValues 기본 value set
 * @param value 추가된 value
 * @returns
 */
export const checkMultiCheckbox = (baseValues = [], value: any): any[] => {
  return baseValues.includes(value) ? baseValues.filter((sValue) => sValue !== value) : [...(baseValues ?? []), value];
};

/**
 * Y, N 에 대한 Flag 변환
 */
export const isY = (value: BoolFlagType): boolean => {
  return value === 'Y';
};

export const boolToYn = (isBoolean: boolean): BoolFlagType => {
  return isBoolean ? 'Y' : 'N';
};

/**
 * FormDatePicker 에 대한 Date -> timeStamp 변환
 */
export const callbackDateConverter = (date: Date) => new Date(date).getTime();

/**
 * Date Preset
 */
export const getDatePresetByRange = (
  range?: number,
): {
  fromDate: number | null;
  toDate: number | null;
} => {
  const fromDate = Number.isInteger(range) ? addDays(new Date(), -range).getTime() : null;
  const toDate = Number.isInteger(range) ? new Date().getTime() : null;

  return {
    fromDate,
    toDate,
  };
};

/**
 * 콤마 형태의 String 을 배열로 변경
 */
export const getCommaStringToList = (listStr: string): string[] => listStr.split(',').map((item) => item.trim());

/**
 * Date String/Number -> TimeStamp 로 변경
 * - YYMMDD -> TimeStamp
 */
export const toDateTimestampFromString = (dateValue: string | number): number => {
  const dateStr = `20${dateValue}`;
  const toDateStr = [dateStr.substring(0, 4), dateStr.substring(4, 6), dateStr.substring(6, 8)].join('.');
  return new Date(toDateStr).getTime();
};

/**
 * URL Query 가 있는 상태에서 상품 조회 페이지 접근시 Autocomplete 기본 값 적용
 * - 브랜드, 입점사, 키워드 Autocomplete ui에 적용
 * @param options 브랜드, 입점사, 키워드에 있는 모든 Option 값
 * - @dependencies BrandModel, ProviderModel, KeywordModel
 * @param initIds 시작시 쿼리스티링을 기반으로 받아온 key 값
 * @todo type에 맞게 options의 타입지정 필요
 * @returns
 */
export const getListSearchAutocompleteInit = (options: unknown[], initIds: string) => {
  const ids = initIds.split(',');
  const listMap = new Map(
    options.map(({ label, commissionRate, value }) => [
      value,
      {
        label,
        ...(commissionRate && { commissionRate }),
      },
    ]),
  );
  return ids.map((value) => {
    const { label, commissionRate } = listMap.get(+value);
    return {
      label,
      value: +value,
      ...(commissionRate && { commissionRate }),
    };
  });
};
