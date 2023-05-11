/**
 * 계정 목록 아이템 스키마
 */
export interface AccountItemSchema {
  createdDate: number;
  email: string;
  id: number;
  isActive: boolean;
  isRoot: boolean;
  name: string;
  partName: string;
  companyName: string;
  providerNames: string[];
}

/**
 * 계정 목록 조회 스키마
 */
export interface AccountListSchema {
  /* ====== 사용하지 않는 응답 값 ====== */
  empty: boolean;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalPages: number;

  /* ====== 사용하는 응답 값 ====== */
  content: AccountItemSchema[];
  totalElements: number;
  number: number;
  size: number;
}

/**
 * 계정 상세 정보 스키마
 */
export interface AccountInfoSchema {
  cellPhone: string;
  companyName: string;
  createdDate: number;
  email: string;
  enabled: boolean;
  id: number;
  lastLoginDate: number;
  name: string;
  otpEnable: boolean;
  partName: string;
  passwordChangeDate: number;
  principalType: 'MANAGER' | 'PARTNER';
  updatedDate: number;
}
