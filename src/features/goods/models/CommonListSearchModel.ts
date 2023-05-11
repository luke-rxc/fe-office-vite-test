import { GoodsStatus } from '@constants/goods';
import { DateType, GoodsType, SaleStatusCbOptions, GoodsTypeCbOptions } from '../constants';

/***************************************
 * Manager, Partner 공통 범주
 ****************************************/
export interface BaseSearchModel {
  name: string;
  type: GoodsType[];
  dateType: DateType;
  fromDate: number | null;
  toDate: number | null;
  statuses: GoodsStatus[];
}

/** Query Value set */
export const CommonFormFieldValue = {
  name: '',
  dateType: DateType.START,
  fromDate: null,
  toDate: null,
  statusList: SaleStatusCbOptions.map(() => false),
  typeList: GoodsTypeCbOptions.map(() => false),
  brandInfo: [],
  goodsIds: '',
};

/**
 * Query value -> Search State 로 치환
 * - QueryState 의 데이터를 Checkbox 데이터로 치환
 */
export const toCbModelFromQueryState = (queryStateValue: string, cbOptions: string[]) => {
  const queryStateValues = queryStateValue.split(',');
  return cbOptions.map((item) => queryStateValues.includes(item));
};

/**
 * Search State -> Query value 로 치환
 * Checkbox 데이터를 QueryState 데이터로 치환
 */
export const toQueryStateFromCbModel = (cbModel: Boolean[], cbOptions: any[]) => {
  return cbModel.map((isCheck, index) => (isCheck ? cbOptions[index] : null)).filter((item) => !!item);
};
