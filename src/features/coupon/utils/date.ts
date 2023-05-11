import { setHours, setMinutes, setSeconds } from 'date-fns';

/**
 * date의 time 리턴
 *
 * @param {Date} date
 * @param {number} [dateValue=null]
 * @return {(number | null)}
 */
export const getDateTime = (date: Date, defaultValue: number = null): number | null => {
  return !!date ? date.getTime() : defaultValue;
};

/**
 * date의 hh:mm:ss 지정
 * @param {Date} date
 * @param {Array<number>} times
 */
export const setTimes = (date: Date, times: Array<number>) => {
  const [hours, minutes, seconds] = times;
  return setHours(setMinutes(setSeconds(date, seconds), minutes), hours);
};
