import { OptionModel } from '../types';

export const MILEAGE_ACTION_TYPE = {
  SAVE: 'SAVE',
  UN_SAVE: 'UNSAVE',
} as const;

export type MileageActionType = typeof MILEAGE_ACTION_TYPE[keyof typeof MILEAGE_ACTION_TYPE];

export const options: Array<OptionModel> = [
  { label: '지급', value: MILEAGE_ACTION_TYPE.SAVE },
  { label: '차감', value: MILEAGE_ACTION_TYPE.UN_SAVE },
];
