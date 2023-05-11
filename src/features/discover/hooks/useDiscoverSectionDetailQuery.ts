import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverSection } from '../apis';
import { DiscoverSectionQueryKeys } from '../constants';
import { DiscoverSectionItemModel, toDiscoverSectionItemModel } from '../models';
import { DiscoverSectionItemSchema } from '../schemas';

/**
 * 디스커버 섹션 상세 조회 query
 */
export const useDiscoverSectionDetailQuery = (
  sectionId: string,
  option: UseQueryOptions<DiscoverSectionItemSchema, ErrorModel, DiscoverSectionItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverSectionQueryKeys['detail']>>) => {
      const [{ sectionId }] = queryKey;
      return getDiscoverSection(sectionId);
    },
    [],
  );

  return useQuery(DiscoverSectionQueryKeys.detail(sectionId), queryFn, {
    select: (data) => {
      return toDiscoverSectionItemModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
