import { CouponIssuePeriodType, CouponCostType, CouponIssueType, CouponUseType } from '../constants';

/**
 * Coupon Display Image Schema
 */
export interface CouponDisplayImageSchema {
  createDateTime: {
    createdDate: string;
  };
  delete: boolean;
  domainType: 'BRAND'; //%%
  fileSize: number;
  fileType: 'ETC'; //%%
  height: number;
  id: number;
  originalFileName: string;
  path: string;
  width: number;
}

/**
 * Coupon Display Schema
 */
export interface CouponDisplaySchema {
  /**
   * 유저향 전시용 쿠폰명
   */
  name: string;
  /**
   * 유저용 전시용 상세
   */
  contents: string;
  /**
   * 전시용 이미지
   */
  image: CouponDisplayImageSchema;
}

/**
 * Coupon Issue Period Schema
 */
export interface CouponIssuePeriodSchema {
  /**
   * period(기간),  day(다운로드후 몇일간)
   */
  issuePeriodType: CouponIssuePeriodType;
  /**
   *  period 일경우 시작 dateTime
   */
  startDateTime: number;
  /**
   *  period 일경우 사용 만료 일시
   */
  expiredDateTime: number;
  /**
   * after_day 일경우 다운로드후 사용가능기간
   */
  downloadAfterDay: number;
}

/**
 * Coupon Sale Policy Schema
 */
export interface CouponSalePolicySchema {
  /**
   * 지불타입 (원, 퍼센트)
   */
  costType: CouponCostType;
  /**
   * 퍼센트 단위
   */
  percentRate: number;
  /**
   * 고정값 일 경우 할인 금액
   */
  fixedPrice: number;
  /**
   * 최대 할인 금액
   */
  limitMaxSalePrice: number;
  /**
   * 최소 구매금액
   */
  limitMinPurchasePrice: number;
  /**
   * 정책 화면표시 정보
   */
  displayText: string;
}

/**
 * Coupon Download Policy Schema
 */
export interface CouponDownloadPolicySchema {
  /**
   * 발급형태
   */
  issueType: CouponIssueType;
  /**
   * 특정 코드(단어)를 입력하여 쿠폰 다운로드 받기위한 필드
   */
  keyword: string;
  /**
   * 시작일
   */
  startDateTime: number;
  /**
   * 종료일
   */
  endDateTime: number;
  /**
   * 다운로드 제한갯수(0 : 무제한(default),  1 ~ 제한처리 (선착순개념))
   */
  limitEaAll: number;
  /**
   * 유저당 다운로드 제한갯수
   */
  limitEaPerUser: number;
  /**
   * 쇼룸ID
   */
  showRoomId: number | null;
}

/**
 * Coupon Issue Schema
 */
export interface CouponIssueStatSchema {
  /**
   * 총 발급 갯수
   */
  totalIssueCount: number;
  /**
   * 총 사용 갯수
   */
  totalUseCount: number;
}

/**
 * Coupon Schema
 */
export interface CouponSchema {
  id: number;
  useType: CouponUseType;
  name: string;
  display: CouponDisplaySchema;
  issuePeriod: CouponIssuePeriodSchema;
  salePolicy: CouponSalePolicySchema;
  downloadPolicy: CouponDownloadPolicySchema;
  issuedStat: CouponIssueStatSchema;
  createdDate: number;
  isActive: boolean;
}

/**
 * Coupon 허용정책 item schema
 */
export interface CouponUseAllowPolicyItemSchema {
  id: number;
  name: string;
}

/**
 * Coupon 허용정책 카테고리 item schema
 */
export interface CouponUseAllowPolicyCategoryItemSchema {
  id: number;
  name: Array<string>;
}

/**
 * Coupon 허용정책 schema
 */
export interface CouponUseAllowPolicySchema {
  allowBrands: Array<CouponUseAllowPolicyItemSchema>;
  allowCategories: Array<CouponUseAllowPolicyCategoryItemSchema>;
  allowGoods: Array<CouponUseAllowPolicyItemSchema>;
  allowProviders: Array<CouponUseAllowPolicyItemSchema>;
  denyGoods: Array<CouponUseAllowPolicyItemSchema>;
  isAllowAll: boolean;
}

/**
 * Coupon Item schema
 */
export interface CouponItemSchema {
  display: CouponDisplaySchema;
  downloadPolicy: CouponDownloadPolicySchema;
  isActive: boolean;
  issuePeriod: CouponIssuePeriodSchema;
  name: string;
  providerChargeRate: number;
  salePolicy: CouponSalePolicySchema;
  useAllowPolicy: CouponUseAllowPolicySchema;
  useType: string;
}

/**
 * Coupon event upload schema
 */
export interface CouponEventUploadSchema {
  insertedCount: number;
  errorMessages: Array<{
    userId: number;
    message: string;
  }>;
}

/**
 * Coupon 복사 schema
 */
export interface CouponCopySchema {
  id: number;
  name: string;
}
