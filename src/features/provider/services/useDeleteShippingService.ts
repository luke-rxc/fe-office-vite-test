import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { deleteShipping } from '../apis';
import { QUERY_KEYS } from '../constants';

/**
 * 배송지 삭제
 * @param {number} id
 */
export const useDeleteShippingService = (
  id: number,
): {
  handleDeleteShipping: (shippingId: number) => void;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { mutate } = useMutation((shippingId: number) => deleteShipping(id, shippingId), {
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

  const handleDeleteShipping = (shippingId: number) => {
    if (!shippingId) {
      toast.error('배송지를 선택 해 주세요.');
      return;
    }
    showLoading();
    mutate(shippingId);
  };

  return {
    handleDeleteShipping,
  };
};
