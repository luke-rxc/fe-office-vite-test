import { useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { getProvider } from '../apis';
import { ProviderDetailModel, toProviderDetail } from '../models';
import { ProviderDetailSchema } from '../schemas';
import { QUERY_KEYS } from '../constants';

/**
 * 입점사 상세 조회
 * @param {number} id
 * @returns
 */
export const useGetProviderService = (
  id: number,
): {
  providerData: ProviderDetailModel;
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { data, isError, isLoading, isSuccess, error, isFetching } = useQuery<
    ProviderDetailSchema,
    ErrorModel<ErrorDataModel>,
    ProviderDetailModel,
    (string | number)[]
  >([QUERY_KEYS.PROVIDER_DETAIL, id], () => getProvider(id), {
    select: (data: ProviderDetailSchema) => toProviderDetail(data),
  });

  useEffect(() => {
    isLoading || isFetching ? showLoading() : hideLoading();
  }, [isLoading, isFetching, showLoading, hideLoading]);

  return {
    providerData: data,
    isSuccess,
    isError,
    error,
  };
};
