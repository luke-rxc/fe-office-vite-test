/**
 * 콤보 아이템 Schema
 */
export interface ComboSchema {
  id: number;
  name: string;
}

/**
 * 콤보 리스트 Schema
 */
export interface ComboListSchema {
  items: ComboSchema[];
}

/**
 * 기본 리스트 Schema
 */
export interface BaseListSchema<T> {
  content: T[];
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
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  empty: boolean;
}
