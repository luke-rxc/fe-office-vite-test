import { BrandDetailSchema, ComboSchema } from '../schemas';
import { BrandDetailForm, CreateBrandRequestParams, UpdateBrandRequestParams } from '../types';

/**
 * 브랜드 상세 UI Model
 */
export interface BrandDetailModel extends BrandDetailSchema {
  providerItem: ComboSchema;
  mdItem: ComboSchema;
  amdItem: ComboSchema;
}

/**
 * Convert BrandDetailSchema to UI Model
 */
export const toBrandDetailModel = (data: BrandDetailSchema): BrandDetailModel => {
  const { image, providerId, providerName, md, amd } = data;
  return {
    ...data,
    image: { ...image },
    providerItem: {
      id: providerId,
      name: providerName,
    },
    mdItem: {
      id: md.id,
      name: md.name,
    },
    amdItem: {
      id: amd.id,
      name: amd.name,
    },
  };
};

/**
 * 브랜드 등록 요청 파라미터로 변환
 */
export const toBrandCreateRequestParams = (data: BrandDetailForm): CreateBrandRequestParams => {
  const { name, subName, description, providerItem, primaryImageFileId, mdItem, amdItem, commissionRate } = data;
  return {
    name,
    subName,
    description,
    providerId: providerItem.id,
    ...(primaryImageFileId && { primaryImageFileId: +primaryImageFileId }),
    mdId: mdItem.id,
    amdId: amdItem.id,
    commissionRate,
  };
};

/**
 * 브랜드 수정 파라미터로 변환
 */
export const toBrandUpdateRequestParams = (data: BrandDetailForm): UpdateBrandRequestParams => {
  const { name, subName, description, primaryImageFileId, mdItem, amdItem, commissionRate } = data;
  return {
    name,
    subName,
    description,
    ...(primaryImageFileId && { primaryImageFileId: +primaryImageFileId }),
    mdId: mdItem.id,
    amdId: amdItem.id,
    commissionRate,
  };
};
