import { QueryState } from '@hooks/useQueryState';
import { GoodsType, LogDomain, OrderCancelType, OrderMemoDomainType, OrderSearchFieldType } from '../constants';
import { ProviderComboModel, ComboMDModel, BrandComboModel } from '../models';

/**
 * 주문 검색 form field
 */
export interface OrderSearchFormField {
  // 주문일 검색범위(시작)
  fromDate: string;
  // 상품타입
  goodsType: string;
  // 검색어
  keyword: string;
  // 주문상태
  orderStepList: Array<boolean>;
  paymentType?: string;
  // 입점사
  provider: ProviderComboModel;
  // md
  md: ComboMDModel;
  // 주문 검색어 타입
  searchType: string;
  // 주문일 검색범위(종료)
  toDate: string;
  // 배송방법
  shippingMethod: string;
  // 브랜드
  brand: BrandComboModel;
}

/**
 * 주문리스트 검색 params
 */
export interface OrderListSearchParams {
  page: string;

  size: string;
  // 주문일 검색범위(시작)
  fromDate: number;
  // 상품타입
  goodsType: GoodsType;
  // 검색어
  keyword: string;
  // 주문상태
  orderStepList: Array<string>;
  // 주문 검색어 타입
  searchType: OrderSearchFieldType;
  // 주문일 검색범위(종료)
  toDate: number;
  // 배송방법
  shippingMethod: string;
  // 입점사 id
  providerId: string;
  // md id
  mdId: string;
  // item
  time: string;
  // brand id
  brandId: string;
  // 출고가능여부
  availableForExport?: string;
}

/**
 * 주문리스트 query state
 */
export interface OrderListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  searchType: string;
  keyword: string;
  fromDate: string;
  toDate: string;
  orderStepList: string;
  goodsType: string;
  shippingMethod: string;
  providerId: string;
  mdId: string;
  time: string;
  brandId: string;
}

export interface ParallelResponse {
  success: boolean;
  message?: string;
}

export interface OrderImage {
  extension: string;
  height: number;
  id: number;
  path: string;
  width: number;
}

/**
 * 주문상세 받는정보 form field
 */
export interface OrderDetailRecipientFormField {
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
  deliveryRequestMessage: string;
  pcccNumber: string;
}

/**
 * 주문 메세지
 */
export interface OrderMessage {
  id: number;
  date: string;
  message: string;
}

/**
 * 주문 반품요청 form field
 */
export interface OrderRequestReturnFormField {
  reasonCode: string;
  reason: string;
  ea: Array<string>;
  returnSender: {
    name: string;
    phone: string;
    postCode: string;
    address: string;
    addressDetail: string;
  };
  returnMethod: string;
  selectedOption: string;
}

/**
 * 주문 취소요청 form field
 */
export interface OrderRequestRefundFormField {
  reasonCode: string;
  reason: string;
  ea: Array<string>;
  cancelType: OrderCancelType;
  providers: Array<string>;
  selectedOption: string;
}

/**
 * 교환 옵션 item
 */
export interface ExchangeOption {
  optionEa: number;
  optionItemIds: Array<string>;
  optionItemEaList: Array<number>;
}

/**
 * 주문 교환요청 form field
 */
export interface OrderRequestExchangeFormField {
  reasonCode: string;
  reason: string;
  returnSender: {
    name: string;
    phone: string;
    postCode: string;
    address: string;
    addressDetail: string;
  };
  returnMethod: string;
  selectedOption: string;
  options: Array<ExchangeOption>;
}

/**
 * 주문 메모 request
 */
export interface OrderMemoRequest {
  orderId: string;
  domain: OrderMemoDomainType;
  subId: string;
}

/**
 * 주문 메모 등록 request
 */
export interface OrderMemoRegistRequest extends OrderMemoRequest {
  message: string;
}

/**
 * 주문 excel item
 */
export interface OrderExcelItem {
  index: number;
  // 주문아이디
  orderId: string;
  // 주문일
  paymentDate: string;
  // 주문자
  ordererName: string;
  // 받는분
  recipientName: string;
  // 결제방법
  paymentTypeName: string;
  // 주문상태
  orderStatus: string;
  // 주문상품
  goodsName: string;
  // 수량
  quantity: string;
}

/**
 * 주문 로그 조회 params
 */
export interface OrderLogParams {
  logDomain: LogDomain;
  orderId: string;
  subId?: string;
}
