import { ReturnGoodsFlowLinkModel, ShippingDetailModel } from '../models';

/**
 * 배송지 정보
 */
export type ShippingSchema = ShippingDetailModel;

/**
 * 배송지 리스트
 */
export type ShippingListSchema = {
  providerShippings: ShippingSchema[];
};

/**
 * 택배사 리스트
 */
export type DeliveryCompanySchema = {
  code: string;
  name: string;
};

export type ReturnGoodsFlowLinkSchema = ReturnGoodsFlowLinkModel;
