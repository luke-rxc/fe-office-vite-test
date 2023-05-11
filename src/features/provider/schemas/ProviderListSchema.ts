/*
 * 입접사 리스트
 */
export interface ProviderListSchema {
  content: ProviderSchema[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    page: number;
    size: number;
    sort: string[];
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface ProviderSchema {
  brands: { id: number; name: string }[];
  businessType: string;
  calculateCount: number;
  commissionRate: number;
  createdDate: string;
  id: number;
  name: string;
}
