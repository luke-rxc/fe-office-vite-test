import { useQuery } from '@hooks/useQuery';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { ShippingListSchema } from '../schemas';
import { getShippings } from '../apis';
import { toShippingList, ShippingDetailModel } from '../models';
import { QUERY_KEYS } from '../constants';
import { useQueryClient } from 'react-query';

/**
 * 배송지 조회
 * @param {number} id
 */
export const useGetShippingsService = (
  id: number,
): {
  shippingListData: ShippingDetailModel[];
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
  handleGetShippings: () => void;
} => {
  const client = useQueryClient();

  const { data, isError, isSuccess, error } = useQuery<
    ShippingListSchema,
    ErrorModel<ErrorDataModel>,
    ShippingDetailModel[],
    (string | number)[]
  >([QUERY_KEYS.PROVIDER_SHIPPING_LIST, id], () => getShippings(id), {
    select: (data: ShippingListSchema) => toShippingList(data),
  });

  const handleGetShippings = () => {
    client.invalidateQueries([QUERY_KEYS.PROVIDER_SHIPPING_LIST, id]);
  };
  return {
    shippingListData: data,
    isSuccess,
    isError,
    error,
    handleGetShippings,
  };
};
