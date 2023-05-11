import { GoodsKind, GoodsKindLabel } from '@constants/goods';

// Query Key
export const QueryKey = {
  List: {
    SearchKey: 'goodsList/search',
    AllSearchKey: 'goodsList/allSearch',
  },
  Detail: {
    TemporaryList: 'goodsDetail/temporaryList',
    TempListItem: 'goodsDetail/temporaryListItem',
    DeliveryTime: 'goodsDetail/deliveryTime',
    Notice: 'goodsDetail/notice',
    ListItem: 'goodsDetail/listItem',
    /** 판매/수정요청에 대한 처리 로그 */
    RequestLog: 'goodsDetail/requestLog',
  },
  ProviderList: 'goods/providerList',
  BrandList: 'goods/brandList',
  MDAllList: 'goods/mdList',
  KeywordList: 'goods/keywordList',
  ManagerList: 'goods/managerList',
  TicketNormalList: 'goods/ticketNormalList',
  TicketAgentGroupList: 'goods/ticketAgentGroupList',
  TicketAgentList: 'goods/ticketAgentList',
  TicketAgentGoodsList: 'goods/TicketAgentGoodsList',
  /** 일괄상품 Header 조회 */
  BulkHeader: 'goodsList/bulkHeader',
  /** 일괄상품 목록 조회 */
  BulkList: 'goods/bulkList',
  /** 일괄상품 상세 조회 */
  BulkDetail: 'goods/bulkDetail',
  /** 상품 검수 */
  SaleRequest: 'goods/saleRequest',
  SaleRequestOption: 'goods/saleRequestOption',
  /** 컨텐츠 대표, 상세 */
  Content: 'goods/content',
} as const;

/** Success, Error 시 Dialog Label */
export const DialogFeedbackLabel = {
  // 판매승인요청
  SALE: '승인',
  APPROVAL: '승인',
  REJECT: '반려',
  CREATE_GOODS: '상품등록',
  MODIFY_GOODS: '상품수정',
  CREATE_OPTION: '옵션등록',
  MODIFY_OPTION: '옵션수정',
  MODIFY_CHECK: '수정항목체크',
  LOAD_TEMP_GOODS: '임시저장로드',
  LOAD_GOODS: '상품정보로드',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DialogFeedbackLabel = typeof DialogFeedbackLabel[keyof typeof DialogFeedbackLabel];

// Link
export const GoodsLink = {
  Base: '/goods',
  New: '/goods/new',
};

// API
export const ApiDomain = {
  Goods: '/goods',
  Common: '/common',
  CommonCombo: '/common/combo',
  Brands: '/brands',
  Categories: '/categories',
  Provider: '/provider',
  Keyword: '/v1/keyword',
  Tickets: '/tickets',
  Bulk: '/goods/bulk-update',
  SaleRequest: '/goods-request',
};

// Page Type
export const PageType = {
  CREATE: 'CREATE',
  MODIFY: 'MODIFY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PageType = ValueOf<typeof PageType>;

export const Naming: {
  [key: string]: {
    [k in PageType]: string;
  };
} = {
  PRODUCT: {
    CREATE: '상품등록',
    MODIFY: '상품수정',
  },
  OPTION: {
    CREATE: '옵션등록',
    MODIFY: '옵션수정',
  },
};

// 상품 유형
export const GoodsType = {
  NORMAL: 'NORMAL',
  PREORDER: 'PREORDER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsType = ValueOf<typeof GoodsType>;

export const GoodsTypeLabel: {
  [k in GoodsType]: string;
} = {
  NORMAL: '일반상품',
  PREORDER: '프리오더',
};

// 상품 등록, 수정 > 상품 유형 Radio
export const GoodsTypeOptions = [
  { label: GoodsTypeLabel.NORMAL, value: GoodsType.NORMAL },
  { label: GoodsTypeLabel.PREORDER, value: GoodsType.PREORDER },
];

// 상품 조회 > 상품 유형 Checkbox
export const GoodsTypeCbOptions = [GoodsType.NORMAL, GoodsType.PREORDER];

// 상품분류 Radio
/** @todo refactoring */
export const GoodsKindOptions = [
  { label: GoodsKindLabel.REAL, value: GoodsKind.REAL },
  { label: GoodsKindLabel.TICKET_AGENT, value: GoodsKind.TICKET_AGENT },
  { label: GoodsKindLabel.TICKET_NORMAL, value: GoodsKind.TICKET_NORMAL },
];

// 1인 최대 구매수량
// 판매상태 설정 Radio
export const MaxPurchaseLimit = {
  UNLIMIT: 'UNLIMIT',
  LIMIT: 'LIMIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MaxPurchaseLimit = ValueOf<typeof MaxPurchaseLimit>;

export const MaxPurchaseLimitOptions = [
  { label: '제한없음', value: MaxPurchaseLimit.UNLIMIT },
  { label: '제한있음', value: MaxPurchaseLimit.LIMIT },
];

// Page Load Status
/**
 * Initialize
 */
export const PageLoadStatus = {
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PageLoadStatus = ValueOf<typeof PageLoadStatus>;

// 검색 Sort Type
export const SearchSort = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

/**
 * 파트너 상품 검수 승인 상태
 */
export const GoodsRequestStatus = {
  STANDBY: 'STANDBY',
  SALE_REQUEST: 'SALE_REQUEST',
  SALE_REJECT: 'SALE_REJECT',
  CHANGE_REQUEST: 'CHANGE_REQUEST',
  CHANGE_REJECT: 'CHANGE_REJECT',
  // 반려 : 리스트 검색시 사용
  REJECT: 'REJECT',
  APPROVAL: 'APPROVAL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsRequestStatus = typeof GoodsRequestStatus[keyof typeof GoodsRequestStatus];

export const GoodsRequestStatusLabel: {
  [k in GoodsRequestStatus]: string;
} = {
  STANDBY: '대기',
  SALE_REQUEST: '승인요청',
  SALE_REJECT: '판매반려',
  CHANGE_REQUEST: '수정요청',
  CHANGE_REJECT: '수정반려',
  REJECT: '반려',
  APPROVAL: '승인완료',
};
