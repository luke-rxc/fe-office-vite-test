import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { CouponCopySchema, CouponEventUploadSchema, CouponItemSchema, CouponSchema } from '../schemas';
import { CouponActiveParams, CouponListSearchParams, CouponRequestParams, EventCouponUploadParams } from '../types';

/**
 * 쿠폰 리스트 조회
 */
export const getCoupons = (params: CouponListSearchParams): Promise<PaginationResponse<CouponSchema>> => {
  return baseApiClient.get<PaginationResponse<CouponSchema>>('/coupons', params);
};

/**
 * 쿠폰 등록
 */
export const registCouponItem = (params: CouponRequestParams): Promise<CouponSchema> => {
  return baseApiClient.post<CouponSchema>('/coupons', params);
};

/**
 * 쿠폰 적용대상에 해당되는 상품 확인
 */
export const checkExistGoods = (params: CouponRequestParams['usePolicyRequest']): Promise<boolean> => {
  return baseApiClient.post<boolean>('/coupons/is-exist-goods', params);
};

/**
 * 쿠폰 조회
 */
export const getCouponItem = (couponId: number): Promise<CouponItemSchema> => {
  return baseApiClient.get<CouponItemSchema>(`/coupons/${couponId}`);
};

/**
 * 쿠폰 수정
 */
export const modifyCouponItem = (couponId: number, params: CouponRequestParams): Promise<CouponSchema> => {
  return baseApiClient.put<CouponSchema>(`/coupons/${couponId}`, params);
};

/**
 * 쿠폰 활성화/비활성화
 */
export const toggleActiveCouponItem = ({ couponId, isActive }: CouponActiveParams): Promise<void> => {
  return baseApiClient.put<void>(`/coupons/${couponId}/active/${isActive.toString()}`);
};

/**
 * 쿠폰 삭제
 */
export const deleteCouponItem = (couponId: number): Promise<void> => {
  return baseApiClient.delete<void>(`/coupons/${couponId}`);
};

/**
 * 이벤트 쿠폰 업로드
 */
export const postUploadEventCoupon = ({
  couponId,
  ...params
}: EventCouponUploadParams): Promise<CouponEventUploadSchema> => {
  return baseApiClient.post<CouponEventUploadSchema>(`/coupons/${couponId}/users`, params);
};

/**
 * 쿠폰 복사
 */
export const postCopyCouponItem = (couponId: number): Promise<CouponCopySchema> => {
  return baseApiClient.post<CouponCopySchema>(`/coupons/${couponId}/copy`);
};
