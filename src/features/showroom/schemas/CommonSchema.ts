/**
 * 콤보 아이템 스키마
 */
export type ComboSchema = { id: number; name: string };

/**
 * 콤보 목록 스키마
 */
export type ComboListSchema = { items: ComboSchema[] };

/**
 * 이미지 데이터 스키마
 */
export interface ImageSchema {
  id: number;
  path: string;
  width: number;
  height: number;
  extension: string;
  originalFileName: string;
}

/**
 * 미디어 데이터 스키마(for Video)
 */
export interface MediaSchema {
  id: number;
  path: string;
  width: number;
  height: number;
  fileSize: number;
  fileType: 'ETC' | 'IMAGE' | 'VIDEO';
  extension: string;
  originalFileName: string;
  thumbnailImage: ImageSchema;
}

/**
 * 검색 결과 Base Schema
 */
export interface SearchBaseSchema<T> {
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
