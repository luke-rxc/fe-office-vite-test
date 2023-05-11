import {
  LimitType as DeliveryCostType,
  GoodsShippingPolicy,
  GoodsShippingMethod,
  GoodsStatus,
  GoodsKind,
  PurchaseLimitedType,
  SettlementKindType,
  VatCodeType,
} from '@constants/goods';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadSchema } from '@schemas/UploadSchema';
import { GoodsSearchTagSchema } from '@schemas/GoodsSchema';
import type { VideoPlayType } from '@services/useFileUploader';
import { CategorySelectItemSchema } from './CategorySchema';
import { MaxPurchaseLimit, GoodsType, FileType, GoodsRequestStatus } from '../constants';
import { OptListSchema, OptSubmitReqParamSchema } from './DetailOptionSchema';
import { ComboListSchema } from './ComboSchema';
import { TicketResponseType } from './TicketSchema';

interface DeliveryPolicySchema {
  deliveryExportingDelays: number;
  deliveryTodayEndTime: string;
}

interface InformationListSchema {
  contents: string;
  title: string;
  sortNumber: number;
  id?: number;
}

interface PurchaseSchema {
  // 1인당 구매제한수량
  userMaxPurchaseLimit: MaxPurchaseLimit;
  userMaxPurchaseEa?: number;
  // 한정수량
  limitedType: PurchaseLimitedType;
  limitedGoodsEa: number | null;
}

interface SalesPeriodRequestSchema {
  startDateTime: string;
  displayStartDateTime: string;
  endDateTime: string;
}

/** @todo request, response 맞춤 */
interface SalesPeriodSchema {
  salesStartDate: number;
  displayStartDate: number;
  salesEndDate: number | null;
}

interface ShippingSchema {
  shippingPolicy: GoodsShippingPolicy;
  shippingMethod: GoodsShippingMethod;
  goodsShippingPolicy: DeliveryCostType;
  unLimitShippingPrice?: number;
  ifpayCost?: number;
  ifpayFreePrice?: number;
  limitShippingPrice?: number;
  limitShippingEa?: number;
}

interface ImageSchema {
  id: number;
  path: string;
  extension: string;
  width: number;
  height: number;
}

export interface FeedConfigSchema {
  facebook: boolean;
  google: boolean;
  naver: boolean;
}

export interface TicketResSchema {
  id: number;
  name: string;
  channel: string;
  period: string;
  type: TicketResponseType;
  groupId: number | null;
}

export interface MediaFilesReqSchema {
  id: number;
  type: FileType;
  videoPlayType: VideoPlayType | null;
}

export interface SubmitReqSchema {
  adminMdId: number;
  adminGoodsManagerId: number;
  brandId: number;
  description: string;
  primaryCategoryId: number;
  primaryImageFileId: number;
  providerId: number;
  providerShippingId: number;
  categoryIds: number[];
  // imageFileIds: number[];
  files: MediaFilesReqSchema[];
  components: MediaFilesReqSchema[];
  isAdultRequired: boolean;
  isPrizmOnly: boolean;
  isUseCoupon: boolean;
  isPcccRequired: boolean;
  name: string;
  informationList: InformationListSchema[];
  deliveryPolicy: DeliveryPolicySchema;
  purchaseInfo: PurchaseSchema;
  salesPeriod: SalesPeriodRequestSchema;
  shippingInfo: ShippingSchema;
  // 수정시에만 보낸다
  status?: GoodsStatus;
  goodsType: GoodsType;
  // keyword
  keywordIds: number[];
  // kc 인증 파일 첨부
  kcIds: number[];
  // 법적 허가/신고 필수 서류
  certificationIds: number[];
  // 상품 분류
  goodsKind: GoodsKind;
  // 티켓 선택 정보 (등록시에만 진행)
  ticketId?: number;
  // 검색 태그
  searchTags: string[];
  // 제품코드
  code: string;
  // 상품 데이터 수집 여부 (매니저 오피스 전용, 파트너는 무조건 false로 보냄)
  isDataCollect: boolean;
  // 출고명
  partnerExportCode: string | null;
  // 정산방식 (파트너 오피스는 노출하지 않음, null)
  settlementKind: SettlementKindType | null;
  // 부가세 코드 (파트너 오피스는 노출하지 않음, null)
  vatCode: VatCodeType | null;
  // 카탈로그 수집 여부
  feedConfig: FeedConfigSchema | null;
  // 직접취소가능여부
  isCancelable: boolean;
}

export interface MediaFileSchema {
  file: UploadSchema;
  videoPlayType: MediaFilesReqSchema['videoPlayType'];
}

/**
 * 상품 조회 Schema
 */
export interface GoodsInfoResSchema {
  id: number;
  name: string;
  brandId: number;
  brandName: string;
  providerId: number;
  providerName: string;
  commissionRate: number;
  description: string;
  status: GoodsStatus;
  purchase: PurchaseSchema;
  shipping: ShippingSchema;
  optionTitles: string[];
  options: OptListSchema[];
  categories: CategorySelectItemSchema[];
  primaryImage: ImageSchema;
  files: MediaFileSchema[];
  components: MediaFileSchema[];
  informationList: InformationListSchema[];
  deliveryPolicy: DeliveryPolicySchema;
  displayPeriod: SalesPeriodSchema;
  providerShippingId: number;
  adminUserId: number;
  adminMdId: number;
  adminGoodsManagerId: number;
  isAdultRequired: boolean;
  isPrizmOnly: boolean;
  isUseCoupon: boolean;
  isOptionUse: boolean;
  isPcccRequired: boolean;
  /** 검색태그 */
  searchTags: GoodsSearchTagSchema[];
  goodsType: GoodsType;
  keyword: ComboListSchema[] | null;
  kcFileList: UploadFileInfo[];
  certificationList: UploadFileInfo[];
  goodsKind: GoodsKind;
  ticket: TicketResSchema | null;
  /** 파트너 상품 검수 승인 상태 */
  requestStatus: GoodsRequestStatus;
  /** 파트너 상품 요청 ID */
  requestId: number | null;
  // 제품코드
  code: string | null;
  // 상품 데이터 수집 여부 (매니저 오피스 전용, 파트너에서는 무조건 false)
  isDataCollect: boolean;
  // 출고명
  partnerExportCode: string | null;
  // 정산방식 (파트너 오피스는 노출하지 않음, null)
  settlementKind: SettlementKindType | null;
  // 부가세 코드 (파트너 오피스는 노출하지 않음, null)
  vatCode: VatCodeType | null;
  // 카탈로그 수집 여부
  feedConfig: FeedConfigSchema | null;
  // 직접취소가능여부
  isCancelable: boolean;
}

/**
 * 요청(판매,수정)에 대한 로그 Schema
 */
export interface GoodsRequestLogInfoSchema {
  id: number;
  domain: string;
  domainPrimaryId: number;
  domainSubId: number | null;
  message: string;
  userId: number;
  email: string;
  name: string;
  requestJson: string;
  origin: string;
  originName: string;
  createdDateTime: number;
}
export interface GoodsRequestLogSchema {
  logs: GoodsRequestLogInfoSchema[];
}

/**
 * 파트너 등록 Schema
 */
export interface PartnerSubmitReqSchema {
  goods: SubmitReqSchema;
  goodsOption: OptSubmitReqParamSchema;
}

/**
 * 파트너 수정 Schema
 */
export interface PartnerModifySubmitReqSchema extends PartnerSubmitReqSchema {
  requestMemo: string;
}
