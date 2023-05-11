import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { ProviderSettlementSearchForm } from '../../types';
import { getProviderSettlementList } from '../../apis';
import { toProviderSettlementListParamsModel, toProviderSettlementListModel } from '../../models';

export const ProviderSettlementListQueryKeys = {
  all: [{ scope: 'provider-settlement-list' }] as const,
  lists: () => [{ ...ProviderSettlementListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: ProviderSettlementSearchForm) =>
    [{ ...ProviderSettlementListQueryKeys.lists()[0], entity: 'list', params }] as const,
} as const;

/** 입점사별 정산 목록 Query */
export const useProviderSettlementListQuery = (params: ProviderSettlementSearchForm) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof ProviderSettlementListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getProviderSettlementList(toProviderSettlementListParamsModel(params));
    },
    [],
  );

  return useQuery(ProviderSettlementListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toProviderSettlementListModel(data),
    }),
    onError: (error: ErrorModel) => toast.error(error?.data?.message),
  });
};
