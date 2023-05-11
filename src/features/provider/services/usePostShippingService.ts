import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { postShipping } from '../apis';
import { QUERY_KEYS } from '../constants';
import { ShippingDetailFieldModel } from '../models';

/**
 * 배송지 등록
 * @returns
 */
export const usePostShippingService = (
  id: number,
): {
  isSuccess: boolean;
  handleRegisterShipping: (formData: ShippingDetailFieldModel) => void;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { isSuccess, mutate } = useMutation((formData: ShippingDetailFieldModel) => postShipping(id, formData), {
    onSuccess: () => {
      client.invalidateQueries(QUERY_KEYS.PROVIDER_SHIPPING_LIST);
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
      hideLoading();
    },
  });

  const handleRegisterShipping = (formData: ShippingDetailFieldModel): void => {
    showLoading();
    mutate(formData);
  };

  return {
    isSuccess,
    handleRegisterShipping,
  };
};
