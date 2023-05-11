import { BusinessType } from '@constants/provider';

export interface BrandSchema {
  id: number;
  name: string;
}

/**
 * 입점사 schema
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
