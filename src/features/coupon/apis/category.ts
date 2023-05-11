import { baseApiClient } from '@utils/api';
import { CategorySchema } from '../schemas';

interface RequestParams {
  parentCategoryId?: number;
}

interface CategoryResponse {
  categories: Array<CategorySchema>;
}

export const getCategories = (params?: RequestParams): Promise<CategoryResponse> => {
  return baseApiClient.get<CategoryResponse>(
    `/categories${params?.parentCategoryId ? `/${params.parentCategoryId}/children` : '/root'}`,
    {
      ...params,
      isOpen: true,
    },
  );
};
