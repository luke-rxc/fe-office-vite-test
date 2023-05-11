import { TOption } from '@components/Select';
import { TicketGoodsComboSchema } from '../schemas';

/**
 * 티켓 상품 model
 */
export interface TicketGoodsComboModel extends TicketGoodsComboSchema {
  info: string;
}

/**
 * 티켓 상품 정보 model
 */
export interface TicketGoodsInfoModel {
  items: Array<TicketGoodsComboModel>;
  options: Array<TOption>;
}

/**
 * TicketGoodsSchema > TicketGoodsModel convert
 */
export const toTicketGoodsComboModel = (item: TicketGoodsComboSchema): TicketGoodsComboModel => {
  return {
    ...item,
    info: item.afterDay ? `구매일로부터 ${item.afterDay}일` : item.periodDisplay,
  };
};

/**
 * TicketGoodsComboSchema list > TicketGoodsComboModel list convert
 */
export const toTicketGoodsComboModelList = (items: Array<TicketGoodsComboSchema>): Array<TicketGoodsComboModel> => {
  return items.map(toTicketGoodsComboModel);
};

/**
 * TicketGoodsComboSchema list > TicketGoodsInfoModel convert
 */
export const toTicketGoodsInfoModel = (items: Array<TicketGoodsComboSchema>): TicketGoodsInfoModel => {
  return {
    items: toTicketGoodsComboModelList(items),
    options: items.map(({ id, name }) => {
      return {
        value: id,
        label: name,
      };
    }),
  };
};
