import { TicketSchema, TicketGoodsSchema, TicketGroupSchema, TicketResponseType } from '../schemas';

//  extends Omit<TicketSchema, 'id'>
export interface TicketModel {
  // value: number;
  /**
   * @issue 상품 등록시 상품 분류 Radio 버튼과 AutoComplete UI 내의 isOptionEqualToValue 체크를 위한 모든 데이터의 동일값 추가
   * - 티켓(AutoComplete)이 선택된 상태에서 상품분류 Radio 변경시, AutoComplete UI Warning 방지
   */
  /** label : channelName + name */
  label: string;
  value: TicketSchema['id'];
  info: TicketSchema;
}

export interface TicketGroupModel {
  label: string;
  value: TicketGroupSchema['groupId'];
  tickets: TicketGroupSchema['tickets'];
}

export interface TicketGoodsModel {
  /** label : id + name */
  label: string;
  value: TicketGoodsSchema['id'];
  info: TicketGoodsSchema;
}

/** @todo api option res, 상품상세 res 값이 다름 */
export interface TicketInfoModel extends Pick<TicketSchema, 'channelName' | 'periodDisplay'> {
  typeName: TicketResponseType['name'];
  typeId: TicketResponseType['id'];
}

const toTicketModel = (ticketProps: TicketSchema): TicketModel => ({
  label: `[${ticketProps.channelName}]${ticketProps.name} (${ticketProps.type.name})`,
  value: ticketProps.id,
  info: ticketProps,
});

export const toTicketModelList = (items: TicketSchema[]): TicketModel[] => {
  return items.map(toTicketModel);
};

const toTicketGroupModel = (ticketProps: TicketGroupSchema): TicketGroupModel => {
  const { name: label, groupId: value, tickets } = ticketProps;
  return {
    label,
    value,
    tickets,
  };
};

export const toTicketGroupModelList = (items: TicketGroupSchema[]): TicketGroupModel[] => {
  return items.map(toTicketGroupModel);
};

const toTicketGoodsModel = (ticketGoodsProps: TicketGoodsSchema): TicketGoodsModel => ({
  label: `[${ticketGoodsProps.id}] ${ticketGoodsProps.name}`,
  value: ticketGoodsProps.id,
  info: ticketGoodsProps,
});

export const toTicketGoodsModelList = (items: TicketGoodsSchema[]): TicketGoodsModel[] => {
  return items.map(toTicketGoodsModel);
};
