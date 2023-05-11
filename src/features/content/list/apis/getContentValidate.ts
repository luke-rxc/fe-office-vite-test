import { baseApiClient } from '@utils/api';
import { CONTENT_VALID_TYPE } from '../constants';

/**
 * 콘텐츠명, 콘텐츠 코드 중복체크
 */
export const getContentValidate = (
  type: CONTENT_VALID_TYPE,
  values: { value: string; contentId: number }, // contentId가 있는 경우, 해당 컨텐츠의 콘텐츠명, 코드를 제외하고  중복체크
): Promise<boolean> => {
  return baseApiClient.get<boolean>(
    `/story/${values.contentId ? `${values.contentId}/` : ''}validate/${type}?value=${values.value}`,
  );
};
