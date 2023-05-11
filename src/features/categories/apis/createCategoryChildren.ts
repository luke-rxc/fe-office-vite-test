import { baseApiClient } from '@utils/api';

export interface createCategoryChildrenParams {
  isOpen?: boolean;
  name: string;
}

export const createCategoryChildren = (parentCategoryId: number, params: createCategoryChildrenParams) => {
  return baseApiClient.post(`/categories/${parentCategoryId}/children`, params);
};
