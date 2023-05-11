import {
  GoodsShippingPolicy,
  GoodsShippingPolicyLabel,
  GoodsStatus,
  GoodsStatusLabel,
  GoodsShippingMethod,
  GoodsShippingMethodLabel,
  PurchaseLimitedType,
  PurchaseLimitedTypeLabel,
  SettlementKindType,
  SettlementKindTypeLabel,
  VatCodeType,
  VatCodeTypeLabel,
} from '@constants/goods';
import type { VideoPlayType } from '@services/useFileUploader';

// Tab Info
export const DetailTabType = {
  PROVIDER: 'provider',
  BASE: 'base',
  OPTION: 'option',
  NOTICE: 'notice',
  MEDIA: 'media',
  DELIVERY: 'delivery',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DetailTabType = ValueOf<typeof DetailTabType>;

export const DetailTabs = [
  {
    label: '입점사/담당자정보',
    value: DetailTabType.PROVIDER,
  },
  {
    label: '기본정보',
    value: DetailTabType.BASE,
  },
  {
    label: '옵션정보',
    value: DetailTabType.OPTION,
  },
  {
    label: '상품정보제공고시',
    value: DetailTabType.NOTICE,
  },
  {
    label: '컨텐츠정보(대표/상세)',
    value: DetailTabType.MEDIA,
  },
  {
    label: '배송정보',
    value: DetailTabType.DELIVERY,
  },
] as const;

export const PartnerDetailTabs = DetailTabs.slice(1);

// 카테고리 Value-key
// 메인 카테고리(필수)
export const DetailBaseCategoryFieldKeys = ['category1', 'category2', 'category3'];
// 추가 카테고리(비필수, 211126 hide #FE-512)
export const DetailAddCategoryFieldKeys = ['addCategory1', 'addCategory2', 'addCategory3'];

// 섹션 타이틀의 width 값
export const DetailListTitleWidth = {
  provider: 150,
  base: 250,
  delivery: 200,
  deliveryPolicy: 220,
};

// 입점사 > 입점사 정보
// 판매 상태
export const DetailSaleStatusOptions = [
  { label: GoodsStatusLabel.NORMAL, value: GoodsStatus.NORMAL },
  { label: GoodsStatusLabel.UNSOLD, value: GoodsStatus.UNSOLD },
  { label: GoodsStatusLabel.RUNOUT, value: GoodsStatus.RUNOUT },
];

// 상품명 등록 글자 최대시
export const GoodsNameMaxLength = 50;

// 파일 타입
export const FileType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FileType = ValueOf<typeof FileType>;

// 한정 수향
export const PurchaseLimitedTypeOptions = [
  { label: PurchaseLimitedTypeLabel.GOODS, value: PurchaseLimitedType.GOODS },
  { label: PurchaseLimitedTypeLabel.OPTION, value: PurchaseLimitedType.OPTION },
];

// Boolean 형태의 Y, N 옵션
export const BooleanOptions = [
  { label: 'N', value: 'N' },
  { label: 'Y', value: 'Y' },
];

// 상품 등록 추가 이미지 최대개수
export const AddImageUploadMax = 9;

// 일괄수정
export const OptBatches = [
  { title: '정상가', fieldName: 'consumerPrice' },
  { title: '판매가', fieldName: 'price' },
  { title: '입금가', fieldName: 'depositPrice' },
  { title: '재고수량', fieldName: 'stock' },
] as const;

// 배송 유형
export const DeliveryType = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  OTHER: 'other',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DeliveryType = ValueOf<typeof DeliveryType>;

export const DeliveryTypeOptions = [
  { label: '당일발송', value: DeliveryType.TODAY },
  { label: '익일발송', value: DeliveryType.TOMORROW },
  { label: '예외발송', value: DeliveryType.OTHER },
];

// 입점사 배송비 정책
// - Provider Shipping Template 에서 받은 기준
export const ProviderDeliveryPolicy = {
  // 무료
  FREE: 'FREE',
  // 유료
  PAY: 'PAY',
  // 조건부 무료
  IFPAY: 'IFPAY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProviderDeliveryPolicy = ValueOf<typeof ProviderDeliveryPolicy>;

// 묶음배송적용
export const CombineDeliveryOptions = [
  { label: GoodsShippingPolicyLabel.SHOP, value: GoodsShippingPolicy.SHOP },
  { label: GoodsShippingPolicyLabel.GOODS, value: GoodsShippingPolicy.GOODS },
];

// 배송정책
export const DeliveryPolicyOptions = [];

export const MediaUploadVideoOptions: {
  label: string;
  value: VideoPlayType;
}[] = [
  { label: '자동으로 한번만 재생', value: 'ONCE' },
  { label: '자동으로 반복재생', value: 'REPEAT' },
];

// 이미지
export const ImageListSortType = {
  TOP: 'TOP',
  BACK: 'BACK',
  FORWARD: 'FORWARD',
  BOTTOM: 'BOTTOM',
} as const;

export interface ImageListSortHandlerProps {
  (index: number, sortType: ValueOf<typeof ImageListSortType>): void;
}

// 배송방법 기본
export const DeliveryMethodOptions = [
  { label: GoodsShippingMethodLabel.PARCEL, value: GoodsShippingMethod.PARCEL },
  { label: GoodsShippingMethodLabel.DIRECT, value: GoodsShippingMethod.DIRECT },
];

// 배송방법 티켓상품인 경우
export const DeliveryMethodTicketOptions = [
  ...DeliveryMethodOptions,
  { label: GoodsShippingMethodLabel.MOBILE, value: GoodsShippingMethod.MOBILE },
];

// 상품 Multi Upload 타입
export const MediaMultiUploadType = {
  /** 대표 업로드 */
  MAIN: 'MAIN',
  /** 상세 업로드 */
  DETAIL: 'DETAIL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MediaMultiUploadType = ValueOf<typeof MediaMultiUploadType>;

/** Message : Manager & Partner 공통 */
export const CommonDetailMessage = {
  SUCCESS_SAVE_TEMP: '임시저장이 성공하였습니다',
  FAIL_SAVE_TEMP: '임시저장이 실패하였습니다',
  SUCCESS_DELETE_TEMP: '임시저장 리스트 삭제가 성공하였습니다',
  FAIL_DELETE_TEMP: '임시저장 리스트 삭제가 실패하였습니다',
  FAIL_LOAD_TEMP: '임시저장 정보를 불러올 수 없습니다.\r\n다시 시도해 주세요',
  FAIL_LOAD_GOODS: '상품정보를 불러올 수 없습니다.\r\n다시 시도해 주세요',
  VALID_TEMP: {
    REQUIRED_NAME: '임시저장은 상품명이 필수입니다',
  },
  VALID_SUBMIT: {
    INVALID_OPTION_TYPE:
      '옵션사용여부를 "사용함"으로 등록한 옵션은 2개 이상 등록하여야 합니다.\r\n1개의 옵션으로 구성하시려면 "사용안함"으로 등록해 주세요',
    DUPLICATE_TICKET_OPTION: '옵션 리스트 중에 중복되는 티켓이 존재합니다.\r\n다시 한번 확인해 주세요',
  },
  FAIL_VALID: '입력이 잘못된 부분이 있습니다.\r\n다시 한번 확인해 주세요',
};

export const PartnerDetailMessage = {
  VALID_MODIFY: {
    MEMO: '수정사유를 입력해주세요',
  },
};

// 정산방식 타입 Options
export const SettlementKindOptions = [
  { label: SettlementKindTypeLabel.COMMISSION, value: SettlementKindType.COMMISSION },
  { label: SettlementKindTypeLabel.BUYING, value: SettlementKindType.BUYING },
  { label: SettlementKindTypeLabel.DEPOSIT, value: SettlementKindType.DEPOSIT },
];

// 부가세 코드 타입 Options
export const VatCodeOptions = [
  { label: VatCodeTypeLabel.TAXATION, value: VatCodeType.TAXATION },
  { label: VatCodeTypeLabel.TAX_EXEMPTION, value: VatCodeType.TAX_EXEMPTION },
  { label: VatCodeTypeLabel.ZERO_TAX, value: VatCodeType.ZERO_TAX },
  { label: VatCodeTypeLabel.TAX_FREE, value: VatCodeType.TAX_FREE },
];

// 카탈로그 수집 여부
export const FeedConfigType = {
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
  NAVER: 'NAVER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeedConfigType = typeof FeedConfigType[keyof typeof FeedConfigType];

export const FeedConfigTypeLabel: {
  [k in FeedConfigType]: string;
} = {
  FACEBOOK: 'Facebook',
  GOOGLE: 'Google',
  NAVER: 'Naver',
};

// 상품 조회 > 판매 상태 Checkbox
export const FeedConfigTypeOptions = [FeedConfigType.FACEBOOK, FeedConfigType.GOOGLE, FeedConfigType.NAVER];
