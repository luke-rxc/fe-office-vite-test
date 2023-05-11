import { baseApiClient } from '@utils/api';

interface createCategoryRootParams {
  isOpen?: boolean;
  name: string;
}

export const createCategoryRoot = (params: createCategoryRootParams) => {
  return baseApiClient.post('/categories', params);
};
