import { baseApiClient } from '@utils/api';
import { CategorySchema } from '../schemas';
import { ApiDomain } from '../constants';

export const getCategoryRootInfo = (): Promise<CategorySchema> => {
  // console.log('[getCategoryRootInfo]category Props');
  return baseApiClient.get<CategorySchema>(`${ApiDomain.Categories}/root`, {
    // 공개된 카테고리 정보만 조회
    openOnly: true,
  });
};

export const getCategoryInfo = ({ parentCategoryId }): Promise<CategorySchema> => {
  // console.log('[getCategoryInfo]category Props', parentCategoryId);
  return baseApiClient.get<CategorySchema>(`${ApiDomain.Categories}/${parentCategoryId}/children`, {
    // 공개된 카테고리 정보만 조회
    openOnly: true,
  });
};
