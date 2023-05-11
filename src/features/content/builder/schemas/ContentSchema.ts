import {
  CONTENT_STATUS,
  CONTENT_TYPE,
  LIVE_CONTENT_TYPE,
  LIVE_OPEN_STATUS,
  LIVE_STATUS,
  DEAL_GOODS_TYPE,
  DEAL_SALE_STATUS,
} from '../constants';

/**
 * 상세 정보
 */
export type ContentSchema = {
  contentName: string; // 컨텐츠 명
  type: CONTENT_TYPE;
  publicEndDate: number;
  publicStartDate: number;
  revisionId: number;
  showroom: ShowroomSchema;
  status: CONTENT_STATUS;
  componentList: ComponentSchema[];
};

/**
 * 쇼룸 정보
 */
export type ShowroomSchema = {
  backgroundColor: string;
  brandId: number;
  brandName: string;
  code: string;
  coverImage: {
    extension: string;
    height: number;
    id: number;
    path: string;
    width: number;
  };
  coverVideo: {
    extension: string;
    fileSize: number;
    height: number;
    id: number;
    path: string;
    width: number;
  };
  description: string;
  id: number;
  keywords: [
    {
      id: number;
      name: string;
    },
  ];
  name: string;
  primaryImage: {
    extension: string;
    height: number;
    id: number;
    path: string;
    width: number;
  };
  providerId: number;
  providerName: string;
  status: CONTENT_STATUS;
  textColor: string;
};

/**
 * 컴포넌트 스키마
 */
export type ComponentSchema = {
  componentGroup: string; // 그룹 정보
  componentType: string; // 컴포넌트 타입 정보
  contents: string; //  디스플레이 구성 정보 (프론트화면 bypass)
  hide: boolean;
  goodsList: GoodsSchema[]; // 상품 정보
  liveList: LiveSchema[]; // 라이브 정보
  sortNumber: number; // 정렬 순서
};

/**
 * 상품 정보
 */
export type GoodsSchema = {
  brandName: string;
  consumerPrice: number; // 판매가
  price: number; // 정가
  displayStartDate: number; // 전시 시작일
  goodsId: number; // 상품번호
  goodsName: string; // 상품명
  providerName: string; // 입점사 명
  salesStartDate: number; // 상품판매 시작일
  salesEndDate: number; // 상품판매 종료일
  salesStatus: DEAL_SALE_STATUS; // 상품 상태
  goodsType: DEAL_GOODS_TYPE; // 상품 타입
  sortNumber: number; // 정렬 순서
  goodsImage: {
    extension: string;
    height: number;
    id: number;
    originalFileName: string;
    path: string;
    width: number;
  };
};

export type GoodsSearchSchema = {
  content: GoodsSchema[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  totalElements: number;
  totalPages: number;
};

/**
 * 라이브 정보
 */
export type LiveSchema = {
  contentsType: LIVE_CONTENT_TYPE; // 컨텐츠 타입
  goodsCount: number;
  goodsName: string; // 상품정보
  id: number;
  liveStartDate: number; // 라이브시작일
  liveStatus: LIVE_STATUS; // 라이브 상태
  openStatus: LIVE_OPEN_STATUS; // 오픈상태
  primaryImage: {
    blurHash: string;
    height: number;
    id: number;
    path: string;
    width: number;
  };
  showRoomName: string; // 쇼룸명
  sortNumber: number;
  title: string; // 컨텐츠 제목
};

/**
 * data submit
 */
export type ContentRequestParams = {
  componentList: ComponentReqSchema[];
};

export type ComponentReqSchema = {
  componentGroup: string; // 컴포넌트 상위그룹명
  componentType: string; // 컴포넌트 타입명
  contents: string; // 디스플레이 컨텐츠
  goodsList: number[]; // 상품 리스트
  liveList: number[]; // 라이브 리스트
  sortNumber: number; // 순서
  hide: boolean; // 컴포넌트 공개 여부
};

/**
 * 미리보기 응답 스키마
 */
export type PreviewResSchema = {
  code: string; // 사용자가 커스텀하게 정의한 컨텐츠 고유 네이밍 ex)nike
  contentsId: number; // 스토리 컨텐츠 고유 id
  uuid: string; // 인증키
  type: CONTENT_TYPE; // 컨텐츠타입
};
