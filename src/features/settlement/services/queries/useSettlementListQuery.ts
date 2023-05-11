import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { SettlementSearchForm } from '../../types';
import { getSettlementList } from '../../apis';
import { toSettlementListParamsModel, toSettlementListModel } from '../../models';

export const SettlementListQueryKeys = {
  all: [{ scope: 'settlement-list' }] as const,
  lists: () => [{ ...SettlementListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: SettlementSearchForm) => [{ ...SettlementListQueryKeys.lists()[0], entity: 'list', params }] as const,
} as const;

/** 정산 목록 Query */
export const useSettlementListQuery = (params: SettlementSearchForm) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof SettlementListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getSettlementList(toSettlementListParamsModel(params));
    },
    [],
  );

  return useQuery(SettlementListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toSettlementListModel(data),
    }),
    onError: (error: ErrorModel) => toast.error(error?.data?.message),
  });
};
