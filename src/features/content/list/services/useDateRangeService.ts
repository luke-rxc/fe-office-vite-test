import { addDays, subDays, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

/**
 * 날짜 기간
 * @returns
 */
export const useDateRangeService = () => {
  /**
   *
   * @param type : 일수 기준, 달 기준
   * @param range : 오늘 기준 n일, n달
   * @param isSub : 오늘 기준 이전 여부
   * @returns
   */
  const handleGetRangeDate = (
    dateRange: DateRangeModel,
  ): {
    fromDate: number;
    toDate: number;
  } => {
    const { type, range, isSub } = dateRange;
    let fromDate: number;
    let toDate: number;
    const today = new Date();
    if (type === DateRangeType.DAY) {
      if (isSub) {
        fromDate = Number.isInteger(range) ? subDays(today, range).getTime() : null; // 오늘기준 n일전부터
        toDate = Number.isInteger(range) ? today.getTime() : null; // 오늘까지
      } else {
        fromDate = Number.isInteger(range) ? today.getTime() : null; // 오늘부터
        toDate = Number.isInteger(range) ? addDays(today, range).getTime() : null; // 오늘기준 n일후까지
      }
    } else {
      if (isSub) {
        const targetMonth = subMonths(today, range);
        fromDate = startOfMonth(targetMonth).getTime(); // (이번달 - n달)전 시작일 부터
        toDate = endOfMonth(targetMonth).getTime(); // (이번달 - n달)전 마지막일 까지
      } else {
        const targetMonth = addMonths(today, range);
        fromDate = startOfMonth(targetMonth).getTime(); // (이번달 + n달) 시작일 부터
        toDate = endOfMonth(targetMonth).getTime(); // (이번달 + n달) 마지막일 까지
      }
    }
    return {
      fromDate,
      toDate,
    };
  };
  return {
    handleGetRangeDate,
  };
};

export type DateRangeModel = {
  type: DateRangeType;
  range: number;
  isSub: boolean;
};
export const DateRangeType = {
  DAY: 'DAY',
  MONTH: 'MONTH',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DateRangeType = typeof DateRangeType[keyof typeof DateRangeType];
