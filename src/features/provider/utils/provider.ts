import { SelectTypeModel } from '../models';

/**
 * '시작일 < 종료일' 날짜 유효성 체크
 * @param {Date} start
 * @param {Date} to
 * @returns
 */
export const validateDate = (fromtDate: Date, toDate: Date): boolean => {
  const startTime = fromtDate.getTime();
  const endTime = toDate.getTime();
  return startTime <= endTime;
};

/**
 * select SelectTypeModel[] 리스트 내 활성화 할 값 조회
 * @param {number} value
 * @returns
 */
export const getActiveSelect = (
  value: number | string,
  list: SelectTypeModel[],
  key: 'label' | 'code' = 'code', // label / code 중 조회 할 키값
): SelectTypeModel => {
  return (
    list.find((option: SelectTypeModel) => {
      return option[key] === value;
    }) || null
  );
};
