import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDiscoverKeywordComboList } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { KeywordComboItemModel, toKeywordComboListModel } from '../models';
import { KeywordComboSchema } from '../schemas';

/**
 * 디스커버 키워드 콤보 리스트 조회 query
 */
export const useDiscoverKeywordComboListQuery = (
  option: UseQueryOptions<KeywordComboSchema, ErrorModel, Array<KeywordComboItemModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getDiscoverKeywordComboList();
  }, []);

  return useQuery(DiscoverCommonQueryKeys.keywordComboList(), queryFn, {
    select: (data) => {
      return toKeywordComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
