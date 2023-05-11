import { baseApiClient } from '@utils/api';

export interface updateCategoryDetailParams {
  // 공개 여부
  isOpen: boolean;
  // 명칭
  name: string;
}

export const updateCategoryDetail = (categoryId: number, params: updateCategoryDetailParams) => {
  return baseApiClient.put(`/categories/${categoryId}`, params);
};
