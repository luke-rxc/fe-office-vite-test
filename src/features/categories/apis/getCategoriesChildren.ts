import { baseApiClient } from '@utils/api';
import type { CategoriesSchema } from '../schemas';

interface getCategoriesChildrenParams {
  name?: string;
  openOnly?: boolean;
}

export const getCategoriesChildren = (
  parentCategoryId: number,
  params?: getCategoriesChildrenParams,
): Promise<CategoriesSchema> => {
  return baseApiClient.get<CategoriesSchema, getCategoriesChildrenParams>(
    `/categories/${parentCategoryId}/children`,
    params,
  );
};
