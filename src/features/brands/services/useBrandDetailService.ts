import { useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import useLoading from '@hooks/useLoading';
import { getBrand } from '../apis';
import { toBrandDetailModel } from '../models';

/**
 * 브랜드 상세 정보
 */
export const useBrandDetailService = (brandId: number | null) => {
  const { isLoading, isFetching, isSuccess, isFetched, refetch, data } = useQuery(
    ['brandDetail', brandId],
    () => getBrand(brandId),
    {
      enabled: !!brandId,
      select: (data) => toBrandDetailModel(data),
    },
  );

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    isLoading || isFetching ? showLoading() : hideLoading();
  }, [isLoading, isFetching, showLoading, hideLoading]);

  return {
    isLoading,
    isFetching,
    isSuccess,
    isFetched,
    brandInfoRefetch: refetch,
    brandInfo: data,
  };
};
