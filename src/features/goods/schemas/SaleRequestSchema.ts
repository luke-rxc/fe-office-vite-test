import { UploadSchema } from '@schemas/UploadSchema';
import { MaxPurchaseLimit } from '../constants';

/** 요청, request(승인요청, 수정요청), response(반려) 공통 */
/** 요청상태 */
interface FeedbackStatusSchema {
  /** 타입 */
  name: string;
  /** 타입 value (한글) */
  value: string;
}
/** admin */
interface FeedbackAdminSchema {
  id: number;
  principalType: 'MANAGER' | 'PARTNER';
  name: string;
  companyName: string;
  partName: string;
  cellPhoneNumber: string;
}
/** request(승인요청, 수정요청), response(반려) 공통 */
interface FeedbackCommonSchema {
  /** 상태 */
  status: FeedbackStatusSchema;
  /** memo */
  memo: string | null;
  /** admin */
  admin: FeedbackAdminSchema;
  /** 요청 날짜 */
  date: number;
}

interface SaleRequestListCommonSchema {
  /** 요청 번호 */
  requestId: number;
  /** 상품 아이디 */
  goodsId: number;
  /** 상품 이름 */
  goodsName: string;
  /** 브랜드 이름 */
  brandName: string;
  /** 피드백 prop, 요청상태에 따라 request(승인요청, 수정요청), response(반려)로 나누어짐 */
  request: FeedbackCommonSchema;
}

/**********************************************
 * 승인요청
 **********************************************/
export interface SaleRequestListSchema extends SaleRequestListCommonSchema {
  /** description */
  description: string;
  /** 대표 이미지 */
  primaryImage: UploadSchema;
  /** 전시 시작일 */
  displayStartDate: number;
  /** 판매 시작일 */
  saleStartDate: number;
  /** 판매 종료일 */
  saleEndDate: number | null;
  /** 1인당 최대 구매수량 제한 타입 */
  userMaxPurchaseLimit: MaxPurchaseLimit;
  /** 1인당 최대 구매수량 */
  userMaxPurchaseEa: number;
}

/**********************************************
 * 반려
 **********************************************/
export interface SaleRequestRejectListSchema extends SaleRequestListSchema {
  response: FeedbackCommonSchema;
}

/**********************************************
 * 수정요청
 **********************************************/
interface SalesPeriodSchema {
  /** (기존)판매 시작일 */
  fromStartDate: number;
  /** (기존)판매 종료일 */
  fromEndDate: number | null;
  /** (현재)판매 시작일 */
  toStartDate: number;
  /** (현재)판매 종료일 */
  toEndDate: number | null;
  /** 판매 시작일 변경여부 */
  changeStart: boolean;
  /** 판매 종료일 변경여부*/
  changeEnd: boolean;
}

interface PurchaseEaSchema {
  /** (기존)제한수량 */
  fromUserMaxEa: number | null;
  /** (기존)제한수량 타입 */
  fromUserMaxLimit: MaxPurchaseLimit;
  /** (변경)제한수량 */
  toUserMaxEa: number | null;
  /** (변경)제한수량 타입 */
  toUserMaxLimit: MaxPurchaseLimit;
  /** 제한수량 변경여부 */
  changeUserMaxEa: boolean;
}

export interface SaleRequestModifyListSchema extends SaleRequestListCommonSchema {
  /** 상품 판매 상태 */
  goodsStatus: string;
  /** 판매 일정 */
  salesPeriod: SalesPeriodSchema;
  /** 제한수량 */
  purchaseEa: PurchaseEaSchema;
}

/**********************************************
 * 옵션 정보
 **********************************************/
export interface SaleRequestOptionSchema {
  /** 변경 상태, NONE, CHANGE, NEW */
  status: string;
  /** 옵션 아이디 */
  optionId: number | null;
  /** 옵션 이름 */
  optionName: string;
  /** 정상가 */
  consumerPrice: number;
  /** 판매가 */
  price: number;
  /** 재고수량 */
  stock: number;
  /** 수수료율 */
  commissionRate: number;
  /** (변경) 정상가 */
  toConsumerPrice: number;
  /** (변경) 판매가 */
  toPrice: number;
  /** 기본 옵션 여부 */
  defaultOption: boolean;
}

export interface SaleRequestOptionInfoSchema {
  /** 갯수 */
  size: number;
  /** 옵션 타이틀 */
  optionTitles: string[];
  /** 옵션 정보 */
  options: SaleRequestOptionSchema[];
}
