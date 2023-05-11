import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getMainShortcutPublishedList } from '../apis';
import { MainShortcutQueryKeys } from '../constants';
import { MainShortcutModel, toMainShortcutListModel } from '../models';
import { MainShortcutSchema } from '../schemas';

/**
 * 편성 배너 리스트 조회 query
 */
export const useMainShortcutPublishedListQuery = (
  option: UseQueryOptions<Array<MainShortcutSchema>, ErrorModel, Array<MainShortcutModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getMainShortcutPublishedList();
  }, []);

  return useQuery(MainShortcutQueryKeys.bannerPublishedList(), queryFn, {
    select: (data) => toMainShortcutListModel(data),
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
