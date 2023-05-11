export enum BusinessType {
  CORPORATE = 'CORPORATE',
  INDIVISUAL = 'INDIVISUAL',
  PRIVATE = 'PRIVATE',
}

export interface BrandSchema {
  id: number;
  name: string;
}

/**
 * 입점사 schema (임시, 추후 제거 예정)
 */
export interface ProviderSchema {
  id: number;
  name: string;
  brandResponses: Array<BrandSchema>;
  createdDate: number;
  businessType: BusinessType;
  commissionRate: number;
  calculateCount: number;
}
