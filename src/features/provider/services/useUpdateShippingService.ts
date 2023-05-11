import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { updateShipping } from '../apis';
import { QUERY_KEYS } from '../constants';
import { ShippingDetailFieldModel } from '../models';

/**
 * 배송지 수정
 * @returns
 */
export const useUpdateShippingService = (
  id: number,
): {
  isSuccess: boolean;
  handleUpdateShipping: (formData: ShippingDetailFieldModel) => void;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { isSuccess, mutate } = useMutation((formData: ShippingDetailFieldModel) => updateShipping(id, formData), {
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

  const handleUpdateShipping = (formData: ShippingDetailFieldModel): void => {
    showLoading();
    mutate(formData);
  };

  return {
    isSuccess,
    handleUpdateShipping,
  };
};
