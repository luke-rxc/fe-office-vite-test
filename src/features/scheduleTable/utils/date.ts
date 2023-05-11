import { differenceInDays, set } from 'date-fns';

/**
 * 요일, 주차(week) 기준 range에 해당하는 date 리턴
 *
 * @param day: 요일
 * @param range: 주차(week) 기준 range
 */
const getDateOfWeek = (day: number, range: number) => {
  const baseDay = 1; // 월요일이 시작으로 설정
  const date = new Date();
  const dayOfRange = range * 7;
  date.setDate(date.getDate() - date.getDay() + baseDay + day + dayOfRange);
  return date;
};

/**
 * 주차(week) 기준 range에 해당하는 주(week)의 처음 date 리턴
 *
 * @param range: 주차(week) 기준 range
 */
export const getFirstDateOfWeek = (range: number) => {
  return set(getDateOfWeek(0, range), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
};

/**
 * 주차(week) 기준 range에 해당하는 주(week)의 마지막 date 리턴
 *
 * @param range: 주차(week) 기준 range
 */
export const getLastDateOfWeek = (range: number) => {
  return set(getDateOfWeek(6, range), { hours: 23, minutes: 59, seconds: 59, milliseconds: 99 });
};

/**
 * 주차(week) 기준 range에 해당하는 주(week)의 date 배열 리턴
 *
 * @param range: 주차(week) 기준 range
 */
export const getWeekDates = (range: number) => {
  return Array.from({ length: 7 }, (_, index) => index).map((day) => {
    const date = getDateOfWeek(day, range);
    return date.getDate().toString();
  });
};

/**
 * 주차(week) 기준 range에 해당하는 주(week)의 title 정보
 *
 * @param range: 주차(week) 기준 range
 */
export const getWeekTitle = (range: number) => {
  const firstDateTimeOfWeek = getFirstDateOfWeek(range);
  const lastDateTimeOfWeek = getLastDateOfWeek(range);

  const firstDateInfo = {
    year: firstDateTimeOfWeek.getFullYear(),
    month: firstDateTimeOfWeek.getMonth() + 1,
    info: `${firstDateTimeOfWeek.getFullYear()}년 ${firstDateTimeOfWeek.getMonth() + 1}월`,
  };

  const lastDateInfo = {
    year: lastDateTimeOfWeek.getFullYear(),
    month: lastDateTimeOfWeek.getMonth() + 1,
    info: `${lastDateTimeOfWeek.getFullYear()}년 ${lastDateTimeOfWeek.getMonth() + 1}월`,
  };

  if (firstDateInfo.info === lastDateInfo.info) {
    return firstDateInfo.info;
  } else {
    return `${firstDateInfo.info} - ${firstDateInfo.year !== lastDateInfo.year ? `${lastDateInfo.year}년 ` : ''}${
      firstDateInfo.month !== lastDateInfo.month ? `${lastDateInfo.month}월` : ''
    }`;
  }
};

/**
 * 현재 날짜와 차이 일수 리턴
 */
export const getDifferenceDays = (date: Date) => {
  const baseDate = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  const changeDate = set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  baseDate.setDate(baseDate.getDate() - baseDate.getDay() + 1);
  return differenceInDays(changeDate, baseDate);
};
