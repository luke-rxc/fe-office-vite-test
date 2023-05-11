import { ComboListSchema } from './ComboSchema';

export interface BrandListSchema {
  items: BrandSchema[];
}

export interface BrandSchema extends ComboListSchema {
  account: {
    // 입점사 수수료
    commissionRate: number;
  };
}
