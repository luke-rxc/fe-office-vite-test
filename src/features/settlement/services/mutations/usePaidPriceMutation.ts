import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postPaidPrice, PostPaidPriceParams } from '../../apis';

export interface UsePaidPriceMutationOptions extends UseMutationOptions<unknown, ErrorModel, PostPaidPriceParams> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
}

/** 정산금지급 Mutation */
export const usePaidPriceMutation = ({
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
}: UsePaidPriceMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<unknown, ErrorModel, PostPaidPriceParams>((params) => postPaidPrice(params), {
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
      displaySuccessToast && toast.success(successToastMsg || '정산금 지급 요청 완료');
      onSuccess && onSuccess(...rest);
    },
    ...options,
  });
};
