import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { toSectionInfoModel } from '../../models';
import { getSectionInfo, GetSectionInfoParams } from '../../apis';

type UseShowroomQueryOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getSectionInfo>>,
    ErrorModel,
    Awaited<ReturnType<typeof toSectionInfoModel>>
  >,
  'select'
>;

export const SectionInfoQueryKeys = {
  all: [{ scope: 'showroom-section' }] as const,
  item: (params: GetSectionInfoParams) => [{ ...SectionInfoQueryKeys.all[0], params }] as const,
};

/**
 * 섹션 정보 조회 Query
 */
export const useSectionInfoQuery = (params: GetSectionInfoParams, options?: UseShowroomQueryOptions) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof SectionInfoQueryKeys['item']>>) => {
    const [{ params }] = queryKey;
    return getSectionInfo(params);
  }, []);

  return useQuery(SectionInfoQueryKeys.item(params), queryFn, {
    select: toSectionInfoModel,
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
