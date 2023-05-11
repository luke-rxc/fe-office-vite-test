import { ComboListSchema } from './ComboSchema';

export interface ProvideListSchema {
  items: ProvideListInfoSchema[];
}

export interface ProvideListInfoSchema extends ComboListSchema {
  account: {
    // 입점사 수수료
    commissionRate: number;
  };
}
