import { getSiteType } from '@utils/getSiteType';
import { SiteType } from '@constants/site';
import {
  GoodsShippingPolicy,
  GoodsStatus,
  LimitType as DeliveryCostType,
  GoodsShippingMethod,
  GoodsKind,
  PurchaseLimitedType,
  TicketType,
  SettlementKindType,
  VatCodeType,
} from '@constants/goods';
import { UploadFileInfo } from '@models/UploadModel';
import { DetailNoticeTmplModel } from './DetailNoticeModel';
import { OptionStateModel } from './DetailOptionModel';
import { ProviderModel } from './ProviderModel';
import { BrandModel } from './BrandModel';
import { ComboModel } from './ComboModel';
import { MaxPurchaseLimit, DeliveryType, OptRegisterKinds, GoodsType } from '../constants';
import { MediaFilesReqSchema } from '../schemas';
import { BoolFlagType } from '../types';

export interface ProviderStateModel {
  providerInfo: ProviderModel;
  providerId: number;
  status: GoodsStatus;
  adminMdInfo: ComboModel;
  adminMdId: number;
  adminGoodsManagerInfo: ComboModel;
  adminGoodsManagerId: number;
}

export interface BaseStateModel {
  goodsType: GoodsType;
  name: string;
  brandInfo: BrandModel;
  brandId: number;
  category1: number | string;
  category2: number | string;
  category3: number | string;
  addCategory1: number | string;
  addCategory2: number | string;
  addCategory3: number | string;
  startDateTime: string;
  endDateTime: string | null;
  displayStartDateTime: string;
  alwaysDateTime: boolean;
  sameSalesTime: boolean;
  userMaxPurchaseLimit: MaxPurchaseLimit;
  userMaxPurchaseEa: number;
  // 한정수량
  limitedTypeYn: BoolFlagType;
  limitedType: PurchaseLimitedType;
  limitedGoodsEa: number;
  /** @todo boolan check */
  adultRequiredYn: BoolFlagType;
  prizmOnlyYn: BoolFlagType;
  // 쿠폰사용 설정
  useCouponYn: BoolFlagType;
  keywords: ComboModel[];
  // KC 인증
  kcAuthYn: BoolFlagType;
  kcFileList: UploadFileInfo[];
  // 법적 허가/신고 필수 서류
  certificationList: UploadFileInfo[];
  // 상품 분류
  goodsKind: GoodsKind;
  // 티켓 그룹선택 정보 (티켓연동시에만 가능)
  ticketGroupId?: number;
  // 티켓 선택 정보
  ticketId?: number | string;
  // 선택된 티켓 타입 정보
  ticketTypeId?: TicketType | null;
  // api 시 searchTags (string[])
  searchTags: string;
  // 제품코드
  code: string;
  // 상품 데이터 수집 여부 (매니저 오피스 전용)
  dataCollectYn?: BoolFlagType;
  // 출고명
  partnerExportCode: string;
  // 정산방식 (파트너 오피스는 노출하지 않음, null)
  settlementKind: SettlementKindType | null;
  // 부가세 코드 (파트너 오피스는 노출하지 않음, null)
  vatCode: VatCodeType | null;
  // 카탈로그 수집 여부 (파트너 오피스는 노출하지 않음, null)
  feedConfigList: boolean[] | null;
  // 직접취소가능여부
  cancelableYn: BoolFlagType;
}

export type MediaFilesModel = MediaFilesReqSchema;

export interface MediaStateModel {
  primaryImageFileId: number;
  imageFileIds: number[];
  description: string;
  subMediaFiles?: MediaFilesModel[];
  // 상품 상세 콘텐츠
  components: MediaFilesModel[];
}
export interface NoticeStateModel {
  noticeType: number | string;
  noticeTemplates: DetailNoticeTmplModel[];
}

export interface DeliveryStateModel {
  deliveryType: DeliveryType;
  deliveryTypeOtherDay: number;
  deliveryTodayEndTime: string;
  isPcccRequired: BoolFlagType;
  // 묶음 배송 적용 (묶음, 개별)
  shippingPolicy: GoodsShippingPolicy;
  // 배송 방법
  shippingMethod: GoodsShippingMethod;
  // 배송 정책
  goodsShippingPolicy: DeliveryCostType;
  providerShippingId: number | string;
  unLimitShippingPrice: number;
  ifpayCost: number;
  ifpayFreePrice: number;
  limitShippingPrice: number;
  limitShippingEa: number;
}

export type StateModel = ProviderStateModel &
  BaseStateModel &
  OptionStateModel &
  MediaStateModel &
  NoticeStateModel &
  DeliveryStateModel;

/**
 * State
 */
const siteType = getSiteType();
const isManagerSite = siteType === SiteType.MANAGER;

/** 입점사 정보 */
const providerState: ProviderStateModel = {
  // 선택한 입점사 정보
  providerInfo: null,
  // 입점사 ID
  providerId: null,
  // 상품 상태
  status: GoodsStatus.NORMAL,
  // md Info
  adminMdInfo: null,
  adminMdId: null,
  // 담당자 Info
  adminGoodsManagerInfo: null,
  adminGoodsManagerId: null,
};

