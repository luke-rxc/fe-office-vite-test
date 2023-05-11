import { BulkStatusType, BulkType } from '../constants';

/****************************************************************
 * 검색 리스트 Schema
 ****************************************************************/
export interface BulkListSchema {
  /** 수정 번호 */
  id: number;
  /** Upload 타입 : 상품정보, 옵션정보 */
  type: BulkType;
  /** Upload 타입 한글 */
  typeText: string;
  /** 처리 사유 */
  title: string;
  /** 상품 수 */
  goodsCnt: number;
  /** 오피스 유저 네임 */
  adminUserName: string;
  /** 처리 상태 */
  status: BulkStatusType;
  /** 처리 상태 한글 */
  statusText: string;
  /** 등록 일시 */
  createdDate: number;
  /** 반영 일시 */
  updatedDate: number | null;
  /** 예약 일시 */
  reservationDate: number | null;
}

/****************************************************************
 * Base Schema
 * - 기본 일괄 상품 내 스키마
 ****************************************************************/
export interface BulkExportSchema {
  headers: string[];
  list: Record<string, any>[];
}

/****************************************************************
 * Export Schema
 ****************************************************************/
export interface BulkHeaderEntrySchema {
  key: string;
  label: string;
}
export interface BulkHeaderSchema {
  goods: BulkHeaderEntrySchema[];
  goodsMapping: BulkHeaderEntrySchema[];
  option: BulkHeaderEntrySchema[];
}

/****************************************************************
 * 업로드 Schema
 ****************************************************************/
/**
 * 일괄수정 업로드 > 기본 Schema
 */
interface BulkUploadBaseSchema {
  title: string;
  reservationDate: number;
  headers: string[];
}

/**
 * 일괄수정 업로드 > Goods Schema 가 포함된 Request Schema
 */
export interface BulkUploadGoodsRequestSchema extends BulkUploadBaseSchema {
  goods: Record<string, any>[];
}

/**
 * 일괄수정 업로드 > Options Schema 가 포함된 Request Schema
 */
export interface BulkUploadOptionsRequestSchema extends BulkUploadBaseSchema {
  option: Record<string, any>[];
}

/**
 * 일괄수정 업로드시 오류 Schema (ErrorModel 조합)
 */
export interface BulkUploadErrorSchema {
  messages: {
    goodsId?: number;
    optionId?: number;
    message: string;
  }[];
  goodsBulkUpdateId: null;
  goodsCnt: null;
  status: null;
}

/****************************************************************
 * 수정 내역 상세 Schema
 ****************************************************************/
export interface BulkDetailSchema {
  goods: Record<string, any>[];
  option: Record<string, any>[];
  headers: string[];
}
