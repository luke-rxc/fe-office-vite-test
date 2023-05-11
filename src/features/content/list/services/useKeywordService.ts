import { useQuery } from '@hooks/useQuery';
import { getKeywordCombo } from '../apis';
import { QUERY_KEY } from '../constants';
import { toComboListModel } from '../models';

/**
 * 키워드 콤보리스트 service
 */
export const useKeywordService = () => {
  const { data: keywordComboList = [], isLoading: isLoadingKeywordComboList } = useQuery(
    [QUERY_KEY.KEYWORD_COMBO],
    getKeywordCombo,
    {
      select: (data) => {
        return toComboListModel(data.items);
      },
    },
  );

  return {
    keywordComboList,
    isLoadingKeywordComboList,
  };
};
