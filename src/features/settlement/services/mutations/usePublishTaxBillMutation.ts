import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postPublishTaxBill, PostPublishTaxBillParams } from '../../apis';

export interface UsePublishTaxBillMutationOptions
  extends UseMutationOptions<unknown, ErrorModel, PostPublishTaxBillParams> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
}

/** 세금계산서발급 Mutation */
export const usePublishTaxBillMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  errorToastMsg,
  displayErrorToast = true,
  successToastMsg,
  displaySuccessToast = true,
  ...options
}: UsePublishTaxBillMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<unknown, ErrorModel, PostPublishTaxBillParams>((params) => postPublishTaxBill(params), {
    onMutate: (...rest) => {
      displaySpinner && showLoading();
      onMutate && onMutate(...rest);
    },
    onSettled: (...rest) => {
      displaySpinner && hideLoading();
      onSettled && onSettled(...rest);
    },
    onError: (error: ErrorModel, ...rest) => {
      displayErrorToast && toast.error(errorToastMsg || error.data.message);
      onError && onError(error, ...rest);
    },
    onSuccess: (...rest) => {
      displaySuccessToast && toast.success(successToastMsg || '세금계산서 발행 요청 완료');
      onSuccess && onSuccess(...rest);
    },
    ...options,
  });
};
