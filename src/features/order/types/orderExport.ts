import { QueryState } from '@hooks/useQueryState';
import { OrderSearchFieldType } from '../constants';
import { ProviderComboModel, ComboMDModel, ComboDeliveryCompanyModel } from '../models';

/**
 * 출고리스트 검색 form field
 */
export interface OrderExportSearchFormField {
  // 출고일 검색범위(시작)
  fromDate: string;
  // 검색어
  keyword: string;
  // 출고상태
  exportStatusList: Array<boolean>;
  provider: ProviderComboModel;
  md: ComboMDModel;
  // 주문 검색어 타입
  searchType: string;
  // 출고일 검색범위(종료)
  toDate: string;
  // 구매확정 필터 여부
  purchaseConfirmYN: boolean;
}

/**
 * 출고리스트 검색 params
 */
export interface OrderExportListSearchParams {
  page: string;
  size: string;
  // 주문일 검색범위(시작)
  fromDate: number;
  // 검색어
  keyword: string;
  // 주문상태
  exportStatusList: Array<string>;
  // 주문 검색어 타입
  searchType: OrderSearchFieldType;
  // 주문일 검색범위(종료)
  toDate: number;
  // 입점사 id
  providerId: string;
  // md id
  mdId: string;
  time: string;
  purchaseConfirmYN: string;
}

/**
 * 출고리스트 query state
 */
export interface OrderExportListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  searchType: string;
  keyword: string;
  fromDate: string;
  toDate: string;
  exportStatusList: string;
  providerId: string;
  mdId: string;
  time: string;
  purchaseConfirmYN: string;
}

/**
 * 주문 출고 excel item schema
 */
export interface OrderExportExcelItem {
  index: number;
  amount: string;
  consumerPrice: string;
  deliveryRequestMessage: string;
  ea: string;
  email: string;
  goodsName: string;
  goodsOptionId: number;
  goodsOptionName: string;
  orderId: string;
  orderItemOptionId: string;
  orderStep: string;
  paymentDate: string;
  pcccNumber: string;
  phone: string;
  price: string;
  partnerExportCode: string;
  recipientAddress: string;
  recipientAddressDetail: string;
  recipientPhone: string;
  recipientPostCode: string;
  recipientUserName: string;
  shippingCost: string;
  shippingId: string;
  shippingMethod: string;
  userName: string;
  deliveryCompanyName: string;
  deliveryNumber: string;
  exportEa: string;
}

/**
 * 출고 등록 upload option params
 */
export interface OrderExportUploadOptionParams {
  deliveryCompanyName: string;
  deliveryNumber: string;
  exportEa: number;
  orderId: number;
  orderItemOptionId: number;
  orderShippingId: number;
  shippingMethod: string;
}

/**
 * 출고 운송정보 form field
 */
export interface OrderExportDeliveryInfoFormField {
  deliveryCompany: ComboDeliveryCompanyModel;
  deliveryNumber: string;
}

/**
 * 출고 운송정보 params
 */
export interface OrderExportDeliveryInfoParams {
  exportId: string;
  deliveryCompanyCode: string;
  deliveryNumber: string;
}

/**
 * 출고 excel item schema
 */
export interface OrderExportExcelItem {
  index: number;
  // 출고번호
  id: string;
  // 주문아이디
  orderId: string;
  // 상품명
  goodsName: string;
  // 수량
  quantity: string;
  // 받는사람 이름
  recipientName: string;
  // 배송업체
  deliveryCompany: string;
  // 운송장번호
  deliveryNumber: string;
  // 출고일
  exportedDate: string;
  // 배송시작일
  inShippingDate: string;
  // 배송종료일
  completeDate: string;
  // 구매확정일
  confirmDate: string;
  // 출고상태
  exportStatus: string;
}
