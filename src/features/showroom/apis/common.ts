import { baseApiClient } from '@utils/api';
import { stringifyUrl } from '../utils';
import { ComboListSchema } from '../schemas';

/**
 * 브랜드 콤보 목록 조회 파라미터
 */
export interface GetBrandComboListParams {
  showroomId?: number;
  providerId?: number;
}

/**
 * 브랜드 콤보 목록 조회
 */
export const getBrandComboList = async ({ showroomId: showRoomId, providerId }: GetBrandComboListParams) => {
  if (!showRoomId && !providerId) {
    return await baseApiClient.get<ComboListSchema>(`/common/combo/BRAND`);
  }

  const query = stringifyUrl({ url: '', query: { showRoomId, providerId } });
  return await baseApiClient.get<ComboListSchema>(`/showroom/combo/brand${query}`);
};

/**
 * 입점사 콤보 목록 조회
 */
export const getProviderComboList = async () => {
  return await baseApiClient.get<ComboListSchema>(`/common/combo/PROVIDER_ACTIVE`);
};

/**
 * 키워드 콤보 목록 조회
 */
export const getKeywordComboList = async () => {
  return await baseApiClient.get<ComboListSchema>(`/v1/keyword/combo`);
};
