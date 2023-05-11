import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { getShippingCountry } from '../apis';
import { QUERY_KEYS } from '../constants';
import { convertShippingCountry, ShippingCountryModel } from '../models';
import { ShippingCountrySchema } from '../schemas';

/**
 * 제주/도서산간 조회
 */
export const useGetShippingCountry = (): {
  addressList: ShippingCountryModel[];
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { data, isError, isLoading, isSuccess, error, isFetching } = useQuery<
    ShippingCountrySchema,
    ErrorModel<ErrorDataModel>,
    ShippingCountryModel[],
    string
  >(QUERY_KEYS.SHIPPING_COUNTRY, getShippingCountry, {
    select: (data: ShippingCountrySchema) => convertShippingCountry(data),
  });

  useEffect(() => {
    isLoading || isFetching ? showLoading() : hideLoading();
  }, [isLoading, isFetching, showLoading, hideLoading]);

  useEffect(() => {
    if (isError && error) {
      const msg = error.data.message;
      toast.error(msg);
    }
  }, [isError, error]);

  return {
    addressList: data,
    isSuccess,
    isError,
    error,
  };
};
