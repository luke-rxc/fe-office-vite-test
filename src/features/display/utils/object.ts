import { isEmpty, values } from 'lodash';

export const isEveryValuesOccupied = (object: Object) => {
  return !values(object).every(isEmpty);
};
