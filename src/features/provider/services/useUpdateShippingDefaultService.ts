import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { updateShippingDefault } from '../apis';
import { QUERY_KEYS } from '../constants';

/**
 * 기본 배송지 등록
 */
export const useUpdateShippingDefaultService = (
  id: number,
): {
  handleUpdateShippingDefault: (shippingId: number) => void;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { mutate } = useMutation((shippingId: number) => updateShippingDefault(id, shippingId), {
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

  const handleUpdateShippingDefault = (shippingId: number): void => {
    if (!shippingId) {
      toast.error('배송지를 선택 해 주세요.');
      return;
    }
    showLoading();
    mutate(shippingId);
  };

  return {
    handleUpdateShippingDefault,
  };
};
