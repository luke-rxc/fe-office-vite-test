import { SelectOptionPropV2 } from '../types';

export const toDeliveryDailyList = (items: string[]): SelectOptionPropV2[] => {
  return items.map((item: string) => ({
    label: item,
    value: item,
  }));
};
