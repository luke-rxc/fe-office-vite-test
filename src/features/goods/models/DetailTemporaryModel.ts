import { GoodsInfoResModel, toGoodsInfo, toGoodsFormData, toSubmitReqParam } from './DetailModel';
import { TempListSchema, GoodsInfoResSchema, SubmitReqSchema, PartnerTempSubmitReqSchema } from '../schemas';
import { OptBasesModel, toTempOptReqParam } from './DetailOptionModel';
import { StateModel } from './DetailStateModel';

// 임시 저장 List
export type TempListModel = TempListSchema;

// 임시 저장 List Delete
export interface TempListRemoveModel {
  goodsTemporaryId: number;
  listIdx: number;
}

/**
 * 임시 저장 로드 Item Response Model
 */
interface TempGoodsInfoResModel extends GoodsInfoResModel {
  optionBases: OptBasesModel[];
}

/**
 * 임시저장 상세 조회
 */
export const toTempGoodsInfo = (value: GoodsInfoResSchema): TempGoodsInfoResModel => {
  const { providerShippingId } = value;
  return {
    ...toGoodsInfo(value, true),
    providerShippingId: providerShippingId ?? '',
  } as TempGoodsInfoResModel;
};

export const toTempFormData = (value: TempGoodsInfoResModel): Partial<StateModel> => {
  const convertedDetailList = toGoodsFormData(value);
  const { providerInfo, brandInfo } = convertedDetailList;
  const { providerName, brandName, optionBases } = value;

  return {
    ...convertedDetailList,
    optionBases,
    providerInfo: providerName ? providerInfo : null,
    brandInfo: brandName ? brandInfo : null,
  };
};

/**
 * 임시 저장 Request Param (Base)
 */
export const toTempBaseInfoReqParam = (value: Partial<StateModel>): SubmitReqSchema => {
  const requestSubmitParam = toSubmitReqParam(value);
  const { providerShippingId, category1, category2, category3, addCategory1, addCategory2, addCategory3 } = value;
  const categoryId = category3 || category2 || category1 || null;
  const addCategoryId = addCategory3 || addCategory2 || addCategory1 || null;
  const categoryIds = [categoryId, addCategoryId] as number[];

  return {
    ...requestSubmitParam,
    categoryIds,
    primaryCategoryId: categoryId ? +categoryId : null,
    providerShippingId: providerShippingId ? +providerShippingId : null,
  };
};

/**
 * 파트너 등록, 수정 Request Param
 */
export const toPartnerTempSubmitReqParam = (value: Partial<StateModel>): PartnerTempSubmitReqSchema => {
  return {
    goods: toTempBaseInfoReqParam(value),
    goodsOption: toTempOptReqParam(value),
  };
};
