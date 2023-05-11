import { format } from 'date-fns';

/**
 * 제시된 date 인자를 dateFormat 형태로 변환
 *
 * @param {(string | number | Date | null | undefined)} date
 * @param {string} [dateFormat='yyyy/MM/dd HH:mm']
 * @return {string}
 */
export const toDateFormat = (
  date: string | number | Date | null | undefined,
  dateFormat: string = 'yyyy/MM/dd HH:mm',
  defaultValue = null,
) => {
  return date ? format(new Date(date), dateFormat) : defaultValue;
};
