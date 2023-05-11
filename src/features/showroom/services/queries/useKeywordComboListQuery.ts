import { UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { getKeywordComboList } from '../../apis';

type UseKeywordComboListQuery = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getKeywordComboList>>,
    ErrorModel,
    Awaited<ReturnType<typeof getKeywordComboList>>['items']
  >,
  'select'
>;

/**
 * 쇼룸 키워드 목록 조회 QueryKey
 */
export const KeywordsComboListQueryKeys = {
  all: [{ scope: 'showroom-combo-keywords' }] as const,
  list: () => [{ ...KeywordsComboListQueryKeys.all[0], entity: 'list' }] as const,
} as const;

/**
 * 쇼룸 키워드 목록 조회 Query
 */
export const useKeywordComboListQuery = (options?: UseKeywordComboListQuery) => {
  return useQuery(KeywordsComboListQueryKeys.list(), getKeywordComboList, {
    select: (data) => data.items,
    ...options,
  });
};
