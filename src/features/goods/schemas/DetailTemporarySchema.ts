import { GoodsInfoResSchema, SubmitReqSchema } from './DetailSchema';
import { OptBaseSchema, OptTempReqParamSchema } from './DetailOptionSchema';

/**
 * 임시저장 리스트 Schema
 */
export interface TempListSchema {
  // 생성 날짜
  createdDate: number;
  // 업데이트 날짜
  updatedDate: number;
  // 상품명
  name: string;
  // id
  id: number;
  /** @todo 사용하지 않는 value 처리 */
  // 상품 데이터
  goodsData: string;
  // 옵션 데이터
  optionData: string;
  // 오피스 사용자 ID
  adminUserId: number;
}

/**
 * 임시저장 상품 조회 Schema
 */
export interface TempGoodsInfoResSchema extends GoodsInfoResSchema {
  optionBases: OptBaseSchema[];
}

/**
 * 파트너 등록, 수정 Schema
 */
export interface PartnerTempSubmitReqSchema {
  goods: SubmitReqSchema;
  goodsOption: OptTempReqParamSchema;
}
