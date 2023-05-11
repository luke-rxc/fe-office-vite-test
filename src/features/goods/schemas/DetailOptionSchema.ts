/**
 * 상품등록/수정/임시저장 내 옵션 등록, 수정 optionTitle
 */
export interface OptTitleReqSchema {
  title1: string;
  title2?: string;
  title3?: string;
}

/**
 * 옵션 기본 공통 Schema (Option1, 2, 3 제외)
 */
export interface OptListCommonSchema {
  consumerPrice: number;
  price: number;
  stock: number;
  commissionRate: number;
  // 티켓 숙박권_날짜 지정 (BOOKING_DATED)
  bookingDate?: number | null;
  // 티켓 상품일 경우
  depositPrice?: number | null;
}

/**
 * 상품등록/수정/임시저장 내 옵션 등록, 수정 optionValues
 */
export interface OptListReqSchema extends OptListCommonSchema {
  option1?: string;
  option2?: string;
  option3?: string;
  // 티켓 ID
  ticketGoodsId?: number | string | null;
}

export interface OptSubmitReqParamSchema {
  optionTitle: OptTitleReqSchema;
  optionValues: OptListReqSchema[];
}

export interface OptTempReqParamSchema extends OptSubmitReqParamSchema {
  optionBases: OptBaseSchema[];
}

interface OptGroupSchema {
  title1: string;
  title2: string;
  title3: string;
  option1: string;
  option2: string;
  option3: string;
}

/** Response > option ticket 정보 */
interface OptTicketSchema {
  consumerPrice: number;
  price: number;
  id: number;
  name: string;
}
export interface OptListSchema extends OptListCommonSchema {
  id: number;
  goodsId: number;
  sortNumber: number;
  optionGroup: OptGroupSchema;
  ticketGoods?: OptTicketSchema;
}

export interface OptBaseSchema {
  title: string;
  value: string;
}
