import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { updateProvider } from '../apis';
import { ProviderDetailFormFieldModel } from '../models';
import { QUERY_KEYS } from '../constants';

/**
 * 입점사 수정
 * @param {number} id
 * @returns
 */
export const useUpdateProviderService = (
  id: number,
): {
  handleUpdateProvider: (formData: ProviderDetailFormFieldModel) => void;
  isSuccess: boolean;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { mutate, isSuccess } = useMutation((data: ProviderDetailFormFieldModel) => updateProvider(id, data), {
    onSuccess: () => {
      client.invalidateQueries(QUERY_KEYS.PROVIDER_DETAIL);
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
      hideLoading();
    },
  });

  const handleUpdateProvider = (formData: ProviderDetailFormFieldModel) => {
    showLoading();
    mutate(formData);
  };

  return {
    handleUpdateProvider,
    isSuccess,
  };
};
