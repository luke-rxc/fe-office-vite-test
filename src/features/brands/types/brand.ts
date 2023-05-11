import type { ComboSchema } from '../schemas';

/**
 * 브랜드 모달 Form
 */
export interface BrandDetailForm {
  providerItem: ComboSchema;
  mdItem: ComboSchema;
  amdItem: ComboSchema;
  goodsCnt: number;
  name: string;
  subName: string;
  description: string;
  primaryImageFileId: number | string;
  commissionRate: number;
}

/**
 * 브랜드 생성 요청 파라미터
 */
export interface CreateBrandRequestParams {
  providerId: number;
  name: string;
  subName: string;
  description: string;
  primaryImageFileId?: number;
  mdId: number;
  amdId: number;
  commissionRate: number;
}

/**
 * 브랜드 수정 요청 파라미터
 */
export interface UpdateBrandRequestParams {
  name: string;
  subName: string;
  description: string;
  primaryImageFileId?: number;
  mdId: number;
  amdId: number;
  commissionRate: number;
}
