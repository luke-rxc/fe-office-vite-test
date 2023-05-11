import { QueryKey, useQuery as useQueryOriginal, UseQueryOptions, UseQueryResult, QueryFunction } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';

export function useQuery<
  TQueryFnData = unknown,
  TError = ErrorModel,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> {
  return useQueryOriginal(queryKey, queryFn, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
}
