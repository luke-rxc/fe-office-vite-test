import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { deleteProviders } from '../apis';

/**
 * 입점사 삭제
 */
export const useProviderDeleteService = (): {
  handleProviderDelete: (selectedKeys: number[]) => void;
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { mutate, error, isSuccess, isError } = useMutation((selectedKeys: number[]) => deleteProviders(selectedKeys), {
    onSuccess: () => {
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
      hideLoading();
    },
  });

  const handleProviderDelete = (selectedKeys: number[]): void => {
    showLoading();
    mutate(selectedKeys);
  };

  return {
    handleProviderDelete,
    isSuccess,
    isError,
    error,
  };
};
