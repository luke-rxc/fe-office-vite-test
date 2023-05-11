import { baseApiClient } from '@utils/api';
import { ApiDomain } from '../constants';
// import { detailTempListSchemaMocks } from '../__mocks__/detailTempListSchemaMocks';
// import { detailSchemaMocks } from '../__mocks__/detailSchemaMocks';
// import { detailTempListInfoSchemaMocks } from '../__mocks__/detailTempListInfoSchemaMocks';

import {
  TempListSchema,
  TempGoodsInfoResSchema,
  PartnerTempSubmitReqSchema,
  OptSubmitReqParamSchema,
  OptTempReqParamSchema,
  SubmitReqSchema,
  PartnerSubmitReqSchema,
  PartnerModifySubmitReqSchema,
  GoodsInfoResSchema,
  GoodsRequestLogSchema,
} from '../schemas';

interface DeleteTempRequestParams {
  (goodsTemporaryId: number): any;
}

export interface RegisterOptionRequestParams {
  goodsId: number;
  params: OptSubmitReqParamSchema;
}

// 파트너 : 상품 수정 Submit 전 체크
export interface PostPartnerGoodsCheckRequestParams {
  goodsId: number;
  params: PartnerSubmitReqSchema;
}

export interface PutGoodsRequestParams {
  goodsId: number;
  params: SubmitReqSchema;
}

export interface PutPartnerGoodsRequestParams {
  goodsId: number;
  params: PartnerModifySubmitReqSchema;
}

// 임시 저장 등록, 수정
export interface RegisterTempSaveParams {
  goods: SubmitReqSchema;
  goodsOption: OptTempReqParamSchema;
}

// 임시 저장 목록 불러오기
export const getTemporary = (): Promise<TempListSchema[]> => {
  // return Promise.resolve(detailTempListSchemaMocks);
  return baseApiClient.get<TempListSchema[]>(`${ApiDomain.Goods}/temporary`);
};

// 임시 저장 리스트 상세 불러오기
export const getTemporaryList = (tempId: number): Promise<TempGoodsInfoResSchema> => {
  // return Promise.resolve(detailTempListInfoSchemaMocks);
  return baseApiClient.get<TempGoodsInfoResSchema>(`${ApiDomain.Goods}/temporary/${tempId}`);
};

// 임시 저장 등록
export const registerTemporary = (params: RegisterTempSaveParams): Promise<TempListSchema> => {
  return baseApiClient.post<TempListSchema>(`${ApiDomain.Goods}/temporary`, params);
};

// 파트너 : 임시 저장 등록
export const registerPartnerTemporary = (params: PartnerTempSubmitReqSchema): Promise<TempListSchema> => {
  return baseApiClient.post<TempListSchema>(`${ApiDomain.Goods}/temporary`, params);
};

// 임시 저장 삭제
export const deleteTemporary: DeleteTempRequestParams = async (goodsTemporaryId) => {
  return baseApiClient.delete(`${ApiDomain.Goods}/temporary/${goodsTemporaryId}`);
};

// 옵션 등록
export const registerOption = async ({ goodsId, params }: RegisterOptionRequestParams) => {
  return baseApiClient.post(`${ApiDomain.Goods}/${goodsId}/options`, params);
};

// 옵션 수정
export const putOption = async ({ goodsId, params }: RegisterOptionRequestParams) => {
  return baseApiClient.put(`${ApiDomain.Goods}/${goodsId}/options`, params);
};

// 상품 등록
export const registerGoods = async (params: SubmitReqSchema) => {
  return baseApiClient.post(ApiDomain.Goods, params);
};

// 파트너 : 상품 등록
export const registerPartnerGoods = async (params: PartnerSubmitReqSchema) => {
  return baseApiClient.post(ApiDomain.Goods, params);
};

// 파트너 : 상품 수정 Submit 전 체크
export const postPartnerGoodsCheck = async ({
  goodsId,
  params,
}: PostPartnerGoodsCheckRequestParams): Promise<boolean> => {
  return baseApiClient.post(`${ApiDomain.Goods}/${goodsId}/check-inspection-goods`, params);
};

// 상품 수정
export const putGoods = async ({ goodsId, params }: PutGoodsRequestParams) => {
  return baseApiClient.put(`${ApiDomain.Goods}/${goodsId}`, params);
};

// 상품 수정
export const putPartnerGoods = async ({ goodsId, params }: PutPartnerGoodsRequestParams) => {
  return baseApiClient.put(`${ApiDomain.Goods}/${goodsId}`, params);
};

// 상품 목록 가져오기
export const getGoodsDetail = (goodsId: number): Promise<GoodsInfoResSchema> => {
  // return Promise.resolve(detailSchemaMocks);
  return baseApiClient.get<GoodsInfoResSchema>(`${ApiDomain.Goods}/${goodsId}`);
};

// 요청(판매,수정)에 대한 로그 조회
export const getGoodsRequestLog = (goodsId: number): Promise<GoodsRequestLogSchema> => {
  return baseApiClient.get<GoodsRequestLogSchema>(`${ApiDomain.Common}/logs/GOODS/id/${goodsId}`);
};
