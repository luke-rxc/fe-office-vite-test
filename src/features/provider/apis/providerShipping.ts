import { baseApiClient } from '@utils/api';
import { ShippingDetailFieldModel, ShippingRequestParamModel, toShippingRequestParam } from '../models';
import { ShippingListSchema, DeliveryCompanySchema, ReturnGoodsFlowLinkSchema } from '../schemas';

/**
 * 배송지 삭제
 * @param {number} id
 * @param {number} shippingId
 */
export const deleteShipping = (id: number, shippingId: number) => {
  return baseApiClient.delete(`/provider/${id}/shipping/${shippingId}`);
};

/**
 * 배송지 리스트 조회
 * @param {number} id: 입점사 번호
 */
export const getShippings = (id: number): Promise<ShippingListSchema> => {
  return baseApiClient.get(`/provider/${id}/shipping`);
};

/**
 * 자동반품 등록 링크
 * - 굿스플로 서비스 이용등록 신청 링크 취득
 * @param {number} id: 배송지 번호
 */
export const getLinkForReturnGoods = (providerId: number, shippingId: number): Promise<ReturnGoodsFlowLinkSchema> => {
  return baseApiClient.get(`/provider/${providerId}/shipping/${shippingId}/goods-flow`);
};

export const postShipping = (id: number, formData: ShippingDetailFieldModel) => {
  const params: ShippingRequestParamModel = toShippingRequestParam(formData);
  return baseApiClient.post(`/provider/${id}/shipping`, params);
};

/**
 * 기본 배송지 적용
 * @param {number} id: 입점사번호
 * @param {number} shippingId: 배송지번호
 */

export const updateShippingDefault = (id: number, shippingId: number) => {
  return baseApiClient.put(`/provider/${id}/shipping/${shippingId}/default-address`);
};

/**
 * 배송지 수정
 * @param id
 * @param shippingId
 * @returns
 */
export const updateShipping = (id: number, formData: ShippingDetailFieldModel) => {
  const { shippingId } = formData;
  const params = toShippingRequestParam(formData);
  return baseApiClient.put(`/provider/${id}/shipping/${shippingId}`, params);
};

/**
 * 택배사 리스트 조회
 */
export const getDeliveryCompany = (): Promise<DeliveryCompanySchema[]> => {
  return baseApiClient.get(`/common/combo/delivery-companies`);
};
