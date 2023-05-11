import { useQuery } from '@hooks/useQuery';
import { getKeywordsCombo } from '../apis';
import { keywordComboListQueryKey } from '../constants';
import { toKeywordComboListModel } from '../models';

/**
 * keyword service
 */
export const useKeywordService = () => {
  const { data: keywordComboList, isLoading: isLoadingKeywordComboList } = useQuery(
    keywordComboListQueryKey,
    getKeywordsCombo,
    {
      select: (data) => toKeywordComboListModel(data.items),
    },
  );

  return {
    keywordComboList,
    isLoadingKeywordComboList,
  };
};
