export interface PaginationResponse<T> {
  content: T[];

  last: boolean;
  first: boolean;

  totalPages: number;
  totalElements: number;
  numberOfElements: number;

  size: number;
}
