import { baseApiClient } from '@utils/api';

export interface updateCategorySortParams {
  sortCategoryIds: Array<number>;
}

export const updateCategorySort = (params: updateCategorySortParams) => {
  return baseApiClient.put('/categories/sort', params);
};
