import { baseApiClient } from '@utils/api';
import { GoodsSearchSchema, GoodsSchema, GoodsStatusSchema, GoodsValidationSchema } from '../schemas';

/**
 * 전시상품 목록 조회
 */
export const getGoodsList = async ({ showroomId, sectionId }) => {
  return await baseApiClient.get<GoodsSchema[]>(`/showroom/${showroomId}/section/${sectionId}/goods`);
};

export interface GetGoodsListParams {
  showroomId: number;
  sectionId: number;
}

/**
 * 등록가능 전시상품 목록 조회
 */
export const getAddableGoodsList = async ({ showroomId, page, size, ...params }: GetAddableGoodsListParams) => {
  return await baseApiClient.post<GoodsSearchSchema>(`/showroom/${showroomId}/goods?page=${page}&size=${size}`, params);
};

export interface GetAddableGoodsListParams {
  showroomId: number;
  sectionId?: number;
  page?: number;
  size?: number;
  brandId?: number;
  exceptGoodsIds?: number[];
  keyword?: string;
  myBrand?: boolean;
  providerId?: number;
  searchType?: 'ALL' | 'ID' | 'NAME';
  status?: 'ALL' | 'NORMAL' | 'RUNOUT';
  /**
   * @deprecated
   */
  deleteGoodsIds?: number[];
  /**
   * @deprecated
   */
  addGoodsIds?: number[];
}

/**
 * 등록가능한 상품여부 판단
 */
export const getIsValidAddableGoods = async (params: GetIsValidAddableGoodsPrams) => {
  return await baseApiClient.post<GoodsValidationSchema[]>(`showroom/section/goods`, params);
};

export interface GetIsValidAddableGoodsPrams {
  checkIds: number[];
  localIds: number[];
}

/**
 * 전시상품 목록 수정
 */
export const updateGoodsList = async ({ showroomId, sectionId, ...params }: UpdateGoodsListParams) => {
  return await baseApiClient.put<GoodsStatusSchema[]>(`showroom/${showroomId}/section/${sectionId}`, params);
};

export interface UpdateGoodsListParams {
  showroomId: number;
  sectionId: number;
  contentIds: number[];
}