/** 기본정보 */
const baseState: BaseStateModel = {
  // 상품 유형
  goodsType: GoodsType.NORMAL,

  // 상품명
  name: '',

  // 선택한 브랜드 정보
  brandInfo: null,
  // 브랜드 ID
  brandId: null,

  // 카테고리 (number)
  category1: '',
  category2: '',
  category3: '',

  // 추가 카테고리 (211126 hide - 빈값으로만 우선 진행 #FE-512)
  addCategory1: '',
  addCategory2: '',
  addCategory3: '',

  // salesPeriod: 판매기간
  startDateTime: '', // 판매 시작일
  endDateTime: '', // 판매 종료일
  displayStartDateTime: '', // 전시 시작일 설정
  alwaysDateTime: false,
  sameSalesTime: false,

  // purchaseInfo: 유저당 최대 구매 수량 (LIMIT/UNLIMIT)
  userMaxPurchaseLimit: MaxPurchaseLimit.UNLIMIT,
  // 유저당 최대 구매 수량 (userMaxPurchaseLimit - LIMIT 일경우)
  userMaxPurchaseEa: 0,

  // 한정수량
  limitedTypeYn: 'N',
  limitedType: PurchaseLimitedType.NONE,
  // 한정수량 수량 (GOODS 빼고는 null)
  limitedGoodsEa: 0,

  // 성인 인증 필수상품 여부
  /** @todo boolean 값 적용 */
  adultRequiredYn: 'N',

  // 자사 단독판매 상품 여부
  prizmOnlyYn: 'N',

  // 쿠폰사용 설정
  useCouponYn: 'Y',

  // keywords
  keywords: [],

  // KC 인증
  kcAuthYn: 'N',

  // KC 인증 파일 ID
  kcFileList: [],

  // 법적 허가/신고 필수 서류
  certificationList: [],

  // 상품 분류
  goodsKind: GoodsKind.REAL,

  // 검색 태그
  searchTags: '',

  // 선택된 티켓 정보
  ticketTypeId: null,

  // 선택된 티켓 아이디
  ticketId: '',

  // 제품코드
  code: '',

  // 상품 데이터 수집 여부 (매니저 오피스 전용)
  dataCollectYn: 'N',

  // 출고명
  partnerExportCode: '',

  // 정산 방식
  settlementKind: isManagerSite ? SettlementKindType.COMMISSION : null,

  // 부가세 코드 등록
  vatCode: null,

  // 카탈로그 수집 여부
  feedConfigList: isManagerSite ? [true, true, true] : null,

  // 직접취소가능여부
  cancelableYn: 'Y',
};

/** 옵션정보 */
const optionState: OptionStateModel = {
  // 상품등록 모드
  optionRegister: OptRegisterKinds.PROGRESS,
  // 옵션상품 등록시 옵션 입력 정보
  optionBases: [
    /* {
      title: 'aaa',
      value: 'bbb',
    }, */
  ], // { title: '', value: ''}

  // 옵션 리스트
  optionLists: [
    /* {
      consumerPrice: 0,
      discountRate: 0,
      idx: 0,
      id: 'custom0',
      option1: 'bbb',
      price: 0,
      stock: 0,
      commissionRate: 0,
    }, */
  ],
  // 옵션상품 등록시 옵션 입력 갯수
  optionsLen: '',
  // 옵션 타이틀
  optionTitles: [],
};

/** 상품 등록 컨텐츠 */
const mediaState: MediaStateModel = {
  // 대표 이미지 (실제 Dom에서 Control 되지 않음)
  primaryImageFileId: null,
  // 이미지 파일 ID (실제 Dom에서 Control 되지 않음)
  imageFileIds: [],
  description: '',
  subMediaFiles: [],
  // 상품 상세 콘텐츠
  components: [],
};

/** 상품정보제공고시 */
const noticeState: NoticeStateModel = {
  // informationList
  // 선택된 상품군 (number)
  noticeType: '',
  // 상품군 Templates
  noticeTemplates: [],
};

/** 배송정보 */
const deliveryState: DeliveryStateModel = {
  // 배송 유형
  deliveryType: DeliveryType.TODAY,
  // 배송유형이 예외발송일때 날짜 일수
  deliveryTypeOtherDay: 0,
  // 당일발송 마감시간
  deliveryTodayEndTime: '',
  // 개인통관 고유 번호
  isPcccRequired: 'N',
  // 묶음 배송 적용 (적용, 미적용)
  shippingPolicy: GoodsShippingPolicy.SHOP,
  // 배송 방법
  shippingMethod: GoodsShippingMethod.PARCEL,
  // 배송 정책 ID 번호
  providerShippingId: '',
  // 배송 Cost Type
  unLimitShippingPrice: 0,
  ifpayCost: 0,
  ifpayFreePrice: 0,
  limitShippingPrice: 0,
  limitShippingEa: 0,
  goodsShippingPolicy: null,
};

export const initialState = {
  ...providerState,
  ...baseState,
  ...optionState,
  ...mediaState,
  ...noticeState,
  ...deliveryState,
};
