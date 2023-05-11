import { isNumber } from 'lodash';

interface FillEmptyStringParams<T> {
  value: T;
  cond: (value: T) => boolean;
}

const fillEmptyString = <T>({ cond, value }: FillEmptyStringParams<T>): T | '' => {
  return cond(value) ? value : '';
};

export const fillEmptyStringIfNumber = (value: string | number) => {
  return fillEmptyString<string | number>({ cond: isNumber, value });
};
