import { baseApiClient } from '@utils/api';
import type { CategoriesSchema } from '../schemas';

export const getCategoriesRoot = (): Promise<CategoriesSchema> => {
  return baseApiClient.get<CategoriesSchema>('/categories/root');
};
