import { QueryState } from '@hooks/useQueryState';
import { BaseSyntheticEvent, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  AllowItemType,
  AllowType,
  CouponCostType,
  CouponIssuePeriodType,
  CouponIssueType,
  CouponUseType,
} from '../constants';
import { BrandComboModel, CouponUseAllowPolicyModel, ShowroomComboItemModel } from '../models';

export interface CouponListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  name: string;
}

export interface CouponListFormValue {
  name: string;
}

export interface CouponFormProps<T> {
  formMethod: UseFormReturn<T>;
  handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown>) => Promise<void>;
  handleReset: () => void;
}

/**
 * 쿠폰 form field
 */ export interface CouponFormField {
  // 관리자용 쿠폰설명
  name: string;
  providerChargeRate: string;
  display: {
    // 쿠폰명
    name: string;
    // 쿠폰설명
    contents: string;
    // image id
    imageId: string;
  };
  downloadPolicy: {
    // 쿠폰 발급방법
    issueType: string;
    // 키워드 쿠폰
    keyword: string;
    // 쿠폰 발급갯수 제한여부
    useLimitEa: string;
    // 쿠폰 발급갯수 제한
    limitEaAll: string;
    // 쿠폰 노출 시작일
    startDateTime: Date;
    // 쿠폰 노출 종료일
    endDateTime: Date;
    // 쇼룸ID
    showRoomId: ShowroomComboItemModel;
  };
  issuePeriod: {
    // 쿠폰 유효기간 타입
    issuePeriodType: string;
    // 쿠폰 발급일로부터 유효기간
    downloadAfterDay: string;
    // 쿠폰 유효기간 시작일
    startDateTime: Date;
    // 쿠폰 유효기간 종료일
    expiredDateTime: Date;
  };
  salePolicy: {
    // 최소주문금액
    limitMinPurchasePrice: string;
    // 최소주문금액 유무
    useLimitMinPurchasePrice: string;
    // 할인 value (costType - PERCENT: percentRate, WON: fixedPrice)
    value: string;
    // 최대 할인금액
    limitMaxSalePrice: string;
    // 할인단위(원, %)
    costType: string;
  };
  usePolicyRequest: {
    isAllowAll: string;
  };
  // 쿠폰 적용타입
  useType: string;
}

/**
 * Tab item
 */
export interface TabItem {
  label: string;
  value: string | number;
  children: ReactNode;
}

/**
 * 카테고리 form field
 */
export interface CategoriesFormField {
  rootCategory: string;
  subCategory: string;
  lastCategory: string;
}

/**
 * 입점사 form field
 */
export interface SearchFormField {
  keyword: string;
}

/**
 * 상품 검색 form field
 */
export interface SearchGoodsFormField {
  searchType: string;
  value: string;
}

/**
 * 브랜드 form field
 */
export interface BrandFormField {
  brand: BrandComboModel;
}

/**
 * 쿠폰 허용 item
 */
export interface CouponAllowItem {
  id: number;
  text: string;
}

/**
 * AllowAllInfo 쿠폰적용 여부 관련 interface
 */
export interface AllowAllInfo {
  isAllowAll: AllowType;
  handleUpdateAllowAll: (allowType: AllowType) => void;
}

/**
 * PolicyInfo 쿠폰정책 관련 interface
 */
export interface PolicyInfo {
  allowCategories: Array<CouponAllowItem>;
  allowProviders: Array<CouponAllowItem>;
  allowGoods: Array<CouponAllowItem>;
  allowBrands: Array<CouponAllowItem>;
  denyGoods: Array<CouponAllowItem>;
  handleUpdateAllowItem: (type: AllowItemType, items: Array<CouponAllowItem>) => void;
  handleRemoteAllowItem: (type: AllowItemType, id: number) => void;
  handleRemoveAllAllowItem: () => void;
  handleUpdateAllAllowItem: (item: Omit<CouponUseAllowPolicyModel, 'isAllowAll'>) => void;
}

/**
 * 쿠폰 등록/수정 request param
 */
export interface CouponRequestParams {
  name: string;
  providerChargeRate: number;
  useType: CouponUseType;
  display: {
    contents: string;
    imageId: number;
    name: string;
  };
  downloadPolicy: {
    endDateTime: number;
    issueType: CouponIssueType;
    keyword: string;
    limitEaAll: number;
    limitEaPerUser: number;
    startDateTime: number;
    showRoomId: number;
  };
  issuePeriod: {
    downloadAfterDay: number;
    expiredDateTime: number;
    issuePeriodType: CouponIssuePeriodType;
    startDateTime: number;
  };
  salePolicy: {
    costType: CouponCostType;
    fixedPrice: number;
    limitMaxSalePrice: number;
    limitMinPurchasePrice: number;
    percentRate: number;
  };
  usePolicyRequest: {
    allowBrandIds: Array<number>;
    allowCategoryIds: Array<number>;
    allowGoodsIds: Array<number>;
    allowProviderIds: Array<number>;
    denyGoodsIds: Array<number>;
    isAllowAll: boolean;
  };
}

/**
 * 쿠폰 활성화/비활성화 params
 */
export interface CouponActiveParams {
  couponId: number;
  isActive: boolean;
}

/**
 * 쿠폰 excel upload item
 */
export interface CouponExcelUploadItem {
  userId: string;
}

/**
 * 이벤트 쿠폰 업로드 params
 */
export interface EventCouponUploadParams {
  couponId: number;
  userIds: Array<string>;
}

/**
 * 상품 검색 requestParams
 */
export interface SearchGoodsRequestParams {
  name: string;
  goodsIds: Array<string>;
}

/**
 * 상품리스트 검색 params
 */
export interface CouponListSearchParams {
  size: string;
  page: string;
  sort: string;
  name: string;
}
